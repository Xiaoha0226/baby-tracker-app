import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import axios from 'axios';

export interface ParsedRecord {
  type: string;
  recordTime: string;
  details: Record<string, any>;
  note?: string;
}

@Injectable()
export class AiService {
  private readonly logger = new Logger(AiService.name);
  private readonly apiKey: string;
  private readonly groupId: string;
  private readonly baseUrl = 'https://api.minimax.chat/v1/text/chatcompletion_v2';

  constructor(private configService: ConfigService) {
    this.apiKey = this.configService.get<string>('MINIMAX_API_KEY', '');
    this.groupId = this.configService.get<string>('MINIMAX_GROUP_ID', '');
  }

  async chat(message: string): Promise<{ reply: string }> {
    if (!this.apiKey) {
      return {
        reply: 'AI 服务未配置，请联系管理员设置 MiniMax API Key。',
      };
    }

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'abab6.5s-chat',
          messages: [
            {
              role: 'system',
              content: '你是一个专业的育儿助手，帮助宝妈解答育儿相关的问题。请用简洁、友好的方式回答问题。',
            },
            {
              role: 'user',
              content: message,
            },
          ],
          temperature: 0.7,
          top_p: 0.9,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const content = response.data?.choices?.[0]?.message?.content || '抱歉，我无法理解您的问题。';
      return { reply: content };
    } catch (error: any) {
      this.logger.error('MiniMax API call failed:', error.message);
      return {
        reply: '抱歉，AI 服务暂时不可用，请稍后再试。',
      };
    }
  }

  async parseVoiceText(text: string): Promise<ParsedRecord[]> {
    if (!this.apiKey) {
      this.logger.warn('MiniMax API Key not configured, using fallback parser');
      return this.fallbackParser(text);
    }

    const now = new Date();
    const todayStr = now.toISOString().split('T')[0];
    const currentTimeStr = now.toTimeString().slice(0, 5);

    const systemPrompt = `你是一个专业的育儿记录助手。用户会告诉你宝宝的活动情况，你需要从中提取关键信息并生成结构化的记录。

当前日期是：${todayStr}，当前时间是：${currentTimeStr}

请根据用户的描述，提取以下信息：
1. 记录类型（feeding=喂奶, diaper=换尿布, poop=大便, food=辅食, sleep=睡眠, other=其他）
2. 时间（如果没有提到具体时间，使用当前时间；如果提到"早上"、"下午"等模糊时间，请合理推断）
3. 日期（如果没有提到具体日期，使用今天）
4. 详细信息：
   - 喂奶：amount（毫升数）, side（left/right/both，哪边）
   - 换尿布：wet（是否湿了）, dirty（是否脏了）
   - 大便：consistency（性状，如：正常、稀、硬等）, color（颜色）
   - 辅食：food（食物名称）, amount（量）
   - 睡眠：duration（时长，单位分钟）
   - 其他：description（描述）
5. 备注（如果有其他需要记录的信息）

请以JSON数组格式返回，每条记录包含：type, recordTime(ISO格式), details(对象), note(可选)
只返回JSON数组，不要有其他说明文字。`;

    try {
      const response = await axios.post(
        this.baseUrl,
        {
          model: 'abab6.5s-chat',
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: text },
          ],
          temperature: 0.3,
          top_p: 0.9,
        },
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${this.apiKey}`,
          },
        },
      );

      const content = response.data?.choices?.[0]?.message?.content || '[]';
      
      try {
        const jsonMatch = content.match(/\[[\s\S]*\]/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
        return [];
      } catch (parseError) {
        this.logger.error('Failed to parse AI response:', content);
        return this.fallbackParser(text);
      }
    } catch (error: any) {
      this.logger.error('MiniMax API call failed:', error.message);
      return this.fallbackParser(text);
    }
  }

  private fallbackParser(text: string): ParsedRecord[] {
    const now = new Date();
    const records: ParsedRecord[] = [];

    const patterns = [
      { regex: /(\d+)\s*毫升|(\d+)\s*ml/i, type: 'feeding', extract: (m: RegExpMatchArray) => ({ amount: parseInt(m[1] || m[2]) }) },
      { regex: /喂奶|吃奶|喝奶/, type: 'feeding', extract: () => ({ amount: 0 }) },
      { regex: /换尿布|换尿不湿|换纸尿裤/, type: 'diaper', extract: () => ({ wet: true, dirty: false }) },
      { regex: /拉屎|大便|便便|臭臭/, type: 'poop', extract: () => ({ consistency: '正常' }) },
      { regex: /辅食|吃饭|吃辅食/, type: 'food', extract: () => ({ food: '辅食', amount: '' }) },
      { regex: /睡觉|睡了|入睡/, type: 'sleep', extract: () => ({ duration: 0 }) },
    ];

    for (const pattern of patterns) {
      if (pattern.regex.test(text)) {
        const details = pattern.extract(text.match(pattern.regex)!);
        records.push({
          type: pattern.type,
          recordTime: now.toISOString(),
          details,
        });
      }
    }

    if (records.length === 0) {
      records.push({
        type: 'other',
        recordTime: now.toISOString(),
        details: { description: text },
        note: text,
      });
    }

    return records;
  }

  async analyzeRecords(records: any[]): Promise<{ analysis: string }> {
    if (!records || records.length === 0) {
      return { analysis: '暂无记录数据可供分析。' };
    }

    const recordSummary = records
      .slice(0, 20)
      .map((r) => `${r.type}: ${JSON.stringify(r.details)}`)
      .join('\n');

    const message = `请分析以下宝宝的记录数据，并给出专业的育儿建议：\n\n${recordSummary}`;
    const result = await this.chat(message);
    return { analysis: result.reply };
  }
}

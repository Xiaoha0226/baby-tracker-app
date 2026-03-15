import { Controller, Post, Body, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { AiService, ParsedRecord } from './ai.service';
import { ChatDto } from './dto/chat.dto';

@Controller('ai')
@UseGuards(JwtAuthGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('chat')
  async chat(@Body() chatDto: ChatDto) {
    return this.aiService.chat(chatDto.message);
  }

  @Post('analyze')
  async analyzeText(@Body() body: { text: string }): Promise<ParsedRecord[]> {
    return this.aiService.parseVoiceText(body.text);
  }
}

#!/bin/bash

# 数据初始化脚本
set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
APP_DIR="$(dirname "$SCRIPT_DIR")"
BACKEND_DIR="$APP_DIR/backend"

echo "开始初始化测试数据..."

# 清除现有数据
echo "1. 清除现有数据..."
sqlite3 "$BACKEND_DIR/data/baby-tracker.db" "DELETE FROM records; DELETE FROM users;"
echo "✓ 数据清除完成"

# 获取 token
echo "2. 获取认证令牌..."
LOGIN_RESULT=$(curl -s -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"xiaoha","password":"123456"}')

TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"access_token":"[^"]*"' | cut -d '"' -f 4)

if [ -z "$TOKEN" ]; then
  echo "  登录失败，尝试注册新用户..."
  # 注册新用户
  REGISTER_RESULT=$(curl -s -X POST http://localhost:3000/api/auth/register \
    -H "Content-Type: application/json" \
    -d '{"username":"xiaoha","password":"123456","nickname":"小哈"}')
  
  if echo "$REGISTER_RESULT" | grep -q "success"; then
    echo "  ✓ 测试用户创建成功"
    # 重新登录获取 token
    LOGIN_RESULT=$(curl -s -X POST http://localhost:3000/api/auth/login \
      -H "Content-Type: application/json" \
      -d '{"username":"xiaoha","password":"123456"}')
    
    TOKEN=$(echo "$LOGIN_RESULT" | grep -o '"access_token":"[^"]*"' | cut -d '"' -f 4)
    
    if [ -z "$TOKEN" ]; then
      echo "✗ 获取令牌失败: $LOGIN_RESULT"
      exit 1
    fi
  else
    echo "✗ 注册失败: $REGISTER_RESULT"
    exit 1
  fi
fi

echo "✓ 令牌获取成功"

# 批量创建测试数据
echo "4. 生成近一周测试数据..."

# 生成近7天的日期
today=$(date +"%Y-%m-%d")
days=7

for ((i=days-1; i>=0; i--)); do
  date=$(date -v -"$i"d +"%Y-%m-%d")
  echo "  生成 $date 的数据..."
  
  # 生成喂奶记录 (4次/天)
  feed_times=("08:00" "12:00" "16:00" "20:00")
  feed_amounts=(120 150 130 140)
  
  for j in 0 1 2 3; do
    time=${feed_times[$j]}
    amount=${feed_amounts[$j]}
    record_time="${date}T${time}:00"
    
    curl -s -X POST http://localhost:3000/api/records \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"type":"feeding","recordTime":"'$record_time'","details":{"amount":'$amount'}}'
  done
  
  # 生成换尿布记录 (4次/天)
  diaper_times=("09:00" "13:00" "17:00" "21:00")
  
  for time in "${diaper_times[@]}"; do
    record_time="${date}T${time}:00"
    
    curl -s -X POST http://localhost:3000/api/records \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"type":"diaper","recordTime":"'$record_time'","details":{"wet":true,"dirty":false}}'
  done
  
  # 生成大便记录 (1次/天)
  poop_time="10:00"
  record_time="${date}T${poop_time}:00"
  
  curl -s -X POST http://localhost:3000/api/records \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"type":"poop","recordTime":"'$record_time'","details":{"consistency":"正常"}}'
  
  # 生成辅食记录 (1次/天)
  food_time="11:30"
  record_time="${date}T${food_time}:00"
  
  foods=("苹果泥" "香蕉泥" "胡萝卜泥" "梨泥" "南瓜泥" "土豆泥" "混合蔬菜泥")
  food=${foods[$i]}
  
  curl -s -X POST http://localhost:3000/api/records \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"type":"food","recordTime":"'$record_time'","details":{"food":"'$food'","amount":"适量"}}'
  
  # 生成睡眠记录 (2次/天)
  # 白天睡眠
  sleep_time="14:00"
  record_time="${date}T${sleep_time}:00"
  
  curl -s -X POST http://localhost:3000/api/records \
    -H "Content-Type: application/json" \
    -H "Authorization: Bearer $TOKEN" \
    -d '{"type":"sleep","recordTime":"'$record_time'","details":{"duration":120}}'
  
  # 夜间睡眠 (跨天)
  if [ $i -lt $((days-1)) ]; then
    next_date=$(date -v -"$((i-1))"d +"%Y-%m-%d")
    sleep_time="22:00"
    record_time="${date}T${sleep_time}:00"
    
    curl -s -X POST http://localhost:3000/api/records \
      -H "Content-Type: application/json" \
      -H "Authorization: Bearer $TOKEN" \
      -d '{"type":"sleep","recordTime":"'$record_time'","details":{"duration":540}}'
  fi

done

echo "✓ 测试数据生成完成"

# 验证数据
echo "5. 验证数据..."
RECORDS_COUNT=$(curl -s -X GET "http://localhost:3000/api/records" \
  -H "Authorization: Bearer $TOKEN" | jq '. | length')

echo "✓ 生成的记录总数: $RECORDS_COUNT"
echo "✓ 数据初始化完成!"
echo "\n测试账号:"
echo "  用户名: xiaoha"
echo "  密码: 123456"
echo "\n请访问 http://localhost:5173/ 开始测试"

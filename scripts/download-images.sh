#!/bin/bash

# 图片 URL 列表（按文章中出现的顺序）
IMAGES=(
  "https://pbs.twimg.com/media/HDl2jn9a0AAZkyz.jpg"
  "https://pbs.twimg.com/media/HDlw5ULbEAQOqtJ.jpg"
  "https://pbs.twimg.com/media/HDlvMmubEAIzF-N.jpg"
  "https://pbs.twimg.com/media/HDoImh1bEAU-mMI.jpg"
  "https://pbs.twimg.com/media/HDoKg58bEAAL1bw.jpg"
  "https://pbs.twimg.com/media/HDlwEG1bEAUdmcV.jpg"
  "https://pbs.twimg.com/media/HDlwurvbEAM5ZNu.jpg"
  "https://pbs.twimg.com/media/HDlw1mYbEAY-Bul.jpg"
  "https://pbs.twimg.com/media/HDlxbtkbkAAOse7.jpg"
  "https://pbs.twimg.com/media/HDlwhSjbEAIJSc9.jpg"
  "https://pbs.twimg.com/media/HDlxfEIb0AA2E7l.jpg"
)

# 对应的文件名
NAMES=(
  "skills-cover"
  "skills-types"
  "skills-tips"
  "skills-gotchas"
  "skills-filesystem"
  "skills-railroading"
  "skills-setup"
  "skills-description"
  "skills-memory"
  "skills-scripts1"
  "skills-scripts2"
)

OUTPUT_DIR="/Users/bot/.openclaw/workspace/ai-chronicle/public/images/articles/lessons-from-building-claude-code-skills"

# 清空旧图片
rm -f ${OUTPUT_DIR}/*.jpg

# 下载图片
for i in "${!IMAGES[@]}"; do
  url="${IMAGES[$i]}"
  name="${NAMES[$i]}"
  output="${OUTPUT_DIR}/${name}.jpg"
  
  echo "Downloading ${name}..."
  
  # 获取原始图片（替换为 orig 格式）
  orig_url="${url}?name=orig"
  
  curl -s -o "${output}" "${orig_url}"
  
  # 检查文件大小
  size=$(stat -f%z "${output}" 2>/dev/null || echo "0")
  echo "  Size: ${size} bytes"
done

echo ""
echo "Done! Verifying..."
ls -la ${OUTPUT_DIR}/*.jpg

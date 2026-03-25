import puppeteer from 'puppeteer';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function downloadImages() {
  const browser = await puppeteer.connect({
    browserURL: 'http://127.0.0.1:18899'
  });
  
  const page = await browser.newPage();
  
  // 图片列表（从 Twitter 文章中提取）- 按文章中出现的顺序
  const images = [
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033787061128581120', name: 'skills-cover' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033778969078861826', name: 'skills-types' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033949742137544704', name: 'skills-tips' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033779922590961669', name: 'skills-gotchas' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033780423952896002', name: 'skills-filesystem' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033780654052413443', name: 'skills-railroading' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033780772872851462', name: 'skills-setup' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033780836705964036', name: 'skills-description' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033947639721693189', name: 'skills-memory' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033781427637293056', name: 'skills-scripts1' },
    { url: 'https://x.com/trq212/article/2033949937936085378/media/2033781485233491968', name: 'skills-scripts2' },
  ];
  
  const outputDir = path.join(__dirname, '../public/images/articles/lessons-from-building-claude-code-skills');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  // 先清空旧图片
  const oldFiles = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
  for (const f of oldFiles) {
    fs.unlinkSync(path.join(outputDir, f));
  }
  
  for (const img of images) {
    try {
      console.log(`\n📥 Downloading: ${img.name}`);
      console.log(`   URL: ${img.url}`);
      
      // 访问媒体页面
      await page.goto(img.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      
      // 获取页面中的图片 src
      const imgSrc = await page.evaluate(() => {
        // 尝试多种选择器
        const selectors = [
          'article img',
          'img[src*="pbs.twimg.com"]',
          'img[src*="media"]',
          'img'
        ];
        
        for (const selector of selectors) {
          const img = document.querySelector(selector);
          if (img && img.src && img.src.includes('twimg')) {
            return img.src;
          }
        }
        return null;
      });
      
      if (imgSrc) {
        console.log(`   Found image: ${imgSrc.substring(0, 60)}...`);
        
        // 获取原始图片（替换为 original 格式）
        const originalUrl = imgSrc.replace(/name=\w+/, 'name=orig').replace(/name=orig/, 'name=4096x4096');
        console.log(`   Downloading original: ${originalUrl.substring(0, 60)}...`);
        
        // 下载图片
        const viewSource = await page.goto(originalUrl, { waitUntil: 'networkidle2', timeout: 30000 });
        const buffer = await viewSource.buffer();
        
        // 检查文件大小
        console.log(`   Size: ${buffer.length} bytes`);
        
        const outputPath = path.join(outputDir, `${img.name}.jpg`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`   ✅ Saved: ${outputPath}`);
      } else {
        console.log(`   ❌ No image found on page`);
        
        // 截图调试
        const screenshotPath = path.join(outputDir, `debug-${img.name}.png`);
        await page.screenshot({ path: screenshotPath, fullPage: true });
        console.log(`   📸 Debug screenshot saved: ${screenshotPath}`);
      }
    } catch (err) {
      console.error(`   ❌ Error: ${err.message}`);
    }
  }
  
  await page.close();
  console.log('\n✨ Done!');
  
  // 验证下载的图片
  console.log('\n📊 Verification:');
  const files = fs.readdirSync(outputDir).filter(f => f.endsWith('.jpg'));
  for (const f of files) {
    const stat = fs.statSync(path.join(outputDir, f));
    console.log(`   ${f}: ${stat.size} bytes`);
  }
}

downloadImages().catch(console.error);

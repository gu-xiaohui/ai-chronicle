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
  
  // 图片列表（从 Twitter 文章中提取）
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
  
  const outputDir = path.join(__dirname, '../public/images/articles');
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  for (const img of images) {
    try {
      console.log(`\n📥 Downloading: ${img.name}`);
      await page.goto(img.url, { waitUntil: 'networkidle2', timeout: 30000 });
      await new Promise(r => setTimeout(r, 3000));
      
      // 获取页面中的图片 src
      const imgSrc = await page.evaluate(() => {
        const img = document.querySelector('img');
        return img ? img.src : null;
      });
      
      if (imgSrc) {
        console.log(`  Found: ${imgSrc.substring(0, 80)}...`);
        
        // 下载图片
        const viewSource = await page.goto(imgSrc, { waitUntil: 'networkidle2' });
        const buffer = await viewSource.buffer();
        
        const outputPath = path.join(outputDir, `${img.name}.jpg`);
        fs.writeFileSync(outputPath, buffer);
        console.log(`  ✅ Saved: ${outputPath}`);
      } else {
        console.log(`  ❌ No image found`);
      }
    } catch (err) {
      console.error(`  ❌ Error: ${err.message}`);
    }
  }
  
  await page.close();
  console.log('\n✨ Done!');
}

downloadImages().catch(console.error);

import * as cheerio from 'cheerio';

async function run() {
  const url = 'https://www.freejobalert.com/articles/upsc-recruitment-2026-apply-online-for-450-drug-inspector-assistant-engineer-and-more-posts-3055477';
  try {
    const detailRes = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await detailRes.text();
    const $ = cheerio.load(html);
    
    $('table').each((i, table) => {
      if ($(table).text().includes('Official Website')) {
        console.log(`\n--- TABLE ${i} contains "Official Website" ---`);
        console.log('HTML:');
        console.log($(table).html());
      }
    });
  } catch (e) {
    console.error(e);
  }
}

run();

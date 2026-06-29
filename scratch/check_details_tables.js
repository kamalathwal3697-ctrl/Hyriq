import * as cheerio from 'cheerio';

async function run() {
  const mainUrl = 'https://www.freejobalert.com/government-jobs/';
  console.log('Fetching main list:', mainUrl);
  try {
    const res = await fetch(mainUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const html = await res.text();
    const $ = cheerio.load(html);
    
    let firstJobUrl = '';
    $('table').each((i, table) => {
      const headerRow = $(table).find('tr').first();
      const headers = headerRow.find('th, td').map((idx, el) => $(el).text().trim()).get();
      if (headers.includes('Post Date') && headers.includes('Recruitment Board')) {
        $(table).find('tr').each((rowIdx, row) => {
          if (rowIdx === 0 || firstJobUrl) return;
          const cols = $(row).find('td');
          if (cols.length >= 7) {
            firstJobUrl = $(cols[6]).find('a').attr('href') || $(cols[2]).find('a').attr('href');
          }
        });
      }
    });

    if (!firstJobUrl) {
      console.log('No job URL found on main list.');
      return;
    }

    console.log('Found first job details URL:', firstJobUrl);
    const detailRes = await fetch(firstJobUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    });
    const detailHtml = await detailRes.text();
    const $detail = cheerio.load(detailHtml);
    
    console.log('\n--- DETAIL PAGE TABLES ---');
    $detail('table').each((i, el) => {
      const cls = $detail(el).attr('class') || 'No class';
      const id = $detail(el).attr('id') || 'No id';
      const rows = $detail(el).find('tr').length;
      console.log(`Table ${i}: Class="${cls}", Id="${id}", Rows=${rows}`);
      
      const firstRow = $detail(el).find('tr').first().text().trim().replace(/\s+/g, ' ');
      console.log('  First Row Text:', firstRow.slice(0, 150));
    });

  } catch (e) {
    console.error('Error:', e);
  }
}

run();

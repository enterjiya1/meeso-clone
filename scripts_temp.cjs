const fs = require('fs');

const csvPath = 'C:/Users/DELL/.gemini/antigravity/brain/2ddffb8e-ee86-40a0-8f22-a8fac68646eb/.user_uploaded/media_1790069378276.csv';
const content = fs.readFileSync(csvPath, 'utf8');

function parseCSV(text) {
  const lines = [];
  let row = [];
  let cell = '';
  let inQuotes = false;
  
  for (let i = 0; i < text.length; i++) {
    const char = text[i];
    const nextChar = text[i+1];
    
    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        cell += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      row.push(cell);
      cell = '';
    } else if ((char === '\r' || char === '\n') && !inQuotes) {
      if (char === '\r' && nextChar === '\n') i++;
      row.push(cell);
      cell = '';
      if (row.length > 1 || (row.length === 1 && row[0] !== '')) {
        lines.push(row);
      }
      row = [];
    } else {
      cell += char;
    }
  }
  if (cell || row.length > 0) {
    row.push(cell);
    lines.push(row);
  }
  return lines;
}

const rows = parseCSV(content);
const header = rows[0];
const handleIdx = header.indexOf('Handle');
const titleIdx = header.indexOf('Title');
const bodyIdx = header.indexOf('Body (HTML)');
const typeIdx = header.indexOf('Type');
const tagsIdx = header.indexOf('Tags');
const opt1NameIdx = header.indexOf('Option1 Name');
const opt1ValIdx = header.indexOf('Option1 Value');
const priceIdx = header.indexOf('Variant Price');
const comparePriceIdx = header.indexOf('Variant Compare At Price');
const imageSrcIdx = header.indexOf('Image Src');
const imagePosIdx = header.indexOf('Image Position');

console.log('Total rows:', rows.length);

const productsMap = new Map();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const handle = r[handleIdx];
  if (!handle) continue;
  
  if (!productsMap.has(handle)) {
    productsMap.set(handle, {
      handle,
      title: r[titleIdx] || '',
      bodyHtml: r[bodyIdx] || '',
      type: r[typeIdx] || '',
      tags: r[tagsIdx] || '',
      sizes: new Set(),
      images: [],
      variantPrice: r[priceIdx] || '',
      comparePrice: r[comparePriceIdx] || ''
    });
  }
  
  const prod = productsMap.get(handle);
  if (r[titleIdx] && !prod.title) prod.title = r[titleIdx];
  if (r[bodyIdx] && !prod.bodyHtml) prod.bodyHtml = r[bodyIdx];
  if (r[typeIdx] && !prod.type) prod.type = r[typeIdx];
  
  const optVal = r[opt1ValIdx];
  if (optVal && optVal.trim() && optVal.toLowerCase() !== 'default title') {
    prod.sizes.add(optVal.trim());
  }
  
  const img = r[imageSrcIdx];
  if (img && img.trim() && !prod.images.includes(img.trim())) {
    prod.images.push(img.trim());
  }
}

console.log('Total products count:', productsMap.size);
for (const [handle, p] of productsMap.entries()) {
  console.log(`${handle} | images: ${p.images.length} | sizes: ${p.sizes.size} | title: ${p.title}`);
}

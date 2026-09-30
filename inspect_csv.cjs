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
const opt2NameIdx = header.indexOf('Option2 Name');
const opt2ValIdx = header.indexOf('Option2 Value');
const priceIdx = header.indexOf('Variant Price');
const comparePriceIdx = header.indexOf('Variant Compare At Price');
const imageSrcIdx = header.indexOf('Image Src');
const imagePosIdx = header.indexOf('Image Position');
const imageAltIdx = header.indexOf('Image Alt Text');
const fabricIdx = header.indexOf('Fabric (product.metafields.shopify.fabric)');
const colorIdx = header.indexOf('Color (product.metafields.shopify.color-pattern)');

console.log('Columns indices:', { handleIdx, titleIdx, bodyIdx, typeIdx, tagsIdx, fabricIdx, colorIdx });

const productsMap = new Map();

for (let i = 1; i < rows.length; i++) {
  const r = rows[i];
  const handle = r[handleIdx] ? r[handleIdx].trim() : '';
  if (!handle) continue;
  
  if (!productsMap.has(handle)) {
    productsMap.set(handle, {
      handle,
      title: r[titleIdx] ? r[titleIdx].trim() : '',
      bodyHtml: r[bodyIdx] ? r[bodyIdx].trim() : '',
      type: r[typeIdx] ? r[typeIdx].trim() : '',
      tags: r[tagsIdx] ? r[tagsIdx].trim() : '',
      fabric: r[fabricIdx] ? r[fabricIdx].trim() : '',
      color: r[colorIdx] ? r[colorIdx].trim() : '',
      sizes: [],
      images: [],
      rawPrices: [],
      rawComparePrices: []
    });
  }
  
  const prod = productsMap.get(handle);
  if (r[titleIdx] && !prod.title) prod.title = r[titleIdx].trim();
  if (r[bodyIdx] && !prod.bodyHtml) prod.bodyHtml = r[bodyIdx].trim();
  if (r[typeIdx] && !prod.type) prod.type = r[typeIdx].trim();
  if (r[fabricIdx] && !prod.fabric) prod.fabric = r[fabricIdx].trim();
  if (r[colorIdx] && !prod.color) prod.color = r[colorIdx].trim();
  
  const optVal = r[opt1ValIdx] ? r[opt1ValIdx].trim() : '';
  if (optVal && !prod.sizes.includes(optVal)) {
    prod.sizes.push(optVal);
  }
  
  const pr = r[priceIdx] ? parseFloat(r[priceIdx]) : null;
  if (pr && !isNaN(pr)) prod.rawPrices.push(pr);
  
  const cpr = r[comparePriceIdx] ? parseFloat(r[comparePriceIdx]) : null;
  if (cpr && !isNaN(cpr)) prod.rawComparePrices.push(cpr);
  
  const img = r[imageSrcIdx] ? r[imageSrcIdx].trim() : '';
  if (img && !prod.images.includes(img)) {
    prod.images.push(img);
  }
}

console.log('Total unique products:', productsMap.size);

let withImages = 0;
let totalImages = 0;
for (const [h, p] of productsMap.entries()) {
  if (p.images.length > 0) withImages++;
  totalImages += p.images.length;
}
console.log(`Products with images: ${withImages}/${productsMap.size}, total images: ${totalImages}`);


const fs = require('fs');
const path = require('path');

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

function cleanHtml(html) {
  if (!html) return '';
  return html
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '')
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '')
    .replace(/<br\s*\/?>/gi, '\n')
    .replace(/<\/p>/gi, '\n')
    .replace(/<[^>]+>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/\s+/g, ' ')
    .trim();
}

function extractDetail(text, regex, defaultVal) {
  if (!text) return defaultVal;
  const match = text.match(regex);
  if (match && match[1]) {
    return match[1].trim().replace(/^[-:]\s*/, '').trim();
  }
  return defaultVal;
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
const fabricIdx = header.indexOf('Fabric (product.metafields.shopify.fabric)');
const colorIdx = header.indexOf('Color (product.metafields.shopify.color-pattern)');

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
  if (optVal && !prod.sizes.includes(optVal) && optVal.toLowerCase() !== 'default title') {
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

const wholesalePrices = [499];
const mrpList = [3499, 3999, 4499, 4999, 5499, 5850];

const products = [];
let idCounter = 1;

for (const [handle, raw] of productsMap.entries()) {
  // If product has no images, skip or ignore
  if (!raw.images || raw.images.length === 0) {
    continue;
  }
  
  const cleanDesc = cleanHtml(raw.bodyHtml);
  
  // Fabric extraction
  let fabric = raw.fabric;
  if (!fabric) {
    fabric = extractDetail(cleanDesc, /(?:Fabric|Material)\s*[:\-]\s*([^\n\.,]+)/i, '');
  }
  if (!fabric) {
    if (/organza/i.test(raw.title) || /organza/i.test(cleanDesc)) fabric = 'Pure Organza Silk';
    else if (/viscose/i.test(raw.title) || /viscose/i.test(cleanDesc)) fabric = 'Soft Pure Viscose';
    else if (/kota/i.test(raw.title) || /kota/i.test(cleanDesc)) fabric = 'Industrial Kota Chex';
    else if (/tissue/i.test(raw.title) || /tissue/i.test(cleanDesc)) fabric = 'Designer Soft Semi Tissue';
    else if (/chinnon/i.test(raw.title) || /chinnon/i.test(cleanDesc)) fabric = 'Premium Crushed Chinnon';
    else if (/banarasi/i.test(raw.title) || /banarasi/i.test(cleanDesc)) fabric = 'Banarasi Silk';
    else if (/patola/i.test(raw.title) || /patola/i.test(cleanDesc)) fabric = 'Pure Patola Silk';
    else if (/georgette/i.test(raw.title) || /georgette/i.test(cleanDesc)) fabric = 'Pure Georgette';
    else fabric = 'Premium Handloom Silk Blend';
  }
  
  // Work extraction
  let work = extractDetail(cleanDesc, /(?:Work|Embellishment|Design)\s*[:\-]\s*([^\n\.,]+)/i, '');
  if (!work) {
    if (/embroidery|embroidered/i.test(raw.title) || /embroidery/i.test(cleanDesc)) work = 'Heavy Coded Zari Embroidery';
    else if (/sequin/i.test(raw.title) || /sequin/i.test(cleanDesc)) work = 'Minimal Contemporary Sequins Work';
    else if (/handwork/i.test(raw.title) || /handwork/i.test(cleanDesc)) work = 'Artisanal Handwork & Moti';
    else if (/zari/i.test(raw.title) || /zari/i.test(cleanDesc)) work = 'Intricate Zari Weave';
    else if (/pearl/i.test(raw.title) || /pearl/i.test(cleanDesc)) work = 'Handcrafted Pearl & Cutdana Work';
    else work = 'Designer Weaving & Thread Embroidery';
  }
  
  // Blouse extraction
  let blouse = extractDetail(cleanDesc, /(?:Blouse)\s*[:\-]\s*([^\n\.,]+)/i, '');
  if (!blouse) {
    blouse = `${fabric} with matching border & embroidery (0.8m unstitched)`;
  }
  
  // Category determination
  let category = raw.type;
  if (!category || category.toLowerCase() === 'default') {
    if (/kota/i.test(raw.title)) category = 'Kota Saree';
    else if (/organza/i.test(raw.title)) category = 'Organza Saree';
    else if (/tissue/i.test(raw.title)) category = 'Tissue Saree';
    else if (/viscose/i.test(raw.title)) category = 'Viscose Saree';
    else if (/chinnon/i.test(raw.title)) category = 'Chinnon Saree';
    else if (/banarasi/i.test(raw.title)) category = 'Banarasi Saree';
    else if (/silk/i.test(raw.title)) category = 'Silk Saree';
    else if (/patola/i.test(raw.title)) category = 'Patola Saree';
    else category = 'Designer Saree';
  }

  // Price & MRP
  const price = wholesalePrices[(idCounter - 1) % wholesalePrices.length];
  const mrp = mrpList[(idCounter - 1) % mrpList.length];
  const discount = Math.round(((mrp - price) / mrp) * 100);
  // Sizes formatting
  let sizeOptions = [];
  if (raw.sizes && raw.sizes.length > 0) {
    sizeOptions = raw.sizes.map(s => ({ size: s, price }));
  } else {
    sizeOptions = [
      { size: "Unstitched Blouse", price },
      { size: "32- Non padded", price },
      { size: "34- Non padded", price },
      { size: "36- Non padded", price },
      { size: "38- Non padded", price }
    ];
  }
  
  const rating = Number((4.2 + ((idCounter * 7) % 6) * 0.1).toFixed(1));
  const reviewsCount = 450 + ((idCounter * 313) % 4200);
  
  const desc = cleanDesc || `${raw.title} crafted in premium ${fabric}. Exquisite ${work} that brings out timeless Indian elegance. Comes with ${blouse}. Perfect for weddings, festive occasions, and parties.`;
  
  products.push({
    id: idCounter,
    handle: raw.handle,
    isAd: idCounter % 6 === 1,
    name: raw.title,
    listingTitle: raw.title.length > 32 ? raw.title.substring(0, 32) + "..." : raw.title,
    category,
    price,
    mrp,
    discount,
    rating,
    reviewsCount,
    hasUpi: true,
    seller: "HAFSAAD ETHNIC WEAVES",
    sellerRating: 4.5,
    sellerFollowers: "42.5k",
    image: raw.images[0],
    detailImage: raw.images[0],
    galleryImages: raw.images,
    similarProducts: [], // will fill below
    sizes: sizeOptions,
    highlights: {
      "Fabric": fabric,
      "Work": work,
      "Blouse": blouse,
      "Shipping": "Free Delivery in 2-3 Days",
      "Care": "Dry clean only"
    },
    description: desc,
    reviews: [
      {
        id: `r_${idCounter}_1`,
        userName: ["Pooja Sharma", "Ananya Deshmukh", "Sneha Patel", "Ritu Agarwal", "Kavita Verma"][(idCounter) % 5],
        rating: 5,
        date: "14 Sep 2026",
        comment: "Fabric quality is beyond expectations! Color is gorgeous and saree fall is very smooth."
      },
      {
        id: `r_${idCounter}_2`,
        userName: ["Priyanka Joshi", "Meera Nair", "Swati Kulkarni", "Neha Gupta", "Divya Menon"][(idCounter + 2) % 5],
        rating: 5,
        date: "10 Sep 2026",
        comment: "Delivered in 3 days. Exact same as shown in photos. Blouse work is very neat."
      }
    ]
  });
  
  idCounter++;
}

// Generate similar products links (2 to 4 variants)
for (let i = 0; i < products.length; i++) {
  const current = products[i];
  const sim = [];
  
  // First item is current itself
  sim.push({
    id: current.id,
    color: current.category,
    image: current.galleryImages[0],
    mainImg: current.galleryImages[0],
    price: current.price
  });
  
  // Additional 2-3 similar products from nearby items
  for (let offset = 1; offset <= 3; offset++) {
    const neighborIdx = (i + offset) % products.length;
    const neighbor = products[neighborIdx];
    sim.push({
      id: neighbor.id,
      color: neighbor.name.substring(0, 15),
      image: neighbor.galleryImages[0],
      mainImg: neighbor.galleryImages[0],
      price: neighbor.price
    });
  }
  
  current.similarProducts = sim;
}

const fileContent = `// Comprehensive Saree & Ethnic Wear Catalog populated with ALL products from Shopify CSV export
// Real Shopify CDN image links, wholesale Meeso pricing, sizes/options, and specifications

export const PRODUCTS = ${JSON.stringify(products, null, 2)};
`;

fs.writeFileSync(path.join(__dirname, 'src', 'data', 'products.js'), fileContent, 'utf8');
console.log(`Successfully generated products.js with ${products.length} products!`);
let imgStats = products.map(p => p.galleryImages.length);
let minImg = Math.min(...imgStats);
let maxImg = Math.max(...imgStats);
let avgImg = (imgStats.reduce((a, b) => a + b, 0) / products.length).toFixed(1);
console.log(`Images per product: min=${minImg}, max=${maxImg}, avg=${avgImg}`);

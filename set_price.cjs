const fs = require('fs');
const path = require('path');

const targetPrice = process.argv[2] ? parseInt(process.argv[2], 10) : 10;
console.log(`Setting all product prices to: ₹${targetPrice}`);

// 1. Update src/data/products.js
const productsPath = path.join(__dirname, 'src', 'data', 'products.js');
let productsContent = fs.readFileSync(productsPath, 'utf8');

// Replace "price": <number> with targetPrice
productsContent = productsContent.replace(/"price":\s*\d+/g, `"price": ${targetPrice}`);
fs.writeFileSync(productsPath, productsContent, 'utf8');
console.log(`Updated products.js with price: ₹${targetPrice}`);

// 2. Update paymentConfig.js: if targetPrice <= 10, instantUpiDiscount = 0 so user pays exactly targetPrice
const configPath = path.join(__dirname, 'src', 'data', 'paymentConfig.js');
let configContent = fs.readFileSync(configPath, 'utf8');
const discount = targetPrice <= 10 ? 0 : 6;
configContent = configContent.replace(/instantUpiDiscount:\s*\d+,/g, `instantUpiDiscount: ${discount},`);
fs.writeFileSync(configPath, configContent, 'utf8');
console.log(`Updated paymentConfig.js with instantUpiDiscount: ₹${discount}`);

// 3. Update OnlinePaymentModal.jsx default fallbacks
const modalPath = path.join(__dirname, 'src', 'components', 'checkout', 'OnlinePaymentModal.jsx');
let modalContent = fs.readFileSync(modalPath, 'utf8');
modalContent = modalContent.replace(/\|\|\s*499/g, `|| ${targetPrice}`);
modalContent = modalContent.replace(/\|\|\s*10/g, `|| ${targetPrice}`);
fs.writeFileSync(modalPath, modalContent, 'utf8');
console.log(`Updated OnlinePaymentModal.jsx fallbacks to ${targetPrice}`);

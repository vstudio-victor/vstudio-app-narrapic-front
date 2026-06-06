require('dotenv').config();
const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../src/assets/config.template.json');
const configPath = path.join(__dirname, '../src/assets/config.json');

let config = fs.readFileSync(templatePath, 'utf8');

// Replace placeholder with env variable if available
if (process.env.NARRA_PIC_URL) {
  config = config.replace('<YOUR_API_URL_HERE>', process.env.NARRA_PIC_URL);
  config = config.replace('"DEV"', '"PROD"');
  config = config.replace('false', 'true');
}

fs.writeFileSync(configPath, config);
console.log('✅ Config file created.');

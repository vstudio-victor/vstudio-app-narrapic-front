const fs = require('fs');
const path = require('path');

const templatePath = path.join(__dirname, '../src/assets/config/config.template.json');
const configPath = path.join(__dirname, '../src/assets/config/config.json');

if (!fs.existsSync(configPath)) {
  fs.copyFileSync(templatePath, configPath);
  console.log('✅ Config file created. Please update src/assets/config/config.json');
} else {
  console.log('ℹ️  Config file already exists');
}

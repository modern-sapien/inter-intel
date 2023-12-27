const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'interintel.config.js');
const templatePath = path.join(__dirname, 'interintel.config.template.js');

if (!fs.existsSync(configPath)) {
    fs.copyFileSync(templatePath, configPath);
    console.log('Interintel config created. Please update it with your settings.'.yellow);
} else {
    console.log('Interintel config file already exists.'.yellow);
}

const fs = require('fs');
const path = require('path');

const configPath = path.join(process.cwd(), 'interintel.config.js');
const templatePath = path.join(__dirname, 'interintel.config.template.js');

console.log("Current working directory:", process.cwd());

console.log(`Checking for config file at: ${configPath}`);

console.log(fs.existsSync(configPath), "config path exists?")

console.log(`Template file path: ${templatePath}`);

console.log(fs.existsSync(templatePath), "template config path exists?")


try {
    if (!fs.existsSync(configPath)) {
        console.log('Config file does not exist, creating...');
        fs.copyFileSync(templatePath, configPath);
        console.log('Interintel config created. Please update it with your settings.'.yellow);
    } else {
        console.log('Interintel config file already exists.');
    }
} catch (error) {
    console.error('Error occurred during setup:', error);
}
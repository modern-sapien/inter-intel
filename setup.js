const fs = require('fs');
const path = require('path');
const colors = require('colors')

const configPath = path.join('../../interintel.config.js');
const templatePath = path.join(__dirname, '../resources/interintel.config.template.js');

const readMePath = path.join('../../interintelReadMe.md');
const readMeTemplate = path.join(__dirname, '../resources/README.md');

try {
    if (!fs.existsSync(configPath)) {
        console.log('Config file does not exist, creating...');
        fs.copyFileSync(templatePath, configPath);
        console.log('Interintel config created. Please update it with your settings.'.yellow);

        console.log('Config file does not exist, creating...');
        fs.copyFileSync(readMeTemplate, readMePath);
        console.log('Interintel readme created. Please update it with your settings.'.yellow);

    } else {
        console.log('Interintel config file already exists.');
    }
} catch (error) {
    console.error('Error occurred during setup:', error);
}

console.log("Finished setup.js script.");
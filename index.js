// index.js
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('cross-fetch'); // Importa el módulo fetch desde cross-fetch
const apiKey = process.env.YOUTUBE_API_KEY;
const MUSTACHE_MAIN_DIR = './main.mustache';

let DATA = {
  name: 'Matias',
  date: new Date().toLocaleDateString('es-ES', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric',
    timeZone: 'Europe/Stockholm',
  }),
};

async function generateReadMe() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC53KeIgcYPozO6SqlN6edbw&key=${apiKey}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        const subscriberCount = data.items[0].statistics.subscriberCount;
        DATA.subscriberCount = subscriberCount;
    } else {
        DATA.subscriberCount = "test"
    }

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();

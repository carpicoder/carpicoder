// index.js
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('cross-fetch');
const youtubeApiKey = process.env.YOUTUBE_API_KEY;
const youruteUserId = process.env.YOUTUBE_USER_ID;
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
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youruteUserId}&key=${youtubeApiKey}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        DATA.subscriberCount = data.items[0].statistics.subscriberCount;
        DATA.videoCount = data.items[0].statistics.videoCount;
        DATA.viewCount = data.items[0].statistics.viewCount;
    } else {
        DATA.subscriberCount = "+13K";
        DATA.videoCount = "+120";
        DATA.viewCount = "+700k";
    }

    fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
        if (err) throw err;
        const output = Mustache.render(data.toString(), DATA);
        fs.writeFileSync('README.md', output);
    });
}

generateReadMe();

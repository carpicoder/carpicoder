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



let SI_SYMBOL = ["", "K", "M", "G", "T", "P", "E"];

function abbreviateNumber(number){

    // what tier? (determines SI symbol)
    var tier = Math.log10(Math.abs(number)) / 3 | 0;

    // if zero, we don't need a suffix
    if(tier == 0) return number;

    // get suffix and determine scale
    var suffix = SI_SYMBOL[tier];
    var scale = Math.pow(10, tier * 3);

    // scale the number
    var scaled = number / scale;

    // format number and add suffix
    return scaled.toFixed(1) + suffix;
}

async function generateReadMe() {
    const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=${youruteUserId}&key=${youtubeApiKey}`);
    const data = await response.json();

    if (data.items && data.items.length > 0) {
        DATA.subscriberCount = data.items[0].statistics.subscriberCount;
        DATA.subscriberCount = abbreviateNumber(data.items[0].statistics.subscriberCount);
        DATA.videoCount = abbreviateNumber(data.items[0].statistics.videoCount);
        DATA.viewCount = abbreviateNumber(data.items[0].statistics.viewCount);
    } else {
        DATA.subscriberCountFull = "13600";
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

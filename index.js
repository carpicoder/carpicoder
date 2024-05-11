// index.js
const Mustache = require('mustache');
const fs = require('fs');
const fetch = require('node-fetch'); // Importa el módulo fetch
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
  // Realiza el fetch utilizando la clave de la API de YouTube y la URL proporcionada
  const response = await fetch(`https://www.googleapis.com/youtube/v3/channels?part=statistics&id=UC53KeIgcYPozO6SqlN6edbw&key=${apiKey}`);
  const data = await response.json();

  // Extrae el número de suscriptores del objeto data obtenido del fetch
  const subscriberCount = data.items[0].statistics.subscriberCount;

  // Agrega el número de suscriptores al objeto DATA
  DATA.subscriberCount = subscriberCount;

  // Renderiza el archivo Mustache y crea el README.md
  fs.readFile(MUSTACHE_MAIN_DIR, (err, data) => {
    if (err) throw err;
    const output = Mustache.render(data.toString(), DATA);
    fs.writeFileSync('README.md', output);
  });
}

generateReadMe();
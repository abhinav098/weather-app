const weatherAPI = require('./weatherAPI');
const fs = require('fs').promises;
require('dotenv');

// Regex for validating city names for presence of digits and special chars
const isValid = (city) => !/[~`!#$%^&*+=\-[\]\\';,/{}|\\":<>?\d]/g.test(city);

module.exports = {
  // Load CSS file
  async fetchCSS(req, res) {
    const cssFile = await fs.readFile(
      `${__dirname}/../public/site.css`,
      { encoding: 'utf8' },
    );

    res.writeHead(200, { 'Content-type': 'text/css' });
    res.end(cssFile);
  },

  async fetchJavaScript(req, res) {
    const jsFile = await fs.readFile(
      `${__dirname}/../public/site.js`,
      { encoding: 'utf8' },
    );

    res.writeHead(200, { 'Content-type': 'text/js' });
    res.end(jsFile);
  },

  // Load Home page
  async home(req, res){
    if (req.method === 'GET') {
      try {
        const contents = await fs.readFile(`${__dirname}/../index.html`);
        res.writeHead(200, { 'Content-Type': 'text/html' }); // sets the header of the response
        res.end(contents);
        return;
      } catch (error) {
        res.writeHead(500);
        res.end(error);
      }
    }
  },

  async fetchSingleCityWeather(req, res){
    if (req.method === 'POST') {
      let body = '';
      // Fetch request body
      req.on('data', async (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const cityName = JSON.parse(body).city;

        // Validate input city name for digits and special chars
        if (!cityName || typeof cityName !== 'string' || cityName.trim().length === 0 || !isValid(cityName)) {
          res.writeHead(400, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({
            message: `Sorry, "${cityName}" is an invalid city, please try another`,
          }));
          return;
        }

        try {
          const data = await weatherAPI.getSingleCity(cityName);

          res.writeHead(200, { 'Content-Type': 'application/json' }); // sets the header of the response
          res.end(JSON.stringify(data));
          return;
        } catch (error) {
          res.writeHead(500, { 'Content-Type': 'application/json' });
          res.end(JSON.stringify({ message: `Sorry, ${cityName} was not found, please try another` }));
        }
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Page not found' }));
    }
  },

  // POST request to fetch multiple cities weather
  async fetchMultipleCitiesWeather (req, res) {
    if (req.method === 'POST') {
      let body = '';
      // Fetch request body
      req.on('data', async (chunk) => {
        body += chunk;
      });

      req.on('end', async () => {
        const cityNames = JSON.parse(body).cities;
        const data = await weatherAPI.getMultipleCities(cityNames);
        res.writeHead(200, { 'Content-Type': 'application/json' }); // sets the header of the response
        res.end(JSON.stringify(data));
      });
    } else {
      res.writeHead(404, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify({ error: 'Page not found' }));
    }
  },
  handleError(req, res) {
    res.writeHead(404, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ error: 'Page not found' }));
  }
}

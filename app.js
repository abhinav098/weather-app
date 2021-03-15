const http = require('http');
const appController = require('./controllers/ApplicationController');

const router = async (req, res) => {
  switch (req.url) {
    case '/': {
      appController.home(req, res);
      break;
    }
    case '/public/site.css': {
      appController.fetchCSS(req, res);
      break;
    }
    case '/public/site.js': {
      appController.fetchJavaScript(req, res);
      break;
    }
    case '/my-weather-app/single-search': {
      appController.fetchSingleCityWeather(req, res);
      break;
    }
    case '/my-weather-app/multiple-search': {
      appController.fetchMultipleCitiesWeather(req, res);
      break;
    }
    default: {
      appController.handleError(req, res);
    }
  }
}


const port = 3000;
const host = 'localhost';
const server = http.createServer(router);
server.listen(port, host, function(){
 console.log(`Server started at port ${port}`); //the server object listens on port 3000
});

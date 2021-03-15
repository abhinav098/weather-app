const axios = require('axios');
const API_KEY = '120a867a716a1e5c0e4ec41be9129b99';

module.exports = {
  async getSingleCityWeather(cityName) {
    const apiUrl = `http://api.openweathermap.org/data/2.5/weather?q=${cityName}&units=imperial&appid=${API_KEY}`;
    const { data } = await axios.get(apiUrl);
    return data;
  },

  async getMultipleCitiesWeather(cities) {
    let _this = this;
    const results = cities.map((city) => _this.getSingleCityWeather(city));
    return await Promise.all(results);
  }
}

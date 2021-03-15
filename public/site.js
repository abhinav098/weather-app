document.addEventListener('DOMContentLoaded', () => {
  // Handler for .ready() called.

  document.querySelector('#city-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const form = e.target;
    const url = form.action;
    let cityName = document.getElementById('city').value;

    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify({city: cityName}),
    });

    const weatherResponse = await response.json();
    let innerHTML;
    if (response.status === 200) {
      document.title = weatherResponse.name;
      innerHTML = `<h2>${weatherResponse.name}, ${weatherResponse.sys && weatherResponse.sys.country}</h2>
        <table align='center'>
          <thead>
            <tr>
              <th>Field</th>
              <th>Description</th>
              <th>Values</th>
            </tr>
          </thead>
          <tbody>
            <tr><td>Main</td><td>City's Main Weather</td><td>${weatherResponse.weather[0].main}</td></tr>
            <tr><td>Description</td><td>A short description of the city's weather</td><td>${weatherResponse.weather[0].description}</td></tr>
            <tr><td>Temp</td><td>The City's current temperature</td><td>${weatherResponse.main.temp} F</td></tr>
            <tr><td>Pressure</td><td>The current air pressure</td><td>${weatherResponse.main.pressure} hPa</td></tr>
            <tr><td>Humidity</td><td>The city's humidity index</td><td>${weatherResponse.main.humidity}%</td></tr>
            <tr><td>Speed</td><td>The city's wind speed</td><td>${weatherResponse.wind.speed} mph NW</td></tr>
          </tbody>
        </table>`;
    } else {
      innerHTML = weatherResponse.message;;
    }

    document.getElementById('single-results').innerHTML = innerHTML;


    return weatherResponse;
  });

  document.querySelector('#cities-form').addEventListener('submit', async (e) => {
    e.preventDefault();

    const form = e.target;
    const url = form.action;
    const selectElement = document.getElementById('cities');
    const selectedValues = Array.from(selectElement.selectedOptions)
      .map((option) => option.value);
    const data = { cities: selectedValues };
    const response = await fetch(url, {
      method: 'POST',
      mode: 'cors',
      cache: 'no-cache',
      credentials: 'same-origin',
      headers: {
        'Content-Type': 'application/json',
      },
      redirect: 'follow',
      referrerPolicy: 'no-referrer',
      body: JSON.stringify(data),
    });
    const weatherInfo = await response.json();
    document.title = 'My Weather App';

    let listData = weatherInfo.map((data) => `<li>${data.name}, ${data.weather[0].main}, ${data.weather[0].description}, ${data.main.temp} F</li>`);

    document.getElementById('multiple-results').innerHTML = `<ol>${listData.join('')}</ol>`;
    return weatherInfo;
  });


});

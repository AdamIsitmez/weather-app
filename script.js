const searchFormEl = document.getElementById('search-form');
const weatherCards = document.querySelectorAll('.weather-card');
const contentEl = document.querySelector('.content');
const searchListEl = document.getElementById('city-list');

const cityList = JSON.parse(localStorage.getItem('cityList')) || [];

async function handleSearch(event) {
    event.preventDefault();

    const searchValue = document.getElementById('search-input').value.trim();

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${searchValue}&appid=e207f047a1e147d76eda55946aef3132&units=metric&cnt=41`);
    const data = await response.json();

    weatherCards.forEach(card => {
        card.innerHTML = '';
    });

    populateWeather(data);

    //add search item to list
    const cityListItem = document.createElement('li');
    searchListEl.appendChild(cityListItem);
    cityListItem.textContent = data.city.name;
    cityListItem.addEventListener('click', handleClick);
    cityList.push(data.city.name);
    localStorage.setItem("cityList", JSON.stringify(cityList));

    contentEl.style.display = "block";
}

function populateWeather(data) {
    let i = 0;
    weatherCards.forEach(card => {

        const dtTxt = data.list[i].dt_txt;
        const dateParts = dtTxt.split(' ')[0].split('-');
        const formattedDate = `${dateParts[2]}/${dateParts[1]}/${dateParts[0]}`;

        const titleDateEl = document.createElement('h2')
        const temp = document.createElement('p');
        const wind = document.createElement('p');
        const humidity = document.createElement('p');
        const icon = document.createElement('img');

        card.appendChild(titleDateEl);
        card.appendChild(icon);
        card.appendChild(temp);
        card.appendChild(wind);
        card.appendChild(humidity);


        if (i === 0) {
            titleDateEl.textContent = `${data.city.name} ${formattedDate}`;
        }
        else {
            titleDateEl.textContent = formattedDate;

        }

        const iconCode = data.list[i].weather[0].icon;
        const iconUrl = `http://openweathermap.org/img/wn/${iconCode}.png`;
        icon.src = iconUrl;

        temp.textContent = "Temp: " + data.list[i].main.temp + "°C";
        wind.textContent = "Wind: " + data.list[i].wind.speed + "MPH";
        humidity.textContent = "Humidity: " + data.list[i].main.humidity + "%";

        if (i != 32) {
            i += 8;
        }
        else {
            i += 7
        }
    });
}

async function handleClick(event) {
    const city = event.target.textContent;

    const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=e207f047a1e147d76eda55946aef3132&units=metric&cnt=41`);
    const data = await response.json();

    weatherCards.forEach(card => {
        card.innerHTML = '';
    });

    populateWeather(data);
    contentEl.style.display = "block";

}

function populateCityList() {
    const cityList = JSON.parse(localStorage.getItem("cityList"));

    if (cityList) {
        cityList.forEach(city => {
            const cityListItem = document.createElement('li');
            searchListEl.appendChild(cityListItem);
            cityListItem.textContent = city;
            cityListItem.addEventListener('click', handleClick);
        })
    }
}

populateCityList();

searchFormEl.addEventListener('submit', handleSearch);
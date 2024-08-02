//
//    The Dark Mode System
//

// helper functions to toggle dark mode
function enableDarkMode() {
	document.body.classList.add('dark-mode');
	localStorage.setItem('theme', 'dark');
}
function disableDarkMode() {
	document.body.classList.remove('dark-mode');
	localStorage.setItem('theme', 'light');
}

// determines a new users dark mode preferences
function detectColorScheme() {
	// default to the light theme
	let theme = 'light';

	// check localStorage for a saved 'theme' variable. if it's there, the user has visited before, so apply the necessary theme choices
	if (localStorage.getItem('theme')) {
		theme = localStorage.getItem('theme');
	}
	// if it's not there, check to see if the user has applied dark mode preferences themselves in the browser
	else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
		theme = 'dark';
	}

	// if there is no preference set, the default of light will be used. apply accordingly
	theme === 'dark' ? enableDarkMode() : disableDarkMode();
}

// run on page load
detectColorScheme();

// add event listener to the dark mode button toggle
document.getElementById('dark-mode-toggle').addEventListener('click', () => {
	// on click, check localStorage for the dark mode value, use to apply the opposite of what's saved
	localStorage.getItem('theme') === 'light' ? enableDarkMode() : disableDarkMode();
});


const faqItems = Array.from(document.querySelectorAll('.cs-faq-item'));
        for (const item of faqItems) {
            const onClick = () => {
            item.classList.toggle('active')
        }
        item.addEventListener('click', onClick)
        }


 var getEdmontonTime = function () {
 document.getElementById("EdmontonTime") .innerHTML = new Date() .toLocaleString("en-US", {timeZone:'America/Edmonton', timeStyle:'medium', hourCycle:'h12' });
}
getEdmontonTime();
setInterval(getEdmontonTime,1000)



	weather.find({
		search: 'New York, USA',
		degreeType: 'F',
	}, onTemp
	);

function onTemp(err, result) {
	let temp = result[0].current.temperature;
	console.log('NYC temperature is ${temp}');
}





































// 		function updateClock() {
// 			const gmtTime = new Date().toUTCString(); ('nl-NL', {timeZone: 'America/Edmonton'});
// 			const cetTime = new Date().toLocaleString('nl-NL', {timeZone: 'Europe/Berlin'});
// 			const estTime = new Date().toLocaleString('nl-NL', {timeZone: 'America/New_York'});
		
// 			document.getElementById('gmt').innerHTML = gmtTime;
// 			document.getElementById('cet').innerHTML = cetTime;
// 			document.getElementById('est').innerHTML = estTime;
// 		}
		
// 		setInterval(updateClock, 1000);    
		
// 		// state
// let currCity = "Edmonton";
// let units = "metric";

// // Selectors
// let city = document.querySelector(".weather__city");
// let datetime = document.querySelector(".weather__datetime");
// let weather__forecast = document.querySelector('.weather__forecast');
// let weather__temperature = document.querySelector(".weather__temperature");
// let weather__icon = document.querySelector(".weather__icon");
// let weather__minmax = document.querySelector(".weather__minmax")
// let weather__realfeel = document.querySelector('.weather__realfeel');
// let weather__humidity = document.querySelector('.weather__humidity');
// let weather__wind = document.querySelector('.weather__wind');
// let weather__pressure = document.querySelector('.weather__pressure');

// // search
// document.querySelector(".weather__search").addEventListener('submit', e => {
//     let search = document.querySelector(".weather__searchform");
//     // prevent default action
//     e.preventDefault();
//     // change current city
//     currCity = search.value;
//     // get weather forecast 
//     getWeather();
//     // clear form
//     search.value = ""
// })

// // units
// document.querySelector(".weather_unit_celsius").addEventListener('click', () => {
//     if(units !== "metric"){
//         // change to metric
//         units = "metric"
//         // get weather forecast 
//         getWeather()
//     }
// })

// document.querySelector(".weather_unit_farenheit").addEventListener('click', () => {
//     if(units !== "imperial"){
//         // change to imperial
//         units = "imperial"
//         // get weather forecast 
//         getWeather()
//     }
// })

// function convertTimeStamp(timestamp, timezone){
//      const convertTimezone = timezone / 3600; // convert seconds to hours 

//     const date = new Date(timestamp * 1000);
    
//     const options = {
//         weekday: "long",
//         day: "numeric",
//         month: "long",
//         year: "numeric",
//         hour: "numeric",
//         minute: "numeric",
//         timeZone: `Etc/GMT${convertTimezone >= 0 ? "-" : "+"}${Math.abs(convertTimezone)}`,
//         hour12: true,
//     }
//     return date.toLocaleString("en-US", options)
   
// }

 

// // convert country code to name
// function convertCountryCode(country){
//     let regionNames = new Intl.DisplayNames(["en"], {type: "region"});
//     return regionNames.of(country)
// }

// function getWeather(){
//     const API_KEY = '64f60853740a1ee3ba20d0fb595c97d5'

// fetch(`https://api.openweathermap.org/data/2.5/weather?q=${currCity}&appid=${API_KEY}&units=${units}`).then(res => res.json()).then(data => {
//     console.log(data)
//     city.innerHTML = `${data.name}, ${convertCountryCode(data.sys.country)}`
//     datetime.innerHTML = convertTimeStamp(data.dt, data.timezone); 
//     weather__forecast.innerHTML = `<p>${data.weather[0].main}`
//     weather__temperature.innerHTML = `${data.main.temp.toFixed()}&#176`
//     weather__icon.innerHTML = `   <img src="http://openweathermap.org/img/wn/${data.weather[0].icon}@4x.png" />`
//     weather__minmax.innerHTML = `<p>Min: ${data.main.temp_min.toFixed()}&#176</p><p>Max: ${data.main.temp_max.toFixed()}&#176</p>`
//     weather__realfeel.innerHTML = `${data.main.feels_like.toFixed()}&#176`
//     weather__humidity.innerHTML = `${data.main.humidity}%`
//     weather__wind.innerHTML = `${data.wind.speed} ${units === "imperial" ? "mph": "m/s"}` 
//     weather__pressure.innerHTML = `${data.main.pressure} hPa`
// })
// }

// document.body.addEventListener('load', getWeather())





const yargs = require('yargs');
const axios = require('axios');
const { darkskyKey } = require('./config/config.json');

const argv = yargs
	.options({
		a: {
			demand: true,
			alias: 'address',
			describe: 'Address to fetch weather for',
			string: true
		}
	})
	.help()
	.alias('help', 'h').argv;

var encodedURL = encodeURIComponent(argv.address);
var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedURL}`;

axios
	.get(geocodeUrl)
	.then(response => {
		if (response.data.status === 'ZERO_RESULTS') {
			throw new Error('Unable to find that address');
		}
		var lat = response.data.results[0].geometry.location.lat;
		var lng = response.data.results[0].geometry.location.lng;
		var weatherUrl = `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lng}`;
		console.log(`Here is the weather for ` + response.data.results[0].formatted_address);
		return axios.get(weatherUrl);
	})
	.then(response => {
		// Color check for Current Temp
		if (response.data.currently.temperature >= '80') {
			var temperature = '\x1b[31m' + response.data.currently.temperature + '\x1b[0m';
			var apparentTemperature = '\x1b[31m' + response.data.currently.apparentTemperature + '\x1b[0m';
		} else if (response.data.currently.temperature > '75' && response.data.currently.temperature < '80') {
			var temperature = '\x1b[33m' + response.data.currently.temperature + '\x1b[0m';
			var apparentTemperature = '\x1b[33m' + response.data.currently.apparentTemperature + '\x1b[0m';
		} else {
			var temperature = '\x1b[32m' + response.data.currently.temperature + '\x1b[0m';
			var apparentTemperature = '\x1b[32m' + response.data.currently.apparentTemperature + '\x1b[0m';
		}
		var weeklyForecast = response.data.daily.summary;
		var tempHigh = '\x1b[31m' + response.data.daily.data[0].temperatureHigh + '\x1b[0m';
		var tempLow = '\x1b[32m' + response.data.daily.data[0].temperatureLow + '\x1b[0m';
		console.log(`It's currently ${temperature}. It feels like ${apparentTemperature}.\nForecast: ${weeklyForecast}`);
		console.log(`Todays\x1b[31m High\x1b[0m|\x1b[32mLow\x1b[0m will be: ${tempHigh} | ${tempLow}`);
	})
	.catch(e => {
		if (e.code === 'ENOTFOUND') {
			console.log('Unable to conect to API servers.');
		} else {
			console.log(e.message);
		}
	});

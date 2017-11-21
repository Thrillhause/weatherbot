const request = require('request');
const { darkskyKey } = require('./../config/config.json');

let getWeather = (lat, lng, callback) => {
	request(
		{
			url: `https://api.darksky.net/forecast/${darkskyKey}/${lat},${lng}`,
			json: true
		},
		(error, response, body) => {
			if (!error && response.statusCode == 200) {
				callback(undefined, {
					temperature: body.currently.temperature,
					apparentTemperature: body.currently.apparentTemperature
				});
			} else {
				callback('Unable to fetch weather');
			}
		}
	);
};

module.exports = {
	getWeather
};

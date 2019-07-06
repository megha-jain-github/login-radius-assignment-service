import { get as _get } from 'lodash';
import baseHandler from '../../../private/base-handler';
import weather from 'weather-js';


// =====================================================================
// ============== Get Weather Information ==============================
// =====================================================================

async function getWeatherInfoHelper({ data, headers, tokenPayload }) {
    const weatherData = await weather.find({ search: data.location, degreeType: data.tempType });
    return weatherData;
}


async function getWeatherInfoHandler(options) {
    return baseHandler(getWeatherInfoHelper, options);
}

export const WeatherDataHandlers = {
    getWeatherInfoHandler,
};

export default WeatherDataHandlers;


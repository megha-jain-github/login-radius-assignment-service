import { get as _get } from 'lodash';
import * as baseCtrl from '../../../private/base-controller';
import WeatherHandlers from '../../handlers/weatherData/weatherDataHandler';

const getWeatherInfo = (req, res, next) => {
    const { body, payload } = req;
    baseCtrl.postAsync(res, next, async (_) => {
        // We can validate the request before sending it to its handler
        const [responseData] = await WeatherHandlers.getWeatherInfoHandler({
            data: body,
            headers: req.customHeaders,
            tokenPayload: payload,
        });
        return { content: responseData };
    });
};

export default getWeatherInfo;
export {
    getWeatherInfo,
};

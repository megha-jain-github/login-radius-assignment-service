import { logError } from 'aob-logger-wrapper';
import MESSAGE_CODES from './log-message-codes';

async function baseHandler(wrapperFunc, options) {
    let data;
    try {
        data = await wrapperFunc(options);
    } catch (err) {
        logError({
            code: MESSAGE_CODES.appResponseErrorCode,
            message: 'Error in handler',
            error: err,
        });
        throw err;
    }
    return data;
}

async function baseHandlerFailFastFunc(failFastFunc, options) {
    try {
        const data = await failFastFunc(options);
        return {
            success: true,
            result: data,
        };
    } catch (err) {
        return {
            success: false,
            error: err,
        };
    }
}

export default baseHandler;
export {
    baseHandler,
    baseHandlerFailFastFunc,
};

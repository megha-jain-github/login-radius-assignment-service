import { get as _get } from 'lodash';
import * as HttpStatus from 'http-status-codes';
import { logError } from 'aob-logger-wrapper';
import MESSAGE_CODES from './log-message-codes';

/* eslint-disable no-unreachable */
const sendErrorResponse = (err, next, res) => {
  const statusCode = _get(err, 'error.statusCode') || _get(err, 'statusCode') || (() => {
    const errCode = _get(err, 'error.code', '');
    return errCode.match(/(ETIMEDOUT|ENETUNREACH)/ig) ? 504 : false;
  })() || 500;
  const message = _get(err, 'error.message') || _get(err, 'message') || 'Server Error';

  logError({
    code: MESSAGE_CODES.appResponseErrorCode,
    message: 'Response Error',
    error: err,
    req: _get(res, 'req'),
    res,
  });
  res.status(statusCode).send({ message, code: statusCode });
  return next(false);
};

const logAppError = err => logError({
  code: MESSAGE_CODES.appErrorCode,
  message: 'App Error',
  error: err,
});

const getResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: HttpStatus.OK, message: HttpStatus.getStatusText(HttpStatus.OK) };
  try {
    func(result).then(() => {
      if (result.statusCode === HttpStatus.OK) {
        res.status(result.statusCode).send(result.content || result);
        return next(false);
      }
      res.status(result.statusCode).send({ message: HttpStatus.getStatusText(result.statusCode) });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};

const updateResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: HttpStatus.NO_CONTENT, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === HttpStatus.NO_CONTENT) {
        if (!result.content) {
          res.sendStatus(HttpStatus.NO_CONTENT);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.status(result.statusCode).send({ message: HttpStatus.getStatusText(result.statusCode) });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};


const postResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: HttpStatus.CREATED, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === HttpStatus.CREATED) {
        if (!result.content) {
          res.sendStatus(HttpStatus.CREATED);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.status(result.statusCode).send({ message: result.message || HttpStatus.getStatusText(result.statusCode) });
      return next(false);
    }).catch(err => sendErrorResponse(err, logger, next, res));
  } catch (err) {
    sendErrorResponse(err, logger, next, res);
  }
};

const deleteResource = (logger, res, next, func) => {
  const result = { content: undefined, statusCode: HttpStatus.NO_CONTENT, message: undefined };
  try {
    func(result).then(() => {
      if (result.statusCode === HttpStatus.NO_CONTENT) {
        if (!result.content) {
          res.sendStatus(HttpStatus.NO_CONTENT);
          return next(false);
        }
        res.send(result.content);
        return next(false);
      }
      res.status(result.statusCode).send({ message: HttpStatus.getStatusText(result.statusCode) });
      return next(false);
    }).catch((err) => {
      res.send(HttpStatus.INTERNAL_SERVER_ERROR, { message: err });
      return next(false);
    });
  } catch (err) {
    res.send(HttpStatus.INTERNAL_SERVER_ERROR, { message: err });
    return next(false);
  }
};

async function postResourceAsync(res, next, func) {
  let bgFunc;
  // req-res specific try catch
  try {
    const data = await func();
    const content = _get(data, 'content');
    const message = _get(data, 'message');
    bgFunc = _get(data, 'bgFunc', false);
    if (!content) {
      res.status(HttpStatus.CREATED).send({ message: message || HttpStatus.getStatusText(HttpStatus.CREATED) });
    } else {
      res.status(HttpStatus.CREATED).send({ data: content, message });
    }
  } catch (e) {
    return sendErrorResponse(e, next, res);
  }

  try {
    bgFunc && bgFunc();
  } catch (e) {
    logError({
      code: MESSAGE_CODES.backGroundFuncFailureCode,
      message: 'Backgrond Func Error',
      error: e,
    });
  }
  return next(false);
}

export {
  getResource as get,
  updateResource as update,
  postResource as post,
  deleteResource as delete,
  postResourceAsync as postAsync,
};

import * as jwt from 'jsonwebtoken';
import { get as _get, isEmpty as _isEmpty, includes as _includes } from 'lodash';
import joinUrl from 'url-join';
import { logError } from 'aob-logger-wrapper';
import MESSAGE_CODES from './log-message-codes';

let allExemptedRoutes = [];
let allBlockchainAuthRoutes = [];
const enableAuthentication = (server, routesToExempt = [], blockchainRoutesForAuth = [], serviceBasePath, pubKey) => {
  allExemptedRoutes = routesToExempt.map(route => joinUrl(serviceBasePath, route));
  allBlockchainAuthRoutes = blockchainRoutesForAuth.map(route => joinUrl(serviceBasePath, route));
  server.use((req, res, next) => {
    // url which are exempted from authentication.
    if (allExemptedRoutes.includes(req.url || req.originalUrl)) { // || (req.headers && !req.headers.checkauth)) {
      return next();
    }
    // when there is no authorization present
    const authorization = _get(req, 'headers.authorization', '');
    if (_isEmpty(authorization)) {
      logError({
        code: MESSAGE_CODES.appResponseErrorCode,
        message: 'Authorization Token Required.',
        request: req,
        response: res,
      });
      return res.status(401).send({
        message: 'Authorization Token Required.',
      });
    }

    // authorization for every req & res.
    try {
      // if authorization contains string , replace with lodash
      const authTokenContainsComma = _includes(authorization, ',');
      let authToken = authorization;
      // split with comma as token can be in safari i.e. "bearer token, basic token"
      if (authTokenContainsComma) {
        [authToken] = authorization.split(',');
      }
      [, authToken] = authToken.split(' ');
      req.payload = jwt.verify(authToken, pubKey);
      req.authHeader = authorization;
      if (!req.payload) {
        logError({
          code: MESSAGE_CODES.appResponseErrorCode,
          message: 'Unauthorized.',
          request: req,
          response: res,
        });
        return res.status(401).send({
          message: 'Unauthorized',
        });
      }
      return next();
    } catch (err) {
      logError({
        code: MESSAGE_CODES.appFailureCode,
        message: err.message,
        error: err,
        request: req,
        response: res,
      });
      return res.status(401).send({
        message: err.message,
      });
    }
  });
};

export default enableAuthentication;

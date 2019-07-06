import 'babel-polyfill';
import { get as _get, map as _map, isEmpty as _isEmpty } from 'lodash';
import * as baseServer from './private/base-server';
import mapApplicationSettings from './api/helpers/appSettingsMapper';
import * as config from './config/config';
import * as appSettings from './api/vars/appSettings';
import * as packageFile from './package.json';
// import { dateOffset } from './api/helpers/dateUtil';

try {
  const options = {
    port: config.port,
    appRoot: __dirname,
    appName: config.appName,
    applicationSettingsPath: config.globalAppSettings,
    serviceSettingsPath: config.serviceSettings,
    configSettingMapper: mapApplicationSettings,
    packageFile,
    logFilePath: config.logFilePath,
  };

  const startupProcess = () => new Promise((resolve) => {
    resolve();
  });

  baseServer.loadConfigSettings(options).then(() => {
    options.enableLogSrc = appSettings.enableLogSrcFlag;
    options.logSeverity = appSettings.logSeverity;
    options.passOnRequestHeaders = appSettings.passOnRequestHeaders;
    options.allExemptedRoutes = _get(appSettings, 'exemptedRoutes');
    options.allBlockchainAuthRoutes = _get(appSettings, 'allBlockchainAuthRoutes');
    options.publicKey = _get(appSettings, 'publicKey');
        baseServer.createServer(options, startupProcess);
  }).catch((err) => {
    console.log('error', err);
    throw err;
  });
} catch (err) {
  console.log('error', err);
  throw err;
}


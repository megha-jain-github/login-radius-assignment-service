import { forOwn as _forOwn, get as _get } from 'lodash';
import * as appSettings from '../vars/appSettings';
import { appName } from '../../config/config';

// private functions
const mapAppSettingToConfig = (settingName, value) => {
  appSettings[settingName] = value;
};

// map config key name to string named identical to property in appsettings
const mapper = {
  passOnRequestHeaders: 'passOnRequestHeaders',
  'dbConfigs.protocol': 'dbProtocol',
  'dbConfigs.host': 'dbHost',
  'dbConfigs.port': 'dbPort',
  'dbConfigs.dbName': 'dbName',
  'dbConfigs.login': 'dbLogin',
  'dbConfigs.password': 'dbPassword',
  'http.requestTimeOutInMs': 'requestTimeOutInMs',
  'routes.exemptedRoutes': 'exemptedRoutes',
  'routes.allBlockchainAuthRoutes': 'allBlockchainAuthRoutes',
  'security.publicKey': 'publicKey',
  'messageBroker.connectionTimeout': 'connectionTimeout',
  'messageBroker.host': 'messageHost',
  'messageBroker.port': 'messagePort',
  'messageBroker.login': 'messageLogin',
  'messageBroker.password': 'messagePassword',
  eventSubscriberList: 'eventSubscriberList',
  eventPublisherList: 'eventPublisherList',
  'storage.url': 'storageUrl',
  'storage.bucketName': 'storageBucketName',
};

// map the app name and version from package.json
const mapCustomSettings = () => {
  appSettings.componentName = appName;
};

// public functions

const mapApplicationSettings = (data) => {
  const mapperKeys = Object.keys(mapper);
  _forOwn(mapperKeys, (keyName) => {
    mapAppSettingToConfig(mapper[keyName], _get(data, keyName));
  });
  mapCustomSettings();
};

export default mapApplicationSettings;

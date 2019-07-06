import fs from 'fs';
import { Map } from 'immutable';
import qs from 'qs';
import mongoose from 'mongoose';
import { assign as _assign, find as _find, map as _map, last as _last, get as _get, flow as _flow } from 'lodash';
import cleanDeep from 'clean-deep';
import path from 'path';
import util from 'util';
import joinUrl from 'url-join';
import { basePathForTemplates } from '../vars/appSettings';

// Convert fs.readFile into Promise version of same
const promisifiedReadFile = util.promisify(fs.readFile);

const promisifiedWriteFile = util.promisify(fs.writeFile);

const promisifiedUnlinkFile = util.promisify(fs.unlink);

const mapFilePath = ({ data }) => path.join(basePathForTemplates, data);

const safeObjectId = (stringId) => {
    const objectId = mongoose.Types.ObjectId.isValid(stringId) ? new mongoose.Types.ObjectId(stringId) : undefined;
    return objectId;
};

const createCompanyIdQuery = (companyIds) => {
    // convert every id into the objectId.
    const companyIdArr = _map(companyIds, companyId => safeObjectId(companyId));
    const query = { companyId: { $in: companyIdArr } };
    return query;
};

const cleanEntityData = (data) => {
    let cleanData = {};
    try {
        cleanData = cleanDeep(data);
    } catch (e) {
        // log error
    }
    return cleanData;
};

const makeUrl = (baseUrl, [...relativeUrl]) => {
    let relUrl;
    if (relativeUrl && relativeUrl.length) {
        relUrl = relativeUrl.join('/');
    }
    const url = baseUrl ? joinUrl(baseUrl, relUrl) : joinUrl(relUrl);
    return url;
};

const findConditonForCompanyId = companyIds => createCompanyIdQuery(companyIds);

const findConditonForUserCompanyId = (companyId) => {
    const qry = { companyId: safeObjectId(companyId) };
    return qry;
};

/*
A memoized function for concatenating the urls to avoid the concatenation during every request
*/
const memoizedUrlGenerator = (dirName) => {
    let cache = Map({
        [dirName]: Map(),
    });
    return (serviceName, relativeUrl) => {
        // Composite key per module
        const key = [dirName, relativeUrl];
        if (cache.hasIn(key)) {
            return cache.getIn(key);
        }
        const value = makeUrl(serviceName, [relativeUrl]);
        cache = cache.setIn(key, value);
        return value;
    };
};

/* for creating nested object as query value for example : filter = {where: {sourceSystem: "ERP", id: "4059a5ojlgm722c"}} => filter=%7B%22where%22%3A%7B%22sourceSystem%22%3A%22ERP%22%2C%22id%22%3A%224059a5ojlgm722c%22%7D%7D */
const convertObjToQueryString = (queryObj = {}, keyToMap) => {
    const jsonStringifiedObj = { [keyToMap]: JSON.stringify(queryObj) };
    return qs.stringify(jsonStringifiedObj);
};

export {
    promisifiedReadFile,
    makeUrl,
    mapFilePath,
    cleanEntityData,
    findConditonForCompanyId,
    findConditonForUserCompanyId,
    safeObjectId,
    memoizedUrlGenerator,
    convertObjToQueryString,
    promisifiedWriteFile,
    promisifiedUnlinkFile,
};

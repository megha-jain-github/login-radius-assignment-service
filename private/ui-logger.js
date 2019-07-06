import fs from 'fs';
import path from 'path';
import safeStringify from 'fast-safe-stringify';
import promisify from 'es6-promisify';

let logFilePath;
const appendFile = promisify(fs.appendFile);
const createLogger = (filePath) => {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
  logFilePath = filePath;
};

const writelogFile = logs => new Promise((resolve, reject) => {
  logs.forEach((log) => {
    appendFile(logFilePath, `\n${safeStringify(log)}`).then(() => {
      resolve();
    }).catch((err) => {
      reject(err);
    });
  });
});
const writeLog = logs => new Promise((resolve, reject) => {
  writelogFile(logs)
   .then(() => {
     resolve();
   }).catch((err) => {
     reject(err);
   });
});
export {
  createLogger,
  writeLog,
};

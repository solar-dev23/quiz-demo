import { to as TO } from 'await-to-js';
import parseErr from 'parse-err';

export const to = async (promise) => {
  let err, res;
  [err, res] = await TO(promise);
  if (err) return [parseErr(err)];

  return [null, res];
};

export const ReE = (res, err, code) => {
  // Error Web Response
  if (err && typeof err == 'object' && typeof err.message != 'undefined') {
    err = err.message;
  }

  if (!err) {
    err = 'Object not found';
  }

  if (typeof code !== 'undefined') res.statusCode = code;

  return res.json({ success: false, error: err, status: res.statusCode });
};

export const ReS = (res, data, code) => {
  // Success Web Response
  let sendData = { success: true };

  if (typeof code !== 'undefined') res.statusCode = code;

  if (typeof data == 'object') {
    sendData = Object.assign(data, sendData); //merge the objects
  }

  return res.json({ ...sendData, status: res.statusCode });
};

export const TE = (errMsg, log) => {
  // TE stands for Throw Error
  if (log === true) {
    console.error(errMsg);
  }

  throw new Error(errMsg);
};

const axios = require('axios');
const FormData = require('form-data');
const LRU = require('lru-cache-ext');
const objectHash = require('object-hash-strict');

const workspace = require('./index/workspace');
const self = require('./index/self');
const channel = require('./index/channel');
const files = require('./index/files');

module.exports = (workspaceUrl, token, { cacheTtl = 60, cacheMaxEntries = 100 } = {}) => {
  const lru = new LRU({ maxAge: cacheTtl * 1000, max: cacheMaxEntries });

  const call = (endpoint, params, cache = false) => {
    const formDataRaw = { token, ...params };
    const formData = Object.entries(formDataRaw).reduce((p, [k, v]) => {
      p.append(k, v);
      return p;
    }, new FormData());
    const requestParams = {
      method: 'post',
      url: `https://${workspaceUrl}.slack.com/api/${endpoint}`,
      data: formData,
      headers: {
        // eslint-disable-next-line no-underscore-dangle
        'Content-Type': `multipart/form-data; boundary=${formData._boundary}`
      }
    };
    const req = async () => {
      const { data } = await axios(requestParams);
      return data;
    };
    if (cache !== true) {
      return req();
    }
    const signature = objectHash({
      workspaceUrl, endpoint, token, params
    });
    return lru.memoize(signature, () => req());
  };

  return {
    call,
    workspace: workspace(call),
    self: self(call),
    channel: channel(call),
    files: files(call)
  };
};

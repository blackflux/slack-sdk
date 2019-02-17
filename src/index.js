const crypto = require('crypto');
const request = require('request-promise-native');
const LRU = require('lru-cache');
const stringify = require('json-stable-stringify');


module.exports = (workspaceUrl, token, { cacheTtl = 60, cacheMaxEntries = 100 } = {}) => {
  const callCache = new LRU({ maxAge: cacheTtl * 1000, max: cacheMaxEntries });

  const call = (endpoint, params, cache = false) => {
    const requestParams = {
      method: 'POST',
      uri: `https://${workspaceUrl}.slack.com/api/${endpoint}`,
      formData: Object
        .entries(Object.assign({ token }, params))
        .reduce((p, [k, v]) => Object.assign(p, { [k]: v }), {}),
      json: true
    };
    const signature = crypto.createHash('md5').update(stringify(requestParams)).digest('hex');
    if (cache !== true) {
      return request(requestParams);
    }
    if (!callCache.has(signature)) {
      callCache.set(signature, request(requestParams));
    }
    return callCache.peek(signature); // use peek instead of get to prevent timing problem
  };

  return {
    call,
    workspace: {
      details: (cache = true) => call('rtm.start', {}, cache)
    },
    message: {
      self: async (msg) => {
        const rtmStart = await call('rtm.start', {}, true);
        const user = rtmStart.self;
        return call('chat.command', {
          disp: '/me',
          command: '/msg',
          text: `${user.name} ${msg}`,
          channel: rtmStart.ims.find(im => im.user === user.id).id
        });
      },
      channel: async (name, msg) => {
        const rtmStart = await call('rtm.start', {}, true);
        const channel = rtmStart.channels.find(chan => chan.name === name);
        if (!channel) {
          throw new Error(`Channel "${name}" not found.`);
        }
        return call('chat.postMessage', {
          text: msg,
          channel: channel.id
        });
      }
    }
  };
};

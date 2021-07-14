const axios = require('axios');
const FormData = require('form-data');
const LRU = require('lru-cache-ext');
const objectHash = require('object-hash-strict');

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
          channel: rtmStart.ims.find((im) => im.user === user.id).id
        });
      },
      channel: async (name, msg) => {
        const rtmStart = await call('rtm.start', {}, true);
        const channel = rtmStart.channels.find((chan) => chan.name === name);
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

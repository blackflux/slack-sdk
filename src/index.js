const crypto = require('crypto');
const request = require("request-promise-native");


module.exports = (workspaceUrl, token) => {
  const callCache = {};

  const call = (endpoint, params, cache = false) => {
    const paramKeys = Object.keys(params).sort();
    const signature = crypto
      .createHash('md5')
      .update(endpoint)
      .update(JSON.stringify(paramKeys))
      .update(JSON.stringify(paramKeys.map(k => params[k])))
      .digest("hex");
    if (callCache[signature] === undefined || cache === false) {
      const data = Object.assign({ token }, params);
      callCache[signature] = request({
        method: 'POST',
        uri: `https://${workspaceUrl}.slack.com/api/${endpoint}`,
        formData: Object.keys(data).reduce((p, c) => Object.assign(p, { [c]: [data[c]] }), {}),
        json: true
      });
    }
    return callCache[signature];
  };

  return {
    call,
    message: {
      self: async (msg) => {
        const rtmStart = await call("rtm.start", {}, true);
        const user = rtmStart.self;
        return call("chat.command", {
          disp: "/me",
          command: "/msg",
          text: `${user.name} ${msg}`,
          channel: rtmStart.ims.find(im => im.user === user.id).id
        });
      },
      channel: async (name, msg) => {
        const rtmStart = await call("rtm.start", {}, true);
        const channel = rtmStart.channels.find(chan => chan.name === name);
        if (!channel) {
          throw new Error(`Channel "${name}" not found.`);
        }
        return call("chat.postMessage", {
          text: msg,
          channel: channel.id
        });
      }
    }
  };
};

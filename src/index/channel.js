const getChannelMeta = require('./util/get-channel-meta');

module.exports = (call) => ({
  meta: (name) => getChannelMeta(call, name),
  message: async (name, msg) => {
    const channel = await getChannelMeta(call, name);
    return call('chat.postMessage', {
      text: msg,
      channel: channel.id
    });
  },
  setTopic: async (name, topic) => {
    const channel = await getChannelMeta(call, name);
    return call('conversations.setTopic', {
      topic,
      channel: channel.id
    });
  },
  setPurpose: async (name, purpose) => {
    const channel = await getChannelMeta(call, name);
    return call('conversations.setPurpose', {
      purpose,
      channel: channel.id
    });
  }
});

import getChannelMeta from './util/get-channel-meta.js';

const normalize = (msg) => {
  if (!(typeof msg === 'string')) {
    return msg;
  }
  return msg.replace(/<(?:[^|>]+\|)?([^>]+)>/g, '$1');
};

export default (call) => ({
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
    if (normalize(channel.topic?.value) === topic) {
      return null;
    }
    return call('conversations.setTopic', {
      topic,
      channel: channel.id
    });
  },
  setPurpose: async (name, purpose) => {
    const channel = await getChannelMeta(call, name);
    if (normalize(channel.purpose?.value) === purpose) {
      return null;
    }
    return call('conversations.setPurpose', {
      purpose,
      channel: channel.id
    });
  },
  shareFiles: async (name, files) => {
    const channel = await getChannelMeta(call, name);
    return call('files.share', {
      files: files.join(','),
      channel: channel.id
    });
  }
});

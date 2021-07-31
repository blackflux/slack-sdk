module.exports = (call) => {
  const channelMeta = async (name) => {
    const rtmStart = await call('rtm.start', {}, true);
    const channel = rtmStart.channels.find((chan) => chan.name === name);
    if (!channel) {
      throw new Error(`Channel "${name}" not found.`);
    }
    return channel;
  };
  return {
    meta: channelMeta,
    message: async (name, msg) => {
      const channel = await channelMeta(name);
      return call('chat.postMessage', {
        text: msg,
        channel: channel.id
      });
    },
    setTopic: async (name, topic) => {
      const channel = await channelMeta(name);
      return call('conversations.setTopic', {
        topic,
        channel: channel.id
      });
    },
    setPurpose: async (name, purpose) => {
      const channel = await channelMeta(name);
      return call('conversations.setPurpose', {
        purpose,
        channel: channel.id
      });
    }
  };
};

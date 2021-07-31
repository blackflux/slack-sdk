module.exports = (call) => ({
  message: async (msg) => {
    const rtmStart = await call('rtm.start', {}, true);
    const user = rtmStart.self;
    return call('chat.command', {
      disp: '/me',
      command: '/msg',
      text: `${user.name} ${msg}`,
      channel: rtmStart.ims.find((im) => im.user === user.id).id
    });
  }
});

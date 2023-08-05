import getSelf from './util/get-self.js';

export default (call) => ({
  message: async (msg) => {
    const self = await getSelf(call);
    return call('chat.command', {
      disp: '/me',
      command: '/msg',
      text: `${self.name} ${msg}`,
      channel: self.channel
    });
  },
  shareFiles: async (files) => {
    const self = await getSelf(call);
    return call('files.share', {
      files: files.join(','),
      channel: self.channel
    });
  }
});

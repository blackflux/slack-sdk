export default async (call, name) => {
  const rtmStart = await call('rtm.start', {}, true);
  const channel = rtmStart.channels.find((chan) => chan.name === name);
  if (!channel) {
    throw new Error(`Channel "${name}" not found.`);
  }
  return channel;
};

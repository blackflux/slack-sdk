export default async (call) => {
  const rtmStart = await call('rtm.start', {}, true);
  const user = rtmStart.self;
  return {
    id: user.id,
    name: user.name,
    channel: rtmStart.ims.find((im) => im.user === user.id).id
  };
};

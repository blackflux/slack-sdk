export default (call) => ({
  details: (cache = true) => call('rtm.start', {}, cache)
});

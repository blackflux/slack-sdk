module.exports = (call) => ({
  details: (cache = true) => call('rtm.start', {}, cache)
});

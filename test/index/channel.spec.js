const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Slack = require('../../src/index');

describe('Testing Slack SDK', {
  useNock: true,
  cryptoSeed: '3eced0c2-38ea-4bc4-9045-ee0cb68bd688',
  timestamp: '2020-07-13T16:14:25.488Z'
}, () => {
  let slack;
  beforeEach(() => {
    slack = Slack('workspace', 'SLACK-SESSION-TOKEN');
  });

  it('Testing channel.meta', async () => {
    const r = await slack.channel.meta('channel');
    expect(r).to.deep.equal({
      id: 'C3Y9NQTQG',
      name: 'channel'
    });
  });

  it('Testing channel.message', async () => {
    const r = await slack.channel.message('channel', 'message');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing channel.message-unknown', async ({ capture }) => {
    const e = await capture(() => slack.channel.message('unknown', 'message'));
    expect(e.message).to.equal('Channel "unknown" not found.');
  });

  it('Testing channel.setTopic', async () => {
    const r = await slack.channel.setTopic('channel', 'topic');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing channel.setTopic (unchanged)', async () => {
    const r = await slack.channel.setTopic('channel', 'topic');
    expect(r).to.equal(null);
  });

  it('Testing channel.setPurpose', async () => {
    const r = await slack.channel.setPurpose('channel', 'purpose');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing channel.setPurpose (unchanged)', async () => {
    const r = await slack.channel.setPurpose('channel', 'purpose');
    expect(r).to.equal(null);
  });

  it('Testing channel.shareFiles', async () => {
    const r = await slack.channel.shareFiles('channel', ['F029QHN0AAZ', 'F02AH8J752L']);
    expect(r).to.deep.equal({ ok: true });
  });
});

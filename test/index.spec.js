const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Slack = require('../src/index');

describe('Testing Slack SDK', { useNock: true }, () => {
  let slack;
  beforeEach(() => {
    slack = Slack('workspace', 'SLACK-SESSION-TOKEN');
  });

  it('Testing workspace.details', async () => {
    const r = await slack.workspace.details();
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing message.channel', async () => {
    const r = await slack.message.channel('channel', 'message');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing message.channel-unknown', async ({ capture }) => {
    const e = await capture(() => slack.message.channel('unknown', 'message'));
    expect(e.message).to.equal('Channel "unknown" not found.');
  });

  it('Testing message.self', async () => {
    const r = await slack.message.self('message');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing call-cached', async () => {
    const r1 = await slack.call('rtm.start', {}, true);
    expect(r1).to.deep.contain({ ok: true });
    const r2 = await slack.call('rtm.start', {}, true);
    expect(r2).to.deep.contain({ ok: true });
  });
});

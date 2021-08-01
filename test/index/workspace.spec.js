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

  it('Testing workspace.details', async () => {
    const r = await slack.workspace.details();
    expect(r).to.deep.contain({ ok: true });
  });
});
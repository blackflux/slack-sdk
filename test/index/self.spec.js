import { expect } from 'chai';
import { describe } from 'node-tdd';
import Slack from '../../src/index.js';

describe('Testing Slack SDK', {
  useNock: true,
  cryptoSeed: '3eced0c2-38ea-4bc4-9045-ee0cb68bd688',
  timestamp: '2020-07-13T16:14:25.488Z'
}, () => {
  let slack;

  beforeEach(() => {
    slack = Slack('workspace', 'SLACK-SESSION-TOKEN');
  });

  it('Testing self.message', async () => {
    const r = await slack.self.message('message');
    expect(r).to.deep.contain({ ok: true });
  });

  it('Testing self.shareFiles', async () => {
    const r = await slack.self.shareFiles(['F029QHN0AAZ', 'F02AH8J752L']);
    expect(r).to.deep.equal({ ok: true });
  });
});

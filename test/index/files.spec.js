const path = require('path');
const expect = require('chai').expect;
const { describe } = require('node-tdd');
const Slack = require('../../src/index');

describe('Testing Slack SDK', {
  useNock: true,
  nockStripHeaders: true,
  cryptoSeed: '3eced0c2-38ea-4bc4-9045-ee0cb68bd688',
  timestamp: '2020-07-13T16:14:25.488Z'
}, () => {
  let slack;
  beforeEach(() => {
    slack = Slack('workspace', 'SLACK-SESSION-TOKEN');
  });

  it('Testing files.upload', async () => {
    const filepath = path.join(`${__filename}__fixtures`, 'file.jpg');
    const r = await slack.files.upload(filepath);
    expect(r).to.deep.equal('F029QHN0AAZ');
  });

  it('Testing files.upload with custom title and filename', async () => {
    const filepath = path.join(`${__filename}__fixtures`, 'file.jpg');
    const r = await slack.files.upload(filepath, '<some-title>', '<some-filename>');
    expect(r).to.deep.equal('F02AH8J752L');
  });
});

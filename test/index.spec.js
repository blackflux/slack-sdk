const path = require("path");
const expect = require("chai").expect;
const nockBack = require('nock').back;
const Slack = require("../src/index");

nockBack.setMode('record');
nockBack.fixtures = path.join(__dirname, "__cassette");

describe("Testing Slack SDK", () => {
  let slack;
  beforeEach(() => {
    slack = Slack("workspace", "SLACK-SESSION-TOKEN");
  });

  it("Testing workspace.details", (done) => {
    nockBack(`workspace.details.json`, {}, (nockDone) => {
      slack.workspace.details().then((r) => {
        expect(r).to.deep.contain({ ok: true });
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it("Testing message.channel", (done) => {
    nockBack(`message.channel.json`, {}, (nockDone) => {
      slack.message.channel("channel", "message").then((r) => {
        expect(r).to.deep.contain({ ok: true });
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it("Testing message.channel-unknown", (done) => {
    nockBack(`message.channel-unknown.json`, {}, (nockDone) => {
      slack.message.channel("unknown", "message").catch((e) => {
        expect(e.message).to.equal(`Channel "unknown" not found.`);
        nockDone();
        done();
      }).then(done.fail);
    });
  });

  it("Testing message.self", (done) => {
    nockBack(`message.self.json`, {}, (nockDone) => {
      slack.message.self("message").then((r) => {
        expect(r).to.deep.contain({ ok: true });
        nockDone();
        done();
      }).catch(done.fail);
    });
  });

  it("Testing call-cached", (done) => {
    nockBack(`call-cached.json`, {}, (nockDone) => {
      slack.call("rtm.start", {}, true).then((r1) => {
        expect(r1).to.deep.contain({ ok: true });
        slack.call("rtm.start", {}, true).then((r2) => {
          expect(r2).to.deep.contain({ ok: true });
          nockDone();
          done();
        }).catch(done.fail);
      }).catch(done.fail);
    });
  });
});

[![Build Status](https://img.shields.io/travis/simlu/slack-sdk/master.svg)](https://travis-ci.org/simlu/slack-sdk)
[![Test Coverage](https://img.shields.io/coveralls/simlu/slack-sdk/master.svg)](https://coveralls.io/github/simlu/slack-sdk?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=simlu/slack-sdk)](https://dependabot.com)
[![Dependencies](https://david-dm.org/simlu/slack-sdk/status.svg)](https://david-dm.org/simlu/slack-sdk)
[![NPM](https://img.shields.io/npm/v/slack-sdk.svg)](https://www.npmjs.com/package/slack-sdk)
[![Downloads](https://img.shields.io/npm/dt/slack-sdk.svg)](https://www.npmjs.com/package/slack-sdk)
[![Semantic-Release](https://github.com/simlu/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/simlu/js-gardener/blob/master/assets/badge.svg)](https://github.com/simlu/js-gardener)

# Slack SDK

Basic Slack Api SDK

## Install

```bash
npm i --save slack-sdk
```

## Usage

<!-- eslint-disable import/no-extraneous-dependencies, import/no-unresolved -->
```javascript
const slack = require("slack-sdk")("workspace-name", "user-session-token");

slack.message.channel("channel-name", "message");
```

## Obtaining User Session Token

...

## Functions

### message.self(message: string)

Send `message` to self.

### message.channel(channel: string, message: string)

Send `message` to channel `channel`.


## Internal functions

### call(endpoint: string, params: object, cache: boolean = false)

Send request to slack endpoint `endpoint` with parameters `params`. 

E.g. `call("rtm.start", {}, true)` to obtain information about current user. Use cache if information was already obtained before.

[![Build Status](https://img.shields.io/travis/simlu/slack-sdk/master.svg)](https://travis-ci.org/simlu/slack-sdk)
[![Test Coverage](https://img.shields.io/coveralls/simlu/slack-sdk/master.svg)](https://coveralls.io/github/simlu/slack-sdk?branch=master)
[![Dependabot Status](https://api.dependabot.com/badges/status?host=github&repo=simlu/slack-sdk)](https://dependabot.com)
[![Dependencies](https://david-dm.org/simlu/slack-sdk/status.svg)](https://david-dm.org/simlu/slack-sdk)
[![NPM](https://img.shields.io/npm/v/slack-sdk.svg)](https://www.npmjs.com/package/slack-sdk)
[![Downloads](https://img.shields.io/npm/dt/slack-sdk.svg)](https://www.npmjs.com/package/slack-sdk)
[![Semantic-Release](https://github.com/blackflux/js-gardener/blob/master/assets/icons/semver.svg)](https://github.com/semantic-release/semantic-release)
[![Gardener](https://github.com/blackflux/js-gardener/blob/master/assets/badge.svg)](https://github.com/blackflux/js-gardener)

# Slack SDK

Basic Slack Api SDK using User Session Token

## Install

```bash
npm i --save slack-sdk
```

## Usage

<!-- eslint-disable import/no-extraneous-dependencies, import/no-unresolved -->
```javascript
const slack = require("slack-sdk")("workspace-name", "user-session-token", {/* options */});

slack.message.channel("channel-name", "message");
```

## Options

### cacheTtl

Cache duration in seconds. Optional, defaults to `60`.

### cacheMaxEntries

Maximum number of entries in cache at any given time. Optional, defaults to `100`.

## Obtaining User Session Token

1) Go to https://YOURWORKSPACE.slack.com/home in Chrome
2) Right click → Inspect
3) Select the network tab
4) Reload the page
5) Type in api in the search
6) Click rtm.start and then headers
7) Scroll down until you find the `token`. It starts with `xoxs-`
8) Copy it!

## Functions

### message.self(message: string)

Send `message` to self.

### message.channel(channel: string, message: string)

Send `message` to channel `channel`.

### workspace.details(cache: boolean = true)

Obtain details for workspace. Should usually be cached as it is easy to run into rate limits.

## Internal functions

### call(endpoint: string, params: object, cache: boolean = false)

Send request to slack endpoint `endpoint` with parameters `params`. 

E.g. `call("rtm.start", {}, true)` to obtain information about current user. Use cache if information was already obtained before.

## Cache

Cache operates by matching the exact outgoing request signature.

Cached and non-cached requests operate separately. So making a non cached request does never alter the cache.

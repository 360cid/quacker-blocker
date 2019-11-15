# Quacker Blocker #
A tracker blocking extension for Chrome and other browsers (eventually).


## How it works ##
Quacker Blocker uses a local copy of [EasyPrivacy](https://easylist.to/easylist/easyprivacy.txt) and leverages https://github.com/bbondy/abp-filter-parser internally to parse Adblock Plus filter rules. It follows the [Chrome Extensions API](https://developer.chrome.com/extensions), which is largely compatible with FireFox's [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).

### Technical Design Notes ###

**ABP-filter-parser**
The original intent was for Quacker Blocker to include its own custom parser to convert AdBlock Plus rules to webRequest match rules. As I started working on the implementation, it became apparent that the ABP ruleset is more complex than I had originally assessed. Many of the rules don't easily translate to match rule formats, and there are a lot of cases that would require complicated and brittle regexes. As Quacker Blocker is an MVP, it didn't make sense to tackle that level of complexity when a library like ABP-filter-parser exists. 

**Enabling/disabling tracker blocking**
The original design called for setting a global flag to identify when blocking should be enabled or disabled. This did not take into account that browser extensions run in the background for all tabs, not just the active tab; thus the prescribed global flag would disable or enable blocking for all tabs. This seemed like unexpected behavior at best, and actively harmful to the user at worst. Instead, I opted to add an internal whitelist for the current domain that will persist until the user closes their browser. This will eventually be saved to local storage. The externally-accessible `App.enable()` and `App.disable()` methods were deprecated in favor of communicating over the `runtime.sendMessage()` api.


## Getting started ##

First, install and build the extension:
```bash
npm i
npm run build
```
or (for development mode)
```bash
npm run dev
```

In Chrome, navigate to `chrome://extensions/`, make sure Developer Mode is toggled on, and click 'Load unpacked'. Select the `dist` folder.
In Firefox, navigate to `about:debugging#/runtime/this-firefox`. Under 'Temporary Extension', click 'Load Temporary Add-on'.


## Testing ##
Tests are written in Jest.

```bash
npm run test
```


## Linting ##
Linting is done using StandardJS. `lint` will both scan and fix any issues it finds.

```bash
npm run lint
```

## Attribution ##
Icons made by [Freepik](https://www.flaticon.com/authors/freepik) from [www.flaticon.com](https://www.flaticon.com/)

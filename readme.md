# Quacker Blocker #
A tracker blocking extension for Chrome and other browsers (eventually).


## How it works ##
Quacker Blocker uses a local copy of [EasyPrivacy](https://easylist.to/easylist/easyprivacy.txt) and leverages https://github.com/bbondy/abp-filter-parser internally to parse Adblock Plus filter rules. It follows the [Chrome Extensions API](https://developer.chrome.com/extensions), which is largely compatible with FireFox's [WebExtensions API](https://developer.mozilla.org/en-US/docs/Mozilla/Add-ons/WebExtensions).


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

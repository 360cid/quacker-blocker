import { Api } from './api'
import { Parser } from './parser'
import { getDomainFromUrl } from './utilities'

class App {
  // TODO: pass context into parser and API. This will determine
  // which browser flavor the extension is running.
  // e.g. this.context = chrome|browser
  // OR use firefox's web extensions polyfill
  constructor() {
    this.whitelist = new Set()

    this.sources = {}
    this.sourcesLocalPath = 'sources/sources.json'

    this.api = new Api()
    this.parser = new Parser()
  }

  /*
    Adds a domain to the whitelist.
    @param {string} domain
  */
  addToWhitelist (domain) {
    // TODO: persist to localStorage
    this.whitelist.add(domain)
  }

  /*
    Removes a domain from the whitelist.
    @param {string} domain
  */
  removeFromWhitelist (domain) {
    this.whitelist.delete(domain)
  }

  /*
    Gets the App's current enabled/disabled status for
    the given domain.
    @param {string} domain
    @return boolean
  */
  isEnabled (domain) {
    return !this.whitelist.has(domain)
  }

  /*
    Gets the current tab object and returns it as a parameter to the provided callback.
    @param {fn} callback
  */
  getCurrentTab (callback) {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      const currentTab = tabs[0]
      callback(currentTab)
    })
  }

  /*
    Checks requests to determine whether they should be blocked or not.
    @param {object} requestDetails
  */
  checkUrl (requestDetails) {
    const { url, initiator, type } = requestDetails
    if (this.whitelist.has(initiator)) {
      console.log(`not blocking due to ${initiator} whitelist: ${url}`)
      return
    }

    if (this.parser.shouldBlockUrl(url, initiator, type)) {
      console.log(`blocking: ${url}`)
      return { cancel: true }
    }
  }

  setupListeners () {
    chrome.webRequest.onBeforeRequest.addListener(
      this.checkUrl.bind(this),
      { urls: ['<all_urls>'] },
      ['blocking']
    )

    // Listen for enable/disable triggers from the UI
    // UI will send a message in the format { enable: {boolean} }
    chrome.runtime.onMessage.addListener((payload) => {
      this.getCurrentTab((tab) => {
        const { id, url } = tab
        const domain = getDomainFromUrl(url)
        if (payload.enable) {
          this.removeFromWhitelist(domain)
        } else {
          this.addToWhitelist(domain)
        }
        chrome.tabs.reload(id)
      })
    })
  }

  initialize () {
    this.api.getSource(this.sourcesLocalPath).then((sourceText) => {
      this.sources = JSON.parse(sourceText)

      Object.keys(this.sources).map((key) => {
        // Send each source key off to the API
        // This loop doesn't make a ton of sense since we currently only have one key in sources.json,
        // but eventually we may have more, plus local user data, plus lists that might be enabled/disabled on demand.

        // A better way to do this might be to provide an array of URLs and iterate through it to find the first successful result.
        // It might look something like [ remoteUrl 1, remoteUrl 2, ... , localFallbackUrl ]
        const url = this.sources[key].localUrl ? this.sources[key].localUrl : this.sources[key].remoteUrl
        this.api.getSource(url).then((rawFilterText) => {
          this.parser.parseRules(rawFilterText)
          this.setupListeners()
        })
      })
    })

    return this
  }
}

window.App = new App().initialize()

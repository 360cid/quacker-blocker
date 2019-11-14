import { Api } from './src/api'
import { Parser } from './src/parser'

const App = function () {
  // TODO: pass context into parser and API. This will determine
  // which browser flavor the extension is running.
  // e.g. this.context = chrome|browser
  // OR use firefox's web extensions polyfill

  // Stores the tracker URL match rules
  this.rules = []
  // Stores the exceptions
  this.exceptions = []

  // TODO: Eventually we'd probably want to pull keys from  localStorage.
  // Just hard code it for now.
  this.sources = {}
  this.sourcesLocalPath = 'sources.json'

  this.enabled = true
  this.api = new Api()
  this.parser = new Parser()

  const getTabState = (tabID) => {
    const KEY = `tab_${tabID}`
    return chrome.storage.local.get(KEY)
  }

  // Saves the state of the current tab
  const saveTabState = (enabled) => {
    const gettingTab = chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tab', tabs[0])
      // TODO: save state to local storage for this tabId, then reload.
      // This structure will look like { tab_17: { enabled: true }, tab_21: { enabled: false } } }
      // TODO: what happens when tab is closed?
      const currentTabId = tabs[0].id
      const KEY = `tab_${currentTabId}`
      const setting = chrome.storage.local.set({
        [KEY]: { enabled }
      }).then(() => {
        chrome.runtime.reload()
      })
    })
  }

  const getStatus = () => this.enabled

  // TODO: convert all chrome.* callbacks to Promises
  const reloadCurrentTab = () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
      console.log('tab', tabs[0])
      const currentTab = tabs[0]
      if (currentTab) {
        const { id, url } = currentTab
        console.log('reloading!', url)
        chrome.tabs.reload(id)
      }
    })
  }

  // Called from the UI. Enables blocking functionality.
  const enable = () => {
    this.enabled = true
    reloadCurrentTab()
    // saveTabState(true)
    // Pull the current enabled value from local storage
  }

  // Called from the UI. Disables blocking functionality.
  // Note: this will disable the script for every open tab
  // TODO: enable/disable on a per-tab basis
  const disable = () => {
    this.enabled = false
    reloadCurrentTab()
    // saveTabState(false)
  }

  const checkUrl = (requestDetails) => {
    if (!this.enabled) { console.log('not blocking', requestDetails.url); return }
    const { url, initiator, type } = requestDetails
    if (this.parser.shouldBlockUrl(url, initiator, type)) {
      console.log('blocking:', requestDetails.url)
      return { cancel: true }
    }
  }

  const setupListeners = () => {
    // Block requests
    chrome.webRequest.onBeforeRequest.addListener(
      checkUrl,
      { urls: ['<all_urls>'] },
      ['blocking']
    )

    // TODO: either hook this up or dump it
    // Listen for enable/disable triggers from the UI
    chrome.runtime.onMessage.addListener((payload) => {
      console.log(payload)
      if (payload.enable === false) {
        disable()
      } else {
        enable()
      }
    })
  }

  const initialize = () => {
    // TODO: grab enabled status from local storage
    console.log('initializing')
    // TODO: initialize() enables extension globally across all tabs, so it will continue to block in the
    // background even if a tab isn't currently focused.
    // Need a listener when activetab changes to switch to enabled/disabled state for each tab
    //
    if (!this.enabled) {
      console.log('Extension disabled; returning')
      return
    }
    this.api.getSource(this.sourcesLocalPath).then((sourceText) => {
      this.sources = JSON.parse(sourceText)

      for (const key in this.sources) {
        // Send each source key off to the API
        // This loop doesn't make a ton of sense since we currently only have one key in sources.json,
        // but eventually we may have more, plus local user data, plus lists that might be enabled/disabled on demand.

        // A better way to do this might be to provide an array of URLs and iterate through it to find the first successful result.
        // It might look something like [ remoteUrl 1, remoteUrl 2, ... , localFallbackUrl ]
        const url = this.sources[key].localUrl ? this.sources[key].localUrl : this.sources[key].remoteUrl
        this.api.getSource(url).then((rawFilterText) => {
          this.parser.parseRules(rawFilterText)
          setupListeners()
        })
      }
    })
  }

  return {
    enable,
    disable,
    getStatus,
    initialize
  }
}

const app = new App()
app.initialize()
window.App = app

export default app

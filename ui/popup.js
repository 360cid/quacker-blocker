import { getDomainFromUrl } from '../src/utilities'

const appText = {
  STATUS_DISABLED: 'Off',
  STATUS_ENABLED: 'On'
}

const classnames = {
  STATUS_ENABLED: 'toggle--on'
}

const ui = {
  statusLabel: document.getElementById('statusLabel'),
  statusToggle: document.getElementById('blockingEnabled'),
  statusToggleContainer: document.querySelector('.toggle')
}

const showBlockingUI = () => {
  ui.statusLabel.innerText = appText.STATUS_ENABLED
  ui.statusToggleContainer.classList.add(classnames.STATUS_ENABLED)
  chrome.browserAction.setTitle({ title: 'Quacker Blocker is enabled' })
}

const showDisabledUI = () => {
  ui.statusLabel.innerText = appText.STATUS_DISABLED
  ui.statusToggleContainer.classList.remove(classnames.STATUS_ENABLED)
  chrome.browserAction.setTitle({ title: 'Quacker Blocker is disabled' })
  // TODO: show inactive browser icon
}

let App

chrome.runtime.getBackgroundPage((window) => {
  if (!window.App) { throw new Error('window.App is undefined') }
  App = window.App

  // Update UI if App is enabled
  App.getCurrentTab((tab) => {
    const { url } = tab
    const domain = getDomainFromUrl(url)
    const isBlocking = App.isEnabled(domain)
    if (isBlocking) {
      ui.statusToggle.checked = true
      showBlockingUI()
    }
  })
})

// Let App know when enable/disable is clicked
ui.statusToggle.addEventListener('change', (e) => {
  const enable = e.target.checked
  chrome.runtime.sendMessage({ enable })
  if (enable) {
    showBlockingUI()
  } else {
    showDisabledUI()
  }
})

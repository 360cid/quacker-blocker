(function () {
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

    showBlockingUI = () => {
        ui.statusLabel.innerText = appText.STATUS_ENABLED
        ui.statusToggleContainer.classList.add(classnames.STATUS_ENABLED)
    }

    showDisabledUI = () => {
        ui.statusLabel.innerText = appText.STATUS_DISABLED
        ui.statusToggleContainer.classList.remove(classnames.STATUS_ENABLED)
    }
    
    let App
    chrome.runtime.getBackgroundPage((window) => {
        if (!window.App) { throw new Error("window.App is undefined") }
        App = window.App

        // Update UI if App is enabled
        const isBlocking = App.getStatus()
        if (isBlocking) {
            ui.statusToggle.checked = true
            showBlockingUI()
        }
    })
    
    ui.statusToggle.addEventListener('change', (e) => {
        // I don't really love tacking App onto window as a global. Feels a little dirty.
        // Altermatively, we could use the onMessage API:
        //chrome.runtime.sendMessage({ enable: e.target.checked })
        if (e.target.checked) {
            App.enable()
            showBlockingUI()
        } else {
            App.disable()
            showDisabledUI()
        }
    })

}())

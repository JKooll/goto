let activeTabs = new Set(),
    disabledTabs = new Set();
const name = getExtensionName();
const jsInjects = [
    'js/content_script.js'
];
const cssInjects = [
    "css/content_style.css"
];
const icons = {
    active: {
        "32": "images/icon32-active.png",
        "64": "images/icon64-active.png",
        "128": "images/icon128-active.png"
    },
    inactive: {
        "32": "images/icon32-inactive.png",
        "64": "images/icon64-inactive.png",
        "128": "images/icon128-inactive.png"
    }
};

// Gets the extension's name from the manifest.json file_
function getExtensionName() {
    let manifest = chrome.runtime.getManifest();
    return manifest.name;
}

// When the browser action button is clicked, we need to toggle our content script:
chrome.browserAction.onClicked.addListener(function (tab) {
    const tabId = tab.id;
    let active = activeTabs.has(tabId);

    // If it's already active, disable it:
    if (active) {
        chrome.tabs.sendMessage(tabId, 'disable');
        activeTabs.delete(tabId);
        disabledTabs.add(tabId);

        chrome.tabs.executeScript(null, { code: "document.getElementById('gotocontainer').style.display='none';" });
    }

    // If it's not active, but disabled, reenable it:
    else if (disabledTabs.has(tabId)) {
        chrome.tabs.sendMessage(tabId, 'enable');
        disabledTabs.delete(tabId);
        activeTabs.add(tabId);

        chrome.tabs.executeScript(null, { code: "document.getElementById('gotocontainer').style.display='block';" });
    }

    // If it isn't active yet, activate it!
    else {
        activeTabs.add(tabId);
        for (const filename of jsInjects) {
            chrome.tabs.executeScript(null, { file: filename });
        }
        for (const filename of cssInjects) {
            chrome.tabs.insertCSS(null, { file: filename });
        }
    }

    // Toggle active status:
    active = !active;

    // Set browser action accordingly:
    chrome.browserAction.setTitle({
        title: name + (active ? ' is active' : ' is inactive'),
        tabId: tabId
    });
    chrome.browserAction.setIcon({
        path: (active ? icons.active : icons.inactive),
        tabId: tabId
    });

});

// When we close a tab, we stop keeping track of it:
chrome.tabs.onRemoved.addListener(function (tabId) {
    activeTabs.delete(tabId);
    disabledTabs.delete(tabId);
});

// When we reload a page, we stop keeping track of it:
chrome.tabs.onUpdated.addListener(function (tabId, changeInfo) {
    if (changeInfo.status === 'loading') {
        activeTabs.delete(tabId);
        disabledTabs.delete(tabId);
    }
});

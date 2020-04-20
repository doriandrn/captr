import browser from 'webextension-polyfill'

const scanAllURLs = async (tabData) => {
  const { url } = tabData
  const HW = await browser.windows.create({
    url,
    focused: false,
    state: "minimized"
  })

  const tab = HW.tabs[0]
  browser.tabs.executeScript(tab.id, { file: 'content_scanURLs.js', runAt: 'document_end' })
  console.log('HW', HW)
}

browser.runtime.onConnect.addListener((port) => {
  console.log('connected', port, port.prototype)
  port.postMessage({ function: 'scan' })
  // browser.windows.create({url:'https://apple.com', focused:false, state:"minimized"}).then(hiddenWindow => {
  //   console.log('window', hiddenWindow)
  // })
  port.onMessage.addListener(async (msg) => {
    console.log('got msg from popup: ', msg)
    const { message } = msg
    switch (message) {
      case 'initialScan':
        await scanAllURLs(msg.tabData)
        port.postMessage({ message: 'scanDone' })
        break
    }
  })
  //   if (msg.function == 'html') {
  //     port.postMessage({ html: document.documentElement.outerHTML, description: document.querySelector("meta[name=\'description\']").getAttribute('content'), title: document.title });
  //   }
  // });
});

import browser from 'webextension-polyfill'

console.log('yayo bg')

browser.runtime.onConnect.addListener((port) => {
  console.log('connected', port, port.prototype)
  port.postMessage({ function: 'scan' })
  // browser.windows.create({url:'https://apple.com', focused:false, state:"minimized"}).then(hiddenWindow => {
  //   console.log('window', hiddenWindow)
  // })
  // port.onMessage.addListener((msg) => {
  //   if (msg.function == 'html') {
  //     port.postMessage({ html: document.documentElement.outerHTML, description: document.querySelector("meta[name=\'description\']").getAttribute('content'), title: document.title });
  //   }
  // });
});

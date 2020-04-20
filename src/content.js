
import browser from 'webextension-polyfill'

const port = browser.runtime.connect({ name: 'content-port' })
// port.postMessage({ greeting: 'Hello!' })
// port.postMessage({ As })

port.onMessage.addListener(m => {
  console.log('bg sais: ', m)
  if (m.function === 'scan') {

  }
});

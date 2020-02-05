
import browser from 'webextension-polyfill'

// Listen for messages
// browser.runtime.onMessage.addListener(function (msg, sender, sendResponse) {
//   // If the received message has the expected format...
//   if (msg.text === 'report_back') {
//       // Call the specified callback, passing
//       // the web-page's DOM content as argument
//       sendResponse(document.all[0].outerHTML);
//   }
// });

console.log('dom loaded')
const As = document.querySelectorAll('a')
console.log('as', As)

// browser.runtime.sendMessage({ As })

browser.runtime.onConnect.addListener((port) => {
  console.log('blabla', port, port.prototype)
  port.postMessage({ As })
  // port.onMessage.addListener((msg) => {
  //   if (msg.function == 'html') {
  //     port.postMessage({ html: document.documentElement.outerHTML, description: document.querySelector("meta[name=\'description\']").getAttribute('content'), title: document.title });
  //   }
  // });
});

<template lang="pug">
#captr
  h1 Captr
  p running on {{ path }}
  p {{ subdomain }} - {{ domain }}
</template>

<script>
import browser from 'webextension-polyfill'
import * as URI from 'uri-js'
import puppeteer from 'puppeteer'

let pbrowser

// const puppeteer = require('puppeteer');

// (async () => {
//   const browser = await puppeteer.launch();
//   const page = await browser.newPage();
//   await page.goto('https://apple.com');
//   await page.screenshot({path: 'appl.png'});

//   await browser.close();
// })();

export default {
  name: 'App',
  data () {
    return {
      path: window.location.href,
      domain: '',
      subdomain: '',
      foundURLs: []
    }
  },
  async mounted () {
    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      const { url, id } = tabs[0]
      const port = browser.tabs.connect(id);
      const parsed = URI.parse(url)

      this.path = url
      this.domain = parsed.host
      const split = parsed.host.split('.')
      this.subdomain = split.length > 2 ? split[0] : ''

      port.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('got', request)
      });
    });

    pbrowser = await puppeteer.launch();
    const page = await pbrowser.newPage();
    await page.goto('https://apple.com');
    await page.screenshot({path: 'appl.png'});
    await pbrowser.close();
    console.log('epec shit worked')
  }
}
</script>

<style lang="stylus">
@require 'assets/styles/popup'

#captr
  background yellow
</style>

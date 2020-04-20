<template lang="pug">
#captr
  h1 Captr
  p running on {{ path }}
  p(v-if="subdomain && subdomain !== 'www'") {{ subdomain }} - {{ domain }}

  .scanning(v-if="scanning")
    h2 Scanning!
    p Please wait

  h2 urls found (matching this domain):
  ul
    li

  button(
    :disabled=  "!port || scanning"
    @click=     "capture"
  ) Capture
</template>

<script>
import browser from 'webextension-polyfill'
import * as URI from 'uri-js'

export default {
  name: 'App',
  data () {
    return {
      tabData: {
        url: window.location.href,
        domain: '',
        subdomain: '',
      },
      scanned: false,
      scanning: false,
      foundURLs: [],
      port: null
    }
  },
  methods: {
    capture () {
      const { tabData } = this
      this.port.postMessage({ message: 'capture', tabData })
    }
  },
  async mounted () {
    this.port = browser.runtime.connect({ name: 'popup-port' })

    browser.tabs.query({active: true, currentWindow: true}).then(tabs => {
      const { url, id } = tabs[0]
      const port = browser.tabs.connect(id);
      const parsed = URI.parse(url)

      this.tabData.url = url
      this.tabData.domain = parsed.host
      const split = parsed.host.split('.')
      this.tabData.subdomain = split.length > 2 ? split[0] : ''
      this.scanning = true

      port.onMessage.addListener(function(request, sender, sendResponse) {
        console.log('got', request)
      });

      this.port.postMessage({ message: 'initialScan', tabData: this.tabData })
    });

  }
}
</script>

<style lang="stylus">
@require 'assets/styles/popup'

#captr
  padding 20px
  width 320px
</style>

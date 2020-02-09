<template lang="pug">
#captr
  h1 Captr
  p running on {{ path }}
  p {{ subdomain }} - {{ domain }}

  button Capture
</template>

<script>
import browser from 'webextension-polyfill'
import * as URI from 'uri-js'

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

  }
}
</script>

<style lang="stylus">
@require 'assets/styles/popup'

#captr
  background yellow
</style>

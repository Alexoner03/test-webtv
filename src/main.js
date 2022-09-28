import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'
import {ClientJS} from 'clientjs'

document.documentElement.style.setProperty('--webtv-accent', '#'+process.env.VUE_APP_ACCENT)
document.documentElement.style.setProperty('--webtv-accent-epg', '#'+process.env.VUE_APP_ACCENT_EPG)
document.documentElement.style.setProperty('--webtv-filter-icon', process.env.VUE_APP_FILTER_ICON)

createApp(App).use(router).use(VuesticPlugin).use(ClientJS).mount('#app')
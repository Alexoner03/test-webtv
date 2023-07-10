import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { VuesticPlugin } from 'vuestic-ui'
import 'vuestic-ui/dist/vuestic-ui.css'

document.documentElement.style.setProperty('--webtv-accent', '#'+process.env.VUE_APP_ACCENT)
document.documentElement.style.setProperty('--webtv-accent-epg', '#'+process.env.VUE_APP_ACCENT)
document.documentElement.style.setProperty('--webtv-filter-icon', process.env.VUE_APP_FILTER_ICON)

createApp(App).use(router).use(VuesticPlugin).mount('#app')
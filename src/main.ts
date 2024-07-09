/**
 * main.ts
 *
 * Bootstraps Vuetify and other plugins then mounts the App`
 */

// Plugins
import {registerPlugins} from '@/plugins'
import InfiniteLoading from "v3-infinite-loading";

// Components
import App from './App.vue'

// Composables
import {createApp} from 'vue'
import {createMetaManager} from "vue-meta";

const app = createApp(App)
app.component("infinite-loading", InfiniteLoading);
registerPlugins(app)
app.use(createMetaManager());


app.mount('#app')




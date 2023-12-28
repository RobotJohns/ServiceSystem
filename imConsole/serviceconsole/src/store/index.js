import Vue from 'vue'
import Vuex from 'vuex'
Vue.use(Vuex)

import vuexCore from './core/vuexCore'
import vuexViews from './views/vuexViews'
import vuexMessage from './message/vuexMessage'


export default new Vuex.Store({
  modules: {
    core: vuexCore,
    message: vuexMessage,
    views: vuexViews
  }
})

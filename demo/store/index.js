import Vue from 'vue'
import Vuex from 'vuex'
import { useStore } from '@anyup/uniui'

Vue.use(Vuex)

const store = new Vuex.Store({
  modules: useStore.modules(),
  getters: useStore.getters()
})

export default store

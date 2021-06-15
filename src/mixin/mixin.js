import { mapGetters } from 'vuex'
import Vue from 'vue'

class Mixin {
  constructor(store) {
    this.store = store || new Vue().$store
    this.storeKeys = []
    try {
      this.storeKeys = store.getters ? Object.keys(store.getters) : []
    } catch (e) {
      this.storeKeys = []
    }
  }
  init() {
    return {
      data() {
        return {}
      },
      computed: {
        ...mapGetters(this.storeKeys)
      },
      methods: {},
      onReachBottom() {
        uni.$emit('onLoadMore')
      }
    }
  }
}

export default Mixin

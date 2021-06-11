import { mapGetters } from 'vuex'

class Mixin {
  constructor(store) {
    this.store = store
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
        uni.$emit('onReachBottom')
      }
    }
  }
}

export default Mixin

<template>
  <u-tag v-bind="$attrs" v-on="$listeners" :style="[borderRadius]">
    <slot></slot>
  </u-tag>
</template>

<script>
export default {
  name: 'app-tag',
  props: {
    radius: {
      type: String,
      default: ''
    }
  },
  computed: {
    borderRadius() {
      if (this.radius) {
        return { 'border-radius': this.radius }
      }
      return {}
    }
  }
}
</script>

<style lang="scss">
// darkblue
.u-mode-light-darkblue {
  background-color: $u-type-darkblue-light;
  color: $u-type-darkblue;
  border: 1px solid $u-type-darkblue-disabled;
}

.u-mode-dark-darkblue {
  background-color: $u-type-darkblue;
  color: #ffffff;
}

.u-mode-plain-darkblue {
  background-color: #ffffff;
  color: $u-type-darkblue;
  border: 1px solid $u-type-darkblue;
}
// gold
.u-mode-light-gold {
  background-color: $u-type-gold-light;
  color: $u-type-gold;
  border: 1px solid $u-type-gold-disabled;
}

.u-mode-dark-gold {
  background-color: $u-type-gold;
  color: #ffffff;
}

.u-mode-plain-gold {
  background-color: #ffffff;
  color: $u-type-gold;
  border: 1px solid $u-type-gold;
}
</style>

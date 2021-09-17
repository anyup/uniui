<template>
  <au-button v-bind="$attrs" v-on="$listeners" :custom-style="styles" :custom-types="['gold', 'darkblue']">
    <slot></slot>
  </au-button>
</template>

<script>
export default {
  name: 'app-button',
  props: {
    color: {
      type: String,
      default: ''
    },
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    }
  },
  computed: {
    styles() {
      let style = {}
      if (this.color) {
        style = { color: this.color }
      }
      return { ...style, ...this.customStyle }
    }
  }
}
</script>

<style lang="scss">
@import '@anyup/uniui/src/css/mixin.scss';

.au-btn {
  $type: darkblue gold;
  $color: $u-type-gold, #ffffff;
  $main: $u-type-darkblue, $u-type-gold;
  $light: $u-type-darkblue-light, $u-type-gold-light;
  $disabled: $u-type-darkblue-disabled, $u-type-gold-disabled;
  $dark: $u-type-darkblue-dark, $u-type-gold-dark;

  @for $i from 1 through length($type) {
    @include add-btn-theme(nth($type, $i), nth($color, $i), nth($main, $i), nth($light, $i), nth($disabled, $i), nth($dark, $i));
  }
}

@each $type in primary success error warning darkblue gold {
  .au-btn--#{$type}--plain {
    background-color: #ffffff !important;
  }
}
</style>

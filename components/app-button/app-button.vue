<template>
  <au-button
    :type="type"
    :size="size"
    :shape="shape"
    :plain="plain"
    :hollow="hollow"
    :disabled="disabled"
    :loading="false"
    :open-Type="''"
    :custom-style="customStyle"
    :custom-types="['gold', 'darkblue']"
    :throttle-time="1000"
    @click="$emit('click')"
  >
    <slot></slot>
  </au-button>
</template>

<script>
export default {
  name: 'app-button',
  options: { styleIsolation: 'shared' },
  props: {
    type: {
      type: String,
      default: 'default'
    },
    size: {
      type: String,
      default: 'default'
    },
    shape: {
      type: String,
      default: 'square'
    },
    plain: {
      type: Boolean,
      default: false
    },
    hollow: {
      type: Boolean,
      default: false
    },
    customStyle: {
      type: Object,
      default() {
        return {}
      }
    },
    disabled: {
      type: Boolean,
      default: false
    }
  }
}
</script>

<style lang="scss">
@import '@/uniui/src/css/mixin.scss';

.au-btn {
  $type: darkblue gold;
  $color: $u-type-gold, #ffffff;
  $main: $u-type-darkblue, $u-type-gold;
  $light: $u-type-darkblue-light, $u-type-gold-light;
  $disabled: $u-type-darkblue-disabled, $u-type-gold-disabled;
  $dark: $u-type-darkblue-dark, $u-type-gold-dark;

  @for $i from 1 through length($type) {
    @include add-btn-theme(
      nth($type, $i),
      nth($color, $i),
      nth($main, $i),
      nth($light, $i),
      nth($disabled, $i),
      nth($dark, $i)
    );
  }
}
</style>

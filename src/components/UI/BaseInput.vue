<template>
  <input
    :value="modelValue"
    class="base-input"
    @input="$emit('update:modelValue', $event.target.value)"
  >
</template>

<script>
export default {
  name: 'BaseInput',

  props: {
    modelValue: {
      type: String,
      default: '',
    },
  },
};
</script>

<style lang="scss">
.base-input {
  height: 30px;
  width: 220px;
  padding: 0 15px;
  font-size: 16px;
  border: 2px solid transparent;
  border-radius: 15px;
  outline: none;
  box-shadow: 0px 0px 19px -1px rgba(34, 60, 80, 0.13);

  &:focus {
    border: 2px solid #cccccc;
  }
}
</style>

<template>
  <button class="base-button">
    <slot></slot>
  </button>
</template>

<script>
export default {
  name: 'BaseButton',
};
</script>

<style lang="scss">
.base-button {
  height: 30px;
  padding: 0 10px;
  color: #ffffff;
  font-size: 18px;
  border: none;
  border-radius: 5px;
  outline: none;
  background-color: #cccccc;
  cursor: pointer;
  transition: 0.3s;

  &:hover {
    background-color: #798d87;
  }

  &:active {
    transform: scale(1.05);
  }
}
</style>

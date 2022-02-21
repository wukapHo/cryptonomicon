<template>
  <div class="ticker">
    <label
      class="ticker__label"
      for="ticker"
      >Тикер</label
    >
    <input
      v-model="ticker"
      @keydown="updateIsAdded"
      @blur="updateIsAdded"
      @keydown.enter="addTicker"
      class="ticker__input"
      id="ticker"
      type="text"
      placeholder="Например DOGE"
    >
    <div
      :class="{
        'ticker__error--active': isAdded,
      }"
      class="ticker__error"
      >Такой тикер уже добавлен</div
    >
    <button
      @click="addTicker"
      class="ticker__button"
    >
      Добавить
    </button>
  </div>
</template>

<script>
export default {
  props: {
    isAdded: {
      type: Boolean,
      required: true,
      default: false,
    },
  },

  emits: {
    'add-ticker': (value) => typeof value === 'string' && value.length > 0,
    'update-is-added': null,
  },

  data() {
    return {
      ticker: '',
    };
  },

  methods: {
    addTicker() {
      if (this.ticker.length === 0) return;
      this.$emit('add-ticker', this.ticker);
      this.ticker = '';
    },
    updateIsAdded() {
      this.$emit('update-is-added');
    },
  },
};
</script>

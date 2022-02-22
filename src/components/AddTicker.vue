<template>
  <section class="ticker">
    <label
      class="ticker__label"
      for="ticker"
    >
      Тикер
    </label>
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
    >
      Такой тикер уже добавлен
    </div>
    <button
      @click="addTicker"
      class="ticker__button"
    >
      Добавить
    </button>
  </section>
</template>

<script>
export default {
  props: {
    tickers: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  emits: {
    'add-ticker': (value) => typeof value === 'string' && value.length > 0,
  },

  data() {
    return {
      ticker: '',
      isAdded: false,
    };
  },

  methods: {
    addTicker() {
      if (this.ticker.length === 0) return;
      if (this.tickers.find((t) => t.name.toUpperCase() === this.ticker.toUpperCase())) {
        this.isAdded = true;
        return;
      }
      this.$emit('add-ticker', this.ticker);
      this.ticker = '';
    },
  },

  watch: {
    ticker() {
      this.isAdded = false;
    },
  },
};
</script>

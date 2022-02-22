<template>
  <section
    v-if="tickers.length"
    class="field"
  >
    <div
      v-for="t in paginatedTickers"
      :key="t.name"
      @click="selectTicker(t)"
      :class="{
        'field__item--active': selectedTicker === t,
        'field__item--invalid': t.isInvalid,
      }"
      class="field__item"
    >
      <div class="field__item-title">{{ t.name }} - USD</div>
      <div class="field__item-rate">{{ formatPrice(t.price) }}</div>
      <button
        @click.stop="handleDelete(t)"
        class="field__item-button-delete"
      >
        Удалить
      </button>
    </div>
  </section>
</template>

<script>
import { unsubscribeFromTicker } from '../api';

export default {
  props: {
    tickers: {
      type: Array,
      default() {
        return [];
      },
    },
    paginatedTickers: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  emits: {
    'select-ticker': null,
    'remove-ticker': null,
  },

  data() {
    return {
      selectedTicker: null,
    };
  },

  methods: {
    formatPrice(price) {
      if (price === '-') return price;
      return price > 1
        ? price.toFixed(2)
        : price.toPrecision(2);
    },
    selectTicker(ticker) {
      this.selectedTicker = ticker;
      this.$emit('select-ticker', this.selectedTicker);
    },
    handleDelete(tickerToRemove) {
      const updatedTickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.$emit('reset-selected-ticker');
      }
      this.$emit('remove-ticker', updatedTickers);
      unsubscribeFromTicker(tickerToRemove.name);
    },
  },
};
</script>

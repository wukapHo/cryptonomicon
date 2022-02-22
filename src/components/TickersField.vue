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

<style lang="scss">
.field {
  margin-top: 20px;
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 55px;
  border-top: 3px solid #cccccc;
  border-bottom: 3px solid #cccccc;

  &__item {
    height: 200px;
    width: 30%;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    border: 4px solid transparent;
    border-radius: 10px;
    cursor: pointer;

    &--active {
      border: 4px solid #798d87;
    }

    &--invalid {
      background-color: #f5756b;
    }
  }

  &__item-title {
    text-align: center;
    font-size: 18px;
  }

  &__item-rate {
    text-align: center;
    font-size: 28px;
  }

  &__item-button-delete {
    width: 35%;
    height: 30px;
    padding: 0 10px;
    border: none;
    border-radius: 10px;
    outline: none;
    background: #ffffff url(../assets/cart-icon.svg) no-repeat center left 10px;
    font-size: 16px;
    text-align: right;
    opacity: 0.6;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      opacity: 1;
    }
  }
}
</style>

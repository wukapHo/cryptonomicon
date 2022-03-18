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
      <base-button
        @click.stop="handleDelete(t)"
        class="field__item-button-delete"
      >
        {{ $t('content.delete') }}
      </base-button>
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
    selectedTicker: {
      type: Object,
      default() {
        return {};
      },
    },
  },

  emits: {
    'select-ticker': null,
    'reset-selected-ticker': null,
    'remove-ticker': null,
  },

  methods: {
    formatPrice(price) {
      if (price === '-') return price;
      return price > 1
        ? price.toFixed(2)
        : price.toPrecision(2);
    },
    selectTicker(ticker) {
      this.$emit('select-ticker', ticker);
    },
    handleDelete(tickerToRemove) {
      const updatedTickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.$emit('reset-selected-ticker');
      }
      unsubscribeFromTicker(tickerToRemove.name);
      this.$emit('remove-ticker', updatedTickers);
    },
  },
};
</script>

<style lang="scss">
.field {
  padding: 0 20px 20px;
  display: flex;
  align-items: center;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 20px 5%;
  border-bottom: 3px solid #cccccc;

  @media (max-width: 768px) {
    gap: 20px 6%;
  }

  &__item {
    width: 30%;
    height: 200px;
    padding: 20px;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    gap: 30px;
    border: 4px solid transparent;
    border-radius: 10px;
    cursor: pointer;

    @media (max-width: 768px) {
      width: 47%;
      height: 180px;
      gap: 20px;
    }

    @media (max-width: 420px) {
      width: 100%;
      height: 160px;
    }

    &--active {
      border: 4px solid #798d87;
    }

    &--invalid {
      outline: 4px solid #ff0000;
    }
  }

  &__item-title {
    text-align: center;
    font-size: 18px;

    @media (max-width: 420px) {
      font-size: 16px;
    }
  }

  &__item-rate {
    text-align: center;
    font-size: 28px;

    @media (max-width: 768px) {
      font-size: 26px;
    }

    @media (max-width: 420px) {
      font-size: 22px;
    }
  }
}

.base-button.field__item-button-delete {
  width: 140px;
  text-align: right;
  background-image: url(../assets/cart-icon.svg);
  background-position: center left 20px;
  background-repeat: no-repeat;
}
</style>

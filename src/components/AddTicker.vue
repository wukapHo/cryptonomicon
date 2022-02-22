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
      @blur="isAdded = false"
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

<style lang="scss">
.ticker {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  @media (max-width: 768px) {
    gap: 10px;
  }

  &__label {
    font-size: 18px;
  }

  &__input {
    height: 30px;
    width: 220px;
    padding: 0 15px;
    border: 2px solid transparent;
    outline: none;
    border-radius: 15px;
    font-size: 16px;
    box-shadow: 0px 0px 19px -1px rgba(34, 60, 80, 0.13);

    &:focus {
      border: 2px solid #cccccc;
    }
  }

  &__error {
    color: #fa2020;
    opacity: 0;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    &--active {
      opacity: 1;
    }
  }

  &__button {
    width: 150px;
    height: 40px;
    padding: 0 20px;
    border: none;
    outline: none;
    border-radius: 20px;
    background: #cccccc url(../assets/plus-icon.svg) no-repeat center left 20px;
    color: #ffffff;
    font-size: 18px;
    text-align: right;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #798d87;
    }
  }
}
</style>

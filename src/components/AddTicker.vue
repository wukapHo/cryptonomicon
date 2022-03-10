<template>
  <section class="ticker">
    <label
      class="ticker__label"
      for="ticker"
    >
      Тикер
    </label>
    <div class="">
      <input
        v-model="ticker"
        @blur="isAdded = false"
        @keydown.enter="addTicker(ticker)"
        class="ticker__input"
        id="ticker"
        type="text"
        placeholder="Например BTC"
      >
      <div
        class="ticker__auto"
        :class="{
          'ticker__auto--active': autoCompletionList.length > 0,
        }"
      >
        <div
          v-for="(item, idx) in autoCompletionList"
          :key="idx"
          class="ticker__auto-item"
          @click="addTicker(item)"
        >{{ autoCompletionList[idx] }}</div>
      </div>
    </div>
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
import { getCoinListFromApi } from '../api';

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
    'add-ticker': null,
  },

  data() {
    return {
      ticker: '',
      isAdded: false,
      isInvalid: false,
      coinList: null,
    };
  },

  computed: {
    autoCompletionList() {
      let data = [];
      if (this.ticker !== '') {
        this.coinList.forEach((coin) => {
          if (coin.indexOf(this.ticker.toUpperCase()) === 0) {
            data = [...data, coin];
            if (data.length > 4) {
              data = data.slice(0, 4);
            }
          }
        });
      }
      return data;
    },
  },

  created() {
    this.getCoinList();
  },

  methods: {
    addTicker(tickerName) {
      if (tickerName.length === 0) return;
      if (this.tickers.find((t) => t.name.toUpperCase() === tickerName.toUpperCase())) {
        this.isAdded = true;
        return;
      }

      // eslint-disable-next-line no-restricted-syntax
      if (this.coinList.find((coin) => coin === tickerName.toUpperCase())) {
        this.isInvalid = false;
      } else {
        this.isInvalid = true;
      }

      this.$emit('add-ticker', { ticker: tickerName, isInvalid: this.isInvalid });
      this.ticker = '';
    },
    async getCoinList() {
      const coinData = await getCoinListFromApi();
      // [5][1] to get a list of currencies from the api
      this.coinList = Object.keys(Object.entries(coinData)[5][1]);
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
  display: flex;
  padding: 20px;
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
    font-size: 16px;
    border: 2px solid transparent;
    border-radius: 15px;
    outline: none;
    box-shadow: 0px 0px 19px -1px rgba(34, 60, 80, 0.13);

    &:focus {
      border: 2px solid #cccccc;
    }
  }

  &__auto {
    margin-top: 5px;
    display: flex;
    width: 220px;
    height: 20px;
    padding: 0 10px;
    // opacity: 0;

    // &--active {
    //   opacity: 1;
    // }
  }

  &__auto-item {
    margin-right: 5px;
    padding: 0 5px;
    color: #ffffff;
    font-size: 14px;
    border: 1px solid #ccc;
    border-radius: 5px;
    background-color: #cccccc;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #798d87;
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
    color: #ffffff;
    font-size: 18px;
    text-align: right;
    border: none;
    border-radius: 20px;
    outline: none;
    background: #cccccc url(../assets/plus-icon.svg) no-repeat center left 20px;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #798d87;
    }
  }
}
</style>

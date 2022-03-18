<template>
  <section class="ticker">
    <label
      class="ticker__label"
      for="ticker"
    >
      Тикер
    </label>
    <div class="ticker__input-wrapper">
      <div
        :class="{
          'ticker__error--active': isAdded,
        }"
        class="ticker__error"
      >
        {{ $t('content.tickerError') }}
      </div>
      <base-input
        id="ticker"
        type="text"
        :placeholder="$t('content.tickerPlaceholder')"
        v-model="ticker"
        @update:modelValue="ticker = $event"
        @blur="isAdded = false"
        @keydown.enter="addTicker(ticker)"
      ></base-input>
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
    <base-button
      @click="addTicker(ticker)"
      class="ticker__button"
    >
      {{ $t('content.add') }}
    </base-button>
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
      tipCount: 4,
    };
  },

  computed: {
    autoCompletionList() {
      let data = [];
      if (this.ticker !== '') {
        this.coinList.forEach((coin) => {
          if (coin.indexOf(this.ticker.toUpperCase()) === 0) {
            data = [...data, coin];
            if (data.length > this.tipCount) {
              data = data.slice(0, this.tipCount);
            }
          }
        });
      }
      return data;
    },
  },

  watch: {
    ticker() {
      this.isAdded = false;
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
      // [5][1] to get array list of currencies from the api
      this.coinList = Object.keys(Object.entries(coinData)[5][1]);
    },
  },
};
</script>

<style lang="scss">
.ticker {
  padding: 20px;
  display: flex;
  align-items: center;

  @media (max-width: 768px) {
    flex-direction: column;
    align-items: flex-start;
  }

  &__label {
    display: none;
  }

  &__input-wrapper {
    @media (max-width: 768px) {
      margin: 10px 0;
    }
  }

  &__auto {
    margin-top: 5px;
    display: flex;
    width: 220px;
    height: 20px;
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
    margin-bottom: 5px;
    color: #fa2020;
    opacity: 0;

    @media (max-width: 768px) {
      font-size: 14px;
    }

    &--active {
      opacity: 1;
    }
  }
}

.base-button.ticker__button {
  margin-left: 20px;
  padding-left: 35px;
  background-image: url(../assets/plus-icon.svg);
  background-position: center left 10px;
  background-repeat: no-repeat;

  @media (max-width: 768px) {
    margin-left: 0;
  }
}
</style>

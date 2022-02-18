<template>
  <div class="container">
    <div class="ticker">
      <label
        class="ticker__label"
        for="ticker"
        >Тикер</label
      >
      <input
        v-model="ticker"
        @keydown.enter="addTicker"
        class="ticker__input"
        id="ticker"
        type="text"
        placeholder="Например DOGE"
      >
      <button
        @click="addTicker"
        class="ticker__button"
      >
        Добавить
      </button>
    </div>
    <div class="field"
      v-if="tickers.length"
    >
      <div
        v-for="t in tickers"
        :key="t.name"
        @click="selectTicker(t)"
        :class="{
          'field__item--active': selectedTicker === t,
        }"
        class="field__item"
      >
        <div class="field__item-title">{{ t.name }} - USD</div>
        <div class="field__item-rate">{{ t.price }}</div>
        <button
          @click.stop="handleDelete(t)"
          class="field__item-button-delete"
        >
          Удалить
        </button>
      </div>
    </div>
    <div class="graph"
      v-if="selectedTicker"
    >
      <div class="graph__title">{{ selectedTicker.name }} - USD</div>
      <button class="graph__clear-button"
        @click="clearGraph"
      >
      </button>
      <div class="graph__field">
        <div
          v-for="(bar, idx) in normilizeGraph()"
          :key="idx"
          :style="{ height: `${bar}%` }"
          class="graph__field-item"
        ></div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'App',

  data() {
    return {
      ticker: null,
      tickers: [],
      selectedTicker: null,
      graph: [],
    };
  },

  methods: {
    addTicker() {
      const currentTicker = {
        name: this.ticker,
        price: '-',
      };

      this.tickers.push(currentTicker);
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
      this.subscribeToUpdates(currentTicker.name);
      this.ticker = '';
    },

    subscribeToUpdates(tickerName) {
      setInterval(async () => {
        const res = await fetch(
          `https://min-api.cryptocompare.com/data/price?fsym=${tickerName}&tsyms=USD&api_key=01cc57dbd6f92665196c81d27c44abbf0ba27846387d09ad352a8242a91c7ea2`,
        );
        const data = await res.json();
        this.tickers.find((t) => t.name === tickerName).price = data.USD > 1
          ? data.USD.toFixed(2)
          : data.USD.toPrecision(2);

        if (this.selectedTicker?.name === tickerName) {
          this.graph.push(data.USD);
        }
      }, 3000);
    },

    selectTicker(ticker) {
      this.selectedTicker = ticker;
      this.graph = [];
    },

    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
    },

    normilizeGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);
      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue),
      );
    },

    clearGraph() {
      this.selectedTicker = null;
      this.graph = [];
    },
  },

  created() {
    const tickersData = localStorage.getItem('cryptonomicon-list');

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        this.subscribeToUpdates(ticker.name);
      });
    }
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

.container {
  max-width: 1200px;
  margin: 0 auto;
}

.ticker {
  padding: 20px;
  display: flex;
  flex-direction: column;
  gap: 20px;

  &__label {
    font-size: 18px;
  }

  &__input {
    height: 30px;
    width: 300px;
    padding: 0 15px;
    border: none;
    outline: none;
    border-radius: 15px;
    font-size: 16px;
    box-shadow: 0px 0px 19px -1px rgba(34, 60, 80, 0.13);

    &:focus {
      border: 2px solid #cccccc;
    }
  }

  &__button {
    width: 150px;
    height: 40px;
    padding: 0 20px;
    border: none;
    outline: none;
    border-radius: 20px;
    background: #cccccc url(./assets/plus-icon.svg) no-repeat center left 20px;
    color: #ffffff;
    font-size: 18px;
    text-align: right;
    cursor: pointer;

    &:hover {
      background-color: #798d87;
    }
  }
}

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
    outline: none;
    background: #ffffff url(./assets/cart-icon.svg) no-repeat center left 10px;
    font-size: 16px;
    text-align: right;
    cursor: pointer;
  }
}

.graph {
  width: 100%;
  height: 300px;
  margin-top: 20px;
  position: relative;

  &__title {
    position: absolute;
    top: 20px;
    left: 20px;
  }

  &__clear-button {
    width: 25px;
    height: 25px;
    position: absolute;
    top: 20px;
    right: 20px;
    border: none;
    border-radius: 50%;
    background: #cccccc url(./assets/cross-icon.svg) no-repeat center;
    cursor: pointer;

    &:hover {
      background-color: #798d87;
    }
  }

  &__field {
    height: 300px;
    width: 100%;
    position: absolute;
    bottom: -50px;
    display: flex;
    align-items: flex-end;
    gap: 2px;
    border-bottom: 1px solid #cccccc;
    border-left: 1px solid #cccccc;
  }

  &__field-item {
    width: 40px;
    height: 60%;
    background-color: #798d87;
  }
}
</style>

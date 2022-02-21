<template>
  <div class="container">
    <add-ticker
      @add-ticker="addTicker"
      @update-is-added="isAdded = false"
      :is-added="isAdded"
    />
    <section
      v-if="tickers.length"
      class="interface">
      <div>
        <label
          class="interface__label"
          for="filter-input"
          >Фильтр:</label
        >
        <input
          v-model="filter"
          class="interface__filter"
          id="filter-input"
          type="text"
        >
      </div>
      <div class="interface__buttons">
        <button
          v-show="page > 1"
          @click="page--"
          class="interface__button interface__button--prev"
          >Назад</button>
        <button
          v-show="hasNextPage"
          @click="page++"
          class="interface__button interface__button--next"
          >Вперед</button>
      </div>
    </section>
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
    <section class="graph"
      v-if="selectedTicker"
    >
      <div class="graph__title">{{ selectedTicker.name }} - USD</div>
      <button class="graph__clear-button"
        @click="selectedTicker = null"
      >
      </button>
      <div
        ref="graph"
        class="graph__field"
      >
        <div
          v-for="(bar, idx) in normilizedGraph"
          ref="graphElement"
          :key="idx"
          :style="{ height: `${bar}%` }"
          class="graph__field-item"
        ></div>
      </div>
    </section>
  </div>
</template>

<script>
import { subscribeToTicker, unsubscribeFromTicker } from './api';
import AddTicker from './components/AddTicker.vue';

export default {
  name: 'App',

  components: {
    AddTicker,
  },

  data() {
    return {
      tickers: [],
      selectedTicker: null,

      isAdded: false,

      graph: [],
      maxGraphElements: 1,

      coinList: [],
      page: 1,
      filter: '',
    };
  },

  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());
    const VALID_KEYS = ['filter', 'page'];
    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });

    const tickersData = localStorage.getItem('cryptonomicon-list');

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) => this.updateTicker(ticker.name, newPrice));
      });
    }
  },

  mounted() {
    // this.getCoinList();
    window.addEventListener('resize', this.calculateMaxGraphElements);
  },

  beforeUnmount() {
    // this.getCoinList();
    window.removeEventListener('resize', this.calculateMaxGraphElements);
  },

  computed: {
    startIdx() {
      return 6 * (this.page - 1);
    },
    endIdx() {
      return 6 * this.page;
    },
    filteredTickers() {
      return this.tickers.filter((t) => t.name.includes(this.filter.toUpperCase()));
    },
    paginatedTickers() {
      return this.filteredTickers.slice(this.startIdx, this.endIdx);
    },
    hasNextPage() {
      return this.filteredTickers.length > this.endIdx;
    },
    normilizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (minValue === maxValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue),
      );
    },
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },

  methods: {
    addTicker(ticker) {
      const currentTicker = {
        name: ticker.toUpperCase(),
        price: '-',
      };

      if (this.tickers.find((t) => t.name.toUpperCase() === currentTicker.name.toUpperCase())) {
        this.isAdded = true;
        return;
      }

      currentTicker.isInvalid = subscribeToTicker(
        currentTicker.name,
        (newPrice) => this.updateTicker(currentTicker.name, newPrice),
      );
      // currentTicker.isInvalid = checkValidation();

      this.tickers = [...this.tickers, currentTicker];
      this.filter = '';
    },
    updateTicker(tickerName, price) {
      // TODO: move next call out of here
      this.calculateMaxGraphElements();
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if ((t) === this.selectedTicker) {
            this.graph.push(price);
            if (this.graph.length > this.maxGraphElements) {
              const idxForRemove = this.graph.length - this.maxGraphElements;
              this.graph = this.graph.slice(idxForRemove);
            }
          }
          // eslint-disable-next-line no-param-reassign
          t.price = price;
        });
    },
    calculateMaxGraphElements() {
      if (!this.$refs.graph || !this.$refs.graphElement) return;
      this.maxGraphElements = this.$refs.graph.clientWidth / this.$refs.graphElement[0].clientWidth;
    },
    formatPrice(price) {
      if (price === '-') return price;
      return price > 1
        ? price.toFixed(2)
        : price.toPrecision(2);
    },
    selectTicker(ticker) {
      this.selectedTicker = ticker;
      // this.$nextTick(() => {
      //   this.calculateMaxGraphElements();
      // });
    },
    handleDelete(tickerToRemove) {
      this.tickers = this.tickers.filter((t) => t !== tickerToRemove);
      if (this.selectedTicker === tickerToRemove) {
        this.selectedTicker = null;
        this.graph = [];
      }
      unsubscribeFromTicker(tickerToRemove.name);
    },
    // async getCoinList() {
    //   const res = await fetch(
    //     'https://min-api.cryptocompare.com/data/all/coinlist?summary=true',
    //   );
    //   const data = await res.json();
    //   this.coinList = data.Data;
    // },
  },

  watch: {
    tickers() {
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
    },
    paginatedTickers() {
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    selectedTicker() {
      this.graph = [];
    },
    filter() {
      this.page = 1;
    },
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`,
      );
    },
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: sans-serif;
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
    background: #cccccc url(./assets/plus-icon.svg) no-repeat center left 20px;
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

.interface {
  padding: 20px 20px 0;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 3px solid #cccccc;

  &__filter {
    height: 30px;
    margin-left: 10px;
    padding: 0 10px;
    border: 1px solid #cccccc;
    border-radius: 10px;
    outline: none;
    font-size: 16px;

    &:focus {
      border: 1px solid #000000;
    }
  }

  &__buttons {
    width: 210px;
    height: 30px;
    position: relative;
  }

  &__button {
    width: 100px;
    height: 30px;
    padding: 0 20px;
    border: none;
    outline: none;
    border-radius: 20px;
    background-color: #cccccc;
    color: #ffffff;
    font-size: 18px;
    text-align: center;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      background-color: #798d87;
    }

    &--prev {
      position: absolute;
      left: 0;
    }

    &--next {
      position: absolute;
      right: 0;
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
    background: #ffffff url(./assets/cart-icon.svg) no-repeat center left 10px;
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
    transition: 0.3s;

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

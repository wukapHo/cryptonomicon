<template>
  <div class="container">
    <add-ticker
      :tickers="tickers"
      @add-ticker="addTicker"
    />
    <filter-pagination
      :tickers="tickers"
      @paginate-tickers="paginatedTickers = $event"
    />
    <tickers-field
      :tickers="tickers"
      :paginated-tickers="paginatedTickers"
      :selected-ticker="selectedTicker"
      @select-ticker="selectedTicker = $event; graph = []"
      @remove-ticker="tickers = $event"
      @reset-selected-ticker="selectedTicker = null"
    />
    <ticker-graph
      v-if="selectedTicker"
      :selected-ticker="selectedTicker"
      :graph="graph"
      @reset-selected-ticker="selectedTicker = null"
      @update-max-elements="updateTicker"
      @graph-get-max="graph = graph.slice($event)"
    />
  </div>
</template>

<script>
import { subscribeToTicker } from './api';
import AddTicker from './components/AddTicker.vue';
import FilterPagination from './components/FilterPagination.vue';
import TickersField from './components/TickersField.vue';
import TickerGraph from './components/TickerGraph.vue';

export default {
  name: 'App',

  components: {
    AddTicker,
    FilterPagination,
    TickersField,
    TickerGraph,
  },

  data() {
    return {
      tickers: [],
      paginatedTickers: [],
      selectedTicker: null,
      graph: [],
      coinList: [],
    };
  },

  created() {
    const tickersData = localStorage.getItem('cryptonomicon-list');
    this.paginatedTickers = JSON.parse(localStorage.getItem('cryptonomicon-list-view'));

    if (tickersData) {
      this.tickers = JSON.parse(tickersData);
      this.tickers.forEach((ticker) => {
        subscribeToTicker(ticker.name, (newPrice) => this.updateTicker(ticker.name, newPrice));
      });
    }
  },

  methods: {
    addTicker(tickerData) {
      const currentTicker = {
        name: tickerData.ticker.toUpperCase(),
        price: '-',
        isInvalid: tickerData.isInvalid,
      };

      subscribeToTicker(
        currentTicker.name,
        (newPrice) => this.updateTicker(currentTicker.name, newPrice),
      );

      this.tickers = [...this.tickers, currentTicker];
      this.filter = '';
    },
    updateTicker(tickerName, price) {
      this.tickers
        .filter((t) => t.name === tickerName)
        .forEach((t) => {
          if ((t) === this.selectedTicker) {
            this.graph = [...this.graph, price];
          }
          // eslint-disable-next-line no-param-reassign
          t.price = price;
        });
    },
  },

  watch: {
    tickers() {
      localStorage.setItem('cryptonomicon-list', JSON.stringify(this.tickers));
    },
    paginatedTickers() {
      localStorage.setItem('cryptonomicon-list-view', JSON.stringify(this.paginatedTickers));
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
  max-width: 1240px;
  margin: 0 auto;
  padding: 0 20px;
}
</style>

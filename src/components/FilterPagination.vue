<template>
  <section
    v-if="tickers.length"
    class="interface">
    <div>
      <label
        class="interface__label"
        for="filter-input"
      >
        Фильтр:
      </label>
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
      >
        Назад
      </button>
      <button
        v-show="hasNextPage"
        @click="page++"
        class="interface__button interface__button--next"
      >
        Вперед
      </button>
    </div>
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
    'paginate-tickers': null,
  },

  data() {
    return {
      page: 1,
      tickersPerPage: 6,
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
  },

  computed: {
    startIdx() {
      return this.tickersPerPage * (this.page - 1);
    },
    endIdx() {
      return this.tickersPerPage * this.page;
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
    pageStateOptions() {
      return {
        filter: this.filter,
        page: this.page,
      };
    },
  },

  watch: {
    paginatedTickers() {
      this.$emit('paginate-tickers', this.paginatedTickers);
      if (this.paginatedTickers.length === 0 && this.page > 1) {
        this.page -= 1;
      }
    },
    pageStateOptions(value) {
      window.history.pushState(
        null,
        document.title,
        `${window.location.pathname}?filter=${value.filter}&page=${value.page}`,
      );
    },
    filter() {
      this.page = 1;
    },
  },
};
</script>

<style lang="scss">
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
</style>

<template>
  <section
    v-if="tickers.length"
    class="interface"
  >
    <div>
      <label
        class="interface__label"
        for="filter-input"
      >
        Фильтр:
      </label>
      <base-input
        id="filter-input"
        type="text"
        :placeholder="$t('content.filterPlaceholder')"
        v-model="filter"
        @update:modelValue="filter = $event"
      ></base-input>
    </div>
    <div class="interface__buttons">
      <base-button
        v-show="page > 1"
        @click="page -= 1"
        class="interface__button interface__button--prev"
      >
        {{ $t('content.prev') }}
      </base-button>
      <base-button
        @click="page += 1"
        class="interface__button interface__button--next"
        :class="{ 'visually-hidden': !hasNextPage }"
      >
        {{ $t('content.next') }}
      </base-button>
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

  created() {
    const windowData = Object.fromEntries(new URL(window.location).searchParams.entries());
    const VALID_KEYS = ['filter', 'page'];
    VALID_KEYS.forEach((key) => {
      if (windowData[key]) {
        this[key] = windowData[key];
      }
    });
  },
};
</script>

<style lang="scss">
.interface {
  padding: 20px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-top: 3px solid #cccccc;

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 10px;
    align-items: flex-start;
  }

  &__label {
    display: none;
  }

  &__buttons {
    position: relative;
    height: 30px;
    width: 160px;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    @media (max-width: 420px) {
      width: 100%;
    }
  }

  &__button {
    &:last-child {
      margin-left: 10px;
    }
    // &--prev {
    //   position: absolute;
    //   left: 0;
    // }

    // &--next {
    //   position: absolute;
    //   right: 0;
    // }
  }
}

.visually-hidden {
  visibility: hidden;
}
</style>

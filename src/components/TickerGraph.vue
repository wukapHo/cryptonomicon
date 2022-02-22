<template>
  <section class="graph">
    <div class="graph__title">{{ selectedTicker.name }} - USD</div>
    <button class="graph__clear-button"
      @click="resetSelectedTicker"
    ></button>
    <div
      ref="graph"
      class="graph__field"
    >
      <div
        v-for="(bar, idx) in normalizedGraph"
        ref="graphElement"
        :key="idx"
        :style="{ height: `${bar}%` }"
        class="graph__field-item"
      ></div>
    </div>
  </section>
</template>

<script>

export default {
  props: {
    selectedTicker: {
      type: Object,
      default() {
        return {};
      },
    },
    graph: {
      type: Array,
      default() {
        return [];
      },
    },
  },

  emits: {
    'update-max-elements': null,
    'reset-selected-ticker': null,
    'graph-get-max': null,
  },

  data() {
    return {
      maxGraphElements: 5,
    };
  },

  mounted() {
    window.addEventListener('resize', this.calculateMaxGraphElements);
  },

  beforeUpdate() {
    this.calculateMaxGraphElements();
    this.$emit('update-max-elements', this.maxGraphElements);
  },

  beforeUnmount() {
    window.removeEventListener('resize', this.calculateMaxGraphElements);
  },

  computed: {
    normalizedGraph() {
      const maxValue = Math.max(...this.graph);
      const minValue = Math.min(...this.graph);

      if (minValue === maxValue) {
        return this.graph.map(() => 50);
      }

      return this.graph.map(
        (price) => 5 + ((price - minValue) * 95) / (maxValue - minValue),
      );
    },
  },

  methods: {
    resetSelectedTicker() {
      this.$emit('reset-selected-ticker');
    },
    calculateMaxGraphElements() {
      if (!this.$refs.graph || !this.$refs.graphElement) return;
      this.maxGraphElements = this.$refs.graph.clientWidth / 42;
      // eslint-disable-next-line max-len
      // this.maxGraphElements = this.$refs.graph.clientWidth / this.$refs.graphElement[0].clientWidth;
    },
  },

  watch: {
    graph() {
      if (this.graph.length > this.maxGraphElements) {
        const idxForRemove = Math.ceil(this.graph.length - this.maxGraphElements);
        this.$emit('graph-get-max', idxForRemove);
      }
    },
  },
};
</script>

<style lang="scss">
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
    background: #cccccc url(../assets/cross-icon.svg) no-repeat center;
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

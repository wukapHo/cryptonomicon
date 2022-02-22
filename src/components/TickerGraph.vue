<template>
  <section class="graph">
    <div class="graph__title">{{ selectedTicker.name }} - USD</div>
    <button class="graph__clear-button"
      @click="resetSelectedTicker"
    >
    </button>
    <div
      ref="graph"
      class="graph__field"
      @click="testMethod"
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
      this.maxGraphElements = this.$refs.graph.clientWidth / this.$refs.graphElement[0].clientWidth;
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

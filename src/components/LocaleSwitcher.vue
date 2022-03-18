<template>
  <ul class="switcher">
    <li
      v-for="locale in locales"
      :key="locale"
      class="switcher__item"
      @click="switchLocale(locale)"
    >
      {{ locale }}
    </li>
  </ul>
</template>

<script>
export default {
  name: 'LocaleSwitcher',

  data() {
    return {
      locales: process.env.VUE_APP_I18N_SUPPORTED_LOCALE.split(','),
    };
  },

  created() {
    const currentLocale = localStorage.getItem('currentLocale');
    if (currentLocale) {
      this.switchLocale(currentLocale);
    }
  },

  methods: {
    switchLocale(locale) {
      if (this.$i18n.locale !== locale) {
        this.$i18n.locale = locale;
        localStorage.setItem('currentLocale', locale);
      }
    },
  },
};
</script>

<style lang="scss">
.switcher {
  position: absolute;
  top: 40px;
  right: 40px;
  width: 70px;
  display: flex;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 768px) {
    top: 50px;
  }

  &__item {
    width: 30px;
    height: 30px;
    display: flex;
    align-items: center;
    justify-content: center;
    border: 1px solid #cccccc;
    border-radius: 5px;
    color: #cccccc;
    text-transform: uppercase;
    cursor: pointer;
    transition: 0.3s;

    &:hover {
      color: #ffffff;
      background-color: #cccccc;
    }

    &:active {
      transform: scale(1.1);
    }
  }
}
</style>

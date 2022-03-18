import { createApp } from 'vue';
import App from './App.vue';
import UIComponents from './components/UI/index';
import i18n from './i18n';

const app = createApp(App);

UIComponents.forEach((component) => {
  app.component(component.name, component);
});

app
  .use(i18n)
  .mount('#app');

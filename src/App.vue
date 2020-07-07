<template>
  <div id="app">
    <Overview />
  </div>
</template>

<script>
import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';
import Overview from './components/Overview.vue';

export default {
  name: 'App',
  components: {
    Overview,
  },
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

@font-face {
  font-family: 'NunitoSans';
  src: url('./assets/font/NunitoSans-Regular.ttf');
  src: local('NunitoSans Regular'), local('NunitoSans-Regular'),
    url('./assets/font/NunitoSans-Regular.ttf') format('opentype');
  font-weight: normal;
  font-style: normal;
}

@font-face {
  font-family: 'NunitoSans';
  src: url('./assets/font/NunitoSans-SemiBold.ttf');
  src: local('NunitoSans SemiBold'), local('NunitoSans-SemiBold'),
    url('./assets/font/NunitoSans-SemiBold.ttf') format('opentype');
  font-weight: 600;
  font-style: normal;
}

@font-face {
  font-family: 'NunitoSans';
  src: url('./assets/font/NunitoSans-Bold.ttf');
  src: local('NunitoSans Bold'), local('NunitoSans-Bold'),
    url('./assets/font/NunitoSans-Bold.ttf') format('opentype');
  font-weight: bold;
  font-style: normal;
}

body {
  font-family: 'NunitoSans', sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

.carousel-caption {
  background-color: rgba(0, 0, 0, 0.2);
  padding: 20px;
}

.badge {
  padding: 8px;
  white-space: normal;
  line-height: 1.2em;
  cursor: pointer;
  margin: 0 5px 5px 0;
  text-align: left;
  background-color: #e6e6e6;

  &:hover {
    background: #202020;
    color: #ffffff;
  }
}
</style>

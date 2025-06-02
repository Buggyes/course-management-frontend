<template>
  <div id="app">
    <router-view :key="$route.fullPath" />
  </div>
</template>

<script lang="ts">
import { Options, Vue } from 'vue-class-component';
import Login from './components/Login/Login.vue';

@Options({
  components: {
    Login
  },
})
export default class App extends Vue {}
</script>

<style>
html, body{
  height: 100%;
  margin: 0;
}
#app {
  font-family: Arial, Helvetica, sans-serif;
  min-height: 100%;
}
</style>

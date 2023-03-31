<!--
 * @LastEditTime: 2023-03-31 12:06:11
 * @Descripttion: 
-->
<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
export default {
  name: 'App',
  methods: {
    connectionSignalR() {
      if (this.$signalR && !this.$signalR.connectionBuilder['_connectionStarted']) {
        this.$signalR.connectionBuilder.start();
      }
    },
  },
  created() {
    this.connectionSignalR();
  },
};
</script>

<style>
#app {
  width: 100%;
  height: 100%;
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}
* {
  box-sizing: border-box;
  margin: 0px;
  padding: 0px;
}
</style>

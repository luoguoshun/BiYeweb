<template>
  <div id="app">
    <RouterView />
  </div>
</template>

<script>
export default {
  name: 'App',
  created() {
    // if (this.$signalR.connection['_connectionState'] !== 'Disconnected') {
    //   this.$signalR.connection.stop();
    // }
  },
};
</script>

<style>
#app {
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

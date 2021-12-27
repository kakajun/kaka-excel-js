<template>
  <div id="app">
    <export-demo></export-demo>
  </div>
</template>

<script>
import ExportDemo from './exportDemo.vue'

export default {
  name: 'App',
  components: { ExportDemo },
  methods: {}
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  padding: 100px;
  width: 100%;
}
</style>

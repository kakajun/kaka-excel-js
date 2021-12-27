
<template>
  <div id="app">
    <div class="demo">
      <export-demo></export-demo>
    </div>
  </div>
</template>

<script>
import ExportDemo from './components/exportDemo'

export default {
  name: 'App',
  components: { ExportDemo },
  methods:{

  }
}
</script>

<style>
#app {
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 100vw;
}
.header {
  display: flex;
  justify-content: center;
  align-items: center;
  background: #eee;
  width: 100%;
  height: 230px;
}
.logo {
  width: 600px;
  object-fit: contain;
}
.demo {
  margin: 20px 0;
  width: 1600px;
}
.demo > h3 {
  margin-bottom: 20px;
}
.address {
  display: flex;
  margin: 20px 0;
  width: 1200px;
  font-weight: bold;
}
.address > a {
  color: #ff7e00;
}
</style>

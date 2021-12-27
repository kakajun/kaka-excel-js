import Vue from 'vue'
import App from './App.vue'
import 'vxe-table/lib/style.css'
import VXETable from 'vxe-table'
Vue.use(VXETable)
Vue.config.productionTip = false
new Vue({
  render: h => h(App),
}).$mount('#app')

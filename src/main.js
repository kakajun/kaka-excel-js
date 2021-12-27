import Vue from 'vue'
import App from './App.vue'
import 'xe-utils'
import 'vxe-table/lib/style.css'
import VXETablePluginExportXLSX from 'vxe-table-plugin-export-xlsx'
import VXETable from 'vxe-table'
Vue.use(VXETable)
Vue.config.productionTip = false
VXETable.use(VXETablePluginExportXLSX)
new Vue({
  render: h => h(App),
}).$mount('#app')

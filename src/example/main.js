/*
 * @Author: zouzheng
 * @Date: 2020-04-30 11:23:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-25 11:54:28
 * @Description: 这是XXX组件（页面）
 */
import Vue from 'vue'
import App from './App.vue'
import 'xe-utils'
import './assets/css/base.css'
import 'vxe-table/lib/style.css'
import VXETablePluginExportXLSX from './vxe-table-plugin-export-xlsx.js'
import VXETable from 'vxe-table'
Vue.use(VXETable)
Vue.config.productionTip = false
VXETable.use(VXETablePluginExportXLSX)
new Vue({
  render: h => h(App),
}).$mount('#app')

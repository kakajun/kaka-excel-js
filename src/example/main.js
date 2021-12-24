/*
 * @Author: zouzheng
 * @Date: 2020-04-30 11:23:07
 * @LastEditors: Please set LastEditors
 * @LastEditTime: 2021-12-21 18:40:58
 * @Description: 这是XXX组件（页面）
 */
import Vue from 'vue'
import App from './App.vue'
import 'xe-utils'
import './assets/css/base.css'
import 'vxe-table/lib/style.css'
const vxeTable = require('vxe-table')
Vue.use(vxeTable.default || vxeTable)
Vue.config.productionTip = false

new Vue({
  render: h => h(App),
}).$mount('#app')

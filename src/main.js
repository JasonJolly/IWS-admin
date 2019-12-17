// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import AFTableColumn from 'af-table-column'
import axios from 'axios'
import FileSaver from 'file-saver'
import XLSX from 'xlsx'
import echarts from 'echarts'
import 'echarts/theme/dark.js'
import App from './App'
import router from './router'


Vue.use(ElementUI)
Vue.use(XLSX)
Vue.use(AFTableColumn)
axios.defaults.baseURL='https://www.kriws.com:13148'
Vue.prototype.$axios = axios
Vue.prototype.$echarts = echarts
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router,
  components: { App },
  template: '<App/>'
})

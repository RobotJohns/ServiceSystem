import store from './store/index'
import moment from "moment"
import httpHelper from './utils/httpHelper';
import {
  EventBus
} from './utils/eventBus'
import * as echarts from 'echarts';
export default {
  async install(Vue, option) {
    moment.locale('zh-cn');
    Vue.prototype.$eventBus = new Vue();
    Vue.prototype.$stroe = store;
    Vue.prototype.$moment = moment;
    Vue.prototype.$httpHelper = httpHelper;
    Vue.prototype.$EventBus = EventBus;
    await store.dispatch('core/loadStorage');


    //console.log('vue new Date():', new Date().toString())
    //console.log('vue new Date():', new Date().getHours())

    Vue.prototype.$echarts = echarts;
    Vue.use(echarts)
  }
}

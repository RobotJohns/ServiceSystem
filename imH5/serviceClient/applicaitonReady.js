import Vue from 'vue'
import moment from "moment"
import store from '@/store/index.js'
import httpHelper from './utils/httpHelper.js'
import {
	EventBus
} from './utils/eventBus'

export default {
	async install(Vue, option) {
		moment.locale('zh-cn');
		Vue.prototype.$store = store;
		Vue.prototype.$httpHelper = httpHelper;
		Vue.prototype.$moment = moment;
		Vue.prototype.$EventBus = EventBus;
	}
}
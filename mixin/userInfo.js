import store from '@/store/index.js';
import {mapGetters} from "vuex";
export default {
	computed: {
		...mapGetters('user',['userInfo','isLogined'])
	}
}
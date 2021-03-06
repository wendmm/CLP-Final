import axios from "axios";
import store from "../store/store";

export default () => {
	return axios.create({
		// baseURL: `http://192.168.8.106:3000/`,
		baseURL: `http://192.168.43.221:3000/`,
		headers: {
			Authorization: `Bearer ${store.state.adminToken}`,
		},
	});
};

// Dependencies
import axios from 'axios';

const baseUrl = import.meta.env.VITE_REACT_APP_API_URL;
// const baseUrl = 'https://9360-181-143-211-148.ngrok-free.app';

axios.interceptors.request.use(
	(config) => {
		config.headers['Authorization'] = `Bearer ${localStorage.getItem('token')}`;
		return config;
	},

	(error) => {
		return Promise.reject(error);
	},
);

const getUsers = async (page) => {
	console.log(page);
	try {
		const response = await axios.get(`${baseUrl}user`, {
			headers: {
				'ngrok-skip-browser-warning': true,
			},
		});
		if (response.status === 204) return 204;
		const data = {data: response.data.data, pages: response.data.links}
		return data;
	} catch (error) {
		console.error('Ha ocurrido un error', error);
	}
};

const filterUsers = async (condition) => {
	const { input, userState, role } = condition;
	const state = userState === '*' ? '' : userState;
	const userRole = role === '*' ? '' : role;
	if (condition !== null) {
		console.log('Request: ', condition);
		if (userState !== '' && role === '' && input === '') {
			try {
				const response = await axios.get(
					`${baseUrl}user?filter[state]=${state}`,
					{
						headers: { 'ngrok-skip-browser-warning': true },
					},
				);
				console.log('mixed filter: ', response.data.data);
				console.log(response.status);
				if (response.status === 204) return 204;
				return response.data.data;
			} catch (error) {
				console.error(error);
			}
		} else if (role !== '' && userState === '' && input === '') {
			const response = await axios.get(
				`${baseUrl}user?filter[role_id]=${userRole}`,
				{
					headers: { 'ngrok-skip-browser-warning': true },
				},
			);
			console.log('mixed filter: ', response.data.data);
			console.log(response.status);
			if (response.status === 204) return 204;
			return response.data.data;
		} else if (role !== '' && (userState !== '') && (input === '')) {
			const response = await axios.get(
				`${baseUrl}user?filter[state]=${state}&filter[role_id]=${userRole}`,
				{
					headers: { 'ngrok-skip-browser-warning': true },
				},
			);
			console.log('mixed filter: ', response.data.data);
			console.log(response.status);
			if (response.status === 204) return 204;
			return response.data.data;
		} else if (input !== '') {
			console.log('by coincidence');
			try {
				const response = await axios.get(`${baseUrl}user/filter/${input}`, {
					headers: { 'ngrok-skip-browser-warning': true },
				});
				console.log('coincidence: ', response.data.data);
				console.log(response.status === 204 && response.status);
				if (response.status === 204) return 204;
				return response.data.data;
			} catch (error) {
				console.error(error);
			}
		}
	}
};

const deactivateUser = async (userId) => {
	try {
		const response = await axios.put(`${baseUrl}users/${userId}`, { state: 0 });
		return response;
	} catch (error) {
		throw error;
	}
};

const activateUser = async (userId) => {
	try {
		const response = await axios.put(`${baseUrl}users/${userId}`, { state: 1 });
		return response;
	} catch (error) {
		throw error;
	}
};

export { getUsers, filterUsers, activateUser, deactivateUser };

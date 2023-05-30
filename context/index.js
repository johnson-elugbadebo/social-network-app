import { useState, createContext, useEffect } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';

const UserContext = createContext();

const UserProvider = function ({ children }) {
	const [state, setState] = useState({ user: {}, token: '' });

	// User closes browser but comes back to website, site re-renders
	// Data is still in local storage, and we populate data into global state
	useEffect(() => {
		setState(JSON.parse(window.localStorage.getItem('auth')));
	}, []);

	const router = useRouter();

	const token = state && state.token ? state.token : '';
	// Axios config
	axios.defaults.baseURL = '/api/v1';
	axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

	// Add an Axios response interceptor to logout user after expired jwt
	axios.interceptors.response.use(
		function (response) {
			// Any status code that lie within the range of 2xx cause this function to trigger
			// Do something with response data
			return response;
		},
		function (error) {
			// Any status codes that falls outside the range of 2xx cause this function to trigger
			// Do something with response error

			if (
				error.response.status === 401 &&
				error.response.config &&
				!error.response.config.__isRetryRequest
			) {
				setState(null);
				window.localStorage.removeItem('auth');
				router.push('/login');
			}
			return Promise.reject(error);
		}
	);

	return <UserContext.Provider value={[state, setState]}>{children}</UserContext.Provider>;
};

export { UserContext, UserProvider };

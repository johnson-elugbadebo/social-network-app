import { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { useRouter } from 'next/router';
import { SyncOutlined } from '@ant-design/icons';
import { UserContext } from '../context/index.js';

function AdminRoute({ children }) {
	const [ok, setOk] = useState(false);
	const [state] = useContext(UserContext);
	const router = useRouter();

	useEffect(() => {
		if (state && state.token) getCurrentAdmin();
	}, [state && state.token]);

	const getCurrentAdmin = async function () {
		try {
			// Don't need "/api/v1" in endpoint because of axios config baseURL
			// Remove headers.authorization because of axios config headers
			const { data } = await axios.get('/auth/current-admin');
			if (data.ok) {
				setOk(true);
			}
		} catch (error) {
			router.push('/');
		}
	};

	process.browser &&
		state === null &&
		setTimeout(() => {
			getCurrentAdmin();
		}, 1000);

	return !ok ? (
		<SyncOutlined spin className='d-flex justify-content-center display-1 text-primary p-5' />
	) : (
		<>{children}</>
	);
}
export default AdminRoute;

import { UserProvider } from '../context/index.js';
import 'bootstrap/dist/css/bootstrap.min.css';
import Navbar from '../components/Navbar';
import Head from 'next/head';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'antd/dist/reset.css';

function MyApp({ Component, pageProps }) {
	return (
		<UserProvider>
			<Navbar />
			<ToastContainer position='top-center' />
			<Component {...pageProps} />
		</UserProvider>
	);
}

export default MyApp;

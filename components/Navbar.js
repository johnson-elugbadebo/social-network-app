import { UserContext } from '../context/index.js';
import { useContext, useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/router';
import { Avatar } from 'antd';

function Navbar() {
	const [state, setState] = useContext(UserContext);
	const [current, setCurrent] = useState('');

	useEffect(() => {
		process.browser && setCurrent(window.location.pathname);
	}, [process.browser && window.location.pathname]);

	// console.log('Current ==>', current);

	const router = useRouter();

	const logout = function () {
		window.localStorage.removeItem('auth');
		setState(null);
		router.push('/login');
	};

	return (
		<nav className='nav d-flex justify-content-between' style={{ backgroundColor: 'blue' }}>
			<Link href='/' legacyBehavior>
				<a className={`nav-link text-light ${current === '/' && 'active'}`}>
					<Avatar src='/images/logo.png' /> MERNSTACK APP
				</a>
			</Link>

			{state !== null ? (
				<>
					<div className='dropdown'>
						<a
							className='btn dropdown-toggle text-light'
							role='button'
							data-bs-toggle='dropdown'
							aria-expanded='false'>
							{state.user.name}
						</a>
						<ul className='dropdown-menu' aria-labelledby='dropdownMenuLink'>
							<li>
								<Link href='/user/dashboard' legacyBehavior>
									<a
										className={`nav-link dropdown-item ${
											current === '/user/dashboard' && 'active'
										}`}>
										Dashboard
									</a>
								</Link>
							</li>
							<li>
								<Link href='/user/profile/update' legacyBehavior>
									<a
										className={`nav-link dropdown-item ${
											current === '/user/profile/update' && 'active'
										}`}>
										Profile
									</a>
								</Link>
							</li>

							{state.user.role === 'Admin' && (
								<li>
									<Link href='/admin/admindashboard' legacyBehavior>
										<a className={`nav-link dropdown-item ${current === '/admin' && 'active'}`}>
											Admin
										</a>
									</Link>
								</li>
							)}

							<li>
								<a onClick={logout} className='nav-link pointer'>
									Logout
								</a>
							</li>
						</ul>
					</div>
				</>
			) : (
				<>
					<Link href='/login' legacyBehavior>
						<a className={`nav-link text-light ${current === '/login' && 'active'}`}>Login</a>
					</Link>

					<Link href='/register' legacyBehavior>
						<a className={`nav-link text-light ${current === '/register' && 'active'}`}>Register</a>
					</Link>
				</>
			)}
		</nav>
	);
}
export default Navbar;

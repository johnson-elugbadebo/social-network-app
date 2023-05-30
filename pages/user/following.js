import { Avatar, List } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/index.js';
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
import { toast } from 'react-toastify';

function Following() {
	const [state, setState] = useContext(UserContext);
	const router = useRouter();

	// people
	const [people, setPeople] = useState([]);

	useEffect(() => {
		if (state && state.token) {
			fetchFollowing();
		}
	}, [state && state.token]);

	// console.log(people);

	const fetchFollowing = async function () {
		try {
			const response = await axios.get('/auth/user-following');
			// console.log('Following List ===>', response.data.following);
			setPeople(response.data.following);
		} catch (error) {
			console.log(error);
		}
	};

	const imageSource = function (user) {
		if (user.image) {
			return user.image.url;
		} else {
			return '/images/logo.png';
		}
	};

	const handleUnFollow = async function (user) {
		try {
			const response = await axios.put('/auth/user-unfollow', { _id: user._id, name: user.name });
			console.log('Handle UnFollow Response ===>', response.data);
			// Update local storage, update user, keep token
			let auth = JSON.parse(localStorage.getItem('auth'));
			auth.user = response.data.user;
			localStorage.setItem('auth', JSON.stringify(auth));
			// Update context
			setState({ ...state, user: response.data.user });
			// Update people state to remove person we just followed

			// console.log(typeof people); people is an object
			// let newPeople = Object.values(people.people);

			let filtered = people.filter((p) => p._id !== user._id);
			setPeople(filtered);
			console.log(filtered);

			// Toast notification
			toast.success(response.data.success);
		} catch (error) {
			console.log(error);
			toast.error(response.data.error);
		}
	};

	return (
		<div className='row col-md-6 offset-md-3'>
			{/* <pre>{JSON.stringify(people, null, 4)}</pre> */}
			<List
				itemLayout='horizontal'
				dataSource={people}
				renderItem={(user) => (
					<List.Item>
						<List.Item.Meta
							avatar={<Avatar src={imageSource(user)} />}
							title={
								<div className='d-flex justify-content-between'>
									{user.username}{' '}
									<span
										onClick={() => {
											handleUnFollow(user);
										}}
										className='text-primary pointer'>
										Unfollow
									</span>
								</div>
							}
						/>
					</List.Item>
				)}
			/>

			<Link href='/user/dashboard' legacyBehavior>
				<a className='d-flex justify-content-center pt-5'>
					<RollbackOutlined />
				</a>
			</Link>
		</div>
	);
}
export default Following;

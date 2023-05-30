import { Avatar, Card } from 'antd';
import { useRouter } from 'next/router';
import { useContext, useState, useEffect } from 'react';
import { UserContext } from '../../context/index.js';
import axios from 'axios';
import { RollbackOutlined } from '@ant-design/icons';
import Link from 'next/link';
const { Meta } = Card;
import moment from 'moment';

function Username() {
	const [state, setState] = useContext(UserContext);
	const router = useRouter();

	// people
	const [user, setUser] = useState({});

	useEffect(() => {
		if (router.query.username) {
			fetchUser();
		}
	}, [router.query.username]);

	const fetchUser = async function () {
		try {
			const response = await axios.get(`/auth/user/${router.query.username}`);
			// console.log('Router Query Username ===>', response.data.user);
			setUser(response.data.user);
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

	return (
		<div className='row col-md-6 offset-md-3'>
			{/* <pre>{JSON.stringify(user, null, 4)}</pre> */}

			<div className='pt-5 pb-5'>
				<Card hoverable cover={<img src={imageSource(user)} atl={user.name} />}>
					<Meta title={user.name} description={user.about} />
					<p className='pt-2 text-muted'>Joined {moment(user.createdAt).fromNow()}</p>
					<div className='d-flex justify-content-between'>
						<span className='btn btn-sm'>{user.followers && user.followers.length} Followers</span>
						<span className='btn btn-sm'>{user.following && user.following.length} Following</span>
					</div>
				</Card>

				<Link href='/user/dashboard' legacyBehavior>
					<a className='d-flex justify-content-center pt-5'>
						<RollbackOutlined />
					</a>
				</Link>
			</div>
		</div>
	);
}
export default Username;

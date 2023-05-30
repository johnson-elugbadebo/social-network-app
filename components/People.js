import { useContext } from 'react';
import { Avatar, List } from 'antd';
import { useRouter } from 'next/router';
import { UserContext } from '../context/index.js';
import { imageSource } from '../utils/index.js';
import Link from 'next/link';

const People = ({ people, handleFollow, handleUnFollow }) => {
	const [state] = useContext(UserContext);

	const router = useRouter();

	return (
		<>
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
									<Link href={`/user/${user.username}`} legacyBehavior>
										<a>{user.username}</a>
									</Link>
									{/* {JSON.stringify(user)} */}
									{state &&
									state.user &&
									user.followers &&
									user.followers.includes(state.user._id) ? (
										<span onClick={() => handleUnFollow(user)} className='text-primary pointer'>
											Unfollow
										</span>
									) : (
										<span onClick={() => handleFollow(user)} className='text-primary pointer'>
											Follow
										</span>
									)}
								</div>
							}
						/>
					</List.Item>
				)}
			/>
		</>
	);
};

export default People;

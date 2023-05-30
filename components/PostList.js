import { useContext } from 'react';
import { Avatar } from 'antd';
import moment from 'moment';
import parse from 'html-react-parser';
import PostImage from './PostImage';
import {
	HeartOutlined,
	HeartFilled,
	CommentOutlined,
	EditOutlined,
	DeleteOutlined,
} from '@ant-design/icons';
import { UserContext } from '../context/index.js';
import { useRouter } from 'next/router';
import { imageSource } from '../utils/index.js';
import Link from 'next/link';
import Post from './Post';

function PostList({ posts, handleDelete, handleLike, handleUnLike, handleComment, removeComment }) {
	const [state] = useContext(UserContext);
	const router = useRouter();

	return (
		<>
			{posts &&
				posts.map((post) => (
					<Post
						key={post._id}
						post={post}
						handleDelete={handleDelete}
						handleLike={handleLike}
						handleUnLike={handleUnLike}
						handleComment={handleComment}
						removeComment={removeComment}
					/>
				))}
		</>
	);
}
export default PostList;

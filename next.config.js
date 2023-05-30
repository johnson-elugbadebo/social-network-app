export const reactStrictMode = true;
export const eslint = {
	ignoreDuringBuilds: true,
};
export async function rewrites() {
	return [
		{
			source: '/api/:slug*',
			destination: 'http://localhost:5000/api/:slug*',
		},
	];
}

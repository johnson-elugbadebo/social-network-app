export const reactStrictMode = true;
export const eslint = {
	ignoreDuringBuilds: true,
};
export async function rewrites() {
	return [
		{
			source: '/api/:slug*',
			destination: 'http://127.0.0.1:8080/api/:slug*',
		},
	];
}

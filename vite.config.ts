import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';
import { viteStaticCopy } from 'vite-plugin-static-copy'

// https://vite.dev/config/
export default defineConfig({
	plugins: [react(),
		viteStaticCopy({
		targets: [
			{
			src: 'public/*',
			dest: './'
			}
		]
		})
	],
	base: process.env.NODE_ENV === 'production' ? '/Diplom/' : '/',
	build: {
		outDir: 'dist',
		assetsDir: 'assets'
	},
	publicDir: 'public',
})

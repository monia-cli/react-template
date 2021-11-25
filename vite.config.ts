import fs from 'fs'
import { resolve } from 'path'
import { defineConfig } from 'vite'
import reactRefresh from '@vitejs/plugin-react-refresh'
import { viteMockServe } from 'vite-plugin-mock'
import styleImport from 'vite-plugin-style-import'
import lessToJS from 'less-vars-to-js'

const customTheme = lessToJS(fs.readFileSync(resolve(__dirname, './src/config/theme.less'), 'utf8'))

// https://vitejs.dev/config/
export default defineConfig({
	resolve: {
		alias: {
			'@src': resolve(__dirname, './src'),
			'@assets': resolve(__dirname, './src/assets'),
			'@components': resolve(__dirname, './src/components'),
			'@pages': resolve(__dirname, './src/pages'),
			'@uitls': resolve(__dirname, './src/uitls'),
			'@styles': resolve(__dirname, './src/styles'),
			'@config': resolve(__dirname, './src/config')
		}
	},
	plugins: [
		reactRefresh(),
		// mock
		viteMockServe({
			mockPath: 'mock',
			localEnabled: true
		}),
		// antd 按需引入
		styleImport({
			libs: [
				{
					libraryName: 'antd',
					resolveStyle: (name) => `antd/es/${name}/style`
				}
			]
		})
	],
	css: {
		preprocessorOptions: {
			less: {
				javascriptEnabled: true,
				modifyVars: customTheme
			}
		},
		modules: {}
	},
	build: {
		target: 'es2015',
		minify: 'terser',
		cssCodeSplit: true,
		rollupOptions: {
			plugins: []
		}
	},
	server: {
		proxy: {
			'/api': {
				target: 'http://192.168.3.75:30383',
				changeOrigin: true,
				rewrite: (path: string) => path.replace(/^\/api/, '')
			}
		},
		hmr: {
			overlay: false
		}
	}
})

import React from 'react'
import Router from './router'
import dva from './utils/dva'
import models from './models'
import { ConfigProvider } from 'antd'
import 'moment/locale/zh-cn'
import zhCN from 'antd/es/locale/zh_CN'
import { connectRouter, routerMiddleware, ConnectedRouter } from 'connected-react-router'
import './App.css'

const createHistory = require('history').createBrowserHistory
export const history = createHistory()
export const routerReducer = connectRouter(history)
export const routerMiddlewareForDispatch = routerMiddleware(history)

export const app = dva({
	models,
	initState: {},
	extraReducers: { router: routerReducer },
	onAction: [routerMiddlewareForDispatch]
})

const f: React.FC = app.start(
	<ConnectedRouter history={history}>
		<ConfigProvider locale={zhCN}>
			<Router />
		</ConfigProvider>
	</ConnectedRouter>
)

export default f

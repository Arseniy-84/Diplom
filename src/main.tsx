import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { Error } from './pages/Error/Error.tsx';
import { AuthAdmin } from './pages/AuthAdmin/AuthAdmin.tsx'
import { AdminLayout } from './layout/AdminLayout/AdminLayout.tsx';
import { Admin } from './pages/Admin/Admin.tsx'
import { Provider } from 'react-redux';
import { store } from './store/store.ts';
import { ClientLayout } from './layout/ClienLayout/ClientLayout.tsx';
import { MainClient } from './pages/MainClient/MainClient.tsx';
import { HallClient } from './pages/HallClient/HallClient.tsx';
import { PaymentClient } from './pages/PaymentClient/PaymentClient.tsx';
import { NavigationProvider } from './context/NavigationProvider.tsx';
import { App } from './App.tsx';

const router = createBrowserRouter([
	{
	path: '/',
	element: <ClientLayout />,
	children: [
		{
			path: '/',
			element: <MainClient />
		},
		{
			path: 'hallconfig',
			element: <HallClient />
		},
		{
			path: 'payment',
			element: <PaymentClient />
		},
	]
	},
	{
	path: '/admin',
	element: <AdminLayout />,
	children: [
		{
			path: 'login',
			element: <AuthAdmin />
		},
		{
			path: 'cabinet',
			element: <Admin />
		}
	]
		},
		{
		path: '*',
		element: <Error />
		}], 
	{
		basename: process.env.NODE_ENV === 'production' ? '/Diplom' : '/',
	}
)

createRoot(document.getElementById('root')!).render(
	<StrictMode>
		<Provider store={store}>
			<NavigationProvider>
				<App>
					<RouterProvider router={router}/>
				</App>
			</NavigationProvider>
		</Provider>      
	</StrictMode>,
)

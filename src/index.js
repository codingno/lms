/* eslint-disable no-unused-vars */
// scroll bar
import 'simplebar/src/simplebar.css';
import React from 'react';
import ReactDOM from 'react-dom';
import { BrowserRouter } from 'react-router-dom';
import { HelmetProvider } from 'react-helmet-async';
import { Provider } from 'react-redux'
import createStore from './store';
import AdapterDateFns from '@mui/lab/AdapterDateFns';
import LocalizationProvider from '@mui/lab/LocalizationProvider';
import idLocale from 'date-fns/locale/id'

//
import App from './App';
import * as serviceWorker from './serviceWorker';
import reportWebVitals from './reportWebVitals';

// ----------------------------------------------------------------------

const store = createStore()

const getUserInfo = localStorage.getItem("getUserInfo");
store.dispatch({type : 'getUserInfo', data : JSON.parse(getUserInfo)})

ReactDOM.render(
			<LocalizationProvider dateAdapter={AdapterDateFns} >
	<HelmetProvider>
		<Provider store={ store } >
			<BrowserRouter>
				<App />
			</BrowserRouter>
		</Provider>
	</HelmetProvider>
			</LocalizationProvider>
	,
  document.getElementById('root')
);

// If you want to enable client cache, register instead.
serviceWorker.unregister();

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();

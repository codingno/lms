// react
import { useState, useEffect } from 'react';
// routes
import Router from './routes';
import { useNavigate } from 'react-router-dom';
// theme
import ThemeConfig from './theme';
import GlobalStyles from './theme/globalStyles';
// components
import ScrollToTop from './components/ScrollToTop';
import { BaseOptionChartStyle } from './components/charts/BaseOptionChart';

// data
import { useSelector, useDispatch } from 'react-redux';
import axios from 'axios';

// ----------------------------------------------------------------------

export default function App() {
	const dispatch = useDispatch()
	const navigate = useNavigate()
	const [loading, setLoading] = useState(true)
	const { user } = useSelector(state => state)
	const path = window.location.pathname 

	useEffect(() => {
		async function getUserInfoMethod() {
			try {
				const getUserInfo = await axios.get('/api/auth/info')
				if(getUserInfo.data)	{
					localStorage.setItem('getUserInfo', JSON.stringify(getUserInfo.data.user));
					dispatch({ type : 'getUserInfo', data : getUserInfo.data.user })
					if(path.indexOf('/dashboard/courses') === 0){
						if(path.indexOf(getUserInfo.data.user.role) < 0){
							let newPath = '/dashboard/courses/'+ (getUserInfo.data.user.role_id == 3 ? 'teacher' : getUserInfo.data.user.role)
							navigate(newPath)
						}
						else
							navigate(path)
					}
					else
						navigate(path)
				}
				else if(path.indexOf('/register') === 0) {
					localStorage.removeItem("getUserInfo")
					localStorage.clear()
					dispatch({type : 'logout'})
					navigate(path)
				}
				else if(path.indexOf('/resetPassword') === 0){
					const token = path.slice(15)
					localStorage.removeItem("getUserInfo")
					localStorage.clear()
					dispatch({type : 'logout'})
					try {
						const validToken = await axios.get('/api/checkResetToken/'+token)
						if(validToken)
							navigate(path)
					} catch (error) {
						alert('Invalid Token')
						navigate('/login')
					}
				}
				else {
					localStorage.removeItem("getUserInfo")
					localStorage.clear()
					dispatch({type : 'logout'})
					navigate('/login')
				}
				setLoading(false)
			} catch(err) {
				alert(err)
			}
		}
		getUserInfoMethod()
	}, [])

	if(loading)
		return ""

  return (
    <ThemeConfig>
      <ScrollToTop />
      <GlobalStyles />
      <BaseOptionChartStyle />
      <Router />
    </ThemeConfig>
  );
}

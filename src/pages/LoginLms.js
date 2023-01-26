import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Card, Stack, Link, Container, Typography, CircularProgress } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { MHidden } from '../components/@material-extend';
import LoginForm from '../components/authentication/login/LoginFormLms';
import AuthSocial from '../components/authentication/AuthSocial';
import { mockImgCover } from '../utils/mockImages';
import { useState, useEffect } from 'react';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
import CancelIcon from '@mui/icons-material/Cancel';
// material
import {
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';
import axios from 'axios';
import { useSelector, useDispatch } from "react-redux";
import './css/login.css'

// ----------------------------------------------------------------------

const RootStyle = styled(Page)(({ theme }) => ({
  [theme.breakpoints.up('md')]: {
    display: 'flex'
  },
  backgroundImage: `url(${mockImgCover('uiii_bg')})`,
  backgroundRepeat: 'no-repeat',
  backgroundSize: 'cover',
  minHeight: '100vh',
  width: '100%',
}));

const SectionStyle = styled(Card)(({ theme }) => ({
  width: '100%',
  maxWidth: 464,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  margin: theme.spacing(2, 0, 2, 2)
}));

const ContentStyle = styled('div')(({ theme }) => ({
  // maxWidth: 480,
  maxWidth: '100%',
  margin: 'auto',
  display: 'flex',
  minHeight: '100vh',
  flexDirection: 'column',
  justifyContent: 'center',
  padding: theme.spacing(12, 0)
}));

const FormStyle = styled('div')(({ theme }) => ({
  // maxWidth: 464,
  maxWidth: '100%',
  display: 'flex',
  flexDirection: 'rows',
  justifyContent: 'space-around',
  padding: theme.spacing(5, 5),
  borderRadius: '16px',
  // backgroundColor: 'white'
}));
// ----------------------------------------------------------------------

export default function Login() {
	const dispatch = useDispatch();
	const { user } = useSelector(state => state)
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(0)
	const [popUpForgotPassword, setPopUpForgotPassword] = useState(0)
	const [email, setEmail] = useState("")
	const [password, setPassword] = useState("")
	const [errorReset, setErrorReset] = useState("")
	const [disableReset, setDisableReset] = useState(false)
	const [userInfo, setuserInfo] = useState({})
	const forgotPassword = (bool) => setPopUpForgotPassword(bool)
	const signIn = async (e) => {
		e.preventDefault()
		// const data = JSON.stringify({email, password})
		try {
			// const rawResponse = await fetch('/api/login', {
			// 														method: 'POST',
			// 														headers: {
			// 															'Accept': 'application/json',
			// 															'Content-Type': 'application/json'
			// 														},
			// 														mode: 'cors',
			// 														body: data
			// 													})
			// const responseData= await rawResponse.json()
			// if(responseData.message)
			//  alert(responseData.message)
			// else {
			// 	setuserInfo(responseData)
			// 	navigate('/')
			// }
			const getUserInfo = await axios.post('/api/login', {email, password})
			localStorage.setItem('getUserInfo', JSON.stringify(getUserInfo.data));
			dispatch({ type : 'getUserInfo', data : getUserInfo.data })
			navigate('/')
		} catch(err) {
			if(err.response) {
				dispatch({ type : 'err_getUserInfo', error : err.response.data.message })
				alert(err.response.data.message)
			}
		}
	}
	const sendForgotPassword = async (e) => {
		e.preventDefault()
		setDisableReset(true)
		try {
		const resetPass = await axios.post('/api/resetPasswordToken', {email})
			// e.preventDefault()
			alert("send forgot password")
			navigate('/')
			setDisableReset(false)
		} catch (error) {
			setErrorReset(error.response.data.err)
			setDisableReset(false)
		}
	}
  return (
    <RootStyle title="Login | UIII LMS">
      <AuthLayout>
        <Typography sx={{ color: 'white' }}>Don’t have an account? &nbsp;</Typography>
        <Link
          underline="none"
          variant="subtitle2"
          component={RouterLink}
          to="/register"
          sx={{ color: '#E3A130' }}
        >
          Get started
        </Link>
      </AuthLayout>
			<div className="container-login">
				<div className="login-white-uiii">
					<img src="/static/white-uiii.png" alt="login-logo" />
				</div>
				<div className="login-line"></div>
				<div className="login-form">
					<form>
						<label htmlFor="email">
							Username
						<input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)}/>
						</label>
						<label htmlFor="password">
							Password
						<input type={showPassword ? "text" : "password"} name="password" value={password} onChange={e => setPassword(e.target.value)}/>
						<IconButton className="show-password" onClick={() => setShowPassword(!showPassword)} edge="end">
							<Icon icon={showPassword ? eyeFill : eyeOffFill} />
						</IconButton>
						</label>
						<label htmlFor="forgotPassword" className="login-options">
							<span onClick={() => forgotPassword(true)}>Forgot your Password?</span>
							<button type="submit" className="login-submit" onClick={signIn}>Sign In</button>
						</label>
					</form>
				</div>
			</div>
			{ popUpForgotPassword && <div className="login-form forgot-password">
				<form>
					<CancelIcon disabled={disableReset} className="cancel" onClick={() => forgotPassword(false)} />
					<h2>Forgot Password</h2>
					<br />
					<div>
						<span>Enter your email address to retrieve your password</span>
					</div>
					<br />
					<label htmlFor="email">
						<input type="text" name="email" value={email} onChange={e => setEmail(e.target.value)} />
					</label>
					<span style={{color: "red"}}>{errorReset}</span>
					<label>
						<button type="submit" disabled={disableReset} className="login-submit" onClick={sendForgotPassword}>{!disableReset ? 'Send Email' : <CircularProgress color="inherit" size={10}/>}</button>
					</label>
				</form>
			</div>
			}
			<div className="login-copyright">
				<span>&copy;{ new Date().getFullYear()} Universitas Islam International Indonesia</span>
			</div>

      {/* <MHidden width="mdDown">
        <SectionStyle>
          <Typography variant="h3" sx={{ px: 5, mt: 10, mb: 5 }}>
            Hi, Welcome Back
          </Typography>
          <img src="/static/illustrations/illustration_login.png" alt="login" />
        </SectionStyle>
      </MHidden>

      <Container maxWidth="lg">
        <ContentStyle>
          <FormStyle>
            <Stack sx={{ mb: 5 }}>
          		<img src="/static/white-uiii.png" alt="login-logo" />
              <Typography variant="h3" sx={{ px: 0, mt: 0, mb: 5, color: '#003B5C' }}>
                UIII Learning Management System
              </Typography>
              <Typography variant="h4" gutterBottom>
                Sign in to ULMS
              </Typography>
              <Typography sx={{ color: 'text.secondary' }}>Enter your details below.</Typography>
            </Stack>
            <AuthSocial />

            <LoginForm />

            <MHidden width="smUp">
              <Typography variant="body2" align="center" sx={{ mt: 3 }}>
                Don’t have an account?&nbsp;
                <Link variant="subtitle2" component={RouterLink} to="register">
                  Get started
                </Link>
              </Typography>
            </MHidden>
          </FormStyle>
        </ContentStyle>
      </Container> */}
    </RootStyle>
  );
}

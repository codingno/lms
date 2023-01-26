import { Link as RouterLink, useNavigate } from 'react-router-dom';
// material
import { styled } from '@mui/material/styles';
import { Link, Typography, CircularProgress } from '@mui/material';
// layouts
import AuthLayout from '../layouts/AuthLayout';
// components
import Page from '../components/Page';
import { mockImgCover } from '../utils/mockImages';
import { useState } from 'react';
import { useParams } from 'react-router';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  IconButton
} from '@mui/material';
import axios from 'axios';
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


export default function Login() {
  const { token } = useParams()
	const navigate = useNavigate();
	const [showPassword, setShowPassword] = useState(0)
	const [showConfirmPassword, setShowConfirmPassword] = useState(0)
	const [isSend, setIsSend] = useState(false)
	const [password, setPassword] = useState("")
	const [confirmPassword, setConfirmPassword] = useState("")
	const resetPassword = async (e) => {
		e.preventDefault()
    setIsSend(true)
		// const data = JSON.stringify({email, password})
    if(password === confirmPassword){
      try {
        const resetPassword = await axios.post('/api/resetPassword', {password, token})
        if(resetPassword)
          setIsSend(false)
        alert('Reset Password Success')
        navigate('/login')
      } catch(err) {
          setIsSend(false)
        if(err.response) {
          alert('Reset Password Failed')
        }
      }
    }
    else
      alert('Password not match!')
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
						<label htmlFor="password">
                        Password
						<input style={{marginLeft: 'auto'}} placeholder="Password" type={showPassword ? "text" : "password"} name="password" value={password} onChange={e => setPassword(e.target.value)}/>
						<IconButton className="show-password" onClick={() => setShowPassword(!showPassword)} edge="end">
							<Icon icon={showPassword ? eyeFill : eyeOffFill} />
						</IconButton>
						</label>
						<label htmlFor="confirmPassword">
                        Confirm Password
						<input placeholder="Confirm Password" type={showConfirmPassword ? "text" : "password"} name="confirmpassword" value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)}/>
						<IconButton className="show-password" onClick={() => setShowConfirmPassword(!showConfirmPassword)} edge="end">
							<Icon icon={showConfirmPassword ? eyeFill : eyeOffFill} />
						</IconButton>
						</label>
						<label htmlFor="forgotPassword" className="login-options">
							<button disabled={isSend} style={{marginLeft: 'auto'}} type="submit" className="login-submit" onClick={resetPassword}>{!isSend ? 'Reset Password' : <CircularProgress color="inherit" size={10}/>}</button>
						</label>
					</form>
				</div>
			</div>
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

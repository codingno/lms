import * as Yup from 'yup';
import { useState } from 'react';
import { Link as RouterLink, useNavigate } from 'react-router-dom';
import { useFormik, Form, FormikProvider } from 'formik';
import { Icon } from '@iconify/react';
import eyeFill from '@iconify/icons-eva/eye-fill';
import eyeOffFill from '@iconify/icons-eva/eye-off-fill';
// material
import {
  Link,
  Stack,
  Checkbox,
  TextField,
  IconButton,
  InputAdornment,
  FormControlLabel,
	FormControl,
	FormHelperText,
	OutlinedInput,
} from '@mui/material';
import { LoadingButton } from '@mui/lab';

// ----------------------------------------------------------------------

export default function LoginForm() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const LoginSchema = Yup.object().shape({
    email: Yup.string().email('Email must be a valid email address').required('Email is required'),
    password: Yup.string().required('Password is required')
  });

  const formik = useFormik({
    initialValues: {
      email: '',
      password: '',
      remember: true
    },
    validationSchema: LoginSchema,
    onSubmit: () => {
      navigate('/dashboard', { replace: true });
    }
  });

  const { errors, touched, values, isSubmitting, handleSubmit, getFieldProps } = formik;

  const handleShowPassword = () => {
    setShowPassword((show) => !show);
  };

  return (
    <FormikProvider value={formik}>
      <Form autoComplete="off" noValidate onSubmit={handleSubmit}>
        <Stack spacing={3}>
          <TextField
            fullWidth
            autoComplete="username"
            type="email"
            // label="Username / Email address"
            {...getFieldProps('email')}
            error={Boolean(touched.email && errors.email)}
            helperText={touched.email && errors.email}
						InputProps={{
							sx : {
								background : '#FFF',
								borderRadius : '50px',
								paddingLeft : '20px',
								'& span': {
									color : '#003B5C'
								},
							}
						}}
          />

          <TextField
            fullWidth
            autoComplete="current-password"
            type={showPassword ? 'text' : 'password'}
            // label="Password"
            {...getFieldProps('password')}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton onClick={handleShowPassword} edge="end">
                    <Icon icon={showPassword ? eyeFill : eyeOffFill} />
                  </IconButton>
                </InputAdornment>
              ),
							sx : {
								background : '#FFF',
								borderRadius : '50px',
								paddingLeft : '20px',
								'& span': {
									color : '#003B5C'
								},
							}
            }}
            error={Boolean(touched.password && errors.password)}
            helperText={touched.password && errors.password}
          />
        </Stack>

        <Stack direction="row" alignItems="center" justifyContent="space-between" sx={{ my: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                {...getFieldProps('remember')}
                checked={values.remember}
                sx={{
                  color: '#FFF',
                  '&.Mui-checked': {
                    color: '#E3A130'
                  },
                  '&:hover': {
                    backgroundColor: 'rgba(0 59 92 / 8%)'
                  }
                }}
              />
            }
            label="Remember me"
            sx={{ color: '#FFF' }}
          />

          <Link
            component={RouterLink}
            variant="subtitle2"
            to="#"
          	sx={{ color: '#E3A130', textDecorationColor: '#E3A130'  }}
          >
            Forgot your password?
          </Link>
        </Stack>

        <LoadingButton
          fullWidth
          size="large"
          type="submit"
          variant="contained"
          loading={isSubmitting}
          sx={{
            backgroundColor: '#00778B',
            boxShadow: '0 8px 16px 0 rgb(0 119 139 / 24%)',
            '&:hover': {
              backgroundColor: '#E3A130'
            }
          }}
        >
          Login
        </LoadingButton>
      </Form>
    </FormikProvider>
  );
}

import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { authActions } from '../../store';

// form validation rules
const validationSchema = Yup.object().shape({
  firstName: Yup.string().required('First name is required'),
  lastName: Yup.string().required('Last name is required'),
  email: Yup.string().email('Invalid Email').required('Email is required'),
  password: Yup.string()
    .required('Password is required')
    .matches(
      // eslint-disable-next-line no-useless-escape
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,})/,
      'Must Contain 8 Characters, One Uppercase, One Lowercase, One Number and One Special Case Character',
    ),
});

function SignUp() {
  const dispatch = useDispatch();
  const authError = useSelector((state) => state.auth.error);

  useEffect(() => {
    dispatch(authActions.reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    firstName: '',
    lastName: '',
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit({
        firstName: values.firstName,
        lastName: values.lastName,
        email: values.email,
        password: values.password,
      });
    },
  });
  const { values, setFieldValue, touched, errors } = formik;

  const onSubmit = (userInfo) => {
    return dispatch(authActions.signup(userInfo));
  };

  return (
    <Container component="main" maxWidth="xs">
      <Box
        sx={{
          marginTop: 8,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
        }}
      >
        <Avatar sx={{ m: 1, bgcolor: 'secondary.main' }}>
          <LockOutlinedIcon />
        </Avatar>
        <Typography component="h1" variant="h5">
          Sign up
        </Typography>
        <Box minHeight={30}>
          {authError && (
            <Typography
              variant="subtitle2"
              sx={{ color: 'red', marginBottom: 2 }}
              textAlign="center"
            >
              {authError.message}
            </Typography>
          )}
        </Box>
        <form onSubmit={formik.handleSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="firstName"
                label="First Name"
                name="firstName"
                autoFocus
                value={values.firstName}
                onChange={(e) => {
                  setFieldValue('firstName', e.target.value);
                }}
                error={touched.firstName && Boolean(errors.firstName)}
                helperText={touched.firstName && errors.firstName}
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                value={values.lastName}
                onChange={(e) => {
                  setFieldValue('lastName', e.target.value);
                }}
                error={touched.lastName && Boolean(errors.lastName)}
                helperText={touched.lastName && errors.lastName}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                value={values.email}
                onChange={(e) => {
                  setFieldValue('email', e.target.value);
                }}
                error={touched.email && Boolean(errors.email)}
                helperText={touched.email && errors.email}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                value={values.password}
                onChange={(e) => {
                  setFieldValue('password', e.target.value);
                }}
                error={touched.password && Boolean(errors.password)}
                helperText={touched.password && errors.password}
              />
            </Grid>
          </Grid>
          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign Up
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                Already have an account? <NavLink to="/signin">Sign in</NavLink>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default SignUp;

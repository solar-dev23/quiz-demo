import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { NavLink } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { Avatar, Box, Button, Container, Grid, TextField, Typography } from '@mui/material';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { history } from '../../helpers';
import { authActions } from '../../store';

// form validation rules
const validationSchema = Yup.object().shape({
  email: Yup.string().email('Invalid Email').required('Email is required'),
  password: Yup.string().required('Password is required'),
});

function SignIn() {
  const dispatch = useDispatch();
  const { user: authUser, error: authError } = useSelector((state) => state.auth);

  useEffect(() => {
    // redirect to home if already logged in
    if (authUser) history.navigate('/');

    dispatch(authActions.reset());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const initialValues = {
    email: '',
    password: '',
  };

  const formik = useFormik({
    initialValues,
    validationSchema: validationSchema,
    onSubmit: async (values) => {
      await onSubmit({
        email: values.email,
        password: values.password,
      });
    },
  });
  const { values, setFieldValue, touched, errors } = formik;

  const onSubmit = ({ email, password }) => {
    return dispatch(authActions.login({ email, password }));
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
          Sign in
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
          <TextField
            margin="normal"
            fullWidth
            id="email"
            label="Email Address"
            name="email"
            autoFocus
            value={values.email}
            onChange={(e) => {
              setFieldValue('email', e.target.value);
            }}
            error={touched.email && Boolean(errors.email)}
            helperText={touched.email && errors.email}
          />
          <TextField
            margin="normal"
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

          <Button type="submit" fullWidth variant="contained" sx={{ mt: 3, mb: 2 }}>
            Sign In
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item>
              <Typography variant="body2">
                Don't have an account? <NavLink to="/signup">Sign Up</NavLink>
              </Typography>
            </Grid>
          </Grid>
        </form>
      </Box>
    </Container>
  );
}

export default SignIn;

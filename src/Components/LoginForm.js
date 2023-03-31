import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container, CssBaseline, TextField, Avatar, Typography, FormControlLabel, Checkbox, Grid, Link, Button } from '@mui/material';
import { Box } from '@mui/system';
import { connect, useDispatch } from 'react-redux';
import { MyLink } from './MyLink';
import { actionAboutMe, useLoginMutation } from '../reducers/authReducer';

const LoginForm = () => {
    const [onLogin, { data, isLoading }] = useLoginMutation()
    const dispatch = useDispatch()

    const [login, setLogin] = useState('');
    const [password, setPassword] = useState('');
    const isButtonActive = !isLoading && login?.length > 3 && password?.length > 3;
    return (
        <Container component="main" maxWidth="xs">
            <CssBaseline />
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
                <TextField
                    fullWidth
                    margin="normal"
                    autoFocus
                    required
                    id="login-input"
                    label="Login"
                    size="small"
                    defaultValue=""
                    onChange={e => setLogin(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="password-input"
                    label="Password"
                    type="password"
                    size="small"
                    defaultValue=""
                    onChange={e => setPassword(e.target.value)}
                />
                <FormControlLabel
                    control={<Checkbox value="remember" color="primary" />}
                    label="Remember me"
                />
                <Button
                    component="button"
                    variant="contained"
                    sx={{ mt: 3, mb: 2 }}
                    fullWidth
                    type="submit"
                    disabled={!isButtonActive}
                    onClick={() => onLogin({ login, password }).then(() => dispatch(actionAboutMe()))}>
                    Login...
                </Button>
                <Grid container>
                    <Grid item xs>
                        <Link href="#" variant='body2'>
                            Forgot password?
                        </Link>
                    </Grid>
                    <Grid item>
                        <MyLink to="/register" variant='body2'>
                            {"Don't have an account? Sign Up"}
                        </MyLink>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    )
}
const CLoginForm = connect(null, {})(LoginForm)

export { CLoginForm };
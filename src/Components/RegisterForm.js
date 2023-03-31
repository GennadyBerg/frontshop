import React, { useState } from 'react';
import LockOutlinedIcon from '@mui/icons-material/LockOutlined';
import { Container, CssBaseline, TextField, Avatar, Typography, FormControlLabel, Checkbox, Button } from '@mui/material';
import { Box } from '@mui/system';
import { connect, useDispatch } from 'react-redux';
import { MyLink } from './MyLink';
import { actionAboutMe, useLoginMutation, useRegisterMutation } from '../reducers/authReducer';

const RegisterForm = () => {
    const [onRegister, { isLoading: isLoadingReg }] = useRegisterMutation();

    const [onLogin, { }] = useLoginMutation();
    const dispatch = useDispatch()

    const [login, setLogin] = useState('');
    const [nick, setNick] = useState('');
    const [password, setPassword] = useState('');
    const [passwordRetype, setPasswordRetype] = useState('');
    const arePasswordsEqual = password === passwordRetype;
    const isButtonActive = !isLoadingReg && arePasswordsEqual && login?.length > 3 && password?.length > 3;
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
                    Sign up
                </Typography>
                <TextField
                    fullWidth
                    margin="normal"
                    autoFocus
                    required
                    id="register-input"
                    label="Nick"
                    size="small"
                    defaultValue=""
                    onChange={e => setNick(e.target.value)}
                />
                <TextField
                    fullWidth
                    margin="normal"
                    autoFocus
                    required
                    id="register-input"
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
                <TextField
                    fullWidth
                    margin="normal"
                    required
                    id="password-retype-input"
                    label="Retype Password"
                    type="password"
                    size="small"
                    defaultValue=""
                    onChange={e => setPasswordRetype(e.target.value)}
                    color={arePasswordsEqual ? 'primary' : 'error'}
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
                    onClick={() => (
                        onRegister({ login, password, nick })
                            .then(() => onLogin({ login, password }))
                            .then(() => dispatch(actionAboutMe()))
                    )}>
                    Register...
                </Button>
            </Box>
        </Container >
    )
}
const CRegisterForm = connect(null, {})(RegisterForm)


export { CRegisterForm };
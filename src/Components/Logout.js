import { actionAuthLogout } from '../reducers';
import { useEffect } from 'react';
import { connect, useDispatch } from 'react-redux';
import { history } from "../App";


const Logout = () => {
    const dispatch = useDispatch()
    useEffect(() => {
        dispatch(actionAuthLogout());
        history.push('/');
    }, []);

    return <div></div>;
};

export const CLogout = connect(null, { onLogout: actionAuthLogout })(Logout)
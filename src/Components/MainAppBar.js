import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { MyLink } from './MyLink';
import { connect, useSelector } from 'react-redux';
import { useTheme } from '@emotion/react';
import { actionSetSidebar, getCartItemsCount, getIsSideBarOpen } from '../reducers';
import { UserEntity } from '../Entities';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { AccountCircle } from '@mui/icons-material';
import LogoutIcon from '@mui/icons-material/Logout';
import LoginIcon from '@mui/icons-material/Login';
import CategoryIcon from '@mui/icons-material/Category';
import SupervisedUserCircleIcon from '@mui/icons-material/SupervisedUserCircle';
import WorkHistoryIcon from '@mui/icons-material/WorkHistory';
import { Badge, Tooltip } from '@mui/material';
import logo from '../images/logo.jpg';
import AccountTreeIcon from '@mui/icons-material/AccountTree';

const MainAppBar = ({ token, openSidebar }) => {
    const cartItemsCount = useSelector(state => getCartItemsCount(state) ?? 0);
    let currentUser = useSelector(state => new UserEntity(state.auth?.currentUser ?? { _id: null }));
    let isAdmin = currentUser?.isAdminRole === true;
    let isLoggedIn = token && true;
    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="static">
                <Toolbar>
                    <MyLink to="/">
                        <Box component="img" src={logo} sx={{ width: "40px", borderStyle: "double", borderWidth: "3px", borderColor: "white", marginRight: "20px" }} />
                    </MyLink>
                    <IconButton
                        size="large"
                        edge="start"
                        color="inherit"
                        aria-label="menu"
                        onClick={() => openSidebar(true)}
                        sx={{ mr: 2 }}
                        id="burger"
                    >
                        <MenuIcon />
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
                    </Typography>
                    {
                        !isLoggedIn &&
                        <>
                            <MyLink to="/login"><Button sx={{ color: "white" }}><Tooltip title="Login"><LoginIcon /></Tooltip></Button></MyLink>
                            <MyLink to="/register"><Button sx={{ color: "white" }}>Register</Button></MyLink>
                        </>
                    }
                    {
                        isLoggedIn &&
                        <>
                            {isAdmin && (
                                <>
                                    <MyLink to="/categories"><Button sx={{ color: "white" }}><Tooltip title="Categories"><CategoryIcon /></Tooltip></Button></MyLink>
                                    <MyLink to="/catree"><Button sx={{ color: "white" }}><Tooltip title="Categories Tree"><AccountTreeIcon/></Tooltip></Button></MyLink>
                                    <MyLink to="/users"><Button sx={{ color: "white" }}><Tooltip title="Users"><SupervisedUserCircleIcon /></Tooltip></Button></MyLink>
                                </>
                            )}
                            <MyLink to="/orders"><Button sx={{ color: "white" }}><Tooltip title="Orders"><WorkHistoryIcon /></Tooltip></Button></MyLink>
                            <MyLink to="/user"><Button sx={{ color: "white" }}><Tooltip title="About Me"><AccountCircle /></Tooltip></Button></MyLink>
                        </>
                    }
                    <Badge badgeContent={cartItemsCount} color="secondary">
                        <MyLink to="/cart"><Button sx={{ color: "white" }}><Tooltip title="Cart"><ShoppingCartIcon /></Tooltip></Button></MyLink>
                    </Badge>
                    {
                        isLoggedIn &&
                        <>
                            <MyLink to="/logout"><Button sx={{ color: "white" }}><Tooltip title="Logout"><LogoutIcon /></Tooltip></Button></MyLink>
                        </>
                    }
                </Toolbar>
            </AppBar>
        </Box>
    );
}

export const CMainAppBar = connect(state => ({ token: state.auth?.token, sidebarOpened: getIsSideBarOpen(state) }), { openSidebar: actionSetSidebar })(MainAppBar);
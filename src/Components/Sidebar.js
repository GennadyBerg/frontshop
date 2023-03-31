import React from 'react';
import { styled, useTheme } from '@mui/material/styles';
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import { actionSetSidebar, getIsSideBarOpen } from '../reducers/frontEndReducer';
import { connect } from 'react-redux';
import { ClickAwayListener } from '@mui/material';

function Sidebar(props) {
    let { drawerWidth, menuComponent, opened, openSidebar } = props;
    const [openedComp, setOpenedComp] = React.useState(undefined);
    let MenuComponent = menuComponent;
    drawerWidth = drawerWidth || 200;
    const theme = useTheme();
    const handleDrawerClose = () => {
        openSidebar(false);
        setOpenedComp(undefined)
    };
    const handleClickAwayListener = event => {
        if (event.target.closest('#burger'))
            return;
        handleDrawerClose();
    };
    const DrawerHeader = styled('div')(({ theme }) => ({
        display: 'flex',
        alignItems: 'center',
        padding: theme.spacing(0, 1),
        // necessary for content to be below app bar
        ...theme.mixins.toolbar,
        justifyContent: 'flex-end',
    }));

    return (
        <>
            <ClickAwayListener onClickAway={event => handleClickAwayListener(event)}>
                <Drawer
                    sx={{
                        width: drawerWidth,
                        flexShrink: 0,
                        '& .MuiDrawer-paper': {
                            width: drawerWidth,
                            boxSizing: 'border-box',
                        },
                    }}
                    variant="persistent"
                    anchor="left"
                    open={opened}
                >
                    <DrawerHeader>
                        <IconButton onClick={handleDrawerClose}>
                            {theme.direction === 'ltr' ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                        </IconButton>
                    </DrawerHeader>
                    <Divider />
                    <MenuComponent {...props} />
                    <Divider />
                </Drawer>
            </ClickAwayListener>
        </>);
}

export const CSidebar = connect(state => ({ opened: getIsSideBarOpen(state) }), { openSidebar: actionSetSidebar })(Sidebar);
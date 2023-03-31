import { useSelector } from "react-redux"
import { getCurrentUser, useSaveUserMutation, useUserFindQuery } from "../reducers";
import { useParams } from "react-router-dom";
import { Button, Card, CardActions, CardContent, CardMedia, Checkbox, Container, FormControlLabel, FormGroup, Grid, InputAdornment, TextField, Typography } from "@mui/material";
import { useEffect, useState } from "react";
import { getFullImageUrl, saveImage } from "../utills/utils";
import { UserEntity } from "../Entities";

const EditableUser = ({ user: userExt = {_id: null, login: '', nick: ''}, maxWidth = 'md', saveUser, isAdminPermissions }) => {
    const copyUser = user => new UserEntity(user);

    let [user, setUser] = useState(copyUser(userExt));

    useEffect(() => {
        setUser(copyUser(userExt));
    }, [userExt]);

    const setUserData = (data) => {
        let userData = copyUser({ ...user, ...data });
        setUser(userData);
        return userData;
    }
    const saveFullUser = async () => {
        saveUser({ user: { _id: user._id, nick: user.nick, acl: user.acl ?? [] } });
    }

    const uploadAvatar = async param => {
        let image = await saveImage({ data: param.target.files[0] }, false);
        let userToSave = { _id: user._id, avatar: { _id: image._id } };
        saveUser({ user: userToSave });
    }

    return user && (
        <>
            <Container maxWidth={maxWidth}>
                <Card variant='outlined'>
                    <Grid container spacing={maxWidth === 'xs' ? 7 : 5} rowSpacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 300, padding: "1em 1em 0 1em", objectFit: "contain" }}
                                        image={getFullImageUrl(user.avatar)}
                                        title={user.name}
                                    />
                                    <Button
                                        variant="contained"
                                        component="label"
                                    >
                                        Upload File
                                        <input
                                            type="file"
                                            hidden
                                            onChange={param => uploadAvatar(param)}
                                        />
                                    </Button>
                                </Grid>
                                <Grid item xs={8}>
                                    <CardContent>
                                        <Grid container rowSpacing={2}>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Nick"
                                                    value={user.nick}
                                                    onChange={event => setUserData({ nick: event.target.value })}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Login"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    value={user.login}
                                                    onChange={event => setUserData({ login: event.target.value })}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item width="100%">
                                                <FormGroup>
                                                    <FormControlLabel control={(
                                                        <Checkbox
                                                            checked={user.isUserRole}
                                                            disabled={!isAdminPermissions}
                                                            onChange={e => { user.setUserRole(e.target.checked); setUser(copyUser(user)); }}
                                                        />)} label="User" />
                                                    <FormControlLabel control={(
                                                        <Checkbox
                                                            checked={user.isAdminRole}
                                                            disabled={!isAdminPermissions}
                                                            onChange={e => { user.setAdminRole(e.target.checked); setUser(copyUser(user)); }}
                                                        />)} label="Admin" />
                                                </FormGroup>
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <CardActions>
                        <Button size='small' color='primary'
                            onClick={() => saveFullUser(user)}
                        >
                            Save
                        </Button>
                        <Button size='small' color='primary'
                            onClick={() => setUser(copyUser(userExt))}
                        >
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
            </Container >

        </>
    )
}

const CEditableUser = ({ maxWidth = 'md' }) => {
    const { _id } = useParams();
    let currentUser = useSelector(state => new UserEntity(getCurrentUser(state)));
    const { isLoading, data } = useUserFindQuery(_id ?? currentUser?._id ?? 'jfbvwkbvjeb');
    let user = isLoading ? undefined : data?.UserFindOne;
    user = _id ? user : currentUser;
    const [saveUserMutation, { }] = useSaveUserMutation();

    let isCurrentUser = currentUser?._id === _id || !_id;
    let isAdminPermissions = currentUser?.isAdminRole ?? false;


    return user && (isAdminPermissions || isCurrentUser) ? (
        <EditableUser user={user} maxWidth={maxWidth} isAdminPermissions={isAdminPermissions} saveUser={saveUserMutation} />) :
        <Typography>Permission denied</Typography>;
}


export { CEditableUser }
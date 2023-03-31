import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Container, Typography, Grid, CardActionArea, Card, CardContent, CardMedia, AvatarGroup, CardActions, Collapse, IconButton } from '@mui/material';
import { getFullImageUrl } from "./../utills";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AvatarAnimated } from './AvatarAnimated';
import { actionAddGoodToCart, isCurrentUserAdmin } from '../reducers';
import { useDispatch, useSelector } from 'react-redux';
import { useGetGoodByIdQuery } from '../reducers';
import { useParams } from 'react-router-dom';
import { MyLink } from './MyLink';
import { ModalContainer } from './ModalContainer';
import { CategoryBreadcrumbs } from './CategoryBreadcrumbs';
import { LoadingState } from './LoadingState';


export const ExpandMore = styled(props => {
    const { expand, ...other } = props;
    return <IconButton {...other} />;
})(({ theme, expand }) => ({
    transform: !expand ? 'rotate(0deg)' : 'rotate(180deg)',
    marginLeft: 'auto',
    transition: theme.transitions.create('transform', { duration: theme.transitions.duration.shortest })
}))

export const AvatarGroupOriented = styled((props) => {
    const { vertical, ...other } = props;
    return <AvatarGroup {...other} />;
})(({ theme, vertical }) => (vertical && {
    display: 'flex',
    flexDirection: 'column',
    marginLeft: 10,
    '& >:first-child': {
        marginTop: 10,
    },
    '& >*': {
        marginLeft: 1,
        marginTop: theme.spacing(1),
    },
    ".MuiAvatar-root": { marginLeft: 1 }
}));


const Good = ({ good, maxWidth = 'md', isAdmin, showAddToCard = true, actionAddGoodToCart, editable }) => {
    let [currentImageIndex, setCurrentImageIndex] = useState(0);
    let [expanded, setExpanded] = useState(true);
    let [previewMedia, setPreviewMedia] = useState(false);
    const handleExpandClick = () => setExpanded(!expanded);
    const currentCategory = good?.categories?.length > 0 ? good.categories[0] : undefined;
    return good && (
        <>
            {
                previewMedia ?
                    <ModalContainer onCloseClick={() => setPreviewMedia(false)}>
                        <CardMedia
                            component="img"
                            sx={{ height: 300, padding: "1em 1em 0 1em", objectFit: "contain" }}
                            image={good.images?.length > 0 ? getFullImageUrl(good.images[currentImageIndex]) : ''}
                            title={good.name}
                        />
                    </ModalContainer>
                    :
                    <></>
            }
            <Container maxWidth={maxWidth}>
                <CategoryBreadcrumbs category={currentCategory} showLeafAsLink={true} />
                <Card variant='outlined'>
                    <Grid container spacing={maxWidth === 'xs' ? 7 : 5}>
                        <Grid item xs={1}>
                            <AvatarGroupOriented variant='rounded' vertical>
                                {
                                    good.images?.map((image, index) => (
                                        <AvatarAnimated selected={index === currentImageIndex} variant='rounded' key={index} src={getFullImageUrl(image)}
                                            onClick={() => {
                                                setCurrentImageIndex(index)
                                            }} />
                                    ))
                                }
                            </AvatarGroupOriented>
                        </Grid>
                        <Grid item xs>
                            <CardActionArea>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: 300, padding: "1em 1em 0 1em", objectFit: "contain" }}
                                            image={good.images?.length > 0 ? getFullImageUrl(good.images[currentImageIndex]) : ''}
                                            title={good.name}
                                            onClick={event => setPreviewMedia(true)}
                                        />
                                    </Grid>
                                    <Grid item xs={8}>
                                        <CardContent>
                                            <Typography gutterBottom variant='h5' component='h2'>
                                                {good.name}
                                            </Typography>
                                            <Typography gutterBottom variant='body2' color='textSecondary' component='p'>
                                                {`Price: $${good.price}`}
                                            </Typography>
                                        </CardContent>
                                    </Grid>
                                </Grid>
                            </CardActionArea>
                        </Grid>
                    </Grid>
                    <CardActions>
                        <ExpandMore
                            expand={expanded}
                            onClick={handleExpandClick}
                            aria-expanded={expanded}
                            aria-label='showMore'
                        >
                            <ExpandMoreIcon />
                        </ExpandMore>
                        {
                            showAddToCard && (
                                <Button size='small' color='primary'
                                    onClick={actionAddGoodToCart}
                                >
                                    Add to cart
                                </Button>
                            )
                        }
                        {
                            isAdmin && <MyLink to={`/editgood/${good._id}`}>
                                {
                                    editable && <Button size='small' color='primary'>
                                        Edit
                                    </Button>
                                }
                            </MyLink>
                        }
                    </CardActions>
                    <Collapse in={expanded} timeout='auto' unmountOnExit>
                        <Typography paragraph sx={{ marginLeft: 1 }}>
                            Description:
                        </Typography>
                        <Typography paragraph align='justify' sx={{ marginLeft: 2, marginRight: 2 }}>
                            {good.description}
                        </Typography>
                    </Collapse>
                </Card>
            </Container>
        </>
    )
}

const CGood = ({ good, maxWidth = 'md', showAddToCard = true, editable = true }) => {
    const { _id } = useParams();
    const { isLoading, data } = useGetGoodByIdQuery(_id);
    const dispatch = useDispatch();
    if (!good)
        good = isLoading ? { name: 'loading', goods: [] } : data?.GoodFindOne;
    let state = useSelector(state => state);
    let isAdmin = isCurrentUserAdmin(state);
    return isLoading ? <LoadingState /> : <Good good={good} isAdmin={isAdmin} maxWidth={maxWidth} showAddToCard={showAddToCard} editable={editable} actionAddGoodToCart={() => dispatch(actionAddGoodToCart(good))} />
}
export { CGood };
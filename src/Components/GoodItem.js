import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, Typography, Grid, CardActionArea, Card, CardContent, CardMedia, CardActions, Collapse } from '@mui/material';
import { getFullImageUrl } from "./../utills";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { AvatarAnimated } from './AvatarAnimated';
import { MyLink } from './MyLink';
import { AvatarGroupOriented, ExpandMore } from './Good';
import { useDispatch } from 'react-redux';
import { actionAddGoodToCart } from '../reducers';

export const GoodItem = ({ good, maxWidth = 'md', showAddToCard = true, actionAddGoodToCart }) => {
    let [currentImageIndex, setCurrentImageIndex] = useState(0);
    let [expanded, setExpanded] = useState(false);
    const handleExpandClick = () => setExpanded(!expanded);
    return good && (
        <Container maxWidth={maxWidth}>
            <Card variant='outlined'>
                <Grid container spacing={maxWidth === 'xs' ? 7 : 5}>
                    <Grid item xs={1}>
                        <AvatarGroupOriented variant='rounded' vertical>
                            {good.images?.map((image, index) => (
                                <AvatarAnimated selected={index === currentImageIndex} variant='rounded' key={index} src={getFullImageUrl(image)}
                                    onClick={() => {
                                        setCurrentImageIndex(index);
                                    }} />
                            ))}
                        </AvatarGroupOriented>
                    </Grid>
                    <Grid item xs>
                        <MyLink to={`/good/${good._id}`}>
                            <CardActionArea>
                                <Grid container spacing={2}>
                                    <Grid item xs={4}>
                                        <CardMedia
                                            component="img"
                                            sx={{ height: 300, padding: "1em 1em 0 1em", objectFit: "contain" }}
                                            image={good.images?.length > 0 ? getFullImageUrl(good.images[currentImageIndex]) : ''}
                                            title={good.name} />
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
                        </MyLink>
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
                    {showAddToCard && (
                        <Button size='small' color='primary'
                            onClick={actionAddGoodToCart}
                        >
                            Add to cart
                        </Button>
                    )}
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
    );
};

const CGoodItem = ({ good, maxWidth = 'md', showAddToCard = true }) => {
    const dispatch = useDispatch();
    return <GoodItem good={good} maxWidth={maxWidth} showAddToCard={showAddToCard} actionAddGoodToCart={() => dispatch(actionAddGoodToCart(good))} />
}
export { CGoodItem };
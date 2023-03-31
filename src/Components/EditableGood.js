import React, { useState } from 'react';
import Button from '@mui/material/Button';
import { Container, Grid, Card, CardContent, CardMedia, CardActions, TextField, InputAdornment, Box, Modal } from '@mui/material';
import { getFullImageUrl } from "./../utills";
import { useSelector } from 'react-redux';
import { frontEndNames, getCurrentEntity, isCurrentUserAdmin, useGetGoodByIdQuery, useSaveGoodMutation } from '../reducers';
import { useParams } from 'react-router-dom';
import { CSortedFileDropZone } from './SortedFileDropZone';
import { saveImage } from '../utills/utils';
import { CGood } from './Good';
import { ModalContainer } from './ModalContainer';
import { history } from "../App";
import { LackPermissions } from './LackPermissions';
import { CCategoryDropDownList } from './DropDownList';
import { CategoryBreadcrumbs } from './CategoryBreadcrumbs';


const EditableGood = ({ good: goodExt, maxWidth = 'md', saveGood }) => {
    const copyGood = goodExt => ({ ...goodExt, images: [...(goodExt.images ?? [])] });
    let [good, setGood] = useState(copyGood(goodExt));
    let [showPreview, setShowPreview] = useState(false);
    let [imagesContainer, setImagesContainer] = useState({ images: [...(goodExt.images ?? [])] });

    const onSetCategory = (catItem) => {
        if (!catItem.cat.name)
            throw new Error("Category must have name.");
        good.categories = catItem.cat ? [{ _id: catItem.cat._id, name: catItem.cat.name }] : [];
    }
    const setGoodData = (data) => {
        let goodData = { ...good, ...data };
        setGood(goodData);
        return goodData;
    }
    const onChangeImages = async images => {
        let addedImages =  images.filter(img => !img._id);
        let results = await Promise.all(addedImages.map(img => saveImage(img)));
        for (let i = 0; i < results.length; i++) {
            addedImages[i]._id = results[i]._id;
            addedImages[i].url = results[i].url;
        }

        setImagesContainer({ images });
        good.images = images;
        setGood(good);
    }
    const preview = show => {
        setShowPreview(show);
    }

    let isExistingGood = good?._id;
    const saveFullGood = async () => {
        let images = imagesContainer.images.map(img => ({ _id: img._id }));
        good = { ...good, images };
        saveGood({ good })
            .then(res => {
                let _id = res.data?.GoodUpsert?._id;
                if (_id && !isExistingGood) {
                    history.push(`/editgood/${_id}`);
                }
                return res;
            });
    }
    if (good)
        good.categories ??= [];
    const currentCategory = good.categories?.length > 0 ? good.categories[0] : undefined;
    return good && (
        <>
            <Container maxWidth={maxWidth}>
                <CategoryBreadcrumbs category={currentCategory} showLeafAsLink={true} />
                <Card variant='outlined'>
                    <Grid container spacing={maxWidth === 'xs' ? 7 : 5} rowSpacing={2}>
                        <Grid item xs={12}>
                            <Grid container spacing={2}>
                                <Grid item xs={4}>
                                    <CardMedia
                                        component="img"
                                        sx={{ height: 300, padding: "1em 1em 0 1em", objectFit: "contain" }}
                                        image={good.images?.length > 0 ? getFullImageUrl(good.images[0]) : ''}
                                        title={good.name}
                                    />
                                </Grid>
                                <Grid item xs={8}>
                                    <CardContent>
                                        <Grid container rowSpacing={2}>
                                            <Grid item width="100%">
                                                {
                                                    <CCategoryDropDownList currentCat={currentCategory} onSetCategory={onSetCategory} />
                                                }
                                            </Grid>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Name"
                                                    value={good.name}
                                                    onChange={event => setGoodData({ name: event.target.value })}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Price"
                                                    type="number"
                                                    startAdornment={<InputAdornment position="start">$</InputAdornment>}
                                                    value={good.price}
                                                    onChange={event => setGoodData({ price: +event.target.value })}
                                                    fullWidth
                                                />
                                            </Grid>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Description"
                                                    value={good.description}
                                                    onChange={event => setGoodData({ description: event.target.value })}
                                                    multiline={true}
                                                    rows={15}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    {showPreview &&
                        <ModalContainer onCloseClick={() => preview(false)}>
                            <CGood good={good} editable={false} />
                        </ModalContainer>
                    }
                    <CardActions>
                        <Button size='small' color='primary'
                            onClick={() => saveFullGood(good)}
                        >
                            Save
                        </Button>
                        <Button size='small' color='primary'
                            onClick={() => setGood(copyGood(goodExt))}
                        >
                            Cancel
                        </Button>
                        <Button size='small' color='primary'
                            onClick={() => preview(true)}
                        >
                            Preview
                        </Button>
                    </CardActions>
                    <CSortedFileDropZone items={good.images} sx={{ maxWidth: "15vh" }} itemProp={{ sx: { maxWidth: "15vh" } }} onChange={items => onChangeImages(items)} />
                </Card>
            </Container>
        </>
    )
}

const CEditableGood = ({ maxWidth = 'md' }) => {
    const { _id } = useParams();
    let { isLoading, data } = useGetGoodByIdQuery(_id || 'fwkjelnfvkjwe');
    isLoading = _id ? isLoading : false;
    let good = isLoading ? { name: 'loading', categories: [] } : data?.GoodFindOne;
    const [saveGoodMutation, { }] = useSaveGoodMutation();
    const state = useSelector(state => state);
    let currentCategory = getCurrentEntity(frontEndNames.category, state)

    let isAdmin = isCurrentUserAdmin(state);

    if (!isLoading && !good && isAdmin) {
        let categories = currentCategory ? [{ _id: currentCategory._id, name: currentCategory.name }] : [];
        good = { _id: undefined, categories, images: [] };
    }

    return !isLoading &&
        (isAdmin ? <EditableGood good={good} saveGood={saveGoodMutation} maxWidth={maxWidth} /> : <LackPermissions name="good" />)
}


export { CEditableGood }

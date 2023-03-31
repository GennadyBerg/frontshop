import { useSelector } from "react-redux"
import { useParams } from "react-router-dom";
import { Button, Card, CardActions, CardContent, CardMedia, Container, Grid, TextField, Typography } from "@mui/material";
import { useState } from "react";
import { getFullImageUrl, saveImage } from "../utills/utils";
import { isCurrentUserAdmin, useGetCategoryByIdQuery, useSaveCategoryMutation } from "../reducers";
import { CCategoryDropDownList } from "./DropDownList";

const EditableCategory = ({ category: categoryExt, maxWidth = 'md', saveCategory }) => {
    const copyCategory = category => ({ ...category });

    let [category, setCategory] = useState(copyCategory(categoryExt));

    const onSetParentCategory = (parentCat) => {
        let cat = parentCat?.cat;
        return setCategoryData({ parent: cat ? { _id: cat._id, name: cat.name } : undefined });
    }

    const setCategoryData = (data) => {
        let categoryData = copyCategory({ ...category, ...data });
        setCategory(categoryData);
        return categoryData;
    }
    const saveFullCategory = async () => {
        saveCategory({ category: { _id: category._id, name: category.name, parent: category.parent ?? null, image: { _id: category.image?._id } ?? null } });
    }

    const uploadAvatar = async param => {
        let image = await saveImage({ data: param.target.files[0] }, false);
        setCategoryData({ image });
    }

    return category && (
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
                                        image={getFullImageUrl(category.image)}
                                        title={category.name}
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
                                                {
                                                    <CCategoryDropDownList currentCat={category.parent} onSetCategory={onSetParentCategory} showClearButton={true} />
                                                }
                                            </Grid>
                                            <Grid item width="100%">
                                                <TextField
                                                    required
                                                    id="outlined-required"
                                                    label="Name"
                                                    value={category.name}
                                                    onChange={event => setCategoryData({ name: event.target.value })}
                                                    fullWidth
                                                />
                                            </Grid>
                                        </Grid>
                                    </CardContent>
                                </Grid>
                            </Grid>
                        </Grid>
                    </Grid>
                    <CardActions>
                        <Button size='small' color='primary'
                            onClick={() => saveFullCategory(category)}
                        >
                            Save
                        </Button>
                        <Button size='small' color='primary'
                            onClick={() => setCategory(copyCategory(categoryExt))}
                        >
                            Cancel
                        </Button>
                    </CardActions>
                </Card>
            </Container >
        </>
    )
}

const CEditableCategory = ({ maxWidth = 'md' }) => {
    const { _id } = useParams();
    const { isLoading, data } = useGetCategoryByIdQuery(_id);
    const [saveCategoryMutation, { }] = useSaveCategoryMutation();

    let category = isLoading ? undefined : data?.CategoryFindOne;
    let state = useSelector(state => state)
    let isAdmin = isCurrentUserAdmin(state);

    if (!_id && isAdmin) {
        category = { _id: undefined, name: undefined, parent: null };
    }

    return (!isLoading || !_id) && category && isAdmin ? (
        <EditableCategory category={category} maxWidth={maxWidth} saveCategory={saveCategoryMutation} />) :
        isLoading ? <Typography>Loading</Typography> : <Typography>Permission denied</Typography>;
}


export { CEditableCategory }
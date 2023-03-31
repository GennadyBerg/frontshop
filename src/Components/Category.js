import { List, ListItem, ListItemButton, ListItemText, Button } from "@mui/material"
import { Typography, Grid } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useEffect } from "react"
import { connect, useDispatch, useSelector } from "react-redux"
import { useParams } from "react-router-dom"
import { MyLink } from "."
import { isCurrentUserAdmin, useGetCategoryByIdQuery } from "../reducers"
import { actionSetCurrentEntity, frontEndNames, getCurrentEntity } from "../reducers/frontEndReducer"
import { CategoryBreadcrumbs } from "./CategoryBreadcrumbs"
import { CGoodsList } from "./GoodsList"
import { LoadingState } from "./LoadingState"
import { CatsList } from "./RootCats"

const CSubCategories = connect(state => ({ cats: getCurrentEntity(frontEndNames.category, state)?.subCategories }),
    {})(CatsList);

const Category = () => {
    const { _id } = useParams();
    const { isLoading, data } = useGetCategoryByIdQuery(_id);
    let cat = isLoading ? { name: 'loading', goods: [] } : data?.CategoryFindOne;
    let csubCats = false;
    const dispatch = useDispatch();
    let state = useSelector(state => state);
    useEffect(() => {
        if (getCurrentEntity(frontEndNames.category, state)?._id !== _id)
            dispatch(actionSetCurrentEntity(frontEndNames.category, { _id }));
        if (!isLoading)
            dispatch(actionSetCurrentEntity(frontEndNames.category, data.CategoryFindOne));
    }, [_id, isLoading, data]);
    let isAdmin = isCurrentUserAdmin(state);
    return isLoading ? <LoadingState /> : (
        <>
            <Container>
                <Box>
                    <CategoryBreadcrumbs category={cat} />
                    {
                        isAdmin && (
                            <>
                                <Grid container spacing={2} justifyContent="center">
                                    <Grid item>
                                        <MyLink to="/editgood">
                                            <Button size='small' variant="contained" >
                                                Add Good
                                            </Button>
                                        </MyLink>
                                    </Grid>
                                    <Grid item>
                                        <MyLink to={`/editcategory/${cat._id}`}>
                                            <Button size='small' variant="contained" >
                                                Edit Category
                                            </Button>
                                        </MyLink>
                                    </Grid>
                                </Grid>
                            </>
                        )
                    }
                    <Typography paragraph gutterBottom component={'h3'} variant={'h3'} sx={{ marginTop: "1vh" }} >
                        {cat.name}
                    </Typography>
                    {csubCats && <CSubCategories />}
                    {!csubCats && cat.subCategories?.length > 0 && (
                        <List>
                            {cat.subCategories.map(scat => (
                                <ListItem key={scat._id} disablePadding>
                                    <ListItemButton>
                                        <MyLink to={`/category/${scat._id}`} >
                                            <ListItemText
                                                disableTypography
                                                primary={
                                                    <Typography paragraph gutterBottom component={'h4'} variant={'h4'} sx={{ marginTop: "1vh", marginLeft: "18vh" }} >
                                                        {scat.name}
                                                    </Typography>
                                                }
                                            />
                                        </MyLink>
                                    </ListItemButton>
                                </ListItem>
                            ))}
                        </List>
                    )
                    }
                    <CGoodsList goods={cat.goods} />
                </Box>
            </Container>
        </>
    )
}

const CCategory = connect(state => ({}),
    {})(Category);

export { CCategory };
import React from "react";
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material";
import { MyLink } from ".";
import { useGetRootCategoriesQuery } from "../reducers";
import { AvatarImage } from "./AvatarAnimated";
import ListItemAvatar from '@mui/material/ListItemAvatar';
import CategoryIcon from '@mui/icons-material/Category';
import { getFullImageUrl } from "../utills";

export const CatsList = ({ cats = [] }) => {
    const [selectedIndex, setSelectedIndex] = React.useState(-1);

    const handleListItemClick = (event, index) => {
        setSelectedIndex(index);
    };
    return (
        <List sx={{ bgcolor: "" }}>
            {cats && cats?.map((cat, index) => (
                <CatItem cat={cat} key={cat._id} index={index} selectedIndex={selectedIndex} handleListItemClick={handleListItemClick} />
            ))}
        </List>
    )
};

const CatItem = ({ cat, index, selectedIndex, handleListItemClick }) => {
    return (
        <MyLink to={`/category/${cat._id}`}>
            <ListItemButton
                selected={index === selectedIndex}
                onClick={(event) => handleListItemClick(event, index)}
            >
                <ListItemAvatar>
                    {
                        cat.image?.url ?
                            <AvatarImage variant='rounded' src={getFullImageUrl(cat.image)} />
                            :
                            <AvatarImage variant='rounded' sx={{ bgcolor: "rgba(184, 200, 239, 0.63)" }}><CategoryIcon color="secondary" /></AvatarImage>
                    }
                </ListItemAvatar>
                <ListItemText
                    primary={cat.name}
                />
            </ListItemButton>
        </MyLink>
    );
    return (
        <ListItem key={cat._id} disablePadding>
            <ListItemButton>
                <MyLink to={`/category/${cat._id}`}>
                    <ListItemText primary={cat.name} />
                </MyLink>
            </ListItemButton>
        </ListItem>
    )
};

const CRootCats = () => {
    const { isLoading, data } = useGetRootCategoriesQuery();
    let cats = data?.CategoryFind;

    return !isLoading && cats && <CatsList cats={cats} />
}

export { CRootCats };
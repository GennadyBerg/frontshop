import { Breadcrumbs } from "@mui/material";
import { Typography } from "@mui/material";
import { MyLink } from ".";

export const CategoryBreadcrumbs = ({ category, showLeafAsLink = false }) => {
    return (
        <Breadcrumbs aria-label="breadcrumb">
            <MyLink underline="hover" color="inherit" to="/">
                Home
            </MyLink>
            {
                category.parent?._id && (
                    <MyLink
                        underline="hover"
                        color="inherit"
                        to={`/category/${category.parent?._id}`}
                    >
                        {category.parent?.name}
                    </MyLink>
                )}
            {
                showLeafAsLink ?
                        <MyLink
                            underline="hover"
                            color="inherit"
                            to={`/category/${category._id}`}
                        >
                            {category.name}
                        </MyLink>
                    :
                    <Typography color="text.primary">{category.name}</Typography>
            }
        </Breadcrumbs>
    );
};

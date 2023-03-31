import { Typography } from "@mui/material"

export const LackPermissions = ({name = '', method = 'view'}) => {
    return (
        <>
            <Typography component="h3" variant="h3">{`Insuffcient permissions to ${method} ${name}`}</Typography>
        </>
    )
}
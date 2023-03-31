import React from 'react';
import { Container, Typography, Paper, Avatar, Button } from '@mui/material';
import { Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from './StyledTableElements';
import { CPagination } from './Pagination';
import { CSearchInput } from './SearchInput';
import { MyLink, ReferenceLink } from '.';
import { useSelector } from 'react-redux';
import { frontEndNames, getCurrentUser, getEntitiesListShowParams, useGetCategoriesCountQuery, useGetCategoriesQuery } from '../reducers';
import { UserEntity } from '../Entities';
import { getFullImageUrl } from '../utills';

const CategoriesList = ({ entities, entitiesTypeName, fromPage, pageSize, isAdmin }) => {

    let headCells = [
        {
            id: '#',
            numeric: true,
            disablePadding: true,
            label: '#',
            align: "center"
        },
        {
            id: 'Image',
            numeric: false,
            disablePadding: true,
            label: 'Image',
            align: "center"
        },
        {
            id: 'Name',
            numeric: false,
            disablePadding: true,
            label: 'Name',
        },

        {
            id: 'Owner',
            numeric: false,
            disablePadding: true,
            label: 'Owner',
            align: "right"
        },
        {
            id: 'Parent',
            numeric: false,
            disablePadding: true,
            label: 'Parent',
            align: "right"
        },
    ]
    return (
        <>
            <Container maxWidth="lg" sx={{marginTop: "1vh"}}>
                {
                    isAdmin && (
                        <MyLink to="/editcategory">
                            <Button size='small' variant="contained" >
                                Add Category
                            </Button>
                        </MyLink>
                    )
                }
                <CSearchInput entitiesTypeName={entitiesTypeName} />
                <TableContainer component={Paper} >
                    <Table sx={{ overflow: 'scroll' }} >
                        <TableHead>
                            <TableRow>
                                {
                                    headCells.map(headCell => {
                                        return <StyledTableCell key={headCell.id} align={headCell.align}>{headCell.label}</StyledTableCell>
                                    })
                                }
                            </TableRow>
                        </TableHead>
                        {entities?.length > 0 && (
                            <TableBody>
                                {
                                    entities.map((entity, index) => {
                                        return (
                                            <StyledTableRow key={entity._id}>
                                                <StyledTableCell align="right" >
                                                    <Typography>
                                                        {(fromPage * pageSize) + index + 1}.
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    <Avatar variant='rounded' key={index} src={getFullImageUrl(entity.image)} />
                                                </StyledTableCell>
                                                <StyledTableCell  >
                                                    <MyLink to={`/category/${entity._id}`}>
                                                        <Typography >
                                                            <ReferenceLink entity={entity} path='editcategory' getText={ref => ref?.name || "<no name>"} />
                                                        </Typography>
                                                    </MyLink>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    {
                                                        <ReferenceLink entity={entity} refName='owner' typeName={frontEndNames.users} getText={ref => ref ? ref.nick || ref.login : "No owner"} />
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    {
                                                        <ReferenceLink entity={entity} refName='parent' path='editablecategory' getText={ref => ref ? ref.name : "ROOT"} />
                                                    }
                                                </StyledTableCell>
                                            </StyledTableRow>
                                        )
                                    })
                                }
                            </TableBody>
                        )}
                    </Table>
                    <CPagination entitiesTypeName={entitiesTypeName} />
                </TableContainer>
            </Container>
        </>
    )

}
const CCategoriesList = () => {
    let entitiesTypeName = frontEndNames.category;
    let state = useSelector(state => state);
    const { fromPage, pageSize, searchStr } = getEntitiesListShowParams(entitiesTypeName, state);
    let currentUser = useSelector(state => new UserEntity(getCurrentUser(state)));

    const categoriesResult = useGetCategoriesQuery({ withParent: true, withChildren: true, withOwner: true, fromPage, pageSize, searchStr, owner: currentUser });
    const categoriesCountResult = useGetCategoriesCountQuery({ searchStr, owner: currentUser }, { refetchOnMountOrArgChange: true });
    let isLoading = categoriesResult.isLoading || categoriesCountResult.isLoading;

    let entities = !isLoading && categoriesResult.data?.CategoryFind;
    return !isLoading && <CategoriesList entities={entities} isAdmin={currentUser.isAdminRole} entitiesTypeName={entitiesTypeName} fromPage={fromPage} pageSize={pageSize} />
}

export { CCategoriesList };
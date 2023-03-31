import React from 'react';
import { Container, Typography, Paper } from '@mui/material';
import { Table, TableBody, TableContainer, TableHead, TableRow } from "@mui/material";
import { StyledTableCell, StyledTableRow } from './StyledTableElements';
import { CPagination } from './Pagination';
import { CSearchInput } from './SearchInput';
import { MyLink, ReferenceLink } from '.';
import { useSelector } from 'react-redux';
import { frontEndNames, getCurrentUser, getEntitiesListShowParams, useGetOrdersCountQuery, useGetOrdersQuery } from '../reducers';
import { UserEntity } from '../Entities';
import { fixBackendDataError } from '../utills';


const OrderList = ({ entities, entitiesTypeName, fromPage, pageSize }) => {

    let headCells = [
        {
            id: '#',
            numeric: true,
            disablePadding: true,
            label: '#',
            align: "center"
        },
        {
            id: 'Date',
            numeric: true,
            disablePadding: true,
            label: 'Date',
        },
        {
            id: 'Order ID',
            numeric: true,
            disablePadding: true,
            label: 'Order ID',
        },
        {
            id: 'Total ($)',
            numeric: true,
            disablePadding: true,
            label: 'Total ($)',
            align: "right"
        },
        {
            id: 'Owner',
            numeric: true,
            disablePadding: true,
            label: 'Owner',
            align: "right"
        },
        {
            id: 'Note',
            numeric: true,
            disablePadding: true,
            label: 'Note',
            align: "right"
        },
    ]
    return (
        <>
            <Container maxWidth="lg">
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
                                    entities.map((order, index) => {
                                        return (
                                            <StyledTableRow key={order._id}>
                                                <StyledTableCell align="right" >
                                                    <Typography>
                                                        {(fromPage * pageSize) + index + 1}.
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell  >
                                                    {new Date(+order.createdAt).toLocaleString()}
                                                </StyledTableCell>
                                                <StyledTableCell  >
                                                    <MyLink to={`/order/${order._id}`}>
                                                        <Typography >
                                                            {order._id}
                                                        </Typography>
                                                    </MyLink>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    <Typography >
                                                        {order.total}
                                                    </Typography>
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    {
                                                        <ReferenceLink entity={order} refName='owner' typeName={frontEndNames.users} getText={ref => ref ? ref.nick || ref.login : "No owner"} />
                                                    }
                                                </StyledTableCell>
                                                <StyledTableCell align="right" >
                                                    <Typography>
                                                        {order.notes}
                                                    </Typography>
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
const COrdersList = () => {
    let entitiesTypeName = frontEndNames.orders;
    let state = useSelector(state => state);
    const { fromPage, pageSize, searchStr } = getEntitiesListShowParams(entitiesTypeName, state);
    let currentUser = useSelector(state => new UserEntity(getCurrentUser(state)));

    const ordersResult = useGetOrdersQuery({ fromPage, pageSize, searchStr, owner: currentUser });
    const ordersCountResult = useGetOrdersCountQuery({ searchStr, owner: currentUser });
    let isLoading = ordersResult.isLoading || ordersCountResult.isLoading;

    let entities = !isLoading && fixBackendDataError(ordersResult, "OrderFind");
    return !isLoading && <OrderList entities={entities} entitiesTypeName={entitiesTypeName} fromPage={fromPage} pageSize={pageSize} />
}


export { COrdersList };
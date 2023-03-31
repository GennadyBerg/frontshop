import React from 'react';
import { Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { useSelector } from "react-redux"
import { useGetOrderByIdQuery } from "../reducers/ordersReducer"
import { OrderGoodsList } from "./OrderGoodsList"
import { useParams } from 'react-router-dom/cjs/react-router-dom';
import { MyLink } from './MyLink';
import { getCurrentUser } from '../reducers';
import { UserEntity } from '../Entities';
import { LackPermissions } from './LackPermissions';
import { fixBackendDataError } from '../utills';
import { LoadingState } from './LoadingState';

const Order = ({ order = {} }) => {
    return (
        <>
            <Container>
                <Box>
                    <Typography paragraph gutterBottom component={'h3'} variant={'h3'}>
                        Order# {order._id}
                    </Typography>
                    <Typography gutterBottom variant='body2' color='textSecondary' component='p'>
                        {`Created at: ${new Date(+order.createdAt).toLocaleString()}`}
                    </Typography>
                    <Typography paragraph gutterBottom component={'h4'} variant={'h4'}>
                        {
                            order.owner ?
                                <MyLink to={`/user/${order.owner._id}`}>
                                    Owner# {order.owner?.nick || order.owner?.login}
                                </MyLink>
                                :
                                "No owner"
                        }
                    </Typography>
                    <OrderGoodsList orderGoods={order?.orderGoods} />
                </Box>
            </Container>
        </>
    )
}
const COrder = () => {
    const { _id } = useParams();
    let currentUser = useSelector(state => getCurrentUser(state));
    
    let getOrderById= useGetOrderByIdQuery({ _id, owner: new UserEntity(currentUser) });
    let order = getOrderById.isLoading ? { name: 'loading', order: {} } : fixBackendDataError(getOrderById, "OrderFindOne");
    return !getOrderById.isLoading && 
        order ?
        <Order order={order} />
        :
        getOrderById.isLoading ? <LoadingState /> : <LackPermissions name="order"/>
        ;
}

export { COrder };
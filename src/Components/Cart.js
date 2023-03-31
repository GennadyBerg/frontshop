import React from 'react';
import { Button, Typography } from "@mui/material"
import { Box, Container } from "@mui/system"
import { connect, useSelector } from "react-redux"
import { getCurrentUser, useAddOrderMutation, useGetGoodsByIdQuery } from "../reducers"
import { CartGoodsList } from "./CartGoodsList"
import { findObjectIndexById } from '../utills';
import { MyLink } from './MyLink';

const mapCountToGood = (goodData, goodsCounts) => {
    let count = 0;
    let goodIdx = findObjectIndexById(goodsCounts, goodData._id);
    if (goodIdx >= 0)
        count = goodsCounts[goodIdx].count;
    return count;
}

const Cart = () => {
    let goods = useSelector(state => state.cart?.goods) ?? [];
    let { isLoading, data } = useGetGoodsByIdQuery({ goods });
    let goodsData = data?.GoodFind?.map(gd => ({ ...gd, count: mapCountToGood(gd, goods) })) ?? [];
    let order = [];
    for (let good of Object.values(goods)) {
        order.push({ good: { _id: good._id }, count: good.count });
    }
    let currentUser = useSelector(state => getCurrentUser(state));
    const [addOrderMutation, { isLoading: isOrderAdding }] = useAddOrderMutation();
    return !isLoading && (
        <>
            <Container>
                <Box>
                    <Typography paragraph gutterBottom component={'h3'} variant={'h3'}>
                        Cart
                    </Typography>
                    <CartGoodsList goods={goodsData ?? []} />
                    {
                        !currentUser ?
                            <>
                                <Typography>User not logged in. </Typography>
                                <MyLink to='/login'>Please login</MyLink>

                            </> :
                            <Button size='small' color='primary' disabled={isOrderAdding || goodsData.length === 0}
                                onClick={() => addOrderMutation({ order })}
                            >
                                Place Order
                            </Button>
                    }
                </Box>
            </Container>
        </>
    )
}
const CCart = connect(state => ({
}),
    {})(Cart);

export { CCart };
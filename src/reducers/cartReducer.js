import { createSlice } from "@reduxjs/toolkit"
import { v4 } from "uuid";
import { history } from "../App";
import { findObjectIndexById } from "../utills";
import { ordersApi } from "./ordersReducer";

const cartSlice = createSlice({ 
    name: 'cart', //префикс типа наподобие AUTH_
    initialState: {
        goods: []
    },
    reducers: {
        restoreCart(state) {
            let goods = localStorage.cart?.goods ?? [];
            if (!goods) {
                goods = [];
                localStorage.cart = { goods: goods };
            }
            setStateData(state, goods, v4());
            return state;
        },
        cleanCart(state) {
            return cleanCartInt(state);
        },
        refreshCart(state) {
            state.uniqueId = v4();
            return state;
        },
        addGood(state, action) {
            let { _id, count = 1 } = action.payload.good;
            let goods = state.goods;
            let goodIdx = findObjectIndexById(goods, _id);
            let good;
            if (goodIdx < 0) {
                goodIdx = goods.length;
                good = { _id: _id, count: 0 }
            }
            else {
                good = goods[goodIdx];
            }

            count = good.count + count;
            if (count > 0) {
                good.count = count;
                state.goods[goodIdx] = good;
                state.uniqueId = v4()
            }
            return state;
        },
        deleteGood(state, action) {
            let { _id } = action.payload.good;
            let goods = state.goods;
            let goodIdx = findObjectIndexById(goods, _id);
            if (goodIdx >= 0) {
                goods.splice(goodIdx, 1);
                state.goods = goods;
                state.uniqueId = v4()
            }
            return state;
        }
    },
    extraReducers: builder => {
        builder.addMatcher(ordersApi.endpoints.addOrder.matchFulfilled,
            (state, { payload }) => {
                cleanCartInt(state);
                let orderId = payload.OrderUpsert._id;
                history.push(`/order/${orderId}`);
            });
    }
})

const getCartItemsCount = state => {
    return state.cart?.goods?.reduce((sum, g) => sum + g.count, 0);
}

function cleanCartInt(state) {
    localStorage.cart = { goods: [] };
    setStateData(state, [], v4());
    return state;
}

let actionAddGoodToCart = (good, count = 1) =>
    async (dispatch, state) => {
        dispatch(cartSlice.actions.addGood({ good: { ...good, count } }))
    }

let actionDeleteGoodFromCart = good =>
    async dispatch => {
        dispatch(cartSlice.actions.deleteGood({ good }))
    }

let actionRestoreCart = () =>
    async dispatch => {
        dispatch(cartSlice.actions.restoreCart({}))
    }

let actionClearCart = () =>
    async dispatch => {
        dispatch(cartSlice.actions.cleanCart({}))
    }

const setStateData = (state, goods, uniqueId = undefined) => {
    if (goods !== undefined)
        state.goods = goods;
    if (uniqueId !== undefined)
        state.uniqueId = uniqueId;
}



export {
    cartSlice, 
    actionAddGoodToCart, actionDeleteGoodFromCart, actionRestoreCart,
    actionClearCart,
    getCartItemsCount
};
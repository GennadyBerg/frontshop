import { createSlice } from "@reduxjs/toolkit"
import { categoryApi } from "./categoryReducer";
import { goodsApi } from "./goodsReducer";
import { ordersApi } from "./ordersReducer";
import { authApi } from "./authReducer";
import { capitalize } from "../utills";

export class frontEndNames {
    static category = "category";
    static orders = "orders";
    static users = "users";
    static goods = "goods";
    static entitiesPagingName = name => `${name}Paging`;
    static currentEntityName = name => `current${capitalize(name)}`;
    static entitiesCountName = name => `${name}Count`;
    static searchStrName = name => `${name}SearchStr`;
}

const frontEndSlice = createSlice({ //promiseReducer
    name: 'frontend', //префикс типа наподобие AUTH_
    initialState: {
        sidebar: {},
        [frontEndNames.entitiesPagingName(frontEndNames.orders)]: { fromPage: 0, pageSize: 10 },
        [frontEndNames.entitiesPagingName(frontEndNames.users)]: { fromPage: 0, pageSize: 10 },
        [frontEndNames.entitiesPagingName(frontEndNames.goods)]: { fromPage: 0, pageSize: 5 },
        [frontEndNames.entitiesPagingName(frontEndNames.category)]: { fromPage: 0, pageSize: 5 }
    }, //state={} в параметрах
    reducers: {
        setSidebar(state, action) {
            state.sidebar = { opened: action.payload.open };
            return state;
        },
        setPaging(state, action) {
            let name = action.payload.name;
            let { fromPage, pageSize } = action.payload;
            let paging = state[frontEndNames.entitiesPagingName(name)];
            fromPage = fromPage ?? paging?.fromPage;
            pageSize = pageSize ?? paging?.pageSize;
            state[frontEndNames.entitiesPagingName(name)] = { fromPage, pageSize };
            return state;
        },
        setSearch(state, action) {
            state[frontEndNames.searchStrName(action.payload.name)] = action.payload.searchStr;
        },
        setCurrent(state, action) {
            state[frontEndNames.currentEntityName(action.payload.name)] = { payload: action.payload.entity };
            return state;
        },

    },
    extraReducers: builder => {
        builder.addMatcher(goodsApi.endpoints.getGoodsCount.matchFulfilled,
            (state, { payload }) => {
                state.goods = { goodsCount: { payload: payload.GoodCount } }
            });
        builder.addMatcher(categoryApi.endpoints.getCategoryById.matchFulfilled,
            (state, { payload }) => {
                state.goodsPaging.fromPage = 0;
            });
        builder.addMatcher(ordersApi.endpoints.getOrdersCount.matchFulfilled,
            (state, { payload }) => {
                setEntitiesCount(frontEndNames.orders, state, payload.OrderCount);
            });
        builder.addMatcher(authApi.endpoints.getUsersCount.matchFulfilled,
            (state, { payload }) => {
                setEntitiesCount(frontEndNames.users, state, payload.UserCount);
            });
        builder.addMatcher(categoryApi.endpoints.getCategoriesCount.matchFulfilled,
            (state, { payload }) => {
                setEntitiesCount(frontEndNames.category, state, payload.CategoryCount);
            });
    }
})


let actionSetPaging = (name, { fromPage, pageSize }) =>
    async dispatch => {
        dispatch(frontEndSlice.actions.setPaging({ fromPage, pageSize, name }))
    }

let actionSetCurrentEntity = (name, entity) =>
    async dispatch => {
        dispatch(frontEndSlice.actions.setCurrent({ entity, name }))
    }

let actionSetSearch = (name, searchStr) =>
    async dispatch => {
        dispatch(frontEndSlice.actions.setSearch({ searchStr, name }));
    }

const getEntitiesPaging = (name, state) => {
    let paging = state.frontend[frontEndNames.entitiesPagingName(name)];
    return { fromPage: paging.fromPage, pageSize: paging.pageSize };
}

const getEntitiesSearchStr = (name, state) => {
    return { searchStr: state.frontend[frontEndNames.searchStrName(name)] };
}

const getCurrentEntity = (name, state) => {
    let result = state.frontend[frontEndNames.currentEntityName(name)]?.payload;
    return result;
}

const setEntitiesCount = (name, state, count) => {
    state[name] = { [frontEndNames.entitiesCountName(name)]: { payload: count } }
    return state;
}
const getEntitiesCount = (name, state) => {
    return state.frontend[name][frontEndNames.entitiesCountName(name)]?.payload ?? 0;
}

const getEntitiesListShowParams = (name, state) => {
    return { ...getEntitiesPaging(name, state), ...getEntitiesSearchStr(name, state) };
}

const actionSetSidebar = open =>
    async dispatch => {
        dispatch(frontEndSlice.actions.setSidebar({ open }))
    }

const getIsSideBarOpen = state => {
    return state.frontend?.sidebar.opened === true;
}

export { frontEndSlice, actionSetSidebar };
export { getIsSideBarOpen, actionSetPaging, actionSetSearch, getEntitiesCount, getCurrentEntity, actionSetCurrentEntity, getEntitiesSearchStr, getEntitiesPaging, getEntitiesListShowParams }

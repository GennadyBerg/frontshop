import { gql } from "graphql-request";
import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from '@rtk-query/graphql-request-base-query' //npm install
import { getFullBackendUrl, jwtDecode } from "../utills";
import { createSlice } from "@reduxjs/toolkit";
import { history } from "../App";
import { UserEntity } from "../Entities";
import { createFullQuery } from "../utills";

const getUsersSearchParams = (searchStr, queryExt) => (
    {
        searchStr: searchStr,
        searchFieldNames: ["nick", "login"],
        queryExt
    });

export const prepareHeaders = (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
}

const authApi = createApi({
    reducerPath: "authApi",
    baseQuery: graphqlRequestBaseQuery({
        url: getFullBackendUrl('/graphql'),
        prepareHeaders
    }),
    endpoints: (builder) => ({
        login: builder.mutation({
            query: ({ login, password }) => ({
                document: gql`
                    query login($login: String, $password: String) {
                        login(login: $login, password: $password) 
                    }
                    `,
                variables: { login, password }
            })
        }),
        register: builder.mutation({
            query: ({ login, password, nick }) => ({
                document: gql`
                mutation UserRegistration($login: String, $password: String, $nick: String) {
                    UserUpsert(user: {login: $login, password: $password, nick: $nick}) {
                      _id
                      createdAt
                      nick
                      acl
                    }
                  }
                    `,
                variables: { login, password, nick: nick || login }
            })
        }),
        userFind: builder.query({
            query: (_id) => ({
                document: gql`
                    query UserFind($q: String) {
                        UserFindOne(query: $q){
                            _id login nick acl avatar {_id url} createdAt
                        } 
                    }
                    `,
                variables: { q: JSON.stringify([{ _id }]) }
            }),
            providesTags: (result, error, id) => ([{ type: 'User', id }])
        }),
        saveUser: builder.mutation({
            query: ({ user }) => ({
                document: gql`
                            mutation UserUpsert($user: UserInput) {
                                UserUpsert(user: $user) {
                                    _id acl
                                }
                            }
                        `,
                variables: { user }
            }),
            invalidatesTags: (result, error, arg) => ([{ type: 'User', id: arg._id }])
        }),
        getUsers: builder.query({
            query: ({ fromPage, pageSize, searchStr = '' }) => {
                let params = createFullQuery(getUsersSearchParams(searchStr), { fromPage, pageSize, sort: { _id: -1 } });
                return {
                    document: gql`
                        query UserFind($q: String) {
                            UserFind(query: $q){
                                _id login nick acl avatar {_id url} createdAt
                            } 
                        }                
                    `,
                    variables: params
                }
            },
        }),
        getUsersCount: builder.query({
            query: ({ searchStr = '' }) => {
                let params = createFullQuery(getUsersSearchParams(searchStr));
                return {
                    document: gql`
                            query UsersCount($q: String) { UserCount(query: $q) }
                    `,
                    variables: params
                }
            },
        }),

    }),
})

const authSlice = createSlice({
    name: 'auth',
    initialState: {},
    reducers: {
        logout(state) { 
            history.push('/');
            return {}
        }
    },
    extraReducers: builder => {
        builder.addMatcher(authApi.endpoints.login.matchFulfilled,
            (state, { payload }) => {
                const tokenPayload = jwtDecode(payload.login);
                if (tokenPayload) {
                    state.token = payload.login;
                    state.payload = tokenPayload;
                    state.currentUser = { _id: tokenPayload.sub.id };
                    history.push('/');
                }
            });
        builder.addMatcher(authApi.endpoints.userFind.matchFulfilled,
            (state, { payload }) => {
                let retrievedUser = payload?.UserFindOne;
                if (retrievedUser?._id === state.currentUser?._id)
                    state.currentUser = retrievedUser;
            });
    }
})

const actionAboutMe = () =>
    async (dispatch, getState) => {
        const auth = getState().auth
        if (auth.token) {
            dispatch(authApi.endpoints.userFind.initiate(auth.currentUser._id))
        }
    }

const getCurrentUser = state => state.auth?.currentUser ?? {};
const isCurrentUserAdmin = state =>{
    let currentUser = getCurrentUser(state);
    return currentUser ? new UserEntity(currentUser).isAdminRole : false;
}

const { logout: actionAuthLogout } = authSlice.actions;

export const { useLoginMutation, useUserFindQuery, useSaveUserMutation, useGetUsersQuery, useGetUsersCountQuery, useRegisterMutation } = authApi;
export { authApi, authSlice, actionAuthLogout, actionAboutMe, getCurrentUser, isCurrentUserAdmin  }


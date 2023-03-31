import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query"
import { gql } from "graphql-request";
import { createFullQuery, getFullBackendUrl } from '../utills';

export const prepareHeaders = (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
}
const getGoodsSearchParams = (searchStr, queryExt) => (
    {
        searchStr: searchStr,
        searchFieldNames: ["name", "description"],
        queryExt
    });

export const goodsApi = createApi({
    reducerPath: 'goods',
    baseQuery: graphqlRequestBaseQuery({
        url: getFullBackendUrl('/graphql'),
        prepareHeaders
    }),
    tagTypes: ['Good', 'GoodCount'],
    endpoints: (builder) => ({
        getGoods: builder.query({
            query: ({ fromPage, pageSize, searchStr = '', queryExt = {} }) => {
                let params = createFullQuery(
                    getGoodsSearchParams(searchStr, queryExt),
                    { fromPage, pageSize });
                return {
                    document: gql`
                        query GoodFind($q: String) {
                            GoodFind(query: $q) {
                                _id name  price description
                                images { _id url }
                            }
                        }
                `,
                    variables: params
                }
            },
            providesTags: (result) => {
                return result
                    ? [...result.GoodFind.map(obj => ({ type: 'Good', _id: obj._id })), 'Good']
                    : ['Good'];
            }
        }),
        getGoodsCount: builder.query({
            query: ({ searchStr = '', queryExt = {} }) => {
                let params = createFullQuery(
                    getGoodsSearchParams(searchStr, queryExt));
                return {
                    document: gql`
                        query GoodsCount($q: String) { GoodCount(query: $q) }
                    `,
                    variables: params
                }
            },
            providesTags: ['GoodCount'],
        }),
        getGoodById: builder.query({
            query: (_id) => {
                let params = createFullQuery({ searchStr: _id, searchFieldNames: ["_id"] });
                return {
                    document: gql`
                        query GoodFindOne($q: String) {
                            GoodFindOne(query: $q) {
                                _id name  price description categories { _id name }
                                images { _id url }
                            }
                        }
                    `,
                    variables: params
                }
            },
            providesTags: (result) => {
                return result
                    ? [{ type: 'Good', _id: result.GoodFindOne?._id }, 'Good']
                    : ['Good'];
            }
        }),
        getGoodsById: builder.query({
            query: ({ goods }) => {
                let params = createFullQuery({queryExt: { _id: { "$in": goods.map(g => g._id) } } })
                return {
                    document: gql`
                        query GoodFind($q: String) {
                            GoodFind(query: $q) {
                                _id name  price description
                                images { url }
                            }
                        }
                    `,
                    variables: params
                }
            },
            providesTags: (result) => {
                return result
                    ? [...result.GoodFind.map(obj => ({ type: 'Good', _id: obj._id })), 'Good']
                    : ['Good'];
            }
        }),
        saveGood: builder.mutation({
            query: ({ good }) => {
                return (
                    {
                        document: gql`
                            mutation GoodUpsert($good: GoodInput) {
                                GoodUpsert(good: $good) {
                                    _id
                                }
                            }
                        `,
                        variables: { good: { ...good, images: good?.images.map(img => ({ _id: img._id })) ?? [] } }
                    }
                )
            },
            invalidatesTags: (result, error, arg) => {
                if (!error) {
                    let goodInv = { type: 'Good', _id: arg.good._id };
                    return [goodInv, 'GoodCount'];
                }
            },
        }),
    }),
})

export const { useGetGoodsQuery, useGetGoodsCountQuery, useGetGoodByIdQuery, useGetGoodsByIdQuery, useSaveGoodMutation } = goodsApi;


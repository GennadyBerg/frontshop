import { createApi } from '@reduxjs/toolkit/query/react'
import { graphqlRequestBaseQuery } from "@rtk-query/graphql-request-base-query"
import { gql } from "graphql-request";
import { createFullQuery, getFullBackendUrl, repeatQuery } from '../utills';

const getCategorySearchParams = (query, queryExt) => ({ searchStr: query, searchFieldNames: ["name"], queryExt });
export const prepareHeaders = (headers, { getState }) => {
    const token = getState().auth.token;
    if (token) {
        headers.set("Authorization", `Bearer ${token}`);
    }
    return headers;
}

let placeHolder = '|--|';
export const categoryApi = createApi({
    reducerPath: 'category',
    baseQuery: graphqlRequestBaseQuery({
        url: getFullBackendUrl('/graphql'),
        prepareHeaders
    }),
    tagTypes: ['Category', 'CategoryCount'],
    endpoints: (builder) => ({
        getRootCategories: builder.query({
            query: (childrenDepth = 0) => {
                let params = createFullQuery({ queryExt: {parent: null } }, { sort: { name: 1 } });
                return (
                    {
                        document: gql`
                        query GetCategories($q: String){
                            CategoryFind(query: $q) {
                                _id name image { _id url }
                                ${repeatQuery(childrenDepth, ` subCategories { _id name image { _id url } ${placeHolder} } `, placeHolder)}
                            }
                        }
                    `,
                        variables: params
                    }
                )
            },
            providesTags: (result) => {
                return result
                    ? [...result.CategoryFind.map(obj => ({ type: 'Category', _id: obj._id })), 'Category']
                    : ['Category'];
            },
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response, meta) => {
                return response;
            },
        }),
        getCategories: builder.query({
            query: ({ withOwner = false, withChildren = false, withParent = false, queryExt = {}, fromPage, pageSize, searchStr = '' }) => {
                let params = createFullQuery(getCategorySearchParams(searchStr, queryExt), { fromPage, pageSize, sort: { name: 1 } });
                return {
                    document: gql`
                    query GetCategories($q: String){
                        CategoryFind(query: $q) {
                            _id name ${withChildren ? 'subCategories { _id name } ' : ''} image { _id url }
                            ${withParent ? 'parent { _id name } ' : ''}
                            ${withOwner ? 'owner { _id login nick} ' : ''}
                            }
                        }
                `,
                    variables: params
                }
            },
            providesTags: (result) => {
                return result
                    ? [...result.CategoryFind.map(obj => ({ type: 'Category', _id: obj._id })), 'Category']
                    : ['Category'];
            }
        }),
        getCategoriesCount: builder.query({
            query: ({ searchStr = '', queryExt = {} }) => {
                let params = createFullQuery(getCategorySearchParams(searchStr, queryExt = {}));
                return {
                    document: gql`
                            query CategoriesCount($q: String) { CategoryCount(query: $q) }
                    `,
                    variables: params
                }
            },
            providesTags: ['CategoryCount'],
        }),
        getCategoryById: builder.query({
            query: (_id) => ({
                document: gql`
                    query GetCategory($q: String) {
                        CategoryFindOne(query: $q) {
                            _id name image { _id url }
                            parent { _id name }
                            subCategories { _id name }
                            goods { _id name price description 
                                images { url }
                            }
                        }
                    }
                    `,
                variables: { q: JSON.stringify([{ _id }]) }
            }),
            providesTags: (result) => {
                return result
                    ? [{ type: 'Category', _id: result.CategoryFindOne._id }, 'Category']
                    : ['Category'];
            },
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response;
            },
        }),
        saveCategory: builder.mutation({
            query: ({ category }) => (
                {
                    document: gql`
                    mutation SaveCategory($category: CategoryInput ) {
                        CategoryUpsert(category: $category) {
                           _id
                          name
                           parent { _id name }
                           }
                       }
                        `,
                    variables: { category: { ...category } }
                }
            ),
            transformResponse: (response) => {
                return response;
            },
            transformErrorResponse: (response) => {
                return response;
            },
            invalidatesTags: (result, error, arg) => {
                if (!error) {
                    let catInv = { type: 'Category', _id: arg.category._id };
                    return [catInv, 'CategoryCount'];
                }
            },
        }),
    }),
})

export const { useGetRootCategoriesQuery, useGetCategoryByIdQuery, useGetCategoriesQuery, useGetCategoriesCountQuery, useSaveCategoryMutation } = categoryApi;


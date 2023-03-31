import React from 'react';
import { Container, Box } from '@mui/material';
import { CGoodItem } from './GoodItem';
import { useSelector } from 'react-redux';
import { useGetGoodsCountQuery, useGetGoodsQuery } from '../reducers';
import { CSearchInput } from './SearchInput';
import { CPagination } from './Pagination';
import { frontEndNames, getCurrentEntity, getEntitiesListShowParams } from '../reducers/frontEndReducer';

const GoodsList = ({  entities, entitiesTypeName }) => {
    return (
        <Container maxWidth='lg'>
            <CSearchInput entitiesTypeName={entitiesTypeName} />
            <Box sx={{ display: 'flex', flexWrap: 'wrap' }}>
                {
                    entities?.map(good => {
                        return (
                            <CGoodItem key={good._id} good={good} maxWidth='xs' />
                        )
                    })}
            </Box>
            <CPagination entitiesTypeName={entitiesTypeName} />
        </Container>
    )
}

const CGoodsList = () => {
    let entitiesTypeName = frontEndNames.goods;
    let state = useSelector(state => state);
    const currentCategory = getCurrentEntity(frontEndNames.category, state);
    const { fromPage, pageSize, searchStr } = getEntitiesListShowParams(entitiesTypeName, state);

    let categoryFilter = currentCategory ? { "categories._id": currentCategory._id } : {};
    const goodsResult = useGetGoodsQuery({ fromPage, pageSize, searchStr, queryExt: categoryFilter });
    const goodsCountResult = useGetGoodsCountQuery({ searchStr, queryExt: categoryFilter });
    let isLoading = goodsResult.isLoading || goodsCountResult.isLoading;

    let entities = goodsResult.data?.GoodFind;
    return !isLoading && entities && <GoodsList entitiesTypeName={entitiesTypeName} entities={entities} />
}


export { CGoodsList };
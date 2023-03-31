import { TablePagination } from '@mui/material';
import { useDispatch, useSelector } from 'react-redux';
import { actionSetPaging, getEntitiesListShowParams } from '../reducers';
import { getEntitiesCount } from '../reducers';

const Pagination = ({ allEntitiesCount, fromPage, pageSize, changePageFE, changeRowsPerPageFE }) => {
    allEntitiesCount = allEntitiesCount ?? 0;
    const handleChangePage = (event, newPage) => {
        changePageFE(newPage);
    };
    const handleChangeRowsPerPage = (event) => {
        let newPageSize = parseInt(event.target.value, 10);
        changeRowsPerPageFE(newPageSize);
    };
    return (
        <TablePagination
            rowsPerPageOptions={[5, 10, 25]}
            component="div"
            count={allEntitiesCount}
            rowsPerPage={pageSize}
            page={fromPage}
            onPageChange={handleChangePage}
            onRowsPerPageChange={handleChangeRowsPerPage}
        />
    )
}


export const CPagination = ({entitiesTypeName}) => {
    const setPaging = (paging) => actionSetPaging(entitiesTypeName, paging)
    let state = useSelector(state => state);
    let allEntitiesCount = getEntitiesCount(entitiesTypeName, state);
    let dispatch = useDispatch();
    let changePageFE = (fromPage) =>
    {
        dispatch(setPaging({ fromPage }));
    }
    let changeRowsPerPageFE = pageSize => 
        dispatch(setPaging({ fromPage: 0, pageSize }));
    let {fromPage, pageSize} = getEntitiesListShowParams(entitiesTypeName, state);
    return <Pagination allEntitiesCount={allEntitiesCount} fromPage={fromPage} pageSize={pageSize} changePageFE={changePageFE} changeRowsPerPageFE={changeRowsPerPageFE} />
}
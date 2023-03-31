import React from 'react';
import { Paper } from '@mui/material';
import { CCartGood } from './CartGood';
import { Table, TableBody, TableContainer, TableHead, TableRow, TableCell } from "@mui/material";
import { StyledTableCell } from './StyledTableElements';

const CartGoodsList = ({ goods = [], tax_rate = 0 }) => {
    function ccyFormat(num) {
        return `${num.toFixed(2)}`;
    }
    function subtotal(items) {
        return items.map(({ price, count }) => price * count).reduce((sum, i) => sum + i, 0);
    }
    const invoiceSubtotal = subtotal(goods);
    const invoiceTaxes = tax_rate * invoiceSubtotal;
    const invoiceTotal = invoiceTaxes + invoiceSubtotal;

    return (
        <>
            <TableContainer component={Paper} sx={{ minWidth: 700, maxWidth: 1200 }} >
                <Table aria-label="customized table">
                    <TableHead>
                        <TableRow>
                            <StyledTableCell align="right">#</StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                            <StyledTableCell>Name</StyledTableCell>
                            <StyledTableCell align="right">Price ($)</StyledTableCell>
                            <StyledTableCell align="right">Count</StyledTableCell>
                            <StyledTableCell align="right">Total</StyledTableCell>
                            <StyledTableCell align="right"></StyledTableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {
                            goods.map((good, index) => {
                                return (
                                    <CCartGood key={good._id} good={good} goodNum={index} maxWidth='xs' />
                                )
                            })
                        }
                        <TableRow>
                            <TableCell rowSpan={3} colSpan={3} />
                            <TableCell colSpan={2}>Subtotal</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceSubtotal)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell>Tax</TableCell>
                            <TableCell align="right">{`${(tax_rate * 100).toFixed(0)} %`}</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTaxes)}</TableCell>
                        </TableRow>
                        <TableRow>
                            <TableCell colSpan={2}>Total</TableCell>
                            <TableCell align="right">{ccyFormat(invoiceTotal)}</TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </TableContainer>
        </>
    )
}
export { CartGoodsList };
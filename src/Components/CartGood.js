import { Typography } from "@mui/material";
import { getFullImageUrl } from "../utills";
import { AvatarImage } from "./AvatarAnimated";
import { StyledTableCell, StyledTableRow } from "./StyledTableElements";
import "./cartGood.css"
import { MyLink } from "./MyLink";
import { connect } from "react-redux";
import { actionAddGoodToCart, actionDeleteGoodFromCart } from "../reducers";
import Button from '@mui/material/Button';
import { DeleteOutline } from "@mui/icons-material";

const CartGood = ({ good, goodNum, addToCart, deleteFromCart }) => {
    return (
        <>
            <StyledTableRow>
                <StyledTableCell item align="right" xs={1}>
                    <Typography>
                        {goodNum + 1}.
                    </Typography>
                </StyledTableCell>
                <StyledTableCell item xs={2}>
                    {good.images?.length > 0 ?
                        <AvatarImage sx={{ width: 70, height: 70 }} variant='rounded' src={getFullImageUrl(good.images[0])} /> :
                        null}
                </StyledTableCell>
                <StyledTableCell item xs={3}>
                    {good?._id ?
                        <MyLink to={`/good/${good?._id}`}>
                            <Typography >
                                {good.name}
                            </Typography>
                        </MyLink>
                        :
                        <Typography >
                            {good.name}
                        </Typography>
                    }
                </StyledTableCell>
                <StyledTableCell item align="right" xs={2}>
                    <Typography>
                        {good.price}
                    </Typography>
                </StyledTableCell>
                <StyledTableCell item align="right" xs={1}>
                    <Button size='small' color='primary'
                        onClick={() => addToCart(good, -1)}
                    >
                        -
                    </Button>
                    <Typography>
                        {good.count}
                    </Typography>
                    <Button size='small' color='primary'
                        onClick={() => addToCart(good, +1)}
                    >
                        +
                    </Button>
                </StyledTableCell>
                <StyledTableCell item align="right" xs={1}>
                    <Typography>
                        {good.price * good.count}
                    </Typography>
                </StyledTableCell>
                <StyledTableCell item align="right" xs={2}>
                    <Button
                        size="small"
                        onClick={() => deleteFromCart(good)}
                    >
                        <DeleteOutline />
                    </Button>
                </StyledTableCell>
            </StyledTableRow>
        </>
    )
}
const CCartGood = connect(state => ({}),
    { addToCart: actionAddGoodToCart, deleteFromCart: actionDeleteGoodFromCart })(CartGood);
export { CCartGood };
import React, { useEffect } from 'react'
import { useSelector, useDispatch } from 'react-redux';
import { selectorders, sendordersAsync } from './orderSlice'
import { selectToken } from './loginSlice'

const ACart = () => {
    const myOrders = useSelector(selectorders);
    const token = useSelector(selectToken);
    const dispatch = useDispatch();
    const addToCart = () => { }
    const setAmount = () => { }
    useEffect(() => {

    }, [myOrders.length])

    return (
        <div>ACart
            <h1>My Cart </h1>
            {myOrders && myOrders.length}

            {myOrders && myOrders.map(prod => <div>
                <button onClick={() => addToCart({ _id: prod._id, desc: prod.desc, amount: 1, price: prod.price })}>+</button>
                {prod.desc}, {prod._id},{prod.amount}, &nbsp; {prod.price}
                <button onClick={() => addToCart({ _id: prod._id, desc: prod.desc, amount: -1, price: prod.price })}>-</button>
            </div>)}
            {token &&
                <button onClick={() => dispatch(sendordersAsync({ myOrders, token }))}>Make order</button>
            }
            {!token &&
                <div>Go to login</div>
            }
        </div>
    )
}

export default ACart
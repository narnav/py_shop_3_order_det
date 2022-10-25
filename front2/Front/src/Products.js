import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import { selectUserName } from "./app/loginSlice";
import { getproductsAsync, selectproducts } from "./app/productSlice";
import { selectcats } from "./app/catSlice";
import { sendCart, clearAr } from "./app/orderSlice";
const Products = () => {
  let params = useParams();
  let id = params.id;
  const userName = useSelector(selectUserName);
  const categories = useSelector(selectcats);
  const allProducts = useSelector(selectproducts);
  const dispatch = useDispatch();
  const [myCart, setmyCart] = useState([]);
  const [amountCng, setamountCng] = useState(0);

  // run when component load
  useEffect(() => {
    setmyCart(JSON.parse(localStorage.getItem("myCart")));
  }, []);

  //run every time we switch category
  useEffect(() => {
    dispatch(getproductsAsync(id));
  }, [id]);

  //run every change in the length of myCart
  useEffect(() => {
    console.table(myCart);
    localStorage.setItem("myCart", JSON.stringify(myCart));
  }, [myCart.length, amountCng]);

  const setAmount = (item) => {
    //   console.log(  item.amount)
    myCart.forEach((element) => {
      if (element._id === item._id) {
        element.amount = +item.amount;
        setamountCng(amountCng + 1);
      }
    });
    dispatch(sendCart(myCart));
  };

  const addToCart = (item) => {
    let temp = myCart.find((x) => x._id === item._id);
    if (temp) {
      //   console.log(temp);
      temp.amount += item.amount;
      //   console.log(temp);
      setmyCart(myCart);
    } else {
      setmyCart([...myCart, item]);
      localStorage.setItem("myCart", JSON.stringify(myCart));
      // dispatch(sendCart(myCart));
    }
    console.table(myCart);
    localStorage.setItem("myCart", JSON.stringify(myCart));
    // dispatch(sendCart(myCart));
  };

  return (
    <div style={{ backgroundColor: "green" }}>
      <h1>
        Products from &nbsp; {id == 0 && "ALL"}{" "}
        {id > 0 && categories[id - 1].desc}
      </h1>

      {allProducts.map((prod) => (
        <div>
          {prod.desc}
          {prod.cat_id}
          <button
            onClick={() =>
              addToCart({
                _id: prod._id,
                desc: prod.desc,
                amount: 1,
                price: prod.price,
              })
            }
          >
            Buy
          </button>
        </div>
      ))}

      <button onClick={() => setmyCart([])}>clear cart</button>
      <button onClick={() => console.table(myCart)}>show cart</button>
      <h1 className="animate__animated animate__bounceInDown">
        {userName && <div>shopper name {userName}</div>}
      </h1>
      <hr></hr>
      {myCart.map((prod) => (
        <div>
          <button
            onClick={() =>
              addToCart({
                _id: prod._id,
                desc: prod.desc,
                amount: 1,
                price: prod.price,
              })
            }
          >
            +
          </button>
          {prod.desc}, {prod._id},{prod.amount}, &nbsp; {prod.price}
          <button
            onClick={() =>
              addToCart({
                _id: prod._id,
                desc: prod.desc,
                amount: -1,
                price: prod.price,
              })
            }
          >
            -
          </button>
        </div>
      ))}
      <button onClick={() => dispatch(sendCart(myCart))}>send</button>
      <button onClick={() => dispatch(clearAr())}>Test</button>
    </div>
  );
};

export default Products;

import axios from 'axios'

const URL = "http://127.0.0.1:8000/api/addOrder/"
// async(2)
export function sendOrders(myOrders,token) {
    // console.log(myOrders,token)
    return new Promise((resolve) =>
        axios.post(URL,myOrders,{
            headers: {
                'Authorization': `Bearer ${token}`
            }
        }).then((res) => resolve({ data: res.data }))
    );
}

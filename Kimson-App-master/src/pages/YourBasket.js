import { Checkbox, Col, Row } from 'antd'
import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DefaultLayout from '../components/DefaultLayout'
import configData from '../assets/config.json';
import { Spin } from 'antd';
import axios from 'axios';
import '../styles/commonStyles.css'
import { Button, Modal,Dropdown } from 'antd';
import { openNotificationWithIcon } from '../helpers/notification';
import { Select } from 'antd';
import moment from 'moment';

const { Option } = Select;
const YourBasket = () => {
    const [myCartItems, setmyCartItems] =  useState([]);
    const [totalCartPrice, settotalCartPrice] = useState(0);
    const [spinvalue, setspinvalue] = useState(false);
    const [addToBookingCart, setAddToBookingCart] = useState([]);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [orderedItems, setorderedItems] = useState([]);
    const [orderedItemslist, setorderedItemslist] = useState([]);
        useEffect(()=>{
            getAllMyCartItems();
            getOrderedItems();
          },[])
    
    const getAllMyCartItems = () =>{
        setspinvalue(true)
        let carttotalprice=0;
        axios.get('api/products/cartList')
        .then((response) => {
            const updatedJsonArray = response.data.map(obj => ({
                ...obj,
                numberOfTimes: 0
              }));
              response.data.map(row=>{
                carttotalprice+=Math.trunc(row['KS_Cart_price'])
              })
              setspinvalue(false);
              settotalCartPrice(carttotalprice)
              console.log('updatedJsonArray',updatedJsonArray)
            setmyCartItems(updatedJsonArray)
        }).catch((err)=> {
            setspinvalue(false)
            console.log(err)
        })
    }

    const getOrderedItems = () =>{
        setspinvalue(true)
        axios.get('api/orders/ordeList')
        .then((response) => {
            setspinvalue(false);
            setorderedItems(response.data)
            
        }).catch((err)=> {
            setspinvalue(false)
            console.log(err)
        })
    }
    
    const changeNumber = (key, value,id, type) =>{
        console.log(key, value,id)
        //setmyCartItems(prevArray => {
            myCartItems.map(obj => {
              if (obj.KS_Cart_id === id) {
                console.log(obj.KS_Cart_price)
                let data={}
                if(type=="decrease"){
                    data={
                        KS_Cart_quantity:value>0?value:0,
                        KS_Cart_price:value>0?Math.trunc(obj.KS_Cart_price-obj.KS_Product_price):obj.KS_Cart_price,
                        KS_Cart_id:id
                    }
                    //return { ...obj, [key]: value>0?value:0,['cartTotalAmount']:value>0?obj.cartTotalAmount/2:obj.KS_Cart_price};
                }
                else{
                    data={
                        KS_Cart_quantity:value>0?value:0,
                        KS_Cart_price:value>0?Math.trunc(obj.KS_Cart_price+obj.KS_Product_price):obj.KS_Cart_price,
                        KS_Cart_id:id
                    }
                    //return { ...obj, [key]: value>0?value:0,['cartTotalAmount']:value>0?obj.cartTotalAmount*2:obj.KS_Cart_price};
                }
                console.log('data',data)
                    axios.post('/api/products/changeCartQuantity',data)
                    .then((res)=>{
                        getAllMyCartItems();
                    })
                    .catch((error)=>{console.log(error)})
              }
            });
    }

    const handleCheckboxChange = (event, item)=>{
        
        if (event.target.checked) {           
            // Add rowId to checkedRows if the checkbox is checked
            setAddToBookingCart([...addToBookingCart, item]);
          } else {
            // Remove rowId from checkedRows if the checkbox is unchecked
            setAddToBookingCart(addToBookingCart.filter(id => id !== item));
          }
    }

    const bookItems = () =>{
        console.log('addToBookingCart',JSON.stringify(addToBookingCart))
        setIsModalOpen(true);
    }

    const onSelectedOrderNumber = (event)=>{
        console.log(event.target.value)
        setspinvalue(true)
        axios.get(`api/orders/ordeListItems?KS_Prod_orderid=${event.target.value}`)
        .then((response) => {
            setspinvalue(false);
            setorderedItemslist(response.data)
            
        }).catch((err)=> {
            setspinvalue(false)
            console.log(err)
        })
    }

   
    const handleOk = () => {
        let productOrder = {
            "KS_UserId":1,
            "KS_Shopping_Session_id":"10000",
            "KS_Prod_Order_token":"1000",
            "KS_Prod_Order_status":1,
            "KS_Prod_Order_subTotal":200,
            "KS_Prod_Order_itemDiscount":10,
            "KS_Prod_Order_tax":10,
            "KS_Prod_Order_shipping":10,
            "KS_Prod_Order_total":220,
            "KS_Prod_Order_promo":"none",
            "KS_Product_Discount_id":1,
            "KS_Prod_Order_grandTotal":290,
            "KS_User_addressid":1,
            "KS_Prod_Order_createdAt":"2023-06-08 00:00:00",
            "KS_Prod_Order_updatedAt":"2023-06-08 00:00:00",
            "KS_Prod_Order_content":"test",
        }
        
        axios.post('/api/orders/orderProduct',{productOrder,addToBookingCart})
        .then((res)=>{
            openNotificationWithIcon('success','Success','successfully placed orders!');
           
        })
        .catch((error)=>{
            console.log(error)
            openNotificationWithIcon('warning','Warning','Failed to add!')
        })
        setIsModalOpen(false);
      };
    
      const handleCancel = () => {
        setIsModalOpen(false);
      };
    
        const navigate = useNavigate();
        return (
            <div>
                 <Spin tip="Loading" size="large" spinning={spinvalue}>
                <DefaultLayout>
                    <div>
                        <Row>
                            <Col lg={12} sm={24}>
                                <div className="card mb-3" style={{ maxWidth: "540px;" }}>
                                    <div class="card-header"><h4>My Basket</h4></div>
                                    {myCartItems.length==0?<p className="card-title"> No Cart Item  </p>:
                                     myCartItems.map((myCartItem,index) => (
                                        <div className="row g-0">
                                        <div className="col-md-4">
                                            <div key={myCartItem.KS_Cart_id}>
                                            <input
                                            className='cart-checkbox' 
                                            type="checkbox"
                                            checked={addToBookingCart.includes(myCartItem)}
                                            onChange={event => handleCheckboxChange(event,myCartItem)}
                                            />
                                            </div>
                                        <img  src={configData[myCartItem.KS_Product_MetaTitle]} class="card-img-top" alt="..." />
                                        </div>
                                        <div className="col-md-8">
                                            <div className='d-flex justify-content-between'>
                                                <div className="card-body">
                                                    <h5 className="card-title">{myCartItem.KS_Product_Title}</h5>
                                                    <p className="card-text">${myCartItem.KS_Product_price} (pc/lb) </p>
                                                    <div className='add'>
                                                        <p className="card-text">
                                                            <span><button type="button" class="btn" onClick={()=>changeNumber('numberOfTimes',myCartItem.KS_Cart_quantity-1,myCartItem.KS_Cart_id, 'decrease')}><i class="fa-solid fa-minus"></i></button></span>
                                                            <span>{myCartItem.KS_Cart_quantity}</span>
                                                            <span><button type="button" class="btn" onClick={()=>changeNumber('numberOfTimes',myCartItem.KS_Cart_quantity+1,myCartItem.KS_Cart_id,'increase')}><i class="fa-solid fa-plus"></i></button></span>
                                                        </p>
                                                    </div>
                                                </div>
                                                <div className='cart-price'>
                                                    <p><b>${Math.trunc(myCartItem.KS_Cart_price)}</b></p>
                                                </div>
                                            </div>
    
                                        </div>
                                    </div>
    
                                    ))
                                    }
                                    <hr />
                                </div>
                            </Col>
                            <Col lg={12} sm={24}>
                                <div className='orderinfo'>
                                    <div className="card ms-5" style={{ width: "30rem" }}>
                                        <div className="card-header bg-transparent"><h4><b>Order Info</b></h4></div>
                                        <div className='d-flex justify-content-between'>
                                            <div className="card-body">
                                                <h6 className="card-title"><b>Total items</b></h6>
                                                <h6 className="card-title"><b>Subtotal</b></h6>
                                                <h6 className="card-title"><b>Sales tax </b><small>(2%)</small></h6>
                                                <h6 className="card-title"><b>Shipping / delivery cost</b></h6>
                                                <hr />
                                                <h6 className="card-title"><b>GRAND TOTAL</b></h6>
                                            </div>
                                            <div>
                                                <div className="card-body">
                                                    <h6 className="card-title"><b>{myCartItems.length}</b></h6>
                                                    <h6 className="card-title"><b>{totalCartPrice}</b></h6>
                                                    <h6 className="card-title"><b>$8.00</b></h6>
                                                    <h6 className="card-title"><b>FREE</b></h6>
                                                    <hr />
                                                    <h6 className="card-title"><b>FREE</b></h6>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="card-footer bg-warning text-center" onClick={()=>{bookItems()}} ><h6><b>Proceed</b><i class="fa-solid fa-chevron-right"></i></h6></div>
                                    </div>
                                </div>
                                <div className='userbought'>
                                    <div class="card m-5" style={{ width: "30rem" }}>{console.log(orderedItems)}
                                        <div className="card-header bg-transparent"><h4><b>Users have also bought</b></h4></div>
                                        <select
                                         onChange={onSelectedOrderNumber}
                                            >
                                            {orderedItems.map((row, index) => <option value={row.KS_Prod_orderid} >{moment(row.KS_Prod_Order_createdAt).format('YYYY-MM-DD')}</option>)}
                                            </select>
                                        <div class="row row-cols-1 row-cols-md-2 g-4 m-1">
                                        {orderedItemslist.length==0?<p className="card-title"> No Cart Item  </p>:
                                         orderedItemslist.map((myCartItem,index) => (
                                        <div class="col">
                                                <div class="card">
                                                    <div class="card-body">
                                                        <h5 class="card-title text-muted"><b>Product Details</b></h5>
                                                        <p class="card-text"><b>$99.99</b></p>
                                                    </div>
                                                    <img src="https://5.imimg.com/data5/SELLER/Default/2020/10/FV/MY/NB/24426791/nivea-cream-125x125.jpg" class="card-img-top" alt="..." />
                                                    <div class="d-grid gap-2 m-1">
                                                        <button class="btn btn-warning" type="button"><i class="fa-solid fa-basket-shopping"></i>Add to basket</button>
                                                    </div>
                                                </div>
                                            </div>))}
                                        </div>
                                    </div>
                                </div>
                            </Col>
    
                        </Row>
                        <div className='chat'>
                            <Link to="/chat"><img src='https://cdn-icons-png.flaticon.com/512/134/134914.png' alt='...' /></Link>
                        </div>
                    </div>
                    <Modal title="Please verify details" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
                       <Row>
                        <Col lg={12} sm={24}>Number of items</Col>
                        <Col>{addToBookingCart.length}</Col>
                       </Row>
                       <Row>
                        <Col lg={12} sm={24}>Payment details</Col>
                        <Col>Number of items</Col>
                       </Row>
                    </Modal>
                </DefaultLayout>
                </Spin>
                
            </div>
        )
}

export default YourBasket

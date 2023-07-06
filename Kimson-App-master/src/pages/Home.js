import { Col, Row } from 'antd'
import React, { useEffect, useState,useRef } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import DefaultLayout from '../components/DefaultLayout'
import axios from 'axios';
import '../styles/commonStyles.css'
import configData from '../assets/config.json';
import { defaultPrefixCls } from 'antd/es/config-provider';
import { Alert, Space, Spin } from 'antd';
import { openNotificationWithIcon } from '../helpers/notification';

function Home() {
const childRef = useRef(null);
const [products, setProducts] =  useState([]);
const [spinvalue, setspinvalue] = useState(false)
const navigate = useNavigate();
    useEffect(()=>{
        getAllProducts();
    },[])

const getAllProducts = () =>{
    setspinvalue(true)
    axios.get('api/products/productLists')
    .then((response) => {
        setspinvalue(false)
       setProducts(response.data)
    }).catch((err)=> {
        console.log(err)
        setspinvalue(false)
    })
        
}

const addToCart=(productID)=>{
    console.log('productID',productID)
    let data ={
        "KS_ProductId":productID,
        "KS_Prod_Cartid":1,
        "KS_Cart_sku":"test",
        "KS_Cart_price":100,
        "KS_Cart_discount":10,
        "KS_Cart_quantity":1,
        "KS_Cart_active":1,
        "KS_Cart_createdAt":"2023-06-08 00:00:000",
        "KS_Cart_updatedAt":"2023-06-08 00:00:000",
        "KS_Cart_content":"test",
        "KS_Cart_Session_id":1
    }

    axios.post('/api/products/addCartItem',data)
    .then((res)=>{
        openNotificationWithIcon('success','Success','successfully added to cart');
        if (childRef.current) {
            childRef.current.getCartCount();
            navigate('/YourBasket');
        }
    })
    .catch((error)=>{
        console.log(error)
        openNotificationWithIcon('warning','Warning','Failed to add!')
    })
}

    return (
        <div>
             <Spin tip="Loading" size="large" spinning={spinvalue}>
            <DefaultLayout ref={childRef}>
                <div>
                    <Row>
                        <Col >
                            <div className='userbought'>
                                <div class="card">
                                    <div class="row row-cols-1 row-cols-md-4 g-4 m-1" style={{width:'100%'}}>
                                    { products.map((product,index) => (
                                        <div class="col">
                                            <div class="card">
                                                <div class="card-body" style={{display:'flex', flexDirection:'row'}}>
                                                    <img style={{width:'50px', height:'50px'}} src={configData[product.KS_Product_MetaTitle]} class="card-img-top" alt="..." />
                                                    <h6 class="card-title text-muted"><b>{product.KS_Product_Title}</b></h6>            
                                                </div>
                                                
                                                <div class="d-grid gap-1 m-1">
                                                    <button class="btn btn-warning" type="button" onClick={()=>addToCart(product.KS_Productid)}>Add </button>
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                        
                                    </div>
                                </div>
                            </div>
                        </Col>
                    </Row>
                    <div className='chat'>
                        <Link to="/chat"><img src='https://cdn-icons-png.flaticon.com/512/134/134914.png' alt='...' /></Link>
                    </div>
                </div>
                
            </DefaultLayout>
            </Spin>
        </div>
    )
}

export default Home

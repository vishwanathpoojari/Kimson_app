const { send } = require('process');
const { addFilter, genInsertQ, genUpdateQ, db,genInsertFullQ } = require('./common');
const moment = require('moment');
const orderProduct = async (req) => {
    let data = req.body;
    //console.log('data',data.productOrder,data.addToBookingCart)
    let orderDetails = data.productOrder;
    let orderItems = data.addToBookingCart
    //console.log('orderDetails',orderDetails)
    let getSessionId = await db({query:`SELECT TOP 1 KS_Shopping_Session_id,KS_Prod_Order_status,KS_Prod_orderid FROM KS_Prod_order WHERE KS_UserId = ${orderDetails.KS_UserId}`})
    //console.log('getSessionId',getSessionId)
    if(getSessionId.length!=0 && getSessionId[0].KS_Shopping_Session_id == orderDetails.KS_Shopping_Session_id && getSessionId[0].KS_Shopping_Session_id!=3){
        let created_OrderItem = orderProductItem(orderItems,getSessionId[0].KS_Prod_orderid)
        return(created_OrderItem)
    }
    else{
        //console.log('I am here')
        let created_order = createNewOrder(orderDetails)
        //console.log('created_order',created_order)
        if(created_order){
            orderProductItem(orderItems)
        }
        else {
            return 0
        }
    }
    //let query = await db({query: `SELECT * FROM KS_Product`});
    //return  (query);
};

const createNewOrder =  (data)=>{
    let createProductOrder =  db({query:`
        INSERT INTO KS_Prod_order
                   (KS_UserId
                   ,KS_Shopping_Session_id
                   ,KS_Prod_Order_token
                   ,KS_Prod_Order_status
                   ,KS_Prod_Order_subTotal
                   ,KS_Prod_Order_itemDiscount
                   ,KS_Prod_Order_tax
                   ,KS_Prod_Order_shipping
                   ,KS_Prod_Order_total
                   ,KS_Prod_Order_promo
                   ,KS_Product_Discount_id
                   ,KS_Prod_Order_grandTotal
                   ,KS_User_addressid
                   ,KS_Prod_Order_createdAt
                   ,KS_Prod_Order_updatedAt
                   ,KS_Prod_Order_content)
                   OUTPUT INSERTED.KS_Prod_orderid
             VALUES
                   (${data.KS_UserId}
                   ,'${data.KS_Shopping_Session_id}'
                   ,'${data.KS_Prod_Order_token}'
                   ,${data.KS_Prod_Order_status}
                   ,${data.KS_Prod_Order_subTotal}
                   ,${data.KS_Prod_Order_itemDiscount}
                   ,${data.KS_Prod_Order_tax}
                   ,${data.KS_Prod_Order_shipping}
                   ,${data.KS_Prod_Order_total}
                   ,'${data.KS_Prod_Order_promo}'
                   ,${data.KS_Product_Discount_id}
                   ,${data.KS_Prod_Order_grandTotal}
                   ,${data.KS_User_addressid}
                   ,'${data.KS_Prod_Order_createdAt}'
                   ,'${data.KS_Prod_Order_updatedAt}'
                   ,'${data.KS_Prod_Order_content}')
        `})

        return(createProductOrder)
}

const orderProductItem =  async (data, product_orderId)=>{
    console.log('here',data)
    let createProductOrder;
    let getProduct_order_id = await db({query:`select top 1* from KS_Prod_order order by [KS_Prod_orderid] desc`})
    console.log('getProduct_order_id',getProduct_order_id)
    data.forEach(orderItem => {
        createProductOrder =  db({query:`
        INSERT INTO KS_order_item
            (KS_productId
            ,KS_Prod_orderid
            ,KS_order_sku
            ,KS_order_price
            ,KS_order_discount
            ,KS_order_quantity
            ,KS_order_createdAt
            ,KS_order_updatedAt
            ,KS_order_content)
        VALUES(
            ${orderItem.KS_ProductId}
            ,${getProduct_order_id[0].KS_Prod_orderid}
            ,'${orderItem.KS_Cart_sku}'
            ,${orderItem.KS_Cart_price}
            ,${orderItem.KS_Cart_discount}
            ,${orderItem.KS_Cart_quantity}
            ,'${orderItem.KS_Cart_createdAt}'
            ,'${orderItem.KS_Cart_updatedAt}'
            ,'${orderItem.KS_Cart_content}'
            )`})
           
    })
    return(createProductOrder)
}


const orderList = async (req) => {
    let orderItems = await db({query:`select KS_Prod_orderid,KS_Prod_Order_createdAt from[KS_Prod_order] where [KS_UserId]=1`})
    return(orderItems)
}

const orderListItems = async (req) => {
    console.log('req',req.query)
    let query = db({query:`SELECT * FROM KS_order_item where KS_Prod_orderid = ${req.query.KS_Prod_orderid}`});
    return (query);
}



module.exports = { orderProduct,orderList,orderListItems };
const { send } = require('process');
const { addFilter, genInsertQ, genUpdateQ, db,genInsertFullQ } = require('./common');
const moment = require('moment');
const getProducts = async (req) => {
    let query = await db({query: `SELECT * FROM KS_Product`});
    return  (query);
};

const addToCart = async (req) => {
    let data = req.body;
    let KS_User_Details = await db ({query: `select * from [dbo].[KS_Users] where [KS_Usersid]=${data['KS_userId']}`})
    let KS_User_Addressid = await db ({query: `select [KS_User_Addressid] from [dbo].[KS_User_Address] where [KS_Usersid]=${data['KS_userId']}`})
    let queryResult = await db({query: `INSERT INTO KS_Prod_Cart(
        KS_userId,
        KS_usersessionId,
        KS_Cart_token,
        KS_Cart_status,
        KS_Cart_User_firstName,
        KS_Cart_User_middleName,
        KS_Cart_User_lastName,
        KS_Cart_User_mobile,
        KS_Cart_User_email,
        KS_User_Addressid,
        KS_Cart_createdAt,
        KS_Cart_updatedAt,
        KS_Cart_content) 
        OUTPUT INSERTED.KS_Prod_Cartid
        VALUES(${data.KS_userId},${data.KS_usersessionId},${data.KS_Cart_token}, ${data.KS_Cart_status},'${KS_User_Details[0].KS_Users_firstName}', '${KS_User_Details[0].KS_Cart_User_middleName}',
        '${KS_User_Details[0].KS_Cart_User_lastName}','${KS_User_Details[0].KS_Users_mobile}','${KS_User_Details[0].KS_Cart_User_email}', 
        ${KS_User_Addressid[0].KS_User_Addressid},'${data.KS_Cart_createdAt}','${data.KS_Cart_updatedAt}','${data.KS_Cart_content}')`})
        return queryResult;
};

const addCartItem = async (req)=>{
    let data = req.body;
    let checkCartItem = await db({query:`SELECT KS_Cart_id,KS_Cart_quantity FROM KS_Cart_item WHERE KS_ProductId = ${data.KS_ProductId}`})
    console.log('checkCartItem',checkCartItem)
    if(checkCartItem.length>0){
        let availableQty = checkCartItem[0].KS_Cart_quantity+1
        let availableCartItemID = checkCartItem[0].KS_Cart_id
        let increaseCartQty = await db({query:`UPDATE KS_Cart_item SET KS_Cart_quantity = ${availableQty} WHERE
        KS_Cart_id = ${availableCartItemID}`})
        return(increaseCartQty)
    }
    else{
        let queryResult = await db({query: `INSERT INTO KS_Cart_item
        (KS_ProductId
        ,KS_Prod_Cartid
        ,KS_Cart_sku
        ,KS_Cart_price
        ,KS_Cart_discount
        ,KS_Cart_quantity
        ,KS_Cart_active
        ,KS_Cart_createdAt
        ,KS_Cart_updatedAt
        ,KS_Cart_content
        ,KS_Cart_Session_id)
        OUTPUT INSERTED.KS_Cart_id
    VALUES
        (
        ${data.KS_ProductId}
        ,${data.KS_Prod_Cartid}
        ,'${data.KS_Cart_sku}'
        ,${data.KS_Cart_price}
        ,${data.KS_Cart_discount}
        ,${data.KS_Cart_quantity}
        ,${data.KS_Cart_active}
        ,'${data.KS_Cart_createdAt}'
        ,'${data.KS_Cart_updatedAt}'
        ,'${data.KS_Cart_content}'
        ,${data.KS_Cart_Session_id})`})
        return queryResult;
    }
}



const getCartList = async(req)=>{
    let query = await db({query: `select D.KS_Product_Discount_id,P.KS_Product_Title,P.KS_Product_MetaTitle,P.KS_Product_price,C.* from KS_Product as P join KS_Cart_item as C 
    on C.KS_ProductId = P.KS_Productid join KS_Product_Discount AS D on P.KS_Productid = D.KS_ProductId`});
    return  (query);
}

const getCartListCount = async(req)=>{
    let query = await db({query:'SELECT COUNT(*) as CARTCOUNT FROM KS_Cart_item'})
    return  (query);
}

const changeCartQty =  async(req)=>{
    let data = req.body;
    console.log('data',data)
    if(data.KS_Cart_quantity>0){
        let query = await db({query:`update KS_Cart_item set KS_Cart_quantity=${data.KS_Cart_quantity}, KS_Cart_price =${data.KS_Cart_price} where KS_Cart_id=${data.KS_Cart_id}`})
        return  (query);
    }
    else{
        let query = await db({query:`delete from KS_Cart_item where KS_Cart_id=${data.KS_Cart_id}`})
        return  (query);
    }
}



module.exports = { getProducts, addToCart, addCartItem, getCartList,getCartListCount,changeCartQty };

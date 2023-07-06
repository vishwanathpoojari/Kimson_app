const express = require('express');
const router = express.Router();
const common = require('./common');
const path = require('path');
const { getProducts, addToCart,addCartItem, getCartList,getCartListCount,changeCartQty } = require('../services/products');

/* GET productLists. */
router.get('/productLists', function (req, res, next) {
  getProducts(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});

/* POST addToCart. */
router.post('/createCartItem', function (req, res, next) {
  addToCart(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});

router.post('/addCartItem', function(req, res, next){
  addCartItem(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
})

/* GET cartList. */
router.get('/cartList', function (req, res, next) {
  getCartList(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});

router.get('/cartListCount', function (req, res, next){
  getCartListCount(req)
  .then((result) => common.sendSuccessRes(res, result))
  .catch((err) => common.sendFailedRes(res, err));
})

router.post('/changeCartQuantity', function (req, res, next){
  changeCartQty(req)
  .then((result) => common.sendSuccessRes(res, result))
  .catch((err) => common.sendFailedRes(res, err));
})


module.exports = router;
const express = require('express');
const router = express.Router();
const common = require('./common');
const path = require('path');
const { orderProduct,orderList,orderListItems } = require('../services/order');

/* Place order */
router.post('/orderProduct', function (req, res, next) {
    orderProduct(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});


router.get('/ordeList', function (req, res, next) {
    orderList(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});

router.get('/ordeListItems', function (req, res, next) {
    orderListItems(req)
    .then((result) => common.sendSuccessRes(res, result))
    .catch((err) => common.sendFailedRes(res, err));
});

module.exports = router;
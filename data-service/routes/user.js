const express = require('express');
const router = express.Router();
const common = require('./common');
const path = require('path');
const {  userLogin, userSignUp } = require('../services/user');

/* GET productLists. */
router.post('/userLogin', function (req, res, next) {
    userLogin(req)
      .then((result) => common.sendSuccessRes(res, result))
      .catch((err) => common.sendFailedRes(res, err));
  });
  
  /* POST addToCart. */
  router.post('/userSignUp', function (req, res, next) {
    userSignUp(req)
      .then((result) => common.sendSuccessRes(res, result))
      .catch((err) => common.sendFailedRes(res, err));
  });

module.exports = router;
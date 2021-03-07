"use strict";
exports.__esModule = true;
var express = require("express");
// router config
var router = express.Router();
router.get('/', function (req, res) {
    try {
        res.json({
            message: 'Connection to server is successfull'
        });
    }
    catch (err) {
        console.log(err);
    }
});
exports["default"] = router;

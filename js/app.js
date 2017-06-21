//******************************************************************************
//                                  App
//******************************************************************************

/*global vars */
var myapp;
var ENTER_KEY = 13;
var ESC_KEY = 27;

 // the max amount of cards in our deck ( less than our limit = 30 ) 
var decklimit = 30;

// Cors Productive Api Url
var apiurl = 'https://crossorigin.me/http://yugiohprices.com/api';

//var myapiurl = 'http://127.0.0.1:8080/yugi-master/simpleapi.php';
var myapiurl = 'https://thanostath.000webhostapp.com/simpleapi.php';


var tempdetail;

$(function () {
    'use strict';
    // kick things off by creating the `App` View
    myapp = new app.AppView();

}); 

"use strict";

var fs = require('fs');
var csv = require('csv-parser');
var crawler = require('./crawler.js');

crawler().then(function(client){
        
	// Implement parser

}).catch(function(err){
    console.error("Couldn't connect to the service", err);
});

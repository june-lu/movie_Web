/**
 * Created by 陆晓钧 on 2017/3/25.
 */
var mongoose = require('mongoose');
var movieSchema  = require("../schemas/movie")
var Movie = mongoose.model('Movie', movieSchema);//根据模式来生成模型

module.exports = Movie;

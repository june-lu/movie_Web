/**
 * mongoose中的schemas(模式)的创建
 * Created by 陆晓钧 on 2017/3/24.
 */

var mongoose = require('mongoose');

var movieSchema = new mongoose.Schema({
    title: {type: String},
    doctor: {type: String},
    language: {type: String},
    flash: {type: String},
    country: {type: String},
    poster: {type: String},
    year: {type: Number},
    summary: {type: String},
    meta: {
        createAt: {
            type: Date,
            default: Date.now()
        },
        updateAt: {
            type: Date,
            default: Date.now()
        }
    }
});

movieSchema.pre('save', function (next) {//pre是一个中间件来的，当触发data事件时会执行该函数
    if (this.isNew) {
        this.meta.createAt = this.meta.updateAt = Date.now();
    }
    else {
        this.meta.updateAt = Date.now();
    }
    next();
})

//静态方法在Model层就能使用
movieSchema.statics = {
    fetch: function (cb) {
        return this
            .find({})//取出数据库的所有的数据
            .sort('meta.updateAt')//根据影片的更新时间来排序
            .exec(cb);//执行回调函数
    },
    findById: function (id, cb) {
        return this
            .findOne({_id: id})
            .exec(cb);//执行回调函数
    }
}

module.exports = movieSchema;





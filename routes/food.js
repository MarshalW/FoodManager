/**
 * Created with JetBrains WebStorm.
 * User: marshal
 * Date: 12-9-17
 * Time: 下午3:34
 * To change this template use File | Settings | File Templates.
 */
var DbProvider=require('../modules/DbProvider').DbProvider;
var dbProvider=new DbProvider();

var foods = [
    {id:1, name:'面包', price:4.5},
    {id:2, name:'牛奶', price:2.5},
    {id:3, name:'红肠', price:18.8}
];

exports.all = function (req, res) {
    console.log(req.headers.accept);
    dbProvider.getCollection('foods',function(collection){
       console.log('get collection ok, '+collection);
    });
    res.send(foods);
};

exports.crud = function (req, res) {

};

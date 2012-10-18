/**
 * Created with JetBrains WebStorm.
 * User: marshal
 * Date: 12-9-17
 * Time: 下午3:34
 * To change this template use File | Settings | File Templates.
 */
var DbProvider = require('../modules/DbProvider').DbProvider;
var dbProvider = new DbProvider();

exports.all = function (req, res) {
    console.log(req.headers.accept);
    dbProvider.getCollection('foods', function (collection) {
        collection.find({}).toArray(function (err, result) {
            res.send(result);
        });
    });
};

exports.crud = function (req, res) {
    //TODO 编写增删改查的代码
};

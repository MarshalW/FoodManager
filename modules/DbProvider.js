/**
 * Created with JetBrains WebStorm.
 * User: marshal
 * Date: 12-9-19
 * Time: 上午10:39
 * To change this template use File | Settings | File Templates.
 */

var Db = require('mongodb').Db,
    Server = require('mongodb').Server;

var DbProvider = function () {
};

DbProvider.prototype.db = (function () {
    var db = new Db(global.mongodbDB, new Server(global.mongodbHost, global.mongodbPort,
        {auto_reconnect:true}, {poolSize:global.dbPoolSize}));
    db.open(function (err, db) {
        if (err) throw err;
    });
    return db;
})();

DbProvider.prototype.getCollection = function (collectionName, callback) {
    this.db.collection(collectionName, function (err, collection) {
        if (err) throw err;
        callback(collection);
    });
};

exports.DbProvider = DbProvider;
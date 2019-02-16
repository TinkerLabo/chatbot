// mongoDBからテキストに保存する
// 参考　https://garafu.blogspot.com/2017/01/intro-nodejs-mongodb.html
//------------------------------------
const csv = require('csv'); //https://csv.js.org/generate/api/
const fs = require('fs');
const stringifier = csv.stringify({
  delimiter: "\t"
});
var outfile = 'output.csv';
const writableStream = fs.createWriteStream(outfile, { encoding: 'utf-8' });

// MongoDBの接続情報 --- (※1)
var MONGO_DSN = "mongodb://localhost:27017/simple-bot";
var mongo_db; // 接続オブジェクト
// { _id: 5c62345342cb0730d07cff2d,
//   key: 'どこ',
//   rank: 0,
//   pattern: '*',
//   msg: 'どこが良いと思いますか？' },
// ... 6 more items ]
var fields =['key','rank','pattern','msg'];//これでループを回したい
// モジュール
var mongo_client = require('mongodb').MongoClient;
//https://mongodb.github.io/node-mongodb-native/api-generated/mongoclient.html
// MongoDBに接続 --- (※2)
mongo_client.connect(MONGO_DSN, function (err, db) {
  // エラーチェック
  if (err) { console.log("DB error", err); return; }
  // MongoDBの接続オブジェクトを記憶
  mongo_db = db;
  // コレクションを取得 --- (※3)
  var collection = db.collection('keywords');
  collection.find().toArray(function (err, documents) {
    if (err) console.error(err);
    //console.log(documents);
    stringifier.pipe(writableStream);
    for (let i = 0; i < documents.length; i++) {
      stringifier.write(documents[i]);
    }
    mongo_db.close();
  });
  console.log("save to "+outfile);
});
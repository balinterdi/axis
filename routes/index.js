var beliefsDb = require('../data/beliefs');
var redis = require('redis').createClient();
var chars = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890";

//TODO: move all these helpers into their own files in /lib

function roundNumber(num, dec) {
  return  Math.round(num*Math.pow(10,dec))/Math.pow(10,dec);
}

function computeScore(data){
  var conservatism = 0
  , liberalism = 0;

  Object.keys(data).forEach(function(key){
    var belief = beliefsDb[key].type;
    if (belief==='liberal'){
      liberalism += data[key]/1;
      conservatism += 4 - (data[key]/1);
    } else if (belief==='conservative'){
      conservatism += data[key]/1;
      liberalism += 4 - (data[key]/1);
    }
  });

  var total = Object.keys(data).length*4
  var cons_pct = roundNumber((conservatism/total)*100, 2);
  var lib_pct = 100-cons_pct;
  return {liberalism:lib_pct, conservatism:cons_pct};
}

function getRandomId(){ // clearly I am a liberal :p
  var id = '';
  for (var i=0;i<8;i++){
    id+= chars[Math.floor(Math.random()*(chars.length+1))];
  }
  return id;
}

function writeResult(id, data, cb){
  redis.hmset('axis:result:'+id , data, cb);
}

function readResult(id, cb){
  redis.hgetall('axis:result:'+id, cb);
}

exports.index = function(req, res){
  res.render('index', { beliefs: beliefsDb, answers:false})
};

exports.result = function(req, res){
  readResult(req.params.id, function(e, data){
    res.render('results', { score: computeScore(data), beliefs: beliefsDb, answers: data })
  });
};

exports.submit = function(req, res){
  var result_id = getRandomId();
  writeResult(result_id, req.body, function(){
    res.redirect('/result/'+result_id);
  });
};
#!/usr/bin/env node
const xml2js = require('xml2js'),
      cwd = process.cwd(),
      request = require('request'),
      https = require("https"),
      fs = require('fs'),
      ctrCommonCert = {
          key: fs.readFileSync(__dirname + "/ctr-common-key.pem"),
          cert: fs.readFileSync(__dirname + "/ctr-common.pem")
      };

var IDs = {};
var count = 0;
var tempIDs = [];
var urls = [];

function getNinjaURL(path, callback){
    https.request({
        key: ctrCommonCert.key,
        cert: ctrCommonCert.cert,
        rejectUnauthorized: false,
        host: 'ninja.ctr.shop.nintendo.net',
        path: path,
        port: 443
    }, (res) => {
        var data = '';
        
        res.on('data', (d) => {
            data += d;
        });
        
        res.on('end', () => {
            callback(data, null);
        });
    }).on('error', (error) => {
        callback(null, error);
    }).end();
}

function pad(n, width, z) {
  z = z || '0';
  n = n + '';
  return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

for(var i = 0; i <= 0xFFFFFF; i++){
  tempIDs.push("00040000" + pad(i.toString(16), 6).toUpperCase() + "00");
  tempIDs.push("00050000" + pad(i.toString(16), 6).toUpperCase() + "00");
  count++;
  if(tempIDs.length == 400 || i == 0xFFFFFF){
    urls.push("/ninja/ws/titles/id_pair?title_id[]=" + tempIDs.join(","));
    tempIDs = [];
    count = 0;
  }
}

function checkURL(url){
  getNinjaURL(url, (data) => {
    var parser = new xml2js.Parser();
    parser.parseString(data, (err, result) => {
      if(err){
          urls.push(url);
      } else {
          var titleIdPairs = result.eshop.title_id_pairs[0].title_id_pair;
          //console.log(url);
          if(titleIdPairs && titleIdPairs.length > 0){
            for(var i = 0; i < titleIdPairs.length; i++){
              var ns_uid = titleIdPairs[i].ns_uid[0],
                  title_id = titleIdPairs[i].title_id[0];
              
              IDs[title_id] = ns_uid;
              console.log(title_id + " - " + ns_uid);
            }
          }
      }
      if(urls.length > 0){
        checkURL(urls.shift());
      }
    });
  })
}

checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());
checkURL(urls.shift());

(function(){
  if(urls.length > 0){
    console.log(urls.length);
    setTimeout(arguments.callee, 10000);
  }
  fs.writeFileSync(cwd + "/eshopuid.json", JSON.stringify(IDs, null, '\t'));
})();

process.on('exit', function(){
});
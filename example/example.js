//simple test file

xml2json=require ('../lib/xml2json.js');
jsonArray = xml2json.parseFile('./example.xml');
console.log(JSON.stringify(jsonArray,null,'  '));
//simple test file

xml2json=require ('../lib/xml2json.js');
jsonArray = xml2json.parseFile('./test.xml');
console.log(JSON.stringify(jsonArray,null,'  '));
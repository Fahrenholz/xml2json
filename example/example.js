//simple test file

xml2json=require ('xml2json');
jsonArray = xml2json.parseFile('./example.xml');
console.log(JSON.stringify(jsonArray,null,'  '));
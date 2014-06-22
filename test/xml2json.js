var expect = require('chai').expect,
	xml2json = require('../lib/xml2json'),
	parseFile = xml2json.parseFile,
	parseString = xml2json.parseString;


describe('parseString()', function(){
	it('throws an error when trying to parse an invalid xml string', function(){
		expect(function(){parseString('<book>test')}).to.throw(/Failed to get closing tag/);
	});

	it('gives back an array when trying to parse valid xml', function(){
		var res = parseString('<book>test</book>');
		expect(res).to.be.ok;
	});

	it('gives back an array having objects matching the xml input', function(){
		var res = parseString('<book>test</book>');
		expect(res[0].xml2json_xmlTagName).to.equal('book');
		expect(res[0].xml2json_value).to.equal('test');
	});
});

describe('parseFile()', function(){
	it('throws an error when file does not exist', function(){
		expect(function(){parseFile('./test/file_does_not_exist.xml')}).to.throw(Error);
	});

	it('gives back an array when trying to parse valid xml', function(){
		var res = parseFile('./test/testfile.xml');
		expect(res[0].xml2json_xmlTagName).to.equal('book');
		expect(res[0].xml2json_value).to.equal('test');
	});
});




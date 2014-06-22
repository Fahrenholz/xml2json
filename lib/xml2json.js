//requires
var fs = require('fs');

//state (needs to be cleared after parsing)
var tagPattern = /(<.[^(><.)]+>)/g;
var tags = null;
var nextTagIndex = null;
var xmlInput = null;


/**
* Parses an xml file to a JSON Object
*
* @param {String} xmlInput
* @return {Array}
*
*/
function parseFile(path){
	var xmlString = fs.readFileSync(path, 'utf8')
	return parse(xmlString);
}


/**
* Parses an xml string to a JSON Object
*
* @param {String} xmlInput
* @return {Array}
*
*/

function parse(xml){
	xmlInput = xml;
	sanitizeXml();
	var output = new Array();
	tags = xmlInput.match(tagPattern);
	nextTagIndex = 0;

	while (nextTagIndex < tags.length){
		output.push(parseTag(nextTagIndex));
	}

	//clear state and return result
	tags = null;
	nextTagIndex = null;
	xmlInput = null;
	return output;
}


/**
* Parses one tag and its children recursively
*
* @param {Integer} tagIndex
* @return {Object}
*
*/

function parseTag(tagIndex){
	currentTag = tags[tagIndex].substr(1,tags[tagIndex].length-2); //tag without < and >
	var attributes = currentTag.match(/([a-zA-Z\/]+(?:\w?=\w?['|"]?.*[^'"]['|"])?)/g); //array of tag name and attributes
	for(var i =0; i < attributes.length; i++){
		attributes[i] = attributes[i].trim();
	}
	var tagName = attributes[0];
	var lastAttr = attributes[attributes.length-1];
	if (lastAttr[lastAttr.length-1] =='/') { //singleton
		var startIndex = tagIndex;
		var endIndex = tagIndex;
	}
	else if(tagName[0] !='/' && tagName[0] != '?') { //opening Tag
		var startIndex = tagIndex;
		var endIndex = getClosingTagIndex(tagName, tagIndex);
	}
	
	var tagParsed;
	if (endIndex == startIndex + 1){
		tagParsed = {xml2json_xmlTagName: tagName};
		for(var attr = 1 ; attr < attributes.length; attr++) {
			var currentAttr = attributes[attr].split('=');
			tagParsed[currentAttr[0]]=currentAttr[1].substr(1,currentAttr[1].length-2);
		}
		tagParsed.value=parseTagContent(tagName, startIndex);
	}
	else if (endIndex == startIndex){

		tagParsed = {xml2json_xmlTagName: tagName};
		for(var attr = 1 ; attr < attributes.length; attr++) {
			var currentAttr = attributes[attr];
			if(currentAttr != '/'){
				var currentAttr = currentAttr.split('=');
				if(currentAttr[1][currentAttr[1].length-1] == '/'){
					currentAttr[1] = currentAttr[1].substr(0,currentAttr[1].length-1);
				}
				tagParsed[currentAttr[0]]=currentAttr[1].substr(1,currentAttr[1].length-2);
			}
		}
		tagParsed.value = true;
	}
	else {
		tagParsed = {xml2json_xmlTagName: tagName};
		for(var attr = 1 ; attr < attributes.length; attr++) {
			var currentAttr = attributes[attr].split('=');
			tagParsed[currentAttr[0]]=currentAttr[1].substr(1,currentAttr[1].length-2);
		}
		tagParsed.children = new Array();
		nextTagIndex = startIndex + 1;
		while ( nextTagIndex < endIndex){
			tagParsed.children.push(parseTag(nextTagIndex));
		}
	} 

	nextTagIndex = endIndex + 1;

	return tagParsed;
}

/**
* Gets the text content of one tag
*
* @param {String} tagName
* @param {Integer} startIndex
* @return {String}
*
*/

function parseTagContent(tagName, startIndex){
	var occurenciesBefore = 0;
	for (var i = 0; i < startIndex; i++){
		currentTag = tags[i].substr(1,tags[i].length-2); //tag without < and >
		var attributes = currentTag.split(' '); //array of tag name and attributes
		if(attributes[0] == tagName){
			occurenciesBefore++;
		}	
	}
	var contentPattern = new RegExp('<' + tagName + '>(.[^(><.)]*)<\/' + tagName + '>', 'gm');
	contents = xmlInput.match(contentPattern);
	var val = contents[occurenciesBefore];
	val = contentPattern.exec(val);
	return val[1];
}


/**
* Gets the index of the closing tag of one tag
*
* @param {String} tagName
* @param {Integer} startIndex
* @return {Integer}
*
*/
function getClosingTagIndex(tagName, startIndex){
	var i = startIndex;
	var closingTagIndex = null;
	while(i < tags.length && closingTagIndex == null){
		currentTag = tags[i].substr(1,tags[i].length-2); //tag without < and >
		var attributes = currentTag.match(/([a-zA-Z\/]+(?:\w?=\w?['|"]?.*[^'"]['|"])?)/g); //array of tag name and attributes
		if(attributes[0] == '/' + tagName){
			closingTagIndex = i;
		}
		i++;
	}

	if (closingTagIndex == null){
		throw new Error('Failed to get closing tag for tag ' + tagName + ' at index ' + i);
	}
	return closingTagIndex;
}

/**
* Removes comments, new lines and tabulations from xml source
*/
function sanitizeXml(){
	xmlInput = xmlInput.replace(/(\r\n|\n|\r|\t)/gm,"");
	xmlInput = xmlInput.replace(/<!--.[^(><.)]*-->/g, '');
}

exports.parse = parse;
exports.parseFile = parseFile;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          


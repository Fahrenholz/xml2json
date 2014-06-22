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
	return parseString(xmlString);
}


/**
* Parses an xml string to a JSON Object
*
* @param {String} xmlInput
* @return {Array}
*
*/

function parseString(xml){
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
	//get the tag of tagIndex without the '<' and '>'

	currentTag = tags[tagIndex].substr(1,tags[tagIndex].length-2);

	//split it up into an array of attributes (the tag name will be attributes[0])

	var attributes = splitToAttributes(currentTag);
	var tagName = attributes[0];
	var lastAttr = attributes[attributes.length-1];

	//test the tag type (singleton and opening tag will be treated, others wont)

	if (lastAttr[lastAttr.length-1] =='/') {
		//we have a singleton
		var startIndex = tagIndex;
		var endIndex = tagIndex;
	}
	else if(tagName[0] !='/' && tagName[0] != '?') {
		//we have an opening tag
		var startIndex = tagIndex;
		var endIndex = getClosingTagIndex(tagName, tagIndex);
	}
	
	var tagParsed;
	//apply different cases according to end and start tag index
	//has no child
	if (endIndex == startIndex + 1){
		tagParsed = {xml2json_xmlTagName: tagName};
		for(var attr = 1 ; attr < attributes.length; attr++) {
			var currentAttr = attributes[attr].split('=');
			tagParsed[currentAttr[0]]=currentAttr[1].substr(1,currentAttr[1].length-2);
		}
		tagParsed.xml2json_value=parseTagContent(tagName, startIndex);
	}
	//singleton
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
		tagParsed.xml2json_value = true;
	}
	//has children
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
	//set the index of the next tag to the tag after the end tag
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
		currentTag = tags[i].substr(1,tags[i].length-2);
		var attributes = splitToAttributes(currentTag);
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
		currentTag = tags[i].substr(1,tags[i].length-2);
		var attributes = splitToAttributes(currentTag);
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

/**
*Splits a tag into tag name and attributes
*/
function splitToAttributes(tag){
	var attributes = tag.match(/([a-zA-Z\/]+(?:\w?=\w?['|"]?.*[^'"]['|"])?)/g);
	for(var i =0; i < attributes.length; i++){
		attributes[i] = attributes[i].trim();
	}

	return attributes;
}

exports.parseString = parseString;
exports.parseFile = parseFile;                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          


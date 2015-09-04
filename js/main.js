const server = 'http://sudoservers.com:32400';
const sections = server + '/library/sections';
var fullListings;

function getItems(key){
	var items = [];
	var promise = new Promise(function(resolve, reject){
		var itemsData = sections + '/' + key + '/all';
		$.ajax({
			url: itemsData,
			type: 'get',
			dataType: 'xml',
			success: function(xml) {
				var container = $(xml).find('MediaContainer');
				$(container).find('Video').each(function(){
					var title = $(this).attr('title');
					var thumb = $(this).attr('thumb');
					var id = $(this).find('Media').find('Part').attr('id');
					items.push({'title': title, 'thumb': thumb, 'id': id});
				});
				resolve(items);
			}
		});
	});
	return promise;
}

function getLibraries() {
	var libraries = [];
	var promise = new Promise(function(resolve, reject){
		$.ajax({
			url: sections,
			type: 'get',
			dataType: 'xml',
			success: function(xml) {
				var container = $(xml).find('MediaContainer');
				$(container).find('Directory').each(function() {
					var name = $(this).attr('title');
					var key = $(this).attr('key');
					libraries.push({'name': name, 'key': key});
				});
				resolve(libraries);
			}
		});
	});
	return promise;
}

function gatherData() {
	fullListings = [];
	getLibraries().then(function(libraries){
		for(var index = 0; index < libraries.length; index++){
			(function(){
				var name = libraries[index].name;
				var key = libraries[index].key;
				getItems(key).then(function(items){
					fullListings.push({'name': name, 'key': key, 'items': items});
				});
			}());
		}
	});
}

function generateUI() {
	console.log('here');
}

document.addEventListener('DOMContentLoaded', function() {
	gatherData();
	generateUI();
});

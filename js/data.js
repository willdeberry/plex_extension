const server = 'http://sudoservers.com:32400';
const sections = server + '/library/sections';

function getItems(data) {
	var d = $.Deferred();
	var items = [];
	var collection = [];
	for(var index = 0; index < data.length; index++) {
		var key = data[index].key;
		var name = data[index].name;
		var itemsData = sections + '/' + key + '/all';
		$.ajax({
			url: itemsData,
			type: 'get',
			dataType: 'xml',
		}).done(function(xml) {
			var container = $(xml).find('MediaContainer');
			$(container).find('Video').each(function() {
				var title = $(this).attr('title');
				var thumb = $(this).attr('thumb');
				var id = $(this).find('Media').find('Part').attr('id');
				items.push({'title': title, 'thumb': thumb, 'id': id});
			});
		});
		collection.push({'name': name, 'key': key, 'items': items});
		d.resolve(collection);
	}
	return d.promise();
}

function getSectionKeys() {
	var d = $.Deferred();
	var sectionKeys = [];
	$.ajax({
		url: sections,
		type: 'get',
		dataType: 'xml',
	}).done(function(xml) {
		var container = $(xml).find('MediaContainer');
		$(container).find('Directory').each(function() {
			var name = $(this).attr('title');
			var key = $(this).attr('key');
			sectionKeys.push({'name': name, 'key': key});
		});
		d.resolve(sectionKeys);
	});
	return d.promise();
}

function gatherData() {
	var promise = new Promise(function(resolve, reject) {
		$.when(getSectionKeys()).done(function(keys) {
			$.when(getItems(keys)).done(function(fullListings) {
				resolve(fullListings);
			});
		});
	});
	return promise
}


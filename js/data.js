const server = 'http://sudoservers.com:32400';
const sections = server + '/library/sections';

function getItems(data) {
	var d = $.Deferred();
	var collection = [];
	for(var index = 0; index < data.length; index++) {
		count = 0;
		(function(index, data) {
			var items = [];
			var key = data[index].key;
			var name = data[index].name;
			var itemsData = sections + '/' + key + '/all';
			$.ajax({
				url: itemsData,
				type: 'get',
				dataType: 'xml',
				beforeSend: function(xhr) {
					xhr.setRequestHeader("X-Plex-Token", authToken);
				}
			}).done(function(xml) {
				var container = $(xml).find('MediaContainer');
				var totalItems = $(container).attr('size');
				$(container).find('Video').each(function() {
					var title = $(this).attr('title');
					var thumb = $(this).attr('thumb');
					var contentRating = $(this).attr('contentRating');
					var year = $(this).attr('year');
					var rating = $(this).attr('rating');
					var duration = $(this).attr('duration');
					var id = $(this).find('Media').find('Part').attr('id');
					items.push({'title': title, 'thumb': thumb, 'id': id, 'contentRating': contentRating, 'year': year, 'rating': rating, 'duration': duration});
				});
				collection.push({'name': name, 'key': key, 'items': items, 'totalItems': totalItems});
				count++
				if (count == data.length) {
					d.resolve(collection);
				}
			});
		})(index, data);
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
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Plex-Token", authToken);
		}
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
	var d = $.Deferred();
	getSectionKeys().done(function(keys) {
		getItems(keys).done(function(items) {
			d.resolve(items);
		});
	});
	return d.promise();
}


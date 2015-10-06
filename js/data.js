const server = 'http://sudoservers.com:32400';
const sections = server + '/library/sections';

function countItems(data) {
	var total = 0;
	for(var index = 0; index < data.length; index++) {
		total += +data[index].totalItems;
	};
	return total;
}

function getItems(authToken, data) {
	var d = $.Deferred();
	var collection = [];
	count = 0;
	for(var index = 0; index < data.length; index++) {
		(function(index, data) {
			var items = [];
			var type = data[index].type;

			function urlCall(index, data, category) {
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
					$(container).find(category).each(function() {
						var title = $(this).attr('title');
						var thumb = $(this).attr('thumb');
						var contentRating = $(this).attr('contentRating');
						var year = $(this).attr('year');
						var rating = $(this).attr('rating');
						var duration = $(this).attr('duration') / 1000 / 60;
						var id = $(this).find('Media').find('Part').attr('id');
						items.push({title: title, thumb: thumb, id: id, contentRating: contentRating, year: year, rating: rating, duration: duration.toFixed(0)});
					});
					collection.push({name: name, key: key, items: items, totalItems: totalItems});
					count++;
					if (count == data.length) {
						d.resolve(collection);
					}
				});
			}

			if (type == 'show') {
				urlCall(index, data, 'Directory');
			} else {
				urlCall(index, data, 'Video');
			}
		})(index, data);
	}
	return d.promise();
}

function getSectionKeys(authToken) {
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
			var type = $(this).attr('type');
			sectionKeys.push({name: name, key: key, type: type});
		});
		d.resolve(sectionKeys);
	});
	return d.promise();
}

function gatherData(authToken) {
	var d = $.Deferred();
	getSectionKeys(authToken).done(function(keys) {
		getItems(authToken, keys).done(function(items) {
			d.resolve(items);
		});
	});
	return d.promise();
}


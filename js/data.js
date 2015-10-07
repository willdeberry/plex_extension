function countItems(data) {
	var total = 0;
	for(var index = 0; index < data.length; index++) {
		total += +data[index].totalItems;
	};
	return total;
}

function downloadThumbs(authToken, item) {
	var d = $.Deferred();
	$.ajax({
		url: server + item.thumb,
		type: 'get',
		cache: false,
		dataType: 'binary',
		processData: false,
		responseType:'arraybuffer',
		beforeSend: function(xhr) {
			xhr.setRequestHeader("X-Plex-Token", authToken);
		}
	}).done(function(img) {
		var arr = new Uint8Array(img);
		var raw = '';
		var i,j,subArray,chunk = 5000;
		for (i=0,j=arr.length; i<j; i+=chunk) {
			subArray = arr.subarray(i,i+chunk);
			raw += String.fromCharCode.apply(null, subArray);
		}
		var b64 = btoa(raw);
		var dataURL = 'data:image/jpeg;base64,' + b64;
		var image = {id: item.id, url: dataURL};
		d.resolve(image);
	});
	return d.promise();
}

function getItems(authToken, data) {
	const sections = server + '/library/sections';
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
	const sections = server + '/library/sections';
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


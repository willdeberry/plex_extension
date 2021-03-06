function generateUI(authToken, data) {
	$.each(data, function(index, section) {
		$('#main').prepend('<div class="panel panel-default" id="panel' + section.key + '">');
		$('#panel' + section.key).append(
			'<div class="panel-heading" id="panel-head' + section.key + '" role="tab">'
				+ '<h4 class="panel-title"><span class="badge">' + section.totalItems + '</span>  ' + section.name + '</h4>'
			+ '</div>'
		);
		$('#panel' + section.key).append('<div class="list-group panel-collapse collapse" id="list-group' + section.key + '" role="tabpanel" aria-labelledby="panel-head' + section.key + '" aria-expanded="false"></div>');
		$.each(section.items, function(index, item) {
			$('#list-group' + section.key).append(
				'<div class="list-group-item" id="list-group-item' + item.id + '">'
					+ '<div class="col-xs-6 col-sm-6" id="img-div' + item.id + '">'
						+ '<img class="img-thumbnail" id="img' + item.id + '"/>'
					+ '</div>'
					+ '<div class="col-xs-6 col-sm-6">'
						+ '<table class="table table-condensed">'
							+ '<tr>'
								+ '<th>Year Released:</th>'
								+ '<td>' + item.year + '</td>'
							+ '</tr>'
							+ '<tr>'
								+ '<th>Content Rating:</th>'
								+ '<td>' + item.contentRating + '</td>'
							+ '</tr>'
							+ '<tr>'
								+ '<th>Duration:</th>'
								+ '<td>' + item.duration + ' min</td>'
							+ '</tr>'
							+ '<tr>'
								+ '<th>Stars:</th>'
								+ '<td>' + item.rating + '/10</td>'
							+ '</tr>'
						+ '</table>'
					+ '</div>'
				+ '</div>'
			);
			downloadThumbs(authToken, item).then(function(image) {
				$('#img' + image.id).attr('src', image.url);
				var imageObj = {};
				imageObj[image.id] = image.url;
				//chrome.storage.local.set(imageObj, function() { console.log('image ' + image.id + ' saved'); });
			});;
		});
		$('#panel-head' + section.key).on('click', function() { toggleCollapse(section.key); });
	});
}


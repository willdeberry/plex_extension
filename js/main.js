var fullListings = [];

function toggleCollapse(key) {
	$('.in').collapse('toggle');
	$('#list-group' + key).collapse('toggle');
}

function generateUI(data) {
	$.each(data, function(index, section) {
		$('#main').prepend('<div class="panel panel-default" id="panel' + section.key + '">');
		$('#panel' + section.key).append(
			'<div class="panel-heading" id="panel-head' + section.key + '" role="tab">'
				+ '<h4 class="panel-title">' + section.name + '</h4>'
			+ '</div>'
		);
		$('#panel' + section.key).append('<div class="list-group panel-collapse collapse" id="list-group' + section.key + '" role="tabpanel" aria-labelledby="panel-head' + section.key + '" aria-expanded="false"></div>');
		$.each(section.items, function(index, item) {
			$('#list-group' + section.key).append(
				'<div class="list-group-item" id="' + item.id + '">'
					+ '<div class="col-xs-6 col-sm-6">'
						+ '<img class="img-thumbnail" src="' + server + item.thumb + '"/>'
					+ '</div>'
					+ '<div class="col-xs-6 col-sm-6">'
						+ item.title
					+ '</div>'
					+ '<div class="col-xs-6 col-sm-6">'
						+ '<button class="btn btn-default" type="submit">Button</button>'
					+ '</div>'
				+ '</div>'
			);
		});
		$('#panel-head' + section.key).on('click', function() { toggleCollapse(section.key); });
	});
}

document.addEventListener('DOMContentLoaded', function() {
	gatherData().then(function(data) {
		fullListings = data;
		generateUI(data);
	});
});

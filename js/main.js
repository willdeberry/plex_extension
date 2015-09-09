var fullListings = [];

function sectionListings(key) {
	console.log('here');
}

function generateUI(data) {
	$.each(data, function(index, section) {
		$('#main').append('<div class="panel panel-default" id="panel' + section.key + '">');
		$('#panel' + section.key).append('<div class="panel-heading" id="panel-head' + section.key + '" onClick="sectionListings(' + section.key + ')">' + section.name + '</div>');
		$('#panel' + section.key).append('<div class="list-group" id="list-group' + section.key + '"></div>');
		$.each(section.items, function(index, item) {
			$('#list-group' + section.key).append('<div class="list-group-item" id="' + item.id + '">' + item.title + '</div>');
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	gatherData().then(function(data) {
		fullListings = data;
		generateUI(data);
	});
});

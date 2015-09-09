var fullListings = [];

function sectionListings(key) {
	console.log('here');
}

function generateUI(data) {
	$.each(data, function(index, section) {
		var sectionName = section.name;
		var sectionKey = section.key;
		var sectionItems = section.items;
		$('#main').append('<div id="' + sectionKey + '" onClick="sectionListings(' + sectionKey + ')">' + sectionName + '</div>');
		$.each(sectionItems, function(index, item) {
			console.log(sectionKey);
			$('#' + sectionKey).append('<div id="' + item.id + '">' + item.title + '</div>');
		});
	});
}

document.addEventListener('DOMContentLoaded', function() {
	gatherData().then(function(data) {
		fullListings = data;
		generateUI(data);
	});
});

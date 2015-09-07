var fullListings = [];

function sectionListings(key) {
	console.log('here');
}

function buildSections(data) {
	for(var index = 0; index < data.length; index++) {
		var catName = data[index]['name'];
		var catKey = data[index]['key'];
		$('#main').append('<div id="' + catName + '" onClick="sectionListings(' + catKey + ')">' + catName + '</div>');
	}
}

function generateUI(data) {
	buildSections(data);
}

document.addEventListener('DOMContentLoaded', function() {
	gatherData().then(function(data) {
		fullListings = data;
		generateUI(data);
	});
});

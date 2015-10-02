var authToken;

function toggleCollapse(key) {
	$('.in').collapse('toggle');
	$('#list-group' + key).collapse('toggle');
}

function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

function onLogin() {
	$('#login').addClass('hidden');
	$('#content').removeClass('hidden');
	var username = $('#inputUsername').val();
	var password = $('#inputPassword').val();
	$.ajax({
		url: 'https://plex.tv/users/sign_in.xml',
		type: 'post',
		dataType: 'xml',
		async: false,
		beforeSend: function(xhr) {
			xhr.setRequestHeader('Authorization', make_base_auth(username, password));
			xhr.setRequestHeader('X-Plex-Platform', 'Chrome');
			xhr.setRequestHeader('X-Plex-Platform-Version', '44.0');
			xhr.setRequestHeader('X-Plex-Provides', 'controller');
			xhr.setRequestHeader('X-Plex-Client-Identifier', 'o8l5n43vey6qolxr');
			xhr.setRequestHeader('X-Plex-Product', 'Plex for Chrome');
			xhr.setRequestHeader('X-Plex-Version', '1.0');
			xhr.setRequestHeader('X-Plex-Device', 'Google Chrome');
			xhr.setRequestHeader('X-Plex-Device-Name', 'Plex Web (Chrome)');
		},
	}).done(function(xml) {
		authToken = $(xml).find('authentication-token').text();
		gatherData().then(function(data) {
			generateUI(data);
		});
	});
}

/**
 * Convert an image 
 * to a base64 url
 * @param  {String}   url
 * @param  {Function} callback
 * @param  {String}   [outputFormat=image/png]
 */
function convertImgToBase64URL(url, callback, outputFormat){
	var img = new Image();
	img.crossOrigin = 'Anonymous';
	img.onload = function(){
		var canvas = document.createElement('CANVAS'),
		ctx = canvas.getContext('2d'), dataURL;
		canvas.height = this.height;
		canvas.width = this.width;
		ctx.drawImage(this, 0, 0);
		dataURL = canvas.toDataURL(outputFormat);
		callback(dataURL);
		canvas = null;
	};
	img.src = url;
}

function downloadThumbs(item) {
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
		$('#img' + item.id).attr('src', dataURL);
	});
}

function generateUI(data) {
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
								+ '<td>' + item.duration + '</td>'
							+ '</tr>'
							+ '<tr>'
								+ '<th>Stars:</th>'
								+ '<td>' + item.rating + '/10</td>'
							+ '</tr>'
						+ '</table>'
					+ '</div>'
				+ '</div>'
			);
			downloadThumbs(item);
		});
		$('#panel-head' + section.key).on('click', function() { toggleCollapse(section.key); });
	});
}

document.addEventListener('DOMContentLoaded', function() {
	$('#loginButton').on('click', function(event) { event.preventDefault(); onLogin() });
});

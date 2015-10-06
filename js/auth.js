function make_base_auth(user, password) {
	var tok = user + ':' + password;
	var hash = btoa(tok);
	return "Basic " + hash;
}

function onLogin() {
	var d = $.Deferred();
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
		var authToken = $(xml).find('authentication-token').text();
		chrome.storage.local.set({authToken: authToken}, function() { console.log('saving authToken %s', authToken) });
		d.resolve(authToken);
	});
	return d.promise();
}


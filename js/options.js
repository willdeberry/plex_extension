function save() {
	var server = $('#serverAddress').val();
	var port = $('#portNumber').val();

	if (server) {
		chrome.storage.local.set({server: server}, function() { console.log('server saved off') });
	}

	if (port) {
		chrome.storage.local.set({port: port}, function() { console.log('port saved off') });
	} else {
		port = '32400';
		chrome.storage.local.set({port: port}, function() { console.log('default port saved off') });
	}

	chrome.notifications.create('Plex Extension', {
		iconUrl: chrome.runtime.getURL('images/icon_38.png'),
		title: 'Plex Extension Settings',
		type: 'basic',
		message: 'Server information saved!',
		isClickable: false
	}, function() { console.log('notification generated') });
}

document.addEventListener('DOMContentLoaded', function() {
	function getServer() {
		chrome.storage.local.get('server', function(result) {
			if (chrome.runtime.lastError) {
				return;
			} else if (result.server) {
				var server = result.server;
				$('#serverAddress').val(server);
				return;
			} else {
				return;
			}
		});
	}

	function getPort() {
		chrome.storage.local.get('port', function(result) {
			if (chrome.runtime.lastError) {
				return;
			} else if (result.port) {
				var port = result.port;
				$('#portNumber').val(port);
				return;
			} else {
				return;
			}
		});
	}

	getServer();
	getPort();
	$('#saveOptions').on('click', function(event) {
		event.preventDefault();
		save();
	});

});

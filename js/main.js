var server;

function toggleCollapse(key) {
	$('.in').collapse('toggle');
	$('#list-group' + key).collapse('toggle');
}

function main(authToken) {
	function fail() {
		gatherData(authToken).then(function(data) {
			chrome.storage.local.set({data: data}, function() { console.log('Data saved off') });
			generateUI(data);
		});
	}

	chrome.storage.local.get('data', function(result) {
		if (chrome.runtime.lastError) {
			fail();
		} else if (result.data) {
			generateUI(authToken, result.data);
		} else {
			fail();
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	function failToOptionsPage() {
		chrome.tabs.create({ url: "options.html" })
	}

	function go(authToken) {
		$('#login').addClass('hidden');
		$('#content').removeClass('hidden');
		main(authToken);
	}

	function fail() {
		$('#loginButton').on('click', function(event) {
			event.preventDefault();
			var authToken = onLogin();
			go(authToken);
		});
	}

	function retrieveAuthToken() {
		chrome.storage.local.get('authToken', function(result) {
			if (chrome.runtime.lastError) {
				fail();
			} else if (result.authToken) {
				var authToken = result.authToken;
				go(authToken);
			} else {
				fail();
			}
		});
	}

	chrome.storage.local.get('server', function(result) {
		if (chrome.runtime.lastError) {
			failToOptionsPage();
		} else if (result.server) {
			var host = result.server;
			chrome.storage.local.get('port', function(result) {
				if (chrome.runtime.lastError) {
					failToOptionsPage();
				} else if (result.port) {
					var port = result.port;
					server = host + ':' + port;
					retrieveAuthToken();
				} else {
					failToOptionsPage();
				}
			});
		} else {
			failToOptionsPage();
		}
	});
});

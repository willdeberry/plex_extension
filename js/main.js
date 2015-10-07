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
			console.log('1');
			fail();
		} else if (result.data) {
			console.log('2');
			generateUI(authToken, result.data);
		} else {
			console.log('3');
			fail();
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
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
});

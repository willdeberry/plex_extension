function toggleCollapse(key) {
	$('.in').collapse('toggle');
	$('#list-group' + key).collapse('toggle');
}

function main(authToken) {
	chrome.storage.local.get('data', function(result) {
		if (chrome.runtime.lastError) {
			gatherData(authToken).then(function(data) {
				chrome.storage.local.set({data: data}, function() { console.log('Data saved off') });
				generateUI(data);
			});
		} else {
			generateUI(authToken, result.data);
		}
	});
}

document.addEventListener('DOMContentLoaded', function() {
	chrome.storage.local.get('authToken', function(result) {
		if(chrome.runtime.lastError) {
			$('#loginButton').on('click', function(event) {
				event.preventDefault();
				var authToken = onLogin();
				$('#login').addClass('hidden');
				$('#content').removeClass('hidden');
				main(authToken);
			});
		} else {
			var authToken = result.authToken;
			$('#login').addClass('hidden');
			$('#content').removeClass('hidden');
			main(authToken);
		}
	});
});

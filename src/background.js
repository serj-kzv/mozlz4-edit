browser.browserAction.onClicked.addListener(
	async tab => {
	  browser.tabs.create({
		url: '/index.html'
	  });
	}
);

// iframeViewLoader.js

var iframe = document.createElement('iframe')
	iframe.className = "breadcrumbsOverlay_112358"
	iframe.id = "breadcrumbsOverlay_112358"
	iframe.src = chrome.extension.getURL('iframe/iframeView.html')

document.body.appendChild(iframe)
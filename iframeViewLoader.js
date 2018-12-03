// iframeViewLoader.js

loadIframeBody(loadIframe)

function loadIframe (data) {
	
	console.log('iframeViewLoading', data)
	var iframe = document.createElement('iframe')
		iframe.className = "breadcrumbsOverlay hidden"
		iframe.id = "breadcrumbsOverlay"
		iframe.src = data
		// iframe.src = chrome.extension.getURL('iframe/iframeView.html')
	
	var hideButton = document.createElement('span')
		hideButton.id = "hideBreadcrumbsOverlay"
		hideButton.textContent = ""
		hideButton.className = "breadcrumbsDisplayToggle"

	document.body.appendChild(iframe)	
	document.body.appendChild(hideButton)

	var span = document.createElement('span')	
		span.textContent = "Hi!"

	var iframe = document.getElementById('breadcrumbsOverlay')
		iframe.contentWindow.document.body.appendChild(span)

	document.getElementById(hideButton.id).addEventListener("click", function(){
		var overlay = document.getElementById('breadcrumbsOverlay')
		var button = document.getElementById('hideBreadcrumbsOverlay')
		console.log("# ", ( overlay.className.split('hidden') ).length )

		if ( ( ( overlay.className.split('hidden') ).length > 1 ) ) {
			console.log('hide clicked, currently hidden - displaying')
		    overlay.className = ( overlay.className.split('hidden') ).join(' ')
		    button.className = ( button.className.split('collapsed') ).join(' ')
		    button.textContent = ""			

		} else {
			console.log('hide clicked')
		    overlay.className += " hidden"
		    button.className += " collapsed"
		    button.textContent = ""

		}
	     
	});



} 

function loadIframeBody (cb) {
	var url = chrome.runtime.getURL("iframe/iframeView.html")
	cb(url)
	console.log('cc', url)
	var xhr = new XMLHttpRequest;
	xhr.open("GET", url);
	console.log('xx', xhr)
	xhr.onreadystatechange = function() {
	  console.log(this)
	  if (this.readyState == 4) {
	    console.log("request finished, now parsing");
	    cb(xhr.responseText)
	    
	  } else {
	  	cb(false)
	  }
	};
	// xhr.send();
}
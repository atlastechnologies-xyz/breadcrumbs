// iframeViewLoader.js

loadIframeBody(loadIframe)
loadMiniIframeBody(loadMiniIframe)
function loadIframe (data) {
	
	var parent = document.createElement('div')
		parent.id = "breadcrumbsOverlayContainer"
		parent.className = "breadcrumbsOverlayContainer hidden"

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

	parent.appendChild(iframe)
	document.body.appendChild(parent)	
	document.body.appendChild(hideButton)

	var span = document.createElement('span')	
		span.textContent = "Hi!"

	var iframe = document.getElementById('breadcrumbsOverlay')
		iframe.contentWindow.document.body.appendChild(span)

	document.getElementById(hideButton.id).addEventListener("click", function(){
		var parent = document.getElementById('breadcrumbsOverlayContainer')
		var overlay = document.getElementById('breadcrumbsOverlay')
		var button = document.getElementById('hideBreadcrumbsOverlay')
		var mini = document.getElementById('breadcrumbsCollapsedIframe')
		console.log("# ", ( overlay.className.split('hidden') ).length )

		if ( ( ( overlay.className.split('hidden') ).length > 1 ) ) {
			console.log('hide clicked, currently hidden - displaying')
		    parent.className = ( parent.className.split('hidden') ).join(' ')
		    overlay.className = ( overlay.className.split('hidden') ).join(' ')
		    button.className = ( button.className.split('collapsed') ).join(' ')
		    button.textContent = ""		
		    mini.className += " hidden"

		} else {
			console.log('hide clicked')
		    parent.className += " hidden"
		    overlay.className += " hidden"
		    button.className += " collapsed"
		    button.textContent = ""
		    mini.className = ( overlay.className.split('hidden') ).join(' ')

		}
	     
	});
	dragElement(document.getElementById(parent.id));


} 

function loadMiniIframe (data) {
	
	var parent = document.createElement('div')
		parent.id = "breadcrumbsCollapsed"
		parent.className = "breadcrumbsMiniIframe hidden"

	console.log('iframeViewLoading', data)
	var iframe = document.createElement('iframe')
		iframe.className = "breadcrumbsMiniIframeIf hidden"
		iframe.id = "breadcrumbsCollapsedIframe"
		iframe.src = data
		// iframe.src = chrome.extension.getURL('iframe/iframeView.html')

	parent.appendChild(iframe)
	document.body.appendChild(parent)	

	var span = document.createElement('span')	
		span.textContent = "Hi!"

	var iframe = document.getElementById('breadcrumbsOverlay')
		iframe.contentWindow.document.body.appendChild(span)



} 
function dragElement(elmnt) {
  var pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
  if (document.getElementById(elmnt.id + "header")) {
    // if present, the header is where you move the DIV from:
    document.getElementById(elmnt.id + "header").onmousedown = dragMouseDown;
  } else {
    // otherwise, move the DIV from anywhere inside the DIV: 
    elmnt.onmousedown = dragMouseDown;
  }

  function dragMouseDown(e) {
    e = e || window.event;
    e.preventDefault();
    // get the mouse cursor position at startup:
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    // call a function whenever the cursor moves:
    document.onmousemove = elementDrag;
  }

  function elementDrag(e) {
    e = e || window.event;
    e.preventDefault();
    // calculate the new cursor position:
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // set the element's new position:
    elmnt.style.top = (elmnt.offsetTop - pos2) + "px";
    elmnt.style.left = (elmnt.offsetLeft - pos1) + "px";
  }

  function closeDragElement() {
    // stop moving when mouse button is released:
    document.onmouseup = null;
    document.onmousemove = null;
  }
}

function loadMiniIframeBody (cb) {
	var url = chrome.runtime.getURL("iframe/iframeCollapsedView.html")
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
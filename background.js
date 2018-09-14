chrome.tabs.query({'active': true, 'currentWindow': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log("Url found");
    console.log(url);
    jQuery.ajax({
    type: "POST",
    url: "http://54.147.234.158/scan.php",
    data: {url: url},
    success: function(data) {
      console.log("Flag Loaded:");
      console.log(data);
        var flag = data.trim();
        console.log(flag);
        if(flag==="blue"){
    chrome.browserAction.setIcon({
            path: "images/blue.png"
        });
        console.log("Set to blue");

        }else if(flag==="red"){
        chrome.browserAction.setIcon({
            path: "images/red.png"
        });
        console.log("Set to red");  
        
        }else if(flag==="yellow"){
        chrome.browserAction.setIcon({
            path: "images/yellow.png"
        }); 
        console.log("Set to yellow");

      }else{
        chrome.browserAction.setIcon({
            path: "images/grey.png"
        }); 
        console.log("Set to grey");
      } 
    }
    });
});


// On page load, refresh icon to match flag
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {setIcon();});
//chrome.browserAction.onClicked.addListener(function(tabId, changeInfo, updatedTab) {setIcon();});

chrome.browserAction.onClicked.addListener(function () {getContent();});

chrome.contextMenus.onClicked.addListener(onClickHandler);

// Set up context menu tree at install time.
chrome.runtime.onInstalled.addListener(function() {
  // Create one test item for each context type.
  var contexts = ["page","selection","link","editable","image","video",
                  "audio"];
  for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Voting";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
                                         "id": "context" + context});
    console.log("'" + context + "' item:" + id);
  }

  // Create a parent item and two children.
  chrome.contextMenus.create(
      {"title": "Clap", "id":"clap"});
  chrome.contextMenus.create(
      {"title": "Report", "id": "report"});
  console.log("parent child1 child2");

});

function setIcon(){
	chrome.tabs.query({'active': true, 'currentWindow': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log("Url found");
    console.log(url);
    jQuery.ajax({
    type: "POST",
    url: "http://54.147.234.158/scan.php",
    data: {url: url},
    success: function(data) {
    	console.log("Flag Loaded:");
    	console.log(data);
        var flag = data.trim();
        console.log(flag);
        if(flag==="blue"){
		chrome.browserAction.setIcon({
            path: "images/blue.png"
        });
        console.log("Set to blue");

        }else if(flag==="red"){
        chrome.browserAction.setIcon({
            path: "images/red.png"
        });
        console.log("Set to red");	
        
        }else if(flag==="yellow"){
        chrome.browserAction.setIcon({
            path: "images/yellow.png"
        });	
        console.log("Set to yellow");

    	}else{
        chrome.browserAction.setIcon({
            path: "images/grey.png"
        });	
        console.log("Set to grey");
    	}	
    }
    });
});
}

function getContent(){
	chrome.tabs.query({'active': true, 'currentWindow': true, 'lastFocusedWindow': true}, function (tabs) {
    var url = tabs[0].url;
    console.log("Url found");
    console.log(url);
    jQuery.ajax({
    type: "POST",
    url: "http://54.147.234.158/q.php",
    data: {url: url},
    success: function(data) {
    	console.log("Content Loaded:");
    	console.log(data);
        //var comments = JSON.parse(data);
        //console.log(comments);

    }
    });
});

}

function onClickHandler(info, tab) {
  if (info.menuItemId == "clap") {
    newClap(tab.url);

  } else if (info.menuItemId == "report") {
    newReport(tab.url);    

  } else {
    // Random debugging crap
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

  }
};

function newClap (url) {
    console.log("clap clicked for " + url);

}


function newReport (url) {
    console.log("report clicked for " + url);
}


















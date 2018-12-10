
console.log("background.js");

if (!mousePoint) {
  var mousePoint = {};
}

// Initialize Firebase

var config = {
  apiKey: "AIzaSyCvj82G5ClLtYQmOYC9W_dPzgeMMmPcS58",
  authDomain: "trust-f0fdc.firebaseapp.com",
  databaseURL: "https://trust-f0fdc.firebaseio.com",
  projectId: "trust-f0fdc",
  storageBucket: "trust-f0fdc.appspot.com",
  messagingSenderId: "802077806931"
};


// 1. Data storage setup
// init task - runs when chrome is opened and not after
chrome.runtime.onStartup.addListener(function onStartup () {
  runTimeTasks()
});

chrome.runtime.onInstalled.addListener(function onInstalled (details){
  openTutorial()
  runTimeTasks()
});

function openTutorial () {
  var newURL = "https://downloadbreadcrumbs.com/pages/tutorial1.html";
  chrome.tabs.create({ url: newURL });
}

function runTimeTasks () {
  // console.log('chrome launched - syncing sample data')
  console.log("runTimeTasks ran from " + runTimeTasks.caller)
  callFirebaseInitApp()
  initSettings()  
  setData();
  loadBoard();
  // configureContextMenus();
  chrome.contextMenus.onClicked.addListener(onClickHandler);

}

function checkOrInitFirebase() {
  if (!firebase.apps.length) {
    console.log('firebase wasn\'t initialized, initializing')
    callFirebaseInitApp()
  } else {
    console.log('firebase already initialized, continuing')
  }

}

function callFirebaseInitApp(){
  console.log('initializing firebase from ' + callFirebaseInitApp.caller)
  firebase.initializeApp(config);
}

// 2. Right click menu setup
chrome.extension.onMessage.addListener(function(msg, sender, sendResponse) {
  // console.log(msg, sender, sendResponse)

  checkOrInitFirebase()

  if (msg.from == 'rightclick') {
    //storing position
    mousePoint = msg.point;
    console.log('mouse head at ', mousePoint)

  }

  if ( msg.from == 'newFlag' ) {
    
    var payload = msg.payload;
    console.log('new Flag submit received', msg)

    callAPIForNewFlag(msg.payload)

    
  }

  if ( msg.from == 'newComment' ) {
    
    var payload = msg.payload;
    console.log('new comment submit received', msg)

    callAPIForNewFlag(msg.payload)

    
  } 

  if ( msg.from == 'newStar' ) {
    
    var payload = msg.payload;
    console.log('new star submit received', msg)

    callAPIForNewStar(msg.payload)

    
  }  

  if (msg.from == 'getFlags') {
    
    //storing position
    console.log('received getflags ', msg)
    sendResponse = sample_flags
    return sendResponse

  }

  if (msg.from == 'search') {
    //storing position
    console.log('received search request ', msg)
    sendResponse = "OK"

    var request = {
      'actionType' : 'search',
      'searchText' : msg.payload.searchText
    }

    sendMessageToCurrentTab(request)
    return sendResponse

  }

})

function loadBoard (boardName) {
  console.log('loadboard triggered')
    firebase.functions().httpsCallable('getUrlList')({})
    .then( function(result) {
      if ( typeof(result.data.error) != "undefined" ) {
        console.log('caught api error: ', result.data.error)
        handleError(result.data.error)
      } else {
        handleSuccess("Leaderboard retrieved successfully!", result)
        setBoard(result)
      }
    }).catch( function(exception){

      console.log('flag submission error!: ', exception)
      handleError(exception.toString())
    })
}

function setBoard ( data ) {
  console.log('setBoard triggered')
  chrome.storage.local.set({board: data}, function(result) {
    console.log('setBoard returned', result)
    chrome.storage.local.get(["playIndex"] , function(index){
      if ( index > 0 ) {
        console.log('index is ', index)
      } else {
        index = 0
        chrome.storage.local.set({playIndex: index}, function(result) {
          console.log('playIndex set to 0')
        })
      }
    })
  });
}

function callAPIForNewFlag (payload) {

    firebase.functions().httpsCallable('flag')(payload)
    .then( function(result) {
      console.log('flag submitted, returned:', result);

      if ( typeof(result.data.error) != "undefined" ) {

        console.log('caught api error: ', result.data.error)
        handleError(result.data.error)

      } else {
        
        handleSuccess("Breadcrumb submitted successfully!")
        setData()

      
      }
      

    }).catch( function(exception){

      console.log('flag submission error!: ', exception)

      handleError(exception.toString())
    })
}

function callAPIForNewStar (payload) {

    firebase.functions().httpsCallable('createStar')(payload)
    .then( function(result) {
      console.log('star submitted, returned:', result);

      if ( typeof(result.data.error) != "undefined" ) {

        console.log('caught api error: ', result.data.error)
        handleError(result.data.error)

      } else {
        
        handleSuccess("Star saved successfully!")
        setData()

      
      }
      

    }).catch( function(exception){

      console.log('flag submission error!: ', exception)

      handleError(exception.toString())
    })
}

function handleSuccess (message) {
  console.log('handle success triggered w/', message)
  var payload = {
    'actionType' : 'success',
    'message' : message
  }

  // sendMessageToCurrentTab (payload)
  chrome.runtime.sendMessage(payload);
}

function handleError (err) {
  console.log('handle err triggered w/', err)
  var payload = {
    'actionType' : 'error',
    'message' : err
  }

  // sendMessageToCurrentTab (payload)
  chrome.runtime.sendMessage(payload);
}

// Set up context menu tree at install time.
function configureContextMenus() {
  // Create one test item for each context type.
  var contexts = ["page","selection"];
  for (var i = 0; i < contexts.length; i++) {
    var context = contexts[i];
    var title = "Flag";
    var id = chrome.contextMenus.create({"title": title, "contexts":[context],
    "id": context});
  }

  // Create a parent item and two children.
  chrome.contextMenus.create(
    {"title": "Star", "id":"star"}
  );

}

function onClickHandler(info, tab) {
  // console.log('info click caught', info)

  if (info.menuItemId == "page") {
    callAPIForNewFlag()

  } else if (info.menuItemId == "star") {
    callAPIForNewStar()

  } else if (info.menuItemId == "selection") {
    callAPIForNewFlag()

  } else {
    // Random debugging crap
    console.log("item " + info.menuItemId + " was clicked");
    console.log("info: " + JSON.stringify(info));
    console.log("tab: " + JSON.stringify(tab));

  }
};

function BC_submitNewStar () {
  // displaySuccess('Breadcrumb submitted!')

  // console.log('submitted!')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    // temporarily hardcoding subject_id to 1 to avoid bugs
    var payload = {
      "url" : convertUrl(tabs[0].url),
      "description": ""
    }
    var isHomePage = checkIfHomePage (payload.url) 
    console.log('homepage: ', isHomePage)
    if ( isHomePage === false ) {
      
      var msg = {payload: payload, from: 'newStar'};

      chrome.runtime.sendMessage(msg, function(response) {
        
      });
    } else {
      displayTip('Submitting flags on pages that change frequently is discouraged.')
    }

  
  })
}

function newFlag (tab, text) {

  console.log("new flag triggered from ", tab," for " + tab.url, "with text " + text, "current point is ", mousePoint, "sending to tab " + tab.index, tab);

  var payload = {
    "point" : mousePoint,
    "selectedText" : text,
    "actionType" : "newFlag"
  }
  
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    var url = tabs[0].url

    var paramString = "url=" + encodeURIComponent(url) + "&text=" + encodeURIComponent(text)

    window.open("flagForm.html?" + paramString, "extension_popup", "width=300px,status=no,scrollbars=yes,resizable=no");
    // sendMessageToCurrentTab (payload)


  });

}

function sendMessageToCurrentTab (payload) {
  console.log('sendMessageToCurrentTab', payload)
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    if (typeof tabs[0] != undefined) {
      console.log('sending to ', tabs[0])
      chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
         console.log(response);
      });
    } else {
      console.log('tabs', tabs)
      chrome.runtime.sendMessage(payload);
    }

  });
}

// function sendSetFlagsToView(flags) {
  //     console.log('sending set flags with ' + flags.count + " flags ")

  //     for (var l = 0; l < flags.length; l++ ){
  //         setFlagsInView(flags[l].flagId, flags[l].divId)
  //     }
  // }

  // function setFlagsInView (flagId, divId) {

  //     console.log("set flags triggered for flag" + flagId, "setting to " + divId);

  //       var payload = {
  //         "flagId" : flagId,
  //         "divId" : divId,
  //         "actionType" : "setFlags"
  //       }
  //     chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
  //       chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
  //         // console.log(response);
  //       });
  //     });

// }

function sendFlag () {
  var payload = {
    "url":url,
    "subject_id":"12345",
    "description":text,
    "source":"test.com",
    "offense_type":"false information",
    "selected_text":text
  }

  firebase.functions().httpsCallable('flag')(payload)
  .then( function(result) {
    console.log(result);
  });

}

function getInfo (url) {
  console.log("getInfo clicked for " + url, "mousePoint at ", mousePoint);
}

// 3. Icon Logic

// On new page load, refresh icon to match flag
chrome.tabs.onUpdated.addListener(function(tabId, changeInfo, updatedTab) {
  setFlag(updatedTab.url)
});

// On tab change, update icon
chrome.tabs.onActivated.addListener(function(activeInfo) {
  updateFlagForCurrentTab ()
});

function updateFlagForCurrentTab () {
  chrome.tabs.query({'active': true, 'lastFocusedWindow': true}, function (tabs) {
    if (typeof tabs[0] != undefined) {
      setFlag(tabs[0].url)
    } else {
      console.log('tabs', tabs)
    }
  });
}

function newFocusHandler (url) {
  var pUrl = setFlag(url)
}

var knownUrls = [{
  "url" : "https://downloadbreadcrumbs.com/pages/tutorial1.html",
  "color" : "red"
},{
  "url" : "https://downloadbreadcrumbs.com/pages/tutorial2.html",
  "color" : "yellow"
},{
  "url" : "https://downloadbreadcrumbs.com/pages/tutorial3.html",
  "color" : "blue"
},{
  "url" : "https://downloadbreadcrumbs.com/pages/tutorial4.html",
  "color" : "grey"
}]

function setFlag (currentUrl) {
  // console.log('setFlag ran with url ', currentUrl)
  var rawUrl = removeWww(convertUrl(currentUrl))
  var domain = rawUrl.split("/")[0]
  var domain = removeWww(domain);

  // Check known (static) urls
  for ( var ll = 0; ll < knownUrls.length; ll++ ) {
    console.log('checking', rawUrl, "against", knownUrls[ll])
    if ( rawUrl === convertUrl(knownUrls[ll].url) ) {
      return setIcon(knownUrls[ll].color)
    }
  }  

  // Then check all the urls in the set

  console.log("----------- r", rawUrl, "d", domain)
  var setflag = 0;

  getData( function(listings) {
    // console.log('checking against data ', listings)

    listings=listings.data;
    for ( var i = 0; i < listings.verified.length; i ++ ) {
       // console.log('checking domain ' + listings.verified[i])
       // console.log('currentDomain is ' + domain)
        if ( listings.verified[i] === domain ) {
          // if there's a match to a verified domain we stop here
          // console.log ('domain matches verified', listings.verified[i], domain)
          return setIcon('blue')
          setflag = 1;
        }
    }

    if ( setflag === 0 ) {
       // console.log('no verified URLs found, checking for banned domains')

      for ( var i = 0; i < listings.banned.length; i ++ ) {
        if ( listings.banned[i].domain === domain ) {
          // here we'll need to index through the urls to identify if this url is flagged or banned
          for ( var u = 0; u < listings.banned[i].urls.length; u ++ ) {
            if ( listings.banned[i].urls[u].url === rawUrl ) {
              // here we'll need to index through the urls to identify if this url is flagged or banned

               // console.log ('url matches banned', listings.banned[i], domain)

              return setIcon('red', listings.banned[i].urls[u].flagArray.length)

              // sendSetFlagsToView(listings.banned[i].urls[u].flags)

              setflag = 1;
            }

          }
          // console.log ('domain is flagged but this URL didn\'t match a known banned site', listings.verified[i], rawUrl)
          return setIcon('yellow')
          setflag = 1;
        }

      }


       console.log('no banned URLs found, checking for flagged domains rawUrl:'+rawUrl)

      for ( var i = 0; i < listings.flagged.length; i ++ ) {

         // console.log ('checking domain', listings.flagged[i].domain, domain)
        if ( listings.flagged[i].domain === domain ) {
          // console.log("matched domain:",domain)
          // console.log("listings.flagged[i].urls:",listings.flagged[i].urls)
          // here we'll need to index through the urls to identify if this url is flagged or banned
          for ( var u = 0; u < listings.flagged[i].urls.length; u ++ ) {
            console.log("checking url:",listings.flagged[i].urls[u].url)
            if ( listings.flagged[i].urls[u].url === rawUrl ) {
              // here we'll need to index through the urls to identify if this url is flagged or banned
              // console.log ('url matches flagged', listings.flagged[i].urls[u], rawUrl)
              return setIcon('yellow', listings.flagged[i].urls[u].flagArray.length)
              // sendSetFlagsToView(listings.flagged[i].urls[u].flags)
              setflag = 1;
            }
          }
          // console.log ('domain has open flags but this URL didn\'t match a known banned site', listings.flagged[i], rawUrl)
          return setIcon('grey')
          setflag = 1;
        }
      }
      // console.log('no matching records found - setting to grey')
      setIcon('grey')
    }
  });

}

function highlightTextInView () {
  console.log('autoHighlighting ran')
  chrome.storage.local.get(["settings"] , function(settings){
    console.log('autoHighlighting: ', settings.settings.autoHighlighting) 
    var autoHighlighting = settings.settings.autoHighlighting
    if ( autoHighlighting === true ) {
      console.log ('autoHighlighting is true, checking flags for url')
      chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

        fetchFlagsForUrl(convertUrl(tabs[0].url), function(flags) {
          console.log('flags retrieved, sending highlight calls')

          for (var i = 0; i < flags.length; i++ ) {
            var payload = {
                  "actionType" : "highlight",
                  "searchText" : flags[i].selectedText
                }
            console.log('highlight call 1: ', payload, "to", tabs[0].id )
            chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
              
              // console.log(response);
              

            });
          }
        })

  
      });
    }
  })
}

function setViewData (data) {

  var payload = {
    data : data
  }

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
    chrome.tabs.sendMessage(tabs[0].id, payload, function(response) {
      // console.log(response);
    });
  });
}

function setIcon(flag, count){

  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    console.log('flag is ' + flag, 'count is ' + count)
    if ( typeof count !== "undefined" ) {
      chrome.browserAction.setBadgeText({text: count.toString(), tabId: tabs[0].id });
      chrome.browserAction.setBadgeBackgroundColor({ color: [105, 105, 105, 105], tabId: tabs[0].id });
    } else {
      // chrome.browserAction.setBadgeText();
      console.log('badge should unset')

    }

  });

  if(flag==="blue"){
    chrome.browserAction.setIcon({
      path: "images/blue.png"
    });
    // console.log("Set to blue");

  }else if(flag==="red"){

    chrome.browserAction.setIcon({
      path: "images/red.png"
    });
    highlightTextInView ()
    // console.log("Set to red");

  }else if(flag==="yellow"){
    chrome.browserAction.setIcon({
      path: "images/yellow.png"
    });
    highlightTextInView ()
    // console.log("Set to yellow");

  }else{
    chrome.browserAction.setIcon({
      path: "images/grey.png"
    });
    highlightTextInView ()
    // console.log("Set to grey");
  }
}

function getRawUrl (rawUrl) {
  console.log('getting raw url of ', rawUrl)
  // var url =  (rawUrl.split('?')[0]).split('//')[1] // old version removing params as well
  var url = rawUrl.split('//')[1] // remove protocol header
  return url
}

function removeWww(rawUrl){
  console.log('getting www-less url of ', rawUrl)
  var set = rawUrl.split('www.')
  if ( set.length > 1 ) {
    console.log('noWww', set[1])
    return set[1]
  } else {
    console.log('noWww', set[1])
    return rawUrl
  }

}

function setData () {
  console.log('setdata running')
  firebase.functions().httpsCallable('getData')({})
  .then( function(result) {
    console.log('size of', JSON.stringify(result).length)
    console.log('fetched data and setting ', result);
    chrome.storage.local.set({data: result}, function() {
      updateFlagForCurrentTab ()
      forcePopupRefresh()
    });
  });
}

function forcePopupRefresh() {
  console.log('forcePopupRefresh ran')
  chrome.runtime.sendMessage({actionType: "refresh"});
}

function getData (cb) {
  chrome.storage.local.get(['data'], function(result) {
    console.log("data loaded", result.data)
    cb (result.data)
  });
}

function fetchFlagsForUrl (url, cb) {
  console.log(url)

    //url == "www.breitbart.com/big-government/2018/10/06/kavanaugh-confirmed-possibly-most-conservative-supreme-court-since-1934/") {
    firebase.functions().httpsCallable('getShortDataForUrl')({'url' : url})
      .then( function(result) {
        console.log(result);
        flags = result.data

        if (flags.length) {
          cb (flags)
        } else {
          var arr = []
          cb(arr)
        }
        //chrome.storage.sync.set({data: result}, function() {
      });
}

function setDiscreteData () {
  // insert api call to fetch flag data here
  chrome.storage.local.set({verified: sample_data.verified}, function() {
    console.log('Verified set is ' + sample_data.verified);
  });

  chrome.storage.local.set({banned: sample_data.banned}, function() {
    console.log('Banned set is ' + sample_data.banned);
  });

  chrome.storage.local.set({flagged: sample_data.flagged}, function() {
    console.log('Flagged set is ' + sample_data.flagged);
  });
}


function getVerified () {
  return chrome.storage.local.get(['verified'], function(result) {
    console.log('retrieved verified data')
    return result
  });
}
function getBanned () {
  return chrome.storage.local.get(['banned'], function(result) {
    console.log('retrieved banned data')
    return result
  });
}
function getFlagged () {
  return chrome.storage.local.get(['flagged'], function(result) {
    console.log('retrieved flagged data')
    return result
  });
}

function initSettings () {

  chrome.storage.local.get(["settings"] , function(settings){
    // console.log('loaded settings', settings, JSON.stringify(settings))
    if ("{}" === JSON.stringify(settings) ) {
      console.log('initializing settings')

      var settings = {
        "colorScheme" : "light", 
        "autoHighlighting" : false, 
        "showPendingFlags" : true
      }

      chrome.storage.local.set({ "settings": settings }, function(result){
          console.log('successfully initialized settings', result)
      });
    } else {
      console.log('loaded settings', settings)
      // all good - no need to initialize as settings are already stored
    }
  });

}

/* Server Side URL Format Matching */
function convertUrl (url){
      if (url === ""){
        return url;
      }
      url = stripHttp(url);
      url = stripWww(url);
      var jsonObjOfParameters = {};
      var parameters = url.split("?")
      if (parameters.length === 1){
        return url;
      }
      var pairs = parameters[1].split('&');
      for(i in pairs){
          var split = pairs[i].split('=');
          jsonObjOfParameters[decodeURIComponent(split[0])] = decodeURIComponent(split[1]);
      }
      jsonObjOfParameters = removeParametersBasedOnDomain(url, jsonObjOfParameters);

      var ordered = {};
      Object.keys(jsonObjOfParameters).sort().forEach(function(key) {
        ordered[key] = jsonObjOfParameters[key];
      });
      //Now They Are Ordered
      var newOrderedParameters ="";
      Object.keys(ordered).forEach(function(key) {
        newOrderedParameters = newOrderedParameters + key + "=" + ordered[key] + "&";
      })
      newOrderedParameters = newOrderedParameters.slice(0, -1);
      var newUrl = parameters[0] + '?' + newOrderedParameters
      return newUrl;
}

function removeParametersBasedOnDomain(url, jsonObjOfParameters){
      delete jsonObjOfParameters.t;
      delete jsonObjOfParameters.ref;
      delete jsonObjOfParameters.aff;
      delete jsonObjOfParameters.campaign;
      delete jsonObjOfParameters.sorce;
      delete jsonObjOfParameters.ref
      delete jsonObjOfParameters.source
      delete jsonObjOfParameters.url_id
      delete jsonObjOfParameters.aff_id
      delete jsonObjOfParameters.aff_sub
      delete jsonObjOfParameters.url
      delete jsonObjOfParameters.payout
      delete jsonObjOfParameters.redirect
      delete jsonObjOfParameters.email
      delete jsonObjOfParameters.phone
      delete jsonObjOfParameters.google_aid
      delete jsonObjOfParameters.google_aid_sha1
      delete jsonObjOfParameters.ios_ifa
      delete jsonObjOfParameters.ios_ifv
      delete jsonObjOfParameters.unid
      delete jsonObjOfParameters.user_id
      delete jsonObjOfParameters.windows_aid
      delete jsonObjOfParameters.windows_aid_sha1
      delete jsonObjOfParameters.tag
      delete jsonObjOfParameters.creative
      delete jsonObjOfParameters.creativeASIN
      delete jsonObjOfParameters.linkid
      delete jsonObjOfParameters.utm_source
      delete jsonObjOfParameters.utm_medium
      delete jsonObjOfParameters.utm_campaign
      delete jsonObjOfParameters.utm_content
      delete jsonObjOfParameters.pf_rd_p
      delete jsonObjOfParameters.pf_rd_s
      delete jsonObjOfParameters.pf_rd_t
      delete jsonObjOfParameters.pf_rd_i
      delete jsonObjOfParameters.pf_rd_m
      delete jsonObjOfParameters.pf_rd_r
      delete jsonObjOfParameters.smid
      if (url.startsWith('youtube')){
        delete jsonObjOfParameters.t;
        delete jsonObjOfParameters.feature;
      }
      return jsonObjOfParameters;
}

function stripWww (url) {
  if (url.indexOf("www.") === 0){
      url = url.replace("www.","");
  }
  return url;
}

function stripHttp (url) {
  if (url.indexOf("https://") === 0){
    url = url.replace("https://","");
  }
  if (url.indexOf("http://") === 0){
    url = url.replace("http://","");
  }
  return url;
} 

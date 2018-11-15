// TODO(DEVELOPER): Change the values below using values from the initialization snippet: Firebase Console > Overview > Add Firebase to your web app.
// Initialize Firebase
// chrome.extension.getBackgroundPage().console.log("credentials.js loaded");

var config = {
  apiKey: "AIzaSyCvj82G5ClLtYQmOYC9W_dPzgeMMmPcS58",
  authDomain: "trust-f0fdc.firebaseapp.com",
  databaseURL: "https://trust-f0fdc.firebaseio.com",
  projectId: "trust-f0fdc",
  storageBucket: "trust-f0fdc.appspot.com",
  messagingSenderId: "802077806931"
};
//if (!firebase.apps.length) {
//  console.log("initializingApp")
firebase.initializeApp(config);
//}

window.onload = function() {
  console.log("onLoad Worked");
  checkUserStatus()
  initApp()
  loadFlags()
  setNavListeners()
  setFactoid()

};

// Handlers for return messages from background.js
chrome.runtime.onMessage.addListener( function(request, sender, sendResponse) {
  console.log('message received', request)

  if ( request.actionType === "refresh" ) {
      refreshData()
  }

  if ( request.actionType === "error" ) {
    // console.log(request)
      displayError(request.message)
  }

  if ( request.actionType === "success" ) {
    // console.log(request)
      displaySuccess(request.message)
  }

});

function checkUserStatus () {
  getUserDataQuiet()

}

function setFactoid () {
  getFactoid (function(result) {
    document.getElementById('footerFactoid').textContent = result.text
    document.getElementById('footerMoreInfoFactoid').href = result.link
  })
}

function loaderControl (set) {
  var l = document.getElementById('loader').className
  if ( set === "show" ) {
    document.getElementById('loader').className = (l.split('hidden')).join(" ")
  } else if ( set === "hide" ) {
    document.getElementById('loader').className+= " hidden"
  } else if ( l.split('hidden').length > 1 ) {
    document.getElementById('loader').className = (l.split('hidden')).join(" ")
  } else {
    document.getElementById('loader').className+= " hidden"
  }
}

function getFactoid (cb) {
  var factoids = [{
    "text" : "Billionaire Ray Dalio credits his success to an open-minded approach to life.",
    "link" : "https://inside.bwater.com/publications/principles_excerpt"
  },{
    "text" : "Breacrumbs was created to provide a forum for open conversation. The more you know, the wiser you are.",
    "link" : "https://downloadbreadcrumbs.com"
  },{
    "text" : "A wise man knows that he knows nothing. - A.K.A. The Socratic Paradox",
    "link" : "https://en.wikipedia.org/wiki/I_know_that_I_know_nothing"
  }]

  var i = Math.floor(Math.random() * (factoids.length))

  cb( factoids[i] )
}

function displayError (message) {
  loaderControl('hide')
  console.log('setting error message', message)
  var id = randomString(16);
  var e = document.getElementById('error')
  var eDiv = document.createElement('div')
      eDiv.className = "errorMessage"
      eDiv.id = id
  var m = document.createElement('span')
      m.textContent = message
  var c = document.createElement('a')
      c.href = "#"
      c.textContent = "✕"
      c.onclick = function() { hideDiv(id) }
      eDiv.appendChild(m)
      eDiv.appendChild(c)

  e.appendChild(eDiv)

}

function displayTip (message) {
  loaderControl('hide')
  console.log('setting tip message', message)
  var id = randomString(16);
  var e = document.getElementById('error')
  var eDiv = document.createElement('div')
      eDiv.className = "tipMessage"
      eDiv.id = id
  var m = document.createElement('span')
      m.textContent = message
  var c = document.createElement('a')
      c.href = "#"
      c.textContent = "✕"
      c.onclick = function() { hideDiv(id) }
      eDiv.appendChild(m)
      eDiv.appendChild(c)

  e.appendChild(eDiv)

}

function displaySuccess (message) {
  loaderControl('hide')
  console.log('setting success message', message)
  var id = randomString(16);
  var e = document.getElementById('success')
  var eDiv = document.createElement('div')
      eDiv.className = "successMessage"
      eDiv.id = id
  var m = document.createElement('span')
      m.textContent = message
  var c = document.createElement('a')
      c.href = "#"
      c.textContent = "✕"
      c.onclick = function() { hideDiv(id) }
      eDiv.appendChild(m)
      eDiv.appendChild(c)

  e.appendChild(eDiv)

}

function deleteItem (id, cb) {
  console.log('delete flag id', id)
  document.getElementById('flagBody_' + id).className += " hidden"
  document.getElementById('flagFooter_' + id).className += " hidden"
  
  var flagItem = document.getElementById(id)

  var l = document.createElement('div')
      l.className = "deleteDiv"
      l.id = "deleteDiv_" + id

  var i = document.createElement('span')
      i.id = "deleteBody_" + id
      i.textContent = "Are you sure you want to delete this? This action cannot be undone."
      i.className = "bc_input bc_description bc_comment"

  var f = document.createElement('div')
      f.className = "newFlagControls bc_comment"

  var s = document.createElement('button')
      s.textContent = "Confirm"
      s.onclick = function () { cb(id) }
      s.className = "bc_input submit delete"

  var c = document.createElement('a')
      c.onclick = function() { cancelDelete(id) }
      c.className = "faqButtons"
      c.textContent = "Cancel"

  f.appendChild(s)
  f.appendChild(c)
  l.appendChild(i)
  l.appendChild(f)

  flagItem.appendChild(l)

}

function cancelDelete (id) {
  document.getElementById('flagBody_' + id).className = ((document.getElementById('flagBody_' + id).className).split('hidden')).join(' ')
  document.getElementById('flagFooter_' + id).className = ((document.getElementById('flagFooter_' + id).className).split('hidden')).join(' ')
  document.getElementById('deleteDiv_' + id).className += " hidden"
} 

function cancelEdit (id) {
  document.getElementById('flagBody_' + id).className = ((document.getElementById('flagBody_' + id).className).split('hidden')).join(' ')
  document.getElementById('flagFooter_' + id).className = ((document.getElementById('flagFooter_' + id).className).split('hidden')).join(' ')
  document.getElementById('editDiv_' + id).className += " hidden"
} 

function editItem (id, cb) {
  console.log('edit bc id', id)
  console.log('delete flag id', id)
  document.getElementById('flagBody_' + id).className += " hidden"
  document.getElementById('flagFooter_' + id).className += " hidden"
  
  var flagItem = document.getElementById(id)

  var l = document.createElement('div')
      l.className = "editDiv"
      l.id = "editDiv_" + id

  var i = document.createElement('textarea')
      i.id = "editBody_" + id
      i.className = "bc_input bc_description bc_comment"
      i.value = document.getElementById('flagBodyText_' + id).textContent

  var f = document.createElement('div')
      f.className = "newFlagControls bc_comment"

  var s = document.createElement('button')
      s.textContent = "Save"
      s.onclick = function () { cb(id) }
      s.className = "bc_input submit"

  var c = document.createElement('a')
      c.onclick = function() { cancelEdit(id) }
      c.className = "faqButtons"
      c.textContent = "Cancel"

  f.appendChild(s)
  f.appendChild(c)
  l.appendChild(i)
  l.appendChild(f)

  flagItem.appendChild(l)

}

function callUpdateBreadcrumbAPI (id) {
  loaderControl('show')  
  var description = document.getElementById('editBody_' + id).value

  firebase.functions().httpsCallable('updateBreadcrumb')({'breadcrumb_id' : id, 'description' : description})
    .then( function(result) {
      console.log('Returned data for updateBreadcrumb: ', result);
      if (result.data.success === true ) {
        displaySuccess('Updated successfully.')
        refreshData()
      } else {
        displayError('There was an error, please try again later.')
      }
      //chrome.storage.sync.set({data: result}, function() {
    });
}

function callUpdateFlagAPI (id) {
  loaderControl('show')
  var description = document.getElementById('editBody_' + id).value
  
  firebase.functions().httpsCallable('updateFlag')({'flag_id' : id, 'description' : description})
    .then( function(result) {
      console.log('Returned data for updateFlag: ', result);
      if (result.data.success === true ) {
        displaySuccess('Updated successfully.')
        refreshData()
      } else {
        displayError('There was an error, please try again later.')
      }
      //chrome.storage.sync.set({data: result}, function() {
    });
}

function callDeleteBreadcrumbAPI (id) {
  loaderControl('show')  
  firebase.functions().httpsCallable('deleteBreadcrumb')({'breadcrumb_id' : id})
    .then( function(result) {
      console.log('Returned data for deleteBreadcrumb: ', result);
      if (result.data.success === true ) {
        displaySuccess('Deleted successfully.')
        refreshData()
      } else {
        displayError('There was an error, please try again later.')
      }
      //chrome.storage.sync.set({data: result}, function() {
    });
}

function callDeleteFlagAPI (id) {
  loaderControl('show')
  firebase.functions().httpsCallable('deleteFlag')({'flag_id' : id})
    .then( function(result) {
      console.log('Returned data for deleteFlag: ', result);
      if (result.data.success === true ) {
        displaySuccess('Deleted successfully.')
        refreshData()
      } else {
        displayError('There was an error, please try again later.')
      }      
      //chrome.storage.sync.set({data: result}, function() {
    });
}

function hideDiv (id) {
  var element = document.getElementById(id)
      element.style.display = "none";
      element.parentNode.removeChild(document.getElementById(id));
}

function initApp() {
  chrome.extension.getBackgroundPage().console.log("initApp Called");
  // Listen for auth state changes.
  // [START authstatelistener]
  firebase.auth().onAuthStateChanged(function(user) {
    getUserDataQuiet()

    if (user) {
      chrome.extension.getBackgroundPage().console.log("Got User");

      // User is signed in.
      var displayName = user.displayName;
      var email = user.email;
      var emailVerified = user.emailVerified;
      var photoURL = user.photoURL;
      var isAnonymous = user.isAnonymous;
      var uid = user.uid;
      var providerData = user.providerData;
      // [START_EXCLUDE]
      document.getElementById('quickstart-button').textContent = 'Sign out';
      // document.getElementById('quickstart-sign-in-status').textContent = 'Signed in';
      // document.getElementById('quickstart-account-details').textContent = JSON.stringify(user, null, '  ');
      // [END_EXCLUDE]
    } else {
      // Let's try to get a Google auth token programmatically.
      // [START_EXCLUDE]
      chrome.extension.getBackgroundPage().console.log("Could not get user");

      document.getElementById('quickstart-button').textContent = 'Google Login';
      // document.getElementById('quickstart-sign-in-status').textContent = 'Signed out';
      // document.getElementById('quickstart-account-details').textContent = 'null';
      // [END_EXCLUDE]
    }
    document.getElementById('quickstart-button').disabled = false;
  });
  // [END authstatelistener]

  addButtonListeners()
  addSettingsListeners()

}

function addButtonListeners() {
  document.getElementById('quickstart-button').addEventListener('click', startSignIn, false);
  document.getElementById('refresh-button').addEventListener('click', refreshData);
  document.getElementById('newFlag-button').addEventListener('click', BC_submitNewFlag);
  document.getElementById('newStar-button').addEventListener('click', BC_submitNewStar);
  document.getElementById('showRulesButton').addEventListener('click', showRules)
  // document.getElementById('showFAQButton').addEventListener('click', showFAQ)
  // document.getElementById('breadcrumbIsFlag').addEventListener('click', showFlagRules)
  document.getElementById('saveUserNameButton').addEventListener('click', updateUser)
}
function showFlagRules () {
  
  var rulesClass = document.getElementById('flagRules').className
  if (rulesClass.indexOf("hidden") !== -1 ) {
    // currently hidden, so show it
    document.getElementById('flagRules').className = rulesClass.split('hidden').join(' ')
  } else {
    // currently shown, so hide it
    document.getElementById('flagRules').className += "hidden"
  }

}

function showRules () {
  var rulesClass = document.getElementById('rules').className
  if (rulesClass.indexOf("hidden") !== -1 ) {
    // currently hidden, so show it
    document.getElementById('rules').className = rulesClass.split('hidden').join(' ')
  } else {
    // currently shown, so hide it
    document.getElementById('rules').className += "hidden"
  }
}
function showFAQ () {
  var rulesClass = document.getElementById('FAQ').className
  if (rulesClass.indexOf("hidden") !== -1 ) {
    // currently hidden, so show it
    document.getElementById('FAQ').className = rulesClass.split('hidden').join(' ')
  } else {
    // currently shown, so hide it
    document.getElementById('FAQ').className += "hidden"
  }
}

function refreshData () {
  console.log('refresh data called')
  window.location.reload() 

}

function getFlags (cb) {
  console.log('get flags ran')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {

    var url = convertUrl(tabs[0].url)
    console.log('cb', cb)
    console.log(url)

    fetchFlagsForUrl(url, function (flags){
      console.log('returned flags', flags)      
      if ( flags.length > 0 ) {
        cb(flags)
      } else {
        var arr = []
        cb(arr)
      }
    })

  });

}

function fetchFlagsForUrl (url, cb) {
  console.log(url)

    //url == "www.breitbart.com/big-government/2018/10/06/kavanaugh-confirmed-possibly-most-conservative-supreme-court-since-1934/") {
    firebase.functions().httpsCallable('getShortDataForUrl')({'url' : url})
      .then( function(result) {
        console.log('Retrieved data for getShortDataForUrl: ', result);
        var flags = result.data.flagsAndCrumbs

        if (result.data.isStarred) {
          document.getElementById('newStar-button').className += " present"
        }

        if (result.data.isFlagged) {
          document.getElementById('newFlag-button').className += " present"
        }

        if (flags.length) {
          cb (flags)
        } else {
          var arr = []
          cb(arr)
        }
        //chrome.storage.sync.set({data: result}, function() {
      });
}

function loadFlags () {

  getFlags(function (flags) {
    // var flags = []
    console.log('flags', flags)

    if ( flags.length > 0 ) {
      document.getElementById('home').className += " hidden"
      document.getElementById('settings').className += " hidden"
      document.getElementById('newFlag').className += " hidden"
      showFlags(flags)
    } else {
      document.getElementById('flagContainer').className += " hidden"
      document.getElementById('settings').className += " hidden"
      document.getElementById('newFlag').className += " hidden"      
      showNoFlagsMessage()
    }

  })


}

function getUserDataQuiet () {
  // calls from navSettings to load the user data 
  console.log('get user quiet called')
  firebase.functions().httpsCallable('getUser')()
    .then( function(result) {
      console.log('got user', result)
      storeLocalUser(result.data.name)
      document.getElementById('userNameInput').value = result.data.name
      setUserData(result, true)
    }).catch( function (err) {
      console.log('err', err)
      
    })
}

function getUserData (user, cb) {
  // calls from navSettings to load the user data 
  console.log('get user called')
  firebase.functions().httpsCallable('getUser')()
    .then( function(result) {
      console.log('got user', result)
      setUserData(result)
      loaderControl('hide')
      if ( ( typeof(cb) === "undefined" ) || ( typeof(cb) === null ) ) {
        console.log('user retrieved successfully', result)
      } else {
        console.log("username is", result.data.name, result.name)
        if  ( ( result.data.name === "" ) || ( typeof(result.data.name) === "undefined" ) ) {
          
          // displayTip ( "You'll need to set a username before you can leave breadcrumbs. Click the gear icon in the bottom left corner to set one now." )
        }
        cb(true)
      }

      //chrome.storage.sync.set({data: result}, function() {
    }).catch( function (err) {
      console.log('err', err)
      displayTip("It looks like you're not logged in - click the gear icon in the bottom left corner to log in!")
    })
}

function setUserData (user, quiet) {
  console.log('setting user info ', user)
  if (user.data.name !== "undefined") {
    var username = user.data.name
    storeLocalUser(username)
    if ( quiet  != true ) {
      displayError('Successfully set username.')    
    }

  } else {
    var username = "No username set."    
    storeLocalUser("")
    if ( quiet != true ) {
      displayError('No username set. You will need to choose a username before you can submit breadcrumbs.')    
    }
  }

  document.getElementById('userName').innerHTML = username
  document.getElementById('userScore').innerHTML = "(" + user.data.score + ")"
  

}

function storeLocalUser (username) {
  console.log('set local storage username to ', username)
  chrome.storage.local.set({ "username": username }, function(username){
    console.log('set local')
  });
}

function unsetUserData () {
  console.log('unsetting user info ')
  document.getElementById('userName').innerHTML = "Not signed in"
  document.getElementById('userScore').innerHTML = ""
}

function addSettingsListeners() {
  document.getElementById('colorScheme').addEventListener("change", saveSettings)
  document.getElementById('autoHighlighting').addEventListener("change", saveSettings)
  document.getElementById('showPendingFlags').addEventListener("change", saveSettings)
}

function saveSettings () {

  console.log('save settings running')

  var settings = {
    "colorScheme" : document.getElementById('colorScheme').value, 
    "autoHighlighting" : document.getElementById('autoHighlighting').checked, 
    "showPendingFlags" : document.getElementById('showPendingFlags').checked
  }

  chrome.storage.local.set({ "settings": settings }, function(result){
      console.log('successfully saved settings', result)
  });
}

function getSettings () {
  chrome.storage.local.get(["settings"] , function(settings){
      console.log('loaded settings', settings)
      setSettings(settings)
  });
}

function setSettings (settings) {
  console.log('setting settings', settings)
  console.log('setting colorScheme ', settings.settings.colorScheme)
  document.getElementById('colorScheme').value = settings.settings.colorScheme
  document.getElementById('autoHighlighting').checked = settings.settings.autoHighlighting
  document.getElementById('showPendingFlags').checked = settings.settings.showPendingFlags
  
}

function setNavListeners() {
  document.getElementById('settings-button').addEventListener('click', navSettings)
  document.getElementById('home-button').addEventListener('click', navHome)
  document.getElementById('new-button').addEventListener('click', navNewFlag)
  document.getElementById('BC_nf_submitNewFlagForm').addEventListener('click', BC_submitNewFlagForm)
}

function navSettings () {
  // getUserData()
  console.log('nav to settings')
  getSettings()
  document.getElementById('home').className += " hidden"
  document.getElementById('flagContainer').className += " hidden"
  document.getElementById('newFlag').className += " hidden"
  document.getElementById('settings').className = document.getElementById('settings').className.split('hidden').join(' ')       
}

function navNewFlag () {
  console.log('nav to new flag')
  document.getElementById('home').className += " hidden"
  document.getElementById('flagContainer').className += " hidden"
  document.getElementById('settings').className += " hidden"
  document.getElementById('newFlag').className = document.getElementById('newFlag').className.split('hidden').join(' ')       
}

function navFlagContainer () {
  console.log('nav to new flag')
  document.getElementById('home').className += " hidden"
  document.getElementById('newFlag').className += " hidden"
  document.getElementById('settings').className += " hidden"
  document.getElementById('flagContainer').className = document.getElementById('flagContainer').className.split('hidden').join(' ')       
}

function navHome () {
  console.log('nav to home')
  // loadFlags()
  if(document.getElementById('flagContainer').children.length > 0) {
    console.log('flagContainer has children - navigating to flagContainer')
    navFlagContainer()
  } else {
    console.log('flagContainer has no children - navigating to home')
    document.getElementById('settings').className += " hidden"
    document.getElementById('flagContainer').className += " hidden"
    document.getElementById('newFlag').className += " hidden"
    document.getElementById('home').className = document.getElementById('home').className.split('hidden').join(' ')       
  }
}

function showNoFlagsMessage () {
    document.getElementById('home').className = document.getElementById('home').className.split('hidden').join(' ') 
}

function returnRandomQuote () {
  var quote = {
    quote : "In vain have you acquired knowledge if you have not imparted it to others.",
    author : "Deuteronomy Rabbah"
  }
  return quote
}

function showFlags (unsortedFlags) {

  // Retrieve Flag Container
  // flagContainer.className = "flagContainer"
  var flags = sortCommentsByScore(unsortedFlags)

  loaderControl()

  // check for show pending
  chrome.storage.local.get(["settings"] , function(settings){

    var showPendingFlags = settings.settings.showPendingFlags

    var flagContainer = document.getElementById("flagContainer");

    setTopLevelFlags(flags, showPendingFlags, flagContainer)

  });  
}

function setTopLevelFlags ( flags, showPendingFlags, flagContainer ) {

  chrome.storage.local.get([ "username" ], function(rr){
    // Inititalize 'extras' array
    var extras = []
    var score = 0
    var noFlags = 0  

    console.log('get username returned ', rr)
    if ( typeof(rr.username) === "undefined" ) {
      var usrname = ""
    } else {
      var usrname = rr.username
    }

    // Fill Flag Container (top level comments)
    for ( var x = 0; x < flags.length; x++ ) {

      // Check if flag is already present
      var fCheck = document.getElementById(flags[x].id)

      if (fCheck != null) {
        // skip this flag as it's already loaded
      
      } else {

        if ( showPendingFlags === true || (showPendingFlags === false && flags[x].status != 'FLAG PENDING') ) {
          console.log('parent is', flags[x].parent_id)
          if (typeof(flags[x].parent_id) === "undefined" || flags[x].parent_id === 0) {

            var children = getChildren(flags, flags[x].id)

            if (flags[x].is_flag) {
              score++
              if ( (flags[x].description === null ) || (flags[x].description === undefined) || (flags[x].description === "") ) {
                console.log('found a flag with no description field, id: ', flags[x].id )
              } else {
                if ( noFlags === 0 ) {
                  noFlags = 1
                  loaderControl()
                } 
                addFlagToFlagContainer(flags[x], flagContainer, children, usrname)    
              }
              
            } else {
              if ( noFlags === 0 ) {
                noFlags = 1
                loaderControl()
              }    
              addCommentToFlagContainer(flags[x], flagContainer, children, usrname)
           
            }             
          } else {
            extras.push(flags[x])
          }

        } else {
          console.log('skipping flag ', flags[x], 'x is ', x, 'flags.length is', flags.length)
          if ( x === (flags.length - 1 ) ){
            navHome ()
          }
        }
      }

    }
    console.log('score is', score)
    if ( score > 0 ) {
      console.log('setting flag count to ', score)
      document.getElementById('flagCount').className = document.getElementById('flagCount').className.split('hidden').join(' ')
      document.getElementById('flagCount').textContent = score
    }
    
    console.log('extras is', extras)
    // Push extras to the local storage
    chrome.storage.local.set({ "extras": extras }, function(result){
       console.log('set extras returned', result)
        // displaySuccess('Extras stored successfully.')
    });
    
    console.log('noFlags ', noFlags)
    if ( noFlags === 0 ) {
      loaderControl()
      showNoFlagsMessage()
    }  
  });


}


function showChildren (id) {

  var exists = document.getElementById('children_' + id)

  if ( exists != null ) {
    var zz = document.getElementById("expandButton_" + id)
        zz.textContent = "[+]"
    hideDiv( 'children_' + id )

  } else {
    var zz = document.getElementById("expandButton_" + id)
        zz.textContent = "[-]"

    chrome.storage.local.get(["extras"] , function(extras){
      // console.log(extras, id)
      var flags = extras.extras
      var children = []

      for ( var l = 0; l < flags.length; l++ ) {
        if ( flags[l].parent_id === id ) {
          children.push(flags[l])
        }
      }

      if ( children.length > 0 ) {
        // console.log('found children ', children)
        var parentDiv = document.getElementById(id)

        var childDiv = document.createElement('div')
            childDiv.id = 'children_' + id
            childDiv.className = "childDiv"

        parentDiv.appendChild(childDiv)



        for ( var x = 0; x < children.length; x++ ) {
          var sChildren = getChildren(flags, children[x].id)
          addCommentToFlagContainer(children[x], document.getElementById('children_' + id), sChildren, children[x].user_name)
        }

      } else {
        // console.log('no children found')
      }

    })  

  }

}

function getChildren ( flags, id ) {
  // console.log('checking for children for ' + id + " with ", flags)
  var set = []
  for ( var l = 0; l < flags.length; l++ ) {
    // console.log('checking child', flags[l])
    if ( flags[l].parent_id === id ) {
      // console.log('found child', flags[l])      
      set.push(flags[l])
    }
  }
  // console.log('returning set' + set)
  return set
}

function showVotingDisabled () {
  displayError('Voting is disabled for deleted comments.')
}

function addFlagToFlagContainer (flag, flagContainer, children, username) {
  // If not, then add it
  var newFlag = document.createElement('div')
  newFlag.id = flag.id
  newFlag.className = "flagElement"
  // var flagContainer = document.getElementById("flagContainer");

  if ( flag.status === 'FLAG DELETED' ) {
    flag.description = "[deleted]"
    flag.score = 0
    flag.username = "deleted"
  }

  var hasChildren = document.createElement('div')
      hasChildren.id = "hasChildren_" + flag.id
      hasChildren.className = "hasChildren"

  var expandChildrenButton = document.createElement('span')
      expandChildrenButton.id = "expandButton_" + flag.id
      expandChildrenButton.textContent = "[+]"

  var hasChildrenMessage = document.createElement('span')
      hasChildrenMessage.textContent = children.length + " replies"
      hasChildrenMessage.className = "hasChildrenMessage"
      
      hasChildren.onclick = function() { showChildren (flag.id) }
      hasChildren.appendChild(expandChildrenButton)
      hasChildren.appendChild(hasChildrenMessage)

  var flagHeader = document.createElement('div')
      flagHeader.className = "flagHeader"

  var flagStatus = document.createElement('i')
      flagStatus.className = "fas fa-circle status_" + flag.status.split("FLAG ")[1]  

  var flagUsername = document.createElement('span')
      flagUsername.className = "flagUsername"
      flagUsername.textContent = flag.user_name

  var flagAge = document.createElement('span')
      flagAge.className = "flagAge"
      flagAge.textContent = timeSince(flag.time)

  var flagType = document.createElement("i")
      flagType.className = "fas fa-flag flagType"

      flagHeader.appendChild(flagStatus)
      flagHeader.appendChild(flagUsername)
      flagHeader.appendChild(flagAge)
      flagHeader.appendChild(flagType)    

  var flagBody = document.createElement('div')
      flagBody.id = "flagBody_" + flag.id
      flagBody.className = "flagBody"

  var flagVoting = document.createElement('div')
      flagVoting.className = "flagVoting"

  var flagUpvote = document.createElement('i')
      flagUpvote.className = "fas fa-sort-up upvote"    
      flagUpvote.id = "upvote_" + flag.id
     

  var flagDownvote = document.createElement('i')
      flagDownvote.className = "fas fa-sort-down downvote"    
      flagDownvote.id = "downvote_" + flag.id

  if ( flag.status === 'FLAG DELETED' ) {
      flagUpvote.onclick = function() { showVotingDisabled () }
      flagDownvote.onclick = function() { showVotingDisabled () }
  } else {
      flagUpvote.onclick = function() { vote (flag.id, "UP_VOTE", true) }
      flagDownvote.onclick = function() { vote (flag.id, "DOWN_VOTE", true) }   
  }

  var flagScore = document.createElement('span')
      flagScore.className = "flagScore"
      flagScore.id = "score_" + flag.id
      flagScore.textContent = flag.score

      flagVoting.appendChild(flagUpvote)
      flagVoting.appendChild(flagScore)
      flagVoting.appendChild(flagDownvote)

  var flagText = document.createElement('span')
      flagText.id = "flagBodyText_" + flag.id
      flagText.className = "flagBodyText"
      flagText.textContent = flag.description

      flagBody.appendChild(flagVoting)
      flagBody.appendChild(flagText)

  var flagFooter = document.createElement('div')
      flagFooter.id = "flagFooter_" + flag.id
      flagFooter.className = "flagFooter"

  var replyButton = document.createElement('span')
      replyButton.className = "flagActionButton"
      replyButton.textContent = "reply"
      replyButton.onclick = function() { reply (flag.id) }

  var infoButton = document.createElement('span')
      infoButton.className = "flagActionButton"
      infoButton.textContent = "info"

  var infoButtonContainer = document.createElement('a')
      infoButtonContainer.target = "_blank"
      infoButtonContainer.href = "https://downloadbreadcrumbs.com/#/getinfo?i=" + flag.id
      infoButtonContainer.innerHTML = infoButton.outerHTML

  var reportButton = document.createElement('span')
      reportButton.className = "flagActionButton"
      reportButton.textContent = "report"
      reportButton.onclick = function() { report (flag.id) }            

      flagFooter.appendChild(replyButton)
      flagFooter.appendChild(infoButtonContainer)
      flagFooter.appendChild(reportButton)

  if ( flag.user_name === username ) {
    // add edit and delete buttons
    var editButton = document.createElement('span')
        editButton.className = "flagActionButton"
        editButton.textContent = "edit"
        editButton.onclick = function() { editItem (flag.id, callUpdateFlagAPI) }            
  
    var deleteButton = document.createElement('span')
        deleteButton.className = "flagActionButton"
        deleteButton.textContent = "delete"
        deleteButton.onclick = function() { deleteItem (flag.id, callDeleteFlagAPI) }            
  
    flagFooter.appendChild(editButton)
    flagFooter.appendChild(deleteButton)
  }


  newFlag.appendChild(flagHeader)
  newFlag.appendChild(flagBody)
  newFlag.appendChild(flagFooter)

  if ( children.length > 0 ) {
    flagFooter.appendChild(hasChildren)
  }

  flagContainer.appendChild(newFlag)      

}

function addCommentToFlagContainer (flag, flagContainer, children, username) {
  // If not, then add it
  var newFlag = document.createElement('div')
  newFlag.id = flag.id
  newFlag.className = "flagElement"
  // var flagContainer = document.getElementById("flagContainer");

  if ( flag.status === 'BREADCRUMB DELETED' ) {
    flag.description = "[deleted]"
    flag.vote_count = 0
    flag.user_name = "deleted"
  }

  var hasChildren = document.createElement('div')
      hasChildren.id = "hasChildren_" + flag.id
      hasChildren.className = "hasChildren"

  var expandChildrenButton = document.createElement('span')
      expandChildrenButton.id = "expandButton_" + flag.id
      expandChildrenButton.textContent = "[+]"

  var hasChildrenMessage = document.createElement('span')
      hasChildrenMessage.textContent = children.length + " replies"
      hasChildrenMessage.className = "hasChildrenMessage"
      
      hasChildren.onclick = function() { showChildren (flag.id) }
      hasChildren.appendChild(expandChildrenButton)
      hasChildren.appendChild(hasChildrenMessage)

  var flagHeader = document.createElement('div')
      flagHeader.className = "flagHeader"

  var flagStatus = document.createElement('i')
      flagStatus.className = "fas fa-circle status_"  

  var flagUsername = document.createElement('span')
      flagUsername.className = "flagUsername"
      flagUsername.textContent = flag.user_name

  var flagAge = document.createElement('span')
      flagAge.className = "flagAge"
      flagAge.textContent = timeSince(flag.time)

  var flagType = document.createElement("i")
      flagType.className = "fas fa-comments flagType"

      flagHeader.appendChild(flagStatus)
      flagHeader.appendChild(flagUsername)
      flagHeader.appendChild(flagAge)
      flagHeader.appendChild(flagType)    

  var flagBody = document.createElement('div')
      flagBody.id = "flagBody_" + flag.id
      flagBody.className = "flagBody"

  var flagVoting = document.createElement('div')
      flagVoting.className = "flagVoting"

  var flagUpvote = document.createElement('i')
      flagUpvote.className = "fas fa-sort-up upvote"    
      flagUpvote.id = "upvote_" + flag.id

  var flagDownvote = document.createElement('i')
      flagDownvote.className = "fas fa-sort-down downvote"    
      flagDownvote.id = "downvote_" + flag.id
      
  if ( flag.status === 'BREADCRUMB DELETED' ) {
      flagUpvote.onclick = function() { showVotingDisabled () }
      flagDownvote.onclick = function() { showVotingDisabled () }
  } else {
      flagUpvote.onclick = function() { vote (flag.id, "UP_VOTE", true) }
      flagDownvote.onclick = function() { vote (flag.id, "DOWN_VOTE", true) }   
  }

  var flagScore = document.createElement('span')
      flagScore.className = "flagScore"
      flagScore.id = "cc_score_" + flag.id
      flagScore.textContent = flag.vote_count

      flagVoting.appendChild(flagUpvote)
      flagVoting.appendChild(flagScore)
      flagVoting.appendChild(flagDownvote)

  var flagText = document.createElement('span')
      flagText.id = "flagBodyText_" + flag.id
      flagText.className = "flagBodyText"
      flagText.textContent = flag.description

      flagBody.appendChild(flagVoting)
      flagBody.appendChild(flagText)

  var flagFooter = document.createElement('div')
      flagFooter.id = "flagFooter_" + flag.id
      flagFooter.className = "flagFooter"

  var replyButton = document.createElement('span')
      replyButton.className = "flagActionButton"
      replyButton.textContent = "reply"
      replyButton.onclick = function() { reply (flag.id) }

  var infoButton = document.createElement('span')
      infoButton.className = "flagActionButton"
      infoButton.textContent = "info"

  var infoButtonContainer = document.createElement('a')
      infoButtonContainer.target = "_blank"
      infoButtonContainer.href = "https://downloadbreadcrumbs.com/#/getinfo?i=" + flag.id
      infoButtonContainer.innerHTML = infoButton.outerHTML

  var reportButton = document.createElement('span')
      reportButton.className = "flagActionButton"
      reportButton.textContent = "report"
      reportButton.onclick = function() { report (flag.id) }            

  if ( flag.user_name === username ) {
    // add edit and delete buttons
    var editButton = document.createElement('span')
        editButton.className = "flagActionButton"
        editButton.textContent = "edit"
        editButton.onclick = function() { editItem (flag.id, callUpdateBreadcrumbAPI) }            
  
    var deleteButton = document.createElement('span')
        deleteButton.className = "flagActionButton"
        deleteButton.textContent = "delete"
        deleteButton.onclick = function() { deleteItem (flag.id, callDeleteBreadcrumbAPI) }            
  
    flagFooter.appendChild(editButton)
    flagFooter.appendChild(deleteButton)
  }

      flagFooter.appendChild(replyButton)
      flagFooter.appendChild(infoButtonContainer)
      flagFooter.appendChild(reportButton)

  if ( children.length > 0 ) {
    flagFooter.appendChild(hasChildren)
  }

  newFlag.appendChild(flagHeader)
  newFlag.appendChild(flagBody)
  newFlag.appendChild(flagFooter)

  flagContainer.appendChild(newFlag)      

}

function report (id) {
  console.log('reported:', id)
}

function reply (id) {
  if ( document.getElementById(id + "_replyDiv") === null ) {
    console.log ('reply triggered', id) 
    var parent = document.getElementById(id)

    var child = document.createElement('div')
        child.id = id + "_children"

    var b = document.createElement('hr')

    var d = document.createElement('div')
        d.id = id + "_replyDiv"

    var i = document.createElement('textarea')
        i.id = "replyBody_" + id
        i.className = "bc_input bc_description bc_comment"
        i.placeholder = "Leave a reply..."

    var f = document.createElement('div')
        f.className = "newFlagControls bc_comment"

    var s = document.createElement('button')
        s.textContent = "Save"
        s.onclick = function () { submitReply(id) }
        s.className = "bc_input submit"

    var c = document.createElement('a')
        c.onclick = function() { hideDiv(id + "_replyDiv") }
        c.className = "faqButtons"
        c.textContent = "cancel"

    f.appendChild(s)
    f.appendChild(c)

    d.appendChild(b)
    d.appendChild(i)
    d.appendChild(f)

    child.appendChild(d)

    parent.appendChild(child)
  } else {
    hideDiv(id + "_replyDiv")
  }
  
      
}

// send flag to background.js
function submitReply (id) {
  loaderControl()
  chrome.storage.local.get(["username"] , function(username){
      console.log('loaded username', username)
      if (username === "undefined") {
        displayError('You must set a username in settings before you can submit breadcrumbs.')
      } else {
        navHome()
        // console.log('submitted!')
        chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
          // temporarily hardcoding subject_id to 1 to avoid bugs
          var payload = {
            "url" : convertUrl(tabs[0].url),
            "description": document.getElementById( "replyBody_" + id ).value,
            "is_flag" : false,
            "parent_id" : id
          }


          // console.log('calling new flag with', payload)

          var msg = {payload: payload, from: 'newComment'};
          // console.log('msg ', msg)

          // BC_hideElement ("testFlagForm")

          chrome.runtime.sendMessage(msg, function(response) {
            // console.log(response)
          });
        
        })
      }
  });

}

function vote (id, action, isFlag) {
  loaderControl()
  console.log('vote action triggered: ', action, id, isFlag)
  firebase.functions().httpsCallable('vote')({'id' : id, 'vote_type' : action, 'is_flag' : isFlag})
  .then( function(result) {
    console.log('flag submission returned', result)
    if (result.data.success) {
      updateScore(id, action, result, isFlag)
      loaderControl()
    } else {
      displayError('It seems you\'ve already voted on that one. You can still reverse your vote if you want though!')
    }
    
  }).catch( function (err) {
    displayError(err)
  })
}

function updateUser () {
  loaderControl()
  var username = document.getElementById('userNameInput').value
  console.log('update user triggered', username)

  firebase.functions().httpsCallable('updateUser')({ 'user_name' : username })
  .then( function(result) {
    console.log('user updated', result)
    document.getElementById('userName').textContent = username
    chrome.storage.local.set({ "username": username }, function(result){
        displaySuccess('Username updated successfully.')
    });
  }).catch( function (err) {
    displayError(err)
  })
}



function updateScore (id, action, result, isFlag) {
  console.log('update score triggered with', id, action, result)
  if (isFlag) {
    console.log('updating flag score with ID', id)
    document.getElementById('score_' + id).textContent = result.data.vote_count
  } else {
    console.log('updating comment score with ID', id)
    document.getElementById('cc_score_' + id).textContent = result.data.vote_count
  }
  
}

function moreInfo (div) {
  var id = div.parentNode.id
  var url = "https://downloadbreadcrumbs.com/#/getinfo?i=" + id
  window.open( url , '_newtab');
}

function setupFlags () {

}

/**
* Start the auth flow and authorizes to Firebase.
* @param{boolean} interactive True if the OAuth flow should request with an interactive mode.
*/
function startAuth(interactive) {
  chrome.extension.getBackgroundPage().console.log("Starting Auth");
  getUserDataQuiet()
  // Request an OAuth token from the Chrome Identity API.
  chrome.identity.getAuthToken({interactive: !!interactive}, function(token) {
    if (chrome.runtime.lastError && !interactive) {

      chrome.extension.getBackgroundPage().console.log('It was not possible to get a token programmatically.');
    } else if(chrome.runtime.lastError) {
      chrome.extension.getBackgroundPage().console.log('error:'+JSON.stringify(chrome.runtime.lastError));
    } else if (token) {
      // Authorize Firebase with the OAuth Access Token.
      var credential = firebase.auth.GoogleAuthProvider.credential(null, token);

      firebase.auth().signInAndRetrieveDataWithCredential(credential).catch(function(error) {
        // The OAuth token might have been invalidated. Lets' remove it from cache.
        if (error.code === 'auth/invalid-credential') {
          chrome.extension.getBackgroundPage().console.log('invalid credentials.');

          chrome.identity.removeCachedAuthToken({token: token}, function() {
            startAuth(interactive);
          });
        }
        // loaderControl()
        // refreshData()
      });
    } else {
      chrome.extension.getBackgroundPage().console.log("The OAuth Token was null");
      // loaderControl()
      // refreshData()
    }
    loaderControl('hide')
  });
}


// send flag to background.js
function BC_submitNewFlagForm () {
  // displaySuccess('Breadcrumb submitted!')
  loaderControl()
  navHome()
  // console.log('submitted!')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    // temporarily hardcoding subject_id to 1 to avoid bugs
    var payload = {
      "url" : convertUrl(tabs[0].url),
      "description": document.getElementById("BC_nf_description").value,
      "is_flag" : false
    }

    var isHomePage = checkIfHomePage (payload.url) 
    console.log('homepage: ', isHomePage)
    if ( isHomePage === false ) {
      var msg = {payload: payload, from: 'newComment'};

      chrome.runtime.sendMessage(msg, function(response) {
        
      });
    } else {
      displayError('Submitting comments on pages that change frequently is discouraged.')
    }

  
  })
}

/**
* Starts the sign-in process.
*/
function startSignIn() {
  // loaderControl()
  // updateUser()
  chrome.extension.getBackgroundPage().console.log("start signIn");
  document.getElementById('quickstart-button').disabled = true;
  if (firebase.auth().currentUser) {
    loaderControl('show')
    firebase.auth().signOut();
    unsetUserData();
    storeLocalUser("")
    refreshData()
    // loaderControl()
  } else {
    loaderControl('show')
    startAuth(true);

  }

}

function checkIfHomePage (url) {
  var slicedURL = url.split('/')
  console.log( 'slicedUrl', slicedURL, slicedURL[(slicedURL.length - 1)] )

  return false // override 

  if ( slicedURL[(slicedURL.length - 1)] === "" ) {
    if ( slicedURL.length > 2 ) {
      return false
    } else {
      return true
    }
  } 

  if ( slicedURL.length > 1 ) {
    return false
  } else {
    return true
  }
}

function BC_submitNewFlag () {
  // displaySuccess('Breadcrumb submitted!')
  loaderControl()
  // console.log('submitted!')
  chrome.tabs.query({active: true, currentWindow: true}, function(tabs) { 
    // temporarily hardcoding subject_id to 1 to avoid bugs
    var payload = {
      "url" : convertUrl(tabs[0].url),
      "description": "",
      "is_flag" : true
    }

    var isHomePage = checkIfHomePage (payload.url) 
    console.log('homepage: ', isHomePage)
    if ( isHomePage === false ) {
      var msg = {payload: payload, from: 'newFlag'};

      chrome.runtime.sendMessage(msg, function(response) {
        
      });
    } else {
      displayTip('Submitting flags on pages that change frequently is discouraged.')
    }

  
  })
}
function BC_submitNewStar () {
  // displaySuccess('Breadcrumb submitted!')
  loaderControl()
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

function getRawUrl (rawUrl) {
  console.log('getting raw url of ', rawUrl)
  // var url =  (rawUrl.split('?')[0]).split('//')[1] // remove get params and remove protocol header -- old version
  var url = rawUrl.split('//')[1] // remove protocol header
  return url
}

function removeWww(rawUrl){
  console.log('getting www-less url of ', rawUrl)
  var noWww = rawUrl.split('www.')[1]
  console.log('noWww', noWww)
  return noWww
}

function searchPageAndNav (text) {
 
  
  console.log('search request sent to background for text', text)

  // temporarily hardcoding subject_id to 1 to avoid bugs
  var payload = {
    "searchText": text
  }

    var msg = {payload: payload, from: 'search'};
    console.log('msg ', msg)

    // BC_hideElement ("testFlagForm")

    chrome.runtime.sendMessage(msg, function(response) {
      // console.log(response)
    });

}



function randomString(n) {
  var text = "";
  var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < n; i++)
    text += possible.charAt(Math.floor(Math.random() * possible.length));

  return text;
}

function timeSince(date) {

  var seconds = Math.floor((new Date() - date) / 1000);

  var interval = Math.floor(seconds / 31536000);

  if (interval > 1) {
    return interval + " years";
  }
  interval = Math.floor(seconds / 2592000);
  if (interval > 1) {
    return interval + " months";
  }
  interval = Math.floor(seconds / 86400);
  if (interval > 1) {
    return interval + " days";
  }
  interval = Math.floor(seconds / 3600);
  if (interval > 1) {
    return interval + " hours";
  }
  interval = Math.floor(seconds / 60);
  if (interval > 1) {
    return interval + " minutes";
  }
  return Math.floor(seconds) + " seconds";
}

function sortCommentsByScore (comments) {
  console.log('sorting comments', comments)
  return comments.sort(commentSort)
}

function commentSort(a,b) {
  if (a.vote_count > b.vote_count)
    return -1;
  if (a.vote_count < b.vote_count)
    return 1;
  return 0;
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

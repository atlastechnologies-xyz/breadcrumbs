Current Feature List

# Breadcrumbs Chrome Extension:

This chrome extension allows users to access the core network and easily see which content has been flagged as incorrect by experts while browsing online. 

To install the extension, open `chrome://extensions/` in a chrome and then select 'load unpacked extension' to load the extension into your browser. This version just uses the 'sample data' set shown in background.js. Future versions will pull the data set down from the server to verify them.

# Feature List
## Popup 
Most of the popup functionality will be essentially buttons which open a new tab of the website for the user 

- Star / Upvote Current Page -> New tab on website
- Report / Flag Current Page -> New tab on website 
- More Info Re: Current Page -> New tab on website for the full information page showing all previous and current flags on the page
- Login - See API Call
- Logout - Clears chrome.storage.~userSession 
- Settings / Account -> Choose filters, login / logout
- Leave a Breadcrumb -> Adds a comment to the current URL (can be nested)

## Right Click
- Report / Flag (Current Selection) -> New tab on website showing the Report / Flag form with autofilled information. Users can report a link or a section of text from the page. 
- Star (Current URL) -> See API Calls

## Icon
The icon of the plugin should respond to the current URL of the page as a user browses. 

- Number in top right corner to indicate total flags (regardless of status)
- Changes colour to indicate current status of URL 
- Blue -> Partner Organization 
- White -> No Current Ranking (Can have appealed flags, but the domain cannot have a single banned url)
- Yellow -> Current URL has at least one open flag, or the domain has a banned page
- Red -> This page has an unresolved flag or this domain has more than 10 banned pages

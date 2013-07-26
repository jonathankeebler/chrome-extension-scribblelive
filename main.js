var ThreadId = null;

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.

	if( sender == null || sender.tab == null ) return;
	
	
    chrome.pageAction.show(sender.tab.id);
	if( PollForUpdates != null )
	{
		chrome.pageAction.setIcon( { tabId:sender.tab.id, path:"favicon.png" } );
	}
	else if( request.ThreadId )
	{
		chrome.pageAction.setIcon( { tabId:sender.tab.id, path:"favicon-grey.png" } );
		ThreadId = request.ThreadId;
	}
	else
	{
		chrome.pageAction.hide( sender.tab.id );
	}


  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};



// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

var PollForUpdates = null;
var LastId = null;
chrome.pageAction.onClicked.addListener( function(tab)
{
	//chrome.pageAction.setPopup( { tabId: tab.id, popup:"index.html" });
	
	if( PollForUpdates != null )
	{
		clearInterval( PollForUpdates );
		PollForUpdates = null;
		LastId = null;
		chrome.pageAction.setIcon( { tabId:tab.id, path:"favicon-grey.png" } );
		return;
	}
	chrome.pageAction.setIcon( { tabId:tab.id, path:"favicon.png" } );
	clearInterval( PollForUpdates );
	PollForUpdates = null;
	LastId = null;
	
	CheckForNewPost(tab);
	PollForUpdates = setInterval( CheckForNewPost, 10000 );
	
});

function CheckForNewPost( tab )
{
	var xhr = new XMLHttpRequest();
	xhr.open("GET", "http://apiv1.scribblelive.com/event/" + ThreadId + "/all?Token=4tWkUYDn&format=json&Max=1&Order=desc", true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // JSON.parse does not evaluate the attacker's scripts.
	    var resp = JSON.parse(xhr.responseText);

		if( resp.Posts.length > 0 && resp.Posts[0].Id != LastId )
		{
			LastId = resp.Posts[0].Id;
			
			var Icon = "favicon.png";
			if( resp.Posts[0].Creator.Avatar )
			{
				Icon = resp.Posts[0].Creator.Avatar;
			}
			
			if( resp.Posts[0].Type == "IMAGE" )
			{
				Icon = resp.Posts[0].Media[0].Url;
			}
			
			var Content = resp.Posts[0].Content.replace( /<.*?>/g, "" );

			if( /^\s*$/.test( Content ) )
			{
				Content = resp.Posts[0].Type;
			}
			
			var notification = window.webkitNotifications.createNotification(
			      Icon, resp.Posts[0].Creator.Name,
			      Content
			);
			
			if( resp.Websites.length > 0 )
			{
			
				notification.onclick  = function()
				{
					var newURL = resp.Websites[0].Url + "/" + resp.Posts[0].Id;
					  chrome.tabs.create({ url: newURL });
				}
				  notification.show();
			}
		}
	  }
	}
	xhr.send();


}

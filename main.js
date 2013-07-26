var ThreadId = null;
var LastModified = null;

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
		LastModified = null;
		chrome.pageAction.setIcon( { tabId:tab.id, path:"favicon-grey.png" } );
		return;
	}
	chrome.pageAction.setIcon( { tabId:tab.id, path:"favicon.png" } );
	clearInterval( PollForUpdates );
	PollForUpdates = null;
	LastId = null;
	LastModified = null;
	
	CheckForNewPost(tab);
	PollForUpdates = setInterval( CheckForNewPost, 30000 );
	
});

function CheckForNewPost( tab )
{
	var xhr = new XMLHttpRequest();

	var Max = 1;
	if( !LastId )
	{
		Max = 5;
	}

	xhr.open("GET", "http://apiv1.scribblelive.com/event/" + ThreadId 
		+ "/all?Token=4tWkUYDn&format=json&Max=" + Max + "&Order=desc"
		+ ( LastModified ? "&Since=" + LastModified : "" )
		, true);
	xhr.onreadystatechange = function() {
	  if (xhr.readyState == 4) {
	    // JSON.parse does not evaluate the attacker's scripts.
	    var resp = JSON.parse(xhr.responseText);

		if( resp.Posts.length > 0 )
		{
			var i = 0;
			while( i < resp.Posts.length )
			{
				if( resp.Posts[i].Id != LastId && resp.Posts[i].IsDeleted == "0" )
				{
					LastId = resp.Posts[i].Id;

					PostCreationDate = new Date( 1000 + parseInt( resp.Posts[i].LastModified.replace(/\+0000/, "").replace(/[^0-9]/g, "") ) );

					LastModified = PostCreationDate.getUTCFullYear() + "/" + ( PostCreationDate.getUTCMonth() + 1) 
						+ "/" + PostCreationDate.getUTCDate() + " " + PostCreationDate.getUTCHours() + ":" 
						+ PostCreationDate.getUTCMinutes() + ":" + PostCreationDate.getUTCSeconds();

					
					var Icon = "favicon.png";
					if( resp.Posts[i].Creator.Avatar )
					{
						Icon = resp.Posts[i].Creator.Avatar;
					}
					
					if( resp.Posts[i].Type == "IMAGE" )
					{
						Icon = resp.Posts[i].Media[0].Url;
					}
					
					var Content = resp.Posts[i].Content.replace( /<.*?>/g, "" );

					if( /^\s*$/.test( Content ) )
					{
						Content = resp.Posts[i].Type;
					}
					
					var notification = window.webkitNotifications.createNotification(
					      Icon, resp.Posts[i].Creator.Name,
					      Content
					);
					
					if( resp.Websites && resp.Websites.length > 0 )
					{
					
						notification.onclick  = function()
						{
							var newURL = resp.Websites[0].Url + "/" + resp.Posts[i].Id;
							  chrome.tabs.create({ url: newURL });
						}
						  
					}
					
					notification.show();
					break;
				}
				i++;
			}
		}
	  }
	}
	xhr.send();


}

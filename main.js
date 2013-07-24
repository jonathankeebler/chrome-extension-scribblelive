/*
chrome.app.runtime.onLaunched.addListener(function() {
  

var i = 0;
	setInterval( function()
	{
		var notification = window.webkitNotifications.createNotification(
		      'scribblelivelogo.png', 'Push Message',
		      "Push message for you! " + i++
		);
		  notification.show();
	}, 5000 );

});
*/

// Copyright (c) 2012 The Chromium Authors. All rights reserved.
// Use of this source code is governed by a BSD-style license that can be
// found in the LICENSE file.

// Called when a message is passed.  We assume that the content script
// wants to show the page action.
function onRequest(request, sender, sendResponse) {
  // Show the page action for the tab that the sender (content script)
  // was on.
  chrome.pageAction.show(sender.tab.id);


  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};


// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

chrome.pageAction.onClicked.addListener( function(tab)
{
	
	
	setTimeout( function()
	{
		var xhr = new XMLHttpRequest();
		xhr.open("GET", "http://apiv1.scribblelive.com/event/39048/page/last?Token=3pNSLEAs&format=json", true);
		xhr.onreadystatechange = function() {
		  if (xhr.readyState == 4) {
		    // JSON.parse does not evaluate the attacker's scripts.
		    var resp = JSON.parse(xhr.responseText);
		
			var notification = window.webkitNotifications.createNotification(
			      'favicon.png', resp.Posts[0].Creator.Name,
			      resp.Posts[0].Content.replace( /<.*?>/, "" )
			);
			notification.onclick  = function()
			{
				var newURL = "http://live.blog.scribblelive.com/Event/The_ScribbleLive_Daily/" + resp.Posts[0].Id;
				  chrome.tabs.create({ url: newURL });
			}
			  notification.show();
		  }
		}
		xhr.send();
		
		
	}, 5000 );
});

/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
/*
chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 170;
  var height = 300;

  chrome.app.window.create('index.html', {
    bounds: {
      width: width,
      height: height,
      left: Math.round((screenWidth-width)/2),
      top: Math.round((screenHeight-height)/2)
    }
  });


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

	
	chrome.pageAction.onClicked.addListener( function(tab)
	{
		var notification = webkitNotifications.createNotification(
		      'favicon.png', 'ScribbleLive',
		      "It's true!"
		);
		  notification.show();
	});

  // Return nothing to let the connection be cleaned up.
  sendResponse({});
};

// Listen for the content script to send a message to the background page.
chrome.extension.onRequest.addListener(onRequest);

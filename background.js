/**
 * Listens for the app launching then creates the window
 *
 * @see http://developer.chrome.com/trunk/apps/app.runtime.html
 * @see http://developer.chrome.com/trunk/apps/app.window.html
 */
chrome.app.runtime.onLaunched.addListener(function() {
  // Center window on screen.
  var screenWidth = screen.availWidth;
  var screenHeight = screen.availHeight;
  var width = 170;
  var height = 300;

/*
  chrome.app.window.create('index.html', {
    bounds: {
      width: width,
      height: height,
      left: Math.round((screenWidth-width)/2),
      top: Math.round((screenHeight-height)/2)
    }
  });
*/

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

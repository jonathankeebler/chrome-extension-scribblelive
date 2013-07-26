/*
 * Copyright (c) 2010 The Chromium Authors. All rights reserved.  Use of this
 * source code is governed by a BSD-style license that can be found in the
 * LICENSE file.
 */
var regex = /(var ThreadId = "([0-9]+)";|embed\.scribblelive\.com\/Embed\/v5\.aspx\?Id=([0-9]+))/i;

var ThreadId = null;
var Match = document.documentElement.innerHTML.match(regex);
if( Match )
{
	if( Match[2] )
	{
		ThreadId = Match[2];
	}
	else if( Match[3] )
	{
		ThreadId = Match[3];
	}
}
chrome.extension.sendRequest({ ThreadId:ThreadId}, function(response) {});

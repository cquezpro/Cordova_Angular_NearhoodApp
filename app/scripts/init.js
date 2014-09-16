/* global pgApp, ga_storage */
pgApp.initialize();
ga_storage._setAccount('UA-34806316-2');
ga_storage._setDomain('none');
ga_storage._enableSSL();
ga_storage._trackPageview('/index.html');

function onDeviceReady() {
	StatusBar.overlaysWebView(false);    
    StatusBar.backgroundColorByHexString("#ffffff");
}

document.addEventListener("deviceready", onDeviceReady, false);
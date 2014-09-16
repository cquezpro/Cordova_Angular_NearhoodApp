/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */
var pgApp = {
    // Application Constructor
    initialize: function() {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function() {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicity call 'app.receivedEvent(...);'
    onDeviceReady: function() {
        console.log("deviceReady");
        navigator.splashscreen.hide();        
        // angular.element(document).ready(function() {
        //     angular.bootstrap(document, ['nearhoodApp']);
        //     console.log("Angular bootstrapped");
        // });
        document.addEventListener("menubutton", pgApp.handleDeviceMenuButton, false);
        document.addEventListener("backbutton", pgApp.handleDeviceBackButton, false);        
    },
    
    handleDeviceMenuButton: function () {
        // var menu = document.getElementById('sideMenu');
        // var scope = angular.element(menu).scope();
        // if (!scope.modal.visible) {
        // 	angular.element(menu).scope().toggleMenu();
        // 	angular.element(menu).scope().$apply();
        // }
    },
    
    handleDeviceBackButton: function (e) {
        console.log("backButton");
     //    var menu = document.getElementById('sideMenu');
     //    var messages;
     //    var scope = angular.element(menu).scope();
     //    var messagesScope;
        
     //    console.log(scope.params.view);

     //    if (scope.params.view == "messages") {
     //        messages = document.getElementById('messages');
     //        messagesScope = angular.element(messages).scope();
     //        console.log(messagesScope.params.context);
     //    }
    	// if (scope.modal.visible && (scope.params.view !== 'welcome')) {
    	//     e.preventDefault();
    	//     scope.closeModal('cancel'); // close modal
    	//     scope.$apply();
    	//     return false;
    	// } else if ((scope.params.view == "messages") && (scope.params.type == "all") && (messagesScope.params.context !== 'more_from_same')) {
     //    	//frontpage, exiting
    	//     navigator.app.exitApp(); 
    	// } else if ((scope.params.view == "messages") && (scope.params.type == "all") && (messagesScope.params.context == 'more_from_same')) {
    	//     //messagebundle opened, call back-function in messages controller
     //    	messagesScope.backToPrev();
     //    	messagesScope.$apply();
    	// } else if ((scope.params.view == "welcome") && !scope.welcome.welcomeShown) {
     //    	//start view, exiting
    	//     navigator.app.exitApp();
     //    } else if ((scope.params.view == "welcome") && scope.welcome.welcomeShown) {
     //        //service info opened from settings view, just close it via the function in welcome-controller
     //        var scopeWelcome = angular.element(document.getElementById('welcome')).scope();
     //        scopeWelcome.close();
     //        scopeWelcome.$apply()
    	// } else {
    	//     e.preventDefault();    	
    	//     history.back(); // just go back
    	//     return false;
    	// }
    },
    
};


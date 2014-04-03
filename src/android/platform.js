/*
 *
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 *   http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 *
*/

module.exports = {
    id: 'android',
    bootstrap: function() {
        var channel = require('cordova/channel'),
            cordova = require('cordova'),
            exec = require('cordova/exec'),
            modulemapper = require('cordova/modulemapper');

        // Tell the native code that a page change has occurred.
        exec(null, null, 'PluginManager', 'startup', []);
        // Tell the JS that the native side is ready.
        channel.onNativeReady.fire();

        // TODO: Extract this as a proper plugin.
        modulemapper.clobbers('cordova/plugin/android/app', 'navigator.app');
        modulemapper.clobbers('xFace/xapp', 'xFace.app');

        // Inject a listener for the backbutton on the document.
        var backButtonChannel = cordova.addDocumentEventHandler('backbutton');
        backButtonChannel.onHasSubscribersChange = function() {
            // If we just attached the first handler or detached the last handler,
            // let native know we need to override the back button.
            exec(null, null, "App", "overrideBackbutton", [this.numHandlers == 1]);
        };

        // Add hardware MENU and SEARCH button handlers
        cordova.addDocumentEventHandler('menubutton');
        cordova.addDocumentEventHandler('searchbutton');
        /**
         * 当短信到来时，会触发该事件（Android）<br/>
         * @example
                function onMessageReceived(msgs) {
                    alert("短信长度：" + msgs.length);
                }
                document.addEventListener("messagereceived", onMessageReceived, false);
         * @event messagereceived
         * @for BaseEvent
         * @param {xFace.Message[]} msgs 接收到的短信的数组
         * @platform Android
         * @since 3.0.0
         */
        channel.onMsgReceived = cordova.addDocumentEventHandler('messagereceived');
        /**
         * 当电话呼入时，会触发该事件（Android）<br/>
         * @example
                function onCallReceived(callStatus) {
                    //callStatus是字符串需要转换成整形
                    var callStatus = parseInt(CallStatus);
                    switch(callStatus){
                    case 0:
                        alert("无状态(挂断)");
                        break;
                    case 1:
                        alert("电话呼入，响铃中");
                        break;
                    case 2:
                        alert("接听电话。。。。");
                        break;
                }
                document.addEventListener("callreceived", onCallReceived, false);
         * @event callreceived
         * @for BaseEvent
         * @param {String} CallStatus 接入状态信息.<br/>
         *            0：无状态 （挂断）<br/>
         *            1：电话拨入，响铃中<br/>
         *            2：接听中
         * @platform Android
         * @since 3.0.0
         */
        channel.onCallReceived = cordova.addDocumentEventHandler('callreceived');

        // Let native code know we are all done on the JS side.
        // Native code will then un-hide the WebView.
        channel.onCordovaReady.subscribe(function() {
            exec(null, null, "App", "show", []);
        });
    }
};

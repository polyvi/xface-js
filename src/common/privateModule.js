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

/**
 * 该模块是私有模块，用于获取当前应用程序的ID等
 */
var channel = require('cordova/channel');
var currentAppId = null;        //当前应用ID
var currentAppWorkspace = null; //当前应用工作空间
var appData = null;             //传递给应用的启动参数

var privateModule = function() {
};

/**
 * 由引擎初始化数据
 */
privateModule.prototype.initPrivateData = function(initData) {
    currentAppId = initData[0];
    currentAppWorkspace = initData[1];
    appData = initData[2];
    channel.onPrivateDataReady.fire();
};

privateModule.prototype.appId = function() {
    return currentAppId;
};

privateModule.prototype.appWorkspace = function() {
    return currentAppWorkspace;
};

privateModule.prototype.appData = function() {
    return appData;
};

module.exports = new privateModule();

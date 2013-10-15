/*
 *
 * This file was modified from or inspired by Apache Cordova.
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
 * 该模块用于处理web app workspace相关的逻辑
 */
var privateModule = require('xFace/privateModule'),
    urlUtil = require("cordova/urlutil");

var Workspace= function() {
};

Workspace.prototype.updateFileSystemRoot = function(type, fs){
    if (type != 1 || !module.exports.enableWorkspaceCheck) {
        return;
    }
    fs.root.fullPath = privateModule.appWorkspace();
};

//TODO:迁移strStartsWith类似方法到独立的js模块
Workspace.prototype.strStartsWith = function(str, prefix) {
    return str.indexOf(prefix) === 0;
};

Workspace.prototype.strEndsWith = function(str, suffix) {
    return str.indexOf(suffix, str.length - suffix.length) !== -1;
};

Workspace.prototype.toURL = function(path) {
    return "file://localhost" + path;
};

Workspace.prototype.toPath = function(url) {
    // path为"file://localhost/user/..", 不同的平台执行urlUtil.makeAbsolute(path)后,返回的url可能有以下形式：
    // 1）file://localhost/user/..
    // 2）file:///user/..
    if(this.strStartsWith(url, 'file://localhost')) {
        return url.replace('file://localhost', '');
    } else if(-1 != url.indexOf("://")) {
        //remove scheme(e.g., file://)
        return url.substring(url.indexOf("://") + 3, url.length);
    } else {
        // Don't log when running unit tests.
        if (typeof jasmine == 'undefined') {
            console.log(url + ' is not an url!');
        }
        return url;
    }
};

Workspace.prototype.isAbsolutePath = function(path){
    // FIXME:Confirm this is right on all platforms
    // Absolute path starts with a slash
    return this.strStartsWith(path, '/');
};

Workspace.prototype.resolvePath = function(path){
    var result = this.toURL(path);
    result = urlUtil.makeAbsolute(result);
    result = decodeURI(result);
    result = this.toPath(result);

    return result;
};

Workspace.prototype.checkWorkspace = function(basePath, relativePath, functionName) {
    if (!module.exports.enableWorkspaceCheck) {
        return true;
    }

    var result = null;
    result = relativePath.replace(/\\/g,'/');

    var isAbs = this.isAbsolutePath(result);
    if (isAbs){
        // relativePath为绝对路径且包含'..'时，对其进行resolve
        if(-1 != result.indexOf('..')){
            result = this.resolvePath(result);
        }
    }else{
        // relativePath为相对路径时，对其进行resolve
        if(this.strStartsWith(relativePath, '/')){
            result = basePath + relativePath;
        }else{
            result = basePath + '/' + relativePath;
        }
        result = this.resolvePath(result);
    }

    if (this.strStartsWith(result, basePath)){
        return true;
    }else{
        // Don't log when running unit tests.
        if (typeof jasmine == 'undefined') {
            console.error(functionName + " check workspace failed:" + result);
        }
        return false;
    }
};

module.exports = new Workspace();
module.exports.enableWorkspaceCheck = true;

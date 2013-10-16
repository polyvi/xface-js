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

Workspace.prototype.buildPath = function(aString, bString){
    var path = null;
    if(this.strEndsWith(aString, '/')){
        path = aString + bString;
    }else{
        path = aString + '/' + bString;
    }
    return path;
};

Workspace.prototype.resolvePath = function(path){
    var result = this.toURL(path);
    result = urlUtil.makeAbsolute(result);
    result = decodeURI(result);
    result = this.toPath(result);

    return result;
};

/**
 * 检查workspace
 *
 * workspace检查逻辑如下：
 * 1）当enableWorkspaceCheck为false时，直接返回relativePath
 * 2）iOS平台，当relativePath包含'assets-library://'前缀时，直接返回relativePath
 * 3）根据basePath对relativePath进行resolve,如果resolved结果以'basePath'为前缀，返回resolved结果，否则返回null
 * @return 满足workspace检查条件，返回非空串；否则，返回null
 */
Workspace.prototype.checkWorkspace = function(basePath, relativePath, functionName) {
    if (!module.exports.enableWorkspaceCheck) {
        return relativePath;
    }

    if('ios' === require('cordova/platform').id){
        if(this.strStartsWith(relativePath, 'assets-library://')){
            return relativePath;
        }
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
        result = this.buildPath(basePath, result);
        result = this.resolvePath(result);
    }

    if (this.strStartsWith(result, basePath)){
        return result;
    }else{
        // Don't log when running unit tests.
        if (typeof jasmine == 'undefined') {
            console.error(functionName + " check workspace failed:" + result);
        }
        return null;
    }
};

module.exports = new Workspace();
module.exports.enableWorkspaceCheck = true;

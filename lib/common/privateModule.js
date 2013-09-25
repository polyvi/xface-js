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
 * TODO:此模块需要重构，迁移path等方法到utils中
 */
//该变量用于保存当前应用的ID
var currentAppId = null;
var appData = null;
var currentAppWorkspace = null;
var privateModule = function() {
};

/**
 * 由引擎初始化数据
 */
privateModule.prototype.initPrivateData = function(initData) {
    currentAppId = initData[0];
    currentAppWorkspace = initData[1];
    appData = initData[2];
};

privateModule.prototype.getAppId = function() {
    return currentAppId;
};

privateModule.prototype.appData = function() {
    return appData;
};
       
privateModule.prototype.currentAppWorkspace = function() {
    return currentAppWorkspace;
};
       
privateModule.prototype.updateFileSystemRoot = function(type, fs){
    if (type != 1 || !module.exports.enableChecksWorkspace) {
        return;
    }
    fs.root.fullPath = currentAppWorkspace;
};

privateModule.prototype.strStartsWith = function(str, prefix) {
    return str.indexOf(prefix) === 0;
};
       
privateModule.prototype.strEndsWith = function(str, suffix) {
    return str.match(suffix+"$")==suffix;
};
       
privateModule.prototype.resolve = function(path) {
    var parts = path.split('/');
    var i = 1;
    while (i < parts.length) {
        if(i === 0){
            i++;
        }
        // if current part is `..` and previous part is different, remove both of them
        if (parts[i] === '..' && parts[i-1] !== '..') {
            parts.splice(i-1, 2);
            i -= 2;
        }
        i++;
    }
    if(path.split('/').length > 1 && parts.length == 1){
        return parts[0] + '/';
    }else{
        return parts.join('/');
    }
};
       
privateModule.prototype.checkPath = function(functionName, basePath, relativePath) {
    if (!module.exports.enableChecksWorkspace) {
        return true;
    }
    relativePath = relativePath.replace(/\\/g,'/');
    if (this.strStartsWith(relativePath, basePath)){
        return true;
    }
       
    var result = null;
    if(this.strStartsWith(relativePath, '/')){
        result = basePath + relativePath;
    }else{
        result = basePath + '/' + relativePath;
    }
    result = this.resolve(result);
              
    if (this.strStartsWith(result, basePath)){
        return true;
    }else{
        console.error(functionName + "check path failed:" + result);
        return false;
    }
};

module.exports = new privateModule();
module.exports.enableChecksWorkspace = true;
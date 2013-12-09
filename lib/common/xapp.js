
/*
 This file was modified from or inspired by Apache Cordova.

 Licensed to the Apache Software Foundation (ASF) under one
 or more contributor license agreements. See the NOTICE file
 distributed with this work for additional information
 regarding copyright ownership. The ASF licenses this file
 to you under the Apache License, Version 2.0 (the
 "License"); you may not use this file except in compliance
 with the License. You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

 Unless required by applicable law or agreed to in writing,
 software distributed under the License is distributed on an
 "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 KIND, either express or implied. See the License for the
 specific language governing permissions and limitations
 under the License.
*/

/**
 * @module app
 */
var exec = require('cordova/exec');

var app =
{
    /**
     * 关闭当前应用app（Android, iOS, WP8）
     * 如果当前只有一个app,在android/WP8平台上则退出xFace;在iOS平台上由于系统限制不退出xFace!!
     * @example
            xFace.app.close();
     * @method close
     * @platform Android, iOS, WP8
     * @since 3.0.0
     */
    close:function() {
        require('xFace/plugin/privateModule').execCommand("xFace_close_application:", []);
    }
};
module.exports = app;

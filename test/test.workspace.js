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

describe('workspace', function () {
    var workspace = require('xFace/workspace');

    it("workspace.spec.1 should have the following properties", function() {
        expect(workspace.enableWorkspaceCheck).toBeDefined();
        expect(typeof workspace.enableWorkspaceCheck == 'boolean').toBe(true);
        expect(workspace.enableWorkspaceCheck).toBe(true);
    });

    it("workspace.spec.2 should have the following methods", function() {
        expect(typeof workspace.updateFileSystemRoot).toBe('function');
        expect(typeof workspace.strStartsWith).toBe('function');
        expect(typeof workspace.strEndsWith).toBe('function');
        expect(typeof workspace.toURL).toBe('function');
        expect(typeof workspace.toPath).toBe('function');
        expect(typeof workspace.isAbsolutePath).toBe('function');
        expect(typeof workspace.resolvePath).toBe('function');
        expect(typeof workspace.checkWorkspace).toBe('function');
    });

    it("workspace.spec.3 test strStartsWith with true results", function() {
         expect(workspace.strStartsWith(' ', ' ')).toBe(true);
         expect(workspace.strStartsWith(' ', '')).toBe(true);
         expect(workspace.strStartsWith('/user/apps/app', '/')).toBe(true);
         expect(workspace.strStartsWith('\\user/apps/app', '\\')).toBe(true);
         expect(workspace.strStartsWith('/user/apps/app', '/user')).toBe(true);
         expect(workspace.strStartsWith('/user/apps/app', '/user/apps/app')).toBe(true);
         expect(workspace.strStartsWith('/user/apps/app/../../', '/user/apps/app')).toBe(true);
         expect(workspace.strStartsWith('/user/../apps/app/../../', '/user/../apps')).toBe(true);
         expect(workspace.strStartsWith('/user/..\\apps/app/../../', '/user/..\\apps')).toBe(true);
    });

    it("workspace.spec.4 test strStartsWith with false results", function() {
         expect(workspace.strStartsWith(' ', '  ')).toBe(false);
         expect(workspace.strStartsWith('/user/apps/app', '\\')).toBe(false);
         expect(workspace.strStartsWith('/user/apps/app', '/apps/app')).toBe(false);
         expect(workspace.strStartsWith(' /user/apps/app', '/user/apps')).toBe(false);
         expect(workspace.strStartsWith('/user/apps/app', ' /user/apps')).toBe(false);
         expect(workspace.strStartsWith('/user/..\\apps/app', '/user/../apps')).toBe(false);
    });

    it("workspace.spec.5 test strEndsWith with true results", function() {
         expect(workspace.strEndsWith(' ', ' ')).toBe(true);
         expect(workspace.strEndsWith('/user/apps/app', 'p')).toBe(true);
         expect(workspace.strEndsWith('/user/apps/app\\', '/apps/app\\')).toBe(true);
         expect(workspace.strEndsWith('/user/apps/app', '/user/apps/app')).toBe(true);
         expect(workspace.strEndsWith('  /user/apps/app  ', '/user/apps/app  ')).toBe(true);
         expect(workspace.strEndsWith('/user/..\\apps/app', '/user/..\\apps/app')).toBe(true);
    });

    it("workspace.spec.6 test strEndsWith with false results", function() {
         expect(workspace.strEndsWith(' ', '  ')).toBe(false);
         expect(workspace.strEndsWith('/user/apps/app', '\\')).toBe(false);
         expect(workspace.strEndsWith(' /user/apps/app  ', ' /user/apps/')).toBe(false);
         expect(workspace.strEndsWith('/user/apps/app', ' /user/apps')).toBe(false);
         expect(workspace.strEndsWith('/user/..\\apps/app', '/user/../apps/app')).toBe(false);
    });

    it("workspace.spec.7 test toURL", function() {
         expect(workspace.toURL('')).toBe('file://localhost');
         expect(workspace.toURL(' ')).toBe('file://localhost ');
         expect(workspace.toURL('/user/apps/appId/workspace')).toBe('file://localhost/user/apps/appId/workspace');
         expect(workspace.toURL('user/apps/appId/workspace')).toBe('file://localhostuser/apps/appId/workspace');
    });

    it("workspace.spec.8 test toPath", function() {
         expect(workspace.toPath('')).toBe('');
         expect(workspace.toPath(' ')).toBe(' ');
         expect(workspace.toPath('/user/apps/appId/workspace')).toBe('/user/apps/appId/workspace');
         expect(workspace.toPath('user/apps/appId/workspace')).toBe('user/apps/appId/workspace');
         expect(workspace.toPath('file://localhost/user/apps/appId/workspace')).toBe('/user/apps/appId/workspace');
         expect(workspace.toPath('file://localhostuser/apps/appId/workspace')).toBe('user/apps/appId/workspace');
         expect(workspace.toPath('file:///user/apps/appId/workspace')).toBe('/user/apps/appId/workspace');
    });

    it("workspace.spec.9 test checkWorkspace with true results", function() {
         var basePath = '/user/apps/appId/workspace';
         expect(workspace.checkWorkspace(basePath, '')).toBe(true);
         expect(workspace.checkWorkspace(basePath, '  ')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'a/d')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'a/b/css/../../d')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'a/b/c.ss/../../d')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'a/b/css/../..')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'ad/c.ss/../..')).toBe(true);
         expect(workspace.checkWorkspace(basePath, '/user/apps/appId/workspace')).toBe(true);
         expect(workspace.checkWorkspace(basePath, '/user/apps/appId/workspace/download')).toBe(true);
         expect(workspace.checkWorkspace(basePath, '/user/apps/appId/workspace/download/../data')).toBe(true);
         basePath = 'user/apps/appId/workspace/';
         expect(workspace.checkWorkspace(basePath, 'a/b/c.ss/../../d')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'a/b/css/../..')).toBe(true);
         expect(workspace.checkWorkspace(basePath, 'ad/c.ss/../..')).toBe(true);
    });

    it("workspace.spec.10 test checkWorkspace with false results", function() {
         var basePath = '/user/apps/appId/workspace';
         expect(workspace.checkWorkspace(basePath, 'a/bss/../../../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '../../../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '../../a/bss/../../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, 'd/../../a/bss/../../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '../a.c/../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '../e/ad/c.ss/')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '/user/apps/')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '/a/b/css/../../d')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '\\a/b/css/../../d')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '/user/apps2/appId/workspace')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '/user/apps/appId/workspace/../')).toBe(false);
         expect(workspace.checkWorkspace(basePath, '/user/apps/appId/workspace/download/../../data')).toBe(false);
    });
});

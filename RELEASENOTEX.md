

## 3.2.0-rc3 (Fri Feb 28 2014)


 *  Set VERSION to 3.2.0-rc3 (via xsrc)
 *  Append trailing new line character to xface.js
 *  Fixed failed browser tests
 *  Fixed failed auto tests.
 *  CB-5671 setTimeout to allow concat'ed JS to load before pluginLoader.load()
 *  CB-5671 Don't fail plugin loading if plugin modules are already loaded.
 *  [iOS] Since js_core is located under Library, update the js path.
 *  Remove 'xFace/workspace' module
 *  CB-5438 Use jsdom-nogyp to avoid dependency on python & visual studio
 *  Add back "grunt btest" command
 *  Move all deps into devDependencies.
 *  CB-5438 Remove test symlinks & fix some build errors on windows.
 *  CB-6007 Fix findCordovaPath() not working when path contains a query param
 *  Update exec.js
 *  CB-5973 blackberry: use sync by default
 *  Since local symlinks have been excluded from jshint, revert workaround for reading symbolic links on Windows.
 *  CB-5973 blackberry: add support for sync exec
 *  CB-5438 Exclude local symlinks from jshint
 *  fixes CB-5806 [Windows8] Add keepCallback support to proxy

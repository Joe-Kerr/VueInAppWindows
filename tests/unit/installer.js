const assert = require("assert");
const sinon = require("sinon");
const {installer, inAppWindow, inAppWindowContainer} = require("../../src/index.js");
const {backupWindowContainer, restoreWindowContainer} = require("../unit_fix/common.js");

suite("index.js (installer)");

beforeEach(()=>{
	backupWindowContainer(inAppWindowContainer);
	inAppWindowContainer.install = new sinon.fake();
	
	installer.install({version: "2.6"}, {
		vuex: {dispatch:()=>{}, registerModule: ()=>{}}, storeNamespace: "override1", componentNamespace: "override2", windows: ["a", "b"], headers: ["c", "d"]
	});	
});

afterEach(()=>{
	restoreWindowContainer(inAppWindowContainer);
	delete inAppWindow.$_inAppWindows_postInstall;
	delete inAppWindowContainer.$_inAppWindows_postInstall;	
});

test("installer provides expected public exports", ()=>{
	assert.notEqual(inAppWindow, undefined);
	assert.notEqual(inAppWindowContainer, undefined);
	assert.notEqual(installer, undefined);
});

test("installer provides expected private exports", ()=>{
	assert.ok("POSTINSTALL_OBJ_NAMESPACE" in require("../../src/index.js"));
});

test("installer writes object and store namespace to window component", ()=>{
	assert.ok("$_inAppWindows_postInstall" in inAppWindow);
	assert.equal(inAppWindow.$_inAppWindows_postInstall.namespace, "override1");
});

test("installer writes object namespace to window container", ()=>{
	assert.ok("$_inAppWindows_postInstall" in inAppWindowContainer);
	assert.deepEqual(inAppWindowContainer.$_inAppWindows_postInstall, {});
});

test("installer calls window container installer", ()=>{
	const call = inAppWindowContainer.install.lastCall.args;
	
	assert.deepEqual(call[0], ["a", "b"]);
	assert.deepEqual(call[1].headers, ["c", "d"]);
	assert.deepEqual(Object.keys(call[2]).sort(), ["postOptions", "postUser", "preUser", "store"]);
	
	assert.equal(call[2].store, "override1");
	assert.equal(call[2].preUser, "override2");
});
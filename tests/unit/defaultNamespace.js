const assert = require("assert");
const {installer, inAppWindow, inAppWindowContainer} = require("../../src/index.js");
const {backupWindowContainer, restoreWindowContainer} = require("../unit_fix/common.js");

suite("Default public namespaces");

test("ui/inappWindow.js: 'inAppWindows'", ()=>{
	assert.equal(inAppWindow.data().namespace, "inAppWindows");
});

test("ui/inappWindowContainer.js: 'inAppWindows'", ()=>{
	assert.equal(inAppWindowContainer.data().namespace, "inAppWindows");
});

test("index.js/installer: 'inAppWindows' and '$state'", ()=>{
	backupWindowContainer(inAppWindowContainer);
	
	const userWindow = {name: "test", $state: {id: "testWindow"}};
	installer.install({version: "2.6"}, {
		vuex: {dispatch:()=>{}, registerModule: ()=>{}}, windows: [userWindow]
	});
	
	assert.equal(userWindow.$_inAppWindows_postInstall, userWindow.$state, "Reads from default namespace $state on user window.");
	assert.equal(inAppWindow.$_inAppWindows_postInstall.namespace, "inAppWindows", "Writes default store namespace 'inAppWindows' to window component.");
	assert.equal(inAppWindowContainer.$_inAppWindows_postInstall.storeNamespace, "inAppWindows", "inAppWindows", "Writes default store namespace 'inAppWindows' to window container.");
	
	restoreWindowContainer(inAppWindowContainer);
	delete inAppWindow.$_inAppWindows_postInstall;
	delete inAppWindowContainer.$_inAppWindows_postInstall;
});
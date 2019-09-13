const assert = require("assert");
const sample = require("../../src/ui/inAppWindowContainer.js").default;

suite("ui/inappWindowContainer.js");

test("computed.listOfWindows returns filtered list of opened windows", ()=>{
	const windows = [{id: 1, opened: false}, {id: 2, opened: true}, {id: 3, opened: false}, {id: 4, opened: true}];
	const context = {namespace: "w", $store: {getters: {"w/windows": windows}}};
	
	const result = sample.computed.listOfWindows.call(context);
	assert.equal(result.length, 2);
	assert.equal(result[0].id, 2);
	assert.equal(result[1].id, 4);
});


test("methods.installNamespace writes namespace", ()=>{
	const context = {
		$options: {$_inAppWindows_postInstall: {storeNamespace: "user"}},
		namespace: "default"
	};
	
	assert.equal(sample.methods.installNamespace.call(context, "$_inAppWindows_postInstall"), true);	
	assert.equal(context.namespace, "user");
});

test("methods.installNamespace throws if namespace is undefined on $options", ()=>{
	const context = {
		$options: {cfgNs: {nope: "override"}},
		namespace: "default"
	};
	
	assert.throws(()=>{ sample.methods.installNamespace.call(context, "cfgNs") }, {message: /install namespace to window container/});
});


test("methods.installDefaultHeader dispatches defined default header", ()=>{
	const call = {count: 0, cmd: null, data: null};
	const context = {
		$store: {dispatch: (c, d)=>{call.count++; call.cmd=c; call.data=d;}}
	};
	
	assert.equal( sample.methods.installDefaultHeader.call(context, "theDefaultHeader", "namespace"), true );	
	assert.equal(call.count, 1);
	assert.equal(call.cmd, "namespace/setState");
	assert.equal(call.data.val, "theDefaultHeader");
	assert.equal( sample.methods.installDefaultHeader.call(context, undefined, "namespace"), false );
	assert.equal(call.count, 1);	
});

test("methods.installWindowsToStore dispatches, namespaced, user windows with at least names and ids", ()=>{
	const userWindows = [{$NS:{id:1}, name:"one"}, {$NS:{id:2, sth: "else"}, name:"two"}];
	const call = {count: 0, cmd: null, data: null};
	const context = {
		$store: {dispatch: (c, d)=>{call.count++; call.cmd=c; call.data=d;}}
	};
	
	sample.methods.installWindowsToStore.call(context, userWindows, "namespace", "$NS");
	assert.equal(call.count, 1);
	assert.equal(call.cmd, "namespace/init");
	assert.deepEqual(call.data.windows, [{id:1, name: "one"}, {id:2, name: "two", sth: "else"}]);	
});

test("methods.installWindowsToStore uses window name as id if id not provided", ()=>{
	const userWindows = [{$NS:{}, name:"one"}, {$NS:{id:2, sth: "else"}, name:"two"}];
	const call = {count: 0, cmd: null, data: null};
	const context = {
		$store: {dispatch: (c, d)=>{call.count++; call.cmd=c; call.data=d;}}
	};
	
	sample.methods.installWindowsToStore.call(context, userWindows, "namespace", "$NS");
	assert.equal(call.count, 1);
	assert.equal(call.cmd, "namespace/init");
	assert.deepEqual(call.data.windows, [{id:"one", name: "one"}, {id:2, name: "two", sth: "else"}]);	
});

test("methods.installWindowsToStore cleans up initial user data", ()=>{
	const userWindows = [{$NS:{id:1}, name:"one"}, {$NS:{id:2}, name:"two"}];
	const context = {
		$store: {dispatch: ()=>{}}
	};	
	sample.methods.installWindowsToStore.call(context, userWindows, "namespace", "$NS");
	assert.ok(!userWindows[0].hasOwnProperty("$NS"));
	assert.ok(!userWindows[1].hasOwnProperty("$NS"));
});

test("methods.postInstall runs install routines once", ()=>{
	let countInstallNamespace = 0;
	let countInstallDefaultHeader = 0;
	let countInstallWindowsToStore = 0;
	const context = {
		$options: {$_inAppWindows_postInstall: {init: false}},
		installNamespace: ()=>{countInstallNamespace++},
		installDefaultHeader: ()=>{countInstallDefaultHeader++},
		installWindowsToStore: ()=>{countInstallWindowsToStore++}
	};
	
	assert.equal( sample.methods.postInstall.call(context), true );
	assert.equal( sample.methods.postInstall.call(context), false );
	
	assert.equal(countInstallNamespace, 2);
	assert.equal(countInstallDefaultHeader, 1);
	assert.equal(countInstallWindowsToStore, 1);
});

test("methods.postInstall cleans up install routines", ()=>{
	const context = {
		$options: {$_inAppWindows_postInstall: {init: false, userWindows: null, postInstallComponentNamespace: null}},
		installNamespace: ()=>{},
		installDefaultHeader: ()=>{},
		installWindowsToStore: ()=>{}
	};
	
	sample.methods.postInstall.call(context);
	
	const o = context.$options.$_inAppWindows_postInstall;
	assert.equal(o.init, true);
	assert.equal("userWindows" in o, false);
	assert.equal("postInstallComponentNamespace" in o, false);
	assert.equal(Object.keys(o).length, 1);
});


test("created calls postInstall", ()=>{
	let callCount = 0;
	const context = {postInstall: ()=>{callCount++;}};
	sample.created.call(context);
	
	assert.equal(callCount, 1);
});

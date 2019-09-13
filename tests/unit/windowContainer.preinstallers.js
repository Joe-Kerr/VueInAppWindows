const assert = require("assert");
const sinon = require("sinon");
const sample = require("../../src/ui/inAppWindowContainer.js").default;

suite("ui/inappWindowContainer.js/preinstall methods");

test("installHeaders writes all header components to window component", ()=>{
	const winComp = {};
	const headers = [{name: "a"}, {name: "b"}];
	const result = sample.installHeaders(winComp, headers);
	assert.deepEqual(winComp, {components: {a: {name: "a"}, b: {name: "b"}}});	
});

test("installHeaders returns false early if no headers provided", ()=>{
	const winComp = {};
	const result = sample.installHeaders(winComp);
	
	assert.equal(result, false);
	assert.deepEqual(winComp, {});
});

test("installHeaders throws if user header does not have name property", ()=>{
	const winComp = {};
	const headers = [{noname: "a"}];
	assert.throws(()=>{ sample.installHeaders(winComp, headers); }, {message: /does not have a name/});	
});

test("installHeaders throws if duplicate names", ()=>{
	const winComp = {};
	const headers = [{name: "a"}, {name: "a"}];
	assert.throws(()=>{ sample.installHeaders(winComp, headers); }, {message: /Duplicate names/});	
}); 


test("installWindows extends base window component with user windows", ()=>{
	const w1 = {name: "w1"};
	const w2 = {name: "w2"};
	const base = {name: "base"};	
	sample.installWindows([w1, w2], base, null, null);
	
	assert.deepEqual(Object.keys(base.components).sort(), ["w1", "w2"]);
	assert.ok(!w1.hasOwnProperty("components"));
	assert.ok(!w2.hasOwnProperty("components"));
});

test("installWindows moves user provided data to internal namespace", ()=>{
	const w1 = {name: "w1", $state: {}};
	const w2 = {name: "w2"};
	const base = {name: "base"};

	sample.installWindows([w1, w2], base, "$state", "$moved");	
	assert.ok(!w1.hasOwnProperty("$state"));
	assert.ok(!w2.hasOwnProperty("$state"));	
	assert.ok(w1.hasOwnProperty("$moved"));
	assert.ok(w2.hasOwnProperty("$moved"));
});

test("installWindows sets object if no user data provided", ()=>{
	const w1 = {name: "w1", $state: {}};
	const w2 = {name: "w2"};
	const base = {name: "base"};
	
	sample.installWindows([w1, w2], base, "$state", "$empty");
	assert.equal(typeof w1.$empty, "object");
});

test("installWindows preserves existing components on base windows", ()=>{
	const w2 = {name: "w2"};
	const base = {name: "base", components: {header: {}}};
	sample.installWindows([w2], base, null, null);
	
	assert.deepEqual(Object.keys(base.components).sort(), ["header", "w2"]);	
});

test("installWindows throws if user window does not have name property", ()=>{
	const w1 = {noname: "w1"};
	const base = {name: "base"};
	assert.throws(()=>{ sample.installWindows([w1], base, null, null); }, {message: /does not have a name/});	
});

test("installWindows throws if duplicate names in user windows", ()=>{
	const w1 = {name: "w1"};
	const w2 = {name: "w1"};
	const base = {name: "base"};
	
	assert.throws(()=>{ sample.installWindows([w1, w2], base, null, null); }, {message: /Duplicate names/});	
});

test("installWindows throws if user windows not an array", ()=>{
	assert.throws(()=>{ sample.installWindows({}, null, null, null); }, {message: /not an array/});
	assert.throws(()=>{ sample.installWindows("123", null, null, null); }, {message: /not an array/});
	assert.throws(()=>{ sample.installWindows(123, null, null, null); }, {message: /not an array/});
	assert.throws(()=>{ sample.installWindows(()=>[], null, null, null); }, {message: /not an array/});
});

test("install extracts user windows", ()=>{
	const namespaces = {preUser: "$state", postUser: "$stateMov", postOptions: "$opts", store: "windows"};
	const context = {installHeaders: ()=>{}, installWindows: ()=>{}, install: ()=>{}, $opts: {}};
	sample.install.call(context, "fakeUserWindows", {headers: []}, namespaces);
	
	assert.equal(context.$opts.userWindows, "fakeUserWindows");
});

test("install saves component and store namespace names as well as init state", ()=>{
	const namespaces = {preUser: "$state", postUser: "$stateMov", postOptions: "$opts", store: "windows"};
	const context = {installHeaders: ()=>{}, installWindows: ()=>{}, install: ()=>{}, $opts: {}};
	sample.install.call(context, "fakeUserWindows", {headers: []}, namespaces);	
	
	assert.equal(context.$opts.postInstallComponentNamespace, "$stateMov");
	assert.equal(context.$opts.init, false);
	assert.equal(context.$opts.storeNamespace, "windows");
});

test("install calls sub installers", ()=>{
	const installHeaders = new sinon.fake();
	const installWindows = new sinon.fake();	
	const namespaces = {preUser: "$state", postUser: "$stateMov", postOptions: "$opts", store: "windows"};
	const context = {installHeaders, installWindows, install: ()=>{}, $opts: {}};
	sample.install.call(context, "fakeUserWindows", {headers: "fakeHeaders"}, namespaces);	
	
	assert.equal(installHeaders.callCount, 1);
	assert.ok("name" in installHeaders.lastCall.args[0]);
	assert.equal(installHeaders.lastCall.args[1], "fakeHeaders");
	
	assert.equal(installWindows.callCount, 1);
	assert.equal(installWindows.lastCall.args[0], "fakeUserWindows");
	assert.ok("name" in installWindows.lastCall.args[1]);
	assert.equal(installWindows.lastCall.args[2], "$state");
	assert.equal(installWindows.lastCall.args[3], "$stateMov");
});

test("install cleans up install functions", ()=>{
	const namespaces = {preUser: "$state", postUser: "$stateMov", postOptions: "$opts", store: "windows"};
	const context = {installHeaders: ()=>{}, installWindows: ()=>{}, install: ()=>{}, $opts: {}};
	sample.install.call(context, "fakeUserWindows", {headers: []}, namespaces);
	
	assert.ok(!context.hasOwnProperty("installHeaders"));
	assert.ok(!context.hasOwnProperty("installWindows"));
	assert.ok(!context.hasOwnProperty("install"));
});

test("install throws if being called before plugin installer set up config data", ()=>{
	const context = {missingNamespace: null};
	
	assert.throws(()=>{ sample.install.call(context, null, null, {postOptions: "nonExistingNamespace"}); }, {message: /Failed to install/});
});
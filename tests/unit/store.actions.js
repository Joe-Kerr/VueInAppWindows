const assert = require("assert");
const sinon = require("sinon");
const master = require("../../src/store/windows.js").default;
const {writeMockWindowDataToSStoretate} = require("../unit_fix/common.js");
const sample = {};

Object.assign(sample, master);
sample.state = JSON.parse(JSON.stringify(master.state));

suite("store/windows.js/actions");

sample.dispatch = ()=>{};
let commitCallCount = 0;
sample.commit = (cmd, data)=>{commitCallCount++; sample.mutations[cmd](sample.state, data)};

beforeEach(()=>{
	writeMockWindowDataToSStoretate(sample.state);
	commitCallCount = 0;
});


test("actions.open sets window as active by string", ()=>{
	sample.actions.open(sample, "unitTestWindow");
	assert.equal(sample.state.windows[0].opened, true);
});

test("actions.open sets window as active by id/context", ()=>{
	sample.actions.open(sample, {id: "unitTestWindow", context: "unitTest"});
	assert.equal(sample.state.windows[0].opened, true);
	assert.equal(sample.state.windows[0].context, "unitTest");
});

test("actions.open moves window into foreground", ()=>{
	const localSample = {...sample};
	let cmd, data;
	localSample.dispatch = (c,d)=>{cmd=c; data=d;};
	
	sample.actions.open(localSample, "unitTestWindow");	
	assert.equal(cmd, "moveIntoForeground");
	assert.equal(data, "unitTestWindow");
});


test("actions.openWithChild passes params to regular open action", ()=>{
	const dispatch = new sinon.fake();
	const commit = ()=>{};
	const state = {index: {"w1":0}, windows: [{opened: false}]};
	const data = {
		parentId: 123,
		params: "w1"
	};
	
	master.actions.openWithChild({state, commit, dispatch}, data);
	assert.equal(dispatch.callCount, 1);
	assert.equal(dispatch.lastCall.args[0], "open");
	assert.equal(dispatch.lastCall.args[1], data.params);
});

test("actions.openWithChild extracts id from data parameter", ()=>{
	const dispatch = ()=>{};
	const commit = new sinon.fake();
	const state = {index: {"w1":0}, windows: [{opened: false}]};
	const data = {
		parentId: 123,
		params: null
	};
	
	data.params = "w1"
	master.actions.openWithChild({state, commit, dispatch}, data);
	assert.equal(commit.lastCall.args[1].id, "w1");		
	
	commit.resetHistory();
	
	data.params = {id: "w1"};
	master.actions.openWithChild({state, commit, dispatch}, data);
	assert.equal(commit.lastCall.args[1].id, "w1");	
});

test("actions.openWithChild links parent and child windows together", ()=>{
	const childWindow = {
		id: "childWindow",
		parent: "",
		children: [],
		opened: false
	};
	sample.state.windows.push(childWindow);
	sample.state.index["childWindow"] = 1;
	
	sample.actions.openWithChild(sample, {parentId: "unitTestWindow", params: "childWindow"});	
	
	assert.strictEqual(sample.state.windows[0].parent, "");
	assert.deepEqual(sample.state.windows[0].children, ["childWindow"]);	
	
	assert.strictEqual(sample.state.windows[1].parent, "unitTestWindow");
	assert.deepEqual(sample.state.windows[1].children, []);
});

test("actions.openWithChild does nothing if window to be opened is already open", ()=>{
	const dispatch = ()=>{};
	const commit = new sinon.fake();
	const state = {index: {"w1":0}, windows: [{opened: null}]};
	const data = {
		parentId: 123,
		params: "w1"
	};
	
	state.windows[0].opened = true;
	master.actions.openWithChild({state, commit, dispatch}, data);
	assert.equal(commit.callCount, 0);		
	
	state.windows[0].opened = false;
	master.actions.openWithChild({state, commit, dispatch}, data);
	assert.equal(commit.callCount, 2);	
});


test("actions.close closes and cleans up single window", ()=>{
	sample.actions.close(sample, "unitTestWindow");
	assert.equal(sample.state.windows[0].opened, false);
	assert.equal(sample.state.windows[0].context, null);	
});

test("actions.close closes and cleans up nested window", ()=>{
	const childWindow = {
		id: "childWindow",
		parent: "unitTestWindow",
		children: [],
		opened: true,
		context: 123
	};
	sample.state.windows[0].children = ["childWindow"];
	sample.state.windows.push(childWindow);
	sample.state.index["childWindow"] = 1;
	
	sample.actions.close(sample, "unitTestWindow");
	assert.equal(sample.state.windows[1].opened, false);
	assert.equal(sample.state.windows[1].context, null);
	
	assert.equal(sample.state.windows[1].parent, "");
	assert.equal(sample.state.windows[0].children.length, 0);
});


test("actions.moveIntoForeground applies highestZ to window", ()=>{
	const before = sample.state.windows[0].zIndex;
	sample.actions.moveIntoForeground(sample, "unitTestWindow");
	assert.equal(sample.state.windows[0].zIndex, before + 1);
});

test("actions.moveIntoForeground increments next z-index", ()=>{
	const before = sample.state.highestZ;
	sample.actions.moveIntoForeground(sample, "unitTestWindow");
	assert.equal(sample.state.highestZ, before + 1);
});


test("actions.set was assigned the correct function", ()=>{
	assert.equal(sample.actions.set.name, "generatedPassThruAction");
});


test("actions.setState was assigned the correct function", ()=>{
	assert.equal(sample.actions.setState.name, "generatedPassThruAction");
});


test("actions.init returns if already inited or no data provided", ()=>{
	sample.actions.init(sample);
	assert.equal(commitCallCount, 0);
	
	sample.state.init = true;
	sample.actions.init(sample, {});
	assert.equal(commitCallCount, 0);
});


test("actions.destroy closes all windows and resets state", ()=>{
	sample.actions.open(sample, {id: "unitTestWindow", context: "unitTest"});
	if(sample.state.highestZ == sample.state.startingZ) {
		sample.state.highestZ++;
	}
	
	sample.actions.destroy(sample);
	
	assert.equal(sample.state.highestZ, sample.state.startingZ);
	assert.equal(sample.state.windows[0].opened, false);
	assert.equal(sample.state.windows[0].context, null);
	assert.equal(sample.state.windows[0].zIndex, sample.state.startingZ);
});
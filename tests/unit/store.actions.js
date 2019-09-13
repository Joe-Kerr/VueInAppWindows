const assert = require("assert");
const master = require("../../src/store/windows.js").default;
const sample = {};

Object.assign(sample, master);
sample.state = JSON.parse(JSON.stringify(master.state));

suite("store/windows.js/actions");

sample.dispatch = ()=>{};
let commitCallCount = 0;
sample.commit = (cmd, data)=>{commitCallCount++; sample.mutations[cmd](sample.state, data)};

beforeEach(()=>{
	sample.state.init = false;
	sample.state.windows = [{"id": "unitTestWindow", "name": "unit-test-window", "opened": false, "zIndex": sample.state.startingZ, "x": 44, "y": 41, "w": 250, "h": 150, "context": null, header: "", maximized: false, minimized: false}];
	sample.state.index = {"unitTestWindow": 0}
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

test("actions.close closes and cleans up window", ()=>{
	sample.actions.close(sample, "unitTestWindow");
	assert.equal(sample.state.windows[0].opened, false);
	assert.equal(sample.state.windows[0].context, null);	
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
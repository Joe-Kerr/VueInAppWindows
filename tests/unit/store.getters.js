const assert = require("assert");
const sample = require("../../src/store/windows.js").default;

suite("store/windows.js/getters");

test("getters.windows returns windows container", ()=>{
	const state = {windows: [{id: 1}, {id: 2}]};
	assert.equal(sample.getters.windows(state), state.windows);
});
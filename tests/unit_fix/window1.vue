<template>
	<div> <div id="content1">content1</div><div id="context1">{{window.context}}</div> </div>
</template>

<script>
	export default {
		name: "win1", 
		$data: {id: "window1", title: "w1_title", header: "header2", className: "testClass1 testClass2"}, 
		props: ["window"]
	};
</script>
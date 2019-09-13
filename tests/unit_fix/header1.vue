<template>
<div id="header1">
	<h1 id="title">{{window.title || "h_title"}}</h1>
	<button @click="funcs.close()" id="close">close</button>
	<button @click="funcs.toggleMax()" id="toggleMax">toggleMax</button>
	<button @click="funcs.toggleMin()" id="toggleMin">toggleMin</button>
</div>
</template>

<script>
export default {name: "header1", props: ["window", "funcs"]};
</script>
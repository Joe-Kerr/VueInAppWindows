<template>
<div>
	<inapp-window-container 
		defaultHeader="header1"
	/>	
</div>	
</template>

<script>

import {inAppWindowContainer} from "../../src/index.js";

export default {
	name: "root",
	components: {"inapp-window-container": inAppWindowContainer}
};

</script>
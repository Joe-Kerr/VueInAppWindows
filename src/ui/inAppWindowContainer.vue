<template>
	<div id="plugin-wrapper-windows">		
		
		<inapp-window v-for="window in listOfWindows" :window="window" :key="window.id" /> 
		
	</div>	
</template>

<script src="./inAppWindowContainer.js">

</script>
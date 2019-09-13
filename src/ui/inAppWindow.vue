<template>
	<transition name="inapp-window_transition">
	<div 
		:id="'inapp-window_'+window.id"
		:class="['inapp-window', ...extraClasses]" 
		:style="[{zIndex, top, left}, maxedStyles]"
		:ref="'window'+window.id" 
		v-on:mousedown.capture="moveIntoForeground"
	>										

		<div class="inapp-window_header" v-if="window.header !== ''">
			<component :is="window.header" :window="window" :funcs="{close, toggleMin, toggleMax, move}" />
		</div>
		

		
		<div class="inapp-window_body" style="width: 100%; height: 100%;" v-show="window.header === '' || window.minimized === false">
			<component :is="window.name" :window="window" :funcs="{close, toggleMin, toggleMax, move}" />
		</div>	

	</div>
	</transition>
</template>

<script src="./inAppWindow.js"></script>
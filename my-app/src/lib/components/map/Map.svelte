<script lang="ts">
	import { formatGraph, fullLayout } from "$lib/code/layouts";
	import { data, structure } from "$lib/code/map";
	import cytoscape from "cytoscape";
	import Tooltip from "./Tooltip.svelte";
	
  let containerDiv: HTMLDivElement;
	let staffDiv: HTMLDivElement;
  
	const init = (container: HTMLElement) => {
		const {elements, style} = $data;
		const layout = fullLayout;
		structure.set(cytoscape({ container, layout, elements, style }));
		formatGraph($structure);
	}

	$: init(containerDiv);

	const container = true;

</script>

<style>
.container {
	width: 100%;
	height: 100%;
	position: absolute;
}
</style>

<div class:container bind:this={containerDiv}>
</div>

<Tooltip />

<div bind:this={staffDiv}></div>


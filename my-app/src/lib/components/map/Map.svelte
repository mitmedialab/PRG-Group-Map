<script lang="ts">
	import { formatGraph, fullLayout } from "$lib/code/layouts";
	import { graph, structure } from "$lib/code/map";
	import cytoscape from "cytoscape";
	import Legend from "./Legend.svelte";
	import Tooltip from "./Tooltip.svelte";

  let containerDiv: HTMLDivElement;
	let staffDiv: HTMLDivElement;
  
	const init = (container: HTMLElement) => {
		const {elements, style} = $graph;
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

:global(*) {
	--primary-color: #27ccc0;
	font-family: sans-serif;
}
</style>

<div class:container bind:this={containerDiv}>
</div>

<Legend />
<Tooltip />


<div bind:this={staffDiv}></div>


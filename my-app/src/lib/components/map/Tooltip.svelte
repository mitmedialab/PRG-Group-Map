<script lang="ts">
	import { tooltip, type Tooltip } from "$lib/code/tooltip";

  let style: string;

  const getStyle = ({position: {x, y}}: Tooltip) => `left: ${x}px; top: ${y}px; opacity: 1`;

  $: style = $tooltip.visible ? getStyle($tooltip) : "opacity: 0;";
</script>
<style>
  div {
    padding: 10px;
    position: absolute;
    background-color: white;
    border: 2px solid black;
    border-radius: 5px;
    text-overflow: wrap;
    word-wrap: break-word;
    max-width: 500px;
    max-height: none;
    overflow-x: hidden;
    overflow-y: scroll;
    z-index: 10;
}

:global(div>a) {
  color: blue;
}
</style>
<div {style}>
  {#if $tooltip.visible}
    <h3><b>{$tooltip.title}</b></h3>
    <i>{$tooltip.type}</i><br>
    {#each $tooltip.items as item}
      {#if Array.isArray(item)}
        <b>{item[0]}:</b> {@html item[1]}<br>
      {:else}
        {item}
      {/if}
    {/each}
  {/if}
</div>
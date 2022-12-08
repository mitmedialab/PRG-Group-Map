<script lang="ts">
	import type { NormalizedData } from "$builder/types";
	import { selectItem, runTour } from "$lib/code/layouts";
  import { data } from "$lib/code/map";

  const getControls = (info: NormalizedData) => [
    { title: "Themes", placeholder: "Select Theme", values: Object.keys(info.themes), onChange: (value: string) => selectItem(value)},
    { title: "Projects", placeholder: "Select Project", values: Object.keys(info.projects)},
    { title: "People", placeholder: "Select Person", values: info.people.map(({name}) => name)},
  ];

  const selectValue = (element: HTMLSelectElement) => element ? selectItem(element.value) : null; 
</script>

<style>
#legend {
    position: absolute;
    top: 0;
    right: 0;
    padding: 10px 10px 10px 20px;
    background-color: white;
    border-style: none none solid solid;
    border-radius: 0 0 0 5px;
}

.legend-title {
    font-weight: bold;
    font-size: 28px;
    margin-bottom: 10px;
}

.legend-item {
    display: flex;
    align-items: center;
    margin-top: -10px;
    margin-right: 5px;
}

.legend-item > div {
    float: left;
    margin-right: 5px;
}

.legend-item > span {
    color: transparent;
    text-shadow: 0 0 0 var(--primary-color);
}

.check {
    accent-color: var(--primary-color);
    margin: 8px 5px 8px 0;
}

.item-select > option {
    margin: 8px 0px;
    width: 80px;
    text-overflow: ellipsis;
}

.legend-item > select {
    float: right;
    left: auto;
    right: 0;
    max-width: 80px;
    text-overflow: ellipsis;
} 
</style>

<div id="legend">
  <div class="legend-title">Legend</div>
  <div class="legend-item">
    <span style="font-size: 16px; margin: 0 5px 5px 0;">&#11035;</span> 
    Themes
  </div>
  <div class="legend-item">
    <span style="font-size: 28px; margin: 0 5px 5px 0;">&#11043;</span> 
    Projects
  </div>
  <div class="legend-item" style="margin-top: -14px">
    <span style="font-size: 22px; margin: 0 7px 5px 2px;">&#11044;</span> 
    People
  </div>

  <hr/>

  <div class="legend-title">Filter</div>
  
  {#each getControls($data) as {title, placeholder, values}}
    <div class="legend-item">
      <div>
        <input type="checkbox" id="displayThemes" class="check">
        {title}
      </div>
      <select class="item-select" on:change={(e) => selectValue(e.currentTarget)} {placeholder}>
        {#each values as value}
        <option {value}>
          {value}
        </option>
        {/each}
      </select>
    </div>
  {/each}

  <hr/>
  <button id="takeATour" on:click={runTour}>
    <span style="font-size: 16px; margin: 0 5px 5px 0;">&#9654;</span>
    Take a Tour
  </button>
</div>
<script>
	import Cell from './Cell.svelte';
	import GlyphIcon from './GlyphIcon.svelte';

  export let row;
  export let select;
	export let selected;
  export let remove;
</script>

<tr class={selected ? 'danger' : ''}>
	<Cell className="col-md-1">{row.id}</Cell>
	<Cell className="col-md-4"><a onclick={select}>{row.label}</a></Cell>
	<Cell className="col-md-1"><a onclick={() => remove(row)}><GlyphIcon /></a></Cell>
	<Cell className="col-md-6"></Cell>
</tr>

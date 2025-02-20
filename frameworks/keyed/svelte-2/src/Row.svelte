<script>
  export let row;
  export let select;
	export let selected;
  export let remove;
</script>

<tr class={selected ? 'danger' : ''}>
	<td class="col-md-1">{row.id}</td>
	<td class="col-md-4"><a onclick={select}>{row.label}</a></td>
	<td class="col-md-1"><a onclick={() => remove(row)}><span class="glyphicon glyphicon-remove" aria-hidden="true" /></a></td>
	<td class="col-md-6"></td>
</tr>

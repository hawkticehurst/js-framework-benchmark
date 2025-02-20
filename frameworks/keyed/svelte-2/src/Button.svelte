<script>
	export let id;
	export let action;
	export let title;
</script>

<div class="col-sm-6 smallpad">
  <button type="button" class="btn btn-primary btn-block" id={id} onclick={action}>{title}</button>
</div>

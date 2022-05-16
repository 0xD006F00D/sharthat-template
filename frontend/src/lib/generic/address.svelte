<script>
	import { connected } from 'svelte-ethers-store';

	import { copyToClipboard } from '$lib/common/helper';

	import Tooltip from '$lib/generic/tooltip.svelte';
	import Identicon from '$lib/generic/identicon.svelte';

	const placeholder = '0x000000';

	export let value = placeholder;
	export let status = false;
	export let disabled = false;

	export let tooltipText = disabled ? '' : 'Copy to Clipboard';
	export let clickAction = disabled ? () => {} : defaultAction;

	$: shortAddress = getDisplayFormat(value);

	function getDisplayFormat(addr) {
		if (!addr || addr.length < 8) addr = placeholder;
		return addr.substring(0, 5) + '..' + addr.substring(addr.length - 4);
	}

	function defaultAction() {
		copyToClipboard(value);
	}
</script>

<Tooltip text={tooltipText}>
	<div class="pill address my-1 bg-neutral-800" on:click|stopPropagation={clickAction()}>
		{#if status && !$connected}
			<div class="mr-2 h-3 w-3 rounded-full bg-neutral-500" />
		{:else}
			<Identicon address={value} />
		{/if}
		<div class="pointer" title={value}>
			{shortAddress}
		</div>
	</div>
</Tooltip>

<style lang="postcss">
</style>

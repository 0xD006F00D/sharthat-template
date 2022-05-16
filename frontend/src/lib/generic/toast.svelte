<script>
	import { flip } from 'svelte/animate';
	import { fly } from 'svelte/transition';

	import { Notifier } from '$lib/stores';
	import Loading from './loading.svelte';
</script>

<div class="toaster">
	{#each $Notifier as notification (notification.id)}
		<div
			class="toast toast-{notification.type} "
			animate:flip={{ delay: 0, duration: 300 }}
			in:fly|local={{ y: 30 }}
			out:fly|local={{ y: 30 }}>
			<div class="content">{notification.message}</div>
			{#if notification.type == 'wait'}
				<Loading />
			{/if}
		</div>
	{/each}
</div>

<style lang="postcss">
	.toaster {
		@apply flex flex-col items-end justify-end;
		@apply pointer-events-none fixed bottom-5 right-5 z-50 m-auto h-72 w-60 p-0;
	}

	.toast {
		@apply mb-1 flex w-56 flex-auto grow-0 items-center rounded;
	}

	.content {
		@apply mr-auto block overflow-hidden break-words p-3;
	}

	.toast-default {
		@apply bg-neutral-500;
	}

	.toast-info,
	.toast-wait {
		@apply bg-blue-500;
	}

	.toast-success {
		@apply bg-green-500;
	}

	.toast-warning {
		@apply bg-yellow-500;
	}

	.toast-danger {
		@apply bg-red-500;
	}
</style>

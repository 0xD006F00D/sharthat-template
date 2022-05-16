<script>
	import '../app.css';
	import { page } from '$app/stores';
	import { goto } from '$app/navigation';

	import { Settings } from '$lib/stores';

	import Account from '$lib/components/account.svelte';
	import Toast from '$lib/generic/toast.svelte';

	$: path = $page.url.pathname;

	const routes = [
		{ name: 'Index', route: '/' },
		{ name: 'About', route: '/about/' },
		{ name: 'Debug', route: '/debug/' }
	];

	// Bug: Svelte will reload stores again on first navigation
	// Only happens in dev mode, not an issue in production
	// https://github.com/sveltejs/kit/issues/2130
</script>

<header>
	<div class="header md:flex md:text-left">
		<div class="logo md:m-2">
			<a
				class="text-2xl text-neutral-300"
				href="/"
				on:click|preventDefault={async () => await goto('/')}>
				Sharthat
			</a>
		</div>

		<Account />
	</div>

	<nav class="menu">
		{#each routes as r (r.name)}
			{#if r.name != 'Debug' || (r.name == 'Debug' && $Settings.debug)}
				<a
					href={r.route}
					class:active={path == r.route}
					class="menu-item"
					on:click|preventDefault={async () => await goto(r.route)}>{r.name}</a>
			{/if}
		{/each}
	</nav>
</header>

<main>
	<slot />
</main>

<Toast />

<style lang="postcss">
	.header {
		@apply items-center justify-between px-4 py-4 text-center;
	}

	.logo {
		@apply m-4;
	}

	.menu {
		@apply mx-8 my-4 text-center text-lg;
	}

	.menu-item {
		@apply mx-4 inline-block py-1;
	}
</style>

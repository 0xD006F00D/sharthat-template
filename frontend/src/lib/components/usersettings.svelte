<script>
	import { createEventDispatcher, onMount } from 'svelte';
	import { allChainsData } from 'svelte-ethers-store';

	import { CustomNetworkTemplate } from '$lib/common/constants';
	import { Notifier, Settings } from '$lib/stores';

	import Popup from '$lib/generic/popup.svelte';
	import Panel from '$lib/generic/panel.svelte';

	const APP_VERSION = __version__;

	let values;
	let isSaving = false;
	let customNetworkName = '';

	export let show = false;
	$: show, getValues();

	const dispatch = createEventDispatcher();

	onMount(() => {});

	function getValues() {
		let settings = { ...$Settings };
		let defaults = Settings.getDefaults();

		if (settings && Object.keys(settings).length == Object.keys(defaults).length) {
			values = settings;
		} else {
			values = defaults;
			console.log('Reset Settings');
		}
	}

	function reset() {
		values = Settings.getDefaults();
	}

	async function save() {
		isSaving = true;

		const result = Settings.save(values);
		if (result) {
			Notifier.success('Settings saved');
		}

		dispatch('done');
		show = false;
		isSaving = false;
	}
</script>

<Popup bind:show width="768px">
	<h1 class="mb-4">Settings</h1>

	<div class="space-y-4">
		<div class="panel-container">
			<Panel name="Dev">
				<div class="setting relative">
					<div class="absolute right-0 text-right text-xs opacity-50">{APP_VERSION}</div>
					<span class="title">Debug</span>
					<input id="settingDebugCheckBox" type="checkbox" bind:checked={values.debug} />
				</div>
				<div class="setting">
					<span class="title">Enable Testnets</span>
					<input
						id="settingTestnetCheckBox"
						type="checkbox"
						bind:checked={values.useTestnets} />
				</div>
			</Panel>
		</div>
		<div class="setting space-x-2">
			<h2 class="mr-auto">Networks</h2>
			<input
				id="settingCustomNetworkNameInput"
				placeholder="Add Custom Network"
				class="control"
				list="KnownNetworksList"
				bind:value={customNetworkName} />
			<datalist id="KnownNetworksList">
				{#each allChainsData as chainData}
					<option>{chainData.name}</option>
				{/each}
			</datalist>
			<button
				id="settingNetworkAddButton"
				disabled={!customNetworkName ||
					values.networks.filter((n) => n.name == customNetworkName).length}
				on:click={() => {
					let networks = [...values.networks];
					let customNetwork = { ...CustomNetworkTemplate };
					// Pre-fill existing data from svelte-ether-store if name matches
					let chainData = allChainsData.find((d) =>
						d.name.toLowerCase().includes(customNetworkName.toLowerCase())
					);
					if (chainData) {
						customNetwork.rpcUrl = chainData.rpc[0];
						customNetwork.chainId = chainData.chainId;
					}
					customNetwork.name = customNetworkName;
					networks.push(customNetwork);
					values.networks = networks;
					customNetworkName = '';
				}}>+</button>
		</div>
		<div class="panel-container">
			{#each values.networks.filter((n) => !n.testnet || values.useTestnets) as network, i}
				<Panel name={network.name}>
					<div slot="header">
						{#if network.custom}
							<button
								id="settingNetwork[{i}]RemoveButton"
								on:click|preventDefault|stopPropagation={() => {
									let networks = [...values.networks];
									networks.splice(i, 1);
									values.networks = networks;
								}}>-</button>
						{/if}
					</div>

					<div class="setting">
						<span class="title">Enabled</span>
						<input
							id="setting[{i}]Checkbox"
							type="checkbox"
							bind:checked={values.networks[i].enabled} />
					</div>
					<div class="setting">
						<span class="title">ChainId</span>
						<input
							disabled={!values.networks[i].enabled || null}
							id="setting[{i}]ChainIdInput"
							class="control"
							bind:value={values.networks[i].chainId} />
					</div>
					<div class="setting">
						<span class="title">RPC</span>
						<input
							disabled={!values.networks[i].enabled || null}
							id="setting[{i}]RpcInput"
							class="control"
							bind:value={values.networks[i].rpcUrl} />
					</div>
					<div class="setting">
						<span class="title">Logo</span>
						<input
							disabled={!values.networks[i].enabled || null}
							id="setting[{i}]LogoInput"
							class="control"
							bind:value={values.networks[i].logo} />
					</div>
				</Panel>
			{/each}
		</div>

		<div class="flex items-center space-x-4">
			<button
				id="settingResetButton"
				class="danger flex-1"
				disabled={isSaving}
				on:click={reset}>Reset</button>
			<button
				id="settingSaveButton"
				class="success flex-1"
				disabled={isSaving}
				on:click={save}>Save</button>
			<button id="settingsCancelButton" on:click|stopPropagation={(e) => (show = false)}
				>Cancel</button>
		</div>
	</div>
</Popup>

<style lang="postcss">
	.setting {
		@apply mb-2 flex items-center;
	}

	.title {
		@apply w-1/3;
	}

	.control {
		@apply w-2/3;
	}
</style>

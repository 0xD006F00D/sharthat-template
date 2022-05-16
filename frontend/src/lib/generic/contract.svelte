<script>
	import { ethers } from 'ethers';
	import { connected } from 'svelte-ethers-store';

	import { txPromise } from '$lib/stores/transactor';
	import { Notifier } from '$lib/stores';

	import Address from '$lib/generic/address.svelte';
	import Identicon from '$lib/generic/identicon.svelte';

	export let readContract;
	export let writeContract;
	$: if (readContract && readContract.interface) init();

	let fns = [];
	let fnValues;
	let fnResults;

	function init() {
		if (fns.length > 0) return;

		fns = Object.values(readContract.interface.functions);
		fnResults = new Array(fns.length);
		fnValues = new Array(fns.length);

		for (let index = 0; index < fns.length; index++) {
			fnValues[index] = new Array(fns[index].inputs.length);
		}
	}

	async function getValue(fnIndex) {
		var fn = fns[fnIndex];
		let result;

		try {
			result = await readContract[fn.name]();
		} catch (e) {
			console.log(e);
			result = 'ERROR';
		}

		fnResults[fnIndex] = formatResult(result);
	}

	async function sendInput(fnIndex) {
		var fn = fns[fnIndex];
		let result = {};

		let values = fnValues[fnIndex];

		// Convert input string ["a","b"] or a,b to Array if input is array
		const arrayValueRegex = /(?:\[|")*(?<value>\w+)(?:"|,|\s|\])*/g;
		for (let index = 0; index < values.length; index++) {
			if (fn.inputs[index].arrayLength) {
				const match = values[index].matchAll(arrayValueRegex);
				values[index] = [...match].map((m) => m.groups.value);
			}
		}

		if (fn.stateMutability === 'view' || fn.stateMutability === 'pure') {
			try {
				result = await readContract[fn.name](...values);
			} catch (e) {
				Notifier.danger(e);
				console.log(e);
				result = 'ERROR';
			}
		} else {
			if ($connected) {
				result = await txPromise(writeContract[fn.name](...values));
			} else {
				Notifier.danger('Please connect your Account');
				return;
			}
		}

		fnResults[fnIndex] = formatResult(result);
	}

	function formatResult(result) {
		// Multiple Return Values / Structs
		if (Array.isArray(result)) {
			let arrayResult = '[';
			for (let r of result) {
				arrayResult = arrayResult + formatResult(r) + ', ';
			}
			return arrayResult.slice(0, -2) + ']';
		}

		if (result && result.toNumber) {
			try {
				return result.toNumber().toString();
			} catch (e) {
				return 'Ξ' + ethers.utils.formatEther(result);
			}
		}

		if (result && result.startsWith && result.startsWith('0x')) {
			return result;
		}

		if (result && (result.transactionHash || result.hash)) {
			return 'txHash: ' + (result.transactionHash || result.hash);
		}

		return JSON.stringify(result);
	}

	function toBytes32(fnIndex, inIndex) {
		const value = fnValues[fnIndex][inIndex];

		if (ethers.utils.isHexString(value)) {
			fnValues[fnIndex][inIndex] = ethers.utils.parseBytes32String(value);
		} else {
			fnValues[fnIndex][inIndex] = ethers.utils.formatBytes32String(value);
		}

		console.log(fnValues[fnIndex][inIndex]);
	}

	function toHex(fnIndex, inIndex) {
		const value = fnValues[fnIndex][inIndex];
		if (ethers.utils.isHexString(value)) {
			fnValues[fnIndex][inIndex] = ethers.utils.toUtf8String(value);
		} else {
			fnValues[fnIndex][inIndex] = ethers.utils.hexlify(ethers.utils.toUtf8Bytes(value));
		}

		console.log(fnValues[fnIndex][inIndex]);
	}

	function toWei(fnIndex, inIndex) {
		const value = fnValues[fnIndex][inIndex];
		fnValues[fnIndex][inIndex] = ethers.utils.parseEther(value);
	}
</script>

<div class="m-2 filter">
	{#each fns as fn, f (fn.name + f)}
		<a href="#{readContract.address}_{fn.name}_{f}">{fn.name}</a>{' '}
	{/each}
</div>

{#each fns as fn, f (fn.name + f)}
	<div class="function">
		<h2 class="function-name" id="{readContract.address}_{fn.name}_{f}">{fn.name}</h2>
		{#if !fn.inputs.length && (fn.stateMutability === 'pure' || fn.stateMutability === 'view')}
			{#await getValue(f) then}
				<span class="value-row">
					{#if fnResults[f] && fnResults[f].startsWith('0x')}
						<span><Address value={fnResults[f]} /></span>
					{:else}
						<h2 class="inline-block break-all min-w-0">{fnResults[f]}</h2>
					{/if}
					<button class="ml-auto" on:click={getValue(f)}>⟳</button>
				</span>
			{/await}
		{:else}
			{#each fn.inputs as input, i (fn.name + f + input.name)}
				<div class="input-row">
					{#if input.type === 'address'}
						<div class="w-full">
							<Identicon
								input
								address={fnValues && fnValues[f] ? fnValues[f][i] : ''}>
								<input
									placeholder="{input.type} {input.name}"
									bind:value={fnValues[f][i]} />
							</Identicon>
						</div>
					{:else}
						<input
							class="min-w-0 w-full"
							placeholder="{input.type} {input.name}"
							bind:value={fnValues[f][i]} />
					{/if}

					{#if input.type === 'bytes32'}
						<button on:click={toBytes32(f, i)}>bytes32</button>
					{:else if input.type === 'bytes'}
						<button on:click={toHex(f, i)}>hex</button>
					{:else if input.type === 'uint256'}
						<button on:click={toWei(f, i)}>wei</button>
					{/if}
				</div>
			{/each}
			<div class="flex">
				<span class="inline-block mr-4 ml-1 break-all">
					{fnResults && fnResults[f] ? fnResults[f] : ''}
				</span>
				<button class="w-32 self-start danger ml-auto" on:click={sendInput(f)}
					>Send</button>
			</div>
		{/if}
	</div>
{/each}

<style lang="postcss">
	.function {
		@apply m-2 flex flex-col space-y-2 border-b-2 border-neutral-800 pb-4;
	}

	.function:last-child {
		@apply border-b-0;
	}

	.function-name {
		@apply mt-2;
	}

	.value-row {
		@apply flex flex-row items-center;
	}

	.input-row {
		@apply flex space-x-2;
	}

	button {
		@apply flex-shrink-0;
	}
</style>

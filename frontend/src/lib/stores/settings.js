import { writable } from 'svelte/store';
import { MainnetNetworks, TestNetworks } from '$lib/common/constants';

function createSettingsStore() {
	const storageKey = 'SvelteHardhatSettingsStore_v1.0.0';

	const settingsStore = writable(getDefaults(), (set) => {
		let settings = load();
		set(settings);
		// Disable console output if debug is disabled, requires refresh to take effect
		if (!settings.debug) {
			console.log = function () {};
		}
	});

	function load() {
		if (typeof window === 'undefined') return getDefaults();

		const value = localStorage.getItem(storageKey);
		let settings = value ? JSON.parse(value) : getDefaults();
		return getValidSettings(settings);
	}

	function save(settings) {
		if (typeof window === 'undefined') return false;
		settings = getValidSettings(settings);
		localStorage.setItem(storageKey, JSON.stringify(settings));
		settingsStore.set(settings);
		return true;
	}

	function getValidSettings(settings) {
		const defaults = getDefaults();
		if (isValidSettings(settings, defaults)) {
			return settings;
		}
		//If the default settings changed we merge the changes with the new settings
		const merged = Object.assign({}, defaults, settings);
		if (isValidSettings(merged, defaults)) {
			console.log('Merging new Settings');
			return merged;
		}
		//If the merge failed we can return the defaults and discard the settings
		console.log('Resetting to default Settings');
		return defaults;
	}

	function isValidSettings(settings, defaults) {
		return (
			settings &&
			Object.keys(settings).length == Object.keys(defaults).length &&
			settings.networks.length >= defaults.networks.length
		);
	}

	function getDefaults() {
		let defaultOn = true;
		return {
			debug: defaultOn,
			useTestnets: defaultOn,
			networks: [...MainnetNetworks, ...TestNetworks]
		};
	}

	return {
		subscribe: settingsStore.subscribe,
		save: (settings) => save(settings),
		getDefaults: () => getDefaults()
	};
}

export const Settings = createSettingsStore();

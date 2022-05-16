import { writable } from 'svelte/store';

const TIMEOUT = 5000;
const MAXIMUM = 10;

function createNotificationStore() {
	const _notifications = writable([]);

	function send(message, type = 'default', timeoutDuration = TIMEOUT) {
		_notifications.update((state) => {
			if (state.length > MAXIMUM) {
				//Only pop elements that are not wait messages
				let nextIndex = state.findIndex((e) => e.timeout);
				if (nextIndex > -1) state.splice(nextIndex, 1);
			}
			message = tryParseMessage(message);
			message = errorToString(message);

			let notificationId = id();
			let timeout = setTimeout(() => {
				_notifications.update((state) => {
					let index = state.findIndex((n) => n.id == notificationId);
					if (index > -1) state.splice(index, 1);
					return state;
				});
			}, timeoutDuration);

			console.log(notificationId, message);
			return [{ id: notificationId, type, message, timeout }, ...state];
		});
	}

	function wait(message, type = 'info') {
		let notificationId;
		_notifications.update((state) => {
			notificationId = id();
			return [{ id: notificationId, type, message, timeout: 0 }, ...state];
		});
		return notificationId;
	}

	function done(notificationId = null) {
		_notifications.update((state) => {
			let index = state.findIndex((n) => n.id == notificationId);
			if (index > -1) state.splice(index, 1);
			return [...state];
		});
	}

	return {
		subscribe: _notifications.subscribe,
		send,
		default: (msg, timeout) => send(msg, 'default', timeout),
		danger: (msg, timeout) => send(msg, 'danger', timeout),
		warning: (msg, timeout) => send(msg, 'warning', timeout),
		info: (msg, timeout) => send(msg, 'info', timeout),
		success: (msg, timeout) => send(msg, 'success', timeout),
		wait: (msg) => wait(msg, 'wait'),
		done: (notificationId) => done(notificationId)
	};
}

let notificationCounter = 0;
function id() {
	return Date.now().toString(36) + '_' + notificationCounter++;
}

function errorToString(message) {
	// Only for error strings that don't contain spaces
	if (typeof message !== 'string' || message.indexOf(' ') != -1) return message;
	return (
		message
			// insert a space before all caps or (
			.replace(/([A-Z\(])/g, ' $1')
			// remove space at the beginning
			.trim()
			// make everything lowercase
			.toLowerCase()
			// uppercase only the first character
			.replace(/^./, function (str) {
				return str.toUpperCase();
			})
			// and remove ()
			.replace(/([\(\)])/g, '')
	);
}

function tryParseMessage(e) {
	let errorText = '';

	if (e.data && e.data.message) {
		errorText = e.data.message;
	} else if (e.message) {
		errorText = e.message;
	} else if (e.toString) {
		errorText = e.toString();
	}

	if (errorText.length) {
		const revertExpressions = [
			/reverted with reason string '(.*)'/g, //Default revert
			/reverted with custom error '(.*)'/g, //Default for custom errors
			/errorName="([^"]*)"/g, //revert data format not supported
			/\[ethjs\-query\].*"message":"([^"]*)".*/g //Metamask
		];

		for (const expression of revertExpressions) {
			let revertRegex = new RegExp(expression);
			let revertMatch = revertRegex.exec(errorText);
			if (revertMatch) return revertMatch[1];
		}
	}

	//E.g. Kovan does not properly return revert messages
	if (
		!errorText.length ||
		errorText.indexOf('missing revert data in call exception') >= 0 ||
		errorText.indexOf('cannot estimate gas;') >= 0
	) {
		return 'Transaction reverted';
	}

	return errorText;
}

export const Notifier = createNotificationStore();

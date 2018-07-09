const SYMBOL_CANCELABLETIMER_ACTIVE = Symbol();
const SYMBOL_CANCELABLETIMER_TIMER = Symbol();
const SYMBOL_CANCELABLETIMER_RESOLVE = Symbol();
const SYMBOL_CANCELABLETIMER_REJECT = Symbol();

export default class CancelableTimer {
	constructor() {
		const d = (this._data = {});

		d[SYMBOL_CANCELABLETIMER_ACTIVE] = false;
		d[SYMBOL_CANCELABLETIMER_TIMER] = null;
		d[SYMBOL_CANCELABLETIMER_RESOLVE] = null;
		d[SYMBOL_CANCELABLETIMER_REJECT] = null;
	}

	done(err) {
		const d = this._data;

		try {
			if (d[SYMBOL_CANCELABLETIMER_ACTIVE] === false) {
				return;
			}

			if (d[SYMBOL_CANCELABLETIMER_TIMER] !== null) {
				clearTimeout(d[SYMBOL_CANCELABLETIMER_TIMER]);
			}

			if (err) {
				d[SYMBOL_CANCELABLETIMER_REJECT](err);
			}
			else {
				d[SYMBOL_CANCELABLETIMER_RESOLVE](err);
			}
		}
		catch (e) {
			console.error(`CancelableTimer critical error.\n`, e);
		}
		finally {
			d[SYMBOL_CANCELABLETIMER_ACTIVE] = false;
			d[SYMBOL_CANCELABLETIMER_TIMER] = null;
			d[SYMBOL_CANCELABLETIMER_RESOLVE] = null;
			d[SYMBOL_CANCELABLETIMER_REJECT] = null;
		}
	}

	delay(ms) {
		const _this = this;

		const d = this._data;

		if (d[SYMBOL_CANCELABLETIMER_ACTIVE] !== false) {
			throw new Error(`CancelableTimer::delay() called while previous delay in progress.`);
		}

		return new Promise((resolve, reject) => {
			d[SYMBOL_CANCELABLETIMER_ACTIVE] = true;
			d[SYMBOL_CANCELABLETIMER_RESOLVE] = resolve;
			d[SYMBOL_CANCELABLETIMER_REJECT] = reject;

			if (ms < 0) {
				_this.done();
				return;
			}

			d[SYMBOL_CANCELABLETIMER_TIMER] = setTimeout(() => {
				_this.done();
			}, ms);
		});
	}

	cancel() {
		const _this = this;

		_this.done(new Error(`The timer event has been canceled.`));
	}
}
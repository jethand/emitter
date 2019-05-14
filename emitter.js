/**
 * Created by 田帅奇 on 2019/05/14
 */
class Emitter {
    constructor () {
        this._callbacks = {};
    }
    on (event, fn) {
        this._callbacks = this._callbacks || {};
        (this._callbacks['$' + event] = this._callbacks['$' + event] || [])
        .push(fn);
        return this;
    }
    off(event, fn){
        if (arguments.length === 0) {
            this._callbacks = {};
            return this;
        }
        const callbacks = this._callbacks['$' + event];
        if (!callbacks) return this;
        if (arguments.length === 1) {
            delete this._callbacks['$' + event];
            return this;
        }
        let cb;
        for(let i = 0; i< callbacks.length; i++) {
            cb = callbacks[i];
            if (cb === fn || cb.fn === fn) {
                callbacks.splice(i, 1);
                break;
            }
        }
        if (callbacks.length === 0) {
            delete this._callbacks['$' + event];
        }
        return this;
    }
    emit(event){
        this._callbacks = this._callbacks || {};
        const args = new Array(arguments.length - 1);
        let callbacks = this._callbacks['$' + event];
        for (let i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
        if (callbacks) {
            callbacks = callbacks.slice(0);
            for (let i = 0; i < callbacks.length; i++) {
                callbacks[i].apply(this, args);
            }
        }
        return this;
    }
    once (event, fn) {
        const on = function () {
            this.off(event, on);
            fn.apply(this, arguments)
        };
        on.fn = fn;
        this.on(event, on);
        return this;
    }
    listeners (event) {
        this._callbacks = this._callbacks || {};
        if (arguments.length === 0) {
            return Object.keys(this._callbacks).map(key => key.replace('$', ''));
        }
        return this._callbacks['$' + event] || [];
    }
    hasListeners (event) {
        return !!this.listeners(event).length;
    }
};

const emitter = new Emitter();
emitter
.on('test', (...args) => {
    console.log(args);
})
.once('testonce', (...args) => {
    console.log(args);
})
emitter.emit('test',5,6);
emitter.emit('test',7);
emitter.emit('testonce',8);
emitter.emit('testonce',9);
console.log(emitter.listeners());
console.log(emitter.listeners('test'));
console.log(emitter.hasListeners('test'));
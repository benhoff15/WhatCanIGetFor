import { createRequire } from "node:module";
var __create = Object.create;
var __getProtoOf = Object.getPrototypeOf;
var __defProp = Object.defineProperty;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __toESM = (mod, isNodeMode, target) => {
  target = mod != null ? __create(__getProtoOf(mod)) : {};
  const to = isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target;
  for (let key of __getOwnPropNames(mod))
    if (!__hasOwnProp.call(to, key))
      __defProp(to, key, {
        get: () => mod[key],
        enumerable: true
      });
  return to;
};
var __commonJS = (cb, mod) => () => (mod || cb((mod = { exports: {} }).exports, mod), mod.exports);
var __require = /* @__PURE__ */ createRequire(import.meta.url);

// node_modules/@trpc/server/dist/observable/observable.js
var require_observable = __commonJS((exports) => {
  function isObservable(x) {
    return typeof x === "object" && x !== null && "subscribe" in x;
  }
  function observable(subscribe) {
    const self = {
      subscribe(observer) {
        let teardownRef = null;
        let isDone = false;
        let unsubscribed = false;
        let teardownImmediately = false;
        function unsubscribe() {
          if (teardownRef === null) {
            teardownImmediately = true;
            return;
          }
          if (unsubscribed) {
            return;
          }
          unsubscribed = true;
          if (typeof teardownRef === "function") {
            teardownRef();
          } else if (teardownRef) {
            teardownRef.unsubscribe();
          }
        }
        teardownRef = subscribe({
          next(value) {
            if (isDone) {
              return;
            }
            observer.next?.(value);
          },
          error(err) {
            if (isDone) {
              return;
            }
            isDone = true;
            observer.error?.(err);
            unsubscribe();
          },
          complete() {
            if (isDone) {
              return;
            }
            isDone = true;
            observer.complete?.();
            unsubscribe();
          }
        });
        if (teardownImmediately) {
          unsubscribe();
        }
        return {
          unsubscribe
        };
      },
      pipe(...operations) {
        return operations.reduce(pipeReducer, self);
      }
    };
    return self;
  }
  function pipeReducer(prev, fn) {
    return fn(prev);
  }
  function observableToPromise(observable2) {
    const ac = new AbortController;
    const promise = new Promise((resolve, reject) => {
      let isDone = false;
      function onDone() {
        if (isDone) {
          return;
        }
        isDone = true;
        obs$.unsubscribe();
      }
      ac.signal.addEventListener("abort", () => {
        reject(ac.signal.reason);
      });
      const obs$ = observable2.subscribe({
        next(data) {
          isDone = true;
          resolve(data);
          onDone();
        },
        error(data) {
          reject(data);
        },
        complete() {
          ac.abort();
          onDone();
        }
      });
    });
    return promise;
  }
  function observableToReadableStream(observable2, signal) {
    let unsub = null;
    const onAbort = () => {
      unsub?.unsubscribe();
      unsub = null;
      signal.removeEventListener("abort", onAbort);
    };
    return new ReadableStream({
      start(controller) {
        unsub = observable2.subscribe({
          next(data) {
            controller.enqueue({
              ok: true,
              value: data
            });
          },
          error(error) {
            controller.enqueue({
              ok: false,
              error
            });
            controller.close();
          },
          complete() {
            controller.close();
          }
        });
        if (signal.aborted) {
          onAbort();
        } else {
          signal.addEventListener("abort", onAbort, {
            once: true
          });
        }
      },
      cancel() {
        onAbort();
      }
    });
  }
  function observableToAsyncIterable(observable2, signal) {
    const stream = observableToReadableStream(observable2, signal);
    const reader = stream.getReader();
    const iterator = {
      async next() {
        const value = await reader.read();
        if (value.done) {
          return {
            value: undefined,
            done: true
          };
        }
        const { value: result } = value;
        if (!result.ok) {
          throw result.error;
        }
        return {
          value: result.value,
          done: false
        };
      },
      async return() {
        await reader.cancel();
        return {
          value: undefined,
          done: true
        };
      }
    };
    return {
      [Symbol.asyncIterator]() {
        return iterator;
      }
    };
  }
  exports.isObservable = isObservable;
  exports.observable = observable;
  exports.observableToAsyncIterable = observableToAsyncIterable;
  exports.observableToPromise = observableToPromise;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/rpc/codes.js
var require_codes = __commonJS((exports) => {
  var TRPC_ERROR_CODES_BY_KEY = {
    PARSE_ERROR: -32700,
    BAD_REQUEST: -32600,
    INTERNAL_SERVER_ERROR: -32603,
    NOT_IMPLEMENTED: -32603,
    BAD_GATEWAY: -32603,
    SERVICE_UNAVAILABLE: -32603,
    GATEWAY_TIMEOUT: -32603,
    UNAUTHORIZED: -32001,
    FORBIDDEN: -32003,
    NOT_FOUND: -32004,
    METHOD_NOT_SUPPORTED: -32005,
    TIMEOUT: -32008,
    CONFLICT: -32009,
    PRECONDITION_FAILED: -32012,
    PAYLOAD_TOO_LARGE: -32013,
    UNSUPPORTED_MEDIA_TYPE: -32015,
    UNPROCESSABLE_CONTENT: -32022,
    TOO_MANY_REQUESTS: -32029,
    CLIENT_CLOSED_REQUEST: -32099
  };
  var TRPC_ERROR_CODES_BY_NUMBER = {
    [-32700]: "PARSE_ERROR",
    [-32600]: "BAD_REQUEST",
    [-32603]: "INTERNAL_SERVER_ERROR",
    [-32001]: "UNAUTHORIZED",
    [-32003]: "FORBIDDEN",
    [-32004]: "NOT_FOUND",
    [-32005]: "METHOD_NOT_SUPPORTED",
    [-32008]: "TIMEOUT",
    [-32009]: "CONFLICT",
    [-32012]: "PRECONDITION_FAILED",
    [-32013]: "PAYLOAD_TOO_LARGE",
    [-32015]: "UNSUPPORTED_MEDIA_TYPE",
    [-32022]: "UNPROCESSABLE_CONTENT",
    [-32029]: "TOO_MANY_REQUESTS",
    [-32099]: "CLIENT_CLOSED_REQUEST"
  };
  exports.TRPC_ERROR_CODES_BY_KEY = TRPC_ERROR_CODES_BY_KEY;
  exports.TRPC_ERROR_CODES_BY_NUMBER = TRPC_ERROR_CODES_BY_NUMBER;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/utils.js
var require_utils = __commonJS((exports) => {
  var unsetMarker = Symbol();
  function mergeWithoutOverrides(obj1, ...objs) {
    const newObj = Object.assign(Object.create(null), obj1);
    for (const overrides of objs) {
      for (const key in overrides) {
        if (key in newObj && newObj[key] !== overrides[key]) {
          throw new Error(`Duplicate key ${key}`);
        }
        newObj[key] = overrides[key];
      }
    }
    return newObj;
  }
  function isObject(value) {
    return !!value && !Array.isArray(value) && typeof value === "object";
  }
  function isFunction(fn) {
    return typeof fn === "function";
  }
  function omitPrototype(obj) {
    return Object.assign(Object.create(null), obj);
  }
  var asyncIteratorsSupported = typeof Symbol === "function" && !!Symbol.asyncIterator;
  function isAsyncIterable(value) {
    return asyncIteratorsSupported && isObject(value) && Symbol.asyncIterator in value;
  }
  var run = (fn) => fn();
  function noop() {}
  function identity(it) {
    return it;
  }
  function assert(condition, msg = "no additional info") {
    if (!condition) {
      throw new Error(`AssertionError: ${msg}`);
    }
  }
  function sleep(ms = 0) {
    return new Promise((res) => setTimeout(res, ms));
  }
  function abortSignalsAnyPonyfill(signals) {
    if (typeof AbortSignal.any === "function") {
      return AbortSignal.any(signals);
    }
    const ac = new AbortController;
    for (const signal of signals) {
      if (signal.aborted) {
        trigger();
        break;
      }
      signal.addEventListener("abort", trigger, {
        once: true
      });
    }
    return ac.signal;
    function trigger() {
      ac.abort();
      for (const signal of signals) {
        signal.removeEventListener("abort", trigger);
      }
    }
  }
  exports.abortSignalsAnyPonyfill = abortSignalsAnyPonyfill;
  exports.assert = assert;
  exports.identity = identity;
  exports.isAsyncIterable = isAsyncIterable;
  exports.isFunction = isFunction;
  exports.isObject = isObject;
  exports.mergeWithoutOverrides = mergeWithoutOverrides;
  exports.noop = noop;
  exports.omitPrototype = omitPrototype;
  exports.run = run;
  exports.sleep = sleep;
  exports.unsetMarker = unsetMarker;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/getHTTPStatusCode.js
var require_getHTTPStatusCode = __commonJS((exports) => {
  var codes = require_codes();
  var utils = require_utils();
  var JSONRPC2_TO_HTTP_CODE = {
    PARSE_ERROR: 400,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    METHOD_NOT_SUPPORTED: 405,
    TIMEOUT: 408,
    CONFLICT: 409,
    PRECONDITION_FAILED: 412,
    PAYLOAD_TOO_LARGE: 413,
    UNSUPPORTED_MEDIA_TYPE: 415,
    UNPROCESSABLE_CONTENT: 422,
    TOO_MANY_REQUESTS: 429,
    CLIENT_CLOSED_REQUEST: 499,
    INTERNAL_SERVER_ERROR: 500,
    NOT_IMPLEMENTED: 501,
    BAD_GATEWAY: 502,
    SERVICE_UNAVAILABLE: 503,
    GATEWAY_TIMEOUT: 504
  };
  var HTTP_CODE_TO_JSONRPC2 = {
    400: "BAD_REQUEST",
    401: "UNAUTHORIZED",
    403: "FORBIDDEN",
    404: "NOT_FOUND",
    405: "METHOD_NOT_SUPPORTED",
    408: "TIMEOUT",
    409: "CONFLICT",
    412: "PRECONDITION_FAILED",
    413: "PAYLOAD_TOO_LARGE",
    415: "UNSUPPORTED_MEDIA_TYPE",
    422: "UNPROCESSABLE_CONTENT",
    429: "TOO_MANY_REQUESTS",
    499: "CLIENT_CLOSED_REQUEST",
    500: "INTERNAL_SERVER_ERROR",
    501: "NOT_IMPLEMENTED",
    502: "BAD_GATEWAY",
    503: "SERVICE_UNAVAILABLE",
    504: "GATEWAY_TIMEOUT"
  };
  function getStatusCodeFromKey(code) {
    return JSONRPC2_TO_HTTP_CODE[code] ?? 500;
  }
  function getStatusKeyFromCode(code) {
    return HTTP_CODE_TO_JSONRPC2[code] ?? "INTERNAL_SERVER_ERROR";
  }
  function getHTTPStatusCode(json) {
    const arr = Array.isArray(json) ? json : [
      json
    ];
    const httpStatuses = new Set(arr.map((res) => {
      if ("error" in res && utils.isObject(res.error.data)) {
        if (typeof res.error.data?.["httpStatus"] === "number") {
          return res.error.data["httpStatus"];
        }
        const code = codes.TRPC_ERROR_CODES_BY_NUMBER[res.error.code];
        return getStatusCodeFromKey(code);
      }
      return 200;
    }));
    if (httpStatuses.size !== 1) {
      return 207;
    }
    const httpStatus = httpStatuses.values().next().value;
    return httpStatus;
  }
  function getHTTPStatusCodeFromError(error) {
    return getStatusCodeFromKey(error.code);
  }
  exports.HTTP_CODE_TO_JSONRPC2 = HTTP_CODE_TO_JSONRPC2;
  exports.JSONRPC2_TO_HTTP_CODE = JSONRPC2_TO_HTTP_CODE;
  exports.getHTTPStatusCode = getHTTPStatusCode;
  exports.getHTTPStatusCodeFromError = getHTTPStatusCodeFromError;
  exports.getStatusCodeFromKey = getStatusCodeFromKey;
  exports.getStatusKeyFromCode = getStatusKeyFromCode;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/getErrorShape.js
var require_getErrorShape = __commonJS((exports) => {
  var getHTTPStatusCode = require_getHTTPStatusCode();
  var codes = require_codes();
  function getErrorShape(opts) {
    const { path, error, config } = opts;
    const { code } = opts.error;
    const shape = {
      message: error.message,
      code: codes.TRPC_ERROR_CODES_BY_KEY[code],
      data: {
        code,
        httpStatus: getHTTPStatusCode.getHTTPStatusCodeFromError(error)
      }
    };
    if (config.isDev && typeof opts.error.stack === "string") {
      shape.data.stack = opts.error.stack;
    }
    if (typeof path === "string") {
      shape.data.path = path;
    }
    return config.errorFormatter({
      ...opts,
      shape
    });
  }
  exports.getErrorShape = getErrorShape;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError.js
var require_TRPCError = __commonJS((exports) => {
  var utils = require_utils();
  function _define_property(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }

  class UnknownCauseError extends Error {
  }
  function getCauseFromUnknown(cause) {
    if (cause instanceof Error) {
      return cause;
    }
    const type = typeof cause;
    if (type === "undefined" || type === "function" || cause === null) {
      return;
    }
    if (type !== "object") {
      return new Error(String(cause));
    }
    if (utils.isObject(cause)) {
      const err = new UnknownCauseError;
      for (const key in cause) {
        err[key] = cause[key];
      }
      return err;
    }
    return;
  }
  function getTRPCErrorFromUnknown(cause) {
    if (cause instanceof TRPCError) {
      return cause;
    }
    if (cause instanceof Error && cause.name === "TRPCError") {
      return cause;
    }
    const trpcError = new TRPCError({
      code: "INTERNAL_SERVER_ERROR",
      cause
    });
    if (cause instanceof Error && cause.stack) {
      trpcError.stack = cause.stack;
    }
    return trpcError;
  }

  class TRPCError extends Error {
    constructor(opts) {
      const cause = getCauseFromUnknown(opts.cause);
      const message = opts.message ?? cause?.message ?? opts.code;
      super(message, {
        cause
      }), _define_property(this, "cause", undefined), _define_property(this, "code", undefined);
      this.code = opts.code;
      this.name = "TRPCError";
      if (!this.cause) {
        this.cause = cause;
      }
    }
  }
  exports.TRPCError = TRPCError;
  exports.getCauseFromUnknown = getCauseFromUnknown;
  exports.getTRPCErrorFromUnknown = getTRPCErrorFromUnknown;
});

// node_modules/@trpc/server/dist/vendor/unpromise/unpromise.js
var require_unpromise = __commonJS((exports) => {
  function _define_property(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  var _computedKey;
  var subscribableCache = new WeakMap;
  var NOOP = () => {};
  _computedKey = Symbol.toStringTag;
  var _computedKey1 = _computedKey;

  class Unpromise {
    subscribe() {
      let promise;
      let unsubscribe;
      const { settlement } = this;
      if (settlement === null) {
        if (this.subscribers === null) {
          throw new Error("Unpromise settled but still has subscribers");
        }
        const subscriber = withResolvers();
        this.subscribers = listWithMember(this.subscribers, subscriber);
        promise = subscriber.promise;
        unsubscribe = () => {
          if (this.subscribers !== null) {
            this.subscribers = listWithoutMember(this.subscribers, subscriber);
          }
        };
      } else {
        const { status } = settlement;
        if (status === "fulfilled") {
          promise = Promise.resolve(settlement.value);
        } else {
          promise = Promise.reject(settlement.reason);
        }
        unsubscribe = NOOP;
      }
      return Object.assign(promise, {
        unsubscribe
      });
    }
    then(onfulfilled, onrejected) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.then(onfulfilled, onrejected), {
        unsubscribe
      });
    }
    catch(onrejected) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.catch(onrejected), {
        unsubscribe
      });
    }
    finally(onfinally) {
      const subscribed = this.subscribe();
      const { unsubscribe } = subscribed;
      return Object.assign(subscribed.finally(onfinally), {
        unsubscribe
      });
    }
    static proxy(promise) {
      const cached = Unpromise.getSubscribablePromise(promise);
      return typeof cached !== "undefined" ? cached : Unpromise.createSubscribablePromise(promise);
    }
    static createSubscribablePromise(promise) {
      const created = new Unpromise(promise);
      subscribableCache.set(promise, created);
      subscribableCache.set(created, created);
      return created;
    }
    static getSubscribablePromise(promise) {
      return subscribableCache.get(promise);
    }
    static resolve(value) {
      const promise = typeof value === "object" && value !== null && "then" in value && typeof value.then === "function" ? value : Promise.resolve(value);
      return Unpromise.proxy(promise).subscribe();
    }
    static async any(values) {
      const valuesArray = Array.isArray(values) ? values : [
        ...values
      ];
      const subscribedPromises = valuesArray.map(Unpromise.resolve);
      try {
        return await Promise.any(subscribedPromises);
      } finally {
        subscribedPromises.forEach(({ unsubscribe }) => {
          unsubscribe();
        });
      }
    }
    static async race(values) {
      const valuesArray = Array.isArray(values) ? values : [
        ...values
      ];
      const subscribedPromises = valuesArray.map(Unpromise.resolve);
      try {
        return await Promise.race(subscribedPromises);
      } finally {
        subscribedPromises.forEach(({ unsubscribe }) => {
          unsubscribe();
        });
      }
    }
    static async raceReferences(promises) {
      const selfPromises = promises.map(resolveSelfTuple);
      try {
        return await Promise.race(selfPromises);
      } finally {
        for (const promise of selfPromises) {
          promise.unsubscribe();
        }
      }
    }
    constructor(arg) {
      _define_property(this, "promise", undefined);
      _define_property(this, "subscribers", []);
      _define_property(this, "settlement", null);
      _define_property(this, _computedKey1, "Unpromise");
      if (typeof arg === "function") {
        this.promise = new Promise(arg);
      } else {
        this.promise = arg;
      }
      const thenReturn = this.promise.then((value) => {
        const { subscribers } = this;
        this.subscribers = null;
        this.settlement = {
          status: "fulfilled",
          value
        };
        subscribers?.forEach(({ resolve }) => {
          resolve(value);
        });
      });
      if ("catch" in thenReturn) {
        thenReturn.catch((reason) => {
          const { subscribers } = this;
          this.subscribers = null;
          this.settlement = {
            status: "rejected",
            reason
          };
          subscribers?.forEach(({ reject }) => {
            reject(reason);
          });
        });
      }
    }
  }
  function resolveSelfTuple(promise) {
    return Unpromise.proxy(promise).then(() => [
      promise
    ]);
  }
  function withResolvers() {
    let resolve;
    let reject;
    const promise = new Promise((_resolve, _reject) => {
      resolve = _resolve;
      reject = _reject;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  function listWithMember(arr, member) {
    return [
      ...arr,
      member
    ];
  }
  function listWithoutIndex(arr, index) {
    return [
      ...arr.slice(0, index),
      ...arr.slice(index + 1)
    ];
  }
  function listWithoutMember(arr, member) {
    const index = arr.indexOf(member);
    if (index !== -1) {
      return listWithoutIndex(arr, index);
    }
    return arr;
  }
  exports.Unpromise = Unpromise;
  exports.resolveSelfTuple = resolveSelfTuple;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/abortError.js
var require_abortError = __commonJS((exports) => {
  var utils = require_utils();
  function isAbortError(error) {
    return utils.isObject(error) && error["name"] === "AbortError";
  }
  function throwAbortError(message = "AbortError") {
    throw new DOMException(message, "AbortError");
  }
  exports.isAbortError = isAbortError;
  exports.throwAbortError = throwAbortError;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/disposable.js
var require_disposable = __commonJS((exports) => {
  var _Symbol;
  var _Symbol1;
  (_Symbol = Symbol).dispose ?? (_Symbol.dispose = Symbol());
  (_Symbol1 = Symbol).asyncDispose ?? (_Symbol1.asyncDispose = Symbol());
  function makeResource(thing, dispose) {
    const it = thing;
    const existing = it[Symbol.dispose];
    it[Symbol.dispose] = () => {
      dispose();
      existing?.();
    };
    return it;
  }
  function makeAsyncResource(thing, dispose) {
    const it = thing;
    const existing = it[Symbol.asyncDispose];
    it[Symbol.asyncDispose] = async () => {
      await dispose();
      await existing?.();
    };
    return it;
  }
  exports.makeAsyncResource = makeAsyncResource;
  exports.makeResource = makeResource;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/timerResource.js
var require_timerResource = __commonJS((exports) => {
  var disposable = require_disposable();
  var disposablePromiseTimerResult = Symbol();
  function timerResource(ms) {
    let timer = null;
    return disposable.makeResource({
      start() {
        if (timer) {
          throw new Error("Timer already started");
        }
        const promise = new Promise((resolve) => {
          timer = setTimeout(() => resolve(disposablePromiseTimerResult), ms);
        });
        return promise;
      }
    }, () => {
      if (timer) {
        clearTimeout(timer);
      }
    });
  }
  exports.disposablePromiseTimerResult = disposablePromiseTimerResult;
  exports.timerResource = timerResource;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/asyncIterable.js
var require_asyncIterable = __commonJS((exports) => {
  var unpromise = require_unpromise();
  var abortError = require_abortError();
  var disposable = require_disposable();
  var timerResource = require_timerResource();
  function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== undefined) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose)
          throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === undefined) {
        if (!Symbol.dispose)
          throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async)
          inner = dispose;
      }
      if (typeof dispose !== "function")
        throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function() {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({
        value,
        dispose,
        async
      });
    } else if (async) {
      env.stack.push({
        async: true
      });
    }
    return value;
  }
  function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env2) {
      function fail(e) {
        env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
        env2.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env2.stack.pop()) {
          try {
            if (!r.async && s === 1)
              return s = 0, env2.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1)
          return env2.hasError ? Promise.reject(env2.error) : Promise.resolve();
        if (env2.hasError)
          throw env2.error;
      }
      return next();
    })(env);
  }
  function iteratorResource(iterable) {
    const iterator = iterable[Symbol.asyncIterator]();
    return disposable.makeAsyncResource(iterator, async () => {
      await iterator.return?.();
    });
  }
  async function* withMaxDuration(iterable, opts) {
    const env = {
      stack: [],
      error: undefined,
      hasError: false
    };
    try {
      const iterator = _ts_add_disposable_resource(env, iteratorResource(iterable), true);
      const timer = _ts_add_disposable_resource(env, timerResource.timerResource(opts.maxDurationMs), false);
      const timerPromise = timer.start();
      let result;
      while (true) {
        result = await unpromise.Unpromise.race([
          iterator.next(),
          timerPromise
        ]);
        if (result === timerResource.disposablePromiseTimerResult) {
          abortError.throwAbortError();
        }
        if (result.done) {
          return result;
        }
        yield result.value;
        result = null;
      }
    } catch (e) {
      env.error = e;
      env.hasError = true;
    } finally {
      const result = _ts_dispose_resources(env);
      if (result)
        await result;
    }
  }
  async function* takeWithGrace(iterable, opts) {
    const env = {
      stack: [],
      error: undefined,
      hasError: false
    };
    try {
      const iterator = _ts_add_disposable_resource(env, iteratorResource(iterable), true);
      let result;
      const timer = _ts_add_disposable_resource(env, timerResource.timerResource(opts.gracePeriodMs), false);
      let count = opts.count;
      let timerPromise = new Promise(() => {});
      while (true) {
        result = await unpromise.Unpromise.race([
          iterator.next(),
          timerPromise
        ]);
        if (result === timerResource.disposablePromiseTimerResult) {
          abortError.throwAbortError();
        }
        if (result.done) {
          return result.value;
        }
        yield result.value;
        if (--count === 0) {
          timerPromise = timer.start();
        }
        result = null;
      }
    } catch (e) {
      env.error = e;
      env.hasError = true;
    } finally {
      const result = _ts_dispose_resources(env);
      if (result)
        await result;
    }
  }
  exports.iteratorResource = iteratorResource;
  exports.takeWithGrace = takeWithGrace;
  exports.withMaxDuration = withMaxDuration;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/createDeferred.js
var require_createDeferred = __commonJS((exports) => {
  function createDeferred() {
    let resolve;
    let reject;
    const promise = new Promise((res, rej) => {
      resolve = res;
      reject = rej;
    });
    return {
      promise,
      resolve,
      reject
    };
  }
  exports.createDeferred = createDeferred;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/mergeAsyncIterables.js
var require_mergeAsyncIterables = __commonJS((exports) => {
  var createDeferred = require_createDeferred();
  var disposable = require_disposable();
  function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== undefined) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      {
        if (!Symbol.asyncDispose)
          throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === undefined) {
        if (!Symbol.dispose)
          throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        inner = dispose;
      }
      if (typeof dispose !== "function")
        throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function() {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({
        value,
        dispose,
        async
      });
    } else {
      env.stack.push({
        async: true
      });
    }
    return value;
  }
  function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env2) {
      function fail(e) {
        env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
        env2.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env2.stack.pop()) {
          try {
            if (!r.async && s === 1)
              return s = 0, env2.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1)
          return env2.hasError ? Promise.reject(env2.error) : Promise.resolve();
        if (env2.hasError)
          throw env2.error;
      }
      return next();
    })(env);
  }
  function createManagedIterator(iterable, onResult) {
    const iterator = iterable[Symbol.asyncIterator]();
    let state = "idle";
    function cleanup() {
      state = "done";
      onResult = () => {};
    }
    function pull() {
      if (state !== "idle") {
        return;
      }
      state = "pending";
      const next = iterator.next();
      next.then((result) => {
        if (result.done) {
          state = "done";
          onResult({
            status: "return",
            value: result.value
          });
          cleanup();
          return;
        }
        state = "idle";
        onResult({
          status: "yield",
          value: result.value
        });
      }).catch((cause) => {
        onResult({
          status: "error",
          error: cause
        });
        cleanup();
      });
    }
    return {
      pull,
      destroy: async () => {
        cleanup();
        await iterator.return?.();
      }
    };
  }
  function mergeAsyncIterables() {
    let state = "idle";
    let flushSignal = createDeferred.createDeferred();
    const iterables = [];
    const iterators = new Set;
    const buffer = [];
    function initIterable(iterable) {
      if (state !== "pending") {
        return;
      }
      const iterator = createManagedIterator(iterable, (result) => {
        if (state !== "pending") {
          return;
        }
        switch (result.status) {
          case "yield":
            buffer.push([
              iterator,
              result
            ]);
            break;
          case "return":
            iterators.delete(iterator);
            break;
          case "error":
            buffer.push([
              iterator,
              result
            ]);
            iterators.delete(iterator);
            break;
        }
        flushSignal.resolve();
      });
      iterators.add(iterator);
      iterator.pull();
    }
    return {
      add(iterable) {
        switch (state) {
          case "idle":
            iterables.push(iterable);
            break;
          case "pending":
            initIterable(iterable);
            break;
        }
      },
      async* [Symbol.asyncIterator]() {
        const env = {
          stack: [],
          error: undefined,
          hasError: false
        };
        try {
          if (state !== "idle") {
            throw new Error("Cannot iterate twice");
          }
          state = "pending";
          const _finally = _ts_add_disposable_resource(env, disposable.makeAsyncResource({}, async () => {
            state = "done";
            const errors = [];
            await Promise.all(Array.from(iterators.values()).map(async (it) => {
              try {
                await it.destroy();
              } catch (cause) {
                errors.push(cause);
              }
            }));
            buffer.length = 0;
            iterators.clear();
            flushSignal.resolve();
            if (errors.length > 0) {
              throw new AggregateError(errors);
            }
          }), true);
          while (iterables.length > 0) {
            initIterable(iterables.shift());
          }
          while (iterators.size > 0) {
            await flushSignal.promise;
            while (buffer.length > 0) {
              const [iterator, result] = buffer.shift();
              switch (result.status) {
                case "yield":
                  yield result.value;
                  iterator.pull();
                  break;
                case "error":
                  throw result.error;
              }
            }
            flushSignal = createDeferred.createDeferred();
          }
        } catch (e) {
          env.error = e;
          env.hasError = true;
        } finally {
          const result = _ts_dispose_resources(env);
          if (result)
            await result;
        }
      }
    };
  }
  exports.mergeAsyncIterables = mergeAsyncIterables;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/readableStreamFrom.js
var require_readableStreamFrom = __commonJS((exports) => {
  function readableStreamFrom(iterable) {
    const iterator = iterable[Symbol.asyncIterator]();
    return new ReadableStream({
      async cancel() {
        await iterator.return?.();
      },
      async pull(controller) {
        const result = await iterator.next();
        if (result.done) {
          controller.close();
          return;
        }
        controller.enqueue(result.value);
      }
    });
  }
  exports.readableStreamFrom = readableStreamFrom;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/withPing.js
var require_withPing = __commonJS((exports) => {
  var unpromise = require_unpromise();
  var asyncIterable = require_asyncIterable();
  var timerResource = require_timerResource();
  function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== undefined) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose)
          throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === undefined) {
        if (!Symbol.dispose)
          throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async)
          inner = dispose;
      }
      if (typeof dispose !== "function")
        throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function() {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({
        value,
        dispose,
        async
      });
    } else if (async) {
      env.stack.push({
        async: true
      });
    }
    return value;
  }
  function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env2) {
      function fail(e) {
        env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
        env2.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env2.stack.pop()) {
          try {
            if (!r.async && s === 1)
              return s = 0, env2.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1)
          return env2.hasError ? Promise.reject(env2.error) : Promise.resolve();
        if (env2.hasError)
          throw env2.error;
      }
      return next();
    })(env);
  }
  var PING_SYM = Symbol("ping");
  async function* withPing(iterable, pingIntervalMs) {
    const env = {
      stack: [],
      error: undefined,
      hasError: false
    };
    try {
      const iterator = _ts_add_disposable_resource(env, asyncIterable.iteratorResource(iterable), true);
      let result;
      let nextPromise = iterator.next();
      while (true) {
        const env2 = {
          stack: [],
          error: undefined,
          hasError: false
        };
        try {
          const pingPromise = _ts_add_disposable_resource(env2, timerResource.timerResource(pingIntervalMs), false);
          result = await unpromise.Unpromise.race([
            nextPromise,
            pingPromise.start()
          ]);
          if (result === timerResource.disposablePromiseTimerResult) {
            yield PING_SYM;
            continue;
          }
          if (result.done) {
            return result.value;
          }
          nextPromise = iterator.next();
          yield result.value;
          result = null;
        } catch (e) {
          env2.error = e;
          env2.hasError = true;
        } finally {
          _ts_dispose_resources(env2);
        }
      }
    } catch (e) {
      env.error = e;
      env.hasError = true;
    } finally {
      const result = _ts_dispose_resources(env);
      if (result)
        await result;
    }
  }
  exports.PING_SYM = PING_SYM;
  exports.withPing = withPing;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/jsonl.js
var require_jsonl = __commonJS((exports) => {
  var utils = require_utils();
  var asyncIterable = require_asyncIterable();
  var createDeferred = require_createDeferred();
  var disposable = require_disposable();
  var mergeAsyncIterables = require_mergeAsyncIterables();
  var readableStreamFrom = require_readableStreamFrom();
  var withPing = require_withPing();
  function _define_property(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }
    return obj;
  }
  function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== undefined) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose)
          throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === undefined) {
        if (!Symbol.dispose)
          throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async)
          inner = dispose;
      }
      if (typeof dispose !== "function")
        throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function() {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({
        value,
        dispose,
        async
      });
    } else if (async) {
      env.stack.push({
        async: true
      });
    }
    return value;
  }
  function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env2) {
      function fail(e) {
        env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
        env2.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env2.stack.pop()) {
          try {
            if (!r.async && s === 1)
              return s = 0, env2.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1)
          return env2.hasError ? Promise.reject(env2.error) : Promise.resolve();
        if (env2.hasError)
          throw env2.error;
      }
      return next();
    })(env);
  }
  function isPlainObject(value) {
    return Object.prototype.toString.call(value) === "[object Object]";
  }
  var CHUNK_VALUE_TYPE_PROMISE = 0;
  var CHUNK_VALUE_TYPE_ASYNC_ITERABLE = 1;
  var PROMISE_STATUS_FULFILLED = 0;
  var PROMISE_STATUS_REJECTED = 1;
  var ASYNC_ITERABLE_STATUS_RETURN = 0;
  var ASYNC_ITERABLE_STATUS_YIELD = 1;
  var ASYNC_ITERABLE_STATUS_ERROR = 2;
  function isPromise(value) {
    return (utils.isObject(value) || utils.isFunction(value)) && typeof value?.["then"] === "function" && typeof value?.["catch"] === "function";
  }

  class MaxDepthError extends Error {
    constructor(path) {
      super("Max depth reached at path: " + path.join(".")), _define_property(this, "path", undefined), this.path = path;
    }
  }
  async function* createBatchStreamProducer(opts) {
    const { data } = opts;
    let counter = 0;
    const placeholder = 0;
    const mergedIterables = mergeAsyncIterables.mergeAsyncIterables();
    function registerAsync(callback) {
      const idx = counter++;
      const iterable2 = callback(idx);
      mergedIterables.add(iterable2);
      return idx;
    }
    function encodePromise(promise, path) {
      return registerAsync(async function* (idx) {
        const error = checkMaxDepth(path);
        if (error) {
          promise.catch((cause) => {
            opts.onError?.({
              error: cause,
              path
            });
          });
          promise = Promise.reject(error);
        }
        try {
          const next = await promise;
          yield [
            idx,
            PROMISE_STATUS_FULFILLED,
            encode(next, path)
          ];
        } catch (cause) {
          opts.onError?.({
            error: cause,
            path
          });
          yield [
            idx,
            PROMISE_STATUS_REJECTED,
            opts.formatError?.({
              error: cause,
              path
            })
          ];
        }
      });
    }
    function encodeAsyncIterable(iterable2, path) {
      return registerAsync(async function* (idx) {
        const env = {
          stack: [],
          error: undefined,
          hasError: false
        };
        try {
          const error = checkMaxDepth(path);
          if (error) {
            throw error;
          }
          const iterator = _ts_add_disposable_resource(env, asyncIterable.iteratorResource(iterable2), true);
          try {
            while (true) {
              const next = await iterator.next();
              if (next.done) {
                yield [
                  idx,
                  ASYNC_ITERABLE_STATUS_RETURN,
                  encode(next.value, path)
                ];
                break;
              }
              yield [
                idx,
                ASYNC_ITERABLE_STATUS_YIELD,
                encode(next.value, path)
              ];
            }
          } catch (cause) {
            opts.onError?.({
              error: cause,
              path
            });
            yield [
              idx,
              ASYNC_ITERABLE_STATUS_ERROR,
              opts.formatError?.({
                error: cause,
                path
              })
            ];
          }
        } catch (e) {
          env.error = e;
          env.hasError = true;
        } finally {
          const result = _ts_dispose_resources(env);
          if (result)
            await result;
        }
      });
    }
    function checkMaxDepth(path) {
      if (opts.maxDepth && path.length > opts.maxDepth) {
        return new MaxDepthError(path);
      }
      return null;
    }
    function encodeAsync(value, path) {
      if (isPromise(value)) {
        return [
          CHUNK_VALUE_TYPE_PROMISE,
          encodePromise(value, path)
        ];
      }
      if (utils.isAsyncIterable(value)) {
        if (opts.maxDepth && path.length >= opts.maxDepth) {
          throw new Error("Max depth reached");
        }
        return [
          CHUNK_VALUE_TYPE_ASYNC_ITERABLE,
          encodeAsyncIterable(value, path)
        ];
      }
      return null;
    }
    function encode(value, path) {
      if (value === undefined) {
        return [
          []
        ];
      }
      const reg = encodeAsync(value, path);
      if (reg) {
        return [
          [
            placeholder
          ],
          [
            null,
            ...reg
          ]
        ];
      }
      if (!isPlainObject(value)) {
        return [
          [
            value
          ]
        ];
      }
      const newObj = {};
      const asyncValues = [];
      for (const [key, item] of Object.entries(value)) {
        const transformed = encodeAsync(item, [
          ...path,
          key
        ]);
        if (!transformed) {
          newObj[key] = item;
          continue;
        }
        newObj[key] = placeholder;
        asyncValues.push([
          key,
          ...transformed
        ]);
      }
      return [
        [
          newObj
        ],
        ...asyncValues
      ];
    }
    const newHead = {};
    for (const [key, item] of Object.entries(data)) {
      newHead[key] = encode(item, [
        key
      ]);
    }
    yield newHead;
    let iterable = mergedIterables;
    if (opts.pingMs) {
      iterable = withPing.withPing(mergedIterables, opts.pingMs);
    }
    for await (const value of iterable) {
      yield value;
    }
  }
  function jsonlStreamProducer(opts) {
    let stream = readableStreamFrom.readableStreamFrom(createBatchStreamProducer(opts));
    const { serialize } = opts;
    if (serialize) {
      stream = stream.pipeThrough(new TransformStream({
        transform(chunk, controller) {
          if (chunk === withPing.PING_SYM) {
            controller.enqueue(withPing.PING_SYM);
          } else {
            controller.enqueue(serialize(chunk));
          }
        }
      }));
    }
    return stream.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        if (chunk === withPing.PING_SYM) {
          controller.enqueue(" ");
        } else {
          controller.enqueue(JSON.stringify(chunk) + `
`);
        }
      }
    })).pipeThrough(new TextEncoderStream);
  }

  class AsyncError extends Error {
    constructor(data) {
      super("Received error from server"), _define_property(this, "data", undefined), this.data = data;
    }
  }
  var nodeJsStreamToReaderEsque = (source) => {
    return {
      getReader() {
        const stream = new ReadableStream({
          start(controller) {
            source.on("data", (chunk) => {
              controller.enqueue(chunk);
            });
            source.on("end", () => {
              controller.close();
            });
            source.on("error", (error) => {
              controller.error(error);
            });
          }
        });
        return stream.getReader();
      }
    };
  };
  function createLineAccumulator(from) {
    const reader = "getReader" in from ? from.getReader() : nodeJsStreamToReaderEsque(from).getReader();
    let lineAggregate = "";
    return new ReadableStream({
      async pull(controller) {
        const { done, value } = await reader.read();
        if (done) {
          controller.close();
        } else {
          controller.enqueue(value);
        }
      },
      cancel() {
        return reader.cancel();
      }
    }).pipeThrough(new TextDecoderStream).pipeThrough(new TransformStream({
      transform(chunk, controller) {
        lineAggregate += chunk;
        const parts = lineAggregate.split(`
`);
        lineAggregate = parts.pop() ?? "";
        for (const part of parts) {
          controller.enqueue(part);
        }
      }
    }));
  }
  function createConsumerStream(from) {
    const stream = createLineAccumulator(from);
    let sentHead = false;
    return stream.pipeThrough(new TransformStream({
      transform(line, controller) {
        if (!sentHead) {
          const head = JSON.parse(line);
          controller.enqueue(head);
          sentHead = true;
        } else {
          const chunk = JSON.parse(line);
          controller.enqueue(chunk);
        }
      }
    }));
  }
  function createStreamsManager(abortController) {
    const controllerMap = new Map;
    function isEmpty() {
      return Array.from(controllerMap.values()).every((c) => c.closed);
    }
    function createStreamController() {
      let originalController;
      const stream = new ReadableStream({
        start(controller) {
          originalController = controller;
        }
      });
      const streamController = {
        enqueue: (v) => originalController.enqueue(v),
        close: () => {
          originalController.close();
          clear();
          if (isEmpty()) {
            abortController.abort();
          }
        },
        closed: false,
        getReaderResource: () => {
          const reader = stream.getReader();
          return disposable.makeResource(reader, () => {
            reader.releaseLock();
            streamController.close();
          });
        },
        error: (reason) => {
          originalController.error(reason);
          clear();
        }
      };
      function clear() {
        Object.assign(streamController, {
          closed: true,
          close: () => {},
          enqueue: () => {},
          getReaderResource: null,
          error: () => {}
        });
      }
      return streamController;
    }
    function getOrCreate(chunkId) {
      let c = controllerMap.get(chunkId);
      if (!c) {
        c = createStreamController();
        controllerMap.set(chunkId, c);
      }
      return c;
    }
    function cancelAll(reason) {
      for (const controller of controllerMap.values()) {
        controller.error(reason);
      }
    }
    return {
      getOrCreate,
      isEmpty,
      cancelAll
    };
  }
  async function jsonlStreamConsumer(opts) {
    const { deserialize = (v) => v } = opts;
    let source = createConsumerStream(opts.from);
    if (deserialize) {
      source = source.pipeThrough(new TransformStream({
        transform(chunk, controller) {
          controller.enqueue(deserialize(chunk));
        }
      }));
    }
    let headDeferred = createDeferred.createDeferred();
    const streamManager = createStreamsManager(opts.abortController);
    function decodeChunkDefinition(value) {
      const [_path, type, chunkId] = value;
      const controller = streamManager.getOrCreate(chunkId);
      switch (type) {
        case CHUNK_VALUE_TYPE_PROMISE: {
          return utils.run(async () => {
            const env = {
              stack: [],
              error: undefined,
              hasError: false
            };
            try {
              const reader = _ts_add_disposable_resource(env, controller.getReaderResource(), false);
              const { value: value2 } = await reader.read();
              const [_chunkId, status, data] = value2;
              switch (status) {
                case PROMISE_STATUS_FULFILLED:
                  return decode(data);
                case PROMISE_STATUS_REJECTED:
                  throw opts.formatError?.({
                    error: data
                  }) ?? new AsyncError(data);
              }
            } catch (e) {
              env.error = e;
              env.hasError = true;
            } finally {
              _ts_dispose_resources(env);
            }
          });
        }
        case CHUNK_VALUE_TYPE_ASYNC_ITERABLE: {
          return utils.run(async function* () {
            const env = {
              stack: [],
              error: undefined,
              hasError: false
            };
            try {
              const reader = _ts_add_disposable_resource(env, controller.getReaderResource(), false);
              while (true) {
                const { value: value2 } = await reader.read();
                const [_chunkId, status, data] = value2;
                switch (status) {
                  case ASYNC_ITERABLE_STATUS_YIELD:
                    yield decode(data);
                    break;
                  case ASYNC_ITERABLE_STATUS_RETURN:
                    return decode(data);
                  case ASYNC_ITERABLE_STATUS_ERROR:
                    throw opts.formatError?.({
                      error: data
                    }) ?? new AsyncError(data);
                }
              }
            } catch (e) {
              env.error = e;
              env.hasError = true;
            } finally {
              _ts_dispose_resources(env);
            }
          });
        }
      }
    }
    function decode(value) {
      const [[data], ...asyncProps] = value;
      for (const value2 of asyncProps) {
        const [key] = value2;
        const decoded = decodeChunkDefinition(value2);
        if (key === null) {
          return decoded;
        }
        data[key] = decoded;
      }
      return data;
    }
    const closeOrAbort = (reason) => {
      headDeferred?.reject(reason);
      streamManager.cancelAll(reason);
    };
    source.pipeTo(new WritableStream({
      write(chunkOrHead) {
        if (headDeferred) {
          const head = chunkOrHead;
          for (const [key, value] of Object.entries(chunkOrHead)) {
            const parsed = decode(value);
            head[key] = parsed;
          }
          headDeferred.resolve(head);
          headDeferred = null;
          return;
        }
        const chunk = chunkOrHead;
        const [idx] = chunk;
        const controller = streamManager.getOrCreate(idx);
        controller.enqueue(chunk);
      },
      close: () => closeOrAbort(new Error("Stream closed")),
      abort: closeOrAbort
    }), {
      signal: opts.abortController.signal
    }).catch((error) => {
      opts.onError?.({
        error
      });
      closeOrAbort(error);
    });
    return [
      await headDeferred.promise,
      streamManager
    ];
  }
  exports.isPromise = isPromise;
  exports.jsonlStreamConsumer = jsonlStreamConsumer;
  exports.jsonlStreamProducer = jsonlStreamProducer;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/tracked.js
var require_tracked = __commonJS((exports) => {
  var trackedSymbol = Symbol();
  function sse(event) {
    return tracked(event.id, event.data);
  }
  function isTrackedEnvelope(value) {
    return Array.isArray(value) && value[2] === trackedSymbol;
  }
  function tracked(id, data) {
    if (id === "") {
      throw new Error("`id` must not be an empty string as empty string is the same as not setting the id at all");
    }
    return [
      id,
      data,
      trackedSymbol
    ];
  }
  exports.isTrackedEnvelope = isTrackedEnvelope;
  exports.sse = sse;
  exports.tracked = tracked;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/sse.js
var require_sse = __commonJS((exports) => {
  var unpromise = require_unpromise();
  var TRPCError = require_TRPCError();
  var abortError = require_abortError();
  var utils = require_utils();
  var tracked = require_tracked();
  var asyncIterable = require_asyncIterable();
  var disposable = require_disposable();
  var readableStreamFrom = require_readableStreamFrom();
  var timerResource = require_timerResource();
  var withPing = require_withPing();
  function _ts_add_disposable_resource(env, value, async) {
    if (value !== null && value !== undefined) {
      if (typeof value !== "object" && typeof value !== "function")
        throw new TypeError("Object expected.");
      var dispose, inner;
      if (async) {
        if (!Symbol.asyncDispose)
          throw new TypeError("Symbol.asyncDispose is not defined.");
        dispose = value[Symbol.asyncDispose];
      }
      if (dispose === undefined) {
        if (!Symbol.dispose)
          throw new TypeError("Symbol.dispose is not defined.");
        dispose = value[Symbol.dispose];
        if (async)
          inner = dispose;
      }
      if (typeof dispose !== "function")
        throw new TypeError("Object not disposable.");
      if (inner)
        dispose = function() {
          try {
            inner.call(this);
          } catch (e) {
            return Promise.reject(e);
          }
        };
      env.stack.push({
        value,
        dispose,
        async
      });
    } else if (async) {
      env.stack.push({
        async: true
      });
    }
    return value;
  }
  function _ts_dispose_resources(env) {
    var _SuppressedError = typeof SuppressedError === "function" ? SuppressedError : function(error, suppressed, message) {
      var e = new Error(message);
      return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
    };
    return (_ts_dispose_resources = function _ts_dispose_resources(env2) {
      function fail(e) {
        env2.error = env2.hasError ? new _SuppressedError(e, env2.error, "An error was suppressed during disposal.") : e;
        env2.hasError = true;
      }
      var r, s = 0;
      function next() {
        while (r = env2.stack.pop()) {
          try {
            if (!r.async && s === 1)
              return s = 0, env2.stack.push(r), Promise.resolve().then(next);
            if (r.dispose) {
              var result = r.dispose.call(r.value);
              if (r.async)
                return s |= 2, Promise.resolve(result).then(next, function(e) {
                  fail(e);
                  return next();
                });
            } else
              s |= 1;
          } catch (e) {
            fail(e);
          }
        }
        if (s === 1)
          return env2.hasError ? Promise.reject(env2.error) : Promise.resolve();
        if (env2.hasError)
          throw env2.error;
      }
      return next();
    })(env);
  }
  var PING_EVENT = "ping";
  var SERIALIZED_ERROR_EVENT = "serialized-error";
  var CONNECTED_EVENT = "connected";
  var RETURN_EVENT = "return";
  function sseStreamProducer(opts) {
    const { serialize = utils.identity } = opts;
    const ping = {
      enabled: opts.ping?.enabled ?? false,
      intervalMs: opts.ping?.intervalMs ?? 1000
    };
    const client = opts.client ?? {};
    if (ping.enabled && client.reconnectAfterInactivityMs && ping.intervalMs > client.reconnectAfterInactivityMs) {
      throw new Error(`Ping interval must be less than client reconnect interval to prevent unnecessary reconnection - ping.intervalMs: ${ping.intervalMs} client.reconnectAfterInactivityMs: ${client.reconnectAfterInactivityMs}`);
    }
    async function* generator() {
      yield {
        event: CONNECTED_EVENT,
        data: JSON.stringify(client)
      };
      let iterable = opts.data;
      if (opts.emitAndEndImmediately) {
        iterable = asyncIterable.takeWithGrace(iterable, {
          count: 1,
          gracePeriodMs: 1
        });
      }
      if (opts.maxDurationMs && opts.maxDurationMs > 0 && opts.maxDurationMs !== Infinity) {
        iterable = asyncIterable.withMaxDuration(iterable, {
          maxDurationMs: opts.maxDurationMs
        });
      }
      if (ping.enabled && ping.intervalMs !== Infinity && ping.intervalMs > 0) {
        iterable = withPing.withPing(iterable, ping.intervalMs);
      }
      let value;
      let chunk;
      for await (value of iterable) {
        if (value === withPing.PING_SYM) {
          yield {
            event: PING_EVENT,
            data: ""
          };
          continue;
        }
        chunk = tracked.isTrackedEnvelope(value) ? {
          id: value[0],
          data: value[1]
        } : {
          data: value
        };
        chunk.data = JSON.stringify(serialize(chunk.data));
        yield chunk;
        value = null;
        chunk = null;
      }
    }
    async function* generatorWithErrorHandling() {
      try {
        yield* generator();
        yield {
          event: RETURN_EVENT,
          data: ""
        };
      } catch (cause) {
        if (abortError.isAbortError(cause)) {
          return;
        }
        const error = TRPCError.getTRPCErrorFromUnknown(cause);
        const data = opts.formatError?.({
          error
        }) ?? null;
        yield {
          event: SERIALIZED_ERROR_EVENT,
          data: JSON.stringify(serialize(data))
        };
      }
    }
    const stream = readableStreamFrom.readableStreamFrom(generatorWithErrorHandling());
    return stream.pipeThrough(new TransformStream({
      transform(chunk, controller) {
        if ("event" in chunk) {
          controller.enqueue(`event: ${chunk.event}
`);
        }
        if ("data" in chunk) {
          controller.enqueue(`data: ${chunk.data}
`);
        }
        if ("id" in chunk) {
          controller.enqueue(`id: ${chunk.id}
`);
        }
        if ("comment" in chunk) {
          controller.enqueue(`: ${chunk.comment}
`);
        }
        controller.enqueue(`

`);
      }
    })).pipeThrough(new TextEncoderStream);
  }
  async function withTimeout(opts) {
    const env = {
      stack: [],
      error: undefined,
      hasError: false
    };
    try {
      const timeoutPromise = _ts_add_disposable_resource(env, timerResource.timerResource(opts.timeoutMs), false);
      const res = await unpromise.Unpromise.race([
        opts.promise,
        timeoutPromise.start()
      ]);
      if (res === timerResource.disposablePromiseTimerResult) {
        return await opts.onTimeout();
      }
      return res;
    } catch (e) {
      env.error = e;
      env.hasError = true;
    } finally {
      _ts_dispose_resources(env);
    }
  }
  function sseStreamConsumer(opts) {
    const { deserialize = (v) => v } = opts;
    let clientOptions = {};
    const signal = opts.signal;
    let _es = null;
    const createStream = () => new ReadableStream({
      async start(controller) {
        const [url, init] = await Promise.all([
          opts.url(),
          opts.init()
        ]);
        const eventSource = _es = new opts.EventSource(url, init);
        controller.enqueue({
          type: "connecting",
          eventSource: _es,
          event: null
        });
        eventSource.addEventListener(CONNECTED_EVENT, (_msg) => {
          const msg = _msg;
          const options = JSON.parse(msg.data);
          clientOptions = options;
          controller.enqueue({
            type: "connected",
            options,
            eventSource
          });
        });
        eventSource.addEventListener(SERIALIZED_ERROR_EVENT, (_msg) => {
          const msg = _msg;
          controller.enqueue({
            type: "serialized-error",
            error: deserialize(JSON.parse(msg.data)),
            eventSource
          });
        });
        eventSource.addEventListener(PING_EVENT, () => {
          controller.enqueue({
            type: "ping",
            eventSource
          });
        });
        eventSource.addEventListener(RETURN_EVENT, () => {
          eventSource.close();
          controller.close();
          _es = null;
        });
        eventSource.addEventListener("error", (event) => {
          if (eventSource.readyState === EventSource.CLOSED) {
            controller.error(event);
          } else {
            controller.enqueue({
              type: "connecting",
              eventSource,
              event
            });
          }
        });
        eventSource.addEventListener("message", (_msg) => {
          const msg = _msg;
          const chunk = deserialize(JSON.parse(msg.data));
          const def = {
            data: chunk
          };
          if (msg.lastEventId) {
            def.id = msg.lastEventId;
          }
          controller.enqueue({
            type: "data",
            data: def,
            eventSource
          });
        });
        const onAbort = () => {
          try {
            eventSource.close();
            controller.close();
          } catch {}
        };
        if (signal.aborted) {
          onAbort();
        } else {
          signal.addEventListener("abort", onAbort);
        }
      },
      cancel() {
        _es?.close();
      }
    });
    const getStreamResource = () => {
      let stream = createStream();
      let reader = stream.getReader();
      async function dispose() {
        await reader.cancel();
        _es = null;
      }
      return disposable.makeAsyncResource({
        read() {
          return reader.read();
        },
        async recreate() {
          await dispose();
          stream = createStream();
          reader = stream.getReader();
        }
      }, dispose);
    };
    return utils.run(async function* () {
      const env = {
        stack: [],
        error: undefined,
        hasError: false
      };
      try {
        const stream = _ts_add_disposable_resource(env, getStreamResource(), true);
        while (true) {
          let promise = stream.read();
          const timeoutMs = clientOptions.reconnectAfterInactivityMs;
          if (timeoutMs) {
            promise = withTimeout({
              promise,
              timeoutMs,
              onTimeout: async () => {
                const res = {
                  value: {
                    type: "timeout",
                    ms: timeoutMs,
                    eventSource: _es
                  },
                  done: false
                };
                await stream.recreate();
                return res;
              }
            });
          }
          const result = await promise;
          if (result.done) {
            return result.value;
          }
          yield result.value;
        }
      } catch (e) {
        env.error = e;
        env.hasError = true;
      } finally {
        const result = _ts_dispose_resources(env);
        if (result)
          await result;
      }
    });
  }
  var sseHeaders = {
    "Content-Type": "text/event-stream",
    "Cache-Control": "no-cache, no-transform",
    "X-Accel-Buffering": "no",
    Connection: "keep-alive"
  };
  exports.sseHeaders = sseHeaders;
  exports.sseStreamConsumer = sseStreamConsumer;
  exports.sseStreamProducer = sseStreamProducer;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/transformer.js
var require_transformer = __commonJS((exports) => {
  var utils = require_utils();
  function getDataTransformer(transformer) {
    if ("input" in transformer) {
      return transformer;
    }
    return {
      input: transformer,
      output: transformer
    };
  }
  var defaultTransformer = {
    input: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    },
    output: {
      serialize: (obj) => obj,
      deserialize: (obj) => obj
    }
  };
  function transformTRPCResponseItem(config, item) {
    if ("error" in item) {
      return {
        ...item,
        error: config.transformer.output.serialize(item.error)
      };
    }
    if ("data" in item.result) {
      return {
        ...item,
        result: {
          ...item.result,
          data: config.transformer.output.serialize(item.result.data)
        }
      };
    }
    return item;
  }
  function transformTRPCResponse(config, itemOrItems) {
    return Array.isArray(itemOrItems) ? itemOrItems.map((item) => transformTRPCResponseItem(config, item)) : transformTRPCResponseItem(config, itemOrItems);
  }
  function transformResultInner(response, transformer) {
    if ("error" in response) {
      const error = transformer.deserialize(response.error);
      return {
        ok: false,
        error: {
          ...response,
          error
        }
      };
    }
    const result = {
      ...response.result,
      ...(!response.result.type || response.result.type === "data") && {
        type: "data",
        data: transformer.deserialize(response.result.data)
      }
    };
    return {
      ok: true,
      result
    };
  }

  class TransformResultError extends Error {
    constructor() {
      super("Unable to transform response from server");
    }
  }
  function transformResult(response, transformer) {
    let result;
    try {
      result = transformResultInner(response, transformer);
    } catch {
      throw new TransformResultError;
    }
    if (!result.ok && (!utils.isObject(result.error.error) || typeof result.error.error["code"] !== "number")) {
      throw new TransformResultError;
    }
    if (result.ok && !utils.isObject(result.result)) {
      throw new TransformResultError;
    }
    return result;
  }
  exports.defaultTransformer = defaultTransformer;
  exports.getDataTransformer = getDataTransformer;
  exports.transformResult = transformResult;
  exports.transformTRPCResponse = transformTRPCResponse;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/createProxy.js
var require_createProxy = __commonJS((exports) => {
  var noop = () => {};
  var freezeIfAvailable = (obj) => {
    if (Object.freeze) {
      Object.freeze(obj);
    }
  };
  function createInnerProxy(callback, path, memo) {
    var _memo, _cacheKey;
    const cacheKey = path.join(".");
    (_memo = memo)[_cacheKey = cacheKey] ?? (_memo[_cacheKey] = new Proxy(noop, {
      get(_obj, key) {
        if (typeof key !== "string" || key === "then") {
          return;
        }
        return createInnerProxy(callback, [
          ...path,
          key
        ], memo);
      },
      apply(_1, _2, args) {
        const lastOfPath = path[path.length - 1];
        let opts = {
          args,
          path
        };
        if (lastOfPath === "call") {
          opts = {
            args: args.length >= 2 ? [
              args[1]
            ] : [],
            path: path.slice(0, -1)
          };
        } else if (lastOfPath === "apply") {
          opts = {
            args: args.length >= 2 ? args[1] : [],
            path: path.slice(0, -1)
          };
        }
        freezeIfAvailable(opts.args);
        freezeIfAvailable(opts.path);
        return callback(opts);
      }
    }));
    return memo[cacheKey];
  }
  var createRecursiveProxy = (callback) => createInnerProxy(callback, [], Object.create(null));
  var createFlatProxy = (callback) => {
    return new Proxy(noop, {
      get(_obj, name) {
        if (name === "then") {
          return;
        }
        return callback(name);
      }
    });
  };
  exports.createFlatProxy = createFlatProxy;
  exports.createRecursiveProxy = createRecursiveProxy;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/formatter.js
var require_formatter = __commonJS((exports) => {
  var defaultFormatter = ({ shape }) => {
    return shape;
  };
  exports.defaultFormatter = defaultFormatter;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/router.js
var require_router = __commonJS((exports) => {
  var createProxy = require_createProxy();
  var formatter = require_formatter();
  var TRPCError = require_TRPCError();
  var transformer = require_transformer();
  var utils = require_utils();
  var lazySymbol = Symbol("lazy");
  function once(fn) {
    const uncalled = Symbol();
    let result = uncalled;
    return () => {
      if (result === uncalled) {
        result = fn();
      }
      return result;
    };
  }
  function lazy(importRouter) {
    async function resolve() {
      const mod = await importRouter();
      if (isRouter(mod)) {
        return mod;
      }
      const routers = Object.values(mod);
      if (routers.length !== 1 || !isRouter(routers[0])) {
        throw new Error("Invalid router module - either define exactly 1 export or return the router directly.\nExample: `lazy(() => import('./slow.js').then((m) => m.slowRouter))`");
      }
      return routers[0];
    }
    resolve[lazySymbol] = true;
    return resolve;
  }
  function isLazy(input) {
    return typeof input === "function" && lazySymbol in input;
  }
  function isRouter(value) {
    return utils.isObject(value) && utils.isObject(value["_def"]) && "router" in value["_def"];
  }
  var emptyRouter = {
    _ctx: null,
    _errorShape: null,
    _meta: null,
    queries: {},
    mutations: {},
    subscriptions: {},
    errorFormatter: formatter.defaultFormatter,
    transformer: transformer.defaultTransformer
  };
  var reservedWords = [
    "then",
    "call",
    "apply"
  ];
  function createRouterFactory(config) {
    function createRouterInner(input) {
      const reservedWordsUsed = new Set(Object.keys(input).filter((v) => reservedWords.includes(v)));
      if (reservedWordsUsed.size > 0) {
        throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
      }
      const procedures = utils.omitPrototype({});
      const lazy2 = utils.omitPrototype({});
      function createLazyLoader(opts) {
        return {
          ref: opts.ref,
          load: once(async () => {
            const router2 = await opts.ref();
            const lazyPath = [
              ...opts.path,
              opts.key
            ];
            const lazyKey = lazyPath.join(".");
            opts.aggregate[opts.key] = step(router2._def.record, lazyPath);
            delete lazy2[lazyKey];
            for (const [nestedKey, nestedItem] of Object.entries(router2._def.lazy)) {
              const nestedRouterKey = [
                ...lazyPath,
                nestedKey
              ].join(".");
              lazy2[nestedRouterKey] = createLazyLoader({
                ref: nestedItem.ref,
                path: lazyPath,
                key: nestedKey,
                aggregate: opts.aggregate[opts.key]
              });
            }
          })
        };
      }
      function step(from, path = []) {
        const aggregate = utils.omitPrototype({});
        for (const [key, item] of Object.entries(from ?? {})) {
          if (isLazy(item)) {
            lazy2[[
              ...path,
              key
            ].join(".")] = createLazyLoader({
              path,
              ref: item,
              key,
              aggregate
            });
            continue;
          }
          if (isRouter(item)) {
            aggregate[key] = step(item._def.record, [
              ...path,
              key
            ]);
            continue;
          }
          if (!isProcedure(item)) {
            aggregate[key] = step(item, [
              ...path,
              key
            ]);
            continue;
          }
          const newPath = [
            ...path,
            key
          ].join(".");
          if (procedures[newPath]) {
            throw new Error(`Duplicate key: ${newPath}`);
          }
          procedures[newPath] = item;
          aggregate[key] = item;
        }
        return aggregate;
      }
      const record = step(input);
      const _def = {
        _config: config,
        router: true,
        procedures,
        lazy: lazy2,
        ...emptyRouter,
        record
      };
      const router = {
        ...record,
        _def,
        createCaller: createCallerFactory()({
          _def
        })
      };
      return router;
    }
    return createRouterInner;
  }
  function isProcedure(procedureOrRouter) {
    return typeof procedureOrRouter === "function";
  }
  async function getProcedureAtPath(router, path) {
    const { _def } = router;
    let procedure = _def.procedures[path];
    while (!procedure) {
      const key = Object.keys(_def.lazy).find((key2) => path.startsWith(key2));
      if (!key) {
        return null;
      }
      const lazyRouter = _def.lazy[key];
      await lazyRouter.load();
      procedure = _def.procedures[path];
    }
    return procedure;
  }
  async function callProcedure(opts) {
    const { type, path } = opts;
    const proc = await getProcedureAtPath(opts.router, path);
    if (!proc || !isProcedure(proc) || proc._def.type !== type && !opts.allowMethodOverride) {
      throw new TRPCError.TRPCError({
        code: "NOT_FOUND",
        message: `No "${type}"-procedure on path "${path}"`
      });
    }
    if (proc._def.type !== type && opts.allowMethodOverride && proc._def.type === "subscription") {
      throw new TRPCError.TRPCError({
        code: "METHOD_NOT_SUPPORTED",
        message: `Method override is not supported for subscriptions`
      });
    }
    return proc(opts);
  }
  function createCallerFactory() {
    return function createCallerInner(router) {
      const { _def } = router;
      return function createCaller(ctxOrCallback, opts) {
        return createProxy.createRecursiveProxy(async ({ path, args }) => {
          const fullPath = path.join(".");
          if (path.length === 1 && path[0] === "_def") {
            return _def;
          }
          const procedure = await getProcedureAtPath(router, fullPath);
          let ctx = undefined;
          try {
            if (!procedure) {
              throw new TRPCError.TRPCError({
                code: "NOT_FOUND",
                message: `No procedure found on path "${path}"`
              });
            }
            ctx = utils.isFunction(ctxOrCallback) ? await Promise.resolve(ctxOrCallback()) : ctxOrCallback;
            return await procedure({
              path: fullPath,
              getRawInput: async () => args[0],
              ctx,
              type: procedure._def.type,
              signal: opts?.signal
            });
          } catch (cause) {
            opts?.onError?.({
              ctx,
              error: TRPCError.getTRPCErrorFromUnknown(cause),
              input: args[0],
              path: fullPath,
              type: procedure?._def.type ?? "unknown"
            });
            throw cause;
          }
        });
      };
    };
  }
  function mergeRouters(...routerList) {
    const record = utils.mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
    const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
      if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== formatter.defaultFormatter) {
        if (currentErrorFormatter !== formatter.defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
          throw new Error("You seem to have several error formatters");
        }
        return nextRouter._def._config.errorFormatter;
      }
      return currentErrorFormatter;
    }, formatter.defaultFormatter);
    const transformer$1 = routerList.reduce((prev, current) => {
      if (current._def._config.transformer && current._def._config.transformer !== transformer.defaultTransformer) {
        if (prev !== transformer.defaultTransformer && prev !== current._def._config.transformer) {
          throw new Error("You seem to have several transformers");
        }
        return current._def._config.transformer;
      }
      return prev;
    }, transformer.defaultTransformer);
    const router = createRouterFactory({
      errorFormatter,
      transformer: transformer$1,
      isDev: routerList.every((r) => r._def._config.isDev),
      allowOutsideOfServer: routerList.every((r) => r._def._config.allowOutsideOfServer),
      isServer: routerList.every((r) => r._def._config.isServer),
      $types: routerList[0]?._def._config.$types
    })(record);
    return router;
  }
  exports.callProcedure = callProcedure;
  exports.createCallerFactory = createCallerFactory;
  exports.createRouterFactory = createRouterFactory;
  exports.getProcedureAtPath = getProcedureAtPath;
  exports.lazy = lazy;
  exports.mergeRouters = mergeRouters;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/parseConnectionParams.js
var require_parseConnectionParams = __commonJS((exports) => {
  var TRPCError = require_TRPCError();
  var utils = require_utils();
  function parseConnectionParamsFromUnknown(parsed) {
    try {
      if (parsed === null) {
        return null;
      }
      if (!utils.isObject(parsed)) {
        throw new Error("Expected object");
      }
      const nonStringValues = Object.entries(parsed).filter(([_key, value]) => typeof value !== "string");
      if (nonStringValues.length > 0) {
        throw new Error(`Expected connectionParams to be string values. Got ${nonStringValues.map(([key, value]) => `${key}: ${typeof value}`).join(", ")}`);
      }
      return parsed;
    } catch (cause) {
      throw new TRPCError.TRPCError({
        code: "PARSE_ERROR",
        message: "Invalid connection params shape",
        cause
      });
    }
  }
  function parseConnectionParamsFromString(str) {
    let parsed;
    try {
      parsed = JSON.parse(str);
    } catch (cause) {
      throw new TRPCError.TRPCError({
        code: "PARSE_ERROR",
        message: "Not JSON-parsable query params",
        cause
      });
    }
    return parseConnectionParamsFromUnknown(parsed);
  }
  exports.parseConnectionParamsFromString = parseConnectionParamsFromString;
  exports.parseConnectionParamsFromUnknown = parseConnectionParamsFromUnknown;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/contentType.js
var require_contentType = __commonJS((exports) => {
  var TRPCError = require_TRPCError();
  var router = require_router();
  var utils = require_utils();
  var parseConnectionParams = require_parseConnectionParams();
  function memo(fn) {
    let promise = null;
    let value = utils.unsetMarker;
    return {
      read: async () => {
        if (value !== utils.unsetMarker) {
          return value;
        }
        if (promise === null) {
          promise = fn().catch((cause) => {
            if (cause instanceof TRPCError.TRPCError) {
              throw cause;
            }
            throw new TRPCError.TRPCError({
              code: "BAD_REQUEST",
              message: cause instanceof Error ? cause.message : "Invalid input",
              cause
            });
          });
        }
        value = await promise;
        promise = null;
        return value;
      },
      result: () => {
        return value !== utils.unsetMarker ? value : undefined;
      }
    };
  }
  var jsonContentTypeHandler = {
    isMatch(req) {
      return !!req.headers.get("content-type")?.startsWith("application/json");
    },
    async parse(opts) {
      const { req } = opts;
      const isBatchCall = opts.searchParams.get("batch") === "1";
      const paths = isBatchCall ? opts.path.split(",") : [
        opts.path
      ];
      const getInputs = memo(async () => {
        let inputs = undefined;
        if (req.method === "GET") {
          const queryInput = opts.searchParams.get("input");
          if (queryInput) {
            inputs = JSON.parse(queryInput);
          }
        } else {
          inputs = await req.json();
        }
        if (inputs === undefined) {
          return {};
        }
        if (!isBatchCall) {
          return {
            0: opts.router._def._config.transformer.input.deserialize(inputs)
          };
        }
        if (!utils.isObject(inputs)) {
          throw new TRPCError.TRPCError({
            code: "BAD_REQUEST",
            message: '"input" needs to be an object when doing a batch call'
          });
        }
        const acc = {};
        for (const index of paths.keys()) {
          const input = inputs[index];
          if (input !== undefined) {
            acc[index] = opts.router._def._config.transformer.input.deserialize(input);
          }
        }
        return acc;
      });
      const calls = await Promise.all(paths.map(async (path, index) => {
        const procedure = await router.getProcedureAtPath(opts.router, path);
        return {
          path,
          procedure,
          getRawInput: async () => {
            const inputs = await getInputs.read();
            let input = inputs[index];
            if (procedure?._def.type === "subscription") {
              const lastEventId = opts.headers.get("last-event-id") ?? opts.searchParams.get("lastEventId") ?? opts.searchParams.get("Last-Event-Id");
              if (lastEventId) {
                if (utils.isObject(input)) {
                  input = {
                    ...input,
                    lastEventId
                  };
                } else {
                  input ?? (input = {
                    lastEventId
                  });
                }
              }
            }
            return input;
          },
          result: () => {
            return getInputs.result()?.[index];
          }
        };
      }));
      const types = new Set(calls.map((call) => call.procedure?._def.type).filter(Boolean));
      if (types.size > 1) {
        throw new TRPCError.TRPCError({
          code: "BAD_REQUEST",
          message: `Cannot mix procedure types in call: ${Array.from(types).join(", ")}`
        });
      }
      const type = types.values().next().value ?? "unknown";
      const connectionParamsStr = opts.searchParams.get("connectionParams");
      const info = {
        isBatchCall,
        accept: req.headers.get("trpc-accept"),
        calls,
        type,
        connectionParams: connectionParamsStr === null ? null : parseConnectionParams.parseConnectionParamsFromString(connectionParamsStr),
        signal: req.signal,
        url: opts.url
      };
      return info;
    }
  };
  var formDataContentTypeHandler = {
    isMatch(req) {
      return !!req.headers.get("content-type")?.startsWith("multipart/form-data");
    },
    async parse(opts) {
      const { req } = opts;
      if (req.method !== "POST") {
        throw new TRPCError.TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Only POST requests are supported for multipart/form-data requests"
        });
      }
      const getInputs = memo(async () => {
        const fd = await req.formData();
        return fd;
      });
      const procedure = await router.getProcedureAtPath(opts.router, opts.path);
      return {
        accept: null,
        calls: [
          {
            path: opts.path,
            getRawInput: getInputs.read,
            result: getInputs.result,
            procedure
          }
        ],
        isBatchCall: false,
        type: "mutation",
        connectionParams: null,
        signal: req.signal,
        url: opts.url
      };
    }
  };
  var octetStreamContentTypeHandler = {
    isMatch(req) {
      return !!req.headers.get("content-type")?.startsWith("application/octet-stream");
    },
    async parse(opts) {
      const { req } = opts;
      if (req.method !== "POST") {
        throw new TRPCError.TRPCError({
          code: "METHOD_NOT_SUPPORTED",
          message: "Only POST requests are supported for application/octet-stream requests"
        });
      }
      const getInputs = memo(async () => {
        return req.body;
      });
      return {
        calls: [
          {
            path: opts.path,
            getRawInput: getInputs.read,
            result: getInputs.result,
            procedure: await router.getProcedureAtPath(opts.router, opts.path)
          }
        ],
        isBatchCall: false,
        accept: null,
        type: "mutation",
        connectionParams: null,
        signal: req.signal,
        url: opts.url
      };
    }
  };
  var handlers = [
    jsonContentTypeHandler,
    formDataContentTypeHandler,
    octetStreamContentTypeHandler
  ];
  function getContentTypeHandler(req) {
    const handler = handlers.find((handler2) => handler2.isMatch(req));
    if (handler) {
      return handler;
    }
    if (!handler && req.method === "GET") {
      return jsonContentTypeHandler;
    }
    throw new TRPCError.TRPCError({
      code: "UNSUPPORTED_MEDIA_TYPE",
      message: req.headers.has("content-type") ? `Unsupported content-type "${req.headers.get("content-type")}` : "Missing content-type header"
    });
  }
  async function getRequestInfo(opts) {
    const handler = getContentTypeHandler(opts.req);
    return await handler.parse(opts);
  }
  exports.getRequestInfo = getRequestInfo;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/http/resolveResponse.js
var require_resolveResponse = __commonJS((exports) => {
  var observable = require_observable();
  var getErrorShape = require_getErrorShape();
  var TRPCError = require_TRPCError();
  var jsonl = require_jsonl();
  var sse = require_sse();
  var transformer = require_transformer();
  var utils = require_utils();
  var contentType = require_contentType();
  var getHTTPStatusCode = require_getHTTPStatusCode();
  function errorToAsyncIterable(err) {
    return utils.run(async function* () {
      throw err;
    });
  }
  var TYPE_ACCEPTED_METHOD_MAP = {
    mutation: [
      "POST"
    ],
    query: [
      "GET"
    ],
    subscription: [
      "GET"
    ]
  };
  var TYPE_ACCEPTED_METHOD_MAP_WITH_METHOD_OVERRIDE = {
    mutation: [
      "POST"
    ],
    query: [
      "GET",
      "POST"
    ],
    subscription: [
      "GET",
      "POST"
    ]
  };
  function initResponse(initOpts) {
    const { ctx, info, responseMeta, untransformedJSON, errors = [], headers } = initOpts;
    let status = untransformedJSON ? getHTTPStatusCode.getHTTPStatusCode(untransformedJSON) : 200;
    const eagerGeneration = !untransformedJSON;
    const data = eagerGeneration ? [] : Array.isArray(untransformedJSON) ? untransformedJSON : [
      untransformedJSON
    ];
    const meta = responseMeta?.({
      ctx,
      info,
      paths: info?.calls.map((call) => call.path),
      data,
      errors,
      eagerGeneration,
      type: info?.calls.find((call) => call.procedure?._def.type)?.procedure?._def.type ?? "unknown"
    }) ?? {};
    if (meta.headers) {
      if (meta.headers instanceof Headers) {
        for (const [key, value] of meta.headers.entries()) {
          headers.append(key, value);
        }
      } else {
        for (const [key, value] of Object.entries(meta.headers)) {
          if (Array.isArray(value)) {
            for (const v of value) {
              headers.append(key, v);
            }
          } else if (typeof value === "string") {
            headers.set(key, value);
          }
        }
      }
    }
    if (meta.status) {
      status = meta.status;
    }
    return {
      status
    };
  }
  function caughtErrorToData(cause, errorOpts) {
    const { router, req, onError } = errorOpts.opts;
    const error = TRPCError.getTRPCErrorFromUnknown(cause);
    onError?.({
      error,
      path: errorOpts.path,
      input: errorOpts.input,
      ctx: errorOpts.ctx,
      type: errorOpts.type,
      req
    });
    const untransformedJSON = {
      error: getErrorShape.getErrorShape({
        config: router._def._config,
        error,
        type: errorOpts.type,
        path: errorOpts.path,
        input: errorOpts.input,
        ctx: errorOpts.ctx
      })
    };
    const transformedJSON = transformer.transformTRPCResponse(router._def._config, untransformedJSON);
    const body = JSON.stringify(transformedJSON);
    return {
      error,
      untransformedJSON,
      body
    };
  }
  function isDataStream(v) {
    if (!utils.isObject(v)) {
      return false;
    }
    if (utils.isAsyncIterable(v)) {
      return true;
    }
    return Object.values(v).some(jsonl.isPromise) || Object.values(v).some(utils.isAsyncIterable);
  }
  async function resolveResponse(opts) {
    const { router, req } = opts;
    const headers = new Headers([
      [
        "vary",
        "trpc-accept"
      ]
    ]);
    const config = router._def._config;
    const url = new URL(req.url);
    if (req.method === "HEAD") {
      return new Response(null, {
        status: 204
      });
    }
    const allowBatching = opts.allowBatching ?? opts.batching?.enabled ?? true;
    const allowMethodOverride = (opts.allowMethodOverride ?? false) && req.method === "POST";
    const infoTuple = await utils.run(async () => {
      try {
        return [
          undefined,
          await contentType.getRequestInfo({
            req,
            path: decodeURIComponent(opts.path),
            router,
            searchParams: url.searchParams,
            headers: opts.req.headers,
            url
          })
        ];
      } catch (cause) {
        return [
          TRPCError.getTRPCErrorFromUnknown(cause),
          undefined
        ];
      }
    });
    const ctxManager = utils.run(() => {
      let result = undefined;
      return {
        valueOrUndefined: () => {
          if (!result) {
            return;
          }
          return result[1];
        },
        value: () => {
          const [err, ctx] = result;
          if (err) {
            throw err;
          }
          return ctx;
        },
        create: async (info) => {
          if (result) {
            throw new Error("This should only be called once - report a bug in tRPC");
          }
          try {
            const ctx = await opts.createContext({
              info
            });
            result = [
              undefined,
              ctx
            ];
          } catch (cause) {
            result = [
              TRPCError.getTRPCErrorFromUnknown(cause),
              undefined
            ];
          }
        }
      };
    });
    const methodMapper = allowMethodOverride ? TYPE_ACCEPTED_METHOD_MAP_WITH_METHOD_OVERRIDE : TYPE_ACCEPTED_METHOD_MAP;
    const isStreamCall = req.headers.get("trpc-accept") === "application/jsonl";
    const experimentalSSE = config.sse?.enabled ?? true;
    try {
      const [infoError, info] = infoTuple;
      if (infoError) {
        throw infoError;
      }
      if (info.isBatchCall && !allowBatching) {
        throw new TRPCError.TRPCError({
          code: "BAD_REQUEST",
          message: `Batching is not enabled on the server`
        });
      }
      if (isStreamCall && !info.isBatchCall) {
        throw new TRPCError.TRPCError({
          message: `Streaming requests must be batched (you can do a batch of 1)`,
          code: "BAD_REQUEST"
        });
      }
      await ctxManager.create(info);
      const rpcCalls = info.calls.map(async (call) => {
        const proc = call.procedure;
        try {
          if (opts.error) {
            throw opts.error;
          }
          if (!proc) {
            throw new TRPCError.TRPCError({
              code: "NOT_FOUND",
              message: `No procedure found on path "${call.path}"`
            });
          }
          if (!methodMapper[proc._def.type].includes(req.method)) {
            throw new TRPCError.TRPCError({
              code: "METHOD_NOT_SUPPORTED",
              message: `Unsupported ${req.method}-request to ${proc._def.type} procedure at path "${call.path}"`
            });
          }
          if (proc._def.type === "subscription") {
            if (info.isBatchCall) {
              throw new TRPCError.TRPCError({
                code: "BAD_REQUEST",
                message: `Cannot batch subscription calls`
              });
            }
          }
          const data = await proc({
            path: call.path,
            getRawInput: call.getRawInput,
            ctx: ctxManager.value(),
            type: proc._def.type,
            signal: opts.req.signal
          });
          return [
            undefined,
            {
              data
            }
          ];
        } catch (cause) {
          const error = TRPCError.getTRPCErrorFromUnknown(cause);
          const input = call.result();
          opts.onError?.({
            error,
            path: call.path,
            input,
            ctx: ctxManager.valueOrUndefined(),
            type: call.procedure?._def.type ?? "unknown",
            req: opts.req
          });
          return [
            error,
            undefined
          ];
        }
      });
      if (!info.isBatchCall) {
        const [call] = info.calls;
        const [error, result] = await rpcCalls[0];
        switch (info.type) {
          case "unknown":
          case "mutation":
          case "query": {
            headers.set("content-type", "application/json");
            if (isDataStream(result?.data)) {
              throw new TRPCError.TRPCError({
                code: "UNSUPPORTED_MEDIA_TYPE",
                message: "Cannot use stream-like response in non-streaming request - use httpBatchStreamLink"
              });
            }
            const res = error ? {
              error: getErrorShape.getErrorShape({
                config,
                ctx: ctxManager.valueOrUndefined(),
                error,
                input: call.result(),
                path: call.path,
                type: info.type
              })
            } : {
              result: {
                data: result.data
              }
            };
            const headResponse2 = initResponse({
              ctx: ctxManager.valueOrUndefined(),
              info,
              responseMeta: opts.responseMeta,
              errors: error ? [
                error
              ] : [],
              headers,
              untransformedJSON: [
                res
              ]
            });
            return new Response(JSON.stringify(transformer.transformTRPCResponse(config, res)), {
              status: headResponse2.status,
              headers
            });
          }
          case "subscription": {
            const iterable = utils.run(() => {
              if (error) {
                return errorToAsyncIterable(error);
              }
              if (!experimentalSSE) {
                return errorToAsyncIterable(new TRPCError.TRPCError({
                  code: "METHOD_NOT_SUPPORTED",
                  message: 'Missing experimental flag "sseSubscriptions"'
                }));
              }
              if (!observable.isObservable(result.data) && !utils.isAsyncIterable(result.data)) {
                return errorToAsyncIterable(new TRPCError.TRPCError({
                  message: `Subscription ${call.path} did not return an observable or a AsyncGenerator`,
                  code: "INTERNAL_SERVER_ERROR"
                }));
              }
              const dataAsIterable = observable.isObservable(result.data) ? observable.observableToAsyncIterable(result.data, opts.req.signal) : result.data;
              return dataAsIterable;
            });
            const stream = sse.sseStreamProducer({
              ...config.sse,
              data: iterable,
              serialize: (v) => config.transformer.output.serialize(v),
              formatError(errorOpts) {
                const error2 = TRPCError.getTRPCErrorFromUnknown(errorOpts.error);
                const input = call?.result();
                const path = call?.path;
                const type = call?.procedure?._def.type ?? "unknown";
                opts.onError?.({
                  error: error2,
                  path,
                  input,
                  ctx: ctxManager.valueOrUndefined(),
                  req: opts.req,
                  type
                });
                const shape = getErrorShape.getErrorShape({
                  config,
                  ctx: ctxManager.valueOrUndefined(),
                  error: error2,
                  input,
                  path,
                  type
                });
                return shape;
              }
            });
            for (const [key, value] of Object.entries(sse.sseHeaders)) {
              headers.set(key, value);
            }
            const headResponse2 = initResponse({
              ctx: ctxManager.valueOrUndefined(),
              info,
              responseMeta: opts.responseMeta,
              errors: [],
              headers,
              untransformedJSON: null
            });
            return new Response(stream, {
              headers,
              status: headResponse2.status
            });
          }
        }
      }
      if (info.accept === "application/jsonl") {
        headers.set("content-type", "application/json");
        headers.set("transfer-encoding", "chunked");
        const headResponse2 = initResponse({
          ctx: ctxManager.valueOrUndefined(),
          info,
          responseMeta: opts.responseMeta,
          errors: [],
          headers,
          untransformedJSON: null
        });
        const stream = jsonl.jsonlStreamProducer({
          ...config.jsonl,
          maxDepth: Infinity,
          data: rpcCalls.map(async (res) => {
            const [error, result] = await res;
            const call = info.calls[0];
            if (error) {
              return {
                error: getErrorShape.getErrorShape({
                  config,
                  ctx: ctxManager.valueOrUndefined(),
                  error,
                  input: call.result(),
                  path: call.path,
                  type: call.procedure?._def.type ?? "unknown"
                })
              };
            }
            const iterable = observable.isObservable(result.data) ? observable.observableToAsyncIterable(result.data, opts.req.signal) : Promise.resolve(result.data);
            return {
              result: Promise.resolve({
                data: iterable
              })
            };
          }),
          serialize: config.transformer.output.serialize,
          onError: (cause) => {
            opts.onError?.({
              error: TRPCError.getTRPCErrorFromUnknown(cause),
              path: undefined,
              input: undefined,
              ctx: ctxManager.valueOrUndefined(),
              req: opts.req,
              type: info?.type ?? "unknown"
            });
          },
          formatError(errorOpts) {
            const call = info?.calls[errorOpts.path[0]];
            const error = TRPCError.getTRPCErrorFromUnknown(errorOpts.error);
            const input = call?.result();
            const path = call?.path;
            const type = call?.procedure?._def.type ?? "unknown";
            const shape = getErrorShape.getErrorShape({
              config,
              ctx: ctxManager.valueOrUndefined(),
              error,
              input,
              path,
              type
            });
            return shape;
          }
        });
        return new Response(stream, {
          headers,
          status: headResponse2.status
        });
      }
      headers.set("content-type", "application/json");
      const results = (await Promise.all(rpcCalls)).map((res) => {
        const [error, result] = res;
        if (error) {
          return res;
        }
        if (isDataStream(result.data)) {
          return [
            new TRPCError.TRPCError({
              code: "UNSUPPORTED_MEDIA_TYPE",
              message: "Cannot use stream-like response in non-streaming request - use httpBatchStreamLink"
            }),
            undefined
          ];
        }
        return res;
      });
      const resultAsRPCResponse = results.map(([error, result], index) => {
        const call = info.calls[index];
        if (error) {
          return {
            error: getErrorShape.getErrorShape({
              config,
              ctx: ctxManager.valueOrUndefined(),
              error,
              input: call.result(),
              path: call.path,
              type: call.procedure?._def.type ?? "unknown"
            })
          };
        }
        return {
          result: {
            data: result.data
          }
        };
      });
      const errors = results.map(([error]) => error).filter(Boolean);
      const headResponse = initResponse({
        ctx: ctxManager.valueOrUndefined(),
        info,
        responseMeta: opts.responseMeta,
        untransformedJSON: resultAsRPCResponse,
        errors,
        headers
      });
      return new Response(JSON.stringify(transformer.transformTRPCResponse(config, resultAsRPCResponse)), {
        status: headResponse.status,
        headers
      });
    } catch (cause) {
      const [_infoError, info] = infoTuple;
      const ctx = ctxManager.valueOrUndefined();
      const { error, untransformedJSON, body } = caughtErrorToData(cause, {
        opts,
        ctx: ctxManager.valueOrUndefined(),
        type: info?.type ?? "unknown"
      });
      const headResponse = initResponse({
        ctx,
        info,
        responseMeta: opts.responseMeta,
        untransformedJSON,
        errors: [
          error
        ],
        headers
      });
      return new Response(body, {
        status: headResponse.status,
        headers
      });
    }
  }
  exports.resolveResponse = resolveResponse;
});

// node_modules/@trpc/server/dist/unstable-core-do-not-import/rootConfig.js
var require_rootConfig = __commonJS((exports) => {
  var isServerDefault = typeof window === "undefined" || "Deno" in window || globalThis.process?.env?.["NODE_ENV"] === "test" || !!globalThis.process?.env?.["JEST_WORKER_ID"] || !!globalThis.process?.env?.["VITEST_WORKER_ID"];
  exports.isServerDefault = isServerDefault;
});

// node_modules/@trpc/server/dist/adapters/fetch/fetchRequestHandler.js
var require_fetchRequestHandler = __commonJS((exports) => {
  var resolveResponse = require_resolveResponse();
  require_rootConfig();
  require_unpromise();
  require_disposable();
  var trimSlashes = (path) => {
    path = path.startsWith("/") ? path.slice(1) : path;
    path = path.endsWith("/") ? path.slice(0, -1) : path;
    return path;
  };
  async function fetchRequestHandler(opts) {
    const resHeaders = new Headers;
    const createContext = async (innerOpts) => {
      return opts.createContext?.({
        req: opts.req,
        resHeaders,
        ...innerOpts
      });
    };
    const url = new URL(opts.req.url);
    const pathname = trimSlashes(url.pathname);
    const endpoint = trimSlashes(opts.endpoint);
    const path = trimSlashes(pathname.slice(endpoint.length));
    return await resolveResponse.resolveResponse({
      ...opts,
      req: opts.req,
      createContext,
      path,
      error: null,
      onError(o) {
        opts?.onError?.({
          ...o,
          req: opts.req
        });
      },
      responseMeta(data) {
        const meta = opts.responseMeta?.(data);
        if (meta?.headers) {
          if (meta.headers instanceof Headers) {
            for (const [key, value] of meta.headers.entries()) {
              resHeaders.append(key, value);
            }
          } else {
            for (const [key, value] of Object.entries(meta.headers)) {
              if (Array.isArray(value)) {
                for (const v of value) {
                  resHeaders.append(key, v);
                }
              } else if (typeof value === "string") {
                resHeaders.set(key, value);
              }
            }
          }
        }
        return {
          headers: resHeaders,
          status: meta?.status
        };
      }
    });
  }
  exports.fetchRequestHandler = fetchRequestHandler;
});

// node_modules/@trpc/server/dist/adapters/fetch/index.js
var require_fetch = __commonJS((exports) => {
  var fetchRequestHandler = require_fetchRequestHandler();
  exports.fetchRequestHandler = fetchRequestHandler.fetchRequestHandler;
});

// node_modules/@hono/trpc-server/dist/cjs/index.js
var require_cjs = __commonJS((exports) => {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.trpcServer = undefined;
  var fetch_1 = require_fetch();
  var trpcServer = ({ endpoint = "/trpc", createContext, ...rest }) => {
    const bodyProps = new Set(["arrayBuffer", "blob", "formData", "json", "text"]);
    return async (c) => {
      const canWithBody = c.req.method === "GET" || c.req.method === "HEAD";
      const res = (0, fetch_1.fetchRequestHandler)({
        ...rest,
        createContext: async (opts) => ({
          ...createContext ? await createContext(opts, c) : {},
          env: c.env
        }),
        endpoint,
        req: canWithBody ? c.req.raw : new Proxy(c.req.raw, {
          get(t, p, _r) {
            if (bodyProps.has(p)) {
              return () => c.req[p]();
            }
            return Reflect.get(t, p, t);
          }
        })
      }).then((res2) => c.body(res2.body, res2));
      return res;
    };
  };
  exports.trpcServer = trpcServer;
});

// node_modules/@prisma/client/runtime/library.js
var require_library = __commonJS((exports, module) => {
  var __dirname = "C:\\Users\\bhoffenbe\\WhatCanIGetFor\\node_modules\\@prisma\\client\\runtime", __filename = "C:\\Users\\bhoffenbe\\WhatCanIGetFor\\node_modules\\@prisma\\client\\runtime\\library.js";
  var yu = Object.create;
  var qt = Object.defineProperty;
  var bu = Object.getOwnPropertyDescriptor;
  var Eu = Object.getOwnPropertyNames;
  var wu = Object.getPrototypeOf;
  var xu = Object.prototype.hasOwnProperty;
  var Do = (e, r) => () => (e && (r = e(e = 0)), r);
  var ne = (e, r) => () => (r || e((r = { exports: {} }).exports, r), r.exports);
  var tr = (e, r) => {
    for (var t2 in r)
      qt(e, t2, { get: r[t2], enumerable: true });
  };
  var _o = (e, r, t2, n) => {
    if (r && typeof r == "object" || typeof r == "function")
      for (let i of Eu(r))
        !xu.call(e, i) && i !== t2 && qt(e, i, { get: () => r[i], enumerable: !(n = bu(r, i)) || n.enumerable });
    return e;
  };
  var k = (e, r, t2) => (t2 = e != null ? yu(wu(e)) : {}, _o(r || !e || !e.__esModule ? qt(t2, "default", { value: e, enumerable: true }) : t2, e));
  var vu = (e) => _o(qt({}, "__esModule", { value: true }), e);
  var mi = ne((_g, ss) => {
    ss.exports = (e, r = process.argv) => {
      let t2 = e.startsWith("-") ? "" : e.length === 1 ? "-" : "--", n = r.indexOf(t2 + e), i = r.indexOf("--");
      return n !== -1 && (i === -1 || n < i);
    };
  });
  var us = ne((Ng, ls) => {
    var Lc = __require("node:os"), as = __require("node:tty"), de = mi(), { env: Q } = process, Ge;
    de("no-color") || de("no-colors") || de("color=false") || de("color=never") ? Ge = 0 : (de("color") || de("colors") || de("color=true") || de("color=always")) && (Ge = 1);
    "FORCE_COLOR" in Q && (Q.FORCE_COLOR === "true" ? Ge = 1 : Q.FORCE_COLOR === "false" ? Ge = 0 : Ge = Q.FORCE_COLOR.length === 0 ? 1 : Math.min(parseInt(Q.FORCE_COLOR, 10), 3));
    function fi(e) {
      return e === 0 ? false : { level: e, hasBasic: true, has256: e >= 2, has16m: e >= 3 };
    }
    function gi(e, r) {
      if (Ge === 0)
        return 0;
      if (de("color=16m") || de("color=full") || de("color=truecolor"))
        return 3;
      if (de("color=256"))
        return 2;
      if (e && !r && Ge === undefined)
        return 0;
      let t2 = Ge || 0;
      if (Q.TERM === "dumb")
        return t2;
      if (process.platform === "win32") {
        let n = Lc.release().split(".");
        return Number(n[0]) >= 10 && Number(n[2]) >= 10586 ? Number(n[2]) >= 14931 ? 3 : 2 : 1;
      }
      if ("CI" in Q)
        return ["TRAVIS", "CIRCLECI", "APPVEYOR", "GITLAB_CI", "GITHUB_ACTIONS", "BUILDKITE"].some((n) => (n in Q)) || Q.CI_NAME === "codeship" ? 1 : t2;
      if ("TEAMCITY_VERSION" in Q)
        return /^(9\.(0*[1-9]\d*)\.|\d{2,}\.)/.test(Q.TEAMCITY_VERSION) ? 1 : 0;
      if (Q.COLORTERM === "truecolor")
        return 3;
      if ("TERM_PROGRAM" in Q) {
        let n = parseInt((Q.TERM_PROGRAM_VERSION || "").split(".")[0], 10);
        switch (Q.TERM_PROGRAM) {
          case "iTerm.app":
            return n >= 3 ? 3 : 2;
          case "Apple_Terminal":
            return 2;
        }
      }
      return /-256(color)?$/i.test(Q.TERM) ? 2 : /^screen|^xterm|^vt100|^vt220|^rxvt|color|ansi|cygwin|linux/i.test(Q.TERM) || ("COLORTERM" in Q) ? 1 : t2;
    }
    function Mc(e) {
      let r = gi(e, e && e.isTTY);
      return fi(r);
    }
    ls.exports = { supportsColor: Mc, stdout: fi(gi(true, as.isatty(1))), stderr: fi(gi(true, as.isatty(2))) };
  });
  var ds = ne((Fg, ps) => {
    var $c = us(), br = mi();
    function cs(e) {
      if (/^\d{3,4}$/.test(e)) {
        let t2 = /(\d{1,2})(\d{2})/.exec(e) || [];
        return { major: 0, minor: parseInt(t2[1], 10), patch: parseInt(t2[2], 10) };
      }
      let r = (e || "").split(".").map((t2) => parseInt(t2, 10));
      return { major: r[0], minor: r[1], patch: r[2] };
    }
    function hi(e) {
      let { CI: r, FORCE_HYPERLINK: t2, NETLIFY: n, TEAMCITY_VERSION: i, TERM_PROGRAM: o, TERM_PROGRAM_VERSION: s, VTE_VERSION: a, TERM: l } = process.env;
      if (t2)
        return !(t2.length > 0 && parseInt(t2, 10) === 0);
      if (br("no-hyperlink") || br("no-hyperlinks") || br("hyperlink=false") || br("hyperlink=never"))
        return false;
      if (br("hyperlink=true") || br("hyperlink=always") || n)
        return true;
      if (!$c.supportsColor(e) || e && !e.isTTY)
        return false;
      if ("WT_SESSION" in process.env)
        return true;
      if (process.platform === "win32" || r || i)
        return false;
      if (o) {
        let u = cs(s || "");
        switch (o) {
          case "iTerm.app":
            return u.major === 3 ? u.minor >= 1 : u.major > 3;
          case "WezTerm":
            return u.major >= 20200620;
          case "vscode":
            return u.major > 1 || u.major === 1 && u.minor >= 72;
          case "ghostty":
            return true;
        }
      }
      if (a) {
        if (a === "0.50.0")
          return false;
        let u = cs(a);
        return u.major > 0 || u.minor >= 50;
      }
      switch (l) {
        case "alacritty":
          return true;
      }
      return false;
    }
    ps.exports = { supportsHyperlink: hi, stdout: hi(process.stdout), stderr: hi(process.stderr) };
  });
  var ms = ne((Hg, qc) => {
    qc.exports = { name: "@prisma/internals", version: "6.7.0", description: "This package is intended for Prisma's internal use", main: "dist/index.js", types: "dist/index.d.ts", repository: { type: "git", url: "https://github.com/prisma/prisma.git", directory: "packages/internals" }, homepage: "https://www.prisma.io", author: "Tim Suchanek <suchanek@prisma.io>", bugs: "https://github.com/prisma/prisma/issues", license: "Apache-2.0", scripts: { dev: "DEV=true tsx helpers/build.ts", build: "tsx helpers/build.ts", test: "dotenv -e ../../.db.env -- jest --silent", prepublishOnly: "pnpm run build" }, files: ["README.md", "dist", "!**/libquery_engine*", "!dist/get-generators/engines/*", "scripts"], devDependencies: { "@babel/helper-validator-identifier": "7.25.9", "@opentelemetry/api": "1.9.0", "@swc/core": "1.11.5", "@swc/jest": "0.2.37", "@types/babel__helper-validator-identifier": "7.15.2", "@types/jest": "29.5.14", "@types/node": "18.19.76", "@types/resolve": "1.20.6", archiver: "6.0.2", "checkpoint-client": "1.1.33", "cli-truncate": "4.0.0", dotenv: "16.4.7", esbuild: "0.25.1", "escape-string-regexp": "5.0.0", execa: "5.1.1", "fast-glob": "3.3.3", "find-up": "7.0.0", "fp-ts": "2.16.9", "fs-extra": "11.3.0", "fs-jetpack": "5.1.0", "global-dirs": "4.0.0", globby: "11.1.0", "identifier-regex": "1.0.0", "indent-string": "4.0.0", "is-windows": "1.0.2", "is-wsl": "3.1.0", jest: "29.7.0", "jest-junit": "16.0.0", kleur: "4.1.5", "mock-stdin": "1.0.0", "new-github-issue-url": "0.2.1", "node-fetch": "3.3.2", "npm-packlist": "5.1.3", open: "7.4.2", "p-map": "4.0.0", "read-package-up": "11.0.0", resolve: "1.22.10", "string-width": "7.2.0", "strip-ansi": "6.0.1", "strip-indent": "4.0.0", "temp-dir": "2.0.0", tempy: "1.0.1", "terminal-link": "4.0.0", tmp: "0.2.3", "ts-node": "10.9.2", "ts-pattern": "5.6.2", "ts-toolbelt": "9.6.0", typescript: "5.4.5", yarn: "1.22.22" }, dependencies: { "@prisma/config": "workspace:*", "@prisma/debug": "workspace:*", "@prisma/dmmf": "workspace:*", "@prisma/driver-adapter-utils": "workspace:*", "@prisma/engines": "workspace:*", "@prisma/fetch-engine": "workspace:*", "@prisma/generator": "workspace:*", "@prisma/generator-helper": "workspace:*", "@prisma/get-platform": "workspace:*", "@prisma/prisma-schema-wasm": "6.7.0-36.3cff47a7f5d65c3ea74883f1d736e41d68ce91ed", "@prisma/schema-engine-wasm": "6.7.0-36.3cff47a7f5d65c3ea74883f1d736e41d68ce91ed", "@prisma/schema-files-loader": "workspace:*", arg: "5.0.2", prompts: "2.4.2" }, peerDependencies: { typescript: ">=5.1.0" }, peerDependenciesMeta: { typescript: { optional: true } }, sideEffects: false };
  });
  var Ei = ne((zg, Uc) => {
    Uc.exports = { name: "@prisma/engines-version", version: "6.7.0-36.3cff47a7f5d65c3ea74883f1d736e41d68ce91ed", main: "index.js", types: "index.d.ts", license: "Apache-2.0", author: "Tim Suchanek <suchanek@prisma.io>", prisma: { enginesVersion: "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed" }, repository: { type: "git", url: "https://github.com/prisma/engines-wrapper.git", directory: "packages/engines-version" }, devDependencies: { "@types/node": "18.19.76", typescript: "4.9.5" }, files: ["index.js", "index.d.ts"], scripts: { build: "tsc -d" } };
  });
  var wi = ne((Xt) => {
    Object.defineProperty(Xt, "__esModule", { value: true });
    Xt.enginesVersion = undefined;
    Xt.enginesVersion = Ei().prisma.enginesVersion;
  });
  var ys = ne((hh, hs) => {
    hs.exports = (e) => {
      let r = e.match(/^[ \t]*(?=\S)/gm);
      return r ? r.reduce((t2, n) => Math.min(t2, n.length), 1 / 0) : 0;
    };
  });
  var Ri = ne((Eh, ws) => {
    ws.exports = (e, r = 1, t2) => {
      if (t2 = { indent: " ", includeEmptyLines: false, ...t2 }, typeof e != "string")
        throw new TypeError(`Expected \`input\` to be a \`string\`, got \`${typeof e}\``);
      if (typeof r != "number")
        throw new TypeError(`Expected \`count\` to be a \`number\`, got \`${typeof r}\``);
      if (typeof t2.indent != "string")
        throw new TypeError(`Expected \`options.indent\` to be a \`string\`, got \`${typeof t2.indent}\``);
      if (r === 0)
        return e;
      let n = t2.includeEmptyLines ? /^/gm : /^(?!\s*$)/gm;
      return e.replace(n, t2.indent.repeat(r));
    };
  });
  var Ts = ne((vh, Ps) => {
    Ps.exports = ({ onlyFirst: e = false } = {}) => {
      let r = ["[\\u001B\\u009B][[\\]()#;?]*(?:(?:(?:(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]+)*|[a-zA-Z\\d]+(?:;[-a-zA-Z\\d\\/#&.:=?%@~_]*)*)?\\u0007)", "(?:(?:\\d{1,4}(?:;\\d{0,4})*)?[\\dA-PR-TZcf-ntqry=><~]))"].join("|");
      return new RegExp(r, e ? undefined : "g");
    };
  });
  var ki = ne((Ph, Ss) => {
    var Xc = Ts();
    Ss.exports = (e) => typeof e == "string" ? e.replace(Xc(), "") : e;
  });
  var Rs = ne((Ch, ep) => {
    ep.exports = { name: "dotenv", version: "16.4.7", description: "Loads environment variables from .env file", main: "lib/main.js", types: "lib/main.d.ts", exports: { ".": { types: "./lib/main.d.ts", require: "./lib/main.js", default: "./lib/main.js" }, "./config": "./config.js", "./config.js": "./config.js", "./lib/env-options": "./lib/env-options.js", "./lib/env-options.js": "./lib/env-options.js", "./lib/cli-options": "./lib/cli-options.js", "./lib/cli-options.js": "./lib/cli-options.js", "./package.json": "./package.json" }, scripts: { "dts-check": "tsc --project tests/types/tsconfig.json", lint: "standard", pretest: "npm run lint && npm run dts-check", test: "tap run --allow-empty-coverage --disable-coverage --timeout=60000", "test:coverage": "tap run --show-full-coverage --timeout=60000 --coverage-report=lcov", prerelease: "npm test", release: "standard-version" }, repository: { type: "git", url: "git://github.com/motdotla/dotenv.git" }, funding: "https://dotenvx.com", keywords: ["dotenv", "env", ".env", "environment", "variables", "config", "settings"], readmeFilename: "README.md", license: "BSD-2-Clause", devDependencies: { "@types/node": "^18.11.3", decache: "^4.6.2", sinon: "^14.0.1", standard: "^17.0.0", "standard-version": "^9.5.0", tap: "^19.2.0", typescript: "^4.8.4" }, engines: { node: ">=12" }, browser: { fs: false } };
  });
  var ks = ne((Ah, Ne) => {
    var Di = __require("node:fs"), _i = __require("node:path"), rp = __require("node:os"), tp = __require("node:crypto"), np = Rs(), Ni = np.version, ip = /(?:^|^)\s*(?:export\s+)?([\w.-]+)(?:\s*=\s*?|:\s+?)(\s*'(?:\\'|[^'])*'|\s*"(?:\\"|[^"])*"|\s*`(?:\\`|[^`])*`|[^#\r\n]+)?\s*(?:#.*)?(?:$|$)/mg;
    function op(e) {
      let r = {}, t2 = e.toString();
      t2 = t2.replace(/\r\n?/mg, `
`);
      let n;
      for (;(n = ip.exec(t2)) != null; ) {
        let i = n[1], o = n[2] || "";
        o = o.trim();
        let s = o[0];
        o = o.replace(/^(['"`])([\s\S]*)\1$/mg, "$2"), s === '"' && (o = o.replace(/\\n/g, `
`), o = o.replace(/\\r/g, "\r")), r[i] = o;
      }
      return r;
    }
    function sp(e) {
      let r = Is(e), t2 = B.configDotenv({ path: r });
      if (!t2.parsed) {
        let s = new Error(`MISSING_DATA: Cannot parse ${r} for an unknown reason`);
        throw s.code = "MISSING_DATA", s;
      }
      let n = As(e).split(","), i = n.length, o;
      for (let s = 0;s < i; s++)
        try {
          let a = n[s].trim(), l = up(t2, a);
          o = B.decrypt(l.ciphertext, l.key);
          break;
        } catch (a) {
          if (s + 1 >= i)
            throw a;
        }
      return B.parse(o);
    }
    function ap(e) {
      console.log(`[dotenv@${Ni}][INFO] ${e}`);
    }
    function lp(e) {
      console.log(`[dotenv@${Ni}][WARN] ${e}`);
    }
    function tn(e) {
      console.log(`[dotenv@${Ni}][DEBUG] ${e}`);
    }
    function As(e) {
      return e && e.DOTENV_KEY && e.DOTENV_KEY.length > 0 ? e.DOTENV_KEY : process.env.DOTENV_KEY && process.env.DOTENV_KEY.length > 0 ? process.env.DOTENV_KEY : "";
    }
    function up(e, r) {
      let t2;
      try {
        t2 = new URL(r);
      } catch (a) {
        if (a.code === "ERR_INVALID_URL") {
          let l = new Error("INVALID_DOTENV_KEY: Wrong format. Must be in valid uri format like dotenv://:key_1234@dotenvx.com/vault/.env.vault?environment=development");
          throw l.code = "INVALID_DOTENV_KEY", l;
        }
        throw a;
      }
      let n = t2.password;
      if (!n) {
        let a = new Error("INVALID_DOTENV_KEY: Missing key part");
        throw a.code = "INVALID_DOTENV_KEY", a;
      }
      let i = t2.searchParams.get("environment");
      if (!i) {
        let a = new Error("INVALID_DOTENV_KEY: Missing environment part");
        throw a.code = "INVALID_DOTENV_KEY", a;
      }
      let o = `DOTENV_VAULT_${i.toUpperCase()}`, s = e.parsed[o];
      if (!s) {
        let a = new Error(`NOT_FOUND_DOTENV_ENVIRONMENT: Cannot locate environment ${o} in your .env.vault file.`);
        throw a.code = "NOT_FOUND_DOTENV_ENVIRONMENT", a;
      }
      return { ciphertext: s, key: n };
    }
    function Is(e) {
      let r = null;
      if (e && e.path && e.path.length > 0)
        if (Array.isArray(e.path))
          for (let t2 of e.path)
            Di.existsSync(t2) && (r = t2.endsWith(".vault") ? t2 : `${t2}.vault`);
        else
          r = e.path.endsWith(".vault") ? e.path : `${e.path}.vault`;
      else
        r = _i.resolve(process.cwd(), ".env.vault");
      return Di.existsSync(r) ? r : null;
    }
    function Cs(e) {
      return e[0] === "~" ? _i.join(rp.homedir(), e.slice(1)) : e;
    }
    function cp(e) {
      ap("Loading env from encrypted .env.vault");
      let r = B._parseVault(e), t2 = process.env;
      return e && e.processEnv != null && (t2 = e.processEnv), B.populate(t2, r, e), { parsed: r };
    }
    function pp(e) {
      let r = _i.resolve(process.cwd(), ".env"), t2 = "utf8", n = !!(e && e.debug);
      e && e.encoding ? t2 = e.encoding : n && tn("No encoding is specified. UTF-8 is used by default");
      let i = [r];
      if (e && e.path)
        if (!Array.isArray(e.path))
          i = [Cs(e.path)];
        else {
          i = [];
          for (let l of e.path)
            i.push(Cs(l));
        }
      let o, s = {};
      for (let l of i)
        try {
          let u = B.parse(Di.readFileSync(l, { encoding: t2 }));
          B.populate(s, u, e);
        } catch (u) {
          n && tn(`Failed to load ${l} ${u.message}`), o = u;
        }
      let a = process.env;
      return e && e.processEnv != null && (a = e.processEnv), B.populate(a, s, e), o ? { parsed: s, error: o } : { parsed: s };
    }
    function dp(e) {
      if (As(e).length === 0)
        return B.configDotenv(e);
      let r = Is(e);
      return r ? B._configVault(e) : (lp(`You set DOTENV_KEY but you are missing a .env.vault file at ${r}. Did you forget to build it?`), B.configDotenv(e));
    }
    function mp(e, r) {
      let t2 = Buffer.from(r.slice(-64), "hex"), n = Buffer.from(e, "base64"), i = n.subarray(0, 12), o = n.subarray(-16);
      n = n.subarray(12, -16);
      try {
        let s = tp.createDecipheriv("aes-256-gcm", t2, i);
        return s.setAuthTag(o), `${s.update(n)}${s.final()}`;
      } catch (s) {
        let a = s instanceof RangeError, l = s.message === "Invalid key length", u = s.message === "Unsupported state or unable to authenticate data";
        if (a || l) {
          let c = new Error("INVALID_DOTENV_KEY: It must be 64 characters long (or more)");
          throw c.code = "INVALID_DOTENV_KEY", c;
        } else if (u) {
          let c = new Error("DECRYPTION_FAILED: Please check your DOTENV_KEY");
          throw c.code = "DECRYPTION_FAILED", c;
        } else
          throw s;
      }
    }
    function fp(e, r, t2 = {}) {
      let n = !!(t2 && t2.debug), i = !!(t2 && t2.override);
      if (typeof r != "object") {
        let o = new Error("OBJECT_REQUIRED: Please check the processEnv argument being passed to populate");
        throw o.code = "OBJECT_REQUIRED", o;
      }
      for (let o of Object.keys(r))
        Object.prototype.hasOwnProperty.call(e, o) ? (i === true && (e[o] = r[o]), n && tn(i === true ? `"${o}" is already defined and WAS overwritten` : `"${o}" is already defined and was NOT overwritten`)) : e[o] = r[o];
    }
    var B = { configDotenv: pp, _configVault: cp, _parseVault: sp, config: dp, decrypt: mp, parse: op, populate: fp };
    Ne.exports.configDotenv = B.configDotenv;
    Ne.exports._configVault = B._configVault;
    Ne.exports._parseVault = B._parseVault;
    Ne.exports.config = B.config;
    Ne.exports.decrypt = B.decrypt;
    Ne.exports.parse = B.parse;
    Ne.exports.populate = B.populate;
    Ne.exports = B;
  });
  var Ns = ne((Nh, on) => {
    on.exports = (e = {}) => {
      let r;
      if (e.repoUrl)
        r = e.repoUrl;
      else if (e.user && e.repo)
        r = `https://github.com/${e.user}/${e.repo}`;
      else
        throw new Error("You need to specify either the `repoUrl` option or both the `user` and `repo` options");
      let t2 = new URL(`${r}/issues/new`), n = ["body", "title", "labels", "template", "milestone", "assignee", "projects"];
      for (let i of n) {
        let o = e[i];
        if (o !== undefined) {
          if (i === "labels" || i === "projects") {
            if (!Array.isArray(o))
              throw new TypeError(`The \`${i}\` option should be an array`);
            o = o.join(",");
          }
          t2.searchParams.set(i, o);
        }
      }
      return t2.toString();
    };
    on.exports.default = on.exports;
  });
  var Gi = ne((pb, na) => {
    na.exports = function() {
      function e(r, t2, n, i, o) {
        return r < t2 || n < t2 ? r > n ? n + 1 : r + 1 : i === o ? t2 : t2 + 1;
      }
      return function(r, t2) {
        if (r === t2)
          return 0;
        if (r.length > t2.length) {
          var n = r;
          r = t2, t2 = n;
        }
        for (var i = r.length, o = t2.length;i > 0 && r.charCodeAt(i - 1) === t2.charCodeAt(o - 1); )
          i--, o--;
        for (var s = 0;s < i && r.charCodeAt(s) === t2.charCodeAt(s); )
          s++;
        if (i -= s, o -= s, i === 0 || o < 3)
          return o;
        var a = 0, l, u, c, p, d, f, g, h, I, P, S, b, O = [];
        for (l = 0;l < i; l++)
          O.push(l + 1), O.push(r.charCodeAt(s + l));
        for (var me = O.length - 1;a < o - 3; )
          for (I = t2.charCodeAt(s + (u = a)), P = t2.charCodeAt(s + (c = a + 1)), S = t2.charCodeAt(s + (p = a + 2)), b = t2.charCodeAt(s + (d = a + 3)), f = a += 4, l = 0;l < me; l += 2)
            g = O[l], h = O[l + 1], u = e(g, u, c, I, h), c = e(u, c, p, P, h), p = e(c, p, d, S, h), f = e(p, d, f, b, h), O[l] = f, d = p, p = c, c = u, u = g;
        for (;a < o; )
          for (I = t2.charCodeAt(s + (u = a)), f = ++a, l = 0;l < me; l += 2)
            g = O[l], O[l] = f = e(g, u, f, I, O[l + 1]), u = g;
        return f;
      };
    }();
  });
  var la = Do(() => {});
  var ua = Do(() => {});
  var Vf = {};
  tr(Vf, { DMMF: () => lt, Debug: () => N, Decimal: () => ve, Extensions: () => ei, MetricsClient: () => Fr, PrismaClientInitializationError: () => T, PrismaClientKnownRequestError: () => z2, PrismaClientRustPanicError: () => le, PrismaClientUnknownRequestError: () => j, PrismaClientValidationError: () => Z, Public: () => ri, Sql: () => oe, createParam: () => Sa, defineDmmfProperty: () => Oa, deserializeJsonResponse: () => Tr, deserializeRawResult: () => Yn, dmmfToRuntimeDataModel: () => zs, empty: () => Na, getPrismaClient: () => fu, getRuntime: () => qn, join: () => _a, makeStrictEnum: () => gu, makeTypedQueryFactory: () => Da, objectEnumValues: () => Sn, raw: () => eo, serializeJsonQuery: () => Dn, skip: () => On, sqltag: () => ro, warnEnvConflicts: () => hu, warnOnce: () => ot });
  module.exports = vu(Vf);
  var ei = {};
  tr(ei, { defineExtension: () => No, getExtensionContext: () => Fo });
  function No(e) {
    return typeof e == "function" ? e : (r) => r.$extends(e);
  }
  function Fo(e) {
    return e;
  }
  var ri = {};
  tr(ri, { validator: () => Lo });
  function Lo(...e) {
    return (r) => r;
  }
  var jt = {};
  tr(jt, { $: () => Vo, bgBlack: () => Du, bgBlue: () => Lu, bgCyan: () => $u, bgGreen: () => Nu, bgMagenta: () => Mu, bgRed: () => _u, bgWhite: () => qu, bgYellow: () => Fu, black: () => Au, blue: () => nr, bold: () => W, cyan: () => Oe, dim: () => Ie, gray: () => Hr, green: () => qe, grey: () => Ou, hidden: () => Ru, inverse: () => Su, italic: () => Tu, magenta: () => Iu, red: () => ce, reset: () => Pu, strikethrough: () => Cu, underline: () => Y, white: () => ku, yellow: () => ke });
  var ti;
  var Mo;
  var $o;
  var qo;
  var jo = true;
  typeof process < "u" && ({ FORCE_COLOR: ti, NODE_DISABLE_COLORS: Mo, NO_COLOR: $o, TERM: qo } = process.env || {}, jo = process.stdout && process.stdout.isTTY);
  var Vo = { enabled: !Mo && $o == null && qo !== "dumb" && (ti != null && ti !== "0" || jo) };
  function L(e, r) {
    let t2 = new RegExp(`\\x1b\\[${r}m`, "g"), n = `\x1B[${e}m`, i = `\x1B[${r}m`;
    return function(o) {
      return !Vo.enabled || o == null ? o : n + (~("" + o).indexOf(i) ? o.replace(t2, i + n) : o) + i;
    };
  }
  var Pu = L(0, 0);
  var W = L(1, 22);
  var Ie = L(2, 22);
  var Tu = L(3, 23);
  var Y = L(4, 24);
  var Su = L(7, 27);
  var Ru = L(8, 28);
  var Cu = L(9, 29);
  var Au = L(30, 39);
  var ce = L(31, 39);
  var qe = L(32, 39);
  var ke = L(33, 39);
  var nr = L(34, 39);
  var Iu = L(35, 39);
  var Oe = L(36, 39);
  var ku = L(37, 39);
  var Hr = L(90, 39);
  var Ou = L(90, 39);
  var Du = L(40, 49);
  var _u = L(41, 49);
  var Nu = L(42, 49);
  var Fu = L(43, 49);
  var Lu = L(44, 49);
  var Mu = L(45, 49);
  var $u = L(46, 49);
  var qu = L(47, 49);
  var ju = 100;
  var Bo = ["green", "yellow", "blue", "magenta", "cyan", "red"];
  var Kr = [];
  var Uo = Date.now();
  var Vu = 0;
  var ni = typeof process < "u" ? process.env : {};
  globalThis.DEBUG ??= ni.DEBUG ?? "";
  globalThis.DEBUG_COLORS ??= ni.DEBUG_COLORS ? ni.DEBUG_COLORS === "true" : true;
  var Yr = { enable(e) {
    typeof e == "string" && (globalThis.DEBUG = e);
  }, disable() {
    let e = globalThis.DEBUG;
    return globalThis.DEBUG = "", e;
  }, enabled(e) {
    let r = globalThis.DEBUG.split(",").map((i) => i.replace(/[.+?^${}()|[\]\\]/g, "\\$&")), t2 = r.some((i) => i === "" || i[0] === "-" ? false : e.match(RegExp(i.split("*").join(".*") + "$"))), n = r.some((i) => i === "" || i[0] !== "-" ? false : e.match(RegExp(i.slice(1).split("*").join(".*") + "$")));
    return t2 && !n;
  }, log: (...e) => {
    let [r, t2, ...n] = e;
    (console.warn ?? console.log)(`${r} ${t2}`, ...n);
  }, formatters: {} };
  function Bu(e) {
    let r = { color: Bo[Vu++ % Bo.length], enabled: Yr.enabled(e), namespace: e, log: Yr.log, extend: () => {} }, t2 = (...n) => {
      let { enabled: i, namespace: o, color: s, log: a } = r;
      if (n.length !== 0 && Kr.push([o, ...n]), Kr.length > ju && Kr.shift(), Yr.enabled(o) || i) {
        let l = n.map((c) => typeof c == "string" ? c : Uu(c)), u = `+${Date.now() - Uo}ms`;
        Uo = Date.now(), globalThis.DEBUG_COLORS ? a(jt[s](W(o)), ...l, jt[s](u)) : a(o, ...l, u);
      }
    };
    return new Proxy(t2, { get: (n, i) => r[i], set: (n, i, o) => r[i] = o });
  }
  var N = new Proxy(Bu, { get: (e, r) => Yr[r], set: (e, r, t2) => Yr[r] = t2 });
  function Uu(e, r = 2) {
    let t2 = new Set;
    return JSON.stringify(e, (n, i) => {
      if (typeof i == "object" && i !== null) {
        if (t2.has(i))
          return "[Circular *]";
        t2.add(i);
      } else if (typeof i == "bigint")
        return i.toString();
      return i;
    }, r);
  }
  function Qo(e = 7500) {
    let r = Kr.map(([t2, ...n]) => `${t2} ${n.map((i) => typeof i == "string" ? i : JSON.stringify(i)).join(" ")}`).join(`
`);
    return r.length < e ? r : r.slice(-e);
  }
  function Go() {
    Kr.length = 0;
  }
  var gr = N;
  var Wo = k(__require("node:fs"));
  function ii() {
    let e = process.env.PRISMA_QUERY_ENGINE_LIBRARY;
    if (!(e && Wo.default.existsSync(e)) && process.arch === "ia32")
      throw new Error('The default query engine type (Node-API, "library") is currently not supported for 32bit Node. Please set `engineType = "binary"` in the "generator" block of your "schema.prisma" file (or use the environment variables "PRISMA_CLIENT_ENGINE_TYPE=binary" and/or "PRISMA_CLI_QUERY_ENGINE_TYPE=binary".)');
  }
  var oi = ["darwin", "darwin-arm64", "debian-openssl-1.0.x", "debian-openssl-1.1.x", "debian-openssl-3.0.x", "rhel-openssl-1.0.x", "rhel-openssl-1.1.x", "rhel-openssl-3.0.x", "linux-arm64-openssl-1.1.x", "linux-arm64-openssl-1.0.x", "linux-arm64-openssl-3.0.x", "linux-arm-openssl-1.1.x", "linux-arm-openssl-1.0.x", "linux-arm-openssl-3.0.x", "linux-musl", "linux-musl-openssl-3.0.x", "linux-musl-arm64-openssl-1.1.x", "linux-musl-arm64-openssl-3.0.x", "linux-nixos", "linux-static-x64", "linux-static-arm64", "windows", "freebsd11", "freebsd12", "freebsd13", "freebsd14", "freebsd15", "openbsd", "netbsd", "arm"];
  var Vt = "libquery_engine";
  function Bt(e, r) {
    let t2 = r === "url";
    return e.includes("windows") ? t2 ? "query_engine.dll.node" : `query_engine-${e}.dll.node` : e.includes("darwin") ? t2 ? `${Vt}.dylib.node` : `${Vt}-${e}.dylib.node` : t2 ? `${Vt}.so.node` : `${Vt}-${e}.so.node`;
  }
  var Yo = k(__require("node:child_process"));
  var ci = k(__require("node:fs/promises"));
  var Jt = k(__require("node:os"));
  var De = Symbol.for("@ts-pattern/matcher");
  var Qu = Symbol.for("@ts-pattern/isVariadic");
  var Qt = "@ts-pattern/anonymous-select-key";
  var si = (e) => !!(e && typeof e == "object");
  var Ut = (e) => e && !!e[De];
  var Ee = (e, r, t2) => {
    if (Ut(e)) {
      let n = e[De](), { matched: i, selections: o } = n.match(r);
      return i && o && Object.keys(o).forEach((s) => t2(s, o[s])), i;
    }
    if (si(e)) {
      if (!si(r))
        return false;
      if (Array.isArray(e)) {
        if (!Array.isArray(r))
          return false;
        let n = [], i = [], o = [];
        for (let s of e.keys()) {
          let a = e[s];
          Ut(a) && a[Qu] ? o.push(a) : o.length ? i.push(a) : n.push(a);
        }
        if (o.length) {
          if (o.length > 1)
            throw new Error("Pattern error: Using `...P.array(...)` several times in a single pattern is not allowed.");
          if (r.length < n.length + i.length)
            return false;
          let s = r.slice(0, n.length), a = i.length === 0 ? [] : r.slice(-i.length), l = r.slice(n.length, i.length === 0 ? 1 / 0 : -i.length);
          return n.every((u, c) => Ee(u, s[c], t2)) && i.every((u, c) => Ee(u, a[c], t2)) && (o.length === 0 || Ee(o[0], l, t2));
        }
        return e.length === r.length && e.every((s, a) => Ee(s, r[a], t2));
      }
      return Reflect.ownKeys(e).every((n) => {
        let i = e[n];
        return ((n in r) || Ut(o = i) && o[De]().matcherType === "optional") && Ee(i, r[n], t2);
        var o;
      });
    }
    return Object.is(r, e);
  };
  var Qe = (e) => {
    var r, t2, n;
    return si(e) ? Ut(e) ? (r = (t2 = (n = e[De]()).getSelectionKeys) == null ? undefined : t2.call(n)) != null ? r : [] : Array.isArray(e) ? zr(e, Qe) : zr(Object.values(e), Qe) : [];
  };
  var zr = (e, r) => e.reduce((t2, n) => t2.concat(r(n)), []);
  function pe(e) {
    return Object.assign(e, { optional: () => Gu(e), and: (r) => q(e, r), or: (r) => Wu(e, r), select: (r) => r === undefined ? Jo(e) : Jo(r, e) });
  }
  function Gu(e) {
    return pe({ [De]: () => ({ match: (r) => {
      let t2 = {}, n = (i, o) => {
        t2[i] = o;
      };
      return r === undefined ? (Qe(e).forEach((i) => n(i, undefined)), { matched: true, selections: t2 }) : { matched: Ee(e, r, n), selections: t2 };
    }, getSelectionKeys: () => Qe(e), matcherType: "optional" }) });
  }
  function q(...e) {
    return pe({ [De]: () => ({ match: (r) => {
      let t2 = {}, n = (i, o) => {
        t2[i] = o;
      };
      return { matched: e.every((i) => Ee(i, r, n)), selections: t2 };
    }, getSelectionKeys: () => zr(e, Qe), matcherType: "and" }) });
  }
  function Wu(...e) {
    return pe({ [De]: () => ({ match: (r) => {
      let t2 = {}, n = (i, o) => {
        t2[i] = o;
      };
      return zr(e, Qe).forEach((i) => n(i, undefined)), { matched: e.some((i) => Ee(i, r, n)), selections: t2 };
    }, getSelectionKeys: () => zr(e, Qe), matcherType: "or" }) });
  }
  function C(e) {
    return { [De]: () => ({ match: (r) => ({ matched: !!e(r) }) }) };
  }
  function Jo(...e) {
    let r = typeof e[0] == "string" ? e[0] : undefined, t2 = e.length === 2 ? e[1] : typeof e[0] == "string" ? undefined : e[0];
    return pe({ [De]: () => ({ match: (n) => {
      let i = { [r ?? Qt]: n };
      return { matched: t2 === undefined || Ee(t2, n, (o, s) => {
        i[o] = s;
      }), selections: i };
    }, getSelectionKeys: () => [r ?? Qt].concat(t2 === undefined ? [] : Qe(t2)) }) });
  }
  function ye(e) {
    return typeof e == "number";
  }
  function je(e) {
    return typeof e == "string";
  }
  function Ve(e) {
    return typeof e == "bigint";
  }
  var eg = pe(C(function(e) {
    return true;
  }));
  var Be = (e) => Object.assign(pe(e), { startsWith: (r) => {
    return Be(q(e, (t2 = r, C((n) => je(n) && n.startsWith(t2)))));
    var t2;
  }, endsWith: (r) => {
    return Be(q(e, (t2 = r, C((n) => je(n) && n.endsWith(t2)))));
    var t2;
  }, minLength: (r) => Be(q(e, ((t2) => C((n) => je(n) && n.length >= t2))(r))), length: (r) => Be(q(e, ((t2) => C((n) => je(n) && n.length === t2))(r))), maxLength: (r) => Be(q(e, ((t2) => C((n) => je(n) && n.length <= t2))(r))), includes: (r) => {
    return Be(q(e, (t2 = r, C((n) => je(n) && n.includes(t2)))));
    var t2;
  }, regex: (r) => {
    return Be(q(e, (t2 = r, C((n) => je(n) && !!n.match(t2)))));
    var t2;
  } });
  var rg = Be(C(je));
  var be = (e) => Object.assign(pe(e), { between: (r, t2) => be(q(e, ((n, i) => C((o) => ye(o) && n <= o && i >= o))(r, t2))), lt: (r) => be(q(e, ((t2) => C((n) => ye(n) && n < t2))(r))), gt: (r) => be(q(e, ((t2) => C((n) => ye(n) && n > t2))(r))), lte: (r) => be(q(e, ((t2) => C((n) => ye(n) && n <= t2))(r))), gte: (r) => be(q(e, ((t2) => C((n) => ye(n) && n >= t2))(r))), int: () => be(q(e, C((r) => ye(r) && Number.isInteger(r)))), finite: () => be(q(e, C((r) => ye(r) && Number.isFinite(r)))), positive: () => be(q(e, C((r) => ye(r) && r > 0))), negative: () => be(q(e, C((r) => ye(r) && r < 0))) });
  var tg = be(C(ye));
  var Ue = (e) => Object.assign(pe(e), { between: (r, t2) => Ue(q(e, ((n, i) => C((o) => Ve(o) && n <= o && i >= o))(r, t2))), lt: (r) => Ue(q(e, ((t2) => C((n) => Ve(n) && n < t2))(r))), gt: (r) => Ue(q(e, ((t2) => C((n) => Ve(n) && n > t2))(r))), lte: (r) => Ue(q(e, ((t2) => C((n) => Ve(n) && n <= t2))(r))), gte: (r) => Ue(q(e, ((t2) => C((n) => Ve(n) && n >= t2))(r))), positive: () => Ue(q(e, C((r) => Ve(r) && r > 0))), negative: () => Ue(q(e, C((r) => Ve(r) && r < 0))) });
  var ng = Ue(C(Ve));
  var ig = pe(C(function(e) {
    return typeof e == "boolean";
  }));
  var og = pe(C(function(e) {
    return typeof e == "symbol";
  }));
  var sg = pe(C(function(e) {
    return e == null;
  }));
  var ag = pe(C(function(e) {
    return e != null;
  }));
  var ai = class extends Error {
    constructor(r) {
      let t2;
      try {
        t2 = JSON.stringify(r);
      } catch {
        t2 = r;
      }
      super(`Pattern matching error: no pattern matches value ${t2}`), this.input = undefined, this.input = r;
    }
  };
  var li = { matched: false, value: undefined };
  function hr(e) {
    return new ui(e, li);
  }
  var ui = class e {
    constructor(r, t2) {
      this.input = undefined, this.state = undefined, this.input = r, this.state = t2;
    }
    with(...r) {
      if (this.state.matched)
        return this;
      let t2 = r[r.length - 1], n = [r[0]], i;
      r.length === 3 && typeof r[1] == "function" ? i = r[1] : r.length > 2 && n.push(...r.slice(1, r.length - 1));
      let o = false, s = {}, a = (u, c) => {
        o = true, s[u] = c;
      }, l = !n.some((u) => Ee(u, this.input, a)) || i && !i(this.input) ? li : { matched: true, value: t2(o ? Qt in s ? s[Qt] : s : this.input, this.input) };
      return new e(this.input, l);
    }
    when(r, t2) {
      if (this.state.matched)
        return this;
      let n = !!r(this.input);
      return new e(this.input, n ? { matched: true, value: t2(this.input, this.input) } : li);
    }
    otherwise(r) {
      return this.state.matched ? this.state.value : r(this.input);
    }
    exhaustive() {
      if (this.state.matched)
        return this.state.value;
      throw new ai(this.input);
    }
    run() {
      return this.exhaustive();
    }
    returnType() {
      return this;
    }
  };
  var zo = __require("node:util");
  var Ju = { warn: ke("prisma:warn") };
  var Hu = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
  function Gt(e, ...r) {
    Hu.warn() && console.warn(`${Ju.warn} ${e}`, ...r);
  }
  var Ku = (0, zo.promisify)(Yo.default.exec);
  var ee = gr("prisma:get-platform");
  var Yu = ["1.0.x", "1.1.x", "3.0.x"];
  async function Zo() {
    let e = Jt.default.platform(), r = process.arch;
    if (e === "freebsd") {
      let s = await Ht("freebsd-version");
      if (s && s.trim().length > 0) {
        let l = /^(\d+)\.?/.exec(s);
        if (l)
          return { platform: "freebsd", targetDistro: `freebsd${l[1]}`, arch: r };
      }
    }
    if (e !== "linux")
      return { platform: e, arch: r };
    let t2 = await Zu(), n = await sc(), i = ec({ arch: r, archFromUname: n, familyDistro: t2.familyDistro }), { libssl: o } = await rc(i);
    return { platform: "linux", libssl: o, arch: r, archFromUname: n, ...t2 };
  }
  function zu(e) {
    let r = /^ID="?([^"\n]*)"?$/im, t2 = /^ID_LIKE="?([^"\n]*)"?$/im, n = r.exec(e), i = n && n[1] && n[1].toLowerCase() || "", o = t2.exec(e), s = o && o[1] && o[1].toLowerCase() || "", a = hr({ id: i, idLike: s }).with({ id: "alpine" }, ({ id: l }) => ({ targetDistro: "musl", familyDistro: l, originalDistro: l })).with({ id: "raspbian" }, ({ id: l }) => ({ targetDistro: "arm", familyDistro: "debian", originalDistro: l })).with({ id: "nixos" }, ({ id: l }) => ({ targetDistro: "nixos", originalDistro: l, familyDistro: "nixos" })).with({ id: "debian" }, { id: "ubuntu" }, ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).with({ id: "rhel" }, { id: "centos" }, { id: "fedora" }, ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).when(({ idLike: l }) => l.includes("debian") || l.includes("ubuntu"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "debian", originalDistro: l })).when(({ idLike: l }) => i === "arch" || l.includes("arch"), ({ id: l }) => ({ targetDistro: "debian", familyDistro: "arch", originalDistro: l })).when(({ idLike: l }) => l.includes("centos") || l.includes("fedora") || l.includes("rhel") || l.includes("suse"), ({ id: l }) => ({ targetDistro: "rhel", familyDistro: "rhel", originalDistro: l })).otherwise(({ id: l }) => ({ targetDistro: undefined, familyDistro: undefined, originalDistro: l }));
    return ee(`Found distro info:
${JSON.stringify(a, null, 2)}`), a;
  }
  async function Zu() {
    let e = "/etc/os-release";
    try {
      let r = await ci.default.readFile(e, { encoding: "utf-8" });
      return zu(r);
    } catch {
      return { targetDistro: undefined, familyDistro: undefined, originalDistro: undefined };
    }
  }
  function Xu(e) {
    let r = /^OpenSSL\s(\d+\.\d+)\.\d+/.exec(e);
    if (r) {
      let t2 = `${r[1]}.x`;
      return Xo(t2);
    }
  }
  function Ho(e) {
    let r = /libssl\.so\.(\d)(\.\d)?/.exec(e);
    if (r) {
      let t2 = `${r[1]}${r[2] ?? ".0"}.x`;
      return Xo(t2);
    }
  }
  function Xo(e) {
    let r = (() => {
      if (rs(e))
        return e;
      let t2 = e.split(".");
      return t2[1] = "0", t2.join(".");
    })();
    if (Yu.includes(r))
      return r;
  }
  function ec(e) {
    return hr(e).with({ familyDistro: "musl" }, () => (ee('Trying platform-specific paths for "alpine"'), ["/lib", "/usr/lib"])).with({ familyDistro: "debian" }, ({ archFromUname: r }) => (ee('Trying platform-specific paths for "debian" (and "ubuntu")'), [`/usr/lib/${r}-linux-gnu`, `/lib/${r}-linux-gnu`])).with({ familyDistro: "rhel" }, () => (ee('Trying platform-specific paths for "rhel"'), ["/lib64", "/usr/lib64"])).otherwise(({ familyDistro: r, arch: t2, archFromUname: n }) => (ee(`Don't know any platform-specific paths for "${r}" on ${t2} (${n})`), []));
  }
  async function rc(e) {
    let r = 'grep -v "libssl.so.0"', t2 = await Ko(e);
    if (t2) {
      ee(`Found libssl.so file using platform-specific paths: ${t2}`);
      let o = Ho(t2);
      if (ee(`The parsed libssl version is: ${o}`), o)
        return { libssl: o, strategy: "libssl-specific-path" };
    }
    ee('Falling back to "ldconfig" and other generic paths');
    let n = await Ht(`ldconfig -p | sed "s/.*=>s*//" | sed "s|.*/||" | grep libssl | sort | ${r}`);
    if (n || (n = await Ko(["/lib64", "/usr/lib64", "/lib", "/usr/lib"])), n) {
      ee(`Found libssl.so file using "ldconfig" or other generic paths: ${n}`);
      let o = Ho(n);
      if (ee(`The parsed libssl version is: ${o}`), o)
        return { libssl: o, strategy: "ldconfig" };
    }
    let i = await Ht("openssl version -v");
    if (i) {
      ee(`Found openssl binary with version: ${i}`);
      let o = Xu(i);
      if (ee(`The parsed openssl version is: ${o}`), o)
        return { libssl: o, strategy: "openssl-binary" };
    }
    return ee("Couldn't find any version of libssl or OpenSSL in the system"), {};
  }
  async function Ko(e) {
    for (let r of e) {
      let t2 = await tc(r);
      if (t2)
        return t2;
    }
  }
  async function tc(e) {
    try {
      return (await ci.default.readdir(e)).find((t2) => t2.startsWith("libssl.so.") && !t2.startsWith("libssl.so.0"));
    } catch (r) {
      if (r.code === "ENOENT")
        return;
      throw r;
    }
  }
  async function ir() {
    let { binaryTarget: e } = await es();
    return e;
  }
  function nc(e) {
    return e.binaryTarget !== undefined;
  }
  async function pi() {
    let { memoized: e, ...r } = await es();
    return r;
  }
  var Wt = {};
  async function es() {
    if (nc(Wt))
      return Promise.resolve({ ...Wt, memoized: true });
    let e = await Zo(), r = ic(e);
    return Wt = { ...e, binaryTarget: r }, { ...Wt, memoized: false };
  }
  function ic(e) {
    let { platform: r, arch: t2, archFromUname: n, libssl: i, targetDistro: o, familyDistro: s, originalDistro: a } = e;
    r === "linux" && !["x64", "arm64"].includes(t2) && Gt(`Prisma only officially supports Linux on amd64 (x86_64) and arm64 (aarch64) system architectures (detected "${t2}" instead). If you are using your own custom Prisma engines, you can ignore this warning, as long as you've compiled the engines for your system architecture "${n}".`);
    let l = "1.1.x";
    if (r === "linux" && i === undefined) {
      let c = hr({ familyDistro: s }).with({ familyDistro: "debian" }, () => "Please manually install OpenSSL via `apt-get update -y && apt-get install -y openssl` and try installing Prisma again. If you're running Prisma on Docker, add this command to your Dockerfile, or switch to an image that already has OpenSSL installed.").otherwise(() => "Please manually install OpenSSL and try installing Prisma again.");
      Gt(`Prisma failed to detect the libssl/openssl version to use, and may not work as expected. Defaulting to "openssl-${l}".
${c}`);
    }
    let u = "debian";
    if (r === "linux" && o === undefined && ee(`Distro is "${a}". Falling back to Prisma engines built for "${u}".`), r === "darwin" && t2 === "arm64")
      return "darwin-arm64";
    if (r === "darwin")
      return "darwin";
    if (r === "win32")
      return "windows";
    if (r === "freebsd")
      return o;
    if (r === "openbsd")
      return "openbsd";
    if (r === "netbsd")
      return "netbsd";
    if (r === "linux" && o === "nixos")
      return "linux-nixos";
    if (r === "linux" && t2 === "arm64")
      return `${o === "musl" ? "linux-musl-arm64" : "linux-arm64"}-openssl-${i || l}`;
    if (r === "linux" && t2 === "arm")
      return `linux-arm-openssl-${i || l}`;
    if (r === "linux" && o === "musl") {
      let c = "linux-musl";
      return !i || rs(i) ? c : `${c}-openssl-${i}`;
    }
    return r === "linux" && o && i ? `${o}-openssl-${i}` : (r !== "linux" && Gt(`Prisma detected unknown OS "${r}" and may not work as expected. Defaulting to "linux".`), i ? `${u}-openssl-${i}` : o ? `${o}-openssl-${l}` : `${u}-openssl-${l}`);
  }
  async function oc(e) {
    try {
      return await e();
    } catch {
      return;
    }
  }
  function Ht(e) {
    return oc(async () => {
      let r = await Ku(e);
      return ee(`Command "${e}" successfully returned "${r.stdout}"`), r.stdout;
    });
  }
  async function sc() {
    return typeof Jt.default.machine == "function" ? Jt.default.machine() : (await Ht("uname -m"))?.trim();
  }
  function rs(e) {
    return e.startsWith("1.");
  }
  var zt = {};
  tr(zt, { beep: () => Dc, clearScreen: () => Ac, clearTerminal: () => Ic, cursorBackward: () => mc, cursorDown: () => pc, cursorForward: () => dc, cursorGetPosition: () => hc, cursorHide: () => Ec, cursorLeft: () => is, cursorMove: () => cc, cursorNextLine: () => yc, cursorPrevLine: () => bc, cursorRestorePosition: () => gc, cursorSavePosition: () => fc, cursorShow: () => wc, cursorTo: () => uc, cursorUp: () => ns, enterAlternativeScreen: () => kc, eraseDown: () => Tc, eraseEndLine: () => vc, eraseLine: () => os, eraseLines: () => xc, eraseScreen: () => di, eraseStartLine: () => Pc, eraseUp: () => Sc, exitAlternativeScreen: () => Oc, iTerm: () => Fc, image: () => Nc, link: () => _c, scrollDown: () => Cc, scrollUp: () => Rc });
  var Yt = k(__require("node:process"), 1);
  var Kt = globalThis.window?.document !== undefined;
  var gg = globalThis.process?.versions?.node !== undefined;
  var hg = globalThis.process?.versions?.bun !== undefined;
  var yg = globalThis.Deno?.version?.deno !== undefined;
  var bg = globalThis.process?.versions?.electron !== undefined;
  var Eg = globalThis.navigator?.userAgent?.includes("jsdom") === true;
  var wg = typeof WorkerGlobalScope < "u" && globalThis instanceof WorkerGlobalScope;
  var xg = typeof DedicatedWorkerGlobalScope < "u" && globalThis instanceof DedicatedWorkerGlobalScope;
  var vg = typeof SharedWorkerGlobalScope < "u" && globalThis instanceof SharedWorkerGlobalScope;
  var Pg = typeof ServiceWorkerGlobalScope < "u" && globalThis instanceof ServiceWorkerGlobalScope;
  var Zr = globalThis.navigator?.userAgentData?.platform;
  var Tg = Zr === "macOS" || globalThis.navigator?.platform === "MacIntel" || globalThis.navigator?.userAgent?.includes(" Mac ") === true || globalThis.process?.platform === "darwin";
  var Sg = Zr === "Windows" || globalThis.navigator?.platform === "Win32" || globalThis.process?.platform === "win32";
  var Rg = Zr === "Linux" || globalThis.navigator?.platform?.startsWith("Linux") === true || globalThis.navigator?.userAgent?.includes(" Linux ") === true || globalThis.process?.platform === "linux";
  var Cg = Zr === "iOS" || globalThis.navigator?.platform === "MacIntel" && globalThis.navigator?.maxTouchPoints > 1 || /iPad|iPhone|iPod/.test(globalThis.navigator?.platform);
  var Ag = Zr === "Android" || globalThis.navigator?.platform === "Android" || globalThis.navigator?.userAgent?.includes(" Android ") === true || globalThis.process?.platform === "android";
  var A = "\x1B[";
  var et = "\x1B]";
  var yr = "\x07";
  var Xr = ";";
  var ts = !Kt && Yt.default.env.TERM_PROGRAM === "Apple_Terminal";
  var ac = !Kt && Yt.default.platform === "win32";
  var lc = Kt ? () => {
    throw new Error("`process.cwd()` only works in Node.js, not the browser.");
  } : Yt.default.cwd;
  var uc = (e, r) => {
    if (typeof e != "number")
      throw new TypeError("The `x` argument is required");
    return typeof r != "number" ? A + (e + 1) + "G" : A + (r + 1) + Xr + (e + 1) + "H";
  };
  var cc = (e, r) => {
    if (typeof e != "number")
      throw new TypeError("The `x` argument is required");
    let t2 = "";
    return e < 0 ? t2 += A + -e + "D" : e > 0 && (t2 += A + e + "C"), r < 0 ? t2 += A + -r + "A" : r > 0 && (t2 += A + r + "B"), t2;
  };
  var ns = (e = 1) => A + e + "A";
  var pc = (e = 1) => A + e + "B";
  var dc = (e = 1) => A + e + "C";
  var mc = (e = 1) => A + e + "D";
  var is = A + "G";
  var fc = ts ? "\x1B7" : A + "s";
  var gc = ts ? "\x1B8" : A + "u";
  var hc = A + "6n";
  var yc = A + "E";
  var bc = A + "F";
  var Ec = A + "?25l";
  var wc = A + "?25h";
  var xc = (e) => {
    let r = "";
    for (let t2 = 0;t2 < e; t2++)
      r += os + (t2 < e - 1 ? ns() : "");
    return e && (r += is), r;
  };
  var vc = A + "K";
  var Pc = A + "1K";
  var os = A + "2K";
  var Tc = A + "J";
  var Sc = A + "1J";
  var di = A + "2J";
  var Rc = A + "S";
  var Cc = A + "T";
  var Ac = "\x1Bc";
  var Ic = ac ? `${di}${A}0f` : `${di}${A}3J${A}H`;
  var kc = A + "?1049h";
  var Oc = A + "?1049l";
  var Dc = yr;
  var _c = (e, r) => [et, "8", Xr, Xr, r, yr, e, et, "8", Xr, Xr, yr].join("");
  var Nc = (e, r = {}) => {
    let t2 = `${et}1337;File=inline=1`;
    return r.width && (t2 += `;width=${r.width}`), r.height && (t2 += `;height=${r.height}`), r.preserveAspectRatio === false && (t2 += ";preserveAspectRatio=0"), t2 + ":" + Buffer.from(e).toString("base64") + yr;
  };
  var Fc = { setCwd: (e = lc()) => `${et}50;CurrentDir=${e}${yr}`, annotation(e, r = {}) {
    let t2 = `${et}1337;`, n = r.x !== undefined, i = r.y !== undefined;
    if ((n || i) && !(n && i && r.length !== undefined))
      throw new Error("`x`, `y` and `length` must be defined when `x` or `y` is defined");
    return e = e.replaceAll("|", ""), t2 += r.isHidden ? "AddHiddenAnnotation=" : "AddAnnotation=", r.length > 0 ? t2 += (n ? [e, r.length, r.x, r.y] : [r.length, e]).join("|") : t2 += e, t2 + yr;
  } };
  var Zt = k(ds(), 1);
  function or(e, r, { target: t2 = "stdout", ...n } = {}) {
    return Zt.default[t2] ? zt.link(e, r) : n.fallback === false ? e : typeof n.fallback == "function" ? n.fallback(e, r) : `${e} (​${r}​)`;
  }
  or.isSupported = Zt.default.stdout;
  or.stderr = (e, r, t2 = {}) => or(e, r, { target: "stderr", ...t2 });
  or.stderr.isSupported = Zt.default.stderr;
  function yi(e) {
    return or(e, e, { fallback: Y });
  }
  var jc = ms();
  var bi = jc.version;
  function Er(e) {
    let r = Vc();
    return r || (e?.config.engineType === "library" ? "library" : e?.config.engineType === "binary" ? "binary" : e?.config.engineType === "client" ? "client" : Bc(e));
  }
  function Vc() {
    let e = process.env.PRISMA_CLIENT_ENGINE_TYPE;
    return e === "library" ? "library" : e === "binary" ? "binary" : e === "client" ? "client" : undefined;
  }
  function Bc(e) {
    return e?.previewFeatures.includes("queryCompiler") ? "client" : "library";
  }
  var Qc = k(wi());
  var M = k(__require("node:path"));
  var Gc = k(wi());
  var ah = N("prisma:engines");
  function fs() {
    return M.default.join(__dirname, "../");
  }
  M.default.join(__dirname, "../query-engine-darwin");
  M.default.join(__dirname, "../query-engine-darwin-arm64");
  M.default.join(__dirname, "../query-engine-debian-openssl-1.0.x");
  M.default.join(__dirname, "../query-engine-debian-openssl-1.1.x");
  M.default.join(__dirname, "../query-engine-debian-openssl-3.0.x");
  M.default.join(__dirname, "../query-engine-linux-static-x64");
  M.default.join(__dirname, "../query-engine-linux-static-arm64");
  M.default.join(__dirname, "../query-engine-rhel-openssl-1.0.x");
  M.default.join(__dirname, "../query-engine-rhel-openssl-1.1.x");
  M.default.join(__dirname, "../query-engine-rhel-openssl-3.0.x");
  M.default.join(__dirname, "../libquery_engine-darwin.dylib.node");
  M.default.join(__dirname, "../libquery_engine-darwin-arm64.dylib.node");
  M.default.join(__dirname, "../libquery_engine-debian-openssl-1.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-debian-openssl-1.1.x.so.node");
  M.default.join(__dirname, "../libquery_engine-debian-openssl-3.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-1.1.x.so.node");
  M.default.join(__dirname, "../libquery_engine-linux-arm64-openssl-3.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-linux-musl.so.node");
  M.default.join(__dirname, "../libquery_engine-linux-musl-openssl-3.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-rhel-openssl-1.0.x.so.node");
  M.default.join(__dirname, "../libquery_engine-rhel-openssl-1.1.x.so.node");
  M.default.join(__dirname, "../libquery_engine-rhel-openssl-3.0.x.so.node");
  M.default.join(__dirname, "../query_engine-windows.dll.node");
  var xi = k(__require("node:fs"));
  var gs = gr("chmodPlusX");
  function vi(e) {
    if (process.platform === "win32")
      return;
    let r = xi.default.statSync(e), t2 = r.mode | 64 | 8 | 1;
    if (r.mode === t2) {
      gs(`Execution permissions of ${e} are fine`);
      return;
    }
    let n = t2.toString(8).slice(-3);
    gs(`Have to call chmodPlusX on ${e}`), xi.default.chmodSync(e, n);
  }
  function Pi(e) {
    let r = e.e, t2 = (a) => `Prisma cannot find the required \`${a}\` system library in your system`, n = r.message.includes("cannot open shared object file"), i = `Please refer to the documentation about Prisma's system requirements: ${yi("https://pris.ly/d/system-requirements")}`, o = `Unable to require(\`${Ie(e.id)}\`).`, s = hr({ message: r.message, code: r.code }).with({ code: "ENOENT" }, () => "File does not exist.").when(({ message: a }) => n && a.includes("libz"), () => `${t2("libz")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libgcc_s"), () => `${t2("libgcc_s")}. Please install it and try again.`).when(({ message: a }) => n && a.includes("libssl"), () => {
      let a = e.platformInfo.libssl ? `openssl-${e.platformInfo.libssl}` : "openssl";
      return `${t2("libssl")}. Please install ${a} and try again.`;
    }).when(({ message: a }) => a.includes("GLIBC"), () => `Prisma has detected an incompatible version of the \`glibc\` C standard library installed in your system. This probably means your system may be too old to run Prisma. ${i}`).when(({ message: a }) => e.platformInfo.platform === "linux" && a.includes("symbol not found"), () => `The Prisma engines are not compatible with your system ${e.platformInfo.originalDistro} on (${e.platformInfo.archFromUname}) which uses the \`${e.platformInfo.binaryTarget}\` binaryTarget by default. ${i}`).otherwise(() => `The Prisma engines do not seem to be compatible with your system. ${i}`);
    return `${o}
${s}

Details: ${r.message}`;
  }
  var bs = k(ys(), 1);
  function Ti(e) {
    let r = (0, bs.default)(e);
    if (r === 0)
      return e;
    let t2 = new RegExp(`^[ \\t]{${r}}`, "gm");
    return e.replace(t2, "");
  }
  var Es = "prisma+postgres";
  var en = `${Es}:`;
  function Si(e) {
    return e?.startsWith(`${en}//`) ?? false;
  }
  var xs = k(Ri());
  function Ai(e) {
    return String(new Ci(e));
  }
  var Ci = class {
    constructor(r) {
      this.config = r;
    }
    toString() {
      let { config: r } = this, t2 = r.provider.fromEnvVar ? `env("${r.provider.fromEnvVar}")` : r.provider.value, n = JSON.parse(JSON.stringify({ provider: t2, binaryTargets: Wc(r.binaryTargets) }));
      return `generator ${r.name} {
${(0, xs.default)(Jc(n), 2)}
}`;
    }
  };
  function Wc(e) {
    let r;
    if (e.length > 0) {
      let t2 = e.find((n) => n.fromEnvVar !== null);
      t2 ? r = `env("${t2.fromEnvVar}")` : r = e.map((n) => n.native ? "native" : n.value);
    } else
      r = undefined;
    return r;
  }
  function Jc(e) {
    let r = Object.keys(e).reduce((t2, n) => Math.max(t2, n.length), 0);
    return Object.entries(e).map(([t2, n]) => `${t2.padEnd(r)} = ${Hc(n)}`).join(`
`);
  }
  function Hc(e) {
    return JSON.parse(JSON.stringify(e, (r, t2) => Array.isArray(t2) ? `[${t2.map((n) => JSON.stringify(n)).join(", ")}]` : JSON.stringify(t2)));
  }
  var tt = {};
  tr(tt, { error: () => zc, info: () => Yc, log: () => Kc, query: () => Zc, should: () => vs, tags: () => rt, warn: () => Ii });
  var rt = { error: ce("prisma:error"), warn: ke("prisma:warn"), info: Oe("prisma:info"), query: nr("prisma:query") };
  var vs = { warn: () => !process.env.PRISMA_DISABLE_WARNINGS };
  function Kc(...e) {
    console.log(...e);
  }
  function Ii(e, ...r) {
    vs.warn() && console.warn(`${rt.warn} ${e}`, ...r);
  }
  function Yc(e, ...r) {
    console.info(`${rt.info} ${e}`, ...r);
  }
  function zc(e, ...r) {
    console.error(`${rt.error} ${e}`, ...r);
  }
  function Zc(e, ...r) {
    console.log(`${rt.query} ${e}`, ...r);
  }
  function rn(e, r) {
    if (!e)
      throw new Error(`${r}. This should never happen. If you see this error, please, open an issue at https://pris.ly/prisma-prisma-bug-report`);
  }
  function _e(e, r) {
    throw new Error(r);
  }
  var nt = k(__require("node:path"));
  function Oi(e) {
    return nt.default.sep === nt.default.posix.sep ? e : e.split(nt.default.sep).join(nt.default.posix.sep);
  }
  var Li = k(ks());
  var nn = k(__require("node:fs"));
  var wr = k(__require("node:path"));
  function Os(e) {
    let r = e.ignoreProcessEnv ? {} : process.env, t2 = (n) => n.match(/(.?\${(?:[a-zA-Z0-9_]+)?})/g)?.reduce(function(o, s) {
      let a = /(.?)\${([a-zA-Z0-9_]+)?}/g.exec(s);
      if (!a)
        return o;
      let l = a[1], u, c;
      if (l === "\\")
        c = a[0], u = c.replace("\\$", "$");
      else {
        let p = a[2];
        c = a[0].substring(l.length), u = Object.hasOwnProperty.call(r, p) ? r[p] : e.parsed[p] || "", u = t2(u);
      }
      return o.replace(c, u);
    }, n) ?? n;
    for (let n in e.parsed) {
      let i = Object.hasOwnProperty.call(r, n) ? r[n] : e.parsed[n];
      e.parsed[n] = t2(i);
    }
    for (let n in e.parsed)
      r[n] = e.parsed[n];
    return e;
  }
  var Fi = gr("prisma:tryLoadEnv");
  function it({ rootEnvPath: e, schemaEnvPath: r }, t2 = { conflictCheck: "none" }) {
    let n = Ds(e);
    t2.conflictCheck !== "none" && gp(n, r, t2.conflictCheck);
    let i = null;
    return _s(n?.path, r) || (i = Ds(r)), !n && !i && Fi("No Environment variables loaded"), i?.dotenvResult.error ? console.error(ce(W("Schema Env Error: ")) + i.dotenvResult.error) : { message: [n?.message, i?.message].filter(Boolean).join(`
`), parsed: { ...n?.dotenvResult?.parsed, ...i?.dotenvResult?.parsed } };
  }
  function gp(e, r, t2) {
    let n = e?.dotenvResult.parsed, i = !_s(e?.path, r);
    if (n && r && i && nn.default.existsSync(r)) {
      let o = Li.default.parse(nn.default.readFileSync(r)), s = [];
      for (let a in o)
        n[a] === o[a] && s.push(a);
      if (s.length > 0) {
        let a = wr.default.relative(process.cwd(), e.path), l = wr.default.relative(process.cwd(), r);
        if (t2 === "error") {
          let u = `There is a conflict between env var${s.length > 1 ? "s" : ""} in ${Y(a)} and ${Y(l)}
Conflicting env vars:
${s.map((c) => `  ${W(c)}`).join(`
`)}

We suggest to move the contents of ${Y(l)} to ${Y(a)} to consolidate your env vars.
`;
          throw new Error(u);
        } else if (t2 === "warn") {
          let u = `Conflict for env var${s.length > 1 ? "s" : ""} ${s.map((c) => W(c)).join(", ")} in ${Y(a)} and ${Y(l)}
Env vars from ${Y(l)} overwrite the ones from ${Y(a)}
      `;
          console.warn(`${ke("warn(prisma)")} ${u}`);
        }
      }
    }
  }
  function Ds(e) {
    if (hp(e)) {
      Fi(`Environment variables loaded from ${e}`);
      let r = Li.default.config({ path: e, debug: process.env.DOTENV_CONFIG_DEBUG ? true : undefined });
      return { dotenvResult: Os(r), message: Ie(`Environment variables loaded from ${wr.default.relative(process.cwd(), e)}`), path: e };
    } else
      Fi(`Environment variables not found at ${e}`);
    return null;
  }
  function _s(e, r) {
    return e && r && wr.default.resolve(e) === wr.default.resolve(r);
  }
  function hp(e) {
    return !!(e && nn.default.existsSync(e));
  }
  function Mi(e, r) {
    return Object.prototype.hasOwnProperty.call(e, r);
  }
  function xr(e, r) {
    let t2 = {};
    for (let n of Object.keys(e))
      t2[n] = r(e[n], n);
    return t2;
  }
  function $i(e, r) {
    if (e.length === 0)
      return;
    let t2 = e[0];
    for (let n = 1;n < e.length; n++)
      r(t2, e[n]) < 0 && (t2 = e[n]);
    return t2;
  }
  function x(e, r) {
    Object.defineProperty(e, "name", { value: r, configurable: true });
  }
  var Fs = new Set;
  var ot = (e, r, ...t2) => {
    Fs.has(e) || (Fs.add(e), Ii(r, ...t2));
  };
  var T = class e extends Error {
    clientVersion;
    errorCode;
    retryable;
    constructor(r, t2, n) {
      super(r), this.name = "PrismaClientInitializationError", this.clientVersion = t2, this.errorCode = n, Error.captureStackTrace(e);
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientInitializationError";
    }
  };
  x(T, "PrismaClientInitializationError");
  var z2 = class extends Error {
    code;
    meta;
    clientVersion;
    batchRequestIdx;
    constructor(r, { code: t2, clientVersion: n, meta: i, batchRequestIdx: o }) {
      super(r), this.name = "PrismaClientKnownRequestError", this.code = t2, this.clientVersion = n, this.meta = i, Object.defineProperty(this, "batchRequestIdx", { value: o, enumerable: false, writable: true });
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientKnownRequestError";
    }
  };
  x(z2, "PrismaClientKnownRequestError");
  var le = class extends Error {
    clientVersion;
    constructor(r, t2) {
      super(r), this.name = "PrismaClientRustPanicError", this.clientVersion = t2;
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientRustPanicError";
    }
  };
  x(le, "PrismaClientRustPanicError");
  var j = class extends Error {
    clientVersion;
    batchRequestIdx;
    constructor(r, { clientVersion: t2, batchRequestIdx: n }) {
      super(r), this.name = "PrismaClientUnknownRequestError", this.clientVersion = t2, Object.defineProperty(this, "batchRequestIdx", { value: n, writable: true, enumerable: false });
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientUnknownRequestError";
    }
  };
  x(j, "PrismaClientUnknownRequestError");
  var Z = class extends Error {
    name = "PrismaClientValidationError";
    clientVersion;
    constructor(r, { clientVersion: t2 }) {
      super(r), this.clientVersion = t2;
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientValidationError";
    }
  };
  x(Z, "PrismaClientValidationError");
  var vr = 9000000000000000;
  var Ke = 1e9;
  var qi = "0123456789abcdef";
  var un = "2.3025850929940456840179914546843642076011014886287729760333279009675726096773524802359972050895982983419677840422862486334095254650828067566662873690987816894829072083255546808437998948262331985283935053089653777326288461633662222876982198867465436674744042432743651550489343149393914796194044002221051017141748003688084012647080685567743216228355220114804663715659121373450747856947683463616792101806445070648000277502684916746550586856935673420670581136429224554405758925724208241314695689016758940256776311356919292033376587141660230105703089634572075440370847469940168269282808481184289314848524948644871927809676271275775397027668605952496716674183485704422507197965004714951050492214776567636938662976979522110718264549734772662425709429322582798502585509785265383207606726317164309505995087807523710333101197857547331541421808427543863591778117054309827482385045648019095610299291824318237525357709750539565187697510374970888692180205189339507238539205144634197265287286965110862571492198849978748873771345686209167058";
  var cn = "3.1415926535897932384626433832795028841971693993751058209749445923078164062862089986280348253421170679821480865132823066470938446095505822317253594081284811174502841027019385211055596446229489549303819644288109756659334461284756482337867831652712019091456485669234603486104543266482133936072602491412737245870066063155881748815209209628292540917153643678925903600113305305488204665213841469519415116094330572703657595919530921861173819326117931051185480744623799627495673518857527248912279381830119491298336733624406566430860213949463952247371907021798609437027705392171762931767523846748184676694051320005681271452635608277857713427577896091736371787214684409012249534301465495853710507922796892589235420199561121290219608640344181598136297747713099605187072113499999983729780499510597317328160963185950244594553469083026425223082533446850352619311881710100031378387528865875332083814206171776691473035982534904287554687311595628638823537875937519577818577805321712268066130019278766111959092164201989380952572010654858632789";
  var ji = { precision: 20, rounding: 4, modulo: 1, toExpNeg: -7, toExpPos: 21, minE: -vr, maxE: vr, crypto: false };
  var qs;
  var Fe;
  var w = true;
  var dn = "[DecimalError] ";
  var He = dn + "Invalid argument: ";
  var js = dn + "Precision limit exceeded";
  var Vs = dn + "crypto unavailable";
  var Bs = "[object Decimal]";
  var X = Math.floor;
  var U = Math.pow;
  var yp = /^0b([01]+(\.[01]*)?|\.[01]+)(p[+-]?\d+)?$/i;
  var bp = /^0x([0-9a-f]+(\.[0-9a-f]*)?|\.[0-9a-f]+)(p[+-]?\d+)?$/i;
  var Ep = /^0o([0-7]+(\.[0-7]*)?|\.[0-7]+)(p[+-]?\d+)?$/i;
  var Us = /^(\d+(\.\d*)?|\.\d+)(e[+-]?\d+)?$/i;
  var fe = 1e7;
  var E = 7;
  var wp = 9007199254740991;
  var xp = un.length - 1;
  var Vi = cn.length - 1;
  var m = { toStringTag: Bs };
  m.absoluteValue = m.abs = function() {
    var e = new this.constructor(this);
    return e.s < 0 && (e.s = 1), y(e);
  };
  m.ceil = function() {
    return y(new this.constructor(this), this.e + 1, 2);
  };
  m.clampedTo = m.clamp = function(e, r) {
    var t2, n = this, i = n.constructor;
    if (e = new i(e), r = new i(r), !e.s || !r.s)
      return new i(NaN);
    if (e.gt(r))
      throw Error(He + r);
    return t2 = n.cmp(e), t2 < 0 ? e : n.cmp(r) > 0 ? r : new i(n);
  };
  m.comparedTo = m.cmp = function(e) {
    var r, t2, n, i, o = this, s = o.d, a = (e = new o.constructor(e)).d, l = o.s, u = e.s;
    if (!s || !a)
      return !l || !u ? NaN : l !== u ? l : s === a ? 0 : !s ^ l < 0 ? 1 : -1;
    if (!s[0] || !a[0])
      return s[0] ? l : a[0] ? -u : 0;
    if (l !== u)
      return l;
    if (o.e !== e.e)
      return o.e > e.e ^ l < 0 ? 1 : -1;
    for (n = s.length, i = a.length, r = 0, t2 = n < i ? n : i;r < t2; ++r)
      if (s[r] !== a[r])
        return s[r] > a[r] ^ l < 0 ? 1 : -1;
    return n === i ? 0 : n > i ^ l < 0 ? 1 : -1;
  };
  m.cosine = m.cos = function() {
    var e, r, t2 = this, n = t2.constructor;
    return t2.d ? t2.d[0] ? (e = n.precision, r = n.rounding, n.precision = e + Math.max(t2.e, t2.sd()) + E, n.rounding = 1, t2 = vp(n, Hs(n, t2)), n.precision = e, n.rounding = r, y(Fe == 2 || Fe == 3 ? t2.neg() : t2, e, r, true)) : new n(1) : new n(NaN);
  };
  m.cubeRoot = m.cbrt = function() {
    var e, r, t2, n, i, o, s, a, l, u, c = this, p = c.constructor;
    if (!c.isFinite() || c.isZero())
      return new p(c);
    for (w = false, o = c.s * U(c.s * c, 1 / 3), !o || Math.abs(o) == 1 / 0 ? (t2 = J(c.d), e = c.e, (o = (e - t2.length + 1) % 3) && (t2 += o == 1 || o == -2 ? "0" : "00"), o = U(t2, 1 / 3), e = X((e + 1) / 3) - (e % 3 == (e < 0 ? -1 : 2)), o == 1 / 0 ? t2 = "5e" + e : (t2 = o.toExponential(), t2 = t2.slice(0, t2.indexOf("e") + 1) + e), n = new p(t2), n.s = c.s) : n = new p(o.toString()), s = (e = p.precision) + 3;; )
      if (a = n, l = a.times(a).times(a), u = l.plus(c), n = F(u.plus(c).times(a), u.plus(l), s + 2, 1), J(a.d).slice(0, s) === (t2 = J(n.d)).slice(0, s))
        if (t2 = t2.slice(s - 3, s + 1), t2 == "9999" || !i && t2 == "4999") {
          if (!i && (y(a, e + 1, 0), a.times(a).times(a).eq(c))) {
            n = a;
            break;
          }
          s += 4, i = 1;
        } else {
          (!+t2 || !+t2.slice(1) && t2.charAt(0) == "5") && (y(n, e + 1, 1), r = !n.times(n).times(n).eq(c));
          break;
        }
    return w = true, y(n, e, p.rounding, r);
  };
  m.decimalPlaces = m.dp = function() {
    var e, r = this.d, t2 = NaN;
    if (r) {
      if (e = r.length - 1, t2 = (e - X(this.e / E)) * E, e = r[e], e)
        for (;e % 10 == 0; e /= 10)
          t2--;
      t2 < 0 && (t2 = 0);
    }
    return t2;
  };
  m.dividedBy = m.div = function(e) {
    return F(this, new this.constructor(e));
  };
  m.dividedToIntegerBy = m.divToInt = function(e) {
    var r = this, t2 = r.constructor;
    return y(F(r, new t2(e), 0, 1, 1), t2.precision, t2.rounding);
  };
  m.equals = m.eq = function(e) {
    return this.cmp(e) === 0;
  };
  m.floor = function() {
    return y(new this.constructor(this), this.e + 1, 3);
  };
  m.greaterThan = m.gt = function(e) {
    return this.cmp(e) > 0;
  };
  m.greaterThanOrEqualTo = m.gte = function(e) {
    var r = this.cmp(e);
    return r == 1 || r === 0;
  };
  m.hyperbolicCosine = m.cosh = function() {
    var e, r, t2, n, i, o = this, s = o.constructor, a = new s(1);
    if (!o.isFinite())
      return new s(o.s ? 1 / 0 : NaN);
    if (o.isZero())
      return a;
    t2 = s.precision, n = s.rounding, s.precision = t2 + Math.max(o.e, o.sd()) + 4, s.rounding = 1, i = o.d.length, i < 32 ? (e = Math.ceil(i / 3), r = (1 / fn(4, e)).toString()) : (e = 16, r = "2.3283064365386962890625e-10"), o = Pr(s, 1, o.times(r), new s(1), true);
    for (var l, u = e, c = new s(8);u--; )
      l = o.times(o), o = a.minus(l.times(c.minus(l.times(c))));
    return y(o, s.precision = t2, s.rounding = n, true);
  };
  m.hyperbolicSine = m.sinh = function() {
    var e, r, t2, n, i = this, o = i.constructor;
    if (!i.isFinite() || i.isZero())
      return new o(i);
    if (r = o.precision, t2 = o.rounding, o.precision = r + Math.max(i.e, i.sd()) + 4, o.rounding = 1, n = i.d.length, n < 3)
      i = Pr(o, 2, i, i, true);
    else {
      e = 1.4 * Math.sqrt(n), e = e > 16 ? 16 : e | 0, i = i.times(1 / fn(5, e)), i = Pr(o, 2, i, i, true);
      for (var s, a = new o(5), l = new o(16), u = new o(20);e--; )
        s = i.times(i), i = i.times(a.plus(s.times(l.times(s).plus(u))));
    }
    return o.precision = r, o.rounding = t2, y(i, r, t2, true);
  };
  m.hyperbolicTangent = m.tanh = function() {
    var e, r, t2 = this, n = t2.constructor;
    return t2.isFinite() ? t2.isZero() ? new n(t2) : (e = n.precision, r = n.rounding, n.precision = e + 7, n.rounding = 1, F(t2.sinh(), t2.cosh(), n.precision = e, n.rounding = r)) : new n(t2.s);
  };
  m.inverseCosine = m.acos = function() {
    var e = this, r = e.constructor, t2 = e.abs().cmp(1), n = r.precision, i = r.rounding;
    return t2 !== -1 ? t2 === 0 ? e.isNeg() ? we(r, n, i) : new r(0) : new r(NaN) : e.isZero() ? we(r, n + 4, i).times(0.5) : (r.precision = n + 6, r.rounding = 1, e = new r(1).minus(e).div(e.plus(1)).sqrt().atan(), r.precision = n, r.rounding = i, e.times(2));
  };
  m.inverseHyperbolicCosine = m.acosh = function() {
    var e, r, t2 = this, n = t2.constructor;
    return t2.lte(1) ? new n(t2.eq(1) ? 0 : NaN) : t2.isFinite() ? (e = n.precision, r = n.rounding, n.precision = e + Math.max(Math.abs(t2.e), t2.sd()) + 4, n.rounding = 1, w = false, t2 = t2.times(t2).minus(1).sqrt().plus(t2), w = true, n.precision = e, n.rounding = r, t2.ln()) : new n(t2);
  };
  m.inverseHyperbolicSine = m.asinh = function() {
    var e, r, t2 = this, n = t2.constructor;
    return !t2.isFinite() || t2.isZero() ? new n(t2) : (e = n.precision, r = n.rounding, n.precision = e + 2 * Math.max(Math.abs(t2.e), t2.sd()) + 6, n.rounding = 1, w = false, t2 = t2.times(t2).plus(1).sqrt().plus(t2), w = true, n.precision = e, n.rounding = r, t2.ln());
  };
  m.inverseHyperbolicTangent = m.atanh = function() {
    var e, r, t2, n, i = this, o = i.constructor;
    return i.isFinite() ? i.e >= 0 ? new o(i.abs().eq(1) ? i.s / 0 : i.isZero() ? i : NaN) : (e = o.precision, r = o.rounding, n = i.sd(), Math.max(n, e) < 2 * -i.e - 1 ? y(new o(i), e, r, true) : (o.precision = t2 = n - i.e, i = F(i.plus(1), new o(1).minus(i), t2 + e, 1), o.precision = e + 4, o.rounding = 1, i = i.ln(), o.precision = e, o.rounding = r, i.times(0.5))) : new o(NaN);
  };
  m.inverseSine = m.asin = function() {
    var e, r, t2, n, i = this, o = i.constructor;
    return i.isZero() ? new o(i) : (r = i.abs().cmp(1), t2 = o.precision, n = o.rounding, r !== -1 ? r === 0 ? (e = we(o, t2 + 4, n).times(0.5), e.s = i.s, e) : new o(NaN) : (o.precision = t2 + 6, o.rounding = 1, i = i.div(new o(1).minus(i.times(i)).sqrt().plus(1)).atan(), o.precision = t2, o.rounding = n, i.times(2)));
  };
  m.inverseTangent = m.atan = function() {
    var e, r, t2, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding;
    if (u.isFinite()) {
      if (u.isZero())
        return new c(u);
      if (u.abs().eq(1) && p + 4 <= Vi)
        return s = we(c, p + 4, d).times(0.25), s.s = u.s, s;
    } else {
      if (!u.s)
        return new c(NaN);
      if (p + 4 <= Vi)
        return s = we(c, p + 4, d).times(0.5), s.s = u.s, s;
    }
    for (c.precision = a = p + 10, c.rounding = 1, t2 = Math.min(28, a / E + 2 | 0), e = t2;e; --e)
      u = u.div(u.times(u).plus(1).sqrt().plus(1));
    for (w = false, r = Math.ceil(a / E), n = 1, l = u.times(u), s = new c(u), i = u;e !== -1; )
      if (i = i.times(l), o = s.minus(i.div(n += 2)), i = i.times(l), s = o.plus(i.div(n += 2)), s.d[r] !== undefined)
        for (e = r;s.d[e] === o.d[e] && e--; )
          ;
    return t2 && (s = s.times(2 << t2 - 1)), w = true, y(s, c.precision = p, c.rounding = d, true);
  };
  m.isFinite = function() {
    return !!this.d;
  };
  m.isInteger = m.isInt = function() {
    return !!this.d && X(this.e / E) > this.d.length - 2;
  };
  m.isNaN = function() {
    return !this.s;
  };
  m.isNegative = m.isNeg = function() {
    return this.s < 0;
  };
  m.isPositive = m.isPos = function() {
    return this.s > 0;
  };
  m.isZero = function() {
    return !!this.d && this.d[0] === 0;
  };
  m.lessThan = m.lt = function(e) {
    return this.cmp(e) < 0;
  };
  m.lessThanOrEqualTo = m.lte = function(e) {
    return this.cmp(e) < 1;
  };
  m.logarithm = m.log = function(e) {
    var r, t2, n, i, o, s, a, l, u = this, c = u.constructor, p = c.precision, d = c.rounding, f = 5;
    if (e == null)
      e = new c(10), r = true;
    else {
      if (e = new c(e), t2 = e.d, e.s < 0 || !t2 || !t2[0] || e.eq(1))
        return new c(NaN);
      r = e.eq(10);
    }
    if (t2 = u.d, u.s < 0 || !t2 || !t2[0] || u.eq(1))
      return new c(t2 && !t2[0] ? -1 / 0 : u.s != 1 ? NaN : t2 ? 0 : 1 / 0);
    if (r)
      if (t2.length > 1)
        o = true;
      else {
        for (i = t2[0];i % 10 === 0; )
          i /= 10;
        o = i !== 1;
      }
    if (w = false, a = p + f, s = Je(u, a), n = r ? pn(c, a + 10) : Je(e, a), l = F(s, n, a, 1), st(l.d, i = p, d))
      do
        if (a += 10, s = Je(u, a), n = r ? pn(c, a + 10) : Je(e, a), l = F(s, n, a, 1), !o) {
          +J(l.d).slice(i + 1, i + 15) + 1 == 100000000000000 && (l = y(l, p + 1, 0));
          break;
        }
      while (st(l.d, i += 10, d));
    return w = true, y(l, p, d);
  };
  m.minus = m.sub = function(e) {
    var r, t2, n, i, o, s, a, l, u, c, p, d, f = this, g = f.constructor;
    if (e = new g(e), !f.d || !e.d)
      return !f.s || !e.s ? e = new g(NaN) : f.d ? e.s = -e.s : e = new g(e.d || f.s !== e.s ? f : NaN), e;
    if (f.s != e.s)
      return e.s = -e.s, f.plus(e);
    if (u = f.d, d = e.d, a = g.precision, l = g.rounding, !u[0] || !d[0]) {
      if (d[0])
        e.s = -e.s;
      else if (u[0])
        e = new g(f);
      else
        return new g(l === 3 ? -0 : 0);
      return w ? y(e, a, l) : e;
    }
    if (t2 = X(e.e / E), c = X(f.e / E), u = u.slice(), o = c - t2, o) {
      for (p = o < 0, p ? (r = u, o = -o, s = d.length) : (r = d, t2 = c, s = u.length), n = Math.max(Math.ceil(a / E), s) + 2, o > n && (o = n, r.length = 1), r.reverse(), n = o;n--; )
        r.push(0);
      r.reverse();
    } else {
      for (n = u.length, s = d.length, p = n < s, p && (s = n), n = 0;n < s; n++)
        if (u[n] != d[n]) {
          p = u[n] < d[n];
          break;
        }
      o = 0;
    }
    for (p && (r = u, u = d, d = r, e.s = -e.s), s = u.length, n = d.length - s;n > 0; --n)
      u[s++] = 0;
    for (n = d.length;n > o; ) {
      if (u[--n] < d[n]) {
        for (i = n;i && u[--i] === 0; )
          u[i] = fe - 1;
        --u[i], u[n] += fe;
      }
      u[n] -= d[n];
    }
    for (;u[--s] === 0; )
      u.pop();
    for (;u[0] === 0; u.shift())
      --t2;
    return u[0] ? (e.d = u, e.e = mn(u, t2), w ? y(e, a, l) : e) : new g(l === 3 ? -0 : 0);
  };
  m.modulo = m.mod = function(e) {
    var r, t2 = this, n = t2.constructor;
    return e = new n(e), !t2.d || !e.s || e.d && !e.d[0] ? new n(NaN) : !e.d || t2.d && !t2.d[0] ? y(new n(t2), n.precision, n.rounding) : (w = false, n.modulo == 9 ? (r = F(t2, e.abs(), 0, 3, 1), r.s *= e.s) : r = F(t2, e, 0, n.modulo, 1), r = r.times(e), w = true, t2.minus(r));
  };
  m.naturalExponential = m.exp = function() {
    return Bi(this);
  };
  m.naturalLogarithm = m.ln = function() {
    return Je(this);
  };
  m.negated = m.neg = function() {
    var e = new this.constructor(this);
    return e.s = -e.s, y(e);
  };
  m.plus = m.add = function(e) {
    var r, t2, n, i, o, s, a, l, u, c, p = this, d = p.constructor;
    if (e = new d(e), !p.d || !e.d)
      return !p.s || !e.s ? e = new d(NaN) : p.d || (e = new d(e.d || p.s === e.s ? p : NaN)), e;
    if (p.s != e.s)
      return e.s = -e.s, p.minus(e);
    if (u = p.d, c = e.d, a = d.precision, l = d.rounding, !u[0] || !c[0])
      return c[0] || (e = new d(p)), w ? y(e, a, l) : e;
    if (o = X(p.e / E), n = X(e.e / E), u = u.slice(), i = o - n, i) {
      for (i < 0 ? (t2 = u, i = -i, s = c.length) : (t2 = c, n = o, s = u.length), o = Math.ceil(a / E), s = o > s ? o + 1 : s + 1, i > s && (i = s, t2.length = 1), t2.reverse();i--; )
        t2.push(0);
      t2.reverse();
    }
    for (s = u.length, i = c.length, s - i < 0 && (i = s, t2 = c, c = u, u = t2), r = 0;i; )
      r = (u[--i] = u[i] + c[i] + r) / fe | 0, u[i] %= fe;
    for (r && (u.unshift(r), ++n), s = u.length;u[--s] == 0; )
      u.pop();
    return e.d = u, e.e = mn(u, n), w ? y(e, a, l) : e;
  };
  m.precision = m.sd = function(e) {
    var r, t2 = this;
    if (e !== undefined && e !== !!e && e !== 1 && e !== 0)
      throw Error(He + e);
    return t2.d ? (r = Qs(t2.d), e && t2.e + 1 > r && (r = t2.e + 1)) : r = NaN, r;
  };
  m.round = function() {
    var e = this, r = e.constructor;
    return y(new r(e), e.e + 1, r.rounding);
  };
  m.sine = m.sin = function() {
    var e, r, t2 = this, n = t2.constructor;
    return t2.isFinite() ? t2.isZero() ? new n(t2) : (e = n.precision, r = n.rounding, n.precision = e + Math.max(t2.e, t2.sd()) + E, n.rounding = 1, t2 = Tp(n, Hs(n, t2)), n.precision = e, n.rounding = r, y(Fe > 2 ? t2.neg() : t2, e, r, true)) : new n(NaN);
  };
  m.squareRoot = m.sqrt = function() {
    var e, r, t2, n, i, o, s = this, a = s.d, l = s.e, u = s.s, c = s.constructor;
    if (u !== 1 || !a || !a[0])
      return new c(!u || u < 0 && (!a || a[0]) ? NaN : a ? s : 1 / 0);
    for (w = false, u = Math.sqrt(+s), u == 0 || u == 1 / 0 ? (r = J(a), (r.length + l) % 2 == 0 && (r += "0"), u = Math.sqrt(r), l = X((l + 1) / 2) - (l < 0 || l % 2), u == 1 / 0 ? r = "5e" + l : (r = u.toExponential(), r = r.slice(0, r.indexOf("e") + 1) + l), n = new c(r)) : n = new c(u.toString()), t2 = (l = c.precision) + 3;; )
      if (o = n, n = o.plus(F(s, o, t2 + 2, 1)).times(0.5), J(o.d).slice(0, t2) === (r = J(n.d)).slice(0, t2))
        if (r = r.slice(t2 - 3, t2 + 1), r == "9999" || !i && r == "4999") {
          if (!i && (y(o, l + 1, 0), o.times(o).eq(s))) {
            n = o;
            break;
          }
          t2 += 4, i = 1;
        } else {
          (!+r || !+r.slice(1) && r.charAt(0) == "5") && (y(n, l + 1, 1), e = !n.times(n).eq(s));
          break;
        }
    return w = true, y(n, l, c.rounding, e);
  };
  m.tangent = m.tan = function() {
    var e, r, t2 = this, n = t2.constructor;
    return t2.isFinite() ? t2.isZero() ? new n(t2) : (e = n.precision, r = n.rounding, n.precision = e + 10, n.rounding = 1, t2 = t2.sin(), t2.s = 1, t2 = F(t2, new n(1).minus(t2.times(t2)).sqrt(), e + 10, 0), n.precision = e, n.rounding = r, y(Fe == 2 || Fe == 4 ? t2.neg() : t2, e, r, true)) : new n(NaN);
  };
  m.times = m.mul = function(e) {
    var r, t2, n, i, o, s, a, l, u, c = this, p = c.constructor, d = c.d, f = (e = new p(e)).d;
    if (e.s *= c.s, !d || !d[0] || !f || !f[0])
      return new p(!e.s || d && !d[0] && !f || f && !f[0] && !d ? NaN : !d || !f ? e.s / 0 : e.s * 0);
    for (t2 = X(c.e / E) + X(e.e / E), l = d.length, u = f.length, l < u && (o = d, d = f, f = o, s = l, l = u, u = s), o = [], s = l + u, n = s;n--; )
      o.push(0);
    for (n = u;--n >= 0; ) {
      for (r = 0, i = l + n;i > n; )
        a = o[i] + f[n] * d[i - n - 1] + r, o[i--] = a % fe | 0, r = a / fe | 0;
      o[i] = (o[i] + r) % fe | 0;
    }
    for (;!o[--s]; )
      o.pop();
    return r ? ++t2 : o.shift(), e.d = o, e.e = mn(o, t2), w ? y(e, p.precision, p.rounding) : e;
  };
  m.toBinary = function(e, r) {
    return Ui(this, 2, e, r);
  };
  m.toDecimalPlaces = m.toDP = function(e, r) {
    var t2 = this, n = t2.constructor;
    return t2 = new n(t2), e === undefined ? t2 : (ie(e, 0, Ke), r === undefined ? r = n.rounding : ie(r, 0, 8), y(t2, e + t2.e + 1, r));
  };
  m.toExponential = function(e, r) {
    var t2, n = this, i = n.constructor;
    return e === undefined ? t2 = xe(n, true) : (ie(e, 0, Ke), r === undefined ? r = i.rounding : ie(r, 0, 8), n = y(new i(n), e + 1, r), t2 = xe(n, true, e + 1)), n.isNeg() && !n.isZero() ? "-" + t2 : t2;
  };
  m.toFixed = function(e, r) {
    var t2, n, i = this, o = i.constructor;
    return e === undefined ? t2 = xe(i) : (ie(e, 0, Ke), r === undefined ? r = o.rounding : ie(r, 0, 8), n = y(new o(i), e + i.e + 1, r), t2 = xe(n, false, e + n.e + 1)), i.isNeg() && !i.isZero() ? "-" + t2 : t2;
  };
  m.toFraction = function(e) {
    var r, t2, n, i, o, s, a, l, u, c, p, d, f = this, g = f.d, h = f.constructor;
    if (!g)
      return new h(f);
    if (u = t2 = new h(1), n = l = new h(0), r = new h(n), o = r.e = Qs(g) - f.e - 1, s = o % E, r.d[0] = U(10, s < 0 ? E + s : s), e == null)
      e = o > 0 ? r : u;
    else {
      if (a = new h(e), !a.isInt() || a.lt(u))
        throw Error(He + a);
      e = a.gt(r) ? o > 0 ? r : u : a;
    }
    for (w = false, a = new h(J(g)), c = h.precision, h.precision = o = g.length * E * 2;p = F(a, r, 0, 1, 1), i = t2.plus(p.times(n)), i.cmp(e) != 1; )
      t2 = n, n = i, i = u, u = l.plus(p.times(i)), l = i, i = r, r = a.minus(p.times(i)), a = i;
    return i = F(e.minus(t2), n, 0, 1, 1), l = l.plus(i.times(u)), t2 = t2.plus(i.times(n)), l.s = u.s = f.s, d = F(u, n, o, 1).minus(f).abs().cmp(F(l, t2, o, 1).minus(f).abs()) < 1 ? [u, n] : [l, t2], h.precision = c, w = true, d;
  };
  m.toHexadecimal = m.toHex = function(e, r) {
    return Ui(this, 16, e, r);
  };
  m.toNearest = function(e, r) {
    var t2 = this, n = t2.constructor;
    if (t2 = new n(t2), e == null) {
      if (!t2.d)
        return t2;
      e = new n(1), r = n.rounding;
    } else {
      if (e = new n(e), r === undefined ? r = n.rounding : ie(r, 0, 8), !t2.d)
        return e.s ? t2 : e;
      if (!e.d)
        return e.s && (e.s = t2.s), e;
    }
    return e.d[0] ? (w = false, t2 = F(t2, e, 0, r, 1).times(e), w = true, y(t2)) : (e.s = t2.s, t2 = e), t2;
  };
  m.toNumber = function() {
    return +this;
  };
  m.toOctal = function(e, r) {
    return Ui(this, 8, e, r);
  };
  m.toPower = m.pow = function(e) {
    var r, t2, n, i, o, s, a = this, l = a.constructor, u = +(e = new l(e));
    if (!a.d || !e.d || !a.d[0] || !e.d[0])
      return new l(U(+a, u));
    if (a = new l(a), a.eq(1))
      return a;
    if (n = l.precision, o = l.rounding, e.eq(1))
      return y(a, n, o);
    if (r = X(e.e / E), r >= e.d.length - 1 && (t2 = u < 0 ? -u : u) <= wp)
      return i = Gs(l, a, t2, n), e.s < 0 ? new l(1).div(i) : y(i, n, o);
    if (s = a.s, s < 0) {
      if (r < e.d.length - 1)
        return new l(NaN);
      if ((e.d[r] & 1) == 0 && (s = 1), a.e == 0 && a.d[0] == 1 && a.d.length == 1)
        return a.s = s, a;
    }
    return t2 = U(+a, u), r = t2 == 0 || !isFinite(t2) ? X(u * (Math.log("0." + J(a.d)) / Math.LN10 + a.e + 1)) : new l(t2 + "").e, r > l.maxE + 1 || r < l.minE - 1 ? new l(r > 0 ? s / 0 : 0) : (w = false, l.rounding = a.s = 1, t2 = Math.min(12, (r + "").length), i = Bi(e.times(Je(a, n + t2)), n), i.d && (i = y(i, n + 5, 1), st(i.d, n, o) && (r = n + 10, i = y(Bi(e.times(Je(a, r + t2)), r), r + 5, 1), +J(i.d).slice(n + 1, n + 15) + 1 == 100000000000000 && (i = y(i, n + 1, 0)))), i.s = s, w = true, l.rounding = o, y(i, n, o));
  };
  m.toPrecision = function(e, r) {
    var t2, n = this, i = n.constructor;
    return e === undefined ? t2 = xe(n, n.e <= i.toExpNeg || n.e >= i.toExpPos) : (ie(e, 1, Ke), r === undefined ? r = i.rounding : ie(r, 0, 8), n = y(new i(n), e, r), t2 = xe(n, e <= n.e || n.e <= i.toExpNeg, e)), n.isNeg() && !n.isZero() ? "-" + t2 : t2;
  };
  m.toSignificantDigits = m.toSD = function(e, r) {
    var t2 = this, n = t2.constructor;
    return e === undefined ? (e = n.precision, r = n.rounding) : (ie(e, 1, Ke), r === undefined ? r = n.rounding : ie(r, 0, 8)), y(new n(t2), e, r);
  };
  m.toString = function() {
    var e = this, r = e.constructor, t2 = xe(e, e.e <= r.toExpNeg || e.e >= r.toExpPos);
    return e.isNeg() && !e.isZero() ? "-" + t2 : t2;
  };
  m.truncated = m.trunc = function() {
    return y(new this.constructor(this), this.e + 1, 1);
  };
  m.valueOf = m.toJSON = function() {
    var e = this, r = e.constructor, t2 = xe(e, e.e <= r.toExpNeg || e.e >= r.toExpPos);
    return e.isNeg() ? "-" + t2 : t2;
  };
  function J(e) {
    var r, t2, n, i = e.length - 1, o = "", s = e[0];
    if (i > 0) {
      for (o += s, r = 1;r < i; r++)
        n = e[r] + "", t2 = E - n.length, t2 && (o += We(t2)), o += n;
      s = e[r], n = s + "", t2 = E - n.length, t2 && (o += We(t2));
    } else if (s === 0)
      return "0";
    for (;s % 10 === 0; )
      s /= 10;
    return o + s;
  }
  function ie(e, r, t2) {
    if (e !== ~~e || e < r || e > t2)
      throw Error(He + e);
  }
  function st(e, r, t2, n) {
    var i, o, s, a;
    for (o = e[0];o >= 10; o /= 10)
      --r;
    return --r < 0 ? (r += E, i = 0) : (i = Math.ceil((r + 1) / E), r %= E), o = U(10, E - r), a = e[i] % o | 0, n == null ? r < 3 ? (r == 0 ? a = a / 100 | 0 : r == 1 && (a = a / 10 | 0), s = t2 < 4 && a == 99999 || t2 > 3 && a == 49999 || a == 50000 || a == 0) : s = (t2 < 4 && a + 1 == o || t2 > 3 && a + 1 == o / 2) && (e[i + 1] / o / 100 | 0) == U(10, r - 2) - 1 || (a == o / 2 || a == 0) && (e[i + 1] / o / 100 | 0) == 0 : r < 4 ? (r == 0 ? a = a / 1000 | 0 : r == 1 ? a = a / 100 | 0 : r == 2 && (a = a / 10 | 0), s = (n || t2 < 4) && a == 9999 || !n && t2 > 3 && a == 4999) : s = ((n || t2 < 4) && a + 1 == o || !n && t2 > 3 && a + 1 == o / 2) && (e[i + 1] / o / 1000 | 0) == U(10, r - 3) - 1, s;
  }
  function an(e, r, t2) {
    for (var n, i = [0], o, s = 0, a = e.length;s < a; ) {
      for (o = i.length;o--; )
        i[o] *= r;
      for (i[0] += qi.indexOf(e.charAt(s++)), n = 0;n < i.length; n++)
        i[n] > t2 - 1 && (i[n + 1] === undefined && (i[n + 1] = 0), i[n + 1] += i[n] / t2 | 0, i[n] %= t2);
    }
    return i.reverse();
  }
  function vp(e, r) {
    var t2, n, i;
    if (r.isZero())
      return r;
    n = r.d.length, n < 32 ? (t2 = Math.ceil(n / 3), i = (1 / fn(4, t2)).toString()) : (t2 = 16, i = "2.3283064365386962890625e-10"), e.precision += t2, r = Pr(e, 1, r.times(i), new e(1));
    for (var o = t2;o--; ) {
      var s = r.times(r);
      r = s.times(s).minus(s).times(8).plus(1);
    }
    return e.precision -= t2, r;
  }
  var F = function() {
    function e(n, i, o) {
      var s, a = 0, l = n.length;
      for (n = n.slice();l--; )
        s = n[l] * i + a, n[l] = s % o | 0, a = s / o | 0;
      return a && n.unshift(a), n;
    }
    function r(n, i, o, s) {
      var a, l;
      if (o != s)
        l = o > s ? 1 : -1;
      else
        for (a = l = 0;a < o; a++)
          if (n[a] != i[a]) {
            l = n[a] > i[a] ? 1 : -1;
            break;
          }
      return l;
    }
    function t2(n, i, o, s) {
      for (var a = 0;o--; )
        n[o] -= a, a = n[o] < i[o] ? 1 : 0, n[o] = a * s + n[o] - i[o];
      for (;!n[0] && n.length > 1; )
        n.shift();
    }
    return function(n, i, o, s, a, l) {
      var u, c, p, d, f, g, h, I, P, S, b, O, me, ae, Jr, V, te, Ae, H, fr, $t = n.constructor, Xn = n.s == i.s ? 1 : -1, K = n.d, _ = i.d;
      if (!K || !K[0] || !_ || !_[0])
        return new $t(!n.s || !i.s || (K ? _ && K[0] == _[0] : !_) ? NaN : K && K[0] == 0 || !_ ? Xn * 0 : Xn / 0);
      for (l ? (f = 1, c = n.e - i.e) : (l = fe, f = E, c = X(n.e / f) - X(i.e / f)), H = _.length, te = K.length, P = new $t(Xn), S = P.d = [], p = 0;_[p] == (K[p] || 0); p++)
        ;
      if (_[p] > (K[p] || 0) && c--, o == null ? (ae = o = $t.precision, s = $t.rounding) : a ? ae = o + (n.e - i.e) + 1 : ae = o, ae < 0)
        S.push(1), g = true;
      else {
        if (ae = ae / f + 2 | 0, p = 0, H == 1) {
          for (d = 0, _ = _[0], ae++;(p < te || d) && ae--; p++)
            Jr = d * l + (K[p] || 0), S[p] = Jr / _ | 0, d = Jr % _ | 0;
          g = d || p < te;
        } else {
          for (d = l / (_[0] + 1) | 0, d > 1 && (_ = e(_, d, l), K = e(K, d, l), H = _.length, te = K.length), V = H, b = K.slice(0, H), O = b.length;O < H; )
            b[O++] = 0;
          fr = _.slice(), fr.unshift(0), Ae = _[0], _[1] >= l / 2 && ++Ae;
          do
            d = 0, u = r(_, b, H, O), u < 0 ? (me = b[0], H != O && (me = me * l + (b[1] || 0)), d = me / Ae | 0, d > 1 ? (d >= l && (d = l - 1), h = e(_, d, l), I = h.length, O = b.length, u = r(h, b, I, O), u == 1 && (d--, t2(h, H < I ? fr : _, I, l))) : (d == 0 && (u = d = 1), h = _.slice()), I = h.length, I < O && h.unshift(0), t2(b, h, O, l), u == -1 && (O = b.length, u = r(_, b, H, O), u < 1 && (d++, t2(b, H < O ? fr : _, O, l))), O = b.length) : u === 0 && (d++, b = [0]), S[p++] = d, u && b[0] ? b[O++] = K[V] || 0 : (b = [K[V]], O = 1);
          while ((V++ < te || b[0] !== undefined) && ae--);
          g = b[0] !== undefined;
        }
        S[0] || S.shift();
      }
      if (f == 1)
        P.e = c, qs = g;
      else {
        for (p = 1, d = S[0];d >= 10; d /= 10)
          p++;
        P.e = p + c * f - 1, y(P, a ? o + P.e + 1 : o, s, g);
      }
      return P;
    };
  }();
  function y(e, r, t2, n) {
    var i, o, s, a, l, u, c, p, d, f = e.constructor;
    e:
      if (r != null) {
        if (p = e.d, !p)
          return e;
        for (i = 1, a = p[0];a >= 10; a /= 10)
          i++;
        if (o = r - i, o < 0)
          o += E, s = r, c = p[d = 0], l = c / U(10, i - s - 1) % 10 | 0;
        else if (d = Math.ceil((o + 1) / E), a = p.length, d >= a)
          if (n) {
            for (;a++ <= d; )
              p.push(0);
            c = l = 0, i = 1, o %= E, s = o - E + 1;
          } else
            break e;
        else {
          for (c = a = p[d], i = 1;a >= 10; a /= 10)
            i++;
          o %= E, s = o - E + i, l = s < 0 ? 0 : c / U(10, i - s - 1) % 10 | 0;
        }
        if (n = n || r < 0 || p[d + 1] !== undefined || (s < 0 ? c : c % U(10, i - s - 1)), u = t2 < 4 ? (l || n) && (t2 == 0 || t2 == (e.s < 0 ? 3 : 2)) : l > 5 || l == 5 && (t2 == 4 || n || t2 == 6 && (o > 0 ? s > 0 ? c / U(10, i - s) : 0 : p[d - 1]) % 10 & 1 || t2 == (e.s < 0 ? 8 : 7)), r < 1 || !p[0])
          return p.length = 0, u ? (r -= e.e + 1, p[0] = U(10, (E - r % E) % E), e.e = -r || 0) : p[0] = e.e = 0, e;
        if (o == 0 ? (p.length = d, a = 1, d--) : (p.length = d + 1, a = U(10, E - o), p[d] = s > 0 ? (c / U(10, i - s) % U(10, s) | 0) * a : 0), u)
          for (;; )
            if (d == 0) {
              for (o = 1, s = p[0];s >= 10; s /= 10)
                o++;
              for (s = p[0] += a, a = 1;s >= 10; s /= 10)
                a++;
              o != a && (e.e++, p[0] == fe && (p[0] = 1));
              break;
            } else {
              if (p[d] += a, p[d] != fe)
                break;
              p[d--] = 0, a = 1;
            }
        for (o = p.length;p[--o] === 0; )
          p.pop();
      }
    return w && (e.e > f.maxE ? (e.d = null, e.e = NaN) : e.e < f.minE && (e.e = 0, e.d = [0])), e;
  }
  function xe(e, r, t2) {
    if (!e.isFinite())
      return Js(e);
    var n, i = e.e, o = J(e.d), s = o.length;
    return r ? (t2 && (n = t2 - s) > 0 ? o = o.charAt(0) + "." + o.slice(1) + We(n) : s > 1 && (o = o.charAt(0) + "." + o.slice(1)), o = o + (e.e < 0 ? "e" : "e+") + e.e) : i < 0 ? (o = "0." + We(-i - 1) + o, t2 && (n = t2 - s) > 0 && (o += We(n))) : i >= s ? (o += We(i + 1 - s), t2 && (n = t2 - i - 1) > 0 && (o = o + "." + We(n))) : ((n = i + 1) < s && (o = o.slice(0, n) + "." + o.slice(n)), t2 && (n = t2 - s) > 0 && (i + 1 === s && (o += "."), o += We(n))), o;
  }
  function mn(e, r) {
    var t2 = e[0];
    for (r *= E;t2 >= 10; t2 /= 10)
      r++;
    return r;
  }
  function pn(e, r, t2) {
    if (r > xp)
      throw w = true, t2 && (e.precision = t2), Error(js);
    return y(new e(un), r, 1, true);
  }
  function we(e, r, t2) {
    if (r > Vi)
      throw Error(js);
    return y(new e(cn), r, t2, true);
  }
  function Qs(e) {
    var r = e.length - 1, t2 = r * E + 1;
    if (r = e[r], r) {
      for (;r % 10 == 0; r /= 10)
        t2--;
      for (r = e[0];r >= 10; r /= 10)
        t2++;
    }
    return t2;
  }
  function We(e) {
    for (var r = "";e--; )
      r += "0";
    return r;
  }
  function Gs(e, r, t2, n) {
    var i, o = new e(1), s = Math.ceil(n / E + 4);
    for (w = false;; ) {
      if (t2 % 2 && (o = o.times(r), Ms(o.d, s) && (i = true)), t2 = X(t2 / 2), t2 === 0) {
        t2 = o.d.length - 1, i && o.d[t2] === 0 && ++o.d[t2];
        break;
      }
      r = r.times(r), Ms(r.d, s);
    }
    return w = true, o;
  }
  function Ls(e) {
    return e.d[e.d.length - 1] & 1;
  }
  function Ws(e, r, t2) {
    for (var n, i, o = new e(r[0]), s = 0;++s < r.length; ) {
      if (i = new e(r[s]), !i.s) {
        o = i;
        break;
      }
      n = o.cmp(i), (n === t2 || n === 0 && o.s === t2) && (o = i);
    }
    return o;
  }
  function Bi(e, r) {
    var t2, n, i, o, s, a, l, u = 0, c = 0, p = 0, d = e.constructor, f = d.rounding, g = d.precision;
    if (!e.d || !e.d[0] || e.e > 17)
      return new d(e.d ? e.d[0] ? e.s < 0 ? 0 : 1 / 0 : 1 : e.s ? e.s < 0 ? 0 : e : NaN);
    for (r == null ? (w = false, l = g) : l = r, a = new d(0.03125);e.e > -2; )
      e = e.times(a), p += 5;
    for (n = Math.log(U(2, p)) / Math.LN10 * 2 + 5 | 0, l += n, t2 = o = s = new d(1), d.precision = l;; ) {
      if (o = y(o.times(e), l, 1), t2 = t2.times(++c), a = s.plus(F(o, t2, l, 1)), J(a.d).slice(0, l) === J(s.d).slice(0, l)) {
        for (i = p;i--; )
          s = y(s.times(s), l, 1);
        if (r == null)
          if (u < 3 && st(s.d, l - n, f, u))
            d.precision = l += 10, t2 = o = a = new d(1), c = 0, u++;
          else
            return y(s, d.precision = g, f, w = true);
        else
          return d.precision = g, s;
      }
      s = a;
    }
  }
  function Je(e, r) {
    var t2, n, i, o, s, a, l, u, c, p, d, f = 1, g = 10, h = e, I = h.d, P = h.constructor, S = P.rounding, b = P.precision;
    if (h.s < 0 || !I || !I[0] || !h.e && I[0] == 1 && I.length == 1)
      return new P(I && !I[0] ? -1 / 0 : h.s != 1 ? NaN : I ? 0 : h);
    if (r == null ? (w = false, c = b) : c = r, P.precision = c += g, t2 = J(I), n = t2.charAt(0), Math.abs(o = h.e) < 1500000000000000) {
      for (;n < 7 && n != 1 || n == 1 && t2.charAt(1) > 3; )
        h = h.times(e), t2 = J(h.d), n = t2.charAt(0), f++;
      o = h.e, n > 1 ? (h = new P("0." + t2), o++) : h = new P(n + "." + t2.slice(1));
    } else
      return u = pn(P, c + 2, b).times(o + ""), h = Je(new P(n + "." + t2.slice(1)), c - g).plus(u), P.precision = b, r == null ? y(h, b, S, w = true) : h;
    for (p = h, l = s = h = F(h.minus(1), h.plus(1), c, 1), d = y(h.times(h), c, 1), i = 3;; ) {
      if (s = y(s.times(d), c, 1), u = l.plus(F(s, new P(i), c, 1)), J(u.d).slice(0, c) === J(l.d).slice(0, c))
        if (l = l.times(2), o !== 0 && (l = l.plus(pn(P, c + 2, b).times(o + ""))), l = F(l, new P(f), c, 1), r == null)
          if (st(l.d, c - g, S, a))
            P.precision = c += g, u = s = h = F(p.minus(1), p.plus(1), c, 1), d = y(h.times(h), c, 1), i = a = 1;
          else
            return y(l, P.precision = b, S, w = true);
        else
          return P.precision = b, l;
      l = u, i += 2;
    }
  }
  function Js(e) {
    return String(e.s * e.s / 0);
  }
  function ln(e, r) {
    var t2, n, i;
    for ((t2 = r.indexOf(".")) > -1 && (r = r.replace(".", "")), (n = r.search(/e/i)) > 0 ? (t2 < 0 && (t2 = n), t2 += +r.slice(n + 1), r = r.substring(0, n)) : t2 < 0 && (t2 = r.length), n = 0;r.charCodeAt(n) === 48; n++)
      ;
    for (i = r.length;r.charCodeAt(i - 1) === 48; --i)
      ;
    if (r = r.slice(n, i), r) {
      if (i -= n, e.e = t2 = t2 - n - 1, e.d = [], n = (t2 + 1) % E, t2 < 0 && (n += E), n < i) {
        for (n && e.d.push(+r.slice(0, n)), i -= E;n < i; )
          e.d.push(+r.slice(n, n += E));
        r = r.slice(n), n = E - r.length;
      } else
        n -= i;
      for (;n--; )
        r += "0";
      e.d.push(+r), w && (e.e > e.constructor.maxE ? (e.d = null, e.e = NaN) : e.e < e.constructor.minE && (e.e = 0, e.d = [0]));
    } else
      e.e = 0, e.d = [0];
    return e;
  }
  function Pp(e, r) {
    var t2, n, i, o, s, a, l, u, c;
    if (r.indexOf("_") > -1) {
      if (r = r.replace(/(\d)_(?=\d)/g, "$1"), Us.test(r))
        return ln(e, r);
    } else if (r === "Infinity" || r === "NaN")
      return +r || (e.s = NaN), e.e = NaN, e.d = null, e;
    if (bp.test(r))
      t2 = 16, r = r.toLowerCase();
    else if (yp.test(r))
      t2 = 2;
    else if (Ep.test(r))
      t2 = 8;
    else
      throw Error(He + r);
    for (o = r.search(/p/i), o > 0 ? (l = +r.slice(o + 1), r = r.substring(2, o)) : r = r.slice(2), o = r.indexOf("."), s = o >= 0, n = e.constructor, s && (r = r.replace(".", ""), a = r.length, o = a - o, i = Gs(n, new n(t2), o, o * 2)), u = an(r, t2, fe), c = u.length - 1, o = c;u[o] === 0; --o)
      u.pop();
    return o < 0 ? new n(e.s * 0) : (e.e = mn(u, c), e.d = u, w = false, s && (e = F(e, i, a * 4)), l && (e = e.times(Math.abs(l) < 54 ? U(2, l) : sr.pow(2, l))), w = true, e);
  }
  function Tp(e, r) {
    var t2, n = r.d.length;
    if (n < 3)
      return r.isZero() ? r : Pr(e, 2, r, r);
    t2 = 1.4 * Math.sqrt(n), t2 = t2 > 16 ? 16 : t2 | 0, r = r.times(1 / fn(5, t2)), r = Pr(e, 2, r, r);
    for (var i, o = new e(5), s = new e(16), a = new e(20);t2--; )
      i = r.times(r), r = r.times(o.plus(i.times(s.times(i).minus(a))));
    return r;
  }
  function Pr(e, r, t2, n, i) {
    var o, s, a, l, u = 1, c = e.precision, p = Math.ceil(c / E);
    for (w = false, l = t2.times(t2), a = new e(n);; ) {
      if (s = F(a.times(l), new e(r++ * r++), c, 1), a = i ? n.plus(s) : n.minus(s), n = F(s.times(l), new e(r++ * r++), c, 1), s = a.plus(n), s.d[p] !== undefined) {
        for (o = p;s.d[o] === a.d[o] && o--; )
          ;
        if (o == -1)
          break;
      }
      o = a, a = n, n = s, s = o, u++;
    }
    return w = true, s.d.length = p + 1, s;
  }
  function fn(e, r) {
    for (var t2 = e;--r; )
      t2 *= e;
    return t2;
  }
  function Hs(e, r) {
    var t2, n = r.s < 0, i = we(e, e.precision, 1), o = i.times(0.5);
    if (r = r.abs(), r.lte(o))
      return Fe = n ? 4 : 1, r;
    if (t2 = r.divToInt(i), t2.isZero())
      Fe = n ? 3 : 2;
    else {
      if (r = r.minus(t2.times(i)), r.lte(o))
        return Fe = Ls(t2) ? n ? 2 : 3 : n ? 4 : 1, r;
      Fe = Ls(t2) ? n ? 1 : 4 : n ? 3 : 2;
    }
    return r.minus(i).abs();
  }
  function Ui(e, r, t2, n) {
    var i, o, s, a, l, u, c, p, d, f = e.constructor, g = t2 !== undefined;
    if (g ? (ie(t2, 1, Ke), n === undefined ? n = f.rounding : ie(n, 0, 8)) : (t2 = f.precision, n = f.rounding), !e.isFinite())
      c = Js(e);
    else {
      for (c = xe(e), s = c.indexOf("."), g ? (i = 2, r == 16 ? t2 = t2 * 4 - 3 : r == 8 && (t2 = t2 * 3 - 2)) : i = r, s >= 0 && (c = c.replace(".", ""), d = new f(1), d.e = c.length - s, d.d = an(xe(d), 10, i), d.e = d.d.length), p = an(c, 10, i), o = l = p.length;p[--l] == 0; )
        p.pop();
      if (!p[0])
        c = g ? "0p+0" : "0";
      else {
        if (s < 0 ? o-- : (e = new f(e), e.d = p, e.e = o, e = F(e, d, t2, n, 0, i), p = e.d, o = e.e, u = qs), s = p[t2], a = i / 2, u = u || p[t2 + 1] !== undefined, u = n < 4 ? (s !== undefined || u) && (n === 0 || n === (e.s < 0 ? 3 : 2)) : s > a || s === a && (n === 4 || u || n === 6 && p[t2 - 1] & 1 || n === (e.s < 0 ? 8 : 7)), p.length = t2, u)
          for (;++p[--t2] > i - 1; )
            p[t2] = 0, t2 || (++o, p.unshift(1));
        for (l = p.length;!p[l - 1]; --l)
          ;
        for (s = 0, c = "";s < l; s++)
          c += qi.charAt(p[s]);
        if (g) {
          if (l > 1)
            if (r == 16 || r == 8) {
              for (s = r == 16 ? 4 : 3, --l;l % s; l++)
                c += "0";
              for (p = an(c, i, r), l = p.length;!p[l - 1]; --l)
                ;
              for (s = 1, c = "1.";s < l; s++)
                c += qi.charAt(p[s]);
            } else
              c = c.charAt(0) + "." + c.slice(1);
          c = c + (o < 0 ? "p" : "p+") + o;
        } else if (o < 0) {
          for (;++o; )
            c = "0" + c;
          c = "0." + c;
        } else if (++o > l)
          for (o -= l;o--; )
            c += "0";
        else
          o < l && (c = c.slice(0, o) + "." + c.slice(o));
      }
      c = (r == 16 ? "0x" : r == 2 ? "0b" : r == 8 ? "0o" : "") + c;
    }
    return e.s < 0 ? "-" + c : c;
  }
  function Ms(e, r) {
    if (e.length > r)
      return e.length = r, true;
  }
  function Sp(e) {
    return new this(e).abs();
  }
  function Rp(e) {
    return new this(e).acos();
  }
  function Cp(e) {
    return new this(e).acosh();
  }
  function Ap(e, r) {
    return new this(e).plus(r);
  }
  function Ip(e) {
    return new this(e).asin();
  }
  function kp(e) {
    return new this(e).asinh();
  }
  function Op(e) {
    return new this(e).atan();
  }
  function Dp(e) {
    return new this(e).atanh();
  }
  function _p(e, r) {
    e = new this(e), r = new this(r);
    var t2, n = this.precision, i = this.rounding, o = n + 4;
    return !e.s || !r.s ? t2 = new this(NaN) : !e.d && !r.d ? (t2 = we(this, o, 1).times(r.s > 0 ? 0.25 : 0.75), t2.s = e.s) : !r.d || e.isZero() ? (t2 = r.s < 0 ? we(this, n, i) : new this(0), t2.s = e.s) : !e.d || r.isZero() ? (t2 = we(this, o, 1).times(0.5), t2.s = e.s) : r.s < 0 ? (this.precision = o, this.rounding = 1, t2 = this.atan(F(e, r, o, 1)), r = we(this, o, 1), this.precision = n, this.rounding = i, t2 = e.s < 0 ? t2.minus(r) : t2.plus(r)) : t2 = this.atan(F(e, r, o, 1)), t2;
  }
  function Np(e) {
    return new this(e).cbrt();
  }
  function Fp(e) {
    return y(e = new this(e), e.e + 1, 2);
  }
  function Lp(e, r, t2) {
    return new this(e).clamp(r, t2);
  }
  function Mp(e) {
    if (!e || typeof e != "object")
      throw Error(dn + "Object expected");
    var r, t2, n, i = e.defaults === true, o = ["precision", 1, Ke, "rounding", 0, 8, "toExpNeg", -vr, 0, "toExpPos", 0, vr, "maxE", 0, vr, "minE", -vr, 0, "modulo", 0, 9];
    for (r = 0;r < o.length; r += 3)
      if (t2 = o[r], i && (this[t2] = ji[t2]), (n = e[t2]) !== undefined)
        if (X(n) === n && n >= o[r + 1] && n <= o[r + 2])
          this[t2] = n;
        else
          throw Error(He + t2 + ": " + n);
    if (t2 = "crypto", i && (this[t2] = ji[t2]), (n = e[t2]) !== undefined)
      if (n === true || n === false || n === 0 || n === 1)
        if (n)
          if (typeof crypto < "u" && crypto && (crypto.getRandomValues || crypto.randomBytes))
            this[t2] = true;
          else
            throw Error(Vs);
        else
          this[t2] = false;
      else
        throw Error(He + t2 + ": " + n);
    return this;
  }
  function $p(e) {
    return new this(e).cos();
  }
  function qp(e) {
    return new this(e).cosh();
  }
  function Ks(e) {
    var r, t2, n;
    function i(o) {
      var s, a, l, u = this;
      if (!(u instanceof i))
        return new i(o);
      if (u.constructor = i, $s(o)) {
        u.s = o.s, w ? !o.d || o.e > i.maxE ? (u.e = NaN, u.d = null) : o.e < i.minE ? (u.e = 0, u.d = [0]) : (u.e = o.e, u.d = o.d.slice()) : (u.e = o.e, u.d = o.d ? o.d.slice() : o.d);
        return;
      }
      if (l = typeof o, l === "number") {
        if (o === 0) {
          u.s = 1 / o < 0 ? -1 : 1, u.e = 0, u.d = [0];
          return;
        }
        if (o < 0 ? (o = -o, u.s = -1) : u.s = 1, o === ~~o && o < 1e7) {
          for (s = 0, a = o;a >= 10; a /= 10)
            s++;
          w ? s > i.maxE ? (u.e = NaN, u.d = null) : s < i.minE ? (u.e = 0, u.d = [0]) : (u.e = s, u.d = [o]) : (u.e = s, u.d = [o]);
          return;
        }
        if (o * 0 !== 0) {
          o || (u.s = NaN), u.e = NaN, u.d = null;
          return;
        }
        return ln(u, o.toString());
      }
      if (l === "string")
        return (a = o.charCodeAt(0)) === 45 ? (o = o.slice(1), u.s = -1) : (a === 43 && (o = o.slice(1)), u.s = 1), Us.test(o) ? ln(u, o) : Pp(u, o);
      if (l === "bigint")
        return o < 0 ? (o = -o, u.s = -1) : u.s = 1, ln(u, o.toString());
      throw Error(He + o);
    }
    if (i.prototype = m, i.ROUND_UP = 0, i.ROUND_DOWN = 1, i.ROUND_CEIL = 2, i.ROUND_FLOOR = 3, i.ROUND_HALF_UP = 4, i.ROUND_HALF_DOWN = 5, i.ROUND_HALF_EVEN = 6, i.ROUND_HALF_CEIL = 7, i.ROUND_HALF_FLOOR = 8, i.EUCLID = 9, i.config = i.set = Mp, i.clone = Ks, i.isDecimal = $s, i.abs = Sp, i.acos = Rp, i.acosh = Cp, i.add = Ap, i.asin = Ip, i.asinh = kp, i.atan = Op, i.atanh = Dp, i.atan2 = _p, i.cbrt = Np, i.ceil = Fp, i.clamp = Lp, i.cos = $p, i.cosh = qp, i.div = jp, i.exp = Vp, i.floor = Bp, i.hypot = Up, i.ln = Qp, i.log = Gp, i.log10 = Jp, i.log2 = Wp, i.max = Hp, i.min = Kp, i.mod = Yp, i.mul = zp, i.pow = Zp, i.random = Xp, i.round = ed, i.sign = rd, i.sin = td, i.sinh = nd, i.sqrt = id, i.sub = od, i.sum = sd, i.tan = ad, i.tanh = ld, i.trunc = ud, e === undefined && (e = {}), e && e.defaults !== true)
      for (n = ["precision", "rounding", "toExpNeg", "toExpPos", "maxE", "minE", "modulo", "crypto"], r = 0;r < n.length; )
        e.hasOwnProperty(t2 = n[r++]) || (e[t2] = this[t2]);
    return i.config(e), i;
  }
  function jp(e, r) {
    return new this(e).div(r);
  }
  function Vp(e) {
    return new this(e).exp();
  }
  function Bp(e) {
    return y(e = new this(e), e.e + 1, 3);
  }
  function Up() {
    var e, r, t2 = new this(0);
    for (w = false, e = 0;e < arguments.length; )
      if (r = new this(arguments[e++]), r.d)
        t2.d && (t2 = t2.plus(r.times(r)));
      else {
        if (r.s)
          return w = true, new this(1 / 0);
        t2 = r;
      }
    return w = true, t2.sqrt();
  }
  function $s(e) {
    return e instanceof sr || e && e.toStringTag === Bs || false;
  }
  function Qp(e) {
    return new this(e).ln();
  }
  function Gp(e, r) {
    return new this(e).log(r);
  }
  function Wp(e) {
    return new this(e).log(2);
  }
  function Jp(e) {
    return new this(e).log(10);
  }
  function Hp() {
    return Ws(this, arguments, -1);
  }
  function Kp() {
    return Ws(this, arguments, 1);
  }
  function Yp(e, r) {
    return new this(e).mod(r);
  }
  function zp(e, r) {
    return new this(e).mul(r);
  }
  function Zp(e, r) {
    return new this(e).pow(r);
  }
  function Xp(e) {
    var r, t2, n, i, o = 0, s = new this(1), a = [];
    if (e === undefined ? e = this.precision : ie(e, 1, Ke), n = Math.ceil(e / E), this.crypto)
      if (crypto.getRandomValues)
        for (r = crypto.getRandomValues(new Uint32Array(n));o < n; )
          i = r[o], i >= 4290000000 ? r[o] = crypto.getRandomValues(new Uint32Array(1))[0] : a[o++] = i % 1e7;
      else if (crypto.randomBytes) {
        for (r = crypto.randomBytes(n *= 4);o < n; )
          i = r[o] + (r[o + 1] << 8) + (r[o + 2] << 16) + ((r[o + 3] & 127) << 24), i >= 2140000000 ? crypto.randomBytes(4).copy(r, o) : (a.push(i % 1e7), o += 4);
        o = n / 4;
      } else
        throw Error(Vs);
    else
      for (;o < n; )
        a[o++] = Math.random() * 1e7 | 0;
    for (n = a[--o], e %= E, n && e && (i = U(10, E - e), a[o] = (n / i | 0) * i);a[o] === 0; o--)
      a.pop();
    if (o < 0)
      t2 = 0, a = [0];
    else {
      for (t2 = -1;a[0] === 0; t2 -= E)
        a.shift();
      for (n = 1, i = a[0];i >= 10; i /= 10)
        n++;
      n < E && (t2 -= E - n);
    }
    return s.e = t2, s.d = a, s;
  }
  function ed(e) {
    return y(e = new this(e), e.e + 1, this.rounding);
  }
  function rd(e) {
    return e = new this(e), e.d ? e.d[0] ? e.s : 0 * e.s : e.s || NaN;
  }
  function td(e) {
    return new this(e).sin();
  }
  function nd(e) {
    return new this(e).sinh();
  }
  function id(e) {
    return new this(e).sqrt();
  }
  function od(e, r) {
    return new this(e).sub(r);
  }
  function sd() {
    var e = 0, r = arguments, t2 = new this(r[e]);
    for (w = false;t2.s && ++e < r.length; )
      t2 = t2.plus(r[e]);
    return w = true, y(t2, this.precision, this.rounding);
  }
  function ad(e) {
    return new this(e).tan();
  }
  function ld(e) {
    return new this(e).tanh();
  }
  function ud(e) {
    return y(e = new this(e), e.e + 1, 1);
  }
  m[Symbol.for("nodejs.util.inspect.custom")] = m.toString;
  m[Symbol.toStringTag] = "Decimal";
  var sr = m.constructor = Ks(ji);
  un = new sr(un);
  cn = new sr(cn);
  var ve = sr;
  function Tr(e) {
    return e === null ? e : Array.isArray(e) ? e.map(Tr) : typeof e == "object" ? cd(e) ? pd(e) : xr(e, Tr) : e;
  }
  function cd(e) {
    return e !== null && typeof e == "object" && typeof e.$type == "string";
  }
  function pd({ $type: e, value: r }) {
    switch (e) {
      case "BigInt":
        return BigInt(r);
      case "Bytes": {
        let { buffer: t2, byteOffset: n, byteLength: i } = Buffer.from(r, "base64");
        return new Uint8Array(t2, n, i);
      }
      case "DateTime":
        return new Date(r);
      case "Decimal":
        return new ve(r);
      case "Json":
        return JSON.parse(r);
      default:
        _e(r, "Unknown tagged value");
    }
  }
  var Pe = class {
    _map = new Map;
    get(r) {
      return this._map.get(r)?.value;
    }
    set(r, t2) {
      this._map.set(r, { value: t2 });
    }
    getOrCreate(r, t2) {
      let n = this._map.get(r);
      if (n)
        return n.value;
      let i = t2();
      return this.set(r, i), i;
    }
  };
  function Ye(e) {
    return e.substring(0, 1).toLowerCase() + e.substring(1);
  }
  function Ys(e, r) {
    let t2 = {};
    for (let n of e) {
      let i = n[r];
      t2[i] = n;
    }
    return t2;
  }
  function at(e) {
    let r;
    return { get() {
      return r || (r = { value: e() }), r.value;
    } };
  }
  function zs(e) {
    return { models: Qi(e.models), enums: Qi(e.enums), types: Qi(e.types) };
  }
  function Qi(e) {
    let r = {};
    for (let { name: t2, ...n } of e)
      r[t2] = n;
    return r;
  }
  function Sr(e) {
    return e instanceof Date || Object.prototype.toString.call(e) === "[object Date]";
  }
  function gn(e) {
    return e.toString() !== "Invalid Date";
  }
  function Rr(e) {
    return sr.isDecimal(e) ? true : e !== null && typeof e == "object" && typeof e.s == "number" && typeof e.e == "number" && typeof e.toFixed == "function" && Array.isArray(e.d);
  }
  var lt = {};
  tr(lt, { ModelAction: () => Cr, datamodelEnumToSchemaEnum: () => dd });
  function dd(e) {
    return { name: e.name, values: e.values.map((r) => r.name) };
  }
  var Cr = ((b) => (b.findUnique = "findUnique", b.findUniqueOrThrow = "findUniqueOrThrow", b.findFirst = "findFirst", b.findFirstOrThrow = "findFirstOrThrow", b.findMany = "findMany", b.create = "create", b.createMany = "createMany", b.createManyAndReturn = "createManyAndReturn", b.update = "update", b.updateMany = "updateMany", b.updateManyAndReturn = "updateManyAndReturn", b.upsert = "upsert", b.delete = "delete", b.deleteMany = "deleteMany", b.groupBy = "groupBy", b.count = "count", b.aggregate = "aggregate", b.findRaw = "findRaw", b.aggregateRaw = "aggregateRaw", b))(Cr || {});
  var ta = k(Ri());
  var ra = k(__require("node:fs"));
  var Zs = { keyword: Oe, entity: Oe, value: (e) => W(nr(e)), punctuation: nr, directive: Oe, function: Oe, variable: (e) => W(nr(e)), string: (e) => W(qe(e)), boolean: ke, number: Oe, comment: Hr };
  var md = (e) => e;
  var hn = {};
  var fd = 0;
  var v = { manual: hn.Prism && hn.Prism.manual, disableWorkerMessageHandler: hn.Prism && hn.Prism.disableWorkerMessageHandler, util: { encode: function(e) {
    if (e instanceof ge) {
      let r = e;
      return new ge(r.type, v.util.encode(r.content), r.alias);
    } else
      return Array.isArray(e) ? e.map(v.util.encode) : e.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/\u00a0/g, " ");
  }, type: function(e) {
    return Object.prototype.toString.call(e).slice(8, -1);
  }, objId: function(e) {
    return e.__id || Object.defineProperty(e, "__id", { value: ++fd }), e.__id;
  }, clone: function e(r, t2) {
    let n, i, o = v.util.type(r);
    switch (t2 = t2 || {}, o) {
      case "Object":
        if (i = v.util.objId(r), t2[i])
          return t2[i];
        n = {}, t2[i] = n;
        for (let s in r)
          r.hasOwnProperty(s) && (n[s] = e(r[s], t2));
        return n;
      case "Array":
        return i = v.util.objId(r), t2[i] ? t2[i] : (n = [], t2[i] = n, r.forEach(function(s, a) {
          n[a] = e(s, t2);
        }), n);
      default:
        return r;
    }
  } }, languages: { extend: function(e, r) {
    let t2 = v.util.clone(v.languages[e]);
    for (let n in r)
      t2[n] = r[n];
    return t2;
  }, insertBefore: function(e, r, t2, n) {
    n = n || v.languages;
    let i = n[e], o = {};
    for (let a in i)
      if (i.hasOwnProperty(a)) {
        if (a == r)
          for (let l in t2)
            t2.hasOwnProperty(l) && (o[l] = t2[l]);
        t2.hasOwnProperty(a) || (o[a] = i[a]);
      }
    let s = n[e];
    return n[e] = o, v.languages.DFS(v.languages, function(a, l) {
      l === s && a != e && (this[a] = o);
    }), o;
  }, DFS: function e(r, t2, n, i) {
    i = i || {};
    let o = v.util.objId;
    for (let s in r)
      if (r.hasOwnProperty(s)) {
        t2.call(r, s, r[s], n || s);
        let a = r[s], l = v.util.type(a);
        l === "Object" && !i[o(a)] ? (i[o(a)] = true, e(a, t2, null, i)) : l === "Array" && !i[o(a)] && (i[o(a)] = true, e(a, t2, s, i));
      }
  } }, plugins: {}, highlight: function(e, r, t2) {
    let n = { code: e, grammar: r, language: t2 };
    return v.hooks.run("before-tokenize", n), n.tokens = v.tokenize(n.code, n.grammar), v.hooks.run("after-tokenize", n), ge.stringify(v.util.encode(n.tokens), n.language);
  }, matchGrammar: function(e, r, t2, n, i, o, s) {
    for (let h in t2) {
      if (!t2.hasOwnProperty(h) || !t2[h])
        continue;
      if (h == s)
        return;
      let I = t2[h];
      I = v.util.type(I) === "Array" ? I : [I];
      for (let P = 0;P < I.length; ++P) {
        let S = I[P], b = S.inside, O = !!S.lookbehind, me = !!S.greedy, ae = 0, Jr = S.alias;
        if (me && !S.pattern.global) {
          let V = S.pattern.toString().match(/[imuy]*$/)[0];
          S.pattern = RegExp(S.pattern.source, V + "g");
        }
        S = S.pattern || S;
        for (let V = n, te = i;V < r.length; te += r[V].length, ++V) {
          let Ae = r[V];
          if (r.length > e.length)
            return;
          if (Ae instanceof ge)
            continue;
          if (me && V != r.length - 1) {
            S.lastIndex = te;
            var p = S.exec(e);
            if (!p)
              break;
            var c = p.index + (O ? p[1].length : 0), d = p.index + p[0].length, a = V, l = te;
            for (let _ = r.length;a < _ && (l < d || !r[a].type && !r[a - 1].greedy); ++a)
              l += r[a].length, c >= l && (++V, te = l);
            if (r[V] instanceof ge)
              continue;
            u = a - V, Ae = e.slice(te, l), p.index -= te;
          } else {
            S.lastIndex = 0;
            var p = S.exec(Ae), u = 1;
          }
          if (!p) {
            if (o)
              break;
            continue;
          }
          O && (ae = p[1] ? p[1].length : 0);
          var c = p.index + ae, p = p[0].slice(ae), d = c + p.length, f = Ae.slice(0, c), g = Ae.slice(d);
          let H = [V, u];
          f && (++V, te += f.length, H.push(f));
          let fr = new ge(h, b ? v.tokenize(p, b) : p, Jr, p, me);
          if (H.push(fr), g && H.push(g), Array.prototype.splice.apply(r, H), u != 1 && v.matchGrammar(e, r, t2, V, te, true, h), o)
            break;
        }
      }
    }
  }, tokenize: function(e, r) {
    let t2 = [e], n = r.rest;
    if (n) {
      for (let i in n)
        r[i] = n[i];
      delete r.rest;
    }
    return v.matchGrammar(e, t2, r, 0, 0, false), t2;
  }, hooks: { all: {}, add: function(e, r) {
    let t2 = v.hooks.all;
    t2[e] = t2[e] || [], t2[e].push(r);
  }, run: function(e, r) {
    let t2 = v.hooks.all[e];
    if (!(!t2 || !t2.length))
      for (var n = 0, i;i = t2[n++]; )
        i(r);
  } }, Token: ge };
  v.languages.clike = { comment: [{ pattern: /(^|[^\\])\/\*[\s\S]*?(?:\*\/|$)/, lookbehind: true }, { pattern: /(^|[^\\:])\/\/.*/, lookbehind: true, greedy: true }], string: { pattern: /(["'])(?:\\(?:\r\n|[\s\S])|(?!\1)[^\\\r\n])*\1/, greedy: true }, "class-name": { pattern: /((?:\b(?:class|interface|extends|implements|trait|instanceof|new)\s+)|(?:catch\s+\())[\w.\\]+/i, lookbehind: true, inside: { punctuation: /[.\\]/ } }, keyword: /\b(?:if|else|while|do|for|return|in|instanceof|function|new|try|throw|catch|finally|null|break|continue)\b/, boolean: /\b(?:true|false)\b/, function: /\w+(?=\()/, number: /\b0x[\da-f]+\b|(?:\b\d+\.?\d*|\B\.\d+)(?:e[+-]?\d+)?/i, operator: /--?|\+\+?|!=?=?|<=?|>=?|==?=?|&&?|\|\|?|\?|\*|\/|~|\^|%/, punctuation: /[{}[\];(),.:]/ };
  v.languages.javascript = v.languages.extend("clike", { "class-name": [v.languages.clike["class-name"], { pattern: /(^|[^$\w\xA0-\uFFFF])[_$A-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\.(?:prototype|constructor))/, lookbehind: true }], keyword: [{ pattern: /((?:^|})\s*)(?:catch|finally)\b/, lookbehind: true }, { pattern: /(^|[^.])\b(?:as|async(?=\s*(?:function\b|\(|[$\w\xA0-\uFFFF]|$))|await|break|case|class|const|continue|debugger|default|delete|do|else|enum|export|extends|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)\b/, lookbehind: true }], number: /\b(?:(?:0[xX](?:[\dA-Fa-f](?:_[\dA-Fa-f])?)+|0[bB](?:[01](?:_[01])?)+|0[oO](?:[0-7](?:_[0-7])?)+)n?|(?:\d(?:_\d)?)+n|NaN|Infinity)\b|(?:\b(?:\d(?:_\d)?)+\.?(?:\d(?:_\d)?)*|\B\.(?:\d(?:_\d)?)+)(?:[Ee][+-]?(?:\d(?:_\d)?)+)?/, function: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*(?:\.\s*(?:apply|bind|call)\s*)?\()/, operator: /-[-=]?|\+[+=]?|!=?=?|<<?=?|>>?>?=?|=(?:==?|>)?|&[&=]?|\|[|=]?|\*\*?=?|\/=?|~|\^=?|%=?|\?|\.{3}/ });
  v.languages.javascript["class-name"][0].pattern = /(\b(?:class|interface|extends|implements|instanceof|new)\s+)[\w.\\]+/;
  v.languages.insertBefore("javascript", "keyword", { regex: { pattern: /((?:^|[^$\w\xA0-\uFFFF."'\])\s])\s*)\/(\[(?:[^\]\\\r\n]|\\.)*]|\\.|[^/\\\[\r\n])+\/[gimyus]{0,6}(?=\s*($|[\r\n,.;})\]]))/, lookbehind: true, greedy: true }, "function-variable": { pattern: /[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*[=:]\s*(?:async\s*)?(?:\bfunction\b|(?:\((?:[^()]|\([^()]*\))*\)|[_$a-zA-Z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)\s*=>))/, alias: "function" }, parameter: [{ pattern: /(function(?:\s+[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*)?\s*\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\))/, lookbehind: true, inside: v.languages.javascript }, { pattern: /[_$a-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*(?=\s*=>)/i, inside: v.languages.javascript }, { pattern: /(\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*=>)/, lookbehind: true, inside: v.languages.javascript }, { pattern: /((?:\b|\s|^)(?!(?:as|async|await|break|case|catch|class|const|continue|debugger|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|let|new|null|of|package|private|protected|public|return|set|static|super|switch|this|throw|try|typeof|undefined|var|void|while|with|yield)(?![$\w\xA0-\uFFFF]))(?:[_$A-Za-z\xA0-\uFFFF][$\w\xA0-\uFFFF]*\s*)\(\s*)(?!\s)(?:[^()]|\([^()]*\))+?(?=\s*\)\s*\{)/, lookbehind: true, inside: v.languages.javascript }], constant: /\b[A-Z](?:[A-Z_]|\dx?)*\b/ });
  v.languages.markup && v.languages.markup.tag.addInlined("script", "javascript");
  v.languages.js = v.languages.javascript;
  v.languages.typescript = v.languages.extend("javascript", { keyword: /\b(?:abstract|as|async|await|break|case|catch|class|const|constructor|continue|debugger|declare|default|delete|do|else|enum|export|extends|finally|for|from|function|get|if|implements|import|in|instanceof|interface|is|keyof|let|module|namespace|new|null|of|package|private|protected|public|readonly|return|require|set|static|super|switch|this|throw|try|type|typeof|var|void|while|with|yield)\b/, builtin: /\b(?:string|Function|any|number|boolean|Array|symbol|console|Promise|unknown|never)\b/ });
  v.languages.ts = v.languages.typescript;
  function ge(e, r, t2, n, i) {
    this.type = e, this.content = r, this.alias = t2, this.length = (n || "").length | 0, this.greedy = !!i;
  }
  ge.stringify = function(e, r) {
    return typeof e == "string" ? e : Array.isArray(e) ? e.map(function(t2) {
      return ge.stringify(t2, r);
    }).join("") : gd(e.type)(e.content);
  };
  function gd(e) {
    return Zs[e] || md;
  }
  function Xs(e) {
    return hd(e, v.languages.javascript);
  }
  function hd(e, r) {
    return v.tokenize(e, r).map((n) => ge.stringify(n)).join("");
  }
  function ea(e) {
    return Ti(e);
  }
  var yn = class e {
    firstLineNumber;
    lines;
    static read(r) {
      let t2;
      try {
        t2 = ra.default.readFileSync(r, "utf-8");
      } catch {
        return null;
      }
      return e.fromContent(t2);
    }
    static fromContent(r) {
      let t2 = r.split(/\r?\n/);
      return new e(1, t2);
    }
    constructor(r, t2) {
      this.firstLineNumber = r, this.lines = t2;
    }
    get lastLineNumber() {
      return this.firstLineNumber + this.lines.length - 1;
    }
    mapLineAt(r, t2) {
      if (r < this.firstLineNumber || r > this.lines.length + this.firstLineNumber)
        return this;
      let n = r - this.firstLineNumber, i = [...this.lines];
      return i[n] = t2(i[n]), new e(this.firstLineNumber, i);
    }
    mapLines(r) {
      return new e(this.firstLineNumber, this.lines.map((t2, n) => r(t2, this.firstLineNumber + n)));
    }
    lineAt(r) {
      return this.lines[r - this.firstLineNumber];
    }
    prependSymbolAt(r, t2) {
      return this.mapLines((n, i) => i === r ? `${t2} ${n}` : `  ${n}`);
    }
    slice(r, t2) {
      let n = this.lines.slice(r - 1, t2).join(`
`);
      return new e(r, ea(n).split(`
`));
    }
    highlight() {
      let r = Xs(this.toString());
      return new e(this.firstLineNumber, r.split(`
`));
    }
    toString() {
      return this.lines.join(`
`);
    }
  };
  var yd = { red: ce, gray: Hr, dim: Ie, bold: W, underline: Y, highlightSource: (e) => e.highlight() };
  var bd = { red: (e) => e, gray: (e) => e, dim: (e) => e, bold: (e) => e, underline: (e) => e, highlightSource: (e) => e };
  function Ed({ message: e, originalMethod: r, isPanic: t2, callArguments: n }) {
    return { functionName: `prisma.${r}()`, message: e, isPanic: t2 ?? false, callArguments: n };
  }
  function wd({ callsite: e, message: r, originalMethod: t2, isPanic: n, callArguments: i }, o) {
    let s = Ed({ message: r, originalMethod: t2, isPanic: n, callArguments: i });
    if (!e || typeof window < "u" || false)
      return s;
    let a = e.getLocation();
    if (!a || !a.lineNumber || !a.columnNumber)
      return s;
    let l = Math.max(1, a.lineNumber - 3), u = yn.read(a.fileName)?.slice(l, a.lineNumber), c = u?.lineAt(a.lineNumber);
    if (u && c) {
      let p = vd(c), d = xd(c);
      if (!d)
        return s;
      s.functionName = `${d.code})`, s.location = a, n || (u = u.mapLineAt(a.lineNumber, (g) => g.slice(0, d.openingBraceIndex))), u = o.highlightSource(u);
      let f = String(u.lastLineNumber).length;
      if (s.contextLines = u.mapLines((g, h) => o.gray(String(h).padStart(f)) + " " + g).mapLines((g) => o.dim(g)).prependSymbolAt(a.lineNumber, o.bold(o.red("→"))), i) {
        let g = p + f + 1;
        g += 2, s.callArguments = (0, ta.default)(i, g).slice(g);
      }
    }
    return s;
  }
  function xd(e) {
    let r = Object.keys(Cr).join("|"), n = new RegExp(String.raw`\.(${r})\(`).exec(e);
    if (n) {
      let i = n.index + n[0].length, o = e.lastIndexOf(" ", n.index) + 1;
      return { code: e.slice(o, i), openingBraceIndex: i };
    }
    return null;
  }
  function vd(e) {
    let r = 0;
    for (let t2 = 0;t2 < e.length; t2++) {
      if (e.charAt(t2) !== " ")
        return r;
      r++;
    }
    return r;
  }
  function Pd({ functionName: e, location: r, message: t2, isPanic: n, contextLines: i, callArguments: o }, s) {
    let a = [""], l = r ? " in" : ":";
    if (n ? (a.push(s.red(`Oops, an unknown error occurred! This is ${s.bold("on us")}, you did nothing wrong.`)), a.push(s.red(`It occurred in the ${s.bold(`\`${e}\``)} invocation${l}`))) : a.push(s.red(`Invalid ${s.bold(`\`${e}\``)} invocation${l}`)), r && a.push(s.underline(Td(r))), i) {
      a.push("");
      let u = [i.toString()];
      o && (u.push(o), u.push(s.dim(")"))), a.push(u.join("")), o && a.push("");
    } else
      a.push(""), o && a.push(o), a.push("");
    return a.push(t2), a.join(`
`);
  }
  function Td(e) {
    let r = [e.fileName];
    return e.lineNumber && r.push(String(e.lineNumber)), e.columnNumber && r.push(String(e.columnNumber)), r.join(":");
  }
  function bn(e) {
    let r = e.showColors ? yd : bd, t2;
    return t2 = wd(e, r), Pd(t2, r);
  }
  var pa = k(Gi());
  function sa(e, r, t2) {
    let n = aa(e), i = Sd(n), o = Cd(i);
    o ? En(o, r, t2) : r.addErrorMessage(() => "Unknown error");
  }
  function aa(e) {
    return e.errors.flatMap((r) => r.kind === "Union" ? aa(r) : [r]);
  }
  function Sd(e) {
    let r = new Map, t2 = [];
    for (let n of e) {
      if (n.kind !== "InvalidArgumentType") {
        t2.push(n);
        continue;
      }
      let i = `${n.selectionPath.join(".")}:${n.argumentPath.join(".")}`, o = r.get(i);
      o ? r.set(i, { ...n, argument: { ...n.argument, typeNames: Rd(o.argument.typeNames, n.argument.typeNames) } }) : r.set(i, n);
    }
    return t2.push(...r.values()), t2;
  }
  function Rd(e, r) {
    return [...new Set(e.concat(r))];
  }
  function Cd(e) {
    return $i(e, (r, t2) => {
      let n = ia(r), i = ia(t2);
      return n !== i ? n - i : oa(r) - oa(t2);
    });
  }
  function ia(e) {
    let r = 0;
    return Array.isArray(e.selectionPath) && (r += e.selectionPath.length), Array.isArray(e.argumentPath) && (r += e.argumentPath.length), r;
  }
  function oa(e) {
    switch (e.kind) {
      case "InvalidArgumentValue":
      case "ValueTooLarge":
        return 20;
      case "InvalidArgumentType":
        return 10;
      case "RequiredArgumentMissing":
        return -10;
      default:
        return 0;
    }
  }
  var ue = class {
    constructor(r, t2) {
      this.name = r;
      this.value = t2;
    }
    isRequired = false;
    makeRequired() {
      return this.isRequired = true, this;
    }
    write(r) {
      let { colors: { green: t2 } } = r.context;
      r.addMarginSymbol(t2(this.isRequired ? "+" : "?")), r.write(t2(this.name)), this.isRequired || r.write(t2("?")), r.write(t2(": ")), typeof this.value == "string" ? r.write(t2(this.value)) : r.write(this.value);
    }
  };
  ua();
  var Ar = class {
    constructor(r = 0, t2) {
      this.context = t2;
      this.currentIndent = r;
    }
    lines = [];
    currentLine = "";
    currentIndent = 0;
    marginSymbol;
    afterNextNewLineCallback;
    write(r) {
      return typeof r == "string" ? this.currentLine += r : r.write(this), this;
    }
    writeJoined(r, t2, n = (i, o) => o.write(i)) {
      let i = t2.length - 1;
      for (let o = 0;o < t2.length; o++)
        n(t2[o], this), o !== i && this.write(r);
      return this;
    }
    writeLine(r) {
      return this.write(r).newLine();
    }
    newLine() {
      this.lines.push(this.indentedCurrentLine()), this.currentLine = "", this.marginSymbol = undefined;
      let r = this.afterNextNewLineCallback;
      return this.afterNextNewLineCallback = undefined, r?.(), this;
    }
    withIndent(r) {
      return this.indent(), r(this), this.unindent(), this;
    }
    afterNextNewline(r) {
      return this.afterNextNewLineCallback = r, this;
    }
    indent() {
      return this.currentIndent++, this;
    }
    unindent() {
      return this.currentIndent > 0 && this.currentIndent--, this;
    }
    addMarginSymbol(r) {
      return this.marginSymbol = r, this;
    }
    toString() {
      return this.lines.concat(this.indentedCurrentLine()).join(`
`);
    }
    getCurrentLineLength() {
      return this.currentLine.length;
    }
    indentedCurrentLine() {
      let r = this.currentLine.padStart(this.currentLine.length + 2 * this.currentIndent);
      return this.marginSymbol ? this.marginSymbol + r.slice(1) : r;
    }
  };
  la();
  var wn = class {
    constructor(r) {
      this.value = r;
    }
    write(r) {
      r.write(this.value);
    }
    markAsError() {
      this.value.markAsError();
    }
  };
  var xn = (e) => e;
  var vn = { bold: xn, red: xn, green: xn, dim: xn, enabled: false };
  var ca = { bold: W, red: ce, green: qe, dim: Ie, enabled: true };
  var Ir = { write(e) {
    e.writeLine(",");
  } };
  var Te = class {
    constructor(r) {
      this.contents = r;
    }
    isUnderlined = false;
    color = (r) => r;
    underline() {
      return this.isUnderlined = true, this;
    }
    setColor(r) {
      return this.color = r, this;
    }
    write(r) {
      let t2 = r.getCurrentLineLength();
      r.write(this.color(this.contents)), this.isUnderlined && r.afterNextNewline(() => {
        r.write(" ".repeat(t2)).writeLine(this.color("~".repeat(this.contents.length)));
      });
    }
  };
  var ze = class {
    hasError = false;
    markAsError() {
      return this.hasError = true, this;
    }
  };
  var kr = class extends ze {
    items = [];
    addItem(r) {
      return this.items.push(new wn(r)), this;
    }
    getField(r) {
      return this.items[r];
    }
    getPrintWidth() {
      return this.items.length === 0 ? 2 : Math.max(...this.items.map((t2) => t2.value.getPrintWidth())) + 2;
    }
    write(r) {
      if (this.items.length === 0) {
        this.writeEmpty(r);
        return;
      }
      this.writeWithItems(r);
    }
    writeEmpty(r) {
      let t2 = new Te("[]");
      this.hasError && t2.setColor(r.context.colors.red).underline(), r.write(t2);
    }
    writeWithItems(r) {
      let { colors: t2 } = r.context;
      r.writeLine("[").withIndent(() => r.writeJoined(Ir, this.items).newLine()).write("]"), this.hasError && r.afterNextNewline(() => {
        r.writeLine(t2.red("~".repeat(this.getPrintWidth())));
      });
    }
    asObject() {}
  };
  var Or = class e extends ze {
    fields = {};
    suggestions = [];
    addField(r) {
      this.fields[r.name] = r;
    }
    addSuggestion(r) {
      this.suggestions.push(r);
    }
    getField(r) {
      return this.fields[r];
    }
    getDeepField(r) {
      let [t2, ...n] = r, i = this.getField(t2);
      if (!i)
        return;
      let o = i;
      for (let s of n) {
        let a;
        if (o.value instanceof e ? a = o.value.getField(s) : o.value instanceof kr && (a = o.value.getField(Number(s))), !a)
          return;
        o = a;
      }
      return o;
    }
    getDeepFieldValue(r) {
      return r.length === 0 ? this : this.getDeepField(r)?.value;
    }
    hasField(r) {
      return !!this.getField(r);
    }
    removeAllFields() {
      this.fields = {};
    }
    removeField(r) {
      delete this.fields[r];
    }
    getFields() {
      return this.fields;
    }
    isEmpty() {
      return Object.keys(this.fields).length === 0;
    }
    getFieldValue(r) {
      return this.getField(r)?.value;
    }
    getDeepSubSelectionValue(r) {
      let t2 = this;
      for (let n of r) {
        if (!(t2 instanceof e))
          return;
        let i = t2.getSubSelectionValue(n);
        if (!i)
          return;
        t2 = i;
      }
      return t2;
    }
    getDeepSelectionParent(r) {
      let t2 = this.getSelectionParent();
      if (!t2)
        return;
      let n = t2;
      for (let i of r) {
        let o = n.value.getFieldValue(i);
        if (!o || !(o instanceof e))
          return;
        let s = o.getSelectionParent();
        if (!s)
          return;
        n = s;
      }
      return n;
    }
    getSelectionParent() {
      let r = this.getField("select")?.value.asObject();
      if (r)
        return { kind: "select", value: r };
      let t2 = this.getField("include")?.value.asObject();
      if (t2)
        return { kind: "include", value: t2 };
    }
    getSubSelectionValue(r) {
      return this.getSelectionParent()?.value.fields[r].value;
    }
    getPrintWidth() {
      let r = Object.values(this.fields);
      return r.length == 0 ? 2 : Math.max(...r.map((n) => n.getPrintWidth())) + 2;
    }
    write(r) {
      let t2 = Object.values(this.fields);
      if (t2.length === 0 && this.suggestions.length === 0) {
        this.writeEmpty(r);
        return;
      }
      this.writeWithContents(r, t2);
    }
    asObject() {
      return this;
    }
    writeEmpty(r) {
      let t2 = new Te("{}");
      this.hasError && t2.setColor(r.context.colors.red).underline(), r.write(t2);
    }
    writeWithContents(r, t2) {
      r.writeLine("{").withIndent(() => {
        r.writeJoined(Ir, [...t2, ...this.suggestions]).newLine();
      }), r.write("}"), this.hasError && r.afterNextNewline(() => {
        r.writeLine(r.context.colors.red("~".repeat(this.getPrintWidth())));
      });
    }
  };
  var G = class extends ze {
    constructor(t2) {
      super();
      this.text = t2;
    }
    getPrintWidth() {
      return this.text.length;
    }
    write(t2) {
      let n = new Te(this.text);
      this.hasError && n.underline().setColor(t2.context.colors.red), t2.write(n);
    }
    asObject() {}
  };
  var ut = class {
    fields = [];
    addField(r, t2) {
      return this.fields.push({ write(n) {
        let { green: i, dim: o } = n.context.colors;
        n.write(i(o(`${r}: ${t2}`))).addMarginSymbol(i(o("+")));
      } }), this;
    }
    write(r) {
      let { colors: { green: t2 } } = r.context;
      r.writeLine(t2("{")).withIndent(() => {
        r.writeJoined(Ir, this.fields).newLine();
      }).write(t2("}")).addMarginSymbol(t2("+"));
    }
  };
  function En(e, r, t2) {
    switch (e.kind) {
      case "MutuallyExclusiveFields":
        Ad(e, r);
        break;
      case "IncludeOnScalar":
        Id(e, r);
        break;
      case "EmptySelection":
        kd(e, r, t2);
        break;
      case "UnknownSelectionField":
        Nd(e, r);
        break;
      case "InvalidSelectionValue":
        Fd(e, r);
        break;
      case "UnknownArgument":
        Ld(e, r);
        break;
      case "UnknownInputField":
        Md(e, r);
        break;
      case "RequiredArgumentMissing":
        $d(e, r);
        break;
      case "InvalidArgumentType":
        qd(e, r);
        break;
      case "InvalidArgumentValue":
        jd(e, r);
        break;
      case "ValueTooLarge":
        Vd(e, r);
        break;
      case "SomeFieldsMissing":
        Bd(e, r);
        break;
      case "TooManyFieldsGiven":
        Ud(e, r);
        break;
      case "Union":
        sa(e, r, t2);
        break;
      default:
        throw new Error("not implemented: " + e.kind);
    }
  }
  function Ad(e, r) {
    let t2 = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    t2 && (t2.getField(e.firstField)?.markAsError(), t2.getField(e.secondField)?.markAsError()), r.addErrorMessage((n) => `Please ${n.bold("either")} use ${n.green(`\`${e.firstField}\``)} or ${n.green(`\`${e.secondField}\``)}, but ${n.red("not both")} at the same time.`);
  }
  function Id(e, r) {
    let [t2, n] = ct(e.selectionPath), i = e.outputType, o = r.arguments.getDeepSelectionParent(t2)?.value;
    if (o && (o.getField(n)?.markAsError(), i))
      for (let s of i.fields)
        s.isRelation && o.addSuggestion(new ue(s.name, "true"));
    r.addErrorMessage((s) => {
      let a = `Invalid scalar field ${s.red(`\`${n}\``)} for ${s.bold("include")} statement`;
      return i ? a += ` on model ${s.bold(i.name)}. ${pt(s)}` : a += ".", a += `
Note that ${s.bold("include")} statements only accept relation fields.`, a;
    });
  }
  function kd(e, r, t2) {
    let n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (n) {
      let i = n.getField("omit")?.value.asObject();
      if (i) {
        Od(e, r, i);
        return;
      }
      if (n.hasField("select")) {
        Dd(e, r);
        return;
      }
    }
    if (t2?.[Ye(e.outputType.name)]) {
      _d(e, r);
      return;
    }
    r.addErrorMessage(() => `Unknown field at "${e.selectionPath.join(".")} selection"`);
  }
  function Od(e, r, t2) {
    t2.removeAllFields();
    for (let n of e.outputType.fields)
      t2.addSuggestion(new ue(n.name, "false"));
    r.addErrorMessage((n) => `The ${n.red("omit")} statement includes every field of the model ${n.bold(e.outputType.name)}. At least one field must be included in the result`);
  }
  function Dd(e, r) {
    let t2 = e.outputType, n = r.arguments.getDeepSelectionParent(e.selectionPath)?.value, i = n?.isEmpty() ?? false;
    n && (n.removeAllFields(), fa(n, t2)), r.addErrorMessage((o) => i ? `The ${o.red("`select`")} statement for type ${o.bold(t2.name)} must not be empty. ${pt(o)}` : `The ${o.red("`select`")} statement for type ${o.bold(t2.name)} needs ${o.bold("at least one truthy value")}.`);
  }
  function _d(e, r) {
    let t2 = new ut;
    for (let i of e.outputType.fields)
      i.isRelation || t2.addField(i.name, "false");
    let n = new ue("omit", t2).makeRequired();
    if (e.selectionPath.length === 0)
      r.arguments.addSuggestion(n);
    else {
      let [i, o] = ct(e.selectionPath), a = r.arguments.getDeepSelectionParent(i)?.value.asObject()?.getField(o);
      if (a) {
        let l = a?.value.asObject() ?? new Or;
        l.addSuggestion(n), a.value = l;
      }
    }
    r.addErrorMessage((i) => `The global ${i.red("omit")} configuration excludes every field of the model ${i.bold(e.outputType.name)}. At least one field must be included in the result`);
  }
  function Nd(e, r) {
    let t2 = ga(e.selectionPath, r);
    if (t2.parentKind !== "unknown") {
      t2.field.markAsError();
      let n = t2.parent;
      switch (t2.parentKind) {
        case "select":
          fa(n, e.outputType);
          break;
        case "include":
          Qd(n, e.outputType);
          break;
        case "omit":
          Gd(n, e.outputType);
          break;
      }
    }
    r.addErrorMessage((n) => {
      let i = [`Unknown field ${n.red(`\`${t2.fieldName}\``)}`];
      return t2.parentKind !== "unknown" && i.push(`for ${n.bold(t2.parentKind)} statement`), i.push(`on model ${n.bold(`\`${e.outputType.name}\``)}.`), i.push(pt(n)), i.join(" ");
    });
  }
  function Fd(e, r) {
    let t2 = ga(e.selectionPath, r);
    t2.parentKind !== "unknown" && t2.field.value.markAsError(), r.addErrorMessage((n) => `Invalid value for selection field \`${n.red(t2.fieldName)}\`: ${e.underlyingError}`);
  }
  function Ld(e, r) {
    let t2 = e.argumentPath[0], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && (n.getField(t2)?.markAsError(), Wd(n, e.arguments)), r.addErrorMessage((i) => da(i, t2, e.arguments.map((o) => o.name)));
  }
  function Md(e, r) {
    let [t2, n] = ct(e.argumentPath), i = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (i) {
      i.getDeepField(e.argumentPath)?.markAsError();
      let o = i.getDeepFieldValue(t2)?.asObject();
      o && ha(o, e.inputType);
    }
    r.addErrorMessage((o) => da(o, n, e.inputType.fields.map((s) => s.name)));
  }
  function da(e, r, t2) {
    let n = [`Unknown argument \`${e.red(r)}\`.`], i = Hd(r, t2);
    return i && n.push(`Did you mean \`${e.green(i)}\`?`), t2.length > 0 && n.push(pt(e)), n.join(" ");
  }
  function $d(e, r) {
    let t2;
    r.addErrorMessage((l) => t2?.value instanceof G && t2.value.text === "null" ? `Argument \`${l.green(o)}\` must not be ${l.red("null")}.` : `Argument \`${l.green(o)}\` is missing.`);
    let n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (!n)
      return;
    let [i, o] = ct(e.argumentPath), s = new ut, a = n.getDeepFieldValue(i)?.asObject();
    if (a)
      if (t2 = a.getField(o), t2 && a.removeField(o), e.inputTypes.length === 1 && e.inputTypes[0].kind === "object") {
        for (let l of e.inputTypes[0].fields)
          s.addField(l.name, l.typeNames.join(" | "));
        a.addSuggestion(new ue(o, s).makeRequired());
      } else {
        let l = e.inputTypes.map(ma).join(" | ");
        a.addSuggestion(new ue(o, l).makeRequired());
      }
  }
  function ma(e) {
    return e.kind === "list" ? `${ma(e.elementType)}[]` : e.name;
  }
  function qd(e, r) {
    let t2 = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), r.addErrorMessage((i) => {
      let o = Pn("or", e.argument.typeNames.map((s) => i.green(s)));
      return `Argument \`${i.bold(t2)}\`: Invalid value provided. Expected ${o}, provided ${i.red(e.inferredType)}.`;
    });
  }
  function jd(e, r) {
    let t2 = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    n && n.getDeepFieldValue(e.argumentPath)?.markAsError(), r.addErrorMessage((i) => {
      let o = [`Invalid value for argument \`${i.bold(t2)}\``];
      if (e.underlyingError && o.push(`: ${e.underlyingError}`), o.push("."), e.argument.typeNames.length > 0) {
        let s = Pn("or", e.argument.typeNames.map((a) => i.green(a)));
        o.push(` Expected ${s}.`);
      }
      return o.join("");
    });
  }
  function Vd(e, r) {
    let t2 = e.argument.name, n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i;
    if (n) {
      let s = n.getDeepField(e.argumentPath)?.value;
      s?.markAsError(), s instanceof G && (i = s.text);
    }
    r.addErrorMessage((o) => {
      let s = ["Unable to fit value"];
      return i && s.push(o.red(i)), s.push(`into a 64-bit signed integer for field \`${o.bold(t2)}\``), s.join(" ");
    });
  }
  function Bd(e, r) {
    let t2 = e.argumentPath[e.argumentPath.length - 1], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject();
    if (n) {
      let i = n.getDeepFieldValue(e.argumentPath)?.asObject();
      i && ha(i, e.inputType);
    }
    r.addErrorMessage((i) => {
      let o = [`Argument \`${i.bold(t2)}\` of type ${i.bold(e.inputType.name)} needs`];
      return e.constraints.minFieldCount === 1 ? e.constraints.requiredFields ? o.push(`${i.green("at least one of")} ${Pn("or", e.constraints.requiredFields.map((s) => `\`${i.bold(s)}\``))} arguments.`) : o.push(`${i.green("at least one")} argument.`) : o.push(`${i.green(`at least ${e.constraints.minFieldCount}`)} arguments.`), o.push(pt(i)), o.join(" ");
    });
  }
  function Ud(e, r) {
    let t2 = e.argumentPath[e.argumentPath.length - 1], n = r.arguments.getDeepSubSelectionValue(e.selectionPath)?.asObject(), i = [];
    if (n) {
      let o = n.getDeepFieldValue(e.argumentPath)?.asObject();
      o && (o.markAsError(), i = Object.keys(o.getFields()));
    }
    r.addErrorMessage((o) => {
      let s = [`Argument \`${o.bold(t2)}\` of type ${o.bold(e.inputType.name)} needs`];
      return e.constraints.minFieldCount === 1 && e.constraints.maxFieldCount == 1 ? s.push(`${o.green("exactly one")} argument,`) : e.constraints.maxFieldCount == 1 ? s.push(`${o.green("at most one")} argument,`) : s.push(`${o.green(`at most ${e.constraints.maxFieldCount}`)} arguments,`), s.push(`but you provided ${Pn("and", i.map((a) => o.red(a)))}. Please choose`), e.constraints.maxFieldCount === 1 ? s.push("one.") : s.push(`${e.constraints.maxFieldCount}.`), s.join(" ");
    });
  }
  function fa(e, r) {
    for (let t2 of r.fields)
      e.hasField(t2.name) || e.addSuggestion(new ue(t2.name, "true"));
  }
  function Qd(e, r) {
    for (let t2 of r.fields)
      t2.isRelation && !e.hasField(t2.name) && e.addSuggestion(new ue(t2.name, "true"));
  }
  function Gd(e, r) {
    for (let t2 of r.fields)
      !e.hasField(t2.name) && !t2.isRelation && e.addSuggestion(new ue(t2.name, "true"));
  }
  function Wd(e, r) {
    for (let t2 of r)
      e.hasField(t2.name) || e.addSuggestion(new ue(t2.name, t2.typeNames.join(" | ")));
  }
  function ga(e, r) {
    let [t2, n] = ct(e), i = r.arguments.getDeepSubSelectionValue(t2)?.asObject();
    if (!i)
      return { parentKind: "unknown", fieldName: n };
    let o = i.getFieldValue("select")?.asObject(), s = i.getFieldValue("include")?.asObject(), a = i.getFieldValue("omit")?.asObject(), l = o?.getField(n);
    return o && l ? { parentKind: "select", parent: o, field: l, fieldName: n } : (l = s?.getField(n), s && l ? { parentKind: "include", field: l, parent: s, fieldName: n } : (l = a?.getField(n), a && l ? { parentKind: "omit", field: l, parent: a, fieldName: n } : { parentKind: "unknown", fieldName: n }));
  }
  function ha(e, r) {
    if (r.kind === "object")
      for (let t2 of r.fields)
        e.hasField(t2.name) || e.addSuggestion(new ue(t2.name, t2.typeNames.join(" | ")));
  }
  function ct(e) {
    let r = [...e], t2 = r.pop();
    if (!t2)
      throw new Error("unexpected empty path");
    return [r, t2];
  }
  function pt({ green: e, enabled: r }) {
    return "Available options are " + (r ? `listed in ${e("green")}` : "marked with ?") + ".";
  }
  function Pn(e, r) {
    if (r.length === 1)
      return r[0];
    let t2 = [...r], n = t2.pop();
    return `${t2.join(", ")} ${e} ${n}`;
  }
  var Jd = 3;
  function Hd(e, r) {
    let t2 = 1 / 0, n;
    for (let i of r) {
      let o = (0, pa.default)(e, i);
      o > Jd || o < t2 && (t2 = o, n = i);
    }
    return n;
  }
  var dt = class {
    modelName;
    name;
    typeName;
    isList;
    isEnum;
    constructor(r, t2, n, i, o) {
      this.modelName = r, this.name = t2, this.typeName = n, this.isList = i, this.isEnum = o;
    }
    _toGraphQLInputType() {
      let r = this.isList ? "List" : "", t2 = this.isEnum ? "Enum" : "";
      return `${r}${t2}${this.typeName}FieldRefInput<${this.modelName}>`;
    }
  };
  function Dr(e) {
    return e instanceof dt;
  }
  var Tn = Symbol();
  var Ji = new WeakMap;
  var Le = class {
    constructor(r) {
      r === Tn ? Ji.set(this, `Prisma.${this._getName()}`) : Ji.set(this, `new Prisma.${this._getNamespace()}.${this._getName()}()`);
    }
    _getName() {
      return this.constructor.name;
    }
    toString() {
      return Ji.get(this);
    }
  };
  var mt = class extends Le {
    _getNamespace() {
      return "NullTypes";
    }
  };
  var ft = class extends mt {
    #e;
  };
  Hi(ft, "DbNull");
  var gt = class extends mt {
    #e;
  };
  Hi(gt, "JsonNull");
  var ht = class extends mt {
    #e;
  };
  Hi(ht, "AnyNull");
  var Sn = { classes: { DbNull: ft, JsonNull: gt, AnyNull: ht }, instances: { DbNull: new ft(Tn), JsonNull: new gt(Tn), AnyNull: new ht(Tn) } };
  function Hi(e, r) {
    Object.defineProperty(e, "name", { value: r, configurable: true });
  }
  var ya = ": ";
  var Rn = class {
    constructor(r, t2) {
      this.name = r;
      this.value = t2;
    }
    hasError = false;
    markAsError() {
      this.hasError = true;
    }
    getPrintWidth() {
      return this.name.length + this.value.getPrintWidth() + ya.length;
    }
    write(r) {
      let t2 = new Te(this.name);
      this.hasError && t2.underline().setColor(r.context.colors.red), r.write(t2).write(ya).write(this.value);
    }
  };
  var Ki = class {
    arguments;
    errorMessages = [];
    constructor(r) {
      this.arguments = r;
    }
    write(r) {
      r.write(this.arguments);
    }
    addErrorMessage(r) {
      this.errorMessages.push(r);
    }
    renderAllMessages(r) {
      return this.errorMessages.map((t2) => t2(r)).join(`
`);
    }
  };
  function _r(e) {
    return new Ki(ba(e));
  }
  function ba(e) {
    let r = new Or;
    for (let [t2, n] of Object.entries(e)) {
      let i = new Rn(t2, Ea(n));
      r.addField(i);
    }
    return r;
  }
  function Ea(e) {
    if (typeof e == "string")
      return new G(JSON.stringify(e));
    if (typeof e == "number" || typeof e == "boolean")
      return new G(String(e));
    if (typeof e == "bigint")
      return new G(`${e}n`);
    if (e === null)
      return new G("null");
    if (e === undefined)
      return new G("undefined");
    if (Rr(e))
      return new G(`new Prisma.Decimal("${e.toFixed()}")`);
    if (e instanceof Uint8Array)
      return Buffer.isBuffer(e) ? new G(`Buffer.alloc(${e.byteLength})`) : new G(`new Uint8Array(${e.byteLength})`);
    if (e instanceof Date) {
      let r = gn(e) ? e.toISOString() : "Invalid Date";
      return new G(`new Date("${r}")`);
    }
    return e instanceof Le ? new G(`Prisma.${e._getName()}`) : Dr(e) ? new G(`prisma.${Ye(e.modelName)}.$fields.${e.name}`) : Array.isArray(e) ? Kd(e) : typeof e == "object" ? ba(e) : new G(Object.prototype.toString.call(e));
  }
  function Kd(e) {
    let r = new kr;
    for (let t2 of e)
      r.addItem(Ea(t2));
    return r;
  }
  function Cn(e, r) {
    let t2 = r === "pretty" ? ca : vn, n = e.renderAllMessages(t2), i = new Ar(0, { colors: t2 }).write(e).toString();
    return { message: n, args: i };
  }
  function An({ args: e, errors: r, errorFormat: t2, callsite: n, originalMethod: i, clientVersion: o, globalOmit: s }) {
    let a = _r(e);
    for (let p of r)
      En(p, a, s);
    let { message: l, args: u } = Cn(a, t2), c = bn({ message: l, callsite: n, originalMethod: i, showColors: t2 === "pretty", callArguments: u });
    throw new Z(c, { clientVersion: o });
  }
  function Se(e) {
    return e.replace(/^./, (r) => r.toLowerCase());
  }
  function xa(e, r, t2) {
    let n = Se(t2);
    return !r.result || !(r.result.$allModels || r.result[n]) ? e : Yd({ ...e, ...wa(r.name, e, r.result.$allModels), ...wa(r.name, e, r.result[n]) });
  }
  function Yd(e) {
    let r = new Pe, t2 = (n, i) => r.getOrCreate(n, () => i.has(n) ? [n] : (i.add(n), e[n] ? e[n].needs.flatMap((o) => t2(o, i)) : [n]));
    return xr(e, (n) => ({ ...n, needs: t2(n.name, new Set) }));
  }
  function wa(e, r, t2) {
    return t2 ? xr(t2, ({ needs: n, compute: i }, o) => ({ name: o, needs: n ? Object.keys(n).filter((s) => n[s]) : [], compute: zd(r, o, i) })) : {};
  }
  function zd(e, r, t2) {
    let n = e?.[r]?.compute;
    return n ? (i) => t2({ ...i, [r]: n(i) }) : t2;
  }
  function va(e, r) {
    if (!r)
      return e;
    let t2 = { ...e };
    for (let n of Object.values(r))
      if (e[n.name])
        for (let i of n.needs)
          t2[i] = true;
    return t2;
  }
  function Pa(e, r) {
    if (!r)
      return e;
    let t2 = { ...e };
    for (let n of Object.values(r))
      if (!e[n.name])
        for (let i of n.needs)
          delete t2[i];
    return t2;
  }
  var In = class {
    constructor(r, t2) {
      this.extension = r;
      this.previous = t2;
    }
    computedFieldsCache = new Pe;
    modelExtensionsCache = new Pe;
    queryCallbacksCache = new Pe;
    clientExtensions = at(() => this.extension.client ? { ...this.previous?.getAllClientExtensions(), ...this.extension.client } : this.previous?.getAllClientExtensions());
    batchCallbacks = at(() => {
      let r = this.previous?.getAllBatchQueryCallbacks() ?? [], t2 = this.extension.query?.$__internalBatch;
      return t2 ? r.concat(t2) : r;
    });
    getAllComputedFields(r) {
      return this.computedFieldsCache.getOrCreate(r, () => xa(this.previous?.getAllComputedFields(r), this.extension, r));
    }
    getAllClientExtensions() {
      return this.clientExtensions.get();
    }
    getAllModelExtensions(r) {
      return this.modelExtensionsCache.getOrCreate(r, () => {
        let t2 = Se(r);
        return !this.extension.model || !(this.extension.model[t2] || this.extension.model.$allModels) ? this.previous?.getAllModelExtensions(r) : { ...this.previous?.getAllModelExtensions(r), ...this.extension.model.$allModels, ...this.extension.model[t2] };
      });
    }
    getAllQueryCallbacks(r, t2) {
      return this.queryCallbacksCache.getOrCreate(`${r}:${t2}`, () => {
        let n = this.previous?.getAllQueryCallbacks(r, t2) ?? [], i = [], o = this.extension.query;
        return !o || !(o[r] || o.$allModels || o[t2] || o.$allOperations) ? n : (o[r] !== undefined && (o[r][t2] !== undefined && i.push(o[r][t2]), o[r].$allOperations !== undefined && i.push(o[r].$allOperations)), r !== "$none" && o.$allModels !== undefined && (o.$allModels[t2] !== undefined && i.push(o.$allModels[t2]), o.$allModels.$allOperations !== undefined && i.push(o.$allModels.$allOperations)), o[t2] !== undefined && i.push(o[t2]), o.$allOperations !== undefined && i.push(o.$allOperations), n.concat(i));
      });
    }
    getAllBatchQueryCallbacks() {
      return this.batchCallbacks.get();
    }
  };
  var Nr = class e {
    constructor(r) {
      this.head = r;
    }
    static empty() {
      return new e;
    }
    static single(r) {
      return new e(new In(r));
    }
    isEmpty() {
      return this.head === undefined;
    }
    append(r) {
      return new e(new In(r, this.head));
    }
    getAllComputedFields(r) {
      return this.head?.getAllComputedFields(r);
    }
    getAllClientExtensions() {
      return this.head?.getAllClientExtensions();
    }
    getAllModelExtensions(r) {
      return this.head?.getAllModelExtensions(r);
    }
    getAllQueryCallbacks(r, t2) {
      return this.head?.getAllQueryCallbacks(r, t2) ?? [];
    }
    getAllBatchQueryCallbacks() {
      return this.head?.getAllBatchQueryCallbacks() ?? [];
    }
  };
  var kn = class {
    constructor(r) {
      this.name = r;
    }
  };
  function Ta(e) {
    return e instanceof kn;
  }
  function Sa(e) {
    return new kn(e);
  }
  var Ra = Symbol();
  var yt = class {
    constructor(r) {
      if (r !== Ra)
        throw new Error("Skip instance can not be constructed directly");
    }
    ifUndefined(r) {
      return r === undefined ? On : r;
    }
  };
  var On = new yt(Ra);
  function Re(e) {
    return e instanceof yt;
  }
  var Zd = { findUnique: "findUnique", findUniqueOrThrow: "findUniqueOrThrow", findFirst: "findFirst", findFirstOrThrow: "findFirstOrThrow", findMany: "findMany", count: "aggregate", create: "createOne", createMany: "createMany", createManyAndReturn: "createManyAndReturn", update: "updateOne", updateMany: "updateMany", updateManyAndReturn: "updateManyAndReturn", upsert: "upsertOne", delete: "deleteOne", deleteMany: "deleteMany", executeRaw: "executeRaw", queryRaw: "queryRaw", aggregate: "aggregate", groupBy: "groupBy", runCommandRaw: "runCommandRaw", findRaw: "findRaw", aggregateRaw: "aggregateRaw" };
  var Ca = "explicitly `undefined` values are not allowed";
  function Dn({ modelName: e, action: r, args: t2, runtimeDataModel: n, extensions: i = Nr.empty(), callsite: o, clientMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c }) {
    let p = new Yi({ runtimeDataModel: n, modelName: e, action: r, rootArgs: t2, callsite: o, extensions: i, selectionPath: [], argumentPath: [], originalMethod: s, errorFormat: a, clientVersion: l, previewFeatures: u, globalOmit: c });
    return { modelName: e, action: Zd[r], query: bt(t2, p) };
  }
  function bt({ select: e, include: r, ...t2 } = {}, n) {
    let i = t2.omit;
    return delete t2.omit, { arguments: Ia(t2, n), selection: Xd(e, r, i, n) };
  }
  function Xd(e, r, t2, n) {
    return e ? (r ? n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "include", secondField: "select", selectionPath: n.getSelectionPath() }) : t2 && n.throwValidationError({ kind: "MutuallyExclusiveFields", firstField: "omit", secondField: "select", selectionPath: n.getSelectionPath() }), nm(e, n)) : em(n, r, t2);
  }
  function em(e, r, t2) {
    let n = {};
    return e.modelOrType && !e.isRawAction() && (n.$composites = true, n.$scalars = true), r && rm(n, r, e), tm(n, t2, e), n;
  }
  function rm(e, r, t2) {
    for (let [n, i] of Object.entries(r)) {
      if (Re(i))
        continue;
      let o = t2.nestSelection(n);
      if (zi(i, o), i === false || i === undefined) {
        e[n] = false;
        continue;
      }
      let s = t2.findField(n);
      if (s && s.kind !== "object" && t2.throwValidationError({ kind: "IncludeOnScalar", selectionPath: t2.getSelectionPath().concat(n), outputType: t2.getOutputTypeDescription() }), s) {
        e[n] = bt(i === true ? {} : i, o);
        continue;
      }
      if (i === true) {
        e[n] = true;
        continue;
      }
      e[n] = bt(i, o);
    }
  }
  function tm(e, r, t2) {
    let n = t2.getComputedFields(), i = { ...t2.getGlobalOmit(), ...r }, o = Pa(i, n);
    for (let [s, a] of Object.entries(o)) {
      if (Re(a))
        continue;
      zi(a, t2.nestSelection(s));
      let l = t2.findField(s);
      n?.[s] && !l || (e[s] = !a);
    }
  }
  function nm(e, r) {
    let t2 = {}, n = r.getComputedFields(), i = va(e, n);
    for (let [o, s] of Object.entries(i)) {
      if (Re(s))
        continue;
      let a = r.nestSelection(o);
      zi(s, a);
      let l = r.findField(o);
      if (!(n?.[o] && !l)) {
        if (s === false || s === undefined || Re(s)) {
          t2[o] = false;
          continue;
        }
        if (s === true) {
          l?.kind === "object" ? t2[o] = bt({}, a) : t2[o] = true;
          continue;
        }
        t2[o] = bt(s, a);
      }
    }
    return t2;
  }
  function Aa(e, r) {
    if (e === null)
      return null;
    if (typeof e == "string" || typeof e == "number" || typeof e == "boolean")
      return e;
    if (typeof e == "bigint")
      return { $type: "BigInt", value: String(e) };
    if (Sr(e)) {
      if (gn(e))
        return { $type: "DateTime", value: e.toISOString() };
      r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r.getSelectionPath(), argumentPath: r.getArgumentPath(), argument: { name: r.getArgumentName(), typeNames: ["Date"] }, underlyingError: "Provided Date object is invalid" });
    }
    if (Ta(e))
      return { $type: "Param", value: e.name };
    if (Dr(e))
      return { $type: "FieldRef", value: { _ref: e.name, _container: e.modelName } };
    if (Array.isArray(e))
      return im(e, r);
    if (ArrayBuffer.isView(e)) {
      let { buffer: t2, byteOffset: n, byteLength: i } = e;
      return { $type: "Bytes", value: Buffer.from(t2, n, i).toString("base64") };
    }
    if (om(e))
      return e.values;
    if (Rr(e))
      return { $type: "Decimal", value: e.toFixed() };
    if (e instanceof Le) {
      if (e !== Sn.instances[e._getName()])
        throw new Error("Invalid ObjectEnumValue");
      return { $type: "Enum", value: e._getName() };
    }
    if (sm(e))
      return e.toJSON();
    if (typeof e == "object")
      return Ia(e, r);
    r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: r.getSelectionPath(), argumentPath: r.getArgumentPath(), argument: { name: r.getArgumentName(), typeNames: [] }, underlyingError: `We could not serialize ${Object.prototype.toString.call(e)} value. Serialize the object to JSON or implement a ".toJSON()" method on it` });
  }
  function Ia(e, r) {
    if (e.$type)
      return { $type: "Raw", value: e };
    let t2 = {};
    for (let n in e) {
      let i = e[n], o = r.nestArgument(n);
      Re(i) || (i !== undefined ? t2[n] = Aa(i, o) : r.isPreviewFeatureOn("strictUndefinedChecks") && r.throwValidationError({ kind: "InvalidArgumentValue", argumentPath: o.getArgumentPath(), selectionPath: r.getSelectionPath(), argument: { name: r.getArgumentName(), typeNames: [] }, underlyingError: Ca }));
    }
    return t2;
  }
  function im(e, r) {
    let t2 = [];
    for (let n = 0;n < e.length; n++) {
      let i = r.nestArgument(String(n)), o = e[n];
      if (o === undefined || Re(o)) {
        let s = o === undefined ? "undefined" : "Prisma.skip";
        r.throwValidationError({ kind: "InvalidArgumentValue", selectionPath: i.getSelectionPath(), argumentPath: i.getArgumentPath(), argument: { name: `${r.getArgumentName()}[${n}]`, typeNames: [] }, underlyingError: `Can not use \`${s}\` value within array. Use \`null\` or filter out \`${s}\` values` });
      }
      t2.push(Aa(o, i));
    }
    return t2;
  }
  function om(e) {
    return typeof e == "object" && e !== null && e.__prismaRawParameters__ === true;
  }
  function sm(e) {
    return typeof e == "object" && e !== null && typeof e.toJSON == "function";
  }
  function zi(e, r) {
    e === undefined && r.isPreviewFeatureOn("strictUndefinedChecks") && r.throwValidationError({ kind: "InvalidSelectionValue", selectionPath: r.getSelectionPath(), underlyingError: Ca });
  }
  var Yi = class e {
    constructor(r) {
      this.params = r;
      this.params.modelName && (this.modelOrType = this.params.runtimeDataModel.models[this.params.modelName] ?? this.params.runtimeDataModel.types[this.params.modelName]);
    }
    modelOrType;
    throwValidationError(r) {
      An({ errors: [r], originalMethod: this.params.originalMethod, args: this.params.rootArgs ?? {}, callsite: this.params.callsite, errorFormat: this.params.errorFormat, clientVersion: this.params.clientVersion, globalOmit: this.params.globalOmit });
    }
    getSelectionPath() {
      return this.params.selectionPath;
    }
    getArgumentPath() {
      return this.params.argumentPath;
    }
    getArgumentName() {
      return this.params.argumentPath[this.params.argumentPath.length - 1];
    }
    getOutputTypeDescription() {
      if (!(!this.params.modelName || !this.modelOrType))
        return { name: this.params.modelName, fields: this.modelOrType.fields.map((r) => ({ name: r.name, typeName: "boolean", isRelation: r.kind === "object" })) };
    }
    isRawAction() {
      return ["executeRaw", "queryRaw", "runCommandRaw", "findRaw", "aggregateRaw"].includes(this.params.action);
    }
    isPreviewFeatureOn(r) {
      return this.params.previewFeatures.includes(r);
    }
    getComputedFields() {
      if (this.params.modelName)
        return this.params.extensions.getAllComputedFields(this.params.modelName);
    }
    findField(r) {
      return this.modelOrType?.fields.find((t2) => t2.name === r);
    }
    nestSelection(r) {
      let t2 = this.findField(r), n = t2?.kind === "object" ? t2.type : undefined;
      return new e({ ...this.params, modelName: n, selectionPath: this.params.selectionPath.concat(r) });
    }
    getGlobalOmit() {
      return this.params.modelName && this.shouldApplyGlobalOmit() ? this.params.globalOmit?.[Ye(this.params.modelName)] ?? {} : {};
    }
    shouldApplyGlobalOmit() {
      switch (this.params.action) {
        case "findFirst":
        case "findFirstOrThrow":
        case "findUniqueOrThrow":
        case "findMany":
        case "upsert":
        case "findUnique":
        case "createManyAndReturn":
        case "create":
        case "update":
        case "updateManyAndReturn":
        case "delete":
          return true;
        case "executeRaw":
        case "aggregateRaw":
        case "runCommandRaw":
        case "findRaw":
        case "createMany":
        case "deleteMany":
        case "groupBy":
        case "updateMany":
        case "count":
        case "aggregate":
        case "queryRaw":
          return false;
        default:
          _e(this.params.action, "Unknown action");
      }
    }
    nestArgument(r) {
      return new e({ ...this.params, argumentPath: this.params.argumentPath.concat(r) });
    }
  };
  function ka(e) {
    if (!e._hasPreviewFlag("metrics"))
      throw new Z("`metrics` preview feature must be enabled in order to access metrics API", { clientVersion: e._clientVersion });
  }
  var Fr = class {
    _client;
    constructor(r) {
      this._client = r;
    }
    prometheus(r) {
      return ka(this._client), this._client._engine.metrics({ format: "prometheus", ...r });
    }
    json(r) {
      return ka(this._client), this._client._engine.metrics({ format: "json", ...r });
    }
  };
  function Oa(e, r) {
    let t2 = at(() => am(r));
    Object.defineProperty(e, "dmmf", { get: () => t2.get() });
  }
  function am(e) {
    return { datamodel: { models: Zi(e.models), enums: Zi(e.enums), types: Zi(e.types) } };
  }
  function Zi(e) {
    return Object.entries(e).map(([r, t2]) => ({ name: r, ...t2 }));
  }
  var Xi = new WeakMap;
  var _n = "$$PrismaTypedSql";
  var Et = class {
    constructor(r, t2) {
      Xi.set(this, { sql: r, values: t2 }), Object.defineProperty(this, _n, { value: _n });
    }
    get sql() {
      return Xi.get(this).sql;
    }
    get values() {
      return Xi.get(this).values;
    }
  };
  function Da(e) {
    return (...r) => new Et(e, r);
  }
  function Nn(e) {
    return e != null && e[_n] === _n;
  }
  var cu = k(Ei());
  var pu = __require("node:async_hooks");
  var du = __require("node:events");
  var mu = k(__require("node:fs"));
  var Zn = k(__require("node:path"));
  var oe = class e {
    constructor(r, t2) {
      if (r.length - 1 !== t2.length)
        throw r.length === 0 ? new TypeError("Expected at least 1 string") : new TypeError(`Expected ${r.length} strings to have ${r.length - 1} values`);
      let n = t2.reduce((s, a) => s + (a instanceof e ? a.values.length : 1), 0);
      this.values = new Array(n), this.strings = new Array(n + 1), this.strings[0] = r[0];
      let i = 0, o = 0;
      for (;i < t2.length; ) {
        let s = t2[i++], a = r[i];
        if (s instanceof e) {
          this.strings[o] += s.strings[0];
          let l = 0;
          for (;l < s.values.length; )
            this.values[o++] = s.values[l++], this.strings[o] = s.strings[l];
          this.strings[o] += a;
        } else
          this.values[o++] = s, this.strings[o] = a;
      }
    }
    get sql() {
      let r = this.strings.length, t2 = 1, n = this.strings[0];
      for (;t2 < r; )
        n += `?${this.strings[t2++]}`;
      return n;
    }
    get statement() {
      let r = this.strings.length, t2 = 1, n = this.strings[0];
      for (;t2 < r; )
        n += `:${t2}${this.strings[t2++]}`;
      return n;
    }
    get text() {
      let r = this.strings.length, t2 = 1, n = this.strings[0];
      for (;t2 < r; )
        n += `$${t2}${this.strings[t2++]}`;
      return n;
    }
    inspect() {
      return { sql: this.sql, statement: this.statement, text: this.text, values: this.values };
    }
  };
  function _a(e, r = ",", t2 = "", n = "") {
    if (e.length === 0)
      throw new TypeError("Expected `join([])` to be called with an array of multiple elements, but got an empty array");
    return new oe([t2, ...Array(e.length - 1).fill(r), n], e);
  }
  function eo(e) {
    return new oe([e], []);
  }
  var Na = eo("");
  function ro(e, ...r) {
    return new oe(e, r);
  }
  function wt(e) {
    return { getKeys() {
      return Object.keys(e);
    }, getPropertyValue(r) {
      return e[r];
    } };
  }
  function re(e, r) {
    return { getKeys() {
      return [e];
    }, getPropertyValue() {
      return r();
    } };
  }
  function ar(e) {
    let r = new Pe;
    return { getKeys() {
      return e.getKeys();
    }, getPropertyValue(t2) {
      return r.getOrCreate(t2, () => e.getPropertyValue(t2));
    }, getPropertyDescriptor(t2) {
      return e.getPropertyDescriptor?.(t2);
    } };
  }
  var Fn = { enumerable: true, configurable: true, writable: true };
  function Ln(e) {
    let r = new Set(e);
    return { getPrototypeOf: () => Object.prototype, getOwnPropertyDescriptor: () => Fn, has: (t2, n) => r.has(n), set: (t2, n, i) => r.add(n) && Reflect.set(t2, n, i), ownKeys: () => [...r] };
  }
  var Fa = Symbol.for("nodejs.util.inspect.custom");
  function he(e, r) {
    let t2 = lm(r), n = new Set, i = new Proxy(e, { get(o, s) {
      if (n.has(s))
        return o[s];
      let a = t2.get(s);
      return a ? a.getPropertyValue(s) : o[s];
    }, has(o, s) {
      if (n.has(s))
        return true;
      let a = t2.get(s);
      return a ? a.has?.(s) ?? true : Reflect.has(o, s);
    }, ownKeys(o) {
      let s = La(Reflect.ownKeys(o), t2), a = La(Array.from(t2.keys()), t2);
      return [...new Set([...s, ...a, ...n])];
    }, set(o, s, a) {
      return t2.get(s)?.getPropertyDescriptor?.(s)?.writable === false ? false : (n.add(s), Reflect.set(o, s, a));
    }, getOwnPropertyDescriptor(o, s) {
      let a = Reflect.getOwnPropertyDescriptor(o, s);
      if (a && !a.configurable)
        return a;
      let l = t2.get(s);
      return l ? l.getPropertyDescriptor ? { ...Fn, ...l?.getPropertyDescriptor(s) } : Fn : a;
    }, defineProperty(o, s, a) {
      return n.add(s), Reflect.defineProperty(o, s, a);
    }, getPrototypeOf: () => Object.prototype });
    return i[Fa] = function() {
      let o = { ...this };
      return delete o[Fa], o;
    }, i;
  }
  function lm(e) {
    let r = new Map;
    for (let t2 of e) {
      let n = t2.getKeys();
      for (let i of n)
        r.set(i, t2);
    }
    return r;
  }
  function La(e, r) {
    return e.filter((t2) => r.get(t2)?.has?.(t2) ?? true);
  }
  function Lr(e) {
    return { getKeys() {
      return e;
    }, has() {
      return false;
    }, getPropertyValue() {} };
  }
  function Mr(e, r) {
    return { batch: e, transaction: r?.kind === "batch" ? { isolationLevel: r.options.isolationLevel } : undefined };
  }
  function Ma(e) {
    if (e === undefined)
      return "";
    let r = _r(e);
    return new Ar(0, { colors: vn }).write(r).toString();
  }
  var um = "P2037";
  function $r({ error: e, user_facing_error: r }, t2, n) {
    return r.error_code ? new z2(cm(r, n), { code: r.error_code, clientVersion: t2, meta: r.meta, batchRequestIdx: r.batch_request_idx }) : new j(e, { clientVersion: t2, batchRequestIdx: r.batch_request_idx });
  }
  function cm(e, r) {
    let t2 = e.message;
    return (r === "postgresql" || r === "postgres" || r === "mysql") && e.error_code === um && (t2 += `
Prisma Accelerate has built-in connection pooling to prevent such errors: https://pris.ly/client/error-accelerate`), t2;
  }
  var xt = "<unknown>";
  function $a(e) {
    var r = e.split(`
`);
    return r.reduce(function(t2, n) {
      var i = mm(n) || gm(n) || bm(n) || vm(n) || wm(n);
      return i && t2.push(i), t2;
    }, []);
  }
  var pm = /^\s*at (.*?) ?\(((?:file|https?|blob|chrome-extension|native|eval|webpack|rsc|<anonymous>|\/|[a-z]:\\|\\\\).*?)(?::(\d+))?(?::(\d+))?\)?\s*$/i;
  var dm = /\((\S*)(?::(\d+))(?::(\d+))\)/;
  function mm(e) {
    var r = pm.exec(e);
    if (!r)
      return null;
    var t2 = r[2] && r[2].indexOf("native") === 0, n = r[2] && r[2].indexOf("eval") === 0, i = dm.exec(r[2]);
    return n && i != null && (r[2] = i[1], r[3] = i[2], r[4] = i[3]), { file: t2 ? null : r[2], methodName: r[1] || xt, arguments: t2 ? [r[2]] : [], lineNumber: r[3] ? +r[3] : null, column: r[4] ? +r[4] : null };
  }
  var fm = /^\s*at (?:((?:\[object object\])?.+) )?\(?((?:file|ms-appx|https?|webpack|rsc|blob):.*?):(\d+)(?::(\d+))?\)?\s*$/i;
  function gm(e) {
    var r = fm.exec(e);
    return r ? { file: r[2], methodName: r[1] || xt, arguments: [], lineNumber: +r[3], column: r[4] ? +r[4] : null } : null;
  }
  var hm = /^\s*(.*?)(?:\((.*?)\))?(?:^|@)((?:file|https?|blob|chrome|webpack|rsc|resource|\[native).*?|[^@]*bundle)(?::(\d+))?(?::(\d+))?\s*$/i;
  var ym = /(\S+) line (\d+)(?: > eval line \d+)* > eval/i;
  function bm(e) {
    var r = hm.exec(e);
    if (!r)
      return null;
    var t2 = r[3] && r[3].indexOf(" > eval") > -1, n = ym.exec(r[3]);
    return t2 && n != null && (r[3] = n[1], r[4] = n[2], r[5] = null), { file: r[3], methodName: r[1] || xt, arguments: r[2] ? r[2].split(",") : [], lineNumber: r[4] ? +r[4] : null, column: r[5] ? +r[5] : null };
  }
  var Em = /^\s*(?:([^@]*)(?:\((.*?)\))?@)?(\S.*?):(\d+)(?::(\d+))?\s*$/i;
  function wm(e) {
    var r = Em.exec(e);
    return r ? { file: r[3], methodName: r[1] || xt, arguments: [], lineNumber: +r[4], column: r[5] ? +r[5] : null } : null;
  }
  var xm = /^\s*at (?:((?:\[object object\])?[^\\/]+(?: \[as \S+\])?) )?\(?(.*?):(\d+)(?::(\d+))?\)?\s*$/i;
  function vm(e) {
    var r = xm.exec(e);
    return r ? { file: r[2], methodName: r[1] || xt, arguments: [], lineNumber: +r[3], column: r[4] ? +r[4] : null } : null;
  }
  var to = class {
    getLocation() {
      return null;
    }
  };
  var no = class {
    _error;
    constructor() {
      this._error = new Error;
    }
    getLocation() {
      let r = this._error.stack;
      if (!r)
        return null;
      let n = $a(r).find((i) => {
        if (!i.file)
          return false;
        let o = Oi(i.file);
        return o !== "<anonymous>" && !o.includes("@prisma") && !o.includes("/packages/client/src/runtime/") && !o.endsWith("/runtime/binary.js") && !o.endsWith("/runtime/library.js") && !o.endsWith("/runtime/edge.js") && !o.endsWith("/runtime/edge-esm.js") && !o.startsWith("internal/") && !i.methodName.includes("new ") && !i.methodName.includes("getCallSite") && !i.methodName.includes("Proxy.") && i.methodName.split(".").length < 4;
      });
      return !n || !n.file ? null : { fileName: n.file, lineNumber: n.lineNumber, columnNumber: n.column };
    }
  };
  function Ze(e) {
    return e === "minimal" ? typeof $EnabledCallSite == "function" && e !== "minimal" ? new $EnabledCallSite : new to : new no;
  }
  var qa = { _avg: true, _count: true, _sum: true, _min: true, _max: true };
  function qr(e = {}) {
    let r = Tm(e);
    return Object.entries(r).reduce((n, [i, o]) => (qa[i] !== undefined ? n.select[i] = { select: o } : n[i] = o, n), { select: {} });
  }
  function Tm(e = {}) {
    return typeof e._count == "boolean" ? { ...e, _count: { _all: e._count } } : e;
  }
  function Mn(e = {}) {
    return (r) => (typeof e._count == "boolean" && (r._count = r._count._all), r);
  }
  function ja(e, r) {
    let t2 = Mn(e);
    return r({ action: "aggregate", unpacker: t2, argsMapper: qr })(e);
  }
  function Sm(e = {}) {
    let { select: r, ...t2 } = e;
    return typeof r == "object" ? qr({ ...t2, _count: r }) : qr({ ...t2, _count: { _all: true } });
  }
  function Rm(e = {}) {
    return typeof e.select == "object" ? (r) => Mn(e)(r)._count : (r) => Mn(e)(r)._count._all;
  }
  function Va(e, r) {
    return r({ action: "count", unpacker: Rm(e), argsMapper: Sm })(e);
  }
  function Cm(e = {}) {
    let r = qr(e);
    if (Array.isArray(r.by))
      for (let t2 of r.by)
        typeof t2 == "string" && (r.select[t2] = true);
    else
      typeof r.by == "string" && (r.select[r.by] = true);
    return r;
  }
  function Am(e = {}) {
    return (r) => (typeof e?._count == "boolean" && r.forEach((t2) => {
      t2._count = t2._count._all;
    }), r);
  }
  function Ba(e, r) {
    return r({ action: "groupBy", unpacker: Am(e), argsMapper: Cm })(e);
  }
  function Ua(e, r, t2) {
    if (r === "aggregate")
      return (n) => ja(n, t2);
    if (r === "count")
      return (n) => Va(n, t2);
    if (r === "groupBy")
      return (n) => Ba(n, t2);
  }
  function Qa(e, r) {
    let t2 = r.fields.filter((i) => !i.relationName), n = Ys(t2, "name");
    return new Proxy({}, { get(i, o) {
      if (o in i || typeof o == "symbol")
        return i[o];
      let s = n[o];
      if (s)
        return new dt(e, o, s.type, s.isList, s.kind === "enum");
    }, ...Ln(Object.keys(n)) });
  }
  var Ga = (e) => Array.isArray(e) ? e : e.split(".");
  var io = (e, r) => Ga(r).reduce((t2, n) => t2 && t2[n], e);
  var Wa = (e, r, t2) => Ga(r).reduceRight((n, i, o, s) => Object.assign({}, io(e, s.slice(0, o)), { [i]: n }), t2);
  function Im(e, r) {
    return e === undefined || r === undefined ? [] : [...r, "select", e];
  }
  function km(e, r, t2) {
    return r === undefined ? e ?? {} : Wa(r, t2, e || true);
  }
  function oo(e, r, t2, n, i, o) {
    let a = e._runtimeDataModel.models[r].fields.reduce((l, u) => ({ ...l, [u.name]: u }), {});
    return (l) => {
      let u = Ze(e._errorFormat), c = Im(n, i), p = km(l, o, c), d = t2({ dataPath: c, callsite: u })(p), f = Om(e, r);
      return new Proxy(d, { get(g, h) {
        if (!f.includes(h))
          return g[h];
        let P = [a[h].type, t2, h], S = [c, p];
        return oo(e, ...P, ...S);
      }, ...Ln([...f, ...Object.getOwnPropertyNames(d)]) });
    };
  }
  function Om(e, r) {
    return e._runtimeDataModel.models[r].fields.filter((t2) => t2.kind === "object").map((t2) => t2.name);
  }
  var Dm = ["findUnique", "findUniqueOrThrow", "findFirst", "findFirstOrThrow", "create", "update", "upsert", "delete"];
  var _m = ["aggregate", "count", "groupBy"];
  function so(e, r) {
    let t2 = e._extensions.getAllModelExtensions(r) ?? {}, n = [Nm(e, r), Lm(e, r), wt(t2), re("name", () => r), re("$name", () => r), re("$parent", () => e._appliedParent)];
    return he({}, n);
  }
  function Nm(e, r) {
    let t2 = Se(r), n = Object.keys(Cr).concat("count");
    return { getKeys() {
      return n;
    }, getPropertyValue(i) {
      let o = i, s = (a) => (l) => {
        let u = Ze(e._errorFormat);
        return e._createPrismaPromise((c) => {
          let p = { args: l, dataPath: [], action: o, model: r, clientMethod: `${t2}.${i}`, jsModelName: t2, transaction: c, callsite: u };
          return e._request({ ...p, ...a });
        }, { action: o, args: l, model: r });
      };
      return Dm.includes(o) ? oo(e, r, s) : Fm(i) ? Ua(e, i, s) : s({});
    } };
  }
  function Fm(e) {
    return _m.includes(e);
  }
  function Lm(e, r) {
    return ar(re("fields", () => {
      let t2 = e._runtimeDataModel.models[r];
      return Qa(r, t2);
    }));
  }
  function Ja(e) {
    return e.replace(/^./, (r) => r.toUpperCase());
  }
  var ao = Symbol();
  function vt(e) {
    let r = [Mm(e), $m(e), re(ao, () => e), re("$parent", () => e._appliedParent)], t2 = e._extensions.getAllClientExtensions();
    return t2 && r.push(wt(t2)), he(e, r);
  }
  function Mm(e) {
    let r = Object.getPrototypeOf(e._originalClient), t2 = [...new Set(Object.getOwnPropertyNames(r))];
    return { getKeys() {
      return t2;
    }, getPropertyValue(n) {
      return e[n];
    } };
  }
  function $m(e) {
    let r = Object.keys(e._runtimeDataModel.models), t2 = r.map(Se), n = [...new Set(r.concat(t2))];
    return ar({ getKeys() {
      return n;
    }, getPropertyValue(i) {
      let o = Ja(i);
      if (e._runtimeDataModel.models[o] !== undefined)
        return so(e, o);
      if (e._runtimeDataModel.models[i] !== undefined)
        return so(e, i);
    }, getPropertyDescriptor(i) {
      if (!t2.includes(i))
        return { enumerable: false };
    } });
  }
  function Ha(e) {
    return e[ao] ? e[ao] : e;
  }
  function Ka(e) {
    if (typeof e == "function")
      return e(this);
    if (e.client?.__AccelerateEngine) {
      let t2 = e.client.__AccelerateEngine;
      this._originalClient._engine = new t2(this._originalClient._accelerateEngineConfig);
    }
    let r = Object.create(this._originalClient, { _extensions: { value: this._extensions.append(e) }, _appliedParent: { value: this, configurable: true }, $use: { value: undefined }, $on: { value: undefined } });
    return vt(r);
  }
  function Ya({ result: e, modelName: r, select: t2, omit: n, extensions: i }) {
    let o = i.getAllComputedFields(r);
    if (!o)
      return e;
    let s = [], a = [];
    for (let l of Object.values(o)) {
      if (n) {
        if (n[l.name])
          continue;
        let u = l.needs.filter((c) => n[c]);
        u.length > 0 && a.push(Lr(u));
      } else if (t2) {
        if (!t2[l.name])
          continue;
        let u = l.needs.filter((c) => !t2[c]);
        u.length > 0 && a.push(Lr(u));
      }
      qm(e, l.needs) && s.push(jm(l, he(e, s)));
    }
    return s.length > 0 || a.length > 0 ? he(e, [...s, ...a]) : e;
  }
  function qm(e, r) {
    return r.every((t2) => Mi(e, t2));
  }
  function jm(e, r) {
    return ar(re(e.name, () => e.compute(r)));
  }
  function $n({ visitor: e, result: r, args: t2, runtimeDataModel: n, modelName: i }) {
    if (Array.isArray(r)) {
      for (let s = 0;s < r.length; s++)
        r[s] = $n({ result: r[s], args: t2, modelName: i, runtimeDataModel: n, visitor: e });
      return r;
    }
    let o = e(r, i, t2) ?? r;
    return t2.include && za({ includeOrSelect: t2.include, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), t2.select && za({ includeOrSelect: t2.select, result: o, parentModelName: i, runtimeDataModel: n, visitor: e }), o;
  }
  function za({ includeOrSelect: e, result: r, parentModelName: t2, runtimeDataModel: n, visitor: i }) {
    for (let [o, s] of Object.entries(e)) {
      if (!s || r[o] == null || Re(s))
        continue;
      let l = n.models[t2].fields.find((c) => c.name === o);
      if (!l || l.kind !== "object" || !l.relationName)
        continue;
      let u = typeof s == "object" ? s : {};
      r[o] = $n({ visitor: i, result: r[o], args: u, modelName: l.type, runtimeDataModel: n });
    }
  }
  function Za({ result: e, modelName: r, args: t2, extensions: n, runtimeDataModel: i, globalOmit: o }) {
    return n.isEmpty() || e == null || typeof e != "object" || !i.models[r] ? e : $n({ result: e, args: t2 ?? {}, modelName: r, runtimeDataModel: i, visitor: (a, l, u) => {
      let c = Se(l);
      return Ya({ result: a, modelName: c, select: u.select, omit: u.select ? undefined : { ...o?.[c], ...u.omit }, extensions: n });
    } });
  }
  var Vm = ["$connect", "$disconnect", "$on", "$transaction", "$use", "$extends"];
  var Xa = Vm;
  function el(e) {
    if (e instanceof oe)
      return Bm(e);
    if (Nn(e))
      return Um(e);
    if (Array.isArray(e)) {
      let t2 = [e[0]];
      for (let n = 1;n < e.length; n++)
        t2[n] = Pt(e[n]);
      return t2;
    }
    let r = {};
    for (let t2 in e)
      r[t2] = Pt(e[t2]);
    return r;
  }
  function Bm(e) {
    return new oe(e.strings, e.values);
  }
  function Um(e) {
    return new Et(e.sql, e.values);
  }
  function Pt(e) {
    if (typeof e != "object" || e == null || e instanceof Le || Dr(e))
      return e;
    if (Rr(e))
      return new ve(e.toFixed());
    if (Sr(e))
      return new Date(+e);
    if (ArrayBuffer.isView(e))
      return e.slice(0);
    if (Array.isArray(e)) {
      let r = e.length, t2;
      for (t2 = Array(r);r--; )
        t2[r] = Pt(e[r]);
      return t2;
    }
    if (typeof e == "object") {
      let r = {};
      for (let t2 in e)
        t2 === "__proto__" ? Object.defineProperty(r, t2, { value: Pt(e[t2]), configurable: true, enumerable: true, writable: true }) : r[t2] = Pt(e[t2]);
      return r;
    }
    _e(e, "Unknown value");
  }
  function tl(e, r, t2, n = 0) {
    return e._createPrismaPromise((i) => {
      let o = r.customDataProxyFetch;
      return "transaction" in r && i !== undefined && (r.transaction?.kind === "batch" && r.transaction.lock.then(), r.transaction = i), n === t2.length ? e._executeRequest(r) : t2[n]({ model: r.model, operation: r.model ? r.action : r.clientMethod, args: el(r.args ?? {}), __internalParams: r, query: (s, a = r) => {
        let l = a.customDataProxyFetch;
        return a.customDataProxyFetch = sl(o, l), a.args = s, tl(e, a, t2, n + 1);
      } });
    });
  }
  function nl(e, r) {
    let { jsModelName: t2, action: n, clientMethod: i } = r, o = t2 ? n : i;
    if (e._extensions.isEmpty())
      return e._executeRequest(r);
    let s = e._extensions.getAllQueryCallbacks(t2 ?? "$none", o);
    return tl(e, r, s);
  }
  function il(e) {
    return (r) => {
      let t2 = { requests: r }, n = r[0].extensions.getAllBatchQueryCallbacks();
      return n.length ? ol(t2, n, 0, e) : e(t2);
    };
  }
  function ol(e, r, t2, n) {
    if (t2 === r.length)
      return n(e);
    let i = e.customDataProxyFetch, o = e.requests[0].transaction;
    return r[t2]({ args: { queries: e.requests.map((s) => ({ model: s.modelName, operation: s.action, args: s.args })), transaction: o ? { isolationLevel: o.kind === "batch" ? o.isolationLevel : undefined } : undefined }, __internalParams: e, query(s, a = e) {
      let l = a.customDataProxyFetch;
      return a.customDataProxyFetch = sl(i, l), ol(a, r, t2 + 1, n);
    } });
  }
  var rl = (e) => e;
  function sl(e = rl, r = rl) {
    return (t2) => e(r(t2));
  }
  var al = N("prisma:client");
  var ll = { Vercel: "vercel", "Netlify CI": "netlify" };
  function ul({ postinstall: e, ciName: r, clientVersion: t2 }) {
    if (al("checkPlatformCaching:postinstall", e), al("checkPlatformCaching:ciName", r), e === true && r && r in ll) {
      let n = `Prisma has detected that this project was built on ${r}, which caches dependencies. This leads to an outdated Prisma Client because Prisma's auto-generation isn't triggered. To fix this, make sure to run the \`prisma generate\` command during the build process.

Learn how: https://pris.ly/d/${ll[r]}-build`;
      throw console.error(n), new T(n, t2);
    }
  }
  function cl(e, r) {
    return e ? e.datasources ? e.datasources : e.datasourceUrl ? { [r[0]]: { url: e.datasourceUrl } } : {} : {};
  }
  var Qm = () => globalThis.process?.release?.name === "node";
  var Gm = () => !!globalThis.Bun || !!globalThis.process?.versions?.bun;
  var Wm = () => !!globalThis.Deno;
  var Jm = () => typeof globalThis.Netlify == "object";
  var Hm = () => typeof globalThis.EdgeRuntime == "object";
  var Km = () => globalThis.navigator?.userAgent === "Cloudflare-Workers";
  function Ym() {
    return [[Jm, "netlify"], [Hm, "edge-light"], [Km, "workerd"], [Wm, "deno"], [Gm, "bun"], [Qm, "node"]].flatMap((t2) => t2[0]() ? [t2[1]] : []).at(0) ?? "";
  }
  var zm = { node: "Node.js", workerd: "Cloudflare Workers", deno: "Deno and Deno Deploy", netlify: "Netlify Edge Functions", "edge-light": "Edge Runtime (Vercel Edge Functions, Vercel Edge Middleware, Next.js (Pages Router) Edge API Routes, Next.js (App Router) Edge Route Handlers or Next.js Middleware)" };
  function qn() {
    let e = Ym();
    return { id: e, prettyName: zm[e] || e, isEdge: ["workerd", "deno", "netlify", "edge-light"].includes(e) };
  }
  var gl = k(__require("node:fs"));
  var Tt = k(__require("node:path"));
  function jn(e) {
    let { runtimeBinaryTarget: r } = e;
    return `Add "${r}" to \`binaryTargets\` in the "schema.prisma" file and run \`prisma generate\` after saving it:

${Zm(e)}`;
  }
  function Zm(e) {
    let { generator: r, generatorBinaryTargets: t2, runtimeBinaryTarget: n } = e, i = { fromEnvVar: null, value: n }, o = [...t2, i];
    return Ai({ ...r, binaryTargets: o });
  }
  function Xe(e) {
    let { runtimeBinaryTarget: r } = e;
    return `Prisma Client could not locate the Query Engine for runtime "${r}".`;
  }
  function er(e) {
    let { searchedLocations: r } = e;
    return `The following locations have been searched:
${[...new Set(r)].map((i) => `  ${i}`).join(`
`)}`;
  }
  function pl(e) {
    let { runtimeBinaryTarget: r } = e;
    return `${Xe(e)}

This happened because \`binaryTargets\` have been pinned, but the actual deployment also required "${r}".
${jn(e)}

${er(e)}`;
  }
  function Vn(e) {
    return `We would appreciate if you could take the time to share some information with us.
Please help us by answering a few questions: https://pris.ly/${e}`;
  }
  function Bn(e) {
    let { errorStack: r } = e;
    return r?.match(/\/\.next|\/next@|\/next\//) ? `

We detected that you are using Next.js, learn how to fix this: https://pris.ly/d/engine-not-found-nextjs.` : "";
  }
  function dl(e) {
    let { queryEngineName: r } = e;
    return `${Xe(e)}${Bn(e)}

This is likely caused by a bundler that has not copied "${r}" next to the resulting bundle.
Ensure that "${r}" has been copied next to the bundle or in "${e.expectedLocation}".

${Vn("engine-not-found-bundler-investigation")}

${er(e)}`;
  }
  function ml(e) {
    let { runtimeBinaryTarget: r, generatorBinaryTargets: t2 } = e, n = t2.find((i) => i.native);
    return `${Xe(e)}

This happened because Prisma Client was generated for "${n?.value ?? "unknown"}", but the actual deployment required "${r}".
${jn(e)}

${er(e)}`;
  }
  function fl(e) {
    let { queryEngineName: r } = e;
    return `${Xe(e)}${Bn(e)}

This is likely caused by tooling that has not copied "${r}" to the deployment folder.
Ensure that you ran \`prisma generate\` and that "${r}" has been copied to "${e.expectedLocation}".

${Vn("engine-not-found-tooling-investigation")}

${er(e)}`;
  }
  var Xm = N("prisma:client:engines:resolveEnginePath");
  var ef = () => new RegExp("runtime[\\\\/]library\\.m?js$");
  async function hl(e, r) {
    let t2 = { binary: process.env.PRISMA_QUERY_ENGINE_BINARY, library: process.env.PRISMA_QUERY_ENGINE_LIBRARY }[e] ?? r.prismaPath;
    if (t2 !== undefined)
      return t2;
    let { enginePath: n, searchedLocations: i } = await rf(e, r);
    if (Xm("enginePath", n), n !== undefined && e === "binary" && vi(n), n !== undefined)
      return r.prismaPath = n;
    let o = await ir(), s = r.generator?.binaryTargets ?? [], a = s.some((d) => d.native), l = !s.some((d) => d.value === o), u = __filename.match(ef()) === null, c = { searchedLocations: i, generatorBinaryTargets: s, generator: r.generator, runtimeBinaryTarget: o, queryEngineName: yl(e, o), expectedLocation: Tt.default.relative(process.cwd(), r.dirname), errorStack: new Error().stack }, p;
    throw a && l ? p = ml(c) : l ? p = pl(c) : u ? p = dl(c) : p = fl(c), new T(p, r.clientVersion);
  }
  async function rf(e, r) {
    let t2 = await ir(), n = [], i = [r.dirname, Tt.default.resolve(__dirname, ".."), r.generator?.output?.value ?? __dirname, Tt.default.resolve(__dirname, "../../../.prisma/client"), "/tmp/prisma-engines", r.cwd];
    __filename.includes("resolveEnginePath") && i.push(fs());
    for (let o of i) {
      let s = yl(e, t2), a = Tt.default.join(o, s);
      if (n.push(o), gl.default.existsSync(a))
        return { enginePath: a, searchedLocations: n };
    }
    return { enginePath: undefined, searchedLocations: n };
  }
  function yl(e, r) {
    return e === "library" ? Bt(r, "fs") : `query-engine-${r}${r === "windows" ? ".exe" : ""}`;
  }
  var lo = k(ki());
  function bl(e) {
    return e ? e.replace(/".*"/g, '"X"').replace(/[\s:\[]([+-]?([0-9]*[.])?[0-9]+)/g, (r) => `${r[0]}5`) : "";
  }
  function El(e) {
    return e.split(`
`).map((r) => r.replace(/^\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z)\s*/, "").replace(/\+\d+\s*ms$/, "")).join(`
`);
  }
  var wl = k(Ns());
  function xl({ title: e, user: r = "prisma", repo: t2 = "prisma", template: n = "bug_report.yml", body: i }) {
    return (0, wl.default)({ user: r, repo: t2, template: n, title: e, body: i });
  }
  function vl({ version: e, binaryTarget: r, title: t2, description: n, engineVersion: i, database: o, query: s }) {
    let a = Qo(6000 - (s?.length ?? 0)), l = El((0, lo.default)(a)), u = n ? `# Description
\`\`\`
${n}
\`\`\`` : "", c = (0, lo.default)(`Hi Prisma Team! My Prisma Client just crashed. This is the report:
## Versions

| Name            | Version            |
|-----------------|--------------------|
| Node            | ${process.version?.padEnd(19)}| 
| OS              | ${r?.padEnd(19)}|
| Prisma Client   | ${e?.padEnd(19)}|
| Query Engine    | ${i?.padEnd(19)}|
| Database        | ${o?.padEnd(19)}|

${u}

## Logs
\`\`\`
${l}
\`\`\`

## Client Snippet
\`\`\`ts
// PLEASE FILL YOUR CODE SNIPPET HERE
\`\`\`

## Schema
\`\`\`prisma
// PLEASE ADD YOUR SCHEMA HERE IF POSSIBLE
\`\`\`

## Prisma Engine Query
\`\`\`
${s ? bl(s) : ""}
\`\`\`
`), p = xl({ title: t2, body: c });
    return `${t2}

This is a non-recoverable error which probably happens when the Prisma Query Engine has a panic.

${Y(p)}

If you want the Prisma team to look into it, please open the link above \uD83D\uDE4F
To increase the chance of success, please post your schema and a snippet of
how you used Prisma Client in the issue. 
`;
  }
  function uo(e) {
    return e.name === "DriverAdapterError" && typeof e.cause == "object";
  }
  function Un(e) {
    return { ok: true, value: e, map(r) {
      return Un(r(e));
    }, flatMap(r) {
      return r(e);
    } };
  }
  function lr(e) {
    return { ok: false, error: e, map() {
      return lr(e);
    }, flatMap() {
      return lr(e);
    } };
  }
  var Pl = N("driver-adapter-utils");
  var co = class {
    registeredErrors = [];
    consumeError(r) {
      return this.registeredErrors[r];
    }
    registerNewError(r) {
      let t2 = 0;
      for (;this.registeredErrors[t2] !== undefined; )
        t2++;
      return this.registeredErrors[t2] = { error: r }, t2;
    }
  };
  var po = (e, r = new co) => {
    let t2 = { adapterName: e.adapterName, errorRegistry: r, queryRaw: Me(r, e.queryRaw.bind(e)), executeRaw: Me(r, e.executeRaw.bind(e)), executeScript: Me(r, e.executeScript.bind(e)), dispose: Me(r, e.dispose.bind(e)), provider: e.provider, startTransaction: async (...n) => (await Me(r, e.startTransaction.bind(e))(...n)).map((o) => tf(r, o)) };
    return e.getConnectionInfo && (t2.getConnectionInfo = nf(r, e.getConnectionInfo.bind(e))), t2;
  };
  var tf = (e, r) => ({ adapterName: r.adapterName, provider: r.provider, options: r.options, queryRaw: Me(e, r.queryRaw.bind(r)), executeRaw: Me(e, r.executeRaw.bind(r)), commit: Me(e, r.commit.bind(r)), rollback: Me(e, r.rollback.bind(r)) });
  function Me(e, r) {
    return async (...t2) => {
      try {
        return Un(await r(...t2));
      } catch (n) {
        if (Pl("[error@wrapAsync]", n), uo(n))
          return lr(n.cause);
        let i = e.registerNewError(n);
        return lr({ kind: "GenericJs", id: i });
      }
    };
  }
  function nf(e, r) {
    return (...t2) => {
      try {
        return Un(r(...t2));
      } catch (n) {
        if (Pl("[error@wrapSync]", n), uo(n))
          return lr(n.cause);
        let i = e.registerNewError(n);
        return lr({ kind: "GenericJs", id: i });
      }
    };
  }
  function jr({ inlineDatasources: e, overrideDatasources: r, env: t2, clientVersion: n }) {
    let i, o = Object.keys(e)[0], s = e[o]?.url, a = r[o]?.url;
    if (o === undefined ? i = undefined : a ? i = a : s?.value ? i = s.value : s?.fromEnvVar && (i = t2[s.fromEnvVar]), s?.fromEnvVar !== undefined && i === undefined)
      throw new T(`error: Environment variable not found: ${s.fromEnvVar}.`, n);
    if (i === undefined)
      throw new T("error: Missing URL environment variable, value, or override.", n);
    return i;
  }
  var Qn = class extends Error {
    clientVersion;
    cause;
    constructor(r, t2) {
      super(r), this.clientVersion = t2.clientVersion, this.cause = t2.cause;
    }
    get [Symbol.toStringTag]() {
      return this.name;
    }
  };
  var se = class extends Qn {
    isRetryable;
    constructor(r, t2) {
      super(r, t2), this.isRetryable = t2.isRetryable ?? true;
    }
  };
  function R(e, r) {
    return { ...e, isRetryable: r };
  }
  var Vr = class extends se {
    name = "ForcedRetryError";
    code = "P5001";
    constructor(r) {
      super("This request must be retried", R(r, true));
    }
  };
  x(Vr, "ForcedRetryError");
  var ur = class extends se {
    name = "InvalidDatasourceError";
    code = "P6001";
    constructor(r, t2) {
      super(r, R(t2, false));
    }
  };
  x(ur, "InvalidDatasourceError");
  var cr = class extends se {
    name = "NotImplementedYetError";
    code = "P5004";
    constructor(r, t2) {
      super(r, R(t2, false));
    }
  };
  x(cr, "NotImplementedYetError");
  var $ = class extends se {
    response;
    constructor(r, t2) {
      super(r, t2), this.response = t2.response;
      let n = this.response.headers.get("prisma-request-id");
      if (n) {
        let i = `(The request id was: ${n})`;
        this.message = this.message + " " + i;
      }
    }
  };
  var pr = class extends $ {
    name = "SchemaMissingError";
    code = "P5005";
    constructor(r) {
      super("Schema needs to be uploaded", R(r, true));
    }
  };
  x(pr, "SchemaMissingError");
  var mo = "This request could not be understood by the server";
  var St = class extends $ {
    name = "BadRequestError";
    code = "P5000";
    constructor(r, t2, n) {
      super(t2 || mo, R(r, false)), n && (this.code = n);
    }
  };
  x(St, "BadRequestError");
  var Rt = class extends $ {
    name = "HealthcheckTimeoutError";
    code = "P5013";
    logs;
    constructor(r, t2) {
      super("Engine not started: healthcheck timeout", R(r, true)), this.logs = t2;
    }
  };
  x(Rt, "HealthcheckTimeoutError");
  var Ct = class extends $ {
    name = "EngineStartupError";
    code = "P5014";
    logs;
    constructor(r, t2, n) {
      super(t2, R(r, true)), this.logs = n;
    }
  };
  x(Ct, "EngineStartupError");
  var At = class extends $ {
    name = "EngineVersionNotSupportedError";
    code = "P5012";
    constructor(r) {
      super("Engine version is not supported", R(r, false));
    }
  };
  x(At, "EngineVersionNotSupportedError");
  var fo = "Request timed out";
  var It = class extends $ {
    name = "GatewayTimeoutError";
    code = "P5009";
    constructor(r, t2 = fo) {
      super(t2, R(r, false));
    }
  };
  x(It, "GatewayTimeoutError");
  var of = "Interactive transaction error";
  var kt = class extends $ {
    name = "InteractiveTransactionError";
    code = "P5015";
    constructor(r, t2 = of) {
      super(t2, R(r, false));
    }
  };
  x(kt, "InteractiveTransactionError");
  var sf = "Request parameters are invalid";
  var Ot = class extends $ {
    name = "InvalidRequestError";
    code = "P5011";
    constructor(r, t2 = sf) {
      super(t2, R(r, false));
    }
  };
  x(Ot, "InvalidRequestError");
  var go = "Requested resource does not exist";
  var Dt = class extends $ {
    name = "NotFoundError";
    code = "P5003";
    constructor(r, t2 = go) {
      super(t2, R(r, false));
    }
  };
  x(Dt, "NotFoundError");
  var ho = "Unknown server error";
  var Br = class extends $ {
    name = "ServerError";
    code = "P5006";
    logs;
    constructor(r, t2, n) {
      super(t2 || ho, R(r, true)), this.logs = n;
    }
  };
  x(Br, "ServerError");
  var yo = "Unauthorized, check your connection string";
  var _t = class extends $ {
    name = "UnauthorizedError";
    code = "P5007";
    constructor(r, t2 = yo) {
      super(t2, R(r, false));
    }
  };
  x(_t, "UnauthorizedError");
  var bo = "Usage exceeded, retry again later";
  var Nt = class extends $ {
    name = "UsageExceededError";
    code = "P5008";
    constructor(r, t2 = bo) {
      super(t2, R(r, true));
    }
  };
  x(Nt, "UsageExceededError");
  async function af(e) {
    let r;
    try {
      r = await e.text();
    } catch {
      return { type: "EmptyError" };
    }
    try {
      let t2 = JSON.parse(r);
      if (typeof t2 == "string")
        switch (t2) {
          case "InternalDataProxyError":
            return { type: "DataProxyError", body: t2 };
          default:
            return { type: "UnknownTextError", body: t2 };
        }
      if (typeof t2 == "object" && t2 !== null) {
        if ("is_panic" in t2 && "message" in t2 && "error_code" in t2)
          return { type: "QueryEngineError", body: t2 };
        if ("EngineNotStarted" in t2 || "InteractiveTransactionMisrouted" in t2 || "InvalidRequestError" in t2) {
          let n = Object.values(t2)[0].reason;
          return typeof n == "string" && !["SchemaMissing", "EngineVersionNotSupported"].includes(n) ? { type: "UnknownJsonError", body: t2 } : { type: "DataProxyError", body: t2 };
        }
      }
      return { type: "UnknownJsonError", body: t2 };
    } catch {
      return r === "" ? { type: "EmptyError" } : { type: "UnknownTextError", body: r };
    }
  }
  async function Ft(e, r) {
    if (e.ok)
      return;
    let t2 = { clientVersion: r, response: e }, n = await af(e);
    if (n.type === "QueryEngineError")
      throw new z2(n.body.message, { code: n.body.error_code, clientVersion: r });
    if (n.type === "DataProxyError") {
      if (n.body === "InternalDataProxyError")
        throw new Br(t2, "Internal Data Proxy error");
      if ("EngineNotStarted" in n.body) {
        if (n.body.EngineNotStarted.reason === "SchemaMissing")
          return new pr(t2);
        if (n.body.EngineNotStarted.reason === "EngineVersionNotSupported")
          throw new At(t2);
        if ("EngineStartupError" in n.body.EngineNotStarted.reason) {
          let { msg: i, logs: o } = n.body.EngineNotStarted.reason.EngineStartupError;
          throw new Ct(t2, i, o);
        }
        if ("KnownEngineStartupError" in n.body.EngineNotStarted.reason) {
          let { msg: i, error_code: o } = n.body.EngineNotStarted.reason.KnownEngineStartupError;
          throw new T(i, r, o);
        }
        if ("HealthcheckTimeout" in n.body.EngineNotStarted.reason) {
          let { logs: i } = n.body.EngineNotStarted.reason.HealthcheckTimeout;
          throw new Rt(t2, i);
        }
      }
      if ("InteractiveTransactionMisrouted" in n.body) {
        let i = { IDParseError: "Could not parse interactive transaction ID", NoQueryEngineFoundError: "Could not find Query Engine for the specified host and transaction ID", TransactionStartError: "Could not start interactive transaction" };
        throw new kt(t2, i[n.body.InteractiveTransactionMisrouted.reason]);
      }
      if ("InvalidRequestError" in n.body)
        throw new Ot(t2, n.body.InvalidRequestError.reason);
    }
    if (e.status === 401 || e.status === 403)
      throw new _t(t2, Ur(yo, n));
    if (e.status === 404)
      return new Dt(t2, Ur(go, n));
    if (e.status === 429)
      throw new Nt(t2, Ur(bo, n));
    if (e.status === 504)
      throw new It(t2, Ur(fo, n));
    if (e.status >= 500)
      throw new Br(t2, Ur(ho, n));
    if (e.status >= 400)
      throw new St(t2, Ur(mo, n));
  }
  function Ur(e, r) {
    return r.type === "EmptyError" ? e : `${e}: ${JSON.stringify(r)}`;
  }
  function Tl(e) {
    let r = Math.pow(2, e) * 50, t2 = Math.ceil(Math.random() * r) - Math.ceil(r / 2), n = r + t2;
    return new Promise((i) => setTimeout(() => i(n), n));
  }
  var $e = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";
  function Sl(e) {
    let r = new TextEncoder().encode(e), t2 = "", n = r.byteLength, i = n % 3, o = n - i, s, a, l, u, c;
    for (let p = 0;p < o; p = p + 3)
      c = r[p] << 16 | r[p + 1] << 8 | r[p + 2], s = (c & 16515072) >> 18, a = (c & 258048) >> 12, l = (c & 4032) >> 6, u = c & 63, t2 += $e[s] + $e[a] + $e[l] + $e[u];
    return i == 1 ? (c = r[o], s = (c & 252) >> 2, a = (c & 3) << 4, t2 += $e[s] + $e[a] + "==") : i == 2 && (c = r[o] << 8 | r[o + 1], s = (c & 64512) >> 10, a = (c & 1008) >> 4, l = (c & 15) << 2, t2 += $e[s] + $e[a] + $e[l] + "="), t2;
  }
  function Rl(e) {
    if (!!e.generator?.previewFeatures.some((t2) => t2.toLowerCase().includes("metrics")))
      throw new T("The `metrics` preview feature is not yet available with Accelerate.\nPlease remove `metrics` from the `previewFeatures` in your schema.\n\nMore information about Accelerate: https://pris.ly/d/accelerate", e.clientVersion);
  }
  function lf(e) {
    return e[0] * 1000 + e[1] / 1e6;
  }
  function Eo(e) {
    return new Date(lf(e));
  }
  var Cl = { "@prisma/debug": "workspace:*", "@prisma/engines-version": "6.7.0-36.3cff47a7f5d65c3ea74883f1d736e41d68ce91ed", "@prisma/fetch-engine": "workspace:*", "@prisma/get-platform": "workspace:*" };
  var Lt = class extends se {
    name = "RequestError";
    code = "P5010";
    constructor(r, t2) {
      super(`Cannot fetch data from service:
${r}`, R(t2, true));
    }
  };
  x(Lt, "RequestError");
  async function dr(e, r, t2 = (n) => n) {
    let { clientVersion: n, ...i } = r, o = t2(fetch);
    try {
      return await o(e, i);
    } catch (s) {
      let a = s.message ?? "Unknown error";
      throw new Lt(a, { clientVersion: n, cause: s });
    }
  }
  var cf = /^[1-9][0-9]*\.[0-9]+\.[0-9]+$/;
  var Al = N("prisma:client:dataproxyEngine");
  async function pf(e, r) {
    let t2 = Cl["@prisma/engines-version"], n = r.clientVersion ?? "unknown";
    if (process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION)
      return process.env.PRISMA_CLIENT_DATA_PROXY_CLIENT_VERSION;
    if (e.includes("accelerate") && n !== "0.0.0" && n !== "in-memory")
      return n;
    let [i, o] = n?.split("-") ?? [];
    if (o === undefined && cf.test(i))
      return i;
    if (o !== undefined || n === "0.0.0" || n === "in-memory") {
      if (e.startsWith("localhost") || e.startsWith("127.0.0.1"))
        return "0.0.0";
      let [s] = t2.split("-") ?? [], [a, l, u] = s.split("."), c = df(`<=${a}.${l}.${u}`), p = await dr(c, { clientVersion: n });
      if (!p.ok)
        throw new Error(`Failed to fetch stable Prisma version, unpkg.com status ${p.status} ${p.statusText}, response body: ${await p.text() || "<empty body>"}`);
      let d = await p.text();
      Al("length of body fetched from unpkg.com", d.length);
      let f;
      try {
        f = JSON.parse(d);
      } catch (g) {
        throw console.error("JSON.parse error: body fetched from unpkg.com: ", d), g;
      }
      return f.version;
    }
    throw new cr("Only `major.minor.patch` versions are supported by Accelerate.", { clientVersion: n });
  }
  async function Il(e, r) {
    let t2 = await pf(e, r);
    return Al("version", t2), t2;
  }
  function df(e) {
    return encodeURI(`https://unpkg.com/prisma@${e}/package.json`);
  }
  var kl = 3;
  var Gn = N("prisma:client:dataproxyEngine");
  var wo = class {
    apiKey;
    tracingHelper;
    logLevel;
    logQueries;
    engineHash;
    constructor({ apiKey: r, tracingHelper: t2, logLevel: n, logQueries: i, engineHash: o }) {
      this.apiKey = r, this.tracingHelper = t2, this.logLevel = n, this.logQueries = i, this.engineHash = o;
    }
    build({ traceparent: r, interactiveTransaction: t2 } = {}) {
      let n = { Authorization: `Bearer ${this.apiKey}`, "Prisma-Engine-Hash": this.engineHash };
      this.tracingHelper.isEnabled() && (n.traceparent = r ?? this.tracingHelper.getTraceParent()), t2 && (n["X-transaction-id"] = t2.id);
      let i = this.buildCaptureSettings();
      return i.length > 0 && (n["X-capture-telemetry"] = i.join(", ")), n;
    }
    buildCaptureSettings() {
      let r = [];
      return this.tracingHelper.isEnabled() && r.push("tracing"), this.logLevel && r.push(this.logLevel), this.logQueries && r.push("query"), r;
    }
  };
  var Mt = class {
    name = "DataProxyEngine";
    inlineSchema;
    inlineSchemaHash;
    inlineDatasources;
    config;
    logEmitter;
    env;
    clientVersion;
    engineHash;
    tracingHelper;
    remoteClientVersion;
    host;
    headerBuilder;
    startPromise;
    constructor(r) {
      Rl(r), this.config = r, this.env = { ...r.env, ...typeof process < "u" ? process.env : {} }, this.inlineSchema = Sl(r.inlineSchema), this.inlineDatasources = r.inlineDatasources, this.inlineSchemaHash = r.inlineSchemaHash, this.clientVersion = r.clientVersion, this.engineHash = r.engineVersion, this.logEmitter = r.logEmitter, this.tracingHelper = r.tracingHelper;
    }
    apiKey() {
      return this.headerBuilder.apiKey;
    }
    version() {
      return this.engineHash;
    }
    async start() {
      this.startPromise !== undefined && await this.startPromise, this.startPromise = (async () => {
        let [r, t2] = this.extractHostAndApiKey();
        this.host = r, this.headerBuilder = new wo({ apiKey: t2, tracingHelper: this.tracingHelper, logLevel: this.config.logLevel, logQueries: this.config.logQueries, engineHash: this.engineHash }), this.remoteClientVersion = await Il(r, this.config), Gn("host", this.host);
      })(), await this.startPromise;
    }
    async stop() {}
    propagateResponseExtensions(r) {
      r?.logs?.length && r.logs.forEach((t2) => {
        switch (t2.level) {
          case "debug":
          case "trace":
            Gn(t2);
            break;
          case "error":
          case "warn":
          case "info": {
            this.logEmitter.emit(t2.level, { timestamp: Eo(t2.timestamp), message: t2.attributes.message ?? "", target: t2.target });
            break;
          }
          case "query": {
            this.logEmitter.emit("query", { query: t2.attributes.query ?? "", timestamp: Eo(t2.timestamp), duration: t2.attributes.duration_ms ?? 0, params: t2.attributes.params ?? "", target: t2.target });
            break;
          }
          default:
            t2.level;
        }
      }), r?.traces?.length && this.tracingHelper.dispatchEngineSpans(r.traces);
    }
    onBeforeExit() {
      throw new Error('"beforeExit" hook is not applicable to the remote query engine');
    }
    async url(r) {
      return await this.start(), `https://${this.host}/${this.remoteClientVersion}/${this.inlineSchemaHash}/${r}`;
    }
    async uploadSchema() {
      let r = { name: "schemaUpload", internal: true };
      return this.tracingHelper.runInChildSpan(r, async () => {
        let t2 = await dr(await this.url("schema"), { method: "PUT", headers: this.headerBuilder.build(), body: this.inlineSchema, clientVersion: this.clientVersion });
        t2.ok || Gn("schema response status", t2.status);
        let n = await Ft(t2, this.clientVersion);
        if (n)
          throw this.logEmitter.emit("warn", { message: `Error while uploading schema: ${n.message}`, timestamp: new Date, target: "" }), n;
        this.logEmitter.emit("info", { message: `Schema (re)uploaded (hash: ${this.inlineSchemaHash})`, timestamp: new Date, target: "" });
      });
    }
    request(r, { traceparent: t2, interactiveTransaction: n, customDataProxyFetch: i }) {
      return this.requestInternal({ body: r, traceparent: t2, interactiveTransaction: n, customDataProxyFetch: i });
    }
    async requestBatch(r, { traceparent: t2, transaction: n, customDataProxyFetch: i }) {
      let o = n?.kind === "itx" ? n.options : undefined, s = Mr(r, n);
      return (await this.requestInternal({ body: s, customDataProxyFetch: i, interactiveTransaction: o, traceparent: t2 })).map((l) => (l.extensions && this.propagateResponseExtensions(l.extensions), ("errors" in l) ? this.convertProtocolErrorsToClientError(l.errors) : l));
    }
    requestInternal({ body: r, traceparent: t2, customDataProxyFetch: n, interactiveTransaction: i }) {
      return this.withRetry({ actionGerund: "querying", callback: async ({ logHttpCall: o }) => {
        let s = i ? `${i.payload.endpoint}/graphql` : await this.url("graphql");
        o(s);
        let a = await dr(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: t2, interactiveTransaction: i }), body: JSON.stringify(r), clientVersion: this.clientVersion }, n);
        a.ok || Gn("graphql response status", a.status), await this.handleError(await Ft(a, this.clientVersion));
        let l = await a.json();
        if (l.extensions && this.propagateResponseExtensions(l.extensions), "errors" in l)
          throw this.convertProtocolErrorsToClientError(l.errors);
        return "batchResult" in l ? l.batchResult : l;
      } });
    }
    async transaction(r, t2, n) {
      let i = { start: "starting", commit: "committing", rollback: "rolling back" };
      return this.withRetry({ actionGerund: `${i[r]} transaction`, callback: async ({ logHttpCall: o }) => {
        if (r === "start") {
          let s = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel }), a = await this.url("transaction/start");
          o(a);
          let l = await dr(a, { method: "POST", headers: this.headerBuilder.build({ traceparent: t2.traceparent }), body: s, clientVersion: this.clientVersion });
          await this.handleError(await Ft(l, this.clientVersion));
          let u = await l.json(), { extensions: c } = u;
          c && this.propagateResponseExtensions(c);
          let p = u.id, d = u["data-proxy"].endpoint;
          return { id: p, payload: { endpoint: d } };
        } else {
          let s = `${n.payload.endpoint}/${r}`;
          o(s);
          let a = await dr(s, { method: "POST", headers: this.headerBuilder.build({ traceparent: t2.traceparent }), clientVersion: this.clientVersion });
          await this.handleError(await Ft(a, this.clientVersion));
          let l = await a.json(), { extensions: u } = l;
          u && this.propagateResponseExtensions(u);
          return;
        }
      } });
    }
    extractHostAndApiKey() {
      let r = { clientVersion: this.clientVersion }, t2 = Object.keys(this.inlineDatasources)[0], n = jr({ inlineDatasources: this.inlineDatasources, overrideDatasources: this.config.overrideDatasources, clientVersion: this.clientVersion, env: this.env }), i;
      try {
        i = new URL(n);
      } catch {
        throw new ur(`Error validating datasource \`${t2}\`: the URL must start with the protocol \`prisma://\``, r);
      }
      let { protocol: o, host: s, searchParams: a } = i;
      if (o !== "prisma:" && o !== en)
        throw new ur(`Error validating datasource \`${t2}\`: the URL must start with the protocol \`prisma://\``, r);
      let l = a.get("api_key");
      if (l === null || l.length < 1)
        throw new ur(`Error validating datasource \`${t2}\`: the URL must contain a valid API key`, r);
      return [s, l];
    }
    metrics() {
      throw new cr("Metrics are not yet supported for Accelerate", { clientVersion: this.clientVersion });
    }
    async withRetry(r) {
      for (let t2 = 0;; t2++) {
        let n = (i) => {
          this.logEmitter.emit("info", { message: `Calling ${i} (n=${t2})`, timestamp: new Date, target: "" });
        };
        try {
          return await r.callback({ logHttpCall: n });
        } catch (i) {
          if (!(i instanceof se) || !i.isRetryable)
            throw i;
          if (t2 >= kl)
            throw i instanceof Vr ? i.cause : i;
          this.logEmitter.emit("warn", { message: `Attempt ${t2 + 1}/${kl} failed for ${r.actionGerund}: ${i.message ?? "(unknown)"}`, timestamp: new Date, target: "" });
          let o = await Tl(t2);
          this.logEmitter.emit("warn", { message: `Retrying after ${o}ms`, timestamp: new Date, target: "" });
        }
      }
    }
    async handleError(r) {
      if (r instanceof pr)
        throw await this.uploadSchema(), new Vr({ clientVersion: this.clientVersion, cause: r });
      if (r)
        throw r;
    }
    convertProtocolErrorsToClientError(r) {
      return r.length === 1 ? $r(r[0], this.config.clientVersion, this.config.activeProvider) : new j(JSON.stringify(r), { clientVersion: this.config.clientVersion });
    }
    applyPendingMigrations() {
      throw new Error("Method not implemented.");
    }
  };
  function Ol(e) {
    if (e?.kind === "itx")
      return e.options.id;
  }
  var vo = k(__require("node:os"));
  var Dl = k(__require("node:path"));
  var xo = Symbol("PrismaLibraryEngineCache");
  function mf() {
    let e = globalThis;
    return e[xo] === undefined && (e[xo] = {}), e[xo];
  }
  function ff(e) {
    let r = mf();
    if (r[e] !== undefined)
      return r[e];
    let t2 = Dl.default.toNamespacedPath(e), n = { exports: {} }, i = 0;
    return process.platform !== "win32" && (i = vo.default.constants.dlopen.RTLD_LAZY | vo.default.constants.dlopen.RTLD_DEEPBIND), process.dlopen(n, t2, i), r[e] = n.exports, n.exports;
  }
  var _l = { async loadLibrary(e) {
    let r = await pi(), t2 = await hl("library", e);
    try {
      return e.tracingHelper.runInChildSpan({ name: "loadLibrary", internal: true }, () => ff(t2));
    } catch (n) {
      let i = Pi({ e: n, platformInfo: r, id: t2 });
      throw new T(i, e.clientVersion);
    }
  } };
  var Po;
  var Nl = { async loadLibrary(e) {
    let { clientVersion: r, adapter: t2, engineWasm: n } = e;
    if (t2 === undefined)
      throw new T(`The \`adapter\` option for \`PrismaClient\` is required in this context (${qn().prettyName})`, r);
    if (n === undefined)
      throw new T("WASM engine was unexpectedly `undefined`", r);
    Po === undefined && (Po = (async () => {
      let o = await n.getRuntime(), s = await n.getQueryEngineWasmModule();
      if (s == null)
        throw new T("The loaded wasm module was unexpectedly `undefined` or `null` once loaded", r);
      let a = { "./query_engine_bg.js": o }, l = new WebAssembly.Instance(s, a), u = l.exports.__wbindgen_start;
      return o.__wbg_set_wasm(l.exports), u(), o.QueryEngine;
    })());
    let i = await Po;
    return { debugPanic() {
      return Promise.reject("{}");
    }, dmmf() {
      return Promise.resolve("{}");
    }, version() {
      return { commit: "unknown", version: "unknown" };
    }, QueryEngine: i };
  } };
  var gf = "P2036";
  var Ce = N("prisma:client:libraryEngine");
  function hf(e) {
    return e.item_type === "query" && "query" in e;
  }
  function yf(e) {
    return "level" in e ? e.level === "error" && e.message === "PANIC" : false;
  }
  var Fl = [...oi, "native"];
  var bf = 0xffffffffffffffffn;
  var To = 1n;
  function Ef() {
    let e = To++;
    return To > bf && (To = 1n), e;
  }
  var Qr = class {
    name = "LibraryEngine";
    engine;
    libraryInstantiationPromise;
    libraryStartingPromise;
    libraryStoppingPromise;
    libraryStarted;
    executingQueryPromise;
    config;
    QueryEngineConstructor;
    libraryLoader;
    library;
    logEmitter;
    libQueryEnginePath;
    binaryTarget;
    datasourceOverrides;
    datamodel;
    logQueries;
    logLevel;
    lastQuery;
    loggerRustPanic;
    tracingHelper;
    adapterPromise;
    versionInfo;
    constructor(r, t2) {
      this.libraryLoader = t2 ?? _l, r.engineWasm !== undefined && (this.libraryLoader = t2 ?? Nl), this.config = r, this.libraryStarted = false, this.logQueries = r.logQueries ?? false, this.logLevel = r.logLevel ?? "error", this.logEmitter = r.logEmitter, this.datamodel = r.inlineSchema, this.tracingHelper = r.tracingHelper, r.enableDebugLogs && (this.logLevel = "debug");
      let n = Object.keys(r.overrideDatasources)[0], i = r.overrideDatasources[n]?.url;
      n !== undefined && i !== undefined && (this.datasourceOverrides = { [n]: i }), this.libraryInstantiationPromise = this.instantiateLibrary();
    }
    wrapEngine(r) {
      return { applyPendingMigrations: r.applyPendingMigrations?.bind(r), commitTransaction: this.withRequestId(r.commitTransaction.bind(r)), connect: this.withRequestId(r.connect.bind(r)), disconnect: this.withRequestId(r.disconnect.bind(r)), metrics: r.metrics?.bind(r), query: this.withRequestId(r.query.bind(r)), rollbackTransaction: this.withRequestId(r.rollbackTransaction.bind(r)), sdlSchema: r.sdlSchema?.bind(r), startTransaction: this.withRequestId(r.startTransaction.bind(r)), trace: r.trace.bind(r) };
    }
    withRequestId(r) {
      return async (...t2) => {
        let n = Ef().toString();
        try {
          return await r(...t2, n);
        } finally {
          if (this.tracingHelper.isEnabled()) {
            let i = await this.engine?.trace(n);
            if (i) {
              let o = JSON.parse(i);
              this.tracingHelper.dispatchEngineSpans(o.spans);
            }
          }
        }
      };
    }
    async applyPendingMigrations() {
      throw new Error("Cannot call this method from this type of engine instance");
    }
    async transaction(r, t2, n) {
      await this.start();
      let i = await this.adapterPromise, o = JSON.stringify(t2), s;
      if (r === "start") {
        let l = JSON.stringify({ max_wait: n.maxWait, timeout: n.timeout, isolation_level: n.isolationLevel });
        s = await this.engine?.startTransaction(l, o);
      } else
        r === "commit" ? s = await this.engine?.commitTransaction(n.id, o) : r === "rollback" && (s = await this.engine?.rollbackTransaction(n.id, o));
      let a = this.parseEngineResponse(s);
      if (wf(a)) {
        let l = this.getExternalAdapterError(a, i?.errorRegistry);
        throw l ? l.error : new z2(a.message, { code: a.error_code, clientVersion: this.config.clientVersion, meta: a.meta });
      } else if (typeof a.message == "string")
        throw new j(a.message, { clientVersion: this.config.clientVersion });
      return a;
    }
    async instantiateLibrary() {
      if (Ce("internalSetup"), this.libraryInstantiationPromise)
        return this.libraryInstantiationPromise;
      ii(), this.binaryTarget = await this.getCurrentBinaryTarget(), await this.tracingHelper.runInChildSpan("load_engine", () => this.loadEngine()), this.version();
    }
    async getCurrentBinaryTarget() {
      {
        if (this.binaryTarget)
          return this.binaryTarget;
        let r = await this.tracingHelper.runInChildSpan("detect_platform", () => ir());
        if (!Fl.includes(r))
          throw new T(`Unknown ${ce("PRISMA_QUERY_ENGINE_LIBRARY")} ${ce(W(r))}. Possible binaryTargets: ${qe(Fl.join(", "))} or a path to the query engine library.
You may have to run ${qe("prisma generate")} for your changes to take effect.`, this.config.clientVersion);
        return r;
      }
    }
    parseEngineResponse(r) {
      if (!r)
        throw new j("Response from the Engine was empty", { clientVersion: this.config.clientVersion });
      try {
        return JSON.parse(r);
      } catch {
        throw new j("Unable to JSON.parse response from engine", { clientVersion: this.config.clientVersion });
      }
    }
    async loadEngine() {
      if (!this.engine) {
        this.QueryEngineConstructor || (this.library = await this.libraryLoader.loadLibrary(this.config), this.QueryEngineConstructor = this.library.QueryEngine);
        try {
          let r = new WeakRef(this);
          this.adapterPromise || (this.adapterPromise = this.config.adapter?.connect()?.then(po));
          let t2 = await this.adapterPromise;
          t2 && Ce("Using driver adapter: %O", t2), this.engine = this.wrapEngine(new this.QueryEngineConstructor({ datamodel: this.datamodel, env: process.env, logQueries: this.config.logQueries ?? false, ignoreEnvVarErrors: true, datasourceOverrides: this.datasourceOverrides ?? {}, logLevel: this.logLevel, configDir: this.config.cwd, engineProtocol: "json", enableTracing: this.tracingHelper.isEnabled() }, (n) => {
            r.deref()?.logger(n);
          }, t2));
        } catch (r) {
          let t2 = r, n = this.parseInitError(t2.message);
          throw typeof n == "string" ? t2 : new T(n.message, this.config.clientVersion, n.error_code);
        }
      }
    }
    logger(r) {
      let t2 = this.parseEngineResponse(r);
      t2 && (t2.level = t2?.level.toLowerCase() ?? "unknown", hf(t2) ? this.logEmitter.emit("query", { timestamp: new Date, query: t2.query, params: t2.params, duration: Number(t2.duration_ms), target: t2.module_path }) : yf(t2) ? this.loggerRustPanic = new le(So(this, `${t2.message}: ${t2.reason} in ${t2.file}:${t2.line}:${t2.column}`), this.config.clientVersion) : this.logEmitter.emit(t2.level, { timestamp: new Date, message: t2.message, target: t2.module_path }));
    }
    parseInitError(r) {
      try {
        return JSON.parse(r);
      } catch {}
      return r;
    }
    parseRequestError(r) {
      try {
        return JSON.parse(r);
      } catch {}
      return r;
    }
    onBeforeExit() {
      throw new Error('"beforeExit" hook is not applicable to the library engine since Prisma 5.0.0, it is only relevant and implemented for the binary engine. Please add your event listener to the `process` object directly instead.');
    }
    async start() {
      if (await this.libraryInstantiationPromise, await this.libraryStoppingPromise, this.libraryStartingPromise)
        return Ce(`library already starting, this.libraryStarted: ${this.libraryStarted}`), this.libraryStartingPromise;
      if (this.libraryStarted)
        return;
      let r = async () => {
        Ce("library starting");
        try {
          let t2 = { traceparent: this.tracingHelper.getTraceParent() };
          await this.engine?.connect(JSON.stringify(t2)), this.libraryStarted = true, Ce("library started");
        } catch (t2) {
          let n = this.parseInitError(t2.message);
          throw typeof n == "string" ? t2 : new T(n.message, this.config.clientVersion, n.error_code);
        } finally {
          this.libraryStartingPromise = undefined;
        }
      };
      return this.libraryStartingPromise = this.tracingHelper.runInChildSpan("connect", r), this.libraryStartingPromise;
    }
    async stop() {
      if (await this.libraryInstantiationPromise, await this.libraryStartingPromise, await this.executingQueryPromise, this.libraryStoppingPromise)
        return Ce("library is already stopping"), this.libraryStoppingPromise;
      if (!this.libraryStarted)
        return;
      let r = async () => {
        await new Promise((n) => setTimeout(n, 5)), Ce("library stopping");
        let t2 = { traceparent: this.tracingHelper.getTraceParent() };
        await this.engine?.disconnect(JSON.stringify(t2)), this.libraryStarted = false, this.libraryStoppingPromise = undefined, await (await this.adapterPromise)?.dispose(), this.adapterPromise = undefined, Ce("library stopped");
      };
      return this.libraryStoppingPromise = this.tracingHelper.runInChildSpan("disconnect", r), this.libraryStoppingPromise;
    }
    version() {
      return this.versionInfo = this.library?.version(), this.versionInfo?.version ?? "unknown";
    }
    debugPanic(r) {
      return this.library?.debugPanic(r);
    }
    async request(r, { traceparent: t2, interactiveTransaction: n }) {
      Ce(`sending request, this.libraryStarted: ${this.libraryStarted}`);
      let i = JSON.stringify({ traceparent: t2 }), o = JSON.stringify(r);
      try {
        await this.start();
        let s = await this.adapterPromise;
        this.executingQueryPromise = this.engine?.query(o, i, n?.id), this.lastQuery = o;
        let a = this.parseEngineResponse(await this.executingQueryPromise);
        if (a.errors)
          throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], s?.errorRegistry) : new j(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
        if (this.loggerRustPanic)
          throw this.loggerRustPanic;
        return { data: a };
      } catch (s) {
        if (s instanceof T)
          throw s;
        if (s.code === "GenericFailure" && s.message?.startsWith("PANIC:"))
          throw new le(So(this, s.message), this.config.clientVersion);
        let a = this.parseRequestError(s.message);
        throw typeof a == "string" ? s : new j(`${a.message}
${a.backtrace}`, { clientVersion: this.config.clientVersion });
      }
    }
    async requestBatch(r, { transaction: t2, traceparent: n }) {
      Ce("requestBatch");
      let i = Mr(r, t2);
      await this.start();
      let o = await this.adapterPromise;
      this.lastQuery = JSON.stringify(i), this.executingQueryPromise = this.engine.query(this.lastQuery, JSON.stringify({ traceparent: n }), Ol(t2));
      let s = await this.executingQueryPromise, a = this.parseEngineResponse(s);
      if (a.errors)
        throw a.errors.length === 1 ? this.buildQueryError(a.errors[0], o?.errorRegistry) : new j(JSON.stringify(a.errors), { clientVersion: this.config.clientVersion });
      let { batchResult: l, errors: u } = a;
      if (Array.isArray(l))
        return l.map((c) => c.errors && c.errors.length > 0 ? this.loggerRustPanic ?? this.buildQueryError(c.errors[0], o?.errorRegistry) : { data: c });
      throw u && u.length === 1 ? new Error(u[0].error) : new Error(JSON.stringify(a));
    }
    buildQueryError(r, t2) {
      if (r.user_facing_error.is_panic)
        return new le(So(this, r.user_facing_error.message), this.config.clientVersion);
      let n = this.getExternalAdapterError(r.user_facing_error, t2);
      return n ? n.error : $r(r, this.config.clientVersion, this.config.activeProvider);
    }
    getExternalAdapterError(r, t2) {
      if (r.error_code === gf && t2) {
        let n = r.meta?.id;
        rn(typeof n == "number", "Malformed external JS error received from the engine");
        let i = t2.consumeError(n);
        return rn(i, "External error with reported id was not registered"), i;
      }
    }
    async metrics(r) {
      await this.start();
      let t2 = await this.engine.metrics(JSON.stringify(r));
      return r.format === "prometheus" ? t2 : this.parseEngineResponse(t2);
    }
  };
  function wf(e) {
    return typeof e == "object" && e !== null && e.error_code !== undefined;
  }
  function So(e, r) {
    return vl({ binaryTarget: e.binaryTarget, title: r, version: e.config.clientVersion, engineVersion: e.versionInfo?.commit, database: e.config.activeProvider, query: e.lastQuery });
  }
  function Ll({ copyEngine: e = true }, r) {
    let t2;
    try {
      t2 = jr({ inlineDatasources: r.inlineDatasources, overrideDatasources: r.overrideDatasources, env: { ...r.env, ...process.env }, clientVersion: r.clientVersion });
    } catch {}
    let n = !!(t2?.startsWith("prisma://") || Si(t2));
    e && n && ot("recommend--no-engine", "In production, we recommend using `prisma generate --no-engine` (See: `prisma generate --help`)");
    let i = Er(r.generator), o = n || !e, s = !!r.adapter, a = i === "library", l = i === "binary", u = i === "client";
    if (o && s || s && false) {
      let c;
      throw e ? t2?.startsWith("prisma://") ? c = ["Prisma Client was configured to use the `adapter` option but the URL was a `prisma://` URL.", "Please either use the `prisma://` URL or remove the `adapter` from the Prisma Client constructor."] : c = ["Prisma Client was configured to use both the `adapter` and Accelerate, please chose one."] : c = ["Prisma Client was configured to use the `adapter` option but `prisma generate` was run with `--no-engine`.", "Please run `prisma generate` without `--no-engine` to be able to use Prisma Client with the adapter."], new Z(c.join(`
`), { clientVersion: r.clientVersion });
    }
    return o ? new Mt(r) : a ? new Qr(r) : new Qr(r);
  }
  function Wn({ generator: e }) {
    return e?.previewFeatures ?? [];
  }
  var Ml = (e) => ({ command: e });
  var $l = (e) => e.strings.reduce((r, t2, n) => `${r}@P${n}${t2}`);
  function Gr(e) {
    try {
      return ql(e, "fast");
    } catch {
      return ql(e, "slow");
    }
  }
  function ql(e, r) {
    return JSON.stringify(e.map((t2) => Vl(t2, r)));
  }
  function Vl(e, r) {
    if (Array.isArray(e))
      return e.map((t2) => Vl(t2, r));
    if (typeof e == "bigint")
      return { prisma__type: "bigint", prisma__value: e.toString() };
    if (Sr(e))
      return { prisma__type: "date", prisma__value: e.toJSON() };
    if (ve.isDecimal(e))
      return { prisma__type: "decimal", prisma__value: e.toJSON() };
    if (Buffer.isBuffer(e))
      return { prisma__type: "bytes", prisma__value: e.toString("base64") };
    if (xf(e))
      return { prisma__type: "bytes", prisma__value: Buffer.from(e).toString("base64") };
    if (ArrayBuffer.isView(e)) {
      let { buffer: t2, byteOffset: n, byteLength: i } = e;
      return { prisma__type: "bytes", prisma__value: Buffer.from(t2, n, i).toString("base64") };
    }
    return typeof e == "object" && r === "slow" ? Bl(e) : e;
  }
  function xf(e) {
    return e instanceof ArrayBuffer || e instanceof SharedArrayBuffer ? true : typeof e == "object" && e !== null ? e[Symbol.toStringTag] === "ArrayBuffer" || e[Symbol.toStringTag] === "SharedArrayBuffer" : false;
  }
  function Bl(e) {
    if (typeof e != "object" || e === null)
      return e;
    if (typeof e.toJSON == "function")
      return e.toJSON();
    if (Array.isArray(e))
      return e.map(jl);
    let r = {};
    for (let t2 of Object.keys(e))
      r[t2] = jl(e[t2]);
    return r;
  }
  function jl(e) {
    return typeof e == "bigint" ? e.toString() : Bl(e);
  }
  var vf = /^(\s*alter\s)/i;
  var Ul = N("prisma:client");
  function Ro(e, r, t2, n) {
    if (!(e !== "postgresql" && e !== "cockroachdb") && t2.length > 0 && vf.exec(r))
      throw new Error(`Running ALTER using ${n} is not supported
Using the example below you can still execute your query with Prisma, but please note that it is vulnerable to SQL injection attacks and requires you to take care of input sanitization.

Example:
  await prisma.$executeRawUnsafe(\`ALTER USER prisma WITH PASSWORD '\${password}'\`)

More Information: https://pris.ly/d/execute-raw
`);
  }
  var Co = ({ clientMethod: e, activeProvider: r }) => (t2) => {
    let n = "", i;
    if (Nn(t2))
      n = t2.sql, i = { values: Gr(t2.values), __prismaRawParameters__: true };
    else if (Array.isArray(t2)) {
      let [o, ...s] = t2;
      n = o, i = { values: Gr(s || []), __prismaRawParameters__: true };
    } else
      switch (r) {
        case "sqlite":
        case "mysql": {
          n = t2.sql, i = { values: Gr(t2.values), __prismaRawParameters__: true };
          break;
        }
        case "cockroachdb":
        case "postgresql":
        case "postgres": {
          n = t2.text, i = { values: Gr(t2.values), __prismaRawParameters__: true };
          break;
        }
        case "sqlserver": {
          n = $l(t2), i = { values: Gr(t2.values), __prismaRawParameters__: true };
          break;
        }
        default:
          throw new Error(`The ${r} provider does not support ${e}`);
      }
    return i?.values ? Ul(`prisma.${e}(${n}, ${i.values})`) : Ul(`prisma.${e}(${n})`), { query: n, parameters: i };
  };
  var Ql = { requestArgsToMiddlewareArgs(e) {
    return [e.strings, ...e.values];
  }, middlewareArgsToRequestArgs(e) {
    let [r, ...t2] = e;
    return new oe(r, t2);
  } };
  var Gl = { requestArgsToMiddlewareArgs(e) {
    return [e];
  }, middlewareArgsToRequestArgs(e) {
    return e[0];
  } };
  function Ao(e) {
    return function(t2, n) {
      let i, o = (s = e) => {
        try {
          return s === undefined || s?.kind === "itx" ? i ??= Wl(t2(s)) : Wl(t2(s));
        } catch (a) {
          return Promise.reject(a);
        }
      };
      return { get spec() {
        return n;
      }, then(s, a) {
        return o().then(s, a);
      }, catch(s) {
        return o().catch(s);
      }, finally(s) {
        return o().finally(s);
      }, requestTransaction(s) {
        let a = o(s);
        return a.requestTransaction ? a.requestTransaction(s) : a;
      }, [Symbol.toStringTag]: "PrismaPromise" };
    };
  }
  function Wl(e) {
    return typeof e.then == "function" ? e : Promise.resolve(e);
  }
  var Pf = bi.split(".")[0];
  var Tf = { isEnabled() {
    return false;
  }, getTraceParent() {
    return "00-10-10-00";
  }, dispatchEngineSpans() {}, getActiveContext() {}, runInChildSpan(e, r) {
    return r();
  } };
  var Io = class {
    isEnabled() {
      return this.getGlobalTracingHelper().isEnabled();
    }
    getTraceParent(r) {
      return this.getGlobalTracingHelper().getTraceParent(r);
    }
    dispatchEngineSpans(r) {
      return this.getGlobalTracingHelper().dispatchEngineSpans(r);
    }
    getActiveContext() {
      return this.getGlobalTracingHelper().getActiveContext();
    }
    runInChildSpan(r, t2) {
      return this.getGlobalTracingHelper().runInChildSpan(r, t2);
    }
    getGlobalTracingHelper() {
      let r = globalThis[`V${Pf}_PRISMA_INSTRUMENTATION`], t2 = globalThis.PRISMA_INSTRUMENTATION;
      return r?.helper ?? t2?.helper ?? Tf;
    }
  };
  function Jl() {
    return new Io;
  }
  function Hl(e, r = () => {}) {
    let t2, n = new Promise((i) => t2 = i);
    return { then(i) {
      return --e === 0 && t2(r()), i?.(n);
    } };
  }
  function Kl(e) {
    return typeof e == "string" ? e : e.reduce((r, t2) => {
      let n = typeof t2 == "string" ? t2 : t2.level;
      return n === "query" ? r : r && (t2 === "info" || r === "info") ? "info" : n;
    }, undefined);
  }
  var Jn = class {
    _middlewares = [];
    use(r) {
      this._middlewares.push(r);
    }
    get(r) {
      return this._middlewares[r];
    }
    has(r) {
      return !!this._middlewares[r];
    }
    length() {
      return this._middlewares.length;
    }
  };
  var zl = k(ki());
  function Hn(e) {
    return typeof e.batchRequestIdx == "number";
  }
  function Yl(e) {
    if (e.action !== "findUnique" && e.action !== "findUniqueOrThrow")
      return;
    let r = [];
    return e.modelName && r.push(e.modelName), e.query.arguments && r.push(ko(e.query.arguments)), r.push(ko(e.query.selection)), r.join("");
  }
  function ko(e) {
    return `(${Object.keys(e).sort().map((t2) => {
      let n = e[t2];
      return typeof n == "object" && n !== null ? `(${t2} ${ko(n)})` : t2;
    }).join(" ")})`;
  }
  var Sf = { aggregate: false, aggregateRaw: false, createMany: true, createManyAndReturn: true, createOne: true, deleteMany: true, deleteOne: true, executeRaw: true, findFirst: false, findFirstOrThrow: false, findMany: false, findRaw: false, findUnique: false, findUniqueOrThrow: false, groupBy: false, queryRaw: false, runCommandRaw: true, updateMany: true, updateManyAndReturn: true, updateOne: true, upsertOne: true };
  function Oo(e) {
    return Sf[e];
  }
  var Kn = class {
    constructor(r) {
      this.options = r;
      this.batches = {};
    }
    batches;
    tickActive = false;
    request(r) {
      let t2 = this.options.batchBy(r);
      return t2 ? (this.batches[t2] || (this.batches[t2] = [], this.tickActive || (this.tickActive = true, process.nextTick(() => {
        this.dispatchBatches(), this.tickActive = false;
      }))), new Promise((n, i) => {
        this.batches[t2].push({ request: r, resolve: n, reject: i });
      })) : this.options.singleLoader(r);
    }
    dispatchBatches() {
      for (let r in this.batches) {
        let t2 = this.batches[r];
        delete this.batches[r], t2.length === 1 ? this.options.singleLoader(t2[0].request).then((n) => {
          n instanceof Error ? t2[0].reject(n) : t2[0].resolve(n);
        }).catch((n) => {
          t2[0].reject(n);
        }) : (t2.sort((n, i) => this.options.batchOrder(n.request, i.request)), this.options.batchLoader(t2.map((n) => n.request)).then((n) => {
          if (n instanceof Error)
            for (let i = 0;i < t2.length; i++)
              t2[i].reject(n);
          else
            for (let i = 0;i < t2.length; i++) {
              let o = n[i];
              o instanceof Error ? t2[i].reject(o) : t2[i].resolve(o);
            }
        }).catch((n) => {
          for (let i = 0;i < t2.length; i++)
            t2[i].reject(n);
        }));
      }
    }
    get [Symbol.toStringTag]() {
      return "DataLoader";
    }
  };
  function mr(e, r) {
    if (r === null)
      return r;
    switch (e) {
      case "bigint":
        return BigInt(r);
      case "bytes": {
        let { buffer: t2, byteOffset: n, byteLength: i } = Buffer.from(r, "base64");
        return new Uint8Array(t2, n, i);
      }
      case "decimal":
        return new ve(r);
      case "datetime":
      case "date":
        return new Date(r);
      case "time":
        return new Date(`1970-01-01T${r}Z`);
      case "bigint-array":
        return r.map((t2) => mr("bigint", t2));
      case "bytes-array":
        return r.map((t2) => mr("bytes", t2));
      case "decimal-array":
        return r.map((t2) => mr("decimal", t2));
      case "datetime-array":
        return r.map((t2) => mr("datetime", t2));
      case "date-array":
        return r.map((t2) => mr("date", t2));
      case "time-array":
        return r.map((t2) => mr("time", t2));
      default:
        return r;
    }
  }
  function Yn(e) {
    let r = [], t2 = Rf(e);
    for (let n = 0;n < e.rows.length; n++) {
      let i = e.rows[n], o = { ...t2 };
      for (let s = 0;s < i.length; s++)
        o[e.columns[s]] = mr(e.types[s], i[s]);
      r.push(o);
    }
    return r;
  }
  function Rf(e) {
    let r = {};
    for (let t2 = 0;t2 < e.columns.length; t2++)
      r[e.columns[t2]] = null;
    return r;
  }
  var Cf = N("prisma:client:request_handler");
  var zn = class {
    client;
    dataloader;
    logEmitter;
    constructor(r, t2) {
      this.logEmitter = t2, this.client = r, this.dataloader = new Kn({ batchLoader: il(async ({ requests: n, customDataProxyFetch: i }) => {
        let { transaction: o, otelParentCtx: s } = n[0], a = n.map((p) => p.protocolQuery), l = this.client._tracingHelper.getTraceParent(s), u = n.some((p) => Oo(p.protocolQuery.action));
        return (await this.client._engine.requestBatch(a, { traceparent: l, transaction: Af(o), containsWrite: u, customDataProxyFetch: i })).map((p, d) => {
          if (p instanceof Error)
            return p;
          try {
            return this.mapQueryEngineResult(n[d], p);
          } catch (f) {
            return f;
          }
        });
      }), singleLoader: async (n) => {
        let i = n.transaction?.kind === "itx" ? Zl(n.transaction) : undefined, o = await this.client._engine.request(n.protocolQuery, { traceparent: this.client._tracingHelper.getTraceParent(), interactiveTransaction: i, isWrite: Oo(n.protocolQuery.action), customDataProxyFetch: n.customDataProxyFetch });
        return this.mapQueryEngineResult(n, o);
      }, batchBy: (n) => n.transaction?.id ? `transaction-${n.transaction.id}` : Yl(n.protocolQuery), batchOrder(n, i) {
        return n.transaction?.kind === "batch" && i.transaction?.kind === "batch" ? n.transaction.index - i.transaction.index : 0;
      } });
    }
    async request(r) {
      try {
        return await this.dataloader.request(r);
      } catch (t2) {
        let { clientMethod: n, callsite: i, transaction: o, args: s, modelName: a } = r;
        this.handleAndLogRequestError({ error: t2, clientMethod: n, callsite: i, transaction: o, args: s, modelName: a, globalOmit: r.globalOmit });
      }
    }
    mapQueryEngineResult({ dataPath: r, unpacker: t2 }, n) {
      let i = n?.data, o = this.unpack(i, r, t2);
      return process.env.PRISMA_CLIENT_GET_TIME ? { data: o } : o;
    }
    handleAndLogRequestError(r) {
      try {
        this.handleRequestError(r);
      } catch (t2) {
        throw this.logEmitter && this.logEmitter.emit("error", { message: t2.message, target: r.clientMethod, timestamp: new Date }), t2;
      }
    }
    handleRequestError({ error: r, clientMethod: t2, callsite: n, transaction: i, args: o, modelName: s, globalOmit: a }) {
      if (Cf(r), If(r, i))
        throw r;
      if (r instanceof z2 && kf(r)) {
        let u = Xl(r.meta);
        An({ args: o, errors: [u], callsite: n, errorFormat: this.client._errorFormat, originalMethod: t2, clientVersion: this.client._clientVersion, globalOmit: a });
      }
      let l = r.message;
      if (n && (l = bn({ callsite: n, originalMethod: t2, isPanic: r.isPanic, showColors: this.client._errorFormat === "pretty", message: l })), l = this.sanitizeMessage(l), r.code) {
        let u = s ? { modelName: s, ...r.meta } : r.meta;
        throw new z2(l, { code: r.code, clientVersion: this.client._clientVersion, meta: u, batchRequestIdx: r.batchRequestIdx });
      } else {
        if (r.isPanic)
          throw new le(l, this.client._clientVersion);
        if (r instanceof j)
          throw new j(l, { clientVersion: this.client._clientVersion, batchRequestIdx: r.batchRequestIdx });
        if (r instanceof T)
          throw new T(l, this.client._clientVersion);
        if (r instanceof le)
          throw new le(l, this.client._clientVersion);
      }
      throw r.clientVersion = this.client._clientVersion, r;
    }
    sanitizeMessage(r) {
      return this.client._errorFormat && this.client._errorFormat !== "pretty" ? (0, zl.default)(r) : r;
    }
    unpack(r, t2, n) {
      if (!r || (r.data && (r = r.data), !r))
        return r;
      let i = Object.keys(r)[0], o = Object.values(r)[0], s = t2.filter((u) => u !== "select" && u !== "include"), a = io(o, s), l = i === "queryRaw" ? Yn(a) : Tr(a);
      return n ? n(l) : l;
    }
    get [Symbol.toStringTag]() {
      return "RequestHandler";
    }
  };
  function Af(e) {
    if (e) {
      if (e.kind === "batch")
        return { kind: "batch", options: { isolationLevel: e.isolationLevel } };
      if (e.kind === "itx")
        return { kind: "itx", options: Zl(e) };
      _e(e, "Unknown transaction kind");
    }
  }
  function Zl(e) {
    return { id: e.id, payload: e.payload };
  }
  function If(e, r) {
    return Hn(e) && r?.kind === "batch" && e.batchRequestIdx !== r.index;
  }
  function kf(e) {
    return e.code === "P2009" || e.code === "P2012";
  }
  function Xl(e) {
    if (e.kind === "Union")
      return { kind: "Union", errors: e.errors.map(Xl) };
    if (Array.isArray(e.selectionPath)) {
      let [, ...r] = e.selectionPath;
      return { ...e, selectionPath: r };
    }
    return e;
  }
  var eu = "6.7.0";
  var ru = eu;
  var su = k(Gi());
  var D = class extends Error {
    constructor(r) {
      super(r + `
Read more at https://pris.ly/d/client-constructor`), this.name = "PrismaClientConstructorValidationError";
    }
    get [Symbol.toStringTag]() {
      return "PrismaClientConstructorValidationError";
    }
  };
  x(D, "PrismaClientConstructorValidationError");
  var tu = ["datasources", "datasourceUrl", "errorFormat", "adapter", "log", "transactionOptions", "omit", "__internal"];
  var nu = ["pretty", "colorless", "minimal"];
  var iu = ["info", "query", "warn", "error"];
  var Df = { datasources: (e, { datasourceNames: r }) => {
    if (e) {
      if (typeof e != "object" || Array.isArray(e))
        throw new D(`Invalid value ${JSON.stringify(e)} for "datasources" provided to PrismaClient constructor`);
      for (let [t2, n] of Object.entries(e)) {
        if (!r.includes(t2)) {
          let i = Wr(t2, r) || ` Available datasources: ${r.join(", ")}`;
          throw new D(`Unknown datasource ${t2} provided to PrismaClient constructor.${i}`);
        }
        if (typeof n != "object" || Array.isArray(n))
          throw new D(`Invalid value ${JSON.stringify(e)} for datasource "${t2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
        if (n && typeof n == "object")
          for (let [i, o] of Object.entries(n)) {
            if (i !== "url")
              throw new D(`Invalid value ${JSON.stringify(e)} for datasource "${t2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
            if (typeof o != "string")
              throw new D(`Invalid value ${JSON.stringify(o)} for datasource "${t2}" provided to PrismaClient constructor.
It should have this form: { url: "CONNECTION_STRING" }`);
          }
      }
    }
  }, adapter: (e, r) => {
    if (!e && Er(r.generator) === "client")
      throw new D('Using engine type "client" requires a driver adapter to be provided to PrismaClient constructor.');
    if (e === null)
      return;
    if (e === undefined)
      throw new D('"adapter" property must not be undefined, use null to conditionally disable driver adapters.');
    if (!Wn(r).includes("driverAdapters"))
      throw new D('"adapter" property can only be provided to PrismaClient constructor when "driverAdapters" preview feature is enabled.');
    if (Er(r.generator) === "binary")
      throw new D('Cannot use a driver adapter with the "binary" Query Engine. Please use the "library" Query Engine.');
  }, datasourceUrl: (e) => {
    if (typeof e < "u" && typeof e != "string")
      throw new D(`Invalid value ${JSON.stringify(e)} for "datasourceUrl" provided to PrismaClient constructor.
Expected string or undefined.`);
  }, errorFormat: (e) => {
    if (e) {
      if (typeof e != "string")
        throw new D(`Invalid value ${JSON.stringify(e)} for "errorFormat" provided to PrismaClient constructor.`);
      if (!nu.includes(e)) {
        let r = Wr(e, nu);
        throw new D(`Invalid errorFormat ${e} provided to PrismaClient constructor.${r}`);
      }
    }
  }, log: (e) => {
    if (!e)
      return;
    if (!Array.isArray(e))
      throw new D(`Invalid value ${JSON.stringify(e)} for "log" provided to PrismaClient constructor.`);
    function r(t2) {
      if (typeof t2 == "string" && !iu.includes(t2)) {
        let n = Wr(t2, iu);
        throw new D(`Invalid log level "${t2}" provided to PrismaClient constructor.${n}`);
      }
    }
    for (let t2 of e) {
      r(t2);
      let n = { level: r, emit: (i) => {
        let o = ["stdout", "event"];
        if (!o.includes(i)) {
          let s = Wr(i, o);
          throw new D(`Invalid value ${JSON.stringify(i)} for "emit" in logLevel provided to PrismaClient constructor.${s}`);
        }
      } };
      if (t2 && typeof t2 == "object")
        for (let [i, o] of Object.entries(t2))
          if (n[i])
            n[i](o);
          else
            throw new D(`Invalid property ${i} for "log" provided to PrismaClient constructor`);
    }
  }, transactionOptions: (e) => {
    if (!e)
      return;
    let r = e.maxWait;
    if (r != null && r <= 0)
      throw new D(`Invalid value ${r} for maxWait in "transactionOptions" provided to PrismaClient constructor. maxWait needs to be greater than 0`);
    let t2 = e.timeout;
    if (t2 != null && t2 <= 0)
      throw new D(`Invalid value ${t2} for timeout in "transactionOptions" provided to PrismaClient constructor. timeout needs to be greater than 0`);
  }, omit: (e, r) => {
    if (typeof e != "object")
      throw new D('"omit" option is expected to be an object.');
    if (e === null)
      throw new D('"omit" option can not be `null`');
    let t2 = [];
    for (let [n, i] of Object.entries(e)) {
      let o = Nf(n, r.runtimeDataModel);
      if (!o) {
        t2.push({ kind: "UnknownModel", modelKey: n });
        continue;
      }
      for (let [s, a] of Object.entries(i)) {
        let l = o.fields.find((u) => u.name === s);
        if (!l) {
          t2.push({ kind: "UnknownField", modelKey: n, fieldName: s });
          continue;
        }
        if (l.relationName) {
          t2.push({ kind: "RelationInOmit", modelKey: n, fieldName: s });
          continue;
        }
        typeof a != "boolean" && t2.push({ kind: "InvalidFieldValue", modelKey: n, fieldName: s });
      }
    }
    if (t2.length > 0)
      throw new D(Ff(e, t2));
  }, __internal: (e) => {
    if (!e)
      return;
    let r = ["debug", "engine", "configOverride"];
    if (typeof e != "object")
      throw new D(`Invalid value ${JSON.stringify(e)} for "__internal" to PrismaClient constructor`);
    for (let [t2] of Object.entries(e))
      if (!r.includes(t2)) {
        let n = Wr(t2, r);
        throw new D(`Invalid property ${JSON.stringify(t2)} for "__internal" provided to PrismaClient constructor.${n}`);
      }
  } };
  function au(e, r) {
    for (let [t2, n] of Object.entries(e)) {
      if (!tu.includes(t2)) {
        let i = Wr(t2, tu);
        throw new D(`Unknown property ${t2} provided to PrismaClient constructor.${i}`);
      }
      Df[t2](n, r);
    }
    if (e.datasourceUrl && e.datasources)
      throw new D('Can not use "datasourceUrl" and "datasources" options at the same time. Pick one of them');
  }
  function Wr(e, r) {
    if (r.length === 0 || typeof e != "string")
      return "";
    let t2 = _f(e, r);
    return t2 ? ` Did you mean "${t2}"?` : "";
  }
  function _f(e, r) {
    if (r.length === 0)
      return null;
    let t2 = r.map((i) => ({ value: i, distance: (0, su.default)(e, i) }));
    t2.sort((i, o) => i.distance < o.distance ? -1 : 1);
    let n = t2[0];
    return n.distance < 3 ? n.value : null;
  }
  function Nf(e, r) {
    return ou(r.models, e) ?? ou(r.types, e);
  }
  function ou(e, r) {
    let t2 = Object.keys(e).find((n) => Ye(n) === r);
    if (t2)
      return e[t2];
  }
  function Ff(e, r) {
    let t2 = _r(e);
    for (let o of r)
      switch (o.kind) {
        case "UnknownModel":
          t2.arguments.getField(o.modelKey)?.markAsError(), t2.addErrorMessage(() => `Unknown model name: ${o.modelKey}.`);
          break;
        case "UnknownField":
          t2.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), t2.addErrorMessage(() => `Model "${o.modelKey}" does not have a field named "${o.fieldName}".`);
          break;
        case "RelationInOmit":
          t2.arguments.getDeepField([o.modelKey, o.fieldName])?.markAsError(), t2.addErrorMessage(() => 'Relations are already excluded by default and can not be specified in "omit".');
          break;
        case "InvalidFieldValue":
          t2.arguments.getDeepFieldValue([o.modelKey, o.fieldName])?.markAsError(), t2.addErrorMessage(() => "Omit field option value must be a boolean.");
          break;
      }
    let { message: n, args: i } = Cn(t2, "colorless");
    return `Error validating "omit" option:

${i}

${n}`;
  }
  function lu(e) {
    return e.length === 0 ? Promise.resolve([]) : new Promise((r, t2) => {
      let n = new Array(e.length), i = null, o = false, s = 0, a = () => {
        o || (s++, s === e.length && (o = true, i ? t2(i) : r(n)));
      }, l = (u) => {
        o || (o = true, t2(u));
      };
      for (let u = 0;u < e.length; u++)
        e[u].then((c) => {
          n[u] = c, a();
        }, (c) => {
          if (!Hn(c)) {
            l(c);
            return;
          }
          c.batchRequestIdx === u ? l(c) : (i || (i = c), a());
        });
    });
  }
  var rr = N("prisma:client");
  typeof globalThis == "object" && (globalThis.NODE_CLIENT = true);
  var Lf = { requestArgsToMiddlewareArgs: (e) => e, middlewareArgsToRequestArgs: (e) => e };
  var Mf = Symbol.for("prisma.client.transaction.id");
  var $f = { id: 0, nextId() {
    return ++this.id;
  } };
  function fu(e) {

    class r {
      _originalClient = this;
      _runtimeDataModel;
      _requestHandler;
      _connectionPromise;
      _disconnectionPromise;
      _engineConfig;
      _accelerateEngineConfig;
      _clientVersion;
      _errorFormat;
      _tracingHelper;
      _middlewares = new Jn;
      _previewFeatures;
      _activeProvider;
      _globalOmit;
      _extensions;
      _engine;
      _appliedParent;
      _createPrismaPromise = Ao();
      constructor(n) {
        e = n?.__internal?.configOverride?.(e) ?? e, ul(e), n && au(n, e);
        let i = new du.EventEmitter().on("error", () => {});
        this._extensions = Nr.empty(), this._previewFeatures = Wn(e), this._clientVersion = e.clientVersion ?? ru, this._activeProvider = e.activeProvider, this._globalOmit = n?.omit, this._tracingHelper = Jl();
        let o = e.relativeEnvPaths && { rootEnvPath: e.relativeEnvPaths.rootEnvPath && Zn.default.resolve(e.dirname, e.relativeEnvPaths.rootEnvPath), schemaEnvPath: e.relativeEnvPaths.schemaEnvPath && Zn.default.resolve(e.dirname, e.relativeEnvPaths.schemaEnvPath) }, s;
        if (n?.adapter) {
          s = n.adapter;
          let l = e.activeProvider === "postgresql" ? "postgres" : e.activeProvider;
          if (s.provider !== l)
            throw new T(`The Driver Adapter \`${s.adapterName}\`, based on \`${s.provider}\`, is not compatible with the provider \`${l}\` specified in the Prisma schema.`, this._clientVersion);
          if (n.datasources || n.datasourceUrl !== undefined)
            throw new T("Custom datasource configuration is not compatible with Prisma Driver Adapters. Please define the database connection string directly in the Driver Adapter configuration.", this._clientVersion);
        }
        let a = !s && o && it(o, { conflictCheck: "none" }) || e.injectableEdgeEnv?.();
        try {
          let l = n ?? {}, u = l.__internal ?? {}, c = u.debug === true;
          c && N.enable("prisma:client");
          let p = Zn.default.resolve(e.dirname, e.relativePath);
          mu.default.existsSync(p) || (p = e.dirname), rr("dirname", e.dirname), rr("relativePath", e.relativePath), rr("cwd", p);
          let d = u.engine || {};
          if (l.errorFormat ? this._errorFormat = l.errorFormat : process.env.NO_COLOR ? this._errorFormat = "colorless" : this._errorFormat = "colorless", this._runtimeDataModel = e.runtimeDataModel, this._engineConfig = { cwd: p, dirname: e.dirname, enableDebugLogs: c, allowTriggerPanic: d.allowTriggerPanic, prismaPath: d.binaryPath ?? undefined, engineEndpoint: d.endpoint, generator: e.generator, showColors: this._errorFormat === "pretty", logLevel: l.log && Kl(l.log), logQueries: l.log && !!(typeof l.log == "string" ? l.log === "query" : l.log.find((f) => typeof f == "string" ? f === "query" : f.level === "query")), env: a?.parsed ?? {}, flags: [], engineWasm: e.engineWasm, compilerWasm: e.compilerWasm, clientVersion: e.clientVersion, engineVersion: e.engineVersion, previewFeatures: this._previewFeatures, activeProvider: e.activeProvider, inlineSchema: e.inlineSchema, overrideDatasources: cl(l, e.datasourceNames), inlineDatasources: e.inlineDatasources, inlineSchemaHash: e.inlineSchemaHash, tracingHelper: this._tracingHelper, transactionOptions: { maxWait: l.transactionOptions?.maxWait ?? 2000, timeout: l.transactionOptions?.timeout ?? 5000, isolationLevel: l.transactionOptions?.isolationLevel }, logEmitter: i, isBundled: e.isBundled, adapter: s }, this._accelerateEngineConfig = { ...this._engineConfig, accelerateUtils: { resolveDatasourceUrl: jr, getBatchRequestPayload: Mr, prismaGraphQLToJSError: $r, PrismaClientUnknownRequestError: j, PrismaClientInitializationError: T, PrismaClientKnownRequestError: z2, debug: N("prisma:client:accelerateEngine"), engineVersion: cu.version, clientVersion: e.clientVersion } }, rr("clientVersion", e.clientVersion), this._engine = Ll(e, this._engineConfig), this._requestHandler = new zn(this, i), l.log)
            for (let f of l.log) {
              let g = typeof f == "string" ? f : f.emit === "stdout" ? f.level : null;
              g && this.$on(g, (h) => {
                tt.log(`${tt.tags[g] ?? ""}`, h.message || h.query);
              });
            }
        } catch (l) {
          throw l.clientVersion = this._clientVersion, l;
        }
        return this._appliedParent = vt(this);
      }
      get [Symbol.toStringTag]() {
        return "PrismaClient";
      }
      $use(n) {
        this._middlewares.use(n);
      }
      $on(n, i) {
        return n === "beforeExit" ? this._engine.onBeforeExit(i) : n && this._engineConfig.logEmitter.on(n, i), this;
      }
      $connect() {
        try {
          return this._engine.start();
        } catch (n) {
          throw n.clientVersion = this._clientVersion, n;
        }
      }
      async $disconnect() {
        try {
          await this._engine.stop();
        } catch (n) {
          throw n.clientVersion = this._clientVersion, n;
        } finally {
          Go();
        }
      }
      $executeRawInternal(n, i, o, s) {
        let a = this._activeProvider;
        return this._request({ action: "executeRaw", args: o, transaction: n, clientMethod: i, argsMapper: Co({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
      }
      $executeRaw(n, ...i) {
        return this._createPrismaPromise((o) => {
          if (n.raw !== undefined || n.sql !== undefined) {
            let [s, a] = uu(n, i);
            return Ro(this._activeProvider, s.text, s.values, Array.isArray(n) ? "prisma.$executeRaw`<SQL>`" : "prisma.$executeRaw(sql`<SQL>`)"), this.$executeRawInternal(o, "$executeRaw", s, a);
          }
          throw new Z("`$executeRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$executeRaw`UPDATE User SET cool = ${true} WHERE email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#executeraw\n", { clientVersion: this._clientVersion });
        });
      }
      $executeRawUnsafe(n, ...i) {
        return this._createPrismaPromise((o) => (Ro(this._activeProvider, n, i, "prisma.$executeRawUnsafe(<SQL>, [...values])"), this.$executeRawInternal(o, "$executeRawUnsafe", [n, ...i])));
      }
      $runCommandRaw(n) {
        if (e.activeProvider !== "mongodb")
          throw new Z(`The ${e.activeProvider} provider does not support $runCommandRaw. Use the mongodb provider.`, { clientVersion: this._clientVersion });
        return this._createPrismaPromise((i) => this._request({ args: n, clientMethod: "$runCommandRaw", dataPath: [], action: "runCommandRaw", argsMapper: Ml, callsite: Ze(this._errorFormat), transaction: i }));
      }
      async $queryRawInternal(n, i, o, s) {
        let a = this._activeProvider;
        return this._request({ action: "queryRaw", args: o, transaction: n, clientMethod: i, argsMapper: Co({ clientMethod: i, activeProvider: a }), callsite: Ze(this._errorFormat), dataPath: [], middlewareArgsMapper: s });
      }
      $queryRaw(n, ...i) {
        return this._createPrismaPromise((o) => {
          if (n.raw !== undefined || n.sql !== undefined)
            return this.$queryRawInternal(o, "$queryRaw", ...uu(n, i));
          throw new Z("`$queryRaw` is a tag function, please use it like the following:\n```\nconst result = await prisma.$queryRaw`SELECT * FROM User WHERE id = ${1} OR email = ${'user@email.com'};`\n```\n\nOr read our docs at https://www.prisma.io/docs/concepts/components/prisma-client/raw-database-access#queryraw\n", { clientVersion: this._clientVersion });
        });
      }
      $queryRawTyped(n) {
        return this._createPrismaPromise((i) => {
          if (!this._hasPreviewFlag("typedSql"))
            throw new Z("`typedSql` preview feature must be enabled in order to access $queryRawTyped API", { clientVersion: this._clientVersion });
          return this.$queryRawInternal(i, "$queryRawTyped", n);
        });
      }
      $queryRawUnsafe(n, ...i) {
        return this._createPrismaPromise((o) => this.$queryRawInternal(o, "$queryRawUnsafe", [n, ...i]));
      }
      _transactionWithArray({ promises: n, options: i }) {
        let o = $f.nextId(), s = Hl(n.length), a = n.map((l, u) => {
          if (l?.[Symbol.toStringTag] !== "PrismaPromise")
            throw new Error("All elements of the array need to be Prisma Client promises. Hint: Please make sure you are not awaiting the Prisma client calls you intended to pass in the $transaction function.");
          let c = i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel, p = { kind: "batch", id: o, index: u, isolationLevel: c, lock: s };
          return l.requestTransaction?.(p) ?? l;
        });
        return lu(a);
      }
      async _transactionWithCallback({ callback: n, options: i }) {
        let o = { traceparent: this._tracingHelper.getTraceParent() }, s = { maxWait: i?.maxWait ?? this._engineConfig.transactionOptions.maxWait, timeout: i?.timeout ?? this._engineConfig.transactionOptions.timeout, isolationLevel: i?.isolationLevel ?? this._engineConfig.transactionOptions.isolationLevel }, a = await this._engine.transaction("start", o, s), l;
        try {
          let u = { kind: "itx", ...a };
          l = await n(this._createItxClient(u)), await this._engine.transaction("commit", o, a);
        } catch (u) {
          throw await this._engine.transaction("rollback", o, a).catch(() => {}), u;
        }
        return l;
      }
      _createItxClient(n) {
        return he(vt(he(Ha(this), [re("_appliedParent", () => this._appliedParent._createItxClient(n)), re("_createPrismaPromise", () => Ao(n)), re(Mf, () => n.id)])), [Lr(Xa)]);
      }
      $transaction(n, i) {
        let o;
        typeof n == "function" ? this._engineConfig.adapter?.adapterName === "@prisma/adapter-d1" ? o = () => {
          throw new Error("Cloudflare D1 does not support interactive transactions. We recommend you to refactor your queries with that limitation in mind, and use batch transactions with `prisma.$transactions([])` where applicable.");
        } : o = () => this._transactionWithCallback({ callback: n, options: i }) : o = () => this._transactionWithArray({ promises: n, options: i });
        let s = { name: "transaction", attributes: { method: "$transaction" } };
        return this._tracingHelper.runInChildSpan(s, o);
      }
      _request(n) {
        n.otelParentCtx = this._tracingHelper.getActiveContext();
        let i = n.middlewareArgsMapper ?? Lf, o = { args: i.requestArgsToMiddlewareArgs(n.args), dataPath: n.dataPath, runInTransaction: !!n.transaction, action: n.action, model: n.model }, s = { middleware: { name: "middleware", middleware: true, attributes: { method: "$use" }, active: false }, operation: { name: "operation", attributes: { method: o.action, model: o.model, name: o.model ? `${o.model}.${o.action}` : o.action } } }, a = -1, l = async (u) => {
          let c = this._middlewares.get(++a);
          if (c)
            return this._tracingHelper.runInChildSpan(s.middleware, (I) => c(u, (P) => (I?.end(), l(P))));
          let { runInTransaction: p, args: d, ...f } = u, g = { ...n, ...f };
          d && (g.args = i.middlewareArgsToRequestArgs(d)), n.transaction !== undefined && p === false && delete g.transaction;
          let h = await nl(this, g);
          return g.model ? Za({ result: h, modelName: g.model, args: g.args, extensions: this._extensions, runtimeDataModel: this._runtimeDataModel, globalOmit: this._globalOmit }) : h;
        };
        return this._tracingHelper.runInChildSpan(s.operation, () => new pu.AsyncResource("prisma-client-request").runInAsyncScope(() => l(o)));
      }
      async _executeRequest({ args: n, clientMethod: i, dataPath: o, callsite: s, action: a, model: l, argsMapper: u, transaction: c, unpacker: p, otelParentCtx: d, customDataProxyFetch: f }) {
        try {
          n = u ? u(n) : n;
          let g = { name: "serialize" }, h = this._tracingHelper.runInChildSpan(g, () => Dn({ modelName: l, runtimeDataModel: this._runtimeDataModel, action: a, args: n, clientMethod: i, callsite: s, extensions: this._extensions, errorFormat: this._errorFormat, clientVersion: this._clientVersion, previewFeatures: this._previewFeatures, globalOmit: this._globalOmit }));
          return N.enabled("prisma:client") && (rr("Prisma Client call:"), rr(`prisma.${i}(${Ma(n)})`), rr("Generated request:"), rr(JSON.stringify(h, null, 2) + `
`)), c?.kind === "batch" && await c.lock, this._requestHandler.request({ protocolQuery: h, modelName: l, action: a, clientMethod: i, dataPath: o, callsite: s, args: n, extensions: this._extensions, transaction: c, unpacker: p, otelParentCtx: d, otelChildCtx: this._tracingHelper.getActiveContext(), globalOmit: this._globalOmit, customDataProxyFetch: f });
        } catch (g) {
          throw g.clientVersion = this._clientVersion, g;
        }
      }
      $metrics = new Fr(this);
      _hasPreviewFlag(n) {
        return !!this._engineConfig.previewFeatures?.includes(n);
      }
      $applyPendingMigrations() {
        return this._engine.applyPendingMigrations();
      }
      $extends = Ka;
    }
    return r;
  }
  function uu(e, r) {
    return qf(e) ? [new oe(e, r), Ql] : [e, Gl];
  }
  function qf(e) {
    return Array.isArray(e) && Array.isArray(e.raw);
  }
  var jf = new Set(["toJSON", "$$typeof", "asymmetricMatch", Symbol.iterator, Symbol.toStringTag, Symbol.isConcatSpreadable, Symbol.toPrimitive]);
  function gu(e) {
    return new Proxy(e, { get(r, t2) {
      if (t2 in r)
        return r[t2];
      if (!jf.has(t2))
        throw new TypeError(`Invalid enum value: ${String(t2)}`);
    } });
  }
  function hu(e) {
    it(e, { conflictCheck: "warn" });
  }
  /*! Bundled license information:
  
  decimal.js/decimal.mjs:
    (*!
     *  decimal.js v10.5.0
     *  An arbitrary-precision Decimal type for JavaScript.
     *  https://github.com/MikeMcl/decimal.js
     *  Copyright (c) 2025 Michael Mclaughlin <M8ch88l@gmail.com>
     *  MIT Licence
     *)
  */
});

// node_modules/.prisma/client/index.js
var require_client = __commonJS((exports) => {
  var __dirname = "C:\\Users\\bhoffenbe\\WhatCanIGetFor\\node_modules\\.prisma\\client";
  Object.defineProperty(exports, "__esModule", { value: true });
  var {
    PrismaClientKnownRequestError: PrismaClientKnownRequestError2,
    PrismaClientUnknownRequestError: PrismaClientUnknownRequestError2,
    PrismaClientRustPanicError: PrismaClientRustPanicError2,
    PrismaClientInitializationError: PrismaClientInitializationError2,
    PrismaClientValidationError: PrismaClientValidationError2,
    getPrismaClient: getPrismaClient2,
    sqltag: sqltag2,
    empty: empty2,
    join: join2,
    raw: raw3,
    skip: skip2,
    Decimal: Decimal2,
    Debug: Debug2,
    objectEnumValues: objectEnumValues2,
    makeStrictEnum: makeStrictEnum2,
    Extensions: Extensions2,
    warnOnce: warnOnce2,
    defineDmmfProperty: defineDmmfProperty2,
    Public: Public2,
    getRuntime: getRuntime2,
    createParam: createParam2
  } = require_library();
  var Prisma = {};
  exports.Prisma = Prisma;
  exports.$Enums = {};
  Prisma.prismaVersion = {
    client: "6.7.0",
    engine: "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed"
  };
  Prisma.PrismaClientKnownRequestError = PrismaClientKnownRequestError2;
  Prisma.PrismaClientUnknownRequestError = PrismaClientUnknownRequestError2;
  Prisma.PrismaClientRustPanicError = PrismaClientRustPanicError2;
  Prisma.PrismaClientInitializationError = PrismaClientInitializationError2;
  Prisma.PrismaClientValidationError = PrismaClientValidationError2;
  Prisma.Decimal = Decimal2;
  Prisma.sql = sqltag2;
  Prisma.empty = empty2;
  Prisma.join = join2;
  Prisma.raw = raw3;
  Prisma.validator = Public2.validator;
  Prisma.getExtensionContext = Extensions2.getExtensionContext;
  Prisma.defineExtension = Extensions2.defineExtension;
  Prisma.DbNull = objectEnumValues2.instances.DbNull;
  Prisma.JsonNull = objectEnumValues2.instances.JsonNull;
  Prisma.AnyNull = objectEnumValues2.instances.AnyNull;
  Prisma.NullTypes = {
    DbNull: objectEnumValues2.classes.DbNull,
    JsonNull: objectEnumValues2.classes.JsonNull,
    AnyNull: objectEnumValues2.classes.AnyNull
  };
  var path = __require("path");
  exports.Prisma.TransactionIsolationLevel = makeStrictEnum2({
    ReadUncommitted: "ReadUncommitted",
    ReadCommitted: "ReadCommitted",
    RepeatableRead: "RepeatableRead",
    Serializable: "Serializable"
  });
  exports.Prisma.AdventureScalarFieldEnum = {
    id: "id",
    type: "type",
    title: "title",
    location: "location",
    price: "price",
    description: "description",
    date: "date",
    duration: "duration",
    details: "details"
  };
  exports.Prisma.SortOrder = {
    asc: "asc",
    desc: "desc"
  };
  exports.Prisma.QueryMode = {
    default: "default",
    insensitive: "insensitive"
  };
  exports.Prisma.NullsOrder = {
    first: "first",
    last: "last"
  };
  exports.Prisma.ModelName = {
    Adventure: "Adventure"
  };
  var config = {
    generator: {
      name: "client",
      provider: {
        fromEnvVar: null,
        value: "prisma-client-js"
      },
      output: {
        value: "C:\\Users\\bhoffenbe\\WhatCanIGetFor\\node_modules\\@prisma\\client",
        fromEnvVar: null
      },
      config: {
        engineType: "library"
      },
      binaryTargets: [
        {
          fromEnvVar: null,
          value: "windows",
          native: true
        }
      ],
      previewFeatures: [],
      sourceFilePath: "C:\\Users\\bhoffenbe\\WhatCanIGetFor\\prisma\\schema.prisma"
    },
    relativeEnvPaths: {
      rootEnvPath: null,
      schemaEnvPath: "../../../.env"
    },
    relativePath: "../../../prisma",
    clientVersion: "6.7.0",
    engineVersion: "3cff47a7f5d65c3ea74883f1d736e41d68ce91ed",
    datasourceNames: [
      "db"
    ],
    activeProvider: "postgresql",
    inlineDatasources: {
      db: {
        url: {
          fromEnvVar: "DATABASE_URL",
          value: "postgresql://postgres:ZGovhrOrfshIpsywXslseBbUAIQjrUyz@yamanote.proxy.rlwy.net:33555/railway"
        }
      }
    },
    inlineSchema: `generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Adventure {
  id          String  @id @default(cuid())
  type        String
  title       String
  location    String
  price       Int
  description String
  date        String?
  duration    String?
  details     String
}
`,
    inlineSchemaHash: "ff1c6ffe1529e41acda190784b175374a53fc99fc90f9dfdaf7b01b57c3e568c",
    copyEngine: true
  };
  var fs = __require("fs");
  config.dirname = __dirname;
  if (!fs.existsSync(path.join(__dirname, "schema.prisma"))) {
    const alternativePaths = [
      "node_modules/.prisma/client",
      ".prisma/client"
    ];
    const alternativePath = alternativePaths.find((altPath) => {
      return fs.existsSync(path.join(process.cwd(), altPath, "schema.prisma"));
    }) ?? alternativePaths[0];
    config.dirname = path.join(process.cwd(), alternativePath);
    config.isBundled = true;
  }
  config.runtimeDataModel = JSON.parse('{"models":{"Adventure":{"dbName":null,"schema":null,"fields":[{"name":"id","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":true,"isReadOnly":false,"hasDefaultValue":true,"type":"String","nativeType":null,"default":{"name":"cuid","args":[1]},"isGenerated":false,"isUpdatedAt":false},{"name":"type","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"title","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"location","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"price","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"Int","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"description","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"date","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"duration","kind":"scalar","isList":false,"isRequired":false,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false},{"name":"details","kind":"scalar","isList":false,"isRequired":true,"isUnique":false,"isId":false,"isReadOnly":false,"hasDefaultValue":false,"type":"String","nativeType":null,"isGenerated":false,"isUpdatedAt":false}],"primaryKey":null,"uniqueFields":[],"uniqueIndexes":[],"isGenerated":false}},"enums":{},"types":{}}');
  defineDmmfProperty2(exports.Prisma, config.runtimeDataModel);
  config.engineWasm = undefined;
  config.compilerWasm = undefined;
  var { warnEnvConflicts: warnEnvConflicts2 } = require_library();
  warnEnvConflicts2({
    rootEnvPath: config.relativeEnvPaths.rootEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.rootEnvPath),
    schemaEnvPath: config.relativeEnvPaths.schemaEnvPath && path.resolve(config.dirname, config.relativeEnvPaths.schemaEnvPath)
  });
  var PrismaClient = getPrismaClient2(config);
  exports.PrismaClient = PrismaClient;
  Object.assign(exports, Prisma);
  path.join(__dirname, "query_engine-windows.dll.node");
  path.join(process.cwd(), "node_modules/.prisma/client/query_engine-windows.dll.node");
  path.join(__dirname, "schema.prisma");
  path.join(process.cwd(), "node_modules/.prisma/client/schema.prisma");
});

// node_modules/.prisma/client/default.js
var require_default = __commonJS((exports, module) => {
  module.exports = { ...require_client() };
});

// node_modules/@prisma/client/default.js
var require_default2 = __commonJS((exports, module) => {
  module.exports = {
    ...require_default()
  };
});

// node_modules/hono/dist/compose.js
var compose = (middleware, onError, onNotFound) => {
  return (context, next) => {
    let index = -1;
    return dispatch(0);
    async function dispatch(i) {
      if (i <= index) {
        throw new Error("next() called multiple times");
      }
      index = i;
      let res;
      let isError = false;
      let handler;
      if (middleware[i]) {
        handler = middleware[i][0][0];
        context.req.routeIndex = i;
      } else {
        handler = i === middleware.length && next || undefined;
      }
      if (handler) {
        try {
          res = await handler(context, () => dispatch(i + 1));
        } catch (err) {
          if (err instanceof Error && onError) {
            context.error = err;
            res = await onError(err, context);
            isError = true;
          } else {
            throw err;
          }
        }
      } else {
        if (context.finalized === false && onNotFound) {
          res = await onNotFound(context);
        }
      }
      if (res && (context.finalized === false || isError)) {
        context.res = res;
      }
      return context;
    }
  };
};

// node_modules/hono/dist/utils/body.js
var parseBody = async (request, options = /* @__PURE__ */ Object.create(null)) => {
  const { all = false, dot = false } = options;
  const headers = request instanceof HonoRequest ? request.raw.headers : request.headers;
  const contentType = headers.get("Content-Type");
  if (contentType?.startsWith("multipart/form-data") || contentType?.startsWith("application/x-www-form-urlencoded")) {
    return parseFormData(request, { all, dot });
  }
  return {};
};
async function parseFormData(request, options) {
  const formData = await request.formData();
  if (formData) {
    return convertFormDataToBodyData(formData, options);
  }
  return {};
}
function convertFormDataToBodyData(formData, options) {
  const form = /* @__PURE__ */ Object.create(null);
  formData.forEach((value, key) => {
    const shouldParseAllValues = options.all || key.endsWith("[]");
    if (!shouldParseAllValues) {
      form[key] = value;
    } else {
      handleParsingAllValues(form, key, value);
    }
  });
  if (options.dot) {
    Object.entries(form).forEach(([key, value]) => {
      const shouldParseDotValues = key.includes(".");
      if (shouldParseDotValues) {
        handleParsingNestedValues(form, key, value);
        delete form[key];
      }
    });
  }
  return form;
}
var handleParsingAllValues = (form, key, value) => {
  if (form[key] !== undefined) {
    if (Array.isArray(form[key])) {
      form[key].push(value);
    } else {
      form[key] = [form[key], value];
    }
  } else {
    form[key] = value;
  }
};
var handleParsingNestedValues = (form, key, value) => {
  let nestedForm = form;
  const keys = key.split(".");
  keys.forEach((key2, index) => {
    if (index === keys.length - 1) {
      nestedForm[key2] = value;
    } else {
      if (!nestedForm[key2] || typeof nestedForm[key2] !== "object" || Array.isArray(nestedForm[key2]) || nestedForm[key2] instanceof File) {
        nestedForm[key2] = /* @__PURE__ */ Object.create(null);
      }
      nestedForm = nestedForm[key2];
    }
  });
};

// node_modules/hono/dist/utils/url.js
var splitPath = (path) => {
  const paths = path.split("/");
  if (paths[0] === "") {
    paths.shift();
  }
  return paths;
};
var splitRoutingPath = (routePath) => {
  const { groups, path } = extractGroupsFromPath(routePath);
  const paths = splitPath(path);
  return replaceGroupMarks(paths, groups);
};
var extractGroupsFromPath = (path) => {
  const groups = [];
  path = path.replace(/\{[^}]+\}/g, (match, index) => {
    const mark = `@${index}`;
    groups.push([mark, match]);
    return mark;
  });
  return { groups, path };
};
var replaceGroupMarks = (paths, groups) => {
  for (let i = groups.length - 1;i >= 0; i--) {
    const [mark] = groups[i];
    for (let j = paths.length - 1;j >= 0; j--) {
      if (paths[j].includes(mark)) {
        paths[j] = paths[j].replace(mark, groups[i][1]);
        break;
      }
    }
  }
  return paths;
};
var patternCache = {};
var getPattern = (label, next) => {
  if (label === "*") {
    return "*";
  }
  const match = label.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
  if (match) {
    const cacheKey = `${label}#${next}`;
    if (!patternCache[cacheKey]) {
      if (match[2]) {
        patternCache[cacheKey] = next && next[0] !== ":" && next[0] !== "*" ? [cacheKey, match[1], new RegExp(`^${match[2]}(?=/${next})`)] : [label, match[1], new RegExp(`^${match[2]}$`)];
      } else {
        patternCache[cacheKey] = [label, match[1], true];
      }
    }
    return patternCache[cacheKey];
  }
  return null;
};
var tryDecode = (str, decoder) => {
  try {
    return decoder(str);
  } catch {
    return str.replace(/(?:%[0-9A-Fa-f]{2})+/g, (match) => {
      try {
        return decoder(match);
      } catch {
        return match;
      }
    });
  }
};
var tryDecodeURI = (str) => tryDecode(str, decodeURI);
var getPath = (request) => {
  const url = request.url;
  const start = url.indexOf("/", 8);
  let i = start;
  for (;i < url.length; i++) {
    const charCode = url.charCodeAt(i);
    if (charCode === 37) {
      const queryIndex = url.indexOf("?", i);
      const path = url.slice(start, queryIndex === -1 ? undefined : queryIndex);
      return tryDecodeURI(path.includes("%25") ? path.replace(/%25/g, "%2525") : path);
    } else if (charCode === 63) {
      break;
    }
  }
  return url.slice(start, i);
};
var getPathNoStrict = (request) => {
  const result = getPath(request);
  return result.length > 1 && result.at(-1) === "/" ? result.slice(0, -1) : result;
};
var mergePath = (base, sub, ...rest) => {
  if (rest.length) {
    sub = mergePath(sub, ...rest);
  }
  return `${base?.[0] === "/" ? "" : "/"}${base}${sub === "/" ? "" : `${base?.at(-1) === "/" ? "" : "/"}${sub?.[0] === "/" ? sub.slice(1) : sub}`}`;
};
var checkOptionalParameter = (path) => {
  if (path.charCodeAt(path.length - 1) !== 63 || !path.includes(":")) {
    return null;
  }
  const segments = path.split("/");
  const results = [];
  let basePath = "";
  segments.forEach((segment) => {
    if (segment !== "" && !/\:/.test(segment)) {
      basePath += "/" + segment;
    } else if (/\:/.test(segment)) {
      if (/\?/.test(segment)) {
        if (results.length === 0 && basePath === "") {
          results.push("/");
        } else {
          results.push(basePath);
        }
        const optionalSegment = segment.replace("?", "");
        basePath += "/" + optionalSegment;
        results.push(basePath);
      } else {
        basePath += "/" + segment;
      }
    }
  });
  return results.filter((v, i, a) => a.indexOf(v) === i);
};
var _decodeURI = (value) => {
  if (!/[%+]/.test(value)) {
    return value;
  }
  if (value.indexOf("+") !== -1) {
    value = value.replace(/\+/g, " ");
  }
  return value.indexOf("%") !== -1 ? decodeURIComponent_(value) : value;
};
var _getQueryParam = (url, key, multiple) => {
  let encoded;
  if (!multiple && key && !/[%+]/.test(key)) {
    let keyIndex2 = url.indexOf(`?${key}`, 8);
    if (keyIndex2 === -1) {
      keyIndex2 = url.indexOf(`&${key}`, 8);
    }
    while (keyIndex2 !== -1) {
      const trailingKeyCode = url.charCodeAt(keyIndex2 + key.length + 1);
      if (trailingKeyCode === 61) {
        const valueIndex = keyIndex2 + key.length + 2;
        const endIndex = url.indexOf("&", valueIndex);
        return _decodeURI(url.slice(valueIndex, endIndex === -1 ? undefined : endIndex));
      } else if (trailingKeyCode == 38 || isNaN(trailingKeyCode)) {
        return "";
      }
      keyIndex2 = url.indexOf(`&${key}`, keyIndex2 + 1);
    }
    encoded = /[%+]/.test(url);
    if (!encoded) {
      return;
    }
  }
  const results = {};
  encoded ??= /[%+]/.test(url);
  let keyIndex = url.indexOf("?", 8);
  while (keyIndex !== -1) {
    const nextKeyIndex = url.indexOf("&", keyIndex + 1);
    let valueIndex = url.indexOf("=", keyIndex);
    if (valueIndex > nextKeyIndex && nextKeyIndex !== -1) {
      valueIndex = -1;
    }
    let name = url.slice(keyIndex + 1, valueIndex === -1 ? nextKeyIndex === -1 ? undefined : nextKeyIndex : valueIndex);
    if (encoded) {
      name = _decodeURI(name);
    }
    keyIndex = nextKeyIndex;
    if (name === "") {
      continue;
    }
    let value;
    if (valueIndex === -1) {
      value = "";
    } else {
      value = url.slice(valueIndex + 1, nextKeyIndex === -1 ? undefined : nextKeyIndex);
      if (encoded) {
        value = _decodeURI(value);
      }
    }
    if (multiple) {
      if (!(results[name] && Array.isArray(results[name]))) {
        results[name] = [];
      }
      results[name].push(value);
    } else {
      results[name] ??= value;
    }
  }
  return key ? results[key] : results;
};
var getQueryParam = _getQueryParam;
var getQueryParams = (url, key) => {
  return _getQueryParam(url, key, true);
};
var decodeURIComponent_ = decodeURIComponent;

// node_modules/hono/dist/request.js
var tryDecodeURIComponent = (str) => tryDecode(str, decodeURIComponent_);
var HonoRequest = class {
  raw;
  #validatedData;
  #matchResult;
  routeIndex = 0;
  path;
  bodyCache = {};
  constructor(request, path = "/", matchResult = [[]]) {
    this.raw = request;
    this.path = path;
    this.#matchResult = matchResult;
    this.#validatedData = {};
  }
  param(key) {
    return key ? this.#getDecodedParam(key) : this.#getAllDecodedParams();
  }
  #getDecodedParam(key) {
    const paramKey = this.#matchResult[0][this.routeIndex][1][key];
    const param = this.#getParamValue(paramKey);
    return param ? /\%/.test(param) ? tryDecodeURIComponent(param) : param : undefined;
  }
  #getAllDecodedParams() {
    const decoded = {};
    const keys = Object.keys(this.#matchResult[0][this.routeIndex][1]);
    for (const key of keys) {
      const value = this.#getParamValue(this.#matchResult[0][this.routeIndex][1][key]);
      if (value && typeof value === "string") {
        decoded[key] = /\%/.test(value) ? tryDecodeURIComponent(value) : value;
      }
    }
    return decoded;
  }
  #getParamValue(paramKey) {
    return this.#matchResult[1] ? this.#matchResult[1][paramKey] : paramKey;
  }
  query(key) {
    return getQueryParam(this.url, key);
  }
  queries(key) {
    return getQueryParams(this.url, key);
  }
  header(name) {
    if (name) {
      return this.raw.headers.get(name) ?? undefined;
    }
    const headerData = {};
    this.raw.headers.forEach((value, key) => {
      headerData[key] = value;
    });
    return headerData;
  }
  async parseBody(options) {
    return this.bodyCache.parsedBody ??= await parseBody(this, options);
  }
  #cachedBody = (key) => {
    const { bodyCache, raw: raw2 } = this;
    const cachedBody = bodyCache[key];
    if (cachedBody) {
      return cachedBody;
    }
    const anyCachedKey = Object.keys(bodyCache)[0];
    if (anyCachedKey) {
      return bodyCache[anyCachedKey].then((body) => {
        if (anyCachedKey === "json") {
          body = JSON.stringify(body);
        }
        return new Response(body)[key]();
      });
    }
    return bodyCache[key] = raw2[key]();
  };
  json() {
    return this.#cachedBody("json");
  }
  text() {
    return this.#cachedBody("text");
  }
  arrayBuffer() {
    return this.#cachedBody("arrayBuffer");
  }
  blob() {
    return this.#cachedBody("blob");
  }
  formData() {
    return this.#cachedBody("formData");
  }
  addValidatedData(target, data) {
    this.#validatedData[target] = data;
  }
  valid(target) {
    return this.#validatedData[target];
  }
  get url() {
    return this.raw.url;
  }
  get method() {
    return this.raw.method;
  }
  get matchedRoutes() {
    return this.#matchResult[0].map(([[, route]]) => route);
  }
  get routePath() {
    return this.#matchResult[0].map(([[, route]]) => route)[this.routeIndex].path;
  }
};

// node_modules/hono/dist/utils/html.js
var HtmlEscapedCallbackPhase = {
  Stringify: 1,
  BeforeStream: 2,
  Stream: 3
};
var raw2 = (value, callbacks) => {
  const escapedString = new String(value);
  escapedString.isEscaped = true;
  escapedString.callbacks = callbacks;
  return escapedString;
};
var resolveCallback = async (str, phase, preserveCallbacks, context, buffer) => {
  if (typeof str === "object" && !(str instanceof String)) {
    if (!(str instanceof Promise)) {
      str = str.toString();
    }
    if (str instanceof Promise) {
      str = await str;
    }
  }
  const callbacks = str.callbacks;
  if (!callbacks?.length) {
    return Promise.resolve(str);
  }
  if (buffer) {
    buffer[0] += str;
  } else {
    buffer = [str];
  }
  const resStr = Promise.all(callbacks.map((c) => c({ phase, buffer, context }))).then((res) => Promise.all(res.filter(Boolean).map((str2) => resolveCallback(str2, phase, false, context, buffer))).then(() => buffer[0]));
  if (preserveCallbacks) {
    return raw2(await resStr, callbacks);
  } else {
    return resStr;
  }
};

// node_modules/hono/dist/context.js
var TEXT_PLAIN = "text/plain; charset=UTF-8";
var setHeaders = (headers, map = {}) => {
  for (const key of Object.keys(map)) {
    headers.set(key, map[key]);
  }
  return headers;
};
var Context = class {
  #rawRequest;
  #req;
  env = {};
  #var;
  finalized = false;
  error;
  #status = 200;
  #executionCtx;
  #headers;
  #preparedHeaders;
  #res;
  #isFresh = true;
  #layout;
  #renderer;
  #notFoundHandler;
  #matchResult;
  #path;
  constructor(req, options) {
    this.#rawRequest = req;
    if (options) {
      this.#executionCtx = options.executionCtx;
      this.env = options.env;
      this.#notFoundHandler = options.notFoundHandler;
      this.#path = options.path;
      this.#matchResult = options.matchResult;
    }
  }
  get req() {
    this.#req ??= new HonoRequest(this.#rawRequest, this.#path, this.#matchResult);
    return this.#req;
  }
  get event() {
    if (this.#executionCtx && "respondWith" in this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no FetchEvent");
    }
  }
  get executionCtx() {
    if (this.#executionCtx) {
      return this.#executionCtx;
    } else {
      throw Error("This context has no ExecutionContext");
    }
  }
  get res() {
    this.#isFresh = false;
    return this.#res ||= new Response("404 Not Found", { status: 404 });
  }
  set res(_res) {
    this.#isFresh = false;
    if (this.#res && _res) {
      _res = new Response(_res.body, _res);
      for (const [k, v] of this.#res.headers.entries()) {
        if (k === "content-type") {
          continue;
        }
        if (k === "set-cookie") {
          const cookies = this.#res.headers.getSetCookie();
          _res.headers.delete("set-cookie");
          for (const cookie of cookies) {
            _res.headers.append("set-cookie", cookie);
          }
        } else {
          _res.headers.set(k, v);
        }
      }
    }
    this.#res = _res;
    this.finalized = true;
  }
  render = (...args) => {
    this.#renderer ??= (content) => this.html(content);
    return this.#renderer(...args);
  };
  setLayout = (layout) => this.#layout = layout;
  getLayout = () => this.#layout;
  setRenderer = (renderer) => {
    this.#renderer = renderer;
  };
  header = (name, value, options) => {
    if (this.finalized) {
      this.#res = new Response(this.#res.body, this.#res);
    }
    if (value === undefined) {
      if (this.#headers) {
        this.#headers.delete(name);
      } else if (this.#preparedHeaders) {
        delete this.#preparedHeaders[name.toLocaleLowerCase()];
      }
      if (this.finalized) {
        this.res.headers.delete(name);
      }
      return;
    }
    if (options?.append) {
      if (!this.#headers) {
        this.#isFresh = false;
        this.#headers = new Headers(this.#preparedHeaders);
        this.#preparedHeaders = {};
      }
      this.#headers.append(name, value);
    } else {
      if (this.#headers) {
        this.#headers.set(name, value);
      } else {
        this.#preparedHeaders ??= {};
        this.#preparedHeaders[name.toLowerCase()] = value;
      }
    }
    if (this.finalized) {
      if (options?.append) {
        this.res.headers.append(name, value);
      } else {
        this.res.headers.set(name, value);
      }
    }
  };
  status = (status) => {
    this.#isFresh = false;
    this.#status = status;
  };
  set = (key, value) => {
    this.#var ??= /* @__PURE__ */ new Map;
    this.#var.set(key, value);
  };
  get = (key) => {
    return this.#var ? this.#var.get(key) : undefined;
  };
  get var() {
    if (!this.#var) {
      return {};
    }
    return Object.fromEntries(this.#var);
  }
  #newResponse(data, arg, headers) {
    if (this.#isFresh && !headers && !arg && this.#status === 200) {
      return new Response(data, {
        headers: this.#preparedHeaders
      });
    }
    if (arg && typeof arg !== "number") {
      const header = new Headers(arg.headers);
      if (this.#headers) {
        this.#headers.forEach((v, k) => {
          if (k === "set-cookie") {
            header.append(k, v);
          } else {
            header.set(k, v);
          }
        });
      }
      const headers2 = setHeaders(header, this.#preparedHeaders);
      return new Response(data, {
        headers: headers2,
        status: arg.status ?? this.#status
      });
    }
    const status = typeof arg === "number" ? arg : this.#status;
    this.#preparedHeaders ??= {};
    this.#headers ??= new Headers;
    setHeaders(this.#headers, this.#preparedHeaders);
    if (this.#res) {
      this.#res.headers.forEach((v, k) => {
        if (k === "set-cookie") {
          this.#headers?.append(k, v);
        } else {
          this.#headers?.set(k, v);
        }
      });
      setHeaders(this.#headers, this.#preparedHeaders);
    }
    headers ??= {};
    for (const [k, v] of Object.entries(headers)) {
      if (typeof v === "string") {
        this.#headers.set(k, v);
      } else {
        this.#headers.delete(k);
        for (const v2 of v) {
          this.#headers.append(k, v2);
        }
      }
    }
    return new Response(data, {
      status,
      headers: this.#headers
    });
  }
  newResponse = (...args) => this.#newResponse(...args);
  body = (data, arg, headers) => {
    return typeof arg === "number" ? this.#newResponse(data, arg, headers) : this.#newResponse(data, arg);
  };
  text = (text, arg, headers) => {
    if (!this.#preparedHeaders) {
      if (this.#isFresh && !headers && !arg) {
        return new Response(text);
      }
      this.#preparedHeaders = {};
    }
    this.#preparedHeaders["content-type"] = TEXT_PLAIN;
    if (typeof arg === "number") {
      return this.#newResponse(text, arg, headers);
    }
    return this.#newResponse(text, arg);
  };
  json = (object, arg, headers) => {
    const body = JSON.stringify(object);
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "application/json";
    return typeof arg === "number" ? this.#newResponse(body, arg, headers) : this.#newResponse(body, arg);
  };
  html = (html, arg, headers) => {
    this.#preparedHeaders ??= {};
    this.#preparedHeaders["content-type"] = "text/html; charset=UTF-8";
    if (typeof html === "object") {
      return resolveCallback(html, HtmlEscapedCallbackPhase.Stringify, false, {}).then((html2) => {
        return typeof arg === "number" ? this.#newResponse(html2, arg, headers) : this.#newResponse(html2, arg);
      });
    }
    return typeof arg === "number" ? this.#newResponse(html, arg, headers) : this.#newResponse(html, arg);
  };
  redirect = (location, status) => {
    this.#headers ??= new Headers;
    this.#headers.set("Location", String(location));
    return this.newResponse(null, status ?? 302);
  };
  notFound = () => {
    this.#notFoundHandler ??= () => new Response;
    return this.#notFoundHandler(this);
  };
};

// node_modules/hono/dist/router.js
var METHOD_NAME_ALL = "ALL";
var METHOD_NAME_ALL_LOWERCASE = "all";
var METHODS = ["get", "post", "put", "delete", "options", "patch"];
var MESSAGE_MATCHER_IS_ALREADY_BUILT = "Can not add a route since the matcher is already built.";
var UnsupportedPathError = class extends Error {
};

// node_modules/hono/dist/utils/constants.js
var COMPOSED_HANDLER = "__COMPOSED_HANDLER";

// node_modules/hono/dist/hono-base.js
var notFoundHandler = (c) => {
  return c.text("404 Not Found", 404);
};
var errorHandler = (err, c) => {
  if ("getResponse" in err) {
    return err.getResponse();
  }
  console.error(err);
  return c.text("Internal Server Error", 500);
};
var Hono = class {
  get;
  post;
  put;
  delete;
  options;
  patch;
  all;
  on;
  use;
  router;
  getPath;
  _basePath = "/";
  #path = "/";
  routes = [];
  constructor(options = {}) {
    const allMethods = [...METHODS, METHOD_NAME_ALL_LOWERCASE];
    allMethods.forEach((method) => {
      this[method] = (args1, ...args) => {
        if (typeof args1 === "string") {
          this.#path = args1;
        } else {
          this.#addRoute(method, this.#path, args1);
        }
        args.forEach((handler) => {
          this.#addRoute(method, this.#path, handler);
        });
        return this;
      };
    });
    this.on = (method, path, ...handlers) => {
      for (const p of [path].flat()) {
        this.#path = p;
        for (const m of [method].flat()) {
          handlers.map((handler) => {
            this.#addRoute(m.toUpperCase(), this.#path, handler);
          });
        }
      }
      return this;
    };
    this.use = (arg1, ...handlers) => {
      if (typeof arg1 === "string") {
        this.#path = arg1;
      } else {
        this.#path = "*";
        handlers.unshift(arg1);
      }
      handlers.forEach((handler) => {
        this.#addRoute(METHOD_NAME_ALL, this.#path, handler);
      });
      return this;
    };
    const { strict, ...optionsWithoutStrict } = options;
    Object.assign(this, optionsWithoutStrict);
    this.getPath = strict ?? true ? options.getPath ?? getPath : getPathNoStrict;
  }
  #clone() {
    const clone = new Hono({
      router: this.router,
      getPath: this.getPath
    });
    clone.routes = this.routes;
    return clone;
  }
  #notFoundHandler = notFoundHandler;
  errorHandler = errorHandler;
  route(path, app) {
    const subApp = this.basePath(path);
    app.routes.map((r) => {
      let handler;
      if (app.errorHandler === errorHandler) {
        handler = r.handler;
      } else {
        handler = async (c, next) => (await compose([], app.errorHandler)(c, () => r.handler(c, next))).res;
        handler[COMPOSED_HANDLER] = r.handler;
      }
      subApp.#addRoute(r.method, r.path, handler);
    });
    return this;
  }
  basePath(path) {
    const subApp = this.#clone();
    subApp._basePath = mergePath(this._basePath, path);
    return subApp;
  }
  onError = (handler) => {
    this.errorHandler = handler;
    return this;
  };
  notFound = (handler) => {
    this.#notFoundHandler = handler;
    return this;
  };
  mount(path, applicationHandler, options) {
    let replaceRequest;
    let optionHandler;
    if (options) {
      if (typeof options === "function") {
        optionHandler = options;
      } else {
        optionHandler = options.optionHandler;
        if (options.replaceRequest === false) {
          replaceRequest = (request) => request;
        } else {
          replaceRequest = options.replaceRequest;
        }
      }
    }
    const getOptions = optionHandler ? (c) => {
      const options2 = optionHandler(c);
      return Array.isArray(options2) ? options2 : [options2];
    } : (c) => {
      let executionContext = undefined;
      try {
        executionContext = c.executionCtx;
      } catch {}
      return [c.env, executionContext];
    };
    replaceRequest ||= (() => {
      const mergedPath = mergePath(this._basePath, path);
      const pathPrefixLength = mergedPath === "/" ? 0 : mergedPath.length;
      return (request) => {
        const url = new URL(request.url);
        url.pathname = url.pathname.slice(pathPrefixLength) || "/";
        return new Request(url, request);
      };
    })();
    const handler = async (c, next) => {
      const res = await applicationHandler(replaceRequest(c.req.raw), ...getOptions(c));
      if (res) {
        return res;
      }
      await next();
    };
    this.#addRoute(METHOD_NAME_ALL, mergePath(path, "*"), handler);
    return this;
  }
  #addRoute(method, path, handler) {
    method = method.toUpperCase();
    path = mergePath(this._basePath, path);
    const r = { path, method, handler };
    this.router.add(method, path, [handler, r]);
    this.routes.push(r);
  }
  #handleError(err, c) {
    if (err instanceof Error) {
      return this.errorHandler(err, c);
    }
    throw err;
  }
  #dispatch(request, executionCtx, env, method) {
    if (method === "HEAD") {
      return (async () => new Response(null, await this.#dispatch(request, executionCtx, env, "GET")))();
    }
    const path = this.getPath(request, { env });
    const matchResult = this.router.match(method, path);
    const c = new Context(request, {
      path,
      matchResult,
      env,
      executionCtx,
      notFoundHandler: this.#notFoundHandler
    });
    if (matchResult[0].length === 1) {
      let res;
      try {
        res = matchResult[0][0][0][0](c, async () => {
          c.res = await this.#notFoundHandler(c);
        });
      } catch (err) {
        return this.#handleError(err, c);
      }
      return res instanceof Promise ? res.then((resolved) => resolved || (c.finalized ? c.res : this.#notFoundHandler(c))).catch((err) => this.#handleError(err, c)) : res ?? this.#notFoundHandler(c);
    }
    const composed = compose(matchResult[0], this.errorHandler, this.#notFoundHandler);
    return (async () => {
      try {
        const context = await composed(c);
        if (!context.finalized) {
          throw new Error("Context is not finalized. Did you forget to return a Response object or `await next()`?");
        }
        return context.res;
      } catch (err) {
        return this.#handleError(err, c);
      }
    })();
  }
  fetch = (request, ...rest) => {
    return this.#dispatch(request, rest[1], rest[0], request.method);
  };
  request = (input, requestInit, Env, executionCtx) => {
    if (input instanceof Request) {
      return this.fetch(requestInit ? new Request(input, requestInit) : input, Env, executionCtx);
    }
    input = input.toString();
    return this.fetch(new Request(/^https?:\/\//.test(input) ? input : `http://localhost${mergePath("/", input)}`, requestInit), Env, executionCtx);
  };
  fire = () => {
    addEventListener("fetch", (event) => {
      event.respondWith(this.#dispatch(event.request, event, undefined, event.request.method));
    });
  };
};

// node_modules/hono/dist/router/reg-exp-router/node.js
var LABEL_REG_EXP_STR = "[^/]+";
var ONLY_WILDCARD_REG_EXP_STR = ".*";
var TAIL_WILDCARD_REG_EXP_STR = "(?:|/.*)";
var PATH_ERROR = Symbol();
var regExpMetaChars = new Set(".\\+*[^]$()");
function compareKey(a, b) {
  if (a.length === 1) {
    return b.length === 1 ? a < b ? -1 : 1 : -1;
  }
  if (b.length === 1) {
    return 1;
  }
  if (a === ONLY_WILDCARD_REG_EXP_STR || a === TAIL_WILDCARD_REG_EXP_STR) {
    return 1;
  } else if (b === ONLY_WILDCARD_REG_EXP_STR || b === TAIL_WILDCARD_REG_EXP_STR) {
    return -1;
  }
  if (a === LABEL_REG_EXP_STR) {
    return 1;
  } else if (b === LABEL_REG_EXP_STR) {
    return -1;
  }
  return a.length === b.length ? a < b ? -1 : 1 : b.length - a.length;
}
var Node = class {
  #index;
  #varIndex;
  #children = /* @__PURE__ */ Object.create(null);
  insert(tokens, index, paramMap, context, pathErrorCheckOnly) {
    if (tokens.length === 0) {
      if (this.#index !== undefined) {
        throw PATH_ERROR;
      }
      if (pathErrorCheckOnly) {
        return;
      }
      this.#index = index;
      return;
    }
    const [token, ...restTokens] = tokens;
    const pattern = token === "*" ? restTokens.length === 0 ? ["", "", ONLY_WILDCARD_REG_EXP_STR] : ["", "", LABEL_REG_EXP_STR] : token === "/*" ? ["", "", TAIL_WILDCARD_REG_EXP_STR] : token.match(/^\:([^\{\}]+)(?:\{(.+)\})?$/);
    let node;
    if (pattern) {
      const name = pattern[1];
      let regexpStr = pattern[2] || LABEL_REG_EXP_STR;
      if (name && pattern[2]) {
        regexpStr = regexpStr.replace(/^\((?!\?:)(?=[^)]+\)$)/, "(?:");
        if (/\((?!\?:)/.test(regexpStr)) {
          throw PATH_ERROR;
        }
      }
      node = this.#children[regexpStr];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[regexpStr] = new Node;
        if (name !== "") {
          node.#varIndex = context.varIndex++;
        }
      }
      if (!pathErrorCheckOnly && name !== "") {
        paramMap.push([name, node.#varIndex]);
      }
    } else {
      node = this.#children[token];
      if (!node) {
        if (Object.keys(this.#children).some((k) => k.length > 1 && k !== ONLY_WILDCARD_REG_EXP_STR && k !== TAIL_WILDCARD_REG_EXP_STR)) {
          throw PATH_ERROR;
        }
        if (pathErrorCheckOnly) {
          return;
        }
        node = this.#children[token] = new Node;
      }
    }
    node.insert(restTokens, index, paramMap, context, pathErrorCheckOnly);
  }
  buildRegExpStr() {
    const childKeys = Object.keys(this.#children).sort(compareKey);
    const strList = childKeys.map((k) => {
      const c = this.#children[k];
      return (typeof c.#varIndex === "number" ? `(${k})@${c.#varIndex}` : regExpMetaChars.has(k) ? `\\${k}` : k) + c.buildRegExpStr();
    });
    if (typeof this.#index === "number") {
      strList.unshift(`#${this.#index}`);
    }
    if (strList.length === 0) {
      return "";
    }
    if (strList.length === 1) {
      return strList[0];
    }
    return "(?:" + strList.join("|") + ")";
  }
};

// node_modules/hono/dist/router/reg-exp-router/trie.js
var Trie = class {
  #context = { varIndex: 0 };
  #root = new Node;
  insert(path, index, pathErrorCheckOnly) {
    const paramAssoc = [];
    const groups = [];
    for (let i = 0;; ) {
      let replaced = false;
      path = path.replace(/\{[^}]+\}/g, (m) => {
        const mark = `@\\${i}`;
        groups[i] = [mark, m];
        i++;
        replaced = true;
        return mark;
      });
      if (!replaced) {
        break;
      }
    }
    const tokens = path.match(/(?::[^\/]+)|(?:\/\*$)|./g) || [];
    for (let i = groups.length - 1;i >= 0; i--) {
      const [mark] = groups[i];
      for (let j = tokens.length - 1;j >= 0; j--) {
        if (tokens[j].indexOf(mark) !== -1) {
          tokens[j] = tokens[j].replace(mark, groups[i][1]);
          break;
        }
      }
    }
    this.#root.insert(tokens, index, paramAssoc, this.#context, pathErrorCheckOnly);
    return paramAssoc;
  }
  buildRegExp() {
    let regexp = this.#root.buildRegExpStr();
    if (regexp === "") {
      return [/^$/, [], []];
    }
    let captureIndex = 0;
    const indexReplacementMap = [];
    const paramReplacementMap = [];
    regexp = regexp.replace(/#(\d+)|@(\d+)|\.\*\$/g, (_, handlerIndex, paramIndex) => {
      if (handlerIndex !== undefined) {
        indexReplacementMap[++captureIndex] = Number(handlerIndex);
        return "$()";
      }
      if (paramIndex !== undefined) {
        paramReplacementMap[Number(paramIndex)] = ++captureIndex;
        return "";
      }
      return "";
    });
    return [new RegExp(`^${regexp}`), indexReplacementMap, paramReplacementMap];
  }
};

// node_modules/hono/dist/router/reg-exp-router/router.js
var emptyParam = [];
var nullMatcher = [/^$/, [], /* @__PURE__ */ Object.create(null)];
var wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
function buildWildcardRegExp(path) {
  return wildcardRegExpCache[path] ??= new RegExp(path === "*" ? "" : `^${path.replace(/\/\*$|([.\\+*[^\]$()])/g, (_, metaChar) => metaChar ? `\\${metaChar}` : "(?:|/.*)")}$`);
}
function clearWildcardRegExpCache() {
  wildcardRegExpCache = /* @__PURE__ */ Object.create(null);
}
function buildMatcherFromPreprocessedRoutes(routes) {
  const trie = new Trie;
  const handlerData = [];
  if (routes.length === 0) {
    return nullMatcher;
  }
  const routesWithStaticPathFlag = routes.map((route) => [!/\*|\/:/.test(route[0]), ...route]).sort(([isStaticA, pathA], [isStaticB, pathB]) => isStaticA ? 1 : isStaticB ? -1 : pathA.length - pathB.length);
  const staticMap = /* @__PURE__ */ Object.create(null);
  for (let i = 0, j = -1, len = routesWithStaticPathFlag.length;i < len; i++) {
    const [pathErrorCheckOnly, path, handlers] = routesWithStaticPathFlag[i];
    if (pathErrorCheckOnly) {
      staticMap[path] = [handlers.map(([h]) => [h, /* @__PURE__ */ Object.create(null)]), emptyParam];
    } else {
      j++;
    }
    let paramAssoc;
    try {
      paramAssoc = trie.insert(path, j, pathErrorCheckOnly);
    } catch (e) {
      throw e === PATH_ERROR ? new UnsupportedPathError(path) : e;
    }
    if (pathErrorCheckOnly) {
      continue;
    }
    handlerData[j] = handlers.map(([h, paramCount]) => {
      const paramIndexMap = /* @__PURE__ */ Object.create(null);
      paramCount -= 1;
      for (;paramCount >= 0; paramCount--) {
        const [key, value] = paramAssoc[paramCount];
        paramIndexMap[key] = value;
      }
      return [h, paramIndexMap];
    });
  }
  const [regexp, indexReplacementMap, paramReplacementMap] = trie.buildRegExp();
  for (let i = 0, len = handlerData.length;i < len; i++) {
    for (let j = 0, len2 = handlerData[i].length;j < len2; j++) {
      const map = handlerData[i][j]?.[1];
      if (!map) {
        continue;
      }
      const keys = Object.keys(map);
      for (let k = 0, len3 = keys.length;k < len3; k++) {
        map[keys[k]] = paramReplacementMap[map[keys[k]]];
      }
    }
  }
  const handlerMap = [];
  for (const i in indexReplacementMap) {
    handlerMap[i] = handlerData[indexReplacementMap[i]];
  }
  return [regexp, handlerMap, staticMap];
}
function findMiddleware(middleware, path) {
  if (!middleware) {
    return;
  }
  for (const k of Object.keys(middleware).sort((a, b) => b.length - a.length)) {
    if (buildWildcardRegExp(k).test(path)) {
      return [...middleware[k]];
    }
  }
  return;
}
var RegExpRouter = class {
  name = "RegExpRouter";
  #middleware;
  #routes;
  constructor() {
    this.#middleware = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
    this.#routes = { [METHOD_NAME_ALL]: /* @__PURE__ */ Object.create(null) };
  }
  add(method, path, handler) {
    const middleware = this.#middleware;
    const routes = this.#routes;
    if (!middleware || !routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    if (!middleware[method]) {
      [middleware, routes].forEach((handlerMap) => {
        handlerMap[method] = /* @__PURE__ */ Object.create(null);
        Object.keys(handlerMap[METHOD_NAME_ALL]).forEach((p) => {
          handlerMap[method][p] = [...handlerMap[METHOD_NAME_ALL][p]];
        });
      });
    }
    if (path === "/*") {
      path = "*";
    }
    const paramCount = (path.match(/\/:/g) || []).length;
    if (/\*$/.test(path)) {
      const re = buildWildcardRegExp(path);
      if (method === METHOD_NAME_ALL) {
        Object.keys(middleware).forEach((m) => {
          middleware[m][path] ||= findMiddleware(middleware[m], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
        });
      } else {
        middleware[method][path] ||= findMiddleware(middleware[method], path) || findMiddleware(middleware[METHOD_NAME_ALL], path) || [];
      }
      Object.keys(middleware).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(middleware[m]).forEach((p) => {
            re.test(p) && middleware[m][p].push([handler, paramCount]);
          });
        }
      });
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          Object.keys(routes[m]).forEach((p) => re.test(p) && routes[m][p].push([handler, paramCount]));
        }
      });
      return;
    }
    const paths = checkOptionalParameter(path) || [path];
    for (let i = 0, len = paths.length;i < len; i++) {
      const path2 = paths[i];
      Object.keys(routes).forEach((m) => {
        if (method === METHOD_NAME_ALL || method === m) {
          routes[m][path2] ||= [
            ...findMiddleware(middleware[m], path2) || findMiddleware(middleware[METHOD_NAME_ALL], path2) || []
          ];
          routes[m][path2].push([handler, paramCount - len + i + 1]);
        }
      });
    }
  }
  match(method, path) {
    clearWildcardRegExpCache();
    const matchers = this.#buildAllMatchers();
    this.match = (method2, path2) => {
      const matcher = matchers[method2] || matchers[METHOD_NAME_ALL];
      const staticMatch = matcher[2][path2];
      if (staticMatch) {
        return staticMatch;
      }
      const match = path2.match(matcher[0]);
      if (!match) {
        return [[], emptyParam];
      }
      const index = match.indexOf("", 1);
      return [matcher[1][index], match];
    };
    return this.match(method, path);
  }
  #buildAllMatchers() {
    const matchers = /* @__PURE__ */ Object.create(null);
    Object.keys(this.#routes).concat(Object.keys(this.#middleware)).forEach((method) => {
      matchers[method] ||= this.#buildMatcher(method);
    });
    this.#middleware = this.#routes = undefined;
    return matchers;
  }
  #buildMatcher(method) {
    const routes = [];
    let hasOwnRoute = method === METHOD_NAME_ALL;
    [this.#middleware, this.#routes].forEach((r) => {
      const ownRoute = r[method] ? Object.keys(r[method]).map((path) => [path, r[method][path]]) : [];
      if (ownRoute.length !== 0) {
        hasOwnRoute ||= true;
        routes.push(...ownRoute);
      } else if (method !== METHOD_NAME_ALL) {
        routes.push(...Object.keys(r[METHOD_NAME_ALL]).map((path) => [path, r[METHOD_NAME_ALL][path]]));
      }
    });
    if (!hasOwnRoute) {
      return null;
    } else {
      return buildMatcherFromPreprocessedRoutes(routes);
    }
  }
};

// node_modules/hono/dist/router/smart-router/router.js
var SmartRouter = class {
  name = "SmartRouter";
  #routers = [];
  #routes = [];
  constructor(init) {
    this.#routers = init.routers;
  }
  add(method, path, handler) {
    if (!this.#routes) {
      throw new Error(MESSAGE_MATCHER_IS_ALREADY_BUILT);
    }
    this.#routes.push([method, path, handler]);
  }
  match(method, path) {
    if (!this.#routes) {
      throw new Error("Fatal error");
    }
    const routers = this.#routers;
    const routes = this.#routes;
    const len = routers.length;
    let i = 0;
    let res;
    for (;i < len; i++) {
      const router = routers[i];
      try {
        for (let i2 = 0, len2 = routes.length;i2 < len2; i2++) {
          router.add(...routes[i2]);
        }
        res = router.match(method, path);
      } catch (e) {
        if (e instanceof UnsupportedPathError) {
          continue;
        }
        throw e;
      }
      this.match = router.match.bind(router);
      this.#routers = [router];
      this.#routes = undefined;
      break;
    }
    if (i === len) {
      throw new Error("Fatal error");
    }
    this.name = `SmartRouter + ${this.activeRouter.name}`;
    return res;
  }
  get activeRouter() {
    if (this.#routes || this.#routers.length !== 1) {
      throw new Error("No active router has been determined yet.");
    }
    return this.#routers[0];
  }
};

// node_modules/hono/dist/router/trie-router/node.js
var emptyParams = /* @__PURE__ */ Object.create(null);
var Node2 = class {
  #methods;
  #children;
  #patterns;
  #order = 0;
  #params = emptyParams;
  constructor(method, handler, children) {
    this.#children = children || /* @__PURE__ */ Object.create(null);
    this.#methods = [];
    if (method && handler) {
      const m = /* @__PURE__ */ Object.create(null);
      m[method] = { handler, possibleKeys: [], score: 0 };
      this.#methods = [m];
    }
    this.#patterns = [];
  }
  insert(method, path, handler) {
    this.#order = ++this.#order;
    let curNode = this;
    const parts = splitRoutingPath(path);
    const possibleKeys = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const p = parts[i];
      const nextP = parts[i + 1];
      const pattern = getPattern(p, nextP);
      const key = Array.isArray(pattern) ? pattern[0] : p;
      if (Object.keys(curNode.#children).includes(key)) {
        curNode = curNode.#children[key];
        const pattern2 = getPattern(p, nextP);
        if (pattern2) {
          possibleKeys.push(pattern2[1]);
        }
        continue;
      }
      curNode.#children[key] = new Node2;
      if (pattern) {
        curNode.#patterns.push(pattern);
        possibleKeys.push(pattern[1]);
      }
      curNode = curNode.#children[key];
    }
    const m = /* @__PURE__ */ Object.create(null);
    const handlerSet = {
      handler,
      possibleKeys: possibleKeys.filter((v, i, a) => a.indexOf(v) === i),
      score: this.#order
    };
    m[method] = handlerSet;
    curNode.#methods.push(m);
    return curNode;
  }
  #getHandlerSets(node, method, nodeParams, params) {
    const handlerSets = [];
    for (let i = 0, len = node.#methods.length;i < len; i++) {
      const m = node.#methods[i];
      const handlerSet = m[method] || m[METHOD_NAME_ALL];
      const processedSet = {};
      if (handlerSet !== undefined) {
        handlerSet.params = /* @__PURE__ */ Object.create(null);
        handlerSets.push(handlerSet);
        if (nodeParams !== emptyParams || params && params !== emptyParams) {
          for (let i2 = 0, len2 = handlerSet.possibleKeys.length;i2 < len2; i2++) {
            const key = handlerSet.possibleKeys[i2];
            const processed = processedSet[handlerSet.score];
            handlerSet.params[key] = params?.[key] && !processed ? params[key] : nodeParams[key] ?? params?.[key];
            processedSet[handlerSet.score] = true;
          }
        }
      }
    }
    return handlerSets;
  }
  search(method, path) {
    const handlerSets = [];
    this.#params = emptyParams;
    const curNode = this;
    let curNodes = [curNode];
    const parts = splitPath(path);
    const curNodesQueue = [];
    for (let i = 0, len = parts.length;i < len; i++) {
      const part = parts[i];
      const isLast = i === len - 1;
      const tempNodes = [];
      for (let j = 0, len2 = curNodes.length;j < len2; j++) {
        const node = curNodes[j];
        const nextNode = node.#children[part];
        if (nextNode) {
          nextNode.#params = node.#params;
          if (isLast) {
            if (nextNode.#children["*"]) {
              handlerSets.push(...this.#getHandlerSets(nextNode.#children["*"], method, node.#params));
            }
            handlerSets.push(...this.#getHandlerSets(nextNode, method, node.#params));
          } else {
            tempNodes.push(nextNode);
          }
        }
        for (let k = 0, len3 = node.#patterns.length;k < len3; k++) {
          const pattern = node.#patterns[k];
          const params = node.#params === emptyParams ? {} : { ...node.#params };
          if (pattern === "*") {
            const astNode = node.#children["*"];
            if (astNode) {
              handlerSets.push(...this.#getHandlerSets(astNode, method, node.#params));
              astNode.#params = params;
              tempNodes.push(astNode);
            }
            continue;
          }
          if (part === "") {
            continue;
          }
          const [key, name, matcher] = pattern;
          const child = node.#children[key];
          const restPathString = parts.slice(i).join("/");
          if (matcher instanceof RegExp) {
            const m = matcher.exec(restPathString);
            if (m) {
              params[name] = m[0];
              handlerSets.push(...this.#getHandlerSets(child, method, node.#params, params));
              if (Object.keys(child.#children).length) {
                child.#params = params;
                const componentCount = m[0].match(/\//)?.length ?? 0;
                const targetCurNodes = curNodesQueue[componentCount] ||= [];
                targetCurNodes.push(child);
              }
              continue;
            }
          }
          if (matcher === true || matcher.test(part)) {
            params[name] = part;
            if (isLast) {
              handlerSets.push(...this.#getHandlerSets(child, method, params, node.#params));
              if (child.#children["*"]) {
                handlerSets.push(...this.#getHandlerSets(child.#children["*"], method, params, node.#params));
              }
            } else {
              child.#params = params;
              tempNodes.push(child);
            }
          }
        }
      }
      curNodes = tempNodes.concat(curNodesQueue.shift() ?? []);
    }
    if (handlerSets.length > 1) {
      handlerSets.sort((a, b) => {
        return a.score - b.score;
      });
    }
    return [handlerSets.map(({ handler, params }) => [handler, params])];
  }
};

// node_modules/hono/dist/router/trie-router/router.js
var TrieRouter = class {
  name = "TrieRouter";
  #node;
  constructor() {
    this.#node = new Node2;
  }
  add(method, path, handler) {
    const results = checkOptionalParameter(path);
    if (results) {
      for (let i = 0, len = results.length;i < len; i++) {
        this.#node.insert(method, results[i], handler);
      }
      return;
    }
    this.#node.insert(method, path, handler);
  }
  match(method, path) {
    return this.#node.search(method, path);
  }
};

// node_modules/hono/dist/hono.js
var Hono2 = class extends Hono {
  constructor(options = {}) {
    super(options);
    this.router = options.router ?? new SmartRouter({
      routers: [new RegExpRouter, new TrieRouter]
    });
  }
};

// api/index.ts
var import_trpc_server = __toESM(require_cjs(), 1);

// node_modules/hono/dist/middleware/cors/index.js
var cors = (options) => {
  const defaults = {
    origin: "*",
    allowMethods: ["GET", "HEAD", "PUT", "POST", "DELETE", "PATCH"],
    allowHeaders: [],
    exposeHeaders: []
  };
  const opts = {
    ...defaults,
    ...options
  };
  const findAllowOrigin = ((optsOrigin) => {
    if (typeof optsOrigin === "string") {
      if (optsOrigin === "*") {
        return () => optsOrigin;
      } else {
        return (origin) => optsOrigin === origin ? origin : null;
      }
    } else if (typeof optsOrigin === "function") {
      return optsOrigin;
    } else {
      return (origin) => optsOrigin.includes(origin) ? origin : null;
    }
  })(opts.origin);
  return async function cors2(c, next) {
    function set(key, value) {
      c.res.headers.set(key, value);
    }
    const allowOrigin = findAllowOrigin(c.req.header("origin") || "", c);
    if (allowOrigin) {
      set("Access-Control-Allow-Origin", allowOrigin);
    }
    if (opts.origin !== "*") {
      const existingVary = c.req.header("Vary");
      if (existingVary) {
        set("Vary", existingVary);
      } else {
        set("Vary", "Origin");
      }
    }
    if (opts.credentials) {
      set("Access-Control-Allow-Credentials", "true");
    }
    if (opts.exposeHeaders?.length) {
      set("Access-Control-Expose-Headers", opts.exposeHeaders.join(","));
    }
    if (c.req.method === "OPTIONS") {
      if (opts.maxAge != null) {
        set("Access-Control-Max-Age", opts.maxAge.toString());
      }
      if (opts.allowMethods?.length) {
        set("Access-Control-Allow-Methods", opts.allowMethods.join(","));
      }
      let headers = opts.allowHeaders;
      if (!headers?.length) {
        const requestHeaders = c.req.header("Access-Control-Request-Headers");
        if (requestHeaders) {
          headers = requestHeaders.split(/\s*,\s*/);
        }
      }
      if (headers?.length) {
        set("Access-Control-Allow-Headers", headers.join(","));
        c.res.headers.append("Vary", "Access-Control-Request-Headers");
      }
      c.res.headers.delete("Content-Length");
      c.res.headers.delete("Content-Type");
      return new Response(null, {
        headers: c.res.headers,
        status: 204,
        statusText: "No Content"
      });
    }
    await next();
  };
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/createProxy.mjs
var noop = () => {};
var freezeIfAvailable = (obj) => {
  if (Object.freeze) {
    Object.freeze(obj);
  }
};
function createInnerProxy(callback, path, memo) {
  var _memo, _cacheKey;
  const cacheKey = path.join(".");
  (_memo = memo)[_cacheKey = cacheKey] ?? (_memo[_cacheKey] = new Proxy(noop, {
    get(_obj, key) {
      if (typeof key !== "string" || key === "then") {
        return;
      }
      return createInnerProxy(callback, [
        ...path,
        key
      ], memo);
    },
    apply(_1, _2, args) {
      const lastOfPath = path[path.length - 1];
      let opts = {
        args,
        path
      };
      if (lastOfPath === "call") {
        opts = {
          args: args.length >= 2 ? [
            args[1]
          ] : [],
          path: path.slice(0, -1)
        };
      } else if (lastOfPath === "apply") {
        opts = {
          args: args.length >= 2 ? args[1] : [],
          path: path.slice(0, -1)
        };
      }
      freezeIfAvailable(opts.args);
      freezeIfAvailable(opts.path);
      return callback(opts);
    }
  }));
  return memo[cacheKey];
}
var createRecursiveProxy = (callback) => createInnerProxy(callback, [], Object.create(null));
// node_modules/@trpc/server/dist/unstable-core-do-not-import/utils.mjs
var unsetMarker = Symbol();
function mergeWithoutOverrides(obj1, ...objs) {
  const newObj = Object.assign(Object.create(null), obj1);
  for (const overrides of objs) {
    for (const key in overrides) {
      if (key in newObj && newObj[key] !== overrides[key]) {
        throw new Error(`Duplicate key ${key}`);
      }
      newObj[key] = overrides[key];
    }
  }
  return newObj;
}
function isObject(value) {
  return !!value && !Array.isArray(value) && typeof value === "object";
}
function isFunction(fn) {
  return typeof fn === "function";
}
function omitPrototype(obj) {
  return Object.assign(Object.create(null), obj);
}
// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/TRPCError.mjs
function _define_property(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class UnknownCauseError extends Error {
}
function getCauseFromUnknown(cause) {
  if (cause instanceof Error) {
    return cause;
  }
  const type = typeof cause;
  if (type === "undefined" || type === "function" || cause === null) {
    return;
  }
  if (type !== "object") {
    return new Error(String(cause));
  }
  if (isObject(cause)) {
    const err = new UnknownCauseError;
    for (const key in cause) {
      err[key] = cause[key];
    }
    return err;
  }
  return;
}
function getTRPCErrorFromUnknown(cause) {
  if (cause instanceof TRPCError) {
    return cause;
  }
  if (cause instanceof Error && cause.name === "TRPCError") {
    return cause;
  }
  const trpcError = new TRPCError({
    code: "INTERNAL_SERVER_ERROR",
    cause
  });
  if (cause instanceof Error && cause.stack) {
    trpcError.stack = cause.stack;
  }
  return trpcError;
}

class TRPCError extends Error {
  constructor(opts) {
    const cause = getCauseFromUnknown(opts.cause);
    const message = opts.message ?? cause?.message ?? opts.code;
    super(message, {
      cause
    }), _define_property(this, "cause", undefined), _define_property(this, "code", undefined);
    this.code = opts.code;
    this.name = "TRPCError";
    if (!this.cause) {
      this.cause = cause;
    }
  }
}
// node_modules/@trpc/server/dist/unstable-core-do-not-import/error/formatter.mjs
var defaultFormatter = ({ shape }) => {
  return shape;
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/transformer.mjs
function getDataTransformer(transformer) {
  if ("input" in transformer) {
    return transformer;
  }
  return {
    input: transformer,
    output: transformer
  };
}
var defaultTransformer = {
  input: {
    serialize: (obj) => obj,
    deserialize: (obj) => obj
  },
  output: {
    serialize: (obj) => obj,
    deserialize: (obj) => obj
  }
};

// node_modules/@trpc/server/dist/unstable-core-do-not-import/router.mjs
var lazySymbol = Symbol("lazy");
function once(fn) {
  const uncalled = Symbol();
  let result = uncalled;
  return () => {
    if (result === uncalled) {
      result = fn();
    }
    return result;
  };
}
function isLazy(input) {
  return typeof input === "function" && lazySymbol in input;
}
function isRouter(value) {
  return isObject(value) && isObject(value["_def"]) && "router" in value["_def"];
}
var emptyRouter = {
  _ctx: null,
  _errorShape: null,
  _meta: null,
  queries: {},
  mutations: {},
  subscriptions: {},
  errorFormatter: defaultFormatter,
  transformer: defaultTransformer
};
var reservedWords = [
  "then",
  "call",
  "apply"
];
function createRouterFactory(config) {
  function createRouterInner(input) {
    const reservedWordsUsed = new Set(Object.keys(input).filter((v) => reservedWords.includes(v)));
    if (reservedWordsUsed.size > 0) {
      throw new Error("Reserved words used in `router({})` call: " + Array.from(reservedWordsUsed).join(", "));
    }
    const procedures = omitPrototype({});
    const lazy = omitPrototype({});
    function createLazyLoader(opts) {
      return {
        ref: opts.ref,
        load: once(async () => {
          const router2 = await opts.ref();
          const lazyPath = [
            ...opts.path,
            opts.key
          ];
          const lazyKey = lazyPath.join(".");
          opts.aggregate[opts.key] = step(router2._def.record, lazyPath);
          delete lazy[lazyKey];
          for (const [nestedKey, nestedItem] of Object.entries(router2._def.lazy)) {
            const nestedRouterKey = [
              ...lazyPath,
              nestedKey
            ].join(".");
            lazy[nestedRouterKey] = createLazyLoader({
              ref: nestedItem.ref,
              path: lazyPath,
              key: nestedKey,
              aggregate: opts.aggregate[opts.key]
            });
          }
        })
      };
    }
    function step(from, path = []) {
      const aggregate = omitPrototype({});
      for (const [key, item] of Object.entries(from ?? {})) {
        if (isLazy(item)) {
          lazy[[
            ...path,
            key
          ].join(".")] = createLazyLoader({
            path,
            ref: item,
            key,
            aggregate
          });
          continue;
        }
        if (isRouter(item)) {
          aggregate[key] = step(item._def.record, [
            ...path,
            key
          ]);
          continue;
        }
        if (!isProcedure(item)) {
          aggregate[key] = step(item, [
            ...path,
            key
          ]);
          continue;
        }
        const newPath = [
          ...path,
          key
        ].join(".");
        if (procedures[newPath]) {
          throw new Error(`Duplicate key: ${newPath}`);
        }
        procedures[newPath] = item;
        aggregate[key] = item;
      }
      return aggregate;
    }
    const record = step(input);
    const _def = {
      _config: config,
      router: true,
      procedures,
      lazy,
      ...emptyRouter,
      record
    };
    const router = {
      ...record,
      _def,
      createCaller: createCallerFactory()({
        _def
      })
    };
    return router;
  }
  return createRouterInner;
}
function isProcedure(procedureOrRouter) {
  return typeof procedureOrRouter === "function";
}
async function getProcedureAtPath(router, path) {
  const { _def } = router;
  let procedure = _def.procedures[path];
  while (!procedure) {
    const key = Object.keys(_def.lazy).find((key2) => path.startsWith(key2));
    if (!key) {
      return null;
    }
    const lazyRouter = _def.lazy[key];
    await lazyRouter.load();
    procedure = _def.procedures[path];
  }
  return procedure;
}
function createCallerFactory() {
  return function createCallerInner(router) {
    const { _def } = router;
    return function createCaller(ctxOrCallback, opts) {
      return createRecursiveProxy(async ({ path, args }) => {
        const fullPath = path.join(".");
        if (path.length === 1 && path[0] === "_def") {
          return _def;
        }
        const procedure = await getProcedureAtPath(router, fullPath);
        let ctx = undefined;
        try {
          if (!procedure) {
            throw new TRPCError({
              code: "NOT_FOUND",
              message: `No procedure found on path "${path}"`
            });
          }
          ctx = isFunction(ctxOrCallback) ? await Promise.resolve(ctxOrCallback()) : ctxOrCallback;
          return await procedure({
            path: fullPath,
            getRawInput: async () => args[0],
            ctx,
            type: procedure._def.type,
            signal: opts?.signal
          });
        } catch (cause) {
          opts?.onError?.({
            ctx,
            error: getTRPCErrorFromUnknown(cause),
            input: args[0],
            path: fullPath,
            type: procedure?._def.type ?? "unknown"
          });
          throw cause;
        }
      });
    };
  };
}
function mergeRouters(...routerList) {
  const record = mergeWithoutOverrides({}, ...routerList.map((r) => r._def.record));
  const errorFormatter = routerList.reduce((currentErrorFormatter, nextRouter) => {
    if (nextRouter._def._config.errorFormatter && nextRouter._def._config.errorFormatter !== defaultFormatter) {
      if (currentErrorFormatter !== defaultFormatter && currentErrorFormatter !== nextRouter._def._config.errorFormatter) {
        throw new Error("You seem to have several error formatters");
      }
      return nextRouter._def._config.errorFormatter;
    }
    return currentErrorFormatter;
  }, defaultFormatter);
  const transformer = routerList.reduce((prev, current) => {
    if (current._def._config.transformer && current._def._config.transformer !== defaultTransformer) {
      if (prev !== defaultTransformer && prev !== current._def._config.transformer) {
        throw new Error("You seem to have several transformers");
      }
      return current._def._config.transformer;
    }
    return prev;
  }, defaultTransformer);
  const router = createRouterFactory({
    errorFormatter,
    transformer,
    isDev: routerList.every((r) => r._def._config.isDev),
    allowOutsideOfServer: routerList.every((r) => r._def._config.allowOutsideOfServer),
    isServer: routerList.every((r) => r._def._config.isServer),
    $types: routerList[0]?._def._config.$types
  })(record);
  return router;
}
// node_modules/@trpc/server/dist/vendor/unpromise/unpromise.mjs
var _computedKey;
var subscribableCache = new WeakMap;
_computedKey = Symbol.toStringTag;

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/utils/disposable.mjs
var _Symbol;
var _Symbol1;
(_Symbol = Symbol).dispose ?? (_Symbol.dispose = Symbol());
(_Symbol1 = Symbol).asyncDispose ?? (_Symbol1.asyncDispose = Symbol());

// node_modules/@trpc/server/dist/unstable-core-do-not-import/stream/tracked.mjs
var trackedSymbol = Symbol();
// node_modules/@trpc/server/dist/unstable-core-do-not-import/middleware.mjs
var middlewareMarker = "middlewareMarker";
function createMiddlewareFactory() {
  function createMiddlewareInner(middlewares) {
    return {
      _middlewares: middlewares,
      unstable_pipe(middlewareBuilderOrFn) {
        const pipedMiddleware = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
          middlewareBuilderOrFn
        ];
        return createMiddlewareInner([
          ...middlewares,
          ...pipedMiddleware
        ]);
      }
    };
  }
  function createMiddleware(fn) {
    return createMiddlewareInner([
      fn
    ]);
  }
  return createMiddleware;
}
function createInputMiddleware(parse) {
  const inputMiddleware = async function inputValidatorMiddleware(opts) {
    let parsedInput;
    const rawInput = await opts.getRawInput();
    try {
      parsedInput = await parse(rawInput);
    } catch (cause) {
      throw new TRPCError({
        code: "BAD_REQUEST",
        cause
      });
    }
    const combinedInput = isObject(opts.input) && isObject(parsedInput) ? {
      ...opts.input,
      ...parsedInput
    } : parsedInput;
    return opts.next({
      input: combinedInput
    });
  };
  inputMiddleware._type = "input";
  return inputMiddleware;
}
function createOutputMiddleware(parse) {
  const outputMiddleware = async function outputValidatorMiddleware({ next }) {
    const result = await next();
    if (!result.ok) {
      return result;
    }
    try {
      const data = await parse(result.data);
      return {
        ...result,
        data
      };
    } catch (cause) {
      throw new TRPCError({
        message: "Output validation failed",
        code: "INTERNAL_SERVER_ERROR",
        cause
      });
    }
  };
  outputMiddleware._type = "output";
  return outputMiddleware;
}

// node_modules/@trpc/server/dist/vendor/standard-schema-v1/error.mjs
function _define_property2(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }
  return obj;
}

class StandardSchemaV1Error extends Error {
  constructor(issues) {
    super(issues[0]?.message), _define_property2(this, "issues", undefined);
    this.name = "SchemaError";
    this.issues = issues;
  }
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/parser.mjs
function getParseFn(procedureParser) {
  const parser = procedureParser;
  const isStandardSchema = "~standard" in parser;
  if (typeof parser === "function" && typeof parser.assert === "function") {
    return parser.assert.bind(parser);
  }
  if (typeof parser === "function" && !isStandardSchema) {
    return parser;
  }
  if (typeof parser.parseAsync === "function") {
    return parser.parseAsync.bind(parser);
  }
  if (typeof parser.parse === "function") {
    return parser.parse.bind(parser);
  }
  if (typeof parser.validateSync === "function") {
    return parser.validateSync.bind(parser);
  }
  if (typeof parser.create === "function") {
    return parser.create.bind(parser);
  }
  if (typeof parser.assert === "function") {
    return (value) => {
      parser.assert(value);
      return value;
    };
  }
  if (isStandardSchema) {
    return async (value) => {
      const result = await parser["~standard"].validate(value);
      if (result.issues) {
        throw new StandardSchemaV1Error(result.issues);
      }
      return result.value;
    };
  }
  throw new Error("Could not find a validator fn");
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/procedureBuilder.mjs
function createNewBuilder(def1, def2) {
  const { middlewares = [], inputs, meta, ...rest } = def2;
  return createBuilder({
    ...mergeWithoutOverrides(def1, rest),
    inputs: [
      ...def1.inputs,
      ...inputs ?? []
    ],
    middlewares: [
      ...def1.middlewares,
      ...middlewares
    ],
    meta: def1.meta && meta ? {
      ...def1.meta,
      ...meta
    } : meta ?? def1.meta
  });
}
function createBuilder(initDef = {}) {
  const _def = {
    procedure: true,
    inputs: [],
    middlewares: [],
    ...initDef
  };
  const builder = {
    _def,
    input(input) {
      const parser = getParseFn(input);
      return createNewBuilder(_def, {
        inputs: [
          input
        ],
        middlewares: [
          createInputMiddleware(parser)
        ]
      });
    },
    output(output) {
      const parser = getParseFn(output);
      return createNewBuilder(_def, {
        output,
        middlewares: [
          createOutputMiddleware(parser)
        ]
      });
    },
    meta(meta) {
      return createNewBuilder(_def, {
        meta
      });
    },
    use(middlewareBuilderOrFn) {
      const middlewares = "_middlewares" in middlewareBuilderOrFn ? middlewareBuilderOrFn._middlewares : [
        middlewareBuilderOrFn
      ];
      return createNewBuilder(_def, {
        middlewares
      });
    },
    unstable_concat(builder2) {
      return createNewBuilder(_def, builder2._def);
    },
    concat(builder2) {
      return createNewBuilder(_def, builder2._def);
    },
    query(resolver) {
      return createResolver({
        ..._def,
        type: "query"
      }, resolver);
    },
    mutation(resolver) {
      return createResolver({
        ..._def,
        type: "mutation"
      }, resolver);
    },
    subscription(resolver) {
      return createResolver({
        ..._def,
        type: "subscription"
      }, resolver);
    },
    experimental_caller(caller) {
      return createNewBuilder(_def, {
        caller
      });
    }
  };
  return builder;
}
function createResolver(_defIn, resolver) {
  const finalBuilder = createNewBuilder(_defIn, {
    resolver,
    middlewares: [
      async function resolveMiddleware(opts) {
        const data = await resolver(opts);
        return {
          marker: middlewareMarker,
          ok: true,
          data,
          ctx: opts.ctx
        };
      }
    ]
  });
  const _def = {
    ...finalBuilder._def,
    type: _defIn.type,
    experimental_caller: Boolean(finalBuilder._def.caller),
    meta: finalBuilder._def.meta,
    $types: null
  };
  const invoke = createProcedureCaller(finalBuilder._def);
  const callerOverride = finalBuilder._def.caller;
  if (!callerOverride) {
    return invoke;
  }
  const callerWrapper = async (...args) => {
    return await callerOverride({
      args,
      invoke,
      _def
    });
  };
  callerWrapper._def = _def;
  return callerWrapper;
}
var codeblock = `
This is a client-only function.
If you want to call this function on the server, see https://trpc.io/docs/v11/server/server-side-calls
`.trim();
async function callRecursive(index, _def, opts) {
  try {
    const middleware = _def.middlewares[index];
    const result = await middleware({
      ...opts,
      meta: _def.meta,
      input: opts.input,
      next(_nextOpts) {
        const nextOpts = _nextOpts;
        return callRecursive(index + 1, _def, {
          ...opts,
          ctx: nextOpts?.ctx ? {
            ...opts.ctx,
            ...nextOpts.ctx
          } : opts.ctx,
          input: nextOpts && "input" in nextOpts ? nextOpts.input : opts.input,
          getRawInput: nextOpts?.getRawInput ?? opts.getRawInput
        });
      }
    });
    return result;
  } catch (cause) {
    return {
      ok: false,
      error: getTRPCErrorFromUnknown(cause),
      marker: middlewareMarker
    };
  }
}
function createProcedureCaller(_def) {
  async function procedure(opts) {
    if (!opts || !("getRawInput" in opts)) {
      throw new Error(codeblock);
    }
    const result = await callRecursive(0, _def, opts);
    if (!result) {
      throw new TRPCError({
        code: "INTERNAL_SERVER_ERROR",
        message: "No result from middlewares - did you forget to `return next()`?"
      });
    }
    if (!result.ok) {
      throw result.error;
    }
    return result.data;
  }
  procedure._def = _def;
  procedure.procedure = true;
  return procedure;
}

// node_modules/@trpc/server/dist/unstable-core-do-not-import/rootConfig.mjs
var isServerDefault = typeof window === "undefined" || "Deno" in window || globalThis.process?.env?.["NODE_ENV"] === "test" || !!globalThis.process?.env?.["JEST_WORKER_ID"] || !!globalThis.process?.env?.["VITEST_WORKER_ID"];

// node_modules/@trpc/server/dist/unstable-core-do-not-import/initTRPC.mjs
class TRPCBuilder {
  context() {
    return new TRPCBuilder;
  }
  meta() {
    return new TRPCBuilder;
  }
  create(opts) {
    const config = {
      ...opts,
      transformer: getDataTransformer(opts?.transformer ?? defaultTransformer),
      isDev: opts?.isDev ?? globalThis.process?.env["NODE_ENV"] !== "production",
      allowOutsideOfServer: opts?.allowOutsideOfServer ?? false,
      errorFormatter: opts?.errorFormatter ?? defaultFormatter,
      isServer: opts?.isServer ?? isServerDefault,
      $types: null
    };
    {
      const isServer = opts?.isServer ?? isServerDefault;
      if (!isServer && opts?.allowOutsideOfServer !== true) {
        throw new Error(`You're trying to use @trpc/server in a non-server environment. This is not supported by default.`);
      }
    }
    return {
      _config: config,
      procedure: createBuilder({
        meta: opts?.defaultMeta
      }),
      middleware: createMiddlewareFactory(),
      router: createRouterFactory(config),
      mergeRouters,
      createCallerFactory: createCallerFactory()
    };
  }
}
var initTRPC = new TRPCBuilder;
// node_modules/superjson/dist/double-indexed-kv.js
class DoubleIndexedKV {
  constructor() {
    this.keyToValue = new Map;
    this.valueToKey = new Map;
  }
  set(key, value) {
    this.keyToValue.set(key, value);
    this.valueToKey.set(value, key);
  }
  getByKey(key) {
    return this.keyToValue.get(key);
  }
  getByValue(value) {
    return this.valueToKey.get(value);
  }
  clear() {
    this.keyToValue.clear();
    this.valueToKey.clear();
  }
}

// node_modules/superjson/dist/registry.js
class Registry {
  constructor(generateIdentifier) {
    this.generateIdentifier = generateIdentifier;
    this.kv = new DoubleIndexedKV;
  }
  register(value, identifier) {
    if (this.kv.getByValue(value)) {
      return;
    }
    if (!identifier) {
      identifier = this.generateIdentifier(value);
    }
    this.kv.set(identifier, value);
  }
  clear() {
    this.kv.clear();
  }
  getIdentifier(value) {
    return this.kv.getByValue(value);
  }
  getValue(identifier) {
    return this.kv.getByKey(identifier);
  }
}

// node_modules/superjson/dist/class-registry.js
class ClassRegistry extends Registry {
  constructor() {
    super((c) => c.name);
    this.classToAllowedProps = new Map;
  }
  register(value, options) {
    if (typeof options === "object") {
      if (options.allowProps) {
        this.classToAllowedProps.set(value, options.allowProps);
      }
      super.register(value, options.identifier);
    } else {
      super.register(value, options);
    }
  }
  getAllowedProps(value) {
    return this.classToAllowedProps.get(value);
  }
}

// node_modules/superjson/dist/util.js
function valuesOfObj(record) {
  if ("values" in Object) {
    return Object.values(record);
  }
  const values = [];
  for (const key in record) {
    if (record.hasOwnProperty(key)) {
      values.push(record[key]);
    }
  }
  return values;
}
function find(record, predicate) {
  const values = valuesOfObj(record);
  if ("find" in values) {
    return values.find(predicate);
  }
  const valuesNotNever = values;
  for (let i = 0;i < valuesNotNever.length; i++) {
    const value = valuesNotNever[i];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}
function forEach(record, run) {
  Object.entries(record).forEach(([key, value]) => run(value, key));
}
function includes(arr, value) {
  return arr.indexOf(value) !== -1;
}
function findArr(record, predicate) {
  for (let i = 0;i < record.length; i++) {
    const value = record[i];
    if (predicate(value)) {
      return value;
    }
  }
  return;
}

// node_modules/superjson/dist/custom-transformer-registry.js
class CustomTransformerRegistry {
  constructor() {
    this.transfomers = {};
  }
  register(transformer) {
    this.transfomers[transformer.name] = transformer;
  }
  findApplicable(v) {
    return find(this.transfomers, (transformer) => transformer.isApplicable(v));
  }
  findByName(name) {
    return this.transfomers[name];
  }
}

// node_modules/superjson/dist/is.js
var getType = (payload) => Object.prototype.toString.call(payload).slice(8, -1);
var isUndefined = (payload) => typeof payload === "undefined";
var isNull = (payload) => payload === null;
var isPlainObject = (payload) => {
  if (typeof payload !== "object" || payload === null)
    return false;
  if (payload === Object.prototype)
    return false;
  if (Object.getPrototypeOf(payload) === null)
    return true;
  return Object.getPrototypeOf(payload) === Object.prototype;
};
var isEmptyObject = (payload) => isPlainObject(payload) && Object.keys(payload).length === 0;
var isArray = (payload) => Array.isArray(payload);
var isString = (payload) => typeof payload === "string";
var isNumber = (payload) => typeof payload === "number" && !isNaN(payload);
var isBoolean = (payload) => typeof payload === "boolean";
var isRegExp = (payload) => payload instanceof RegExp;
var isMap = (payload) => payload instanceof Map;
var isSet = (payload) => payload instanceof Set;
var isSymbol = (payload) => getType(payload) === "Symbol";
var isDate = (payload) => payload instanceof Date && !isNaN(payload.valueOf());
var isError = (payload) => payload instanceof Error;
var isNaNValue = (payload) => typeof payload === "number" && isNaN(payload);
var isPrimitive = (payload) => isBoolean(payload) || isNull(payload) || isUndefined(payload) || isNumber(payload) || isString(payload) || isSymbol(payload);
var isBigint = (payload) => typeof payload === "bigint";
var isInfinite = (payload) => payload === Infinity || payload === -Infinity;
var isTypedArray = (payload) => ArrayBuffer.isView(payload) && !(payload instanceof DataView);
var isURL = (payload) => payload instanceof URL;

// node_modules/superjson/dist/pathstringifier.js
var escapeKey = (key) => key.replace(/\./g, "\\.");
var stringifyPath = (path) => path.map(String).map(escapeKey).join(".");
var parsePath = (string) => {
  const result = [];
  let segment = "";
  for (let i = 0;i < string.length; i++) {
    let char = string.charAt(i);
    const isEscapedDot = char === "\\" && string.charAt(i + 1) === ".";
    if (isEscapedDot) {
      segment += ".";
      i++;
      continue;
    }
    const isEndOfSegment = char === ".";
    if (isEndOfSegment) {
      result.push(segment);
      segment = "";
      continue;
    }
    segment += char;
  }
  const lastSegment = segment;
  result.push(lastSegment);
  return result;
};

// node_modules/superjson/dist/transformer.js
function simpleTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var simpleRules = [
  simpleTransformation(isUndefined, "undefined", () => null, () => {
    return;
  }),
  simpleTransformation(isBigint, "bigint", (v) => v.toString(), (v) => {
    if (typeof BigInt !== "undefined") {
      return BigInt(v);
    }
    console.error("Please add a BigInt polyfill.");
    return v;
  }),
  simpleTransformation(isDate, "Date", (v) => v.toISOString(), (v) => new Date(v)),
  simpleTransformation(isError, "Error", (v, superJson) => {
    const baseError = {
      name: v.name,
      message: v.message
    };
    superJson.allowedErrorProps.forEach((prop) => {
      baseError[prop] = v[prop];
    });
    return baseError;
  }, (v, superJson) => {
    const e = new Error(v.message);
    e.name = v.name;
    e.stack = v.stack;
    superJson.allowedErrorProps.forEach((prop) => {
      e[prop] = v[prop];
    });
    return e;
  }),
  simpleTransformation(isRegExp, "regexp", (v) => "" + v, (regex) => {
    const body = regex.slice(1, regex.lastIndexOf("/"));
    const flags = regex.slice(regex.lastIndexOf("/") + 1);
    return new RegExp(body, flags);
  }),
  simpleTransformation(isSet, "set", (v) => [...v.values()], (v) => new Set(v)),
  simpleTransformation(isMap, "map", (v) => [...v.entries()], (v) => new Map(v)),
  simpleTransformation((v) => isNaNValue(v) || isInfinite(v), "number", (v) => {
    if (isNaNValue(v)) {
      return "NaN";
    }
    if (v > 0) {
      return "Infinity";
    } else {
      return "-Infinity";
    }
  }, Number),
  simpleTransformation((v) => v === 0 && 1 / v === -Infinity, "number", () => {
    return "-0";
  }, Number),
  simpleTransformation(isURL, "URL", (v) => v.toString(), (v) => new URL(v))
];
function compositeTransformation(isApplicable, annotation, transform, untransform) {
  return {
    isApplicable,
    annotation,
    transform,
    untransform
  };
}
var symbolRule = compositeTransformation((s, superJson) => {
  if (isSymbol(s)) {
    const isRegistered = !!superJson.symbolRegistry.getIdentifier(s);
    return isRegistered;
  }
  return false;
}, (s, superJson) => {
  const identifier = superJson.symbolRegistry.getIdentifier(s);
  return ["symbol", identifier];
}, (v) => v.description, (_, a, superJson) => {
  const value = superJson.symbolRegistry.getValue(a[1]);
  if (!value) {
    throw new Error("Trying to deserialize unknown symbol");
  }
  return value;
});
var constructorToName = [
  Int8Array,
  Uint8Array,
  Int16Array,
  Uint16Array,
  Int32Array,
  Uint32Array,
  Float32Array,
  Float64Array,
  Uint8ClampedArray
].reduce((obj, ctor) => {
  obj[ctor.name] = ctor;
  return obj;
}, {});
var typedArrayRule = compositeTransformation(isTypedArray, (v) => ["typed-array", v.constructor.name], (v) => [...v], (v, a) => {
  const ctor = constructorToName[a[1]];
  if (!ctor) {
    throw new Error("Trying to deserialize unknown typed array");
  }
  return new ctor(v);
});
function isInstanceOfRegisteredClass(potentialClass, superJson) {
  if (potentialClass?.constructor) {
    const isRegistered = !!superJson.classRegistry.getIdentifier(potentialClass.constructor);
    return isRegistered;
  }
  return false;
}
var classRule = compositeTransformation(isInstanceOfRegisteredClass, (clazz, superJson) => {
  const identifier = superJson.classRegistry.getIdentifier(clazz.constructor);
  return ["class", identifier];
}, (clazz, superJson) => {
  const allowedProps = superJson.classRegistry.getAllowedProps(clazz.constructor);
  if (!allowedProps) {
    return { ...clazz };
  }
  const result = {};
  allowedProps.forEach((prop) => {
    result[prop] = clazz[prop];
  });
  return result;
}, (v, a, superJson) => {
  const clazz = superJson.classRegistry.getValue(a[1]);
  if (!clazz) {
    throw new Error(`Trying to deserialize unknown class '${a[1]}' - check https://github.com/blitz-js/superjson/issues/116#issuecomment-773996564`);
  }
  return Object.assign(Object.create(clazz.prototype), v);
});
var customRule = compositeTransformation((value, superJson) => {
  return !!superJson.customTransformerRegistry.findApplicable(value);
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return ["custom", transformer.name];
}, (value, superJson) => {
  const transformer = superJson.customTransformerRegistry.findApplicable(value);
  return transformer.serialize(value);
}, (v, a, superJson) => {
  const transformer = superJson.customTransformerRegistry.findByName(a[1]);
  if (!transformer) {
    throw new Error("Trying to deserialize unknown custom value");
  }
  return transformer.deserialize(v);
});
var compositeRules = [classRule, symbolRule, customRule, typedArrayRule];
var transformValue = (value, superJson) => {
  const applicableCompositeRule = findArr(compositeRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableCompositeRule) {
    return {
      value: applicableCompositeRule.transform(value, superJson),
      type: applicableCompositeRule.annotation(value, superJson)
    };
  }
  const applicableSimpleRule = findArr(simpleRules, (rule) => rule.isApplicable(value, superJson));
  if (applicableSimpleRule) {
    return {
      value: applicableSimpleRule.transform(value, superJson),
      type: applicableSimpleRule.annotation
    };
  }
  return;
};
var simpleRulesByAnnotation = {};
simpleRules.forEach((rule) => {
  simpleRulesByAnnotation[rule.annotation] = rule;
});
var untransformValue = (json, type, superJson) => {
  if (isArray(type)) {
    switch (type[0]) {
      case "symbol":
        return symbolRule.untransform(json, type, superJson);
      case "class":
        return classRule.untransform(json, type, superJson);
      case "custom":
        return customRule.untransform(json, type, superJson);
      case "typed-array":
        return typedArrayRule.untransform(json, type, superJson);
      default:
        throw new Error("Unknown transformation: " + type);
    }
  } else {
    const transformation = simpleRulesByAnnotation[type];
    if (!transformation) {
      throw new Error("Unknown transformation: " + type);
    }
    return transformation.untransform(json, superJson);
  }
};

// node_modules/superjson/dist/accessDeep.js
var getNthKey = (value, n) => {
  if (n > value.size)
    throw new Error("index out of bounds");
  const keys = value.keys();
  while (n > 0) {
    keys.next();
    n--;
  }
  return keys.next().value;
};
function validatePath(path) {
  if (includes(path, "__proto__")) {
    throw new Error("__proto__ is not allowed as a property");
  }
  if (includes(path, "prototype")) {
    throw new Error("prototype is not allowed as a property");
  }
  if (includes(path, "constructor")) {
    throw new Error("constructor is not allowed as a property");
  }
}
var getDeep = (object, path) => {
  validatePath(path);
  for (let i = 0;i < path.length; i++) {
    const key = path[i];
    if (isSet(object)) {
      object = getNthKey(object, +key);
    } else if (isMap(object)) {
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(object, row);
      switch (type) {
        case "key":
          object = keyOfRow;
          break;
        case "value":
          object = object.get(keyOfRow);
          break;
      }
    } else {
      object = object[key];
    }
  }
  return object;
};
var setDeep = (object, path, mapper) => {
  validatePath(path);
  if (path.length === 0) {
    return mapper(object);
  }
  let parent = object;
  for (let i = 0;i < path.length - 1; i++) {
    const key = path[i];
    if (isArray(parent)) {
      const index = +key;
      parent = parent[index];
    } else if (isPlainObject(parent)) {
      parent = parent[key];
    } else if (isSet(parent)) {
      const row = +key;
      parent = getNthKey(parent, row);
    } else if (isMap(parent)) {
      const isEnd = i === path.length - 2;
      if (isEnd) {
        break;
      }
      const row = +key;
      const type = +path[++i] === 0 ? "key" : "value";
      const keyOfRow = getNthKey(parent, row);
      switch (type) {
        case "key":
          parent = keyOfRow;
          break;
        case "value":
          parent = parent.get(keyOfRow);
          break;
      }
    }
  }
  const lastKey = path[path.length - 1];
  if (isArray(parent)) {
    parent[+lastKey] = mapper(parent[+lastKey]);
  } else if (isPlainObject(parent)) {
    parent[lastKey] = mapper(parent[lastKey]);
  }
  if (isSet(parent)) {
    const oldValue = getNthKey(parent, +lastKey);
    const newValue = mapper(oldValue);
    if (oldValue !== newValue) {
      parent.delete(oldValue);
      parent.add(newValue);
    }
  }
  if (isMap(parent)) {
    const row = +path[path.length - 2];
    const keyToRow = getNthKey(parent, row);
    const type = +lastKey === 0 ? "key" : "value";
    switch (type) {
      case "key": {
        const newKey = mapper(keyToRow);
        parent.set(newKey, parent.get(keyToRow));
        if (newKey !== keyToRow) {
          parent.delete(keyToRow);
        }
        break;
      }
      case "value": {
        parent.set(keyToRow, mapper(parent.get(keyToRow)));
        break;
      }
    }
  }
  return object;
};

// node_modules/superjson/dist/plainer.js
function traverse(tree, walker, origin = []) {
  if (!tree) {
    return;
  }
  if (!isArray(tree)) {
    forEach(tree, (subtree, key) => traverse(subtree, walker, [...origin, ...parsePath(key)]));
    return;
  }
  const [nodeValue, children] = tree;
  if (children) {
    forEach(children, (child, key) => {
      traverse(child, walker, [...origin, ...parsePath(key)]);
    });
  }
  walker(nodeValue, origin);
}
function applyValueAnnotations(plain, annotations, superJson) {
  traverse(annotations, (type, path) => {
    plain = setDeep(plain, path, (v) => untransformValue(v, type, superJson));
  });
  return plain;
}
function applyReferentialEqualityAnnotations(plain, annotations) {
  function apply(identicalPaths, path) {
    const object = getDeep(plain, parsePath(path));
    identicalPaths.map(parsePath).forEach((identicalObjectPath) => {
      plain = setDeep(plain, identicalObjectPath, () => object);
    });
  }
  if (isArray(annotations)) {
    const [root, other] = annotations;
    root.forEach((identicalPath) => {
      plain = setDeep(plain, parsePath(identicalPath), () => plain);
    });
    if (other) {
      forEach(other, apply);
    }
  } else {
    forEach(annotations, apply);
  }
  return plain;
}
var isDeep = (object, superJson) => isPlainObject(object) || isArray(object) || isMap(object) || isSet(object) || isInstanceOfRegisteredClass(object, superJson);
function addIdentity(object, path, identities) {
  const existingSet = identities.get(object);
  if (existingSet) {
    existingSet.push(path);
  } else {
    identities.set(object, [path]);
  }
}
function generateReferentialEqualityAnnotations(identitites, dedupe) {
  const result = {};
  let rootEqualityPaths = undefined;
  identitites.forEach((paths) => {
    if (paths.length <= 1) {
      return;
    }
    if (!dedupe) {
      paths = paths.map((path) => path.map(String)).sort((a, b) => a.length - b.length);
    }
    const [representativePath, ...identicalPaths] = paths;
    if (representativePath.length === 0) {
      rootEqualityPaths = identicalPaths.map(stringifyPath);
    } else {
      result[stringifyPath(representativePath)] = identicalPaths.map(stringifyPath);
    }
  });
  if (rootEqualityPaths) {
    if (isEmptyObject(result)) {
      return [rootEqualityPaths];
    } else {
      return [rootEqualityPaths, result];
    }
  } else {
    return isEmptyObject(result) ? undefined : result;
  }
}
var walker = (object, identities, superJson, dedupe, path = [], objectsInThisPath = [], seenObjects = new Map) => {
  const primitive = isPrimitive(object);
  if (!primitive) {
    addIdentity(object, path, identities);
    const seen = seenObjects.get(object);
    if (seen) {
      return dedupe ? {
        transformedValue: null
      } : seen;
    }
  }
  if (!isDeep(object, superJson)) {
    const transformed2 = transformValue(object, superJson);
    const result2 = transformed2 ? {
      transformedValue: transformed2.value,
      annotations: [transformed2.type]
    } : {
      transformedValue: object
    };
    if (!primitive) {
      seenObjects.set(object, result2);
    }
    return result2;
  }
  if (includes(objectsInThisPath, object)) {
    return {
      transformedValue: null
    };
  }
  const transformationResult = transformValue(object, superJson);
  const transformed = transformationResult?.value ?? object;
  const transformedValue = isArray(transformed) ? [] : {};
  const innerAnnotations = {};
  forEach(transformed, (value, index) => {
    if (index === "__proto__" || index === "constructor" || index === "prototype") {
      throw new Error(`Detected property ${index}. This is a prototype pollution risk, please remove it from your object.`);
    }
    const recursiveResult = walker(value, identities, superJson, dedupe, [...path, index], [...objectsInThisPath, object], seenObjects);
    transformedValue[index] = recursiveResult.transformedValue;
    if (isArray(recursiveResult.annotations)) {
      innerAnnotations[index] = recursiveResult.annotations;
    } else if (isPlainObject(recursiveResult.annotations)) {
      forEach(recursiveResult.annotations, (tree, key) => {
        innerAnnotations[escapeKey(index) + "." + key] = tree;
      });
    }
  });
  const result = isEmptyObject(innerAnnotations) ? {
    transformedValue,
    annotations: transformationResult ? [transformationResult.type] : undefined
  } : {
    transformedValue,
    annotations: transformationResult ? [transformationResult.type, innerAnnotations] : innerAnnotations
  };
  if (!primitive) {
    seenObjects.set(object, result);
  }
  return result;
};

// node_modules/is-what/dist/index.js
function getType2(payload) {
  return Object.prototype.toString.call(payload).slice(8, -1);
}
function isArray2(payload) {
  return getType2(payload) === "Array";
}
function isPlainObject2(payload) {
  if (getType2(payload) !== "Object")
    return false;
  const prototype = Object.getPrototypeOf(payload);
  return !!prototype && prototype.constructor === Object && prototype === Object.prototype;
}
function isNull2(payload) {
  return getType2(payload) === "Null";
}
function isOneOf(a, b, c, d, e) {
  return (value) => a(value) || b(value) || !!c && c(value) || !!d && d(value) || !!e && e(value);
}
function isUndefined2(payload) {
  return getType2(payload) === "Undefined";
}
var isNullOrUndefined = isOneOf(isNull2, isUndefined2);

// node_modules/copy-anything/dist/index.js
function assignProp(carry, key, newVal, originalObject, includeNonenumerable) {
  const propType = {}.propertyIsEnumerable.call(originalObject, key) ? "enumerable" : "nonenumerable";
  if (propType === "enumerable")
    carry[key] = newVal;
  if (includeNonenumerable && propType === "nonenumerable") {
    Object.defineProperty(carry, key, {
      value: newVal,
      enumerable: false,
      writable: true,
      configurable: true
    });
  }
}
function copy(target, options = {}) {
  if (isArray2(target)) {
    return target.map((item) => copy(item, options));
  }
  if (!isPlainObject2(target)) {
    return target;
  }
  const props = Object.getOwnPropertyNames(target);
  const symbols = Object.getOwnPropertySymbols(target);
  return [...props, ...symbols].reduce((carry, key) => {
    if (isArray2(options.props) && !options.props.includes(key)) {
      return carry;
    }
    const val = target[key];
    const newVal = copy(val, options);
    assignProp(carry, key, newVal, target, options.nonenumerable);
    return carry;
  }, {});
}

// node_modules/superjson/dist/index.js
class SuperJSON {
  constructor({ dedupe = false } = {}) {
    this.classRegistry = new ClassRegistry;
    this.symbolRegistry = new Registry((s) => s.description ?? "");
    this.customTransformerRegistry = new CustomTransformerRegistry;
    this.allowedErrorProps = [];
    this.dedupe = dedupe;
  }
  serialize(object) {
    const identities = new Map;
    const output = walker(object, identities, this, this.dedupe);
    const res = {
      json: output.transformedValue
    };
    if (output.annotations) {
      res.meta = {
        ...res.meta,
        values: output.annotations
      };
    }
    const equalityAnnotations = generateReferentialEqualityAnnotations(identities, this.dedupe);
    if (equalityAnnotations) {
      res.meta = {
        ...res.meta,
        referentialEqualities: equalityAnnotations
      };
    }
    return res;
  }
  deserialize(payload) {
    const { json, meta } = payload;
    let result = copy(json);
    if (meta?.values) {
      result = applyValueAnnotations(result, meta.values, this);
    }
    if (meta?.referentialEqualities) {
      result = applyReferentialEqualityAnnotations(result, meta.referentialEqualities);
    }
    return result;
  }
  stringify(object) {
    return JSON.stringify(this.serialize(object));
  }
  parse(string) {
    return this.deserialize(JSON.parse(string));
  }
  registerClass(v, options) {
    this.classRegistry.register(v, options);
  }
  registerSymbol(v, identifier) {
    this.symbolRegistry.register(v, identifier);
  }
  registerCustom(transformer, name) {
    this.customTransformerRegistry.register({
      name,
      ...transformer
    });
  }
  allowErrorProps(...props) {
    this.allowedErrorProps.push(...props);
  }
}
SuperJSON.defaultInstance = new SuperJSON;
SuperJSON.serialize = SuperJSON.defaultInstance.serialize.bind(SuperJSON.defaultInstance);
SuperJSON.deserialize = SuperJSON.defaultInstance.deserialize.bind(SuperJSON.defaultInstance);
SuperJSON.stringify = SuperJSON.defaultInstance.stringify.bind(SuperJSON.defaultInstance);
SuperJSON.parse = SuperJSON.defaultInstance.parse.bind(SuperJSON.defaultInstance);
SuperJSON.registerClass = SuperJSON.defaultInstance.registerClass.bind(SuperJSON.defaultInstance);
SuperJSON.registerSymbol = SuperJSON.defaultInstance.registerSymbol.bind(SuperJSON.defaultInstance);
SuperJSON.registerCustom = SuperJSON.defaultInstance.registerCustom.bind(SuperJSON.defaultInstance);
SuperJSON.allowErrorProps = SuperJSON.defaultInstance.allowErrorProps.bind(SuperJSON.defaultInstance);
var serialize = SuperJSON.serialize;
var deserialize = SuperJSON.deserialize;
var stringify = SuperJSON.stringify;
var parse = SuperJSON.parse;
var registerClass = SuperJSON.registerClass;
var registerCustom = SuperJSON.registerCustom;
var registerSymbol = SuperJSON.registerSymbol;
var allowErrorProps = SuperJSON.allowErrorProps;

// backend/trpc/create-context.ts
var createContext = async (opts) => {
  return {
    req: opts.req
  };
};
var t = initTRPC.context().create({
  transformer: SuperJSON
});
var createTRPCRouter = t.router;
var publicProcedure = t.procedure;

// node_modules/zod/lib/index.mjs
var util;
(function(util2) {
  util2.assertEqual = (val) => val;
  function assertIs(_arg) {}
  util2.assertIs = assertIs;
  function assertNever(_x) {
    throw new Error;
  }
  util2.assertNever = assertNever;
  util2.arrayToEnum = (items) => {
    const obj = {};
    for (const item of items) {
      obj[item] = item;
    }
    return obj;
  };
  util2.getValidEnumValues = (obj) => {
    const validKeys = util2.objectKeys(obj).filter((k) => typeof obj[obj[k]] !== "number");
    const filtered = {};
    for (const k of validKeys) {
      filtered[k] = obj[k];
    }
    return util2.objectValues(filtered);
  };
  util2.objectValues = (obj) => {
    return util2.objectKeys(obj).map(function(e) {
      return obj[e];
    });
  };
  util2.objectKeys = typeof Object.keys === "function" ? (obj) => Object.keys(obj) : (object) => {
    const keys = [];
    for (const key in object) {
      if (Object.prototype.hasOwnProperty.call(object, key)) {
        keys.push(key);
      }
    }
    return keys;
  };
  util2.find = (arr, checker) => {
    for (const item of arr) {
      if (checker(item))
        return item;
    }
    return;
  };
  util2.isInteger = typeof Number.isInteger === "function" ? (val) => Number.isInteger(val) : (val) => typeof val === "number" && isFinite(val) && Math.floor(val) === val;
  function joinValues(array, separator = " | ") {
    return array.map((val) => typeof val === "string" ? `'${val}'` : val).join(separator);
  }
  util2.joinValues = joinValues;
  util2.jsonStringifyReplacer = (_, value) => {
    if (typeof value === "bigint") {
      return value.toString();
    }
    return value;
  };
})(util || (util = {}));
var objectUtil;
(function(objectUtil2) {
  objectUtil2.mergeShapes = (first, second) => {
    return {
      ...first,
      ...second
    };
  };
})(objectUtil || (objectUtil = {}));
var ZodParsedType = util.arrayToEnum([
  "string",
  "nan",
  "number",
  "integer",
  "float",
  "boolean",
  "date",
  "bigint",
  "symbol",
  "function",
  "undefined",
  "null",
  "array",
  "object",
  "unknown",
  "promise",
  "void",
  "never",
  "map",
  "set"
]);
var getParsedType = (data) => {
  const t2 = typeof data;
  switch (t2) {
    case "undefined":
      return ZodParsedType.undefined;
    case "string":
      return ZodParsedType.string;
    case "number":
      return isNaN(data) ? ZodParsedType.nan : ZodParsedType.number;
    case "boolean":
      return ZodParsedType.boolean;
    case "function":
      return ZodParsedType.function;
    case "bigint":
      return ZodParsedType.bigint;
    case "symbol":
      return ZodParsedType.symbol;
    case "object":
      if (Array.isArray(data)) {
        return ZodParsedType.array;
      }
      if (data === null) {
        return ZodParsedType.null;
      }
      if (data.then && typeof data.then === "function" && data.catch && typeof data.catch === "function") {
        return ZodParsedType.promise;
      }
      if (typeof Map !== "undefined" && data instanceof Map) {
        return ZodParsedType.map;
      }
      if (typeof Set !== "undefined" && data instanceof Set) {
        return ZodParsedType.set;
      }
      if (typeof Date !== "undefined" && data instanceof Date) {
        return ZodParsedType.date;
      }
      return ZodParsedType.object;
    default:
      return ZodParsedType.unknown;
  }
};
var ZodIssueCode = util.arrayToEnum([
  "invalid_type",
  "invalid_literal",
  "custom",
  "invalid_union",
  "invalid_union_discriminator",
  "invalid_enum_value",
  "unrecognized_keys",
  "invalid_arguments",
  "invalid_return_type",
  "invalid_date",
  "invalid_string",
  "too_small",
  "too_big",
  "invalid_intersection_types",
  "not_multiple_of",
  "not_finite"
]);
var quotelessJson = (obj) => {
  const json = JSON.stringify(obj, null, 2);
  return json.replace(/"([^"]+)":/g, "$1:");
};

class ZodError extends Error {
  get errors() {
    return this.issues;
  }
  constructor(issues) {
    super();
    this.issues = [];
    this.addIssue = (sub) => {
      this.issues = [...this.issues, sub];
    };
    this.addIssues = (subs = []) => {
      this.issues = [...this.issues, ...subs];
    };
    const actualProto = new.target.prototype;
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(this, actualProto);
    } else {
      this.__proto__ = actualProto;
    }
    this.name = "ZodError";
    this.issues = issues;
  }
  format(_mapper) {
    const mapper = _mapper || function(issue) {
      return issue.message;
    };
    const fieldErrors = { _errors: [] };
    const processError = (error) => {
      for (const issue of error.issues) {
        if (issue.code === "invalid_union") {
          issue.unionErrors.map(processError);
        } else if (issue.code === "invalid_return_type") {
          processError(issue.returnTypeError);
        } else if (issue.code === "invalid_arguments") {
          processError(issue.argumentsError);
        } else if (issue.path.length === 0) {
          fieldErrors._errors.push(mapper(issue));
        } else {
          let curr = fieldErrors;
          let i = 0;
          while (i < issue.path.length) {
            const el = issue.path[i];
            const terminal = i === issue.path.length - 1;
            if (!terminal) {
              curr[el] = curr[el] || { _errors: [] };
            } else {
              curr[el] = curr[el] || { _errors: [] };
              curr[el]._errors.push(mapper(issue));
            }
            curr = curr[el];
            i++;
          }
        }
      }
    };
    processError(this);
    return fieldErrors;
  }
  static assert(value) {
    if (!(value instanceof ZodError)) {
      throw new Error(`Not a ZodError: ${value}`);
    }
  }
  toString() {
    return this.message;
  }
  get message() {
    return JSON.stringify(this.issues, util.jsonStringifyReplacer, 2);
  }
  get isEmpty() {
    return this.issues.length === 0;
  }
  flatten(mapper = (issue) => issue.message) {
    const fieldErrors = {};
    const formErrors = [];
    for (const sub of this.issues) {
      if (sub.path.length > 0) {
        fieldErrors[sub.path[0]] = fieldErrors[sub.path[0]] || [];
        fieldErrors[sub.path[0]].push(mapper(sub));
      } else {
        formErrors.push(mapper(sub));
      }
    }
    return { formErrors, fieldErrors };
  }
  get formErrors() {
    return this.flatten();
  }
}
ZodError.create = (issues) => {
  const error = new ZodError(issues);
  return error;
};
var errorMap = (issue, _ctx) => {
  let message;
  switch (issue.code) {
    case ZodIssueCode.invalid_type:
      if (issue.received === ZodParsedType.undefined) {
        message = "Required";
      } else {
        message = `Expected ${issue.expected}, received ${issue.received}`;
      }
      break;
    case ZodIssueCode.invalid_literal:
      message = `Invalid literal value, expected ${JSON.stringify(issue.expected, util.jsonStringifyReplacer)}`;
      break;
    case ZodIssueCode.unrecognized_keys:
      message = `Unrecognized key(s) in object: ${util.joinValues(issue.keys, ", ")}`;
      break;
    case ZodIssueCode.invalid_union:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_union_discriminator:
      message = `Invalid discriminator value. Expected ${util.joinValues(issue.options)}`;
      break;
    case ZodIssueCode.invalid_enum_value:
      message = `Invalid enum value. Expected ${util.joinValues(issue.options)}, received '${issue.received}'`;
      break;
    case ZodIssueCode.invalid_arguments:
      message = `Invalid function arguments`;
      break;
    case ZodIssueCode.invalid_return_type:
      message = `Invalid function return type`;
      break;
    case ZodIssueCode.invalid_date:
      message = `Invalid date`;
      break;
    case ZodIssueCode.invalid_string:
      if (typeof issue.validation === "object") {
        if ("includes" in issue.validation) {
          message = `Invalid input: must include "${issue.validation.includes}"`;
          if (typeof issue.validation.position === "number") {
            message = `${message} at one or more positions greater than or equal to ${issue.validation.position}`;
          }
        } else if ("startsWith" in issue.validation) {
          message = `Invalid input: must start with "${issue.validation.startsWith}"`;
        } else if ("endsWith" in issue.validation) {
          message = `Invalid input: must end with "${issue.validation.endsWith}"`;
        } else {
          util.assertNever(issue.validation);
        }
      } else if (issue.validation !== "regex") {
        message = `Invalid ${issue.validation}`;
      } else {
        message = "Invalid";
      }
      break;
    case ZodIssueCode.too_small:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `more than`} ${issue.minimum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? "exactly" : issue.inclusive ? `at least` : `over`} ${issue.minimum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${issue.minimum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly equal to ` : issue.inclusive ? `greater than or equal to ` : `greater than `}${new Date(Number(issue.minimum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.too_big:
      if (issue.type === "array")
        message = `Array must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `less than`} ${issue.maximum} element(s)`;
      else if (issue.type === "string")
        message = `String must contain ${issue.exact ? `exactly` : issue.inclusive ? `at most` : `under`} ${issue.maximum} character(s)`;
      else if (issue.type === "number")
        message = `Number must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "bigint")
        message = `BigInt must be ${issue.exact ? `exactly` : issue.inclusive ? `less than or equal to` : `less than`} ${issue.maximum}`;
      else if (issue.type === "date")
        message = `Date must be ${issue.exact ? `exactly` : issue.inclusive ? `smaller than or equal to` : `smaller than`} ${new Date(Number(issue.maximum))}`;
      else
        message = "Invalid input";
      break;
    case ZodIssueCode.custom:
      message = `Invalid input`;
      break;
    case ZodIssueCode.invalid_intersection_types:
      message = `Intersection results could not be merged`;
      break;
    case ZodIssueCode.not_multiple_of:
      message = `Number must be a multiple of ${issue.multipleOf}`;
      break;
    case ZodIssueCode.not_finite:
      message = "Number must be finite";
      break;
    default:
      message = _ctx.defaultError;
      util.assertNever(issue);
  }
  return { message };
};
var overrideErrorMap = errorMap;
function setErrorMap(map) {
  overrideErrorMap = map;
}
function getErrorMap() {
  return overrideErrorMap;
}
var makeIssue = (params) => {
  const { data, path, errorMaps, issueData } = params;
  const fullPath = [...path, ...issueData.path || []];
  const fullIssue = {
    ...issueData,
    path: fullPath
  };
  if (issueData.message !== undefined) {
    return {
      ...issueData,
      path: fullPath,
      message: issueData.message
    };
  }
  let errorMessage = "";
  const maps = errorMaps.filter((m) => !!m).slice().reverse();
  for (const map of maps) {
    errorMessage = map(fullIssue, { data, defaultError: errorMessage }).message;
  }
  return {
    ...issueData,
    path: fullPath,
    message: errorMessage
  };
};
var EMPTY_PATH = [];
function addIssueToContext(ctx, issueData) {
  const overrideMap = getErrorMap();
  const issue = makeIssue({
    issueData,
    data: ctx.data,
    path: ctx.path,
    errorMaps: [
      ctx.common.contextualErrorMap,
      ctx.schemaErrorMap,
      overrideMap,
      overrideMap === errorMap ? undefined : errorMap
    ].filter((x) => !!x)
  });
  ctx.common.issues.push(issue);
}

class ParseStatus {
  constructor() {
    this.value = "valid";
  }
  dirty() {
    if (this.value === "valid")
      this.value = "dirty";
  }
  abort() {
    if (this.value !== "aborted")
      this.value = "aborted";
  }
  static mergeArray(status, results) {
    const arrayValue = [];
    for (const s of results) {
      if (s.status === "aborted")
        return INVALID;
      if (s.status === "dirty")
        status.dirty();
      arrayValue.push(s.value);
    }
    return { status: status.value, value: arrayValue };
  }
  static async mergeObjectAsync(status, pairs) {
    const syncPairs = [];
    for (const pair of pairs) {
      const key = await pair.key;
      const value = await pair.value;
      syncPairs.push({
        key,
        value
      });
    }
    return ParseStatus.mergeObjectSync(status, syncPairs);
  }
  static mergeObjectSync(status, pairs) {
    const finalObject = {};
    for (const pair of pairs) {
      const { key, value } = pair;
      if (key.status === "aborted")
        return INVALID;
      if (value.status === "aborted")
        return INVALID;
      if (key.status === "dirty")
        status.dirty();
      if (value.status === "dirty")
        status.dirty();
      if (key.value !== "__proto__" && (typeof value.value !== "undefined" || pair.alwaysSet)) {
        finalObject[key.value] = value.value;
      }
    }
    return { status: status.value, value: finalObject };
  }
}
var INVALID = Object.freeze({
  status: "aborted"
});
var DIRTY = (value) => ({ status: "dirty", value });
var OK = (value) => ({ status: "valid", value });
var isAborted = (x) => x.status === "aborted";
var isDirty = (x) => x.status === "dirty";
var isValid = (x) => x.status === "valid";
var isAsync = (x) => typeof Promise !== "undefined" && x instanceof Promise;
function __classPrivateFieldGet(receiver, state, kind, f) {
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a getter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot read private member from an object whose class did not declare it");
  return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}
function __classPrivateFieldSet(receiver, state, value, kind, f) {
  if (kind === "m")
    throw new TypeError("Private method is not writable");
  if (kind === "a" && !f)
    throw new TypeError("Private accessor was defined without a setter");
  if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver))
    throw new TypeError("Cannot write private member to an object whose class did not declare it");
  return kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value), value;
}
var errorUtil;
(function(errorUtil2) {
  errorUtil2.errToObj = (message) => typeof message === "string" ? { message } : message || {};
  errorUtil2.toString = (message) => typeof message === "string" ? message : message === null || message === undefined ? undefined : message.message;
})(errorUtil || (errorUtil = {}));
var _ZodEnum_cache;
var _ZodNativeEnum_cache;

class ParseInputLazyPath {
  constructor(parent, value, path, key) {
    this._cachedPath = [];
    this.parent = parent;
    this.data = value;
    this._path = path;
    this._key = key;
  }
  get path() {
    if (!this._cachedPath.length) {
      if (this._key instanceof Array) {
        this._cachedPath.push(...this._path, ...this._key);
      } else {
        this._cachedPath.push(...this._path, this._key);
      }
    }
    return this._cachedPath;
  }
}
var handleResult = (ctx, result) => {
  if (isValid(result)) {
    return { success: true, data: result.value };
  } else {
    if (!ctx.common.issues.length) {
      throw new Error("Validation failed but no issues detected.");
    }
    return {
      success: false,
      get error() {
        if (this._error)
          return this._error;
        const error = new ZodError(ctx.common.issues);
        this._error = error;
        return this._error;
      }
    };
  }
};
function processCreateParams(params) {
  if (!params)
    return {};
  const { errorMap: errorMap2, invalid_type_error, required_error, description } = params;
  if (errorMap2 && (invalid_type_error || required_error)) {
    throw new Error(`Can't use "invalid_type_error" or "required_error" in conjunction with custom error map.`);
  }
  if (errorMap2)
    return { errorMap: errorMap2, description };
  const customMap = (iss, ctx) => {
    var _a, _b;
    const { message } = params;
    if (iss.code === "invalid_enum_value") {
      return { message: message !== null && message !== undefined ? message : ctx.defaultError };
    }
    if (typeof ctx.data === "undefined") {
      return { message: (_a = message !== null && message !== undefined ? message : required_error) !== null && _a !== undefined ? _a : ctx.defaultError };
    }
    if (iss.code !== "invalid_type")
      return { message: ctx.defaultError };
    return { message: (_b = message !== null && message !== undefined ? message : invalid_type_error) !== null && _b !== undefined ? _b : ctx.defaultError };
  };
  return { errorMap: customMap, description };
}

class ZodType {
  get description() {
    return this._def.description;
  }
  _getType(input) {
    return getParsedType(input.data);
  }
  _getOrReturnCtx(input, ctx) {
    return ctx || {
      common: input.parent.common,
      data: input.data,
      parsedType: getParsedType(input.data),
      schemaErrorMap: this._def.errorMap,
      path: input.path,
      parent: input.parent
    };
  }
  _processInputParams(input) {
    return {
      status: new ParseStatus,
      ctx: {
        common: input.parent.common,
        data: input.data,
        parsedType: getParsedType(input.data),
        schemaErrorMap: this._def.errorMap,
        path: input.path,
        parent: input.parent
      }
    };
  }
  _parseSync(input) {
    const result = this._parse(input);
    if (isAsync(result)) {
      throw new Error("Synchronous parse encountered promise.");
    }
    return result;
  }
  _parseAsync(input) {
    const result = this._parse(input);
    return Promise.resolve(result);
  }
  parse(data, params) {
    const result = this.safeParse(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  safeParse(data, params) {
    var _a;
    const ctx = {
      common: {
        issues: [],
        async: (_a = params === null || params === undefined ? undefined : params.async) !== null && _a !== undefined ? _a : false,
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const result = this._parseSync({ data, path: ctx.path, parent: ctx });
    return handleResult(ctx, result);
  }
  "~validate"(data) {
    var _a, _b;
    const ctx = {
      common: {
        issues: [],
        async: !!this["~standard"].async
      },
      path: [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    if (!this["~standard"].async) {
      try {
        const result = this._parseSync({ data, path: [], parent: ctx });
        return isValid(result) ? {
          value: result.value
        } : {
          issues: ctx.common.issues
        };
      } catch (err) {
        if ((_b = (_a = err === null || err === undefined ? undefined : err.message) === null || _a === undefined ? undefined : _a.toLowerCase()) === null || _b === undefined ? undefined : _b.includes("encountered")) {
          this["~standard"].async = true;
        }
        ctx.common = {
          issues: [],
          async: true
        };
      }
    }
    return this._parseAsync({ data, path: [], parent: ctx }).then((result) => isValid(result) ? {
      value: result.value
    } : {
      issues: ctx.common.issues
    });
  }
  async parseAsync(data, params) {
    const result = await this.safeParseAsync(data, params);
    if (result.success)
      return result.data;
    throw result.error;
  }
  async safeParseAsync(data, params) {
    const ctx = {
      common: {
        issues: [],
        contextualErrorMap: params === null || params === undefined ? undefined : params.errorMap,
        async: true
      },
      path: (params === null || params === undefined ? undefined : params.path) || [],
      schemaErrorMap: this._def.errorMap,
      parent: null,
      data,
      parsedType: getParsedType(data)
    };
    const maybeAsyncResult = this._parse({ data, path: ctx.path, parent: ctx });
    const result = await (isAsync(maybeAsyncResult) ? maybeAsyncResult : Promise.resolve(maybeAsyncResult));
    return handleResult(ctx, result);
  }
  refine(check, message) {
    const getIssueProperties = (val) => {
      if (typeof message === "string" || typeof message === "undefined") {
        return { message };
      } else if (typeof message === "function") {
        return message(val);
      } else {
        return message;
      }
    };
    return this._refinement((val, ctx) => {
      const result = check(val);
      const setError = () => ctx.addIssue({
        code: ZodIssueCode.custom,
        ...getIssueProperties(val)
      });
      if (typeof Promise !== "undefined" && result instanceof Promise) {
        return result.then((data) => {
          if (!data) {
            setError();
            return false;
          } else {
            return true;
          }
        });
      }
      if (!result) {
        setError();
        return false;
      } else {
        return true;
      }
    });
  }
  refinement(check, refinementData) {
    return this._refinement((val, ctx) => {
      if (!check(val)) {
        ctx.addIssue(typeof refinementData === "function" ? refinementData(val, ctx) : refinementData);
        return false;
      } else {
        return true;
      }
    });
  }
  _refinement(refinement) {
    return new ZodEffects({
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "refinement", refinement }
    });
  }
  superRefine(refinement) {
    return this._refinement(refinement);
  }
  constructor(def) {
    this.spa = this.safeParseAsync;
    this._def = def;
    this.parse = this.parse.bind(this);
    this.safeParse = this.safeParse.bind(this);
    this.parseAsync = this.parseAsync.bind(this);
    this.safeParseAsync = this.safeParseAsync.bind(this);
    this.spa = this.spa.bind(this);
    this.refine = this.refine.bind(this);
    this.refinement = this.refinement.bind(this);
    this.superRefine = this.superRefine.bind(this);
    this.optional = this.optional.bind(this);
    this.nullable = this.nullable.bind(this);
    this.nullish = this.nullish.bind(this);
    this.array = this.array.bind(this);
    this.promise = this.promise.bind(this);
    this.or = this.or.bind(this);
    this.and = this.and.bind(this);
    this.transform = this.transform.bind(this);
    this.brand = this.brand.bind(this);
    this.default = this.default.bind(this);
    this.catch = this.catch.bind(this);
    this.describe = this.describe.bind(this);
    this.pipe = this.pipe.bind(this);
    this.readonly = this.readonly.bind(this);
    this.isNullable = this.isNullable.bind(this);
    this.isOptional = this.isOptional.bind(this);
    this["~standard"] = {
      version: 1,
      vendor: "zod",
      validate: (data) => this["~validate"](data)
    };
  }
  optional() {
    return ZodOptional.create(this, this._def);
  }
  nullable() {
    return ZodNullable.create(this, this._def);
  }
  nullish() {
    return this.nullable().optional();
  }
  array() {
    return ZodArray.create(this);
  }
  promise() {
    return ZodPromise.create(this, this._def);
  }
  or(option) {
    return ZodUnion.create([this, option], this._def);
  }
  and(incoming) {
    return ZodIntersection.create(this, incoming, this._def);
  }
  transform(transform) {
    return new ZodEffects({
      ...processCreateParams(this._def),
      schema: this,
      typeName: ZodFirstPartyTypeKind.ZodEffects,
      effect: { type: "transform", transform }
    });
  }
  default(def) {
    const defaultValueFunc = typeof def === "function" ? def : () => def;
    return new ZodDefault({
      ...processCreateParams(this._def),
      innerType: this,
      defaultValue: defaultValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodDefault
    });
  }
  brand() {
    return new ZodBranded({
      typeName: ZodFirstPartyTypeKind.ZodBranded,
      type: this,
      ...processCreateParams(this._def)
    });
  }
  catch(def) {
    const catchValueFunc = typeof def === "function" ? def : () => def;
    return new ZodCatch({
      ...processCreateParams(this._def),
      innerType: this,
      catchValue: catchValueFunc,
      typeName: ZodFirstPartyTypeKind.ZodCatch
    });
  }
  describe(description) {
    const This = this.constructor;
    return new This({
      ...this._def,
      description
    });
  }
  pipe(target) {
    return ZodPipeline.create(this, target);
  }
  readonly() {
    return ZodReadonly.create(this);
  }
  isOptional() {
    return this.safeParse(undefined).success;
  }
  isNullable() {
    return this.safeParse(null).success;
  }
}
var cuidRegex = /^c[^\s-]{8,}$/i;
var cuid2Regex = /^[0-9a-z]+$/;
var ulidRegex = /^[0-9A-HJKMNP-TV-Z]{26}$/i;
var uuidRegex = /^[0-9a-fA-F]{8}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{4}\b-[0-9a-fA-F]{12}$/i;
var nanoidRegex = /^[a-z0-9_-]{21}$/i;
var jwtRegex = /^[A-Za-z0-9-_]+\.[A-Za-z0-9-_]+\.[A-Za-z0-9-_]*$/;
var durationRegex = /^[-+]?P(?!$)(?:(?:[-+]?\d+Y)|(?:[-+]?\d+[.,]\d+Y$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:(?:[-+]?\d+W)|(?:[-+]?\d+[.,]\d+W$))?(?:(?:[-+]?\d+D)|(?:[-+]?\d+[.,]\d+D$))?(?:T(?=[\d+-])(?:(?:[-+]?\d+H)|(?:[-+]?\d+[.,]\d+H$))?(?:(?:[-+]?\d+M)|(?:[-+]?\d+[.,]\d+M$))?(?:[-+]?\d+(?:[.,]\d+)?S)?)??$/;
var emailRegex = /^(?!\.)(?!.*\.\.)([A-Z0-9_'+\-\.]*)[A-Z0-9_+-]@([A-Z0-9][A-Z0-9\-]*\.)+[A-Z]{2,}$/i;
var _emojiRegex = `^(\\p{Extended_Pictographic}|\\p{Emoji_Component})+$`;
var emojiRegex;
var ipv4Regex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])$/;
var ipv4CidrRegex = /^(?:(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\.){3}(?:25[0-5]|2[0-4][0-9]|1[0-9][0-9]|[1-9][0-9]|[0-9])\/(3[0-2]|[12]?[0-9])$/;
var ipv6Regex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))$/;
var ipv6CidrRegex = /^(([0-9a-fA-F]{1,4}:){7,7}[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,7}:|([0-9a-fA-F]{1,4}:){1,6}:[0-9a-fA-F]{1,4}|([0-9a-fA-F]{1,4}:){1,5}(:[0-9a-fA-F]{1,4}){1,2}|([0-9a-fA-F]{1,4}:){1,4}(:[0-9a-fA-F]{1,4}){1,3}|([0-9a-fA-F]{1,4}:){1,3}(:[0-9a-fA-F]{1,4}){1,4}|([0-9a-fA-F]{1,4}:){1,2}(:[0-9a-fA-F]{1,4}){1,5}|[0-9a-fA-F]{1,4}:((:[0-9a-fA-F]{1,4}){1,6})|:((:[0-9a-fA-F]{1,4}){1,7}|:)|fe80:(:[0-9a-fA-F]{0,4}){0,4}%[0-9a-zA-Z]{1,}|::(ffff(:0{1,4}){0,1}:){0,1}((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])|([0-9a-fA-F]{1,4}:){1,4}:((25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9])\.){3,3}(25[0-5]|(2[0-4]|1{0,1}[0-9]){0,1}[0-9]))\/(12[0-8]|1[01][0-9]|[1-9]?[0-9])$/;
var base64Regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
var base64urlRegex = /^([0-9a-zA-Z-_]{4})*(([0-9a-zA-Z-_]{2}(==)?)|([0-9a-zA-Z-_]{3}(=)?))?$/;
var dateRegexSource = `((\\d\\d[2468][048]|\\d\\d[13579][26]|\\d\\d0[48]|[02468][048]00|[13579][26]00)-02-29|\\d{4}-((0[13578]|1[02])-(0[1-9]|[12]\\d|3[01])|(0[469]|11)-(0[1-9]|[12]\\d|30)|(02)-(0[1-9]|1\\d|2[0-8])))`;
var dateRegex = new RegExp(`^${dateRegexSource}$`);
function timeRegexSource(args) {
  let regex = `([01]\\d|2[0-3]):[0-5]\\d:[0-5]\\d`;
  if (args.precision) {
    regex = `${regex}\\.\\d{${args.precision}}`;
  } else if (args.precision == null) {
    regex = `${regex}(\\.\\d+)?`;
  }
  return regex;
}
function timeRegex(args) {
  return new RegExp(`^${timeRegexSource(args)}$`);
}
function datetimeRegex(args) {
  let regex = `${dateRegexSource}T${timeRegexSource(args)}`;
  const opts = [];
  opts.push(args.local ? `Z?` : `Z`);
  if (args.offset)
    opts.push(`([+-]\\d{2}:?\\d{2})`);
  regex = `${regex}(${opts.join("|")})`;
  return new RegExp(`^${regex}$`);
}
function isValidIP(ip, version) {
  if ((version === "v4" || !version) && ipv4Regex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6Regex.test(ip)) {
    return true;
  }
  return false;
}
function isValidJWT(jwt, alg) {
  if (!jwtRegex.test(jwt))
    return false;
  try {
    const [header] = jwt.split(".");
    const base64 = header.replace(/-/g, "+").replace(/_/g, "/").padEnd(header.length + (4 - header.length % 4) % 4, "=");
    const decoded = JSON.parse(atob(base64));
    if (typeof decoded !== "object" || decoded === null)
      return false;
    if (!decoded.typ || !decoded.alg)
      return false;
    if (alg && decoded.alg !== alg)
      return false;
    return true;
  } catch (_a) {
    return false;
  }
}
function isValidCidr(ip, version) {
  if ((version === "v4" || !version) && ipv4CidrRegex.test(ip)) {
    return true;
  }
  if ((version === "v6" || !version) && ipv6CidrRegex.test(ip)) {
    return true;
  }
  return false;
}

class ZodString extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = String(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.string) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.string,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.length < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.length > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "string",
            inclusive: true,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "length") {
        const tooBig = input.data.length > check.value;
        const tooSmall = input.data.length < check.value;
        if (tooBig || tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          if (tooBig) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_big,
              maximum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          } else if (tooSmall) {
            addIssueToContext(ctx, {
              code: ZodIssueCode.too_small,
              minimum: check.value,
              type: "string",
              inclusive: true,
              exact: true,
              message: check.message
            });
          }
          status.dirty();
        }
      } else if (check.kind === "email") {
        if (!emailRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "email",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "emoji") {
        if (!emojiRegex) {
          emojiRegex = new RegExp(_emojiRegex, "u");
        }
        if (!emojiRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "emoji",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "uuid") {
        if (!uuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "uuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "nanoid") {
        if (!nanoidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "nanoid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid") {
        if (!cuidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cuid2") {
        if (!cuid2Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cuid2",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ulid") {
        if (!ulidRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ulid",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "url") {
        try {
          new URL(input.data);
        } catch (_a) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "regex") {
        check.regex.lastIndex = 0;
        const testResult = check.regex.test(input.data);
        if (!testResult) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "regex",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "trim") {
        input.data = input.data.trim();
      } else if (check.kind === "includes") {
        if (!input.data.includes(check.value, check.position)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { includes: check.value, position: check.position },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "toLowerCase") {
        input.data = input.data.toLowerCase();
      } else if (check.kind === "toUpperCase") {
        input.data = input.data.toUpperCase();
      } else if (check.kind === "startsWith") {
        if (!input.data.startsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { startsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "endsWith") {
        if (!input.data.endsWith(check.value)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: { endsWith: check.value },
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "datetime") {
        const regex = datetimeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "datetime",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "date") {
        const regex = dateRegex;
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "date",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "time") {
        const regex = timeRegex(check);
        if (!regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_string,
            validation: "time",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "duration") {
        if (!durationRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "duration",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "ip") {
        if (!isValidIP(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "ip",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "jwt") {
        if (!isValidJWT(input.data, check.alg)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "jwt",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "cidr") {
        if (!isValidCidr(input.data, check.version)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "cidr",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64") {
        if (!base64Regex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "base64url") {
        if (!base64urlRegex.test(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            validation: "base64url",
            code: ZodIssueCode.invalid_string,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _regex(regex, validation, message) {
    return this.refinement((data) => regex.test(data), {
      validation,
      code: ZodIssueCode.invalid_string,
      ...errorUtil.errToObj(message)
    });
  }
  _addCheck(check) {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  email(message) {
    return this._addCheck({ kind: "email", ...errorUtil.errToObj(message) });
  }
  url(message) {
    return this._addCheck({ kind: "url", ...errorUtil.errToObj(message) });
  }
  emoji(message) {
    return this._addCheck({ kind: "emoji", ...errorUtil.errToObj(message) });
  }
  uuid(message) {
    return this._addCheck({ kind: "uuid", ...errorUtil.errToObj(message) });
  }
  nanoid(message) {
    return this._addCheck({ kind: "nanoid", ...errorUtil.errToObj(message) });
  }
  cuid(message) {
    return this._addCheck({ kind: "cuid", ...errorUtil.errToObj(message) });
  }
  cuid2(message) {
    return this._addCheck({ kind: "cuid2", ...errorUtil.errToObj(message) });
  }
  ulid(message) {
    return this._addCheck({ kind: "ulid", ...errorUtil.errToObj(message) });
  }
  base64(message) {
    return this._addCheck({ kind: "base64", ...errorUtil.errToObj(message) });
  }
  base64url(message) {
    return this._addCheck({
      kind: "base64url",
      ...errorUtil.errToObj(message)
    });
  }
  jwt(options) {
    return this._addCheck({ kind: "jwt", ...errorUtil.errToObj(options) });
  }
  ip(options) {
    return this._addCheck({ kind: "ip", ...errorUtil.errToObj(options) });
  }
  cidr(options) {
    return this._addCheck({ kind: "cidr", ...errorUtil.errToObj(options) });
  }
  datetime(options) {
    var _a, _b;
    if (typeof options === "string") {
      return this._addCheck({
        kind: "datetime",
        precision: null,
        offset: false,
        local: false,
        message: options
      });
    }
    return this._addCheck({
      kind: "datetime",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      offset: (_a = options === null || options === undefined ? undefined : options.offset) !== null && _a !== undefined ? _a : false,
      local: (_b = options === null || options === undefined ? undefined : options.local) !== null && _b !== undefined ? _b : false,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  date(message) {
    return this._addCheck({ kind: "date", message });
  }
  time(options) {
    if (typeof options === "string") {
      return this._addCheck({
        kind: "time",
        precision: null,
        message: options
      });
    }
    return this._addCheck({
      kind: "time",
      precision: typeof (options === null || options === undefined ? undefined : options.precision) === "undefined" ? null : options === null || options === undefined ? undefined : options.precision,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  duration(message) {
    return this._addCheck({ kind: "duration", ...errorUtil.errToObj(message) });
  }
  regex(regex, message) {
    return this._addCheck({
      kind: "regex",
      regex,
      ...errorUtil.errToObj(message)
    });
  }
  includes(value, options) {
    return this._addCheck({
      kind: "includes",
      value,
      position: options === null || options === undefined ? undefined : options.position,
      ...errorUtil.errToObj(options === null || options === undefined ? undefined : options.message)
    });
  }
  startsWith(value, message) {
    return this._addCheck({
      kind: "startsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  endsWith(value, message) {
    return this._addCheck({
      kind: "endsWith",
      value,
      ...errorUtil.errToObj(message)
    });
  }
  min(minLength, message) {
    return this._addCheck({
      kind: "min",
      value: minLength,
      ...errorUtil.errToObj(message)
    });
  }
  max(maxLength, message) {
    return this._addCheck({
      kind: "max",
      value: maxLength,
      ...errorUtil.errToObj(message)
    });
  }
  length(len, message) {
    return this._addCheck({
      kind: "length",
      value: len,
      ...errorUtil.errToObj(message)
    });
  }
  nonempty(message) {
    return this.min(1, errorUtil.errToObj(message));
  }
  trim() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "trim" }]
    });
  }
  toLowerCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toLowerCase" }]
    });
  }
  toUpperCase() {
    return new ZodString({
      ...this._def,
      checks: [...this._def.checks, { kind: "toUpperCase" }]
    });
  }
  get isDatetime() {
    return !!this._def.checks.find((ch) => ch.kind === "datetime");
  }
  get isDate() {
    return !!this._def.checks.find((ch) => ch.kind === "date");
  }
  get isTime() {
    return !!this._def.checks.find((ch) => ch.kind === "time");
  }
  get isDuration() {
    return !!this._def.checks.find((ch) => ch.kind === "duration");
  }
  get isEmail() {
    return !!this._def.checks.find((ch) => ch.kind === "email");
  }
  get isURL() {
    return !!this._def.checks.find((ch) => ch.kind === "url");
  }
  get isEmoji() {
    return !!this._def.checks.find((ch) => ch.kind === "emoji");
  }
  get isUUID() {
    return !!this._def.checks.find((ch) => ch.kind === "uuid");
  }
  get isNANOID() {
    return !!this._def.checks.find((ch) => ch.kind === "nanoid");
  }
  get isCUID() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid");
  }
  get isCUID2() {
    return !!this._def.checks.find((ch) => ch.kind === "cuid2");
  }
  get isULID() {
    return !!this._def.checks.find((ch) => ch.kind === "ulid");
  }
  get isIP() {
    return !!this._def.checks.find((ch) => ch.kind === "ip");
  }
  get isCIDR() {
    return !!this._def.checks.find((ch) => ch.kind === "cidr");
  }
  get isBase64() {
    return !!this._def.checks.find((ch) => ch.kind === "base64");
  }
  get isBase64url() {
    return !!this._def.checks.find((ch) => ch.kind === "base64url");
  }
  get minLength() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxLength() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodString.create = (params) => {
  var _a;
  return new ZodString({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodString,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};
function floatSafeRemainder(val, step) {
  const valDecCount = (val.toString().split(".")[1] || "").length;
  const stepDecCount = (step.toString().split(".")[1] || "").length;
  const decCount = valDecCount > stepDecCount ? valDecCount : stepDecCount;
  const valInt = parseInt(val.toFixed(decCount).replace(".", ""));
  const stepInt = parseInt(step.toFixed(decCount).replace(".", ""));
  return valInt % stepInt / Math.pow(10, decCount);
}

class ZodNumber extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
    this.step = this.multipleOf;
  }
  _parse(input) {
    if (this._def.coerce) {
      input.data = Number(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.number) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.number,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "int") {
        if (!util.isInteger(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.invalid_type,
            expected: "integer",
            received: "float",
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            minimum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            maximum: check.value,
            type: "number",
            inclusive: check.inclusive,
            exact: false,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (floatSafeRemainder(input.data, check.value) !== 0) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "finite") {
        if (!Number.isFinite(input.data)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_finite,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodNumber({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodNumber({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  int(message) {
    return this._addCheck({
      kind: "int",
      message: errorUtil.toString(message)
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: 0,
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  finite(message) {
    return this._addCheck({
      kind: "finite",
      message: errorUtil.toString(message)
    });
  }
  safe(message) {
    return this._addCheck({
      kind: "min",
      inclusive: true,
      value: Number.MIN_SAFE_INTEGER,
      message: errorUtil.toString(message)
    })._addCheck({
      kind: "max",
      inclusive: true,
      value: Number.MAX_SAFE_INTEGER,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
  get isInt() {
    return !!this._def.checks.find((ch) => ch.kind === "int" || ch.kind === "multipleOf" && util.isInteger(ch.value));
  }
  get isFinite() {
    let max = null, min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "finite" || ch.kind === "int" || ch.kind === "multipleOf") {
        return true;
      } else if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      } else if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return Number.isFinite(min) && Number.isFinite(max);
  }
}
ZodNumber.create = (params) => {
  return new ZodNumber({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodNumber,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodBigInt extends ZodType {
  constructor() {
    super(...arguments);
    this.min = this.gte;
    this.max = this.lte;
  }
  _parse(input) {
    if (this._def.coerce) {
      try {
        input.data = BigInt(input.data);
      } catch (_a) {
        return this._getInvalidInput(input);
      }
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.bigint) {
      return this._getInvalidInput(input);
    }
    let ctx = undefined;
    const status = new ParseStatus;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        const tooSmall = check.inclusive ? input.data < check.value : input.data <= check.value;
        if (tooSmall) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            type: "bigint",
            minimum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        const tooBig = check.inclusive ? input.data > check.value : input.data >= check.value;
        if (tooBig) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            type: "bigint",
            maximum: check.value,
            inclusive: check.inclusive,
            message: check.message
          });
          status.dirty();
        }
      } else if (check.kind === "multipleOf") {
        if (input.data % check.value !== BigInt(0)) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.not_multiple_of,
            multipleOf: check.value,
            message: check.message
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return { status: status.value, value: input.data };
  }
  _getInvalidInput(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.bigint,
      received: ctx.parsedType
    });
    return INVALID;
  }
  gte(value, message) {
    return this.setLimit("min", value, true, errorUtil.toString(message));
  }
  gt(value, message) {
    return this.setLimit("min", value, false, errorUtil.toString(message));
  }
  lte(value, message) {
    return this.setLimit("max", value, true, errorUtil.toString(message));
  }
  lt(value, message) {
    return this.setLimit("max", value, false, errorUtil.toString(message));
  }
  setLimit(kind, value, inclusive, message) {
    return new ZodBigInt({
      ...this._def,
      checks: [
        ...this._def.checks,
        {
          kind,
          value,
          inclusive,
          message: errorUtil.toString(message)
        }
      ]
    });
  }
  _addCheck(check) {
    return new ZodBigInt({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  positive(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  negative(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: false,
      message: errorUtil.toString(message)
    });
  }
  nonpositive(message) {
    return this._addCheck({
      kind: "max",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  nonnegative(message) {
    return this._addCheck({
      kind: "min",
      value: BigInt(0),
      inclusive: true,
      message: errorUtil.toString(message)
    });
  }
  multipleOf(value, message) {
    return this._addCheck({
      kind: "multipleOf",
      value,
      message: errorUtil.toString(message)
    });
  }
  get minValue() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min;
  }
  get maxValue() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max;
  }
}
ZodBigInt.create = (params) => {
  var _a;
  return new ZodBigInt({
    checks: [],
    typeName: ZodFirstPartyTypeKind.ZodBigInt,
    coerce: (_a = params === null || params === undefined ? undefined : params.coerce) !== null && _a !== undefined ? _a : false,
    ...processCreateParams(params)
  });
};

class ZodBoolean extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = Boolean(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.boolean) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.boolean,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodBoolean.create = (params) => {
  return new ZodBoolean({
    typeName: ZodFirstPartyTypeKind.ZodBoolean,
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    ...processCreateParams(params)
  });
};

class ZodDate extends ZodType {
  _parse(input) {
    if (this._def.coerce) {
      input.data = new Date(input.data);
    }
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.date) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.date,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    if (isNaN(input.data.getTime())) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_date
      });
      return INVALID;
    }
    const status = new ParseStatus;
    let ctx = undefined;
    for (const check of this._def.checks) {
      if (check.kind === "min") {
        if (input.data.getTime() < check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_small,
            message: check.message,
            inclusive: true,
            exact: false,
            minimum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else if (check.kind === "max") {
        if (input.data.getTime() > check.value) {
          ctx = this._getOrReturnCtx(input, ctx);
          addIssueToContext(ctx, {
            code: ZodIssueCode.too_big,
            message: check.message,
            inclusive: true,
            exact: false,
            maximum: check.value,
            type: "date"
          });
          status.dirty();
        }
      } else {
        util.assertNever(check);
      }
    }
    return {
      status: status.value,
      value: new Date(input.data.getTime())
    };
  }
  _addCheck(check) {
    return new ZodDate({
      ...this._def,
      checks: [...this._def.checks, check]
    });
  }
  min(minDate, message) {
    return this._addCheck({
      kind: "min",
      value: minDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  max(maxDate, message) {
    return this._addCheck({
      kind: "max",
      value: maxDate.getTime(),
      message: errorUtil.toString(message)
    });
  }
  get minDate() {
    let min = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "min") {
        if (min === null || ch.value > min)
          min = ch.value;
      }
    }
    return min != null ? new Date(min) : null;
  }
  get maxDate() {
    let max = null;
    for (const ch of this._def.checks) {
      if (ch.kind === "max") {
        if (max === null || ch.value < max)
          max = ch.value;
      }
    }
    return max != null ? new Date(max) : null;
  }
}
ZodDate.create = (params) => {
  return new ZodDate({
    checks: [],
    coerce: (params === null || params === undefined ? undefined : params.coerce) || false,
    typeName: ZodFirstPartyTypeKind.ZodDate,
    ...processCreateParams(params)
  });
};

class ZodSymbol extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.symbol) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.symbol,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodSymbol.create = (params) => {
  return new ZodSymbol({
    typeName: ZodFirstPartyTypeKind.ZodSymbol,
    ...processCreateParams(params)
  });
};

class ZodUndefined extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.undefined,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodUndefined.create = (params) => {
  return new ZodUndefined({
    typeName: ZodFirstPartyTypeKind.ZodUndefined,
    ...processCreateParams(params)
  });
};

class ZodNull extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.null) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.null,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodNull.create = (params) => {
  return new ZodNull({
    typeName: ZodFirstPartyTypeKind.ZodNull,
    ...processCreateParams(params)
  });
};

class ZodAny extends ZodType {
  constructor() {
    super(...arguments);
    this._any = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodAny.create = (params) => {
  return new ZodAny({
    typeName: ZodFirstPartyTypeKind.ZodAny,
    ...processCreateParams(params)
  });
};

class ZodUnknown extends ZodType {
  constructor() {
    super(...arguments);
    this._unknown = true;
  }
  _parse(input) {
    return OK(input.data);
  }
}
ZodUnknown.create = (params) => {
  return new ZodUnknown({
    typeName: ZodFirstPartyTypeKind.ZodUnknown,
    ...processCreateParams(params)
  });
};

class ZodNever extends ZodType {
  _parse(input) {
    const ctx = this._getOrReturnCtx(input);
    addIssueToContext(ctx, {
      code: ZodIssueCode.invalid_type,
      expected: ZodParsedType.never,
      received: ctx.parsedType
    });
    return INVALID;
  }
}
ZodNever.create = (params) => {
  return new ZodNever({
    typeName: ZodFirstPartyTypeKind.ZodNever,
    ...processCreateParams(params)
  });
};

class ZodVoid extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.undefined) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.void,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return OK(input.data);
  }
}
ZodVoid.create = (params) => {
  return new ZodVoid({
    typeName: ZodFirstPartyTypeKind.ZodVoid,
    ...processCreateParams(params)
  });
};

class ZodArray extends ZodType {
  _parse(input) {
    const { ctx, status } = this._processInputParams(input);
    const def = this._def;
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (def.exactLength !== null) {
      const tooBig = ctx.data.length > def.exactLength.value;
      const tooSmall = ctx.data.length < def.exactLength.value;
      if (tooBig || tooSmall) {
        addIssueToContext(ctx, {
          code: tooBig ? ZodIssueCode.too_big : ZodIssueCode.too_small,
          minimum: tooSmall ? def.exactLength.value : undefined,
          maximum: tooBig ? def.exactLength.value : undefined,
          type: "array",
          inclusive: true,
          exact: true,
          message: def.exactLength.message
        });
        status.dirty();
      }
    }
    if (def.minLength !== null) {
      if (ctx.data.length < def.minLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.minLength.message
        });
        status.dirty();
      }
    }
    if (def.maxLength !== null) {
      if (ctx.data.length > def.maxLength.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxLength.value,
          type: "array",
          inclusive: true,
          exact: false,
          message: def.maxLength.message
        });
        status.dirty();
      }
    }
    if (ctx.common.async) {
      return Promise.all([...ctx.data].map((item, i) => {
        return def.type._parseAsync(new ParseInputLazyPath(ctx, item, ctx.path, i));
      })).then((result2) => {
        return ParseStatus.mergeArray(status, result2);
      });
    }
    const result = [...ctx.data].map((item, i) => {
      return def.type._parseSync(new ParseInputLazyPath(ctx, item, ctx.path, i));
    });
    return ParseStatus.mergeArray(status, result);
  }
  get element() {
    return this._def.type;
  }
  min(minLength, message) {
    return new ZodArray({
      ...this._def,
      minLength: { value: minLength, message: errorUtil.toString(message) }
    });
  }
  max(maxLength, message) {
    return new ZodArray({
      ...this._def,
      maxLength: { value: maxLength, message: errorUtil.toString(message) }
    });
  }
  length(len, message) {
    return new ZodArray({
      ...this._def,
      exactLength: { value: len, message: errorUtil.toString(message) }
    });
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodArray.create = (schema, params) => {
  return new ZodArray({
    type: schema,
    minLength: null,
    maxLength: null,
    exactLength: null,
    typeName: ZodFirstPartyTypeKind.ZodArray,
    ...processCreateParams(params)
  });
};
function deepPartialify(schema) {
  if (schema instanceof ZodObject) {
    const newShape = {};
    for (const key in schema.shape) {
      const fieldSchema = schema.shape[key];
      newShape[key] = ZodOptional.create(deepPartialify(fieldSchema));
    }
    return new ZodObject({
      ...schema._def,
      shape: () => newShape
    });
  } else if (schema instanceof ZodArray) {
    return new ZodArray({
      ...schema._def,
      type: deepPartialify(schema.element)
    });
  } else if (schema instanceof ZodOptional) {
    return ZodOptional.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodNullable) {
    return ZodNullable.create(deepPartialify(schema.unwrap()));
  } else if (schema instanceof ZodTuple) {
    return ZodTuple.create(schema.items.map((item) => deepPartialify(item)));
  } else {
    return schema;
  }
}

class ZodObject extends ZodType {
  constructor() {
    super(...arguments);
    this._cached = null;
    this.nonstrict = this.passthrough;
    this.augment = this.extend;
  }
  _getCached() {
    if (this._cached !== null)
      return this._cached;
    const shape = this._def.shape();
    const keys = util.objectKeys(shape);
    return this._cached = { shape, keys };
  }
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.object) {
      const ctx2 = this._getOrReturnCtx(input);
      addIssueToContext(ctx2, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx2.parsedType
      });
      return INVALID;
    }
    const { status, ctx } = this._processInputParams(input);
    const { shape, keys: shapeKeys } = this._getCached();
    const extraKeys = [];
    if (!(this._def.catchall instanceof ZodNever && this._def.unknownKeys === "strip")) {
      for (const key in ctx.data) {
        if (!shapeKeys.includes(key)) {
          extraKeys.push(key);
        }
      }
    }
    const pairs = [];
    for (const key of shapeKeys) {
      const keyValidator = shape[key];
      const value = ctx.data[key];
      pairs.push({
        key: { status: "valid", value: key },
        value: keyValidator._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (this._def.catchall instanceof ZodNever) {
      const unknownKeys = this._def.unknownKeys;
      if (unknownKeys === "passthrough") {
        for (const key of extraKeys) {
          pairs.push({
            key: { status: "valid", value: key },
            value: { status: "valid", value: ctx.data[key] }
          });
        }
      } else if (unknownKeys === "strict") {
        if (extraKeys.length > 0) {
          addIssueToContext(ctx, {
            code: ZodIssueCode.unrecognized_keys,
            keys: extraKeys
          });
          status.dirty();
        }
      } else if (unknownKeys === "strip")
        ;
      else {
        throw new Error(`Internal ZodObject error: invalid unknownKeys value.`);
      }
    } else {
      const catchall = this._def.catchall;
      for (const key of extraKeys) {
        const value = ctx.data[key];
        pairs.push({
          key: { status: "valid", value: key },
          value: catchall._parse(new ParseInputLazyPath(ctx, value, ctx.path, key)),
          alwaysSet: key in ctx.data
        });
      }
    }
    if (ctx.common.async) {
      return Promise.resolve().then(async () => {
        const syncPairs = [];
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          syncPairs.push({
            key,
            value,
            alwaysSet: pair.alwaysSet
          });
        }
        return syncPairs;
      }).then((syncPairs) => {
        return ParseStatus.mergeObjectSync(status, syncPairs);
      });
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get shape() {
    return this._def.shape();
  }
  strict(message) {
    errorUtil.errToObj;
    return new ZodObject({
      ...this._def,
      unknownKeys: "strict",
      ...message !== undefined ? {
        errorMap: (issue, ctx) => {
          var _a, _b, _c, _d;
          const defaultError = (_c = (_b = (_a = this._def).errorMap) === null || _b === undefined ? undefined : _b.call(_a, issue, ctx).message) !== null && _c !== undefined ? _c : ctx.defaultError;
          if (issue.code === "unrecognized_keys")
            return {
              message: (_d = errorUtil.errToObj(message).message) !== null && _d !== undefined ? _d : defaultError
            };
          return {
            message: defaultError
          };
        }
      } : {}
    });
  }
  strip() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "strip"
    });
  }
  passthrough() {
    return new ZodObject({
      ...this._def,
      unknownKeys: "passthrough"
    });
  }
  extend(augmentation) {
    return new ZodObject({
      ...this._def,
      shape: () => ({
        ...this._def.shape(),
        ...augmentation
      })
    });
  }
  merge(merging) {
    const merged = new ZodObject({
      unknownKeys: merging._def.unknownKeys,
      catchall: merging._def.catchall,
      shape: () => ({
        ...this._def.shape(),
        ...merging._def.shape()
      }),
      typeName: ZodFirstPartyTypeKind.ZodObject
    });
    return merged;
  }
  setKey(key, schema) {
    return this.augment({ [key]: schema });
  }
  catchall(index) {
    return new ZodObject({
      ...this._def,
      catchall: index
    });
  }
  pick(mask) {
    const shape = {};
    util.objectKeys(mask).forEach((key) => {
      if (mask[key] && this.shape[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  omit(mask) {
    const shape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (!mask[key]) {
        shape[key] = this.shape[key];
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => shape
    });
  }
  deepPartial() {
    return deepPartialify(this);
  }
  partial(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      const fieldSchema = this.shape[key];
      if (mask && !mask[key]) {
        newShape[key] = fieldSchema;
      } else {
        newShape[key] = fieldSchema.optional();
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  required(mask) {
    const newShape = {};
    util.objectKeys(this.shape).forEach((key) => {
      if (mask && !mask[key]) {
        newShape[key] = this.shape[key];
      } else {
        const fieldSchema = this.shape[key];
        let newField = fieldSchema;
        while (newField instanceof ZodOptional) {
          newField = newField._def.innerType;
        }
        newShape[key] = newField;
      }
    });
    return new ZodObject({
      ...this._def,
      shape: () => newShape
    });
  }
  keyof() {
    return createZodEnum(util.objectKeys(this.shape));
  }
}
ZodObject.create = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.strictCreate = (shape, params) => {
  return new ZodObject({
    shape: () => shape,
    unknownKeys: "strict",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};
ZodObject.lazycreate = (shape, params) => {
  return new ZodObject({
    shape,
    unknownKeys: "strip",
    catchall: ZodNever.create(),
    typeName: ZodFirstPartyTypeKind.ZodObject,
    ...processCreateParams(params)
  });
};

class ZodUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const options = this._def.options;
    function handleResults(results) {
      for (const result of results) {
        if (result.result.status === "valid") {
          return result.result;
        }
      }
      for (const result of results) {
        if (result.result.status === "dirty") {
          ctx.common.issues.push(...result.ctx.common.issues);
          return result.result;
        }
      }
      const unionErrors = results.map((result) => new ZodError(result.ctx.common.issues));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return Promise.all(options.map(async (option) => {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        return {
          result: await option._parseAsync({
            data: ctx.data,
            path: ctx.path,
            parent: childCtx
          }),
          ctx: childCtx
        };
      })).then(handleResults);
    } else {
      let dirty = undefined;
      const issues = [];
      for (const option of options) {
        const childCtx = {
          ...ctx,
          common: {
            ...ctx.common,
            issues: []
          },
          parent: null
        };
        const result = option._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: childCtx
        });
        if (result.status === "valid") {
          return result;
        } else if (result.status === "dirty" && !dirty) {
          dirty = { result, ctx: childCtx };
        }
        if (childCtx.common.issues.length) {
          issues.push(childCtx.common.issues);
        }
      }
      if (dirty) {
        ctx.common.issues.push(...dirty.ctx.common.issues);
        return dirty.result;
      }
      const unionErrors = issues.map((issues2) => new ZodError(issues2));
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union,
        unionErrors
      });
      return INVALID;
    }
  }
  get options() {
    return this._def.options;
  }
}
ZodUnion.create = (types, params) => {
  return new ZodUnion({
    options: types,
    typeName: ZodFirstPartyTypeKind.ZodUnion,
    ...processCreateParams(params)
  });
};
var getDiscriminator = (type) => {
  if (type instanceof ZodLazy) {
    return getDiscriminator(type.schema);
  } else if (type instanceof ZodEffects) {
    return getDiscriminator(type.innerType());
  } else if (type instanceof ZodLiteral) {
    return [type.value];
  } else if (type instanceof ZodEnum) {
    return type.options;
  } else if (type instanceof ZodNativeEnum) {
    return util.objectValues(type.enum);
  } else if (type instanceof ZodDefault) {
    return getDiscriminator(type._def.innerType);
  } else if (type instanceof ZodUndefined) {
    return [undefined];
  } else if (type instanceof ZodNull) {
    return [null];
  } else if (type instanceof ZodOptional) {
    return [undefined, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodNullable) {
    return [null, ...getDiscriminator(type.unwrap())];
  } else if (type instanceof ZodBranded) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodReadonly) {
    return getDiscriminator(type.unwrap());
  } else if (type instanceof ZodCatch) {
    return getDiscriminator(type._def.innerType);
  } else {
    return [];
  }
};

class ZodDiscriminatedUnion extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const discriminator = this.discriminator;
    const discriminatorValue = ctx.data[discriminator];
    const option = this.optionsMap.get(discriminatorValue);
    if (!option) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_union_discriminator,
        options: Array.from(this.optionsMap.keys()),
        path: [discriminator]
      });
      return INVALID;
    }
    if (ctx.common.async) {
      return option._parseAsync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    } else {
      return option._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
    }
  }
  get discriminator() {
    return this._def.discriminator;
  }
  get options() {
    return this._def.options;
  }
  get optionsMap() {
    return this._def.optionsMap;
  }
  static create(discriminator, options, params) {
    const optionsMap = new Map;
    for (const type of options) {
      const discriminatorValues = getDiscriminator(type.shape[discriminator]);
      if (!discriminatorValues.length) {
        throw new Error(`A discriminator value for key \`${discriminator}\` could not be extracted from all schema options`);
      }
      for (const value of discriminatorValues) {
        if (optionsMap.has(value)) {
          throw new Error(`Discriminator property ${String(discriminator)} has duplicate value ${String(value)}`);
        }
        optionsMap.set(value, type);
      }
    }
    return new ZodDiscriminatedUnion({
      typeName: ZodFirstPartyTypeKind.ZodDiscriminatedUnion,
      discriminator,
      options,
      optionsMap,
      ...processCreateParams(params)
    });
  }
}
function mergeValues(a, b) {
  const aType = getParsedType(a);
  const bType = getParsedType(b);
  if (a === b) {
    return { valid: true, data: a };
  } else if (aType === ZodParsedType.object && bType === ZodParsedType.object) {
    const bKeys = util.objectKeys(b);
    const sharedKeys = util.objectKeys(a).filter((key) => bKeys.indexOf(key) !== -1);
    const newObj = { ...a, ...b };
    for (const key of sharedKeys) {
      const sharedValue = mergeValues(a[key], b[key]);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newObj[key] = sharedValue.data;
    }
    return { valid: true, data: newObj };
  } else if (aType === ZodParsedType.array && bType === ZodParsedType.array) {
    if (a.length !== b.length) {
      return { valid: false };
    }
    const newArray = [];
    for (let index = 0;index < a.length; index++) {
      const itemA = a[index];
      const itemB = b[index];
      const sharedValue = mergeValues(itemA, itemB);
      if (!sharedValue.valid) {
        return { valid: false };
      }
      newArray.push(sharedValue.data);
    }
    return { valid: true, data: newArray };
  } else if (aType === ZodParsedType.date && bType === ZodParsedType.date && +a === +b) {
    return { valid: true, data: a };
  } else {
    return { valid: false };
  }
}

class ZodIntersection extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const handleParsed = (parsedLeft, parsedRight) => {
      if (isAborted(parsedLeft) || isAborted(parsedRight)) {
        return INVALID;
      }
      const merged = mergeValues(parsedLeft.value, parsedRight.value);
      if (!merged.valid) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.invalid_intersection_types
        });
        return INVALID;
      }
      if (isDirty(parsedLeft) || isDirty(parsedRight)) {
        status.dirty();
      }
      return { status: status.value, value: merged.data };
    };
    if (ctx.common.async) {
      return Promise.all([
        this._def.left._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        }),
        this._def.right._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        })
      ]).then(([left, right]) => handleParsed(left, right));
    } else {
      return handleParsed(this._def.left._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }), this._def.right._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      }));
    }
  }
}
ZodIntersection.create = (left, right, params) => {
  return new ZodIntersection({
    left,
    right,
    typeName: ZodFirstPartyTypeKind.ZodIntersection,
    ...processCreateParams(params)
  });
};

class ZodTuple extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.array) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.array,
        received: ctx.parsedType
      });
      return INVALID;
    }
    if (ctx.data.length < this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_small,
        minimum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      return INVALID;
    }
    const rest = this._def.rest;
    if (!rest && ctx.data.length > this._def.items.length) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.too_big,
        maximum: this._def.items.length,
        inclusive: true,
        exact: false,
        type: "array"
      });
      status.dirty();
    }
    const items = [...ctx.data].map((item, itemIndex) => {
      const schema = this._def.items[itemIndex] || this._def.rest;
      if (!schema)
        return null;
      return schema._parse(new ParseInputLazyPath(ctx, item, ctx.path, itemIndex));
    }).filter((x) => !!x);
    if (ctx.common.async) {
      return Promise.all(items).then((results) => {
        return ParseStatus.mergeArray(status, results);
      });
    } else {
      return ParseStatus.mergeArray(status, items);
    }
  }
  get items() {
    return this._def.items;
  }
  rest(rest) {
    return new ZodTuple({
      ...this._def,
      rest
    });
  }
}
ZodTuple.create = (schemas, params) => {
  if (!Array.isArray(schemas)) {
    throw new Error("You must pass an array of schemas to z.tuple([ ... ])");
  }
  return new ZodTuple({
    items: schemas,
    typeName: ZodFirstPartyTypeKind.ZodTuple,
    rest: null,
    ...processCreateParams(params)
  });
};

class ZodRecord extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.object) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.object,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const pairs = [];
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    for (const key in ctx.data) {
      pairs.push({
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, key)),
        value: valueType._parse(new ParseInputLazyPath(ctx, ctx.data[key], ctx.path, key)),
        alwaysSet: key in ctx.data
      });
    }
    if (ctx.common.async) {
      return ParseStatus.mergeObjectAsync(status, pairs);
    } else {
      return ParseStatus.mergeObjectSync(status, pairs);
    }
  }
  get element() {
    return this._def.valueType;
  }
  static create(first, second, third) {
    if (second instanceof ZodType) {
      return new ZodRecord({
        keyType: first,
        valueType: second,
        typeName: ZodFirstPartyTypeKind.ZodRecord,
        ...processCreateParams(third)
      });
    }
    return new ZodRecord({
      keyType: ZodString.create(),
      valueType: first,
      typeName: ZodFirstPartyTypeKind.ZodRecord,
      ...processCreateParams(second)
    });
  }
}

class ZodMap extends ZodType {
  get keySchema() {
    return this._def.keyType;
  }
  get valueSchema() {
    return this._def.valueType;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.map) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.map,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const keyType = this._def.keyType;
    const valueType = this._def.valueType;
    const pairs = [...ctx.data.entries()].map(([key, value], index) => {
      return {
        key: keyType._parse(new ParseInputLazyPath(ctx, key, ctx.path, [index, "key"])),
        value: valueType._parse(new ParseInputLazyPath(ctx, value, ctx.path, [index, "value"]))
      };
    });
    if (ctx.common.async) {
      const finalMap = new Map;
      return Promise.resolve().then(async () => {
        for (const pair of pairs) {
          const key = await pair.key;
          const value = await pair.value;
          if (key.status === "aborted" || value.status === "aborted") {
            return INVALID;
          }
          if (key.status === "dirty" || value.status === "dirty") {
            status.dirty();
          }
          finalMap.set(key.value, value.value);
        }
        return { status: status.value, value: finalMap };
      });
    } else {
      const finalMap = new Map;
      for (const pair of pairs) {
        const key = pair.key;
        const value = pair.value;
        if (key.status === "aborted" || value.status === "aborted") {
          return INVALID;
        }
        if (key.status === "dirty" || value.status === "dirty") {
          status.dirty();
        }
        finalMap.set(key.value, value.value);
      }
      return { status: status.value, value: finalMap };
    }
  }
}
ZodMap.create = (keyType, valueType, params) => {
  return new ZodMap({
    valueType,
    keyType,
    typeName: ZodFirstPartyTypeKind.ZodMap,
    ...processCreateParams(params)
  });
};

class ZodSet extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.set) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.set,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const def = this._def;
    if (def.minSize !== null) {
      if (ctx.data.size < def.minSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_small,
          minimum: def.minSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.minSize.message
        });
        status.dirty();
      }
    }
    if (def.maxSize !== null) {
      if (ctx.data.size > def.maxSize.value) {
        addIssueToContext(ctx, {
          code: ZodIssueCode.too_big,
          maximum: def.maxSize.value,
          type: "set",
          inclusive: true,
          exact: false,
          message: def.maxSize.message
        });
        status.dirty();
      }
    }
    const valueType = this._def.valueType;
    function finalizeSet(elements2) {
      const parsedSet = new Set;
      for (const element of elements2) {
        if (element.status === "aborted")
          return INVALID;
        if (element.status === "dirty")
          status.dirty();
        parsedSet.add(element.value);
      }
      return { status: status.value, value: parsedSet };
    }
    const elements = [...ctx.data.values()].map((item, i) => valueType._parse(new ParseInputLazyPath(ctx, item, ctx.path, i)));
    if (ctx.common.async) {
      return Promise.all(elements).then((elements2) => finalizeSet(elements2));
    } else {
      return finalizeSet(elements);
    }
  }
  min(minSize, message) {
    return new ZodSet({
      ...this._def,
      minSize: { value: minSize, message: errorUtil.toString(message) }
    });
  }
  max(maxSize, message) {
    return new ZodSet({
      ...this._def,
      maxSize: { value: maxSize, message: errorUtil.toString(message) }
    });
  }
  size(size, message) {
    return this.min(size, message).max(size, message);
  }
  nonempty(message) {
    return this.min(1, message);
  }
}
ZodSet.create = (valueType, params) => {
  return new ZodSet({
    valueType,
    minSize: null,
    maxSize: null,
    typeName: ZodFirstPartyTypeKind.ZodSet,
    ...processCreateParams(params)
  });
};

class ZodFunction extends ZodType {
  constructor() {
    super(...arguments);
    this.validate = this.implement;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.function) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.function,
        received: ctx.parsedType
      });
      return INVALID;
    }
    function makeArgsIssue(args, error) {
      return makeIssue({
        data: args,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_arguments,
          argumentsError: error
        }
      });
    }
    function makeReturnsIssue(returns, error) {
      return makeIssue({
        data: returns,
        path: ctx.path,
        errorMaps: [
          ctx.common.contextualErrorMap,
          ctx.schemaErrorMap,
          getErrorMap(),
          errorMap
        ].filter((x) => !!x),
        issueData: {
          code: ZodIssueCode.invalid_return_type,
          returnTypeError: error
        }
      });
    }
    const params = { errorMap: ctx.common.contextualErrorMap };
    const fn = ctx.data;
    if (this._def.returns instanceof ZodPromise) {
      const me = this;
      return OK(async function(...args) {
        const error = new ZodError([]);
        const parsedArgs = await me._def.args.parseAsync(args, params).catch((e) => {
          error.addIssue(makeArgsIssue(args, e));
          throw error;
        });
        const result = await Reflect.apply(fn, this, parsedArgs);
        const parsedReturns = await me._def.returns._def.type.parseAsync(result, params).catch((e) => {
          error.addIssue(makeReturnsIssue(result, e));
          throw error;
        });
        return parsedReturns;
      });
    } else {
      const me = this;
      return OK(function(...args) {
        const parsedArgs = me._def.args.safeParse(args, params);
        if (!parsedArgs.success) {
          throw new ZodError([makeArgsIssue(args, parsedArgs.error)]);
        }
        const result = Reflect.apply(fn, this, parsedArgs.data);
        const parsedReturns = me._def.returns.safeParse(result, params);
        if (!parsedReturns.success) {
          throw new ZodError([makeReturnsIssue(result, parsedReturns.error)]);
        }
        return parsedReturns.data;
      });
    }
  }
  parameters() {
    return this._def.args;
  }
  returnType() {
    return this._def.returns;
  }
  args(...items) {
    return new ZodFunction({
      ...this._def,
      args: ZodTuple.create(items).rest(ZodUnknown.create())
    });
  }
  returns(returnType) {
    return new ZodFunction({
      ...this._def,
      returns: returnType
    });
  }
  implement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  strictImplement(func) {
    const validatedFunc = this.parse(func);
    return validatedFunc;
  }
  static create(args, returns, params) {
    return new ZodFunction({
      args: args ? args : ZodTuple.create([]).rest(ZodUnknown.create()),
      returns: returns || ZodUnknown.create(),
      typeName: ZodFirstPartyTypeKind.ZodFunction,
      ...processCreateParams(params)
    });
  }
}

class ZodLazy extends ZodType {
  get schema() {
    return this._def.getter();
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const lazySchema = this._def.getter();
    return lazySchema._parse({ data: ctx.data, path: ctx.path, parent: ctx });
  }
}
ZodLazy.create = (getter, params) => {
  return new ZodLazy({
    getter,
    typeName: ZodFirstPartyTypeKind.ZodLazy,
    ...processCreateParams(params)
  });
};

class ZodLiteral extends ZodType {
  _parse(input) {
    if (input.data !== this._def.value) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_literal,
        expected: this._def.value
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
  get value() {
    return this._def.value;
  }
}
ZodLiteral.create = (value, params) => {
  return new ZodLiteral({
    value,
    typeName: ZodFirstPartyTypeKind.ZodLiteral,
    ...processCreateParams(params)
  });
};
function createZodEnum(values, params) {
  return new ZodEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodEnum,
    ...processCreateParams(params)
  });
}

class ZodEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodEnum_cache.set(this, undefined);
  }
  _parse(input) {
    if (typeof input.data !== "string") {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodEnum_cache, new Set(this._def.values), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodEnum_cache, "f").has(input.data)) {
      const ctx = this._getOrReturnCtx(input);
      const expectedValues = this._def.values;
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get options() {
    return this._def.values;
  }
  get enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Values() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  get Enum() {
    const enumValues = {};
    for (const val of this._def.values) {
      enumValues[val] = val;
    }
    return enumValues;
  }
  extract(values, newDef = this._def) {
    return ZodEnum.create(values, {
      ...this._def,
      ...newDef
    });
  }
  exclude(values, newDef = this._def) {
    return ZodEnum.create(this.options.filter((opt) => !values.includes(opt)), {
      ...this._def,
      ...newDef
    });
  }
}
_ZodEnum_cache = new WeakMap;
ZodEnum.create = createZodEnum;

class ZodNativeEnum extends ZodType {
  constructor() {
    super(...arguments);
    _ZodNativeEnum_cache.set(this, undefined);
  }
  _parse(input) {
    const nativeEnumValues = util.getValidEnumValues(this._def.values);
    const ctx = this._getOrReturnCtx(input);
    if (ctx.parsedType !== ZodParsedType.string && ctx.parsedType !== ZodParsedType.number) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        expected: util.joinValues(expectedValues),
        received: ctx.parsedType,
        code: ZodIssueCode.invalid_type
      });
      return INVALID;
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f")) {
      __classPrivateFieldSet(this, _ZodNativeEnum_cache, new Set(util.getValidEnumValues(this._def.values)), "f");
    }
    if (!__classPrivateFieldGet(this, _ZodNativeEnum_cache, "f").has(input.data)) {
      const expectedValues = util.objectValues(nativeEnumValues);
      addIssueToContext(ctx, {
        received: ctx.data,
        code: ZodIssueCode.invalid_enum_value,
        options: expectedValues
      });
      return INVALID;
    }
    return OK(input.data);
  }
  get enum() {
    return this._def.values;
  }
}
_ZodNativeEnum_cache = new WeakMap;
ZodNativeEnum.create = (values, params) => {
  return new ZodNativeEnum({
    values,
    typeName: ZodFirstPartyTypeKind.ZodNativeEnum,
    ...processCreateParams(params)
  });
};

class ZodPromise extends ZodType {
  unwrap() {
    return this._def.type;
  }
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    if (ctx.parsedType !== ZodParsedType.promise && ctx.common.async === false) {
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.promise,
        received: ctx.parsedType
      });
      return INVALID;
    }
    const promisified = ctx.parsedType === ZodParsedType.promise ? ctx.data : Promise.resolve(ctx.data);
    return OK(promisified.then((data) => {
      return this._def.type.parseAsync(data, {
        path: ctx.path,
        errorMap: ctx.common.contextualErrorMap
      });
    }));
  }
}
ZodPromise.create = (schema, params) => {
  return new ZodPromise({
    type: schema,
    typeName: ZodFirstPartyTypeKind.ZodPromise,
    ...processCreateParams(params)
  });
};

class ZodEffects extends ZodType {
  innerType() {
    return this._def.schema;
  }
  sourceType() {
    return this._def.schema._def.typeName === ZodFirstPartyTypeKind.ZodEffects ? this._def.schema.sourceType() : this._def.schema;
  }
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    const effect = this._def.effect || null;
    const checkCtx = {
      addIssue: (arg) => {
        addIssueToContext(ctx, arg);
        if (arg.fatal) {
          status.abort();
        } else {
          status.dirty();
        }
      },
      get path() {
        return ctx.path;
      }
    };
    checkCtx.addIssue = checkCtx.addIssue.bind(checkCtx);
    if (effect.type === "preprocess") {
      const processed = effect.transform(ctx.data, checkCtx);
      if (ctx.common.async) {
        return Promise.resolve(processed).then(async (processed2) => {
          if (status.value === "aborted")
            return INVALID;
          const result = await this._def.schema._parseAsync({
            data: processed2,
            path: ctx.path,
            parent: ctx
          });
          if (result.status === "aborted")
            return INVALID;
          if (result.status === "dirty")
            return DIRTY(result.value);
          if (status.value === "dirty")
            return DIRTY(result.value);
          return result;
        });
      } else {
        if (status.value === "aborted")
          return INVALID;
        const result = this._def.schema._parseSync({
          data: processed,
          path: ctx.path,
          parent: ctx
        });
        if (result.status === "aborted")
          return INVALID;
        if (result.status === "dirty")
          return DIRTY(result.value);
        if (status.value === "dirty")
          return DIRTY(result.value);
        return result;
      }
    }
    if (effect.type === "refinement") {
      const executeRefinement = (acc) => {
        const result = effect.refinement(acc, checkCtx);
        if (ctx.common.async) {
          return Promise.resolve(result);
        }
        if (result instanceof Promise) {
          throw new Error("Async refinement encountered during synchronous parse operation. Use .parseAsync instead.");
        }
        return acc;
      };
      if (ctx.common.async === false) {
        const inner = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inner.status === "aborted")
          return INVALID;
        if (inner.status === "dirty")
          status.dirty();
        executeRefinement(inner.value);
        return { status: status.value, value: inner.value };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((inner) => {
          if (inner.status === "aborted")
            return INVALID;
          if (inner.status === "dirty")
            status.dirty();
          return executeRefinement(inner.value).then(() => {
            return { status: status.value, value: inner.value };
          });
        });
      }
    }
    if (effect.type === "transform") {
      if (ctx.common.async === false) {
        const base = this._def.schema._parseSync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (!isValid(base))
          return base;
        const result = effect.transform(base.value, checkCtx);
        if (result instanceof Promise) {
          throw new Error(`Asynchronous transform encountered during synchronous parse operation. Use .parseAsync instead.`);
        }
        return { status: status.value, value: result };
      } else {
        return this._def.schema._parseAsync({ data: ctx.data, path: ctx.path, parent: ctx }).then((base) => {
          if (!isValid(base))
            return base;
          return Promise.resolve(effect.transform(base.value, checkCtx)).then((result) => ({ status: status.value, value: result }));
        });
      }
    }
    util.assertNever(effect);
  }
}
ZodEffects.create = (schema, effect, params) => {
  return new ZodEffects({
    schema,
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    effect,
    ...processCreateParams(params)
  });
};
ZodEffects.createWithPreprocess = (preprocess, schema, params) => {
  return new ZodEffects({
    schema,
    effect: { type: "preprocess", transform: preprocess },
    typeName: ZodFirstPartyTypeKind.ZodEffects,
    ...processCreateParams(params)
  });
};

class ZodOptional extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.undefined) {
      return OK(undefined);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodOptional.create = (type, params) => {
  return new ZodOptional({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodOptional,
    ...processCreateParams(params)
  });
};

class ZodNullable extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType === ZodParsedType.null) {
      return OK(null);
    }
    return this._def.innerType._parse(input);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodNullable.create = (type, params) => {
  return new ZodNullable({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodNullable,
    ...processCreateParams(params)
  });
};

class ZodDefault extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    let data = ctx.data;
    if (ctx.parsedType === ZodParsedType.undefined) {
      data = this._def.defaultValue();
    }
    return this._def.innerType._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  removeDefault() {
    return this._def.innerType;
  }
}
ZodDefault.create = (type, params) => {
  return new ZodDefault({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodDefault,
    defaultValue: typeof params.default === "function" ? params.default : () => params.default,
    ...processCreateParams(params)
  });
};

class ZodCatch extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const newCtx = {
      ...ctx,
      common: {
        ...ctx.common,
        issues: []
      }
    };
    const result = this._def.innerType._parse({
      data: newCtx.data,
      path: newCtx.path,
      parent: {
        ...newCtx
      }
    });
    if (isAsync(result)) {
      return result.then((result2) => {
        return {
          status: "valid",
          value: result2.status === "valid" ? result2.value : this._def.catchValue({
            get error() {
              return new ZodError(newCtx.common.issues);
            },
            input: newCtx.data
          })
        };
      });
    } else {
      return {
        status: "valid",
        value: result.status === "valid" ? result.value : this._def.catchValue({
          get error() {
            return new ZodError(newCtx.common.issues);
          },
          input: newCtx.data
        })
      };
    }
  }
  removeCatch() {
    return this._def.innerType;
  }
}
ZodCatch.create = (type, params) => {
  return new ZodCatch({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodCatch,
    catchValue: typeof params.catch === "function" ? params.catch : () => params.catch,
    ...processCreateParams(params)
  });
};

class ZodNaN extends ZodType {
  _parse(input) {
    const parsedType = this._getType(input);
    if (parsedType !== ZodParsedType.nan) {
      const ctx = this._getOrReturnCtx(input);
      addIssueToContext(ctx, {
        code: ZodIssueCode.invalid_type,
        expected: ZodParsedType.nan,
        received: ctx.parsedType
      });
      return INVALID;
    }
    return { status: "valid", value: input.data };
  }
}
ZodNaN.create = (params) => {
  return new ZodNaN({
    typeName: ZodFirstPartyTypeKind.ZodNaN,
    ...processCreateParams(params)
  });
};
var BRAND = Symbol("zod_brand");

class ZodBranded extends ZodType {
  _parse(input) {
    const { ctx } = this._processInputParams(input);
    const data = ctx.data;
    return this._def.type._parse({
      data,
      path: ctx.path,
      parent: ctx
    });
  }
  unwrap() {
    return this._def.type;
  }
}

class ZodPipeline extends ZodType {
  _parse(input) {
    const { status, ctx } = this._processInputParams(input);
    if (ctx.common.async) {
      const handleAsync = async () => {
        const inResult = await this._def.in._parseAsync({
          data: ctx.data,
          path: ctx.path,
          parent: ctx
        });
        if (inResult.status === "aborted")
          return INVALID;
        if (inResult.status === "dirty") {
          status.dirty();
          return DIRTY(inResult.value);
        } else {
          return this._def.out._parseAsync({
            data: inResult.value,
            path: ctx.path,
            parent: ctx
          });
        }
      };
      return handleAsync();
    } else {
      const inResult = this._def.in._parseSync({
        data: ctx.data,
        path: ctx.path,
        parent: ctx
      });
      if (inResult.status === "aborted")
        return INVALID;
      if (inResult.status === "dirty") {
        status.dirty();
        return {
          status: "dirty",
          value: inResult.value
        };
      } else {
        return this._def.out._parseSync({
          data: inResult.value,
          path: ctx.path,
          parent: ctx
        });
      }
    }
  }
  static create(a, b) {
    return new ZodPipeline({
      in: a,
      out: b,
      typeName: ZodFirstPartyTypeKind.ZodPipeline
    });
  }
}

class ZodReadonly extends ZodType {
  _parse(input) {
    const result = this._def.innerType._parse(input);
    const freeze = (data) => {
      if (isValid(data)) {
        data.value = Object.freeze(data.value);
      }
      return data;
    };
    return isAsync(result) ? result.then((data) => freeze(data)) : freeze(result);
  }
  unwrap() {
    return this._def.innerType;
  }
}
ZodReadonly.create = (type, params) => {
  return new ZodReadonly({
    innerType: type,
    typeName: ZodFirstPartyTypeKind.ZodReadonly,
    ...processCreateParams(params)
  });
};
function cleanParams(params, data) {
  const p = typeof params === "function" ? params(data) : typeof params === "string" ? { message: params } : params;
  const p2 = typeof p === "string" ? { message: p } : p;
  return p2;
}
function custom(check, _params = {}, fatal) {
  if (check)
    return ZodAny.create().superRefine((data, ctx) => {
      var _a, _b;
      const r = check(data);
      if (r instanceof Promise) {
        return r.then((r2) => {
          var _a2, _b2;
          if (!r2) {
            const params = cleanParams(_params, data);
            const _fatal = (_b2 = (_a2 = params.fatal) !== null && _a2 !== undefined ? _a2 : fatal) !== null && _b2 !== undefined ? _b2 : true;
            ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
          }
        });
      }
      if (!r) {
        const params = cleanParams(_params, data);
        const _fatal = (_b = (_a = params.fatal) !== null && _a !== undefined ? _a : fatal) !== null && _b !== undefined ? _b : true;
        ctx.addIssue({ code: "custom", ...params, fatal: _fatal });
      }
      return;
    });
  return ZodAny.create();
}
var late = {
  object: ZodObject.lazycreate
};
var ZodFirstPartyTypeKind;
(function(ZodFirstPartyTypeKind2) {
  ZodFirstPartyTypeKind2["ZodString"] = "ZodString";
  ZodFirstPartyTypeKind2["ZodNumber"] = "ZodNumber";
  ZodFirstPartyTypeKind2["ZodNaN"] = "ZodNaN";
  ZodFirstPartyTypeKind2["ZodBigInt"] = "ZodBigInt";
  ZodFirstPartyTypeKind2["ZodBoolean"] = "ZodBoolean";
  ZodFirstPartyTypeKind2["ZodDate"] = "ZodDate";
  ZodFirstPartyTypeKind2["ZodSymbol"] = "ZodSymbol";
  ZodFirstPartyTypeKind2["ZodUndefined"] = "ZodUndefined";
  ZodFirstPartyTypeKind2["ZodNull"] = "ZodNull";
  ZodFirstPartyTypeKind2["ZodAny"] = "ZodAny";
  ZodFirstPartyTypeKind2["ZodUnknown"] = "ZodUnknown";
  ZodFirstPartyTypeKind2["ZodNever"] = "ZodNever";
  ZodFirstPartyTypeKind2["ZodVoid"] = "ZodVoid";
  ZodFirstPartyTypeKind2["ZodArray"] = "ZodArray";
  ZodFirstPartyTypeKind2["ZodObject"] = "ZodObject";
  ZodFirstPartyTypeKind2["ZodUnion"] = "ZodUnion";
  ZodFirstPartyTypeKind2["ZodDiscriminatedUnion"] = "ZodDiscriminatedUnion";
  ZodFirstPartyTypeKind2["ZodIntersection"] = "ZodIntersection";
  ZodFirstPartyTypeKind2["ZodTuple"] = "ZodTuple";
  ZodFirstPartyTypeKind2["ZodRecord"] = "ZodRecord";
  ZodFirstPartyTypeKind2["ZodMap"] = "ZodMap";
  ZodFirstPartyTypeKind2["ZodSet"] = "ZodSet";
  ZodFirstPartyTypeKind2["ZodFunction"] = "ZodFunction";
  ZodFirstPartyTypeKind2["ZodLazy"] = "ZodLazy";
  ZodFirstPartyTypeKind2["ZodLiteral"] = "ZodLiteral";
  ZodFirstPartyTypeKind2["ZodEnum"] = "ZodEnum";
  ZodFirstPartyTypeKind2["ZodEffects"] = "ZodEffects";
  ZodFirstPartyTypeKind2["ZodNativeEnum"] = "ZodNativeEnum";
  ZodFirstPartyTypeKind2["ZodOptional"] = "ZodOptional";
  ZodFirstPartyTypeKind2["ZodNullable"] = "ZodNullable";
  ZodFirstPartyTypeKind2["ZodDefault"] = "ZodDefault";
  ZodFirstPartyTypeKind2["ZodCatch"] = "ZodCatch";
  ZodFirstPartyTypeKind2["ZodPromise"] = "ZodPromise";
  ZodFirstPartyTypeKind2["ZodBranded"] = "ZodBranded";
  ZodFirstPartyTypeKind2["ZodPipeline"] = "ZodPipeline";
  ZodFirstPartyTypeKind2["ZodReadonly"] = "ZodReadonly";
})(ZodFirstPartyTypeKind || (ZodFirstPartyTypeKind = {}));
var instanceOfType = (cls, params = {
  message: `Input not instance of ${cls.name}`
}) => custom((data) => data instanceof cls, params);
var stringType = ZodString.create;
var numberType = ZodNumber.create;
var nanType = ZodNaN.create;
var bigIntType = ZodBigInt.create;
var booleanType = ZodBoolean.create;
var dateType = ZodDate.create;
var symbolType = ZodSymbol.create;
var undefinedType = ZodUndefined.create;
var nullType = ZodNull.create;
var anyType = ZodAny.create;
var unknownType = ZodUnknown.create;
var neverType = ZodNever.create;
var voidType = ZodVoid.create;
var arrayType = ZodArray.create;
var objectType = ZodObject.create;
var strictObjectType = ZodObject.strictCreate;
var unionType = ZodUnion.create;
var discriminatedUnionType = ZodDiscriminatedUnion.create;
var intersectionType = ZodIntersection.create;
var tupleType = ZodTuple.create;
var recordType = ZodRecord.create;
var mapType = ZodMap.create;
var setType = ZodSet.create;
var functionType = ZodFunction.create;
var lazyType = ZodLazy.create;
var literalType = ZodLiteral.create;
var enumType = ZodEnum.create;
var nativeEnumType = ZodNativeEnum.create;
var promiseType = ZodPromise.create;
var effectsType = ZodEffects.create;
var optionalType = ZodOptional.create;
var nullableType = ZodNullable.create;
var preprocessType = ZodEffects.createWithPreprocess;
var pipelineType = ZodPipeline.create;
var ostring = () => stringType().optional();
var onumber = () => numberType().optional();
var oboolean = () => booleanType().optional();
var coerce = {
  string: (arg) => ZodString.create({ ...arg, coerce: true }),
  number: (arg) => ZodNumber.create({ ...arg, coerce: true }),
  boolean: (arg) => ZodBoolean.create({
    ...arg,
    coerce: true
  }),
  bigint: (arg) => ZodBigInt.create({ ...arg, coerce: true }),
  date: (arg) => ZodDate.create({ ...arg, coerce: true })
};
var NEVER = INVALID;
var z = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  defaultErrorMap: errorMap,
  setErrorMap,
  getErrorMap,
  makeIssue,
  EMPTY_PATH,
  addIssueToContext,
  ParseStatus,
  INVALID,
  DIRTY,
  OK,
  isAborted,
  isDirty,
  isValid,
  isAsync,
  get util() {
    return util;
  },
  get objectUtil() {
    return objectUtil;
  },
  ZodParsedType,
  getParsedType,
  ZodType,
  datetimeRegex,
  ZodString,
  ZodNumber,
  ZodBigInt,
  ZodBoolean,
  ZodDate,
  ZodSymbol,
  ZodUndefined,
  ZodNull,
  ZodAny,
  ZodUnknown,
  ZodNever,
  ZodVoid,
  ZodArray,
  ZodObject,
  ZodUnion,
  ZodDiscriminatedUnion,
  ZodIntersection,
  ZodTuple,
  ZodRecord,
  ZodMap,
  ZodSet,
  ZodFunction,
  ZodLazy,
  ZodLiteral,
  ZodEnum,
  ZodNativeEnum,
  ZodPromise,
  ZodEffects,
  ZodTransformer: ZodEffects,
  ZodOptional,
  ZodNullable,
  ZodDefault,
  ZodCatch,
  ZodNaN,
  BRAND,
  ZodBranded,
  ZodPipeline,
  ZodReadonly,
  custom,
  Schema: ZodType,
  ZodSchema: ZodType,
  late,
  get ZodFirstPartyTypeKind() {
    return ZodFirstPartyTypeKind;
  },
  coerce,
  any: anyType,
  array: arrayType,
  bigint: bigIntType,
  boolean: booleanType,
  date: dateType,
  discriminatedUnion: discriminatedUnionType,
  effect: effectsType,
  enum: enumType,
  function: functionType,
  instanceof: instanceOfType,
  intersection: intersectionType,
  lazy: lazyType,
  literal: literalType,
  map: mapType,
  nan: nanType,
  nativeEnum: nativeEnumType,
  never: neverType,
  null: nullType,
  nullable: nullableType,
  number: numberType,
  object: objectType,
  oboolean,
  onumber,
  optional: optionalType,
  ostring,
  pipeline: pipelineType,
  preprocess: preprocessType,
  promise: promiseType,
  record: recordType,
  set: setType,
  strictObject: strictObjectType,
  string: stringType,
  symbol: symbolType,
  transformer: effectsType,
  tuple: tupleType,
  undefined: undefinedType,
  union: unionType,
  unknown: unknownType,
  void: voidType,
  NEVER,
  ZodIssueCode,
  quotelessJson,
  ZodError
});

// lib/prisma.ts
var import_client = __toESM(require_default2(), 1);
var prisma = new import_client.PrismaClient;

// backend/trpc/routes/search/route.ts
var searchRouter = createTRPCRouter({
  getAdventures: publicProcedure.input(z.object({
    budget: z.number(),
    adventureType: z.string(),
    location: z.string()
  })).query(async ({ input }) => {
    const adventures = await prisma.adventure.findMany({
      where: {
        type: input.adventureType,
        location: {
          contains: input.location
        },
        price: {
          lte: input.budget
        }
      }
    });
    return adventures.map((adv) => ({
      ...adv,
      details: adv.details.split(", ").filter(Boolean)
    }));
  })
});

// backend/trpc/app-router.ts
var appRouter = createTRPCRouter({
  search: searchRouter
});

// api/index.ts
var app = new Hono2;
app.use("*", cors());
app.use("/trpc/*", import_trpc_server.trpcServer({
  endpoint: "/api/trpc",
  router: appRouter,
  createContext
}));
app.get("/", (c) => {
  return c.json({ status: "ok", message: "API is running" });
});
var api_default = app;
export {
  api_default as default
};

/******/ (function(modules) { // webpackBootstrap
/******/ 	function hotDisposeChunk(chunkId) {
/******/ 		delete installedChunks[chunkId];
/******/ 	}
/******/ 	var parentHotUpdateCallback = window["webpackHotUpdate"];
/******/ 	window["webpackHotUpdate"] = 
/******/ 	function webpackHotUpdateCallback(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		hotAddUpdateChunk(chunkId, moreModules);
/******/ 		if(parentHotUpdateCallback) parentHotUpdateCallback(chunkId, moreModules);
/******/ 	} ;
/******/ 	
/******/ 	function hotDownloadUpdateChunk(chunkId) { // eslint-disable-line no-unused-vars
/******/ 		var head = document.getElementsByTagName("head")[0];
/******/ 		var script = document.createElement("script");
/******/ 		script.type = "text/javascript";
/******/ 		script.charset = "utf-8";
/******/ 		script.src = __webpack_require__.p + "" + chunkId + "." + hotCurrentHash + ".hot-update.js";
/******/ 		;
/******/ 		head.appendChild(script);
/******/ 	}
/******/ 	
/******/ 	function hotDownloadManifest(requestTimeout) { // eslint-disable-line no-unused-vars
/******/ 		requestTimeout = requestTimeout || 10000;
/******/ 		return new Promise(function(resolve, reject) {
/******/ 			if(typeof XMLHttpRequest === "undefined")
/******/ 				return reject(new Error("No browser support"));
/******/ 			try {
/******/ 				var request = new XMLHttpRequest();
/******/ 				var requestPath = __webpack_require__.p + "" + hotCurrentHash + ".hot-update.json";
/******/ 				request.open("GET", requestPath, true);
/******/ 				request.timeout = requestTimeout;
/******/ 				request.send(null);
/******/ 			} catch(err) {
/******/ 				return reject(err);
/******/ 			}
/******/ 			request.onreadystatechange = function() {
/******/ 				if(request.readyState !== 4) return;
/******/ 				if(request.status === 0) {
/******/ 					// timeout
/******/ 					reject(new Error("Manifest request to " + requestPath + " timed out."));
/******/ 				} else if(request.status === 404) {
/******/ 					// no update available
/******/ 					resolve();
/******/ 				} else if(request.status !== 200 && request.status !== 304) {
/******/ 					// other failure
/******/ 					reject(new Error("Manifest request to " + requestPath + " failed."));
/******/ 				} else {
/******/ 					// success
/******/ 					try {
/******/ 						var update = JSON.parse(request.responseText);
/******/ 					} catch(e) {
/******/ 						reject(e);
/******/ 						return;
/******/ 					}
/******/ 					resolve(update);
/******/ 				}
/******/ 			};
/******/ 		});
/******/ 	}
/******/
/******/ 	
/******/ 	
/******/ 	var hotApplyOnUpdate = true;
/******/ 	var hotCurrentHash = "f4441cc5d422feb5bc10"; // eslint-disable-line no-unused-vars
/******/ 	var hotRequestTimeout = 10000;
/******/ 	var hotCurrentModuleData = {};
/******/ 	var hotCurrentChildModule; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParents = []; // eslint-disable-line no-unused-vars
/******/ 	var hotCurrentParentsTemp = []; // eslint-disable-line no-unused-vars
/******/ 	
/******/ 	function hotCreateRequire(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var me = installedModules[moduleId];
/******/ 		if(!me) return __webpack_require__;
/******/ 		var fn = function(request) {
/******/ 			if(me.hot.active) {
/******/ 				if(installedModules[request]) {
/******/ 					if(installedModules[request].parents.indexOf(moduleId) < 0)
/******/ 						installedModules[request].parents.push(moduleId);
/******/ 				} else {
/******/ 					hotCurrentParents = [moduleId];
/******/ 					hotCurrentChildModule = request;
/******/ 				}
/******/ 				if(me.children.indexOf(request) < 0)
/******/ 					me.children.push(request);
/******/ 			} else {
/******/ 				console.warn("[HMR] unexpected require(" + request + ") from disposed module " + moduleId);
/******/ 				hotCurrentParents = [];
/******/ 			}
/******/ 			return __webpack_require__(request);
/******/ 		};
/******/ 		var ObjectFactory = function ObjectFactory(name) {
/******/ 			return {
/******/ 				configurable: true,
/******/ 				enumerable: true,
/******/ 				get: function() {
/******/ 					return __webpack_require__[name];
/******/ 				},
/******/ 				set: function(value) {
/******/ 					__webpack_require__[name] = value;
/******/ 				}
/******/ 			};
/******/ 		};
/******/ 		for(var name in __webpack_require__) {
/******/ 			if(Object.prototype.hasOwnProperty.call(__webpack_require__, name) && name !== "e") {
/******/ 				Object.defineProperty(fn, name, ObjectFactory(name));
/******/ 			}
/******/ 		}
/******/ 		fn.e = function(chunkId) {
/******/ 			if(hotStatus === "ready")
/******/ 				hotSetStatus("prepare");
/******/ 			hotChunksLoading++;
/******/ 			return __webpack_require__.e(chunkId).then(finishChunkLoading, function(err) {
/******/ 				finishChunkLoading();
/******/ 				throw err;
/******/ 			});
/******/ 	
/******/ 			function finishChunkLoading() {
/******/ 				hotChunksLoading--;
/******/ 				if(hotStatus === "prepare") {
/******/ 					if(!hotWaitingFilesMap[chunkId]) {
/******/ 						hotEnsureUpdateChunk(chunkId);
/******/ 					}
/******/ 					if(hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 						hotUpdateDownloaded();
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		};
/******/ 		return fn;
/******/ 	}
/******/ 	
/******/ 	function hotCreateModule(moduleId) { // eslint-disable-line no-unused-vars
/******/ 		var hot = {
/******/ 			// private stuff
/******/ 			_acceptedDependencies: {},
/******/ 			_declinedDependencies: {},
/******/ 			_selfAccepted: false,
/******/ 			_selfDeclined: false,
/******/ 			_disposeHandlers: [],
/******/ 			_main: hotCurrentChildModule !== moduleId,
/******/ 	
/******/ 			// Module API
/******/ 			active: true,
/******/ 			accept: function(dep, callback) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfAccepted = true;
/******/ 				else if(typeof dep === "function")
/******/ 					hot._selfAccepted = dep;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._acceptedDependencies[dep[i]] = callback || function() {};
/******/ 				else
/******/ 					hot._acceptedDependencies[dep] = callback || function() {};
/******/ 			},
/******/ 			decline: function(dep) {
/******/ 				if(typeof dep === "undefined")
/******/ 					hot._selfDeclined = true;
/******/ 				else if(typeof dep === "object")
/******/ 					for(var i = 0; i < dep.length; i++)
/******/ 						hot._declinedDependencies[dep[i]] = true;
/******/ 				else
/******/ 					hot._declinedDependencies[dep] = true;
/******/ 			},
/******/ 			dispose: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			addDisposeHandler: function(callback) {
/******/ 				hot._disposeHandlers.push(callback);
/******/ 			},
/******/ 			removeDisposeHandler: function(callback) {
/******/ 				var idx = hot._disposeHandlers.indexOf(callback);
/******/ 				if(idx >= 0) hot._disposeHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			// Management API
/******/ 			check: hotCheck,
/******/ 			apply: hotApply,
/******/ 			status: function(l) {
/******/ 				if(!l) return hotStatus;
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			addStatusHandler: function(l) {
/******/ 				hotStatusHandlers.push(l);
/******/ 			},
/******/ 			removeStatusHandler: function(l) {
/******/ 				var idx = hotStatusHandlers.indexOf(l);
/******/ 				if(idx >= 0) hotStatusHandlers.splice(idx, 1);
/******/ 			},
/******/ 	
/******/ 			//inherit from previous dispose call
/******/ 			data: hotCurrentModuleData[moduleId]
/******/ 		};
/******/ 		hotCurrentChildModule = undefined;
/******/ 		return hot;
/******/ 	}
/******/ 	
/******/ 	var hotStatusHandlers = [];
/******/ 	var hotStatus = "idle";
/******/ 	
/******/ 	function hotSetStatus(newStatus) {
/******/ 		hotStatus = newStatus;
/******/ 		for(var i = 0; i < hotStatusHandlers.length; i++)
/******/ 			hotStatusHandlers[i].call(null, newStatus);
/******/ 	}
/******/ 	
/******/ 	// while downloading
/******/ 	var hotWaitingFiles = 0;
/******/ 	var hotChunksLoading = 0;
/******/ 	var hotWaitingFilesMap = {};
/******/ 	var hotRequestedFilesMap = {};
/******/ 	var hotAvailableFilesMap = {};
/******/ 	var hotDeferred;
/******/ 	
/******/ 	// The update info
/******/ 	var hotUpdate, hotUpdateNewHash;
/******/ 	
/******/ 	function toModuleId(id) {
/******/ 		var isNumber = (+id) + "" === id;
/******/ 		return isNumber ? +id : id;
/******/ 	}
/******/ 	
/******/ 	function hotCheck(apply) {
/******/ 		if(hotStatus !== "idle") throw new Error("check() is only allowed in idle status");
/******/ 		hotApplyOnUpdate = apply;
/******/ 		hotSetStatus("check");
/******/ 		return hotDownloadManifest(hotRequestTimeout).then(function(update) {
/******/ 			if(!update) {
/******/ 				hotSetStatus("idle");
/******/ 				return null;
/******/ 			}
/******/ 			hotRequestedFilesMap = {};
/******/ 			hotWaitingFilesMap = {};
/******/ 			hotAvailableFilesMap = update.c;
/******/ 			hotUpdateNewHash = update.h;
/******/ 	
/******/ 			hotSetStatus("prepare");
/******/ 			var promise = new Promise(function(resolve, reject) {
/******/ 				hotDeferred = {
/******/ 					resolve: resolve,
/******/ 					reject: reject
/******/ 				};
/******/ 			});
/******/ 			hotUpdate = {};
/******/ 			var chunkId = 0;
/******/ 			{ // eslint-disable-line no-lone-blocks
/******/ 				/*globals chunkId */
/******/ 				hotEnsureUpdateChunk(chunkId);
/******/ 			}
/******/ 			if(hotStatus === "prepare" && hotChunksLoading === 0 && hotWaitingFiles === 0) {
/******/ 				hotUpdateDownloaded();
/******/ 			}
/******/ 			return promise;
/******/ 		});
/******/ 	}
/******/ 	
/******/ 	function hotAddUpdateChunk(chunkId, moreModules) { // eslint-disable-line no-unused-vars
/******/ 		if(!hotAvailableFilesMap[chunkId] || !hotRequestedFilesMap[chunkId])
/******/ 			return;
/******/ 		hotRequestedFilesMap[chunkId] = false;
/******/ 		for(var moduleId in moreModules) {
/******/ 			if(Object.prototype.hasOwnProperty.call(moreModules, moduleId)) {
/******/ 				hotUpdate[moduleId] = moreModules[moduleId];
/******/ 			}
/******/ 		}
/******/ 		if(--hotWaitingFiles === 0 && hotChunksLoading === 0) {
/******/ 			hotUpdateDownloaded();
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotEnsureUpdateChunk(chunkId) {
/******/ 		if(!hotAvailableFilesMap[chunkId]) {
/******/ 			hotWaitingFilesMap[chunkId] = true;
/******/ 		} else {
/******/ 			hotRequestedFilesMap[chunkId] = true;
/******/ 			hotWaitingFiles++;
/******/ 			hotDownloadUpdateChunk(chunkId);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotUpdateDownloaded() {
/******/ 		hotSetStatus("ready");
/******/ 		var deferred = hotDeferred;
/******/ 		hotDeferred = null;
/******/ 		if(!deferred) return;
/******/ 		if(hotApplyOnUpdate) {
/******/ 			// Wrap deferred object in Promise to mark it as a well-handled Promise to
/******/ 			// avoid triggering uncaught exception warning in Chrome.
/******/ 			// See https://bugs.chromium.org/p/chromium/issues/detail?id=465666
/******/ 			Promise.resolve().then(function() {
/******/ 				return hotApply(hotApplyOnUpdate);
/******/ 			}).then(
/******/ 				function(result) {
/******/ 					deferred.resolve(result);
/******/ 				},
/******/ 				function(err) {
/******/ 					deferred.reject(err);
/******/ 				}
/******/ 			);
/******/ 		} else {
/******/ 			var outdatedModules = [];
/******/ 			for(var id in hotUpdate) {
/******/ 				if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 					outdatedModules.push(toModuleId(id));
/******/ 				}
/******/ 			}
/******/ 			deferred.resolve(outdatedModules);
/******/ 		}
/******/ 	}
/******/ 	
/******/ 	function hotApply(options) {
/******/ 		if(hotStatus !== "ready") throw new Error("apply() is only allowed in ready status");
/******/ 		options = options || {};
/******/ 	
/******/ 		var cb;
/******/ 		var i;
/******/ 		var j;
/******/ 		var module;
/******/ 		var moduleId;
/******/ 	
/******/ 		function getAffectedStuff(updateModuleId) {
/******/ 			var outdatedModules = [updateModuleId];
/******/ 			var outdatedDependencies = {};
/******/ 	
/******/ 			var queue = outdatedModules.slice().map(function(id) {
/******/ 				return {
/******/ 					chain: [id],
/******/ 					id: id
/******/ 				};
/******/ 			});
/******/ 			while(queue.length > 0) {
/******/ 				var queueItem = queue.pop();
/******/ 				var moduleId = queueItem.id;
/******/ 				var chain = queueItem.chain;
/******/ 				module = installedModules[moduleId];
/******/ 				if(!module || module.hot._selfAccepted)
/******/ 					continue;
/******/ 				if(module.hot._selfDeclined) {
/******/ 					return {
/******/ 						type: "self-declined",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				if(module.hot._main) {
/******/ 					return {
/******/ 						type: "unaccepted",
/******/ 						chain: chain,
/******/ 						moduleId: moduleId
/******/ 					};
/******/ 				}
/******/ 				for(var i = 0; i < module.parents.length; i++) {
/******/ 					var parentId = module.parents[i];
/******/ 					var parent = installedModules[parentId];
/******/ 					if(!parent) continue;
/******/ 					if(parent.hot._declinedDependencies[moduleId]) {
/******/ 						return {
/******/ 							type: "declined",
/******/ 							chain: chain.concat([parentId]),
/******/ 							moduleId: moduleId,
/******/ 							parentId: parentId
/******/ 						};
/******/ 					}
/******/ 					if(outdatedModules.indexOf(parentId) >= 0) continue;
/******/ 					if(parent.hot._acceptedDependencies[moduleId]) {
/******/ 						if(!outdatedDependencies[parentId])
/******/ 							outdatedDependencies[parentId] = [];
/******/ 						addAllToSet(outdatedDependencies[parentId], [moduleId]);
/******/ 						continue;
/******/ 					}
/******/ 					delete outdatedDependencies[parentId];
/******/ 					outdatedModules.push(parentId);
/******/ 					queue.push({
/******/ 						chain: chain.concat([parentId]),
/******/ 						id: parentId
/******/ 					});
/******/ 				}
/******/ 			}
/******/ 	
/******/ 			return {
/******/ 				type: "accepted",
/******/ 				moduleId: updateModuleId,
/******/ 				outdatedModules: outdatedModules,
/******/ 				outdatedDependencies: outdatedDependencies
/******/ 			};
/******/ 		}
/******/ 	
/******/ 		function addAllToSet(a, b) {
/******/ 			for(var i = 0; i < b.length; i++) {
/******/ 				var item = b[i];
/******/ 				if(a.indexOf(item) < 0)
/******/ 					a.push(item);
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// at begin all updates modules are outdated
/******/ 		// the "outdated" status can propagate to parents if they don't accept the children
/******/ 		var outdatedDependencies = {};
/******/ 		var outdatedModules = [];
/******/ 		var appliedUpdate = {};
/******/ 	
/******/ 		var warnUnexpectedRequire = function warnUnexpectedRequire() {
/******/ 			console.warn("[HMR] unexpected require(" + result.moduleId + ") to disposed module");
/******/ 		};
/******/ 	
/******/ 		for(var id in hotUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(hotUpdate, id)) {
/******/ 				moduleId = toModuleId(id);
/******/ 				var result;
/******/ 				if(hotUpdate[id]) {
/******/ 					result = getAffectedStuff(moduleId);
/******/ 				} else {
/******/ 					result = {
/******/ 						type: "disposed",
/******/ 						moduleId: id
/******/ 					};
/******/ 				}
/******/ 				var abortError = false;
/******/ 				var doApply = false;
/******/ 				var doDispose = false;
/******/ 				var chainInfo = "";
/******/ 				if(result.chain) {
/******/ 					chainInfo = "\nUpdate propagation: " + result.chain.join(" -> ");
/******/ 				}
/******/ 				switch(result.type) {
/******/ 					case "self-declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of self decline: " + result.moduleId + chainInfo);
/******/ 						break;
/******/ 					case "declined":
/******/ 						if(options.onDeclined)
/******/ 							options.onDeclined(result);
/******/ 						if(!options.ignoreDeclined)
/******/ 							abortError = new Error("Aborted because of declined dependency: " + result.moduleId + " in " + result.parentId + chainInfo);
/******/ 						break;
/******/ 					case "unaccepted":
/******/ 						if(options.onUnaccepted)
/******/ 							options.onUnaccepted(result);
/******/ 						if(!options.ignoreUnaccepted)
/******/ 							abortError = new Error("Aborted because " + moduleId + " is not accepted" + chainInfo);
/******/ 						break;
/******/ 					case "accepted":
/******/ 						if(options.onAccepted)
/******/ 							options.onAccepted(result);
/******/ 						doApply = true;
/******/ 						break;
/******/ 					case "disposed":
/******/ 						if(options.onDisposed)
/******/ 							options.onDisposed(result);
/******/ 						doDispose = true;
/******/ 						break;
/******/ 					default:
/******/ 						throw new Error("Unexception type " + result.type);
/******/ 				}
/******/ 				if(abortError) {
/******/ 					hotSetStatus("abort");
/******/ 					return Promise.reject(abortError);
/******/ 				}
/******/ 				if(doApply) {
/******/ 					appliedUpdate[moduleId] = hotUpdate[moduleId];
/******/ 					addAllToSet(outdatedModules, result.outdatedModules);
/******/ 					for(moduleId in result.outdatedDependencies) {
/******/ 						if(Object.prototype.hasOwnProperty.call(result.outdatedDependencies, moduleId)) {
/******/ 							if(!outdatedDependencies[moduleId])
/******/ 								outdatedDependencies[moduleId] = [];
/******/ 							addAllToSet(outdatedDependencies[moduleId], result.outdatedDependencies[moduleId]);
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 				if(doDispose) {
/******/ 					addAllToSet(outdatedModules, [result.moduleId]);
/******/ 					appliedUpdate[moduleId] = warnUnexpectedRequire;
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Store self accepted outdated modules to require them later by the module system
/******/ 		var outdatedSelfAcceptedModules = [];
/******/ 		for(i = 0; i < outdatedModules.length; i++) {
/******/ 			moduleId = outdatedModules[i];
/******/ 			if(installedModules[moduleId] && installedModules[moduleId].hot._selfAccepted)
/******/ 				outdatedSelfAcceptedModules.push({
/******/ 					module: moduleId,
/******/ 					errorHandler: installedModules[moduleId].hot._selfAccepted
/******/ 				});
/******/ 		}
/******/ 	
/******/ 		// Now in "dispose" phase
/******/ 		hotSetStatus("dispose");
/******/ 		Object.keys(hotAvailableFilesMap).forEach(function(chunkId) {
/******/ 			if(hotAvailableFilesMap[chunkId] === false) {
/******/ 				hotDisposeChunk(chunkId);
/******/ 			}
/******/ 		});
/******/ 	
/******/ 		var idx;
/******/ 		var queue = outdatedModules.slice();
/******/ 		while(queue.length > 0) {
/******/ 			moduleId = queue.pop();
/******/ 			module = installedModules[moduleId];
/******/ 			if(!module) continue;
/******/ 	
/******/ 			var data = {};
/******/ 	
/******/ 			// Call dispose handlers
/******/ 			var disposeHandlers = module.hot._disposeHandlers;
/******/ 			for(j = 0; j < disposeHandlers.length; j++) {
/******/ 				cb = disposeHandlers[j];
/******/ 				cb(data);
/******/ 			}
/******/ 			hotCurrentModuleData[moduleId] = data;
/******/ 	
/******/ 			// disable module (this disables requires from this module)
/******/ 			module.hot.active = false;
/******/ 	
/******/ 			// remove module from cache
/******/ 			delete installedModules[moduleId];
/******/ 	
/******/ 			// when disposing there is no need to call dispose handler
/******/ 			delete outdatedDependencies[moduleId];
/******/ 	
/******/ 			// remove "parents" references from all children
/******/ 			for(j = 0; j < module.children.length; j++) {
/******/ 				var child = installedModules[module.children[j]];
/******/ 				if(!child) continue;
/******/ 				idx = child.parents.indexOf(moduleId);
/******/ 				if(idx >= 0) {
/******/ 					child.parents.splice(idx, 1);
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// remove outdated dependency from module children
/******/ 		var dependency;
/******/ 		var moduleOutdatedDependencies;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					for(j = 0; j < moduleOutdatedDependencies.length; j++) {
/******/ 						dependency = moduleOutdatedDependencies[j];
/******/ 						idx = module.children.indexOf(dependency);
/******/ 						if(idx >= 0) module.children.splice(idx, 1);
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Not in "apply" phase
/******/ 		hotSetStatus("apply");
/******/ 	
/******/ 		hotCurrentHash = hotUpdateNewHash;
/******/ 	
/******/ 		// insert new code
/******/ 		for(moduleId in appliedUpdate) {
/******/ 			if(Object.prototype.hasOwnProperty.call(appliedUpdate, moduleId)) {
/******/ 				modules[moduleId] = appliedUpdate[moduleId];
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// call accept handlers
/******/ 		var error = null;
/******/ 		for(moduleId in outdatedDependencies) {
/******/ 			if(Object.prototype.hasOwnProperty.call(outdatedDependencies, moduleId)) {
/******/ 				module = installedModules[moduleId];
/******/ 				if(module) {
/******/ 					moduleOutdatedDependencies = outdatedDependencies[moduleId];
/******/ 					var callbacks = [];
/******/ 					for(i = 0; i < moduleOutdatedDependencies.length; i++) {
/******/ 						dependency = moduleOutdatedDependencies[i];
/******/ 						cb = module.hot._acceptedDependencies[dependency];
/******/ 						if(cb) {
/******/ 							if(callbacks.indexOf(cb) >= 0) continue;
/******/ 							callbacks.push(cb);
/******/ 						}
/******/ 					}
/******/ 					for(i = 0; i < callbacks.length; i++) {
/******/ 						cb = callbacks[i];
/******/ 						try {
/******/ 							cb(moduleOutdatedDependencies);
/******/ 						} catch(err) {
/******/ 							if(options.onErrored) {
/******/ 								options.onErrored({
/******/ 									type: "accept-errored",
/******/ 									moduleId: moduleId,
/******/ 									dependencyId: moduleOutdatedDependencies[i],
/******/ 									error: err
/******/ 								});
/******/ 							}
/******/ 							if(!options.ignoreErrored) {
/******/ 								if(!error)
/******/ 									error = err;
/******/ 							}
/******/ 						}
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// Load self accepted modules
/******/ 		for(i = 0; i < outdatedSelfAcceptedModules.length; i++) {
/******/ 			var item = outdatedSelfAcceptedModules[i];
/******/ 			moduleId = item.module;
/******/ 			hotCurrentParents = [moduleId];
/******/ 			try {
/******/ 				__webpack_require__(moduleId);
/******/ 			} catch(err) {
/******/ 				if(typeof item.errorHandler === "function") {
/******/ 					try {
/******/ 						item.errorHandler(err);
/******/ 					} catch(err2) {
/******/ 						if(options.onErrored) {
/******/ 							options.onErrored({
/******/ 								type: "self-accept-error-handler-errored",
/******/ 								moduleId: moduleId,
/******/ 								error: err2,
/******/ 								orginalError: err, // TODO remove in webpack 4
/******/ 								originalError: err
/******/ 							});
/******/ 						}
/******/ 						if(!options.ignoreErrored) {
/******/ 							if(!error)
/******/ 								error = err2;
/******/ 						}
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				} else {
/******/ 					if(options.onErrored) {
/******/ 						options.onErrored({
/******/ 							type: "self-accept-errored",
/******/ 							moduleId: moduleId,
/******/ 							error: err
/******/ 						});
/******/ 					}
/******/ 					if(!options.ignoreErrored) {
/******/ 						if(!error)
/******/ 							error = err;
/******/ 					}
/******/ 				}
/******/ 			}
/******/ 		}
/******/ 	
/******/ 		// handle errors in accept handlers and self accepted module load
/******/ 		if(error) {
/******/ 			hotSetStatus("fail");
/******/ 			return Promise.reject(error);
/******/ 		}
/******/ 	
/******/ 		hotSetStatus("idle");
/******/ 		return new Promise(function(resolve) {
/******/ 			resolve(outdatedModules);
/******/ 		});
/******/ 	}
/******/
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {},
/******/ 			hot: hotCreateModule(moduleId),
/******/ 			parents: (hotCurrentParentsTemp = hotCurrentParents, hotCurrentParents = [], hotCurrentParentsTemp),
/******/ 			children: []
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, hotCreateRequire(moduleId));
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "http://localhost:3000/wp-content/themes/sage-lete/dist/";
/******/
/******/ 	// __webpack_hash__
/******/ 	__webpack_require__.h = function() { return hotCurrentHash; };
/******/
/******/ 	// Load entry module and return exports
/******/ 	return hotCreateRequire(20)(__webpack_require__.s = 20);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/*!***************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/html-entities/lib/html5-entities.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ENTITIES = [['Aacute', [193]], ['aacute', [225]], ['Abreve', [258]], ['abreve', [259]], ['ac', [8766]], ['acd', [8767]], ['acE', [8766, 819]], ['Acirc', [194]], ['acirc', [226]], ['acute', [180]], ['Acy', [1040]], ['acy', [1072]], ['AElig', [198]], ['aelig', [230]], ['af', [8289]], ['Afr', [120068]], ['afr', [120094]], ['Agrave', [192]], ['agrave', [224]], ['alefsym', [8501]], ['aleph', [8501]], ['Alpha', [913]], ['alpha', [945]], ['Amacr', [256]], ['amacr', [257]], ['amalg', [10815]], ['amp', [38]], ['AMP', [38]], ['andand', [10837]], ['And', [10835]], ['and', [8743]], ['andd', [10844]], ['andslope', [10840]], ['andv', [10842]], ['ang', [8736]], ['ange', [10660]], ['angle', [8736]], ['angmsdaa', [10664]], ['angmsdab', [10665]], ['angmsdac', [10666]], ['angmsdad', [10667]], ['angmsdae', [10668]], ['angmsdaf', [10669]], ['angmsdag', [10670]], ['angmsdah', [10671]], ['angmsd', [8737]], ['angrt', [8735]], ['angrtvb', [8894]], ['angrtvbd', [10653]], ['angsph', [8738]], ['angst', [197]], ['angzarr', [9084]], ['Aogon', [260]], ['aogon', [261]], ['Aopf', [120120]], ['aopf', [120146]], ['apacir', [10863]], ['ap', [8776]], ['apE', [10864]], ['ape', [8778]], ['apid', [8779]], ['apos', [39]], ['ApplyFunction', [8289]], ['approx', [8776]], ['approxeq', [8778]], ['Aring', [197]], ['aring', [229]], ['Ascr', [119964]], ['ascr', [119990]], ['Assign', [8788]], ['ast', [42]], ['asymp', [8776]], ['asympeq', [8781]], ['Atilde', [195]], ['atilde', [227]], ['Auml', [196]], ['auml', [228]], ['awconint', [8755]], ['awint', [10769]], ['backcong', [8780]], ['backepsilon', [1014]], ['backprime', [8245]], ['backsim', [8765]], ['backsimeq', [8909]], ['Backslash', [8726]], ['Barv', [10983]], ['barvee', [8893]], ['barwed', [8965]], ['Barwed', [8966]], ['barwedge', [8965]], ['bbrk', [9141]], ['bbrktbrk', [9142]], ['bcong', [8780]], ['Bcy', [1041]], ['bcy', [1073]], ['bdquo', [8222]], ['becaus', [8757]], ['because', [8757]], ['Because', [8757]], ['bemptyv', [10672]], ['bepsi', [1014]], ['bernou', [8492]], ['Bernoullis', [8492]], ['Beta', [914]], ['beta', [946]], ['beth', [8502]], ['between', [8812]], ['Bfr', [120069]], ['bfr', [120095]], ['bigcap', [8898]], ['bigcirc', [9711]], ['bigcup', [8899]], ['bigodot', [10752]], ['bigoplus', [10753]], ['bigotimes', [10754]], ['bigsqcup', [10758]], ['bigstar', [9733]], ['bigtriangledown', [9661]], ['bigtriangleup', [9651]], ['biguplus', [10756]], ['bigvee', [8897]], ['bigwedge', [8896]], ['bkarow', [10509]], ['blacklozenge', [10731]], ['blacksquare', [9642]], ['blacktriangle', [9652]], ['blacktriangledown', [9662]], ['blacktriangleleft', [9666]], ['blacktriangleright', [9656]], ['blank', [9251]], ['blk12', [9618]], ['blk14', [9617]], ['blk34', [9619]], ['block', [9608]], ['bne', [61, 8421]], ['bnequiv', [8801, 8421]], ['bNot', [10989]], ['bnot', [8976]], ['Bopf', [120121]], ['bopf', [120147]], ['bot', [8869]], ['bottom', [8869]], ['bowtie', [8904]], ['boxbox', [10697]], ['boxdl', [9488]], ['boxdL', [9557]], ['boxDl', [9558]], ['boxDL', [9559]], ['boxdr', [9484]], ['boxdR', [9554]], ['boxDr', [9555]], ['boxDR', [9556]], ['boxh', [9472]], ['boxH', [9552]], ['boxhd', [9516]], ['boxHd', [9572]], ['boxhD', [9573]], ['boxHD', [9574]], ['boxhu', [9524]], ['boxHu', [9575]], ['boxhU', [9576]], ['boxHU', [9577]], ['boxminus', [8863]], ['boxplus', [8862]], ['boxtimes', [8864]], ['boxul', [9496]], ['boxuL', [9563]], ['boxUl', [9564]], ['boxUL', [9565]], ['boxur', [9492]], ['boxuR', [9560]], ['boxUr', [9561]], ['boxUR', [9562]], ['boxv', [9474]], ['boxV', [9553]], ['boxvh', [9532]], ['boxvH', [9578]], ['boxVh', [9579]], ['boxVH', [9580]], ['boxvl', [9508]], ['boxvL', [9569]], ['boxVl', [9570]], ['boxVL', [9571]], ['boxvr', [9500]], ['boxvR', [9566]], ['boxVr', [9567]], ['boxVR', [9568]], ['bprime', [8245]], ['breve', [728]], ['Breve', [728]], ['brvbar', [166]], ['bscr', [119991]], ['Bscr', [8492]], ['bsemi', [8271]], ['bsim', [8765]], ['bsime', [8909]], ['bsolb', [10693]], ['bsol', [92]], ['bsolhsub', [10184]], ['bull', [8226]], ['bullet', [8226]], ['bump', [8782]], ['bumpE', [10926]], ['bumpe', [8783]], ['Bumpeq', [8782]], ['bumpeq', [8783]], ['Cacute', [262]], ['cacute', [263]], ['capand', [10820]], ['capbrcup', [10825]], ['capcap', [10827]], ['cap', [8745]], ['Cap', [8914]], ['capcup', [10823]], ['capdot', [10816]], ['CapitalDifferentialD', [8517]], ['caps', [8745, 65024]], ['caret', [8257]], ['caron', [711]], ['Cayleys', [8493]], ['ccaps', [10829]], ['Ccaron', [268]], ['ccaron', [269]], ['Ccedil', [199]], ['ccedil', [231]], ['Ccirc', [264]], ['ccirc', [265]], ['Cconint', [8752]], ['ccups', [10828]], ['ccupssm', [10832]], ['Cdot', [266]], ['cdot', [267]], ['cedil', [184]], ['Cedilla', [184]], ['cemptyv', [10674]], ['cent', [162]], ['centerdot', [183]], ['CenterDot', [183]], ['cfr', [120096]], ['Cfr', [8493]], ['CHcy', [1063]], ['chcy', [1095]], ['check', [10003]], ['checkmark', [10003]], ['Chi', [935]], ['chi', [967]], ['circ', [710]], ['circeq', [8791]], ['circlearrowleft', [8634]], ['circlearrowright', [8635]], ['circledast', [8859]], ['circledcirc', [8858]], ['circleddash', [8861]], ['CircleDot', [8857]], ['circledR', [174]], ['circledS', [9416]], ['CircleMinus', [8854]], ['CirclePlus', [8853]], ['CircleTimes', [8855]], ['cir', [9675]], ['cirE', [10691]], ['cire', [8791]], ['cirfnint', [10768]], ['cirmid', [10991]], ['cirscir', [10690]], ['ClockwiseContourIntegral', [8754]], ['clubs', [9827]], ['clubsuit', [9827]], ['colon', [58]], ['Colon', [8759]], ['Colone', [10868]], ['colone', [8788]], ['coloneq', [8788]], ['comma', [44]], ['commat', [64]], ['comp', [8705]], ['compfn', [8728]], ['complement', [8705]], ['complexes', [8450]], ['cong', [8773]], ['congdot', [10861]], ['Congruent', [8801]], ['conint', [8750]], ['Conint', [8751]], ['ContourIntegral', [8750]], ['copf', [120148]], ['Copf', [8450]], ['coprod', [8720]], ['Coproduct', [8720]], ['copy', [169]], ['COPY', [169]], ['copysr', [8471]], ['CounterClockwiseContourIntegral', [8755]], ['crarr', [8629]], ['cross', [10007]], ['Cross', [10799]], ['Cscr', [119966]], ['cscr', [119992]], ['csub', [10959]], ['csube', [10961]], ['csup', [10960]], ['csupe', [10962]], ['ctdot', [8943]], ['cudarrl', [10552]], ['cudarrr', [10549]], ['cuepr', [8926]], ['cuesc', [8927]], ['cularr', [8630]], ['cularrp', [10557]], ['cupbrcap', [10824]], ['cupcap', [10822]], ['CupCap', [8781]], ['cup', [8746]], ['Cup', [8915]], ['cupcup', [10826]], ['cupdot', [8845]], ['cupor', [10821]], ['cups', [8746, 65024]], ['curarr', [8631]], ['curarrm', [10556]], ['curlyeqprec', [8926]], ['curlyeqsucc', [8927]], ['curlyvee', [8910]], ['curlywedge', [8911]], ['curren', [164]], ['curvearrowleft', [8630]], ['curvearrowright', [8631]], ['cuvee', [8910]], ['cuwed', [8911]], ['cwconint', [8754]], ['cwint', [8753]], ['cylcty', [9005]], ['dagger', [8224]], ['Dagger', [8225]], ['daleth', [8504]], ['darr', [8595]], ['Darr', [8609]], ['dArr', [8659]], ['dash', [8208]], ['Dashv', [10980]], ['dashv', [8867]], ['dbkarow', [10511]], ['dblac', [733]], ['Dcaron', [270]], ['dcaron', [271]], ['Dcy', [1044]], ['dcy', [1076]], ['ddagger', [8225]], ['ddarr', [8650]], ['DD', [8517]], ['dd', [8518]], ['DDotrahd', [10513]], ['ddotseq', [10871]], ['deg', [176]], ['Del', [8711]], ['Delta', [916]], ['delta', [948]], ['demptyv', [10673]], ['dfisht', [10623]], ['Dfr', [120071]], ['dfr', [120097]], ['dHar', [10597]], ['dharl', [8643]], ['dharr', [8642]], ['DiacriticalAcute', [180]], ['DiacriticalDot', [729]], ['DiacriticalDoubleAcute', [733]], ['DiacriticalGrave', [96]], ['DiacriticalTilde', [732]], ['diam', [8900]], ['diamond', [8900]], ['Diamond', [8900]], ['diamondsuit', [9830]], ['diams', [9830]], ['die', [168]], ['DifferentialD', [8518]], ['digamma', [989]], ['disin', [8946]], ['div', [247]], ['divide', [247]], ['divideontimes', [8903]], ['divonx', [8903]], ['DJcy', [1026]], ['djcy', [1106]], ['dlcorn', [8990]], ['dlcrop', [8973]], ['dollar', [36]], ['Dopf', [120123]], ['dopf', [120149]], ['Dot', [168]], ['dot', [729]], ['DotDot', [8412]], ['doteq', [8784]], ['doteqdot', [8785]], ['DotEqual', [8784]], ['dotminus', [8760]], ['dotplus', [8724]], ['dotsquare', [8865]], ['doublebarwedge', [8966]], ['DoubleContourIntegral', [8751]], ['DoubleDot', [168]], ['DoubleDownArrow', [8659]], ['DoubleLeftArrow', [8656]], ['DoubleLeftRightArrow', [8660]], ['DoubleLeftTee', [10980]], ['DoubleLongLeftArrow', [10232]], ['DoubleLongLeftRightArrow', [10234]], ['DoubleLongRightArrow', [10233]], ['DoubleRightArrow', [8658]], ['DoubleRightTee', [8872]], ['DoubleUpArrow', [8657]], ['DoubleUpDownArrow', [8661]], ['DoubleVerticalBar', [8741]], ['DownArrowBar', [10515]], ['downarrow', [8595]], ['DownArrow', [8595]], ['Downarrow', [8659]], ['DownArrowUpArrow', [8693]], ['DownBreve', [785]], ['downdownarrows', [8650]], ['downharpoonleft', [8643]], ['downharpoonright', [8642]], ['DownLeftRightVector', [10576]], ['DownLeftTeeVector', [10590]], ['DownLeftVectorBar', [10582]], ['DownLeftVector', [8637]], ['DownRightTeeVector', [10591]], ['DownRightVectorBar', [10583]], ['DownRightVector', [8641]], ['DownTeeArrow', [8615]], ['DownTee', [8868]], ['drbkarow', [10512]], ['drcorn', [8991]], ['drcrop', [8972]], ['Dscr', [119967]], ['dscr', [119993]], ['DScy', [1029]], ['dscy', [1109]], ['dsol', [10742]], ['Dstrok', [272]], ['dstrok', [273]], ['dtdot', [8945]], ['dtri', [9663]], ['dtrif', [9662]], ['duarr', [8693]], ['duhar', [10607]], ['dwangle', [10662]], ['DZcy', [1039]], ['dzcy', [1119]], ['dzigrarr', [10239]], ['Eacute', [201]], ['eacute', [233]], ['easter', [10862]], ['Ecaron', [282]], ['ecaron', [283]], ['Ecirc', [202]], ['ecirc', [234]], ['ecir', [8790]], ['ecolon', [8789]], ['Ecy', [1069]], ['ecy', [1101]], ['eDDot', [10871]], ['Edot', [278]], ['edot', [279]], ['eDot', [8785]], ['ee', [8519]], ['efDot', [8786]], ['Efr', [120072]], ['efr', [120098]], ['eg', [10906]], ['Egrave', [200]], ['egrave', [232]], ['egs', [10902]], ['egsdot', [10904]], ['el', [10905]], ['Element', [8712]], ['elinters', [9191]], ['ell', [8467]], ['els', [10901]], ['elsdot', [10903]], ['Emacr', [274]], ['emacr', [275]], ['empty', [8709]], ['emptyset', [8709]], ['EmptySmallSquare', [9723]], ['emptyv', [8709]], ['EmptyVerySmallSquare', [9643]], ['emsp13', [8196]], ['emsp14', [8197]], ['emsp', [8195]], ['ENG', [330]], ['eng', [331]], ['ensp', [8194]], ['Eogon', [280]], ['eogon', [281]], ['Eopf', [120124]], ['eopf', [120150]], ['epar', [8917]], ['eparsl', [10723]], ['eplus', [10865]], ['epsi', [949]], ['Epsilon', [917]], ['epsilon', [949]], ['epsiv', [1013]], ['eqcirc', [8790]], ['eqcolon', [8789]], ['eqsim', [8770]], ['eqslantgtr', [10902]], ['eqslantless', [10901]], ['Equal', [10869]], ['equals', [61]], ['EqualTilde', [8770]], ['equest', [8799]], ['Equilibrium', [8652]], ['equiv', [8801]], ['equivDD', [10872]], ['eqvparsl', [10725]], ['erarr', [10609]], ['erDot', [8787]], ['escr', [8495]], ['Escr', [8496]], ['esdot', [8784]], ['Esim', [10867]], ['esim', [8770]], ['Eta', [919]], ['eta', [951]], ['ETH', [208]], ['eth', [240]], ['Euml', [203]], ['euml', [235]], ['euro', [8364]], ['excl', [33]], ['exist', [8707]], ['Exists', [8707]], ['expectation', [8496]], ['exponentiale', [8519]], ['ExponentialE', [8519]], ['fallingdotseq', [8786]], ['Fcy', [1060]], ['fcy', [1092]], ['female', [9792]], ['ffilig', [64259]], ['fflig', [64256]], ['ffllig', [64260]], ['Ffr', [120073]], ['ffr', [120099]], ['filig', [64257]], ['FilledSmallSquare', [9724]], ['FilledVerySmallSquare', [9642]], ['fjlig', [102, 106]], ['flat', [9837]], ['fllig', [64258]], ['fltns', [9649]], ['fnof', [402]], ['Fopf', [120125]], ['fopf', [120151]], ['forall', [8704]], ['ForAll', [8704]], ['fork', [8916]], ['forkv', [10969]], ['Fouriertrf', [8497]], ['fpartint', [10765]], ['frac12', [189]], ['frac13', [8531]], ['frac14', [188]], ['frac15', [8533]], ['frac16', [8537]], ['frac18', [8539]], ['frac23', [8532]], ['frac25', [8534]], ['frac34', [190]], ['frac35', [8535]], ['frac38', [8540]], ['frac45', [8536]], ['frac56', [8538]], ['frac58', [8541]], ['frac78', [8542]], ['frasl', [8260]], ['frown', [8994]], ['fscr', [119995]], ['Fscr', [8497]], ['gacute', [501]], ['Gamma', [915]], ['gamma', [947]], ['Gammad', [988]], ['gammad', [989]], ['gap', [10886]], ['Gbreve', [286]], ['gbreve', [287]], ['Gcedil', [290]], ['Gcirc', [284]], ['gcirc', [285]], ['Gcy', [1043]], ['gcy', [1075]], ['Gdot', [288]], ['gdot', [289]], ['ge', [8805]], ['gE', [8807]], ['gEl', [10892]], ['gel', [8923]], ['geq', [8805]], ['geqq', [8807]], ['geqslant', [10878]], ['gescc', [10921]], ['ges', [10878]], ['gesdot', [10880]], ['gesdoto', [10882]], ['gesdotol', [10884]], ['gesl', [8923, 65024]], ['gesles', [10900]], ['Gfr', [120074]], ['gfr', [120100]], ['gg', [8811]], ['Gg', [8921]], ['ggg', [8921]], ['gimel', [8503]], ['GJcy', [1027]], ['gjcy', [1107]], ['gla', [10917]], ['gl', [8823]], ['glE', [10898]], ['glj', [10916]], ['gnap', [10890]], ['gnapprox', [10890]], ['gne', [10888]], ['gnE', [8809]], ['gneq', [10888]], ['gneqq', [8809]], ['gnsim', [8935]], ['Gopf', [120126]], ['gopf', [120152]], ['grave', [96]], ['GreaterEqual', [8805]], ['GreaterEqualLess', [8923]], ['GreaterFullEqual', [8807]], ['GreaterGreater', [10914]], ['GreaterLess', [8823]], ['GreaterSlantEqual', [10878]], ['GreaterTilde', [8819]], ['Gscr', [119970]], ['gscr', [8458]], ['gsim', [8819]], ['gsime', [10894]], ['gsiml', [10896]], ['gtcc', [10919]], ['gtcir', [10874]], ['gt', [62]], ['GT', [62]], ['Gt', [8811]], ['gtdot', [8919]], ['gtlPar', [10645]], ['gtquest', [10876]], ['gtrapprox', [10886]], ['gtrarr', [10616]], ['gtrdot', [8919]], ['gtreqless', [8923]], ['gtreqqless', [10892]], ['gtrless', [8823]], ['gtrsim', [8819]], ['gvertneqq', [8809, 65024]], ['gvnE', [8809, 65024]], ['Hacek', [711]], ['hairsp', [8202]], ['half', [189]], ['hamilt', [8459]], ['HARDcy', [1066]], ['hardcy', [1098]], ['harrcir', [10568]], ['harr', [8596]], ['hArr', [8660]], ['harrw', [8621]], ['Hat', [94]], ['hbar', [8463]], ['Hcirc', [292]], ['hcirc', [293]], ['hearts', [9829]], ['heartsuit', [9829]], ['hellip', [8230]], ['hercon', [8889]], ['hfr', [120101]], ['Hfr', [8460]], ['HilbertSpace', [8459]], ['hksearow', [10533]], ['hkswarow', [10534]], ['hoarr', [8703]], ['homtht', [8763]], ['hookleftarrow', [8617]], ['hookrightarrow', [8618]], ['hopf', [120153]], ['Hopf', [8461]], ['horbar', [8213]], ['HorizontalLine', [9472]], ['hscr', [119997]], ['Hscr', [8459]], ['hslash', [8463]], ['Hstrok', [294]], ['hstrok', [295]], ['HumpDownHump', [8782]], ['HumpEqual', [8783]], ['hybull', [8259]], ['hyphen', [8208]], ['Iacute', [205]], ['iacute', [237]], ['ic', [8291]], ['Icirc', [206]], ['icirc', [238]], ['Icy', [1048]], ['icy', [1080]], ['Idot', [304]], ['IEcy', [1045]], ['iecy', [1077]], ['iexcl', [161]], ['iff', [8660]], ['ifr', [120102]], ['Ifr', [8465]], ['Igrave', [204]], ['igrave', [236]], ['ii', [8520]], ['iiiint', [10764]], ['iiint', [8749]], ['iinfin', [10716]], ['iiota', [8489]], ['IJlig', [306]], ['ijlig', [307]], ['Imacr', [298]], ['imacr', [299]], ['image', [8465]], ['ImaginaryI', [8520]], ['imagline', [8464]], ['imagpart', [8465]], ['imath', [305]], ['Im', [8465]], ['imof', [8887]], ['imped', [437]], ['Implies', [8658]], ['incare', [8453]], ['in', [8712]], ['infin', [8734]], ['infintie', [10717]], ['inodot', [305]], ['intcal', [8890]], ['int', [8747]], ['Int', [8748]], ['integers', [8484]], ['Integral', [8747]], ['intercal', [8890]], ['Intersection', [8898]], ['intlarhk', [10775]], ['intprod', [10812]], ['InvisibleComma', [8291]], ['InvisibleTimes', [8290]], ['IOcy', [1025]], ['iocy', [1105]], ['Iogon', [302]], ['iogon', [303]], ['Iopf', [120128]], ['iopf', [120154]], ['Iota', [921]], ['iota', [953]], ['iprod', [10812]], ['iquest', [191]], ['iscr', [119998]], ['Iscr', [8464]], ['isin', [8712]], ['isindot', [8949]], ['isinE', [8953]], ['isins', [8948]], ['isinsv', [8947]], ['isinv', [8712]], ['it', [8290]], ['Itilde', [296]], ['itilde', [297]], ['Iukcy', [1030]], ['iukcy', [1110]], ['Iuml', [207]], ['iuml', [239]], ['Jcirc', [308]], ['jcirc', [309]], ['Jcy', [1049]], ['jcy', [1081]], ['Jfr', [120077]], ['jfr', [120103]], ['jmath', [567]], ['Jopf', [120129]], ['jopf', [120155]], ['Jscr', [119973]], ['jscr', [119999]], ['Jsercy', [1032]], ['jsercy', [1112]], ['Jukcy', [1028]], ['jukcy', [1108]], ['Kappa', [922]], ['kappa', [954]], ['kappav', [1008]], ['Kcedil', [310]], ['kcedil', [311]], ['Kcy', [1050]], ['kcy', [1082]], ['Kfr', [120078]], ['kfr', [120104]], ['kgreen', [312]], ['KHcy', [1061]], ['khcy', [1093]], ['KJcy', [1036]], ['kjcy', [1116]], ['Kopf', [120130]], ['kopf', [120156]], ['Kscr', [119974]], ['kscr', [120000]], ['lAarr', [8666]], ['Lacute', [313]], ['lacute', [314]], ['laemptyv', [10676]], ['lagran', [8466]], ['Lambda', [923]], ['lambda', [955]], ['lang', [10216]], ['Lang', [10218]], ['langd', [10641]], ['langle', [10216]], ['lap', [10885]], ['Laplacetrf', [8466]], ['laquo', [171]], ['larrb', [8676]], ['larrbfs', [10527]], ['larr', [8592]], ['Larr', [8606]], ['lArr', [8656]], ['larrfs', [10525]], ['larrhk', [8617]], ['larrlp', [8619]], ['larrpl', [10553]], ['larrsim', [10611]], ['larrtl', [8610]], ['latail', [10521]], ['lAtail', [10523]], ['lat', [10923]], ['late', [10925]], ['lates', [10925, 65024]], ['lbarr', [10508]], ['lBarr', [10510]], ['lbbrk', [10098]], ['lbrace', [123]], ['lbrack', [91]], ['lbrke', [10635]], ['lbrksld', [10639]], ['lbrkslu', [10637]], ['Lcaron', [317]], ['lcaron', [318]], ['Lcedil', [315]], ['lcedil', [316]], ['lceil', [8968]], ['lcub', [123]], ['Lcy', [1051]], ['lcy', [1083]], ['ldca', [10550]], ['ldquo', [8220]], ['ldquor', [8222]], ['ldrdhar', [10599]], ['ldrushar', [10571]], ['ldsh', [8626]], ['le', [8804]], ['lE', [8806]], ['LeftAngleBracket', [10216]], ['LeftArrowBar', [8676]], ['leftarrow', [8592]], ['LeftArrow', [8592]], ['Leftarrow', [8656]], ['LeftArrowRightArrow', [8646]], ['leftarrowtail', [8610]], ['LeftCeiling', [8968]], ['LeftDoubleBracket', [10214]], ['LeftDownTeeVector', [10593]], ['LeftDownVectorBar', [10585]], ['LeftDownVector', [8643]], ['LeftFloor', [8970]], ['leftharpoondown', [8637]], ['leftharpoonup', [8636]], ['leftleftarrows', [8647]], ['leftrightarrow', [8596]], ['LeftRightArrow', [8596]], ['Leftrightarrow', [8660]], ['leftrightarrows', [8646]], ['leftrightharpoons', [8651]], ['leftrightsquigarrow', [8621]], ['LeftRightVector', [10574]], ['LeftTeeArrow', [8612]], ['LeftTee', [8867]], ['LeftTeeVector', [10586]], ['leftthreetimes', [8907]], ['LeftTriangleBar', [10703]], ['LeftTriangle', [8882]], ['LeftTriangleEqual', [8884]], ['LeftUpDownVector', [10577]], ['LeftUpTeeVector', [10592]], ['LeftUpVectorBar', [10584]], ['LeftUpVector', [8639]], ['LeftVectorBar', [10578]], ['LeftVector', [8636]], ['lEg', [10891]], ['leg', [8922]], ['leq', [8804]], ['leqq', [8806]], ['leqslant', [10877]], ['lescc', [10920]], ['les', [10877]], ['lesdot', [10879]], ['lesdoto', [10881]], ['lesdotor', [10883]], ['lesg', [8922, 65024]], ['lesges', [10899]], ['lessapprox', [10885]], ['lessdot', [8918]], ['lesseqgtr', [8922]], ['lesseqqgtr', [10891]], ['LessEqualGreater', [8922]], ['LessFullEqual', [8806]], ['LessGreater', [8822]], ['lessgtr', [8822]], ['LessLess', [10913]], ['lesssim', [8818]], ['LessSlantEqual', [10877]], ['LessTilde', [8818]], ['lfisht', [10620]], ['lfloor', [8970]], ['Lfr', [120079]], ['lfr', [120105]], ['lg', [8822]], ['lgE', [10897]], ['lHar', [10594]], ['lhard', [8637]], ['lharu', [8636]], ['lharul', [10602]], ['lhblk', [9604]], ['LJcy', [1033]], ['ljcy', [1113]], ['llarr', [8647]], ['ll', [8810]], ['Ll', [8920]], ['llcorner', [8990]], ['Lleftarrow', [8666]], ['llhard', [10603]], ['lltri', [9722]], ['Lmidot', [319]], ['lmidot', [320]], ['lmoustache', [9136]], ['lmoust', [9136]], ['lnap', [10889]], ['lnapprox', [10889]], ['lne', [10887]], ['lnE', [8808]], ['lneq', [10887]], ['lneqq', [8808]], ['lnsim', [8934]], ['loang', [10220]], ['loarr', [8701]], ['lobrk', [10214]], ['longleftarrow', [10229]], ['LongLeftArrow', [10229]], ['Longleftarrow', [10232]], ['longleftrightarrow', [10231]], ['LongLeftRightArrow', [10231]], ['Longleftrightarrow', [10234]], ['longmapsto', [10236]], ['longrightarrow', [10230]], ['LongRightArrow', [10230]], ['Longrightarrow', [10233]], ['looparrowleft', [8619]], ['looparrowright', [8620]], ['lopar', [10629]], ['Lopf', [120131]], ['lopf', [120157]], ['loplus', [10797]], ['lotimes', [10804]], ['lowast', [8727]], ['lowbar', [95]], ['LowerLeftArrow', [8601]], ['LowerRightArrow', [8600]], ['loz', [9674]], ['lozenge', [9674]], ['lozf', [10731]], ['lpar', [40]], ['lparlt', [10643]], ['lrarr', [8646]], ['lrcorner', [8991]], ['lrhar', [8651]], ['lrhard', [10605]], ['lrm', [8206]], ['lrtri', [8895]], ['lsaquo', [8249]], ['lscr', [120001]], ['Lscr', [8466]], ['lsh', [8624]], ['Lsh', [8624]], ['lsim', [8818]], ['lsime', [10893]], ['lsimg', [10895]], ['lsqb', [91]], ['lsquo', [8216]], ['lsquor', [8218]], ['Lstrok', [321]], ['lstrok', [322]], ['ltcc', [10918]], ['ltcir', [10873]], ['lt', [60]], ['LT', [60]], ['Lt', [8810]], ['ltdot', [8918]], ['lthree', [8907]], ['ltimes', [8905]], ['ltlarr', [10614]], ['ltquest', [10875]], ['ltri', [9667]], ['ltrie', [8884]], ['ltrif', [9666]], ['ltrPar', [10646]], ['lurdshar', [10570]], ['luruhar', [10598]], ['lvertneqq', [8808, 65024]], ['lvnE', [8808, 65024]], ['macr', [175]], ['male', [9794]], ['malt', [10016]], ['maltese', [10016]], ['Map', [10501]], ['map', [8614]], ['mapsto', [8614]], ['mapstodown', [8615]], ['mapstoleft', [8612]], ['mapstoup', [8613]], ['marker', [9646]], ['mcomma', [10793]], ['Mcy', [1052]], ['mcy', [1084]], ['mdash', [8212]], ['mDDot', [8762]], ['measuredangle', [8737]], ['MediumSpace', [8287]], ['Mellintrf', [8499]], ['Mfr', [120080]], ['mfr', [120106]], ['mho', [8487]], ['micro', [181]], ['midast', [42]], ['midcir', [10992]], ['mid', [8739]], ['middot', [183]], ['minusb', [8863]], ['minus', [8722]], ['minusd', [8760]], ['minusdu', [10794]], ['MinusPlus', [8723]], ['mlcp', [10971]], ['mldr', [8230]], ['mnplus', [8723]], ['models', [8871]], ['Mopf', [120132]], ['mopf', [120158]], ['mp', [8723]], ['mscr', [120002]], ['Mscr', [8499]], ['mstpos', [8766]], ['Mu', [924]], ['mu', [956]], ['multimap', [8888]], ['mumap', [8888]], ['nabla', [8711]], ['Nacute', [323]], ['nacute', [324]], ['nang', [8736, 8402]], ['nap', [8777]], ['napE', [10864, 824]], ['napid', [8779, 824]], ['napos', [329]], ['napprox', [8777]], ['natural', [9838]], ['naturals', [8469]], ['natur', [9838]], ['nbsp', [160]], ['nbump', [8782, 824]], ['nbumpe', [8783, 824]], ['ncap', [10819]], ['Ncaron', [327]], ['ncaron', [328]], ['Ncedil', [325]], ['ncedil', [326]], ['ncong', [8775]], ['ncongdot', [10861, 824]], ['ncup', [10818]], ['Ncy', [1053]], ['ncy', [1085]], ['ndash', [8211]], ['nearhk', [10532]], ['nearr', [8599]], ['neArr', [8663]], ['nearrow', [8599]], ['ne', [8800]], ['nedot', [8784, 824]], ['NegativeMediumSpace', [8203]], ['NegativeThickSpace', [8203]], ['NegativeThinSpace', [8203]], ['NegativeVeryThinSpace', [8203]], ['nequiv', [8802]], ['nesear', [10536]], ['nesim', [8770, 824]], ['NestedGreaterGreater', [8811]], ['NestedLessLess', [8810]], ['nexist', [8708]], ['nexists', [8708]], ['Nfr', [120081]], ['nfr', [120107]], ['ngE', [8807, 824]], ['nge', [8817]], ['ngeq', [8817]], ['ngeqq', [8807, 824]], ['ngeqslant', [10878, 824]], ['nges', [10878, 824]], ['nGg', [8921, 824]], ['ngsim', [8821]], ['nGt', [8811, 8402]], ['ngt', [8815]], ['ngtr', [8815]], ['nGtv', [8811, 824]], ['nharr', [8622]], ['nhArr', [8654]], ['nhpar', [10994]], ['ni', [8715]], ['nis', [8956]], ['nisd', [8954]], ['niv', [8715]], ['NJcy', [1034]], ['njcy', [1114]], ['nlarr', [8602]], ['nlArr', [8653]], ['nldr', [8229]], ['nlE', [8806, 824]], ['nle', [8816]], ['nleftarrow', [8602]], ['nLeftarrow', [8653]], ['nleftrightarrow', [8622]], ['nLeftrightarrow', [8654]], ['nleq', [8816]], ['nleqq', [8806, 824]], ['nleqslant', [10877, 824]], ['nles', [10877, 824]], ['nless', [8814]], ['nLl', [8920, 824]], ['nlsim', [8820]], ['nLt', [8810, 8402]], ['nlt', [8814]], ['nltri', [8938]], ['nltrie', [8940]], ['nLtv', [8810, 824]], ['nmid', [8740]], ['NoBreak', [8288]], ['NonBreakingSpace', [160]], ['nopf', [120159]], ['Nopf', [8469]], ['Not', [10988]], ['not', [172]], ['NotCongruent', [8802]], ['NotCupCap', [8813]], ['NotDoubleVerticalBar', [8742]], ['NotElement', [8713]], ['NotEqual', [8800]], ['NotEqualTilde', [8770, 824]], ['NotExists', [8708]], ['NotGreater', [8815]], ['NotGreaterEqual', [8817]], ['NotGreaterFullEqual', [8807, 824]], ['NotGreaterGreater', [8811, 824]], ['NotGreaterLess', [8825]], ['NotGreaterSlantEqual', [10878, 824]], ['NotGreaterTilde', [8821]], ['NotHumpDownHump', [8782, 824]], ['NotHumpEqual', [8783, 824]], ['notin', [8713]], ['notindot', [8949, 824]], ['notinE', [8953, 824]], ['notinva', [8713]], ['notinvb', [8951]], ['notinvc', [8950]], ['NotLeftTriangleBar', [10703, 824]], ['NotLeftTriangle', [8938]], ['NotLeftTriangleEqual', [8940]], ['NotLess', [8814]], ['NotLessEqual', [8816]], ['NotLessGreater', [8824]], ['NotLessLess', [8810, 824]], ['NotLessSlantEqual', [10877, 824]], ['NotLessTilde', [8820]], ['NotNestedGreaterGreater', [10914, 824]], ['NotNestedLessLess', [10913, 824]], ['notni', [8716]], ['notniva', [8716]], ['notnivb', [8958]], ['notnivc', [8957]], ['NotPrecedes', [8832]], ['NotPrecedesEqual', [10927, 824]], ['NotPrecedesSlantEqual', [8928]], ['NotReverseElement', [8716]], ['NotRightTriangleBar', [10704, 824]], ['NotRightTriangle', [8939]], ['NotRightTriangleEqual', [8941]], ['NotSquareSubset', [8847, 824]], ['NotSquareSubsetEqual', [8930]], ['NotSquareSuperset', [8848, 824]], ['NotSquareSupersetEqual', [8931]], ['NotSubset', [8834, 8402]], ['NotSubsetEqual', [8840]], ['NotSucceeds', [8833]], ['NotSucceedsEqual', [10928, 824]], ['NotSucceedsSlantEqual', [8929]], ['NotSucceedsTilde', [8831, 824]], ['NotSuperset', [8835, 8402]], ['NotSupersetEqual', [8841]], ['NotTilde', [8769]], ['NotTildeEqual', [8772]], ['NotTildeFullEqual', [8775]], ['NotTildeTilde', [8777]], ['NotVerticalBar', [8740]], ['nparallel', [8742]], ['npar', [8742]], ['nparsl', [11005, 8421]], ['npart', [8706, 824]], ['npolint', [10772]], ['npr', [8832]], ['nprcue', [8928]], ['nprec', [8832]], ['npreceq', [10927, 824]], ['npre', [10927, 824]], ['nrarrc', [10547, 824]], ['nrarr', [8603]], ['nrArr', [8655]], ['nrarrw', [8605, 824]], ['nrightarrow', [8603]], ['nRightarrow', [8655]], ['nrtri', [8939]], ['nrtrie', [8941]], ['nsc', [8833]], ['nsccue', [8929]], ['nsce', [10928, 824]], ['Nscr', [119977]], ['nscr', [120003]], ['nshortmid', [8740]], ['nshortparallel', [8742]], ['nsim', [8769]], ['nsime', [8772]], ['nsimeq', [8772]], ['nsmid', [8740]], ['nspar', [8742]], ['nsqsube', [8930]], ['nsqsupe', [8931]], ['nsub', [8836]], ['nsubE', [10949, 824]], ['nsube', [8840]], ['nsubset', [8834, 8402]], ['nsubseteq', [8840]], ['nsubseteqq', [10949, 824]], ['nsucc', [8833]], ['nsucceq', [10928, 824]], ['nsup', [8837]], ['nsupE', [10950, 824]], ['nsupe', [8841]], ['nsupset', [8835, 8402]], ['nsupseteq', [8841]], ['nsupseteqq', [10950, 824]], ['ntgl', [8825]], ['Ntilde', [209]], ['ntilde', [241]], ['ntlg', [8824]], ['ntriangleleft', [8938]], ['ntrianglelefteq', [8940]], ['ntriangleright', [8939]], ['ntrianglerighteq', [8941]], ['Nu', [925]], ['nu', [957]], ['num', [35]], ['numero', [8470]], ['numsp', [8199]], ['nvap', [8781, 8402]], ['nvdash', [8876]], ['nvDash', [8877]], ['nVdash', [8878]], ['nVDash', [8879]], ['nvge', [8805, 8402]], ['nvgt', [62, 8402]], ['nvHarr', [10500]], ['nvinfin', [10718]], ['nvlArr', [10498]], ['nvle', [8804, 8402]], ['nvlt', [60, 8402]], ['nvltrie', [8884, 8402]], ['nvrArr', [10499]], ['nvrtrie', [8885, 8402]], ['nvsim', [8764, 8402]], ['nwarhk', [10531]], ['nwarr', [8598]], ['nwArr', [8662]], ['nwarrow', [8598]], ['nwnear', [10535]], ['Oacute', [211]], ['oacute', [243]], ['oast', [8859]], ['Ocirc', [212]], ['ocirc', [244]], ['ocir', [8858]], ['Ocy', [1054]], ['ocy', [1086]], ['odash', [8861]], ['Odblac', [336]], ['odblac', [337]], ['odiv', [10808]], ['odot', [8857]], ['odsold', [10684]], ['OElig', [338]], ['oelig', [339]], ['ofcir', [10687]], ['Ofr', [120082]], ['ofr', [120108]], ['ogon', [731]], ['Ograve', [210]], ['ograve', [242]], ['ogt', [10689]], ['ohbar', [10677]], ['ohm', [937]], ['oint', [8750]], ['olarr', [8634]], ['olcir', [10686]], ['olcross', [10683]], ['oline', [8254]], ['olt', [10688]], ['Omacr', [332]], ['omacr', [333]], ['Omega', [937]], ['omega', [969]], ['Omicron', [927]], ['omicron', [959]], ['omid', [10678]], ['ominus', [8854]], ['Oopf', [120134]], ['oopf', [120160]], ['opar', [10679]], ['OpenCurlyDoubleQuote', [8220]], ['OpenCurlyQuote', [8216]], ['operp', [10681]], ['oplus', [8853]], ['orarr', [8635]], ['Or', [10836]], ['or', [8744]], ['ord', [10845]], ['order', [8500]], ['orderof', [8500]], ['ordf', [170]], ['ordm', [186]], ['origof', [8886]], ['oror', [10838]], ['orslope', [10839]], ['orv', [10843]], ['oS', [9416]], ['Oscr', [119978]], ['oscr', [8500]], ['Oslash', [216]], ['oslash', [248]], ['osol', [8856]], ['Otilde', [213]], ['otilde', [245]], ['otimesas', [10806]], ['Otimes', [10807]], ['otimes', [8855]], ['Ouml', [214]], ['ouml', [246]], ['ovbar', [9021]], ['OverBar', [8254]], ['OverBrace', [9182]], ['OverBracket', [9140]], ['OverParenthesis', [9180]], ['para', [182]], ['parallel', [8741]], ['par', [8741]], ['parsim', [10995]], ['parsl', [11005]], ['part', [8706]], ['PartialD', [8706]], ['Pcy', [1055]], ['pcy', [1087]], ['percnt', [37]], ['period', [46]], ['permil', [8240]], ['perp', [8869]], ['pertenk', [8241]], ['Pfr', [120083]], ['pfr', [120109]], ['Phi', [934]], ['phi', [966]], ['phiv', [981]], ['phmmat', [8499]], ['phone', [9742]], ['Pi', [928]], ['pi', [960]], ['pitchfork', [8916]], ['piv', [982]], ['planck', [8463]], ['planckh', [8462]], ['plankv', [8463]], ['plusacir', [10787]], ['plusb', [8862]], ['pluscir', [10786]], ['plus', [43]], ['plusdo', [8724]], ['plusdu', [10789]], ['pluse', [10866]], ['PlusMinus', [177]], ['plusmn', [177]], ['plussim', [10790]], ['plustwo', [10791]], ['pm', [177]], ['Poincareplane', [8460]], ['pointint', [10773]], ['popf', [120161]], ['Popf', [8473]], ['pound', [163]], ['prap', [10935]], ['Pr', [10939]], ['pr', [8826]], ['prcue', [8828]], ['precapprox', [10935]], ['prec', [8826]], ['preccurlyeq', [8828]], ['Precedes', [8826]], ['PrecedesEqual', [10927]], ['PrecedesSlantEqual', [8828]], ['PrecedesTilde', [8830]], ['preceq', [10927]], ['precnapprox', [10937]], ['precneqq', [10933]], ['precnsim', [8936]], ['pre', [10927]], ['prE', [10931]], ['precsim', [8830]], ['prime', [8242]], ['Prime', [8243]], ['primes', [8473]], ['prnap', [10937]], ['prnE', [10933]], ['prnsim', [8936]], ['prod', [8719]], ['Product', [8719]], ['profalar', [9006]], ['profline', [8978]], ['profsurf', [8979]], ['prop', [8733]], ['Proportional', [8733]], ['Proportion', [8759]], ['propto', [8733]], ['prsim', [8830]], ['prurel', [8880]], ['Pscr', [119979]], ['pscr', [120005]], ['Psi', [936]], ['psi', [968]], ['puncsp', [8200]], ['Qfr', [120084]], ['qfr', [120110]], ['qint', [10764]], ['qopf', [120162]], ['Qopf', [8474]], ['qprime', [8279]], ['Qscr', [119980]], ['qscr', [120006]], ['quaternions', [8461]], ['quatint', [10774]], ['quest', [63]], ['questeq', [8799]], ['quot', [34]], ['QUOT', [34]], ['rAarr', [8667]], ['race', [8765, 817]], ['Racute', [340]], ['racute', [341]], ['radic', [8730]], ['raemptyv', [10675]], ['rang', [10217]], ['Rang', [10219]], ['rangd', [10642]], ['range', [10661]], ['rangle', [10217]], ['raquo', [187]], ['rarrap', [10613]], ['rarrb', [8677]], ['rarrbfs', [10528]], ['rarrc', [10547]], ['rarr', [8594]], ['Rarr', [8608]], ['rArr', [8658]], ['rarrfs', [10526]], ['rarrhk', [8618]], ['rarrlp', [8620]], ['rarrpl', [10565]], ['rarrsim', [10612]], ['Rarrtl', [10518]], ['rarrtl', [8611]], ['rarrw', [8605]], ['ratail', [10522]], ['rAtail', [10524]], ['ratio', [8758]], ['rationals', [8474]], ['rbarr', [10509]], ['rBarr', [10511]], ['RBarr', [10512]], ['rbbrk', [10099]], ['rbrace', [125]], ['rbrack', [93]], ['rbrke', [10636]], ['rbrksld', [10638]], ['rbrkslu', [10640]], ['Rcaron', [344]], ['rcaron', [345]], ['Rcedil', [342]], ['rcedil', [343]], ['rceil', [8969]], ['rcub', [125]], ['Rcy', [1056]], ['rcy', [1088]], ['rdca', [10551]], ['rdldhar', [10601]], ['rdquo', [8221]], ['rdquor', [8221]], ['CloseCurlyDoubleQuote', [8221]], ['rdsh', [8627]], ['real', [8476]], ['realine', [8475]], ['realpart', [8476]], ['reals', [8477]], ['Re', [8476]], ['rect', [9645]], ['reg', [174]], ['REG', [174]], ['ReverseElement', [8715]], ['ReverseEquilibrium', [8651]], ['ReverseUpEquilibrium', [10607]], ['rfisht', [10621]], ['rfloor', [8971]], ['rfr', [120111]], ['Rfr', [8476]], ['rHar', [10596]], ['rhard', [8641]], ['rharu', [8640]], ['rharul', [10604]], ['Rho', [929]], ['rho', [961]], ['rhov', [1009]], ['RightAngleBracket', [10217]], ['RightArrowBar', [8677]], ['rightarrow', [8594]], ['RightArrow', [8594]], ['Rightarrow', [8658]], ['RightArrowLeftArrow', [8644]], ['rightarrowtail', [8611]], ['RightCeiling', [8969]], ['RightDoubleBracket', [10215]], ['RightDownTeeVector', [10589]], ['RightDownVectorBar', [10581]], ['RightDownVector', [8642]], ['RightFloor', [8971]], ['rightharpoondown', [8641]], ['rightharpoonup', [8640]], ['rightleftarrows', [8644]], ['rightleftharpoons', [8652]], ['rightrightarrows', [8649]], ['rightsquigarrow', [8605]], ['RightTeeArrow', [8614]], ['RightTee', [8866]], ['RightTeeVector', [10587]], ['rightthreetimes', [8908]], ['RightTriangleBar', [10704]], ['RightTriangle', [8883]], ['RightTriangleEqual', [8885]], ['RightUpDownVector', [10575]], ['RightUpTeeVector', [10588]], ['RightUpVectorBar', [10580]], ['RightUpVector', [8638]], ['RightVectorBar', [10579]], ['RightVector', [8640]], ['ring', [730]], ['risingdotseq', [8787]], ['rlarr', [8644]], ['rlhar', [8652]], ['rlm', [8207]], ['rmoustache', [9137]], ['rmoust', [9137]], ['rnmid', [10990]], ['roang', [10221]], ['roarr', [8702]], ['robrk', [10215]], ['ropar', [10630]], ['ropf', [120163]], ['Ropf', [8477]], ['roplus', [10798]], ['rotimes', [10805]], ['RoundImplies', [10608]], ['rpar', [41]], ['rpargt', [10644]], ['rppolint', [10770]], ['rrarr', [8649]], ['Rrightarrow', [8667]], ['rsaquo', [8250]], ['rscr', [120007]], ['Rscr', [8475]], ['rsh', [8625]], ['Rsh', [8625]], ['rsqb', [93]], ['rsquo', [8217]], ['rsquor', [8217]], ['CloseCurlyQuote', [8217]], ['rthree', [8908]], ['rtimes', [8906]], ['rtri', [9657]], ['rtrie', [8885]], ['rtrif', [9656]], ['rtriltri', [10702]], ['RuleDelayed', [10740]], ['ruluhar', [10600]], ['rx', [8478]], ['Sacute', [346]], ['sacute', [347]], ['sbquo', [8218]], ['scap', [10936]], ['Scaron', [352]], ['scaron', [353]], ['Sc', [10940]], ['sc', [8827]], ['sccue', [8829]], ['sce', [10928]], ['scE', [10932]], ['Scedil', [350]], ['scedil', [351]], ['Scirc', [348]], ['scirc', [349]], ['scnap', [10938]], ['scnE', [10934]], ['scnsim', [8937]], ['scpolint', [10771]], ['scsim', [8831]], ['Scy', [1057]], ['scy', [1089]], ['sdotb', [8865]], ['sdot', [8901]], ['sdote', [10854]], ['searhk', [10533]], ['searr', [8600]], ['seArr', [8664]], ['searrow', [8600]], ['sect', [167]], ['semi', [59]], ['seswar', [10537]], ['setminus', [8726]], ['setmn', [8726]], ['sext', [10038]], ['Sfr', [120086]], ['sfr', [120112]], ['sfrown', [8994]], ['sharp', [9839]], ['SHCHcy', [1065]], ['shchcy', [1097]], ['SHcy', [1064]], ['shcy', [1096]], ['ShortDownArrow', [8595]], ['ShortLeftArrow', [8592]], ['shortmid', [8739]], ['shortparallel', [8741]], ['ShortRightArrow', [8594]], ['ShortUpArrow', [8593]], ['shy', [173]], ['Sigma', [931]], ['sigma', [963]], ['sigmaf', [962]], ['sigmav', [962]], ['sim', [8764]], ['simdot', [10858]], ['sime', [8771]], ['simeq', [8771]], ['simg', [10910]], ['simgE', [10912]], ['siml', [10909]], ['simlE', [10911]], ['simne', [8774]], ['simplus', [10788]], ['simrarr', [10610]], ['slarr', [8592]], ['SmallCircle', [8728]], ['smallsetminus', [8726]], ['smashp', [10803]], ['smeparsl', [10724]], ['smid', [8739]], ['smile', [8995]], ['smt', [10922]], ['smte', [10924]], ['smtes', [10924, 65024]], ['SOFTcy', [1068]], ['softcy', [1100]], ['solbar', [9023]], ['solb', [10692]], ['sol', [47]], ['Sopf', [120138]], ['sopf', [120164]], ['spades', [9824]], ['spadesuit', [9824]], ['spar', [8741]], ['sqcap', [8851]], ['sqcaps', [8851, 65024]], ['sqcup', [8852]], ['sqcups', [8852, 65024]], ['Sqrt', [8730]], ['sqsub', [8847]], ['sqsube', [8849]], ['sqsubset', [8847]], ['sqsubseteq', [8849]], ['sqsup', [8848]], ['sqsupe', [8850]], ['sqsupset', [8848]], ['sqsupseteq', [8850]], ['square', [9633]], ['Square', [9633]], ['SquareIntersection', [8851]], ['SquareSubset', [8847]], ['SquareSubsetEqual', [8849]], ['SquareSuperset', [8848]], ['SquareSupersetEqual', [8850]], ['SquareUnion', [8852]], ['squarf', [9642]], ['squ', [9633]], ['squf', [9642]], ['srarr', [8594]], ['Sscr', [119982]], ['sscr', [120008]], ['ssetmn', [8726]], ['ssmile', [8995]], ['sstarf', [8902]], ['Star', [8902]], ['star', [9734]], ['starf', [9733]], ['straightepsilon', [1013]], ['straightphi', [981]], ['strns', [175]], ['sub', [8834]], ['Sub', [8912]], ['subdot', [10941]], ['subE', [10949]], ['sube', [8838]], ['subedot', [10947]], ['submult', [10945]], ['subnE', [10955]], ['subne', [8842]], ['subplus', [10943]], ['subrarr', [10617]], ['subset', [8834]], ['Subset', [8912]], ['subseteq', [8838]], ['subseteqq', [10949]], ['SubsetEqual', [8838]], ['subsetneq', [8842]], ['subsetneqq', [10955]], ['subsim', [10951]], ['subsub', [10965]], ['subsup', [10963]], ['succapprox', [10936]], ['succ', [8827]], ['succcurlyeq', [8829]], ['Succeeds', [8827]], ['SucceedsEqual', [10928]], ['SucceedsSlantEqual', [8829]], ['SucceedsTilde', [8831]], ['succeq', [10928]], ['succnapprox', [10938]], ['succneqq', [10934]], ['succnsim', [8937]], ['succsim', [8831]], ['SuchThat', [8715]], ['sum', [8721]], ['Sum', [8721]], ['sung', [9834]], ['sup1', [185]], ['sup2', [178]], ['sup3', [179]], ['sup', [8835]], ['Sup', [8913]], ['supdot', [10942]], ['supdsub', [10968]], ['supE', [10950]], ['supe', [8839]], ['supedot', [10948]], ['Superset', [8835]], ['SupersetEqual', [8839]], ['suphsol', [10185]], ['suphsub', [10967]], ['suplarr', [10619]], ['supmult', [10946]], ['supnE', [10956]], ['supne', [8843]], ['supplus', [10944]], ['supset', [8835]], ['Supset', [8913]], ['supseteq', [8839]], ['supseteqq', [10950]], ['supsetneq', [8843]], ['supsetneqq', [10956]], ['supsim', [10952]], ['supsub', [10964]], ['supsup', [10966]], ['swarhk', [10534]], ['swarr', [8601]], ['swArr', [8665]], ['swarrow', [8601]], ['swnwar', [10538]], ['szlig', [223]], ['Tab', [9]], ['target', [8982]], ['Tau', [932]], ['tau', [964]], ['tbrk', [9140]], ['Tcaron', [356]], ['tcaron', [357]], ['Tcedil', [354]], ['tcedil', [355]], ['Tcy', [1058]], ['tcy', [1090]], ['tdot', [8411]], ['telrec', [8981]], ['Tfr', [120087]], ['tfr', [120113]], ['there4', [8756]], ['therefore', [8756]], ['Therefore', [8756]], ['Theta', [920]], ['theta', [952]], ['thetasym', [977]], ['thetav', [977]], ['thickapprox', [8776]], ['thicksim', [8764]], ['ThickSpace', [8287, 8202]], ['ThinSpace', [8201]], ['thinsp', [8201]], ['thkap', [8776]], ['thksim', [8764]], ['THORN', [222]], ['thorn', [254]], ['tilde', [732]], ['Tilde', [8764]], ['TildeEqual', [8771]], ['TildeFullEqual', [8773]], ['TildeTilde', [8776]], ['timesbar', [10801]], ['timesb', [8864]], ['times', [215]], ['timesd', [10800]], ['tint', [8749]], ['toea', [10536]], ['topbot', [9014]], ['topcir', [10993]], ['top', [8868]], ['Topf', [120139]], ['topf', [120165]], ['topfork', [10970]], ['tosa', [10537]], ['tprime', [8244]], ['trade', [8482]], ['TRADE', [8482]], ['triangle', [9653]], ['triangledown', [9663]], ['triangleleft', [9667]], ['trianglelefteq', [8884]], ['triangleq', [8796]], ['triangleright', [9657]], ['trianglerighteq', [8885]], ['tridot', [9708]], ['trie', [8796]], ['triminus', [10810]], ['TripleDot', [8411]], ['triplus', [10809]], ['trisb', [10701]], ['tritime', [10811]], ['trpezium', [9186]], ['Tscr', [119983]], ['tscr', [120009]], ['TScy', [1062]], ['tscy', [1094]], ['TSHcy', [1035]], ['tshcy', [1115]], ['Tstrok', [358]], ['tstrok', [359]], ['twixt', [8812]], ['twoheadleftarrow', [8606]], ['twoheadrightarrow', [8608]], ['Uacute', [218]], ['uacute', [250]], ['uarr', [8593]], ['Uarr', [8607]], ['uArr', [8657]], ['Uarrocir', [10569]], ['Ubrcy', [1038]], ['ubrcy', [1118]], ['Ubreve', [364]], ['ubreve', [365]], ['Ucirc', [219]], ['ucirc', [251]], ['Ucy', [1059]], ['ucy', [1091]], ['udarr', [8645]], ['Udblac', [368]], ['udblac', [369]], ['udhar', [10606]], ['ufisht', [10622]], ['Ufr', [120088]], ['ufr', [120114]], ['Ugrave', [217]], ['ugrave', [249]], ['uHar', [10595]], ['uharl', [8639]], ['uharr', [8638]], ['uhblk', [9600]], ['ulcorn', [8988]], ['ulcorner', [8988]], ['ulcrop', [8975]], ['ultri', [9720]], ['Umacr', [362]], ['umacr', [363]], ['uml', [168]], ['UnderBar', [95]], ['UnderBrace', [9183]], ['UnderBracket', [9141]], ['UnderParenthesis', [9181]], ['Union', [8899]], ['UnionPlus', [8846]], ['Uogon', [370]], ['uogon', [371]], ['Uopf', [120140]], ['uopf', [120166]], ['UpArrowBar', [10514]], ['uparrow', [8593]], ['UpArrow', [8593]], ['Uparrow', [8657]], ['UpArrowDownArrow', [8645]], ['updownarrow', [8597]], ['UpDownArrow', [8597]], ['Updownarrow', [8661]], ['UpEquilibrium', [10606]], ['upharpoonleft', [8639]], ['upharpoonright', [8638]], ['uplus', [8846]], ['UpperLeftArrow', [8598]], ['UpperRightArrow', [8599]], ['upsi', [965]], ['Upsi', [978]], ['upsih', [978]], ['Upsilon', [933]], ['upsilon', [965]], ['UpTeeArrow', [8613]], ['UpTee', [8869]], ['upuparrows', [8648]], ['urcorn', [8989]], ['urcorner', [8989]], ['urcrop', [8974]], ['Uring', [366]], ['uring', [367]], ['urtri', [9721]], ['Uscr', [119984]], ['uscr', [120010]], ['utdot', [8944]], ['Utilde', [360]], ['utilde', [361]], ['utri', [9653]], ['utrif', [9652]], ['uuarr', [8648]], ['Uuml', [220]], ['uuml', [252]], ['uwangle', [10663]], ['vangrt', [10652]], ['varepsilon', [1013]], ['varkappa', [1008]], ['varnothing', [8709]], ['varphi', [981]], ['varpi', [982]], ['varpropto', [8733]], ['varr', [8597]], ['vArr', [8661]], ['varrho', [1009]], ['varsigma', [962]], ['varsubsetneq', [8842, 65024]], ['varsubsetneqq', [10955, 65024]], ['varsupsetneq', [8843, 65024]], ['varsupsetneqq', [10956, 65024]], ['vartheta', [977]], ['vartriangleleft', [8882]], ['vartriangleright', [8883]], ['vBar', [10984]], ['Vbar', [10987]], ['vBarv', [10985]], ['Vcy', [1042]], ['vcy', [1074]], ['vdash', [8866]], ['vDash', [8872]], ['Vdash', [8873]], ['VDash', [8875]], ['Vdashl', [10982]], ['veebar', [8891]], ['vee', [8744]], ['Vee', [8897]], ['veeeq', [8794]], ['vellip', [8942]], ['verbar', [124]], ['Verbar', [8214]], ['vert', [124]], ['Vert', [8214]], ['VerticalBar', [8739]], ['VerticalLine', [124]], ['VerticalSeparator', [10072]], ['VerticalTilde', [8768]], ['VeryThinSpace', [8202]], ['Vfr', [120089]], ['vfr', [120115]], ['vltri', [8882]], ['vnsub', [8834, 8402]], ['vnsup', [8835, 8402]], ['Vopf', [120141]], ['vopf', [120167]], ['vprop', [8733]], ['vrtri', [8883]], ['Vscr', [119985]], ['vscr', [120011]], ['vsubnE', [10955, 65024]], ['vsubne', [8842, 65024]], ['vsupnE', [10956, 65024]], ['vsupne', [8843, 65024]], ['Vvdash', [8874]], ['vzigzag', [10650]], ['Wcirc', [372]], ['wcirc', [373]], ['wedbar', [10847]], ['wedge', [8743]], ['Wedge', [8896]], ['wedgeq', [8793]], ['weierp', [8472]], ['Wfr', [120090]], ['wfr', [120116]], ['Wopf', [120142]], ['wopf', [120168]], ['wp', [8472]], ['wr', [8768]], ['wreath', [8768]], ['Wscr', [119986]], ['wscr', [120012]], ['xcap', [8898]], ['xcirc', [9711]], ['xcup', [8899]], ['xdtri', [9661]], ['Xfr', [120091]], ['xfr', [120117]], ['xharr', [10231]], ['xhArr', [10234]], ['Xi', [926]], ['xi', [958]], ['xlarr', [10229]], ['xlArr', [10232]], ['xmap', [10236]], ['xnis', [8955]], ['xodot', [10752]], ['Xopf', [120143]], ['xopf', [120169]], ['xoplus', [10753]], ['xotime', [10754]], ['xrarr', [10230]], ['xrArr', [10233]], ['Xscr', [119987]], ['xscr', [120013]], ['xsqcup', [10758]], ['xuplus', [10756]], ['xutri', [9651]], ['xvee', [8897]], ['xwedge', [8896]], ['Yacute', [221]], ['yacute', [253]], ['YAcy', [1071]], ['yacy', [1103]], ['Ycirc', [374]], ['ycirc', [375]], ['Ycy', [1067]], ['ycy', [1099]], ['yen', [165]], ['Yfr', [120092]], ['yfr', [120118]], ['YIcy', [1031]], ['yicy', [1111]], ['Yopf', [120144]], ['yopf', [120170]], ['Yscr', [119988]], ['yscr', [120014]], ['YUcy', [1070]], ['yucy', [1102]], ['yuml', [255]], ['Yuml', [376]], ['Zacute', [377]], ['zacute', [378]], ['Zcaron', [381]], ['zcaron', [382]], ['Zcy', [1047]], ['zcy', [1079]], ['Zdot', [379]], ['zdot', [380]], ['zeetrf', [8488]], ['ZeroWidthSpace', [8203]], ['Zeta', [918]], ['zeta', [950]], ['zfr', [120119]], ['Zfr', [8488]], ['ZHcy', [1046]], ['zhcy', [1078]], ['zigrarr', [8669]], ['zopf', [120171]], ['Zopf', [8484]], ['Zscr', [119989]], ['zscr', [120015]], ['zwj', [8205]], ['zwnj', [8204]]];

var alphaIndex = {};
var charIndex = {};

createIndexes(alphaIndex, charIndex);

/**
 * @constructor
 */
function Html5Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1) === 'x' ?
                parseInt(entity.substr(2).toLowerCase(), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.decode = function(str) {
    return new Html5Entities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var charInfo = charIndex[str.charCodeAt(i)];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        result += str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encode = function(str) {
    return new Html5Entities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var charInfo = charIndex[c];
        if (charInfo) {
            var alpha = charInfo[str.charCodeAt(i + 1)];
            if (alpha) {
                i++;
            } else {
                alpha = charInfo[''];
            }
            if (alpha) {
                result += "&" + alpha + ";";
                i++;
                continue;
            }
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonUTF = function(str) {
    return new Html5Entities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
Html5Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 Html5Entities.encodeNonASCII = function(str) {
    return new Html5Entities().encodeNonASCII(str);
 };

/**
 * @param {Object} alphaIndex Passed by reference.
 * @param {Object} charIndex Passed by reference.
 */
function createIndexes(alphaIndex, charIndex) {
    var i = ENTITIES.length;
    var _results = [];
    while (i--) {
        var e = ENTITIES[i];
        var alpha = e[0];
        var chars = e[1];
        var chr = chars[0];
        var addChar = (chr < 32 || chr > 126) || chr === 62 || chr === 60 || chr === 38 || chr === 34 || chr === 39;
        var charInfo;
        if (addChar) {
            charInfo = charIndex[chr] = charIndex[chr] || {};
        }
        if (chars[1]) {
            var chr2 = chars[1];
            alphaIndex[alpha] = String.fromCharCode(chr) + String.fromCharCode(chr2);
            _results.push(addChar && (charInfo[chr2] = alpha));
        } else {
            alphaIndex[alpha] = String.fromCharCode(chr);
            _results.push(addChar && (charInfo[''] = alpha));
        }
    }
}

module.exports = Html5Entities;


/***/ }),
/* 1 */
/*!*************************!*\
  !*** external "jQuery" ***!
  \*************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = jQuery;

/***/ }),
/* 2 */
/*!***********************************!*\
  !*** (webpack)/buildin/global.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var g;

// This works in non-strict mode
g = (function() {
	return this;
})();

try {
	// This works if eval is allowed (see CSP)
	g = g || Function("return this")() || (1,eval)("this");
} catch(e) {
	// This works if the window reference is available
	if(typeof window === "object")
		g = window;
}

// g can still be undefined, but nothing to do about it...
// We return undefined, instead of nothing here, so it's
// easier to handle this case. if(!global) { ...}

module.exports = g;


/***/ }),
/* 3 */
/*!*************************************!*\
  !*** ./build/helpers/hmr-client.js ***!
  \*************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var hotMiddlewareScript = __webpack_require__(/*! webpack-hot-middleware/client?noInfo=true&timeout=20000&reload=true */ 4);

hotMiddlewareScript.subscribe(function (event) {
  if (event.action === 'reload') {
    window.location.reload();
  }
});


/***/ }),
/* 4 */
/*!********************************************************************************!*\
  !*** (webpack)-hot-middleware/client.js?noInfo=true&timeout=20000&reload=true ***!
  \********************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(__resourceQuery, module) {/*eslint-env browser*/
/*global __resourceQuery __webpack_public_path__*/

var options = {
  path: "/__webpack_hmr",
  timeout: 20 * 1000,
  overlay: true,
  reload: false,
  log: true,
  warn: true,
  name: '',
  autoConnect: true,
  overlayStyles: {},
  overlayWarnings: false,
  ansiColors: {}
};
if (true) {
  var querystring = __webpack_require__(/*! querystring */ 6);
  var overrides = querystring.parse(__resourceQuery.slice(1));
  setOverrides(overrides);
}

if (typeof window === 'undefined') {
  // do nothing
} else if (typeof window.EventSource === 'undefined') {
  console.warn(
    "webpack-hot-middleware's client requires EventSource to work. " +
    "You should include a polyfill if you want to support this browser: " +
    "https://developer.mozilla.org/en-US/docs/Web/API/Server-sent_events#Tools"
  );
} else {
  if (options.autoConnect) {
    connect();
  }
}

/* istanbul ignore next */
function setOptionsAndConnect(overrides) {
  setOverrides(overrides);
  connect();
}

function setOverrides(overrides) {
  if (overrides.autoConnect) options.autoConnect = overrides.autoConnect == 'true';
  if (overrides.path) options.path = overrides.path;
  if (overrides.timeout) options.timeout = overrides.timeout;
  if (overrides.overlay) options.overlay = overrides.overlay !== 'false';
  if (overrides.reload) options.reload = overrides.reload !== 'false';
  if (overrides.noInfo && overrides.noInfo !== 'false') {
    options.log = false;
  }
  if (overrides.name) {
    options.name = overrides.name;
  }
  if (overrides.quiet && overrides.quiet !== 'false') {
    options.log = false;
    options.warn = false;
  }

  if (overrides.dynamicPublicPath) {
    options.path = __webpack_require__.p + options.path;
  }

  if (overrides.ansiColors) options.ansiColors = JSON.parse(overrides.ansiColors);
  if (overrides.overlayStyles) options.overlayStyles = JSON.parse(overrides.overlayStyles);

  if (overrides.overlayWarnings) {
    options.overlayWarnings = overrides.overlayWarnings == 'true';
  }
}

function EventSourceWrapper() {
  var source;
  var lastActivity = new Date();
  var listeners = [];

  init();
  var timer = setInterval(function() {
    if ((new Date() - lastActivity) > options.timeout) {
      handleDisconnect();
    }
  }, options.timeout / 2);

  function init() {
    source = new window.EventSource(options.path);
    source.onopen = handleOnline;
    source.onerror = handleDisconnect;
    source.onmessage = handleMessage;
  }

  function handleOnline() {
    if (options.log) console.log("[HMR] connected");
    lastActivity = new Date();
  }

  function handleMessage(event) {
    lastActivity = new Date();
    for (var i = 0; i < listeners.length; i++) {
      listeners[i](event);
    }
  }

  function handleDisconnect() {
    clearInterval(timer);
    source.close();
    setTimeout(init, options.timeout);
  }

  return {
    addMessageListener: function(fn) {
      listeners.push(fn);
    }
  };
}

function getEventSourceWrapper() {
  if (!window.__whmEventSourceWrapper) {
    window.__whmEventSourceWrapper = {};
  }
  if (!window.__whmEventSourceWrapper[options.path]) {
    // cache the wrapper for other entries loaded on
    // the same page with the same options.path
    window.__whmEventSourceWrapper[options.path] = EventSourceWrapper();
  }
  return window.__whmEventSourceWrapper[options.path];
}

function connect() {
  getEventSourceWrapper().addMessageListener(handleMessage);

  function handleMessage(event) {
    if (event.data == "\uD83D\uDC93") {
      return;
    }
    try {
      processMessage(JSON.parse(event.data));
    } catch (ex) {
      if (options.warn) {
        console.warn("Invalid HMR message: " + event.data + "\n" + ex);
      }
    }
  }
}

// the reporter needs to be a singleton on the page
// in case the client is being used by multiple bundles
// we only want to report once.
// all the errors will go to all clients
var singletonKey = '__webpack_hot_middleware_reporter__';
var reporter;
if (typeof window !== 'undefined') {
  if (!window[singletonKey]) {
    window[singletonKey] = createReporter();
  }
  reporter = window[singletonKey];
}

function createReporter() {
  var strip = __webpack_require__(/*! strip-ansi */ 9);

  var overlay;
  if (typeof document !== 'undefined' && options.overlay) {
    overlay = __webpack_require__(/*! ./client-overlay */ 11)({
      ansiColors: options.ansiColors,
      overlayStyles: options.overlayStyles
    });
  }

  var styles = {
    errors: "color: #ff0000;",
    warnings: "color: #999933;"
  };
  var previousProblems = null;
  function log(type, obj) {
    var newProblems = obj[type].map(function(msg) { return strip(msg); }).join('\n');
    if (previousProblems == newProblems) {
      return;
    } else {
      previousProblems = newProblems;
    }

    var style = styles[type];
    var name = obj.name ? "'" + obj.name + "' " : "";
    var title = "[HMR] bundle " + name + "has " + obj[type].length + " " + type;
    // NOTE: console.warn or console.error will print the stack trace
    // which isn't helpful here, so using console.log to escape it.
    if (console.group && console.groupEnd) {
      console.group("%c" + title, style);
      console.log("%c" + newProblems, style);
      console.groupEnd();
    } else {
      console.log(
        "%c" + title + "\n\t%c" + newProblems.replace(/\n/g, "\n\t"),
        style + "font-weight: bold;",
        style + "font-weight: normal;"
      );
    }
  }

  return {
    cleanProblemsCache: function () {
      previousProblems = null;
    },
    problems: function(type, obj) {
      if (options.warn) {
        log(type, obj);
      }
      if (overlay) {
        if (options.overlayWarnings || type === 'errors') {
          overlay.showProblems(type, obj[type]);
          return false;
        }
        overlay.clear();
      }
      return true;
    },
    success: function() {
      if (overlay) overlay.clear();
    },
    useCustomOverlay: function(customOverlay) {
      overlay = customOverlay;
    }
  };
}

var processUpdate = __webpack_require__(/*! ./process-update */ 16);

var customHandler;
var subscribeAllHandler;
function processMessage(obj) {
  switch(obj.action) {
    case "building":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilding"
        );
      }
      break;
    case "built":
      if (options.log) {
        console.log(
          "[HMR] bundle " + (obj.name ? "'" + obj.name + "' " : "") +
          "rebuilt in " + obj.time + "ms"
        );
      }
      // fall through
    case "sync":
      if (obj.name && options.name && obj.name !== options.name) {
        return;
      }
      var applyUpdate = true;
      if (obj.errors.length > 0) {
        if (reporter) reporter.problems('errors', obj);
        applyUpdate = false;
      } else if (obj.warnings.length > 0) {
        if (reporter) {
          var overlayShown = reporter.problems('warnings', obj);
          applyUpdate = overlayShown;
        }
      } else {
        if (reporter) {
          reporter.cleanProblemsCache();
          reporter.success();
        }
      }
      if (applyUpdate) {
        processUpdate(obj.hash, obj.modules, options);
      }
      break;
    default:
      if (customHandler) {
        customHandler(obj);
      }
  }

  if (subscribeAllHandler) {
    subscribeAllHandler(obj);
  }
}

if (module) {
  module.exports = {
    subscribeAll: function subscribeAll(handler) {
      subscribeAllHandler = handler;
    },
    subscribe: function subscribe(handler) {
      customHandler = handler;
    },
    useCustomOverlay: function useCustomOverlay(customOverlay) {
      if (reporter) reporter.useCustomOverlay(customOverlay);
    },
    setOptionsAndConnect: setOptionsAndConnect
  };
}

/* WEBPACK VAR INJECTION */}.call(exports, "?noInfo=true&timeout=20000&reload=true", __webpack_require__(/*! ./../webpack/buildin/module.js */ 5)(module)))

/***/ }),
/* 5 */
/*!***********************************!*\
  !*** (webpack)/buildin/module.js ***!
  \***********************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = function(module) {
	if(!module.webpackPolyfill) {
		module.deprecate = function() {};
		module.paths = [];
		// module.parent = undefined by default
		if(!module.children) module.children = [];
		Object.defineProperty(module, "loaded", {
			enumerable: true,
			get: function() {
				return module.l;
			}
		});
		Object.defineProperty(module, "id", {
			enumerable: true,
			get: function() {
				return module.i;
			}
		});
		module.webpackPolyfill = 1;
	}
	return module;
};


/***/ }),
/* 6 */
/*!****************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/querystring-es3/index.js ***!
  \****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


exports.decode = exports.parse = __webpack_require__(/*! ./decode */ 7);
exports.encode = exports.stringify = __webpack_require__(/*! ./encode */ 8);


/***/ }),
/* 7 */
/*!*****************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/querystring-es3/decode.js ***!
  \*****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



// If obj.hasOwnProperty has been overridden, then calling
// obj.hasOwnProperty(prop) will break.
// See: https://github.com/joyent/node/issues/1707
function hasOwnProperty(obj, prop) {
  return Object.prototype.hasOwnProperty.call(obj, prop);
}

module.exports = function(qs, sep, eq, options) {
  sep = sep || '&';
  eq = eq || '=';
  var obj = {};

  if (typeof qs !== 'string' || qs.length === 0) {
    return obj;
  }

  var regexp = /\+/g;
  qs = qs.split(sep);

  var maxKeys = 1000;
  if (options && typeof options.maxKeys === 'number') {
    maxKeys = options.maxKeys;
  }

  var len = qs.length;
  // maxKeys <= 0 means that we should not limit keys count
  if (maxKeys > 0 && len > maxKeys) {
    len = maxKeys;
  }

  for (var i = 0; i < len; ++i) {
    var x = qs[i].replace(regexp, '%20'),
        idx = x.indexOf(eq),
        kstr, vstr, k, v;

    if (idx >= 0) {
      kstr = x.substr(0, idx);
      vstr = x.substr(idx + 1);
    } else {
      kstr = x;
      vstr = '';
    }

    k = decodeURIComponent(kstr);
    v = decodeURIComponent(vstr);

    if (!hasOwnProperty(obj, k)) {
      obj[k] = v;
    } else if (isArray(obj[k])) {
      obj[k].push(v);
    } else {
      obj[k] = [obj[k], v];
    }
  }

  return obj;
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};


/***/ }),
/* 8 */
/*!*****************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/querystring-es3/encode.js ***!
  \*****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";
// Copyright Joyent, Inc. and other Node contributors.
//
// Permission is hereby granted, free of charge, to any person obtaining a
// copy of this software and associated documentation files (the
// "Software"), to deal in the Software without restriction, including
// without limitation the rights to use, copy, modify, merge, publish,
// distribute, sublicense, and/or sell copies of the Software, and to permit
// persons to whom the Software is furnished to do so, subject to the
// following conditions:
//
// The above copyright notice and this permission notice shall be included
// in all copies or substantial portions of the Software.
//
// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
// USE OR OTHER DEALINGS IN THE SOFTWARE.



var stringifyPrimitive = function(v) {
  switch (typeof v) {
    case 'string':
      return v;

    case 'boolean':
      return v ? 'true' : 'false';

    case 'number':
      return isFinite(v) ? v : '';

    default:
      return '';
  }
};

module.exports = function(obj, sep, eq, name) {
  sep = sep || '&';
  eq = eq || '=';
  if (obj === null) {
    obj = undefined;
  }

  if (typeof obj === 'object') {
    return map(objectKeys(obj), function(k) {
      var ks = encodeURIComponent(stringifyPrimitive(k)) + eq;
      if (isArray(obj[k])) {
        return map(obj[k], function(v) {
          return ks + encodeURIComponent(stringifyPrimitive(v));
        }).join(sep);
      } else {
        return ks + encodeURIComponent(stringifyPrimitive(obj[k]));
      }
    }).join(sep);

  }

  if (!name) return '';
  return encodeURIComponent(stringifyPrimitive(name)) + eq +
         encodeURIComponent(stringifyPrimitive(obj));
};

var isArray = Array.isArray || function (xs) {
  return Object.prototype.toString.call(xs) === '[object Array]';
};

function map (xs, f) {
  if (xs.map) return xs.map(f);
  var res = [];
  for (var i = 0; i < xs.length; i++) {
    res.push(f(xs[i], i));
  }
  return res;
}

var objectKeys = Object.keys || function (obj) {
  var res = [];
  for (var key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) res.push(key);
  }
  return res;
};


/***/ }),
/* 9 */
/*!***********************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/strip-ansi/index.js ***!
  \***********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

var ansiRegex = __webpack_require__(/*! ansi-regex */ 10)();

module.exports = function (str) {
	return typeof str === 'string' ? str.replace(ansiRegex, '') : str;
};


/***/ }),
/* 10 */
/*!***********************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/ansi-regex/index.js ***!
  \***********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";

module.exports = function () {
	return /[\u001b\u009b][[()#;?]*(?:[0-9]{1,4}(?:;[0-9]{0,4})*)?[0-9A-PRZcf-nqry=><]/g;
};


/***/ }),
/* 11 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/client-overlay.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/*eslint-env browser*/

var clientOverlay = document.createElement('div');
clientOverlay.id = 'webpack-hot-middleware-clientOverlay';
var styles = {
  background: 'rgba(0,0,0,0.85)',
  color: '#E8E8E8',
  lineHeight: '1.2',
  whiteSpace: 'pre',
  fontFamily: 'Menlo, Consolas, monospace',
  fontSize: '13px',
  position: 'fixed',
  zIndex: 9999,
  padding: '10px',
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  overflow: 'auto',
  dir: 'ltr',
  textAlign: 'left'
};

var ansiHTML = __webpack_require__(/*! ansi-html */ 12);
var colors = {
  reset: ['transparent', 'transparent'],
  black: '181818',
  red: 'E36049',
  green: 'B3CB74',
  yellow: 'FFD080',
  blue: '7CAFC2',
  magenta: '7FACCA',
  cyan: 'C3C2EF',
  lightgrey: 'EBE7E3',
  darkgrey: '6D7891'
};

var Entities = __webpack_require__(/*! html-entities */ 13).AllHtmlEntities;
var entities = new Entities();

function showProblems(type, lines) {
  clientOverlay.innerHTML = '';
  lines.forEach(function(msg) {
    msg = ansiHTML(entities.encode(msg));
    var div = document.createElement('div');
    div.style.marginBottom = '26px';
    div.innerHTML = problemType(type) + ' in ' + msg;
    clientOverlay.appendChild(div);
  });
  if (document.body) {
    document.body.appendChild(clientOverlay);
  }
}

function clear() {
  if (document.body && clientOverlay.parentNode) {
    document.body.removeChild(clientOverlay);
  }
}

function problemType (type) {
  var problemColors = {
    errors: colors.red,
    warnings: colors.yellow
  };
  var color = problemColors[type] || colors.red;
  return (
    '<span style="background-color:#' + color + '; color:#fff; padding:2px 4px; border-radius: 2px">' +
      type.slice(0, -1).toUpperCase() +
    '</span>'
  );
}

module.exports = function(options) {
  for (var color in options.overlayColors) {
    if (color in colors) {
      colors[color] = options.overlayColors[color];
    }
    ansiHTML.setColors(colors);
  }

  for (var style in options.overlayStyles) {
    styles[style] = options.overlayStyles[style];
  }

  for (var key in styles) {
    clientOverlay.style[key] = styles[key];
  }

  return {
    showProblems: showProblems,
    clear: clear
  }
};

module.exports.clear = clear;
module.exports.showProblems = showProblems;


/***/ }),
/* 12 */
/*!**********************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/ansi-html/index.js ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


module.exports = ansiHTML

// Reference to https://github.com/sindresorhus/ansi-regex
var _regANSI = /(?:(?:\u001b\[)|\u009b)(?:(?:[0-9]{1,3})?(?:(?:;[0-9]{0,3})*)?[A-M|f-m])|\u001b[A-M]/

var _defColors = {
  reset: ['fff', '000'], // [FOREGROUD_COLOR, BACKGROUND_COLOR]
  black: '000',
  red: 'ff0000',
  green: '209805',
  yellow: 'e8bf03',
  blue: '0000ff',
  magenta: 'ff00ff',
  cyan: '00ffee',
  lightgrey: 'f0f0f0',
  darkgrey: '888'
}
var _styles = {
  30: 'black',
  31: 'red',
  32: 'green',
  33: 'yellow',
  34: 'blue',
  35: 'magenta',
  36: 'cyan',
  37: 'lightgrey'
}
var _openTags = {
  '1': 'font-weight:bold', // bold
  '2': 'opacity:0.5', // dim
  '3': '<i>', // italic
  '4': '<u>', // underscore
  '8': 'display:none', // hidden
  '9': '<del>' // delete
}
var _closeTags = {
  '23': '</i>', // reset italic
  '24': '</u>', // reset underscore
  '29': '</del>' // reset delete
}

;[0, 21, 22, 27, 28, 39, 49].forEach(function (n) {
  _closeTags[n] = '</span>'
})

/**
 * Converts text with ANSI color codes to HTML markup.
 * @param {String} text
 * @returns {*}
 */
function ansiHTML (text) {
  // Returns the text if the string has no ANSI escape code.
  if (!_regANSI.test(text)) {
    return text
  }

  // Cache opened sequence.
  var ansiCodes = []
  // Replace with markup.
  var ret = text.replace(/\033\[(\d+)*m/g, function (match, seq) {
    var ot = _openTags[seq]
    if (ot) {
      // If current sequence has been opened, close it.
      if (!!~ansiCodes.indexOf(seq)) { // eslint-disable-line no-extra-boolean-cast
        ansiCodes.pop()
        return '</span>'
      }
      // Open tag.
      ansiCodes.push(seq)
      return ot[0] === '<' ? ot : '<span style="' + ot + ';">'
    }

    var ct = _closeTags[seq]
    if (ct) {
      // Pop sequence
      ansiCodes.pop()
      return ct
    }
    return ''
  })

  // Make sure tags are closed.
  var l = ansiCodes.length
  ;(l > 0) && (ret += Array(l + 1).join('</span>'))

  return ret
}

/**
 * Customize colors.
 * @param {Object} colors reference to _defColors
 */
ansiHTML.setColors = function (colors) {
  if (typeof colors !== 'object') {
    throw new Error('`colors` parameter must be an Object.')
  }

  var _finalColors = {}
  for (var key in _defColors) {
    var hex = colors.hasOwnProperty(key) ? colors[key] : null
    if (!hex) {
      _finalColors[key] = _defColors[key]
      continue
    }
    if ('reset' === key) {
      if (typeof hex === 'string') {
        hex = [hex]
      }
      if (!Array.isArray(hex) || hex.length === 0 || hex.some(function (h) {
        return typeof h !== 'string'
      })) {
        throw new Error('The value of `' + key + '` property must be an Array and each item could only be a hex string, e.g.: FF0000')
      }
      var defHexColor = _defColors[key]
      if (!hex[0]) {
        hex[0] = defHexColor[0]
      }
      if (hex.length === 1 || !hex[1]) {
        hex = [hex[0]]
        hex.push(defHexColor[1])
      }

      hex = hex.slice(0, 2)
    } else if (typeof hex !== 'string') {
      throw new Error('The value of `' + key + '` property must be a hex string, e.g.: FF0000')
    }
    _finalColors[key] = hex
  }
  _setTags(_finalColors)
}

/**
 * Reset colors.
 */
ansiHTML.reset = function () {
  _setTags(_defColors)
}

/**
 * Expose tags, including open and close.
 * @type {Object}
 */
ansiHTML.tags = {}

if (Object.defineProperty) {
  Object.defineProperty(ansiHTML.tags, 'open', {
    get: function () { return _openTags }
  })
  Object.defineProperty(ansiHTML.tags, 'close', {
    get: function () { return _closeTags }
  })
} else {
  ansiHTML.tags.open = _openTags
  ansiHTML.tags.close = _closeTags
}

function _setTags (colors) {
  // reset all
  _openTags['0'] = 'font-weight:normal;opacity:1;color:#' + colors.reset[0] + ';background:#' + colors.reset[1]
  // inverse
  _openTags['7'] = 'color:#' + colors.reset[1] + ';background:#' + colors.reset[0]
  // dark grey
  _openTags['90'] = 'color:#' + colors.darkgrey

  for (var code in _styles) {
    var color = _styles[code]
    var oriColor = colors[color] || '000'
    _openTags[code] = 'color:#' + oriColor
    code = parseInt(code)
    _openTags[(code + 10).toString()] = 'background:#' + oriColor
  }
}

ansiHTML.reset()


/***/ }),
/* 13 */
/*!**************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/html-entities/index.js ***!
  \**************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

module.exports = {
  XmlEntities: __webpack_require__(/*! ./lib/xml-entities.js */ 14),
  Html4Entities: __webpack_require__(/*! ./lib/html4-entities.js */ 15),
  Html5Entities: __webpack_require__(/*! ./lib/html5-entities.js */ 0),
  AllHtmlEntities: __webpack_require__(/*! ./lib/html5-entities.js */ 0)
};


/***/ }),
/* 14 */
/*!*************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/html-entities/lib/xml-entities.js ***!
  \*************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var ALPHA_INDEX = {
    '&lt': '<',
    '&gt': '>',
    '&quot': '"',
    '&apos': '\'',
    '&amp': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&quot;': '"',
    '&apos;': '\'',
    '&amp;': '&'
};

var CHAR_INDEX = {
    60: 'lt',
    62: 'gt',
    34: 'quot',
    39: 'apos',
    38: 'amp'
};

var CHAR_S_INDEX = {
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    '\'': '&apos;',
    '&': '&amp;'
};

/**
 * @constructor
 */
function XmlEntities() {}

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/<|>|"|'|&/g, function(s) {
        return CHAR_S_INDEX[s];
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encode = function(str) {
    return new XmlEntities().encode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&#?[0-9a-zA-Z]+;?/g, function(s) {
        if (s.charAt(1) === '#') {
            var code = s.charAt(2).toLowerCase() === 'x' ?
                parseInt(s.substr(3), 16) :
                parseInt(s.substr(2));

            if (isNaN(code) || code < -32768 || code > 65535) {
                return '';
            }
            return String.fromCharCode(code);
        }
        return ALPHA_INDEX[s] || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.decode = function(str) {
    return new XmlEntities().decode(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        var alpha = CHAR_INDEX[c];
        if (alpha) {
            result += "&" + alpha + ";";
            i++;
            continue;
        }
        if (c < 32 || c > 126) {
            result += '&#' + c + ';';
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonUTF = function(str) {
    return new XmlEntities().encodeNonUTF(str);
 };

/**
 * @param {String} str
 * @returns {String}
 */
XmlEntities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLenght = str.length;
    var result = '';
    var i = 0;
    while (i < strLenght) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
 XmlEntities.encodeNonASCII = function(str) {
    return new XmlEntities().encodeNonASCII(str);
 };

module.exports = XmlEntities;


/***/ }),
/* 15 */
/*!***************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/html-entities/lib/html4-entities.js ***!
  \***************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

var HTML_ALPHA = ['apos', 'nbsp', 'iexcl', 'cent', 'pound', 'curren', 'yen', 'brvbar', 'sect', 'uml', 'copy', 'ordf', 'laquo', 'not', 'shy', 'reg', 'macr', 'deg', 'plusmn', 'sup2', 'sup3', 'acute', 'micro', 'para', 'middot', 'cedil', 'sup1', 'ordm', 'raquo', 'frac14', 'frac12', 'frac34', 'iquest', 'Agrave', 'Aacute', 'Acirc', 'Atilde', 'Auml', 'Aring', 'Aelig', 'Ccedil', 'Egrave', 'Eacute', 'Ecirc', 'Euml', 'Igrave', 'Iacute', 'Icirc', 'Iuml', 'ETH', 'Ntilde', 'Ograve', 'Oacute', 'Ocirc', 'Otilde', 'Ouml', 'times', 'Oslash', 'Ugrave', 'Uacute', 'Ucirc', 'Uuml', 'Yacute', 'THORN', 'szlig', 'agrave', 'aacute', 'acirc', 'atilde', 'auml', 'aring', 'aelig', 'ccedil', 'egrave', 'eacute', 'ecirc', 'euml', 'igrave', 'iacute', 'icirc', 'iuml', 'eth', 'ntilde', 'ograve', 'oacute', 'ocirc', 'otilde', 'ouml', 'divide', 'oslash', 'ugrave', 'uacute', 'ucirc', 'uuml', 'yacute', 'thorn', 'yuml', 'quot', 'amp', 'lt', 'gt', 'OElig', 'oelig', 'Scaron', 'scaron', 'Yuml', 'circ', 'tilde', 'ensp', 'emsp', 'thinsp', 'zwnj', 'zwj', 'lrm', 'rlm', 'ndash', 'mdash', 'lsquo', 'rsquo', 'sbquo', 'ldquo', 'rdquo', 'bdquo', 'dagger', 'Dagger', 'permil', 'lsaquo', 'rsaquo', 'euro', 'fnof', 'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Eta', 'Theta', 'Iota', 'Kappa', 'Lambda', 'Mu', 'Nu', 'Xi', 'Omicron', 'Pi', 'Rho', 'Sigma', 'Tau', 'Upsilon', 'Phi', 'Chi', 'Psi', 'Omega', 'alpha', 'beta', 'gamma', 'delta', 'epsilon', 'zeta', 'eta', 'theta', 'iota', 'kappa', 'lambda', 'mu', 'nu', 'xi', 'omicron', 'pi', 'rho', 'sigmaf', 'sigma', 'tau', 'upsilon', 'phi', 'chi', 'psi', 'omega', 'thetasym', 'upsih', 'piv', 'bull', 'hellip', 'prime', 'Prime', 'oline', 'frasl', 'weierp', 'image', 'real', 'trade', 'alefsym', 'larr', 'uarr', 'rarr', 'darr', 'harr', 'crarr', 'lArr', 'uArr', 'rArr', 'dArr', 'hArr', 'forall', 'part', 'exist', 'empty', 'nabla', 'isin', 'notin', 'ni', 'prod', 'sum', 'minus', 'lowast', 'radic', 'prop', 'infin', 'ang', 'and', 'or', 'cap', 'cup', 'int', 'there4', 'sim', 'cong', 'asymp', 'ne', 'equiv', 'le', 'ge', 'sub', 'sup', 'nsub', 'sube', 'supe', 'oplus', 'otimes', 'perp', 'sdot', 'lceil', 'rceil', 'lfloor', 'rfloor', 'lang', 'rang', 'loz', 'spades', 'clubs', 'hearts', 'diams'];
var HTML_CODES = [39, 160, 161, 162, 163, 164, 165, 166, 167, 168, 169, 170, 171, 172, 173, 174, 175, 176, 177, 178, 179, 180, 181, 182, 183, 184, 185, 186, 187, 188, 189, 190, 191, 192, 193, 194, 195, 196, 197, 198, 199, 200, 201, 202, 203, 204, 205, 206, 207, 208, 209, 210, 211, 212, 213, 214, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 225, 226, 227, 228, 229, 230, 231, 232, 233, 234, 235, 236, 237, 238, 239, 240, 241, 242, 243, 244, 245, 246, 247, 248, 249, 250, 251, 252, 253, 254, 255, 34, 38, 60, 62, 338, 339, 352, 353, 376, 710, 732, 8194, 8195, 8201, 8204, 8205, 8206, 8207, 8211, 8212, 8216, 8217, 8218, 8220, 8221, 8222, 8224, 8225, 8240, 8249, 8250, 8364, 402, 913, 914, 915, 916, 917, 918, 919, 920, 921, 922, 923, 924, 925, 926, 927, 928, 929, 931, 932, 933, 934, 935, 936, 937, 945, 946, 947, 948, 949, 950, 951, 952, 953, 954, 955, 956, 957, 958, 959, 960, 961, 962, 963, 964, 965, 966, 967, 968, 969, 977, 978, 982, 8226, 8230, 8242, 8243, 8254, 8260, 8472, 8465, 8476, 8482, 8501, 8592, 8593, 8594, 8595, 8596, 8629, 8656, 8657, 8658, 8659, 8660, 8704, 8706, 8707, 8709, 8711, 8712, 8713, 8715, 8719, 8721, 8722, 8727, 8730, 8733, 8734, 8736, 8743, 8744, 8745, 8746, 8747, 8756, 8764, 8773, 8776, 8800, 8801, 8804, 8805, 8834, 8835, 8836, 8838, 8839, 8853, 8855, 8869, 8901, 8968, 8969, 8970, 8971, 9001, 9002, 9674, 9824, 9827, 9829, 9830];

var alphaIndex = {};
var numIndex = {};

var i = 0;
var length = HTML_ALPHA.length;
while (i < length) {
    var a = HTML_ALPHA[i];
    var c = HTML_CODES[i];
    alphaIndex[a] = String.fromCharCode(c);
    numIndex[c] = a;
    i++;
}

/**
 * @constructor
 */
function Html4Entities() {}

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.decode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    return str.replace(/&(#?[\w\d]+);?/g, function(s, entity) {
        var chr;
        if (entity.charAt(0) === "#") {
            var code = entity.charAt(1).toLowerCase() === 'x' ?
                parseInt(entity.substr(2), 16) :
                parseInt(entity.substr(1));

            if (!(isNaN(code) || code < -32768 || code > 65535)) {
                chr = String.fromCharCode(code);
            }
        } else {
            chr = alphaIndex[entity];
        }
        return chr || s;
    });
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.decode = function(str) {
    return new Html4Entities().decode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encode = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var alpha = numIndex[str.charCodeAt(i)];
        result += alpha ? "&" + alpha + ";" : str.charAt(i);
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encode = function(str) {
    return new Html4Entities().encode(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonUTF = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var cc = str.charCodeAt(i);
        var alpha = numIndex[cc];
        if (alpha) {
            result += "&" + alpha + ";";
        } else if (cc < 32 || cc > 126) {
            result += "&#" + cc + ";";
        } else {
            result += str.charAt(i);
        }
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonUTF = function(str) {
    return new Html4Entities().encodeNonUTF(str);
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.prototype.encodeNonASCII = function(str) {
    if (!str || !str.length) {
        return '';
    }
    var strLength = str.length;
    var result = '';
    var i = 0;
    while (i < strLength) {
        var c = str.charCodeAt(i);
        if (c <= 255) {
            result += str[i++];
            continue;
        }
        result += '&#' + c + ';';
        i++;
    }
    return result;
};

/**
 * @param {String} str
 * @returns {String}
 */
Html4Entities.encodeNonASCII = function(str) {
    return new Html4Entities().encodeNonASCII(str);
};

module.exports = Html4Entities;


/***/ }),
/* 16 */
/*!**************************************************!*\
  !*** (webpack)-hot-middleware/process-update.js ***!
  \**************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/**
 * Based heavily on https://github.com/webpack/webpack/blob/
 *  c0afdf9c6abc1dd70707c594e473802a566f7b6e/hot/only-dev-server.js
 * Original copyright Tobias Koppers @sokra (MIT license)
 */

/* global window __webpack_hash__ */

if (false) {
  throw new Error("[HMR] Hot Module Replacement is disabled.");
}

var hmrDocsUrl = "https://webpack.js.org/concepts/hot-module-replacement/"; // eslint-disable-line max-len

var lastHash;
var failureStatuses = { abort: 1, fail: 1 };
var applyOptions = { 				
  ignoreUnaccepted: true,
  ignoreDeclined: true,
  ignoreErrored: true,
  onUnaccepted: function(data) {
    console.warn("Ignored an update to unaccepted module " + data.chain.join(" -> "));
  },
  onDeclined: function(data) {
    console.warn("Ignored an update to declined module " + data.chain.join(" -> "));
  },
  onErrored: function(data) {
    console.error(data.error);
    console.warn("Ignored an error while updating module " + data.moduleId + " (" + data.type + ")");
  } 
}

function upToDate(hash) {
  if (hash) lastHash = hash;
  return lastHash == __webpack_require__.h();
}

module.exports = function(hash, moduleMap, options) {
  var reload = options.reload;
  if (!upToDate(hash) && module.hot.status() == "idle") {
    if (options.log) console.log("[HMR] Checking for updates on the server...");
    check();
  }

  function check() {
    var cb = function(err, updatedModules) {
      if (err) return handleError(err);

      if(!updatedModules) {
        if (options.warn) {
          console.warn("[HMR] Cannot find update (Full reload needed)");
          console.warn("[HMR] (Probably because of restarting the server)");
        }
        performReload();
        return null;
      }

      var applyCallback = function(applyErr, renewedModules) {
        if (applyErr) return handleError(applyErr);

        if (!upToDate()) check();

        logUpdates(updatedModules, renewedModules);
      };

      var applyResult = module.hot.apply(applyOptions, applyCallback);
      // webpack 2 promise
      if (applyResult && applyResult.then) {
        // HotModuleReplacement.runtime.js refers to the result as `outdatedModules`
        applyResult.then(function(outdatedModules) {
          applyCallback(null, outdatedModules);
        });
        applyResult.catch(applyCallback);
      }

    };

    var result = module.hot.check(false, cb);
    // webpack 2 promise
    if (result && result.then) {
        result.then(function(updatedModules) {
            cb(null, updatedModules);
        });
        result.catch(cb);
    }
  }

  function logUpdates(updatedModules, renewedModules) {
    var unacceptedModules = updatedModules.filter(function(moduleId) {
      return renewedModules && renewedModules.indexOf(moduleId) < 0;
    });

    if(unacceptedModules.length > 0) {
      if (options.warn) {
        console.warn(
          "[HMR] The following modules couldn't be hot updated: " +
          "(Full reload needed)\n" +
          "This is usually because the modules which have changed " +
          "(and their parents) do not know how to hot reload themselves. " +
          "See " + hmrDocsUrl + " for more details."
        );
        unacceptedModules.forEach(function(moduleId) {
          console.warn("[HMR]  - " + moduleMap[moduleId]);
        });
      }
      performReload();
      return;
    }

    if (options.log) {
      if(!renewedModules || renewedModules.length === 0) {
        console.log("[HMR] Nothing hot updated.");
      } else {
        console.log("[HMR] Updated modules:");
        renewedModules.forEach(function(moduleId) {
          console.log("[HMR]  - " + moduleMap[moduleId]);
        });
      }

      if (upToDate()) {
        console.log("[HMR] App is up to date.");
      }
    }
  }

  function handleError(err) {
    if (module.hot.status() in failureStatuses) {
      if (options.warn) {
        console.warn("[HMR] Cannot check for update (Full reload needed)");
        console.warn("[HMR] " + err.stack || err.message);
      }
      performReload();
      return;
    }
    if (options.warn) {
      console.warn("[HMR] Update check failed: " + err.stack || err.message);
    }
  }

  function performReload() {
    if (reload) {
      if (options.warn) console.warn("[HMR] Reloading page");
      window.location.reload();
    }
  }
};


/***/ }),
/* 17 */
/*!***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/cache-loader/dist/cjs.js!D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/css-loader?{"sourceMap":true}!D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/postcss-loader/lib?{"config":{"path":"D://OSPanel//domains//sage//mz//wp-content//themes//sage-lete//resources//assets//build","ctx":{"open":true,"copy":"images/**_/*","proxyUrl":"http://localhost:3000","cacheBusting":"[name]_[hash:8]","paths":{"root":"D://OSPanel//domains//sage//mz//wp-content//themes//sage-lete","assets":"D://OSPanel//domains//sage//mz//wp-content//themes//sage-lete//resources//assets","dist":"D://OSPanel//domains//sage//mz//wp-content//themes//sage-lete//dist"},"enabled":{"sourceMaps":true,"optimize":false,"cacheBusting":false,"watcher":true},"watch":["app/**_/*.php","config/**_/*.php","resources/views/**_/*.php"],"entry":{"main":["./scripts/main.js","./styles/main.scss"],"customizer":["./scripts/customizer.js"]},"publicPath":"/wp-content/themes/sage-lete/dist/","devUrl":"http://sage.test","env":{"production":false,"development":true},"manifest":{}}},"sourceMap":true}!D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/resolve-url-loader?{"sourceMap":true}!D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/sass-loader/lib/loader.js?{"sourceMap":true,"sourceComments":true}!D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/import-glob!./styles/main.scss ***!
  \***************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

var escape = __webpack_require__(/*! ../../../node_modules/css-loader/lib/url/escape.js */ 35);
exports = module.exports = __webpack_require__(/*! ../../../node_modules/css-loader/lib/css-base.js */ 36)(true);
// imports


// module

// exports


/***/ }),
/* 18 */
/*!**********************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/process/browser.js ***!
  \**********************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

// shim for using process in browser
var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

function defaultSetTimout() {
    throw new Error('setTimeout has not been defined');
}
function defaultClearTimeout () {
    throw new Error('clearTimeout has not been defined');
}
(function () {
    try {
        if (typeof setTimeout === 'function') {
            cachedSetTimeout = setTimeout;
        } else {
            cachedSetTimeout = defaultSetTimout;
        }
    } catch (e) {
        cachedSetTimeout = defaultSetTimout;
    }
    try {
        if (typeof clearTimeout === 'function') {
            cachedClearTimeout = clearTimeout;
        } else {
            cachedClearTimeout = defaultClearTimeout;
        }
    } catch (e) {
        cachedClearTimeout = defaultClearTimeout;
    }
} ())
function runTimeout(fun) {
    if (cachedSetTimeout === setTimeout) {
        //normal enviroments in sane situations
        return setTimeout(fun, 0);
    }
    // if setTimeout wasn't available but was latter defined
    if ((cachedSetTimeout === defaultSetTimout || !cachedSetTimeout) && setTimeout) {
        cachedSetTimeout = setTimeout;
        return setTimeout(fun, 0);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedSetTimeout(fun, 0);
    } catch(e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't trust the global object when called normally
            return cachedSetTimeout.call(null, fun, 0);
        } catch(e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error
            return cachedSetTimeout.call(this, fun, 0);
        }
    }


}
function runClearTimeout(marker) {
    if (cachedClearTimeout === clearTimeout) {
        //normal enviroments in sane situations
        return clearTimeout(marker);
    }
    // if clearTimeout wasn't available but was latter defined
    if ((cachedClearTimeout === defaultClearTimeout || !cachedClearTimeout) && clearTimeout) {
        cachedClearTimeout = clearTimeout;
        return clearTimeout(marker);
    }
    try {
        // when when somebody has screwed with setTimeout but no I.E. maddness
        return cachedClearTimeout(marker);
    } catch (e){
        try {
            // When we are in I.E. but the script has been evaled so I.E. doesn't  trust the global object when called normally
            return cachedClearTimeout.call(null, marker);
        } catch (e){
            // same as above but when it's a version of I.E. that must have the global object for 'this', hopfully our context correct otherwise it will throw a global error.
            // Some versions of I.E. have different rules for clearTimeout vs setTimeout
            return cachedClearTimeout.call(this, marker);
        }
    }



}
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = runTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    runClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        runTimeout(drainQueue);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;
process.prependListener = noop;
process.prependOnceListener = noop;

process.listeners = function (name) { return [] }

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };


/***/ }),
/* 19 */
/*!****************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/slick-carousel/slick/fonts/slick.eot ***!
  \****************************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports) {

module.exports = "data:application/vnd.ms-fontobject;base64,AAgAAGQHAAABAAIAAAAAAAIABQkAAAAAAAABAJABAAAAAExQAQAAgCAAAAAAAAAAAAAAAAEAAAAAAAAATxDE8AAAAAAAAAAAAAAAAAAAAAAAAAoAcwBsAGkAYwBrAAAADgBSAGUAZwB1AGwAYQByAAAAFgBWAGUAcgBzAGkAbwBuACAAMQAuADAAAAAKAHMAbABpAGMAawAAAAAAAAEAAAANAIAAAwBQRkZUTW3RyK8AAAdIAAAAHEdERUYANAAGAAAHKAAAACBPUy8yT/b9sgAAAVgAAABWY21hcCIPRb0AAAHIAAABYmdhc3D//wADAAAHIAAAAAhnbHlmP5u2YAAAAzwAAAIsaGVhZAABMfsAAADcAAAANmhoZWED5QIFAAABFAAAACRobXR4BkoASgAAAbAAAAAWbG9jYQD2AaIAAAMsAAAAEG1heHAASwBHAAABOAAAACBuYW1lBSeBwgAABWgAAAFucG9zdC+zMgMAAAbYAAAARQABAAAAAQAA8MQQT18PPPUACwIAAAAAAM9xeH8AAAAAz3F4fwAlACUB2wHbAAAACAACAAAAAAAAAAEAAAHbAAAALgIAAAAAAAHbAAEAAAAAAAAAAAAAAAAAAAAEAAEAAAAHAEQAAgAAAAAAAgAAAAEAAQAAAEAAAAAAAAAAAQIAAZAABQAIAUwBZgAAAEcBTAFmAAAA9QAZAIQAAAIABQkAAAAAAACAAAABAAAAIAAAAAAAAAAAUGZFZABAAGEhkgHg/+AALgHb/9sAAAABAAAAAAAAAgAAAAAAAAACAAAAAgAAJQAlACUAJQAAAAAAAwAAAAMAAAAcAAEAAAAAAFwAAwABAAAAHAAEAEAAAAAMAAgAAgAEAAAAYSAiIZAhkv//AAAAAABhICIhkCGS//8AAP+l3+PedN5xAAEAAAAAAAAAAAAAAAAAAAEGAAABAAAAAAAAAAECAAAAAgAAAAAAAAAAAAAAAAAAAAEAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABgAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAFAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAABGAIwAsAEWAAIAJQAlAdsB2wAYACwAAD8BNjQvASYjIg8BBhUUHwEHBhUUHwEWMzI2FAcGBwYiJyYnJjQ3Njc2MhcWF/GCBgaCBQcIBR0GBldXBgYdBQgH7x0eMjB8MDIeHR0eMjB8MDIecYIGDgaCBQUeBQcJBFhYBAkHBR4F0nwwMh4dHR4yMHwwMh4dHR4yAAAAAgAlACUB2wHbABgALAAAJTc2NTQvATc2NTQvASYjIg8BBhQfARYzMjYUBwYHBiInJicmNDc2NzYyFxYXASgdBgZXVwYGHQUIBwWCBgaCBQcIuB0eMjB8MDIeHR0eMjB8MDIecR4FBwkEWFgECQcFHgUFggYOBoIF0nwwMh4dHR4yMHwwMh4dHR4yAAABACUAJQHbAdsAEwAAABQHBgcGIicmJyY0NzY3NjIXFhcB2x0eMjB8MDIeHR0eMjB8MDIeAT58MDIeHR0eMjB8MDIeHR0eMgABACUAJQHbAdsAQwAAARUUBisBIicmPwEmIyIHBgcGBwYUFxYXFhcWMzI3Njc2MzIfARYVFAcGBwYjIicmJyYnJjQ3Njc2NzYzMhcWFzc2FxYB2woIgAsGBQkoKjodHBwSFAwLCwwUEhwcHSIeIBMGAQQDJwMCISspNC8mLBobFBERFBsaLCYvKicpHSUIDAsBt4AICgsLCScnCwwUEhwcOhwcEhQMCw8OHAMDJwMDAgQnFBQRFBsaLCZeJiwaGxQRDxEcJQgEBgAAAAAAAAwAlgABAAAAAAABAAUADAABAAAAAAACAAcAIgABAAAAAAADACEAbgABAAAAAAAEAAUAnAABAAAAAAAFAAsAugABAAAAAAAGAAUA0gADAAEECQABAAoAAAADAAEECQACAA4AEgADAAEECQADAEIAKgADAAEECQAEAAoAkAADAAEECQAFABYAogADAAEECQAGAAoAxgBzAGwAaQBjAGsAAHNsaWNrAABSAGUAZwB1AGwAYQByAABSZWd1bGFyAABGAG8AbgB0AEYAbwByAGcAZQAgADIALgAwACAAOgAgAHMAbABpAGMAawAgADoAIAAxADQALQA0AC0AMgAwADEANAAARm9udEZvcmdlIDIuMCA6IHNsaWNrIDogMTQtNC0yMDE0AABzAGwAaQBjAGsAAHNsaWNrAABWAGUAcgBzAGkAbwBuACAAMQAuADAAAFZlcnNpb24gMS4wAABzAGwAaQBjAGsAAHNsaWNrAAAAAAIAAAAAAAAAAAAAAAAAAQAAAAAAAAAAAAAAAAAAAAAABwAAAAEAAgECAQMAhwBECmFycm93cmlnaHQJYXJyb3dsZWZ0AAAAAAAAAf//AAIAAQAAAA4AAAAYAAAAAAACAAEAAwAGAAEABAAAAAIAAAAAAAEAAAAAzu7XsAAAAADPcXh/AAAAAM9xeH8="

/***/ }),
/* 20 */
/*!****************************************************************************************!*\
  !*** multi ./build/util/../helpers/hmr-client.js ./scripts/main.js ./styles/main.scss ***!
  \****************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

__webpack_require__(/*! D:\OSPanel\domains\sage\mz\wp-content\themes\sage-lete\resources\assets\build\util/../helpers/hmr-client.js */3);
__webpack_require__(/*! ./scripts/main.js */21);
module.exports = __webpack_require__(/*! ./styles/main.scss */34);


/***/ }),
/* 21 */
/*!*************************!*\
  !*** ./scripts/main.js ***!
  \*************************/
/*! no exports provided */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(jQuery) {/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery__ = __webpack_require__(/*! jquery */ 1);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_jquery___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_jquery__);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_1__autoload_bootstrap_js__ = __webpack_require__(/*! ./autoload/_bootstrap.js */ 22);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_2__util_Router__ = __webpack_require__(/*! ./util/Router */ 25);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_3__routes_common__ = __webpack_require__(/*! ./routes/common */ 27);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_4__routes_home__ = __webpack_require__(/*! ./routes/home */ 28);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_5__routes_about__ = __webpack_require__(/*! ./routes/about */ 29);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_svg_core__ = __webpack_require__(/*! @fortawesome/fontawesome-svg-core */ 30);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_7__fortawesome_free_brands_svg_icons__ = __webpack_require__(/*! @fortawesome/free-brands-svg-icons */ 33);
// import external dependencies


// Import everything from autoload


// import local dependencies





// import then needed Font Awesome functionality


// import the Facebook, Vimeo, Youtube and Twitter icons
// import { faFacebookF, faVimeoV, faYoutube, faTwitter } from '@fortawesome/free-brands-svg-icons';

// execution of imports addictions
runAddictions();

function runAddictions(){
    /** Populate Router instance with DOM routes */
    var routes = new __WEBPACK_IMPORTED_MODULE_2__util_Router__["a" /* default */]({
      // All pages
      common: __WEBPACK_IMPORTED_MODULE_3__routes_common__["a" /* default */],
      // Home page
      home: __WEBPACK_IMPORTED_MODULE_4__routes_home__["a" /* default */],
      // About Us page, note the change from about-us to aboutUs.
      aboutUs: __WEBPACK_IMPORTED_MODULE_5__routes_about__["a" /* default */],
    });

    // Load Events
    jQuery(document).ready(function () { return routes.loadEvents(); });

    // add the imported icons to the library
    __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_svg_core__["b" /* library */].add(__WEBPACK_IMPORTED_MODULE_7__fortawesome_free_brands_svg_icons__["a" /* fab */]);

    // tell FontAwesome to watch the DOM and add the SVGs when it detects icon markup
    __WEBPACK_IMPORTED_MODULE_6__fortawesome_fontawesome_svg_core__["a" /* dom */].watch();
}

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! jquery */ 1)))

/***/ }),
/* 22 */
/*!****************************************!*\
  !*** ./scripts/autoload/_bootstrap.js ***!
  \****************************************/
/*! no exports provided */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap__ = __webpack_require__(/*! bootstrap */ 23);
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0_bootstrap___default = __webpack_require__.n(__WEBPACK_IMPORTED_MODULE_0_bootstrap__);



/***/ }),
/* 23 */
/*!**********************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/bootstrap/dist/js/bootstrap.js ***!
  \**********************************************************************************************************/
/*! dynamic exports provided */
/***/ (function(module, exports, __webpack_require__) {

/*!
  * Bootstrap v4.3.1 (https://getbootstrap.com/)
  * Copyright 2011-2019 The Bootstrap Authors (https://github.com/twbs/bootstrap/graphs/contributors)
  * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
  */
(function (global, factory) {
   true ? factory(exports, __webpack_require__(/*! jquery */ 1), __webpack_require__(/*! popper.js */ 24)) :
  typeof define === 'function' && define.amd ? define(['exports', 'jquery', 'popper.js'], factory) :
  (global = global || self, factory(global.bootstrap = {}, global.jQuery, global.Popper));
}(this, function (exports, $, Popper) { 'use strict';

  $ = $ && $.hasOwnProperty('default') ? $['default'] : $;
  Popper = Popper && Popper.hasOwnProperty('default') ? Popper['default'] : Popper;

  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) { descriptor.writable = true; }
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) { _defineProperties(Constructor.prototype, protoProps); }
    if (staticProps) { _defineProperties(Constructor, staticProps); }
    return Constructor;
  }

  function _defineProperty(obj, key, value) {
    if (key in obj) {
      Object.defineProperty(obj, key, {
        value: value,
        enumerable: true,
        configurable: true,
        writable: true
      });
    } else {
      obj[key] = value;
    }

    return obj;
  }

  function _objectSpread(target) {
    var arguments$1 = arguments;

    for (var i = 1; i < arguments.length; i++) {
      var source = arguments$1[i] != null ? arguments$1[i] : {};
      var ownKeys = Object.keys(source);

      if (typeof Object.getOwnPropertySymbols === 'function') {
        ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
          return Object.getOwnPropertyDescriptor(source, sym).enumerable;
        }));
      }

      ownKeys.forEach(function (key) {
        _defineProperty(target, key, source[key]);
      });
    }

    return target;
  }

  function _inheritsLoose(subClass, superClass) {
    subClass.prototype = Object.create(superClass.prototype);
    subClass.prototype.constructor = subClass;
    subClass.__proto__ = superClass;
  }

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): util.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  /**
   * ------------------------------------------------------------------------
   * Private TransitionEnd Helpers
   * ------------------------------------------------------------------------
   */

  var TRANSITION_END = 'transitionend';
  var MAX_UID = 1000000;
  var MILLISECONDS_MULTIPLIER = 1000; // Shoutout AngusCroll (https://goo.gl/pxwQGp)

  function toType(obj) {
    return {}.toString.call(obj).match(/\s([a-z]+)/i)[1].toLowerCase();
  }

  function getSpecialTransitionEndEvent() {
    return {
      bindType: TRANSITION_END,
      delegateType: TRANSITION_END,
      handle: function handle(event) {
        if ($(event.target).is(this)) {
          return event.handleObj.handler.apply(this, arguments); // eslint-disable-line prefer-rest-params
        }

        return undefined; // eslint-disable-line no-undefined
      }
    };
  }

  function transitionEndEmulator(duration) {
    var _this = this;

    var called = false;
    $(this).one(Util.TRANSITION_END, function () {
      called = true;
    });
    setTimeout(function () {
      if (!called) {
        Util.triggerTransitionEnd(_this);
      }
    }, duration);
    return this;
  }

  function setTransitionEndSupport() {
    $.fn.emulateTransitionEnd = transitionEndEmulator;
    $.event.special[Util.TRANSITION_END] = getSpecialTransitionEndEvent();
  }
  /**
   * --------------------------------------------------------------------------
   * Public Util Api
   * --------------------------------------------------------------------------
   */


  var Util = {
    TRANSITION_END: 'bsTransitionEnd',
    getUID: function getUID(prefix) {
      do {
        // eslint-disable-next-line no-bitwise
        prefix += ~~(Math.random() * MAX_UID); // "~~" acts like a faster Math.floor() here
      } while (document.getElementById(prefix));

      return prefix;
    },
    getSelectorFromElement: function getSelectorFromElement(element) {
      var selector = element.getAttribute('data-target');

      if (!selector || selector === '#') {
        var hrefAttr = element.getAttribute('href');
        selector = hrefAttr && hrefAttr !== '#' ? hrefAttr.trim() : '';
      }

      try {
        return document.querySelector(selector) ? selector : null;
      } catch (err) {
        return null;
      }
    },
    getTransitionDurationFromElement: function getTransitionDurationFromElement(element) {
      if (!element) {
        return 0;
      } // Get transition-duration of the element


      var transitionDuration = $(element).css('transition-duration');
      var transitionDelay = $(element).css('transition-delay');
      var floatTransitionDuration = parseFloat(transitionDuration);
      var floatTransitionDelay = parseFloat(transitionDelay); // Return 0 if element or transition duration is not found

      if (!floatTransitionDuration && !floatTransitionDelay) {
        return 0;
      } // If multiple durations are defined, take the first


      transitionDuration = transitionDuration.split(',')[0];
      transitionDelay = transitionDelay.split(',')[0];
      return (parseFloat(transitionDuration) + parseFloat(transitionDelay)) * MILLISECONDS_MULTIPLIER;
    },
    reflow: function reflow(element) {
      return element.offsetHeight;
    },
    triggerTransitionEnd: function triggerTransitionEnd(element) {
      $(element).trigger(TRANSITION_END);
    },
    // TODO: Remove in v5
    supportsTransitionEnd: function supportsTransitionEnd() {
      return Boolean(TRANSITION_END);
    },
    isElement: function isElement(obj) {
      return (obj[0] || obj).nodeType;
    },
    typeCheckConfig: function typeCheckConfig(componentName, config, configTypes) {
      for (var property in configTypes) {
        if (Object.prototype.hasOwnProperty.call(configTypes, property)) {
          var expectedTypes = configTypes[property];
          var value = config[property];
          var valueType = value && Util.isElement(value) ? 'element' : toType(value);

          if (!new RegExp(expectedTypes).test(valueType)) {
            throw new Error(componentName.toUpperCase() + ": " + ("Option \"" + property + "\" provided type \"" + valueType + "\" ") + ("but expected type \"" + expectedTypes + "\"."));
          }
        }
      }
    },
    findShadowRoot: function findShadowRoot(element) {
      if (!document.documentElement.attachShadow) {
        return null;
      } // Can find the shadow root otherwise it'll return the document


      if (typeof element.getRootNode === 'function') {
        var root = element.getRootNode();
        return root instanceof ShadowRoot ? root : null;
      }

      if (element instanceof ShadowRoot) {
        return element;
      } // when we don't find a shadow root


      if (!element.parentNode) {
        return null;
      }

      return Util.findShadowRoot(element.parentNode);
    }
  };
  setTransitionEndSupport();

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME = 'alert';
  var VERSION = '4.3.1';
  var DATA_KEY = 'bs.alert';
  var EVENT_KEY = "." + DATA_KEY;
  var DATA_API_KEY = '.data-api';
  var JQUERY_NO_CONFLICT = $.fn[NAME];
  var Selector = {
    DISMISS: '[data-dismiss="alert"]'
  };
  var Event = {
    CLOSE: "close" + EVENT_KEY,
    CLOSED: "closed" + EVENT_KEY,
    CLICK_DATA_API: "click" + EVENT_KEY + DATA_API_KEY
  };
  var ClassName = {
    ALERT: 'alert',
    FADE: 'fade',
    SHOW: 'show'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Alert =
  /*#__PURE__*/
  function () {
    function Alert(element) {
      this._element = element;
    } // Getters


    var _proto = Alert.prototype;

    // Public
    _proto.close = function close(element) {
      var rootElement = this._element;

      if (element) {
        rootElement = this._getRootElement(element);
      }

      var customEvent = this._triggerCloseEvent(rootElement);

      if (customEvent.isDefaultPrevented()) {
        return;
      }

      this._removeElement(rootElement);
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY);
      this._element = null;
    } // Private
    ;

    _proto._getRootElement = function _getRootElement(element) {
      var selector = Util.getSelectorFromElement(element);
      var parent = false;

      if (selector) {
        parent = document.querySelector(selector);
      }

      if (!parent) {
        parent = $(element).closest("." + ClassName.ALERT)[0];
      }

      return parent;
    };

    _proto._triggerCloseEvent = function _triggerCloseEvent(element) {
      var closeEvent = $.Event(Event.CLOSE);
      $(element).trigger(closeEvent);
      return closeEvent;
    };

    _proto._removeElement = function _removeElement(element) {
      var _this = this;

      $(element).removeClass(ClassName.SHOW);

      if (!$(element).hasClass(ClassName.FADE)) {
        this._destroyElement(element);

        return;
      }

      var transitionDuration = Util.getTransitionDurationFromElement(element);
      $(element).one(Util.TRANSITION_END, function (event) {
        return _this._destroyElement(element, event);
      }).emulateTransitionEnd(transitionDuration);
    };

    _proto._destroyElement = function _destroyElement(element) {
      $(element).detach().trigger(Event.CLOSED).remove();
    } // Static
    ;

    Alert._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY);

        if (!data) {
          data = new Alert(this);
          $element.data(DATA_KEY, data);
        }

        if (config === 'close') {
          data[config](this);
        }
      });
    };

    Alert._handleDismiss = function _handleDismiss(alertInstance) {
      return function (event) {
        if (event) {
          event.preventDefault();
        }

        alertInstance.close(this);
      };
    };

    _createClass(Alert, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION;
      }
    }]);

    return Alert;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event.CLICK_DATA_API, Selector.DISMISS, Alert._handleDismiss(new Alert()));
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME] = Alert._jQueryInterface;
  $.fn[NAME].Constructor = Alert;

  $.fn[NAME].noConflict = function () {
    $.fn[NAME] = JQUERY_NO_CONFLICT;
    return Alert._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$1 = 'button';
  var VERSION$1 = '4.3.1';
  var DATA_KEY$1 = 'bs.button';
  var EVENT_KEY$1 = "." + DATA_KEY$1;
  var DATA_API_KEY$1 = '.data-api';
  var JQUERY_NO_CONFLICT$1 = $.fn[NAME$1];
  var ClassName$1 = {
    ACTIVE: 'active',
    BUTTON: 'btn',
    FOCUS: 'focus'
  };
  var Selector$1 = {
    DATA_TOGGLE_CARROT: '[data-toggle^="button"]',
    DATA_TOGGLE: '[data-toggle="buttons"]',
    INPUT: 'input:not([type="hidden"])',
    ACTIVE: '.active',
    BUTTON: '.btn'
  };
  var Event$1 = {
    CLICK_DATA_API: "click" + EVENT_KEY$1 + DATA_API_KEY$1,
    FOCUS_BLUR_DATA_API: "focus" + EVENT_KEY$1 + DATA_API_KEY$1 + " " + ("blur" + EVENT_KEY$1 + DATA_API_KEY$1)
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Button =
  /*#__PURE__*/
  function () {
    function Button(element) {
      this._element = element;
    } // Getters


    var _proto = Button.prototype;

    // Public
    _proto.toggle = function toggle() {
      var triggerChangeEvent = true;
      var addAriaPressed = true;
      var rootElement = $(this._element).closest(Selector$1.DATA_TOGGLE)[0];

      if (rootElement) {
        var input = this._element.querySelector(Selector$1.INPUT);

        if (input) {
          if (input.type === 'radio') {
            if (input.checked && this._element.classList.contains(ClassName$1.ACTIVE)) {
              triggerChangeEvent = false;
            } else {
              var activeElement = rootElement.querySelector(Selector$1.ACTIVE);

              if (activeElement) {
                $(activeElement).removeClass(ClassName$1.ACTIVE);
              }
            }
          }

          if (triggerChangeEvent) {
            if (input.hasAttribute('disabled') || rootElement.hasAttribute('disabled') || input.classList.contains('disabled') || rootElement.classList.contains('disabled')) {
              return;
            }

            input.checked = !this._element.classList.contains(ClassName$1.ACTIVE);
            $(input).trigger('change');
          }

          input.focus();
          addAriaPressed = false;
        }
      }

      if (addAriaPressed) {
        this._element.setAttribute('aria-pressed', !this._element.classList.contains(ClassName$1.ACTIVE));
      }

      if (triggerChangeEvent) {
        $(this._element).toggleClass(ClassName$1.ACTIVE);
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$1);
      this._element = null;
    } // Static
    ;

    Button._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$1);

        if (!data) {
          data = new Button(this);
          $(this).data(DATA_KEY$1, data);
        }

        if (config === 'toggle') {
          data[config]();
        }
      });
    };

    _createClass(Button, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$1;
      }
    }]);

    return Button;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$1.CLICK_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    event.preventDefault();
    var button = event.target;

    if (!$(button).hasClass(ClassName$1.BUTTON)) {
      button = $(button).closest(Selector$1.BUTTON);
    }

    Button._jQueryInterface.call($(button), 'toggle');
  }).on(Event$1.FOCUS_BLUR_DATA_API, Selector$1.DATA_TOGGLE_CARROT, function (event) {
    var button = $(event.target).closest(Selector$1.BUTTON)[0];
    $(button).toggleClass(ClassName$1.FOCUS, /^focus(in)?$/.test(event.type));
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$1] = Button._jQueryInterface;
  $.fn[NAME$1].Constructor = Button;

  $.fn[NAME$1].noConflict = function () {
    $.fn[NAME$1] = JQUERY_NO_CONFLICT$1;
    return Button._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$2 = 'carousel';
  var VERSION$2 = '4.3.1';
  var DATA_KEY$2 = 'bs.carousel';
  var EVENT_KEY$2 = "." + DATA_KEY$2;
  var DATA_API_KEY$2 = '.data-api';
  var JQUERY_NO_CONFLICT$2 = $.fn[NAME$2];
  var ARROW_LEFT_KEYCODE = 37; // KeyboardEvent.which value for left arrow key

  var ARROW_RIGHT_KEYCODE = 39; // KeyboardEvent.which value for right arrow key

  var TOUCHEVENT_COMPAT_WAIT = 500; // Time for mouse compat events to fire after touch

  var SWIPE_THRESHOLD = 40;
  var Default = {
    interval: 5000,
    keyboard: true,
    slide: false,
    pause: 'hover',
    wrap: true,
    touch: true
  };
  var DefaultType = {
    interval: '(number|boolean)',
    keyboard: 'boolean',
    slide: '(boolean|string)',
    pause: '(string|boolean)',
    wrap: 'boolean',
    touch: 'boolean'
  };
  var Direction = {
    NEXT: 'next',
    PREV: 'prev',
    LEFT: 'left',
    RIGHT: 'right'
  };
  var Event$2 = {
    SLIDE: "slide" + EVENT_KEY$2,
    SLID: "slid" + EVENT_KEY$2,
    KEYDOWN: "keydown" + EVENT_KEY$2,
    MOUSEENTER: "mouseenter" + EVENT_KEY$2,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$2,
    TOUCHSTART: "touchstart" + EVENT_KEY$2,
    TOUCHMOVE: "touchmove" + EVENT_KEY$2,
    TOUCHEND: "touchend" + EVENT_KEY$2,
    POINTERDOWN: "pointerdown" + EVENT_KEY$2,
    POINTERUP: "pointerup" + EVENT_KEY$2,
    DRAG_START: "dragstart" + EVENT_KEY$2,
    LOAD_DATA_API: "load" + EVENT_KEY$2 + DATA_API_KEY$2,
    CLICK_DATA_API: "click" + EVENT_KEY$2 + DATA_API_KEY$2
  };
  var ClassName$2 = {
    CAROUSEL: 'carousel',
    ACTIVE: 'active',
    SLIDE: 'slide',
    RIGHT: 'carousel-item-right',
    LEFT: 'carousel-item-left',
    NEXT: 'carousel-item-next',
    PREV: 'carousel-item-prev',
    ITEM: 'carousel-item',
    POINTER_EVENT: 'pointer-event'
  };
  var Selector$2 = {
    ACTIVE: '.active',
    ACTIVE_ITEM: '.active.carousel-item',
    ITEM: '.carousel-item',
    ITEM_IMG: '.carousel-item img',
    NEXT_PREV: '.carousel-item-next, .carousel-item-prev',
    INDICATORS: '.carousel-indicators',
    DATA_SLIDE: '[data-slide], [data-slide-to]',
    DATA_RIDE: '[data-ride="carousel"]'
  };
  var PointerType = {
    TOUCH: 'touch',
    PEN: 'pen'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Carousel =
  /*#__PURE__*/
  function () {
    function Carousel(element, config) {
      this._items = null;
      this._interval = null;
      this._activeElement = null;
      this._isPaused = false;
      this._isSliding = false;
      this.touchTimeout = null;
      this.touchStartX = 0;
      this.touchDeltaX = 0;
      this._config = this._getConfig(config);
      this._element = element;
      this._indicatorsElement = this._element.querySelector(Selector$2.INDICATORS);
      this._touchSupported = 'ontouchstart' in document.documentElement || navigator.maxTouchPoints > 0;
      this._pointerEvent = Boolean(window.PointerEvent || window.MSPointerEvent);

      this._addEventListeners();
    } // Getters


    var _proto = Carousel.prototype;

    // Public
    _proto.next = function next() {
      if (!this._isSliding) {
        this._slide(Direction.NEXT);
      }
    };

    _proto.nextWhenVisible = function nextWhenVisible() {
      // Don't call next when the page isn't visible
      // or the carousel or its parent isn't visible
      if (!document.hidden && $(this._element).is(':visible') && $(this._element).css('visibility') !== 'hidden') {
        this.next();
      }
    };

    _proto.prev = function prev() {
      if (!this._isSliding) {
        this._slide(Direction.PREV);
      }
    };

    _proto.pause = function pause(event) {
      if (!event) {
        this._isPaused = true;
      }

      if (this._element.querySelector(Selector$2.NEXT_PREV)) {
        Util.triggerTransitionEnd(this._element);
        this.cycle(true);
      }

      clearInterval(this._interval);
      this._interval = null;
    };

    _proto.cycle = function cycle(event) {
      if (!event) {
        this._isPaused = false;
      }

      if (this._interval) {
        clearInterval(this._interval);
        this._interval = null;
      }

      if (this._config.interval && !this._isPaused) {
        this._interval = setInterval((document.visibilityState ? this.nextWhenVisible : this.next).bind(this), this._config.interval);
      }
    };

    _proto.to = function to(index) {
      var _this = this;

      this._activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeIndex = this._getItemIndex(this._activeElement);

      if (index > this._items.length - 1 || index < 0) {
        return;
      }

      if (this._isSliding) {
        $(this._element).one(Event$2.SLID, function () {
          return _this.to(index);
        });
        return;
      }

      if (activeIndex === index) {
        this.pause();
        this.cycle();
        return;
      }

      var direction = index > activeIndex ? Direction.NEXT : Direction.PREV;

      this._slide(direction, this._items[index]);
    };

    _proto.dispose = function dispose() {
      $(this._element).off(EVENT_KEY$2);
      $.removeData(this._element, DATA_KEY$2);
      this._items = null;
      this._config = null;
      this._element = null;
      this._interval = null;
      this._isPaused = null;
      this._isSliding = null;
      this._activeElement = null;
      this._indicatorsElement = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default, config);
      Util.typeCheckConfig(NAME$2, config, DefaultType);
      return config;
    };

    _proto._handleSwipe = function _handleSwipe() {
      var absDeltax = Math.abs(this.touchDeltaX);

      if (absDeltax <= SWIPE_THRESHOLD) {
        return;
      }

      var direction = absDeltax / this.touchDeltaX; // swipe left

      if (direction > 0) {
        this.prev();
      } // swipe right


      if (direction < 0) {
        this.next();
      }
    };

    _proto._addEventListeners = function _addEventListeners() {
      var _this2 = this;

      if (this._config.keyboard) {
        $(this._element).on(Event$2.KEYDOWN, function (event) {
          return _this2._keydown(event);
        });
      }

      if (this._config.pause === 'hover') {
        $(this._element).on(Event$2.MOUSEENTER, function (event) {
          return _this2.pause(event);
        }).on(Event$2.MOUSELEAVE, function (event) {
          return _this2.cycle(event);
        });
      }

      if (this._config.touch) {
        this._addTouchEventListeners();
      }
    };

    _proto._addTouchEventListeners = function _addTouchEventListeners() {
      var _this3 = this;

      if (!this._touchSupported) {
        return;
      }

      var start = function start(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchStartX = event.originalEvent.clientX;
        } else if (!_this3._pointerEvent) {
          _this3.touchStartX = event.originalEvent.touches[0].clientX;
        }
      };

      var move = function move(event) {
        // ensure swiping with one touch and not pinching
        if (event.originalEvent.touches && event.originalEvent.touches.length > 1) {
          _this3.touchDeltaX = 0;
        } else {
          _this3.touchDeltaX = event.originalEvent.touches[0].clientX - _this3.touchStartX;
        }
      };

      var end = function end(event) {
        if (_this3._pointerEvent && PointerType[event.originalEvent.pointerType.toUpperCase()]) {
          _this3.touchDeltaX = event.originalEvent.clientX - _this3.touchStartX;
        }

        _this3._handleSwipe();

        if (_this3._config.pause === 'hover') {
          // If it's a touch-enabled device, mouseenter/leave are fired as
          // part of the mouse compatibility events on first tap - the carousel
          // would stop cycling until user tapped out of it;
          // here, we listen for touchend, explicitly pause the carousel
          // (as if it's the second time we tap on it, mouseenter compat event
          // is NOT fired) and after a timeout (to allow for mouse compatibility
          // events to fire) we explicitly restart cycling
          _this3.pause();

          if (_this3.touchTimeout) {
            clearTimeout(_this3.touchTimeout);
          }

          _this3.touchTimeout = setTimeout(function (event) {
            return _this3.cycle(event);
          }, TOUCHEVENT_COMPAT_WAIT + _this3._config.interval);
        }
      };

      $(this._element.querySelectorAll(Selector$2.ITEM_IMG)).on(Event$2.DRAG_START, function (e) {
        return e.preventDefault();
      });

      if (this._pointerEvent) {
        $(this._element).on(Event$2.POINTERDOWN, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.POINTERUP, function (event) {
          return end(event);
        });

        this._element.classList.add(ClassName$2.POINTER_EVENT);
      } else {
        $(this._element).on(Event$2.TOUCHSTART, function (event) {
          return start(event);
        });
        $(this._element).on(Event$2.TOUCHMOVE, function (event) {
          return move(event);
        });
        $(this._element).on(Event$2.TOUCHEND, function (event) {
          return end(event);
        });
      }
    };

    _proto._keydown = function _keydown(event) {
      if (/input|textarea/i.test(event.target.tagName)) {
        return;
      }

      switch (event.which) {
        case ARROW_LEFT_KEYCODE:
          event.preventDefault();
          this.prev();
          break;

        case ARROW_RIGHT_KEYCODE:
          event.preventDefault();
          this.next();
          break;

        default:
      }
    };

    _proto._getItemIndex = function _getItemIndex(element) {
      this._items = element && element.parentNode ? [].slice.call(element.parentNode.querySelectorAll(Selector$2.ITEM)) : [];
      return this._items.indexOf(element);
    };

    _proto._getItemByDirection = function _getItemByDirection(direction, activeElement) {
      var isNextDirection = direction === Direction.NEXT;
      var isPrevDirection = direction === Direction.PREV;

      var activeIndex = this._getItemIndex(activeElement);

      var lastItemIndex = this._items.length - 1;
      var isGoingToWrap = isPrevDirection && activeIndex === 0 || isNextDirection && activeIndex === lastItemIndex;

      if (isGoingToWrap && !this._config.wrap) {
        return activeElement;
      }

      var delta = direction === Direction.PREV ? -1 : 1;
      var itemIndex = (activeIndex + delta) % this._items.length;
      return itemIndex === -1 ? this._items[this._items.length - 1] : this._items[itemIndex];
    };

    _proto._triggerSlideEvent = function _triggerSlideEvent(relatedTarget, eventDirectionName) {
      var targetIndex = this._getItemIndex(relatedTarget);

      var fromIndex = this._getItemIndex(this._element.querySelector(Selector$2.ACTIVE_ITEM));

      var slideEvent = $.Event(Event$2.SLIDE, {
        relatedTarget: relatedTarget,
        direction: eventDirectionName,
        from: fromIndex,
        to: targetIndex
      });
      $(this._element).trigger(slideEvent);
      return slideEvent;
    };

    _proto._setActiveIndicatorElement = function _setActiveIndicatorElement(element) {
      if (this._indicatorsElement) {
        var indicators = [].slice.call(this._indicatorsElement.querySelectorAll(Selector$2.ACTIVE));
        $(indicators).removeClass(ClassName$2.ACTIVE);

        var nextIndicator = this._indicatorsElement.children[this._getItemIndex(element)];

        if (nextIndicator) {
          $(nextIndicator).addClass(ClassName$2.ACTIVE);
        }
      }
    };

    _proto._slide = function _slide(direction, element) {
      var _this4 = this;

      var activeElement = this._element.querySelector(Selector$2.ACTIVE_ITEM);

      var activeElementIndex = this._getItemIndex(activeElement);

      var nextElement = element || activeElement && this._getItemByDirection(direction, activeElement);

      var nextElementIndex = this._getItemIndex(nextElement);

      var isCycling = Boolean(this._interval);
      var directionalClassName;
      var orderClassName;
      var eventDirectionName;

      if (direction === Direction.NEXT) {
        directionalClassName = ClassName$2.LEFT;
        orderClassName = ClassName$2.NEXT;
        eventDirectionName = Direction.LEFT;
      } else {
        directionalClassName = ClassName$2.RIGHT;
        orderClassName = ClassName$2.PREV;
        eventDirectionName = Direction.RIGHT;
      }

      if (nextElement && $(nextElement).hasClass(ClassName$2.ACTIVE)) {
        this._isSliding = false;
        return;
      }

      var slideEvent = this._triggerSlideEvent(nextElement, eventDirectionName);

      if (slideEvent.isDefaultPrevented()) {
        return;
      }

      if (!activeElement || !nextElement) {
        // Some weirdness is happening, so we bail
        return;
      }

      this._isSliding = true;

      if (isCycling) {
        this.pause();
      }

      this._setActiveIndicatorElement(nextElement);

      var slidEvent = $.Event(Event$2.SLID, {
        relatedTarget: nextElement,
        direction: eventDirectionName,
        from: activeElementIndex,
        to: nextElementIndex
      });

      if ($(this._element).hasClass(ClassName$2.SLIDE)) {
        $(nextElement).addClass(orderClassName);
        Util.reflow(nextElement);
        $(activeElement).addClass(directionalClassName);
        $(nextElement).addClass(directionalClassName);
        var nextElementInterval = parseInt(nextElement.getAttribute('data-interval'), 10);

        if (nextElementInterval) {
          this._config.defaultInterval = this._config.defaultInterval || this._config.interval;
          this._config.interval = nextElementInterval;
        } else {
          this._config.interval = this._config.defaultInterval || this._config.interval;
        }

        var transitionDuration = Util.getTransitionDurationFromElement(activeElement);
        $(activeElement).one(Util.TRANSITION_END, function () {
          $(nextElement).removeClass(directionalClassName + " " + orderClassName).addClass(ClassName$2.ACTIVE);
          $(activeElement).removeClass(ClassName$2.ACTIVE + " " + orderClassName + " " + directionalClassName);
          _this4._isSliding = false;
          setTimeout(function () {
            return $(_this4._element).trigger(slidEvent);
          }, 0);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        $(activeElement).removeClass(ClassName$2.ACTIVE);
        $(nextElement).addClass(ClassName$2.ACTIVE);
        this._isSliding = false;
        $(this._element).trigger(slidEvent);
      }

      if (isCycling) {
        this.cycle();
      }
    } // Static
    ;

    Carousel._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$2);

        var _config = _objectSpread({}, Default, $(this).data());

        if (typeof config === 'object') {
          _config = _objectSpread({}, _config, config);
        }

        var action = typeof config === 'string' ? config : _config.slide;

        if (!data) {
          data = new Carousel(this, _config);
          $(this).data(DATA_KEY$2, data);
        }

        if (typeof config === 'number') {
          data.to(config);
        } else if (typeof action === 'string') {
          if (typeof data[action] === 'undefined') {
            throw new TypeError("No method named \"" + action + "\"");
          }

          data[action]();
        } else if (_config.interval && _config.ride) {
          data.pause();
          data.cycle();
        }
      });
    };

    Carousel._dataApiClickHandler = function _dataApiClickHandler(event) {
      var selector = Util.getSelectorFromElement(this);

      if (!selector) {
        return;
      }

      var target = $(selector)[0];

      if (!target || !$(target).hasClass(ClassName$2.CAROUSEL)) {
        return;
      }

      var config = _objectSpread({}, $(target).data(), $(this).data());

      var slideIndex = this.getAttribute('data-slide-to');

      if (slideIndex) {
        config.interval = false;
      }

      Carousel._jQueryInterface.call($(target), config);

      if (slideIndex) {
        $(target).data(DATA_KEY$2).to(slideIndex);
      }

      event.preventDefault();
    };

    _createClass(Carousel, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$2;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default;
      }
    }]);

    return Carousel;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$2.CLICK_DATA_API, Selector$2.DATA_SLIDE, Carousel._dataApiClickHandler);
  $(window).on(Event$2.LOAD_DATA_API, function () {
    var carousels = [].slice.call(document.querySelectorAll(Selector$2.DATA_RIDE));

    for (var i = 0, len = carousels.length; i < len; i++) {
      var $carousel = $(carousels[i]);

      Carousel._jQueryInterface.call($carousel, $carousel.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$2] = Carousel._jQueryInterface;
  $.fn[NAME$2].Constructor = Carousel;

  $.fn[NAME$2].noConflict = function () {
    $.fn[NAME$2] = JQUERY_NO_CONFLICT$2;
    return Carousel._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$3 = 'collapse';
  var VERSION$3 = '4.3.1';
  var DATA_KEY$3 = 'bs.collapse';
  var EVENT_KEY$3 = "." + DATA_KEY$3;
  var DATA_API_KEY$3 = '.data-api';
  var JQUERY_NO_CONFLICT$3 = $.fn[NAME$3];
  var Default$1 = {
    toggle: true,
    parent: ''
  };
  var DefaultType$1 = {
    toggle: 'boolean',
    parent: '(string|element)'
  };
  var Event$3 = {
    SHOW: "show" + EVENT_KEY$3,
    SHOWN: "shown" + EVENT_KEY$3,
    HIDE: "hide" + EVENT_KEY$3,
    HIDDEN: "hidden" + EVENT_KEY$3,
    CLICK_DATA_API: "click" + EVENT_KEY$3 + DATA_API_KEY$3
  };
  var ClassName$3 = {
    SHOW: 'show',
    COLLAPSE: 'collapse',
    COLLAPSING: 'collapsing',
    COLLAPSED: 'collapsed'
  };
  var Dimension = {
    WIDTH: 'width',
    HEIGHT: 'height'
  };
  var Selector$3 = {
    ACTIVES: '.show, .collapsing',
    DATA_TOGGLE: '[data-toggle="collapse"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Collapse =
  /*#__PURE__*/
  function () {
    function Collapse(element, config) {
      var this$1 = this;

      this._isTransitioning = false;
      this._element = element;
      this._config = this._getConfig(config);
      this._triggerArray = [].slice.call(document.querySelectorAll("[data-toggle=\"collapse\"][href=\"#" + element.id + "\"]," + ("[data-toggle=\"collapse\"][data-target=\"#" + element.id + "\"]")));
      var toggleList = [].slice.call(document.querySelectorAll(Selector$3.DATA_TOGGLE));

      for (var i = 0, len = toggleList.length; i < len; i++) {
        var elem = toggleList[i];
        var selector = Util.getSelectorFromElement(elem);
        var filterElement = [].slice.call(document.querySelectorAll(selector)).filter(function (foundElem) {
          return foundElem === element;
        });

        if (selector !== null && filterElement.length > 0) {
          this$1._selector = selector;

          this$1._triggerArray.push(elem);
        }
      }

      this._parent = this._config.parent ? this._getParent() : null;

      if (!this._config.parent) {
        this._addAriaAndCollapsedClass(this._element, this._triggerArray);
      }

      if (this._config.toggle) {
        this.toggle();
      }
    } // Getters


    var _proto = Collapse.prototype;

    // Public
    _proto.toggle = function toggle() {
      if ($(this._element).hasClass(ClassName$3.SHOW)) {
        this.hide();
      } else {
        this.show();
      }
    };

    _proto.show = function show() {
      var _this = this;

      if (this._isTransitioning || $(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var actives;
      var activesData;

      if (this._parent) {
        actives = [].slice.call(this._parent.querySelectorAll(Selector$3.ACTIVES)).filter(function (elem) {
          if (typeof _this._config.parent === 'string') {
            return elem.getAttribute('data-parent') === _this._config.parent;
          }

          return elem.classList.contains(ClassName$3.COLLAPSE);
        });

        if (actives.length === 0) {
          actives = null;
        }
      }

      if (actives) {
        activesData = $(actives).not(this._selector).data(DATA_KEY$3);

        if (activesData && activesData._isTransitioning) {
          return;
        }
      }

      var startEvent = $.Event(Event$3.SHOW);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      if (actives) {
        Collapse._jQueryInterface.call($(actives).not(this._selector), 'hide');

        if (!activesData) {
          $(actives).data(DATA_KEY$3, null);
        }
      }

      var dimension = this._getDimension();

      $(this._element).removeClass(ClassName$3.COLLAPSE).addClass(ClassName$3.COLLAPSING);
      this._element.style[dimension] = 0;

      if (this._triggerArray.length) {
        $(this._triggerArray).removeClass(ClassName$3.COLLAPSED).attr('aria-expanded', true);
      }

      this.setTransitioning(true);

      var complete = function complete() {
        $(_this._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).addClass(ClassName$3.SHOW);
        _this._element.style[dimension] = '';

        _this.setTransitioning(false);

        $(_this._element).trigger(Event$3.SHOWN);
      };

      var capitalizedDimension = dimension[0].toUpperCase() + dimension.slice(1);
      var scrollSize = "scroll" + capitalizedDimension;
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      this._element.style[dimension] = this._element[scrollSize] + "px";
    };

    _proto.hide = function hide() {
      var this$1 = this;

      var _this2 = this;

      if (this._isTransitioning || !$(this._element).hasClass(ClassName$3.SHOW)) {
        return;
      }

      var startEvent = $.Event(Event$3.HIDE);
      $(this._element).trigger(startEvent);

      if (startEvent.isDefaultPrevented()) {
        return;
      }

      var dimension = this._getDimension();

      this._element.style[dimension] = this._element.getBoundingClientRect()[dimension] + "px";
      Util.reflow(this._element);
      $(this._element).addClass(ClassName$3.COLLAPSING).removeClass(ClassName$3.COLLAPSE).removeClass(ClassName$3.SHOW);
      var triggerArrayLength = this._triggerArray.length;

      if (triggerArrayLength > 0) {
        for (var i = 0; i < triggerArrayLength; i++) {
          var trigger = this$1._triggerArray[i];
          var selector = Util.getSelectorFromElement(trigger);

          if (selector !== null) {
            var $elem = $([].slice.call(document.querySelectorAll(selector)));

            if (!$elem.hasClass(ClassName$3.SHOW)) {
              $(trigger).addClass(ClassName$3.COLLAPSED).attr('aria-expanded', false);
            }
          }
        }
      }

      this.setTransitioning(true);

      var complete = function complete() {
        _this2.setTransitioning(false);

        $(_this2._element).removeClass(ClassName$3.COLLAPSING).addClass(ClassName$3.COLLAPSE).trigger(Event$3.HIDDEN);
      };

      this._element.style[dimension] = '';
      var transitionDuration = Util.getTransitionDurationFromElement(this._element);
      $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
    };

    _proto.setTransitioning = function setTransitioning(isTransitioning) {
      this._isTransitioning = isTransitioning;
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$3);
      this._config = null;
      this._parent = null;
      this._element = null;
      this._triggerArray = null;
      this._isTransitioning = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$1, config);
      config.toggle = Boolean(config.toggle); // Coerce string values

      Util.typeCheckConfig(NAME$3, config, DefaultType$1);
      return config;
    };

    _proto._getDimension = function _getDimension() {
      var hasWidth = $(this._element).hasClass(Dimension.WIDTH);
      return hasWidth ? Dimension.WIDTH : Dimension.HEIGHT;
    };

    _proto._getParent = function _getParent() {
      var _this3 = this;

      var parent;

      if (Util.isElement(this._config.parent)) {
        parent = this._config.parent; // It's a jQuery object

        if (typeof this._config.parent.jquery !== 'undefined') {
          parent = this._config.parent[0];
        }
      } else {
        parent = document.querySelector(this._config.parent);
      }

      var selector = "[data-toggle=\"collapse\"][data-parent=\"" + this._config.parent + "\"]";
      var children = [].slice.call(parent.querySelectorAll(selector));
      $(children).each(function (i, element) {
        _this3._addAriaAndCollapsedClass(Collapse._getTargetFromElement(element), [element]);
      });
      return parent;
    };

    _proto._addAriaAndCollapsedClass = function _addAriaAndCollapsedClass(element, triggerArray) {
      var isOpen = $(element).hasClass(ClassName$3.SHOW);

      if (triggerArray.length) {
        $(triggerArray).toggleClass(ClassName$3.COLLAPSED, !isOpen).attr('aria-expanded', isOpen);
      }
    } // Static
    ;

    Collapse._getTargetFromElement = function _getTargetFromElement(element) {
      var selector = Util.getSelectorFromElement(element);
      return selector ? document.querySelector(selector) : null;
    };

    Collapse._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$3);

        var _config = _objectSpread({}, Default$1, $this.data(), typeof config === 'object' && config ? config : {});

        if (!data && _config.toggle && /show|hide/.test(config)) {
          _config.toggle = false;
        }

        if (!data) {
          data = new Collapse(this, _config);
          $this.data(DATA_KEY$3, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Collapse, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$3;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$1;
      }
    }]);

    return Collapse;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$3.CLICK_DATA_API, Selector$3.DATA_TOGGLE, function (event) {
    // preventDefault only for <a> elements (which change the URL) not inside the collapsible element
    if (event.currentTarget.tagName === 'A') {
      event.preventDefault();
    }

    var $trigger = $(this);
    var selector = Util.getSelectorFromElement(this);
    var selectors = [].slice.call(document.querySelectorAll(selector));
    $(selectors).each(function () {
      var $target = $(this);
      var data = $target.data(DATA_KEY$3);
      var config = data ? 'toggle' : $trigger.data();

      Collapse._jQueryInterface.call($target, config);
    });
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$3] = Collapse._jQueryInterface;
  $.fn[NAME$3].Constructor = Collapse;

  $.fn[NAME$3].noConflict = function () {
    $.fn[NAME$3] = JQUERY_NO_CONFLICT$3;
    return Collapse._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$4 = 'dropdown';
  var VERSION$4 = '4.3.1';
  var DATA_KEY$4 = 'bs.dropdown';
  var EVENT_KEY$4 = "." + DATA_KEY$4;
  var DATA_API_KEY$4 = '.data-api';
  var JQUERY_NO_CONFLICT$4 = $.fn[NAME$4];
  var ESCAPE_KEYCODE = 27; // KeyboardEvent.which value for Escape (Esc) key

  var SPACE_KEYCODE = 32; // KeyboardEvent.which value for space key

  var TAB_KEYCODE = 9; // KeyboardEvent.which value for tab key

  var ARROW_UP_KEYCODE = 38; // KeyboardEvent.which value for up arrow key

  var ARROW_DOWN_KEYCODE = 40; // KeyboardEvent.which value for down arrow key

  var RIGHT_MOUSE_BUTTON_WHICH = 3; // MouseEvent.which value for the right button (assuming a right-handed mouse)

  var REGEXP_KEYDOWN = new RegExp(ARROW_UP_KEYCODE + "|" + ARROW_DOWN_KEYCODE + "|" + ESCAPE_KEYCODE);
  var Event$4 = {
    HIDE: "hide" + EVENT_KEY$4,
    HIDDEN: "hidden" + EVENT_KEY$4,
    SHOW: "show" + EVENT_KEY$4,
    SHOWN: "shown" + EVENT_KEY$4,
    CLICK: "click" + EVENT_KEY$4,
    CLICK_DATA_API: "click" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYDOWN_DATA_API: "keydown" + EVENT_KEY$4 + DATA_API_KEY$4,
    KEYUP_DATA_API: "keyup" + EVENT_KEY$4 + DATA_API_KEY$4
  };
  var ClassName$4 = {
    DISABLED: 'disabled',
    SHOW: 'show',
    DROPUP: 'dropup',
    DROPRIGHT: 'dropright',
    DROPLEFT: 'dropleft',
    MENURIGHT: 'dropdown-menu-right',
    MENULEFT: 'dropdown-menu-left',
    POSITION_STATIC: 'position-static'
  };
  var Selector$4 = {
    DATA_TOGGLE: '[data-toggle="dropdown"]',
    FORM_CHILD: '.dropdown form',
    MENU: '.dropdown-menu',
    NAVBAR_NAV: '.navbar-nav',
    VISIBLE_ITEMS: '.dropdown-menu .dropdown-item:not(.disabled):not(:disabled)'
  };
  var AttachmentMap = {
    TOP: 'top-start',
    TOPEND: 'top-end',
    BOTTOM: 'bottom-start',
    BOTTOMEND: 'bottom-end',
    RIGHT: 'right-start',
    RIGHTEND: 'right-end',
    LEFT: 'left-start',
    LEFTEND: 'left-end'
  };
  var Default$2 = {
    offset: 0,
    flip: true,
    boundary: 'scrollParent',
    reference: 'toggle',
    display: 'dynamic'
  };
  var DefaultType$2 = {
    offset: '(number|string|function)',
    flip: 'boolean',
    boundary: '(string|element)',
    reference: '(string|element)',
    display: 'string'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Dropdown =
  /*#__PURE__*/
  function () {
    function Dropdown(element, config) {
      this._element = element;
      this._popper = null;
      this._config = this._getConfig(config);
      this._menu = this._getMenuElement();
      this._inNavbar = this._detectNavbar();

      this._addEventListeners();
    } // Getters


    var _proto = Dropdown.prototype;

    // Public
    _proto.toggle = function toggle() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this._element);

      var isActive = $(this._menu).hasClass(ClassName$4.SHOW);

      Dropdown._clearMenus();

      if (isActive) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);
      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      } // Disable totally Popper.js for Dropdown in Navbar


      if (!this._inNavbar) {
        /**
         * Check for Popper dependency
         * Popper - https://popper.js.org
         */
        if (typeof Popper === 'undefined') {
          throw new TypeError('Bootstrap\'s dropdowns require Popper.js (https://popper.js.org/)');
        }

        var referenceElement = this._element;

        if (this._config.reference === 'parent') {
          referenceElement = parent;
        } else if (Util.isElement(this._config.reference)) {
          referenceElement = this._config.reference; // Check if it's jQuery element

          if (typeof this._config.reference.jquery !== 'undefined') {
            referenceElement = this._config.reference[0];
          }
        } // If boundary is not `scrollParent`, then set position to `static`
        // to allow the menu to "escape" the scroll parent's boundaries
        // https://github.com/twbs/bootstrap/issues/24251


        if (this._config.boundary !== 'scrollParent') {
          $(parent).addClass(ClassName$4.POSITION_STATIC);
        }

        this._popper = new Popper(referenceElement, this._menu, this._getPopperConfig());
      } // If this is a touch-enabled device we add extra
      // empty mouseover listeners to the body's immediate children;
      // only needed because of broken event delegation on iOS
      // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html


      if ('ontouchstart' in document.documentElement && $(parent).closest(Selector$4.NAVBAR_NAV).length === 0) {
        $(document.body).children().on('mouseover', null, $.noop);
      }

      this._element.focus();

      this._element.setAttribute('aria-expanded', true);

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.show = function show() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || $(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var showEvent = $.Event(Event$4.SHOW, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(showEvent);

      if (showEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.SHOWN, relatedTarget));
    };

    _proto.hide = function hide() {
      if (this._element.disabled || $(this._element).hasClass(ClassName$4.DISABLED) || !$(this._menu).hasClass(ClassName$4.SHOW)) {
        return;
      }

      var relatedTarget = {
        relatedTarget: this._element
      };
      var hideEvent = $.Event(Event$4.HIDE, relatedTarget);

      var parent = Dropdown._getParentFromElement(this._element);

      $(parent).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(this._menu).toggleClass(ClassName$4.SHOW);
      $(parent).toggleClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$4);
      $(this._element).off(EVENT_KEY$4);
      this._element = null;
      this._menu = null;

      if (this._popper !== null) {
        this._popper.destroy();

        this._popper = null;
      }
    };

    _proto.update = function update() {
      this._inNavbar = this._detectNavbar();

      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Private
    ;

    _proto._addEventListeners = function _addEventListeners() {
      var _this = this;

      $(this._element).on(Event$4.CLICK, function (event) {
        event.preventDefault();
        event.stopPropagation();

        _this.toggle();
      });
    };

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, this.constructor.Default, $(this._element).data(), config);
      Util.typeCheckConfig(NAME$4, config, this.constructor.DefaultType);
      return config;
    };

    _proto._getMenuElement = function _getMenuElement() {
      if (!this._menu) {
        var parent = Dropdown._getParentFromElement(this._element);

        if (parent) {
          this._menu = parent.querySelector(Selector$4.MENU);
        }
      }

      return this._menu;
    };

    _proto._getPlacement = function _getPlacement() {
      var $parentDropdown = $(this._element.parentNode);
      var placement = AttachmentMap.BOTTOM; // Handle dropup

      if ($parentDropdown.hasClass(ClassName$4.DROPUP)) {
        placement = AttachmentMap.TOP;

        if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
          placement = AttachmentMap.TOPEND;
        }
      } else if ($parentDropdown.hasClass(ClassName$4.DROPRIGHT)) {
        placement = AttachmentMap.RIGHT;
      } else if ($parentDropdown.hasClass(ClassName$4.DROPLEFT)) {
        placement = AttachmentMap.LEFT;
      } else if ($(this._menu).hasClass(ClassName$4.MENURIGHT)) {
        placement = AttachmentMap.BOTTOMEND;
      }

      return placement;
    };

    _proto._detectNavbar = function _detectNavbar() {
      return $(this._element).closest('.navbar').length > 0;
    };

    _proto._getOffset = function _getOffset() {
      var _this2 = this;

      var offset = {};

      if (typeof this._config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this2._config.offset(data.offsets, _this2._element) || {});
          return data;
        };
      } else {
        offset.offset = this._config.offset;
      }

      return offset;
    };

    _proto._getPopperConfig = function _getPopperConfig() {
      var popperConfig = {
        placement: this._getPlacement(),
        modifiers: {
          offset: this._getOffset(),
          flip: {
            enabled: this._config.flip
          },
          preventOverflow: {
            boundariesElement: this._config.boundary
          }
        } // Disable Popper.js if we have a static display

      };

      if (this._config.display === 'static') {
        popperConfig.modifiers.applyStyle = {
          enabled: false
        };
      }

      return popperConfig;
    } // Static
    ;

    Dropdown._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$4);

        var _config = typeof config === 'object' ? config : null;

        if (!data) {
          data = new Dropdown(this, _config);
          $(this).data(DATA_KEY$4, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    Dropdown._clearMenus = function _clearMenus(event) {
      if (event && (event.which === RIGHT_MOUSE_BUTTON_WHICH || event.type === 'keyup' && event.which !== TAB_KEYCODE)) {
        return;
      }

      var toggles = [].slice.call(document.querySelectorAll(Selector$4.DATA_TOGGLE));

      for (var i = 0, len = toggles.length; i < len; i++) {
        var parent = Dropdown._getParentFromElement(toggles[i]);

        var context = $(toggles[i]).data(DATA_KEY$4);
        var relatedTarget = {
          relatedTarget: toggles[i]
        };

        if (event && event.type === 'click') {
          relatedTarget.clickEvent = event;
        }

        if (!context) {
          continue;
        }

        var dropdownMenu = context._menu;

        if (!$(parent).hasClass(ClassName$4.SHOW)) {
          continue;
        }

        if (event && (event.type === 'click' && /input|textarea/i.test(event.target.tagName) || event.type === 'keyup' && event.which === TAB_KEYCODE) && $.contains(parent, event.target)) {
          continue;
        }

        var hideEvent = $.Event(Event$4.HIDE, relatedTarget);
        $(parent).trigger(hideEvent);

        if (hideEvent.isDefaultPrevented()) {
          continue;
        } // If this is a touch-enabled device we remove the extra
        // empty mouseover listeners we added for iOS support


        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().off('mouseover', null, $.noop);
        }

        toggles[i].setAttribute('aria-expanded', 'false');
        $(dropdownMenu).removeClass(ClassName$4.SHOW);
        $(parent).removeClass(ClassName$4.SHOW).trigger($.Event(Event$4.HIDDEN, relatedTarget));
      }
    };

    Dropdown._getParentFromElement = function _getParentFromElement(element) {
      var parent;
      var selector = Util.getSelectorFromElement(element);

      if (selector) {
        parent = document.querySelector(selector);
      }

      return parent || element.parentNode;
    } // eslint-disable-next-line complexity
    ;

    Dropdown._dataApiKeydownHandler = function _dataApiKeydownHandler(event) {
      // If not input/textarea:
      //  - And not a key in REGEXP_KEYDOWN => not a dropdown command
      // If input/textarea:
      //  - If space key => not a dropdown command
      //  - If key is other than escape
      //    - If key is not up or down => not a dropdown command
      //    - If trigger inside the menu => not a dropdown command
      if (/input|textarea/i.test(event.target.tagName) ? event.which === SPACE_KEYCODE || event.which !== ESCAPE_KEYCODE && (event.which !== ARROW_DOWN_KEYCODE && event.which !== ARROW_UP_KEYCODE || $(event.target).closest(Selector$4.MENU).length) : !REGEXP_KEYDOWN.test(event.which)) {
        return;
      }

      event.preventDefault();
      event.stopPropagation();

      if (this.disabled || $(this).hasClass(ClassName$4.DISABLED)) {
        return;
      }

      var parent = Dropdown._getParentFromElement(this);

      var isActive = $(parent).hasClass(ClassName$4.SHOW);

      if (!isActive || isActive && (event.which === ESCAPE_KEYCODE || event.which === SPACE_KEYCODE)) {
        if (event.which === ESCAPE_KEYCODE) {
          var toggle = parent.querySelector(Selector$4.DATA_TOGGLE);
          $(toggle).trigger('focus');
        }

        $(this).trigger('click');
        return;
      }

      var items = [].slice.call(parent.querySelectorAll(Selector$4.VISIBLE_ITEMS));

      if (items.length === 0) {
        return;
      }

      var index = items.indexOf(event.target);

      if (event.which === ARROW_UP_KEYCODE && index > 0) {
        // Up
        index--;
      }

      if (event.which === ARROW_DOWN_KEYCODE && index < items.length - 1) {
        // Down
        index++;
      }

      if (index < 0) {
        index = 0;
      }

      items[index].focus();
    };

    _createClass(Dropdown, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$4;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$2;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$2;
      }
    }]);

    return Dropdown;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$4.KEYDOWN_DATA_API, Selector$4.DATA_TOGGLE, Dropdown._dataApiKeydownHandler).on(Event$4.KEYDOWN_DATA_API, Selector$4.MENU, Dropdown._dataApiKeydownHandler).on(Event$4.CLICK_DATA_API + " " + Event$4.KEYUP_DATA_API, Dropdown._clearMenus).on(Event$4.CLICK_DATA_API, Selector$4.DATA_TOGGLE, function (event) {
    event.preventDefault();
    event.stopPropagation();

    Dropdown._jQueryInterface.call($(this), 'toggle');
  }).on(Event$4.CLICK_DATA_API, Selector$4.FORM_CHILD, function (e) {
    e.stopPropagation();
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$4] = Dropdown._jQueryInterface;
  $.fn[NAME$4].Constructor = Dropdown;

  $.fn[NAME$4].noConflict = function () {
    $.fn[NAME$4] = JQUERY_NO_CONFLICT$4;
    return Dropdown._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$5 = 'modal';
  var VERSION$5 = '4.3.1';
  var DATA_KEY$5 = 'bs.modal';
  var EVENT_KEY$5 = "." + DATA_KEY$5;
  var DATA_API_KEY$5 = '.data-api';
  var JQUERY_NO_CONFLICT$5 = $.fn[NAME$5];
  var ESCAPE_KEYCODE$1 = 27; // KeyboardEvent.which value for Escape (Esc) key

  var Default$3 = {
    backdrop: true,
    keyboard: true,
    focus: true,
    show: true
  };
  var DefaultType$3 = {
    backdrop: '(boolean|string)',
    keyboard: 'boolean',
    focus: 'boolean',
    show: 'boolean'
  };
  var Event$5 = {
    HIDE: "hide" + EVENT_KEY$5,
    HIDDEN: "hidden" + EVENT_KEY$5,
    SHOW: "show" + EVENT_KEY$5,
    SHOWN: "shown" + EVENT_KEY$5,
    FOCUSIN: "focusin" + EVENT_KEY$5,
    RESIZE: "resize" + EVENT_KEY$5,
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$5,
    KEYDOWN_DISMISS: "keydown.dismiss" + EVENT_KEY$5,
    MOUSEUP_DISMISS: "mouseup.dismiss" + EVENT_KEY$5,
    MOUSEDOWN_DISMISS: "mousedown.dismiss" + EVENT_KEY$5,
    CLICK_DATA_API: "click" + EVENT_KEY$5 + DATA_API_KEY$5
  };
  var ClassName$5 = {
    SCROLLABLE: 'modal-dialog-scrollable',
    SCROLLBAR_MEASURER: 'modal-scrollbar-measure',
    BACKDROP: 'modal-backdrop',
    OPEN: 'modal-open',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$5 = {
    DIALOG: '.modal-dialog',
    MODAL_BODY: '.modal-body',
    DATA_TOGGLE: '[data-toggle="modal"]',
    DATA_DISMISS: '[data-dismiss="modal"]',
    FIXED_CONTENT: '.fixed-top, .fixed-bottom, .is-fixed, .sticky-top',
    STICKY_CONTENT: '.sticky-top'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Modal =
  /*#__PURE__*/
  function () {
    function Modal(element, config) {
      this._config = this._getConfig(config);
      this._element = element;
      this._dialog = element.querySelector(Selector$5.DIALOG);
      this._backdrop = null;
      this._isShown = false;
      this._isBodyOverflowing = false;
      this._ignoreBackdropClick = false;
      this._isTransitioning = false;
      this._scrollbarWidth = 0;
    } // Getters


    var _proto = Modal.prototype;

    // Public
    _proto.toggle = function toggle(relatedTarget) {
      return this._isShown ? this.hide() : this.show(relatedTarget);
    };

    _proto.show = function show(relatedTarget) {
      var _this = this;

      if (this._isShown || this._isTransitioning) {
        return;
      }

      if ($(this._element).hasClass(ClassName$5.FADE)) {
        this._isTransitioning = true;
      }

      var showEvent = $.Event(Event$5.SHOW, {
        relatedTarget: relatedTarget
      });
      $(this._element).trigger(showEvent);

      if (this._isShown || showEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = true;

      this._checkScrollbar();

      this._setScrollbar();

      this._adjustDialog();

      this._setEscapeEvent();

      this._setResizeEvent();

      $(this._element).on(Event$5.CLICK_DISMISS, Selector$5.DATA_DISMISS, function (event) {
        return _this.hide(event);
      });
      $(this._dialog).on(Event$5.MOUSEDOWN_DISMISS, function () {
        $(_this._element).one(Event$5.MOUSEUP_DISMISS, function (event) {
          if ($(event.target).is(_this._element)) {
            _this._ignoreBackdropClick = true;
          }
        });
      });

      this._showBackdrop(function () {
        return _this._showElement(relatedTarget);
      });
    };

    _proto.hide = function hide(event) {
      var _this2 = this;

      if (event) {
        event.preventDefault();
      }

      if (!this._isShown || this._isTransitioning) {
        return;
      }

      var hideEvent = $.Event(Event$5.HIDE);
      $(this._element).trigger(hideEvent);

      if (!this._isShown || hideEvent.isDefaultPrevented()) {
        return;
      }

      this._isShown = false;
      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (transition) {
        this._isTransitioning = true;
      }

      this._setEscapeEvent();

      this._setResizeEvent();

      $(document).off(Event$5.FOCUSIN);
      $(this._element).removeClass(ClassName$5.SHOW);
      $(this._element).off(Event$5.CLICK_DISMISS);
      $(this._dialog).off(Event$5.MOUSEDOWN_DISMISS);

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, function (event) {
          return _this2._hideModal(event);
        }).emulateTransitionEnd(transitionDuration);
      } else {
        this._hideModal();
      }
    };

    _proto.dispose = function dispose() {
      [window, this._element, this._dialog].forEach(function (htmlElement) {
        return $(htmlElement).off(EVENT_KEY$5);
      });
      /**
       * `document` has 2 events `Event.FOCUSIN` and `Event.CLICK_DATA_API`
       * Do not move `document` in `htmlElements` array
       * It will remove `Event.CLICK_DATA_API` event that should remain
       */

      $(document).off(Event$5.FOCUSIN);
      $.removeData(this._element, DATA_KEY$5);
      this._config = null;
      this._element = null;
      this._dialog = null;
      this._backdrop = null;
      this._isShown = null;
      this._isBodyOverflowing = null;
      this._ignoreBackdropClick = null;
      this._isTransitioning = null;
      this._scrollbarWidth = null;
    };

    _proto.handleUpdate = function handleUpdate() {
      this._adjustDialog();
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$3, config);
      Util.typeCheckConfig(NAME$5, config, DefaultType$3);
      return config;
    };

    _proto._showElement = function _showElement(relatedTarget) {
      var _this3 = this;

      var transition = $(this._element).hasClass(ClassName$5.FADE);

      if (!this._element.parentNode || this._element.parentNode.nodeType !== Node.ELEMENT_NODE) {
        // Don't move modal's DOM position
        document.body.appendChild(this._element);
      }

      this._element.style.display = 'block';

      this._element.removeAttribute('aria-hidden');

      this._element.setAttribute('aria-modal', true);

      if ($(this._dialog).hasClass(ClassName$5.SCROLLABLE)) {
        this._dialog.querySelector(Selector$5.MODAL_BODY).scrollTop = 0;
      } else {
        this._element.scrollTop = 0;
      }

      if (transition) {
        Util.reflow(this._element);
      }

      $(this._element).addClass(ClassName$5.SHOW);

      if (this._config.focus) {
        this._enforceFocus();
      }

      var shownEvent = $.Event(Event$5.SHOWN, {
        relatedTarget: relatedTarget
      });

      var transitionComplete = function transitionComplete() {
        if (_this3._config.focus) {
          _this3._element.focus();
        }

        _this3._isTransitioning = false;
        $(_this3._element).trigger(shownEvent);
      };

      if (transition) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._dialog);
        $(this._dialog).one(Util.TRANSITION_END, transitionComplete).emulateTransitionEnd(transitionDuration);
      } else {
        transitionComplete();
      }
    };

    _proto._enforceFocus = function _enforceFocus() {
      var _this4 = this;

      $(document).off(Event$5.FOCUSIN) // Guard against infinite focus loop
      .on(Event$5.FOCUSIN, function (event) {
        if (document !== event.target && _this4._element !== event.target && $(_this4._element).has(event.target).length === 0) {
          _this4._element.focus();
        }
      });
    };

    _proto._setEscapeEvent = function _setEscapeEvent() {
      var _this5 = this;

      if (this._isShown && this._config.keyboard) {
        $(this._element).on(Event$5.KEYDOWN_DISMISS, function (event) {
          if (event.which === ESCAPE_KEYCODE$1) {
            event.preventDefault();

            _this5.hide();
          }
        });
      } else if (!this._isShown) {
        $(this._element).off(Event$5.KEYDOWN_DISMISS);
      }
    };

    _proto._setResizeEvent = function _setResizeEvent() {
      var _this6 = this;

      if (this._isShown) {
        $(window).on(Event$5.RESIZE, function (event) {
          return _this6.handleUpdate(event);
        });
      } else {
        $(window).off(Event$5.RESIZE);
      }
    };

    _proto._hideModal = function _hideModal() {
      var _this7 = this;

      this._element.style.display = 'none';

      this._element.setAttribute('aria-hidden', true);

      this._element.removeAttribute('aria-modal');

      this._isTransitioning = false;

      this._showBackdrop(function () {
        $(document.body).removeClass(ClassName$5.OPEN);

        _this7._resetAdjustments();

        _this7._resetScrollbar();

        $(_this7._element).trigger(Event$5.HIDDEN);
      });
    };

    _proto._removeBackdrop = function _removeBackdrop() {
      if (this._backdrop) {
        $(this._backdrop).remove();
        this._backdrop = null;
      }
    };

    _proto._showBackdrop = function _showBackdrop(callback) {
      var _this8 = this;

      var animate = $(this._element).hasClass(ClassName$5.FADE) ? ClassName$5.FADE : '';

      if (this._isShown && this._config.backdrop) {
        this._backdrop = document.createElement('div');
        this._backdrop.className = ClassName$5.BACKDROP;

        if (animate) {
          this._backdrop.classList.add(animate);
        }

        $(this._backdrop).appendTo(document.body);
        $(this._element).on(Event$5.CLICK_DISMISS, function (event) {
          if (_this8._ignoreBackdropClick) {
            _this8._ignoreBackdropClick = false;
            return;
          }

          if (event.target !== event.currentTarget) {
            return;
          }

          if (_this8._config.backdrop === 'static') {
            _this8._element.focus();
          } else {
            _this8.hide();
          }
        });

        if (animate) {
          Util.reflow(this._backdrop);
        }

        $(this._backdrop).addClass(ClassName$5.SHOW);

        if (!callback) {
          return;
        }

        if (!animate) {
          callback();
          return;
        }

        var backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);
        $(this._backdrop).one(Util.TRANSITION_END, callback).emulateTransitionEnd(backdropTransitionDuration);
      } else if (!this._isShown && this._backdrop) {
        $(this._backdrop).removeClass(ClassName$5.SHOW);

        var callbackRemove = function callbackRemove() {
          _this8._removeBackdrop();

          if (callback) {
            callback();
          }
        };

        if ($(this._element).hasClass(ClassName$5.FADE)) {
          var _backdropTransitionDuration = Util.getTransitionDurationFromElement(this._backdrop);

          $(this._backdrop).one(Util.TRANSITION_END, callbackRemove).emulateTransitionEnd(_backdropTransitionDuration);
        } else {
          callbackRemove();
        }
      } else if (callback) {
        callback();
      }
    } // ----------------------------------------------------------------------
    // the following methods are used to handle overflowing modals
    // todo (fat): these should probably be refactored out of modal.js
    // ----------------------------------------------------------------------
    ;

    _proto._adjustDialog = function _adjustDialog() {
      var isModalOverflowing = this._element.scrollHeight > document.documentElement.clientHeight;

      if (!this._isBodyOverflowing && isModalOverflowing) {
        this._element.style.paddingLeft = this._scrollbarWidth + "px";
      }

      if (this._isBodyOverflowing && !isModalOverflowing) {
        this._element.style.paddingRight = this._scrollbarWidth + "px";
      }
    };

    _proto._resetAdjustments = function _resetAdjustments() {
      this._element.style.paddingLeft = '';
      this._element.style.paddingRight = '';
    };

    _proto._checkScrollbar = function _checkScrollbar() {
      var rect = document.body.getBoundingClientRect();
      this._isBodyOverflowing = rect.left + rect.right < window.innerWidth;
      this._scrollbarWidth = this._getScrollbarWidth();
    };

    _proto._setScrollbar = function _setScrollbar() {
      var _this9 = this;

      if (this._isBodyOverflowing) {
        // Note: DOMNode.style.paddingRight returns the actual value or '' if not set
        //   while $(DOMNode).css('padding-right') returns the calculated value or 0 if not set
        var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
        var stickyContent = [].slice.call(document.querySelectorAll(Selector$5.STICKY_CONTENT)); // Adjust fixed content padding

        $(fixedContent).each(function (index, element) {
          var actualPadding = element.style.paddingRight;
          var calculatedPadding = $(element).css('padding-right');
          $(element).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + _this9._scrollbarWidth + "px");
        }); // Adjust sticky content margin

        $(stickyContent).each(function (index, element) {
          var actualMargin = element.style.marginRight;
          var calculatedMargin = $(element).css('margin-right');
          $(element).data('margin-right', actualMargin).css('margin-right', parseFloat(calculatedMargin) - _this9._scrollbarWidth + "px");
        }); // Adjust body padding

        var actualPadding = document.body.style.paddingRight;
        var calculatedPadding = $(document.body).css('padding-right');
        $(document.body).data('padding-right', actualPadding).css('padding-right', parseFloat(calculatedPadding) + this._scrollbarWidth + "px");
      }

      $(document.body).addClass(ClassName$5.OPEN);
    };

    _proto._resetScrollbar = function _resetScrollbar() {
      // Restore fixed content padding
      var fixedContent = [].slice.call(document.querySelectorAll(Selector$5.FIXED_CONTENT));
      $(fixedContent).each(function (index, element) {
        var padding = $(element).data('padding-right');
        $(element).removeData('padding-right');
        element.style.paddingRight = padding ? padding : '';
      }); // Restore sticky content

      var elements = [].slice.call(document.querySelectorAll("" + Selector$5.STICKY_CONTENT));
      $(elements).each(function (index, element) {
        var margin = $(element).data('margin-right');

        if (typeof margin !== 'undefined') {
          $(element).css('margin-right', margin).removeData('margin-right');
        }
      }); // Restore body padding

      var padding = $(document.body).data('padding-right');
      $(document.body).removeData('padding-right');
      document.body.style.paddingRight = padding ? padding : '';
    };

    _proto._getScrollbarWidth = function _getScrollbarWidth() {
      // thx d.walsh
      var scrollDiv = document.createElement('div');
      scrollDiv.className = ClassName$5.SCROLLBAR_MEASURER;
      document.body.appendChild(scrollDiv);
      var scrollbarWidth = scrollDiv.getBoundingClientRect().width - scrollDiv.clientWidth;
      document.body.removeChild(scrollDiv);
      return scrollbarWidth;
    } // Static
    ;

    Modal._jQueryInterface = function _jQueryInterface(config, relatedTarget) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$5);

        var _config = _objectSpread({}, Default$3, $(this).data(), typeof config === 'object' && config ? config : {});

        if (!data) {
          data = new Modal(this, _config);
          $(this).data(DATA_KEY$5, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](relatedTarget);
        } else if (_config.show) {
          data.show(relatedTarget);
        }
      });
    };

    _createClass(Modal, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$5;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$3;
      }
    }]);

    return Modal;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$5.CLICK_DATA_API, Selector$5.DATA_TOGGLE, function (event) {
    var _this10 = this;

    var target;
    var selector = Util.getSelectorFromElement(this);

    if (selector) {
      target = document.querySelector(selector);
    }

    var config = $(target).data(DATA_KEY$5) ? 'toggle' : _objectSpread({}, $(target).data(), $(this).data());

    if (this.tagName === 'A' || this.tagName === 'AREA') {
      event.preventDefault();
    }

    var $target = $(target).one(Event$5.SHOW, function (showEvent) {
      if (showEvent.isDefaultPrevented()) {
        // Only register focus restorer if modal will actually get shown
        return;
      }

      $target.one(Event$5.HIDDEN, function () {
        if ($(_this10).is(':visible')) {
          _this10.focus();
        }
      });
    });

    Modal._jQueryInterface.call($(target), config, this);
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$5] = Modal._jQueryInterface;
  $.fn[NAME$5].Constructor = Modal;

  $.fn[NAME$5].noConflict = function () {
    $.fn[NAME$5] = JQUERY_NO_CONFLICT$5;
    return Modal._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): tools/sanitizer.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */
  var uriAttrs = ['background', 'cite', 'href', 'itemtype', 'longdesc', 'poster', 'src', 'xlink:href'];
  var ARIA_ATTRIBUTE_PATTERN = /^aria-[\w-]*$/i;
  var DefaultWhitelist = {
    // Global attributes allowed on any supplied element below.
    '*': ['class', 'dir', 'id', 'lang', 'role', ARIA_ATTRIBUTE_PATTERN],
    a: ['target', 'href', 'title', 'rel'],
    area: [],
    b: [],
    br: [],
    col: [],
    code: [],
    div: [],
    em: [],
    hr: [],
    h1: [],
    h2: [],
    h3: [],
    h4: [],
    h5: [],
    h6: [],
    i: [],
    img: ['src', 'alt', 'title', 'width', 'height'],
    li: [],
    ol: [],
    p: [],
    pre: [],
    s: [],
    small: [],
    span: [],
    sub: [],
    sup: [],
    strong: [],
    u: [],
    ul: []
    /**
     * A pattern that recognizes a commonly useful subset of URLs that are safe.
     *
     * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
     */

  };
  var SAFE_URL_PATTERN = /^(?:(?:https?|mailto|ftp|tel|file):|[^&:/?#]*(?:[/?#]|$))/gi;
  /**
   * A pattern that matches safe data URLs. Only matches image, video and audio types.
   *
   * Shoutout to Angular 7 https://github.com/angular/angular/blob/7.2.4/packages/core/src/sanitization/url_sanitizer.ts
   */

  var DATA_URL_PATTERN = /^data:(?:image\/(?:bmp|gif|jpeg|jpg|png|tiff|webp)|video\/(?:mpeg|mp4|ogg|webm)|audio\/(?:mp3|oga|ogg|opus));base64,[a-z0-9+/]+=*$/i;

  function allowedAttribute(attr, allowedAttributeList) {
    var attrName = attr.nodeName.toLowerCase();

    if (allowedAttributeList.indexOf(attrName) !== -1) {
      if (uriAttrs.indexOf(attrName) !== -1) {
        return Boolean(attr.nodeValue.match(SAFE_URL_PATTERN) || attr.nodeValue.match(DATA_URL_PATTERN));
      }

      return true;
    }

    var regExp = allowedAttributeList.filter(function (attrRegex) {
      return attrRegex instanceof RegExp;
    }); // Check if a regular expression validates the attribute.

    for (var i = 0, l = regExp.length; i < l; i++) {
      if (attrName.match(regExp[i])) {
        return true;
      }
    }

    return false;
  }

  function sanitizeHtml(unsafeHtml, whiteList, sanitizeFn) {
    if (unsafeHtml.length === 0) {
      return unsafeHtml;
    }

    if (sanitizeFn && typeof sanitizeFn === 'function') {
      return sanitizeFn(unsafeHtml);
    }

    var domParser = new window.DOMParser();
    var createdDocument = domParser.parseFromString(unsafeHtml, 'text/html');
    var whitelistKeys = Object.keys(whiteList);
    var elements = [].slice.call(createdDocument.body.querySelectorAll('*'));

    var _loop = function _loop(i, len) {
      var el = elements[i];
      var elName = el.nodeName.toLowerCase();

      if (whitelistKeys.indexOf(el.nodeName.toLowerCase()) === -1) {
        el.parentNode.removeChild(el);
        return "continue";
      }

      var attributeList = [].slice.call(el.attributes);
      var whitelistedAttributes = [].concat(whiteList['*'] || [], whiteList[elName] || []);
      attributeList.forEach(function (attr) {
        if (!allowedAttribute(attr, whitelistedAttributes)) {
          el.removeAttribute(attr.nodeName);
        }
      });
    };

    for (var i = 0, len = elements.length; i < len; i++) {
      var _ret = _loop(i, len);

      if (_ret === "continue") { continue; }
    }

    return createdDocument.body.innerHTML;
  }

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$6 = 'tooltip';
  var VERSION$6 = '4.3.1';
  var DATA_KEY$6 = 'bs.tooltip';
  var EVENT_KEY$6 = "." + DATA_KEY$6;
  var JQUERY_NO_CONFLICT$6 = $.fn[NAME$6];
  var CLASS_PREFIX = 'bs-tooltip';
  var BSCLS_PREFIX_REGEX = new RegExp("(^|\\s)" + CLASS_PREFIX + "\\S+", 'g');
  var DISALLOWED_ATTRIBUTES = ['sanitize', 'whiteList', 'sanitizeFn'];
  var DefaultType$4 = {
    animation: 'boolean',
    template: 'string',
    title: '(string|element|function)',
    trigger: 'string',
    delay: '(number|object)',
    html: 'boolean',
    selector: '(string|boolean)',
    placement: '(string|function)',
    offset: '(number|string|function)',
    container: '(string|element|boolean)',
    fallbackPlacement: '(string|array)',
    boundary: '(string|element)',
    sanitize: 'boolean',
    sanitizeFn: '(null|function)',
    whiteList: 'object'
  };
  var AttachmentMap$1 = {
    AUTO: 'auto',
    TOP: 'top',
    RIGHT: 'right',
    BOTTOM: 'bottom',
    LEFT: 'left'
  };
  var Default$4 = {
    animation: true,
    template: '<div class="tooltip" role="tooltip">' + '<div class="arrow"></div>' + '<div class="tooltip-inner"></div></div>',
    trigger: 'hover focus',
    title: '',
    delay: 0,
    html: false,
    selector: false,
    placement: 'top',
    offset: 0,
    container: false,
    fallbackPlacement: 'flip',
    boundary: 'scrollParent',
    sanitize: true,
    sanitizeFn: null,
    whiteList: DefaultWhitelist
  };
  var HoverState = {
    SHOW: 'show',
    OUT: 'out'
  };
  var Event$6 = {
    HIDE: "hide" + EVENT_KEY$6,
    HIDDEN: "hidden" + EVENT_KEY$6,
    SHOW: "show" + EVENT_KEY$6,
    SHOWN: "shown" + EVENT_KEY$6,
    INSERTED: "inserted" + EVENT_KEY$6,
    CLICK: "click" + EVENT_KEY$6,
    FOCUSIN: "focusin" + EVENT_KEY$6,
    FOCUSOUT: "focusout" + EVENT_KEY$6,
    MOUSEENTER: "mouseenter" + EVENT_KEY$6,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$6
  };
  var ClassName$6 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$6 = {
    TOOLTIP: '.tooltip',
    TOOLTIP_INNER: '.tooltip-inner',
    ARROW: '.arrow'
  };
  var Trigger = {
    HOVER: 'hover',
    FOCUS: 'focus',
    CLICK: 'click',
    MANUAL: 'manual'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tooltip =
  /*#__PURE__*/
  function () {
    function Tooltip(element, config) {
      /**
       * Check for Popper dependency
       * Popper - https://popper.js.org
       */
      if (typeof Popper === 'undefined') {
        throw new TypeError('Bootstrap\'s tooltips require Popper.js (https://popper.js.org/)');
      } // private


      this._isEnabled = true;
      this._timeout = 0;
      this._hoverState = '';
      this._activeTrigger = {};
      this._popper = null; // Protected

      this.element = element;
      this.config = this._getConfig(config);
      this.tip = null;

      this._setListeners();
    } // Getters


    var _proto = Tooltip.prototype;

    // Public
    _proto.enable = function enable() {
      this._isEnabled = true;
    };

    _proto.disable = function disable() {
      this._isEnabled = false;
    };

    _proto.toggleEnabled = function toggleEnabled() {
      this._isEnabled = !this._isEnabled;
    };

    _proto.toggle = function toggle(event) {
      if (!this._isEnabled) {
        return;
      }

      if (event) {
        var dataKey = this.constructor.DATA_KEY;
        var context = $(event.currentTarget).data(dataKey);

        if (!context) {
          context = new this.constructor(event.currentTarget, this._getDelegateConfig());
          $(event.currentTarget).data(dataKey, context);
        }

        context._activeTrigger.click = !context._activeTrigger.click;

        if (context._isWithActiveTrigger()) {
          context._enter(null, context);
        } else {
          context._leave(null, context);
        }
      } else {
        if ($(this.getTipElement()).hasClass(ClassName$6.SHOW)) {
          this._leave(null, this);

          return;
        }

        this._enter(null, this);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      $.removeData(this.element, this.constructor.DATA_KEY);
      $(this.element).off(this.constructor.EVENT_KEY);
      $(this.element).closest('.modal').off('hide.bs.modal');

      if (this.tip) {
        $(this.tip).remove();
      }

      this._isEnabled = null;
      this._timeout = null;
      this._hoverState = null;
      this._activeTrigger = null;

      if (this._popper !== null) {
        this._popper.destroy();
      }

      this._popper = null;
      this.element = null;
      this.config = null;
      this.tip = null;
    };

    _proto.show = function show() {
      var _this = this;

      if ($(this.element).css('display') === 'none') {
        throw new Error('Please use show on visible elements');
      }

      var showEvent = $.Event(this.constructor.Event.SHOW);

      if (this.isWithContent() && this._isEnabled) {
        $(this.element).trigger(showEvent);
        var shadowRoot = Util.findShadowRoot(this.element);
        var isInTheDom = $.contains(shadowRoot !== null ? shadowRoot : this.element.ownerDocument.documentElement, this.element);

        if (showEvent.isDefaultPrevented() || !isInTheDom) {
          return;
        }

        var tip = this.getTipElement();
        var tipId = Util.getUID(this.constructor.NAME);
        tip.setAttribute('id', tipId);
        this.element.setAttribute('aria-describedby', tipId);
        this.setContent();

        if (this.config.animation) {
          $(tip).addClass(ClassName$6.FADE);
        }

        var placement = typeof this.config.placement === 'function' ? this.config.placement.call(this, tip, this.element) : this.config.placement;

        var attachment = this._getAttachment(placement);

        this.addAttachmentClass(attachment);

        var container = this._getContainer();

        $(tip).data(this.constructor.DATA_KEY, this);

        if (!$.contains(this.element.ownerDocument.documentElement, this.tip)) {
          $(tip).appendTo(container);
        }

        $(this.element).trigger(this.constructor.Event.INSERTED);
        this._popper = new Popper(this.element, tip, {
          placement: attachment,
          modifiers: {
            offset: this._getOffset(),
            flip: {
              behavior: this.config.fallbackPlacement
            },
            arrow: {
              element: Selector$6.ARROW
            },
            preventOverflow: {
              boundariesElement: this.config.boundary
            }
          },
          onCreate: function onCreate(data) {
            if (data.originalPlacement !== data.placement) {
              _this._handlePopperPlacementChange(data);
            }
          },
          onUpdate: function onUpdate(data) {
            return _this._handlePopperPlacementChange(data);
          }
        });
        $(tip).addClass(ClassName$6.SHOW); // If this is a touch-enabled device we add extra
        // empty mouseover listeners to the body's immediate children;
        // only needed because of broken event delegation on iOS
        // https://www.quirksmode.org/blog/archives/2014/02/mouse_event_bub.html

        if ('ontouchstart' in document.documentElement) {
          $(document.body).children().on('mouseover', null, $.noop);
        }

        var complete = function complete() {
          if (_this.config.animation) {
            _this._fixTransition();
          }

          var prevHoverState = _this._hoverState;
          _this._hoverState = null;
          $(_this.element).trigger(_this.constructor.Event.SHOWN);

          if (prevHoverState === HoverState.OUT) {
            _this._leave(null, _this);
          }
        };

        if ($(this.tip).hasClass(ClassName$6.FADE)) {
          var transitionDuration = Util.getTransitionDurationFromElement(this.tip);
          $(this.tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
        } else {
          complete();
        }
      }
    };

    _proto.hide = function hide(callback) {
      var _this2 = this;

      var tip = this.getTipElement();
      var hideEvent = $.Event(this.constructor.Event.HIDE);

      var complete = function complete() {
        if (_this2._hoverState !== HoverState.SHOW && tip.parentNode) {
          tip.parentNode.removeChild(tip);
        }

        _this2._cleanTipClass();

        _this2.element.removeAttribute('aria-describedby');

        $(_this2.element).trigger(_this2.constructor.Event.HIDDEN);

        if (_this2._popper !== null) {
          _this2._popper.destroy();
        }

        if (callback) {
          callback();
        }
      };

      $(this.element).trigger(hideEvent);

      if (hideEvent.isDefaultPrevented()) {
        return;
      }

      $(tip).removeClass(ClassName$6.SHOW); // If this is a touch-enabled device we remove the extra
      // empty mouseover listeners we added for iOS support

      if ('ontouchstart' in document.documentElement) {
        $(document.body).children().off('mouseover', null, $.noop);
      }

      this._activeTrigger[Trigger.CLICK] = false;
      this._activeTrigger[Trigger.FOCUS] = false;
      this._activeTrigger[Trigger.HOVER] = false;

      if ($(this.tip).hasClass(ClassName$6.FADE)) {
        var transitionDuration = Util.getTransitionDurationFromElement(tip);
        $(tip).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }

      this._hoverState = '';
    };

    _proto.update = function update() {
      if (this._popper !== null) {
        this._popper.scheduleUpdate();
      }
    } // Protected
    ;

    _proto.isWithContent = function isWithContent() {
      return Boolean(this.getTitle());
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var tip = this.getTipElement();
      this.setElementContent($(tip.querySelectorAll(Selector$6.TOOLTIP_INNER)), this.getTitle());
      $(tip).removeClass(ClassName$6.FADE + " " + ClassName$6.SHOW);
    };

    _proto.setElementContent = function setElementContent($element, content) {
      if (typeof content === 'object' && (content.nodeType || content.jquery)) {
        // Content is a DOM node or a jQuery
        if (this.config.html) {
          if (!$(content).parent().is($element)) {
            $element.empty().append(content);
          }
        } else {
          $element.text($(content).text());
        }

        return;
      }

      if (this.config.html) {
        if (this.config.sanitize) {
          content = sanitizeHtml(content, this.config.whiteList, this.config.sanitizeFn);
        }

        $element.html(content);
      } else {
        $element.text(content);
      }
    };

    _proto.getTitle = function getTitle() {
      var title = this.element.getAttribute('data-original-title');

      if (!title) {
        title = typeof this.config.title === 'function' ? this.config.title.call(this.element) : this.config.title;
      }

      return title;
    } // Private
    ;

    _proto._getOffset = function _getOffset() {
      var _this3 = this;

      var offset = {};

      if (typeof this.config.offset === 'function') {
        offset.fn = function (data) {
          data.offsets = _objectSpread({}, data.offsets, _this3.config.offset(data.offsets, _this3.element) || {});
          return data;
        };
      } else {
        offset.offset = this.config.offset;
      }

      return offset;
    };

    _proto._getContainer = function _getContainer() {
      if (this.config.container === false) {
        return document.body;
      }

      if (Util.isElement(this.config.container)) {
        return $(this.config.container);
      }

      return $(document).find(this.config.container);
    };

    _proto._getAttachment = function _getAttachment(placement) {
      return AttachmentMap$1[placement.toUpperCase()];
    };

    _proto._setListeners = function _setListeners() {
      var _this4 = this;

      var triggers = this.config.trigger.split(' ');
      triggers.forEach(function (trigger) {
        if (trigger === 'click') {
          $(_this4.element).on(_this4.constructor.Event.CLICK, _this4.config.selector, function (event) {
            return _this4.toggle(event);
          });
        } else if (trigger !== Trigger.MANUAL) {
          var eventIn = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSEENTER : _this4.constructor.Event.FOCUSIN;
          var eventOut = trigger === Trigger.HOVER ? _this4.constructor.Event.MOUSELEAVE : _this4.constructor.Event.FOCUSOUT;
          $(_this4.element).on(eventIn, _this4.config.selector, function (event) {
            return _this4._enter(event);
          }).on(eventOut, _this4.config.selector, function (event) {
            return _this4._leave(event);
          });
        }
      });
      $(this.element).closest('.modal').on('hide.bs.modal', function () {
        if (_this4.element) {
          _this4.hide();
        }
      });

      if (this.config.selector) {
        this.config = _objectSpread({}, this.config, {
          trigger: 'manual',
          selector: ''
        });
      } else {
        this._fixTitle();
      }
    };

    _proto._fixTitle = function _fixTitle() {
      var titleType = typeof this.element.getAttribute('data-original-title');

      if (this.element.getAttribute('title') || titleType !== 'string') {
        this.element.setAttribute('data-original-title', this.element.getAttribute('title') || '');
        this.element.setAttribute('title', '');
      }
    };

    _proto._enter = function _enter(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusin' ? Trigger.FOCUS : Trigger.HOVER] = true;
      }

      if ($(context.getTipElement()).hasClass(ClassName$6.SHOW) || context._hoverState === HoverState.SHOW) {
        context._hoverState = HoverState.SHOW;
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.SHOW;

      if (!context.config.delay || !context.config.delay.show) {
        context.show();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.SHOW) {
          context.show();
        }
      }, context.config.delay.show);
    };

    _proto._leave = function _leave(event, context) {
      var dataKey = this.constructor.DATA_KEY;
      context = context || $(event.currentTarget).data(dataKey);

      if (!context) {
        context = new this.constructor(event.currentTarget, this._getDelegateConfig());
        $(event.currentTarget).data(dataKey, context);
      }

      if (event) {
        context._activeTrigger[event.type === 'focusout' ? Trigger.FOCUS : Trigger.HOVER] = false;
      }

      if (context._isWithActiveTrigger()) {
        return;
      }

      clearTimeout(context._timeout);
      context._hoverState = HoverState.OUT;

      if (!context.config.delay || !context.config.delay.hide) {
        context.hide();
        return;
      }

      context._timeout = setTimeout(function () {
        if (context._hoverState === HoverState.OUT) {
          context.hide();
        }
      }, context.config.delay.hide);
    };

    _proto._isWithActiveTrigger = function _isWithActiveTrigger() {
      var this$1 = this;

      for (var trigger in this$1._activeTrigger) {
        if (this$1._activeTrigger[trigger]) {
          return true;
        }
      }

      return false;
    };

    _proto._getConfig = function _getConfig(config) {
      var dataAttributes = $(this.element).data();
      Object.keys(dataAttributes).forEach(function (dataAttr) {
        if (DISALLOWED_ATTRIBUTES.indexOf(dataAttr) !== -1) {
          delete dataAttributes[dataAttr];
        }
      });
      config = _objectSpread({}, this.constructor.Default, dataAttributes, typeof config === 'object' && config ? config : {});

      if (typeof config.delay === 'number') {
        config.delay = {
          show: config.delay,
          hide: config.delay
        };
      }

      if (typeof config.title === 'number') {
        config.title = config.title.toString();
      }

      if (typeof config.content === 'number') {
        config.content = config.content.toString();
      }

      Util.typeCheckConfig(NAME$6, config, this.constructor.DefaultType);

      if (config.sanitize) {
        config.template = sanitizeHtml(config.template, config.whiteList, config.sanitizeFn);
      }

      return config;
    };

    _proto._getDelegateConfig = function _getDelegateConfig() {
      var this$1 = this;

      var config = {};

      if (this.config) {
        for (var key in this$1.config) {
          if (this$1.constructor.Default[key] !== this$1.config[key]) {
            config[key] = this$1.config[key];
          }
        }
      }

      return config;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX);

      if (tabClass !== null && tabClass.length) {
        $tip.removeClass(tabClass.join(''));
      }
    };

    _proto._handlePopperPlacementChange = function _handlePopperPlacementChange(popperData) {
      var popperInstance = popperData.instance;
      this.tip = popperInstance.popper;

      this._cleanTipClass();

      this.addAttachmentClass(this._getAttachment(popperData.placement));
    };

    _proto._fixTransition = function _fixTransition() {
      var tip = this.getTipElement();
      var initConfigAnimation = this.config.animation;

      if (tip.getAttribute('x-placement') !== null) {
        return;
      }

      $(tip).removeClass(ClassName$6.FADE);
      this.config.animation = false;
      this.hide();
      this.show();
      this.config.animation = initConfigAnimation;
    } // Static
    ;

    Tooltip._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$6);

        var _config = typeof config === 'object' && config;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Tooltip(this, _config);
          $(this).data(DATA_KEY$6, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tooltip, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$6;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$4;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$6;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$6;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$6;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$6;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$4;
      }
    }]);

    return Tooltip;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$6] = Tooltip._jQueryInterface;
  $.fn[NAME$6].Constructor = Tooltip;

  $.fn[NAME$6].noConflict = function () {
    $.fn[NAME$6] = JQUERY_NO_CONFLICT$6;
    return Tooltip._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$7 = 'popover';
  var VERSION$7 = '4.3.1';
  var DATA_KEY$7 = 'bs.popover';
  var EVENT_KEY$7 = "." + DATA_KEY$7;
  var JQUERY_NO_CONFLICT$7 = $.fn[NAME$7];
  var CLASS_PREFIX$1 = 'bs-popover';
  var BSCLS_PREFIX_REGEX$1 = new RegExp("(^|\\s)" + CLASS_PREFIX$1 + "\\S+", 'g');

  var Default$5 = _objectSpread({}, Tooltip.Default, {
    placement: 'right',
    trigger: 'click',
    content: '',
    template: '<div class="popover" role="tooltip">' + '<div class="arrow"></div>' + '<h3 class="popover-header"></h3>' + '<div class="popover-body"></div></div>'
  });

  var DefaultType$5 = _objectSpread({}, Tooltip.DefaultType, {
    content: '(string|element|function)'
  });

  var ClassName$7 = {
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$7 = {
    TITLE: '.popover-header',
    CONTENT: '.popover-body'
  };
  var Event$7 = {
    HIDE: "hide" + EVENT_KEY$7,
    HIDDEN: "hidden" + EVENT_KEY$7,
    SHOW: "show" + EVENT_KEY$7,
    SHOWN: "shown" + EVENT_KEY$7,
    INSERTED: "inserted" + EVENT_KEY$7,
    CLICK: "click" + EVENT_KEY$7,
    FOCUSIN: "focusin" + EVENT_KEY$7,
    FOCUSOUT: "focusout" + EVENT_KEY$7,
    MOUSEENTER: "mouseenter" + EVENT_KEY$7,
    MOUSELEAVE: "mouseleave" + EVENT_KEY$7
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Popover =
  /*#__PURE__*/
  function (_Tooltip) {
    _inheritsLoose(Popover, _Tooltip);

    function Popover() {
      return _Tooltip.apply(this, arguments) || this;
    }

    var _proto = Popover.prototype;

    // Overrides
    _proto.isWithContent = function isWithContent() {
      return this.getTitle() || this._getContent();
    };

    _proto.addAttachmentClass = function addAttachmentClass(attachment) {
      $(this.getTipElement()).addClass(CLASS_PREFIX$1 + "-" + attachment);
    };

    _proto.getTipElement = function getTipElement() {
      this.tip = this.tip || $(this.config.template)[0];
      return this.tip;
    };

    _proto.setContent = function setContent() {
      var $tip = $(this.getTipElement()); // We use append for html objects to maintain js events

      this.setElementContent($tip.find(Selector$7.TITLE), this.getTitle());

      var content = this._getContent();

      if (typeof content === 'function') {
        content = content.call(this.element);
      }

      this.setElementContent($tip.find(Selector$7.CONTENT), content);
      $tip.removeClass(ClassName$7.FADE + " " + ClassName$7.SHOW);
    } // Private
    ;

    _proto._getContent = function _getContent() {
      return this.element.getAttribute('data-content') || this.config.content;
    };

    _proto._cleanTipClass = function _cleanTipClass() {
      var $tip = $(this.getTipElement());
      var tabClass = $tip.attr('class').match(BSCLS_PREFIX_REGEX$1);

      if (tabClass !== null && tabClass.length > 0) {
        $tip.removeClass(tabClass.join(''));
      }
    } // Static
    ;

    Popover._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$7);

        var _config = typeof config === 'object' ? config : null;

        if (!data && /dispose|hide/.test(config)) {
          return;
        }

        if (!data) {
          data = new Popover(this, _config);
          $(this).data(DATA_KEY$7, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Popover, null, [{
      key: "VERSION",
      // Getters
      get: function get() {
        return VERSION$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$5;
      }
    }, {
      key: "NAME",
      get: function get() {
        return NAME$7;
      }
    }, {
      key: "DATA_KEY",
      get: function get() {
        return DATA_KEY$7;
      }
    }, {
      key: "Event",
      get: function get() {
        return Event$7;
      }
    }, {
      key: "EVENT_KEY",
      get: function get() {
        return EVENT_KEY$7;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$5;
      }
    }]);

    return Popover;
  }(Tooltip);
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$7] = Popover._jQueryInterface;
  $.fn[NAME$7].Constructor = Popover;

  $.fn[NAME$7].noConflict = function () {
    $.fn[NAME$7] = JQUERY_NO_CONFLICT$7;
    return Popover._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$8 = 'scrollspy';
  var VERSION$8 = '4.3.1';
  var DATA_KEY$8 = 'bs.scrollspy';
  var EVENT_KEY$8 = "." + DATA_KEY$8;
  var DATA_API_KEY$6 = '.data-api';
  var JQUERY_NO_CONFLICT$8 = $.fn[NAME$8];
  var Default$6 = {
    offset: 10,
    method: 'auto',
    target: ''
  };
  var DefaultType$6 = {
    offset: 'number',
    method: 'string',
    target: '(string|element)'
  };
  var Event$8 = {
    ACTIVATE: "activate" + EVENT_KEY$8,
    SCROLL: "scroll" + EVENT_KEY$8,
    LOAD_DATA_API: "load" + EVENT_KEY$8 + DATA_API_KEY$6
  };
  var ClassName$8 = {
    DROPDOWN_ITEM: 'dropdown-item',
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active'
  };
  var Selector$8 = {
    DATA_SPY: '[data-spy="scroll"]',
    ACTIVE: '.active',
    NAV_LIST_GROUP: '.nav, .list-group',
    NAV_LINKS: '.nav-link',
    NAV_ITEMS: '.nav-item',
    LIST_ITEMS: '.list-group-item',
    DROPDOWN: '.dropdown',
    DROPDOWN_ITEMS: '.dropdown-item',
    DROPDOWN_TOGGLE: '.dropdown-toggle'
  };
  var OffsetMethod = {
    OFFSET: 'offset',
    POSITION: 'position'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var ScrollSpy =
  /*#__PURE__*/
  function () {
    function ScrollSpy(element, config) {
      var _this = this;

      this._element = element;
      this._scrollElement = element.tagName === 'BODY' ? window : element;
      this._config = this._getConfig(config);
      this._selector = this._config.target + " " + Selector$8.NAV_LINKS + "," + (this._config.target + " " + Selector$8.LIST_ITEMS + ",") + (this._config.target + " " + Selector$8.DROPDOWN_ITEMS);
      this._offsets = [];
      this._targets = [];
      this._activeTarget = null;
      this._scrollHeight = 0;
      $(this._scrollElement).on(Event$8.SCROLL, function (event) {
        return _this._process(event);
      });
      this.refresh();

      this._process();
    } // Getters


    var _proto = ScrollSpy.prototype;

    // Public
    _proto.refresh = function refresh() {
      var _this2 = this;

      var autoMethod = this._scrollElement === this._scrollElement.window ? OffsetMethod.OFFSET : OffsetMethod.POSITION;
      var offsetMethod = this._config.method === 'auto' ? autoMethod : this._config.method;
      var offsetBase = offsetMethod === OffsetMethod.POSITION ? this._getScrollTop() : 0;
      this._offsets = [];
      this._targets = [];
      this._scrollHeight = this._getScrollHeight();
      var targets = [].slice.call(document.querySelectorAll(this._selector));
      targets.map(function (element) {
        var target;
        var targetSelector = Util.getSelectorFromElement(element);

        if (targetSelector) {
          target = document.querySelector(targetSelector);
        }

        if (target) {
          var targetBCR = target.getBoundingClientRect();

          if (targetBCR.width || targetBCR.height) {
            // TODO (fat): remove sketch reliance on jQuery position/offset
            return [$(target)[offsetMethod]().top + offsetBase, targetSelector];
          }
        }

        return null;
      }).filter(function (item) {
        return item;
      }).sort(function (a, b) {
        return a[0] - b[0];
      }).forEach(function (item) {
        _this2._offsets.push(item[0]);

        _this2._targets.push(item[1]);
      });
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$8);
      $(this._scrollElement).off(EVENT_KEY$8);
      this._element = null;
      this._scrollElement = null;
      this._config = null;
      this._selector = null;
      this._offsets = null;
      this._targets = null;
      this._activeTarget = null;
      this._scrollHeight = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$6, typeof config === 'object' && config ? config : {});

      if (typeof config.target !== 'string') {
        var id = $(config.target).attr('id');

        if (!id) {
          id = Util.getUID(NAME$8);
          $(config.target).attr('id', id);
        }

        config.target = "#" + id;
      }

      Util.typeCheckConfig(NAME$8, config, DefaultType$6);
      return config;
    };

    _proto._getScrollTop = function _getScrollTop() {
      return this._scrollElement === window ? this._scrollElement.pageYOffset : this._scrollElement.scrollTop;
    };

    _proto._getScrollHeight = function _getScrollHeight() {
      return this._scrollElement.scrollHeight || Math.max(document.body.scrollHeight, document.documentElement.scrollHeight);
    };

    _proto._getOffsetHeight = function _getOffsetHeight() {
      return this._scrollElement === window ? window.innerHeight : this._scrollElement.getBoundingClientRect().height;
    };

    _proto._process = function _process() {
      var this$1 = this;

      var scrollTop = this._getScrollTop() + this._config.offset;

      var scrollHeight = this._getScrollHeight();

      var maxScroll = this._config.offset + scrollHeight - this._getOffsetHeight();

      if (this._scrollHeight !== scrollHeight) {
        this.refresh();
      }

      if (scrollTop >= maxScroll) {
        var target = this._targets[this._targets.length - 1];

        if (this._activeTarget !== target) {
          this._activate(target);
        }

        return;
      }

      if (this._activeTarget && scrollTop < this._offsets[0] && this._offsets[0] > 0) {
        this._activeTarget = null;

        this._clear();

        return;
      }

      var offsetLength = this._offsets.length;

      for (var i = offsetLength; i--;) {
        var isActiveTarget = this$1._activeTarget !== this$1._targets[i] && scrollTop >= this$1._offsets[i] && (typeof this$1._offsets[i + 1] === 'undefined' || scrollTop < this$1._offsets[i + 1]);

        if (isActiveTarget) {
          this$1._activate(this$1._targets[i]);
        }
      }
    };

    _proto._activate = function _activate(target) {
      this._activeTarget = target;

      this._clear();

      var queries = this._selector.split(',').map(function (selector) {
        return selector + "[data-target=\"" + target + "\"]," + selector + "[href=\"" + target + "\"]";
      });

      var $link = $([].slice.call(document.querySelectorAll(queries.join(','))));

      if ($link.hasClass(ClassName$8.DROPDOWN_ITEM)) {
        $link.closest(Selector$8.DROPDOWN).find(Selector$8.DROPDOWN_TOGGLE).addClass(ClassName$8.ACTIVE);
        $link.addClass(ClassName$8.ACTIVE);
      } else {
        // Set triggered link as active
        $link.addClass(ClassName$8.ACTIVE); // Set triggered links parents as active
        // With both <ul> and <nav> markup a parent is the previous sibling of any nav ancestor

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_LINKS + ", " + Selector$8.LIST_ITEMS).addClass(ClassName$8.ACTIVE); // Handle special case when .nav-link is inside .nav-item

        $link.parents(Selector$8.NAV_LIST_GROUP).prev(Selector$8.NAV_ITEMS).children(Selector$8.NAV_LINKS).addClass(ClassName$8.ACTIVE);
      }

      $(this._scrollElement).trigger(Event$8.ACTIVATE, {
        relatedTarget: target
      });
    };

    _proto._clear = function _clear() {
      [].slice.call(document.querySelectorAll(this._selector)).filter(function (node) {
        return node.classList.contains(ClassName$8.ACTIVE);
      }).forEach(function (node) {
        return node.classList.remove(ClassName$8.ACTIVE);
      });
    } // Static
    ;

    ScrollSpy._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var data = $(this).data(DATA_KEY$8);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new ScrollSpy(this, _config);
          $(this).data(DATA_KEY$8, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(ScrollSpy, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$8;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$6;
      }
    }]);

    return ScrollSpy;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(window).on(Event$8.LOAD_DATA_API, function () {
    var scrollSpys = [].slice.call(document.querySelectorAll(Selector$8.DATA_SPY));
    var scrollSpysLength = scrollSpys.length;

    for (var i = scrollSpysLength; i--;) {
      var $spy = $(scrollSpys[i]);

      ScrollSpy._jQueryInterface.call($spy, $spy.data());
    }
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$8] = ScrollSpy._jQueryInterface;
  $.fn[NAME$8].Constructor = ScrollSpy;

  $.fn[NAME$8].noConflict = function () {
    $.fn[NAME$8] = JQUERY_NO_CONFLICT$8;
    return ScrollSpy._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$9 = 'tab';
  var VERSION$9 = '4.3.1';
  var DATA_KEY$9 = 'bs.tab';
  var EVENT_KEY$9 = "." + DATA_KEY$9;
  var DATA_API_KEY$7 = '.data-api';
  var JQUERY_NO_CONFLICT$9 = $.fn[NAME$9];
  var Event$9 = {
    HIDE: "hide" + EVENT_KEY$9,
    HIDDEN: "hidden" + EVENT_KEY$9,
    SHOW: "show" + EVENT_KEY$9,
    SHOWN: "shown" + EVENT_KEY$9,
    CLICK_DATA_API: "click" + EVENT_KEY$9 + DATA_API_KEY$7
  };
  var ClassName$9 = {
    DROPDOWN_MENU: 'dropdown-menu',
    ACTIVE: 'active',
    DISABLED: 'disabled',
    FADE: 'fade',
    SHOW: 'show'
  };
  var Selector$9 = {
    DROPDOWN: '.dropdown',
    NAV_LIST_GROUP: '.nav, .list-group',
    ACTIVE: '.active',
    ACTIVE_UL: '> li > .active',
    DATA_TOGGLE: '[data-toggle="tab"], [data-toggle="pill"], [data-toggle="list"]',
    DROPDOWN_TOGGLE: '.dropdown-toggle',
    DROPDOWN_ACTIVE_CHILD: '> .dropdown-menu .active'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Tab =
  /*#__PURE__*/
  function () {
    function Tab(element) {
      this._element = element;
    } // Getters


    var _proto = Tab.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      if (this._element.parentNode && this._element.parentNode.nodeType === Node.ELEMENT_NODE && $(this._element).hasClass(ClassName$9.ACTIVE) || $(this._element).hasClass(ClassName$9.DISABLED)) {
        return;
      }

      var target;
      var previous;
      var listElement = $(this._element).closest(Selector$9.NAV_LIST_GROUP)[0];
      var selector = Util.getSelectorFromElement(this._element);

      if (listElement) {
        var itemSelector = listElement.nodeName === 'UL' || listElement.nodeName === 'OL' ? Selector$9.ACTIVE_UL : Selector$9.ACTIVE;
        previous = $.makeArray($(listElement).find(itemSelector));
        previous = previous[previous.length - 1];
      }

      var hideEvent = $.Event(Event$9.HIDE, {
        relatedTarget: this._element
      });
      var showEvent = $.Event(Event$9.SHOW, {
        relatedTarget: previous
      });

      if (previous) {
        $(previous).trigger(hideEvent);
      }

      $(this._element).trigger(showEvent);

      if (showEvent.isDefaultPrevented() || hideEvent.isDefaultPrevented()) {
        return;
      }

      if (selector) {
        target = document.querySelector(selector);
      }

      this._activate(this._element, listElement);

      var complete = function complete() {
        var hiddenEvent = $.Event(Event$9.HIDDEN, {
          relatedTarget: _this._element
        });
        var shownEvent = $.Event(Event$9.SHOWN, {
          relatedTarget: previous
        });
        $(previous).trigger(hiddenEvent);
        $(_this._element).trigger(shownEvent);
      };

      if (target) {
        this._activate(target, target.parentNode, complete);
      } else {
        complete();
      }
    };

    _proto.dispose = function dispose() {
      $.removeData(this._element, DATA_KEY$9);
      this._element = null;
    } // Private
    ;

    _proto._activate = function _activate(element, container, callback) {
      var _this2 = this;

      var activeElements = container && (container.nodeName === 'UL' || container.nodeName === 'OL') ? $(container).find(Selector$9.ACTIVE_UL) : $(container).children(Selector$9.ACTIVE);
      var active = activeElements[0];
      var isTransitioning = callback && active && $(active).hasClass(ClassName$9.FADE);

      var complete = function complete() {
        return _this2._transitionComplete(element, active, callback);
      };

      if (active && isTransitioning) {
        var transitionDuration = Util.getTransitionDurationFromElement(active);
        $(active).removeClass(ClassName$9.SHOW).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto._transitionComplete = function _transitionComplete(element, active, callback) {
      if (active) {
        $(active).removeClass(ClassName$9.ACTIVE);
        var dropdownChild = $(active.parentNode).find(Selector$9.DROPDOWN_ACTIVE_CHILD)[0];

        if (dropdownChild) {
          $(dropdownChild).removeClass(ClassName$9.ACTIVE);
        }

        if (active.getAttribute('role') === 'tab') {
          active.setAttribute('aria-selected', false);
        }
      }

      $(element).addClass(ClassName$9.ACTIVE);

      if (element.getAttribute('role') === 'tab') {
        element.setAttribute('aria-selected', true);
      }

      Util.reflow(element);

      if (element.classList.contains(ClassName$9.FADE)) {
        element.classList.add(ClassName$9.SHOW);
      }

      if (element.parentNode && $(element.parentNode).hasClass(ClassName$9.DROPDOWN_MENU)) {
        var dropdownElement = $(element).closest(Selector$9.DROPDOWN)[0];

        if (dropdownElement) {
          var dropdownToggleList = [].slice.call(dropdownElement.querySelectorAll(Selector$9.DROPDOWN_TOGGLE));
          $(dropdownToggleList).addClass(ClassName$9.ACTIVE);
        }

        element.setAttribute('aria-expanded', true);
      }

      if (callback) {
        callback();
      }
    } // Static
    ;

    Tab._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $this = $(this);
        var data = $this.data(DATA_KEY$9);

        if (!data) {
          data = new Tab(this);
          $this.data(DATA_KEY$9, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config]();
        }
      });
    };

    _createClass(Tab, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$9;
      }
    }]);

    return Tab;
  }();
  /**
   * ------------------------------------------------------------------------
   * Data Api implementation
   * ------------------------------------------------------------------------
   */


  $(document).on(Event$9.CLICK_DATA_API, Selector$9.DATA_TOGGLE, function (event) {
    event.preventDefault();

    Tab._jQueryInterface.call($(this), 'show');
  });
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */

  $.fn[NAME$9] = Tab._jQueryInterface;
  $.fn[NAME$9].Constructor = Tab;

  $.fn[NAME$9].noConflict = function () {
    $.fn[NAME$9] = JQUERY_NO_CONFLICT$9;
    return Tab._jQueryInterface;
  };

  /**
   * ------------------------------------------------------------------------
   * Constants
   * ------------------------------------------------------------------------
   */

  var NAME$a = 'toast';
  var VERSION$a = '4.3.1';
  var DATA_KEY$a = 'bs.toast';
  var EVENT_KEY$a = "." + DATA_KEY$a;
  var JQUERY_NO_CONFLICT$a = $.fn[NAME$a];
  var Event$a = {
    CLICK_DISMISS: "click.dismiss" + EVENT_KEY$a,
    HIDE: "hide" + EVENT_KEY$a,
    HIDDEN: "hidden" + EVENT_KEY$a,
    SHOW: "show" + EVENT_KEY$a,
    SHOWN: "shown" + EVENT_KEY$a
  };
  var ClassName$a = {
    FADE: 'fade',
    HIDE: 'hide',
    SHOW: 'show',
    SHOWING: 'showing'
  };
  var DefaultType$7 = {
    animation: 'boolean',
    autohide: 'boolean',
    delay: 'number'
  };
  var Default$7 = {
    animation: true,
    autohide: true,
    delay: 500
  };
  var Selector$a = {
    DATA_DISMISS: '[data-dismiss="toast"]'
    /**
     * ------------------------------------------------------------------------
     * Class Definition
     * ------------------------------------------------------------------------
     */

  };

  var Toast =
  /*#__PURE__*/
  function () {
    function Toast(element, config) {
      this._element = element;
      this._config = this._getConfig(config);
      this._timeout = null;

      this._setListeners();
    } // Getters


    var _proto = Toast.prototype;

    // Public
    _proto.show = function show() {
      var _this = this;

      $(this._element).trigger(Event$a.SHOW);

      if (this._config.animation) {
        this._element.classList.add(ClassName$a.FADE);
      }

      var complete = function complete() {
        _this._element.classList.remove(ClassName$a.SHOWING);

        _this._element.classList.add(ClassName$a.SHOW);

        $(_this._element).trigger(Event$a.SHOWN);

        if (_this._config.autohide) {
          _this.hide();
        }
      };

      this._element.classList.remove(ClassName$a.HIDE);

      this._element.classList.add(ClassName$a.SHOWING);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    };

    _proto.hide = function hide(withoutTimeout) {
      var _this2 = this;

      if (!this._element.classList.contains(ClassName$a.SHOW)) {
        return;
      }

      $(this._element).trigger(Event$a.HIDE);

      if (withoutTimeout) {
        this._close();
      } else {
        this._timeout = setTimeout(function () {
          _this2._close();
        }, this._config.delay);
      }
    };

    _proto.dispose = function dispose() {
      clearTimeout(this._timeout);
      this._timeout = null;

      if (this._element.classList.contains(ClassName$a.SHOW)) {
        this._element.classList.remove(ClassName$a.SHOW);
      }

      $(this._element).off(Event$a.CLICK_DISMISS);
      $.removeData(this._element, DATA_KEY$a);
      this._element = null;
      this._config = null;
    } // Private
    ;

    _proto._getConfig = function _getConfig(config) {
      config = _objectSpread({}, Default$7, $(this._element).data(), typeof config === 'object' && config ? config : {});
      Util.typeCheckConfig(NAME$a, config, this.constructor.DefaultType);
      return config;
    };

    _proto._setListeners = function _setListeners() {
      var _this3 = this;

      $(this._element).on(Event$a.CLICK_DISMISS, Selector$a.DATA_DISMISS, function () {
        return _this3.hide(true);
      });
    };

    _proto._close = function _close() {
      var _this4 = this;

      var complete = function complete() {
        _this4._element.classList.add(ClassName$a.HIDE);

        $(_this4._element).trigger(Event$a.HIDDEN);
      };

      this._element.classList.remove(ClassName$a.SHOW);

      if (this._config.animation) {
        var transitionDuration = Util.getTransitionDurationFromElement(this._element);
        $(this._element).one(Util.TRANSITION_END, complete).emulateTransitionEnd(transitionDuration);
      } else {
        complete();
      }
    } // Static
    ;

    Toast._jQueryInterface = function _jQueryInterface(config) {
      return this.each(function () {
        var $element = $(this);
        var data = $element.data(DATA_KEY$a);

        var _config = typeof config === 'object' && config;

        if (!data) {
          data = new Toast(this, _config);
          $element.data(DATA_KEY$a, data);
        }

        if (typeof config === 'string') {
          if (typeof data[config] === 'undefined') {
            throw new TypeError("No method named \"" + config + "\"");
          }

          data[config](this);
        }
      });
    };

    _createClass(Toast, null, [{
      key: "VERSION",
      get: function get() {
        return VERSION$a;
      }
    }, {
      key: "DefaultType",
      get: function get() {
        return DefaultType$7;
      }
    }, {
      key: "Default",
      get: function get() {
        return Default$7;
      }
    }]);

    return Toast;
  }();
  /**
   * ------------------------------------------------------------------------
   * jQuery
   * ------------------------------------------------------------------------
   */


  $.fn[NAME$a] = Toast._jQueryInterface;
  $.fn[NAME$a].Constructor = Toast;

  $.fn[NAME$a].noConflict = function () {
    $.fn[NAME$a] = JQUERY_NO_CONFLICT$a;
    return Toast._jQueryInterface;
  };

  /**
   * --------------------------------------------------------------------------
   * Bootstrap (v4.3.1): index.js
   * Licensed under MIT (https://github.com/twbs/bootstrap/blob/master/LICENSE)
   * --------------------------------------------------------------------------
   */

  (function () {
    if (typeof $ === 'undefined') {
      throw new TypeError('Bootstrap\'s JavaScript requires jQuery. jQuery must be included before Bootstrap\'s JavaScript.');
    }

    var version = $.fn.jquery.split(' ')[0].split('.');
    var minMajor = 1;
    var ltMajor = 2;
    var minMinor = 9;
    var minPatch = 1;
    var maxMajor = 4;

    if (version[0] < ltMajor && version[1] < minMinor || version[0] === minMajor && version[1] === minMinor && version[2] < minPatch || version[0] >= maxMajor) {
      throw new Error('Bootstrap\'s JavaScript requires at least jQuery v1.9.1 but less than v4.0.0');
    }
  })();

  exports.Util = Util;
  exports.Alert = Alert;
  exports.Button = Button;
  exports.Carousel = Carousel;
  exports.Collapse = Collapse;
  exports.Dropdown = Dropdown;
  exports.Modal = Modal;
  exports.Popover = Popover;
  exports.Scrollspy = ScrollSpy;
  exports.Tab = Tab;
  exports.Toast = Toast;
  exports.Tooltip = Tooltip;

  Object.defineProperty(exports, '__esModule', { value: true });

}));
//# sourceMappingURL=bootstrap.js.map


/***/ }),
/* 24 */
/*!********************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/popper.js/dist/esm/popper.js ***!
  \********************************************************************************************************/
/*! exports provided: default */
/*! all exports used */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
Object.defineProperty(__webpack_exports__, "__esModule", { value: true });
/* WEBPACK VAR INJECTION */(function(global) {/**!
 * @fileOverview Kickass library to create and place poppers near their reference elements.
 * @version 1.14.7
 * @license
 * Copyright (c) 2016 Federico Zivolo and contributors
 *
 * Permission is hereby granted, free of charge, to any person obtaining a copy
 * of this software and associated documentation files (the "Software"), to deal
 * in the Software without restriction, including without limitation the rights
 * to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 * copies of the Software, and to permit persons to whom the Software is
 * furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all
 * copies or substantial portions of the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 * IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 * FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 * LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 * OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 * SOFTWARE.
 */
var isBrowser = typeof window !== 'undefined' && typeof document !== 'undefined';

var longerTimeoutBrowsers = ['Edge', 'Trident', 'Firefox'];
var timeoutDuration = 0;
for (var i = 0; i < longerTimeoutBrowsers.length; i += 1) {
  if (isBrowser && navigator.userAgent.indexOf(longerTimeoutBrowsers[i]) >= 0) {
    timeoutDuration = 1;
    break;
  }
}

function microtaskDebounce(fn) {
  var called = false;
  return function () {
    if (called) {
      return;
    }
    called = true;
    window.Promise.resolve().then(function () {
      called = false;
      fn();
    });
  };
}

function taskDebounce(fn) {
  var scheduled = false;
  return function () {
    if (!scheduled) {
      scheduled = true;
      setTimeout(function () {
        scheduled = false;
        fn();
      }, timeoutDuration);
    }
  };
}

var supportsMicroTasks = isBrowser && window.Promise;

/**
* Create a debounced version of a method, that's asynchronously deferred
* but called in the minimum time possible.
*
* @method
* @memberof Popper.Utils
* @argument {Function} fn
* @returns {Function}
*/
var debounce = supportsMicroTasks ? microtaskDebounce : taskDebounce;

/**
 * Check if the given variable is a function
 * @method
 * @memberof Popper.Utils
 * @argument {Any} functionToCheck - variable to check
 * @returns {Boolean} answer to: is a function?
 */
function isFunction(functionToCheck) {
  var getType = {};
  return functionToCheck && getType.toString.call(functionToCheck) === '[object Function]';
}

/**
 * Get CSS computed property of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Eement} element
 * @argument {String} property
 */
function getStyleComputedProperty(element, property) {
  if (element.nodeType !== 1) {
    return [];
  }
  // NOTE: 1 DOM access here
  var window = element.ownerDocument.defaultView;
  var css = window.getComputedStyle(element, null);
  return property ? css[property] : css;
}

/**
 * Returns the parentNode or the host of the element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} parent
 */
function getParentNode(element) {
  if (element.nodeName === 'HTML') {
    return element;
  }
  return element.parentNode || element.host;
}

/**
 * Returns the scrolling parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} scroll parent
 */
function getScrollParent(element) {
  // Return body, `getScroll` will take care to get the correct `scrollTop` from it
  if (!element) {
    return document.body;
  }

  switch (element.nodeName) {
    case 'HTML':
    case 'BODY':
      return element.ownerDocument.body;
    case '#document':
      return element.body;
  }

  // Firefox want us to check `-x` and `-y` variations as well

  var _getStyleComputedProp = getStyleComputedProperty(element),
      overflow = _getStyleComputedProp.overflow,
      overflowX = _getStyleComputedProp.overflowX,
      overflowY = _getStyleComputedProp.overflowY;

  if (/(auto|scroll|overlay)/.test(overflow + overflowY + overflowX)) {
    return element;
  }

  return getScrollParent(getParentNode(element));
}

var isIE11 = isBrowser && !!(window.MSInputMethodContext && document.documentMode);
var isIE10 = isBrowser && /MSIE 10/.test(navigator.userAgent);

/**
 * Determines if the browser is Internet Explorer
 * @method
 * @memberof Popper.Utils
 * @param {Number} version to check
 * @returns {Boolean} isIE
 */
function isIE(version) {
  if (version === 11) {
    return isIE11;
  }
  if (version === 10) {
    return isIE10;
  }
  return isIE11 || isIE10;
}

/**
 * Returns the offset parent of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} offset parent
 */
function getOffsetParent(element) {
  if (!element) {
    return document.documentElement;
  }

  var noOffsetParent = isIE(10) ? document.body : null;

  // NOTE: 1 DOM access here
  var offsetParent = element.offsetParent || null;
  // Skip hidden elements which don't have an offsetParent
  while (offsetParent === noOffsetParent && element.nextElementSibling) {
    offsetParent = (element = element.nextElementSibling).offsetParent;
  }

  var nodeName = offsetParent && offsetParent.nodeName;

  if (!nodeName || nodeName === 'BODY' || nodeName === 'HTML') {
    return element ? element.ownerDocument.documentElement : document.documentElement;
  }

  // .offsetParent will return the closest TH, TD or TABLE in case
  // no offsetParent is present, I hate this job...
  if (['TH', 'TD', 'TABLE'].indexOf(offsetParent.nodeName) !== -1 && getStyleComputedProperty(offsetParent, 'position') === 'static') {
    return getOffsetParent(offsetParent);
  }

  return offsetParent;
}

function isOffsetContainer(element) {
  var nodeName = element.nodeName;

  if (nodeName === 'BODY') {
    return false;
  }
  return nodeName === 'HTML' || getOffsetParent(element.firstElementChild) === element;
}

/**
 * Finds the root node (document, shadowDOM root) of the given element
 * @method
 * @memberof Popper.Utils
 * @argument {Element} node
 * @returns {Element} root node
 */
function getRoot(node) {
  if (node.parentNode !== null) {
    return getRoot(node.parentNode);
  }

  return node;
}

/**
 * Finds the offset parent common to the two provided nodes
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element1
 * @argument {Element} element2
 * @returns {Element} common offset parent
 */
function findCommonOffsetParent(element1, element2) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element1 || !element1.nodeType || !element2 || !element2.nodeType) {
    return document.documentElement;
  }

  // Here we make sure to give as "start" the element that comes first in the DOM
  var order = element1.compareDocumentPosition(element2) & Node.DOCUMENT_POSITION_FOLLOWING;
  var start = order ? element1 : element2;
  var end = order ? element2 : element1;

  // Get common ancestor container
  var range = document.createRange();
  range.setStart(start, 0);
  range.setEnd(end, 0);
  var commonAncestorContainer = range.commonAncestorContainer;

  // Both nodes are inside #document

  if (element1 !== commonAncestorContainer && element2 !== commonAncestorContainer || start.contains(end)) {
    if (isOffsetContainer(commonAncestorContainer)) {
      return commonAncestorContainer;
    }

    return getOffsetParent(commonAncestorContainer);
  }

  // one of the nodes is inside shadowDOM, find which one
  var element1root = getRoot(element1);
  if (element1root.host) {
    return findCommonOffsetParent(element1root.host, element2);
  } else {
    return findCommonOffsetParent(element1, getRoot(element2).host);
  }
}

/**
 * Gets the scroll value of the given element in the given side (top and left)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {String} side `top` or `left`
 * @returns {number} amount of scrolled pixels
 */
function getScroll(element) {
  var side = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 'top';

  var upperSide = side === 'top' ? 'scrollTop' : 'scrollLeft';
  var nodeName = element.nodeName;

  if (nodeName === 'BODY' || nodeName === 'HTML') {
    var html = element.ownerDocument.documentElement;
    var scrollingElement = element.ownerDocument.scrollingElement || html;
    return scrollingElement[upperSide];
  }

  return element[upperSide];
}

/*
 * Sum or subtract the element scroll values (left and top) from a given rect object
 * @method
 * @memberof Popper.Utils
 * @param {Object} rect - Rect object you want to change
 * @param {HTMLElement} element - The element from the function reads the scroll values
 * @param {Boolean} subtract - set to true if you want to subtract the scroll values
 * @return {Object} rect - The modifier rect object
 */
function includeScroll(rect, element) {
  var subtract = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var scrollTop = getScroll(element, 'top');
  var scrollLeft = getScroll(element, 'left');
  var modifier = subtract ? -1 : 1;
  rect.top += scrollTop * modifier;
  rect.bottom += scrollTop * modifier;
  rect.left += scrollLeft * modifier;
  rect.right += scrollLeft * modifier;
  return rect;
}

/*
 * Helper to detect borders of a given element
 * @method
 * @memberof Popper.Utils
 * @param {CSSStyleDeclaration} styles
 * Result of `getStyleComputedProperty` on the given element
 * @param {String} axis - `x` or `y`
 * @return {number} borders - The borders size of the given axis
 */

function getBordersSize(styles, axis) {
  var sideA = axis === 'x' ? 'Left' : 'Top';
  var sideB = sideA === 'Left' ? 'Right' : 'Bottom';

  return parseFloat(styles['border' + sideA + 'Width'], 10) + parseFloat(styles['border' + sideB + 'Width'], 10);
}

function getSize(axis, body, html, computedStyle) {
  return Math.max(body['offset' + axis], body['scroll' + axis], html['client' + axis], html['offset' + axis], html['scroll' + axis], isIE(10) ? parseInt(html['offset' + axis]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Top' : 'Left')]) + parseInt(computedStyle['margin' + (axis === 'Height' ? 'Bottom' : 'Right')]) : 0);
}

function getWindowSizes(document) {
  var body = document.body;
  var html = document.documentElement;
  var computedStyle = isIE(10) && getComputedStyle(html);

  return {
    height: getSize('Height', body, html, computedStyle),
    width: getSize('Width', body, html, computedStyle)
  };
}

var classCallCheck = function (instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
};

var createClass = function () {
  function defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, descriptor.key, descriptor);
    }
  }

  return function (Constructor, protoProps, staticProps) {
    if (protoProps) defineProperties(Constructor.prototype, protoProps);
    if (staticProps) defineProperties(Constructor, staticProps);
    return Constructor;
  };
}();





var defineProperty = function (obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
};

var _extends = Object.assign || function (target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i];

    for (var key in source) {
      if (Object.prototype.hasOwnProperty.call(source, key)) {
        target[key] = source[key];
      }
    }
  }

  return target;
};

/**
 * Given element offsets, generate an output similar to getBoundingClientRect
 * @method
 * @memberof Popper.Utils
 * @argument {Object} offsets
 * @returns {Object} ClientRect like output
 */
function getClientRect(offsets) {
  return _extends({}, offsets, {
    right: offsets.left + offsets.width,
    bottom: offsets.top + offsets.height
  });
}

/**
 * Get bounding client rect of given element
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} element
 * @return {Object} client rect
 */
function getBoundingClientRect(element) {
  var rect = {};

  // IE10 10 FIX: Please, don't ask, the element isn't
  // considered in DOM in some circumstances...
  // This isn't reproducible in IE10 compatibility mode of IE11
  try {
    if (isIE(10)) {
      rect = element.getBoundingClientRect();
      var scrollTop = getScroll(element, 'top');
      var scrollLeft = getScroll(element, 'left');
      rect.top += scrollTop;
      rect.left += scrollLeft;
      rect.bottom += scrollTop;
      rect.right += scrollLeft;
    } else {
      rect = element.getBoundingClientRect();
    }
  } catch (e) {}

  var result = {
    left: rect.left,
    top: rect.top,
    width: rect.right - rect.left,
    height: rect.bottom - rect.top
  };

  // subtract scrollbar size from sizes
  var sizes = element.nodeName === 'HTML' ? getWindowSizes(element.ownerDocument) : {};
  var width = sizes.width || element.clientWidth || result.right - result.left;
  var height = sizes.height || element.clientHeight || result.bottom - result.top;

  var horizScrollbar = element.offsetWidth - width;
  var vertScrollbar = element.offsetHeight - height;

  // if an hypothetical scrollbar is detected, we must be sure it's not a `border`
  // we make this check conditional for performance reasons
  if (horizScrollbar || vertScrollbar) {
    var styles = getStyleComputedProperty(element);
    horizScrollbar -= getBordersSize(styles, 'x');
    vertScrollbar -= getBordersSize(styles, 'y');

    result.width -= horizScrollbar;
    result.height -= vertScrollbar;
  }

  return getClientRect(result);
}

function getOffsetRectRelativeToArbitraryNode(children, parent) {
  var fixedPosition = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : false;

  var isIE10 = isIE(10);
  var isHTML = parent.nodeName === 'HTML';
  var childrenRect = getBoundingClientRect(children);
  var parentRect = getBoundingClientRect(parent);
  var scrollParent = getScrollParent(children);

  var styles = getStyleComputedProperty(parent);
  var borderTopWidth = parseFloat(styles.borderTopWidth, 10);
  var borderLeftWidth = parseFloat(styles.borderLeftWidth, 10);

  // In cases where the parent is fixed, we must ignore negative scroll in offset calc
  if (fixedPosition && isHTML) {
    parentRect.top = Math.max(parentRect.top, 0);
    parentRect.left = Math.max(parentRect.left, 0);
  }
  var offsets = getClientRect({
    top: childrenRect.top - parentRect.top - borderTopWidth,
    left: childrenRect.left - parentRect.left - borderLeftWidth,
    width: childrenRect.width,
    height: childrenRect.height
  });
  offsets.marginTop = 0;
  offsets.marginLeft = 0;

  // Subtract margins of documentElement in case it's being used as parent
  // we do this only on HTML because it's the only element that behaves
  // differently when margins are applied to it. The margins are included in
  // the box of the documentElement, in the other cases not.
  if (!isIE10 && isHTML) {
    var marginTop = parseFloat(styles.marginTop, 10);
    var marginLeft = parseFloat(styles.marginLeft, 10);

    offsets.top -= borderTopWidth - marginTop;
    offsets.bottom -= borderTopWidth - marginTop;
    offsets.left -= borderLeftWidth - marginLeft;
    offsets.right -= borderLeftWidth - marginLeft;

    // Attach marginTop and marginLeft because in some circumstances we may need them
    offsets.marginTop = marginTop;
    offsets.marginLeft = marginLeft;
  }

  if (isIE10 && !fixedPosition ? parent.contains(scrollParent) : parent === scrollParent && scrollParent.nodeName !== 'BODY') {
    offsets = includeScroll(offsets, parent);
  }

  return offsets;
}

function getViewportOffsetRectRelativeToArtbitraryNode(element) {
  var excludeScroll = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var html = element.ownerDocument.documentElement;
  var relativeOffset = getOffsetRectRelativeToArbitraryNode(element, html);
  var width = Math.max(html.clientWidth, window.innerWidth || 0);
  var height = Math.max(html.clientHeight, window.innerHeight || 0);

  var scrollTop = !excludeScroll ? getScroll(html) : 0;
  var scrollLeft = !excludeScroll ? getScroll(html, 'left') : 0;

  var offset = {
    top: scrollTop - relativeOffset.top + relativeOffset.marginTop,
    left: scrollLeft - relativeOffset.left + relativeOffset.marginLeft,
    width: width,
    height: height
  };

  return getClientRect(offset);
}

/**
 * Check if the given element is fixed or is inside a fixed parent
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @argument {Element} customContainer
 * @returns {Boolean} answer to "isFixed?"
 */
function isFixed(element) {
  var nodeName = element.nodeName;
  if (nodeName === 'BODY' || nodeName === 'HTML') {
    return false;
  }
  if (getStyleComputedProperty(element, 'position') === 'fixed') {
    return true;
  }
  var parentNode = getParentNode(element);
  if (!parentNode) {
    return false;
  }
  return isFixed(parentNode);
}

/**
 * Finds the first parent of an element that has a transformed property defined
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Element} first transformed parent or documentElement
 */

function getFixedPositionOffsetParent(element) {
  // This check is needed to avoid errors in case one of the elements isn't defined for any reason
  if (!element || !element.parentElement || isIE()) {
    return document.documentElement;
  }
  var el = element.parentElement;
  while (el && getStyleComputedProperty(el, 'transform') === 'none') {
    el = el.parentElement;
  }
  return el || document.documentElement;
}

/**
 * Computed the boundaries limits and return them
 * @method
 * @memberof Popper.Utils
 * @param {HTMLElement} popper
 * @param {HTMLElement} reference
 * @param {number} padding
 * @param {HTMLElement} boundariesElement - Element used to define the boundaries
 * @param {Boolean} fixedPosition - Is in fixed position mode
 * @returns {Object} Coordinates of the boundaries
 */
function getBoundaries(popper, reference, padding, boundariesElement) {
  var fixedPosition = arguments.length > 4 && arguments[4] !== undefined ? arguments[4] : false;

  // NOTE: 1 DOM access here

  var boundaries = { top: 0, left: 0 };
  var offsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);

  // Handle viewport case
  if (boundariesElement === 'viewport') {
    boundaries = getViewportOffsetRectRelativeToArtbitraryNode(offsetParent, fixedPosition);
  } else {
    // Handle other cases based on DOM element used as boundaries
    var boundariesNode = void 0;
    if (boundariesElement === 'scrollParent') {
      boundariesNode = getScrollParent(getParentNode(reference));
      if (boundariesNode.nodeName === 'BODY') {
        boundariesNode = popper.ownerDocument.documentElement;
      }
    } else if (boundariesElement === 'window') {
      boundariesNode = popper.ownerDocument.documentElement;
    } else {
      boundariesNode = boundariesElement;
    }

    var offsets = getOffsetRectRelativeToArbitraryNode(boundariesNode, offsetParent, fixedPosition);

    // In case of HTML, we need a different computation
    if (boundariesNode.nodeName === 'HTML' && !isFixed(offsetParent)) {
      var _getWindowSizes = getWindowSizes(popper.ownerDocument),
          height = _getWindowSizes.height,
          width = _getWindowSizes.width;

      boundaries.top += offsets.top - offsets.marginTop;
      boundaries.bottom = height + offsets.top;
      boundaries.left += offsets.left - offsets.marginLeft;
      boundaries.right = width + offsets.left;
    } else {
      // for all the other DOM elements, this one is good
      boundaries = offsets;
    }
  }

  // Add paddings
  padding = padding || 0;
  var isPaddingNumber = typeof padding === 'number';
  boundaries.left += isPaddingNumber ? padding : padding.left || 0;
  boundaries.top += isPaddingNumber ? padding : padding.top || 0;
  boundaries.right -= isPaddingNumber ? padding : padding.right || 0;
  boundaries.bottom -= isPaddingNumber ? padding : padding.bottom || 0;

  return boundaries;
}

function getArea(_ref) {
  var width = _ref.width,
      height = _ref.height;

  return width * height;
}

/**
 * Utility used to transform the `auto` placement to the placement with more
 * available space.
 * @method
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeAutoPlacement(placement, refRect, popper, reference, boundariesElement) {
  var padding = arguments.length > 5 && arguments[5] !== undefined ? arguments[5] : 0;

  if (placement.indexOf('auto') === -1) {
    return placement;
  }

  var boundaries = getBoundaries(popper, reference, padding, boundariesElement);

  var rects = {
    top: {
      width: boundaries.width,
      height: refRect.top - boundaries.top
    },
    right: {
      width: boundaries.right - refRect.right,
      height: boundaries.height
    },
    bottom: {
      width: boundaries.width,
      height: boundaries.bottom - refRect.bottom
    },
    left: {
      width: refRect.left - boundaries.left,
      height: boundaries.height
    }
  };

  var sortedAreas = Object.keys(rects).map(function (key) {
    return _extends({
      key: key
    }, rects[key], {
      area: getArea(rects[key])
    });
  }).sort(function (a, b) {
    return b.area - a.area;
  });

  var filteredAreas = sortedAreas.filter(function (_ref2) {
    var width = _ref2.width,
        height = _ref2.height;
    return width >= popper.clientWidth && height >= popper.clientHeight;
  });

  var computedPlacement = filteredAreas.length > 0 ? filteredAreas[0].key : sortedAreas[0].key;

  var variation = placement.split('-')[1];

  return computedPlacement + (variation ? '-' + variation : '');
}

/**
 * Get offsets to the reference element
 * @method
 * @memberof Popper.Utils
 * @param {Object} state
 * @param {Element} popper - the popper element
 * @param {Element} reference - the reference element (the popper will be relative to this)
 * @param {Element} fixedPosition - is in fixed position mode
 * @returns {Object} An object containing the offsets which will be applied to the popper
 */
function getReferenceOffsets(state, popper, reference) {
  var fixedPosition = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : null;

  var commonOffsetParent = fixedPosition ? getFixedPositionOffsetParent(popper) : findCommonOffsetParent(popper, reference);
  return getOffsetRectRelativeToArbitraryNode(reference, commonOffsetParent, fixedPosition);
}

/**
 * Get the outer sizes of the given element (offset size + margins)
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element
 * @returns {Object} object containing width and height properties
 */
function getOuterSizes(element) {
  var window = element.ownerDocument.defaultView;
  var styles = window.getComputedStyle(element);
  var x = parseFloat(styles.marginTop || 0) + parseFloat(styles.marginBottom || 0);
  var y = parseFloat(styles.marginLeft || 0) + parseFloat(styles.marginRight || 0);
  var result = {
    width: element.offsetWidth + y,
    height: element.offsetHeight + x
  };
  return result;
}

/**
 * Get the opposite placement of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement
 * @returns {String} flipped placement
 */
function getOppositePlacement(placement) {
  var hash = { left: 'right', right: 'left', bottom: 'top', top: 'bottom' };
  return placement.replace(/left|right|bottom|top/g, function (matched) {
    return hash[matched];
  });
}

/**
 * Get offsets to the popper
 * @method
 * @memberof Popper.Utils
 * @param {Object} position - CSS position the Popper will get applied
 * @param {HTMLElement} popper - the popper element
 * @param {Object} referenceOffsets - the reference offsets (the popper will be relative to this)
 * @param {String} placement - one of the valid placement options
 * @returns {Object} popperOffsets - An object containing the offsets which will be applied to the popper
 */
function getPopperOffsets(popper, referenceOffsets, placement) {
  placement = placement.split('-')[0];

  // Get popper node sizes
  var popperRect = getOuterSizes(popper);

  // Add position, width and height to our offsets object
  var popperOffsets = {
    width: popperRect.width,
    height: popperRect.height
  };

  // depending by the popper placement we have to compute its offsets slightly differently
  var isHoriz = ['right', 'left'].indexOf(placement) !== -1;
  var mainSide = isHoriz ? 'top' : 'left';
  var secondarySide = isHoriz ? 'left' : 'top';
  var measurement = isHoriz ? 'height' : 'width';
  var secondaryMeasurement = !isHoriz ? 'height' : 'width';

  popperOffsets[mainSide] = referenceOffsets[mainSide] + referenceOffsets[measurement] / 2 - popperRect[measurement] / 2;
  if (placement === secondarySide) {
    popperOffsets[secondarySide] = referenceOffsets[secondarySide] - popperRect[secondaryMeasurement];
  } else {
    popperOffsets[secondarySide] = referenceOffsets[getOppositePlacement(secondarySide)];
  }

  return popperOffsets;
}

/**
 * Mimics the `find` method of Array
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function find(arr, check) {
  // use native find if supported
  if (Array.prototype.find) {
    return arr.find(check);
  }

  // use `filter` to obtain the same behavior of `find`
  return arr.filter(check)[0];
}

/**
 * Return the index of the matching object
 * @method
 * @memberof Popper.Utils
 * @argument {Array} arr
 * @argument prop
 * @argument value
 * @returns index or -1
 */
function findIndex(arr, prop, value) {
  // use native findIndex if supported
  if (Array.prototype.findIndex) {
    return arr.findIndex(function (cur) {
      return cur[prop] === value;
    });
  }

  // use `find` + `indexOf` if `findIndex` isn't supported
  var match = find(arr, function (obj) {
    return obj[prop] === value;
  });
  return arr.indexOf(match);
}

/**
 * Loop trough the list of modifiers and run them in order,
 * each of them will then edit the data object.
 * @method
 * @memberof Popper.Utils
 * @param {dataObject} data
 * @param {Array} modifiers
 * @param {String} ends - Optional modifier name used as stopper
 * @returns {dataObject}
 */
function runModifiers(modifiers, data, ends) {
  var modifiersToRun = ends === undefined ? modifiers : modifiers.slice(0, findIndex(modifiers, 'name', ends));

  modifiersToRun.forEach(function (modifier) {
    if (modifier['function']) {
      // eslint-disable-line dot-notation
      console.warn('`modifier.function` is deprecated, use `modifier.fn`!');
    }
    var fn = modifier['function'] || modifier.fn; // eslint-disable-line dot-notation
    if (modifier.enabled && isFunction(fn)) {
      // Add properties to offsets to make them a complete clientRect object
      // we do this before each modifier to make sure the previous one doesn't
      // mess with these values
      data.offsets.popper = getClientRect(data.offsets.popper);
      data.offsets.reference = getClientRect(data.offsets.reference);

      data = fn(data, modifier);
    }
  });

  return data;
}

/**
 * Updates the position of the popper, computing the new offsets and applying
 * the new style.<br />
 * Prefer `scheduleUpdate` over `update` because of performance reasons.
 * @method
 * @memberof Popper
 */
function update() {
  // if popper is destroyed, don't perform any further update
  if (this.state.isDestroyed) {
    return;
  }

  var data = {
    instance: this,
    styles: {},
    arrowStyles: {},
    attributes: {},
    flipped: false,
    offsets: {}
  };

  // compute reference element offsets
  data.offsets.reference = getReferenceOffsets(this.state, this.popper, this.reference, this.options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  data.placement = computeAutoPlacement(this.options.placement, data.offsets.reference, this.popper, this.reference, this.options.modifiers.flip.boundariesElement, this.options.modifiers.flip.padding);

  // store the computed placement inside `originalPlacement`
  data.originalPlacement = data.placement;

  data.positionFixed = this.options.positionFixed;

  // compute the popper offsets
  data.offsets.popper = getPopperOffsets(this.popper, data.offsets.reference, data.placement);

  data.offsets.popper.position = this.options.positionFixed ? 'fixed' : 'absolute';

  // run the modifiers
  data = runModifiers(this.modifiers, data);

  // the first `update` will call `onCreate` callback
  // the other ones will call `onUpdate` callback
  if (!this.state.isCreated) {
    this.state.isCreated = true;
    this.options.onCreate(data);
  } else {
    this.options.onUpdate(data);
  }
}

/**
 * Helper used to know if the given modifier is enabled.
 * @method
 * @memberof Popper.Utils
 * @returns {Boolean}
 */
function isModifierEnabled(modifiers, modifierName) {
  return modifiers.some(function (_ref) {
    var name = _ref.name,
        enabled = _ref.enabled;
    return enabled && name === modifierName;
  });
}

/**
 * Get the prefixed supported property name
 * @method
 * @memberof Popper.Utils
 * @argument {String} property (camelCase)
 * @returns {String} prefixed property (camelCase or PascalCase, depending on the vendor prefix)
 */
function getSupportedPropertyName(property) {
  var prefixes = [false, 'ms', 'Webkit', 'Moz', 'O'];
  var upperProp = property.charAt(0).toUpperCase() + property.slice(1);

  for (var i = 0; i < prefixes.length; i++) {
    var prefix = prefixes[i];
    var toCheck = prefix ? '' + prefix + upperProp : property;
    if (typeof document.body.style[toCheck] !== 'undefined') {
      return toCheck;
    }
  }
  return null;
}

/**
 * Destroys the popper.
 * @method
 * @memberof Popper
 */
function destroy() {
  this.state.isDestroyed = true;

  // touch DOM only if `applyStyle` modifier is enabled
  if (isModifierEnabled(this.modifiers, 'applyStyle')) {
    this.popper.removeAttribute('x-placement');
    this.popper.style.position = '';
    this.popper.style.top = '';
    this.popper.style.left = '';
    this.popper.style.right = '';
    this.popper.style.bottom = '';
    this.popper.style.willChange = '';
    this.popper.style[getSupportedPropertyName('transform')] = '';
  }

  this.disableEventListeners();

  // remove the popper if user explicity asked for the deletion on destroy
  // do not use `remove` because IE11 doesn't support it
  if (this.options.removeOnDestroy) {
    this.popper.parentNode.removeChild(this.popper);
  }
  return this;
}

/**
 * Get the window associated with the element
 * @argument {Element} element
 * @returns {Window}
 */
function getWindow(element) {
  var ownerDocument = element.ownerDocument;
  return ownerDocument ? ownerDocument.defaultView : window;
}

function attachToScrollParents(scrollParent, event, callback, scrollParents) {
  var isBody = scrollParent.nodeName === 'BODY';
  var target = isBody ? scrollParent.ownerDocument.defaultView : scrollParent;
  target.addEventListener(event, callback, { passive: true });

  if (!isBody) {
    attachToScrollParents(getScrollParent(target.parentNode), event, callback, scrollParents);
  }
  scrollParents.push(target);
}

/**
 * Setup needed event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function setupEventListeners(reference, options, state, updateBound) {
  // Resize event listener on window
  state.updateBound = updateBound;
  getWindow(reference).addEventListener('resize', state.updateBound, { passive: true });

  // Scroll event listener on scroll parents
  var scrollElement = getScrollParent(reference);
  attachToScrollParents(scrollElement, 'scroll', state.updateBound, state.scrollParents);
  state.scrollElement = scrollElement;
  state.eventsEnabled = true;

  return state;
}

/**
 * It will add resize/scroll events and start recalculating
 * position of the popper element when they are triggered.
 * @method
 * @memberof Popper
 */
function enableEventListeners() {
  if (!this.state.eventsEnabled) {
    this.state = setupEventListeners(this.reference, this.options, this.state, this.scheduleUpdate);
  }
}

/**
 * Remove event listeners used to update the popper position
 * @method
 * @memberof Popper.Utils
 * @private
 */
function removeEventListeners(reference, state) {
  // Remove resize event listener on window
  getWindow(reference).removeEventListener('resize', state.updateBound);

  // Remove scroll event listener on scroll parents
  state.scrollParents.forEach(function (target) {
    target.removeEventListener('scroll', state.updateBound);
  });

  // Reset state
  state.updateBound = null;
  state.scrollParents = [];
  state.scrollElement = null;
  state.eventsEnabled = false;
  return state;
}

/**
 * It will remove resize/scroll events and won't recalculate popper position
 * when they are triggered. It also won't trigger `onUpdate` callback anymore,
 * unless you call `update` method manually.
 * @method
 * @memberof Popper
 */
function disableEventListeners() {
  if (this.state.eventsEnabled) {
    cancelAnimationFrame(this.scheduleUpdate);
    this.state = removeEventListeners(this.reference, this.state);
  }
}

/**
 * Tells if a given input is a number
 * @method
 * @memberof Popper.Utils
 * @param {*} input to check
 * @return {Boolean}
 */
function isNumeric(n) {
  return n !== '' && !isNaN(parseFloat(n)) && isFinite(n);
}

/**
 * Set the style to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the style to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setStyles(element, styles) {
  Object.keys(styles).forEach(function (prop) {
    var unit = '';
    // add unit if the value is numeric and is one of the following
    if (['width', 'height', 'top', 'right', 'bottom', 'left'].indexOf(prop) !== -1 && isNumeric(styles[prop])) {
      unit = 'px';
    }
    element.style[prop] = styles[prop] + unit;
  });
}

/**
 * Set the attributes to the given popper
 * @method
 * @memberof Popper.Utils
 * @argument {Element} element - Element to apply the attributes to
 * @argument {Object} styles
 * Object with a list of properties and values which will be applied to the element
 */
function setAttributes(element, attributes) {
  Object.keys(attributes).forEach(function (prop) {
    var value = attributes[prop];
    if (value !== false) {
      element.setAttribute(prop, attributes[prop]);
    } else {
      element.removeAttribute(prop);
    }
  });
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} data.styles - List of style properties - values to apply to popper element
 * @argument {Object} data.attributes - List of attribute properties - values to apply to popper element
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The same data object
 */
function applyStyle(data) {
  // any property present in `data.styles` will be applied to the popper,
  // in this way we can make the 3rd party modifiers add custom styles to it
  // Be aware, modifiers could override the properties defined in the previous
  // lines of this modifier!
  setStyles(data.instance.popper, data.styles);

  // any property present in `data.attributes` will be applied to the popper,
  // they will be set as HTML attributes of the element
  setAttributes(data.instance.popper, data.attributes);

  // if arrowElement is defined and arrowStyles has some properties
  if (data.arrowElement && Object.keys(data.arrowStyles).length) {
    setStyles(data.arrowElement, data.arrowStyles);
  }

  return data;
}

/**
 * Set the x-placement attribute before everything else because it could be used
 * to add margins to the popper margins needs to be calculated to get the
 * correct popper offsets.
 * @method
 * @memberof Popper.modifiers
 * @param {HTMLElement} reference - The reference element used to position the popper
 * @param {HTMLElement} popper - The HTML element used as popper
 * @param {Object} options - Popper.js options
 */
function applyStyleOnLoad(reference, popper, options, modifierOptions, state) {
  // compute reference element offsets
  var referenceOffsets = getReferenceOffsets(state, popper, reference, options.positionFixed);

  // compute auto placement, store placement inside the data object,
  // modifiers will be able to edit `placement` if needed
  // and refer to originalPlacement to know the original value
  var placement = computeAutoPlacement(options.placement, referenceOffsets, popper, reference, options.modifiers.flip.boundariesElement, options.modifiers.flip.padding);

  popper.setAttribute('x-placement', placement);

  // Apply `position` to popper before anything else because
  // without the position applied we can't guarantee correct computations
  setStyles(popper, { position: options.positionFixed ? 'fixed' : 'absolute' });

  return options;
}

/**
 * @function
 * @memberof Popper.Utils
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Boolean} shouldRound - If the offsets should be rounded at all
 * @returns {Object} The popper's position offsets rounded
 *
 * The tale of pixel-perfect positioning. It's still not 100% perfect, but as
 * good as it can be within reason.
 * Discussion here: https://github.com/FezVrasta/popper.js/pull/715
 *
 * Low DPI screens cause a popper to be blurry if not using full pixels (Safari
 * as well on High DPI screens).
 *
 * Firefox prefers no rounding for positioning and does not have blurriness on
 * high DPI screens.
 *
 * Only horizontal placement and left/right values need to be considered.
 */
function getRoundedOffsets(data, shouldRound) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;
  var round = Math.round,
      floor = Math.floor;

  var noRound = function noRound(v) {
    return v;
  };

  var referenceWidth = round(reference.width);
  var popperWidth = round(popper.width);

  var isVertical = ['left', 'right'].indexOf(data.placement) !== -1;
  var isVariation = data.placement.indexOf('-') !== -1;
  var sameWidthParity = referenceWidth % 2 === popperWidth % 2;
  var bothOddWidth = referenceWidth % 2 === 1 && popperWidth % 2 === 1;

  var horizontalToInteger = !shouldRound ? noRound : isVertical || isVariation || sameWidthParity ? round : floor;
  var verticalToInteger = !shouldRound ? noRound : round;

  return {
    left: horizontalToInteger(bothOddWidth && !isVariation && shouldRound ? popper.left - 1 : popper.left),
    top: verticalToInteger(popper.top),
    bottom: verticalToInteger(popper.bottom),
    right: horizontalToInteger(popper.right)
  };
}

var isFirefox = isBrowser && /Firefox/i.test(navigator.userAgent);

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function computeStyle(data, options) {
  var x = options.x,
      y = options.y;
  var popper = data.offsets.popper;

  // Remove this legacy support in Popper.js v2

  var legacyGpuAccelerationOption = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'applyStyle';
  }).gpuAcceleration;
  if (legacyGpuAccelerationOption !== undefined) {
    console.warn('WARNING: `gpuAcceleration` option moved to `computeStyle` modifier and will not be supported in future versions of Popper.js!');
  }
  var gpuAcceleration = legacyGpuAccelerationOption !== undefined ? legacyGpuAccelerationOption : options.gpuAcceleration;

  var offsetParent = getOffsetParent(data.instance.popper);
  var offsetParentRect = getBoundingClientRect(offsetParent);

  // Styles
  var styles = {
    position: popper.position
  };

  var offsets = getRoundedOffsets(data, window.devicePixelRatio < 2 || !isFirefox);

  var sideA = x === 'bottom' ? 'top' : 'bottom';
  var sideB = y === 'right' ? 'left' : 'right';

  // if gpuAcceleration is set to `true` and transform is supported,
  //  we use `translate3d` to apply the position to the popper we
  // automatically use the supported prefixed version if needed
  var prefixedProperty = getSupportedPropertyName('transform');

  // now, let's make a step back and look at this code closely (wtf?)
  // If the content of the popper grows once it's been positioned, it
  // may happen that the popper gets misplaced because of the new content
  // overflowing its reference element
  // To avoid this problem, we provide two options (x and y), which allow
  // the consumer to define the offset origin.
  // If we position a popper on top of a reference element, we can set
  // `x` to `top` to make the popper grow towards its top instead of
  // its bottom.
  var left = void 0,
      top = void 0;
  if (sideA === 'bottom') {
    // when offsetParent is <html> the positioning is relative to the bottom of the screen (excluding the scrollbar)
    // and not the bottom of the html element
    if (offsetParent.nodeName === 'HTML') {
      top = -offsetParent.clientHeight + offsets.bottom;
    } else {
      top = -offsetParentRect.height + offsets.bottom;
    }
  } else {
    top = offsets.top;
  }
  if (sideB === 'right') {
    if (offsetParent.nodeName === 'HTML') {
      left = -offsetParent.clientWidth + offsets.right;
    } else {
      left = -offsetParentRect.width + offsets.right;
    }
  } else {
    left = offsets.left;
  }
  if (gpuAcceleration && prefixedProperty) {
    styles[prefixedProperty] = 'translate3d(' + left + 'px, ' + top + 'px, 0)';
    styles[sideA] = 0;
    styles[sideB] = 0;
    styles.willChange = 'transform';
  } else {
    // othwerise, we use the standard `top`, `left`, `bottom` and `right` properties
    var invertTop = sideA === 'bottom' ? -1 : 1;
    var invertLeft = sideB === 'right' ? -1 : 1;
    styles[sideA] = top * invertTop;
    styles[sideB] = left * invertLeft;
    styles.willChange = sideA + ', ' + sideB;
  }

  // Attributes
  var attributes = {
    'x-placement': data.placement
  };

  // Update `data` attributes, styles and arrowStyles
  data.attributes = _extends({}, attributes, data.attributes);
  data.styles = _extends({}, styles, data.styles);
  data.arrowStyles = _extends({}, data.offsets.arrow, data.arrowStyles);

  return data;
}

/**
 * Helper used to know if the given modifier depends from another one.<br />
 * It checks if the needed modifier is listed and enabled.
 * @method
 * @memberof Popper.Utils
 * @param {Array} modifiers - list of modifiers
 * @param {String} requestingName - name of requesting modifier
 * @param {String} requestedName - name of requested modifier
 * @returns {Boolean}
 */
function isModifierRequired(modifiers, requestingName, requestedName) {
  var requesting = find(modifiers, function (_ref) {
    var name = _ref.name;
    return name === requestingName;
  });

  var isRequired = !!requesting && modifiers.some(function (modifier) {
    return modifier.name === requestedName && modifier.enabled && modifier.order < requesting.order;
  });

  if (!isRequired) {
    var _requesting = '`' + requestingName + '`';
    var requested = '`' + requestedName + '`';
    console.warn(requested + ' modifier is required by ' + _requesting + ' modifier in order to work, be sure to include it before ' + _requesting + '!');
  }
  return isRequired;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function arrow(data, options) {
  var _data$offsets$arrow;

  // arrow depends on keepTogether in order to work
  if (!isModifierRequired(data.instance.modifiers, 'arrow', 'keepTogether')) {
    return data;
  }

  var arrowElement = options.element;

  // if arrowElement is a string, suppose it's a CSS selector
  if (typeof arrowElement === 'string') {
    arrowElement = data.instance.popper.querySelector(arrowElement);

    // if arrowElement is not found, don't run the modifier
    if (!arrowElement) {
      return data;
    }
  } else {
    // if the arrowElement isn't a query selector we must check that the
    // provided DOM node is child of its popper node
    if (!data.instance.popper.contains(arrowElement)) {
      console.warn('WARNING: `arrow.element` must be child of its popper element!');
      return data;
    }
  }

  var placement = data.placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isVertical = ['left', 'right'].indexOf(placement) !== -1;

  var len = isVertical ? 'height' : 'width';
  var sideCapitalized = isVertical ? 'Top' : 'Left';
  var side = sideCapitalized.toLowerCase();
  var altSide = isVertical ? 'left' : 'top';
  var opSide = isVertical ? 'bottom' : 'right';
  var arrowElementSize = getOuterSizes(arrowElement)[len];

  //
  // extends keepTogether behavior making sure the popper and its
  // reference have enough pixels in conjunction
  //

  // top/left side
  if (reference[opSide] - arrowElementSize < popper[side]) {
    data.offsets.popper[side] -= popper[side] - (reference[opSide] - arrowElementSize);
  }
  // bottom/right side
  if (reference[side] + arrowElementSize > popper[opSide]) {
    data.offsets.popper[side] += reference[side] + arrowElementSize - popper[opSide];
  }
  data.offsets.popper = getClientRect(data.offsets.popper);

  // compute center of the popper
  var center = reference[side] + reference[len] / 2 - arrowElementSize / 2;

  // Compute the sideValue using the updated popper offsets
  // take popper margin in account because we don't have this info available
  var css = getStyleComputedProperty(data.instance.popper);
  var popperMarginSide = parseFloat(css['margin' + sideCapitalized], 10);
  var popperBorderSide = parseFloat(css['border' + sideCapitalized + 'Width'], 10);
  var sideValue = center - data.offsets.popper[side] - popperMarginSide - popperBorderSide;

  // prevent arrowElement from being placed not contiguously to its popper
  sideValue = Math.max(Math.min(popper[len] - arrowElementSize, sideValue), 0);

  data.arrowElement = arrowElement;
  data.offsets.arrow = (_data$offsets$arrow = {}, defineProperty(_data$offsets$arrow, side, Math.round(sideValue)), defineProperty(_data$offsets$arrow, altSide, ''), _data$offsets$arrow);

  return data;
}

/**
 * Get the opposite placement variation of the given one
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement variation
 * @returns {String} flipped placement variation
 */
function getOppositeVariation(variation) {
  if (variation === 'end') {
    return 'start';
  } else if (variation === 'start') {
    return 'end';
  }
  return variation;
}

/**
 * List of accepted placements to use as values of the `placement` option.<br />
 * Valid placements are:
 * - `auto`
 * - `top`
 * - `right`
 * - `bottom`
 * - `left`
 *
 * Each placement can have a variation from this list:
 * - `-start`
 * - `-end`
 *
 * Variations are interpreted easily if you think of them as the left to right
 * written languages. Horizontally (`top` and `bottom`), `start` is left and `end`
 * is right.<br />
 * Vertically (`left` and `right`), `start` is top and `end` is bottom.
 *
 * Some valid examples are:
 * - `top-end` (on top of reference, right aligned)
 * - `right-start` (on right of reference, top aligned)
 * - `bottom` (on bottom, centered)
 * - `auto-end` (on the side with more space available, alignment depends by placement)
 *
 * @static
 * @type {Array}
 * @enum {String}
 * @readonly
 * @method placements
 * @memberof Popper
 */
var placements = ['auto-start', 'auto', 'auto-end', 'top-start', 'top', 'top-end', 'right-start', 'right', 'right-end', 'bottom-end', 'bottom', 'bottom-start', 'left-end', 'left', 'left-start'];

// Get rid of `auto` `auto-start` and `auto-end`
var validPlacements = placements.slice(3);

/**
 * Given an initial placement, returns all the subsequent placements
 * clockwise (or counter-clockwise).
 *
 * @method
 * @memberof Popper.Utils
 * @argument {String} placement - A valid placement (it accepts variations)
 * @argument {Boolean} counter - Set to true to walk the placements counterclockwise
 * @returns {Array} placements including their variations
 */
function clockwise(placement) {
  var counter = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : false;

  var index = validPlacements.indexOf(placement);
  var arr = validPlacements.slice(index + 1).concat(validPlacements.slice(0, index));
  return counter ? arr.reverse() : arr;
}

var BEHAVIORS = {
  FLIP: 'flip',
  CLOCKWISE: 'clockwise',
  COUNTERCLOCKWISE: 'counterclockwise'
};

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function flip(data, options) {
  // if `inner` modifier is enabled, we can't use the `flip` modifier
  if (isModifierEnabled(data.instance.modifiers, 'inner')) {
    return data;
  }

  if (data.flipped && data.placement === data.originalPlacement) {
    // seems like flip is trying to loop, probably there's not enough space on any of the flippable sides
    return data;
  }

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, options.boundariesElement, data.positionFixed);

  var placement = data.placement.split('-')[0];
  var placementOpposite = getOppositePlacement(placement);
  var variation = data.placement.split('-')[1] || '';

  var flipOrder = [];

  switch (options.behavior) {
    case BEHAVIORS.FLIP:
      flipOrder = [placement, placementOpposite];
      break;
    case BEHAVIORS.CLOCKWISE:
      flipOrder = clockwise(placement);
      break;
    case BEHAVIORS.COUNTERCLOCKWISE:
      flipOrder = clockwise(placement, true);
      break;
    default:
      flipOrder = options.behavior;
  }

  flipOrder.forEach(function (step, index) {
    if (placement !== step || flipOrder.length === index + 1) {
      return data;
    }

    placement = data.placement.split('-')[0];
    placementOpposite = getOppositePlacement(placement);

    var popperOffsets = data.offsets.popper;
    var refOffsets = data.offsets.reference;

    // using floor because the reference offsets may contain decimals we are not going to consider here
    var floor = Math.floor;
    var overlapsRef = placement === 'left' && floor(popperOffsets.right) > floor(refOffsets.left) || placement === 'right' && floor(popperOffsets.left) < floor(refOffsets.right) || placement === 'top' && floor(popperOffsets.bottom) > floor(refOffsets.top) || placement === 'bottom' && floor(popperOffsets.top) < floor(refOffsets.bottom);

    var overflowsLeft = floor(popperOffsets.left) < floor(boundaries.left);
    var overflowsRight = floor(popperOffsets.right) > floor(boundaries.right);
    var overflowsTop = floor(popperOffsets.top) < floor(boundaries.top);
    var overflowsBottom = floor(popperOffsets.bottom) > floor(boundaries.bottom);

    var overflowsBoundaries = placement === 'left' && overflowsLeft || placement === 'right' && overflowsRight || placement === 'top' && overflowsTop || placement === 'bottom' && overflowsBottom;

    // flip the variation if required
    var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
    var flippedVariation = !!options.flipVariations && (isVertical && variation === 'start' && overflowsLeft || isVertical && variation === 'end' && overflowsRight || !isVertical && variation === 'start' && overflowsTop || !isVertical && variation === 'end' && overflowsBottom);

    if (overlapsRef || overflowsBoundaries || flippedVariation) {
      // this boolean to detect any flip loop
      data.flipped = true;

      if (overlapsRef || overflowsBoundaries) {
        placement = flipOrder[index + 1];
      }

      if (flippedVariation) {
        variation = getOppositeVariation(variation);
      }

      data.placement = placement + (variation ? '-' + variation : '');

      // this object contains `position`, we want to preserve it along with
      // any additional property we may add in the future
      data.offsets.popper = _extends({}, data.offsets.popper, getPopperOffsets(data.instance.popper, data.offsets.reference, data.placement));

      data = runModifiers(data.instance.modifiers, data, 'flip');
    }
  });
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function keepTogether(data) {
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var placement = data.placement.split('-')[0];
  var floor = Math.floor;
  var isVertical = ['top', 'bottom'].indexOf(placement) !== -1;
  var side = isVertical ? 'right' : 'bottom';
  var opSide = isVertical ? 'left' : 'top';
  var measurement = isVertical ? 'width' : 'height';

  if (popper[side] < floor(reference[opSide])) {
    data.offsets.popper[opSide] = floor(reference[opSide]) - popper[measurement];
  }
  if (popper[opSide] > floor(reference[side])) {
    data.offsets.popper[opSide] = floor(reference[side]);
  }

  return data;
}

/**
 * Converts a string containing value + unit into a px value number
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} str - Value + unit string
 * @argument {String} measurement - `height` or `width`
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @returns {Number|String}
 * Value in pixels, or original string if no values were extracted
 */
function toValue(str, measurement, popperOffsets, referenceOffsets) {
  // separate value from unit
  var split = str.match(/((?:\-|\+)?\d*\.?\d*)(.*)/);
  var value = +split[1];
  var unit = split[2];

  // If it's not a number it's an operator, I guess
  if (!value) {
    return str;
  }

  if (unit.indexOf('%') === 0) {
    var element = void 0;
    switch (unit) {
      case '%p':
        element = popperOffsets;
        break;
      case '%':
      case '%r':
      default:
        element = referenceOffsets;
    }

    var rect = getClientRect(element);
    return rect[measurement] / 100 * value;
  } else if (unit === 'vh' || unit === 'vw') {
    // if is a vh or vw, we calculate the size based on the viewport
    var size = void 0;
    if (unit === 'vh') {
      size = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
    } else {
      size = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    }
    return size / 100 * value;
  } else {
    // if is an explicit pixel unit, we get rid of the unit and keep the value
    // if is an implicit unit, it's px, and we return just the value
    return value;
  }
}

/**
 * Parse an `offset` string to extrapolate `x` and `y` numeric offsets.
 * @function
 * @memberof {modifiers~offset}
 * @private
 * @argument {String} offset
 * @argument {Object} popperOffsets
 * @argument {Object} referenceOffsets
 * @argument {String} basePlacement
 * @returns {Array} a two cells array with x and y offsets in numbers
 */
function parseOffset(offset, popperOffsets, referenceOffsets, basePlacement) {
  var offsets = [0, 0];

  // Use height if placement is left or right and index is 0 otherwise use width
  // in this way the first offset will use an axis and the second one
  // will use the other one
  var useHeight = ['right', 'left'].indexOf(basePlacement) !== -1;

  // Split the offset string to obtain a list of values and operands
  // The regex addresses values with the plus or minus sign in front (+10, -20, etc)
  var fragments = offset.split(/(\+|\-)/).map(function (frag) {
    return frag.trim();
  });

  // Detect if the offset string contains a pair of values or a single one
  // they could be separated by comma or space
  var divider = fragments.indexOf(find(fragments, function (frag) {
    return frag.search(/,|\s/) !== -1;
  }));

  if (fragments[divider] && fragments[divider].indexOf(',') === -1) {
    console.warn('Offsets separated by white space(s) are deprecated, use a comma (,) instead.');
  }

  // If divider is found, we divide the list of values and operands to divide
  // them by ofset X and Y.
  var splitRegex = /\s*,\s*|\s+/;
  var ops = divider !== -1 ? [fragments.slice(0, divider).concat([fragments[divider].split(splitRegex)[0]]), [fragments[divider].split(splitRegex)[1]].concat(fragments.slice(divider + 1))] : [fragments];

  // Convert the values with units to absolute pixels to allow our computations
  ops = ops.map(function (op, index) {
    // Most of the units rely on the orientation of the popper
    var measurement = (index === 1 ? !useHeight : useHeight) ? 'height' : 'width';
    var mergeWithPrevious = false;
    return op
    // This aggregates any `+` or `-` sign that aren't considered operators
    // e.g.: 10 + +5 => [10, +, +5]
    .reduce(function (a, b) {
      if (a[a.length - 1] === '' && ['+', '-'].indexOf(b) !== -1) {
        a[a.length - 1] = b;
        mergeWithPrevious = true;
        return a;
      } else if (mergeWithPrevious) {
        a[a.length - 1] += b;
        mergeWithPrevious = false;
        return a;
      } else {
        return a.concat(b);
      }
    }, [])
    // Here we convert the string values into number values (in px)
    .map(function (str) {
      return toValue(str, measurement, popperOffsets, referenceOffsets);
    });
  });

  // Loop trough the offsets arrays and execute the operations
  ops.forEach(function (op, index) {
    op.forEach(function (frag, index2) {
      if (isNumeric(frag)) {
        offsets[index] += frag * (op[index2 - 1] === '-' ? -1 : 1);
      }
    });
  });
  return offsets;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @argument {Number|String} options.offset=0
 * The offset value as described in the modifier description
 * @returns {Object} The data object, properly modified
 */
function offset(data, _ref) {
  var offset = _ref.offset;
  var placement = data.placement,
      _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var basePlacement = placement.split('-')[0];

  var offsets = void 0;
  if (isNumeric(+offset)) {
    offsets = [+offset, 0];
  } else {
    offsets = parseOffset(offset, popper, reference, basePlacement);
  }

  if (basePlacement === 'left') {
    popper.top += offsets[0];
    popper.left -= offsets[1];
  } else if (basePlacement === 'right') {
    popper.top += offsets[0];
    popper.left += offsets[1];
  } else if (basePlacement === 'top') {
    popper.left += offsets[0];
    popper.top -= offsets[1];
  } else if (basePlacement === 'bottom') {
    popper.left += offsets[0];
    popper.top += offsets[1];
  }

  data.popper = popper;
  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function preventOverflow(data, options) {
  var boundariesElement = options.boundariesElement || getOffsetParent(data.instance.popper);

  // If offsetParent is the reference element, we really want to
  // go one step up and use the next offsetParent as reference to
  // avoid to make this modifier completely useless and look like broken
  if (data.instance.reference === boundariesElement) {
    boundariesElement = getOffsetParent(boundariesElement);
  }

  // NOTE: DOM access here
  // resets the popper's position so that the document size can be calculated excluding
  // the size of the popper element itself
  var transformProp = getSupportedPropertyName('transform');
  var popperStyles = data.instance.popper.style; // assignment to help minification
  var top = popperStyles.top,
      left = popperStyles.left,
      transform = popperStyles[transformProp];

  popperStyles.top = '';
  popperStyles.left = '';
  popperStyles[transformProp] = '';

  var boundaries = getBoundaries(data.instance.popper, data.instance.reference, options.padding, boundariesElement, data.positionFixed);

  // NOTE: DOM access here
  // restores the original style properties after the offsets have been computed
  popperStyles.top = top;
  popperStyles.left = left;
  popperStyles[transformProp] = transform;

  options.boundaries = boundaries;

  var order = options.priority;
  var popper = data.offsets.popper;

  var check = {
    primary: function primary(placement) {
      var value = popper[placement];
      if (popper[placement] < boundaries[placement] && !options.escapeWithReference) {
        value = Math.max(popper[placement], boundaries[placement]);
      }
      return defineProperty({}, placement, value);
    },
    secondary: function secondary(placement) {
      var mainSide = placement === 'right' ? 'left' : 'top';
      var value = popper[mainSide];
      if (popper[placement] > boundaries[placement] && !options.escapeWithReference) {
        value = Math.min(popper[mainSide], boundaries[placement] - (placement === 'right' ? popper.width : popper.height));
      }
      return defineProperty({}, mainSide, value);
    }
  };

  order.forEach(function (placement) {
    var side = ['left', 'top'].indexOf(placement) !== -1 ? 'primary' : 'secondary';
    popper = _extends({}, popper, check[side](placement));
  });

  data.offsets.popper = popper;

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function shift(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var shiftvariation = placement.split('-')[1];

  // if shift shiftvariation is specified, run the modifier
  if (shiftvariation) {
    var _data$offsets = data.offsets,
        reference = _data$offsets.reference,
        popper = _data$offsets.popper;

    var isVertical = ['bottom', 'top'].indexOf(basePlacement) !== -1;
    var side = isVertical ? 'left' : 'top';
    var measurement = isVertical ? 'width' : 'height';

    var shiftOffsets = {
      start: defineProperty({}, side, reference[side]),
      end: defineProperty({}, side, reference[side] + reference[measurement] - popper[measurement])
    };

    data.offsets.popper = _extends({}, popper, shiftOffsets[shiftvariation]);
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by update method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function hide(data) {
  if (!isModifierRequired(data.instance.modifiers, 'hide', 'preventOverflow')) {
    return data;
  }

  var refRect = data.offsets.reference;
  var bound = find(data.instance.modifiers, function (modifier) {
    return modifier.name === 'preventOverflow';
  }).boundaries;

  if (refRect.bottom < bound.top || refRect.left > bound.right || refRect.top > bound.bottom || refRect.right < bound.left) {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === true) {
      return data;
    }

    data.hide = true;
    data.attributes['x-out-of-boundaries'] = '';
  } else {
    // Avoid unnecessary DOM access if visibility hasn't changed
    if (data.hide === false) {
      return data;
    }

    data.hide = false;
    data.attributes['x-out-of-boundaries'] = false;
  }

  return data;
}

/**
 * @function
 * @memberof Modifiers
 * @argument {Object} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {Object} The data object, properly modified
 */
function inner(data) {
  var placement = data.placement;
  var basePlacement = placement.split('-')[0];
  var _data$offsets = data.offsets,
      popper = _data$offsets.popper,
      reference = _data$offsets.reference;

  var isHoriz = ['left', 'right'].indexOf(basePlacement) !== -1;

  var subtractLength = ['top', 'left'].indexOf(basePlacement) === -1;

  popper[isHoriz ? 'left' : 'top'] = reference[basePlacement] - (subtractLength ? popper[isHoriz ? 'width' : 'height'] : 0);

  data.placement = getOppositePlacement(placement);
  data.offsets.popper = getClientRect(popper);

  return data;
}

/**
 * Modifier function, each modifier can have a function of this type assigned
 * to its `fn` property.<br />
 * These functions will be called on each update, this means that you must
 * make sure they are performant enough to avoid performance bottlenecks.
 *
 * @function ModifierFn
 * @argument {dataObject} data - The data object generated by `update` method
 * @argument {Object} options - Modifiers configuration and options
 * @returns {dataObject} The data object, properly modified
 */

/**
 * Modifiers are plugins used to alter the behavior of your poppers.<br />
 * Popper.js uses a set of 9 modifiers to provide all the basic functionalities
 * needed by the library.
 *
 * Usually you don't want to override the `order`, `fn` and `onLoad` props.
 * All the other properties are configurations that could be tweaked.
 * @namespace modifiers
 */
var modifiers = {
  /**
   * Modifier used to shift the popper on the start or end of its reference
   * element.<br />
   * It will read the variation of the `placement` property.<br />
   * It can be one either `-end` or `-start`.
   * @memberof modifiers
   * @inner
   */
  shift: {
    /** @prop {number} order=100 - Index used to define the order of execution */
    order: 100,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: shift
  },

  /**
   * The `offset` modifier can shift your popper on both its axis.
   *
   * It accepts the following units:
   * - `px` or unit-less, interpreted as pixels
   * - `%` or `%r`, percentage relative to the length of the reference element
   * - `%p`, percentage relative to the length of the popper element
   * - `vw`, CSS viewport width unit
   * - `vh`, CSS viewport height unit
   *
   * For length is intended the main axis relative to the placement of the popper.<br />
   * This means that if the placement is `top` or `bottom`, the length will be the
   * `width`. In case of `left` or `right`, it will be the `height`.
   *
   * You can provide a single value (as `Number` or `String`), or a pair of values
   * as `String` divided by a comma or one (or more) white spaces.<br />
   * The latter is a deprecated method because it leads to confusion and will be
   * removed in v2.<br />
   * Additionally, it accepts additions and subtractions between different units.
   * Note that multiplications and divisions aren't supported.
   *
   * Valid examples are:
   * ```
   * 10
   * '10%'
   * '10, 10'
   * '10%, 10'
   * '10 + 10%'
   * '10 - 5vh + 3%'
   * '-10px + 5vh, 5px - 6%'
   * ```
   * > **NB**: If you desire to apply offsets to your poppers in a way that may make them overlap
   * > with their reference element, unfortunately, you will have to disable the `flip` modifier.
   * > You can read more on this at this [issue](https://github.com/FezVrasta/popper.js/issues/373).
   *
   * @memberof modifiers
   * @inner
   */
  offset: {
    /** @prop {number} order=200 - Index used to define the order of execution */
    order: 200,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: offset,
    /** @prop {Number|String} offset=0
     * The offset value as described in the modifier description
     */
    offset: 0
  },

  /**
   * Modifier used to prevent the popper from being positioned outside the boundary.
   *
   * A scenario exists where the reference itself is not within the boundaries.<br />
   * We can say it has "escaped the boundaries" — or just "escaped".<br />
   * In this case we need to decide whether the popper should either:
   *
   * - detach from the reference and remain "trapped" in the boundaries, or
   * - if it should ignore the boundary and "escape with its reference"
   *
   * When `escapeWithReference` is set to`true` and reference is completely
   * outside its boundaries, the popper will overflow (or completely leave)
   * the boundaries in order to remain attached to the edge of the reference.
   *
   * @memberof modifiers
   * @inner
   */
  preventOverflow: {
    /** @prop {number} order=300 - Index used to define the order of execution */
    order: 300,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: preventOverflow,
    /**
     * @prop {Array} [priority=['left','right','top','bottom']]
     * Popper will try to prevent overflow following these priorities by default,
     * then, it could overflow on the left and on top of the `boundariesElement`
     */
    priority: ['left', 'right', 'top', 'bottom'],
    /**
     * @prop {number} padding=5
     * Amount of pixel used to define a minimum distance between the boundaries
     * and the popper. This makes sure the popper always has a little padding
     * between the edges of its container
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='scrollParent'
     * Boundaries used by the modifier. Can be `scrollParent`, `window`,
     * `viewport` or any DOM element.
     */
    boundariesElement: 'scrollParent'
  },

  /**
   * Modifier used to make sure the reference and its popper stay near each other
   * without leaving any gap between the two. Especially useful when the arrow is
   * enabled and you want to ensure that it points to its reference element.
   * It cares only about the first axis. You can still have poppers with margin
   * between the popper and its reference element.
   * @memberof modifiers
   * @inner
   */
  keepTogether: {
    /** @prop {number} order=400 - Index used to define the order of execution */
    order: 400,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: keepTogether
  },

  /**
   * This modifier is used to move the `arrowElement` of the popper to make
   * sure it is positioned between the reference element and its popper element.
   * It will read the outer size of the `arrowElement` node to detect how many
   * pixels of conjunction are needed.
   *
   * It has no effect if no `arrowElement` is provided.
   * @memberof modifiers
   * @inner
   */
  arrow: {
    /** @prop {number} order=500 - Index used to define the order of execution */
    order: 500,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: arrow,
    /** @prop {String|HTMLElement} element='[x-arrow]' - Selector or node used as arrow */
    element: '[x-arrow]'
  },

  /**
   * Modifier used to flip the popper's placement when it starts to overlap its
   * reference element.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   *
   * **NOTE:** this modifier will interrupt the current update cycle and will
   * restart it if it detects the need to flip the placement.
   * @memberof modifiers
   * @inner
   */
  flip: {
    /** @prop {number} order=600 - Index used to define the order of execution */
    order: 600,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: flip,
    /**
     * @prop {String|Array} behavior='flip'
     * The behavior used to change the popper's placement. It can be one of
     * `flip`, `clockwise`, `counterclockwise` or an array with a list of valid
     * placements (with optional variations)
     */
    behavior: 'flip',
    /**
     * @prop {number} padding=5
     * The popper will flip if it hits the edges of the `boundariesElement`
     */
    padding: 5,
    /**
     * @prop {String|HTMLElement} boundariesElement='viewport'
     * The element which will define the boundaries of the popper position.
     * The popper will never be placed outside of the defined boundaries
     * (except if `keepTogether` is enabled)
     */
    boundariesElement: 'viewport'
  },

  /**
   * Modifier used to make the popper flow toward the inner of the reference element.
   * By default, when this modifier is disabled, the popper will be placed outside
   * the reference element.
   * @memberof modifiers
   * @inner
   */
  inner: {
    /** @prop {number} order=700 - Index used to define the order of execution */
    order: 700,
    /** @prop {Boolean} enabled=false - Whether the modifier is enabled or not */
    enabled: false,
    /** @prop {ModifierFn} */
    fn: inner
  },

  /**
   * Modifier used to hide the popper when its reference element is outside of the
   * popper boundaries. It will set a `x-out-of-boundaries` attribute which can
   * be used to hide with a CSS selector the popper when its reference is
   * out of boundaries.
   *
   * Requires the `preventOverflow` modifier before it in order to work.
   * @memberof modifiers
   * @inner
   */
  hide: {
    /** @prop {number} order=800 - Index used to define the order of execution */
    order: 800,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: hide
  },

  /**
   * Computes the style that will be applied to the popper element to gets
   * properly positioned.
   *
   * Note that this modifier will not touch the DOM, it just prepares the styles
   * so that `applyStyle` modifier can apply it. This separation is useful
   * in case you need to replace `applyStyle` with a custom implementation.
   *
   * This modifier has `850` as `order` value to maintain backward compatibility
   * with previous versions of Popper.js. Expect the modifiers ordering method
   * to change in future major versions of the library.
   *
   * @memberof modifiers
   * @inner
   */
  computeStyle: {
    /** @prop {number} order=850 - Index used to define the order of execution */
    order: 850,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: computeStyle,
    /**
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: true,
    /**
     * @prop {string} [x='bottom']
     * Where to anchor the X axis (`bottom` or `top`). AKA X offset origin.
     * Change this if your popper should grow in a direction different from `bottom`
     */
    x: 'bottom',
    /**
     * @prop {string} [x='left']
     * Where to anchor the Y axis (`left` or `right`). AKA Y offset origin.
     * Change this if your popper should grow in a direction different from `right`
     */
    y: 'right'
  },

  /**
   * Applies the computed styles to the popper element.
   *
   * All the DOM manipulations are limited to this modifier. This is useful in case
   * you want to integrate Popper.js inside a framework or view library and you
   * want to delegate all the DOM manipulations to it.
   *
   * Note that if you disable this modifier, you must make sure the popper element
   * has its position set to `absolute` before Popper.js can do its work!
   *
   * Just disable this modifier and define your own to achieve the desired effect.
   *
   * @memberof modifiers
   * @inner
   */
  applyStyle: {
    /** @prop {number} order=900 - Index used to define the order of execution */
    order: 900,
    /** @prop {Boolean} enabled=true - Whether the modifier is enabled or not */
    enabled: true,
    /** @prop {ModifierFn} */
    fn: applyStyle,
    /** @prop {Function} */
    onLoad: applyStyleOnLoad,
    /**
     * @deprecated since version 1.10.0, the property moved to `computeStyle` modifier
     * @prop {Boolean} gpuAcceleration=true
     * If true, it uses the CSS 3D transformation to position the popper.
     * Otherwise, it will use the `top` and `left` properties
     */
    gpuAcceleration: undefined
  }
};

/**
 * The `dataObject` is an object containing all the information used by Popper.js.
 * This object is passed to modifiers and to the `onCreate` and `onUpdate` callbacks.
 * @name dataObject
 * @property {Object} data.instance The Popper.js instance
 * @property {String} data.placement Placement applied to popper
 * @property {String} data.originalPlacement Placement originally defined on init
 * @property {Boolean} data.flipped True if popper has been flipped by flip modifier
 * @property {Boolean} data.hide True if the reference element is out of boundaries, useful to know when to hide the popper
 * @property {HTMLElement} data.arrowElement Node used as arrow by arrow modifier
 * @property {Object} data.styles Any CSS property defined here will be applied to the popper. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.arrowStyles Any CSS property defined here will be applied to the popper arrow. It expects the JavaScript nomenclature (eg. `marginBottom`)
 * @property {Object} data.boundaries Offsets of the popper boundaries
 * @property {Object} data.offsets The measurements of popper, reference and arrow elements
 * @property {Object} data.offsets.popper `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.reference `top`, `left`, `width`, `height` values
 * @property {Object} data.offsets.arrow] `top` and `left` offsets, only one of them will be different from 0
 */

/**
 * Default options provided to Popper.js constructor.<br />
 * These can be overridden using the `options` argument of Popper.js.<br />
 * To override an option, simply pass an object with the same
 * structure of the `options` object, as the 3rd argument. For example:
 * ```
 * new Popper(ref, pop, {
 *   modifiers: {
 *     preventOverflow: { enabled: false }
 *   }
 * })
 * ```
 * @type {Object}
 * @static
 * @memberof Popper
 */
var Defaults = {
  /**
   * Popper's placement.
   * @prop {Popper.placements} placement='bottom'
   */
  placement: 'bottom',

  /**
   * Set this to true if you want popper to position it self in 'fixed' mode
   * @prop {Boolean} positionFixed=false
   */
  positionFixed: false,

  /**
   * Whether events (resize, scroll) are initially enabled.
   * @prop {Boolean} eventsEnabled=true
   */
  eventsEnabled: true,

  /**
   * Set to true if you want to automatically remove the popper when
   * you call the `destroy` method.
   * @prop {Boolean} removeOnDestroy=false
   */
  removeOnDestroy: false,

  /**
   * Callback called when the popper is created.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onCreate}
   */
  onCreate: function onCreate() {},

  /**
   * Callback called when the popper is updated. This callback is not called
   * on the initialization/creation of the popper, but only on subsequent
   * updates.<br />
   * By default, it is set to no-op.<br />
   * Access Popper.js instance with `data.instance`.
   * @prop {onUpdate}
   */
  onUpdate: function onUpdate() {},

  /**
   * List of modifiers used to modify the offsets before they are applied to the popper.
   * They provide most of the functionalities of Popper.js.
   * @prop {modifiers}
   */
  modifiers: modifiers
};

/**
 * @callback onCreate
 * @param {dataObject} data
 */

/**
 * @callback onUpdate
 * @param {dataObject} data
 */

// Utils
// Methods
var Popper = function () {
  /**
   * Creates a new Popper.js instance.
   * @class Popper
   * @param {HTMLElement|referenceObject} reference - The reference element used to position the popper
   * @param {HTMLElement} popper - The HTML element used as the popper
   * @param {Object} options - Your custom options to override the ones defined in [Defaults](#defaults)
   * @return {Object} instance - The generated Popper.js instance
   */
  function Popper(reference, popper) {
    var _this = this;

    var options = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
    classCallCheck(this, Popper);

    this.scheduleUpdate = function () {
      return requestAnimationFrame(_this.update);
    };

    // make update() debounced, so that it only runs at most once-per-tick
    this.update = debounce(this.update.bind(this));

    // with {} we create a new object with the options inside it
    this.options = _extends({}, Popper.Defaults, options);

    // init state
    this.state = {
      isDestroyed: false,
      isCreated: false,
      scrollParents: []
    };

    // get reference and popper elements (allow jQuery wrappers)
    this.reference = reference && reference.jquery ? reference[0] : reference;
    this.popper = popper && popper.jquery ? popper[0] : popper;

    // Deep merge modifiers options
    this.options.modifiers = {};
    Object.keys(_extends({}, Popper.Defaults.modifiers, options.modifiers)).forEach(function (name) {
      _this.options.modifiers[name] = _extends({}, Popper.Defaults.modifiers[name] || {}, options.modifiers ? options.modifiers[name] : {});
    });

    // Refactoring modifiers' list (Object => Array)
    this.modifiers = Object.keys(this.options.modifiers).map(function (name) {
      return _extends({
        name: name
      }, _this.options.modifiers[name]);
    })
    // sort the modifiers by order
    .sort(function (a, b) {
      return a.order - b.order;
    });

    // modifiers have the ability to execute arbitrary code when Popper.js get inited
    // such code is executed in the same order of its modifier
    // they could add new properties to their options configuration
    // BE AWARE: don't add options to `options.modifiers.name` but to `modifierOptions`!
    this.modifiers.forEach(function (modifierOptions) {
      if (modifierOptions.enabled && isFunction(modifierOptions.onLoad)) {
        modifierOptions.onLoad(_this.reference, _this.popper, _this.options, modifierOptions, _this.state);
      }
    });

    // fire the first update to position the popper in the right place
    this.update();

    var eventsEnabled = this.options.eventsEnabled;
    if (eventsEnabled) {
      // setup event listeners, they will take care of update the position in specific situations
      this.enableEventListeners();
    }

    this.state.eventsEnabled = eventsEnabled;
  }

  // We can't use class properties because they don't get listed in the
  // class prototype and break stuff like Sinon stubs


  createClass(Popper, [{
    key: 'update',
    value: function update$$1() {
      return update.call(this);
    }
  }, {
    key: 'destroy',
    value: function destroy$$1() {
      return destroy.call(this);
    }
  }, {
    key: 'enableEventListeners',
    value: function enableEventListeners$$1() {
      return enableEventListeners.call(this);
    }
  }, {
    key: 'disableEventListeners',
    value: function disableEventListeners$$1() {
      return disableEventListeners.call(this);
    }

    /**
     * Schedules an update. It will run on the next UI update available.
     * @method scheduleUpdate
     * @memberof Popper
     */


    /**
     * Collection of utilities useful when writing custom modifiers.
     * Starting from version 1.7, this method is available only if you
     * include `popper-utils.js` before `popper.js`.
     *
     * **DEPRECATION**: This way to access PopperUtils is deprecated
     * and will be removed in v2! Use the PopperUtils module directly instead.
     * Due to the high instability of the methods contained in Utils, we can't
     * guarantee them to follow semver. Use them at your own risk!
     * @static
     * @private
     * @type {Object}
     * @deprecated since version 1.8
     * @member Utils
     * @memberof Popper
     */

  }]);
  return Popper;
}();

/**
 * The `referenceObject` is an object that provides an interface compatible with Popper.js
 * and lets you use it as replacement of a real DOM node.<br />
 * You can use this method to position a popper relatively to a set of coordinates
 * in case you don't have a DOM node to use as reference.
 *
 * ```
 * new Popper(referenceObject, popperNode);
 * ```
 *
 * NB: This feature isn't supported in Internet Explorer 10.
 * @name referenceObject
 * @property {Function} data.getBoundingClientRect
 * A function that returns a set of coordinates compatible with the native `getBoundingClientRect` method.
 * @property {number} data.clientWidth
 * An ES6 getter that will return the width of the virtual reference element.
 * @property {number} data.clientHeight
 * An ES6 getter that will return the height of the virtual reference element.
 */


Popper.Utils = (typeof window !== 'undefined' ? window : global).PopperUtils;
Popper.placements = placements;
Popper.Defaults = Defaults;

/* harmony default export */ __webpack_exports__["default"] = (Popper);
//# sourceMappingURL=popper.js.map

/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../../webpack/buildin/global.js */ 2)))

/***/ }),
/* 25 */
/*!********************************!*\
  !*** ./scripts/util/Router.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony import */ var __WEBPACK_IMPORTED_MODULE_0__camelCase__ = __webpack_require__(/*! ./camelCase */ 26);


/**
 * DOM-based Routing
 *
 * Based on {@link http://goo.gl/EUTi53|Markup-based Unobtrusive Comprehensive DOM-ready Execution} by Paul Irish
 *
 * The routing fires all common scripts, followed by the page specific scripts.
 * Add additional events for more control over timing e.g. a finalize event
 */
var Router = function Router(routes) {
  this.routes = routes;
};

/**
 * Fire Router events
 * @param {string} route DOM-based route derived from body classes (`<body class="...">`)
 * @param {string} [event] Events on the route. By default, `init` and `finalize` events are called.
 * @param {string} [arg] Any custom argument to be passed to the event.
 */
Router.prototype.fire = function fire (route, event, arg) {
    if ( event === void 0 ) event = 'init';

  document.dispatchEvent(new CustomEvent('routed', {
    bubbles: true,
    detail: {
      route: route,
      fn: event,
    },
  }));
    
  var fire = route !== '' && this.routes[route] && typeof this.routes[route][event] === 'function';
  if (fire) {
    this.routes[route][event](arg);
  }
};

/**
 * Automatically load and fire Router events
 *
 * Events are fired in the following order:
 ** common init
 ** page-specific init
 ** page-specific finalize
 ** common finalize
 */
Router.prototype.loadEvents = function loadEvents () {
    var this$1 = this;

  // Fire common init JS
  this.fire('common');

  // Fire page-specific init JS, and then finalize JS
  document.body.className
    .toLowerCase()
    .replace(/-/g, '_')
    .split(/\s+/)
    .map(__WEBPACK_IMPORTED_MODULE_0__camelCase__["a" /* default */])
    .forEach(function (className) {
      this$1.fire(className);
      this$1.fire(className, 'finalize');
    });

  // Fire common finalize JS
  this.fire('common', 'finalize');
};

/* harmony default export */ __webpack_exports__["a"] = (Router);


/***/ }),
/* 26 */
/*!***********************************!*\
  !*** ./scripts/util/camelCase.js ***!
  \***********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/**
 * the most terrible camelizer on the internet, guaranteed!
 * @param {string} str String that isn't camel-case, e.g., CAMeL_CaSEiS-harD
 * @return {string} String converted to camel-case, e.g., camelCaseIsHard
 */
/* harmony default export */ __webpack_exports__["a"] = (function (str) { return ("" + (str.charAt(0).toLowerCase()) + (str.replace(/[\W_]/g, '|').split('|')
  .map(function (part) { return ("" + (part.charAt(0).toUpperCase()) + (part.slice(1))); })
  .join('')
  .slice(1))); });;


/***/ }),
/* 27 */
/*!**********************************!*\
  !*** ./scripts/routes/common.js ***!
  \**********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on all pages
  },
  finalize: function finalize() {
    // JavaScript to be fired on all pages, after page specific JS is fired
  },
});


/***/ }),
/* 28 */
/*!********************************!*\
  !*** ./scripts/routes/home.js ***!
  \********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the home page
  },
  finalize: function finalize() {
    // JavaScript to be fired on the home page, after the init JS
  },
});


/***/ }),
/* 29 */
/*!*********************************!*\
  !*** ./scripts/routes/about.js ***!
  \*********************************/
/*! exports provided: default */
/*! exports used: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony default export */ __webpack_exports__["a"] = ({
  init: function init() {
    // JavaScript to be fired on the about us page
  },
});


/***/ }),
/* 30 */
/*!*************************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/@fortawesome/fontawesome-svg-core/index.es.js ***!
  \*************************************************************************************************************************/
/*! exports provided: icon, noAuto, config, toHtml, layer, text, counter, library, dom, parse, findIconDefinition */
/*! exports used: dom, library */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* WEBPACK VAR INJECTION */(function(process, global, setImmediate) {/* unused harmony export icon */
/* unused harmony export noAuto */
/* unused harmony export config */
/* unused harmony export toHtml */
/* unused harmony export layer */
/* unused harmony export text */
/* unused harmony export counter */
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "b", function() { return library; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return dom; });
/* unused harmony export parse */
/* unused harmony export findIconDefinition */
function _typeof(obj) {
  if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") {
    _typeof = function (obj) {
      return typeof obj;
    };
  } else {
    _typeof = function (obj) {
      return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    };
  }

  return _typeof(obj);
}

function _classCallCheck(instance, Constructor) {
  if (!(instance instanceof Constructor)) {
    throw new TypeError("Cannot call a class as a function");
  }
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  return Constructor;
}

function _defineProperty(obj, key, value) {
  if (key in obj) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
  } else {
    obj[key] = value;
  }

  return obj;
}

function _objectSpread(target) {
  for (var i = 1; i < arguments.length; i++) {
    var source = arguments[i] != null ? arguments[i] : {};
    var ownKeys = Object.keys(source);

    if (typeof Object.getOwnPropertySymbols === 'function') {
      ownKeys = ownKeys.concat(Object.getOwnPropertySymbols(source).filter(function (sym) {
        return Object.getOwnPropertyDescriptor(source, sym).enumerable;
      }));
    }

    ownKeys.forEach(function (key) {
      _defineProperty(target, key, source[key]);
    });
  }

  return target;
}

function _slicedToArray(arr, i) {
  return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest();
}

function _toConsumableArray(arr) {
  return _arrayWithoutHoles(arr) || _iterableToArray(arr) || _nonIterableSpread();
}

function _arrayWithoutHoles(arr) {
  if (Array.isArray(arr)) {
    for (var i = 0, arr2 = new Array(arr.length); i < arr.length; i++) arr2[i] = arr[i];

    return arr2;
  }
}

function _arrayWithHoles(arr) {
  if (Array.isArray(arr)) return arr;
}

function _iterableToArray(iter) {
  if (Symbol.iterator in Object(iter) || Object.prototype.toString.call(iter) === "[object Arguments]") return Array.from(iter);
}

function _iterableToArrayLimit(arr, i) {
  var _arr = [];
  var _n = true;
  var _d = false;
  var _e = undefined;

  try {
    for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) {
      _arr.push(_s.value);

      if (i && _arr.length === i) break;
    }
  } catch (err) {
    _d = true;
    _e = err;
  } finally {
    try {
      if (!_n && _i["return"] != null) _i["return"]();
    } finally {
      if (_d) throw _e;
    }
  }

  return _arr;
}

function _nonIterableSpread() {
  throw new TypeError("Invalid attempt to spread non-iterable instance");
}

function _nonIterableRest() {
  throw new TypeError("Invalid attempt to destructure non-iterable instance");
}

var noop = function noop() {};

var _WINDOW = {};
var _DOCUMENT = {};
var _MUTATION_OBSERVER = null;
var _PERFORMANCE = {
  mark: noop,
  measure: noop
};

try {
  if (typeof window !== 'undefined') _WINDOW = window;
  if (typeof document !== 'undefined') _DOCUMENT = document;
  if (typeof MutationObserver !== 'undefined') _MUTATION_OBSERVER = MutationObserver;
  if (typeof performance !== 'undefined') _PERFORMANCE = performance;
} catch (e) {}

var _ref = _WINDOW.navigator || {},
    _ref$userAgent = _ref.userAgent,
    userAgent = _ref$userAgent === void 0 ? '' : _ref$userAgent;

var WINDOW = _WINDOW;
var DOCUMENT = _DOCUMENT;
var MUTATION_OBSERVER = _MUTATION_OBSERVER;
var PERFORMANCE = _PERFORMANCE;
var IS_BROWSER = !!WINDOW.document;
var IS_DOM = !!DOCUMENT.documentElement && !!DOCUMENT.head && typeof DOCUMENT.addEventListener === 'function' && typeof DOCUMENT.createElement === 'function';
var IS_IE = ~userAgent.indexOf('MSIE') || ~userAgent.indexOf('Trident/');

var NAMESPACE_IDENTIFIER = '___FONT_AWESOME___';
var UNITS_IN_GRID = 16;
var DEFAULT_FAMILY_PREFIX = 'fa';
var DEFAULT_REPLACEMENT_CLASS = 'svg-inline--fa';
var DATA_FA_I2SVG = 'data-fa-i2svg';
var DATA_FA_PSEUDO_ELEMENT = 'data-fa-pseudo-element';
var DATA_FA_PSEUDO_ELEMENT_PENDING = 'data-fa-pseudo-element-pending';
var DATA_PREFIX = 'data-prefix';
var DATA_ICON = 'data-icon';
var HTML_CLASS_I2SVG_BASE_CLASS = 'fontawesome-i2svg';
var MUTATION_APPROACH_ASYNC = 'async';
var TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS = ['HTML', 'HEAD', 'STYLE', 'SCRIPT'];
var PRODUCTION = function () {
  try {
    return process.env.NODE_ENV === 'production';
  } catch (e) {
    return false;
  }
}();
var PREFIX_TO_STYLE = {
  'fas': 'solid',
  'far': 'regular',
  'fal': 'light',
  'fad': 'duotone',
  'fab': 'brands',
  'fa': 'solid'
};
var STYLE_TO_PREFIX = {
  'solid': 'fas',
  'regular': 'far',
  'light': 'fal',
  'duotone': 'fad',
  'brands': 'fab'
};
var LAYERS_TEXT_CLASSNAME = 'fa-layers-text';
var FONT_FAMILY_PATTERN = /Font Awesome 5 (Solid|Regular|Light|Duotone|Brands|Free|Pro)/;
var FONT_WEIGHT_TO_PREFIX = {
  '900': 'fas',
  '400': 'far',
  'normal': 'far',
  '300': 'fal'
};
var oneToTen = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
var oneToTwenty = oneToTen.concat([11, 12, 13, 14, 15, 16, 17, 18, 19, 20]);
var ATTRIBUTES_WATCHED_FOR_MUTATION = ['class', 'data-prefix', 'data-icon', 'data-fa-transform', 'data-fa-mask'];
var DUOTONE_CLASSES = {
  GROUP: 'group',
  SWAP_OPACITY: 'swap-opacity',
  PRIMARY: 'primary',
  SECONDARY: 'secondary'
};
var RESERVED_CLASSES = ['xs', 'sm', 'lg', 'fw', 'ul', 'li', 'border', 'pull-left', 'pull-right', 'spin', 'pulse', 'rotate-90', 'rotate-180', 'rotate-270', 'flip-horizontal', 'flip-vertical', 'flip-both', 'stack', 'stack-1x', 'stack-2x', 'inverse', 'layers', 'layers-text', 'layers-counter', DUOTONE_CLASSES.GROUP, DUOTONE_CLASSES.SWAP_OPACITY, DUOTONE_CLASSES.PRIMARY, DUOTONE_CLASSES.SECONDARY].concat(oneToTen.map(function (n) {
  return "".concat(n, "x");
})).concat(oneToTwenty.map(function (n) {
  return "w-".concat(n);
}));

var initial = WINDOW.FontAwesomeConfig || {};

function getAttrConfig(attr) {
  var element = DOCUMENT.querySelector('script[' + attr + ']');

  if (element) {
    return element.getAttribute(attr);
  }
}

function coerce(val) {
  // Getting an empty string will occur if the attribute is set on the HTML tag but without a value
  // We'll assume that this is an indication that it should be toggled to true
  // For example <script data-search-pseudo-elements src="..."></script>
  if (val === '') return true;
  if (val === 'false') return false;
  if (val === 'true') return true;
  return val;
}

if (DOCUMENT && typeof DOCUMENT.querySelector === 'function') {
  var attrs = [['data-family-prefix', 'familyPrefix'], ['data-replacement-class', 'replacementClass'], ['data-auto-replace-svg', 'autoReplaceSvg'], ['data-auto-add-css', 'autoAddCss'], ['data-auto-a11y', 'autoA11y'], ['data-search-pseudo-elements', 'searchPseudoElements'], ['data-observe-mutations', 'observeMutations'], ['data-mutate-approach', 'mutateApproach'], ['data-keep-original-source', 'keepOriginalSource'], ['data-measure-performance', 'measurePerformance'], ['data-show-missing-icons', 'showMissingIcons']];
  attrs.forEach(function (_ref) {
    var _ref2 = _slicedToArray(_ref, 2),
        attr = _ref2[0],
        key = _ref2[1];

    var val = coerce(getAttrConfig(attr));

    if (val !== undefined && val !== null) {
      initial[key] = val;
    }
  });
}

var _default = {
  familyPrefix: DEFAULT_FAMILY_PREFIX,
  replacementClass: DEFAULT_REPLACEMENT_CLASS,
  autoReplaceSvg: true,
  autoAddCss: true,
  autoA11y: true,
  searchPseudoElements: false,
  observeMutations: true,
  mutateApproach: 'async',
  keepOriginalSource: true,
  measurePerformance: false,
  showMissingIcons: true
};

var _config = _objectSpread({}, _default, initial);

if (!_config.autoReplaceSvg) _config.observeMutations = false;

var config = _objectSpread({}, _config);

WINDOW.FontAwesomeConfig = config;

var w = WINDOW || {};
if (!w[NAMESPACE_IDENTIFIER]) w[NAMESPACE_IDENTIFIER] = {};
if (!w[NAMESPACE_IDENTIFIER].styles) w[NAMESPACE_IDENTIFIER].styles = {};
if (!w[NAMESPACE_IDENTIFIER].hooks) w[NAMESPACE_IDENTIFIER].hooks = {};
if (!w[NAMESPACE_IDENTIFIER].shims) w[NAMESPACE_IDENTIFIER].shims = [];
var namespace = w[NAMESPACE_IDENTIFIER];

var functions = [];

var listener = function listener() {
  DOCUMENT.removeEventListener('DOMContentLoaded', listener);
  loaded = 1;
  functions.map(function (fn) {
    return fn();
  });
};

var loaded = false;

if (IS_DOM) {
  loaded = (DOCUMENT.documentElement.doScroll ? /^loaded|^c/ : /^loaded|^i|^c/).test(DOCUMENT.readyState);
  if (!loaded) DOCUMENT.addEventListener('DOMContentLoaded', listener);
}

function domready (fn) {
  if (!IS_DOM) return;
  loaded ? setTimeout(fn, 0) : functions.push(fn);
}

var PENDING = 'pending';
var SETTLED = 'settled';
var FULFILLED = 'fulfilled';
var REJECTED = 'rejected';

var NOOP = function NOOP() {};

var isNode = typeof global !== 'undefined' && typeof global.process !== 'undefined' && typeof global.process.emit === 'function';
var asyncSetTimer = typeof setImmediate === 'undefined' ? setTimeout : setImmediate;
var asyncQueue = [];
var asyncTimer;

function asyncFlush() {
  // run promise callbacks
  for (var i = 0; i < asyncQueue.length; i++) {
    asyncQueue[i][0](asyncQueue[i][1]);
  } // reset async asyncQueue


  asyncQueue = [];
  asyncTimer = false;
}

function asyncCall(callback, arg) {
  asyncQueue.push([callback, arg]);

  if (!asyncTimer) {
    asyncTimer = true;
    asyncSetTimer(asyncFlush, 0);
  }
}

function invokeResolver(resolver, promise) {
  function resolvePromise(value) {
    resolve(promise, value);
  }

  function rejectPromise(reason) {
    reject(promise, reason);
  }

  try {
    resolver(resolvePromise, rejectPromise);
  } catch (e) {
    rejectPromise(e);
  }
}

function invokeCallback(subscriber) {
  var owner = subscriber.owner;
  var settled = owner._state;
  var value = owner._data;
  var callback = subscriber[settled];
  var promise = subscriber.then;

  if (typeof callback === 'function') {
    settled = FULFILLED;

    try {
      value = callback(value);
    } catch (e) {
      reject(promise, e);
    }
  }

  if (!handleThenable(promise, value)) {
    if (settled === FULFILLED) {
      resolve(promise, value);
    }

    if (settled === REJECTED) {
      reject(promise, value);
    }
  }
}

function handleThenable(promise, value) {
  var resolved;

  try {
    if (promise === value) {
      throw new TypeError('A promises callback cannot return that same promise.');
    }

    if (value && (typeof value === 'function' || _typeof(value) === 'object')) {
      // then should be retrieved only once
      var then = value.then;

      if (typeof then === 'function') {
        then.call(value, function (val) {
          if (!resolved) {
            resolved = true;

            if (value === val) {
              fulfill(promise, val);
            } else {
              resolve(promise, val);
            }
          }
        }, function (reason) {
          if (!resolved) {
            resolved = true;
            reject(promise, reason);
          }
        });
        return true;
      }
    }
  } catch (e) {
    if (!resolved) {
      reject(promise, e);
    }

    return true;
  }

  return false;
}

function resolve(promise, value) {
  if (promise === value || !handleThenable(promise, value)) {
    fulfill(promise, value);
  }
}

function fulfill(promise, value) {
  if (promise._state === PENDING) {
    promise._state = SETTLED;
    promise._data = value;
    asyncCall(publishFulfillment, promise);
  }
}

function reject(promise, reason) {
  if (promise._state === PENDING) {
    promise._state = SETTLED;
    promise._data = reason;
    asyncCall(publishRejection, promise);
  }
}

function publish(promise) {
  promise._then = promise._then.forEach(invokeCallback);
}

function publishFulfillment(promise) {
  promise._state = FULFILLED;
  publish(promise);
}

function publishRejection(promise) {
  promise._state = REJECTED;
  publish(promise);

  if (!promise._handled && isNode) {
    global.process.emit('unhandledRejection', promise._data, promise);
  }
}

function notifyRejectionHandled(promise) {
  global.process.emit('rejectionHandled', promise);
}
/**
 * @class
 */


function P(resolver) {
  if (typeof resolver !== 'function') {
    throw new TypeError('Promise resolver ' + resolver + ' is not a function');
  }

  if (this instanceof P === false) {
    throw new TypeError('Failed to construct \'Promise\': Please use the \'new\' operator, this object constructor cannot be called as a function.');
  }

  this._then = [];
  invokeResolver(resolver, this);
}

P.prototype = {
  constructor: P,
  _state: PENDING,
  _then: null,
  _data: undefined,
  _handled: false,
  then: function then(onFulfillment, onRejection) {
    var subscriber = {
      owner: this,
      then: new this.constructor(NOOP),
      fulfilled: onFulfillment,
      rejected: onRejection
    };

    if ((onRejection || onFulfillment) && !this._handled) {
      this._handled = true;

      if (this._state === REJECTED && isNode) {
        asyncCall(notifyRejectionHandled, this);
      }
    }

    if (this._state === FULFILLED || this._state === REJECTED) {
      // already resolved, call callback async
      asyncCall(invokeCallback, subscriber);
    } else {
      // subscribe
      this._then.push(subscriber);
    }

    return subscriber.then;
  },
  catch: function _catch(onRejection) {
    return this.then(null, onRejection);
  }
};

P.all = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('You must pass an array to Promise.all().');
  }

  return new P(function (resolve, reject) {
    var results = [];
    var remaining = 0;

    function resolver(index) {
      remaining++;
      return function (value) {
        results[index] = value;

        if (! --remaining) {
          resolve(results);
        }
      };
    }

    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolver(i), reject);
      } else {
        results[i] = promise;
      }
    }

    if (!remaining) {
      resolve(results);
    }
  });
};

P.race = function (promises) {
  if (!Array.isArray(promises)) {
    throw new TypeError('You must pass an array to Promise.race().');
  }

  return new P(function (resolve, reject) {
    for (var i = 0, promise; i < promises.length; i++) {
      promise = promises[i];

      if (promise && typeof promise.then === 'function') {
        promise.then(resolve, reject);
      } else {
        resolve(promise);
      }
    }
  });
};

P.resolve = function (value) {
  if (value && _typeof(value) === 'object' && value.constructor === P) {
    return value;
  }

  return new P(function (resolve) {
    resolve(value);
  });
};

P.reject = function (reason) {
  return new P(function (resolve, reject) {
    reject(reason);
  });
};

var picked = typeof Promise === 'function' ? Promise : P;

var d = UNITS_IN_GRID;
var meaninglessTransform = {
  size: 16,
  x: 0,
  y: 0,
  rotate: 0,
  flipX: false,
  flipY: false
};

function isReserved(name) {
  return ~RESERVED_CLASSES.indexOf(name);
}
function insertCss(css) {
  if (!css || !IS_DOM) {
    return;
  }

  var style = DOCUMENT.createElement('style');
  style.setAttribute('type', 'text/css');
  style.innerHTML = css;
  var headChildren = DOCUMENT.head.childNodes;
  var beforeChild = null;

  for (var i = headChildren.length - 1; i > -1; i--) {
    var child = headChildren[i];
    var tagName = (child.tagName || '').toUpperCase();

    if (['STYLE', 'LINK'].indexOf(tagName) > -1) {
      beforeChild = child;
    }
  }

  DOCUMENT.head.insertBefore(style, beforeChild);
  return css;
}
var idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[Math.random() * 62 | 0];
  }

  return id;
}
function toArray(obj) {
  var array = [];

  for (var i = (obj || []).length >>> 0; i--;) {
    array[i] = obj[i];
  }

  return array;
}
function classArray(node) {
  if (node.classList) {
    return toArray(node.classList);
  } else {
    return (node.getAttribute('class') || '').split(' ').filter(function (i) {
      return i;
    });
  }
}
function getIconName(familyPrefix, cls) {
  var parts = cls.split('-');
  var prefix = parts[0];
  var iconName = parts.slice(1).join('-');

  if (prefix === familyPrefix && iconName !== '' && !isReserved(iconName)) {
    return iconName;
  } else {
    return null;
  }
}
function htmlEscape(str) {
  return "".concat(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/'/g, '&#39;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}
function joinAttributes(attributes) {
  return Object.keys(attributes || {}).reduce(function (acc, attributeName) {
    return acc + "".concat(attributeName, "=\"").concat(htmlEscape(attributes[attributeName]), "\" ");
  }, '').trim();
}
function joinStyles(styles) {
  return Object.keys(styles || {}).reduce(function (acc, styleName) {
    return acc + "".concat(styleName, ": ").concat(styles[styleName], ";");
  }, '');
}
function transformIsMeaningful(transform) {
  return transform.size !== meaninglessTransform.size || transform.x !== meaninglessTransform.x || transform.y !== meaninglessTransform.y || transform.rotate !== meaninglessTransform.rotate || transform.flipX || transform.flipY;
}
function transformForSvg(_ref) {
  var transform = _ref.transform,
      containerWidth = _ref.containerWidth,
      iconWidth = _ref.iconWidth;
  var outer = {
    transform: "translate(".concat(containerWidth / 2, " 256)")
  };
  var innerTranslate = "translate(".concat(transform.x * 32, ", ").concat(transform.y * 32, ") ");
  var innerScale = "scale(".concat(transform.size / 16 * (transform.flipX ? -1 : 1), ", ").concat(transform.size / 16 * (transform.flipY ? -1 : 1), ") ");
  var innerRotate = "rotate(".concat(transform.rotate, " 0 0)");
  var inner = {
    transform: "".concat(innerTranslate, " ").concat(innerScale, " ").concat(innerRotate)
  };
  var path = {
    transform: "translate(".concat(iconWidth / 2 * -1, " -256)")
  };
  return {
    outer: outer,
    inner: inner,
    path: path
  };
}
function transformForCss(_ref2) {
  var transform = _ref2.transform,
      _ref2$width = _ref2.width,
      width = _ref2$width === void 0 ? UNITS_IN_GRID : _ref2$width,
      _ref2$height = _ref2.height,
      height = _ref2$height === void 0 ? UNITS_IN_GRID : _ref2$height,
      _ref2$startCentered = _ref2.startCentered,
      startCentered = _ref2$startCentered === void 0 ? false : _ref2$startCentered;
  var val = '';

  if (startCentered && IS_IE) {
    val += "translate(".concat(transform.x / d - width / 2, "em, ").concat(transform.y / d - height / 2, "em) ");
  } else if (startCentered) {
    val += "translate(calc(-50% + ".concat(transform.x / d, "em), calc(-50% + ").concat(transform.y / d, "em)) ");
  } else {
    val += "translate(".concat(transform.x / d, "em, ").concat(transform.y / d, "em) ");
  }

  val += "scale(".concat(transform.size / d * (transform.flipX ? -1 : 1), ", ").concat(transform.size / d * (transform.flipY ? -1 : 1), ") ");
  val += "rotate(".concat(transform.rotate, "deg) ");
  return val;
}

var ALL_SPACE = {
  x: 0,
  y: 0,
  width: '100%',
  height: '100%'
};

function fillBlack(abstract) {
  var force = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : true;

  if (abstract.attributes && (abstract.attributes.fill || force)) {
    abstract.attributes.fill = 'black';
  }

  return abstract;
}

function deGroup(abstract) {
  if (abstract.tag === 'g') {
    return abstract.children;
  } else {
    return [abstract];
  }
}

function makeIconMasking (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      mask = _ref.mask,
      explicitMaskId = _ref.maskId,
      transform = _ref.transform;
  var mainWidth = main.width,
      mainPath = main.icon;
  var maskWidth = mask.width,
      maskPath = mask.icon;
  var trans = transformForSvg({
    transform: transform,
    containerWidth: maskWidth,
    iconWidth: mainWidth
  });
  var maskRect = {
    tag: 'rect',
    attributes: _objectSpread({}, ALL_SPACE, {
      fill: 'white'
    })
  };
  var maskInnerGroupChildrenMixin = mainPath.children ? {
    children: mainPath.children.map(fillBlack)
  } : {};
  var maskInnerGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.inner),
    children: [fillBlack(_objectSpread({
      tag: mainPath.tag,
      attributes: _objectSpread({}, mainPath.attributes, trans.path)
    }, maskInnerGroupChildrenMixin))]
  };
  var maskOuterGroup = {
    tag: 'g',
    attributes: _objectSpread({}, trans.outer),
    children: [maskInnerGroup]
  };
  var maskId = "mask-".concat(explicitMaskId || nextUniqueId());
  var clipId = "clip-".concat(explicitMaskId || nextUniqueId());
  var maskTag = {
    tag: 'mask',
    attributes: _objectSpread({}, ALL_SPACE, {
      id: maskId,
      maskUnits: 'userSpaceOnUse',
      maskContentUnits: 'userSpaceOnUse'
    }),
    children: [maskRect, maskOuterGroup]
  };
  var defs = {
    tag: 'defs',
    children: [{
      tag: 'clipPath',
      attributes: {
        id: clipId
      },
      children: deGroup(maskPath)
    }, maskTag]
  };
  children.push(defs, {
    tag: 'rect',
    attributes: _objectSpread({
      fill: 'currentColor',
      'clip-path': "url(#".concat(clipId, ")"),
      mask: "url(#".concat(maskId, ")")
    }, ALL_SPACE)
  });
  return {
    children: children,
    attributes: attributes
  };
}

function makeIconStandard (_ref) {
  var children = _ref.children,
      attributes = _ref.attributes,
      main = _ref.main,
      transform = _ref.transform,
      styles = _ref.styles;
  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  if (transformIsMeaningful(transform)) {
    var trans = transformForSvg({
      transform: transform,
      containerWidth: main.width,
      iconWidth: main.width
    });
    children.push({
      tag: 'g',
      attributes: _objectSpread({}, trans.outer),
      children: [{
        tag: 'g',
        attributes: _objectSpread({}, trans.inner),
        children: [{
          tag: main.icon.tag,
          children: main.icon.children,
          attributes: _objectSpread({}, main.icon.attributes, trans.path)
        }]
      }]
    });
  } else {
    children.push(main.icon);
  }

  return {
    children: children,
    attributes: attributes
  };
}

function asIcon (_ref) {
  var children = _ref.children,
      main = _ref.main,
      mask = _ref.mask,
      attributes = _ref.attributes,
      styles = _ref.styles,
      transform = _ref.transform;

  if (transformIsMeaningful(transform) && main.found && !mask.found) {
    var width = main.width,
        height = main.height;
    var offset = {
      x: width / height / 2,
      y: 0.5
    };
    attributes['style'] = joinStyles(_objectSpread({}, styles, {
      'transform-origin': "".concat(offset.x + transform.x / 16, "em ").concat(offset.y + transform.y / 16, "em")
    }));
  }

  return [{
    tag: 'svg',
    attributes: attributes,
    children: children
  }];
}

function asSymbol (_ref) {
  var prefix = _ref.prefix,
      iconName = _ref.iconName,
      children = _ref.children,
      attributes = _ref.attributes,
      symbol = _ref.symbol;
  var id = symbol === true ? "".concat(prefix, "-").concat(config.familyPrefix, "-").concat(iconName) : symbol;
  return [{
    tag: 'svg',
    attributes: {
      style: 'display: none;'
    },
    children: [{
      tag: 'symbol',
      attributes: _objectSpread({}, attributes, {
        id: id
      }),
      children: children
    }]
  }];
}

function makeInlineSvgAbstract(params) {
  var _params$icons = params.icons,
      main = _params$icons.main,
      mask = _params$icons.mask,
      prefix = params.prefix,
      iconName = params.iconName,
      transform = params.transform,
      symbol = params.symbol,
      title = params.title,
      maskId = params.maskId,
      titleId = params.titleId,
      extra = params.extra,
      _params$watchable = params.watchable,
      watchable = _params$watchable === void 0 ? false : _params$watchable;

  var _ref = mask.found ? mask : main,
      width = _ref.width,
      height = _ref.height;

  var widthClass = "fa-w-".concat(Math.ceil(width / height * 16));
  var attrClass = [config.replacementClass, iconName ? "".concat(config.familyPrefix, "-").concat(iconName) : '', widthClass].filter(function (c) {
    return extra.classes.indexOf(c) === -1;
  }).concat(extra.classes).join(' ');
  var content = {
    children: [],
    attributes: _objectSpread({}, extra.attributes, {
      'data-prefix': prefix,
      'data-icon': iconName,
      'class': attrClass,
      'role': extra.attributes.role || 'img',
      'xmlns': 'http://www.w3.org/2000/svg',
      'viewBox': "0 0 ".concat(width, " ").concat(height)
    })
  };

  if (watchable) {
    content.attributes[DATA_FA_I2SVG] = '';
  }

  if (title) content.children.push({
    tag: 'title',
    attributes: {
      id: content.attributes['aria-labelledby'] || "title-".concat(titleId || nextUniqueId())
    },
    children: [title]
  });

  var args = _objectSpread({}, content, {
    prefix: prefix,
    iconName: iconName,
    main: main,
    mask: mask,
    maskId: maskId,
    transform: transform,
    symbol: symbol,
    styles: extra.styles
  });

  var _ref2 = mask.found && main.found ? makeIconMasking(args) : makeIconStandard(args),
      children = _ref2.children,
      attributes = _ref2.attributes;

  args.children = children;
  args.attributes = attributes;

  if (symbol) {
    return asSymbol(args);
  } else {
    return asIcon(args);
  }
}
function makeLayersTextAbstract(params) {
  var content = params.content,
      width = params.width,
      height = params.height,
      transform = params.transform,
      title = params.title,
      extra = params.extra,
      _params$watchable2 = params.watchable,
      watchable = _params$watchable2 === void 0 ? false : _params$watchable2;

  var attributes = _objectSpread({}, extra.attributes, title ? {
    'title': title
  } : {}, {
    'class': extra.classes.join(' ')
  });

  if (watchable) {
    attributes[DATA_FA_I2SVG] = '';
  }

  var styles = _objectSpread({}, extra.styles);

  if (transformIsMeaningful(transform)) {
    styles['transform'] = transformForCss({
      transform: transform,
      startCentered: true,
      width: width,
      height: height
    });
    styles['-webkit-transform'] = styles['transform'];
  }

  var styleString = joinStyles(styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  var val = [];
  val.push({
    tag: 'span',
    attributes: attributes,
    children: [content]
  });

  if (title) {
    val.push({
      tag: 'span',
      attributes: {
        class: 'sr-only'
      },
      children: [title]
    });
  }

  return val;
}
function makeLayersCounterAbstract(params) {
  var content = params.content,
      title = params.title,
      extra = params.extra;

  var attributes = _objectSpread({}, extra.attributes, title ? {
    'title': title
  } : {}, {
    'class': extra.classes.join(' ')
  });

  var styleString = joinStyles(extra.styles);

  if (styleString.length > 0) {
    attributes['style'] = styleString;
  }

  var val = [];
  val.push({
    tag: 'span',
    attributes: attributes,
    children: [content]
  });

  if (title) {
    val.push({
      tag: 'span',
      attributes: {
        class: 'sr-only'
      },
      children: [title]
    });
  }

  return val;
}

var noop$1 = function noop() {};

var p = config.measurePerformance && PERFORMANCE && PERFORMANCE.mark && PERFORMANCE.measure ? PERFORMANCE : {
  mark: noop$1,
  measure: noop$1
};
var preamble = "FA \"5.13.0\"";

var begin = function begin(name) {
  p.mark("".concat(preamble, " ").concat(name, " begins"));
  return function () {
    return end(name);
  };
};

var end = function end(name) {
  p.mark("".concat(preamble, " ").concat(name, " ends"));
  p.measure("".concat(preamble, " ").concat(name), "".concat(preamble, " ").concat(name, " begins"), "".concat(preamble, " ").concat(name, " ends"));
};

var perf = {
  begin: begin,
  end: end
};

/**
 * Internal helper to bind a function known to have 4 arguments
 * to a given context.
 */

var bindInternal4 = function bindInternal4(func, thisContext) {
  return function (a, b, c, d) {
    return func.call(thisContext, a, b, c, d);
  };
};

/**
 * # Reduce
 *
 * A fast object `.reduce()` implementation.
 *
 * @param  {Object}   subject      The object to reduce over.
 * @param  {Function} fn           The reducer function.
 * @param  {mixed}    initialValue The initial value for the reducer, defaults to subject[0].
 * @param  {Object}   thisContext  The context for the reducer.
 * @return {mixed}                 The final result.
 */


var reduce = function fastReduceObject(subject, fn, initialValue, thisContext) {
  var keys = Object.keys(subject),
      length = keys.length,
      iterator = thisContext !== undefined ? bindInternal4(fn, thisContext) : fn,
      i,
      key,
      result;

  if (initialValue === undefined) {
    i = 1;
    result = subject[keys[0]];
  } else {
    i = 0;
    result = initialValue;
  }

  for (; i < length; i++) {
    key = keys[i];
    result = iterator(result, subject[key], key, subject);
  }

  return result;
};

function toHex(unicode) {
  var result = '';

  for (var i = 0; i < unicode.length; i++) {
    var hex = unicode.charCodeAt(i).toString(16);
    result += ('000' + hex).slice(-4);
  }

  return result;
}

function defineIcons(prefix, icons) {
  var params = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {};
  var _params$skipHooks = params.skipHooks,
      skipHooks = _params$skipHooks === void 0 ? false : _params$skipHooks;
  var normalized = Object.keys(icons).reduce(function (acc, iconName) {
    var icon = icons[iconName];
    var expanded = !!icon.icon;

    if (expanded) {
      acc[icon.iconName] = icon.icon;
    } else {
      acc[iconName] = icon;
    }

    return acc;
  }, {});

  if (typeof namespace.hooks.addPack === 'function' && !skipHooks) {
    namespace.hooks.addPack(prefix, normalized);
  } else {
    namespace.styles[prefix] = _objectSpread({}, namespace.styles[prefix] || {}, normalized);
  }
  /**
   * Font Awesome 4 used the prefix of `fa` for all icons. With the introduction
   * of new styles we needed to differentiate between them. Prefix `fa` is now an alias
   * for `fas` so we'll easy the upgrade process for our users by automatically defining
   * this as well.
   */


  if (prefix === 'fas') {
    defineIcons('fa', icons);
  }
}

var styles = namespace.styles,
    shims = namespace.shims;
var _byUnicode = {};
var _byLigature = {};
var _byOldName = {};
var build = function build() {
  var lookup = function lookup(reducer) {
    return reduce(styles, function (o, style, prefix) {
      o[prefix] = reduce(style, reducer, {});
      return o;
    }, {});
  };

  _byUnicode = lookup(function (acc, icon, iconName) {
    if (icon[3]) {
      acc[icon[3]] = iconName;
    }

    return acc;
  });
  _byLigature = lookup(function (acc, icon, iconName) {
    var ligatures = icon[2];
    acc[iconName] = iconName;
    ligatures.forEach(function (ligature) {
      acc[ligature] = iconName;
    });
    return acc;
  });
  var hasRegular = 'far' in styles;
  _byOldName = reduce(shims, function (acc, shim) {
    var oldName = shim[0];
    var prefix = shim[1];
    var iconName = shim[2];

    if (prefix === 'far' && !hasRegular) {
      prefix = 'fas';
    }

    acc[oldName] = {
      prefix: prefix,
      iconName: iconName
    };
    return acc;
  }, {});
};
build();
function byUnicode(prefix, unicode) {
  return (_byUnicode[prefix] || {})[unicode];
}
function byLigature(prefix, ligature) {
  return (_byLigature[prefix] || {})[ligature];
}
function byOldName(name) {
  return _byOldName[name] || {
    prefix: null,
    iconName: null
  };
}

var styles$1 = namespace.styles;
var emptyCanonicalIcon = function emptyCanonicalIcon() {
  return {
    prefix: null,
    iconName: null,
    rest: []
  };
};
function getCanonicalIcon(values) {
  return values.reduce(function (acc, cls) {
    var iconName = getIconName(config.familyPrefix, cls);

    if (styles$1[cls]) {
      acc.prefix = cls;
    } else if (config.autoFetchSvg && ['fas', 'far', 'fal', 'fad', 'fab', 'fa'].indexOf(cls) > -1) {
      acc.prefix = cls;
    } else if (iconName) {
      var shim = acc.prefix === 'fa' ? byOldName(iconName) : {};
      acc.iconName = shim.iconName || iconName;
      acc.prefix = shim.prefix || acc.prefix;
    } else if (cls !== config.replacementClass && cls.indexOf('fa-w-') !== 0) {
      acc.rest.push(cls);
    }

    return acc;
  }, emptyCanonicalIcon());
}
function iconFromMapping(mapping, prefix, iconName) {
  if (mapping && mapping[prefix] && mapping[prefix][iconName]) {
    return {
      prefix: prefix,
      iconName: iconName,
      icon: mapping[prefix][iconName]
    };
  }
}

function toHtml(abstractNodes) {
  var tag = abstractNodes.tag,
      _abstractNodes$attrib = abstractNodes.attributes,
      attributes = _abstractNodes$attrib === void 0 ? {} : _abstractNodes$attrib,
      _abstractNodes$childr = abstractNodes.children,
      children = _abstractNodes$childr === void 0 ? [] : _abstractNodes$childr;

  if (typeof abstractNodes === 'string') {
    return htmlEscape(abstractNodes);
  } else {
    return "<".concat(tag, " ").concat(joinAttributes(attributes), ">").concat(children.map(toHtml).join(''), "</").concat(tag, ">");
  }
}

var noop$2 = function noop() {};

function isWatched(node) {
  var i2svg = node.getAttribute ? node.getAttribute(DATA_FA_I2SVG) : null;
  return typeof i2svg === 'string';
}

function getMutator() {
  if (config.autoReplaceSvg === true) {
    return mutators.replace;
  }

  var mutator = mutators[config.autoReplaceSvg];
  return mutator || mutators.replace;
}

var mutators = {
  replace: function replace(mutation) {
    var node = mutation[0];
    var abstract = mutation[1];
    var newOuterHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');

    if (node.parentNode && node.outerHTML) {
      node.outerHTML = newOuterHTML + (config.keepOriginalSource && node.tagName.toLowerCase() !== 'svg' ? "<!-- ".concat(node.outerHTML, " -->") : '');
    } else if (node.parentNode) {
      var newNode = document.createElement('span');
      node.parentNode.replaceChild(newNode, node);
      newNode.outerHTML = newOuterHTML;
    }
  },
  nest: function nest(mutation) {
    var node = mutation[0];
    var abstract = mutation[1]; // If we already have a replaced node we do not want to continue nesting within it.
    // Short-circuit to the standard replacement

    if (~classArray(node).indexOf(config.replacementClass)) {
      return mutators.replace(mutation);
    }

    var forSvg = new RegExp("".concat(config.familyPrefix, "-.*"));
    delete abstract[0].attributes.style;
    delete abstract[0].attributes.id;
    var splitClasses = abstract[0].attributes.class.split(' ').reduce(function (acc, cls) {
      if (cls === config.replacementClass || cls.match(forSvg)) {
        acc.toSvg.push(cls);
      } else {
        acc.toNode.push(cls);
      }

      return acc;
    }, {
      toNode: [],
      toSvg: []
    });
    abstract[0].attributes.class = splitClasses.toSvg.join(' ');
    var newInnerHTML = abstract.map(function (a) {
      return toHtml(a);
    }).join('\n');
    node.setAttribute('class', splitClasses.toNode.join(' '));
    node.setAttribute(DATA_FA_I2SVG, '');
    node.innerHTML = newInnerHTML;
  }
};

function performOperationSync(op) {
  op();
}

function perform(mutations, callback) {
  var callbackFunction = typeof callback === 'function' ? callback : noop$2;

  if (mutations.length === 0) {
    callbackFunction();
  } else {
    var frame = performOperationSync;

    if (config.mutateApproach === MUTATION_APPROACH_ASYNC) {
      frame = WINDOW.requestAnimationFrame || performOperationSync;
    }

    frame(function () {
      var mutator = getMutator();
      var mark = perf.begin('mutate');
      mutations.map(mutator);
      mark();
      callbackFunction();
    });
  }
}
var disabled = false;
function disableObservation() {
  disabled = true;
}
function enableObservation() {
  disabled = false;
}
var mo = null;
function observe(options) {
  if (!MUTATION_OBSERVER) {
    return;
  }

  if (!config.observeMutations) {
    return;
  }

  var treeCallback = options.treeCallback,
      nodeCallback = options.nodeCallback,
      pseudoElementsCallback = options.pseudoElementsCallback,
      _options$observeMutat = options.observeMutationsRoot,
      observeMutationsRoot = _options$observeMutat === void 0 ? DOCUMENT : _options$observeMutat;
  mo = new MUTATION_OBSERVER(function (objects) {
    if (disabled) return;
    toArray(objects).forEach(function (mutationRecord) {
      if (mutationRecord.type === 'childList' && mutationRecord.addedNodes.length > 0 && !isWatched(mutationRecord.addedNodes[0])) {
        if (config.searchPseudoElements) {
          pseudoElementsCallback(mutationRecord.target);
        }

        treeCallback(mutationRecord.target);
      }

      if (mutationRecord.type === 'attributes' && mutationRecord.target.parentNode && config.searchPseudoElements) {
        pseudoElementsCallback(mutationRecord.target.parentNode);
      }

      if (mutationRecord.type === 'attributes' && isWatched(mutationRecord.target) && ~ATTRIBUTES_WATCHED_FOR_MUTATION.indexOf(mutationRecord.attributeName)) {
        if (mutationRecord.attributeName === 'class') {
          var _getCanonicalIcon = getCanonicalIcon(classArray(mutationRecord.target)),
              prefix = _getCanonicalIcon.prefix,
              iconName = _getCanonicalIcon.iconName;

          if (prefix) mutationRecord.target.setAttribute('data-prefix', prefix);
          if (iconName) mutationRecord.target.setAttribute('data-icon', iconName);
        } else {
          nodeCallback(mutationRecord.target);
        }
      }
    });
  });
  if (!IS_DOM) return;
  mo.observe(observeMutationsRoot, {
    childList: true,
    attributes: true,
    characterData: true,
    subtree: true
  });
}
function disconnect() {
  if (!mo) return;
  mo.disconnect();
}

function styleParser (node) {
  var style = node.getAttribute('style');
  var val = [];

  if (style) {
    val = style.split(';').reduce(function (acc, style) {
      var styles = style.split(':');
      var prop = styles[0];
      var value = styles.slice(1);

      if (prop && value.length > 0) {
        acc[prop] = value.join(':').trim();
      }

      return acc;
    }, {});
  }

  return val;
}

function classParser (node) {
  var existingPrefix = node.getAttribute('data-prefix');
  var existingIconName = node.getAttribute('data-icon');
  var innerText = node.innerText !== undefined ? node.innerText.trim() : '';
  var val = getCanonicalIcon(classArray(node));

  if (existingPrefix && existingIconName) {
    val.prefix = existingPrefix;
    val.iconName = existingIconName;
  }

  if (val.prefix && innerText.length > 1) {
    val.iconName = byLigature(val.prefix, node.innerText);
  } else if (val.prefix && innerText.length === 1) {
    val.iconName = byUnicode(val.prefix, toHex(node.innerText));
  }

  return val;
}

var parseTransformString = function parseTransformString(transformString) {
  var transform = {
    size: 16,
    x: 0,
    y: 0,
    flipX: false,
    flipY: false,
    rotate: 0
  };

  if (!transformString) {
    return transform;
  } else {
    return transformString.toLowerCase().split(' ').reduce(function (acc, n) {
      var parts = n.toLowerCase().split('-');
      var first = parts[0];
      var rest = parts.slice(1).join('-');

      if (first && rest === 'h') {
        acc.flipX = true;
        return acc;
      }

      if (first && rest === 'v') {
        acc.flipY = true;
        return acc;
      }

      rest = parseFloat(rest);

      if (isNaN(rest)) {
        return acc;
      }

      switch (first) {
        case 'grow':
          acc.size = acc.size + rest;
          break;

        case 'shrink':
          acc.size = acc.size - rest;
          break;

        case 'left':
          acc.x = acc.x - rest;
          break;

        case 'right':
          acc.x = acc.x + rest;
          break;

        case 'up':
          acc.y = acc.y - rest;
          break;

        case 'down':
          acc.y = acc.y + rest;
          break;

        case 'rotate':
          acc.rotate = acc.rotate + rest;
          break;
      }

      return acc;
    }, transform);
  }
};
function transformParser (node) {
  return parseTransformString(node.getAttribute('data-fa-transform'));
}

function symbolParser (node) {
  var symbol = node.getAttribute('data-fa-symbol');
  return symbol === null ? false : symbol === '' ? true : symbol;
}

function attributesParser (node) {
  var extraAttributes = toArray(node.attributes).reduce(function (acc, attr) {
    if (acc.name !== 'class' && acc.name !== 'style') {
      acc[attr.name] = attr.value;
    }

    return acc;
  }, {});
  var title = node.getAttribute('title');
  var titleId = node.getAttribute('data-fa-title-id');

  if (config.autoA11y) {
    if (title) {
      extraAttributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
    } else {
      extraAttributes['aria-hidden'] = 'true';
      extraAttributes['focusable'] = 'false';
    }
  }

  return extraAttributes;
}

function maskParser (node) {
  var mask = node.getAttribute('data-fa-mask');

  if (!mask) {
    return emptyCanonicalIcon();
  } else {
    return getCanonicalIcon(mask.split(' ').map(function (i) {
      return i.trim();
    }));
  }
}

function blankMeta() {
  return {
    iconName: null,
    title: null,
    titleId: null,
    prefix: null,
    transform: meaninglessTransform,
    symbol: false,
    mask: null,
    maskId: null,
    extra: {
      classes: [],
      styles: {},
      attributes: {}
    }
  };
}
function parseMeta(node) {
  var _classParser = classParser(node),
      iconName = _classParser.iconName,
      prefix = _classParser.prefix,
      extraClasses = _classParser.rest;

  var extraStyles = styleParser(node);
  var transform = transformParser(node);
  var symbol = symbolParser(node);
  var extraAttributes = attributesParser(node);
  var mask = maskParser(node);
  return {
    iconName: iconName,
    title: node.getAttribute('title'),
    titleId: node.getAttribute('data-fa-title-id'),
    prefix: prefix,
    transform: transform,
    symbol: symbol,
    mask: mask,
    maskId: node.getAttribute('data-fa-mask-id'),
    extra: {
      classes: extraClasses,
      styles: extraStyles,
      attributes: extraAttributes
    }
  };
}

function MissingIcon(error) {
  this.name = 'MissingIcon';
  this.message = error || 'Icon unavailable';
  this.stack = new Error().stack;
}
MissingIcon.prototype = Object.create(Error.prototype);
MissingIcon.prototype.constructor = MissingIcon;

var FILL = {
  fill: 'currentColor'
};
var ANIMATION_BASE = {
  attributeType: 'XML',
  repeatCount: 'indefinite',
  dur: '2s'
};
var RING = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    d: 'M156.5,447.7l-12.6,29.5c-18.7-9.5-35.9-21.2-51.5-34.9l22.7-22.7C127.6,430.5,141.5,440,156.5,447.7z M40.6,272H8.5 c1.4,21.2,5.4,41.7,11.7,61.1L50,321.2C45.1,305.5,41.8,289,40.6,272z M40.6,240c1.4-18.8,5.2-37,11.1-54.1l-29.5-12.6 C14.7,194.3,10,216.7,8.5,240H40.6z M64.3,156.5c7.8-14.9,17.2-28.8,28.1-41.5L69.7,92.3c-13.7,15.6-25.5,32.8-34.9,51.5 L64.3,156.5z M397,419.6c-13.9,12-29.4,22.3-46.1,30.4l11.9,29.8c20.7-9.9,39.8-22.6,56.9-37.6L397,419.6z M115,92.4 c13.9-12,29.4-22.3,46.1-30.4l-11.9-29.8c-20.7,9.9-39.8,22.6-56.8,37.6L115,92.4z M447.7,355.5c-7.8,14.9-17.2,28.8-28.1,41.5 l22.7,22.7c13.7-15.6,25.5-32.9,34.9-51.5L447.7,355.5z M471.4,272c-1.4,18.8-5.2,37-11.1,54.1l29.5,12.6 c7.5-21.1,12.2-43.5,13.6-66.8H471.4z M321.2,462c-15.7,5-32.2,8.2-49.2,9.4v32.1c21.2-1.4,41.7-5.4,61.1-11.7L321.2,462z M240,471.4c-18.8-1.4-37-5.2-54.1-11.1l-12.6,29.5c21.1,7.5,43.5,12.2,66.8,13.6V471.4z M462,190.8c5,15.7,8.2,32.2,9.4,49.2h32.1 c-1.4-21.2-5.4-41.7-11.7-61.1L462,190.8z M92.4,397c-12-13.9-22.3-29.4-30.4-46.1l-29.8,11.9c9.9,20.7,22.6,39.8,37.6,56.9 L92.4,397z M272,40.6c18.8,1.4,36.9,5.2,54.1,11.1l12.6-29.5C317.7,14.7,295.3,10,272,8.5V40.6z M190.8,50 c15.7-5,32.2-8.2,49.2-9.4V8.5c-21.2,1.4-41.7,5.4-61.1,11.7L190.8,50z M442.3,92.3L419.6,115c12,13.9,22.3,29.4,30.5,46.1 l29.8-11.9C470,128.5,457.3,109.4,442.3,92.3z M397,92.4l22.7-22.7c-15.6-13.7-32.8-25.5-51.5-34.9l-12.6,29.5 C370.4,72.1,384.4,81.5,397,92.4z'
  })
};

var OPACITY_ANIMATE = _objectSpread({}, ANIMATION_BASE, {
  attributeName: 'opacity'
});

var DOT = {
  tag: 'circle',
  attributes: _objectSpread({}, FILL, {
    cx: '256',
    cy: '364',
    r: '28'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, ANIMATION_BASE, {
      attributeName: 'r',
      values: '28;14;28;28;14;28;'
    })
  }, {
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;1;1;0;1;'
    })
  }]
};
var QUESTION = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '1',
    d: 'M263.7,312h-16c-6.6,0-12-5.4-12-12c0-71,77.4-63.9,77.4-107.8c0-20-17.8-40.2-57.4-40.2c-29.1,0-44.3,9.6-59.2,28.7 c-3.9,5-11.1,6-16.2,2.4l-13.1-9.2c-5.6-3.9-6.9-11.8-2.6-17.2c21.2-27.2,46.4-44.7,91.2-44.7c52.3,0,97.4,29.8,97.4,80.2 c0,67.6-77.4,63.5-77.4,107.8C275.7,306.6,270.3,312,263.7,312z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '1;0;0;0;0;1;'
    })
  }]
};
var EXCLAMATION = {
  tag: 'path',
  attributes: _objectSpread({}, FILL, {
    opacity: '0',
    d: 'M232.5,134.5l7,168c0.3,6.4,5.6,11.5,12,11.5h9c6.4,0,11.7-5.1,12-11.5l7-168c0.3-6.8-5.2-12.5-12-12.5h-23 C237.7,122,232.2,127.7,232.5,134.5z'
  }),
  children: [{
    tag: 'animate',
    attributes: _objectSpread({}, OPACITY_ANIMATE, {
      values: '0;0;1;1;0;0;'
    })
  }]
};
var missing = {
  tag: 'g',
  children: [RING, DOT, QUESTION, EXCLAMATION]
};

var styles$2 = namespace.styles;
function asFoundIcon(icon) {
  var width = icon[0];
  var height = icon[1];

  var _icon$slice = icon.slice(4),
      _icon$slice2 = _slicedToArray(_icon$slice, 1),
      vectorData = _icon$slice2[0];

  var element = null;

  if (Array.isArray(vectorData)) {
    element = {
      tag: 'g',
      attributes: {
        class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.GROUP)
      },
      children: [{
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.SECONDARY),
          fill: 'currentColor',
          d: vectorData[0]
        }
      }, {
        tag: 'path',
        attributes: {
          class: "".concat(config.familyPrefix, "-").concat(DUOTONE_CLASSES.PRIMARY),
          fill: 'currentColor',
          d: vectorData[1]
        }
      }]
    };
  } else {
    element = {
      tag: 'path',
      attributes: {
        fill: 'currentColor',
        d: vectorData
      }
    };
  }

  return {
    found: true,
    width: width,
    height: height,
    icon: element
  };
}
function findIcon(iconName, prefix) {
  return new picked(function (resolve, reject) {
    var val = {
      found: false,
      width: 512,
      height: 512,
      icon: missing
    };

    if (iconName && prefix && styles$2[prefix] && styles$2[prefix][iconName]) {
      var icon = styles$2[prefix][iconName];
      return resolve(asFoundIcon(icon));
    }

    var headers = {};

    if (_typeof(WINDOW.FontAwesomeKitConfig) === 'object' && typeof window.FontAwesomeKitConfig.token === 'string') {
      headers['fa-kit-token'] = WINDOW.FontAwesomeKitConfig.token;
    }

    if (iconName && prefix && !config.showMissingIcons) {
      reject(new MissingIcon("Icon is missing for prefix ".concat(prefix, " with icon name ").concat(iconName)));
    } else {
      resolve(val);
    }
  });
}

var styles$3 = namespace.styles;

function generateSvgReplacementMutation(node, nodeMeta) {
  var iconName = nodeMeta.iconName,
      title = nodeMeta.title,
      titleId = nodeMeta.titleId,
      prefix = nodeMeta.prefix,
      transform = nodeMeta.transform,
      symbol = nodeMeta.symbol,
      mask = nodeMeta.mask,
      maskId = nodeMeta.maskId,
      extra = nodeMeta.extra;
  return new picked(function (resolve, reject) {
    picked.all([findIcon(iconName, prefix), findIcon(mask.iconName, mask.prefix)]).then(function (_ref) {
      var _ref2 = _slicedToArray(_ref, 2),
          main = _ref2[0],
          mask = _ref2[1];

      resolve([node, makeInlineSvgAbstract({
        icons: {
          main: main,
          mask: mask
        },
        prefix: prefix,
        iconName: iconName,
        transform: transform,
        symbol: symbol,
        mask: mask,
        maskId: maskId,
        title: title,
        titleId: titleId,
        extra: extra,
        watchable: true
      })]);
    });
  });
}

function generateLayersText(node, nodeMeta) {
  var title = nodeMeta.title,
      transform = nodeMeta.transform,
      extra = nodeMeta.extra;
  var width = null;
  var height = null;

  if (IS_IE) {
    var computedFontSize = parseInt(getComputedStyle(node).fontSize, 10);
    var boundingClientRect = node.getBoundingClientRect();
    width = boundingClientRect.width / computedFontSize;
    height = boundingClientRect.height / computedFontSize;
  }

  if (config.autoA11y && !title) {
    extra.attributes['aria-hidden'] = 'true';
  }

  return picked.resolve([node, makeLayersTextAbstract({
    content: node.innerHTML,
    width: width,
    height: height,
    transform: transform,
    title: title,
    extra: extra,
    watchable: true
  })]);
}

function generateMutation(node) {
  var nodeMeta = parseMeta(node);

  if (~nodeMeta.extra.classes.indexOf(LAYERS_TEXT_CLASSNAME)) {
    return generateLayersText(node, nodeMeta);
  } else {
    return generateSvgReplacementMutation(node, nodeMeta);
  }
}

function onTree(root) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  if (!IS_DOM) return;
  var htmlClassList = DOCUMENT.documentElement.classList;

  var hclAdd = function hclAdd(suffix) {
    return htmlClassList.add("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };

  var hclRemove = function hclRemove(suffix) {
    return htmlClassList.remove("".concat(HTML_CLASS_I2SVG_BASE_CLASS, "-").concat(suffix));
  };

  var prefixes = config.autoFetchSvg ? Object.keys(PREFIX_TO_STYLE) : Object.keys(styles$3);
  var prefixesDomQuery = [".".concat(LAYERS_TEXT_CLASSNAME, ":not([").concat(DATA_FA_I2SVG, "])")].concat(prefixes.map(function (p) {
    return ".".concat(p, ":not([").concat(DATA_FA_I2SVG, "])");
  })).join(', ');

  if (prefixesDomQuery.length === 0) {
    return;
  }

  var candidates = [];

  try {
    candidates = toArray(root.querySelectorAll(prefixesDomQuery));
  } catch (e) {// noop
  }

  if (candidates.length > 0) {
    hclAdd('pending');
    hclRemove('complete');
  } else {
    return;
  }

  var mark = perf.begin('onTree');
  var mutations = candidates.reduce(function (acc, node) {
    try {
      var mutation = generateMutation(node);

      if (mutation) {
        acc.push(mutation);
      }
    } catch (e) {
      if (!PRODUCTION) {
        if (e instanceof MissingIcon) {
          console.error(e);
        }
      }
    }

    return acc;
  }, []);
  return new picked(function (resolve, reject) {
    picked.all(mutations).then(function (resolvedMutations) {
      perform(resolvedMutations, function () {
        hclAdd('active');
        hclAdd('complete');
        hclRemove('pending');
        if (typeof callback === 'function') callback();
        mark();
        resolve();
      });
    }).catch(function () {
      mark();
      reject();
    });
  });
}
function onNode(node) {
  var callback = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : null;
  generateMutation(node).then(function (mutation) {
    if (mutation) {
      perform([mutation], callback);
    }
  });
}

function replaceForPosition(node, position) {
  var pendingAttribute = "".concat(DATA_FA_PSEUDO_ELEMENT_PENDING).concat(position.replace(':', '-'));
  return new picked(function (resolve, reject) {
    if (node.getAttribute(pendingAttribute) !== null) {
      // This node is already being processed
      return resolve();
    }

    var children = toArray(node.children);
    var alreadyProcessedPseudoElement = children.filter(function (c) {
      return c.getAttribute(DATA_FA_PSEUDO_ELEMENT) === position;
    })[0];
    var styles = WINDOW.getComputedStyle(node, position);
    var fontFamily = styles.getPropertyValue('font-family').match(FONT_FAMILY_PATTERN);
    var fontWeight = styles.getPropertyValue('font-weight');
    var content = styles.getPropertyValue('content');

    if (alreadyProcessedPseudoElement && !fontFamily) {
      // If we've already processed it but the current computed style does not result in a font-family,
      // that probably means that a class name that was previously present to make the icon has been
      // removed. So we now should delete the icon.
      node.removeChild(alreadyProcessedPseudoElement);
      return resolve();
    } else if (fontFamily && content !== 'none' && content !== '') {
      var prefix = ~['Solid', 'Regular', 'Light', 'Duotone', 'Brands'].indexOf(fontFamily[1]) ? STYLE_TO_PREFIX[fontFamily[1].toLowerCase()] : FONT_WEIGHT_TO_PREFIX[fontWeight];
      var hexValue = toHex(content.length === 3 ? content.substr(1, 1) : content);
      var iconName = byUnicode(prefix, hexValue);
      var iconIdentifier = iconName; // Only convert the pseudo element in this :before/:after position into an icon if we haven't
      // already done so with the same prefix and iconName

      if (iconName && (!alreadyProcessedPseudoElement || alreadyProcessedPseudoElement.getAttribute(DATA_PREFIX) !== prefix || alreadyProcessedPseudoElement.getAttribute(DATA_ICON) !== iconIdentifier)) {
        node.setAttribute(pendingAttribute, iconIdentifier);

        if (alreadyProcessedPseudoElement) {
          // Delete the old one, since we're replacing it with a new one
          node.removeChild(alreadyProcessedPseudoElement);
        }

        var meta = blankMeta();
        var extra = meta.extra;
        extra.attributes[DATA_FA_PSEUDO_ELEMENT] = position;
        findIcon(iconName, prefix).then(function (main) {
          var abstract = makeInlineSvgAbstract(_objectSpread({}, meta, {
            icons: {
              main: main,
              mask: emptyCanonicalIcon()
            },
            prefix: prefix,
            iconName: iconIdentifier,
            extra: extra,
            watchable: true
          }));
          var element = DOCUMENT.createElement('svg');

          if (position === ':before') {
            node.insertBefore(element, node.firstChild);
          } else {
            node.appendChild(element);
          }

          element.outerHTML = abstract.map(function (a) {
            return toHtml(a);
          }).join('\n');
          node.removeAttribute(pendingAttribute);
          resolve();
        }).catch(reject);
      } else {
        resolve();
      }
    } else {
      resolve();
    }
  });
}

function replace(node) {
  return picked.all([replaceForPosition(node, ':before'), replaceForPosition(node, ':after')]);
}

function processable(node) {
  return node.parentNode !== document.head && !~TAGNAMES_TO_SKIP_FOR_PSEUDOELEMENTS.indexOf(node.tagName.toUpperCase()) && !node.getAttribute(DATA_FA_PSEUDO_ELEMENT) && (!node.parentNode || node.parentNode.tagName !== 'svg');
}

function searchPseudoElements (root) {
  if (!IS_DOM) return;
  return new picked(function (resolve, reject) {
    var operations = toArray(root.querySelectorAll('*')).filter(processable).map(replace);
    var end = perf.begin('searchPseudoElements');
    disableObservation();
    picked.all(operations).then(function () {
      end();
      enableObservation();
      resolve();
    }).catch(function () {
      end();
      enableObservation();
      reject();
    });
  });
}

var baseStyles = "svg:not(:root).svg-inline--fa {\n  overflow: visible;\n}\n\n.svg-inline--fa {\n  display: inline-block;\n  font-size: inherit;\n  height: 1em;\n  overflow: visible;\n  vertical-align: -0.125em;\n}\n.svg-inline--fa.fa-lg {\n  vertical-align: -0.225em;\n}\n.svg-inline--fa.fa-w-1 {\n  width: 0.0625em;\n}\n.svg-inline--fa.fa-w-2 {\n  width: 0.125em;\n}\n.svg-inline--fa.fa-w-3 {\n  width: 0.1875em;\n}\n.svg-inline--fa.fa-w-4 {\n  width: 0.25em;\n}\n.svg-inline--fa.fa-w-5 {\n  width: 0.3125em;\n}\n.svg-inline--fa.fa-w-6 {\n  width: 0.375em;\n}\n.svg-inline--fa.fa-w-7 {\n  width: 0.4375em;\n}\n.svg-inline--fa.fa-w-8 {\n  width: 0.5em;\n}\n.svg-inline--fa.fa-w-9 {\n  width: 0.5625em;\n}\n.svg-inline--fa.fa-w-10 {\n  width: 0.625em;\n}\n.svg-inline--fa.fa-w-11 {\n  width: 0.6875em;\n}\n.svg-inline--fa.fa-w-12 {\n  width: 0.75em;\n}\n.svg-inline--fa.fa-w-13 {\n  width: 0.8125em;\n}\n.svg-inline--fa.fa-w-14 {\n  width: 0.875em;\n}\n.svg-inline--fa.fa-w-15 {\n  width: 0.9375em;\n}\n.svg-inline--fa.fa-w-16 {\n  width: 1em;\n}\n.svg-inline--fa.fa-w-17 {\n  width: 1.0625em;\n}\n.svg-inline--fa.fa-w-18 {\n  width: 1.125em;\n}\n.svg-inline--fa.fa-w-19 {\n  width: 1.1875em;\n}\n.svg-inline--fa.fa-w-20 {\n  width: 1.25em;\n}\n.svg-inline--fa.fa-pull-left {\n  margin-right: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-pull-right {\n  margin-left: 0.3em;\n  width: auto;\n}\n.svg-inline--fa.fa-border {\n  height: 1.5em;\n}\n.svg-inline--fa.fa-li {\n  width: 2em;\n}\n.svg-inline--fa.fa-fw {\n  width: 1.25em;\n}\n\n.fa-layers svg.svg-inline--fa {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.fa-layers {\n  display: inline-block;\n  height: 1em;\n  position: relative;\n  text-align: center;\n  vertical-align: -0.125em;\n  width: 1em;\n}\n.fa-layers svg.svg-inline--fa {\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter, .fa-layers-text {\n  display: inline-block;\n  position: absolute;\n  text-align: center;\n}\n\n.fa-layers-text {\n  left: 50%;\n  top: 50%;\n  -webkit-transform: translate(-50%, -50%);\n          transform: translate(-50%, -50%);\n  -webkit-transform-origin: center center;\n          transform-origin: center center;\n}\n\n.fa-layers-counter {\n  background-color: #ff253a;\n  border-radius: 1em;\n  -webkit-box-sizing: border-box;\n          box-sizing: border-box;\n  color: #fff;\n  height: 1.5em;\n  line-height: 1;\n  max-width: 5em;\n  min-width: 1.5em;\n  overflow: hidden;\n  padding: 0.25em;\n  right: 0;\n  text-overflow: ellipsis;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-bottom-right {\n  bottom: 0;\n  right: 0;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom right;\n          transform-origin: bottom right;\n}\n\n.fa-layers-bottom-left {\n  bottom: 0;\n  left: 0;\n  right: auto;\n  top: auto;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: bottom left;\n          transform-origin: bottom left;\n}\n\n.fa-layers-top-right {\n  right: 0;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top right;\n          transform-origin: top right;\n}\n\n.fa-layers-top-left {\n  left: 0;\n  right: auto;\n  top: 0;\n  -webkit-transform: scale(0.25);\n          transform: scale(0.25);\n  -webkit-transform-origin: top left;\n          transform-origin: top left;\n}\n\n.fa-lg {\n  font-size: 1.3333333333em;\n  line-height: 0.75em;\n  vertical-align: -0.0667em;\n}\n\n.fa-xs {\n  font-size: 0.75em;\n}\n\n.fa-sm {\n  font-size: 0.875em;\n}\n\n.fa-1x {\n  font-size: 1em;\n}\n\n.fa-2x {\n  font-size: 2em;\n}\n\n.fa-3x {\n  font-size: 3em;\n}\n\n.fa-4x {\n  font-size: 4em;\n}\n\n.fa-5x {\n  font-size: 5em;\n}\n\n.fa-6x {\n  font-size: 6em;\n}\n\n.fa-7x {\n  font-size: 7em;\n}\n\n.fa-8x {\n  font-size: 8em;\n}\n\n.fa-9x {\n  font-size: 9em;\n}\n\n.fa-10x {\n  font-size: 10em;\n}\n\n.fa-fw {\n  text-align: center;\n  width: 1.25em;\n}\n\n.fa-ul {\n  list-style-type: none;\n  margin-left: 2.5em;\n  padding-left: 0;\n}\n.fa-ul > li {\n  position: relative;\n}\n\n.fa-li {\n  left: -2em;\n  position: absolute;\n  text-align: center;\n  width: 2em;\n  line-height: inherit;\n}\n\n.fa-border {\n  border: solid 0.08em #eee;\n  border-radius: 0.1em;\n  padding: 0.2em 0.25em 0.15em;\n}\n\n.fa-pull-left {\n  float: left;\n}\n\n.fa-pull-right {\n  float: right;\n}\n\n.fa.fa-pull-left,\n.fas.fa-pull-left,\n.far.fa-pull-left,\n.fal.fa-pull-left,\n.fab.fa-pull-left {\n  margin-right: 0.3em;\n}\n.fa.fa-pull-right,\n.fas.fa-pull-right,\n.far.fa-pull-right,\n.fal.fa-pull-right,\n.fab.fa-pull-right {\n  margin-left: 0.3em;\n}\n\n.fa-spin {\n  -webkit-animation: fa-spin 2s infinite linear;\n          animation: fa-spin 2s infinite linear;\n}\n\n.fa-pulse {\n  -webkit-animation: fa-spin 1s infinite steps(8);\n          animation: fa-spin 1s infinite steps(8);\n}\n\n@-webkit-keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n\n@keyframes fa-spin {\n  0% {\n    -webkit-transform: rotate(0deg);\n            transform: rotate(0deg);\n  }\n  100% {\n    -webkit-transform: rotate(360deg);\n            transform: rotate(360deg);\n  }\n}\n.fa-rotate-90 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=1)\";\n  -webkit-transform: rotate(90deg);\n          transform: rotate(90deg);\n}\n\n.fa-rotate-180 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2)\";\n  -webkit-transform: rotate(180deg);\n          transform: rotate(180deg);\n}\n\n.fa-rotate-270 {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=3)\";\n  -webkit-transform: rotate(270deg);\n          transform: rotate(270deg);\n}\n\n.fa-flip-horizontal {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=0, mirror=1)\";\n  -webkit-transform: scale(-1, 1);\n          transform: scale(-1, 1);\n}\n\n.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(1, -1);\n          transform: scale(1, -1);\n}\n\n.fa-flip-both, .fa-flip-horizontal.fa-flip-vertical {\n  -ms-filter: \"progid:DXImageTransform.Microsoft.BasicImage(rotation=2, mirror=1)\";\n  -webkit-transform: scale(-1, -1);\n          transform: scale(-1, -1);\n}\n\n:root .fa-rotate-90,\n:root .fa-rotate-180,\n:root .fa-rotate-270,\n:root .fa-flip-horizontal,\n:root .fa-flip-vertical,\n:root .fa-flip-both {\n  -webkit-filter: none;\n          filter: none;\n}\n\n.fa-stack {\n  display: inline-block;\n  height: 2em;\n  position: relative;\n  width: 2.5em;\n}\n\n.fa-stack-1x,\n.fa-stack-2x {\n  bottom: 0;\n  left: 0;\n  margin: auto;\n  position: absolute;\n  right: 0;\n  top: 0;\n}\n\n.svg-inline--fa.fa-stack-1x {\n  height: 1em;\n  width: 1.25em;\n}\n.svg-inline--fa.fa-stack-2x {\n  height: 2em;\n  width: 2.5em;\n}\n\n.fa-inverse {\n  color: #fff;\n}\n\n.sr-only {\n  border: 0;\n  clip: rect(0, 0, 0, 0);\n  height: 1px;\n  margin: -1px;\n  overflow: hidden;\n  padding: 0;\n  position: absolute;\n  width: 1px;\n}\n\n.sr-only-focusable:active, .sr-only-focusable:focus {\n  clip: auto;\n  height: auto;\n  margin: 0;\n  overflow: visible;\n  position: static;\n  width: auto;\n}\n\n.svg-inline--fa .fa-primary {\n  fill: var(--fa-primary-color, currentColor);\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa .fa-secondary {\n  fill: var(--fa-secondary-color, currentColor);\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-primary {\n  opacity: 0.4;\n  opacity: var(--fa-secondary-opacity, 0.4);\n}\n\n.svg-inline--fa.fa-swap-opacity .fa-secondary {\n  opacity: 1;\n  opacity: var(--fa-primary-opacity, 1);\n}\n\n.svg-inline--fa mask .fa-primary,\n.svg-inline--fa mask .fa-secondary {\n  fill: black;\n}\n\n.fad.fa-inverse {\n  color: #fff;\n}";

function css () {
  var dfp = DEFAULT_FAMILY_PREFIX;
  var drc = DEFAULT_REPLACEMENT_CLASS;
  var fp = config.familyPrefix;
  var rc = config.replacementClass;
  var s = baseStyles;

  if (fp !== dfp || rc !== drc) {
    var dPatt = new RegExp("\\.".concat(dfp, "\\-"), 'g');
    var customPropPatt = new RegExp("\\--".concat(dfp, "\\-"), 'g');
    var rPatt = new RegExp("\\.".concat(drc), 'g');
    s = s.replace(dPatt, ".".concat(fp, "-")).replace(customPropPatt, "--".concat(fp, "-")).replace(rPatt, ".".concat(rc));
  }

  return s;
}

var Library =
/*#__PURE__*/
function () {
  function Library() {
    _classCallCheck(this, Library);

    this.definitions = {};
  }

  _createClass(Library, [{
    key: "add",
    value: function add() {
      var _this = this;

      for (var _len = arguments.length, definitions = new Array(_len), _key = 0; _key < _len; _key++) {
        definitions[_key] = arguments[_key];
      }

      var additions = definitions.reduce(this._pullDefinitions, {});
      Object.keys(additions).forEach(function (key) {
        _this.definitions[key] = _objectSpread({}, _this.definitions[key] || {}, additions[key]);
        defineIcons(key, additions[key]);
        build();
      });
    }
  }, {
    key: "reset",
    value: function reset() {
      this.definitions = {};
    }
  }, {
    key: "_pullDefinitions",
    value: function _pullDefinitions(additions, definition) {
      var normalized = definition.prefix && definition.iconName && definition.icon ? {
        0: definition
      } : definition;
      Object.keys(normalized).map(function (key) {
        var _normalized$key = normalized[key],
            prefix = _normalized$key.prefix,
            iconName = _normalized$key.iconName,
            icon = _normalized$key.icon;
        if (!additions[prefix]) additions[prefix] = {};
        additions[prefix][iconName] = icon;
      });
      return additions;
    }
  }]);

  return Library;
}();

function ensureCss() {
  if (config.autoAddCss && !_cssInserted) {
    insertCss(css());

    _cssInserted = true;
  }
}

function apiObject(val, abstractCreator) {
  Object.defineProperty(val, 'abstract', {
    get: abstractCreator
  });
  Object.defineProperty(val, 'html', {
    get: function get() {
      return val.abstract.map(function (a) {
        return toHtml(a);
      });
    }
  });
  Object.defineProperty(val, 'node', {
    get: function get() {
      if (!IS_DOM) return;
      var container = DOCUMENT.createElement('div');
      container.innerHTML = val.html;
      return container.children;
    }
  });
  return val;
}

function findIconDefinition(iconLookup) {
  var _iconLookup$prefix = iconLookup.prefix,
      prefix = _iconLookup$prefix === void 0 ? 'fa' : _iconLookup$prefix,
      iconName = iconLookup.iconName;
  if (!iconName) return;
  return iconFromMapping(library.definitions, prefix, iconName) || iconFromMapping(namespace.styles, prefix, iconName);
}

function resolveIcons(next) {
  return function (maybeIconDefinition) {
    var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
    var iconDefinition = (maybeIconDefinition || {}).icon ? maybeIconDefinition : findIconDefinition(maybeIconDefinition || {});
    var mask = params.mask;

    if (mask) {
      mask = (mask || {}).icon ? mask : findIconDefinition(mask || {});
    }

    return next(iconDefinition, _objectSpread({}, params, {
      mask: mask
    }));
  };
}

var library = new Library();
var noAuto = function noAuto() {
  config.autoReplaceSvg = false;
  config.observeMutations = false;
  disconnect();
};
var _cssInserted = false;
var dom = {
  i2svg: function i2svg() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};

    if (IS_DOM) {
      ensureCss();
      var _params$node = params.node,
          node = _params$node === void 0 ? DOCUMENT : _params$node,
          _params$callback = params.callback,
          callback = _params$callback === void 0 ? function () {} : _params$callback;

      if (config.searchPseudoElements) {
        searchPseudoElements(node);
      }

      return onTree(node, callback);
    } else {
      return picked.reject('Operation requires a DOM of some kind.');
    }
  },
  css: css,
  insertCss: function insertCss$$1() {
    if (!_cssInserted) {
      insertCss(css());

      _cssInserted = true;
    }
  },
  watch: function watch() {
    var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
    var autoReplaceSvgRoot = params.autoReplaceSvgRoot,
        observeMutationsRoot = params.observeMutationsRoot;

    if (config.autoReplaceSvg === false) {
      config.autoReplaceSvg = true;
    }

    config.observeMutations = true;
    domready(function () {
      autoReplace({
        autoReplaceSvgRoot: autoReplaceSvgRoot
      });
      observe({
        treeCallback: onTree,
        nodeCallback: onNode,
        pseudoElementsCallback: searchPseudoElements,
        observeMutationsRoot: observeMutationsRoot
      });
    });
  }
};
var parse = {
  transform: function transform(transformString) {
    return parseTransformString(transformString);
  }
};
var icon = resolveIcons(function (iconDefinition) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform = params.transform,
      transform = _params$transform === void 0 ? meaninglessTransform : _params$transform,
      _params$symbol = params.symbol,
      symbol = _params$symbol === void 0 ? false : _params$symbol,
      _params$mask = params.mask,
      mask = _params$mask === void 0 ? null : _params$mask,
      _params$maskId = params.maskId,
      maskId = _params$maskId === void 0 ? null : _params$maskId,
      _params$title = params.title,
      title = _params$title === void 0 ? null : _params$title,
      _params$titleId = params.titleId,
      titleId = _params$titleId === void 0 ? null : _params$titleId,
      _params$classes = params.classes,
      classes = _params$classes === void 0 ? [] : _params$classes,
      _params$attributes = params.attributes,
      attributes = _params$attributes === void 0 ? {} : _params$attributes,
      _params$styles = params.styles,
      styles = _params$styles === void 0 ? {} : _params$styles;
  if (!iconDefinition) return;
  var prefix = iconDefinition.prefix,
      iconName = iconDefinition.iconName,
      icon = iconDefinition.icon;
  return apiObject(_objectSpread({
    type: 'icon'
  }, iconDefinition), function () {
    ensureCss();

    if (config.autoA11y) {
      if (title) {
        attributes['aria-labelledby'] = "".concat(config.replacementClass, "-title-").concat(titleId || nextUniqueId());
      } else {
        attributes['aria-hidden'] = 'true';
        attributes['focusable'] = 'false';
      }
    }

    return makeInlineSvgAbstract({
      icons: {
        main: asFoundIcon(icon),
        mask: mask ? asFoundIcon(mask.icon) : {
          found: false,
          width: null,
          height: null,
          icon: {}
        }
      },
      prefix: prefix,
      iconName: iconName,
      transform: _objectSpread({}, meaninglessTransform, transform),
      symbol: symbol,
      title: title,
      maskId: maskId,
      titleId: titleId,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: classes
      }
    });
  });
});
var text = function text(content) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$transform2 = params.transform,
      transform = _params$transform2 === void 0 ? meaninglessTransform : _params$transform2,
      _params$title2 = params.title,
      title = _params$title2 === void 0 ? null : _params$title2,
      _params$classes2 = params.classes,
      classes = _params$classes2 === void 0 ? [] : _params$classes2,
      _params$attributes2 = params.attributes,
      attributes = _params$attributes2 === void 0 ? {} : _params$attributes2,
      _params$styles2 = params.styles,
      styles = _params$styles2 === void 0 ? {} : _params$styles2;
  return apiObject({
    type: 'text',
    content: content
  }, function () {
    ensureCss();
    return makeLayersTextAbstract({
      content: content,
      transform: _objectSpread({}, meaninglessTransform, transform),
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: ["".concat(config.familyPrefix, "-layers-text")].concat(_toConsumableArray(classes))
      }
    });
  });
};
var counter = function counter(content) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$title3 = params.title,
      title = _params$title3 === void 0 ? null : _params$title3,
      _params$classes3 = params.classes,
      classes = _params$classes3 === void 0 ? [] : _params$classes3,
      _params$attributes3 = params.attributes,
      attributes = _params$attributes3 === void 0 ? {} : _params$attributes3,
      _params$styles3 = params.styles,
      styles = _params$styles3 === void 0 ? {} : _params$styles3;
  return apiObject({
    type: 'counter',
    content: content
  }, function () {
    ensureCss();
    return makeLayersCounterAbstract({
      content: content.toString(),
      title: title,
      extra: {
        attributes: attributes,
        styles: styles,
        classes: ["".concat(config.familyPrefix, "-layers-counter")].concat(_toConsumableArray(classes))
      }
    });
  });
};
var layer = function layer(assembler) {
  var params = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var _params$classes4 = params.classes,
      classes = _params$classes4 === void 0 ? [] : _params$classes4;
  return apiObject({
    type: 'layer'
  }, function () {
    ensureCss();
    var children = [];
    assembler(function (args) {
      Array.isArray(args) ? args.map(function (a) {
        children = children.concat(a.abstract);
      }) : children = children.concat(args.abstract);
    });
    return [{
      tag: 'span',
      attributes: {
        class: ["".concat(config.familyPrefix, "-layers")].concat(_toConsumableArray(classes)).join(' ')
      },
      children: children
    }];
  });
};
var api = {
  noAuto: noAuto,
  config: config,
  dom: dom,
  library: library,
  parse: parse,
  findIconDefinition: findIconDefinition,
  icon: icon,
  text: text,
  counter: counter,
  layer: layer,
  toHtml: toHtml
};

var autoReplace = function autoReplace() {
  var params = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : {};
  var _params$autoReplaceSv = params.autoReplaceSvgRoot,
      autoReplaceSvgRoot = _params$autoReplaceSv === void 0 ? DOCUMENT : _params$autoReplaceSv;
  if ((Object.keys(namespace.styles).length > 0 || config.autoFetchSvg) && IS_DOM && config.autoReplaceSvg) api.dom.i2svg({
    node: autoReplaceSvgRoot
  });
};



/* WEBPACK VAR INJECTION */}.call(__webpack_exports__, __webpack_require__(/*! ./../../process/browser.js */ 18), __webpack_require__(/*! ./../../webpack/buildin/global.js */ 2), __webpack_require__(/*! ./../../timers-browserify/main.js */ 31).setImmediate))

/***/ }),
/* 31 */
/*!*****************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/timers-browserify/main.js ***!
  \*****************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global) {var scope = (typeof global !== "undefined" && global) ||
            (typeof self !== "undefined" && self) ||
            window;
var apply = Function.prototype.apply;

// DOM APIs, for completeness

exports.setTimeout = function() {
  return new Timeout(apply.call(setTimeout, scope, arguments), clearTimeout);
};
exports.setInterval = function() {
  return new Timeout(apply.call(setInterval, scope, arguments), clearInterval);
};
exports.clearTimeout =
exports.clearInterval = function(timeout) {
  if (timeout) {
    timeout.close();
  }
};

function Timeout(id, clearFn) {
  this._id = id;
  this._clearFn = clearFn;
}
Timeout.prototype.unref = Timeout.prototype.ref = function() {};
Timeout.prototype.close = function() {
  this._clearFn.call(scope, this._id);
};

// Does not start the time, just sets up the members needed.
exports.enroll = function(item, msecs) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = msecs;
};

exports.unenroll = function(item) {
  clearTimeout(item._idleTimeoutId);
  item._idleTimeout = -1;
};

exports._unrefActive = exports.active = function(item) {
  clearTimeout(item._idleTimeoutId);

  var msecs = item._idleTimeout;
  if (msecs >= 0) {
    item._idleTimeoutId = setTimeout(function onTimeout() {
      if (item._onTimeout)
        item._onTimeout();
    }, msecs);
  }
};

// setimmediate attaches itself to the global object
__webpack_require__(/*! setimmediate */ 32);
// On some exotic environments, it's not clear which object `setimmediate` was
// able to install onto.  Search each possibility in the same order as the
// `setimmediate` library.
exports.setImmediate = (typeof self !== "undefined" && self.setImmediate) ||
                       (typeof global !== "undefined" && global.setImmediate) ||
                       (this && this.setImmediate);
exports.clearImmediate = (typeof self !== "undefined" && self.clearImmediate) ||
                         (typeof global !== "undefined" && global.clearImmediate) ||
                         (this && this.clearImmediate);

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 2)))

/***/ }),
/* 32 */
/*!********************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/setimmediate/setImmediate.js ***!
  \********************************************************************************************************/
/*! dynamic exports provided */
/*! all exports used */
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(global, process) {(function (global, undefined) {
    "use strict";

    if (global.setImmediate) {
        return;
    }

    var nextHandle = 1; // Spec says greater than zero
    var tasksByHandle = {};
    var currentlyRunningATask = false;
    var doc = global.document;
    var registerImmediate;

    function setImmediate(callback) {
      // Callback can either be a function or a string
      if (typeof callback !== "function") {
        callback = new Function("" + callback);
      }
      // Copy function arguments
      var args = new Array(arguments.length - 1);
      for (var i = 0; i < args.length; i++) {
          args[i] = arguments[i + 1];
      }
      // Store and register the task
      var task = { callback: callback, args: args };
      tasksByHandle[nextHandle] = task;
      registerImmediate(nextHandle);
      return nextHandle++;
    }

    function clearImmediate(handle) {
        delete tasksByHandle[handle];
    }

    function run(task) {
        var callback = task.callback;
        var args = task.args;
        switch (args.length) {
        case 0:
            callback();
            break;
        case 1:
            callback(args[0]);
            break;
        case 2:
            callback(args[0], args[1]);
            break;
        case 3:
            callback(args[0], args[1], args[2]);
            break;
        default:
            callback.apply(undefined, args);
            break;
        }
    }

    function runIfPresent(handle) {
        // From the spec: "Wait until any invocations of this algorithm started before this one have completed."
        // So if we're currently running a task, we'll need to delay this invocation.
        if (currentlyRunningATask) {
            // Delay by doing a setTimeout. setImmediate was tried instead, but in Firefox 7 it generated a
            // "too much recursion" error.
            setTimeout(runIfPresent, 0, handle);
        } else {
            var task = tasksByHandle[handle];
            if (task) {
                currentlyRunningATask = true;
                try {
                    run(task);
                } finally {
                    clearImmediate(handle);
                    currentlyRunningATask = false;
                }
            }
        }
    }

    function installNextTickImplementation() {
        registerImmediate = function(handle) {
            process.nextTick(function () { runIfPresent(handle); });
        };
    }

    function canUsePostMessage() {
        // The test against `importScripts` prevents this implementation from being installed inside a web worker,
        // where `global.postMessage` means something completely different and can't be used for this purpose.
        if (global.postMessage && !global.importScripts) {
            var postMessageIsAsynchronous = true;
            var oldOnMessage = global.onmessage;
            global.onmessage = function() {
                postMessageIsAsynchronous = false;
            };
            global.postMessage("", "*");
            global.onmessage = oldOnMessage;
            return postMessageIsAsynchronous;
        }
    }

    function installPostMessageImplementation() {
        // Installs an event handler on `global` for the `message` event: see
        // * https://developer.mozilla.org/en/DOM/window.postMessage
        // * http://www.whatwg.org/specs/web-apps/current-work/multipage/comms.html#crossDocumentMessages

        var messagePrefix = "setImmediate$" + Math.random() + "$";
        var onGlobalMessage = function(event) {
            if (event.source === global &&
                typeof event.data === "string" &&
                event.data.indexOf(messagePrefix) === 0) {
                runIfPresent(+event.data.slice(messagePrefix.length));
            }
        };

        if (global.addEventListener) {
            global.addEventListener("message", onGlobalMessage, false);
        } else {
            global.attachEvent("onmessage", onGlobalMessage);
        }

        registerImmediate = function(handle) {
            global.postMessage(messagePrefix + handle, "*");
        };
    }

    function installMessageChannelImplementation() {
        var channel = new MessageChannel();
        channel.port1.onmessage = function(event) {
            var handle = event.data;
            runIfPresent(handle);
        };

        registerImmediate = function(handle) {
            channel.port2.postMessage(handle);
        };
    }

    function installReadyStateChangeImplementation() {
        var html = doc.documentElement;
        registerImmediate = function(handle) {
            // Create a <script> element; its readystatechange event will be fired asynchronously once it is inserted
            // into the document. Do so, thus queuing up the task. Remember to clean up once it's been called.
            var script = doc.createElement("script");
            script.onreadystatechange = function () {
                runIfPresent(handle);
                script.onreadystatechange = null;
                html.removeChild(script);
                script = null;
            };
            html.appendChild(script);
        };
    }

    function installSetTimeoutImplementation() {
        registerImmediate = function(handle) {
            setTimeout(runIfPresent, 0, handle);
        };
    }

    // If supported, we should attach to the prototype of global, since that is where setTimeout et al. live.
    var attachTo = Object.getPrototypeOf && Object.getPrototypeOf(global);
    attachTo = attachTo && attachTo.setTimeout ? attachTo : global;

    // Don't get fooled by e.g. browserify environments.
    if ({}.toString.call(global.process) === "[object process]") {
        // For Node.js before 0.9
        installNextTickImplementation();

    } else if (canUsePostMessage()) {
        // For non-IE10 modern browsers
        installPostMessageImplementation();

    } else if (global.MessageChannel) {
        // For web workers, where supported
        installMessageChannelImplementation();

    } else if (doc && "onreadystatechange" in doc.createElement("script")) {
        // For IE 6–8
        installReadyStateChangeImplementation();

    } else {
        // For older browsers
        installSetTimeoutImplementation();
    }

    attachTo.setImmediate = setImmediate;
    attachTo.clearImmediate = clearImmediate;
}(typeof self === "undefined" ? typeof global === "undefined" ? this : global : self));

/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(/*! ./../webpack/buildin/global.js */ 2), __webpack_require__(/*! ./../process/browser.js */ 18)))

/***/ }),
/* 33 */
/*!**************************************************************************************************************************!*\
  !*** D:/OSPanel/domains/sage/mz/wp-content/themes/sage-lete/node_modules/@fortawesome/free-brands-svg-icons/index.es.js ***!
  \**************************************************************************************************************************/
/*! exports provided: fab, prefix, fa500px, faAccessibleIcon, faAccusoft, faAcquisitionsIncorporated, faAdn, faAdobe, faAdversal, faAffiliatetheme, faAirbnb, faAlgolia, faAlipay, faAmazon, faAmazonPay, faAmilia, faAndroid, faAngellist, faAngrycreative, faAngular, faAppStore, faAppStoreIos, faApper, faApple, faApplePay, faArtstation, faAsymmetrik, faAtlassian, faAudible, faAutoprefixer, faAvianex, faAviato, faAws, faBandcamp, faBattleNet, faBehance, faBehanceSquare, faBimobject, faBitbucket, faBitcoin, faBity, faBlackTie, faBlackberry, faBlogger, faBloggerB, faBluetooth, faBluetoothB, faBootstrap, faBtc, faBuffer, faBuromobelexperte, faBuyNLarge, faBuysellads, faCanadianMapleLeaf, faCcAmazonPay, faCcAmex, faCcApplePay, faCcDinersClub, faCcDiscover, faCcJcb, faCcMastercard, faCcPaypal, faCcStripe, faCcVisa, faCentercode, faCentos, faChrome, faChromecast, faCloudscale, faCloudsmith, faCloudversify, faCodepen, faCodiepie, faConfluence, faConnectdevelop, faContao, faCottonBureau, faCpanel, faCreativeCommons, faCreativeCommonsBy, faCreativeCommonsNc, faCreativeCommonsNcEu, faCreativeCommonsNcJp, faCreativeCommonsNd, faCreativeCommonsPd, faCreativeCommonsPdAlt, faCreativeCommonsRemix, faCreativeCommonsSa, faCreativeCommonsSampling, faCreativeCommonsSamplingPlus, faCreativeCommonsShare, faCreativeCommonsZero, faCriticalRole, faCss3, faCss3Alt, faCuttlefish, faDAndD, faDAndDBeyond, faDailymotion, faDashcube, faDelicious, faDeploydog, faDeskpro, faDev, faDeviantart, faDhl, faDiaspora, faDigg, faDigitalOcean, faDiscord, faDiscourse, faDochub, faDocker, faDraft2digital, faDribbble, faDribbbleSquare, faDropbox, faDrupal, faDyalog, faEarlybirds, faEbay, faEdge, faElementor, faEllo, faEmber, faEmpire, faEnvira, faErlang, faEthereum, faEtsy, faEvernote, faExpeditedssl, faFacebook, faFacebookF, faFacebookMessenger, faFacebookSquare, faFantasyFlightGames, faFedex, faFedora, faFigma, faFirefox, faFirefoxBrowser, faFirstOrder, faFirstOrderAlt, faFirstdraft, faFlickr, faFlipboard, faFly, faFontAwesome, faFontAwesomeAlt, faFontAwesomeFlag, faFontAwesomeLogoFull, faFonticons, faFonticonsFi, faFortAwesome, faFortAwesomeAlt, faForumbee, faFoursquare, faFreeCodeCamp, faFreebsd, faFulcrum, faGalacticRepublic, faGalacticSenate, faGetPocket, faGg, faGgCircle, faGit, faGitAlt, faGitSquare, faGithub, faGithubAlt, faGithubSquare, faGitkraken, faGitlab, faGitter, faGlide, faGlideG, faGofore, faGoodreads, faGoodreadsG, faGoogle, faGoogleDrive, faGooglePlay, faGooglePlus, faGooglePlusG, faGooglePlusSquare, faGoogleWallet, faGratipay, faGrav, faGripfire, faGrunt, faGulp, faHackerNews, faHackerNewsSquare, faHackerrank, faHips, faHireAHelper, faHooli, faHornbill, faHotjar, faHouzz, faHtml5, faHubspot, faIdeal, faImdb, faInstagram, faInstagramSquare, faIntercom, faInternetExplorer, faInvision, faIoxhost, faItchIo, faItunes, faItunesNote, faJava, faJediOrder, faJenkins, faJira, faJoget, faJoomla, faJs, faJsSquare, faJsfiddle, faKaggle, faKeybase, faKeycdn, faKickstarter, faKickstarterK, faKorvue, faLaravel, faLastfm, faLastfmSquare, faLeanpub, faLess, faLine, faLinkedin, faLinkedinIn, faLinode, faLinux, faLyft, faMagento, faMailchimp, faMandalorian, faMarkdown, faMastodon, faMaxcdn, faMdb, faMedapps, faMedium, faMediumM, faMedrt, faMeetup, faMegaport, faMendeley, faMicroblog, faMicrosoft, faMix, faMixcloud, faMixer, faMizuni, faModx, faMonero, faNapster, faNeos, faNimblr, faNode, faNodeJs, faNpm, faNs8, faNutritionix, faOdnoklassniki, faOdnoklassnikiSquare, faOldRepublic, faOpencart, faOpenid, faOpera, faOptinMonster, faOrcid, faOsi, faPage4, faPagelines, faPalfed, faPatreon, faPaypal, faPennyArcade, faPeriscope, faPhabricator, faPhoenixFramework, faPhoenixSquadron, faPhp, faPiedPiper, faPiedPiperAlt, faPiedPiperHat, faPiedPiperPp, faPiedPiperSquare, faPinterest, faPinterestP, faPinterestSquare, faPlaystation, faProductHunt, faPushed, faPython, faQq, faQuinscape, faQuora, faRProject, faRaspberryPi, faRavelry, faReact, faReacteurope, faReadme, faRebel, faRedRiver, faReddit, faRedditAlien, faRedditSquare, faRedhat, faRenren, faReplyd, faResearchgate, faResolving, faRev, faRocketchat, faRockrms, faSafari, faSalesforce, faSass, faSchlix, faScribd, faSearchengin, faSellcast, faSellsy, faServicestack, faShirtsinbulk, faShopify, faShopware, faSimplybuilt, faSistrix, faSith, faSketch, faSkyatlas, faSkype, faSlack, faSlackHash, faSlideshare, faSnapchat, faSnapchatGhost, faSnapchatSquare, faSoundcloud, faSourcetree, faSpeakap, faSpeakerDeck, faSpotify, faSquarespace, faStackExchange, faStackOverflow, faStackpath, faStaylinked, faSteam, faSteamSquare, faSteamSymbol, faStickerMule, faStrava, faStripe, faStripeS, faStudiovinari, faStumbleupon, faStumbleuponCircle, faSuperpowers, faSupple, faSuse, faSwift, faSymfony, faTeamspeak, faTelegram, faTelegramPlane, faTencentWeibo, faTheRedYeti, faThemeco, faThemeisle, faThinkPeaks, faTradeFederation, faTrello, faTripadvisor, faTumblr, faTumblrSquare, faTwitch, faTwitter, faTwitterSquare, faTypo3, faUber, faUbuntu, faUikit, faUmbraco, faUniregistry, faUnity, faUntappd, faUps, faUsb, faUsps, faUssunnah, faVaadin, faViacoin, faViadeo, faViadeoSquare, faViber, faVimeo, faVimeoSquare, faVimeoV, faVine, faVk, faVnv, faVuejs, faWaze, faWeebly, faWeibo, faWeixin, faWhatsapp, faWhatsappSquare, faWhmcs, faWikipediaW, faWindows, faWix, faWizardsOfTheCoast, faWolfPackBattalion, faWordpress, faWordpressSimple, faWpbeginner, faWpexplorer, faWpforms, faWpressr, faXbox, faXing, faXingSquare, faYCombinator, faYahoo, faYammer, faYandex, faYandexInternational, faYarn, faYelp, faYoast, faYoutube, faYoutubeSquare, faZhihu */
/*! exports used: fab */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "a", function() { return _iconsCache; });
/* unused harmony export prefix */
/* unused harmony export fa500px */
/* unused harmony export faAccessibleIcon */
/* unused harmony export faAccusoft */
/* unused harmony export faAcquisitionsIncorporated */
/* unused harmony export faAdn */
/* unused harmony export faAdobe */
/* unused harmony export faAdversal */
/* unused harmony export faAffiliatetheme */
/* unused harmony export faAirbnb */
/* unused harmony export faAlgolia */
/* unused harmony export faAlipay */
/* unused harmony export faAmazon */
/* unused harmony export faAmazonPay */
/* unused harmony export faAmilia */
/* unused harmony export faAndroid */
/* unused harmony export faAngellist */
/* unused harmony export faAngrycreative */
/* unused harmony export faAngular */
/* unused harmony export faAppStore */
/* unused harmony export faAppStoreIos */
/* unused harmony export faApper */
/* unused harmony export faApple */
/* unused harmony export faApplePay */
/* unused harmony export faArtstation */
/* unused harmony export faAsymmetrik */
/* unused harmony export faAtlassian */
/* unused harmony export faAudible */
/* unused harmony export faAutoprefixer */
/* unused harmony export faAvianex */
/* unused harmony export faAviato */
/* unused harmony export faAws */
/* unused harmony export faBandcamp */
/* unused harmony export faBattleNet */
/* unused harmony export faBehance */
/* unused harmony export faBehanceSquare */
/* unused harmony export faBimobject */
/* unused harmony export faBitbucket */
/* unused harmony export faBitcoin */
/* unused harmony export faBity */
/* unused harmony export faBlackTie */
/* unused harmony export faBlackberry */
/* unused harmony export faBlogger */
/* unused harmony export faBloggerB */
/* unused harmony export faBluetooth */
/* unused harmony export faBluetoothB */
/* unused harmony export faBootstrap */
/* unused harmony export faBtc */
/* unused harmony export faBuffer */
/* unused harmony export faBuromobelexperte */
/* unused harmony export faBuyNLarge */
/* unused harmony export faBuysellads */
/* unused harmony export faCanadianMapleLeaf */
/* unused harmony export faCcAmazonPay */
/* unused harmony export faCcAmex */
/* unused harmony export faCcApplePay */
/* unused harmony export faCcDinersClub */
/* unused harmony export faCcDiscover */
/* unused harmony export faCcJcb */
/* unused harmony export faCcMastercard */
/* unused harmony export faCcPaypal */
/* unused harmony export faCcStripe */
/* unused harmony export faCcVisa */
/* unused harmony export faCentercode */
/* unused harmony export faCentos */
/* unused harmony export faChrome */
/* unused harmony export faChromecast */
/* unused harmony export faCloudscale */
/* unused harmony export faCloudsmith */
/* unused harmony export faCloudversify */
/* unused harmony export faCodepen */
/* unused harmony export faCodiepie */
/* unused harmony export faConfluence */
/* unused harmony export faConnectdevelop */
/* unused harmony export faContao */
/* unused harmony export faCottonBureau */
/* unused harmony export faCpanel */
/* unused harmony export faCreativeCommons */
/* unused harmony export faCreativeCommonsBy */
/* unused harmony export faCreativeCommonsNc */
/* unused harmony export faCreativeCommonsNcEu */
/* unused harmony export faCreativeCommonsNcJp */
/* unused harmony export faCreativeCommonsNd */
/* unused harmony export faCreativeCommonsPd */
/* unused harmony export faCreativeCommonsPdAlt */
/* unused harmony export faCreativeCommonsRemix */
/* unused harmony export faCreativeCommonsSa */
/* unused harmony export faCreativeCommonsSampling */
/* unused harmony export faCreativeCommonsSamplingPlus */
/* unused harmony export faCreativeCommonsShare */
/* unused harmony export faCreativeCommonsZero */
/* unused harmony export faCriticalRole */
/* unused harmony export faCss3 */
/* unused harmony export faCss3Alt */
/* unused harmony export faCuttlefish */
/* unused harmony export faDAndD */
/* unused harmony export faDAndDBeyond */
/* unused harmony export faDailymotion */
/* unused harmony export faDashcube */
/* unused harmony export faDelicious */
/* unused harmony export faDeploydog */
/* unused harmony export faDeskpro */
/* unused harmony export faDev */
/* unused harmony export faDeviantart */
/* unused harmony export faDhl */
/* unused harmony export faDiaspora */
/* unused harmony export faDigg */
/* unused harmony export faDigitalOcean */
/* unused harmony export faDiscord */
/* unused harmony export faDiscourse */
/* unused harmony export faDochub */
/* unused harmony export faDocker */
/* unused harmony export faDraft2digital */
/* unused harmony export faDribbble */
/* unused harmony export faDribbbleSquare */
/* unused harmony export faDropbox */
/* unused harmony export faDrupal */
/* unused harmony export faDyalog */
/* unused harmony export faEarlybirds */
/* unused harmony export faEbay */
/* unused harmony export faEdge */
/* unused harmony export faElementor */
/* unused harmony export faEllo */
/* unused harmony export faEmber */
/* unused harmony export faEmpire */
/* unused harmony export faEnvira */
/* unused harmony export faErlang */
/* unused harmony export faEthereum */
/* unused harmony export faEtsy */
/* unused harmony export faEvernote */
/* unused harmony export faExpeditedssl */
/* unused harmony export faFacebook */
/* unused harmony export faFacebookF */
/* unused harmony export faFacebookMessenger */
/* unused harmony export faFacebookSquare */
/* unused harmony export faFantasyFlightGames */
/* unused harmony export faFedex */
/* unused harmony export faFedora */
/* unused harmony export faFigma */
/* unused harmony export faFirefox */
/* unused harmony export faFirefoxBrowser */
/* unused harmony export faFirstOrder */
/* unused harmony export faFirstOrderAlt */
/* unused harmony export faFirstdraft */
/* unused harmony export faFlickr */
/* unused harmony export faFlipboard */
/* unused harmony export faFly */
/* unused harmony export faFontAwesome */
/* unused harmony export faFontAwesomeAlt */
/* unused harmony export faFontAwesomeFlag */
/* unused harmony export faFontAwesomeLogoFull */
/* unused harmony export faFonticons */
/* unused harmony export faFonticonsFi */
/* unused harmony export faFortAwesome */
/* unused harmony export faFortAwesomeAlt */
/* unused harmony export faForumbee */
/* unused harmony export faFoursquare */
/* unused harmony export faFreeCodeCamp */
/* unused harmony export faFreebsd */
/* unused harmony export faFulcrum */
/* unused harmony export faGalacticRepublic */
/* unused harmony export faGalacticSenate */
/* unused harmony export faGetPocket */
/* unused harmony export faGg */
/* unused harmony export faGgCircle */
/* unused harmony export faGit */
/* unused harmony export faGitAlt */
/* unused harmony export faGitSquare */
/* unused harmony export faGithub */
/* unused harmony export faGithubAlt */
/* unused harmony export faGithubSquare */
/* unused harmony export faGitkraken */
/* unused harmony export faGitlab */
/* unused harmony export faGitter */
/* unused harmony export faGlide */
/* unused harmony export faGlideG */
/* unused harmony export faGofore */
/* unused harmony export faGoodreads */
/* unused harmony export faGoodreadsG */
/* unused harmony export faGoogle */
/* unused harmony export faGoogleDrive */
/* unused harmony export faGooglePlay */
/* unused harmony export faGooglePlus */
/* unused harmony export faGooglePlusG */
/* unused harmony export faGooglePlusSquare */
/* unused harmony export faGoogleWallet */
/* unused harmony export faGratipay */
/* unused harmony export faGrav */
/* unused harmony export faGripfire */
/* unused harmony export faGrunt */
/* unused harmony export faGulp */
/* unused harmony export faHackerNews */
/* unused harmony export faHackerNewsSquare */
/* unused harmony export faHackerrank */
/* unused harmony export faHips */
/* unused harmony export faHireAHelper */
/* unused harmony export faHooli */
/* unused harmony export faHornbill */
/* unused harmony export faHotjar */
/* unused harmony export faHouzz */
/* unused harmony export faHtml5 */
/* unused harmony export faHubspot */
/* unused harmony export faIdeal */
/* unused harmony export faImdb */
/* unused harmony export faInstagram */
/* unused harmony export faInstagramSquare */
/* unused harmony export faIntercom */
/* unused harmony export faInternetExplorer */
/* unused harmony export faInvision */
/* unused harmony export faIoxhost */
/* unused harmony export faItchIo */
/* unused harmony export faItunes */
/* unused harmony export faItunesNote */
/* unused harmony export faJava */
/* unused harmony export faJediOrder */
/* unused harmony export faJenkins */
/* unused harmony export faJira */
/* unused harmony export faJoget */
/* unused harmony export faJoomla */
/* unused harmony export faJs */
/* unused harmony export faJsSquare */
/* unused harmony export faJsfiddle */
/* unused harmony export faKaggle */
/* unused harmony export faKeybase */
/* unused harmony export faKeycdn */
/* unused harmony export faKickstarter */
/* unused harmony export faKickstarterK */
/* unused harmony export faKorvue */
/* unused harmony export faLaravel */
/* unused harmony export faLastfm */
/* unused harmony export faLastfmSquare */
/* unused harmony export faLeanpub */
/* unused harmony export faLess */
/* unused harmony export faLine */
/* unused harmony export faLinkedin */
/* unused harmony export faLinkedinIn */
/* unused harmony export faLinode */
/* unused harmony export faLinux */
/* unused harmony export faLyft */
/* unused harmony export faMagento */
/* unused harmony export faMailchimp */
/* unused harmony export faMandalorian */
/* unused harmony export faMarkdown */
/* unused harmony export faMastodon */
/* unused harmony export faMaxcdn */
/* unused harmony export faMdb */
/* unused harmony export faMedapps */
/* unused harmony export faMedium */
/* unused harmony export faMediumM */
/* unused harmony export faMedrt */
/* unused harmony export faMeetup */
/* unused harmony export faMegaport */
/* unused harmony export faMendeley */
/* unused harmony export faMicroblog */
/* unused harmony export faMicrosoft */
/* unused harmony export faMix */
/* unused harmony export faMixcloud */
/* unused harmony export faMixer */
/* unused harmony export faMizuni */
/* unused harmony export faModx */
/* unused harmony export faMonero */
/* unused harmony export faNapster */
/* unused harmony export faNeos */
/* unused harmony export faNimblr */
/* unused harmony export faNode */
/* unused harmony export faNodeJs */
/* unused harmony export faNpm */
/* unused harmony export faNs8 */
/* unused harmony export faNutritionix */
/* unused harmony export faOdnoklassniki */
/* unused harmony export faOdnoklassnikiSquare */
/* unused harmony export faOldRepublic */
/* unused harmony export faOpencart */
/* unused harmony export faOpenid */
/* unused harmony export faOpera */
/* unused harmony export faOptinMonster */
/* unused harmony export faOrcid */
/* unused harmony export faOsi */
/* unused harmony export faPage4 */
/* unused harmony export faPagelines */
/* unused harmony export faPalfed */
/* unused harmony export faPatreon */
/* unused harmony export faPaypal */
/* unused harmony export faPennyArcade */
/* unused harmony export faPeriscope */
/* unused harmony export faPhabricator */
/* unused harmony export faPhoenixFramework */
/* unused harmony export faPhoenixSquadron */
/* unused harmony export faPhp */
/* unused harmony export faPiedPiper */
/* unused harmony export faPiedPiperAlt */
/* unused harmony export faPiedPiperHat */
/* unused harmony export faPiedPiperPp */
/* unused harmony export faPiedPiperSquare */
/* unused harmony export faPinterest */
/* unused harmony export faPinterestP */
/* unused harmony export faPinterestSquare */
/* unused harmony export faPlaystation */
/* unused harmony export faProductHunt */
/* unused harmony export faPushed */
/* unused harmony export faPython */
/* unused harmony export faQq */
/* unused harmony export faQuinscape */
/* unused harmony export faQuora */
/* unused harmony export faRProject */
/* unused harmony export faRaspberryPi */
/* unused harmony export faRavelry */
/* unused harmony export faReact */
/* unused harmony export faReacteurope */
/* unused harmony export faReadme */
/* unused harmony export faRebel */
/* unused harmony export faRedRiver */
/* unused harmony export faReddit */
/* unused harmony export faRedditAlien */
/* unused harmony export faRedditSquare */
/* unused harmony export faRedhat */
/* unused harmony export faRenren */
/* unused harmony export faReplyd */
/* unused harmony export faResearchgate */
/* unused harmony export faResolving */
/* unused harmony export faRev */
/* unused harmony export faRocketchat */
/* unused harmony export faRockrms */
/* unused harmony export faSafari */
/* unused harmony export faSalesforce */
/* unused harmony export faSass */
/* unused harmony export faSchlix */
/* unused harmony export faScribd */
/* unused harmony export faSearchengin */
/* unused harmony export faSellcast */
/* unused harmony export faSellsy */
/* unused harmony export faServicestack */
/* unused harmony export faShirtsinbulk */
/* unused harmony export faShopify */
/* unused harmony export faShopware */
/* unused harmony export faSimplybuilt */
/* unused harmony export faSistrix */
/* unused harmony export faSith */
/* unused harmony export faSketch */
/* unused harmony export faSkyatlas */
/* unused harmony export faSkype */
/* unused harmony export faSlack */
/* unused harmony export faSlackHash */
/* unused harmony export faSlideshare */
/* unused harmony export faSnapchat */
/* unused harmony export faSnapchatGhost */
/* unused harmony export faSnapchatSquare */
/* unused harmony export faSoundcloud */
/* unused harmony export faSourcetree */
/* unused harmony export faSpeakap */
/* unused harmony export faSpeakerDeck */
/* unused harmony export faSpotify */
/* unused harmony export faSquarespace */
/* unused harmony export faStackExchange */
/* unused harmony export faStackOverflow */
/* unused harmony export faStackpath */
/* unused harmony export faStaylinked */
/* unused harmony export faSteam */
/* unused harmony export faSteamSquare */
/* unused harmony export faSteamSymbol */
/* unused harmony export faStickerMule */
/* unused harmony export faStrava */
/* unused harmony export faStripe */
/* unused harmony export faStripeS */
/* unused harmony export faStudiovinari */
/* unused harmony export faStumbleupon */
/* unused harmony export faStumbleuponCircle */
/* unused harmony export faSuperpowers */
/* unused harmony export faSupple */
/* unused harmony export faSuse */
/* unused harmony export faSwift */
/* unused harmony export faSymfony */
/* unused harmony export faTeamspeak */
/* unused harmony export faTelegram */
/* unused harmony export faTelegramPlane */
/* unused harmony export faTencentWeibo */
/* unused harmony export faTheRedYeti */
/* unused harmony export faThemeco */
/* unused harmony export faThemeisle */
/* unused harmony export faThinkPeaks */
/* unused harmony export faTradeFederation */
/* unused harmony export faTrello */
/* unused harmony export faTripadvisor */
/* unused harmony export faTumblr */
/* unused harmony export faTumblrSquare */
/* unused harmony export faTwitch */
/* unused harmony export faTwitter */
/* unused harmony export faTwitterSquare */
/* unused harmony export faTypo3 */
/* unused harmony export faUber */
/* unused harmony export faUbuntu */
/* unused harmony export faUikit */
/* unused harmony export faUmbraco */
/* unused harmony export faUniregistry */
/* unused harmony export faUnity */
/* unused harmony export faUntappd */
/* unused harmony export faUps */
/* unused harmony export faUsb */
/* unused harmony export faUsps */
/* unused harmony export faUssunnah */
/* unused harmony export faVaadin */
/* unused harmony export faViacoin */
/* unused harmony export faViadeo */
/* unused harmony export faViadeoSquare */
/* unused harmony export faViber */
/* unused harmony export faVimeo */
/* unused harmony export faVimeoSquare */
/* unused harmony export faVimeoV */
/* unused harmony export faVine */
/* unused harmony export faVk */
/* unused harmony export faVnv */
/* unused harmony export faVuejs */
/* unused harmony export faWaze */
/* unused harmony export faWeebly */
/* unused harmony export faWeibo */
/* unused harmony export faWeixin */
/* unused harmony export faWhatsapp */
/* unused harmony export faWhatsappSquare */
/* unused harmony export faWhmcs */
/* unused harmony export faWikipediaW */
/* unused harmony export faWindows */
/* unused harmony export faWix */
/* unused harmony export faWizardsOfTheCoast */
/* unused harmony export faWolfPackBattalion */
/* unused harmony export faWordpress */
/* unused harmony export faWordpressSimple */
/* unused harmony export faWpbeginner */
/* unused harmony export faWpexplorer */
/* unused harmony export faWpforms */
/* unused harmony export faWpressr */
/* unused harmony export faXbox */
/* unused harmony export faXing */
/* unused harmony export faXingSquare */
/* unused harmony export faYCombinator */
/* unused harmony export faYahoo */
/* unused harmony export faYammer */
/* unused harmony export faYandex */
/* unused harmony export faYandexInternational */
/* unused harmony export faYarn */
/* unused harmony export faYelp */
/* unused harmony export faYoast */
/* unused harmony export faYoutube */
/* unused harmony export faYoutubeSquare */
/* unused harmony export faZhihu */
var prefix = "fab";
var fa500px = {
  prefix: 'fab',
  iconName: '500px',
  icon: [448, 512, [], "f26e", "M103.3 344.3c-6.5-14.2-6.9-18.3 7.4-23.1 25.6-8 8 9.2 43.2 49.2h.3v-93.9c1.2-50.2 44-92.2 97.7-92.2 53.9 0 97.7 43.5 97.7 96.8 0 63.4-60.8 113.2-128.5 93.3-10.5-4.2-2.1-31.7 8.5-28.6 53 0 89.4-10.1 89.4-64.4 0-61-77.1-89.6-116.9-44.6-23.5 26.4-17.6 42.1-17.6 157.6 50.7 31 118.3 22 160.4-20.1 24.8-24.8 38.5-58 38.5-93 0-35.2-13.8-68.2-38.8-93.3-24.8-24.8-57.8-38.5-93.3-38.5s-68.8 13.8-93.5 38.5c-.3.3-16 16.5-21.2 23.9l-.5.6c-3.3 4.7-6.3 9.1-20.1 6.1-6.9-1.7-14.3-5.8-14.3-11.8V20c0-5 3.9-10.5 10.5-10.5h241.3c8.3 0 8.3 11.6 8.3 15.1 0 3.9 0 15.1-8.3 15.1H130.3v132.9h.3c104.2-109.8 282.8-36 282.8 108.9 0 178.1-244.8 220.3-310.1 62.8zm63.3-260.8c-.5 4.2 4.6 24.5 14.6 20.6C306 56.6 384 144.5 390.6 144.5c4.8 0 22.8-15.3 14.3-22.8-93.2-89-234.5-57-238.3-38.2zM393 414.7C283 524.6 94 475.5 61 310.5c0-12.2-30.4-7.4-28.9 3.3 24 173.4 246 256.9 381.6 121.3 6.9-7.8-12.6-28.4-20.7-20.4zM213.6 306.6c0 4 4.3 7.3 5.5 8.5 3 3 6.1 4.4 8.5 4.4 3.8 0 2.6.2 22.3-19.5 19.6 19.3 19.1 19.5 22.3 19.5 5.4 0 18.5-10.4 10.7-18.2L265.6 284l18.2-18.2c6.3-6.8-10.1-21.8-16.2-15.7L249.7 268c-18.6-18.8-18.4-19.5-21.5-19.5-5 0-18 11.7-12.4 17.3L234 284c-18.1 17.9-20.4 19.2-20.4 22.6z"]
};
var faAccessibleIcon = {
  prefix: 'fab',
  iconName: 'accessible-icon',
  icon: [448, 512, [], "f368", "M423.9 255.8L411 413.1c-3.3 40.7-63.9 35.1-60.6-4.9l10-122.5-41.1 2.3c10.1 20.7 15.8 43.9 15.8 68.5 0 41.2-16.1 78.7-42.3 106.5l-39.3-39.3c57.9-63.7 13.1-167.2-74-167.2-25.9 0-49.5 9.9-67.2 26L73 243.2c22-20.7 50.1-35.1 81.4-40.2l75.3-85.7-42.6-24.8-51.6 46c-30 26.8-70.6-18.5-40.5-45.4l68-60.7c9.8-8.8 24.1-10.2 35.5-3.6 0 0 139.3 80.9 139.5 81.1 16.2 10.1 20.7 36 6.1 52.6L285.7 229l106.1-5.9c18.5-1.1 33.6 14.4 32.1 32.7zm-64.9-154c28.1 0 50.9-22.8 50.9-50.9C409.9 22.8 387.1 0 359 0c-28.1 0-50.9 22.8-50.9 50.9 0 28.1 22.8 50.9 50.9 50.9zM179.6 456.5c-80.6 0-127.4-90.6-82.7-156.1l-39.7-39.7C36.4 287 24 320.3 24 356.4c0 130.7 150.7 201.4 251.4 122.5l-39.7-39.7c-16 10.9-35.3 17.3-56.1 17.3z"]
};
var faAccusoft = {
  prefix: 'fab',
  iconName: 'accusoft',
  icon: [640, 512, [], "f369", "M322.1 252v-1l-51.2-65.8s-12 1.6-25 15.1c-9 9.3-242.1 239.1-243.4 240.9-7 10 1.6 6.8 15.7 1.7.8 0 114.5-36.6 114.5-36.6.5-.6-.1-.1.6-.6-.4-5.1-.8-26.2-1-27.7-.6-5.2 2.2-6.9 7-8.9l92.6-33.8c.6-.8 88.5-81.7 90.2-83.3zm160.1 120.1c13.3 16.1 20.7 13.3 30.8 9.3 3.2-1.2 115.4-47.6 117.8-48.9 8-4.3-1.7-16.7-7.2-23.4-2.1-2.5-205.1-245.6-207.2-248.3-9.7-12.2-14.3-12.9-38.4-12.8-10.2 0-106.8.5-116.5.6-19.2.1-32.9-.3-19.2 16.9C250 75 476.5 365.2 482.2 372.1zm152.7 1.6c-2.3-.3-24.6-4.7-38-7.2 0 0-115 50.4-117.5 51.6-16 7.3-26.9-3.2-36.7-14.6l-57.1-74c-5.4-.9-60.4-9.6-65.3-9.3-3.1.2-9.6.8-14.4 2.9-4.9 2.1-145.2 52.8-150.2 54.7-5.1 2-11.4 3.6-11.1 7.6.2 2.5 2 2.6 4.6 3.5 2.7.8 300.9 67.6 308 69.1 15.6 3.3 38.5 10.5 53.6 1.7 2.1-1.2 123.8-76.4 125.8-77.8 5.4-4 4.3-6.8-1.7-8.2z"]
};
var faAcquisitionsIncorporated = {
  prefix: 'fab',
  iconName: 'acquisitions-incorporated',
  icon: [384, 512, [], "f6af", "M357.45 468.2c-1.2-7.7-1.3-7.6-9.6-7.6-99.8.2-111.8-2.4-112.7-2.6-12.3-1.7-20.6-10.5-21-23.1-.1-1.6-.2-71.6-1-129.1-.1-4.7 1.6-6.4 5.9-7.5 12.5-3 24.9-6.1 37.3-9.7 4.3-1.3 6.8-.2 8.4 3.5 4.5 10.3 8.8 20.6 13.2 30.9 1.6 3.7.1 4.4-3.4 4.4-10-.2-20-.1-30.4-.1v27h116c-1.4-9.5-2.7-18.1-4-27.5-7 0-13.8.4-20.4-.1-22.6-1.6-18.3-4.4-84-158.6-8.8-20.1-27.9-62.1-36.5-89.2-4.4-14 5.5-25.4 18.9-26.6 18.6-1.7 37.5-1.6 56.2-2 20.6-.4 41.2-.4 61.8-.5 3.1 0 4-1.4 4.3-4.3 1.2-9.8 2.7-19.5 4-29.2.8-5.3 1.6-10.7 2.4-16.1L23.75 0c-3.6 0-5.3 1.1-4.6 5.3 2.2 13.2-.8.8 6.4 45.3 63.4 0 71.8.9 101.8.5 12.3-.2 37 3.5 37.7 22.1.4 11.4-1.1 11.3-32.6 87.4-53.8 129.8-50.7 120.3-67.3 161-1.7 4.1-3.6 5.2-7.6 5.2-8.5-.2-17-.3-25.4.1-1.9.1-5.2 1.8-5.5 3.2-1.5 8.1-2.2 16.3-3.2 24.9h114.3v-27.6c-6.9 0-33.5.4-35.3-2.9 5.3-12.3 10.4-24.4 15.7-36.7 16.3 4 31.9 7.8 47.6 11.7 3.4.9 4.6 3 4.6 6.8-.1 42.9.1 85.9.2 128.8 0 10.2-5.5 19.1-14.9 23.1-6.5 2.7-3.3 3.4-121.4 2.4-5.3 0-7.1 2-7.6 6.8-1.5 12.9-2.9 25.9-5 38.8-.8 5 1.3 5.7 5.3 5.7 183.2.6-30.7 0 337.1 0-2.5-15-4.4-29.4-6.6-43.7zm-174.9-205.7c-13.3-4.2-26.6-8.2-39.9-12.5a44.53 44.53 0 0 1-5.8-2.9c17.2-44.3 34.2-88.1 51.3-132.1 7.5 2.4 7.9-.8 9.4 0 9.3 22.5 18.1 60.1 27 82.8 6.6 16.7 13 33.5 19.7 50.9a35.78 35.78 0 0 1-3.9 2.1c-13.1 3.9-26.4 7.5-39.4 11.7a27.66 27.66 0 0 1-18.4 0z"]
};
var faAdn = {
  prefix: 'fab',
  iconName: 'adn',
  icon: [496, 512, [], "f170", "M248 167.5l64.9 98.8H183.1l64.9-98.8zM496 256c0 136.9-111.1 248-248 248S0 392.9 0 256 111.1 8 248 8s248 111.1 248 248zm-99.8 82.7L248 115.5 99.8 338.7h30.4l33.6-51.7h168.6l33.6 51.7h30.2z"]
};
var faAdobe = {
  prefix: 'fab',
  iconName: 'adobe',
  icon: [512, 512, [], "f778", "M315.5 64h170.9v384L315.5 64zm-119 0H25.6v384L196.5 64zM256 206.1L363.5 448h-73l-30.7-76.8h-78.7L256 206.1z"]
};
var faAdversal = {
  prefix: 'fab',
  iconName: 'adversal',
  icon: [512, 512, [], "f36a", "M482.1 32H28.7C5.8 32 0 37.9 0 60.9v390.2C0 474.4 5.8 480 28.7 480h453.4c24.4 0 29.9-5.2 29.9-29.7V62.2c0-24.6-5.4-30.2-29.9-30.2zM178.4 220.3c-27.5-20.2-72.1-8.7-84.2 23.4-4.3 11.1-9.3 9.5-17.5 8.3-9.7-1.5-17.2-3.2-22.5-5.5-28.8-11.4 8.6-55.3 24.9-64.3 41.1-21.4 83.4-22.2 125.3-4.8 40.9 16.8 34.5 59.2 34.5 128.5 2.7 25.8-4.3 58.3 9.3 88.8 1.9 4.4.4 7.9-2.7 10.7-8.4 6.7-39.3 2.2-46.6-7.4-1.9-2.2-1.8-3.6-3.9-6.2-3.6-3.9-7.3-2.2-11.9 1-57.4 36.4-140.3 21.4-147-43.3-3.1-29.3 12.4-57.1 39.6-71 38.2-19.5 112.2-11.8 114-30.9 1.1-10.2-1.9-20.1-11.3-27.3zm286.7 222c0 15.1-11.1 9.9-17.8 9.9H52.4c-7.4 0-18.2 4.8-17.8-10.7.4-13.9 10.5-9.1 17.1-9.1 132.3-.4 264.5-.4 396.8 0 6.8 0 16.6-4.4 16.6 9.9zm3.8-340.5v291c0 5.7-.7 13.9-8.1 13.9-12.4-.4-27.5 7.1-36.1-5.6-5.8-8.7-7.8-4-12.4-1.2-53.4 29.7-128.1 7.1-144.4-85.2-6.1-33.4-.7-67.1 15.7-100 11.8-23.9 56.9-76.1 136.1-30.5v-71c0-26.2-.1-26.2 26-26.2 3.1 0 6.6.4 9.7 0 10.1-.8 13.6 4.4 13.6 14.3-.1.2-.1.3-.1.5zm-51.5 232.3c-19.5 47.6-72.9 43.3-90 5.2-15.1-33.3-15.5-68.2.4-101.5 16.3-34.1 59.7-35.7 81.5-4.8 20.6 28.8 14.9 84.6 8.1 101.1zm-294.8 35.3c-7.5-1.3-33-3.3-33.7-27.8-.4-13.9 7.8-23 19.8-25.8 24.4-5.9 49.3-9.9 73.7-14.7 8.9-2 7.4 4.4 7.8 9.5 1.4 33-26.1 59.2-67.6 58.8z"]
};
var faAffiliatetheme = {
  prefix: 'fab',
  iconName: 'affiliatetheme',
  icon: [512, 512, [], "f36b", "M159.7 237.4C108.4 308.3 43.1 348.2 14 326.6-15.2 304.9 2.8 230 54.2 159.1c51.3-70.9 116.6-110.8 145.7-89.2 29.1 21.6 11.1 96.6-40.2 167.5zm351.2-57.3C437.1 303.5 319 367.8 246.4 323.7c-25-15.2-41.3-41.2-49-73.8-33.6 64.8-92.8 113.8-164.1 133.2 49.8 59.3 124.1 96.9 207 96.9 150 0 271.6-123.1 271.6-274.9.1-8.5-.3-16.8-1-25z"]
};
var faAirbnb = {
  prefix: 'fab',
  iconName: 'airbnb',
  icon: [448, 512, [], "f834", "M224 373.12c-25.24-31.67-40.08-59.43-45-83.18-22.55-88 112.61-88 90.06 0-5.45 24.25-20.29 52-45 83.18zm138.15 73.23c-42.06 18.31-83.67-10.88-119.3-50.47 103.9-130.07 46.11-200-18.85-200-54.92 0-85.16 46.51-73.28 100.5 6.93 29.19 25.23 62.39 54.43 99.5-32.53 36.05-60.55 52.69-85.15 54.92-50 7.43-89.11-41.06-71.3-91.09 15.1-39.16 111.72-231.18 115.87-241.56 15.75-30.07 25.56-57.4 59.38-57.4 32.34 0 43.4 25.94 60.37 59.87 36 70.62 89.35 177.48 114.84 239.09 13.17 33.07-1.37 71.29-37.01 86.64zm47-136.12C280.27 35.93 273.13 32 224 32c-45.52 0-64.87 31.67-84.66 72.79C33.18 317.1 22.89 347.19 22 349.81-3.22 419.14 48.74 480 111.63 480c21.71 0 60.61-6.06 112.37-62.4 58.68 63.78 101.26 62.4 112.37 62.4 62.89.05 114.85-60.86 89.61-130.19.02-3.89-16.82-38.9-16.82-39.58z"]
};
var faAlgolia = {
  prefix: 'fab',
  iconName: 'algolia',
  icon: [448, 512, [], "f36c", "M229.3 182.6c-49.3 0-89.2 39.9-89.2 89.2 0 49.3 39.9 89.2 89.2 89.2s89.2-39.9 89.2-89.2c0-49.3-40-89.2-89.2-89.2zm62.7 56.6l-58.9 30.6c-1.8.9-3.8-.4-3.8-2.3V201c0-1.5 1.3-2.7 2.7-2.6 26.2 1 48.9 15.7 61.1 37.1.7 1.3.2 3-1.1 3.7zM389.1 32H58.9C26.4 32 0 58.4 0 90.9V421c0 32.6 26.4 59 58.9 59H389c32.6 0 58.9-26.4 58.9-58.9V90.9C448 58.4 421.6 32 389.1 32zm-202.6 84.7c0-10.8 8.7-19.5 19.5-19.5h45.3c10.8 0 19.5 8.7 19.5 19.5v15.4c0 1.8-1.7 3-3.3 2.5-12.3-3.4-25.1-5.1-38.1-5.1-13.5 0-26.7 1.8-39.4 5.5-1.7.5-3.4-.8-3.4-2.5v-15.8zm-84.4 37l9.2-9.2c7.6-7.6 19.9-7.6 27.5 0l7.7 7.7c1.1 1.1 1 3-.3 4-6.2 4.5-12.1 9.4-17.6 14.9-5.4 5.4-10.4 11.3-14.8 17.4-1 1.3-2.9 1.5-4 .3l-7.7-7.7c-7.6-7.5-7.6-19.8 0-27.4zm127.2 244.8c-70 0-126.6-56.7-126.6-126.6s56.7-126.6 126.6-126.6c70 0 126.6 56.6 126.6 126.6 0 69.8-56.7 126.6-126.6 126.6z"]
};
var faAlipay = {
  prefix: 'fab',
  iconName: 'alipay',
  icon: [448, 512, [], "f642", "M377.74 32H70.26C31.41 32 0 63.41 0 102.26v307.48C0 448.59 31.41 480 70.26 480h307.48c38.52 0 69.76-31.08 70.26-69.6-45.96-25.62-110.59-60.34-171.6-88.44-32.07 43.97-84.14 81-148.62 81-70.59 0-93.73-45.3-97.04-76.37-3.97-39.01 14.88-81.5 99.52-81.5 35.38 0 79.35 10.25 127.13 24.96 16.53-30.09 26.45-60.34 26.45-60.34h-178.2v-16.7h92.08v-31.24H88.28v-19.01h109.44V92.34h50.92v50.42h109.44v19.01H248.63v31.24h88.77s-15.21 46.62-38.35 90.92c48.93 16.7 100.01 36.04 148.62 52.74V102.26C447.83 63.57 416.43 32 377.74 32zM47.28 322.95c.99 20.17 10.25 53.73 69.93 53.73 52.07 0 92.58-39.68 117.87-72.9-44.63-18.68-84.48-31.41-109.44-31.41-67.45 0-79.35 33.06-78.36 50.58z"]
};
var faAmazon = {
  prefix: 'fab',
  iconName: 'amazon',
  icon: [448, 512, [], "f270", "M257.2 162.7c-48.7 1.8-169.5 15.5-169.5 117.5 0 109.5 138.3 114 183.5 43.2 6.5 10.2 35.4 37.5 45.3 46.8l56.8-56S341 288.9 341 261.4V114.3C341 89 316.5 32 228.7 32 140.7 32 94 87 94 136.3l73.5 6.8c16.3-49.5 54.2-49.5 54.2-49.5 40.7-.1 35.5 29.8 35.5 69.1zm0 86.8c0 80-84.2 68-84.2 17.2 0-47.2 50.5-56.7 84.2-57.8v40.6zm136 163.5c-7.7 10-70 67-174.5 67S34.2 408.5 9.7 379c-6.8-7.7 1-11.3 5.5-8.3C88.5 415.2 203 488.5 387.7 401c7.5-3.7 13.3 2 5.5 12zm39.8 2.2c-6.5 15.8-16 26.8-21.2 31-5.5 4.5-9.5 2.7-6.5-3.8s19.3-46.5 12.7-55c-6.5-8.3-37-4.3-48-3.2-10.8 1-13 2-14-.3-2.3-5.7 21.7-15.5 37.5-17.5 15.7-1.8 41-.8 46 5.7 3.7 5.1 0 27.1-6.5 43.1z"]
};
var faAmazonPay = {
  prefix: 'fab',
  iconName: 'amazon-pay',
  icon: [640, 512, [], "f42c", "M14 325.3c2.3-4.2 5.2-4.9 9.7-2.5 10.4 5.6 20.6 11.4 31.2 16.7a595.88 595.88 0 0 0 127.4 46.3 616.61 616.61 0 0 0 63.2 11.8 603.33 603.33 0 0 0 95 5.2c17.4-.4 34.8-1.8 52.1-3.8a603.66 603.66 0 0 0 163.3-42.8c2.9-1.2 5.9-2 9.1-1.2 6.7 1.8 9 9 4.1 13.9a70 70 0 0 1-9.6 7.4c-30.7 21.1-64.2 36.4-99.6 47.9a473.31 473.31 0 0 1-75.1 17.6 431 431 0 0 1-53.2 4.8 21.3 21.3 0 0 0-2.5.3H308a21.3 21.3 0 0 0-2.5-.3c-3.6-.2-7.2-.3-10.7-.4a426.3 426.3 0 0 1-50.4-5.3A448.4 448.4 0 0 1 164 420a443.33 443.33 0 0 1-145.6-87c-1.8-1.6-3-3.8-4.4-5.7zM172 65.1l-4.3.6a80.92 80.92 0 0 0-38 15.1c-2.4 1.7-4.6 3.5-7.1 5.4a4.29 4.29 0 0 1-.4-1.4c-.4-2.7-.8-5.5-1.3-8.2-.7-4.6-3-6.6-7.6-6.6h-11.5c-6.9 0-8.2 1.3-8.2 8.2v209.3c0 1 0 2 .1 3 .2 3 2 4.9 4.9 5 7 .1 14.1.1 21.1 0 2.9 0 4.7-2 5-5 .1-1 .1-2 .1-3v-72.4c1.1.9 1.7 1.4 2.2 1.9 17.9 14.9 38.5 19.8 61 15.4 20.4-4 34.6-16.5 43.8-34.9 7-13.9 9.9-28.7 10.3-44.1.5-17.1-1.2-33.9-8.1-49.8-8.5-19.6-22.6-32.5-43.9-36.9-3.2-.7-6.5-1-9.8-1.5-2.8-.1-5.5-.1-8.3-.1zM124.6 107a3.48 3.48 0 0 1 1.7-3.3c13.7-9.5 28.8-14.5 45.6-13.2 14.9 1.1 27.1 8.4 33.5 25.9 3.9 10.7 4.9 21.8 4.9 33 0 10.4-.8 20.6-4 30.6-6.8 21.3-22.4 29.4-42.6 28.5-14-.6-26.2-6-37.4-13.9a3.57 3.57 0 0 1-1.7-3.3c.1-14.1 0-28.1 0-42.2s.1-28 0-42.1zm205.7-41.9c-1 .1-2 .3-2.9.4a148 148 0 0 0-28.9 4.1c-6.1 1.6-12 3.8-17.9 5.8-3.6 1.2-5.4 3.8-5.3 7.7.1 3.3-.1 6.6 0 9.9.1 4.8 2.1 6.1 6.8 4.9 7.8-2 15.6-4.2 23.5-5.7 12.3-2.3 24.7-3.3 37.2-1.4 6.5 1 12.6 2.9 16.8 8.4 3.7 4.8 5.1 10.5 5.3 16.4.3 8.3.2 16.6.3 24.9a7.84 7.84 0 0 1-.2 1.4c-.5-.1-.9 0-1.3-.1a180.56 180.56 0 0 0-32-4.9c-11.3-.6-22.5.1-33.3 3.9-12.9 4.5-23.3 12.3-29.4 24.9-4.7 9.8-5.4 20.2-3.9 30.7 2 14 9 24.8 21.4 31.7 11.9 6.6 24.8 7.4 37.9 5.4 15.1-2.3 28.5-8.7 40.3-18.4a7.36 7.36 0 0 1 1.6-1.1c.6 3.8 1.1 7.4 1.8 11 .6 3.1 2.5 5.1 5.4 5.2 5.4.1 10.9.1 16.3 0a4.84 4.84 0 0 0 4.8-4.7 26.2 26.2 0 0 0 .1-2.8v-106a80 80 0 0 0-.9-12.9c-1.9-12.9-7.4-23.5-19-30.4-6.7-4-14.1-6-21.8-7.1-3.6-.5-7.2-.8-10.8-1.3-3.9.1-7.9.1-11.9.1zm35 127.7a3.33 3.33 0 0 1-1.5 3c-11.2 8.1-23.5 13.5-37.4 14.9-5.7.6-11.4.4-16.8-1.8a20.08 20.08 0 0 1-12.4-13.3 32.9 32.9 0 0 1-.1-19.4c2.5-8.3 8.4-13 16.4-15.6a61.33 61.33 0 0 1 24.8-2.2c8.4.7 16.6 2.3 25 3.4 1.6.2 2.1 1 2.1 2.6-.1 4.8 0 9.5 0 14.3s-.2 9.4-.1 14.1zm259.9 129.4c-1-5-4.8-6.9-9.1-8.3a88.42 88.42 0 0 0-21-3.9 147.32 147.32 0 0 0-39.2 1.9c-14.3 2.7-27.9 7.3-40 15.6a13.75 13.75 0 0 0-3.7 3.5 5.11 5.11 0 0 0-.5 4c.4 1.5 2.1 1.9 3.6 1.8a16.2 16.2 0 0 0 2.2-.1c7.8-.8 15.5-1.7 23.3-2.5 11.4-1.1 22.9-1.8 34.3-.9a71.64 71.64 0 0 1 14.4 2.7c5.1 1.4 7.4 5.2 7.6 10.4.4 8-1.4 15.7-3.5 23.3-4.1 15.4-10 30.3-15.8 45.1a17.6 17.6 0 0 0-1 3c-.5 2.9 1.2 4.8 4.1 4.1a10.56 10.56 0 0 0 4.8-2.5 145.91 145.91 0 0 0 12.7-13.4c12.8-16.4 20.3-35.3 24.7-55.6.8-3.6 1.4-7.3 2.1-10.9v-17.3zM493.1 199q-19.35-53.55-38.7-107.2c-2-5.7-4.2-11.3-6.3-16.9-1.1-2.9-3.2-4.8-6.4-4.8-7.6-.1-15.2-.2-22.9-.1-2.5 0-3.7 2-3.2 4.5a43.1 43.1 0 0 0 1.9 6.1q29.4 72.75 59.1 145.5c1.7 4.1 2.1 7.6.2 11.8-3.3 7.3-5.9 15-9.3 22.3-3 6.5-8 11.4-15.2 13.3a42.13 42.13 0 0 1-15.4 1.1c-2.5-.2-5-.8-7.5-1-3.4-.2-5.1 1.3-5.2 4.8q-.15 5 0 9.9c.1 5.5 2 8 7.4 8.9a108.18 108.18 0 0 0 16.9 2c17.1.4 30.7-6.5 39.5-21.4a131.63 131.63 0 0 0 9.2-18.4q35.55-89.7 70.6-179.6a26.62 26.62 0 0 0 1.6-5.5c.4-2.8-.9-4.4-3.7-4.4-6.6-.1-13.3 0-19.9 0a7.54 7.54 0 0 0-7.7 5.2c-.5 1.4-1.1 2.7-1.6 4.1l-34.8 100c-2.5 7.2-5.1 14.5-7.7 22.2-.4-1.1-.6-1.7-.9-2.4z"]
};
var faAmilia = {
  prefix: 'fab',
  iconName: 'amilia',
  icon: [448, 512, [], "f36d", "M240.1 32c-61.9 0-131.5 16.9-184.2 55.4-5.1 3.1-9.1 9.2-7.2 19.4 1.1 5.1 5.1 27.4 10.2 39.6 4.1 10.2 14.2 10.2 20.3 6.1 32.5-22.3 96.5-47.7 152.3-47.7 57.9 0 58.9 28.4 58.9 73.1v38.5C203 227.7 78.2 251 46.7 264.2 11.2 280.5 16.3 357.7 16.3 376s15.2 104 124.9 104c47.8 0 113.7-20.7 153.3-42.1v25.4c0 3 2.1 8.2 6.1 9.1 3.1 1 50.7 2 59.9 2s62.5.3 66.5-.7c4.1-1 5.1-6.1 5.1-9.1V168c-.1-80.3-57.9-136-192-136zm50.2 348c-21.4 13.2-48.7 24.4-79.1 24.4-52.8 0-58.9-33.5-59-44.7 0-12.2-3-42.7 18.3-52.9 24.3-13.2 75.1-29.4 119.8-33.5z"]
};
var faAndroid = {
  prefix: 'fab',
  iconName: 'android',
  icon: [576, 512, [], "f17b", "M420.55,301.93a24,24,0,1,1,24-24,24,24,0,0,1-24,24m-265.1,0a24,24,0,1,1,24-24,24,24,0,0,1-24,24m273.7-144.48,47.94-83a10,10,0,1,0-17.27-10h0l-48.54,84.07a301.25,301.25,0,0,0-246.56,0L116.18,64.45a10,10,0,1,0-17.27,10h0l47.94,83C64.53,202.22,8.24,285.55,0,384H576c-8.24-98.45-64.54-181.78-146.85-226.55"]
};
var faAngellist = {
  prefix: 'fab',
  iconName: 'angellist',
  icon: [448, 512, [], "f209", "M347.1 215.4c11.7-32.6 45.4-126.9 45.4-157.1 0-26.6-15.7-48.9-43.7-48.9-44.6 0-84.6 131.7-97.1 163.1C242 144 196.6 0 156.6 0c-31.1 0-45.7 22.9-45.7 51.7 0 35.3 34.2 126.8 46.6 162-6.3-2.3-13.1-4.3-20-4.3-23.4 0-48.3 29.1-48.3 52.6 0 8.9 4.9 21.4 8 29.7-36.9 10-51.1 34.6-51.1 71.7C46 435.6 114.4 512 210.6 512c118 0 191.4-88.6 191.4-202.9 0-43.1-6.9-82-54.9-93.7zM311.7 108c4-12.3 21.1-64.3 37.1-64.3 8.6 0 10.9 8.9 10.9 16 0 19.1-38.6 124.6-47.1 148l-34-6 33.1-93.7zM142.3 48.3c0-11.9 14.5-45.7 46.3 47.1l34.6 100.3c-15.6-1.3-27.7-3-35.4 1.4-10.9-28.8-45.5-119.7-45.5-148.8zM140 244c29.3 0 67.1 94.6 67.1 107.4 0 5.1-4.9 11.4-10.6 11.4-20.9 0-76.9-76.9-76.9-97.7.1-7.7 12.7-21.1 20.4-21.1zm184.3 186.3c-29.1 32-66.3 48.6-109.7 48.6-59.4 0-106.3-32.6-128.9-88.3-17.1-43.4 3.8-68.3 20.6-68.3 11.4 0 54.3 60.3 54.3 73.1 0 4.9-7.7 8.3-11.7 8.3-16.1 0-22.4-15.5-51.1-51.4-29.7 29.7 20.5 86.9 58.3 86.9 26.1 0 43.1-24.2 38-42 3.7 0 8.3.3 11.7-.6 1.1 27.1 9.1 59.4 41.7 61.7 0-.9 2-7.1 2-7.4 0-17.4-10.6-32.6-10.6-50.3 0-28.3 21.7-55.7 43.7-71.7 8-6 17.7-9.7 27.1-13.1 9.7-3.7 20-8 27.4-15.4-1.1-11.2-5.7-21.1-16.9-21.1-27.7 0-120.6 4-120.6-39.7 0-6.7.1-13.1 17.4-13.1 32.3 0 114.3 8 138.3 29.1 18.1 16.1 24.3 113.2-31 174.7zm-98.6-126c9.7 3.1 19.7 4 29.7 6-7.4 5.4-14 12-20.3 19.1-2.8-8.5-6.2-16.8-9.4-25.1z"]
};
var faAngrycreative = {
  prefix: 'fab',
  iconName: 'angrycreative',
  icon: [640, 512, [], "f36e", "M640 238.2l-3.2 28.2-34.5 2.3-2 18.1 34.5-2.3-3.2 28.2-34.4 2.2-2.3 20.1 34.4-2.2-3 26.1-64.7 4.1 12.7-113.2L527 365.2l-31.9 2-23.8-117.8 30.3-2 13.6 79.4 31.7-82.4 93.1-6.2zM426.8 371.5l28.3-1.8L468 249.6l-28.4 1.9-12.8 120zM162 388.1l-19.4-36-3.5 37.4-28.2 1.7 2.7-29.1c-11 18-32 34.3-56.9 35.8C23.9 399.9-3 377 .3 339.7c2.6-29.3 26.7-62.8 67.5-65.4 37.7-2.4 47.6 23.2 51.3 28.8l2.8-30.8 38.9-2.5c20.1-1.3 38.7 3.7 42.5 23.7l2.6-26.6 64.8-4.2-2.7 27.9-36.4 2.4-1.7 17.9 36.4-2.3-2.7 27.9-36.4 2.3-1.9 19.9 36.3-2.3-2.1 20.8 55-117.2 23.8-1.6L370.4 369l8.9-85.6-22.3 1.4 2.9-27.9 75-4.9-3 28-24.3 1.6-9.7 91.9-58 3.7-4.3-15.6-39.4 2.5-8 16.3-126.2 7.7zm-44.3-70.2l-26.4 1.7C84.6 307.2 76.9 303 65 303.8c-19 1.2-33.3 17.5-34.6 33.3-1.4 16 7.3 32.5 28.7 31.2 12.8-.8 21.3-8.6 28.9-18.9l27-1.7 2.7-29.8zm56.1-7.7c1.2-12.9-7.6-13.6-26.1-12.4l-2.7 28.5c14.2-.9 27.5-2.1 28.8-16.1zm21.1 70.8l5.8-60c-5 13.5-14.7 21.1-27.9 26.6l22.1 33.4zm135.4-45l-7.9-37.8-15.8 39.3 23.7-1.5zm-170.1-74.6l-4.3-17.5-39.6 2.6-8.1 18.2-31.9 2.1 57-121.9 23.9-1.6 30.7 102 9.9-104.7 27-1.8 37.8 63.6 6.5-66.6 28.5-1.9-4 41.2c7.4-13.5 22.9-44.7 63.6-47.5 40.5-2.8 52.4 29.3 53.4 30.3l3.3-32 39.3-2.7c12.7-.9 27.8.3 36.3 9.7l-4.4-11.9 32.2-2.2 12.9 43.2 23-45.7 31-2.2-43.6 78.4-4.8 44.3-28.4 1.9 4.8-44.3-15.8-43c1 22.3-9.2 40.1-32 49.6l25.2 38.8-36.4 2.4-19.2-36.8-4 38.3-28.4 1.9 3.3-31.5c-6.7 9.3-19.7 35.4-59.6 38-26.2 1.7-45.6-10.3-55.4-39.2l-4 40.3-25 1.6-37.6-63.3-6.3 66.2-56.8 3.7zm276.6-82.1c10.2-.7 17.5-2.1 21.6-4.3 4.5-2.4 7-6.4 7.6-12.1.6-5.3-.6-8.8-3.4-10.4-3.6-2.1-10.6-2.8-22.9-2l-2.9 28.8zM327.7 214c5.6 5.9 12.7 8.5 21.3 7.9 4.7-.3 9.1-1.8 13.3-4.1 5.5-3 10.6-8 15.1-14.3l-34.2 2.3 2.4-23.9 63.1-4.3 1.2-12-31.2 2.1c-4.1-3.7-7.8-6.6-11.1-8.1-4-1.7-8.1-2.8-12.2-2.5-8 .5-15.3 3.6-22 9.2-7.7 6.4-12 14.5-12.9 24.4-1.1 9.6 1.4 17.3 7.2 23.3zm-201.3 8.2l23.8-1.6-8.3-37.6-15.5 39.2z"]
};
var faAngular = {
  prefix: 'fab',
  iconName: 'angular',
  icon: [448, 512, [], "f420", "M185.7 268.1h76.2l-38.1-91.6-38.1 91.6zM223.8 32L16 106.4l31.8 275.7 176 97.9 176-97.9 31.8-275.7zM354 373.8h-48.6l-26.2-65.4H168.6l-26.2 65.4H93.7L223.8 81.5z"]
};
var faAppStore = {
  prefix: 'fab',
  iconName: 'app-store',
  icon: [512, 512, [], "f36f", "M255.9 120.9l9.1-15.7c5.6-9.8 18.1-13.1 27.9-7.5 9.8 5.6 13.1 18.1 7.5 27.9l-87.5 151.5h63.3c20.5 0 32 24.1 23.1 40.8H113.8c-11.3 0-20.4-9.1-20.4-20.4 0-11.3 9.1-20.4 20.4-20.4h52l66.6-115.4-20.8-36.1c-5.6-9.8-2.3-22.2 7.5-27.9 9.8-5.6 22.2-2.3 27.9 7.5l8.9 15.7zm-78.7 218l-19.6 34c-5.6 9.8-18.1 13.1-27.9 7.5-9.8-5.6-13.1-18.1-7.5-27.9l14.6-25.2c16.4-5.1 29.8-1.2 40.4 11.6zm168.9-61.7h53.1c11.3 0 20.4 9.1 20.4 20.4 0 11.3-9.1 20.4-20.4 20.4h-29.5l19.9 34.5c5.6 9.8 2.3 22.2-7.5 27.9-9.8 5.6-22.2 2.3-27.9-7.5-33.5-58.1-58.7-101.6-75.4-130.6-17.1-29.5-4.9-59.1 7.2-69.1 13.4 23 33.4 57.7 60.1 104zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm216 248c0 118.7-96.1 216-216 216-118.7 0-216-96.1-216-216 0-118.7 96.1-216 216-216 118.7 0 216 96.1 216 216z"]
};
var faAppStoreIos = {
  prefix: 'fab',
  iconName: 'app-store-ios',
  icon: [448, 512, [], "f370", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM127 384.5c-5.5 9.6-17.8 12.8-27.3 7.3-9.6-5.5-12.8-17.8-7.3-27.3l14.3-24.7c16.1-4.9 29.3-1.1 39.6 11.4L127 384.5zm138.9-53.9H84c-11 0-20-9-20-20s9-20 20-20h51l65.4-113.2-20.5-35.4c-5.5-9.6-2.2-21.8 7.3-27.3 9.6-5.5 21.8-2.2 27.3 7.3l8.9 15.4 8.9-15.4c5.5-9.6 17.8-12.8 27.3-7.3 9.6 5.5 12.8 17.8 7.3 27.3l-85.8 148.6h62.1c20.2 0 31.5 23.7 22.7 40zm98.1 0h-29l19.6 33.9c5.5 9.6 2.2 21.8-7.3 27.3-9.6 5.5-21.8 2.2-27.3-7.3-32.9-56.9-57.5-99.7-74-128.1-16.7-29-4.8-58 7.1-67.8 13.1 22.7 32.7 56.7 58.9 102h52c11 0 20 9 20 20 0 11.1-9 20-20 20z"]
};
var faApper = {
  prefix: 'fab',
  iconName: 'apper',
  icon: [640, 512, [], "f371", "M42.1 239.1c22.2 0 29 2.8 33.5 14.6h.8v-22.9c0-11.3-4.8-15.4-17.9-15.4-11.3 0-14.4 2.5-15.1 12.8H4.8c.3-13.9 1.5-19.1 5.8-24.4C17.9 195 29.5 192 56.7 192c33 0 47.1 5 53.9 18.9 2 4.3 4 15.6 4 23.7v76.3H76.3l1.3-19.1h-1c-5.3 15.6-13.6 20.4-35.5 20.4-30.3 0-41.1-10.1-41.1-37.3 0-25.2 12.3-35.8 42.1-35.8zm17.1 48.1c13.1 0 16.9-3 16.9-13.4 0-9.1-4.3-11.6-19.6-11.6-13.1 0-17.9 3-17.9 12.1-.1 10.4 3.7 12.9 20.6 12.9zm77.8-94.9h38.3l-1.5 20.6h.8c9.1-17.1 15.9-20.9 37.5-20.9 14.4 0 24.7 3 31.5 9.1 9.8 8.6 12.8 20.4 12.8 48.1 0 30-3 43.1-12.1 52.9-6.8 7.3-16.4 10.1-33.2 10.1-20.4 0-29.2-5.5-33.8-21.2h-.8v70.3H137v-169zm80.9 60.7c0-27.5-3.3-32.5-20.7-32.5-16.9 0-20.7 5-20.7 28.7 0 28 3.5 33.5 21.2 33.5 16.4 0 20.2-5.6 20.2-29.7zm57.9-60.7h38.3l-1.5 20.6h.8c9.1-17.1 15.9-20.9 37.5-20.9 14.4 0 24.7 3 31.5 9.1 9.8 8.6 12.8 20.4 12.8 48.1 0 30-3 43.1-12.1 52.9-6.8 7.3-16.4 10.1-33.3 10.1-20.4 0-29.2-5.5-33.8-21.2h-.8v70.3h-39.5v-169zm80.9 60.7c0-27.5-3.3-32.5-20.7-32.5-16.9 0-20.7 5-20.7 28.7 0 28 3.5 33.5 21.2 33.5 16.4 0 20.2-5.6 20.2-29.7zm53.8-3.8c0-25.4 3.3-37.8 12.3-45.8 8.8-8.1 22.2-11.3 45.1-11.3 42.8 0 55.7 12.8 55.7 55.7v11.1h-75.3c-.3 2-.3 4-.3 4.8 0 16.9 4.5 21.9 20.1 21.9 13.9 0 17.9-3 17.9-13.9h37.5v2.3c0 9.8-2.5 18.9-6.8 24.7-7.3 9.8-19.6 13.6-44.3 13.6-27.5 0-41.6-3.3-50.6-12.3-8.5-8.5-11.3-21.3-11.3-50.8zm76.4-11.6c-.3-1.8-.3-3.3-.3-3.8 0-12.3-3.3-14.6-19.6-14.6-14.4 0-17.1 3-18.1 15.1l-.3 3.3h38.3zm55.6-45.3h38.3l-1.8 19.9h.7c6.8-14.9 14.4-20.2 29.7-20.2 10.8 0 19.1 3.3 23.4 9.3 5.3 7.3 6.8 14.4 6.8 34 0 1.5 0 5 .2 9.3h-35c.3-1.8.3-3.3.3-4 0-15.4-2-19.4-10.3-19.4-6.3 0-10.8 3.3-13.1 9.3-1 3-1 4.3-1 12.3v68h-38.3V192.3z"]
};
var faApple = {
  prefix: 'fab',
  iconName: 'apple',
  icon: [384, 512, [], "f179", "M318.7 268.7c-.2-36.7 16.4-64.4 50-84.8-18.8-26.9-47.2-41.7-84.7-44.6-35.5-2.8-74.3 20.7-88.5 20.7-15 0-49.4-19.7-76.4-19.7C63.3 141.2 4 184.8 4 273.5q0 39.3 14.4 81.2c12.8 36.7 59 126.7 107.2 125.2 25.2-.6 43-17.9 75.8-17.9 31.8 0 48.3 17.9 76.4 17.9 48.6-.7 90.4-82.5 102.6-119.3-65.2-30.7-61.7-90-61.7-91.9zm-56.6-164.2c27.3-32.4 24.8-61.9 24-72.5-24.1 1.4-52 16.4-67.9 34.9-17.5 19.8-27.8 44.3-25.6 71.9 26.1 2 49.9-11.4 69.5-34.3z"]
};
var faApplePay = {
  prefix: 'fab',
  iconName: 'apple-pay',
  icon: [640, 512, [], "f415", "M116.9 158.5c-7.5 8.9-19.5 15.9-31.5 14.9-1.5-12 4.4-24.8 11.3-32.6 7.5-9.1 20.6-15.6 31.3-16.1 1.2 12.4-3.7 24.7-11.1 33.8m10.9 17.2c-17.4-1-32.3 9.9-40.5 9.9-8.4 0-21-9.4-34.8-9.1-17.9.3-34.5 10.4-43.6 26.5-18.8 32.3-4.9 80 13.3 106.3 8.9 13 19.5 27.3 33.5 26.8 13.3-.5 18.5-8.6 34.5-8.6 16.1 0 20.8 8.6 34.8 8.4 14.5-.3 23.6-13 32.5-26 10.1-14.8 14.3-29.1 14.5-29.9-.3-.3-28-10.9-28.3-42.9-.3-26.8 21.9-39.5 22.9-40.3-12.5-18.6-32-20.6-38.8-21.1m100.4-36.2v194.9h30.3v-66.6h41.9c38.3 0 65.1-26.3 65.1-64.3s-26.4-64-64.1-64h-73.2zm30.3 25.5h34.9c26.3 0 41.3 14 41.3 38.6s-15 38.8-41.4 38.8h-34.8V165zm162.2 170.9c19 0 36.6-9.6 44.6-24.9h.6v23.4h28v-97c0-28.1-22.5-46.3-57.1-46.3-32.1 0-55.9 18.4-56.8 43.6h27.3c2.3-12 13.4-19.9 28.6-19.9 18.5 0 28.9 8.6 28.9 24.5v10.8l-37.8 2.3c-35.1 2.1-54.1 16.5-54.1 41.5.1 25.2 19.7 42 47.8 42zm8.2-23.1c-16.1 0-26.4-7.8-26.4-19.6 0-12.3 9.9-19.4 28.8-20.5l33.6-2.1v11c0 18.2-15.5 31.2-36 31.2zm102.5 74.6c29.5 0 43.4-11.3 55.5-45.4L640 193h-30.8l-35.6 115.1h-.6L537.4 193h-31.6L557 334.9l-2.8 8.6c-4.6 14.6-12.1 20.3-25.5 20.3-2.4 0-7-.3-8.9-.5v23.4c1.8.4 9.3.7 11.6.7z"]
};
var faArtstation = {
  prefix: 'fab',
  iconName: 'artstation',
  icon: [512, 512, [], "f77a", "M2 377.4l43 74.3A51.35 51.35 0 0 0 90.9 480h285.4l-59.2-102.6zM501.8 350L335.6 59.3A51.38 51.38 0 0 0 290.2 32h-88.4l257.3 447.6 40.7-70.5c1.9-3.2 21-29.7 2-59.1zM275 304.5l-115.5-200L44 304.5z"]
};
var faAsymmetrik = {
  prefix: 'fab',
  iconName: 'asymmetrik',
  icon: [576, 512, [], "f372", "M517.5 309.2c38.8-40 58.1-80 58.5-116.1.8-65.5-59.4-118.2-169.4-135C277.9 38.4 118.1 73.6 0 140.5 52 114 110.6 92.3 170.7 82.3c74.5-20.5 153-25.4 221.3-14.8C544.5 91.3 588.8 195 490.8 299.2c-10.2 10.8-22 21.1-35 30.6L304.9 103.4 114.7 388.9c-65.6-29.4-76.5-90.2-19.1-151.2 20.8-22.2 48.3-41.9 79.5-58.1 20-12.2 39.7-22.6 62-30.7-65.1 20.3-122.7 52.9-161.6 92.9-27.7 28.6-41.4 57.1-41.7 82.9-.5 35.1 23.4 65.1 68.4 83l-34.5 51.7h101.6l22-34.4c22.2 1 45.3 0 68.6-2.7l-22.8 37.1h135.5L340 406.3c18.6-5.3 36.9-11.5 54.5-18.7l45.9 71.8H542L468.6 349c18.5-12.1 35-25.5 48.9-39.8zm-187.6 80.5l-25-40.6-32.7 53.3c-23.4 3.5-46.7 5.1-69.2 4.4l101.9-159.3 78.7 123c-17.2 7.4-35.3 13.9-53.7 19.2z"]
};
var faAtlassian = {
  prefix: 'fab',
  iconName: 'atlassian',
  icon: [512, 512, [], "f77b", "M152.2 236.4c-7.7-8.2-19.7-7.7-24.8 2.8L1.6 490.2c-5 10 2.4 21.7 13.4 21.7h175c5.8.1 11-3.2 13.4-8.4 37.9-77.8 15.1-196.3-51.2-267.1zM244.4 8.1c-122.3 193.4-8.5 348.6 65 495.5 2.5 5.1 7.7 8.4 13.4 8.4H497c11.2 0 18.4-11.8 13.4-21.7 0 0-234.5-470.6-240.4-482.3-5.3-10.6-18.8-10.8-25.6.1z"]
};
var faAudible = {
  prefix: 'fab',
  iconName: 'audible',
  icon: [640, 512, [], "f373", "M640 199.9v54l-320 200L0 254v-54l320 200 320-200.1zm-194.5 72l47.1-29.4c-37.2-55.8-100.7-92.6-172.7-92.6-72 0-135.5 36.7-172.6 92.4h.3c2.5-2.3 5.1-4.5 7.7-6.7 89.7-74.4 219.4-58.1 290.2 36.3zm-220.1 18.8c16.9-11.9 36.5-18.7 57.4-18.7 34.4 0 65.2 18.4 86.4 47.6l45.4-28.4c-20.9-29.9-55.6-49.5-94.8-49.5-38.9 0-73.4 19.4-94.4 49zM103.6 161.1c131.8-104.3 318.2-76.4 417.5 62.1l.7 1 48.8-30.4C517.1 112.1 424.8 58.1 319.9 58.1c-103.5 0-196.6 53.5-250.5 135.6 9.9-10.5 22.7-23.5 34.2-32.6zm467 32.7z"]
};
var faAutoprefixer = {
  prefix: 'fab',
  iconName: 'autoprefixer',
  icon: [640, 512, [], "f41c", "M318.4 16l-161 480h77.5l25.4-81.4h119.5L405 496h77.5L318.4 16zm-40.3 341.9l41.2-130.4h1.5l40.9 130.4h-83.6zM640 405l-10-31.4L462.1 358l19.4 56.5L640 405zm-462.1-47L10 373.7 0 405l158.5 9.4 19.4-56.4z"]
};
var faAvianex = {
  prefix: 'fab',
  iconName: 'avianex',
  icon: [512, 512, [], "f374", "M453.1 32h-312c-38.9 0-76.2 31.2-83.3 69.7L1.2 410.3C-5.9 448.8 19.9 480 58.9 480h312c38.9 0 76.2-31.2 83.3-69.7l56.7-308.5c7-38.6-18.8-69.8-57.8-69.8zm-58.2 347.3l-32 13.5-115.4-110c-14.7 10-29.2 19.5-41.7 27.1l22.1 64.2-17.9 12.7-40.6-61-52.4-48.1 15.7-15.4 58 31.1c9.3-10.5 20.8-22.6 32.8-34.9L203 228.9l-68.8-99.8 18.8-28.9 8.9-4.8L265 207.8l4.9 4.5c19.4-18.8 33.8-32.4 33.8-32.4 7.7-6.5 21.5-2.9 30.7 7.9 9 10.5 10.6 24.7 2.7 31.3-1.8 1.3-15.5 11.4-35.3 25.6l4.5 7.3 94.9 119.4-6.3 7.9z"]
};
var faAviato = {
  prefix: 'fab',
  iconName: 'aviato',
  icon: [640, 512, [], "f421", "M107.2 283.5l-19-41.8H36.1l-19 41.8H0l62.2-131.4 62.2 131.4h-17.2zm-45-98.1l-19.6 42.5h39.2l-19.6-42.5zm112.7 102.4l-62.2-131.4h17.1l45.1 96 45.1-96h17l-62.1 131.4zm80.6-4.3V156.4H271v127.1h-15.5zm209.1-115.6v115.6h-17.3V167.9h-41.2v-11.5h99.6v11.5h-41.1zM640 218.8c0 9.2-1.7 17.8-5.1 25.8-3.4 8-8.2 15.1-14.2 21.1-6 6-13.1 10.8-21.1 14.2-8 3.4-16.6 5.1-25.8 5.1s-17.8-1.7-25.8-5.1c-8-3.4-15.1-8.2-21.1-14.2-6-6-10.8-13-14.2-21.1-3.4-8-5.1-16.6-5.1-25.8s1.7-17.8 5.1-25.8c3.4-8 8.2-15.1 14.2-21.1 6-6 13-8.4 21.1-11.9 8-3.4 16.6-5.1 25.8-5.1s17.8 1.7 25.8 5.1c8 3.4 15.1 5.8 21.1 11.9 6 6 10.7 13.1 14.2 21.1 3.4 8 5.1 16.6 5.1 25.8zm-15.5 0c0-7.3-1.3-14-3.9-20.3-2.6-6.3-6.2-11.7-10.8-16.3-4.6-4.6-10-8.2-16.2-10.9-6.2-2.7-12.8-4-19.8-4s-13.6 1.3-19.8 4c-6.2 2.7-11.6 6.3-16.2 10.9-4.6 4.6-8.2 10-10.8 16.3-2.6 6.3-3.9 13.1-3.9 20.3 0 7.3 1.3 14 3.9 20.3 2.6 6.3 6.2 11.7 10.8 16.3 4.6 4.6 10 8.2 16.2 10.9 6.2 2.7 12.8 4 19.8 4s13.6-1.3 19.8-4c6.2-2.7 11.6-6.3 16.2-10.9 4.6-4.6 8.2-10 10.8-16.3 2.6-6.3 3.9-13.1 3.9-20.3zm-94.8 96.7v-6.3l88.9-10-242.9 13.4c.6-2.2 1.1-4.6 1.4-7.2.3-2 .5-4.2.6-6.5l64.8-8.1-64.9 1.9c0-.4-.1-.7-.1-1.1-2.8-17.2-25.5-23.7-25.5-23.7l-1.1-26.3h23.8l19 41.8h17.1L348.6 152l-62.2 131.4h17.1l19-41.8h23.6L345 268s-22.7 6.5-25.5 23.7c-.1.3-.1.7-.1 1.1l-64.9-1.9 64.8 8.1c.1 2.3.3 4.4.6 6.5.3 2.6.8 5 1.4 7.2L78.4 299.2l88.9 10v6.3c-5.9.9-10.5 6-10.5 12.2 0 6.8 5.6 12.4 12.4 12.4 6.8 0 12.4-5.6 12.4-12.4 0-6.2-4.6-11.3-10.5-12.2v-5.8l80.3 9v5.4c-5.7 1.1-9.9 6.2-9.9 12.1 0 6.8 5.6 10.2 12.4 10.2 6.8 0 12.4-3.4 12.4-10.2 0-6-4.3-11-9.9-12.1v-4.9l28.4 3.2v23.7h-5.9V360h5.9v-6.6h5v6.6h5.9v-13.8h-5.9V323l38.3 4.3c8.1 11.4 19 13.6 19 13.6l-.1 6.7-5.1.2-.1 12.1h4.1l.1-5h5.2l.1 5h4.1l-.1-12.1-5.1-.2-.1-6.7s10.9-2.1 19-13.6l38.3-4.3v23.2h-5.9V360h5.9v-6.6h5v6.6h5.9v-13.8h-5.9v-23.7l28.4-3.2v4.9c-5.7 1.1-9.9 6.2-9.9 12.1 0 6.8 5.6 10.2 12.4 10.2 6.8 0 12.4-3.4 12.4-10.2 0-6-4.3-11-9.9-12.1v-5.4l80.3-9v5.8c-5.9.9-10.5 6-10.5 12.2 0 6.8 5.6 12.4 12.4 12.4 6.8 0 12.4-5.6 12.4-12.4-.2-6.3-4.7-11.4-10.7-12.3zm-200.8-87.6l19.6-42.5 19.6 42.5h-17.9l-1.7-40.3-1.7 40.3h-17.9z"]
};
var faAws = {
  prefix: 'fab',
  iconName: 'aws',
  icon: [640, 512, [], "f375", "M180.41 203.01c-.72 22.65 10.6 32.68 10.88 39.05a8.164 8.164 0 0 1-4.1 6.27l-12.8 8.96a10.66 10.66 0 0 1-5.63 1.92c-.43-.02-8.19 1.83-20.48-25.61a78.608 78.608 0 0 1-62.61 29.45c-16.28.89-60.4-9.24-58.13-56.21-1.59-38.28 34.06-62.06 70.93-60.05 7.1.02 21.6.37 46.99 6.27v-15.62c2.69-26.46-14.7-46.99-44.81-43.91-2.4.01-19.4-.5-45.84 10.11-7.36 3.38-8.3 2.82-10.75 2.82-7.41 0-4.36-21.48-2.94-24.2 5.21-6.4 35.86-18.35 65.94-18.18a76.857 76.857 0 0 1 55.69 17.28 70.285 70.285 0 0 1 17.67 52.36l-.01 69.29zM93.99 235.4c32.43-.47 46.16-19.97 49.29-30.47 2.46-10.05 2.05-16.41 2.05-27.4-9.67-2.32-23.59-4.85-39.56-4.87-15.15-1.14-42.82 5.63-41.74 32.26-1.24 16.79 11.12 31.4 29.96 30.48zm170.92 23.05c-7.86.72-11.52-4.86-12.68-10.37l-49.8-164.65c-.97-2.78-1.61-5.65-1.92-8.58a4.61 4.61 0 0 1 3.86-5.25c.24-.04-2.13 0 22.25 0 8.78-.88 11.64 6.03 12.55 10.37l35.72 140.83 33.16-140.83c.53-3.22 2.94-11.07 12.8-10.24h17.16c2.17-.18 11.11-.5 12.68 10.37l33.42 142.63L420.98 80.1c.48-2.18 2.72-11.37 12.68-10.37h19.72c.85-.13 6.15-.81 5.25 8.58-.43 1.85 3.41-10.66-52.75 169.9-1.15 5.51-4.82 11.09-12.68 10.37h-18.69c-10.94 1.15-12.51-9.66-12.68-10.75L328.67 110.7l-32.78 136.99c-.16 1.09-1.73 11.9-12.68 10.75h-18.3zm273.48 5.63c-5.88.01-33.92-.3-57.36-12.29a12.802 12.802 0 0 1-7.81-11.91v-10.75c0-8.45 6.2-6.9 8.83-5.89 10.04 4.06 16.48 7.14 28.81 9.6 36.65 7.53 52.77-2.3 56.72-4.48 13.15-7.81 14.19-25.68 5.25-34.95-10.48-8.79-15.48-9.12-53.13-21-4.64-1.29-43.7-13.61-43.79-52.36-.61-28.24 25.05-56.18 69.52-55.95 12.67-.01 46.43 4.13 55.57 15.62 1.35 2.09 2.02 4.55 1.92 7.04v10.11c0 4.44-1.62 6.66-4.87 6.66-7.71-.86-21.39-11.17-49.16-10.75-6.89-.36-39.89.91-38.41 24.97-.43 18.96 26.61 26.07 29.7 26.89 36.46 10.97 48.65 12.79 63.12 29.58 17.14 22.25 7.9 48.3 4.35 55.44-19.08 37.49-68.42 34.44-69.26 34.42zm40.2 104.86c-70.03 51.72-171.69 79.25-258.49 79.25A469.127 469.127 0 0 1 2.83 327.46c-6.53-5.89-.77-13.96 7.17-9.47a637.37 637.37 0 0 0 316.88 84.12 630.22 630.22 0 0 0 241.59-49.55c11.78-5 21.77 7.8 10.12 16.38zm29.19-33.29c-8.96-11.52-59.28-5.38-81.81-2.69-6.79.77-7.94-5.12-1.79-9.47 40.07-28.17 105.88-20.1 113.44-10.63 7.55 9.47-2.05 75.41-39.56 106.91-5.76 4.87-11.27 2.3-8.71-4.1 8.44-21.25 27.39-68.49 18.43-80.02z"]
};
var faBandcamp = {
  prefix: 'fab',
  iconName: 'bandcamp',
  icon: [496, 512, [], "f2d5", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm48.2 326.1h-181L199.9 178h181l-84.7 156.1z"]
};
var faBattleNet = {
  prefix: 'fab',
  iconName: 'battle-net',
  icon: [512, 512, [], "f835", "M448.61 225.62c26.87.18 35.57-7.43 38.92-12.37 12.47-16.32-7.06-47.6-52.85-71.33 17.76-33.58 30.11-63.68 36.34-85.3 3.38-11.83 1.09-19 .45-20.25-1.72 10.52-15.85 48.46-48.2 100.05-25-11.22-56.52-20.1-93.77-23.8-8.94-16.94-34.88-63.86-60.48-88.93C252.18 7.14 238.7 1.07 228.18.22h-.05c-13.83-1.55-22.67 5.85-27.4 11-17.2 18.53-24.33 48.87-25 84.07-7.24-12.35-17.17-24.63-28.5-25.93h-.18c-20.66-3.48-38.39 29.22-36 81.29-38.36 1.38-71 5.75-93 11.23-9.9 2.45-16.22 7.27-17.76 9.72 1-.38 22.4-9.22 111.56-9.22 5.22 53 29.75 101.82 26 93.19-9.73 15.4-38.24 62.36-47.31 97.7-5.87 22.88-4.37 37.61.15 47.14 5.57 12.75 16.41 16.72 23.2 18.26 25 5.71 55.38-3.63 86.7-21.14-7.53 12.84-13.9 28.51-9.06 39.34 7.31 19.65 44.49 18.66 88.44-9.45 20.18 32.18 40.07 57.94 55.7 74.12a39.79 39.79 0 0 0 8.75 7.09c5.14 3.21 8.58 3.37 8.58 3.37-8.24-6.75-34-38-62.54-91.78 22.22-16 45.65-38.87 67.47-69.27 122.82 4.6 143.29-24.76 148-31.64 14.67-19.88 3.43-57.44-57.32-93.69zm-77.85 106.22c23.81-37.71 30.34-67.77 29.45-92.33 27.86 17.57 47.18 37.58 49.06 58.83 1.14 12.93-8.1 29.12-78.51 33.5zM216.9 387.69c9.76-6.23 19.53-13.12 29.2-20.49 6.68 13.33 13.6 26.1 20.6 38.19-40.6 21.86-68.84 12.76-49.8-17.7zm215-171.35c-10.29-5.34-21.16-10.34-32.38-15.05a722.459 722.459 0 0 0 22.74-36.9c39.06 24.1 45.9 53.18 9.64 51.95zM279.18 398c-5.51-11.35-11-23.5-16.5-36.44 43.25 1.27 62.42-18.73 63.28-20.41 0 .07-25 15.64-62.53 12.25a718.78 718.78 0 0 0 85.06-84q13.06-15.31 24.93-31.11c-.36-.29-1.54-3-16.51-12-51.7 60.27-102.34 98-132.75 115.92-20.59-11.18-40.84-31.78-55.71-61.49-20-39.92-30-82.39-31.57-116.07 12.3.91 25.27 2.17 38.85 3.88-22.29 36.8-14.39 63-13.47 64.23 0-.07-.95-29.17 20.14-59.57a695.23 695.23 0 0 0 44.67 152.84c.93-.38 1.84.88 18.67-8.25-26.33-74.47-33.76-138.17-34-173.43 20-12.42 48.18-19.8 81.63-17.81 44.57 2.67 86.36 15.25 116.32 30.71q-10.69 15.66-23.33 32.47C365.63 152 339.1 145.84 337.5 146c.11 0 25.9 14.07 41.52 47.22a717.63 717.63 0 0 0-115.34-31.71 646.608 646.608 0 0 0-39.39-6.05c-.07.45-1.81 1.85-2.16 20.33C300 190.28 358.78 215.68 389.36 233c.74 23.55-6.95 51.61-25.41 79.57-24.6 37.31-56.39 67.23-84.77 85.43zm27.4-287c-44.56-1.66-73.58 7.43-94.69 20.67 2-52.3 21.31-76.38 38.21-75.28C267 52.15 305 108.55 306.58 111zm-130.65 3.1c.48 12.11 1.59 24.62 3.21 37.28-14.55-.85-28.74-1.25-42.4-1.26-.08 3.24-.12-51 24.67-49.59h.09c5.76 1.09 10.63 6.88 14.43 13.57zm-28.06 162c20.76 39.7 43.3 60.57 65.25 72.31-46.79 24.76-77.53 20-84.92 4.51-.2-.21-11.13-15.3 19.67-76.81zm210.06 74.8"]
};
var faBehance = {
  prefix: 'fab',
  iconName: 'behance',
  icon: [576, 512, [], "f1b4", "M232 237.2c31.8-15.2 48.4-38.2 48.4-74 0-70.6-52.6-87.8-113.3-87.8H0v354.4h171.8c64.4 0 124.9-30.9 124.9-102.9 0-44.5-21.1-77.4-64.7-89.7zM77.9 135.9H151c28.1 0 53.4 7.9 53.4 40.5 0 30.1-19.7 42.2-47.5 42.2h-79v-82.7zm83.3 233.7H77.9V272h84.9c34.3 0 56 14.3 56 50.6 0 35.8-25.9 47-57.6 47zm358.5-240.7H376V94h143.7v34.9zM576 305.2c0-75.9-44.4-139.2-124.9-139.2-78.2 0-131.3 58.8-131.3 135.8 0 79.9 50.3 134.7 131.3 134.7 61.3 0 101-27.6 120.1-86.3H509c-6.7 21.9-34.3 33.5-55.7 33.5-41.3 0-63-24.2-63-65.3h185.1c.3-4.2.6-8.7.6-13.2zM390.4 274c2.3-33.7 24.7-54.8 58.5-54.8 35.4 0 53.2 20.8 56.2 54.8H390.4z"]
};
var faBehanceSquare = {
  prefix: 'fab',
  iconName: 'behance-square',
  icon: [448, 512, [], "f1b5", "M186.5 293c0 19.3-14 25.4-31.2 25.4h-45.1v-52.9h46c18.6.1 30.3 7.8 30.3 27.5zm-7.7-82.3c0-17.7-13.7-21.9-28.9-21.9h-39.6v44.8H153c15.1 0 25.8-6.6 25.8-22.9zm132.3 23.2c-18.3 0-30.5 11.4-31.7 29.7h62.2c-1.7-18.5-11.3-29.7-30.5-29.7zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zM271.7 185h77.8v-18.9h-77.8V185zm-43 110.3c0-24.1-11.4-44.9-35-51.6 17.2-8.2 26.2-17.7 26.2-37 0-38.2-28.5-47.5-61.4-47.5H68v192h93.1c34.9-.2 67.6-16.9 67.6-55.9zM380 280.5c0-41.1-24.1-75.4-67.6-75.4-42.4 0-71.1 31.8-71.1 73.6 0 43.3 27.3 73 71.1 73 33.2 0 54.7-14.9 65.1-46.8h-33.7c-3.7 11.9-18.6 18.1-30.2 18.1-22.4 0-34.1-13.1-34.1-35.3h100.2c.1-2.3.3-4.8.3-7.2z"]
};
var faBimobject = {
  prefix: 'fab',
  iconName: 'bimobject',
  icon: [448, 512, [], "f378", "M416 32H32C14.4 32 0 46.4 0 64v384c0 17.6 14.4 32 32 32h384c17.6 0 32-14.4 32-32V64c0-17.6-14.4-32-32-32zm-64 257.4c0 49.4-11.4 82.6-103.8 82.6h-16.9c-44.1 0-62.4-14.9-70.4-38.8h-.9V368H96V136h64v74.7h1.1c4.6-30.5 39.7-38.8 69.7-38.8h17.3c92.4 0 103.8 33.1 103.8 82.5v35zm-64-28.9v22.9c0 21.7-3.4 33.8-38.4 33.8h-45.3c-28.9 0-44.1-6.5-44.1-35.7v-19c0-29.3 15.2-35.7 44.1-35.7h45.3c35-.2 38.4 12 38.4 33.7z"]
};
var faBitbucket = {
  prefix: 'fab',
  iconName: 'bitbucket',
  icon: [512, 512, [], "f171", "M22.2 32A16 16 0 0 0 6 47.8a26.35 26.35 0 0 0 .2 2.8l67.9 412.1a21.77 21.77 0 0 0 21.3 18.2h325.7a16 16 0 0 0 16-13.4L505 50.7a16 16 0 0 0-13.2-18.3 24.58 24.58 0 0 0-2.8-.2L22.2 32zm285.9 297.8h-104l-28.1-147h157.3l-25.2 147z"]
};
var faBitcoin = {
  prefix: 'fab',
  iconName: 'bitcoin',
  icon: [512, 512, [], "f379", "M504 256c0 136.967-111.033 248-248 248S8 392.967 8 256 119.033 8 256 8s248 111.033 248 248zm-141.651-35.33c4.937-32.999-20.191-50.739-54.55-62.573l11.146-44.702-27.213-6.781-10.851 43.524c-7.154-1.783-14.502-3.464-21.803-5.13l10.929-43.81-27.198-6.781-11.153 44.686c-5.922-1.349-11.735-2.682-17.377-4.084l.031-.14-37.53-9.37-7.239 29.062s20.191 4.627 19.765 4.913c11.022 2.751 13.014 10.044 12.68 15.825l-12.696 50.925c.76.194 1.744.473 2.829.907-.907-.225-1.876-.473-2.876-.713l-17.796 71.338c-1.349 3.348-4.767 8.37-12.471 6.464.271.395-19.78-4.937-19.78-4.937l-13.51 31.147 35.414 8.827c6.588 1.651 13.045 3.379 19.4 5.006l-11.262 45.213 27.182 6.781 11.153-44.733a1038.209 1038.209 0 0 0 21.687 5.627l-11.115 44.523 27.213 6.781 11.262-45.128c46.404 8.781 81.299 5.239 95.986-36.727 11.836-33.79-.589-53.281-25.004-65.991 17.78-4.098 31.174-15.792 34.747-39.949zm-62.177 87.179c-8.41 33.79-65.308 15.523-83.755 10.943l14.944-59.899c18.446 4.603 77.6 13.717 68.811 48.956zm8.417-87.667c-7.673 30.736-55.031 15.12-70.393 11.292l13.548-54.327c15.363 3.828 64.836 10.973 56.845 43.035z"]
};
var faBity = {
  prefix: 'fab',
  iconName: 'bity',
  icon: [496, 512, [], "f37a", "M78.4 67.2C173.8-22 324.5-24 421.5 71c14.3 14.1-6.4 37.1-22.4 21.5-84.8-82.4-215.8-80.3-298.9-3.2-16.3 15.1-36.5-8.3-21.8-22.1zm98.9 418.6c19.3 5.7 29.3-23.6 7.9-30C73 421.9 9.4 306.1 37.7 194.8c5-19.6-24.9-28.1-30.2-7.1-32.1 127.4 41.1 259.8 169.8 298.1zm148.1-2c121.9-40.2 192.9-166.9 164.4-291-4.5-19.7-34.9-13.8-30 7.9 24.2 107.7-37.1 217.9-143.2 253.4-21.2 7-10.4 36 8.8 29.7zm-62.9-79l.2-71.8c0-8.2-6.6-14.8-14.8-14.8-8.2 0-14.8 6.7-14.8 14.8l-.2 71.8c0 8.2 6.6 14.8 14.8 14.8s14.8-6.6 14.8-14.8zm71-269c2.1 90.9 4.7 131.9-85.5 132.5-92.5-.7-86.9-44.3-85.5-132.5 0-21.8-32.5-19.6-32.5 0v71.6c0 69.3 60.7 90.9 118 90.1 57.3.8 118-20.8 118-90.1v-71.6c0-19.6-32.5-21.8-32.5 0z"]
};
var faBlackTie = {
  prefix: 'fab',
  iconName: 'black-tie',
  icon: [448, 512, [], "f27e", "M0 32v448h448V32H0zm316.5 325.2L224 445.9l-92.5-88.7 64.5-184-64.5-86.6h184.9L252 173.2l64.5 184z"]
};
var faBlackberry = {
  prefix: 'fab',
  iconName: 'blackberry',
  icon: [512, 512, [], "f37b", "M166 116.9c0 23.4-16.4 49.1-72.5 49.1H23.4l21-88.8h67.8c42.1 0 53.8 23.3 53.8 39.7zm126.2-39.7h-67.8L205.7 166h70.1c53.8 0 70.1-25.7 70.1-49.1.1-16.4-11.6-39.7-53.7-39.7zM88.8 208.1H21L0 296.9h70.1c56.1 0 72.5-23.4 72.5-49.1 0-16.3-11.7-39.7-53.8-39.7zm180.1 0h-67.8l-18.7 88.8h70.1c53.8 0 70.1-23.4 70.1-49.1 0-16.3-11.7-39.7-53.7-39.7zm189.3-53.8h-67.8l-18.7 88.8h70.1c53.8 0 70.1-23.4 70.1-49.1.1-16.3-11.6-39.7-53.7-39.7zm-28 137.9h-67.8L343.7 381h70.1c56.1 0 70.1-23.4 70.1-49.1 0-16.3-11.6-39.7-53.7-39.7zM240.8 346H173l-18.7 88.8h70.1c56.1 0 70.1-25.7 70.1-49.1.1-16.3-11.6-39.7-53.7-39.7z"]
};
var faBlogger = {
  prefix: 'fab',
  iconName: 'blogger',
  icon: [448, 512, [], "f37c", "M162.4 196c4.8-4.9 6.2-5.1 36.4-5.1 27.2 0 28.1.1 32.1 2.1 5.8 2.9 8.3 7 8.3 13.6 0 5.9-2.4 10-7.6 13.4-2.8 1.8-4.5 1.9-31.1 2.1-16.4.1-29.5-.2-31.5-.8-10.3-2.9-14.1-17.7-6.6-25.3zm61.4 94.5c-53.9 0-55.8.2-60.2 4.1-3.5 3.1-5.7 9.4-5.1 13.9.7 4.7 4.8 10.1 9.2 12 2.2 1 14.1 1.7 56.3 1.2l47.9-.6 9.2-1.5c9-5.1 10.5-17.4 3.1-24.4-5.3-4.7-5-4.7-60.4-4.7zm223.4 130.1c-3.5 28.4-23 50.4-51.1 57.5-7.2 1.8-9.7 1.9-172.9 1.8-157.8 0-165.9-.1-172-1.8-8.4-2.2-15.6-5.5-22.3-10-5.6-3.8-13.9-11.8-17-16.4-3.8-5.6-8.2-15.3-10-22C.1 423 0 420.3 0 256.3 0 93.2 0 89.7 1.8 82.6 8.1 57.9 27.7 39 53 33.4c7.3-1.6 332.1-1.9 340-.3 21.2 4.3 37.9 17.1 47.6 36.4 7.7 15.3 7-1.5 7.3 180.6.2 115.8 0 164.5-.7 170.5zm-85.4-185.2c-1.1-5-4.2-9.6-7.7-11.5-1.1-.6-8-1.3-15.5-1.7-12.4-.6-13.8-.8-17.8-3.1-6.2-3.6-7.9-7.6-8-18.3 0-20.4-8.5-39.4-25.3-56.5-12-12.2-25.3-20.5-40.6-25.1-3.6-1.1-11.8-1.5-39.2-1.8-42.9-.5-52.5.4-67.1 6.2-27 10.7-46.3 33.4-53.4 62.4-1.3 5.4-1.6 14.2-1.9 64.3-.4 62.8 0 72.1 4 84.5 9.7 30.7 37.1 53.4 64.6 58.4 9.2 1.7 122.2 2.1 133.7.5 20.1-2.7 35.9-10.8 50.7-25.9 10.7-10.9 17.4-22.8 21.8-38.5 3.2-10.9 2.9-88.4 1.7-93.9z"]
};
var faBloggerB = {
  prefix: 'fab',
  iconName: 'blogger-b',
  icon: [448, 512, [], "f37d", "M446.6 222.7c-1.8-8-6.8-15.4-12.5-18.5-1.8-1-13-2.2-25-2.7-20.1-.9-22.3-1.3-28.7-5-10.1-5.9-12.8-12.3-12.9-29.5-.1-33-13.8-63.7-40.9-91.3-19.3-19.7-40.9-33-65.5-40.5-5.9-1.8-19.1-2.4-63.3-2.9-69.4-.8-84.8.6-108.4 10C45.9 59.5 14.7 96.1 3.3 142.9 1.2 151.7.7 165.8.2 246.8c-.6 101.5.1 116.4 6.4 136.5 15.6 49.6 59.9 86.3 104.4 94.3 14.8 2.7 197.3 3.3 216 .8 32.5-4.4 58-17.5 81.9-41.9 17.3-17.7 28.1-36.8 35.2-62.1 4.9-17.6 4.5-142.8 2.5-151.7zm-322.1-63.6c7.8-7.9 10-8.2 58.8-8.2 43.9 0 45.4.1 51.8 3.4 9.3 4.7 13.4 11.3 13.4 21.9 0 9.5-3.8 16.2-12.3 21.6-4.6 2.9-7.3 3.1-50.3 3.3-26.5.2-47.7-.4-50.8-1.2-16.6-4.7-22.8-28.5-10.6-40.8zm191.8 199.8l-14.9 2.4-77.5.9c-68.1.8-87.3-.4-90.9-2-7.1-3.1-13.8-11.7-14.9-19.4-1.1-7.3 2.6-17.3 8.2-22.4 7.1-6.4 10.2-6.6 97.3-6.7 89.6-.1 89.1-.1 97.6 7.8 12.1 11.3 9.5 31.2-4.9 39.4z"]
};
var faBluetooth = {
  prefix: 'fab',
  iconName: 'bluetooth',
  icon: [448, 512, [], "f293", "M292.6 171.1L249.7 214l-.3-86 43.2 43.1m-43.2 219.8l43.1-43.1-42.9-42.9-.2 86zM416 259.4C416 465 344.1 512 230.9 512S32 465 32 259.4 115.4 0 228.6 0 416 53.9 416 259.4zm-158.5 0l79.4-88.6L211.8 36.5v176.9L138 139.6l-27 26.9 92.7 93-92.7 93 26.9 26.9 73.8-73.8 2.3 170 127.4-127.5-83.9-88.7z"]
};
var faBluetoothB = {
  prefix: 'fab',
  iconName: 'bluetooth-b',
  icon: [320, 512, [], "f294", "M196.48 260.023l92.626-103.333L143.125 0v206.33l-86.111-86.111-31.406 31.405 108.061 108.399L25.608 368.422l31.406 31.405 86.111-86.111L145.84 512l148.552-148.644-97.912-103.333zm40.86-102.996l-49.977 49.978-.338-100.295 50.315 50.317zM187.363 313.04l49.977 49.978-50.315 50.316.338-100.294z"]
};
var faBootstrap = {
  prefix: 'fab',
  iconName: 'bootstrap',
  icon: [448, 512, [], "f836", "M292.3 311.93c0 42.41-39.72 41.43-43.92 41.43h-80.89v-81.69h80.89c42.56 0 43.92 31.9 43.92 40.26zm-50.15-73.13c.67 0 38.44 1 38.44-36.31 0-15.52-3.51-35.87-38.44-35.87h-74.66v72.18h74.66zM448 106.67v298.66A74.89 74.89 0 0 1 373.33 480H74.67A74.89 74.89 0 0 1 0 405.33V106.67A74.89 74.89 0 0 1 74.67 32h298.66A74.89 74.89 0 0 1 448 106.67zM338.05 317.86c0-21.57-6.65-58.29-49.05-67.35v-.73c22.91-9.78 37.34-28.25 37.34-55.64 0-7 2-64.78-77.6-64.78h-127v261.33c128.23 0 139.87 1.68 163.6-5.71 14.21-4.42 52.71-17.98 52.71-67.12z"]
};
var faBtc = {
  prefix: 'fab',
  iconName: 'btc',
  icon: [384, 512, [], "f15a", "M310.204 242.638c27.73-14.18 45.377-39.39 41.28-81.3-5.358-57.351-52.458-76.573-114.85-81.929V0h-48.528v77.203c-12.605 0-25.525.315-38.444.63V0h-48.528v79.409c-17.842.539-38.622.276-97.37 0v51.678c38.314-.678 58.417-3.14 63.023 21.427v217.429c-2.925 19.492-18.524 16.685-53.255 16.071L3.765 443.68c88.481 0 97.37.315 97.37.315V512h48.528v-67.06c13.234.315 26.154.315 38.444.315V512h48.528v-68.005c81.299-4.412 135.647-24.894 142.895-101.467 5.671-61.446-23.32-88.862-69.326-99.89zM150.608 134.553c27.415 0 113.126-8.507 113.126 48.528 0 54.515-85.71 48.212-113.126 48.212v-96.74zm0 251.776V279.821c32.772 0 133.127-9.138 133.127 53.255-.001 60.186-100.355 53.253-133.127 53.253z"]
};
var faBuffer = {
  prefix: 'fab',
  iconName: 'buffer',
  icon: [448, 512, [], "f837", "M427.84 380.67l-196.5 97.82a18.6 18.6 0 0 1-14.67 0L20.16 380.67c-4-2-4-5.28 0-7.29L67.22 350a18.65 18.65 0 0 1 14.69 0l134.76 67a18.51 18.51 0 0 0 14.67 0l134.76-67a18.62 18.62 0 0 1 14.68 0l47.06 23.43c4.05 1.96 4.05 5.24 0 7.24zm0-136.53l-47.06-23.43a18.62 18.62 0 0 0-14.68 0l-134.76 67.08a18.68 18.68 0 0 1-14.67 0L81.91 220.71a18.65 18.65 0 0 0-14.69 0l-47.06 23.43c-4 2-4 5.29 0 7.31l196.51 97.8a18.6 18.6 0 0 0 14.67 0l196.5-97.8c4.05-2.02 4.05-5.3 0-7.31zM20.16 130.42l196.5 90.29a20.08 20.08 0 0 0 14.67 0l196.51-90.29c4-1.86 4-4.89 0-6.74L231.33 33.4a19.88 19.88 0 0 0-14.67 0l-196.5 90.28c-4.05 1.85-4.05 4.88 0 6.74z"]
};
var faBuromobelexperte = {
  prefix: 'fab',
  iconName: 'buromobelexperte',
  icon: [448, 512, [], "f37f", "M0 32v128h128V32H0zm120 120H8V40h112v112zm40-120v128h128V32H160zm120 120H168V40h112v112zm40-120v128h128V32H320zm120 120H328V40h112v112zM0 192v128h128V192H0zm120 120H8V200h112v112zm40-120v128h128V192H160zm120 120H168V200h112v112zm40-120v128h128V192H320zm120 120H328V200h112v112zM0 352v128h128V352H0zm120 120H8V360h112v112zm40-120v128h128V352H160zm120 120H168V360h112v112zm40-120v128h128V352H320z"]
};
var faBuyNLarge = {
  prefix: 'fab',
  iconName: 'buy-n-large',
  icon: [576, 512, [], "f8a6", "M288 32C133.27 32 7.79 132.32 7.79 256S133.27 480 288 480s280.21-100.32 280.21-224S442.73 32 288 32zm-85.39 357.19L64.1 390.55l77.25-290.74h133.44c63.15 0 84.93 28.65 78 72.84a60.24 60.24 0 0 1-1.5 6.85 77.39 77.39 0 0 0-17.21-1.93c-42.35 0-76.69 33.88-76.69 75.65 0 37.14 27.14 68 62.93 74.45-18.24 37.16-56.16 60.92-117.71 61.52zM358 207.11h32l-22.16 90.31h-35.41l-11.19-35.63-7.83 35.63h-37.83l26.63-90.31h31.34l15 36.75zm145.86 182.08H306.79L322.63 328a78.8 78.8 0 0 0 11.47.83c42.34 0 76.69-33.87 76.69-75.65 0-32.65-21-60.46-50.38-71.06l21.33-82.35h92.5l-53.05 205.36h103.87zM211.7 269.39H187l-13.8 56.47h24.7c16.14 0 32.11-3.18 37.94-26.65 5.56-22.31-7.99-29.82-24.14-29.82zM233 170h-21.34L200 217.71h21.37c18 0 35.38-14.64 39.21-30.14C265.23 168.71 251.07 170 233 170z"]
};
var faBuysellads = {
  prefix: 'fab',
  iconName: 'buysellads',
  icon: [448, 512, [], "f20d", "M224 150.7l42.9 160.7h-85.8L224 150.7zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-65.3 325.3l-94.5-298.7H159.8L65.3 405.3H156l111.7-91.6 24.2 91.6h90.8z"]
};
var faCanadianMapleLeaf = {
  prefix: 'fab',
  iconName: 'canadian-maple-leaf',
  icon: [512, 512, [], "f785", "M383.8 351.7c2.5-2.5 105.2-92.4 105.2-92.4l-17.5-7.5c-10-4.9-7.4-11.5-5-17.4 2.4-7.6 20.1-67.3 20.1-67.3s-47.7 10-57.7 12.5c-7.5 2.4-10-2.5-12.5-7.5s-15-32.4-15-32.4-52.6 59.9-55.1 62.3c-10 7.5-20.1 0-17.6-10 0-10 27.6-129.6 27.6-129.6s-30.1 17.4-40.1 22.4c-7.5 5-12.6 5-17.6-5C293.5 72.3 255.9 0 255.9 0s-37.5 72.3-42.5 79.8c-5 10-10 10-17.6 5-10-5-40.1-22.4-40.1-22.4S183.3 182 183.3 192c2.5 10-7.5 17.5-17.6 10-2.5-2.5-55.1-62.3-55.1-62.3S98.1 167 95.6 172s-5 9.9-12.5 7.5C73 177 25.4 167 25.4 167s17.6 59.7 20.1 67.3c2.4 6 5 12.5-5 17.4L23 259.3s102.6 89.9 105.2 92.4c5.1 5 10 7.5 5.1 22.5-5.1 15-10.1 35.1-10.1 35.1s95.2-20.1 105.3-22.6c8.7-.9 18.3 2.5 18.3 12.5S241 512 241 512h30s-5.8-102.7-5.8-112.8 9.5-13.4 18.4-12.5c10 2.5 105.2 22.6 105.2 22.6s-5-20.1-10-35.1 0-17.5 5-22.5z"]
};
var faCcAmazonPay = {
  prefix: 'fab',
  iconName: 'cc-amazon-pay',
  icon: [576, 512, [], "f42d", "M124.7 201.8c.1-11.8 0-23.5 0-35.3v-35.3c0-1.3.4-2 1.4-2.7 11.5-8 24.1-12.1 38.2-11.1 12.5.9 22.7 7 28.1 21.7 3.3 8.9 4.1 18.2 4.1 27.7 0 8.7-.7 17.3-3.4 25.6-5.7 17.8-18.7 24.7-35.7 23.9-11.7-.5-21.9-5-31.4-11.7-.9-.8-1.4-1.6-1.3-2.8zm154.9 14.6c4.6 1.8 9.3 2 14.1 1.5 11.6-1.2 21.9-5.7 31.3-12.5.9-.6 1.3-1.3 1.3-2.5-.1-3.9 0-7.9 0-11.8 0-4-.1-8 0-12 0-1.4-.4-2-1.8-2.2-7-.9-13.9-2.2-20.9-2.9-7-.6-14-.3-20.8 1.9-6.7 2.2-11.7 6.2-13.7 13.1-1.6 5.4-1.6 10.8.1 16.2 1.6 5.5 5.2 9.2 10.4 11.2zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zm-207.5 23.9c.4 1.7.9 3.4 1.6 5.1 16.5 40.6 32.9 81.3 49.5 121.9 1.4 3.5 1.7 6.4.2 9.9-2.8 6.2-4.9 12.6-7.8 18.7-2.6 5.5-6.7 9.5-12.7 11.2-4.2 1.1-8.5 1.3-12.9.9-2.1-.2-4.2-.7-6.3-.8-2.8-.2-4.2 1.1-4.3 4-.1 2.8-.1 5.6 0 8.3.1 4.6 1.6 6.7 6.2 7.5 4.7.8 9.4 1.6 14.2 1.7 14.3.3 25.7-5.4 33.1-17.9 2.9-4.9 5.6-10.1 7.7-15.4 19.8-50.1 39.5-100.3 59.2-150.5.6-1.5 1.1-3 1.3-4.6.4-2.4-.7-3.6-3.1-3.7-5.6-.1-11.1 0-16.7 0-3.1 0-5.3 1.4-6.4 4.3-.4 1.1-.9 2.3-1.3 3.4l-29.1 83.7c-2.1 6.1-4.2 12.1-6.5 18.6-.4-.9-.6-1.4-.8-1.9-10.8-29.9-21.6-59.9-32.4-89.8-1.7-4.7-3.5-9.5-5.3-14.2-.9-2.5-2.7-4-5.4-4-6.4-.1-12.8-.2-19.2-.1-2.2 0-3.3 1.6-2.8 3.7zM242.4 206c1.7 11.7 7.6 20.8 18 26.6 9.9 5.5 20.7 6.2 31.7 4.6 12.7-1.9 23.9-7.3 33.8-15.5.4-.3.8-.6 1.4-1 .5 3.2.9 6.2 1.5 9.2.5 2.6 2.1 4.3 4.5 4.4 4.6.1 9.1.1 13.7 0 2.3-.1 3.8-1.6 4-3.9.1-.8.1-1.6.1-2.3v-88.8c0-3.6-.2-7.2-.7-10.8-1.6-10.8-6.2-19.7-15.9-25.4-5.6-3.3-11.8-5-18.2-5.9-3-.4-6-.7-9.1-1.1h-10c-.8.1-1.6.3-2.5.3-8.2.4-16.3 1.4-24.2 3.5-5.1 1.3-10 3.2-15 4.9-3 1-4.5 3.2-4.4 6.5.1 2.8-.1 5.6 0 8.3.1 4.1 1.8 5.2 5.7 4.1 6.5-1.7 13.1-3.5 19.7-4.8 10.3-1.9 20.7-2.7 31.1-1.2 5.4.8 10.5 2.4 14.1 7 3.1 4 4.2 8.8 4.4 13.7.3 6.9.2 13.9.3 20.8 0 .4-.1.7-.2 1.2-.4 0-.8 0-1.1-.1-8.8-2.1-17.7-3.6-26.8-4.1-9.5-.5-18.9.1-27.9 3.2-10.8 3.8-19.5 10.3-24.6 20.8-4.1 8.3-4.6 17-3.4 25.8zM98.7 106.9v175.3c0 .8 0 1.7.1 2.5.2 2.5 1.7 4.1 4.1 4.2 5.9.1 11.8.1 17.7 0 2.5 0 4-1.7 4.1-4.1.1-.8.1-1.7.1-2.5v-60.7c.9.7 1.4 1.2 1.9 1.6 15 12.5 32.2 16.6 51.1 12.9 17.1-3.4 28.9-13.9 36.7-29.2 5.8-11.6 8.3-24.1 8.7-37 .5-14.3-1-28.4-6.8-41.7-7.1-16.4-18.9-27.3-36.7-30.9-2.7-.6-5.5-.8-8.2-1.2h-7c-1.2.2-2.4.3-3.6.5-11.7 1.4-22.3 5.8-31.8 12.7-2 1.4-3.9 3-5.9 4.5-.1-.5-.3-.8-.4-1.2-.4-2.3-.7-4.6-1.1-6.9-.6-3.9-2.5-5.5-6.4-5.6h-9.7c-5.9-.1-6.9 1-6.9 6.8zM493.6 339c-2.7-.7-5.1 0-7.6 1-43.9 18.4-89.5 30.2-136.8 35.8-14.5 1.7-29.1 2.8-43.7 3.2-26.6.7-53.2-.8-79.6-4.3-17.8-2.4-35.5-5.7-53-9.9-37-8.9-72.7-21.7-106.7-38.8-8.8-4.4-17.4-9.3-26.1-14-3.8-2.1-6.2-1.5-8.2 2.1v1.7c1.2 1.6 2.2 3.4 3.7 4.8 36 32.2 76.6 56.5 122 72.9 21.9 7.9 44.4 13.7 67.3 17.5 14 2.3 28 3.8 42.2 4.5 3 .1 6 .2 9 .4.7 0 1.4.2 2.1.3h17.7c.7-.1 1.4-.3 2.1-.3 14.9-.4 29.8-1.8 44.6-4 21.4-3.2 42.4-8.1 62.9-14.7 29.6-9.6 57.7-22.4 83.4-40.1 2.8-1.9 5.7-3.8 8-6.2 4.3-4.4 2.3-10.4-3.3-11.9zm50.4-27.7c-.8-4.2-4-5.8-7.6-7-5.7-1.9-11.6-2.8-17.6-3.3-11-.9-22-.4-32.8 1.6-12 2.2-23.4 6.1-33.5 13.1-1.2.8-2.4 1.8-3.1 3-.6.9-.7 2.3-.5 3.4.3 1.3 1.7 1.6 3 1.5.6 0 1.2 0 1.8-.1l19.5-2.1c9.6-.9 19.2-1.5 28.8-.8 4.1.3 8.1 1.2 12 2.2 4.3 1.1 6.2 4.4 6.4 8.7.3 6.7-1.2 13.1-2.9 19.5-3.5 12.9-8.3 25.4-13.3 37.8-.3.8-.7 1.7-.8 2.5-.4 2.5 1 4 3.4 3.5 1.4-.3 3-1.1 4-2.1 3.7-3.6 7.5-7.2 10.6-11.2 10.7-13.8 17-29.6 20.7-46.6.7-3 1.2-6.1 1.7-9.1.2-4.7.2-9.6.2-14.5z"]
};
var faCcAmex = {
  prefix: 'fab',
  iconName: 'cc-amex',
  icon: [576, 512, [], "f1f3", "M325.1 167.8c0-16.4-14.1-18.4-27.4-18.4l-39.1-.3v69.3H275v-25.1h18c18.4 0 14.5 10.3 14.8 25.1h16.6v-13.5c0-9.2-1.5-15.1-11-18.4 7.4-3 11.8-10.7 11.7-18.7zm-29.4 11.3H275v-15.3h21c5.1 0 10.7 1 10.7 7.4 0 6.6-5.3 7.9-11 7.9zM279 268.6h-52.7l-21 22.8-20.5-22.8h-66.5l-.1 69.3h65.4l21.3-23 20.4 23h32.2l.1-23.3c18.9 0 49.3 4.6 49.3-23.3 0-17.3-12.3-22.7-27.9-22.7zm-103.8 54.7h-40.6v-13.8h36.3v-14.1h-36.3v-12.5h41.7l17.9 20.2zm65.8 8.2l-25.3-28.1L241 276zm37.8-31h-21.2v-17.6h21.5c5.6 0 10.2 2.3 10.2 8.4 0 6.4-4.6 9.2-10.5 9.2zm-31.6-136.7v-14.6h-55.5v69.3h55.5v-14.3h-38.9v-13.8h37.8v-14.1h-37.8v-12.5zM576 255.4h-.2zm-194.6 31.9c0-16.4-14.1-18.7-27.1-18.7h-39.4l-.1 69.3h16.6l.1-25.3h17.6c11 0 14.8 2 14.8 13.8l-.1 11.5h16.6l.1-13.8c0-8.9-1.8-15.1-11-18.4 7.7-3.1 11.8-10.8 11.9-18.4zm-29.2 11.2h-20.7v-15.6h21c5.1 0 10.7 1 10.7 7.4 0 6.9-5.4 8.2-11 8.2zm-172.8-80v-69.3h-27.6l-19.7 47-21.7-47H83.3v65.7l-28.1-65.7H30.7L1 218.5h17.9l6.4-15.3h34.5l6.4 15.3H100v-54.2l24 54.2h14.6l24-54.2v54.2zM31.2 188.8l11.2-27.6 11.5 27.6zm477.4 158.9v-4.5c-10.8 5.6-3.9 4.5-156.7 4.5 0-25.2.1-23.9 0-25.2-1.7-.1-3.2-.1-9.4-.1 0 17.9-.1 6.8-.1 25.3h-39.6c0-12.1.1-15.3.1-29.2-10 6-22.8 6.4-34.3 6.2 0 14.7-.1 8.3-.1 23h-48.9c-5.1-5.7-2.7-3.1-15.4-17.4-3.2 3.5-12.8 13.9-16.1 17.4h-82v-92.3h83.1c5 5.6 2.8 3.1 15.5 17.2 3.2-3.5 12.2-13.4 15.7-17.2h58c9.8 0 18 1.9 24.3 5.6v-5.6c54.3 0 64.3-1.4 75.7 5.1v-5.1h78.2v5.2c11.4-6.9 19.6-5.2 64.9-5.2v5c10.3-5.9 16.6-5.2 54.3-5V80c0-26.5-21.5-48-48-48h-480c-26.5 0-48 21.5-48 48v109.8c9.4-21.9 19.7-46 23.1-53.9h39.7c4.3 10.1 1.6 3.7 9 21.1v-21.1h46c2.9 6.2 11.1 24 13.9 30 5.8-13.6 10.1-23.9 12.6-30h103c0-.1 11.5 0 11.6 0 43.7.2 53.6-.8 64.4 5.3v-5.3H363v9.3c7.6-6.1 17.9-9.3 30.7-9.3h27.6c0 .5 1.9.3 2.3.3H456c4.2 9.8 2.6 6 8.8 20.6v-20.6h43.3c4.9 8-1-1.8 11.2 18.4v-18.4h39.9v92h-41.6c-5.4-9-1.4-2.2-13.2-21.9v21.9h-52.8c-6.4-14.8-.1-.3-6.6-15.3h-19c-4.2 10-2.2 5.2-6.4 15.3h-26.8c-12.3 0-22.3-3-29.7-8.9v8.9h-66.5c-.3-13.9-.1-24.8-.1-24.8-1.8-.3-3.4-.2-9.8-.2v25.1H151.2v-11.4c-2.5 5.6-2.7 5.9-5.1 11.4h-29.5c-4-8.9-2.9-6.4-5.1-11.4v11.4H58.6c-4.2-10.1-2.2-5.3-6.4-15.3H33c-4.2 10-2.2 5.2-6.4 15.3H0V432c0 26.5 21.5 48 48 48h480.1c26.5 0 48-21.5 48-48v-90.4c-12.7 8.3-32.7 6.1-67.5 6.1zm36.3-64.5H575v-14.6h-32.9c-12.8 0-23.8 6.6-23.8 20.7 0 33 42.7 12.8 42.7 27.4 0 5.1-4.3 6.4-8.4 6.4h-32l-.1 14.8h32c8.4 0 17.6-1.8 22.5-8.9v-25.8c-10.5-13.8-39.3-1.3-39.3-13.5 0-5.8 4.6-6.5 9.2-6.5zm-57 39.8h-32.2l-.1 14.8h32.2c14.8 0 26.2-5.6 26.2-22 0-33.2-42.9-11.2-42.9-26.3 0-5.6 4.9-6.4 9.2-6.4h30.4v-14.6h-33.2c-12.8 0-23.5 6.6-23.5 20.7 0 33 42.7 12.5 42.7 27.4-.1 5.4-4.7 6.4-8.8 6.4zm-42.2-40.1v-14.3h-55.2l-.1 69.3h55.2l.1-14.3-38.6-.3v-13.8H445v-14.1h-37.8v-12.5zm-56.3-108.1c-.3.2-1.4 2.2-1.4 7.6 0 6 .9 7.7 1.1 7.9.2.1 1.1.5 3.4.5l7.3-16.9c-1.1 0-2.1-.1-3.1-.1-5.6 0-7 .7-7.3 1zm20.4-10.5h-.1zm-16.2-15.2c-23.5 0-34 12-34 35.3 0 22.2 10.2 34 33 34h19.2l6.4-15.3h34.3l6.6 15.3h33.7v-51.9l31.2 51.9h23.6v-69h-16.9v48.1l-29.1-48.1h-25.3v65.4l-27.9-65.4h-24.8l-23.5 54.5h-7.4c-13.3 0-16.1-8.1-16.1-19.9 0-23.8 15.7-20 33.1-19.7v-15.2zm42.1 12.1l11.2 27.6h-22.8zm-101.1-12v69.3h16.9v-69.3z"]
};
var faCcApplePay = {
  prefix: 'fab',
  iconName: 'cc-apple-pay',
  icon: [576, 512, [], "f416", "M302.2 218.4c0 17.2-10.5 27.1-29 27.1h-24.3v-54.2h24.4c18.4 0 28.9 9.8 28.9 27.1zm47.5 62.6c0 8.3 7.2 13.7 18.5 13.7 14.4 0 25.2-9.1 25.2-21.9v-7.7l-23.5 1.5c-13.3.9-20.2 5.8-20.2 14.4zM576 79v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V79c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM127.8 197.2c8.4.7 16.8-4.2 22.1-10.4 5.2-6.4 8.6-15 7.7-23.7-7.4.3-16.6 4.9-21.9 11.3-4.8 5.5-8.9 14.4-7.9 22.8zm60.6 74.5c-.2-.2-19.6-7.6-19.8-30-.2-18.7 15.3-27.7 16-28.2-8.8-13-22.4-14.4-27.1-14.7-12.2-.7-22.6 6.9-28.4 6.9-5.9 0-14.7-6.6-24.3-6.4-12.5.2-24.2 7.3-30.5 18.6-13.1 22.6-3.4 56 9.3 74.4 6.2 9.1 13.7 19.1 23.5 18.7 9.3-.4 13-6 24.2-6 11.3 0 14.5 6 24.3 5.9 10.2-.2 16.5-9.1 22.8-18.2 6.9-10.4 9.8-20.4 10-21zm135.4-53.4c0-26.6-18.5-44.8-44.9-44.8h-51.2v136.4h21.2v-46.6h29.3c26.8 0 45.6-18.4 45.6-45zm90 23.7c0-19.7-15.8-32.4-40-32.4-22.5 0-39.1 12.9-39.7 30.5h19.1c1.6-8.4 9.4-13.9 20-13.9 13 0 20.2 6 20.2 17.2v7.5l-26.4 1.6c-24.6 1.5-37.9 11.6-37.9 29.1 0 17.7 13.7 29.4 33.4 29.4 13.3 0 25.6-6.7 31.2-17.4h.4V310h19.6v-68zM516 210.9h-21.5l-24.9 80.6h-.4l-24.9-80.6H422l35.9 99.3-1.9 6c-3.2 10.2-8.5 14.2-17.9 14.2-1.7 0-4.9-.2-6.2-.3v16.4c1.2.4 6.5.5 8.1.5 20.7 0 30.4-7.9 38.9-31.8L516 210.9z"]
};
var faCcDinersClub = {
  prefix: 'fab',
  iconName: 'cc-diners-club',
  icon: [576, 512, [], "f24c", "M239.7 79.9c-96.9 0-175.8 78.6-175.8 175.8 0 96.9 78.9 175.8 175.8 175.8 97.2 0 175.8-78.9 175.8-175.8 0-97.2-78.6-175.8-175.8-175.8zm-39.9 279.6c-41.7-15.9-71.4-56.4-71.4-103.8s29.7-87.9 71.4-104.1v207.9zm79.8.3V151.6c41.7 16.2 71.4 56.7 71.4 104.1s-29.7 87.9-71.4 104.1zM528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM329.7 448h-90.3c-106.2 0-193.8-85.5-193.8-190.2C45.6 143.2 133.2 64 239.4 64h90.3c105 0 200.7 79.2 200.7 193.8 0 104.7-95.7 190.2-200.7 190.2z"]
};
var faCcDiscover = {
  prefix: 'fab',
  iconName: 'cc-discover',
  icon: [576, 512, [], "f1f2", "M520.4 196.1c0-7.9-5.5-12.1-15.6-12.1h-4.9v24.9h4.7c10.3 0 15.8-4.4 15.8-12.8zM528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-44.1 138.9c22.6 0 52.9-4.1 52.9 24.4 0 12.6-6.6 20.7-18.7 23.2l25.8 34.4h-19.6l-22.2-32.8h-2.2v32.8h-16zm-55.9.1h45.3v14H444v18.2h28.3V217H444v22.2h29.3V253H428zm-68.7 0l21.9 55.2 22.2-55.2h17.5l-35.5 84.2h-8.6l-35-84.2zm-55.9-3c24.7 0 44.6 20 44.6 44.6 0 24.7-20 44.6-44.6 44.6-24.7 0-44.6-20-44.6-44.6 0-24.7 20-44.6 44.6-44.6zm-49.3 6.1v19c-20.1-20.1-46.8-4.7-46.8 19 0 25 27.5 38.5 46.8 19.2v19c-29.7 14.3-63.3-5.7-63.3-38.2 0-31.2 33.1-53 63.3-38zm-97.2 66.3c11.4 0 22.4-15.3-3.3-24.4-15-5.5-20.2-11.4-20.2-22.7 0-23.2 30.6-31.4 49.7-14.3l-8.4 10.8c-10.4-11.6-24.9-6.2-24.9 2.5 0 4.4 2.7 6.9 12.3 10.3 18.2 6.6 23.6 12.5 23.6 25.6 0 29.5-38.8 37.4-56.6 11.3l10.3-9.9c3.7 7.1 9.9 10.8 17.5 10.8zM55.4 253H32v-82h23.4c26.1 0 44.1 17 44.1 41.1 0 18.5-13.2 40.9-44.1 40.9zm67.5 0h-16v-82h16zM544 433c0 8.2-6.8 15-15 15H128c189.6-35.6 382.7-139.2 416-160zM74.1 191.6c-5.2-4.9-11.6-6.6-21.9-6.6H48v54.2h4.2c10.3 0 17-2 21.9-6.4 5.7-5.2 8.9-12.8 8.9-20.7s-3.2-15.5-8.9-20.5z"]
};
var faCcJcb = {
  prefix: 'fab',
  iconName: 'cc-jcb',
  icon: [576, 512, [], "f24b", "M431.5 244.3V212c41.2 0 38.5.2 38.5.2 7.3 1.3 13.3 7.3 13.3 16 0 8.8-6 14.5-13.3 15.8-1.2.4-3.3.3-38.5.3zm42.8 20.2c-2.8-.7-3.3-.5-42.8-.5v35c39.6 0 40 .2 42.8-.5 7.5-1.5 13.5-8 13.5-17 0-8.7-6-15.5-13.5-17zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM182 192.3h-57c0 67.1 10.7 109.7-35.8 109.7-19.5 0-38.8-5.7-57.2-14.8v28c30 8.3 68 8.3 68 8.3 97.9 0 82-47.7 82-131.2zm178.5 4.5c-63.4-16-165-14.9-165 59.3 0 77.1 108.2 73.6 165 59.2V287C312.9 311.7 253 309 253 256s59.8-55.6 107.5-31.2v-28zM544 286.5c0-18.5-16.5-30.5-38-32v-.8c19.5-2.7 30.3-15.5 30.3-30.2 0-19-15.7-30-37-31 0 0 6.3-.3-120.3-.3v127.5h122.7c24.3.1 42.3-12.9 42.3-33.2z"]
};
var faCcMastercard = {
  prefix: 'fab',
  iconName: 'cc-mastercard',
  icon: [576, 512, [], "f1f1", "M482.9 410.3c0 6.8-4.6 11.7-11.2 11.7-6.8 0-11.2-5.2-11.2-11.7 0-6.5 4.4-11.7 11.2-11.7 6.6 0 11.2 5.2 11.2 11.7zm-310.8-11.7c-7.1 0-11.2 5.2-11.2 11.7 0 6.5 4.1 11.7 11.2 11.7 6.5 0 10.9-4.9 10.9-11.7-.1-6.5-4.4-11.7-10.9-11.7zm117.5-.3c-5.4 0-8.7 3.5-9.5 8.7h19.1c-.9-5.7-4.4-8.7-9.6-8.7zm107.8.3c-6.8 0-10.9 5.2-10.9 11.7 0 6.5 4.1 11.7 10.9 11.7 6.8 0 11.2-4.9 11.2-11.7 0-6.5-4.4-11.7-11.2-11.7zm105.9 26.1c0 .3.3.5.3 1.1 0 .3-.3.5-.3 1.1-.3.3-.3.5-.5.8-.3.3-.5.5-1.1.5-.3.3-.5.3-1.1.3-.3 0-.5 0-1.1-.3-.3 0-.5-.3-.8-.5-.3-.3-.5-.5-.5-.8-.3-.5-.3-.8-.3-1.1 0-.5 0-.8.3-1.1 0-.5.3-.8.5-1.1.3-.3.5-.3.8-.5.5-.3.8-.3 1.1-.3.5 0 .8 0 1.1.3.5.3.8.3 1.1.5s.2.6.5 1.1zm-2.2 1.4c.5 0 .5-.3.8-.3.3-.3.3-.5.3-.8 0-.3 0-.5-.3-.8-.3 0-.5-.3-1.1-.3h-1.6v3.5h.8V426h.3l1.1 1.4h.8l-1.1-1.3zM576 81v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V81c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM64 220.6c0 76.5 62.1 138.5 138.5 138.5 27.2 0 53.9-8.2 76.5-23.1-72.9-59.3-72.4-171.2 0-230.5-22.6-15-49.3-23.1-76.5-23.1-76.4-.1-138.5 62-138.5 138.2zm224 108.8c70.5-55 70.2-162.2 0-217.5-70.2 55.3-70.5 162.6 0 217.5zm-142.3 76.3c0-8.7-5.7-14.4-14.7-14.7-4.6 0-9.5 1.4-12.8 6.5-2.4-4.1-6.5-6.5-12.2-6.5-3.8 0-7.6 1.4-10.6 5.4V392h-8.2v36.7h8.2c0-18.9-2.5-30.2 9-30.2 10.2 0 8.2 10.2 8.2 30.2h7.9c0-18.3-2.5-30.2 9-30.2 10.2 0 8.2 10 8.2 30.2h8.2v-23zm44.9-13.7h-7.9v4.4c-2.7-3.3-6.5-5.4-11.7-5.4-10.3 0-18.2 8.2-18.2 19.3 0 11.2 7.9 19.3 18.2 19.3 5.2 0 9-1.9 11.7-5.4v4.6h7.9V392zm40.5 25.6c0-15-22.9-8.2-22.9-15.2 0-5.7 11.9-4.8 18.5-1.1l3.3-6.5c-9.4-6.1-30.2-6-30.2 8.2 0 14.3 22.9 8.3 22.9 15 0 6.3-13.5 5.8-20.7.8l-3.5 6.3c11.2 7.6 32.6 6 32.6-7.5zm35.4 9.3l-2.2-6.8c-3.8 2.1-12.2 4.4-12.2-4.1v-16.6h13.1V392h-13.1v-11.2h-8.2V392h-7.6v7.3h7.6V416c0 17.6 17.3 14.4 22.6 10.9zm13.3-13.4h27.5c0-16.2-7.4-22.6-17.4-22.6-10.6 0-18.2 7.9-18.2 19.3 0 20.5 22.6 23.9 33.8 14.2l-3.8-6c-7.8 6.4-19.6 5.8-21.9-4.9zm59.1-21.5c-4.6-2-11.6-1.8-15.2 4.4V392h-8.2v36.7h8.2V408c0-11.6 9.5-10.1 12.8-8.4l2.4-7.6zm10.6 18.3c0-11.4 11.6-15.1 20.7-8.4l3.8-6.5c-11.6-9.1-32.7-4.1-32.7 15 0 19.8 22.4 23.8 32.7 15l-3.8-6.5c-9.2 6.5-20.7 2.6-20.7-8.6zm66.7-18.3H408v4.4c-8.3-11-29.9-4.8-29.9 13.9 0 19.2 22.4 24.7 29.9 13.9v4.6h8.2V392zm33.7 0c-2.4-1.2-11-2.9-15.2 4.4V392h-7.9v36.7h7.9V408c0-11 9-10.3 12.8-8.4l2.4-7.6zm40.3-14.9h-7.9v19.3c-8.2-10.9-29.9-5.1-29.9 13.9 0 19.4 22.5 24.6 29.9 13.9v4.6h7.9v-51.7zm7.6-75.1v4.6h.8V302h1.9v-.8h-4.6v.8h1.9zm6.6 123.8c0-.5 0-1.1-.3-1.6-.3-.3-.5-.8-.8-1.1-.3-.3-.8-.5-1.1-.8-.5 0-1.1-.3-1.6-.3-.3 0-.8.3-1.4.3-.5.3-.8.5-1.1.8-.5.3-.8.8-.8 1.1-.3.5-.3 1.1-.3 1.6 0 .3 0 .8.3 1.4 0 .3.3.8.8 1.1.3.3.5.5 1.1.8.5.3 1.1.3 1.4.3.5 0 1.1 0 1.6-.3.3-.3.8-.5 1.1-.8.3-.3.5-.8.8-1.1.3-.6.3-1.1.3-1.4zm3.2-124.7h-1.4l-1.6 3.5-1.6-3.5h-1.4v5.4h.8v-4.1l1.6 3.5h1.1l1.4-3.5v4.1h1.1v-5.4zm4.4-80.5c0-76.2-62.1-138.3-138.5-138.3-27.2 0-53.9 8.2-76.5 23.1 72.1 59.3 73.2 171.5 0 230.5 22.6 15 49.5 23.1 76.5 23.1 76.4.1 138.5-61.9 138.5-138.4z"]
};
var faCcPaypal = {
  prefix: 'fab',
  iconName: 'cc-paypal',
  icon: [576, 512, [], "f1f4", "M186.3 258.2c0 12.2-9.7 21.5-22 21.5-9.2 0-16-5.2-16-15 0-12.2 9.5-22 21.7-22 9.3 0 16.3 5.7 16.3 15.5zM80.5 209.7h-4.7c-1.5 0-3 1-3.2 2.7l-4.3 26.7 8.2-.3c11 0 19.5-1.5 21.5-14.2 2.3-13.4-6.2-14.9-17.5-14.9zm284 0H360c-1.8 0-3 1-3.2 2.7l-4.2 26.7 8-.3c13 0 22-3 22-18-.1-10.6-9.6-11.1-18.1-11.1zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM128.3 215.4c0-21-16.2-28-34.7-28h-40c-2.5 0-5 2-5.2 4.7L32 294.2c-.3 2 1.2 4 3.2 4h19c2.7 0 5.2-2.9 5.5-5.7l4.5-26.6c1-7.2 13.2-4.7 18-4.7 28.6 0 46.1-17 46.1-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.2 8.2-5.8-8.5-14.2-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9 0 20.2-4.9 26.5-11.9-.5 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H200c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm40.5 97.9l63.7-92.6c.5-.5.5-1 .5-1.7 0-1.7-1.5-3.5-3.2-3.5h-19.2c-1.7 0-3.5 1-4.5 2.5l-26.5 39-11-37.5c-.8-2.2-3-4-5.5-4h-18.7c-1.7 0-3.2 1.8-3.2 3.5 0 1.2 19.5 56.8 21.2 62.1-2.7 3.8-20.5 28.6-20.5 31.6 0 1.8 1.5 3.2 3.2 3.2h19.2c1.8-.1 3.5-1.1 4.5-2.6zm159.3-106.7c0-21-16.2-28-34.7-28h-39.7c-2.7 0-5.2 2-5.5 4.7l-16.2 102c-.2 2 1.3 4 3.2 4h20.5c2 0 3.5-1.5 4-3.2l4.5-29c1-7.2 13.2-4.7 18-4.7 28.4 0 45.9-17 45.9-45.8zm84.2 8.8h-19c-3.8 0-4 5.5-4.3 8.2-5.5-8.5-14-10-23.7-10-24.5 0-43.2 21.5-43.2 45.2 0 19.5 12.2 32.2 31.7 32.2 9.3 0 20.5-4.9 26.5-11.9-.3 1.5-1 4.7-1 6.2 0 2.3 1 4 3.2 4H484c2.7 0 5-2.9 5.5-5.7l10.2-64.3c.3-1.9-1.2-3.9-3.2-3.9zm47.5-33.3c0-2-1.5-3.5-3.2-3.5h-18.5c-1.5 0-3 1.2-3.2 2.7l-16.2 104-.3.5c0 1.8 1.5 3.5 3.5 3.5h16.5c2.5 0 5-2.9 5.2-5.7L544 191.2v-.3zm-90 51.8c-12.2 0-21.7 9.7-21.7 22 0 9.7 7 15 16.2 15 12 0 21.7-9.2 21.7-21.5.1-9.8-6.9-15.5-16.2-15.5z"]
};
var faCcStripe = {
  prefix: 'fab',
  iconName: 'cc-stripe',
  icon: [576, 512, [], "f1f5", "M492.4 220.8c-8.9 0-18.7 6.7-18.7 22.7h36.7c0-16-9.3-22.7-18-22.7zM375 223.4c-8.2 0-13.3 2.9-17 7l.2 52.8c3.5 3.7 8.5 6.7 16.8 6.7 13.1 0 21.9-14.3 21.9-33.4 0-18.6-9-33.2-21.9-33.1zM528 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h480c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM122.2 281.1c0 25.6-20.3 40.1-49.9 40.3-12.2 0-25.6-2.4-38.8-8.1v-33.9c12 6.4 27.1 11.3 38.9 11.3 7.9 0 13.6-2.1 13.6-8.7 0-17-54-10.6-54-49.9 0-25.2 19.2-40.2 48-40.2 11.8 0 23.5 1.8 35.3 6.5v33.4c-10.8-5.8-24.5-9.1-35.3-9.1-7.5 0-12.1 2.2-12.1 7.7 0 16 54.3 8.4 54.3 50.7zm68.8-56.6h-27V275c0 20.9 22.5 14.4 27 12.6v28.9c-4.7 2.6-13.3 4.7-24.9 4.7-21.1 0-36.9-15.5-36.9-36.5l.2-113.9 34.7-7.4v30.8H191zm74 2.4c-4.5-1.5-18.7-3.6-27.1 7.4v84.4h-35.5V194.2h30.7l2.2 10.5c8.3-15.3 24.9-12.2 29.6-10.5h.1zm44.1 91.8h-35.7V194.2h35.7zm0-142.9l-35.7 7.6v-28.9l35.7-7.6zm74.1 145.5c-12.4 0-20-5.3-25.1-9l-.1 40.2-35.5 7.5V194.2h31.3l1.8 8.8c4.9-4.5 13.9-11.1 27.8-11.1 24.9 0 48.4 22.5 48.4 63.8 0 45.1-23.2 65.5-48.6 65.6zm160.4-51.5h-69.5c1.6 16.6 13.8 21.5 27.6 21.5 14.1 0 25.2-3 34.9-7.9V312c-9.7 5.3-22.4 9.2-39.4 9.2-34.6 0-58.8-21.7-58.8-64.5 0-36.2 20.5-64.9 54.3-64.9 33.7 0 51.3 28.7 51.3 65.1 0 3.5-.3 10.9-.4 12.9z"]
};
var faCcVisa = {
  prefix: 'fab',
  iconName: 'cc-visa',
  icon: [576, 512, [], "f1f0", "M470.1 231.3s7.6 37.2 9.3 45H446c3.3-8.9 16-43.5 16-43.5-.2.3 3.3-9.1 5.3-14.9l2.8 13.4zM576 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h480c26.5 0 48 21.5 48 48zM152.5 331.2L215.7 176h-42.5l-39.3 106-4.3-21.5-14-71.4c-2.3-9.9-9.4-12.7-18.2-13.1H32.7l-.7 3.1c15.8 4 29.9 9.8 42.2 17.1l35.8 135h42.5zm94.4.2L272.1 176h-40.2l-25.1 155.4h40.1zm139.9-50.8c.2-17.7-10.6-31.2-33.7-42.3-14.1-7.1-22.7-11.9-22.7-19.2.2-6.6 7.3-13.4 23.1-13.4 13.1-.3 22.7 2.8 29.9 5.9l3.6 1.7 5.5-33.6c-7.9-3.1-20.5-6.6-36-6.6-39.7 0-67.6 21.2-67.8 51.4-.3 22.3 20 34.7 35.2 42.2 15.5 7.6 20.8 12.6 20.8 19.3-.2 10.4-12.6 15.2-24.1 15.2-16 0-24.6-2.5-37.7-8.3l-5.3-2.5-5.6 34.9c9.4 4.3 26.8 8.1 44.8 8.3 42.2.1 69.7-20.8 70-53zM528 331.4L495.6 176h-31.1c-9.6 0-16.9 2.8-21 12.9l-59.7 142.5H426s6.9-19.2 8.4-23.3H486c1.2 5.5 4.8 23.3 4.8 23.3H528z"]
};
var faCentercode = {
  prefix: 'fab',
  iconName: 'centercode',
  icon: [512, 512, [], "f380", "M329.2 268.6c-3.8 35.2-35.4 60.6-70.6 56.8-35.2-3.8-60.6-35.4-56.8-70.6 3.8-35.2 35.4-60.6 70.6-56.8 35.1 3.8 60.6 35.4 56.8 70.6zm-85.8 235.1C96.7 496-8.2 365.5 10.1 224.3c11.2-86.6 65.8-156.9 139.1-192 161-77.1 349.7 37.4 354.7 216.6 4.1 147-118.4 262.2-260.5 254.8zm179.9-180c27.9-118-160.5-205.9-237.2-234.2-57.5 56.3-69.1 188.6-33.8 344.4 68.8 15.8 169.1-26.4 271-110.2z"]
};
var faCentos = {
  prefix: 'fab',
  iconName: 'centos',
  icon: [448, 512, [], "f789", "M289.6 97.5l31.6 31.7-76.3 76.5V97.5zm-162.4 31.7l76.3 76.5V97.5h-44.7zm41.5-41.6h44.7v127.9l10.8 10.8 10.8-10.8V87.6h44.7L224.2 32zm26.2 168.1l-10.8-10.8H55.5v-44.8L0 255.7l55.5 55.6v-44.8h128.6l10.8-10.8zm79.3-20.7h107.9v-44.8l-31.6-31.7zm173.3 20.7L392 200.1v44.8H264.3l-10.8 10.8 10.8 10.8H392v44.8l55.5-55.6zM65.4 176.2l32.5-31.7 90.3 90.5h15.3v-15.3l-90.3-90.5 31.6-31.7H65.4zm316.7-78.7h-78.5l31.6 31.7-90.3 90.5V235h15.3l90.3-90.5 31.6 31.7zM203.5 413.9V305.8l-76.3 76.5 31.6 31.7h44.7zM65.4 235h108.8l-76.3-76.5-32.5 31.7zm316.7 100.2l-31.6 31.7-90.3-90.5h-15.3v15.3l90.3 90.5-31.6 31.7h78.5zm0-58.8H274.2l76.3 76.5 31.6-31.7zm-60.9 105.8l-76.3-76.5v108.1h44.7zM97.9 352.9l76.3-76.5H65.4v44.8zm181.8 70.9H235V295.9l-10.8-10.8-10.8 10.8v127.9h-44.7l55.5 55.6zm-166.5-41.6l90.3-90.5v-15.3h-15.3l-90.3 90.5-32.5-31.7v78.7h79.4z"]
};
var faChrome = {
  prefix: 'fab',
  iconName: 'chrome',
  icon: [496, 512, [], "f268", "M131.5 217.5L55.1 100.1c47.6-59.2 119-91.8 192-92.1 42.3-.3 85.5 10.5 124.8 33.2 43.4 25.2 76.4 61.4 97.4 103L264 133.4c-58.1-3.4-113.4 29.3-132.5 84.1zm32.9 38.5c0 46.2 37.4 83.6 83.6 83.6s83.6-37.4 83.6-83.6-37.4-83.6-83.6-83.6-83.6 37.3-83.6 83.6zm314.9-89.2L339.6 174c37.9 44.3 38.5 108.2 6.6 157.2L234.1 503.6c46.5 2.5 94.4-7.7 137.8-32.9 107.4-62 150.9-192 107.4-303.9zM133.7 303.6L40.4 120.1C14.9 159.1 0 205.9 0 256c0 124 90.8 226.7 209.5 244.9l63.7-124.8c-57.6 10.8-113.2-20.8-139.5-72.5z"]
};
var faChromecast = {
  prefix: 'fab',
  iconName: 'chromecast',
  icon: [512, 512, [], "f838", "M447.83 64H64a42.72 42.72 0 0 0-42.72 42.72v63.92H64v-63.92h383.83v298.56H298.64V448H448a42.72 42.72 0 0 0 42.72-42.72V106.72A42.72 42.72 0 0 0 448 64zM21.28 383.58v63.92h63.91a63.91 63.91 0 0 0-63.91-63.92zm0-85.28V341a106.63 106.63 0 0 1 106.64 106.66v.34h42.72a149.19 149.19 0 0 0-149-149.36h-.33zm0-85.27v42.72c106-.1 192 85.75 192.08 191.75v.5h42.72c-.46-129.46-105.34-234.27-234.8-234.64z"]
};
var faCloudscale = {
  prefix: 'fab',
  iconName: 'cloudscale',
  icon: [448, 512, [], "f383", "M318.1 154l-9.4 7.6c-22.5-19.3-51.5-33.6-83.3-33.6C153.8 128 96 188.8 96 260.3c0 6.6.4 13.1 1.4 19.4-2-56 41.8-97.4 92.6-97.4 24.2 0 46.2 9.4 62.6 24.7l-25.2 20.4c-8.3-.9-16.8 1.8-23.1 8.1-11.1 11-11.1 28.9 0 40 11.1 11 28.9 11 40 0 6.3-6.3 9-14.9 8.1-23.1l75.2-88.8c6.3-6.5-3.3-15.9-9.5-9.6zm-83.8 111.5c-5.6 5.5-14.6 5.5-20.2 0-5.6-5.6-5.6-14.6 0-20.2s14.6-5.6 20.2 0 5.6 14.7 0 20.2zM224 32C100.5 32 0 132.5 0 256s100.5 224 224 224 224-100.5 224-224S347.5 32 224 32zm0 384c-88.2 0-160-71.8-160-160S135.8 96 224 96s160 71.8 160 160-71.8 160-160 160z"]
};
var faCloudsmith = {
  prefix: 'fab',
  iconName: 'cloudsmith',
  icon: [332, 512, [], "f384", "M332.5 419.9c0 46.4-37.6 84.1-84 84.1s-84-37.7-84-84.1 37.6-84 84-84 84 37.6 84 84zm-84-243.9c46.4 0 80-37.6 80-84s-33.6-84-80-84-88 37.6-88 84-29.6 76-76 76-84 41.6-84 88 37.6 80 84 80 84-33.6 84-80 33.6-80 80-80z"]
};
var faCloudversify = {
  prefix: 'fab',
  iconName: 'cloudversify',
  icon: [616, 512, [], "f385", "M148.6 304c8.2 68.5 67.4 115.5 146 111.3 51.2 43.3 136.8 45.8 186.4-5.6 69.2 1.1 118.5-44.6 131.5-99.5 14.8-62.5-18.2-132.5-92.1-155.1-33-88.1-131.4-101.5-186.5-85-57.3 17.3-84.3 53.2-99.3 109.7-7.8 2.7-26.5 8.9-45 24.1 11.7 0 15.2 8.9 15.2 19.5v20.4c0 10.7-8.7 19.5-19.5 19.5h-20.2c-10.7 0-19.5-6-19.5-16.7V240H98.8C95 240 88 244.3 88 251.9v40.4c0 6.4 5.3 11.8 11.7 11.8h48.9zm227.4 8c-10.7 46.3 21.7 72.4 55.3 86.8C324.1 432.6 259.7 348 296 288c-33.2 21.6-33.7 71.2-29.2 92.9-17.9-12.4-53.8-32.4-57.4-79.8-3-39.9 21.5-75.7 57-93.9C297 191.4 369.9 198.7 400 248c-14.1-48-53.8-70.1-101.8-74.8 30.9-30.7 64.4-50.3 114.2-43.7 69.8 9.3 133.2 82.8 67.7 150.5 35-16.3 48.7-54.4 47.5-76.9l10.5 19.6c11.8 22 15.2 47.6 9.4 72-9.2 39-40.6 68.8-79.7 76.5-32.1 6.3-83.1-5.1-91.8-59.2zM128 208H88.2c-8.9 0-16.2-7.3-16.2-16.2v-39.6c0-8.9 7.3-16.2 16.2-16.2H128c8.9 0 16.2 7.3 16.2 16.2v39.6c0 8.9-7.3 16.2-16.2 16.2zM10.1 168C4.5 168 0 163.5 0 157.9v-27.8c0-5.6 4.5-10.1 10.1-10.1h27.7c5.5 0 10.1 4.5 10.1 10.1v27.8c0 5.6-4.5 10.1-10.1 10.1H10.1zM168 142.7v-21.4c0-5.1 4.2-9.3 9.3-9.3h21.4c5.1 0 9.3 4.2 9.3 9.3v21.4c0 5.1-4.2 9.3-9.3 9.3h-21.4c-5.1 0-9.3-4.2-9.3-9.3zM56 235.5v25c0 6.3-5.1 11.5-11.4 11.5H19.4C13.1 272 8 266.8 8 260.5v-25c0-6.3 5.1-11.5 11.4-11.5h25.1c6.4 0 11.5 5.2 11.5 11.5z"]
};
var faCodepen = {
  prefix: 'fab',
  iconName: 'codepen',
  icon: [512, 512, [], "f1cb", "M502.285 159.704l-234-156c-7.987-4.915-16.511-4.96-24.571 0l-234 156C3.714 163.703 0 170.847 0 177.989v155.999c0 7.143 3.714 14.286 9.715 18.286l234 156.022c7.987 4.915 16.511 4.96 24.571 0l234-156.022c6-3.999 9.715-11.143 9.715-18.286V177.989c-.001-7.142-3.715-14.286-9.716-18.285zM278 63.131l172.286 114.858-76.857 51.429L278 165.703V63.131zm-44 0v102.572l-95.429 63.715-76.857-51.429L234 63.131zM44 219.132l55.143 36.857L44 292.846v-73.714zm190 229.715L61.714 333.989l76.857-51.429L234 346.275v102.572zm22-140.858l-77.715-52 77.715-52 77.715 52-77.715 52zm22 140.858V346.275l95.429-63.715 76.857 51.429L278 448.847zm190-156.001l-55.143-36.857L468 219.132v73.714z"]
};
var faCodiepie = {
  prefix: 'fab',
  iconName: 'codiepie',
  icon: [472, 512, [], "f284", "M422.5 202.9c30.7 0 33.5 53.1-.3 53.1h-10.8v44.3h-26.6v-97.4h37.7zM472 352.6C429.9 444.5 350.4 504 248 504 111 504 0 393 0 256S111 8 248 8c97.4 0 172.8 53.7 218.2 138.4l-186 108.8L472 352.6zm-38.5 12.5l-60.3-30.7c-27.1 44.3-70.4 71.4-122.4 71.4-82.5 0-149.2-66.7-149.2-148.9 0-82.5 66.7-149.2 149.2-149.2 48.4 0 88.9 23.5 116.9 63.4l59.5-34.6c-40.7-62.6-104.7-100-179.2-100-121.2 0-219.5 98.3-219.5 219.5S126.8 475.5 248 475.5c78.6 0 146.5-42.1 185.5-110.4z"]
};
var faConfluence = {
  prefix: 'fab',
  iconName: 'confluence',
  icon: [512, 512, [], "f78d", "M2.3 412.2c-4.5 7.6-2.1 17.5 5.5 22.2l105.9 65.2c7.7 4.7 17.7 2.4 22.4-5.3 0-.1.1-.2.1-.2 67.1-112.2 80.5-95.9 280.9-.7 8.1 3.9 17.8.4 21.7-7.7.1-.1.1-.3.2-.4l50.4-114.1c3.6-8.1-.1-17.6-8.1-21.3-22.2-10.4-66.2-31.2-105.9-50.3C127.5 179 44.6 345.3 2.3 412.2zm507.4-312.1c4.5-7.6 2.1-17.5-5.5-22.2L398.4 12.8c-7.5-5-17.6-3.1-22.6 4.4-.2.3-.4.6-.6 1-67.3 112.6-81.1 95.6-280.6.9-8.1-3.9-17.8-.4-21.7 7.7-.1.1-.1.3-.2.4L22.2 141.3c-3.6 8.1.1 17.6 8.1 21.3 22.2 10.4 66.3 31.2 106 50.4 248 120 330.8-45.4 373.4-112.9z"]
};
var faConnectdevelop = {
  prefix: 'fab',
  iconName: 'connectdevelop',
  icon: [576, 512, [], "f20e", "M550.5 241l-50.089-86.786c1.071-2.142 1.875-4.553 1.875-7.232 0-8.036-6.696-14.733-14.732-15.001l-55.447-95.893c.536-1.607 1.071-3.214 1.071-4.821 0-8.571-6.964-15.268-15.268-15.268-4.821 0-8.839 2.143-11.786 5.625H299.518C296.839 18.143 292.821 16 288 16s-8.839 2.143-11.518 5.625H170.411C167.464 18.143 163.447 16 158.625 16c-8.303 0-15.268 6.696-15.268 15.268 0 1.607.536 3.482 1.072 4.821l-55.983 97.233c-5.356 2.41-9.107 7.5-9.107 13.661 0 .535.268 1.071.268 1.607l-53.304 92.143c-7.232 1.339-12.59 7.5-12.59 15 0 7.232 5.089 13.393 12.054 15l55.179 95.358c-.536 1.607-.804 2.946-.804 4.821 0 7.232 5.089 13.393 12.054 14.732l51.697 89.732c-.536 1.607-1.071 3.482-1.071 5.357 0 8.571 6.964 15.268 15.268 15.268 4.821 0 8.839-2.143 11.518-5.357h106.875C279.161 493.857 283.447 496 288 496s8.839-2.143 11.518-5.357h107.143c2.678 2.946 6.696 4.821 10.982 4.821 8.571 0 15.268-6.964 15.268-15.268 0-1.607-.267-2.946-.803-4.285l51.697-90.268c6.964-1.339 12.054-7.5 12.054-14.732 0-1.607-.268-3.214-.804-4.821l54.911-95.358c6.964-1.339 12.322-7.5 12.322-15-.002-7.232-5.092-13.393-11.788-14.732zM153.535 450.732l-43.66-75.803h43.66v75.803zm0-83.839h-43.66c-.268-1.071-.804-2.142-1.339-3.214l44.999-47.41v50.624zm0-62.411l-50.357 53.304c-1.339-.536-2.679-1.34-4.018-1.607L43.447 259.75c.535-1.339.535-2.679.535-4.018s0-2.41-.268-3.482l51.965-90c2.679-.268 5.357-1.072 7.768-2.679l50.089 51.965v92.946zm0-102.322l-45.803-47.41c1.339-2.143 2.143-4.821 2.143-7.767 0-.268-.268-.804-.268-1.072l43.928-15.804v72.053zm0-80.625l-43.66 15.804 43.66-75.536v59.732zm326.519 39.108l.804 1.339L445.5 329.125l-63.75-67.232 98.036-101.518.268.268zM291.75 355.107l11.518 11.786H280.5l11.25-11.786zm-.268-11.25l-83.303-85.446 79.553-84.375 83.036 87.589-79.286 82.232zm5.357 5.893l79.286-82.232 67.5 71.25-5.892 28.125H313.714l-16.875-17.143zM410.411 44.393c1.071.536 2.142 1.072 3.482 1.34l57.857 100.714v.536c0 2.946.803 5.624 2.143 7.767L376.393 256l-83.035-87.589L410.411 44.393zm-9.107-2.143L287.732 162.518l-57.054-60.268 166.339-60h4.287zm-123.483 0c2.678 2.678 6.16 4.285 10.179 4.285s7.5-1.607 10.179-4.285h75L224.786 95.821 173.893 42.25h103.928zm-116.249 5.625l1.071-2.142a33.834 33.834 0 0 0 2.679-.804l51.161 53.84-54.911 19.821V47.875zm0 79.286l60.803-21.964 59.732 63.214-79.553 84.107-40.982-42.053v-83.304zm0 92.678L198 257.607l-36.428 38.304v-76.072zm0 87.858l42.053-44.464 82.768 85.982-17.143 17.678H161.572v-59.196zm6.964 162.053c-1.607-1.607-3.482-2.678-5.893-3.482l-1.071-1.607v-89.732h99.91l-91.607 94.821h-1.339zm129.911 0c-2.679-2.41-6.428-4.285-10.447-4.285s-7.767 1.875-10.447 4.285h-96.429l91.607-94.821h38.304l91.607 94.821H298.447zm120-11.786l-4.286 7.5c-1.339.268-2.41.803-3.482 1.339l-89.196-91.875h114.376l-17.412 83.036zm12.856-22.232l12.858-60.803h21.964l-34.822 60.803zm34.822-68.839h-20.357l4.553-21.16 17.143 18.214c-.535.803-1.071 1.874-1.339 2.946zm66.161-107.411l-55.447 96.697c-1.339.535-2.679 1.071-4.018 1.874l-20.625-21.964 34.554-163.928 45.803 79.286c-.267 1.339-.803 2.678-.803 4.285 0 1.339.268 2.411.536 3.75z"]
};
var faContao = {
  prefix: 'fab',
  iconName: 'contao',
  icon: [512, 512, [], "f26d", "M45.4 305c14.4 67.1 26.4 129 68.2 175H34c-18.7 0-34-15.2-34-34V66c0-18.7 15.2-34 34-34h57.7C77.9 44.6 65.6 59.2 54.8 75.6c-45.4 70-27 146.8-9.4 229.4zM478 32h-90.2c21.4 21.4 39.2 49.5 52.7 84.1l-137.1 29.3c-14.9-29-37.8-53.3-82.6-43.9-24.6 5.3-41 19.3-48.3 34.6-8.8 18.7-13.2 39.8 8.2 140.3 21.1 100.2 33.7 117.7 49.5 131.2 12.9 11.1 33.4 17 58.3 11.7 44.5-9.4 55.7-40.7 57.4-73.2l137.4-29.6c3.2 71.5-18.7 125.2-57.4 163.6H478c18.7 0 34-15.2 34-34V66c0-18.8-15.2-34-34-34z"]
};
var faCottonBureau = {
  prefix: 'fab',
  iconName: 'cotton-bureau',
  icon: [512, 512, [], "f89e", "M474.31 330.41c-23.66 91.85-94.23 144.59-201.9 148.35V429.6c0-48 26.41-74.39 74.39-74.39 62 0 99.2-37.2 99.2-99.21 0-61.37-36.53-98.28-97.38-99.06-33-69.32-146.5-64.65-177.24 0C110.52 157.72 74 194.63 74 256c0 62.13 37.27 99.41 99.4 99.41 48 0 74.55 26.23 74.55 74.39V479c-134.43-5-211.1-85.07-211.1-223 0-141.82 81.35-223.2 223.2-223.2 114.77 0 189.84 53.2 214.69 148.81H500C473.88 71.51 388.22 8 259.82 8 105 8 12 101.19 12 255.82 12 411.14 105.19 504.34 259.82 504c128.27 0 213.87-63.81 239.67-173.59zM357 182.33c41.37 3.45 64.2 29 64.2 73.67 0 48-26.43 74.41-74.4 74.41-28.61 0-49.33-9.59-61.59-27.33 83.06-16.55 75.59-99.67 71.79-120.75zm-81.68 97.36c-2.46-10.34-16.33-87 56.23-97 2.27 10.09 16.52 87.11-56.26 97zM260 132c28.61 0 49 9.67 61.44 27.61-28.36 5.48-49.36 20.59-61.59 43.45-12.23-22.86-33.23-38-61.6-43.45 12.41-17.69 33.27-27.35 61.57-27.35zm-71.52 50.72c73.17 10.57 58.91 86.81 56.49 97-72.41-9.84-59-86.95-56.25-97zM173.2 330.41c-48 0-74.4-26.4-74.4-74.41 0-44.36 22.86-70 64.22-73.67-6.75 37.2-1.38 106.53 71.65 120.75-12.14 17.63-32.84 27.3-61.14 27.3zm53.21 12.39A80.8 80.8 0 0 0 260 309.25c7.77 14.49 19.33 25.54 33.82 33.55a80.28 80.28 0 0 0-33.58 33.83c-8-14.5-19.07-26.23-33.56-33.83z"]
};
var faCpanel = {
  prefix: 'fab',
  iconName: 'cpanel',
  icon: [640, 512, [], "f388", "M210.3 220.2c-5.6-24.8-26.9-41.2-51-41.2h-37c-7.1 0-12.5 4.5-14.3 10.9L73.1 320l24.7-.1c6.8 0 12.3-4.5 14.2-10.7l25.8-95.7h19.8c8.4 0 16.2 5.6 18.3 14.8 2.5 10.9-5.9 22.6-18.3 22.6h-10.3c-7 0-12.5 4.6-14.3 10.8l-6.4 23.8h32c37.2 0 58.3-36.2 51.7-65.3zm-156.5 28h18.6c6.9 0 12.4-4.4 14.3-10.9l6.2-23.6h-40C30 213.7 9 227.8 1.7 254.8-7 288.6 18.5 320 52 320h12.4l7.1-26.1c1.2-4.4-2.2-8.3-6.4-8.3H53.8c-24.7 0-24.9-37.4 0-37.4zm247.5-34.8h-77.9l-3.5 13.4c-2.4 9.6 4.5 18.5 14.2 18.5h57.5c4 0 2.4 4.3 2.1 5.3l-8.6 31.8c-.4 1.4-.9 5.3-5.5 5.3h-34.9c-5.3 0-5.3-7.9 0-7.9h21.6c6.8 0 12.3-4.6 14.2-10.8l3.5-13.2h-48.4c-39.2 0-43.6 63.8-.7 63.8l57.5.2c11.2 0 20.6-7.2 23.4-17.8l14-51.8c4.8-19.2-9.7-36.8-28.5-36.8zM633.1 179h-18.9c-4.9 0-9.2 3.2-10.4 7.9L568.2 320c20.7 0 39.8-13.8 44.9-34.5l26.5-98.2c1.2-4.3-2-8.3-6.5-8.3zm-236.3 34.7v.1h-48.3l-26.2 98c-1.2 4.4 2.2 8.3 6.4 8.3h18.9c4.8 0 9.2-3 10.4-7.8l17.2-64H395c12.5 0 21.4 11.8 18.1 23.4l-10.6 40c-1.2 4.3 1.9 8.3 6.4 8.3H428c4.6 0 9.1-2.9 10.3-7.8l8.8-33.1c9-33.1-15.9-65.4-50.3-65.4zm98.3 74.6c-3.6 0-6-3.4-5.1-6.7l8-30c.9-3.9 3.7-6 7.8-6h32.9c2.6 0 4.6 2.4 3.9 5.1l-.7 2.6c-.6 2-1.9 3-3.9 3h-21.6c-7 0-12.6 4.6-14.2 10.8l-3.5 13h53.4c10.5 0 20.3-6.6 23.2-17.6l3.2-12c4.9-19.1-9.3-36.8-28.3-36.8h-47.3c-17.9 0-33.8 12-38.6 29.6l-10.8 40c-5 17.7 8.3 36.7 28.3 36.7h66.7c6.8 0 12.3-4.5 14.2-10.7l5.7-21z"]
};
var faCreativeCommons = {
  prefix: 'fab',
  iconName: 'creative-commons',
  icon: [496, 512, [], "f25e", "M245.83 214.87l-33.22 17.28c-9.43-19.58-25.24-19.93-27.46-19.93-22.13 0-33.22 14.61-33.22 43.84 0 23.57 9.21 43.84 33.22 43.84 14.47 0 24.65-7.09 30.57-21.26l30.55 15.5c-6.17 11.51-25.69 38.98-65.1 38.98-22.6 0-73.96-10.32-73.96-77.05 0-58.69 43-77.06 72.63-77.06 30.72-.01 52.7 11.95 65.99 35.86zm143.05 0l-32.78 17.28c-9.5-19.77-25.72-19.93-27.9-19.93-22.14 0-33.22 14.61-33.22 43.84 0 23.55 9.23 43.84 33.22 43.84 14.45 0 24.65-7.09 30.54-21.26l31 15.5c-2.1 3.75-21.39 38.98-65.09 38.98-22.69 0-73.96-9.87-73.96-77.05 0-58.67 42.97-77.06 72.63-77.06 30.71-.01 52.58 11.95 65.56 35.86zM247.56 8.05C104.74 8.05 0 123.11 0 256.05c0 138.49 113.6 248 247.56 248 129.93 0 248.44-100.87 248.44-248 0-137.87-106.62-248-248.44-248zm.87 450.81c-112.54 0-203.7-93.04-203.7-202.81 0-105.42 85.43-203.27 203.72-203.27 112.53 0 202.82 89.46 202.82 203.26-.01 121.69-99.68 202.82-202.84 202.82z"]
};
var faCreativeCommonsBy = {
  prefix: 'fab',
  iconName: 'creative-commons-by',
  icon: [496, 512, [], "f4e7", "M314.9 194.4v101.4h-28.3v120.5h-77.1V295.9h-28.3V194.4c0-4.4 1.6-8.2 4.6-11.3 3.1-3.1 6.9-4.7 11.3-4.7H299c4.1 0 7.8 1.6 11.1 4.7 3.1 3.2 4.8 6.9 4.8 11.3zm-101.5-63.7c0-23.3 11.5-35 34.5-35s34.5 11.7 34.5 35c0 23-11.5 34.5-34.5 34.5s-34.5-11.5-34.5-34.5zM247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3z"]
};
var faCreativeCommonsNc = {
  prefix: 'fab',
  iconName: 'creative-commons-nc',
  icon: [496, 512, [], "f4e8", "M247.6 8C387.4 8 496 115.9 496 256c0 147.2-118.5 248-248.4 248C113.1 504 0 393.2 0 256 0 123.1 104.7 8 247.6 8zM55.8 189.1c-7.4 20.4-11.1 42.7-11.1 66.9 0 110.9 92.1 202.4 203.7 202.4 122.4 0 177.2-101.8 178.5-104.1l-93.4-41.6c-7.7 37.1-41.2 53-68.2 55.4v38.1h-28.8V368c-27.5-.3-52.6-10.2-75.3-29.7l34.1-34.5c31.7 29.4 86.4 31.8 86.4-2.2 0-6.2-2.2-11.2-6.6-15.1-14.2-6-1.8-.1-219.3-97.4zM248.4 52.3c-38.4 0-112.4 8.7-170.5 93l94.8 42.5c10-31.3 40.4-42.9 63.8-44.3v-38.1h28.8v38.1c22.7 1.2 43.4 8.9 62 23L295 199.7c-42.7-29.9-83.5-8-70 11.1 53.4 24.1 43.8 19.8 93 41.6l127.1 56.7c4.1-17.4 6.2-35.1 6.2-53.1 0-57-19.8-105-59.3-143.9-39.3-39.9-87.2-59.8-143.6-59.8z"]
};
var faCreativeCommonsNcEu = {
  prefix: 'fab',
  iconName: 'creative-commons-nc-eu',
  icon: [496, 512, [], "f4e9", "M247.7 8C103.6 8 0 124.8 0 256c0 136.3 111.7 248 247.7 248C377.9 504 496 403.1 496 256 496 117 388.4 8 247.7 8zm.6 450.7c-112 0-203.6-92.5-203.6-202.7 0-23.2 3.7-45.2 10.9-66l65.7 29.1h-4.7v29.5h23.3c0 6.2-.4 3.2-.4 19.5h-22.8v29.5h27c11.4 67 67.2 101.3 124.6 101.3 26.6 0 50.6-7.9 64.8-15.8l-10-46.1c-8.7 4.6-28.2 10.8-47.3 10.8-28.2 0-58.1-10.9-67.3-50.2h90.3l128.3 56.8c-1.5 2.1-56.2 104.3-178.8 104.3zm-16.7-190.6l-.5-.4.9.4h-.4zm77.2-19.5h3.7v-29.5h-70.3l-28.6-12.6c2.5-5.5 5.4-10.5 8.8-14.3 12.9-15.8 31.1-22.4 51.1-22.4 18.3 0 35.3 5.4 46.1 10l11.6-47.3c-15-6.6-37-12.4-62.3-12.4-39 0-72.2 15.8-95.9 42.3-5.3 6.1-9.8 12.9-13.9 20.1l-81.6-36.1c64.6-96.8 157.7-93.6 170.7-93.6 113 0 203 90.2 203 203.4 0 18.7-2.1 36.3-6.3 52.9l-136.1-60.5z"]
};
var faCreativeCommonsNcJp = {
  prefix: 'fab',
  iconName: 'creative-commons-nc-jp',
  icon: [496, 512, [], "f4ea", "M247.7 8C103.6 8 0 124.8 0 256c0 136.4 111.8 248 247.7 248C377.9 504 496 403.2 496 256 496 117.2 388.5 8 247.7 8zm.6 450.7c-112 0-203.6-92.5-203.6-202.7 0-21.1 3-41.2 9-60.3l127 56.5h-27.9v38.6h58.1l5.7 11.8v18.7h-63.8V360h63.8v56h61.7v-56h64.2v-35.7l81 36.1c-1.5 2.2-57.1 98.3-175.2 98.3zm87.6-137.3h-57.6v-18.7l2.9-5.6 54.7 24.3zm6.5-51.4v-17.8h-38.6l63-116H301l-43.4 96-23-10.2-39.6-85.7h-65.8l27.3 51-81.9-36.5c27.8-44.1 82.6-98.1 173.7-98.1 112.8 0 203 90 203 203.4 0 21-2.7 40.6-7.9 59l-101-45.1z"]
};
var faCreativeCommonsNd = {
  prefix: 'fab',
  iconName: 'creative-commons-nd',
  icon: [496, 512, [], "f4eb", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm94 144.3v42.5H162.1V197h180.3zm0 79.8v42.5H162.1v-42.5h180.3z"]
};
var faCreativeCommonsPd = {
  prefix: 'fab',
  iconName: 'creative-commons-pd',
  icon: [496, 512, [], "f4ec", "M248 8C111 8 0 119.1 0 256c0 137 111 248 248 248s248-111 248-248C496 119.1 385 8 248 8zm0 449.5c-139.2 0-235.8-138-190.2-267.9l78.8 35.1c-2.1 10.5-3.3 21.5-3.3 32.9 0 99 73.9 126.9 120.4 126.9 22.9 0 53.5-6.7 79.4-29.5L297 311.1c-5.5 6.3-17.6 16.7-36.3 16.7-37.8 0-53.7-39.9-53.9-71.9 230.4 102.6 216.5 96.5 217.9 96.8-34.3 62.4-100.6 104.8-176.7 104.8zm194.2-150l-224-100c18.8-34 54.9-30.7 74.7-11l40.4-41.6c-27.1-23.3-58-27.5-78.1-27.5-47.4 0-80.9 20.5-100.7 51.6l-74.9-33.4c36.1-54.9 98.1-91.2 168.5-91.2 111.1 0 201.5 90.4 201.5 201.5 0 18-2.4 35.4-6.8 52-.3-.1-.4-.2-.6-.4z"]
};
var faCreativeCommonsPdAlt = {
  prefix: 'fab',
  iconName: 'creative-commons-pd-alt',
  icon: [496, 512, [], "f4ed", "M247.6 8C104.7 8 0 123.1 0 256c0 138.5 113.6 248 247.6 248C377.5 504 496 403.1 496 256 496 118.1 389.4 8 247.6 8zm.8 450.8c-112.5 0-203.7-93-203.7-202.8 0-105.4 85.5-203.3 203.7-203.3 112.6 0 202.9 89.5 202.8 203.3 0 121.7-99.6 202.8-202.8 202.8zM316.7 186h-53.2v137.2h53.2c21.4 0 70-5.1 70-68.6 0-63.4-48.6-68.6-70-68.6zm.8 108.5h-19.9v-79.7l19.4-.1c3.8 0 35-2.1 35 39.9 0 24.6-10.5 39.9-34.5 39.9zM203.7 186h-68.2v137.3h34.6V279h27c54.1 0 57.1-37.5 57.1-46.5 0-31-16.8-46.5-50.5-46.5zm-4.9 67.3h-29.2v-41.6h28.3c30.9 0 28.8 41.6.9 41.6z"]
};
var faCreativeCommonsRemix = {
  prefix: 'fab',
  iconName: 'creative-commons-remix',
  icon: [496, 512, [], "f4ee", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm161.7 207.7l4.9 2.2v70c-7.2 3.6-63.4 27.5-67.3 28.8-6.5-1.8-113.7-46.8-137.3-56.2l-64.2 26.6-63.3-27.5v-63.8l59.3-24.8c-.7-.7-.4 5-.4-70.4l67.3-29.7L361 178.5v61.6l49.1 20.3zm-70.4 81.5v-43.8h-.4v-1.8l-113.8-46.5V295l113.8 46.9v-.4l.4.4zm7.5-57.6l39.9-16.4-36.8-15.5-39 16.4 35.9 15.5zm52.3 38.1v-43L355.2 298v43.4l44.3-19z"]
};
var faCreativeCommonsSa = {
  prefix: 'fab',
  iconName: 'creative-commons-sa',
  icon: [496, 512, [], "f4ef", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zM137.7 221c13-83.9 80.5-95.7 108.9-95.7 99.8 0 127.5 82.5 127.5 134.2 0 63.6-41 132.9-128.9 132.9-38.9 0-99.1-20-109.4-97h62.5c1.5 30.1 19.6 45.2 54.5 45.2 23.3 0 58-18.2 58-82.8 0-82.5-49.1-80.6-56.7-80.6-33.1 0-51.7 14.6-55.8 43.8h18.2l-49.2 49.2-49-49.2h19.4z"]
};
var faCreativeCommonsSampling = {
  prefix: 'fab',
  iconName: 'creative-commons-sampling',
  icon: [496, 512, [], "f4f0", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm3.6 53.2c2.8-.3 11.5 1 11.5 11.5l6.6 107.2 4.9-59.3c0-6 4.7-10.6 10.6-10.6 5.9 0 10.6 4.7 10.6 10.6 0 2.5-.5-5.7 5.7 81.5l5.8-64.2c.3-2.9 2.9-9.3 10.2-9.3 3.8 0 9.9 2.3 10.6 8.9l11.5 96.5 5.3-12.8c1.8-4.4 5.2-6.6 10.2-6.6h58v21.3h-50.9l-18.2 44.3c-3.9 9.9-19.5 9.1-20.8-3.1l-4-31.9-7.5 92.6c-.3 3-3 9.3-10.2 9.3-3 0-9.8-2.1-10.6-9.3 0-1.9.6 5.8-6.2-77.9l-5.3 72.2c-1.1 4.8-4.8 9.3-10.6 9.3-2.9 0-9.8-2-10.6-9.3 0-1.9.5 6.7-5.8-87.7l-5.8 94.8c0 6.3-3.6 12.4-10.6 12.4-5.2 0-10.6-4.1-10.6-12l-5.8-87.7c-5.8 92.5-5.3 84-5.3 85.9-1.1 4.8-4.8 9.3-10.6 9.3-3 0-9.8-2.1-10.6-9.3 0-.7-.4-1.1-.4-2.6l-6.2-88.6L182 348c-.7 6.5-6.7 9.3-10.6 9.3-5.8 0-9.6-4.1-10.6-8.9L149.7 272c-2 4-3.5 8.4-11.1 8.4H87.2v-21.3H132l13.7-27.9c4.4-9.9 18.2-7.2 19.9 2.7l3.1 20.4 8.4-97.9c0-6 4.8-10.6 10.6-10.6.5 0 10.6-.2 10.6 12.4l4.9 69.1 6.6-92.6c0-10.1 9.5-10.6 10.2-10.6.6 0 10.6.7 10.6 10.6l5.3 80.6 6.2-97.9c.1-1.1-.6-10.3 9.9-11.5z"]
};
var faCreativeCommonsSamplingPlus = {
  prefix: 'fab',
  iconName: 'creative-commons-sampling-plus',
  icon: [496, 512, [], "f4f1", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm107 205.6c-4.7 0-9 2.8-10.7 7.2l-4 9.5-11-92.8c-1.7-13.9-22-13.4-23.1.4l-4.3 51.4-5.2-68.8c-1.1-14.3-22.1-14.2-23.2 0l-3.5 44.9-5.9-94.3c-.9-14.5-22.3-14.4-23.2 0l-5.1 83.7-4.3-66.3c-.9-14.4-22.2-14.4-23.2 0l-5.3 80.2-4.1-57c-1.1-14.3-22-14.3-23.2-.2l-7.7 89.8-1.8-12.2c-1.7-11.4-17.1-13.6-22-3.3l-13.2 27.7H87.5v23.2h51.3c4.4 0 8.4-2.5 10.4-6.4l10.7 73.1c2 13.5 21.9 13 23.1-.7l3.8-43.6 5.7 78.3c1.1 14.4 22.3 14.2 23.2-.1l4.6-70.4 4.8 73.3c.9 14.4 22.3 14.4 23.2-.1l4.9-80.5 4.5 71.8c.9 14.3 22.1 14.5 23.2.2l4.6-58.6 4.9 64.4c1.1 14.3 22 14.2 23.1.1l6.8-83 2.7 22.3c1.4 11.8 17.7 14.1 22.3 3.1l18-43.4h50.5V258l-58.4.3zm-78 5.2h-21.9v21.9c0 4.1-3.3 7.5-7.5 7.5-4.1 0-7.5-3.3-7.5-7.5v-21.9h-21.9c-4.1 0-7.5-3.3-7.5-7.5 0-4.1 3.4-7.5 7.5-7.5h21.9v-21.9c0-4.1 3.4-7.5 7.5-7.5s7.5 3.3 7.5 7.5v21.9h21.9c4.1 0 7.5 3.3 7.5 7.5 0 4.1-3.4 7.5-7.5 7.5z"]
};
var faCreativeCommonsShare = {
  prefix: 'fab',
  iconName: 'creative-commons-share',
  icon: [496, 512, [], "f4f2", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm101 132.4c7.8 0 13.7 6.1 13.7 13.7v182.5c0 7.7-6.1 13.7-13.7 13.7H214.3c-7.7 0-13.7-6-13.7-13.7v-54h-54c-7.8 0-13.7-6-13.7-13.7V131.1c0-8.2 6.6-12.7 12.4-13.7h136.4c7.7 0 13.7 6 13.7 13.7v54h54zM159.9 300.3h40.7V198.9c0-7.4 5.8-12.6 12-13.7h55.8v-40.3H159.9v155.4zm176.2-88.1H227.6v155.4h108.5V212.2z"]
};
var faCreativeCommonsZero = {
  prefix: 'fab',
  iconName: 'creative-commons-zero',
  icon: [496, 512, [], "f4f3", "M247.6 8C389.4 8 496 118.1 496 256c0 147.1-118.5 248-248.4 248C113.6 504 0 394.5 0 256 0 123.1 104.7 8 247.6 8zm.8 44.7C130.2 52.7 44.7 150.6 44.7 256c0 109.8 91.2 202.8 203.7 202.8 103.2 0 202.8-81.1 202.8-202.8.1-113.8-90.2-203.3-202.8-203.3zm-.4 60.5c-81.9 0-102.5 77.3-102.5 142.8 0 65.5 20.6 142.8 102.5 142.8S350.5 321.5 350.5 256c0-65.5-20.6-142.8-102.5-142.8zm0 53.9c3.3 0 6.4.5 9.2 1.2 5.9 5.1 8.8 12.1 3.1 21.9l-54.5 100.2c-1.7-12.7-1.9-25.1-1.9-34.4 0-28.8 2-88.9 44.1-88.9zm40.8 46.2c2.9 15.4 3.3 31.4 3.3 42.7 0 28.9-2 88.9-44.1 88.9-13.5 0-32.6-7.7-20.1-26.4l60.9-105.2z"]
};
var faCriticalRole = {
  prefix: 'fab',
  iconName: 'critical-role',
  icon: [448, 512, [], "f6c9", "M225.82 0c.26.15 216.57 124.51 217.12 124.72 3 1.18 3.7 3.46 3.7 6.56q-.11 125.17 0 250.36a5.88 5.88 0 0 1-3.38 5.78c-21.37 12-207.86 118.29-218.93 124.58h-3C142 466.34 3.08 386.56 2.93 386.48a3.29 3.29 0 0 1-1.88-3.24c0-.87 0-225.94-.05-253.1a5 5 0 0 1 2.93-4.93C27.19 112.11 213.2 6 224.07 0zM215.4 20.42l-.22-.16Q118.06 75.55 21 130.87c0 .12.08.23.13.35l30.86 11.64c-7.71 6-8.32 6-10.65 5.13-.1 0-24.17-9.28-26.8-10v230.43c.88-1.41 64.07-110.91 64.13-111 1.62-2.82 3-1.92 9.12-1.52 1.4.09 1.48.22.78 1.42-41.19 71.33-36.4 63-67.48 116.94-.81 1.4-.61 1.13 1.25 1.13h186.5c1.44 0 1.69-.23 1.7-1.64v-8.88c0-1.34 2.36-.81-18.37-1-7.46-.07-14.14-3.22-21.38-12.7-7.38-9.66-14.62-19.43-21.85-29.21-2.28-3.08-3.45-2.38-16.76-2.38-1.75 0-1.78 0-1.76 1.82.29 26.21.15 25.27 1 32.66.52 4.37 2.16 4.2 9.69 4.81 3.14.26 3.88 4.08.52 4.92-1.57.39-31.6.51-33.67-.1a2.42 2.42 0 0 1 .3-4.73c3.29-.76 6.16.81 6.66-4.44 1.3-13.66 1.17-9 1.1-79.42 0-10.82-.35-12.58-5.36-13.55-1.22-.24-3.54-.16-4.69-.55-2.88-1-2-4.84 1.77-4.85 33.67 0 46.08-1.07 56.06 4.86 7.74 4.61 12 11.48 12.51 20.4.88 14.59-6.51 22.35-15 32.59a1.46 1.46 0 0 0 0 2.22c2.6 3.25 5 6.63 7.71 9.83 27.56 33.23 24.11 30.54 41.28 33.06.89.13 1-.42 1-1.15v-11c0-1 .32-1.43 1.41-1.26a72.37 72.37 0 0 0 23.58-.3c1.08-.15 1.5.2 1.48 1.33 0 .11.88 26.69.87 26.8-.05 1.52.67 1.62 1.89 1.62h186.71Q386.51 304.6 346 234.33c2.26-.66-.4 0 6.69-1.39 2-.39 2.05-.41 3.11 1.44 7.31 12.64 77.31 134 77.37 134.06V138c-1.72.5-103.3 38.72-105.76 39.68-1.08.42-1.55.2-1.91-.88-.63-1.9-1.34-3.76-2.09-5.62-.32-.79-.09-1.13.65-1.39.1 0 95.53-35.85 103-38.77-65.42-37.57-130.56-75-196-112.6l86.82 150.39-.28.33c-9.57-.9-10.46-1.6-11.8-3.94-1-1.69-73.5-127.71-82-142.16-9.1 14.67-83.56 146.21-85.37 146.32-2.93.17-5.88.08-9.25.08q43.25-74.74 86.18-149zm51.93 129.92a37.68 37.68 0 0 0 5.54-.85c1.69-.3 2.53.2 2.6 1.92 0 .11.07 19.06-.86 20.45s-1.88 1.22-2.6-.19c-5-9.69 6.22-9.66-39.12-12-.7 0-1 .23-1 .93 0 .13 3.72 122 3.73 122.11 0 .89.52 1.2 1.21 1.51a83.92 83.92 0 0 1 8.7 4.05c7.31 4.33 11.38 10.84 12.41 19.31 1.44 11.8-2.77 35.77-32.21 37.14-2.75.13-28.26 1.08-34.14-23.25-4.66-19.26 8.26-32.7 19.89-36.4a2.45 2.45 0 0 0 2-2.66c.1-5.63 3-107.1 3.71-121.35.05-1.08-.62-1.16-1.35-1.15-32.35.52-36.75-.34-40.22 8.52-2.42 6.18-4.14 1.32-3.95.23q1.59-9 3.31-18c.4-2.11 1.43-2.61 3.43-1.86 5.59 2.11 6.72 1.7 37.25 1.92 1.73 0 1.78-.08 1.82-1.85.68-27.49.58-22.59 1-29.55a2.69 2.69 0 0 0-1.63-2.8c-5.6-2.91-8.75-7.55-8.9-13.87-.35-14.81 17.72-21.67 27.38-11.51 6.84 7.19 5.8 18.91-2.45 24.15a4.35 4.35 0 0 0-2.22 4.34c0 .59-.11-4.31 1 30.05 0 .9.43 1.12 1.24 1.11.1 0 23-.09 34.47-.37zM68.27 141.7c19.84-4.51 32.68-.56 52.49 1.69 2.76.31 3.74 1.22 3.62 4-.21 5-1.16 22.33-1.24 23.15a2.65 2.65 0 0 1-1.63 2.34c-4.06 1.7-3.61-4.45-4-7.29-3.13-22.43-73.87-32.7-74.63 25.4-.31 23.92 17 53.63 54.08 50.88 27.24-2 19-20.19 24.84-20.47a2.72 2.72 0 0 1 3 3.36c-1.83 10.85-3.42 18.95-3.45 19.15-1.54 9.17-86.7 22.09-93.35-42.06-2.71-25.85 10.44-53.37 40.27-60.15zm80 87.67h-19.49a2.57 2.57 0 0 1-2.66-1.79c2.38-3.75 5.89.92 5.86-6.14-.08-25.75.21-38 .23-40.1 0-3.42-.53-4.65-3.32-4.94-7-.72-3.11-3.37-1.11-3.38 11.84-.1 22.62-.18 30.05.72 8.77 1.07 16.71 12.63 7.93 22.62-2 2.25-4 4.42-6.14 6.73.95 1.15 6.9 8.82 17.28 19.68 2.66 2.78 6.15 3.51 9.88 3.13a2.21 2.21 0 0 0 2.23-2.12c.3-3.42.26 4.73.45-40.58 0-5.65-.34-6.58-3.23-6.83-3.95-.35-4-2.26-.69-3.37l19.09-.09c.32 0 4.49.53 1 3.38 0 .05-.16 0-.24 0-3.61.26-3.94 1-4 4.62-.27 43.93.07 40.23.41 42.82.11.84.27 2.23 5.1 2.14 2.49 0 3.86 3.37 0 3.4-10.37.08-20.74 0-31.11.07-10.67 0-13.47-6.2-24.21-20.82-1.6-2.18-8.31-2.36-8.2-.37.88 16.47 0 17.78 4 17.67 4.75-.1 4.73 3.57.83 3.55zm275-10.15c-1.21 7.13.17 10.38-5.3 10.34-61.55-.42-47.82-.22-50.72-.31a18.4 18.4 0 0 1-3.63-.73c-2.53-.6 1.48-1.23-.38-5.6-1.43-3.37-2.78-6.78-4.11-10.19a1.94 1.94 0 0 0-2-1.44 138 138 0 0 0-14.58.07 2.23 2.23 0 0 0-1.62 1.06c-1.58 3.62-3.07 7.29-4.51 11-1.27 3.23 7.86 1.32 12.19 2.16 3 .57 4.53 3.72.66 3.73H322.9c-2.92 0-3.09-3.15-.74-3.21a6.3 6.3 0 0 0 5.92-3.47c1.5-3 2.8-6 4.11-9.09 18.18-42.14 17.06-40.17 18.42-41.61a1.83 1.83 0 0 1 3 0c2.93 3.34 18.4 44.71 23.62 51.92 2 2.7 5.74 2 6.36 2 3.61.13 4-1.11 4.13-4.29.09-1.87.08 1.17.07-41.24 0-4.46-2.36-3.74-5.55-4.27-.26 0-2.56-.63-.08-3.06.21-.2-.89-.24 21.7-.15 2.32 0 5.32 2.75-1.21 3.45a2.56 2.56 0 0 0-2.66 2.83c-.07 1.63-.19 38.89.29 41.21a3.06 3.06 0 0 0 3.23 2.43c13.25.43 14.92.44 16-3.41 1.67-5.78 4.13-2.52 3.73-.19zm-104.72 64.37c-4.24 0-4.42-3.39-.61-3.41 35.91-.16 28.11.38 37.19-.65 1.68-.19 2.38.24 2.25 1.89-.26 3.39-.64 6.78-1 10.16-.25 2.16-3.2 2.61-3.4-.15-.38-5.31-2.15-4.45-15.63-5.08-1.58-.07-1.64 0-1.64 1.52V304c0 1.65 0 1.6 1.62 1.47 3.12-.25 10.31.34 15.69-1.52.47-.16 3.3-1.79 3.07 1.76 0 .21-.76 10.35-1.18 11.39-.53 1.29-1.88 1.51-2.58.32-1.17-2 0-5.08-3.71-5.3-15.42-.9-12.91-2.55-12.91 6 0 12.25-.76 16.11 3.89 16.24 16.64.48 14.4 0 16.43-5.71.84-2.37 3.5-1.77 3.18.58-.44 3.21-.85 6.43-1.23 9.64 0 .36-.16 2.4-4.66 2.39-37.16-.08-34.54-.19-35.21-.31-2.72-.51-2.2-3 .22-3.45 1.1-.19 4 .54 4.16-2.56 2.44-56.22-.07-51.34-3.91-51.33zm-.41-109.52c2.46.61 3.13 1.76 2.95 4.65-.33 5.3-.34 9-.55 9.69-.66 2.23-3.15 2.12-3.34-.27-.38-4.81-3.05-7.82-7.57-9.15-26.28-7.73-32.81 15.46-27.17 30.22 5.88 15.41 22 15.92 28.86 13.78 5.92-1.85 5.88-6.5 6.91-7.58 1.23-1.3 2.25-1.84 3.12 1.1 0 .1.57 11.89-6 12.75-1.6.21-19.38 3.69-32.68-3.39-21-11.19-16.74-35.47-6.88-45.33 14-14.06 39.91-7.06 42.32-6.47zM289.8 280.14c3.28 0 3.66 3 .16 3.43-2.61.32-5-.42-5 5.46 0 2-.19 29.05.4 41.45.11 2.29 1.15 3.52 3.44 3.65 22 1.21 14.95-1.65 18.79-6.34 1.83-2.24 2.76.84 2.76 1.08.35 13.62-4 12.39-5.19 12.4l-38.16-.19c-1.93-.23-2.06-3-.42-3.38 2-.48 4.94.4 5.13-2.8 1-15.87.57-44.65.34-47.81-.27-3.77-2.8-3.27-5.68-3.71-2.47-.38-2-3.22.34-3.22 1.45-.02 17.97-.03 23.09-.02zm-31.63-57.79c.07 4.08 2.86 3.46 6 3.58 2.61.1 2.53 3.41-.07 3.43-6.48 0-13.7 0-21.61-.06-3.84 0-3.38-3.35 0-3.37 4.49 0 3.24 1.61 3.41-45.54 0-5.08-3.27-3.54-4.72-4.23-2.58-1.23-1.36-3.09.41-3.15 1.29 0 20.19-.41 21.17.21s1.87 1.65-.42 2.86c-1 .52-3.86-.28-4.15 2.47 0 .21-.82 1.63-.07 43.8zm-36.91 274.27a2.93 2.93 0 0 0 3.26 0c17-9.79 182-103.57 197.42-112.51-.14-.43 11.26-.18-181.52-.27-1.22 0-1.57.37-1.53 1.56 0 .1 1.25 44.51 1.22 50.38a28.33 28.33 0 0 1-1.36 7.71c-.55 1.83.38-.5-13.5 32.23-.73 1.72-1 2.21-2-.08-4.19-10.34-8.28-20.72-12.57-31a23.6 23.6 0 0 1-2-10.79c.16-2.46.8-16.12 1.51-48 0-1.95 0-2-2-2h-183c2.58 1.63 178.32 102.57 196 112.76zm-90.9-188.75c0 2.4.36 2.79 2.76 3 11.54 1.17 21 3.74 25.64-7.32 6-14.46 2.66-34.41-12.48-38.84-2-.59-16-2.76-15.94 1.51.05 8.04.01 11.61.02 41.65zm105.75-15.05c0 2.13 1.07 38.68 1.09 39.13.34 9.94-25.58 5.77-25.23-2.59.08-2 1.37-37.42 1.1-39.43-14.1 7.44-14.42 40.21 6.44 48.8a17.9 17.9 0 0 0 22.39-7.07c4.91-7.76 6.84-29.47-5.43-39a2.53 2.53 0 0 1-.36.12zm-12.28-198c-9.83 0-9.73 14.75-.07 14.87s10.1-14.88.07-14.91zm-80.15 103.83c0 1.8.41 2.4 2.17 2.58 13.62 1.39 12.51-11 12.16-13.36-1.69-11.22-14.38-10.2-14.35-7.81.05 4.5-.03 13.68.02 18.59zm212.32 6.4l-6.1-15.84c-2.16 5.48-4.16 10.57-6.23 15.84z"]
};
var faCss3 = {
  prefix: 'fab',
  iconName: 'css3',
  icon: [512, 512, [], "f13c", "M480 32l-64 368-223.3 80L0 400l19.6-94.8h82l-8 40.6L210 390.2l134.1-44.4 18.8-97.1H29.5l16-82h333.7l10.5-52.7H56.3l16.3-82H480z"]
};
var faCss3Alt = {
  prefix: 'fab',
  iconName: 'css3-alt',
  icon: [384, 512, [], "f38b", "M0 32l34.9 395.8L192 480l157.1-52.2L384 32H0zm313.1 80l-4.8 47.3L193 208.6l-.3.1h111.5l-12.8 146.6-98.2 28.7-98.8-29.2-6.4-73.9h48.9l3.2 38.3 52.6 13.3 54.7-15.4 3.7-61.6-166.3-.5v-.1l-.2.1-3.6-46.3L193.1 162l6.5-2.7H76.7L70.9 112h242.2z"]
};
var faCuttlefish = {
  prefix: 'fab',
  iconName: 'cuttlefish',
  icon: [440, 512, [], "f38c", "M344 305.5c-17.5 31.6-57.4 54.5-96 54.5-56.6 0-104-47.4-104-104s47.4-104 104-104c38.6 0 78.5 22.9 96 54.5 13.7-50.9 41.7-93.3 87-117.8C385.7 39.1 320.5 8 248 8 111 8 0 119 0 256s111 248 248 248c72.5 0 137.7-31.1 183-80.7-45.3-24.5-73.3-66.9-87-117.8z"]
};
var faDAndD = {
  prefix: 'fab',
  iconName: 'd-and-d',
  icon: [576, 512, [], "f38d", "M82.5 98.9c-.6-17.2 2-33.8 12.7-48.2.3 7.4 1.2 14.5 4.2 21.6 5.9-27.5 19.7-49.3 42.3-65.5-1.9 5.9-3.5 11.8-3 17.7 8.7-7.4 18.8-17.8 44.4-22.7 14.7-2.8 29.7-2 42.1 1 38.5 9.3 61 34.3 69.7 72.3 5.3 23.1.7 45-8.3 66.4-5.2 12.4-12 24.4-20.7 35.1-2-1.9-3.9-3.8-5.8-5.6-42.8-40.8-26.8-25.2-37.4-37.4-1.1-1.2-1-2.2-.1-3.6 8.3-13.5 11.8-28.2 10-44-1.1-9.8-4.3-18.9-11.3-26.2-14.5-15.3-39.2-15-53.5.6-11.4 12.5-14.1 27.4-10.9 43.6.2 1.3.4 2.7 0 3.9-3.4 13.7-4.6 27.6-2.5 41.6.1.5.1 1.1.1 1.6 0 .3-.1.5-.2 1.1-21.8-11-36-28.3-43.2-52.2-8.3 17.8-11.1 35.5-6.6 54.1-15.6-15.2-21.3-34.3-22-55.2zm469.6 123.2c-11.6-11.6-25-20.4-40.1-26.6-12.8-5.2-26-7.9-39.9-7.1-10 .6-19.6 3.1-29 6.4-2.5.9-5.1 1.6-7.7 2.2-4.9 1.2-7.3-3.1-4.7-6.8 3.2-4.6 3.4-4.2 15-12 .6-.4 1.2-.8 2.2-1.5h-2.5c-.6 0-1.2.2-1.9.3-19.3 3.3-30.7 15.5-48.9 29.6-10.4 8.1-13.8 3.8-12-.5 1.4-3.5 3.3-6.7 5.1-10 1-1.8 2.3-3.4 3.5-5.1-.2-.2-.5-.3-.7-.5-27 18.3-46.7 42.4-57.7 73.3.3.3.7.6 1 .9.3-.6.5-1.2.9-1.7 10.4-12.1 22.8-21.8 36.6-29.8 18.2-10.6 37.5-18.3 58.7-20.2 4.3-.4 8.7-.1 13.1-.1-1.8.7-3.5.9-5.3 1.1-18.5 2.4-35.5 9-51.5 18.5-30.2 17.9-54.5 42.2-75.1 70.4-.3.4-.4.9-.7 1.3 14.5 5.3 24 17.3 36.1 25.6.2-.1.3-.2.4-.4l1.2-2.7c12.2-26.9 27-52.3 46.7-74.5 16.7-18.8 38-25.3 62.5-20 5.9 1.3 11.4 4.4 17.2 6.8 2.3-1.4 5.1-3.2 8-4.7 8.4-4.3 17.4-7 26.7-9 14.7-3.1 29.5-4.9 44.5-1.3v-.5c-.5-.4-1.2-.8-1.7-1.4zM316.7 397.6c-39.4-33-22.8-19.5-42.7-35.6-.8.9 0-.2-1.9 3-11.2 19.1-25.5 35.3-44 47.6-10.3 6.8-21.5 11.8-34.1 11.8-21.6 0-38.2-9.5-49.4-27.8-12-19.5-13.3-40.7-8.2-62.6 7.8-33.8 30.1-55.2 38.6-64.3-18.7-6.2-33 1.7-46.4 13.9.8-13.9 4.3-26.2 11.8-37.3-24.3 10.6-45.9 25-64.8 43.9-.3-5.8 5.4-43.7 5.6-44.7.3-2.7-.6-5.3-3-7.4-24.2 24.7-44.5 51.8-56.1 84.6 7.4-5.9 14.9-11.4 23.6-16.2-8.3 22.3-19.6 52.8-7.8 101.1 4.6 19 11.9 36.8 24.1 52.3 2.9 3.7 6.3 6.9 9.5 10.3.2-.2.4-.3.6-.5-1.4-7-2.2-14.1-1.5-21.9 2.2 3.2 3.9 6 5.9 8.6 12.6 16 28.7 27.4 47.2 35.6 25 11.3 51.1 13.3 77.9 8.6 54.9-9.7 90.7-48.6 116-98.8 1-1.8.6-2.9-.9-4.2zm172-46.4c-9.5-3.1-22.2-4.2-28.7-2.9 9.9 4 14.1 6.6 18.8 12 12.6 14.4 10.4 34.7-5.4 45.6-11.7 8.1-24.9 10.5-38.9 9.1-1.2-.1-2.3-.4-3-.6 2.8-3.7 6-7 8.1-10.8 9.4-16.8 5.4-42.1-8.7-56.1-2.1-2.1-4.6-3.9-7-5.9-.3 1.3-.1 2.1.1 2.8 4.2 16.6-8.1 32.4-24.8 31.8-7.6-.3-13.9-3.8-19.6-8.5-19.5-16.1-39.1-32.1-58.5-48.3-5.9-4.9-12.5-8.1-20.1-8.7-4.6-.4-9.3-.6-13.9-.9-5.9-.4-8.8-2.8-10.4-8.4-.9-3.4-1.5-6.8-2.2-10.2-1.5-8.1-6.2-13-14.3-14.2-4.4-.7-8.9-1-13.3-1.5-13-1.4-19.8-7.4-22.6-20.3-5 11-1.6 22.4 7.3 29.9 4.5 3.8 9.3 7.3 13.8 11.2 4.6 3.8 7.4 8.7 7.9 14.8.4 4.7.8 9.5 1.8 14.1 2.2 10.6 8.9 18.4 17 25.1 16.5 13.7 33 27.3 49.5 41.1 17.9 15 13.9 32.8 13 56-.9 22.9 12.2 42.9 33.5 51.2 1 .4 2 .6 3.6 1.1-15.7-18.2-10.1-44.1.7-52.3.3 2.2.4 4.3.9 6.4 9.4 44.1 45.4 64.2 85 56.9 16-2.9 30.6-8.9 42.9-19.8 2-1.8 3.7-4.1 5.9-6.5-19.3 4.6-35.8.1-50.9-10.6.7-.3 1.3-.3 1.9-.3 21.3 1.8 40.6-3.4 57-17.4 19.5-16.6 26.6-42.9 17.4-66-8.3-20.1-23.6-32.3-43.8-38.9zM99.4 179.3c-5.3-9.2-13.2-15.6-22.1-21.3 13.7-.5 26.6.2 39.6 3.7-7-12.2-8.5-24.7-5-38.7 5.3 11.9 13.7 20.1 23.6 26.8 19.7 13.2 35.7 19.6 46.7 30.2 3.4 3.3 6.3 7.1 9.6 10.9-.8-2.1-1.4-4.1-2.2-6-5-10.6-13-18.6-22.6-25-1.8-1.2-2.8-2.5-3.4-4.5-3.3-12.5-3-25.1-.7-37.6 1-5.5 2.8-10.9 4.5-16.3.8-2.4 2.3-4.6 4-6.6.6 6.9 0 25.5 19.6 46 10.8 11.3 22.4 21.9 33.9 32.7 9 8.5 18.3 16.7 25.5 26.8 1.1 1.6 2.2 3.3 3.8 4.7-5-13-14.2-24.1-24.2-33.8-9.6-9.3-19.4-18.4-29.2-27.4-3.3-3-4.6-6.7-5.1-10.9-1.2-10.4 0-20.6 4.3-30.2.5-1 1.1-2 1.9-3.3.5 4.2.6 7.9 1.4 11.6 4.8 23.1 20.4 36.3 49.3 63.5 10 9.4 19.3 19.2 25.6 31.6 4.8 9.3 7.3 19 5.7 29.6-.1.6.5 1.7 1.1 2 6.2 2.6 10 6.9 9.7 14.3 7.7-2.6 12.5-8 16.4-14.5 4.2 20.2-9.1 50.3-27.2 58.7.4-4.5 5-23.4-16.5-27.7-6.8-1.3-12.8-1.3-22.9-2.1 4.7-9 10.4-20.6.5-22.4-24.9-4.6-52.8 1.9-57.8 4.6 8.2.4 16.3 1 23.5 3.3-2 6.5-4 12.7-5.8 18.9-1.9 6.5 2.1 14.6 9.3 9.6 1.2-.9 2.3-1.9 3.3-2.7-3.1 17.9-2.9 15.9-2.8 18.3.3 10.2 9.5 7.8 15.7 7.3-2.5 11.8-29.5 27.3-45.4 25.8 7-4.7 12.7-10.3 15.9-17.9-6.5.8-12.9 1.6-19.2 2.4l-.3-.9c4.7-3.4 8-7.8 10.2-13.1 8.7-21.1-3.6-38-25-39.9-9.1-.8-17.8.8-25.9 5.5 6.2-15.6 17.2-26.6 32.6-34.5-15.2-4.3-8.9-2.7-24.6-6.3 14.6-9.3 30.2-13.2 46.5-14.6-5.2-3.2-48.1-3.6-70.2 20.9 7.9 1.4 15.5 2.8 23.2 4.2-23.8 7-44 19.7-62.4 35.6 1.1-4.8 2.7-9.5 3.3-14.3.6-4.5.8-9.2.1-13.6-1.5-9.4-8.9-15.1-19.7-16.3-7.9-.9-15.6.1-23.3 1.3-.9.1-1.7.3-2.9 0 15.8-14.8 36-21.7 53.1-33.5 6-4.5 6.8-8.2 3-14.9zm128.4 26.8c3.3 16 12.6 25.5 23.8 24.3-4.6-11.3-12.1-19.5-23.8-24.3z"]
};
var faDAndDBeyond = {
  prefix: 'fab',
  iconName: 'd-and-d-beyond',
  icon: [640, 512, [], "f6ca", "M313.8 241.5c13.8 0 21-10.1 24.8-17.9-1-1.1-5-4.2-7.4-6.6-2.4 4.3-8.2 10.7-13.9 10.7-10.2 0-15.4-14.7-3.2-26.6-.5-.2-4.3-1.8-8 2.4 0-3 1-5.1 2.1-6.6-3.5 1.3-9.8 5.6-11.4 7.9.2-5.8 1.6-7.5.6-9l-.2-.2s-8.5 5.6-9.3 14.7c0 0 1.1-1.6 2.1-1.9.6-.3 1.3 0 .6 1.9-.2.6-5.8 15.7 5.1 26-.6-1.6-1.9-7.6 2.4-1.9-.3.1 5.8 7.1 15.7 7.1zm52.4-21.1c0-4-4.9-4.4-5.6-4.5 2 3.9.9 7.5.2 9 2.5-.4 5.4-1.6 5.4-4.5zm10.3 5.2c0-6.4-6.2-11.4-13.5-10.7 8 1.3 5.6 13.8-5 11.4 3.7-2.6 3.2-9.9-1.3-12.5 1.4 4.2-3 8.2-7.4 4.6-2.4-1.9-8-6.6-10.6-8.6-2.4-2.1-5.5-1-6.6-1.8-1.3-1.1-.5-3.8-2.2-5-1.6-.8-3-.3-4.8-1-1.6-.6-2.7-1.9-2.6-3.5-2.5 4.4 3.4 6.3 4.5 8.5 1 1.9-.8 4.8 4 8.5 14.8 11.6 9.1 8 10.4 18.1.6 4.3 4.2 6.7 6.4 7.4-2.1-1.9-2.9-6.4 0-9.3 0 13.9 19.2 13.3 23.1 6.4-2.4 1.1-7-.2-9-1.9 7.7 1 14.2-4.1 14.6-10.6zm-39.4-18.4c2 .8 1.6.7 6.4 4.5 10.2-24.5 21.7-15.7 22-15.5 2.2-1.9 9.8-3.8 13.8-2.7-2.4-2.7-7.5-6.2-13.3-6.2-4.7 0-7.4 2.2-8 1.3-.8-1.4 3.2-3.4 3.2-3.4-5.4.2-9.6 6.7-11.2 5.9-1.1-.5 1.4-3.7 1.4-3.7-5.1 2.9-9.3 9.1-10.2 13 4.6-5.8 13.8-9.8 19.7-9-10.5.5-19.5 9.7-23.8 15.8zm242.5 51.9c-20.7 0-40 1.3-50.3 2.1l7.4 8.2v77.2l-7.4 8.2c10.4.8 30.9 2.1 51.6 2.1 42.1 0 59.1-20.7 59.1-48.9 0-29.3-23.2-48.9-60.4-48.9zm-15.1 75.6v-53.3c30.1-3.3 46.8 3.8 46.8 26.3 0 25.6-21.4 30.2-46.8 27zM301.6 181c-1-3.4-.2-6.9 1.1-9.4 1 3 2.6 6.4 7.5 9-.5-2.4-.2-5.6.5-8-1.4-5.4 2.1-9.9 6.4-9.9 6.9 0 8.5 8.8 4.7 14.4 2.1 3.2 5.5 5.6 7.7 7.8 3.2-3.7 5.5-9.5 5.5-13.8 0-8.2-5.5-15.9-16.7-16.5-20-.9-20.2 16.6-20 18.9.5 5.2 3.4 7.8 3.3 7.5zm-.4 6c-.5 1.8-7 3.7-10.2 6.9 4.8-1 7-.2 7.8 1.8.5 1.4-.2 3.4-.5 5.6 1.6-1.8 7-5.5 11-6.2-1-.3-3.4-.8-4.3-.8 2.9-3.4 9.3-4.5 12.8-3.7-2.2-.2-6.7 1.1-8.5 2.6 1.6.3 3 .6 4.3 1.1-2.1.8-4.8 3.4-5.8 6.1 7-5 13.1 5.2 7 8.2.8.2 2.7 0 3.5-.5-.3 1.1-1.9 3-3 3.4 2.9 0 7-1.9 8.2-4.6 0 0-1.8.6-2.6-.2s.3-4.3.3-4.3c-2.3 2.9-3.4-1.3-1.3-4.2-1-.3-3.5-.6-4.6-.5 3.2-1.1 10.4-1.8 11.2-.3.6 1.1-1 3.4-1 3.4 4-.5 8.3 1.1 6.7 5.1 2.9-1.4 5.5-5.9 4.8-10.4-.3 1-1.6 2.4-2.9 2.7.2-1.4-1-2.2-1.9-2.6 1.7-9.6-14.6-14.2-14.1-23.9-1 1.3-1.8 5-.8 7.1 2.7 3.2 8.7 6.7 10.1 12.2-2.6-6.4-15.1-11.4-14.6-20.2-1.6 1.6-2.6 7.8-1.3 11 2.4 1.4 4.5 3.8 4.8 6.1-2.2-5.1-11.4-6.1-13.9-12.2-.6 2.2-.3 5 1 6.7 0 0-2.2-.8-7-.6 1.7.6 5.1 3.5 4.8 5.2zm25.9 7.4c-2.7 0-3.5-2.1-4.2-4.3 3.3 1.3 4.2 4.3 4.2 4.3zm38.9 3.7l-1-.6c-1.1-1-2.9-1.4-4.7-1.4-2.9 0-5.8 1.3-7.5 3.4-.8.8-1.4 1.8-2.1 2.6v15.7c3.5 2.6 7.1-2.9 3-7.2 1.5.3 4.6 2.7 5.1 3.2 0 0 2.6-.5 5-.5 2.1 0 3.9.3 5.6 1.1V196c-1.1.5-2.2 1-2.7 1.4zM79.9 305.9c17.2-4.6 16.2-18 16.2-19.9 0-20.6-24.1-25-37-25H3l8.3 8.6v29.5H0l11.4 14.6V346L3 354.6c61.7 0 73.8 1.5 86.4-5.9 6.7-4 9.9-9.8 9.9-17.6 0-5.1 2.6-18.8-19.4-25.2zm-41.3-27.5c20 0 29.6-.8 29.6 9.1v3c0 12.1-19 8.8-29.6 8.8zm0 59.2V315c12.2 0 32.7-2.3 32.7 8.8v4.5h.2c0 11.2-12.5 9.3-32.9 9.3zm101.2-19.3l23.1.2v-.2l14.1-21.2h-37.2v-14.9h52.4l-14.1-21v-.2l-73.5.2 7.4 8.2v77.1l-7.4 8.2h81.2l14.1-21.2-60.1.2zm214.7-60.1c-73.9 0-77.5 99.3-.3 99.3 77.9 0 74.1-99.3.3-99.3zm-.3 77.5c-37.4 0-36.9-55.3.2-55.3 36.8.1 38.8 55.3-.2 55.3zm-91.3-8.3l44.1-66.2h-41.7l6.1 7.2-20.5 37.2h-.3l-21-37.2 6.4-7.2h-44.9l44.1 65.8.2 19.4-7.7 8.2h42.6l-7.2-8.2zm-28.4-151.3c1.6 1.3 2.9 2.4 2.9 6.6v38.8c0 4.2-.8 5.3-2.7 6.4-.1.1-7.5 4.5-7.9 4.6h35.1c10 0 17.4-1.5 26-8.6-.6-5 .2-9.5.8-12 0-.2-1.8 1.4-2.7 3.5 0-5.7 1.6-15.4 9.6-20.5-.1 0-3.7-.8-9 1.1 2-3.1 10-7.9 10.4-7.9-8.2-26-38-22.9-32.2-22.9-30.9 0-32.6.3-39.9-4 .1.8.5 8.2 9.6 14.9zm21.5 5.5c4.6 0 23.1-3.3 23.1 17.3 0 20.7-18.4 17.3-23.1 17.3zm228.9 79.6l7 8.3V312h-.3c-5.4-14.4-42.3-41.5-45.2-50.9h-31.6l7.4 8.5v76.9l-7.2 8.3h39l-7.4-8.2v-47.4h.3c3.7 10.6 44.5 42.9 48.5 55.6h21.3v-85.2l7.4-8.3zm-106.7-96.1c-32.2 0-32.8.2-39.9-4 .1.7.5 8.3 9.6 14.9 3.1 2 2.9 4.3 2.9 9.5 1.8-1.1 3.8-2.2 6.1-3-1.1 1.1-2.7 2.7-3.5 4.5 1-1.1 7.5-5.1 14.6-3.5-1.6.3-4 1.1-6.1 2.9.1 0 2.1-1.1 7.5-.3v-4.3c4.7 0 23.1-3.4 23.1 17.3 0 20.5-18.5 17.3-19.7 17.3 5.7 4.4 5.8 12 2.2 16.3h.3c33.4 0 36.7-27.3 36.7-34 0-3.8-1.1-32-33.8-33.6z"]
};
var faDailymotion = {
  prefix: 'fab',
  iconName: 'dailymotion',
  icon: [448, 512, [], "f952", "M298.93,267a48.4,48.4,0,0,0-24.36-6.21q-19.83,0-33.44,13.27t-13.61,33.42q0,21.16,13.28,34.6t33.43,13.44q20.5,0,34.11-13.78T322,307.47A47.13,47.13,0,0,0,315.9,284,44.13,44.13,0,0,0,298.93,267ZM0,32V480H448V32ZM374.71,405.26h-53.1V381.37h-.67q-15.79,26.2-55.78,26.2-27.56,0-48.89-13.1a88.29,88.29,0,0,1-32.94-35.77q-11.6-22.68-11.59-50.89,0-27.56,11.76-50.22a89.9,89.9,0,0,1,32.93-35.78q21.18-13.09,47.72-13.1a80.87,80.87,0,0,1,29.74,5.21q13.28,5.21,25,17V153l55.79-12.09Z"]
};
var faDashcube = {
  prefix: 'fab',
  iconName: 'dashcube',
  icon: [448, 512, [], "f210", "M326.6 104H110.4c-51.1 0-91.2 43.3-91.2 93.5V427c0 50.5 40.1 85 91.2 85h227.2c51.1 0 91.2-34.5 91.2-85V0L326.6 104zM153.9 416.5c-17.7 0-32.4-15.1-32.4-32.8V240.8c0-17.7 14.7-32.5 32.4-32.5h140.7c17.7 0 32 14.8 32 32.5v123.5l51.1 52.3H153.9z"]
};
var faDelicious = {
  prefix: 'fab',
  iconName: 'delicious',
  icon: [448, 512, [], "f1a5", "M446.5 68c-.4-1.5-.9-3-1.4-4.5-.9-2.5-2-4.8-3.3-7.1-1.4-2.4-3-4.8-4.7-6.9-2.1-2.5-4.4-4.8-6.9-6.8-1.1-.9-2.2-1.7-3.3-2.5-1.3-.9-2.6-1.7-4-2.4-1.8-1-3.6-1.8-5.5-2.5-1.7-.7-3.5-1.3-5.4-1.7-3.8-1-7.9-1.5-12-1.5H48C21.5 32 0 53.5 0 80v352c0 4.1.5 8.2 1.5 12 2 7.7 5.8 14.6 11 20.3 1 1.1 2.1 2.2 3.3 3.3 5.7 5.2 12.6 9 20.3 11 3.8 1 7.9 1.5 12 1.5h352c26.5 0 48-21.5 48-48V80c-.1-4.1-.6-8.2-1.6-12zM416 432c0 8.8-7.2 16-16 16H224V256H32V80c0-8.8 7.2-16 16-16h176v192h192z"]
};
var faDeploydog = {
  prefix: 'fab',
  iconName: 'deploydog',
  icon: [512, 512, [], "f38e", "M382.2 136h51.7v239.6h-51.7v-20.7c-19.8 24.8-52.8 24.1-73.8 14.7-26.2-11.7-44.3-38.1-44.3-71.8 0-29.8 14.8-57.9 43.3-70.8 20.2-9.1 52.7-10.6 74.8 12.9V136zm-64.7 161.8c0 18.2 13.6 33.5 33.2 33.5 19.8 0 33.2-16.4 33.2-32.9 0-17.1-13.7-33.2-33.2-33.2-19.6 0-33.2 16.4-33.2 32.6zM188.5 136h51.7v239.6h-51.7v-20.7c-19.8 24.8-52.8 24.1-73.8 14.7-26.2-11.7-44.3-38.1-44.3-71.8 0-29.8 14.8-57.9 43.3-70.8 20.2-9.1 52.7-10.6 74.8 12.9V136zm-64.7 161.8c0 18.2 13.6 33.5 33.2 33.5 19.8 0 33.2-16.4 33.2-32.9 0-17.1-13.7-33.2-33.2-33.2-19.7 0-33.2 16.4-33.2 32.6zM448 96c17.5 0 32 14.4 32 32v256c0 17.5-14.4 32-32 32H64c-17.5 0-32-14.4-32-32V128c0-17.5 14.4-32 32-32h384m0-32H64C28.8 64 0 92.8 0 128v256c0 35.2 28.8 64 64 64h384c35.2 0 64-28.8 64-64V128c0-35.2-28.8-64-64-64z"]
};
var faDeskpro = {
  prefix: 'fab',
  iconName: 'deskpro',
  icon: [480, 512, [], "f38f", "M205.9 512l31.1-38.4c12.3-.2 25.6-1.4 36.5-6.6 38.9-18.6 38.4-61.9 38.3-63.8-.1-5-.8-4.4-28.9-37.4H362c-.2 50.1-7.3 68.5-10.2 75.7-9.4 23.7-43.9 62.8-95.2 69.4-8.7 1.1-32.8 1.2-50.7 1.1zm200.4-167.7c38.6 0 58.5-13.6 73.7-30.9l-175.5-.3-17.4 31.3 119.2-.1zm-43.6-223.9v168.3h-73.5l-32.7 55.5H250c-52.3 0-58.1-56.5-58.3-58.9-1.2-13.2-21.3-11.6-20.1 1.8 1.4 15.8 8.8 40 26.4 57.1h-91c-25.5 0-110.8-26.8-107-114V16.9C0 .9 9.7.3 15 .1h82c.2 0 .3.1.5.1 4.3-.4 50.1-2.1 50.1 43.7 0 13.3 20.2 13.4 20.2 0 0-18.2-5.5-32.8-15.8-43.7h84.2c108.7-.4 126.5 79.4 126.5 120.2zm-132.5 56l64 29.3c13.3-45.5-42.2-71.7-64-29.3z"]
};
var faDev = {
  prefix: 'fab',
  iconName: 'dev',
  icon: [448, 512, [], "f6cc", "M120.12 208.29c-3.88-2.9-7.77-4.35-11.65-4.35H91.03v104.47h17.45c3.88 0 7.77-1.45 11.65-4.35 3.88-2.9 5.82-7.25 5.82-13.06v-69.65c-.01-5.8-1.96-10.16-5.83-13.06zM404.1 32H43.9C19.7 32 .06 51.59 0 75.8v360.4C.06 460.41 19.7 480 43.9 480h360.2c24.21 0 43.84-19.59 43.9-43.8V75.8c-.06-24.21-19.7-43.8-43.9-43.8zM154.2 291.19c0 18.81-11.61 47.31-48.36 47.25h-46.4V172.98h47.38c35.44 0 47.36 28.46 47.37 47.28l.01 70.93zm100.68-88.66H201.6v38.42h32.57v29.57H201.6v38.41h53.29v29.57h-62.18c-11.16.29-20.44-8.53-20.72-19.69V193.7c-.27-11.15 8.56-20.41 19.71-20.69h63.19l-.01 29.52zm103.64 115.29c-13.2 30.75-36.85 24.63-47.44 0l-38.53-144.8h32.57l29.71 113.72 29.57-113.72h32.58l-38.46 144.8z"]
};
var faDeviantart = {
  prefix: 'fab',
  iconName: 'deviantart',
  icon: [320, 512, [], "f1bd", "M320 93.2l-98.2 179.1 7.4 9.5H320v127.7H159.1l-13.5 9.2-43.7 84c-.3 0-8.6 8.6-9.2 9.2H0v-93.2l93.2-179.4-7.4-9.2H0V102.5h156l13.5-9.2 43.7-84c.3 0 8.6-8.6 9.2-9.2H320v93.1z"]
};
var faDhl = {
  prefix: 'fab',
  iconName: 'dhl',
  icon: [640, 512, [], "f790", "M238 301.2h58.7L319 271h-58.7L238 301.2zM0 282.9v6.4h81.8l4.7-6.4H0zM172.9 271c-8.7 0-6-3.6-4.6-5.5 2.8-3.8 7.6-10.4 10.4-14.1 2.8-3.7 2.8-5.9-2.8-5.9h-51l-41.1 55.8h100.1c33.1 0 51.5-22.5 57.2-30.3h-68.2zm317.5-6.9l39.3-53.4h-62.2l-39.3 53.4h62.2zM95.3 271H0v6.4h90.6l4.7-6.4zm111-26.6c-2.8 3.8-7.5 10.4-10.3 14.2-1.4 2-4.1 5.5 4.6 5.5h45.6s7.3-10 13.5-18.4c8.4-11.4.7-35-29.2-35H112.6l-20.4 27.8h111.4c5.6 0 5.5 2.2 2.7 5.9zM0 301.2h73.1l4.7-6.4H0v6.4zm323 0h58.7L404 271h-58.7c-.1 0-22.3 30.2-22.3 30.2zm222 .1h95v-6.4h-90.3l-4.7 6.4zm22.3-30.3l-4.7 6.4H640V271h-72.7zm-13.5 18.3H640v-6.4h-81.5l-4.7 6.4zm-164.2-78.6l-22.5 30.6h-26.2l22.5-30.6h-58.7l-39.3 53.4H409l39.3-53.4h-58.7zm33.5 60.3s-4.3 5.9-6.4 8.7c-7.4 10-.9 21.6 23.2 21.6h94.3l22.3-30.3H423.1z"]
};
var faDiaspora = {
  prefix: 'fab',
  iconName: 'diaspora',
  icon: [512, 512, [], "f791", "M251.64 354.55c-1.4 0-88 119.9-88.7 119.9S76.34 414 76 413.25s86.6-125.7 86.6-127.4c0-2.2-129.6-44-137.6-47.1-1.3-.5 31.4-101.8 31.7-102.1.6-.7 144.4 47 145.5 47 .4 0 .9-.6 1-1.3.4-2 1-148.6 1.7-149.6.8-1.2 104.5-.7 105.1-.3 1.5 1 3.5 156.1 6.1 156.1 1.4 0 138.7-47 139.3-46.3.8.9 31.9 102.2 31.5 102.6-.9.9-140.2 47.1-140.6 48.8-.3 1.4 82.8 122.1 82.5 122.9s-85.5 63.5-86.3 63.5c-1-.2-89-125.5-90.9-125.5z"]
};
var faDigg = {
  prefix: 'fab',
  iconName: 'digg',
  icon: [512, 512, [], "f1a6", "M81.7 172.3H0v174.4h132.7V96h-51v76.3zm0 133.4H50.9v-92.3h30.8v92.3zm297.2-133.4v174.4h81.8v28.5h-81.8V416H512V172.3H378.9zm81.8 133.4h-30.8v-92.3h30.8v92.3zm-235.6 41h82.1v28.5h-82.1V416h133.3V172.3H225.1v174.4zm51.2-133.3h30.8v92.3h-30.8v-92.3zM153.3 96h51.3v51h-51.3V96zm0 76.3h51.3v174.4h-51.3V172.3z"]
};
var faDigitalOcean = {
  prefix: 'fab',
  iconName: 'digital-ocean',
  icon: [512, 512, [], "f391", "M87 481.8h73.7v-73.6H87zM25.4 346.6v61.6H87v-61.6zm466.2-169.7c-23-74.2-82.4-133.3-156.6-156.6C164.9-32.8 8 93.7 8 255.9h95.8c0-101.8 101-180.5 208.1-141.7 39.7 14.3 71.5 46.1 85.8 85.7 39.1 107-39.7 207.8-141.4 208v.3h-.3V504c162.6 0 288.8-156.8 235.6-327.1zm-235.3 231v-95.3h-95.6v95.6H256v-.3z"]
};
var faDiscord = {
  prefix: 'fab',
  iconName: 'discord',
  icon: [448, 512, [], "f392", "M297.216 243.2c0 15.616-11.52 28.416-26.112 28.416-14.336 0-26.112-12.8-26.112-28.416s11.52-28.416 26.112-28.416c14.592 0 26.112 12.8 26.112 28.416zm-119.552-28.416c-14.592 0-26.112 12.8-26.112 28.416s11.776 28.416 26.112 28.416c14.592 0 26.112-12.8 26.112-28.416.256-15.616-11.52-28.416-26.112-28.416zM448 52.736V512c-64.494-56.994-43.868-38.128-118.784-107.776l13.568 47.36H52.48C23.552 451.584 0 428.032 0 398.848V52.736C0 23.552 23.552 0 52.48 0h343.04C424.448 0 448 23.552 448 52.736zm-72.96 242.688c0-82.432-36.864-149.248-36.864-149.248-36.864-27.648-71.936-26.88-71.936-26.88l-3.584 4.096c43.52 13.312 63.744 32.512 63.744 32.512-60.811-33.329-132.244-33.335-191.232-7.424-9.472 4.352-15.104 7.424-15.104 7.424s21.248-20.224 67.328-33.536l-2.56-3.072s-35.072-.768-71.936 26.88c0 0-36.864 66.816-36.864 149.248 0 0 21.504 37.12 78.08 38.912 0 0 9.472-11.52 17.152-21.248-32.512-9.728-44.8-30.208-44.8-30.208 3.766 2.636 9.976 6.053 10.496 6.4 43.21 24.198 104.588 32.126 159.744 8.96 8.96-3.328 18.944-8.192 29.44-15.104 0 0-12.8 20.992-46.336 30.464 7.68 9.728 16.896 20.736 16.896 20.736 56.576-1.792 78.336-38.912 78.336-38.912z"]
};
var faDiscourse = {
  prefix: 'fab',
  iconName: 'discourse',
  icon: [448, 512, [], "f393", "M225.9 32C103.3 32 0 130.5 0 252.1 0 256 .1 480 .1 480l225.8-.2c122.7 0 222.1-102.3 222.1-223.9C448 134.3 348.6 32 225.9 32zM224 384c-19.4 0-37.9-4.3-54.4-12.1L88.5 392l22.9-75c-9.8-18.1-15.4-38.9-15.4-61 0-70.7 57.3-128 128-128s128 57.3 128 128-57.3 128-128 128z"]
};
var faDochub = {
  prefix: 'fab',
  iconName: 'dochub',
  icon: [416, 512, [], "f394", "M397.9 160H256V19.6L397.9 160zM304 192v130c0 66.8-36.5 100.1-113.3 100.1H96V84.8h94.7c12 0 23.1.8 33.1 2.5v-84C212.9 1.1 201.4 0 189.2 0H0v512h189.2C329.7 512 400 447.4 400 318.1V192h-96z"]
};
var faDocker = {
  prefix: 'fab',
  iconName: 'docker',
  icon: [640, 512, [], "f395", "M349.9 236.3h-66.1v-59.4h66.1v59.4zm0-204.3h-66.1v60.7h66.1V32zm78.2 144.8H362v59.4h66.1v-59.4zm-156.3-72.1h-66.1v60.1h66.1v-60.1zm78.1 0h-66.1v60.1h66.1v-60.1zm276.8 100c-14.4-9.7-47.6-13.2-73.1-8.4-3.3-24-16.7-44.9-41.1-63.7l-14-9.3-9.3 14c-18.4 27.8-23.4 73.6-3.7 103.8-8.7 4.7-25.8 11.1-48.4 10.7H2.4c-8.7 50.8 5.8 116.8 44 162.1 37.1 43.9 92.7 66.2 165.4 66.2 157.4 0 273.9-72.5 328.4-204.2 21.4.4 67.6.1 91.3-45.2 1.5-2.5 6.6-13.2 8.5-17.1l-13.3-8.9zm-511.1-27.9h-66v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm78.1 0h-66.1v59.4h66.1v-59.4zm-78.1-72.1h-66.1v60.1h66.1v-60.1z"]
};
var faDraft2digital = {
  prefix: 'fab',
  iconName: 'draft2digital',
  icon: [480, 512, [], "f396", "M480 398.1l-144-82.2v64.7h-91.3c30.8-35 81.8-95.9 111.8-149.3 35.2-62.6 16.1-123.4-12.8-153.3-4.4-4.6-62.2-62.9-166-41.2-59.1 12.4-89.4 43.4-104.3 67.3-13.1 20.9-17 39.8-18.2 47.7-5.5 33 19.4 67.1 56.7 67.1 31.7 0 57.3-25.7 57.3-57.4 0-27.1-19.7-52.1-48-56.8 1.8-7.3 17.7-21.1 26.3-24.7 41.1-17.3 78 5.2 83.3 33.5 8.3 44.3-37.1 90.4-69.7 127.6C84.5 328.1 18.3 396.8 0 415.9l336-.1V480zM369.9 371l47.1 27.2-47.1 27.2zM134.2 161.4c0 12.4-10 22.4-22.4 22.4s-22.4-10-22.4-22.4 10-22.4 22.4-22.4 22.4 10.1 22.4 22.4zM82.5 380.5c25.6-27.4 97.7-104.7 150.8-169.9 35.1-43.1 40.3-82.4 28.4-112.7-7.4-18.8-17.5-30.2-24.3-35.7 45.3 2.1 68 23.4 82.2 38.3 0 0 42.4 48.2 5.8 113.3-37 65.9-110.9 147.5-128.5 166.7z"]
};
var faDribbble = {
  prefix: 'fab',
  iconName: 'dribbble',
  icon: [512, 512, [], "f17d", "M256 8C119.252 8 8 119.252 8 256s111.252 248 248 248 248-111.252 248-248S392.748 8 256 8zm163.97 114.366c29.503 36.046 47.369 81.957 47.835 131.955-6.984-1.477-77.018-15.682-147.502-6.818-5.752-14.041-11.181-26.393-18.617-41.614 78.321-31.977 113.818-77.482 118.284-83.523zM396.421 97.87c-3.81 5.427-35.697 48.286-111.021 76.519-34.712-63.776-73.185-116.168-79.04-124.008 67.176-16.193 137.966 1.27 190.061 47.489zm-230.48-33.25c5.585 7.659 43.438 60.116 78.537 122.509-99.087 26.313-186.36 25.934-195.834 25.809C62.38 147.205 106.678 92.573 165.941 64.62zM44.17 256.323c0-2.166.043-4.322.108-6.473 9.268.19 111.92 1.513 217.706-30.146 6.064 11.868 11.857 23.915 17.174 35.949-76.599 21.575-146.194 83.527-180.531 142.306C64.794 360.405 44.17 310.73 44.17 256.323zm81.807 167.113c22.127-45.233 82.178-103.622 167.579-132.756 29.74 77.283 42.039 142.053 45.189 160.638-68.112 29.013-150.015 21.053-212.768-27.882zm248.38 8.489c-2.171-12.886-13.446-74.897-41.152-151.033 66.38-10.626 124.7 6.768 131.947 9.055-9.442 58.941-43.273 109.844-90.795 141.978z"]
};
var faDribbbleSquare = {
  prefix: 'fab',
  iconName: 'dribbble-square',
  icon: [448, 512, [], "f397", "M90.2 228.2c8.9-42.4 37.4-77.7 75.7-95.7 3.6 4.9 28 38.8 50.7 79-64 17-120.3 16.8-126.4 16.7zM314.6 154c-33.6-29.8-79.3-41.1-122.6-30.6 3.8 5.1 28.6 38.9 51 80 48.6-18.3 69.1-45.9 71.6-49.4zM140.1 364c40.5 31.6 93.3 36.7 137.3 18-2-12-10-53.8-29.2-103.6-55.1 18.8-93.8 56.4-108.1 85.6zm98.8-108.2c-3.4-7.8-7.2-15.5-11.1-23.2C159.6 253 93.4 252.2 87.4 252c0 1.4-.1 2.8-.1 4.2 0 35.1 13.3 67.1 35.1 91.4 22.2-37.9 67.1-77.9 116.5-91.8zm34.9 16.3c17.9 49.1 25.1 89.1 26.5 97.4 30.7-20.7 52.5-53.6 58.6-91.6-4.6-1.5-42.3-12.7-85.1-5.8zm-20.3-48.4c4.8 9.8 8.3 17.8 12 26.8 45.5-5.7 90.7 3.4 95.2 4.4-.3-32.3-11.8-61.9-30.9-85.1-2.9 3.9-25.8 33.2-76.3 53.9zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-64 176c0-88.2-71.8-160-160-160S64 167.8 64 256s71.8 160 160 160 160-71.8 160-160z"]
};
var faDropbox = {
  prefix: 'fab',
  iconName: 'dropbox',
  icon: [528, 512, [], "f16b", "M264.4 116.3l-132 84.3 132 84.3-132 84.3L0 284.1l132.3-84.3L0 116.3 132.3 32l132.1 84.3zM131.6 395.7l132-84.3 132 84.3-132 84.3-132-84.3zm132.8-111.6l132-84.3-132-83.6L395.7 32 528 116.3l-132.3 84.3L528 284.8l-132.3 84.3-131.3-85z"]
};
var faDrupal = {
  prefix: 'fab',
  iconName: 'drupal',
  icon: [448, 512, [], "f1a9", "M319.5 114.7c-22.2-14-43.5-19.5-64.7-33.5-13-8.8-31.3-30-46.5-48.3-2.7 29.3-11.5 41.2-22 49.5-21.3 17-34.8 22.2-53.5 32.3C117 123 32 181.5 32 290.5 32 399.7 123.8 480 225.8 480 327.5 480 416 406 416 294c0-112.3-83-171-96.5-179.3zm2.5 325.6c-20.1 20.1-90.1 28.7-116.7 4.2-4.8-4.8.3-12 6.5-12 0 0 17 13.3 51.5 13.3 27 0 46-7.7 54.5-14 6.1-4.6 8.4 4.3 4.2 8.5zm-54.5-52.6c8.7-3.6 29-3.8 36.8 1.3 4.1 2.8 16.1 18.8 6.2 23.7-8.4 4.2-1.2-15.7-26.5-15.7-14.7 0-19.5 5.2-26.7 11-7 6-9.8 8-12.2 4.7-6-8.2 15.9-22.3 22.4-25zM360 405c-15.2-1-45.5-48.8-65-49.5-30.9-.9-104.1 80.7-161.3 42-38.8-26.6-14.6-104.8 51.8-105.2 49.5-.5 83.8 49 108.5 48.5 21.3-.3 61.8-41.8 81.8-41.8 48.7 0 23.3 109.3-15.8 106z"]
};
var faDyalog = {
  prefix: 'fab',
  iconName: 'dyalog',
  icon: [416, 512, [], "f399", "M0 32v119.2h64V96h107.2C284.6 96 352 176.2 352 255.9 352 332 293.4 416 171.2 416H0v64h171.2C331.9 480 416 367.3 416 255.9c0-58.7-22.1-113.4-62.3-154.3C308.9 56 245.7 32 171.2 32H0z"]
};
var faEarlybirds = {
  prefix: 'fab',
  iconName: 'earlybirds',
  icon: [480, 512, [], "f39a", "M313.2 47.5c1.2-13 21.3-14 36.6-8.7.9.3 26.2 9.7 19 15.2-27.9-7.4-56.4 18.2-55.6-6.5zm-201 6.9c30.7-8.1 62 20 61.1-7.1-1.3-14.2-23.4-15.3-40.2-9.6-1 .3-28.7 10.5-20.9 16.7zM319.4 160c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm-159.7 0c-8.8 0-16 7.2-16 16s7.2 16 16 16 16-7.2 16-16-7.2-16-16-16zm318.5 163.2c-9.9 24-40.7 11-63.9-1.2-13.5 69.1-58.1 111.4-126.3 124.2.3.9-2-.1 24 1 33.6 1.4 63.8-3.1 97.4-8-19.8-13.8-11.4-37.1-9.8-38.1 1.4-.9 14.7 1.7 21.6 11.5 8.6-12.5 28.4-14.8 30.2-13.6 1.6 1.1 6.6 20.9-6.9 34.6 4.7-.9 8.2-1.6 9.8-2.1 2.6-.8 17.7 11.3 3.1 13.3-14.3 2.3-22.6 5.1-47.1 10.8-45.9 10.7-85.9 11.8-117.7 12.8l1 11.6c3.8 18.1-23.4 24.3-27.6 6.2.8 17.9-27.1 21.8-28.4-1l-.5 5.3c-.7 18.4-28.4 17.9-28.3-.6-7.5 13.5-28.1 6.8-26.4-8.5l1.2-12.4c-36.7.9-59.7 3.1-61.8 3.1-20.9 0-20.9-31.6 0-31.6 2.4 0 27.7 1.3 63.2 2.8-61.1-15.5-103.7-55-114.9-118.2-25 12.8-57.5 26.8-68.2.8-10.5-25.4 21.5-42.6 66.8-73.4.7-6.6 1.6-13.3 2.7-19.8-14.4-19.6-11.6-36.3-16.1-60.4-16.8 2.4-23.2-9.1-23.6-23.1.3-7.3 2.1-14.9 2.4-15.4 1.1-1.8 10.1-2 12.7-2.6 6-31.7 50.6-33.2 90.9-34.5 19.7-21.8 45.2-41.5 80.9-48.3C203.3 29 215.2 8.5 216.2 8c1.7-.8 21.2 4.3 26.3 23.2 5.2-8.8 18.3-11.4 19.6-10.7 1.1.6 6.4 15-4.9 25.9 40.3 3.5 72.2 24.7 96 50.7 36.1 1.5 71.8 5.9 77.1 34 2.7.6 11.6.8 12.7 2.6.3.5 2.1 8.1 2.4 15.4-.5 13.9-6.8 25.4-23.6 23.1-3.2 17.3-2.7 32.9-8.7 47.7 2.4 11.7 4 23.8 4.8 36.4 37 25.4 70.3 42.5 60.3 66.9zM207.4 159.9c.9-44-37.9-42.2-78.6-40.3-21.7 1-38.9 1.9-45.5 13.9-11.4 20.9 5.9 92.9 23.2 101.2 9.8 4.7 73.4 7.9 86.3-7.1 8.2-9.4 15-49.4 14.6-67.7zm52 58.3c-4.3-12.4-6-30.1-15.3-32.7-2-.5-9-.5-11 0-10 2.8-10.8 22.1-17 37.2 15.4 0 19.3 9.7 23.7 9.7 4.3 0 6.3-11.3 19.6-14.2zm135.7-84.7c-6.6-12.1-24.8-12.9-46.5-13.9-40.2-1.9-78.2-3.8-77.3 40.3-.5 18.3 5 58.3 13.2 67.8 13 14.9 76.6 11.8 86.3 7.1 15.8-7.6 36.5-78.9 24.3-101.3z"]
};
var faEbay = {
  prefix: 'fab',
  iconName: 'ebay',
  icon: [640, 512, [], "f4f4", "M606 189.5l-54.8 109.9-54.9-109.9h-37.5l10.9 20.6c-11.5-19-35.9-26-63.3-26-31.8 0-67.9 8.7-71.5 43.1h33.7c1.4-13.8 15.7-21.8 35-21.8 26 0 41 9.6 41 33v3.4c-12.7 0-28 .1-41.7.4-42.4.9-69.6 10-76.7 34.4 1-5.2 1.5-10.6 1.5-16.2 0-52.1-39.7-76.2-75.4-76.2-21.3 0-43 5.5-58.7 24.2v-80.6h-32.1v169.5c0 10.3-.6 22.9-1.1 33.1h31.5c.7-6.3 1.1-12.9 1.1-19.5 13.6 16.6 35.4 24.9 58.7 24.9 36.9 0 64.9-21.9 73.3-54.2-.5 2.8-.7 5.8-.7 9 0 24.1 21.1 45 60.6 45 26.6 0 45.8-5.7 61.9-25.5 0 6.6.3 13.3 1.1 20.2h29.8c-.7-8.2-1-17.5-1-26.8v-65.6c0-9.3-1.7-17.2-4.8-23.8l61.5 116.1-28.5 54.1h35.9L640 189.5zM243.7 313.8c-29.6 0-50.2-21.5-50.2-53.8 0-32.4 20.6-53.8 50.2-53.8 29.8 0 50.2 21.4 50.2 53.8 0 32.3-20.4 53.8-50.2 53.8zm200.9-47.3c0 30-17.9 48.4-51.6 48.4-25.1 0-35-13.4-35-25.8 0-19.1 18.1-24.4 47.2-25.3 13.1-.5 27.6-.6 39.4-.6zm-411.9 1.6h128.8v-8.5c0-51.7-33.1-75.4-78.4-75.4-56.8 0-83 30.8-83 77.6 0 42.5 25.3 74 82.5 74 31.4 0 68-11.7 74.4-46.1h-33.1c-12 35.8-87.7 36.7-91.2-21.6zm95-21.4H33.3c6.9-56.6 92.1-54.7 94.4 0z"]
};
var faEdge = {
  prefix: 'fab',
  iconName: 'edge',
  icon: [512, 512, [], "f282", "M481.92,134.48C440.87,54.18,352.26,8,255.91,8,137.05,8,37.51,91.68,13.47,203.66c26-46.49,86.22-79.14,149.46-79.14,79.27,0,121.09,48.93,122.25,50.18,22,23.8,33,50.39,33,83.1,0,10.4-5.31,25.82-15.11,38.57-1.57,2-6.39,4.84-6.39,11,0,5.06,3.29,9.92,9.14,14,27.86,19.37,80.37,16.81,80.51,16.81A115.39,115.39,0,0,0,444.94,322a118.92,118.92,0,0,0,58.95-102.44C504.39,176.13,488.39,147.26,481.92,134.48ZM212.77,475.67a154.88,154.88,0,0,1-46.64-45c-32.94-47.42-34.24-95.6-20.1-136A155.5,155.5,0,0,1,203,215.75c59-45.2,94.84-5.65,99.06-1a80,80,0,0,0-4.89-10.14c-9.24-15.93-24-36.41-56.56-53.51-33.72-17.69-70.59-18.59-77.64-18.59-38.71,0-77.9,13-107.53,35.69C35.68,183.3,12.77,208.72,8.6,243c-1.08,12.31-2.75,62.8,23,118.27a248,248,0,0,0,248.3,141.61C241.78,496.26,214.05,476.24,212.77,475.67Zm250.72-98.33a7.76,7.76,0,0,0-7.92-.23,181.66,181.66,0,0,1-20.41,9.12,197.54,197.54,0,0,1-69.55,12.52c-91.67,0-171.52-63.06-171.52-144A61.12,61.12,0,0,1,200.61,228,168.72,168.72,0,0,0,161.85,278c-14.92,29.37-33,88.13,13.33,151.66,6.51,8.91,23,30,56,47.67,23.57,12.65,49,19.61,71.7,19.61,35.14,0,115.43-33.44,163-108.87A7.75,7.75,0,0,0,463.49,377.34Z"]
};
var faElementor = {
  prefix: 'fab',
  iconName: 'elementor',
  icon: [448, 512, [], "f430", "M425.6 32H22.4C10 32 0 42 0 54.4v403.2C0 470 10 480 22.4 480h403.2c12.4 0 22.4-10 22.4-22.4V54.4C448 42 438 32 425.6 32M164.3 355.5h-39.8v-199h39.8v199zm159.3 0H204.1v-39.8h119.5v39.8zm0-79.6H204.1v-39.8h119.5v39.8zm0-79.7H204.1v-39.8h119.5v39.8z"]
};
var faEllo = {
  prefix: 'fab',
  iconName: 'ello',
  icon: [496, 512, [], "f5f1", "M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm143.84 285.2C375.31 358.51 315.79 404.8 248 404.8s-127.31-46.29-143.84-111.6c-1.65-7.44 2.48-15.71 9.92-17.36 7.44-1.65 15.71 2.48 17.36 9.92 14.05 52.91 62 90.11 116.56 90.11s102.51-37.2 116.56-90.11c1.65-7.44 9.92-12.4 17.36-9.92 7.44 1.65 12.4 9.92 9.92 17.36z"]
};
var faEmber = {
  prefix: 'fab',
  iconName: 'ember',
  icon: [640, 512, [], "f423", "M639.9 254.6c-1.1-10.7-10.7-6.8-10.7-6.8s-15.6 12.1-29.3 10.7c-13.7-1.3-9.4-32-9.4-32s3-28.1-5.1-30.4c-8.1-2.4-18 7.3-18 7.3s-12.4 13.7-18.3 31.2l-1.6.5s1.9-30.6-.3-37.6c-1.6-3.5-16.4-3.2-18.8 3s-14.2 49.2-15 67.2c0 0-23.1 19.6-43.3 22.8s-25-9.4-25-9.4 54.8-15.3 52.9-59.1-44.2-27.6-49-24c-4.6 3.5-29.4 18.4-36.6 59.7-.2 1.4-.7 7.5-.7 7.5s-21.2 14.2-33 18c0 0 33-55.6-7.3-80.9-11.4-6.8-21.3-.5-27.2 5.3 13.6-17.3 46.4-64.2 36.9-105.2-5.8-24.4-18-27.1-29.2-23.1-17 6.7-23.5 16.7-23.5 16.7s-22 32-27.1 79.5-12.6 105.1-12.6 105.1-10.5 10.2-20.2 10.7-5.4-28.7-5.4-28.7 7.5-44.6 7-52.1-1.1-11.6-9.9-14.2c-8.9-2.7-18.5 8.6-18.5 8.6s-25.5 38.7-27.7 44.6l-1.3 2.4-1.3-1.6s18-52.7.8-53.5-28.5 18.8-28.5 18.8-19.6 32.8-20.4 36.5l-1.3-1.6s8.1-38.2 6.4-47.6c-1.6-9.4-10.5-7.5-10.5-7.5s-11.3-1.3-14.2 5.9-13.7 55.3-15 70.7c0 0-28.2 20.2-46.8 20.4-18.5.3-16.7-11.8-16.7-11.8s68-23.3 49.4-69.2c-8.3-11.8-18-15.5-31.7-15.3-13.7.3-30.3 8.6-41.3 33.3-5.3 11.8-6.8 23-7.8 31.5 0 0-12.3 2.4-18.8-2.9s-10 0-10 0-11.2 14-.1 18.3 28.1 6.1 28.1 6.1c1.6 7.5 6.2 19.5 19.6 29.7 20.2 15.3 58.8-1.3 58.8-1.3l15.9-8.8s.5 14.6 12.1 16.7 16.4 1 36.5-47.9c11.8-25 12.6-23.6 12.6-23.6l1.3-.3s-9.1 46.8-5.6 59.7C187.7 319.4 203 318 203 318s8.3 2.4 15-21.2 19.6-49.9 19.6-49.9h1.6s-5.6 48.1 3 63.7 30.9 5.3 30.9 5.3 15.6-7.8 18-10.2c0 0 18.5 15.8 44.6 12.9 58.3-11.5 79.1-25.9 79.1-25.9s10 24.4 41.1 26.7c35.5 2.7 54.8-18.6 54.8-18.6s-.3 13.5 12.1 18.6 20.7-22.8 20.7-22.8l20.7-57.2h1.9s1.1 37.3 21.5 43.2 47-13.7 47-13.7 6.4-3.5 5.3-14.3zm-578 5.3c.8-32 21.8-45.9 29-39 7.3 7 4.6 22-9.1 31.4-13.7 9.5-19.9 7.6-19.9 7.6zm272.8-123.8s19.1-49.7 23.6-25.5-40 96.2-40 96.2c.5-16.2 16.4-70.7 16.4-70.7zm22.8 138.4c-12.6 33-43.3 19.6-43.3 19.6s-3.5-11.8 6.4-44.9 33.3-20.2 33.3-20.2 16.2 12.4 3.6 45.5zm84.6-14.6s-3-10.5 8.1-30.6c11-20.2 19.6-9.1 19.6-9.1s9.4 10.2-1.3 25.5-26.4 14.2-26.4 14.2z"]
};
var faEmpire = {
  prefix: 'fab',
  iconName: 'empire',
  icon: [496, 512, [], "f1d1", "M287.6 54.2c-10.8-2.2-22.1-3.3-33.5-3.6V32.4c78.1 2.2 146.1 44 184.6 106.6l-15.8 9.1c-6.1-9.7-12.7-18.8-20.2-27.1l-18 15.5c-26-29.6-61.4-50.7-101.9-58.4l4.8-23.9zM53.4 322.4l23-7.7c-6.4-18.3-10-38.2-10-58.7s3.3-40.4 9.7-58.7l-22.7-7.7c3.6-10.8 8.3-21.3 13.6-31l-15.8-9.1C34 181 24.1 217.5 24.1 256s10 75 27.1 106.6l15.8-9.1c-5.3-10-9.7-20.3-13.6-31.1zM213.1 434c-40.4-8-75.8-29.1-101.9-58.7l-18 15.8c-7.5-8.6-14.4-17.7-20.2-27.4l-16 9.4c38.5 62.3 106.8 104.3 184.9 106.6v-18.3c-11.3-.3-22.7-1.7-33.5-3.6l4.7-23.8zM93.3 120.9l18 15.5c26-29.6 61.4-50.7 101.9-58.4l-4.7-23.8c10.8-2.2 22.1-3.3 33.5-3.6V32.4C163.9 34.6 95.9 76.4 57.4 139l15.8 9.1c6-9.7 12.6-18.9 20.1-27.2zm309.4 270.2l-18-15.8c-26 29.6-61.4 50.7-101.9 58.7l4.7 23.8c-10.8 1.9-22.1 3.3-33.5 3.6v18.3c78.1-2.2 146.4-44.3 184.9-106.6l-16.1-9.4c-5.7 9.7-12.6 18.8-20.1 27.4zM496 256c0 137-111 248-248 248S0 393 0 256 111 8 248 8s248 111 248 248zm-12.2 0c0-130.1-105.7-235.8-235.8-235.8S12.2 125.9 12.2 256 117.9 491.8 248 491.8 483.8 386.1 483.8 256zm-39-106.6l-15.8 9.1c5.3 9.7 10 20.2 13.6 31l-22.7 7.7c6.4 18.3 9.7 38.2 9.7 58.7s-3.6 40.4-10 58.7l23 7.7c-3.9 10.8-8.3 21-13.6 31l15.8 9.1C462 331 471.9 294.5 471.9 256s-9.9-75-27.1-106.6zm-183 177.7c16.3-3.3 30.4-11.6 40.7-23.5l51.2 44.8c11.9-13.6 21.3-29.3 27.1-46.8l-64.2-22.1c2.5-7.5 3.9-15.2 3.9-23.5s-1.4-16.1-3.9-23.5l64.5-22.1c-6.1-17.4-15.5-33.2-27.4-46.8l-51.2 44.8c-10.2-11.9-24.4-20.5-40.7-23.8l13.3-66.4c-8.6-1.9-17.7-2.8-27.1-2.8-9.4 0-18.5.8-27.1 2.8l13.3 66.4c-16.3 3.3-30.4 11.9-40.7 23.8l-51.2-44.8c-11.9 13.6-21.3 29.3-27.4 46.8l64.5 22.1c-2.5 7.5-3.9 15.2-3.9 23.5s1.4 16.1 3.9 23.5l-64.2 22.1c5.8 17.4 15.2 33.2 27.1 46.8l51.2-44.8c10.2 11.9 24.4 20.2 40.7 23.5l-13.3 66.7c8.6 1.7 17.7 2.8 27.1 2.8 9.4 0 18.5-1.1 27.1-2.8l-13.3-66.7z"]
};
var faEnvira = {
  prefix: 'fab',
  iconName: 'envira',
  icon: [448, 512, [], "f299", "M0 32c477.6 0 366.6 317.3 367.1 366.3L448 480h-26l-70.4-71.2c-39 4.2-124.4 34.5-214.4-37C47 300.3 52 214.7 0 32zm79.7 46c-49.7-23.5-5.2 9.2-5.2 9.2 45.2 31.2 66 73.7 90.2 119.9 31.5 60.2 79 139.7 144.2 167.7 65 28 34.2 12.5 6-8.5-28.2-21.2-68.2-87-91-130.2-31.7-60-61-118.6-144.2-158.1z"]
};
var faErlang = {
  prefix: 'fab',
  iconName: 'erlang',
  icon: [640, 512, [], "f39d", "M87.2 53.5H0v405h100.4c-49.7-52.6-78.8-125.3-78.7-212.1-.1-76.7 24-142.7 65.5-192.9zm238.2 9.7c-45.9.1-85.1 33.5-89.2 83.2h169.9c-1.1-49.7-34.5-83.1-80.7-83.2zm230.7-9.6h.3l-.1-.1zm.3 0c31.4 42.7 48.7 97.5 46.2 162.7.5 6 .5 11.7 0 24.1H230.2c-.2 109.7 38.9 194.9 138.6 195.3 68.5-.3 118-51 151.9-106.1l96.4 48.2c-17.4 30.9-36.5 57.8-57.9 80.8H640v-405z"]
};
var faEthereum = {
  prefix: 'fab',
  iconName: 'ethereum',
  icon: [320, 512, [], "f42e", "M311.9 260.8L160 353.6 8 260.8 160 0l151.9 260.8zM160 383.4L8 290.6 160 512l152-221.4-152 92.8z"]
};
var faEtsy = {
  prefix: 'fab',
  iconName: 'etsy',
  icon: [384, 512, [], "f2d7", "M384 348c-1.75 10.75-13.75 110-15.5 132-117.879-4.299-219.895-4.743-368.5 0v-25.5c45.457-8.948 60.627-8.019 61-35.25 1.793-72.322 3.524-244.143 0-322-1.029-28.46-12.13-26.765-61-36v-25.5c73.886 2.358 255.933 8.551 362.999-3.75-3.5 38.25-7.75 126.5-7.75 126.5H332C320.947 115.665 313.241 68 277.25 68h-137c-10.25 0-10.75 3.5-10.75 9.75V241.5c58 .5 88.5-2.5 88.5-2.5 29.77-.951 27.56-8.502 40.75-65.251h25.75c-4.407 101.351-3.91 61.829-1.75 160.25H257c-9.155-40.086-9.065-61.045-39.501-61.5 0 0-21.5-2-88-2v139c0 26 14.25 38.25 44.25 38.25H263c63.636 0 66.564-24.996 98.751-99.75H384z"]
};
var faEvernote = {
  prefix: 'fab',
  iconName: 'evernote',
  icon: [384, 512, [], "f839", "M120.82 132.21c1.6 22.31-17.55 21.59-21.61 21.59-68.93 0-73.64-1-83.58 3.34-.56.22-.74 0-.37-.37L123.79 46.45c.38-.37.6-.22.38.37-4.35 9.99-3.35 15.09-3.35 85.39zm79 308c-14.68-37.08 13-76.93 52.52-76.62 17.49 0 22.6 23.21 7.95 31.42-6.19 3.3-24.95 1.74-25.14 19.2-.05 17.09 19.67 25 31.2 24.89A45.64 45.64 0 0 0 312 393.45v-.08c0-11.63-7.79-47.22-47.54-55.34-7.72-1.54-65-6.35-68.35-50.52-3.74 16.93-17.4 63.49-43.11 69.09-8.74 1.94-69.68 7.64-112.92-36.77 0 0-18.57-15.23-28.23-57.95-3.38-15.75-9.28-39.7-11.14-62 0-18 11.14-30.45 25.07-32.2 81 0 90 2.32 101-7.8 9.82-9.24 7.8-15.5 7.8-102.78 1-8.3 7.79-30.81 53.41-24.14 6 .86 31.91 4.18 37.48 30.64l64.26 11.15c20.43 3.71 70.94 7 80.6 57.94 22.66 121.09 8.91 238.46 7.8 238.46C362.15 485.53 267.06 480 267.06 480c-18.95-.23-54.25-9.4-67.27-39.83zm80.94-204.84c-1 1.92-2.2 6 .85 7 14.09 4.93 39.75 6.84 45.88 5.53 3.11-.25 3.05-4.43 2.48-6.65-3.53-21.85-40.83-26.5-49.24-5.92z"]
};
var faExpeditedssl = {
  prefix: 'fab',
  iconName: 'expeditedssl',
  icon: [496, 512, [], "f23e", "M248 43.4C130.6 43.4 35.4 138.6 35.4 256S130.6 468.6 248 468.6 460.6 373.4 460.6 256 365.4 43.4 248 43.4zm-97.4 132.9c0-53.7 43.7-97.4 97.4-97.4s97.4 43.7 97.4 97.4v26.6c0 5-3.9 8.9-8.9 8.9h-17.7c-5 0-8.9-3.9-8.9-8.9v-26.6c0-82.1-124-82.1-124 0v26.6c0 5-3.9 8.9-8.9 8.9h-17.7c-5 0-8.9-3.9-8.9-8.9v-26.6zM389.7 380c0 9.7-8 17.7-17.7 17.7H124c-9.7 0-17.7-8-17.7-17.7V238.3c0-9.7 8-17.7 17.7-17.7h248c9.7 0 17.7 8 17.7 17.7V380zm-248-137.3v132.9c0 2.5-1.9 4.4-4.4 4.4h-8.9c-2.5 0-4.4-1.9-4.4-4.4V242.7c0-2.5 1.9-4.4 4.4-4.4h8.9c2.5 0 4.4 1.9 4.4 4.4zm141.7 48.7c0 13-7.2 24.4-17.7 30.4v31.6c0 5-3.9 8.9-8.9 8.9h-17.7c-5 0-8.9-3.9-8.9-8.9v-31.6c-10.5-6.1-17.7-17.4-17.7-30.4 0-19.7 15.8-35.4 35.4-35.4s35.5 15.8 35.5 35.4zM248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 478.3C121 486.3 17.7 383 17.7 256S121 25.7 248 25.7 478.3 129 478.3 256 375 486.3 248 486.3z"]
};
var faFacebook = {
  prefix: 'fab',
  iconName: 'facebook',
  icon: [512, 512, [], "f09a", "M504 256C504 119 393 8 256 8S8 119 8 256c0 123.78 90.69 226.38 209.25 245V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.28c-30.8 0-40.41 19.12-40.41 38.73V256h68.78l-11 71.69h-57.78V501C413.31 482.38 504 379.78 504 256z"]
};
var faFacebookF = {
  prefix: 'fab',
  iconName: 'facebook-f',
  icon: [320, 512, [], "f39e", "M279.14 288l14.22-92.66h-88.91v-60.13c0-25.35 12.42-50.06 52.24-50.06h40.42V6.26S260.43 0 225.36 0c-73.22 0-121.08 44.38-121.08 124.72v70.62H22.89V288h81.39v224h100.17V288z"]
};
var faFacebookMessenger = {
  prefix: 'fab',
  iconName: 'facebook-messenger',
  icon: [512, 512, [], "f39f", "M256.55 8C116.52 8 8 110.34 8 248.57c0 72.3 29.71 134.78 78.07 177.94 8.35 7.51 6.63 11.86 8.05 58.23A19.92 19.92 0 0 0 122 502.31c52.91-23.3 53.59-25.14 62.56-22.7C337.85 521.8 504 423.7 504 248.57 504 110.34 396.59 8 256.55 8zm149.24 185.13l-73 115.57a37.37 37.37 0 0 1-53.91 9.93l-58.08-43.47a15 15 0 0 0-18 0l-78.37 59.44c-10.46 7.93-24.16-4.6-17.11-15.67l73-115.57a37.36 37.36 0 0 1 53.91-9.93l58.06 43.46a15 15 0 0 0 18 0l78.41-59.38c10.44-7.98 24.14 4.54 17.09 15.62z"]
};
var faFacebookSquare = {
  prefix: 'fab',
  iconName: 'facebook-square',
  icon: [448, 512, [], "f082", "M400 32H48A48 48 0 0 0 0 80v352a48 48 0 0 0 48 48h137.25V327.69h-63V256h63v-54.64c0-62.15 37-96.48 93.67-96.48 27.14 0 55.52 4.84 55.52 4.84v61h-31.27c-30.81 0-40.42 19.12-40.42 38.73V256h68.78l-11 71.69h-57.78V480H400a48 48 0 0 0 48-48V80a48 48 0 0 0-48-48z"]
};
var faFantasyFlightGames = {
  prefix: 'fab',
  iconName: 'fantasy-flight-games',
  icon: [512, 512, [], "f6dc", "M256 32.86L32.86 256 256 479.14 479.14 256 256 32.86zM88.34 255.83c1.96-2 11.92-12.3 96.49-97.48 41.45-41.75 86.19-43.77 119.77-18.69 24.63 18.4 62.06 58.9 62.15 59 .68.74 1.07 2.86.58 3.38-11.27 11.84-22.68 23.54-33.5 34.69-34.21-32.31-40.52-38.24-48.51-43.95-17.77-12.69-41.4-10.13-56.98 5.1-2.17 2.13-1.79 3.43.12 5.35 2.94 2.95 28.1 28.33 35.09 35.78-11.95 11.6-23.66 22.97-35.69 34.66-12.02-12.54-24.48-25.53-36.54-38.11-21.39 21.09-41.69 41.11-61.85 60.99a42569.01 42569.01 0 0 1-41.13-40.72zm234.82 101.6c-35.49 35.43-78.09 38.14-106.99 20.47-22.08-13.5-39.38-32.08-72.93-66.84 12.05-12.37 23.79-24.42 35.37-36.31 33.02 31.91 37.06 36.01 44.68 42.09 18.48 14.74 42.52 13.67 59.32-1.8 3.68-3.39 3.69-3.64.14-7.24-10.59-10.73-21.19-21.44-31.77-32.18-1.32-1.34-3.03-2.48-.8-4.69 10.79-10.71 21.48-21.52 32.21-32.29.26-.26.65-.38 1.91-1.07 12.37 12.87 24.92 25.92 37.25 38.75 21.01-20.73 41.24-40.68 61.25-60.42 13.68 13.4 27.13 26.58 40.86 40.03-20.17 20.86-81.68 82.71-100.5 101.5zM256 0L0 256l256 256 256-256L256 0zM16 256L256 16l240 240-240 240L16 256z"]
};
var faFedex = {
  prefix: 'fab',
  iconName: 'fedex',
  icon: [640, 512, [], "f797", "M586 284.5l53.3-59.9h-62.4l-21.7 24.8-22.5-24.8H414v-16h56.1v-48.1H318.9V236h-.5c-9.6-11-21.5-14.8-35.4-14.8-28.4 0-49.8 19.4-57.3 44.9-18-59.4-97.4-57.6-121.9-14v-24.2H49v-26.2h60v-41.1H0V345h49v-77.5h48.9c-1.5 5.7-2.3 11.8-2.3 18.2 0 73.1 102.6 91.4 130.2 23.7h-42c-14.7 20.9-45.8 8.9-45.8-14.6h85.5c3.7 30.5 27.4 56.9 60.1 56.9 14.1 0 27-6.9 34.9-18.6h.5V345h212.2l22.1-25 22.3 25H640l-54-60.5zm-446.7-16.6c6.1-26.3 41.7-25.6 46.5 0h-46.5zm153.4 48.9c-34.6 0-34-62.8 0-62.8 32.6 0 34.5 62.8 0 62.8zm167.8 19.1h-94.4V169.4h95v30.2H405v33.9h55.5v28.1h-56.1v44.7h56.1v29.6zm-45.9-39.8v-24.4h56.1v-44l50.7 57-50.7 57v-45.6h-56.1zm138.6 10.3l-26.1 29.5H489l45.6-51.2-45.6-51.2h39.7l26.6 29.3 25.6-29.3h38.5l-45.4 51 46 51.4h-40.5l-26.3-29.5z"]
};
var faFedora = {
  prefix: 'fab',
  iconName: 'fedora',
  icon: [448, 512, [], "f798", "M225 32C101.3 31.7.8 131.7.4 255.4L0 425.7a53.6 53.6 0 0 0 53.6 53.9l170.2.4c123.7.3 224.3-99.7 224.6-223.4S348.7 32.3 225 32zm169.8 157.2L333 126.6c2.3-4.7 3.8-9.2 3.8-14.3v-1.6l55.2 56.1a101 101 0 0 1 2.8 22.4zM331 94.3a106.06 106.06 0 0 1 58.5 63.8l-54.3-54.6a26.48 26.48 0 0 0-4.2-9.2zM118.1 247.2a49.66 49.66 0 0 0-7.7 11.4l-8.5-8.5a85.78 85.78 0 0 1 16.2-2.9zM97 251.4l11.8 11.9-.9 8a34.74 34.74 0 0 0 2.4 12.5l-27-27.2a80.6 80.6 0 0 1 13.7-5.2zm-18.2 7.4l38.2 38.4a53.17 53.17 0 0 0-14.1 4.7L67.6 266a107 107 0 0 1 11.2-7.2zm-15.2 9.8l35.3 35.5a67.25 67.25 0 0 0-10.5 8.5L53.5 278a64.33 64.33 0 0 1 10.1-9.4zm-13.3 12.3l34.9 35a56.84 56.84 0 0 0-7.7 11.4l-35.8-35.9c2.8-3.8 5.7-7.2 8.6-10.5zm-11 14.3l36.4 36.6a48.29 48.29 0 0 0-3.6 15.2l-39.5-39.8a99.81 99.81 0 0 1 6.7-12zm-8.8 16.3l41.3 41.8a63.47 63.47 0 0 0 6.7 26.2L25.8 326c1.4-4.9 2.9-9.6 4.7-14.5zm-7.9 43l61.9 62.2a31.24 31.24 0 0 0-3.6 14.3v1.1l-55.4-55.7a88.27 88.27 0 0 1-2.9-21.9zm5.3 30.7l54.3 54.6a28.44 28.44 0 0 0 4.2 9.2 106.32 106.32 0 0 1-58.5-63.8zm-5.3-37a80.69 80.69 0 0 1 2.1-17l72.2 72.5a37.59 37.59 0 0 0-9.9 8.7zm253.3-51.8l-42.6-.1-.1 56c-.2 69.3-64.4 115.8-125.7 102.9-5.7 0-19.9-8.7-19.9-24.2a24.89 24.89 0 0 1 24.5-24.6c6.3 0 6.3 1.6 15.7 1.6a55.91 55.91 0 0 0 56.1-55.9l.1-47c0-4.5-4.5-9-8.9-9l-33.6-.1c-32.6-.1-32.5-49.4.1-49.3l42.6.1.1-56a105.18 105.18 0 0 1 105.6-105 86.35 86.35 0 0 1 20.2 2.3c11.2 1.8 19.9 11.9 19.9 24 0 15.5-14.9 27.8-30.3 23.9-27.4-5.9-65.9 14.4-66 54.9l-.1 47a8.94 8.94 0 0 0 8.9 9l33.6.1c32.5.2 32.4 49.5-.2 49.4zm23.5-.3a35.58 35.58 0 0 0 7.6-11.4l8.5 8.5a102 102 0 0 1-16.1 2.9zm21-4.2L308.6 280l.9-8.1a34.74 34.74 0 0 0-2.4-12.5l27 27.2a74.89 74.89 0 0 1-13.7 5.3zm18-7.4l-38-38.4c4.9-1.1 9.6-2.4 13.7-4.7l36.2 35.9c-3.8 2.5-7.9 5-11.9 7.2zm15.5-9.8l-35.3-35.5a61.06 61.06 0 0 0 10.5-8.5l34.9 35a124.56 124.56 0 0 1-10.1 9zm13.2-12.3l-34.9-35a63.18 63.18 0 0 0 7.7-11.4l35.8 35.9a130.28 130.28 0 0 1-8.6 10.5zm11-14.3l-36.4-36.6a48.29 48.29 0 0 0 3.6-15.2l39.5 39.8a87.72 87.72 0 0 1-6.7 12zm13.5-30.9a140.63 140.63 0 0 1-4.7 14.3L345.6 190a58.19 58.19 0 0 0-7.1-26.2zm1-5.6l-71.9-72.1a32 32 0 0 0 9.9-9.2l64.3 64.7a90.93 90.93 0 0 1-2.3 16.6z"]
};
var faFigma = {
  prefix: 'fab',
  iconName: 'figma',
  icon: [384, 512, [], "f799", "M277 170.7A85.35 85.35 0 0 0 277 0H106.3a85.3 85.3 0 0 0 0 170.6 85.35 85.35 0 0 0 0 170.7 85.35 85.35 0 1 0 85.3 85.4v-256zm0 0a85.3 85.3 0 1 0 85.3 85.3 85.31 85.31 0 0 0-85.3-85.3z"]
};
var faFirefox = {
  prefix: 'fab',
  iconName: 'firefox',
  icon: [512, 512, [], "f269", "M503.52,241.48c-.12-1.56-.24-3.12-.24-4.68v-.12l-.36-4.68v-.12a245.86,245.86,0,0,0-7.32-41.15c0-.12,0-.12-.12-.24l-1.08-4c-.12-.24-.12-.48-.24-.6-.36-1.2-.72-2.52-1.08-3.72-.12-.24-.12-.6-.24-.84-.36-1.2-.72-2.4-1.08-3.48-.12-.36-.24-.6-.36-1-.36-1.2-.72-2.28-1.2-3.48l-.36-1.08c-.36-1.08-.84-2.28-1.2-3.36a8.27,8.27,0,0,0-.36-1c-.48-1.08-.84-2.28-1.32-3.36-.12-.24-.24-.6-.36-.84-.48-1.2-1-2.28-1.44-3.48,0-.12-.12-.24-.12-.36-1.56-3.84-3.24-7.68-5-11.4l-.36-.72c-.48-1-.84-1.8-1.32-2.64-.24-.48-.48-1.08-.72-1.56-.36-.84-.84-1.56-1.2-2.4-.36-.6-.6-1.2-1-1.8s-.84-1.44-1.2-2.28c-.36-.6-.72-1.32-1.08-1.92s-.84-1.44-1.2-2.16a18.07,18.07,0,0,0-1.2-2c-.36-.72-.84-1.32-1.2-2s-.84-1.32-1.2-2-.84-1.32-1.2-1.92-.84-1.44-1.32-2.16a15.63,15.63,0,0,0-1.2-1.8L463.2,119a15.63,15.63,0,0,0-1.2-1.8c-.48-.72-1.08-1.56-1.56-2.28-.36-.48-.72-1.08-1.08-1.56l-1.8-2.52c-.36-.48-.6-.84-1-1.32-1-1.32-1.8-2.52-2.76-3.72a248.76,248.76,0,0,0-23.51-26.64A186.82,186.82,0,0,0,412,62.46c-4-3.48-8.16-6.72-12.48-9.84a162.49,162.49,0,0,0-24.6-15.12c-2.4-1.32-4.8-2.52-7.2-3.72a254,254,0,0,0-55.43-19.56c-1.92-.36-3.84-.84-5.64-1.2h-.12c-1-.12-1.8-.36-2.76-.48a236.35,236.35,0,0,0-38-4H255.14a234.62,234.62,0,0,0-45.48,5c-33.59,7.08-63.23,21.24-82.91,39-1.08,1-1.92,1.68-2.4,2.16l-.48.48H124l-.12.12.12-.12a.12.12,0,0,0,.12-.12l-.12.12a.42.42,0,0,1,.24-.12c14.64-8.76,34.92-16,49.44-19.56l5.88-1.44c.36-.12.84-.12,1.2-.24,1.68-.36,3.36-.72,5.16-1.08.24,0,.6-.12.84-.12C250.94,20.94,319.34,40.14,367,85.61a171.49,171.49,0,0,1,26.88,32.76c30.36,49.2,27.48,111.11,3.84,147.59-34.44,53-111.35,71.27-159,24.84a84.19,84.19,0,0,1-25.56-59,74.05,74.05,0,0,1,6.24-31c1.68-3.84,13.08-25.67,18.24-24.59-13.08-2.76-37.55,2.64-54.71,28.19-15.36,22.92-14.52,58.2-5,83.28a132.85,132.85,0,0,1-12.12-39.24c-12.24-82.55,43.31-153,94.31-170.51-27.48-24-96.47-22.31-147.71,15.36-29.88,22-51.23,53.16-62.51,90.36,1.68-20.88,9.6-52.08,25.8-83.88-17.16,8.88-39,37-49.8,62.88-15.6,37.43-21,82.19-16.08,124.79.36,3.24.72,6.36,1.08,9.6,19.92,117.11,122,206.38,244.78,206.38C392.77,503.42,504,392.19,504,255,503.88,250.48,503.76,245.92,503.52,241.48Z"]
};
var faFirefoxBrowser = {
  prefix: 'fab',
  iconName: 'firefox-browser',
  icon: [512, 512, [], "f907", "M189.37,152.86Zm-58.74-29.37C130.79,123.5,130.71,123.5,130.63,123.49Zm351.42,45.35c-10.61-25.5-32.08-53-48.94-61.73,13.72,26.89,21.67,53.88,24.7,74,0,0,0,.14.05.41-27.58-68.75-74.35-96.47-112.55-156.83-1.93-3.05-3.86-6.11-5.74-9.33-1-1.65-1.86-3.34-2.69-5.05A44.88,44.88,0,0,1,333.24.69a.63.63,0,0,0-.55-.66.9.9,0,0,0-.46,0l-.12.07-.18.1.1-.14c-54.23,31.77-76.72,87.38-82.5,122.78a130,130,0,0,0-48.33,12.33,6.25,6.25,0,0,0-3.09,7.75,6.13,6.13,0,0,0,7.79,3.79l.52-.21a117.84,117.84,0,0,1,42.11-11l1.42-.1c2-.12,4-.2,6-.22A122.61,122.61,0,0,1,291,140c.67.2,1.32.42,2,.63,1.89.57,3.76,1.2,5.62,1.87,1.36.5,2.71,1,4.05,1.58,1.09.44,2.18.88,3.25,1.35q2.52,1.13,5,2.35c.75.37,1.5.74,2.25,1.13q2.4,1.26,4.74,2.63,1.51.87,3,1.8a124.89,124.89,0,0,1,42.66,44.13c-13-9.15-36.35-18.19-58.82-14.28,87.74,43.86,64.18,194.9-57.39,189.2a108.43,108.43,0,0,1-31.74-6.12c-2.42-.91-4.8-1.89-7.16-2.93-1.38-.63-2.76-1.27-4.12-2C174.5,346,149.9,316.92,146.83,281.59c0,0,11.25-41.95,80.62-41.95,7.5,0,28.93-20.92,29.33-27-.09-2-42.54-18.87-59.09-35.18-8.85-8.71-13.05-12.91-16.77-16.06a69.58,69.58,0,0,0-6.31-4.77A113.05,113.05,0,0,1,173.92,97c-25.06,11.41-44.55,29.45-58.71,45.37h-.12c-9.67-12.25-9-52.65-8.43-61.08-.12-.53-7.22,3.68-8.15,4.31a178.54,178.54,0,0,0-23.84,20.43A214,214,0,0,0,51.9,133.36l0,0a.08.08,0,0,1,0,0,205.84,205.84,0,0,0-32.73,73.9c-.06.27-2.33,10.21-4,22.48q-.42,2.87-.78,5.74c-.57,3.69-1,7.71-1.44,14,0,.24,0,.48-.05.72-.18,2.71-.34,5.41-.49,8.12,0,.41,0,.82,0,1.24,0,134.7,109.21,243.89,243.92,243.89,120.64,0,220.82-87.58,240.43-202.62.41-3.12.74-6.26,1.11-9.41,4.85-41.83-.54-85.79-15.82-122.55Z"]
};
var faFirstOrder = {
  prefix: 'fab',
  iconName: 'first-order',
  icon: [448, 512, [], "f2b0", "M12.9 229.2c.1-.1.2-.3.3-.4 0 .1 0 .3-.1.4h-.2zM224 96.6c-7.1 0-14.6.6-21.4 1.7l3.7 67.4-22-64c-14.3 3.7-27.7 9.4-40 16.6l29.4 61.4-45.1-50.9c-11.4 8.9-21.7 19.1-30.6 30.9l50.6 45.4-61.1-29.7c-7.1 12.3-12.9 25.7-16.6 40l64.3 22.6-68-4c-.9 7.1-1.4 14.6-1.4 22s.6 14.6 1.4 21.7l67.7-4-64 22.6c3.7 14.3 9.4 27.7 16.6 40.3l61.1-29.7L97.7 352c8.9 11.7 19.1 22.3 30.9 30.9l44.9-50.9-29.5 61.4c12.3 7.4 25.7 13.1 40 16.9l22.3-64.6-4 68c7.1 1.1 14.6 1.7 21.7 1.7 7.4 0 14.6-.6 21.7-1.7l-4-68.6 22.6 65.1c14.3-4 27.7-9.4 40-16.9L274.9 332l44.9 50.9c11.7-8.9 22-19.1 30.6-30.9l-50.6-45.1 61.1 29.4c7.1-12.3 12.9-25.7 16.6-40.3l-64-22.3 67.4 4c1.1-7.1 1.4-14.3 1.4-21.7s-.3-14.9-1.4-22l-67.7 4 64-22.3c-3.7-14.3-9.1-28-16.6-40.3l-60.9 29.7 50.6-45.4c-8.9-11.7-19.1-22-30.6-30.9l-45.1 50.9 29.4-61.1c-12.3-7.4-25.7-13.1-40-16.9L241.7 166l4-67.7c-7.1-1.2-14.3-1.7-21.7-1.7zM443.4 128v256L224 512 4.6 384V128L224 0l219.4 128zm-17.1 10.3L224 20.9 21.7 138.3v235.1L224 491.1l202.3-117.7V138.3zM224 37.1l187.7 109.4v218.9L224 474.9 36.3 365.4V146.6L224 37.1zm0 50.9c-92.3 0-166.9 75.1-166.9 168 0 92.6 74.6 167.7 166.9 167.7 92 0 166.9-75.1 166.9-167.7 0-92.9-74.9-168-166.9-168z"]
};
var faFirstOrderAlt = {
  prefix: 'fab',
  iconName: 'first-order-alt',
  icon: [496, 512, [], "f50a", "M248 8C111.03 8 0 119.03 0 256s111.03 248 248 248 248-111.03 248-248S384.97 8 248 8zm0 488.21C115.34 496.21 7.79 388.66 7.79 256S115.34 15.79 248 15.79 488.21 123.34 488.21 256 380.66 496.21 248 496.21zm0-459.92C126.66 36.29 28.29 134.66 28.29 256S126.66 475.71 248 475.71 467.71 377.34 467.71 256 369.34 36.29 248 36.29zm0 431.22c-116.81 0-211.51-94.69-211.51-211.51S131.19 44.49 248 44.49 459.51 139.19 459.51 256 364.81 467.51 248 467.51zm186.23-162.98a191.613 191.613 0 0 1-20.13 48.69l-74.13-35.88 61.48 54.82a193.515 193.515 0 0 1-37.2 37.29l-54.8-61.57 35.88 74.27a190.944 190.944 0 0 1-48.63 20.23l-27.29-78.47 4.79 82.93c-8.61 1.18-17.4 1.8-26.33 1.8s-17.72-.62-26.33-1.8l4.76-82.46-27.15 78.03a191.365 191.365 0 0 1-48.65-20.2l35.93-74.34-54.87 61.64a193.85 193.85 0 0 1-37.22-37.28l61.59-54.9-74.26 35.93a191.638 191.638 0 0 1-20.14-48.69l77.84-27.11-82.23 4.76c-1.16-8.57-1.78-17.32-1.78-26.21 0-9 .63-17.84 1.82-26.51l82.38 4.77-77.94-27.16a191.726 191.726 0 0 1 20.23-48.67l74.22 35.92-61.52-54.86a193.85 193.85 0 0 1 37.28-37.22l54.76 61.53-35.83-74.17a191.49 191.49 0 0 1 48.65-20.13l26.87 77.25-4.71-81.61c8.61-1.18 17.39-1.8 26.32-1.8s17.71.62 26.32 1.8l-4.74 82.16 27.05-77.76c17.27 4.5 33.6 11.35 48.63 20.17l-35.82 74.12 54.72-61.47a193.13 193.13 0 0 1 37.24 37.23l-61.45 54.77 74.12-35.86a191.515 191.515 0 0 1 20.2 48.65l-77.81 27.1 82.24-4.75c1.19 8.66 1.82 17.5 1.82 26.49 0 8.88-.61 17.63-1.78 26.19l-82.12-4.75 77.72 27.09z"]
};
var faFirstdraft = {
  prefix: 'fab',
  iconName: 'firstdraft',
  icon: [384, 512, [], "f3a1", "M384 192h-64v128H192v128H0v-25.6h166.4v-128h128v-128H384V192zm-25.6 38.4v128h-128v128H64V512h192V384h128V230.4h-25.6zm25.6 192h-89.6V512H320v-64h64v-25.6zM0 0v384h128V256h128V128h128V0H0z"]
};
var faFlickr = {
  prefix: 'fab',
  iconName: 'flickr',
  icon: [448, 512, [], "f16e", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM144.5 319c-35.1 0-63.5-28.4-63.5-63.5s28.4-63.5 63.5-63.5 63.5 28.4 63.5 63.5-28.4 63.5-63.5 63.5zm159 0c-35.1 0-63.5-28.4-63.5-63.5s28.4-63.5 63.5-63.5 63.5 28.4 63.5 63.5-28.4 63.5-63.5 63.5z"]
};
var faFlipboard = {
  prefix: 'fab',
  iconName: 'flipboard',
  icon: [448, 512, [], "f44d", "M0 32v448h448V32H0zm358.4 179.2h-89.6v89.6h-89.6v89.6H89.6V121.6h268.8v89.6z"]
};
var faFly = {
  prefix: 'fab',
  iconName: 'fly',
  icon: [384, 512, [], "f417", "M197.8 427.8c12.9 11.7 33.7 33.3 33.2 50.7 0 .8-.1 1.6-.1 2.5-1.8 19.8-18.8 31.1-39.1 31-25-.1-39.9-16.8-38.7-35.8 1-16.2 20.5-36.7 32.4-47.6 2.3-2.1 2.7-2.7 5.6-3.6 3.4 0 3.9.3 6.7 2.8zM331.9 67.3c-16.3-25.7-38.6-40.6-63.3-52.1C243.1 4.5 214-.2 192 0c-44.1 0-71.2 13.2-81.1 17.3C57.3 45.2 26.5 87.2 28 158.6c7.1 82.2 97 176 155.8 233.8 1.7 1.6 4.5 4.5 6.2 5.1l3.3.1c2.1-.7 1.8-.5 3.5-2.1 52.3-49.2 140.7-145.8 155.9-215.7 7-39.2 3.1-72.5-20.8-112.5zM186.8 351.9c-28-51.1-65.2-130.7-69.3-189-3.4-47.5 11.4-131.2 69.3-136.7v325.7zM328.7 180c-16.4 56.8-77.3 128-118.9 170.3C237.6 298.4 275 217 277 158.4c1.6-45.9-9.8-105.8-48-131.4 88.8 18.3 115.5 98.1 99.7 153z"]
};
var faFontAwesome = {
  prefix: 'fab',
  iconName: 'font-awesome',
  icon: [448, 512, [], "f2b4", "M397.8 32H50.2C22.7 32 0 54.7 0 82.2v347.6C0 457.3 22.7 480 50.2 480h347.6c27.5 0 50.2-22.7 50.2-50.2V82.2c0-27.5-22.7-50.2-50.2-50.2zm-45.4 284.3c0 4.2-3.6 6-7.8 7.8-16.7 7.2-34.6 13.7-53.8 13.7-26.9 0-39.4-16.7-71.7-16.7-23.3 0-47.8 8.4-67.5 17.3-1.2.6-2.4.6-3.6 1.2V385c0 1.8 0 3.6-.6 4.8v1.2c-2.4 8.4-10.2 14.3-19.1 14.3-11.3 0-20.3-9-20.3-20.3V166.4c-7.8-6-13.1-15.5-13.1-26.3 0-18.5 14.9-33.5 33.5-33.5 18.5 0 33.5 14.9 33.5 33.5 0 10.8-4.8 20.3-13.1 26.3v18.5c1.8-.6 3.6-1.2 5.4-2.4 18.5-7.8 40.6-14.3 61.5-14.3 22.7 0 40.6 6 60.9 13.7 4.2 1.8 8.4 2.4 13.1 2.4 22.7 0 47.8-16.1 53.8-16.1 4.8 0 9 3.6 9 7.8v140.3z"]
};
var faFontAwesomeAlt = {
  prefix: 'fab',
  iconName: 'font-awesome-alt',
  icon: [448, 512, [], "f35c", "M339.3 171.2c-6 0-29.9 15.5-52.6 15.5-4.2 0-8.4-.6-12.5-2.4-19.7-7.8-37-13.7-59.1-13.7-20.3 0-41.8 6.6-59.7 13.7-1.8.6-3.6 1.2-4.8 1.8v-17.9c7.8-6 12.5-14.9 12.5-25.7 0-17.9-14.3-32.3-32.3-32.3s-32.3 14.3-32.3 32.3c0 10.2 4.8 19.7 12.5 25.7v212.1c0 10.8 9 19.7 19.7 19.7 9 0 16.1-6 18.5-13.7V385c.6-1.8.6-3 .6-4.8V336c1.2 0 2.4-.6 3-1.2 19.7-8.4 43-16.7 65.7-16.7 31.1 0 43 16.1 69.3 16.1 18.5 0 36.4-6.6 52-13.7 4.2-1.8 7.2-3.6 7.2-7.8V178.3c1.8-4.1-2.3-7.1-7.7-7.1zM397.8 32H50.2C22.7 32 0 54.7 0 82.2v347.6C0 457.3 22.7 480 50.2 480h347.6c27.5 0 50.2-22.7 50.2-50.2V82.2c0-27.5-22.7-50.2-50.2-50.2zm14.3 397.7c0 7.8-6.6 14.3-14.3 14.3H50.2c-7.8 0-14.3-6.6-14.3-14.3V82.2c0-7.8 6.6-14.3 14.3-14.3h347.6v-.1c7.8 0 14.3 6.6 14.3 14.3z"]
};
var faFontAwesomeFlag = {
  prefix: 'fab',
  iconName: 'font-awesome-flag',
  icon: [448, 512, [], "f425", "M444.373 359.424c0 7.168-6.144 10.24-13.312 13.312-28.672 12.288-59.392 23.552-92.16 23.552-46.08 0-67.584-28.672-122.88-28.672-39.936 0-81.92 14.336-115.712 29.696-2.048 1.024-4.096 1.024-6.144 2.048v77.824c0 21.405-16.122 34.816-33.792 34.816-19.456 0-34.816-15.36-34.816-34.816V102.4C12.245 92.16 3.029 75.776 3.029 57.344 3.029 25.6 28.629 0 60.373 0s57.344 25.6 57.344 57.344c0 18.432-8.192 34.816-22.528 45.056v31.744c4.124-1.374 58.768-28.672 114.688-28.672 65.27 0 97.676 27.648 126.976 27.648 38.912 0 81.92-27.648 92.16-27.648 8.192 0 15.36 6.144 15.36 13.312v240.64z"]
};
var faFontAwesomeLogoFull = {
  prefix: 'fab',
  iconName: 'font-awesome-logo-full',
  icon: [3992, 512, ["Font Awesome"], "f4e6", "M454.6 0H57.4C25.9 0 0 25.9 0 57.4v397.3C0 486.1 25.9 512 57.4 512h397.3c31.4 0 57.4-25.9 57.4-57.4V57.4C512 25.9 486.1 0 454.6 0zm-58.9 324.9c0 4.8-4.1 6.9-8.9 8.9-19.2 8.1-39.7 15.7-61.5 15.7-40.5 0-68.7-44.8-163.2 2.5v51.8c0 30.3-45.7 30.2-45.7 0v-250c-9-7-15-17.9-15-30.3 0-21 17.1-38.2 38.2-38.2 21 0 38.2 17.1 38.2 38.2 0 12.2-5.8 23.2-14.9 30.2v21c37.1-12 65.5-34.4 146.1-3.4 26.6 11.4 68.7-15.7 76.5-15.7 5.5 0 10.3 4.1 10.3 8.9v160.4zm432.9-174.2h-137v70.1H825c39.8 0 40.4 62.2 0 62.2H691.6v105.6c0 45.5-70.7 46.4-70.7 0V128.3c0-22 18-39.8 39.8-39.8h167.8c39.6 0 40.5 62.2.1 62.2zm191.1 23.4c-169.3 0-169.1 252.4 0 252.4 169.9 0 169.9-252.4 0-252.4zm0 196.1c-81.6 0-82.1-139.8 0-139.8 82.5 0 82.4 139.8 0 139.8zm372.4 53.4c-17.5 0-31.4-13.9-31.4-31.4v-117c0-62.4-72.6-52.5-99.1-16.4v133.4c0 41.5-63.3 41.8-63.3 0V208c0-40 63.1-41.6 63.1 0v3.4c43.3-51.6 162.4-60.4 162.4 39.3v141.5c.3 30.4-31.5 31.4-31.7 31.4zm179.7 2.9c-44.3 0-68.3-22.9-68.3-65.8V235.2H1488c-35.6 0-36.7-55.3 0-55.3h15.5v-37.3c0-41.3 63.8-42.1 63.8 0v37.5h24.9c35.4 0 35.7 55.3 0 55.3h-24.9v108.5c0 29.6 26.1 26.3 27.4 26.3 31.4 0 52.6 56.3-22.9 56.3zM1992 123c-19.5-50.2-95.5-50-114.5 0-107.3 275.7-99.5 252.7-99.5 262.8 0 42.8 58.3 51.2 72.1 14.4l13.5-35.9H2006l13 35.9c14.2 37.7 72.1 27.2 72.1-14.4 0-10.1 5.3 6.8-99.1-262.8zm-108.9 179.1l51.7-142.9 51.8 142.9h-103.5zm591.3-85.6l-53.7 176.3c-12.4 41.2-72 41-84 0l-42.3-135.9-42.3 135.9c-12.4 40.9-72 41.2-84.5 0l-54.2-176.3c-12.5-39.4 49.8-56.1 60.2-16.9L2213 342l45.3-139.5c10.9-32.7 59.6-34.7 71.2 0l45.3 139.5 39.3-142.4c10.3-38.3 72.6-23.8 60.3 16.9zm275.4 75.1c0-42.4-33.9-117.5-119.5-117.5-73.2 0-124.4 56.3-124.4 126 0 77.2 55.3 126.4 128.5 126.4 31.7 0 93-11.5 93-39.8 0-18.3-21.1-31.5-39.3-22.4-49.4 26.2-109 8.4-115.9-43.8h148.3c16.3 0 29.3-13.4 29.3-28.9zM2571 277.7c9.5-73.4 113.9-68.6 118.6 0H2571zm316.7 148.8c-31.4 0-81.6-10.5-96.6-31.9-12.4-17 2.5-39.8 21.8-39.8 16.3 0 36.8 22.9 77.7 22.9 27.4 0 40.4-11 40.4-25.8 0-39.8-142.9-7.4-142.9-102 0-40.4 35.3-75.7 98.6-75.7 31.4 0 74.1 9.9 87.6 29.4 10.8 14.8-1.4 36.2-20.9 36.2-15.1 0-26.7-17.3-66.2-17.3-22.9 0-37.8 10.5-37.8 23.8 0 35.9 142.4 6 142.4 103.1-.1 43.7-37.4 77.1-104.1 77.1zm266.8-252.4c-169.3 0-169.1 252.4 0 252.4 170.1 0 169.6-252.4 0-252.4zm0 196.1c-81.8 0-82-139.8 0-139.8 82.5 0 82.4 139.8 0 139.8zm476.9 22V268.7c0-53.8-61.4-45.8-85.7-10.5v134c0 41.3-63.8 42.1-63.8 0V268.7c0-52.1-59.5-47.4-85.7-10.1v133.6c0 41.5-63.3 41.8-63.3 0V208c0-40 63.1-41.6 63.1 0v3.4c9.9-14.4 41.8-37.3 78.6-37.3 35.3 0 57.7 16.4 66.7 43.8 13.9-21.8 45.8-43.8 82.6-43.8 44.3 0 70.7 23.4 70.7 72.7v145.3c.5 17.3-13.5 31.4-31.9 31.4 3.5.1-31.3 1.1-31.3-31.3zM3992 291.6c0-42.4-32.4-117.5-117.9-117.5-73.2 0-127.5 56.3-127.5 126 0 77.2 58.3 126.4 131.6 126.4 31.7 0 91.5-11.5 91.5-39.8 0-18.3-21.1-31.5-39.3-22.4-49.4 26.2-110.5 8.4-117.5-43.8h149.8c16.3 0 29.1-13.4 29.3-28.9zm-180.5-13.9c9.7-74.4 115.9-68.3 120.1 0h-120.1z"]
};
var faFonticons = {
  prefix: 'fab',
  iconName: 'fonticons',
  icon: [448, 512, [], "f280", "M0 32v448h448V32zm187 140.9c-18.4 0-19 9.9-19 27.4v23.3c0 2.4-3.5 4.4-.6 4.4h67.4l-11.1 37.3H168v112.9c0 5.8-2 6.7 3.2 7.3l43.5 4.1v25.1H84V389l21.3-2c5.2-.6 6.7-2.3 6.7-7.9V267.7c0-2.3-2.9-2.3-5.8-2.3H84V228h28v-21c0-49.6 26.5-70 77.3-70 34.1 0 64.7 8.2 64.7 52.8l-50.7 6.1c.3-18.7-4.4-23-16.3-23zm74.3 241.8v-25.1l20.4-2.6c5.2-.6 7.6-1.7 7.6-7.3V271.8c0-4.1-2.9-6.7-6.7-7.9l-24.2-6.4 6.7-29.5h80.2v151.7c0 5.8-2.6 6.4 2.9 7.3l15.7 2.6v25.1zm80.8-255.5l9 33.2-7.3 7.3-31.2-16.6-31.2 16.6-7.3-7.3 9-33.2-21.8-24.2 3.5-9.6h27.7l15.5-28h9.3l15.5 28h27.7l3.5 9.6z"]
};
var faFonticonsFi = {
  prefix: 'fab',
  iconName: 'fonticons-fi',
  icon: [384, 512, [], "f3a2", "M114.4 224h92.4l-15.2 51.2h-76.4V433c0 8-2.8 9.2 4.4 10l59.6 5.6V483H0v-35.2l29.2-2.8c7.2-.8 9.2-3.2 9.2-10.8V278.4c0-3.2-4-3.2-8-3.2H0V224h38.4v-28.8c0-68 36.4-96 106-96 46.8 0 88.8 11.2 88.8 72.4l-69.6 8.4c.4-25.6-6-31.6-22.4-31.6-25.2 0-26 13.6-26 37.6v32c0 3.2-4.8 6-.8 6zM384 483H243.2v-34.4l28-3.6c7.2-.8 10.4-2.4 10.4-10V287c0-5.6-4-9.2-9.2-10.8l-33.2-8.8 9.2-40.4h110v208c0 8-3.6 8.8 4 10l21.6 3.6V483zm-30-347.2l12.4 45.6-10 10-42.8-22.8-42.8 22.8-10-10 12.4-45.6-30-36.4 4.8-10h38L307.2 51H320l21.2 38.4h38l4.8 13.2-30 33.2z"]
};
var faFortAwesome = {
  prefix: 'fab',
  iconName: 'fort-awesome',
  icon: [512, 512, [], "f286", "M489.2 287.9h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6V146.2c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6v-32c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32h-36.6v-32c0-6-8-4.6-11.7-4.6v-38c8.3-2 17.1-3.4 25.7-3.4 10.9 0 20.9 4.3 31.4 4.3 4.6 0 27.7-1.1 27.7-8v-60c0-2.6-2-4.6-4.6-4.6-5.1 0-15.1 4.3-24 4.3-9.7 0-20.9-4.3-32.6-4.3-8 0-16 1.1-23.7 2.9v-4.9c5.4-2.6 9.1-8.3 9.1-14.3 0-20.7-31.4-20.8-31.4 0 0 6 3.7 11.7 9.1 14.3v111.7c-3.7 0-11.7-1.4-11.7 4.6v32h-36.6v-32c0-2.6-2-4.6-4.6-4.6h-27.4c-2.6 0-4.6 2-4.6 4.6v32H128v-32c0-2.6-2-4.6-4.6-4.6H96c-2.6 0-4.6 2-4.6 4.6v178.3H54.8v-32c0-2.6-2-4.6-4.6-4.6H22.8c-2.6 0-4.6 2-4.6 4.6V512h182.9v-96c0-72.6 109.7-72.6 109.7 0v96h182.9V292.5c.1-2.6-1.9-4.6-4.5-4.6zm-288.1-4.5c0 2.6-2 4.6-4.6 4.6h-27.4c-2.6 0-4.6-2-4.6-4.6v-64c0-2.6 2-4.6 4.6-4.6h27.4c2.6 0 4.6 2 4.6 4.6v64zm146.4 0c0 2.6-2 4.6-4.6 4.6h-27.4c-2.6 0-4.6-2-4.6-4.6v-64c0-2.6 2-4.6 4.6-4.6h27.4c2.6 0 4.6 2 4.6 4.6v64z"]
};
var faFortAwesomeAlt = {
  prefix: 'fab',
  iconName: 'fort-awesome-alt',
  icon: [512, 512, [], "f3a3", "M208 237.4h-22.2c-2.1 0-3.7 1.6-3.7 3.7v51.7c0 2.1 1.6 3.7 3.7 3.7H208c2.1 0 3.7-1.6 3.7-3.7v-51.7c0-2.1-1.6-3.7-3.7-3.7zm118.2 0H304c-2.1 0-3.7 1.6-3.7 3.7v51.7c0 2.1 1.6 3.7 3.7 3.7h22.2c2.1 0 3.7-1.6 3.7-3.7v-51.7c-.1-2.1-1.7-3.7-3.7-3.7zm132-125.1c-2.3-3.2-4.6-6.4-7.1-9.5-9.8-12.5-20.8-24-32.8-34.4-4.5-3.9-9.1-7.6-13.9-11.2-1.6-1.2-3.2-2.3-4.8-3.5C372 34.1 340.3 20 306 13c-16.2-3.3-32.9-5-50-5s-33.9 1.7-50 5c-34.3 7.1-66 21.2-93.3 40.8-1.6 1.1-3.2 2.3-4.8 3.5-4.8 3.6-9.4 7.3-13.9 11.2-3 2.6-5.9 5.3-8.8 8s-5.7 5.5-8.4 8.4c-5.5 5.7-10.7 11.8-15.6 18-2.4 3.1-4.8 6.3-7.1 9.5C25.2 153 8.3 202.5 8.3 256c0 2 .1 4 .1 6 .1.7.1 1.3.1 2 .1 1.3.1 2.7.2 4 0 .8.1 1.5.1 2.3 0 1.3.1 2.5.2 3.7.1.8.1 1.6.2 2.4.1 1.1.2 2.3.3 3.5 0 .8.1 1.6.2 2.4.1 1.2.3 2.4.4 3.6.1.8.2 1.5.3 2.3.1 1.3.3 2.6.5 3.9.1.6.2 1.3.3 1.9l.9 5.7c.1.6.2 1.1.3 1.7.3 1.3.5 2.7.8 4 .2.8.3 1.6.5 2.4.2 1 .5 2.1.7 3.2.2.9.4 1.7.6 2.6.2 1 .4 2 .7 3 .2.9.5 1.8.7 2.7.3 1 .5 1.9.8 2.9.3.9.5 1.8.8 2.7.2.9.5 1.9.8 2.8s.5 1.8.8 2.7c.3 1 .6 1.9.9 2.8.6 1.6 1.1 3.3 1.7 4.9.4 1 .7 1.9 1 2.8.3 1 .7 2 1.1 3 .3.8.6 1.5.9 2.3l1.2 3c.3.7.6 1.5.9 2.2.4 1 .9 2 1.3 3l.9 2.1c.5 1 .9 2 1.4 3 .3.7.6 1.3.9 2 .5 1 1 2.1 1.5 3.1.2.6.5 1.1.8 1.7.6 1.1 1.1 2.2 1.7 3.3.1.2.2.3.3.5 2.2 4.1 4.4 8.2 6.8 12.2.2.4.5.8.7 1.2.7 1.1 1.3 2.2 2 3.3.3.5.6.9.9 1.4.6 1.1 1.3 2.1 2 3.2.3.5.6.9.9 1.4.7 1.1 1.4 2.1 2.1 3.2.2.4.5.8.8 1.2.7 1.1 1.5 2.2 2.3 3.3.2.2.3.5.5.7 37.5 51.7 94.4 88.5 160 99.4.9.1 1.7.3 2.6.4 1 .2 2.1.4 3.1.5s1.9.3 2.8.4c1 .2 2 .3 3 .4.9.1 1.9.2 2.9.3s1.9.2 2.9.3 2.1.2 3.1.3c.9.1 1.8.1 2.7.2 1.1.1 2.3.1 3.4.2.8 0 1.7.1 2.5.1 1.3 0 2.6.1 3.9.1.7.1 1.4.1 2.1.1 2 .1 4 .1 6 .1s4-.1 6-.1c.7 0 1.4-.1 2.1-.1 1.3 0 2.6 0 3.9-.1.8 0 1.7-.1 2.5-.1 1.1-.1 2.3-.1 3.4-.2.9 0 1.8-.1 2.7-.2 1-.1 2.1-.2 3.1-.3s1.9-.2 2.9-.3c.9-.1 1.9-.2 2.9-.3s2-.3 3-.4 1.9-.3 2.8-.4c1-.2 2.1-.3 3.1-.5.9-.1 1.7-.3 2.6-.4 65.6-11 122.5-47.7 160.1-102.4.2-.2.3-.5.5-.7.8-1.1 1.5-2.2 2.3-3.3.2-.4.5-.8.8-1.2.7-1.1 1.4-2.1 2.1-3.2.3-.5.6-.9.9-1.4.6-1.1 1.3-2.1 2-3.2.3-.5.6-.9.9-1.4.7-1.1 1.3-2.2 2-3.3.2-.4.5-.8.7-1.2 2.4-4 4.6-8.1 6.8-12.2.1-.2.2-.3.3-.5.6-1.1 1.1-2.2 1.7-3.3.2-.6.5-1.1.8-1.7.5-1 1-2.1 1.5-3.1.3-.7.6-1.3.9-2 .5-1 1-2 1.4-3l.9-2.1c.5-1 .9-2 1.3-3 .3-.7.6-1.5.9-2.2l1.2-3c.3-.8.6-1.5.9-2.3.4-1 .7-2 1.1-3s.7-1.9 1-2.8c.6-1.6 1.2-3.3 1.7-4.9.3-1 .6-1.9.9-2.8s.5-1.8.8-2.7c.2-.9.5-1.9.8-2.8s.6-1.8.8-2.7c.3-1 .5-1.9.8-2.9.2-.9.5-1.8.7-2.7.2-1 .5-2 .7-3 .2-.9.4-1.7.6-2.6.2-1 .5-2.1.7-3.2.2-.8.3-1.6.5-2.4.3-1.3.6-2.7.8-4 .1-.6.2-1.1.3-1.7l.9-5.7c.1-.6.2-1.3.3-1.9.1-1.3.3-2.6.5-3.9.1-.8.2-1.5.3-2.3.1-1.2.3-2.4.4-3.6 0-.8.1-1.6.2-2.4.1-1.1.2-2.3.3-3.5.1-.8.1-1.6.2-2.4.1 1.7.1.5.2-.7 0-.8.1-1.5.1-2.3.1-1.3.2-2.7.2-4 .1-.7.1-1.3.1-2 .1-2 .1-4 .1-6 0-53.5-16.9-103-45.8-143.7zM448 371.5c-9.4 15.5-20.6 29.9-33.6 42.9-20.6 20.6-44.5 36.7-71.2 48-13.9 5.8-28.2 10.3-42.9 13.2v-75.8c0-58.6-88.6-58.6-88.6 0v75.8c-14.7-2.9-29-7.3-42.9-13.2-26.7-11.3-50.6-27.4-71.2-48-13-13-24.2-27.4-33.6-42.9v-71.3c0-2.1 1.6-3.7 3.7-3.7h22.1c2.1 0 3.7 1.6 3.7 3.7V326h29.6V182c0-2.1 1.6-3.7 3.7-3.7h22.1c2.1 0 3.7 1.6 3.7 3.7v25.9h29.5V182c0-2.1 1.6-3.7 3.7-3.7H208c2.1 0 3.7 1.6 3.7 3.7v25.9h29.5V182c0-4.8 6.5-3.7 9.5-3.7V88.1c-4.4-2-7.4-6.7-7.4-11.5 0-16.8 25.4-16.8 25.4 0 0 4.8-3 9.4-7.4 11.5V92c6.3-1.4 12.7-2.3 19.2-2.3 9.4 0 18.4 3.5 26.3 3.5 7.2 0 15.2-3.5 19.4-3.5 2.1 0 3.7 1.6 3.7 3.7v48.4c0 5.6-18.7 6.5-22.4 6.5-8.6 0-16.6-3.5-25.4-3.5-7 0-14.1 1.2-20.8 2.8v30.7c3 0 9.5-1.1 9.5 3.7v25.9h29.5V182c0-2.1 1.6-3.7 3.7-3.7h22.2c2.1 0 3.7 1.6 3.7 3.7v25.9h29.5V182c0-2.1 1.6-3.7 3.7-3.7h22.1c2.1 0 3.7 1.6 3.7 3.7v144h29.5v-25.8c0-2.1 1.6-3.7 3.7-3.7h22.2c2.1 0 3.7 1.6 3.7 3.7z"]
};
var faForumbee = {
  prefix: 'fab',
  iconName: 'forumbee',
  icon: [448, 512, [], "f211", "M5.8 309.7C2 292.7 0 275.5 0 258.3 0 135 99.8 35 223.1 35c16.6 0 33.3 2 49.3 5.5C149 87.5 51.9 186 5.8 309.7zm392.9-189.2C385 103 369 87.8 350.9 75.2c-149.6 44.3-266.3 162.1-309.7 312 12.5 18.1 28 35.6 45.2 49 43.1-151.3 161.2-271.7 312.3-315.7zm15.8 252.7c15.2-25.1 25.4-53.7 29.5-82.8-79.4 42.9-145 110.6-187.6 190.3 30-4.4 58.9-15.3 84.6-31.3 35 13.1 70.9 24.3 107 33.6-9.3-36.5-20.4-74.5-33.5-109.8zm29.7-145.5c-2.6-19.5-7.9-38.7-15.8-56.8C290.5 216.7 182 327.5 137.1 466c18.1 7.6 37 12.5 56.6 15.2C240 367.1 330.5 274.4 444.2 227.7z"]
};
var faFoursquare = {
  prefix: 'fab',
  iconName: 'foursquare',
  icon: [368, 512, [], "f180", "M323.1 3H49.9C12.4 3 0 31.3 0 49.1v433.8c0 20.3 12.1 27.7 18.2 30.1 6.2 2.5 22.8 4.6 32.9-7.1C180 356.5 182.2 354 182.2 354c3.1-3.4 3.4-3.1 6.8-3.1h83.4c35.1 0 40.6-25.2 44.3-39.7l48.6-243C373.8 25.8 363.1 3 323.1 3zm-16.3 73.8l-11.4 59.7c-1.2 6.5-9.5 13.2-16.9 13.2H172.1c-12 0-20.6 8.3-20.6 20.3v13c0 12 8.6 20.6 20.6 20.6h90.4c8.3 0 16.6 9.2 14.8 18.2-1.8 8.9-10.5 53.8-11.4 58.8-.9 4.9-6.8 13.5-16.9 13.5h-73.5c-13.5 0-17.2 1.8-26.5 12.6 0 0-8.9 11.4-89.5 108.3-.9.9-1.8.6-1.8-.3V75.9c0-7.7 6.8-16.6 16.6-16.6h219c8.2 0 15.6 7.7 13.5 17.5z"]
};
var faFreeCodeCamp = {
  prefix: 'fab',
  iconName: 'free-code-camp',
  icon: [576, 512, [], "f2c5", "M97.22,96.21c10.36-10.65,16-17.12,16-21.9,0-2.76-1.92-5.51-3.83-7.42A14.81,14.81,0,0,0,101,64.05c-8.48,0-20.92,8.79-35.84,25.69C23.68,137,2.51,182.81,3.37,250.34s17.47,117,54.06,161.87C76.22,435.86,90.62,448,100.9,448a13.55,13.55,0,0,0,8.37-3.84c1.91-2.76,3.81-5.63,3.81-8.38,0-5.63-3.86-12.2-13.2-20.55-44.45-42.33-67.32-97-67.48-165C32.25,188.8,54,137.83,97.22,96.21ZM239.47,420.07c.58.37.91.55.91.55Zm93.79.55.17-.13C333.24,420.62,333.17,420.67,333.26,420.62Zm3.13-158.18c-16.24-4.15,50.41-82.89-68.05-177.17,0,0,15.54,49.38-62.83,159.57-74.27,104.35,23.46,168.73,34,175.23-6.73-4.35-47.4-35.7,9.55-128.64,11-18.3,25.53-34.87,43.5-72.16,0,0,15.91,22.45,7.6,71.13C287.7,364,354,342.91,355,343.94c22.75,26.78-17.72,73.51-21.58,76.55,5.49-3.65,117.71-78,33-188.1C360.43,238.4,352.62,266.59,336.39,262.44ZM510.88,89.69C496,72.79,483.52,64,475,64a14.81,14.81,0,0,0-8.39,2.84c-1.91,1.91-3.83,4.66-3.83,7.42,0,4.78,5.6,11.26,16,21.9,43.23,41.61,65,92.59,64.82,154.06-.16,68-23,122.63-67.48,165-9.34,8.35-13.18,14.92-13.2,20.55,0,2.75,1.9,5.62,3.81,8.38A13.61,13.61,0,0,0,475.1,448c10.28,0,24.68-12.13,43.47-35.79,36.59-44.85,53.14-94.38,54.06-161.87S552.32,137,510.88,89.69Z"]
};
var faFreebsd = {
  prefix: 'fab',
  iconName: 'freebsd',
  icon: [448, 512, [], "f3a4", "M303.7 96.2c11.1-11.1 115.5-77 139.2-53.2 23.7 23.7-42.1 128.1-53.2 139.2-11.1 11.1-39.4.9-63.1-22.9-23.8-23.7-34.1-52-22.9-63.1zM109.9 68.1C73.6 47.5 22 24.6 5.6 41.1c-16.6 16.6 7.1 69.4 27.9 105.7 18.5-32.2 44.8-59.3 76.4-78.7zM406.7 174c3.3 11.3 2.7 20.7-2.7 26.1-20.3 20.3-87.5-27-109.3-70.1-18-32.3-11.1-53.4 14.9-48.7 5.7-3.6 12.3-7.6 19.6-11.6-29.8-15.5-63.6-24.3-99.5-24.3-119.1 0-215.6 96.5-215.6 215.6 0 119 96.5 215.6 215.6 215.6S445.3 380.1 445.3 261c0-38.4-10.1-74.5-27.7-105.8-3.9 7-7.6 13.3-10.9 18.8z"]
};
var faFulcrum = {
  prefix: 'fab',
  iconName: 'fulcrum',
  icon: [320, 512, [], "f50b", "M95.75 164.14l-35.38 43.55L25 164.14l35.38-43.55zM144.23 0l-20.54 198.18L72.72 256l51 57.82L144.23 512V300.89L103.15 256l41.08-44.89zm79.67 164.14l35.38 43.55 35.38-43.55-35.38-43.55zm-48.48 47L216.5 256l-41.08 44.89V512L196 313.82 247 256l-51-57.82L175.42 0z"]
};
var faGalacticRepublic = {
  prefix: 'fab',
  iconName: 'galactic-republic',
  icon: [496, 512, [], "f50c", "M248 504C111.25 504 0 392.75 0 256S111.25 8 248 8s248 111.25 248 248-111.25 248-248 248zm0-479.47C120.37 24.53 16.53 128.37 16.53 256S120.37 487.47 248 487.47 479.47 383.63 479.47 256 375.63 24.53 248 24.53zm27.62 21.81v24.62a185.933 185.933 0 0 1 83.57 34.54l17.39-17.36c-28.75-22.06-63.3-36.89-100.96-41.8zm-55.37.07c-37.64 4.94-72.16 19.8-100.88 41.85l17.28 17.36h.08c24.07-17.84 52.55-30.06 83.52-34.67V46.41zm12.25 50.17v82.87c-10.04 2.03-19.42 5.94-27.67 11.42l-58.62-58.59-21.93 21.93 58.67 58.67c-5.47 8.23-9.45 17.59-11.47 27.62h-82.9v31h82.9c2.02 10.02 6.01 19.31 11.47 27.54l-58.67 58.69 21.93 21.93 58.62-58.62a77.873 77.873 0 0 0 27.67 11.47v82.9h31v-82.9c10.05-2.03 19.37-6.06 27.62-11.55l58.67 58.69 21.93-21.93-58.67-58.69c5.46-8.23 9.47-17.52 11.5-27.54h82.87v-31h-82.87c-2.02-10.02-6.03-19.38-11.5-27.62l58.67-58.67-21.93-21.93-58.67 58.67c-8.25-5.49-17.57-9.47-27.62-11.5V96.58h-31zm183.24 30.72l-17.36 17.36a186.337 186.337 0 0 1 34.67 83.67h24.62c-4.95-37.69-19.83-72.29-41.93-101.03zm-335.55.13c-22.06 28.72-36.91 63.26-41.85 100.91h24.65c4.6-30.96 16.76-59.45 34.59-83.52l-17.39-17.39zM38.34 283.67c4.92 37.64 19.75 72.18 41.8 100.9l17.36-17.39c-17.81-24.07-29.92-52.57-34.51-83.52H38.34zm394.7 0c-4.61 30.99-16.8 59.5-34.67 83.6l17.36 17.36c22.08-28.74 36.98-63.29 41.93-100.96h-24.62zM136.66 406.38l-17.36 17.36c28.73 22.09 63.3 36.98 100.96 41.93v-24.64c-30.99-4.63-59.53-16.79-83.6-34.65zm222.53.05c-24.09 17.84-52.58 30.08-83.57 34.67v24.57c37.67-4.92 72.21-19.79 100.96-41.85l-17.31-17.39h-.08z"]
};
var faGalacticSenate = {
  prefix: 'fab',
  iconName: 'galactic-senate',
  icon: [512, 512, [], "f50d", "M249.86 33.48v26.07C236.28 80.17 226 168.14 225.39 274.9c11.74-15.62 19.13-33.33 19.13-48.24v-16.88c-.03-5.32.75-10.53 2.19-15.65.65-2.14 1.39-4.08 2.62-5.82 1.23-1.75 3.43-3.79 6.68-3.79 3.24 0 5.45 2.05 6.68 3.79 1.23 1.75 1.97 3.68 2.62 5.82 1.44 5.12 2.22 10.33 2.19 15.65v16.88c0 14.91 7.39 32.62 19.13 48.24-.63-106.76-10.91-194.73-24.49-215.35V33.48h-12.28zm-26.34 147.77c-9.52 2.15-18.7 5.19-27.46 9.08 8.9 16.12 9.76 32.64 1.71 37.29-8 4.62-21.85-4.23-31.36-19.82-11.58 8.79-21.88 19.32-30.56 31.09 14.73 9.62 22.89 22.92 18.32 30.66-4.54 7.7-20.03 7.14-35.47-.96-5.78 13.25-9.75 27.51-11.65 42.42 9.68.18 18.67 2.38 26.18 6.04 17.78-.3 32.77-1.96 40.49-4.22 5.55-26.35 23.02-48.23 46.32-59.51.73-25.55 1.88-49.67 3.48-72.07zm64.96 0c1.59 22.4 2.75 46.52 3.47 72.07 23.29 11.28 40.77 33.16 46.32 59.51 7.72 2.26 22.71 3.92 40.49 4.22 7.51-3.66 16.5-5.85 26.18-6.04-1.9-14.91-5.86-29.17-11.65-42.42-15.44 8.1-30.93 8.66-35.47.96-4.57-7.74 3.6-21.05 18.32-30.66-8.68-11.77-18.98-22.3-30.56-31.09-9.51 15.59-23.36 24.44-31.36 19.82-8.05-4.65-7.19-21.16 1.71-37.29a147.49 147.49 0 0 0-27.45-9.08zm-32.48 8.6c-3.23 0-5.86 8.81-6.09 19.93h-.05v16.88c0 41.42-49.01 95.04-93.49 95.04-52 0-122.75-1.45-156.37 29.17v2.51c9.42 17.12 20.58 33.17 33.18 47.97C45.7 380.26 84.77 360.4 141.2 360c45.68 1.02 79.03 20.33 90.76 40.87.01.01-.01.04 0 .05 7.67 2.14 15.85 3.23 24.04 3.21 8.19.02 16.37-1.07 24.04-3.21.01-.01-.01-.04 0-.05 11.74-20.54 45.08-39.85 90.76-40.87 56.43.39 95.49 20.26 108.02 41.35 12.6-14.8 23.76-30.86 33.18-47.97v-2.51c-33.61-30.62-104.37-29.17-156.37-29.17-44.48 0-93.49-53.62-93.49-95.04v-16.88h-.05c-.23-11.12-2.86-19.93-6.09-19.93zm0 96.59c22.42 0 40.6 18.18 40.6 40.6s-18.18 40.65-40.6 40.65-40.6-18.23-40.6-40.65c0-22.42 18.18-40.6 40.6-40.6zm0 7.64c-18.19 0-32.96 14.77-32.96 32.96S237.81 360 256 360s32.96-14.77 32.96-32.96-14.77-32.96-32.96-32.96zm0 6.14c14.81 0 26.82 12.01 26.82 26.82s-12.01 26.82-26.82 26.82-26.82-12.01-26.82-26.82 12.01-26.82 26.82-26.82zm-114.8 66.67c-10.19.07-21.6.36-30.5 1.66.43 4.42 1.51 18.63 7.11 29.76 9.11-2.56 18.36-3.9 27.62-3.9 41.28.94 71.48 34.35 78.26 74.47l.11 4.7c10.4 1.91 21.19 2.94 32.21 2.94 11.03 0 21.81-1.02 32.21-2.94l.11-4.7c6.78-40.12 36.98-73.53 78.26-74.47 9.26 0 18.51 1.34 27.62 3.9 5.6-11.13 6.68-25.34 7.11-29.76-8.9-1.3-20.32-1.58-30.5-1.66-18.76.42-35.19 4.17-48.61 9.67-12.54 16.03-29.16 30.03-49.58 33.07-.09.02-.17.04-.27.05-.05.01-.11.04-.16.05-5.24 1.07-10.63 1.6-16.19 1.6-5.55 0-10.95-.53-16.19-1.6-.05-.01-.11-.04-.16-.05-.1-.02-.17-.04-.27-.05-20.42-3.03-37.03-17.04-49.58-33.07-13.42-5.49-29.86-9.25-48.61-9.67z"]
};
var faGetPocket = {
  prefix: 'fab',
  iconName: 'get-pocket',
  icon: [448, 512, [], "f265", "M407.6 64h-367C18.5 64 0 82.5 0 104.6v135.2C0 364.5 99.7 464 224.2 464c124 0 223.8-99.5 223.8-224.2V104.6c0-22.4-17.7-40.6-40.4-40.6zm-162 268.5c-12.4 11.8-31.4 11.1-42.4 0C89.5 223.6 88.3 227.4 88.3 209.3c0-16.9 13.8-30.7 30.7-30.7 17 0 16.1 3.8 105.2 89.3 90.6-86.9 88.6-89.3 105.5-89.3 16.9 0 30.7 13.8 30.7 30.7 0 17.8-2.9 15.7-114.8 123.2z"]
};
var faGg = {
  prefix: 'fab',
  iconName: 'gg',
  icon: [512, 512, [], "f260", "M179.2 230.4l102.4 102.4-102.4 102.4L0 256 179.2 76.8l44.8 44.8-25.6 25.6-19.2-19.2-128 128 128 128 51.5-51.5-77.1-76.5 25.6-25.6zM332.8 76.8L230.4 179.2l102.4 102.4 25.6-25.6-77.1-76.5 51.5-51.5 128 128-128 128-19.2-19.2-25.6 25.6 44.8 44.8L512 256 332.8 76.8z"]
};
var faGgCircle = {
  prefix: 'fab',
  iconName: 'gg-circle',
  icon: [512, 512, [], "f261", "M257 8C120 8 9 119 9 256s111 248 248 248 248-111 248-248S394 8 257 8zm-49.5 374.8L81.8 257.1l125.7-125.7 35.2 35.4-24.2 24.2-11.1-11.1-77.2 77.2 77.2 77.2 26.6-26.6-53.1-52.9 24.4-24.4 77.2 77.2-75 75.2zm99-2.2l-35.2-35.2 24.1-24.4 11.1 11.1 77.2-77.2-77.2-77.2-26.5 26.5 53.1 52.9-24.4 24.4-77.2-77.2 75-75L432.2 255 306.5 380.6z"]
};
var faGit = {
  prefix: 'fab',
  iconName: 'git',
  icon: [512, 512, [], "f1d3", "M216.29 158.39H137C97 147.9 6.51 150.63 6.51 233.18c0 30.09 15 51.23 35 61-25.1 23-37 33.85-37 49.21 0 11 4.47 21.14 17.89 26.81C8.13 383.61 0 393.35 0 411.65c0 32.11 28.05 50.82 101.63 50.82 70.75 0 111.79-26.42 111.79-73.18 0-58.66-45.16-56.5-151.63-63l13.43-21.55c27.27 7.58 118.7 10 118.7-67.89 0-18.7-7.73-31.71-15-41.07l37.41-2.84zm-63.42 241.9c0 32.06-104.89 32.1-104.89 2.43 0-8.14 5.27-15 10.57-21.54 77.71 5.3 94.32 3.37 94.32 19.11zm-50.81-134.58c-52.8 0-50.46-71.16 1.2-71.16 49.54 0 50.82 71.16-1.2 71.16zm133.3 100.51v-32.1c26.75-3.66 27.24-2 27.24-11V203.61c0-8.5-2.05-7.38-27.24-16.26l4.47-32.92H324v168.71c0 6.51.4 7.32 6.51 8.14l20.73 2.84v32.1zm52.45-244.31c-23.17 0-36.59-13.43-36.59-36.61s13.42-35.77 36.59-35.77c23.58 0 37 12.62 37 35.77s-13.42 36.61-37 36.61zM512 350.46c-17.49 8.53-43.1 16.26-66.28 16.26-48.38 0-66.67-19.5-66.67-65.46V194.75c0-5.42 1.05-4.06-31.71-4.06V154.5c35.78-4.07 50-22 54.47-66.27h38.63c0 65.83-1.34 61.81 3.26 61.81H501v40.65h-60.56v97.15c0 6.92-4.92 51.41 60.57 26.84z"]
};
var faGitAlt = {
  prefix: 'fab',
  iconName: 'git-alt',
  icon: [448, 512, [], "f841", "M439.55 236.05L244 40.45a28.87 28.87 0 0 0-40.81 0l-40.66 40.63 51.52 51.52c27.06-9.14 52.68 16.77 43.39 43.68l49.66 49.66c34.23-11.8 61.18 31 35.47 56.69-26.49 26.49-70.21-2.87-56-37.34L240.22 199v121.85c25.3 12.54 22.26 41.85 9.08 55a34.34 34.34 0 0 1-48.55 0c-17.57-17.6-11.07-46.91 11.25-56v-123c-20.8-8.51-24.6-30.74-18.64-45L142.57 101 8.45 235.14a28.86 28.86 0 0 0 0 40.81l195.61 195.6a28.86 28.86 0 0 0 40.8 0l194.69-194.69a28.86 28.86 0 0 0 0-40.81z"]
};
var faGitSquare = {
  prefix: 'fab',
  iconName: 'git-square',
  icon: [448, 512, [], "f1d2", "M100.59 334.24c48.57 3.31 58.95 2.11 58.95 11.94 0 20-65.55 20.06-65.55 1.52.01-5.09 3.29-9.4 6.6-13.46zm27.95-116.64c-32.29 0-33.75 44.47-.75 44.47 32.51 0 31.71-44.47.75-44.47zM448 80v352a48 48 0 0 1-48 48H48a48 48 0 0 1-48-48V80a48 48 0 0 1 48-48h352a48 48 0 0 1 48 48zm-227 69.31c0 14.49 8.38 22.88 22.86 22.88 14.74 0 23.13-8.39 23.13-22.88S258.62 127 243.88 127c-14.48 0-22.88 7.84-22.88 22.31zM199.18 195h-49.55c-25-6.55-81.56-4.85-81.56 46.75 0 18.8 9.4 32 21.85 38.11C74.23 294.23 66.8 301 66.8 310.6c0 6.87 2.79 13.22 11.18 16.76-8.9 8.4-14 14.48-14 25.92C64 373.35 81.53 385 127.52 385c44.22 0 69.87-16.51 69.87-45.73 0-36.67-28.23-35.32-94.77-39.38l8.38-13.43c17 4.74 74.19 6.23 74.19-42.43 0-11.69-4.83-19.82-9.4-25.67l23.38-1.78zm84.34 109.84l-13-1.78c-3.82-.51-4.07-1-4.07-5.09V192.52h-52.6l-2.79 20.57c15.75 5.55 17 4.86 17 10.17V298c0 5.62-.31 4.58-17 6.87v20.06h72.42zM384 315l-6.87-22.37c-40.93 15.37-37.85-12.41-37.85-16.73v-60.72h37.85v-25.41h-35.82c-2.87 0-2 2.52-2-38.63h-24.18c-2.79 27.7-11.68 38.88-34 41.42v22.62c20.47 0 19.82-.85 19.82 2.54v66.57c0 28.72 11.43 40.91 41.67 40.91 14.45 0 30.45-4.83 41.38-10.2z"]
};
var faGithub = {
  prefix: 'fab',
  iconName: 'github',
  icon: [496, 512, [], "f09b", "M165.9 397.4c0 2-2.3 3.6-5.2 3.6-3.3.3-5.6-1.3-5.6-3.6 0-2 2.3-3.6 5.2-3.6 3-.3 5.6 1.3 5.6 3.6zm-31.1-4.5c-.7 2 1.3 4.3 4.3 4.9 2.6 1 5.6 0 6.2-2s-1.3-4.3-4.3-5.2c-2.6-.7-5.5.3-6.2 2.3zm44.2-1.7c-2.9.7-4.9 2.6-4.6 4.9.3 2 2.9 3.3 5.9 2.6 2.9-.7 4.9-2.6 4.6-4.6-.3-1.9-3-3.2-5.9-2.9zM244.8 8C106.1 8 0 113.3 0 252c0 110.9 69.8 205.8 169.5 239.2 12.8 2.3 17.3-5.6 17.3-12.1 0-6.2-.3-40.4-.3-61.4 0 0-70 15-84.7-29.8 0 0-11.4-29.1-27.8-36.6 0 0-22.9-15.7 1.6-15.4 0 0 24.9 2 38.6 25.8 21.9 38.6 58.6 27.5 72.9 20.9 2.3-16 8.8-27.1 16-33.7-55.9-6.2-112.3-14.3-112.3-110.5 0-27.5 7.6-41.3 23.6-58.9-2.6-6.5-11.1-33.3 2.6-67.9 20.9-6.5 69 27 69 27 20-5.6 41.5-8.5 62.8-8.5s42.8 2.9 62.8 8.5c0 0 48.1-33.6 69-27 13.7 34.7 5.2 61.4 2.6 67.9 16 17.7 25.8 31.5 25.8 58.9 0 96.5-58.9 104.2-114.8 110.5 9.2 7.9 17 22.9 17 46.4 0 33.7-.3 75.4-.3 83.6 0 6.5 4.6 14.4 17.3 12.1C428.2 457.8 496 362.9 496 252 496 113.3 383.5 8 244.8 8zM97.2 352.9c-1.3 1-1 3.3.7 5.2 1.6 1.6 3.9 2.3 5.2 1 1.3-1 1-3.3-.7-5.2-1.6-1.6-3.9-2.3-5.2-1zm-10.8-8.1c-.7 1.3.3 2.9 2.3 3.9 1.6 1 3.6.7 4.3-.7.7-1.3-.3-2.9-2.3-3.9-2-.6-3.6-.3-4.3.7zm32.4 35.6c-1.6 1.3-1 4.3 1.3 6.2 2.3 2.3 5.2 2.6 6.5 1 1.3-1.3.7-4.3-1.3-6.2-2.2-2.3-5.2-2.6-6.5-1zm-11.4-14.7c-1.6 1-1.6 3.6 0 5.9 1.6 2.3 4.3 3.3 5.6 2.3 1.6-1.3 1.6-3.9 0-6.2-1.4-2.3-4-3.3-5.6-2z"]
};
var faGithubAlt = {
  prefix: 'fab',
  iconName: 'github-alt',
  icon: [480, 512, [], "f113", "M186.1 328.7c0 20.9-10.9 55.1-36.7 55.1s-36.7-34.2-36.7-55.1 10.9-55.1 36.7-55.1 36.7 34.2 36.7 55.1zM480 278.2c0 31.9-3.2 65.7-17.5 95-37.9 76.6-142.1 74.8-216.7 74.8-75.8 0-186.2 2.7-225.6-74.8-14.6-29-20.2-63.1-20.2-95 0-41.9 13.9-81.5 41.5-113.6-5.2-15.8-7.7-32.4-7.7-48.8 0-21.5 4.9-32.3 14.6-51.8 45.3 0 74.3 9 108.8 36 29-6.9 58.8-10 88.7-10 27 0 54.2 2.9 80.4 9.2 34-26.7 63-35.2 107.8-35.2 9.8 19.5 14.6 30.3 14.6 51.8 0 16.4-2.6 32.7-7.7 48.2 27.5 32.4 39 72.3 39 114.2zm-64.3 50.5c0-43.9-26.7-82.6-73.5-82.6-18.9 0-37 3.4-56 6-14.9 2.3-29.8 3.2-45.1 3.2-15.2 0-30.1-.9-45.1-3.2-18.7-2.6-37-6-56-6-46.8 0-73.5 38.7-73.5 82.6 0 87.8 80.4 101.3 150.4 101.3h48.2c70.3 0 150.6-13.4 150.6-101.3zm-82.6-55.1c-25.8 0-36.7 34.2-36.7 55.1s10.9 55.1 36.7 55.1 36.7-34.2 36.7-55.1-10.9-55.1-36.7-55.1z"]
};
var faGithubSquare = {
  prefix: 'fab',
  iconName: 'github-square',
  icon: [448, 512, [], "f092", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM277.3 415.7c-8.4 1.5-11.5-3.7-11.5-8 0-5.4.2-33 .2-55.3 0-15.6-5.2-25.5-11.3-30.7 37-4.1 76-9.2 76-73.1 0-18.2-6.5-27.3-17.1-39 1.7-4.3 7.4-22-1.7-45-13.9-4.3-45.7 17.9-45.7 17.9-13.2-3.7-27.5-5.6-41.6-5.6-14.1 0-28.4 1.9-41.6 5.6 0 0-31.8-22.2-45.7-17.9-9.1 22.9-3.5 40.6-1.7 45-10.6 11.7-15.6 20.8-15.6 39 0 63.6 37.3 69 74.3 73.1-4.8 4.3-9.1 11.7-10.6 22.3-9.5 4.3-33.8 11.7-48.3-13.9-9.1-15.8-25.5-17.1-25.5-17.1-16.2-.2-1.1 10.2-1.1 10.2 10.8 5 18.4 24.2 18.4 24.2 9.7 29.7 56.1 19.7 56.1 19.7 0 13.9.2 36.5.2 40.6 0 4.3-3 9.5-11.5 8-66-22.1-112.2-84.9-112.2-158.3 0-91.8 70.2-161.5 162-161.5S388 165.6 388 257.4c.1 73.4-44.7 136.3-110.7 158.3zm-98.1-61.1c-1.9.4-3.7-.4-3.9-1.7-.2-1.5 1.1-2.8 3-3.2 1.9-.2 3.7.6 3.9 1.9.3 1.3-1 2.6-3 3zm-9.5-.9c0 1.3-1.5 2.4-3.5 2.4-2.2.2-3.7-.9-3.7-2.4 0-1.3 1.5-2.4 3.5-2.4 1.9-.2 3.7.9 3.7 2.4zm-13.7-1.1c-.4 1.3-2.4 1.9-4.1 1.3-1.9-.4-3.2-1.9-2.8-3.2.4-1.3 2.4-1.9 4.1-1.5 2 .6 3.3 2.1 2.8 3.4zm-12.3-5.4c-.9 1.1-2.8.9-4.3-.6-1.5-1.3-1.9-3.2-.9-4.1.9-1.1 2.8-.9 4.3.6 1.3 1.3 1.8 3.3.9 4.1zm-9.1-9.1c-.9.6-2.6 0-3.7-1.5s-1.1-3.2 0-3.9c1.1-.9 2.8-.2 3.7 1.3 1.1 1.5 1.1 3.3 0 4.1zm-6.5-9.7c-.9.9-2.4.4-3.5-.6-1.1-1.3-1.3-2.8-.4-3.5.9-.9 2.4-.4 3.5.6 1.1 1.3 1.3 2.8.4 3.5zm-6.7-7.4c-.4.9-1.7 1.1-2.8.4-1.3-.6-1.9-1.7-1.5-2.6.4-.6 1.5-.9 2.8-.4 1.3.7 1.9 1.8 1.5 2.6z"]
};
var faGitkraken = {
  prefix: 'fab',
  iconName: 'gitkraken',
  icon: [592, 512, [], "f3a6", "M565.7 118.1c-2.3-6.1-9.3-9.2-15.3-6.6-5.7 2.4-8.5 8.9-6.3 14.6 10.9 29 16.9 60.5 16.9 93.3 0 134.6-100.3 245.7-230.2 262.7V358.4c7.9-1.5 15.5-3.6 23-6.2v104c106.7-25.9 185.9-122.1 185.9-236.8 0-91.8-50.8-171.8-125.8-213.3-5.7-3.2-13-.9-15.9 5-2.7 5.5-.6 12.2 4.7 15.1 67.9 37.6 113.9 110 113.9 193.2 0 93.3-57.9 173.1-139.8 205.4v-92.2c14.2-4.5 24.9-17.7 24.9-33.5 0-13.1-6.8-24.4-17.3-30.5 8.3-79.5 44.5-58.6 44.5-83.9V170c0-38-87.9-161.8-129-164.7-2.5-.2-5-.2-7.6 0C251.1 8.3 163.2 132 163.2 170v14.8c0 25.3 36.3 4.3 44.5 83.9-10.6 6.1-17.3 17.4-17.3 30.5 0 15.8 10.6 29 24.8 33.5v92.2c-81.9-32.2-139.8-112-139.8-205.4 0-83.1 46-155.5 113.9-193.2 5.4-3 7.4-9.6 4.7-15.1-2.9-5.9-10.1-8.2-15.9-5-75 41.5-125.8 121.5-125.8 213.3 0 114.7 79.2 210.8 185.9 236.8v-104c7.6 2.5 15.1 4.6 23 6.2v123.7C131.4 465.2 31 354.1 31 219.5c0-32.8 6-64.3 16.9-93.3 2.2-5.8-.6-12.2-6.3-14.6-6-2.6-13 .4-15.3 6.6C14.5 149.7 8 183.8 8 219.5c0 155.1 122.6 281.6 276.3 287.8V361.4c6.8.4 15 .5 23.4 0v145.8C461.4 501.1 584 374.6 584 219.5c0-35.7-6.5-69.8-18.3-101.4zM365.9 275.5c13 0 23.7 10.5 23.7 23.7 0 13.1-10.6 23.7-23.7 23.7-13 0-23.7-10.5-23.7-23.7 0-13.1 10.6-23.7 23.7-23.7zm-139.8 47.3c-13.2 0-23.7-10.7-23.7-23.7s10.5-23.7 23.7-23.7c13.1 0 23.7 10.6 23.7 23.7 0 13-10.5 23.7-23.7 23.7z"]
};
var faGitlab = {
  prefix: 'fab',
  iconName: 'gitlab',
  icon: [512, 512, [], "f296", "M105.2 24.9c-3.1-8.9-15.7-8.9-18.9 0L29.8 199.7h132c-.1 0-56.6-174.8-56.6-174.8zM.9 287.7c-2.6 8 .3 16.9 7.1 22l247.9 184-226.2-294zm160.8-88l94.3 294 94.3-294zm349.4 88l-28.8-88-226.3 294 247.9-184c6.9-5.1 9.7-14 7.2-22zM425.7 24.9c-3.1-8.9-15.7-8.9-18.9 0l-56.6 174.8h132z"]
};
var faGitter = {
  prefix: 'fab',
  iconName: 'gitter',
  icon: [384, 512, [], "f426", "M66.4 322.5H16V0h50.4v322.5zM166.9 76.1h-50.4V512h50.4V76.1zm100.6 0h-50.4V512h50.4V76.1zM368 76h-50.4v247H368V76z"]
};
var faGlide = {
  prefix: 'fab',
  iconName: 'glide',
  icon: [448, 512, [], "f2a5", "M252.8 148.6c0 8.8-1.6 17.7-3.4 26.4-5.8 27.8-11.6 55.8-17.3 83.6-1.4 6.3-8.3 4.9-13.7 4.9-23.8 0-30.5-26-30.5-45.5 0-29.3 11.2-68.1 38.5-83.1 4.3-2.5 9.2-4.2 14.1-4.2 11.4 0 12.3 8.3 12.3 17.9zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-64 187c0-5.1-20.8-37.7-25.5-39.5-2.2-.9-7.2-2.3-9.6-2.3-23.1 0-38.7 10.5-58.2 21.5l-.5-.5c4.3-29.4 14.6-57.2 14.6-87.4 0-44.6-23.8-62.7-67.5-62.7-71.7 0-108 70.8-108 123.5 0 54.7 32 85 86.3 85 7.5 0 6.9-.6 6.9 2.3-10.5 80.3-56.5 82.9-56.5 58.9 0-24.4 28-36.5 28.3-38-.2-7.6-29.3-17.2-36.7-17.2-21.1 0-32.7 33-32.7 50.6 0 32.3 20.4 54.7 53.3 54.7 48.2 0 83.4-49.7 94.3-91.7 9.4-37.7 7-39.4 12.3-42.1 20-10.1 35.8-16.8 58.4-16.8 11.1 0 19 2.3 36.7 5.2 1.8.1 4.1-1.7 4.1-3.5z"]
};
var faGlideG = {
  prefix: 'fab',
  iconName: 'glide-g',
  icon: [448, 512, [], "f2a6", "M407.1 211.2c-3.5-1.4-11.6-3.8-15.4-3.8-37.1 0-62.2 16.8-93.5 34.5l-.9-.9c7-47.3 23.5-91.9 23.5-140.4C320.8 29.1 282.6 0 212.4 0 97.3 0 39 113.7 39 198.4 39 286.3 90.3 335 177.6 335c12 0 11-1 11 3.8-16.9 128.9-90.8 133.1-90.8 94.6 0-39.2 45-58.6 45.5-61-.3-12.2-47-27.6-58.9-27.6-33.9.1-52.4 51.2-52.4 79.3C32 476 64.8 512 117.5 512c77.4 0 134-77.8 151.4-145.4 15.1-60.5 11.2-63.3 19.7-67.6 32.2-16.2 57.5-27 93.8-27 17.8 0 30.5 3.7 58.9 8.4 2.9 0 6.7-2.9 6.7-5.8 0-8-33.4-60.5-40.9-63.4zm-175.3-84.4c-9.3 44.7-18.6 89.6-27.8 134.3-2.3 10.2-13.3 7.8-22 7.8-38.3 0-49-41.8-49-73.1 0-47 18-109.3 61.8-133.4 7-4.1 14.8-6.7 22.6-6.7 18.6 0 20 13.3 20 28.7-.1 14.3-2.7 28.5-5.6 42.4z"]
};
var faGofore = {
  prefix: 'fab',
  iconName: 'gofore',
  icon: [400, 512, [], "f3a7", "M324 319.8h-13.2v34.7c-24.5 23.1-56.3 35.8-89.9 35.8-73.2 0-132.4-60.2-132.4-134.4 0-74.1 59.2-134.4 132.4-134.4 35.3 0 68.6 14 93.6 39.4l62.3-63.3C335 55.3 279.7 32 220.7 32 98 32 0 132.6 0 256c0 122.5 97 224 220.7 224 63.2 0 124.5-26.2 171-82.5-2-27.6-13.4-77.7-67.7-77.7zm-12.1-112.5H205.6v89H324c33.5 0 60.5 15.1 76 41.8v-30.6c0-65.2-40.4-100.2-88.1-100.2z"]
};
var faGoodreads = {
  prefix: 'fab',
  iconName: 'goodreads',
  icon: [448, 512, [], "f3a8", "M299.9 191.2c5.1 37.3-4.7 79-35.9 100.7-22.3 15.5-52.8 14.1-70.8 5.7-37.1-17.3-49.5-58.6-46.8-97.2 4.3-60.9 40.9-87.9 75.3-87.5 46.9-.2 71.8 31.8 78.2 78.3zM448 88v336c0 30.9-25.1 56-56 56H56c-30.9 0-56-25.1-56-56V88c0-30.9 25.1-56 56-56h336c30.9 0 56 25.1 56 56zM330 313.2s-.1-34-.1-217.3h-29v40.3c-.8.3-1.2-.5-1.6-1.2-9.6-20.7-35.9-46.3-76-46-51.9.4-87.2 31.2-100.6 77.8-4.3 14.9-5.8 30.1-5.5 45.6 1.7 77.9 45.1 117.8 112.4 115.2 28.9-1.1 54.5-17 69-45.2.5-1 1.1-1.9 1.7-2.9.2.1.4.1.6.2.3 3.8.2 30.7.1 34.5-.2 14.8-2 29.5-7.2 43.5-7.8 21-22.3 34.7-44.5 39.5-17.8 3.9-35.6 3.8-53.2-1.2-21.5-6.1-36.5-19-41.1-41.8-.3-1.6-1.3-1.3-2.3-1.3h-26.8c.8 10.6 3.2 20.3 8.5 29.2 24.2 40.5 82.7 48.5 128.2 37.4 49.9-12.3 67.3-54.9 67.4-106.3z"]
};
var faGoodreadsG = {
  prefix: 'fab',
  iconName: 'goodreads-g',
  icon: [384, 512, [], "f3a9", "M42.6 403.3h2.8c12.7 0 25.5 0 38.2.1 1.6 0 3.1-.4 3.6 2.1 7.1 34.9 30 54.6 62.9 63.9 26.9 7.6 54.1 7.8 81.3 1.8 33.8-7.4 56-28.3 68-60.4 8-21.5 10.7-43.8 11-66.5.1-5.8.3-47-.2-52.8l-.9-.3c-.8 1.5-1.7 2.9-2.5 4.4-22.1 43.1-61.3 67.4-105.4 69.1-103 4-169.4-57-172-176.2-.5-23.7 1.8-46.9 8.3-69.7C58.3 47.7 112.3.6 191.6 0c61.3-.4 101.5 38.7 116.2 70.3.5 1.1 1.3 2.3 2.4 1.9V10.6h44.3c0 280.3.1 332.2.1 332.2-.1 78.5-26.7 143.7-103 162.2-69.5 16.9-159 4.8-196-57.2-8-13.5-11.8-28.3-13-44.5zM188.9 36.5c-52.5-.5-108.5 40.7-115 133.8-4.1 59 14.8 122.2 71.5 148.6 27.6 12.9 74.3 15 108.3-8.7 47.6-33.2 62.7-97 54.8-154-9.7-71.1-47.8-120-119.6-119.7z"]
};
var faGoogle = {
  prefix: 'fab',
  iconName: 'google',
  icon: [488, 512, [], "f1a0", "M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"]
};
var faGoogleDrive = {
  prefix: 'fab',
  iconName: 'google-drive',
  icon: [512, 512, [], "f3aa", "M339 314.9L175.4 32h161.2l163.6 282.9H339zm-137.5 23.6L120.9 480h310.5L512 338.5H201.5zM154.1 67.4L0 338.5 80.6 480 237 208.8 154.1 67.4z"]
};
var faGooglePlay = {
  prefix: 'fab',
  iconName: 'google-play',
  icon: [512, 512, [], "f3ab", "M325.3 234.3L104.6 13l280.8 161.2-60.1 60.1zM47 0C34 6.8 25.3 19.2 25.3 35.3v441.3c0 16.1 8.7 28.5 21.7 35.3l256.6-256L47 0zm425.2 225.6l-58.9-34.1-65.7 64.5 65.7 64.5 60.1-34.1c18-14.3 18-46.5-1.2-60.8zM104.6 499l280.8-161.2-60.1-60.1L104.6 499z"]
};
var faGooglePlus = {
  prefix: 'fab',
  iconName: 'google-plus',
  icon: [496, 512, [], "f2b3", "M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm-70.7 372c-68.8 0-124-55.5-124-124s55.2-124 124-124c31.3 0 60.1 11 83 32.3l-33.6 32.6c-13.2-12.9-31.3-19.1-49.4-19.1-42.9 0-77.2 35.5-77.2 78.1s34.2 78.1 77.2 78.1c32.6 0 64.9-19.1 70.1-53.3h-70.1v-42.6h116.9c1.3 6.8 1.9 13.6 1.9 20.7 0 70.8-47.5 121.2-118.8 121.2zm230.2-106.2v35.5H372v-35.5h-35.5v-35.5H372v-35.5h35.5v35.5h35.2v35.5h-35.2z"]
};
var faGooglePlusG = {
  prefix: 'fab',
  iconName: 'google-plus-g',
  icon: [640, 512, [], "f0d5", "M386.061 228.496c1.834 9.692 3.143 19.384 3.143 31.956C389.204 370.205 315.599 448 204.8 448c-106.084 0-192-85.915-192-192s85.916-192 192-192c51.864 0 95.083 18.859 128.611 50.292l-52.126 50.03c-14.145-13.621-39.028-29.599-76.485-29.599-65.484 0-118.92 54.221-118.92 121.277 0 67.056 53.436 121.277 118.92 121.277 75.961 0 104.513-54.745 108.965-82.773H204.8v-66.009h181.261zm185.406 6.437V179.2h-56.001v55.733h-55.733v56.001h55.733v55.733h56.001v-55.733H627.2v-56.001h-55.733z"]
};
var faGooglePlusSquare = {
  prefix: 'fab',
  iconName: 'google-plus-square',
  icon: [448, 512, [], "f0d4", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM164 356c-55.3 0-100-44.7-100-100s44.7-100 100-100c27 0 49.5 9.8 67 26.2l-27.1 26.1c-7.4-7.1-20.3-15.4-39.8-15.4-34.1 0-61.9 28.2-61.9 63.2 0 34.9 27.8 63.2 61.9 63.2 39.6 0 54.4-28.5 56.8-43.1H164v-34.4h94.4c1 5 1.6 10.1 1.6 16.6 0 57.1-38.3 97.6-96 97.6zm220-81.8h-29v29h-29.2v-29h-29V245h29v-29H355v29h29v29.2z"]
};
var faGoogleWallet = {
  prefix: 'fab',
  iconName: 'google-wallet',
  icon: [448, 512, [], "f1ee", "M156.8 126.8c37.6 60.6 64.2 113.1 84.3 162.5-8.3 33.8-18.8 66.5-31.3 98.3-13.2-52.3-26.5-101.3-56-148.5 6.5-36.4 2.3-73.6 3-112.3zM109.3 200H16.1c-6.5 0-10.5 7.5-6.5 12.7C51.8 267 81.3 330.5 101.3 400h103.5c-16.2-69.7-38.7-133.7-82.5-193.5-3-4-8-6.5-13-6.5zm47.8-88c68.5 108 130 234.5 138.2 368H409c-12-138-68.4-265-143.2-368H157.1zm251.8-68.5c-1.8-6.8-8.2-11.5-15.2-11.5h-88.3c-5.3 0-9 5-7.8 10.3 13.2 46.5 22.3 95.5 26.5 146 48.2 86.2 79.7 178.3 90.6 270.8 15.8-60.5 25.3-133.5 25.3-203 0-73.6-12.1-145.1-31.1-212.6z"]
};
var faGratipay = {
  prefix: 'fab',
  iconName: 'gratipay',
  icon: [496, 512, [], "f184", "M248 8C111.1 8 0 119.1 0 256s111.1 248 248 248 248-111.1 248-248S384.9 8 248 8zm114.6 226.4l-113 152.7-112.7-152.7c-8.7-11.9-19.1-50.4 13.6-72 28.1-18.1 54.6-4.2 68.5 11.9 15.9 17.9 46.6 16.9 61.7 0 13.9-16.1 40.4-30 68.1-11.9 32.9 21.6 22.6 60 13.8 72z"]
};
var faGrav = {
  prefix: 'fab',
  iconName: 'grav',
  icon: [512, 512, [], "f2d6", "M301.1 212c4.4 4.4 4.4 11.9 0 16.3l-9.7 9.7c-4.4 4.7-11.9 4.7-16.6 0l-10.5-10.5c-4.4-4.7-4.4-11.9 0-16.6l9.7-9.7c4.4-4.4 11.9-4.4 16.6 0l10.5 10.8zm-30.2-19.7c3-3 3-7.8 0-10.5-2.8-3-7.5-3-10.5 0-2.8 2.8-2.8 7.5 0 10.5 3.1 2.8 7.8 2.8 10.5 0zm-26 5.3c-3 2.8-3 7.5 0 10.2 2.8 3 7.5 3 10.5 0 2.8-2.8 2.8-7.5 0-10.2-3-3-7.7-3-10.5 0zm72.5-13.3c-19.9-14.4-33.8-43.2-11.9-68.1 21.6-24.9 40.7-17.2 59.8.8 11.9 11.3 29.3 24.9 17.2 48.2-12.5 23.5-45.1 33.2-65.1 19.1zm47.7-44.5c-8.9-10-23.3 6.9-15.5 16.1 7.4 9 32.1 2.4 15.5-16.1zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-66.2 42.6c2.5-16.1-20.2-16.6-25.2-25.7-13.6-24.1-27.7-36.8-54.5-30.4 11.6-8 23.5-6.1 23.5-6.1.3-6.4 0-13-9.4-24.9 3.9-12.5.3-22.4.3-22.4 15.5-8.6 26.8-24.4 29.1-43.2 3.6-31-18.8-59.2-49.8-62.8-22.1-2.5-43.7 7.7-54.3 25.7-23.2 40.1 1.4 70.9 22.4 81.4-14.4-1.4-34.3-11.9-40.1-34.3-6.6-25.7 2.8-49.8 8.9-61.4 0 0-4.4-5.8-8-8.9 0 0-13.8 0-24.6 5.3 11.9-15.2 25.2-14.4 25.2-14.4 0-6.4-.6-14.9-3.6-21.6-5.4-11-23.8-12.9-31.7 2.8.1-.2.3-.4.4-.5-5 11.9-1.1 55.9 16.9 87.2-2.5 1.4-9.1 6.1-13 10-21.6 9.7-56.2 60.3-56.2 60.3-28.2 10.8-77.2 50.9-70.6 79.7.3 3 1.4 5.5 3 7.5-2.8 2.2-5.5 5-8.3 8.3-11.9 13.8-5.3 35.2 17.7 24.4 15.8-7.2 29.6-20.2 36.3-30.4 0 0-5.5-5-16.3-4.4 27.7-6.6 34.3-9.4 46.2-9.1 8 3.9 8-34.3 8-34.3 0-14.7-2.2-31-11.1-41.5 12.5 12.2 29.1 32.7 28 60.6-.8 18.3-15.2 23-15.2 23-9.1 16.6-43.2 65.9-30.4 106 0 0-9.7-14.9-10.2-22.1-17.4 19.4-46.5 52.3-24.6 64.5 26.6 14.7 108.8-88.6 126.2-142.3 34.6-20.8 55.4-47.3 63.9-65 22 43.5 95.3 94.5 101.1 59z"]
};
var faGripfire = {
  prefix: 'fab',
  iconName: 'gripfire',
  icon: [384, 512, [], "f3ac", "M112.5 301.4c0-73.8 105.1-122.5 105.1-203 0-47.1-34-88-39.1-90.4.4 3.3.6 6.7.6 10C179.1 110.1 32 171.9 32 286.6c0 49.8 32.2 79.2 66.5 108.3 65.1 46.7 78.1 71.4 78.1 86.6 0 10.1-4.8 17-4.8 22.3 13.1-16.7 17.4-31.9 17.5-46.4 0-29.6-21.7-56.3-44.2-86.5-16-22.3-32.6-42.6-32.6-69.5zm205.3-39c-12.1-66.8-78-124.4-94.7-130.9l4 7.2c2.4 5.1 3.4 10.9 3.4 17.1 0 44.7-54.2 111.2-56.6 116.7-2.2 5.1-3.2 10.5-3.2 15.8 0 20.1 15.2 42.1 17.9 42.1 2.4 0 56.6-55.4 58.1-87.7 6.4 11.7 9.1 22.6 9.1 33.4 0 41.2-41.8 96.9-41.8 96.9 0 11.6 31.9 53.2 35.5 53.2 1 0 2.2-1.4 3.2-2.4 37.9-39.3 67.3-85 67.3-136.8 0-8-.7-16.2-2.2-24.6z"]
};
var faGrunt = {
  prefix: 'fab',
  iconName: 'grunt',
  icon: [384, 512, [], "f3ad", "M61.3 189.3c-1.1 10 5.2 19.1 5.2 19.1.7-7.5 2.2-12.8 4-16.6.4 10.3 3.2 23.5 12.8 34.1 6.9 7.6 35.6 23.3 54.9 6.1 1 2.4 2.1 5.3 3 8.5 2.9 10.3-2.7 25.3-2.7 25.3s15.1-17.1 13.9-32.5c10.8-.5 21.4-8.4 21.1-19.5 0 0-18.9 10.4-35.5-8.8-9.7-11.2-40.9-42-83.1-31.8 4.3 1 8.9 2.4 13.5 4.1h-.1c-4.2 2-6.5 7.1-7 12zm28.3-1.8c19.5 11 37.4 25.7 44.9 37-5.7 3.3-21.7 10.4-38-1.7-10.3-7.6-9.8-26.2-6.9-35.3zm142.1 45.8c-1.2 15.5 13.9 32.5 13.9 32.5s-5.6-15-2.7-25.3c.9-3.2 2-6 3-8.5 19.3 17.3 48 1.5 54.8-6.1 9.6-10.6 12.3-23.8 12.8-34.1 1.8 3.8 3.4 9.1 4 16.6 0 0 6.4-9.1 5.2-19.1-.6-5-2.9-10-7-11.8h-.1c4.6-1.8 9.2-3.2 13.5-4.1-42.3-10.2-73.4 20.6-83.1 31.8-16.7 19.2-35.5 8.8-35.5 8.8-.2 10.9 10.4 18.9 21.2 19.3zm62.7-45.8c3 9.1 3.4 27.7-7 35.4-16.3 12.1-32.2 5-37.9 1.6 7.5-11.4 25.4-26 44.9-37zM160 418.5h-29.4c-5.5 0-8.2 1.6-9.5 2.9-1.9 2-2.2 4.7-.9 8.1 3.5 9.1 11.4 16.5 13.7 18.6 3.1 2.7 7.5 4.3 11.8 4.3 4.4 0 8.3-1.7 11-4.6 7.5-8.2 11.9-17.1 13-19.8.6-1.5 1.3-4.5-.9-6.8-1.8-1.8-4.7-2.7-8.8-2.7zm189.2-101.2c-2.4 17.9-13 33.8-24.6 43.7-3.1-22.7-3.7-55.5-3.7-62.4 0-14.7 9.5-24.5 12.2-26.1 2.5-1.5 5.4-3 8.3-4.6 18-9.6 40.4-21.6 40.4-43.7 0-16.2-9.3-23.2-15.4-27.8-.8-.6-1.5-1.1-2.2-1.7-2.1-1.7-3.7-3-4.3-4.4-4.4-9.8-3.6-34.2-1.7-37.6.6-.6 16.7-20.9 11.8-39.2-2-7.4-6.9-13.3-14.1-17-5.3-2.7-11.9-4.2-19.5-4.5-.1-2-.5-3.9-.9-5.9-.6-2.6-1.1-5.3-.9-8.1.4-4.7.8-9 2.2-11.3 8.4-13.3 28.8-17.6 29-17.6l12.3-2.4-8.1-9.5c-.1-.2-17.3-17.5-46.3-17.5-7.9 0-16 1.3-24.1 3.9-24.2 7.8-42.9 30.5-49.4 39.3-3.1-1-6.3-1.9-9.6-2.7-4.2-15.8 9-38.5 9-38.5s-13.6-3-33.7 15.2c-2.6-6.5-8.1-20.5-1.8-37.2C184.6 10.1 177.2 26 175 40.4c-7.6-5.4-6.7-23.1-7.2-27.6-7.5.9-29.2 21.9-28.2 48.3-2 .5-3.9 1.1-5.9 1.7-6.5-8.8-25.1-31.5-49.4-39.3-7.9-2.2-16-3.5-23.9-3.5-29 0-46.1 17.3-46.3 17.5L6 46.9l12.3 2.4c.2 0 20.6 4.3 29 17.6 1.4 2.2 1.8 6.6 2.2 11.3.2 2.8-.4 5.5-.9 8.1-.4 1.9-.8 3.9-.9 5.9-7.7.3-14.2 1.8-19.5 4.5-7.2 3.7-12.1 9.6-14.1 17-5 18.2 11.2 38.5 11.8 39.2 1.9 3.4 2.7 27.8-1.7 37.6-.6 1.4-2.2 2.7-4.3 4.4-.7.5-1.4 1.1-2.2 1.7-6.1 4.6-15.4 11.7-15.4 27.8 0 22.1 22.4 34.1 40.4 43.7 3 1.6 5.8 3.1 8.3 4.6 2.7 1.6 12.2 11.4 12.2 26.1 0 6.9-.6 39.7-3.7 62.4-11.6-9.9-22.2-25.9-24.6-43.8 0 0-29.2 22.6-20.6 70.8 5.2 29.5 23.2 46.1 47 54.7 8.8 19.1 29.4 45.7 67.3 49.6C143 504.3 163 512 192.2 512h.2c29.1 0 49.1-7.7 63.6-19.5 37.9-3.9 58.5-30.5 67.3-49.6 23.8-8.7 41.7-25.2 47-54.7 8.2-48.4-21.1-70.9-21.1-70.9zM305.7 37.7c5.6-1.8 11.6-2.7 17.7-2.7 11 0 19.9 3 24.7 5-3.1 1.4-6.4 3.2-9.7 5.3-2.4-.4-5.6-.8-9.2-.8-10.5 0-20.5 3.1-28.7 8.9-12.3 8.7-18 16.9-20.7 22.4-2.2-1.3-4.5-2.5-7.1-3.7-1.6-.8-3.1-1.5-4.7-2.2 6.1-9.1 19.9-26.5 37.7-32.2zm21 18.2c-.8 1-1.6 2.1-2.3 3.2-3.3 5.2-3.9 11.6-4.4 17.8-.5 6.4-1.1 12.5-4.4 17-4.2.8-8.1 1.7-11.5 2.7-2.3-3.1-5.6-7-10.5-11.2 1.4-4.8 5.5-16.1 13.5-22.5 5.6-4.3 12.2-6.7 19.6-7zM45.6 45.3c-3.3-2.2-6.6-4-9.7-5.3 4.8-2 13.7-5 24.7-5 6.1 0 12 .9 17.7 2.7 17.8 5.8 31.6 23.2 37.7 32.1-1.6.7-3.2 1.4-4.8 2.2-2.5 1.2-4.9 2.5-7.1 3.7-2.6-5.4-8.3-13.7-20.7-22.4-8.3-5.8-18.2-8.9-28.8-8.9-3.4.1-6.6.5-9 .9zm44.7 40.1c-4.9 4.2-8.3 8-10.5 11.2-3.4-.9-7.3-1.9-11.5-2.7C65 89.5 64.5 83.4 64 77c-.5-6.2-1.1-12.6-4.4-17.8-.7-1.1-1.5-2.2-2.3-3.2 7.4.3 14 2.6 19.5 7 8 6.3 12.1 17.6 13.5 22.4zM58.1 259.9c-2.7-1.6-5.6-3.1-8.4-4.6-14.9-8-30.2-16.3-30.2-30.5 0-11.1 4.3-14.6 8.9-18.2l.5-.4c.7-.6 1.4-1.2 2.2-1.8-.9 7.2-1.9 13.3-2.7 14.9 0 0 12.1-15 15.7-44.3 1.4-11.5-1.1-34.3-5.1-43 .2 4.9 0 9.8-.3 14.4-.4-.8-.8-1.6-1.3-2.2-3.2-4-11.8-17.5-9.4-26.6.9-3.5 3.1-6 6.7-7.8 3.8-1.9 8.8-2.9 15.1-2.9 12.3 0 25.9 3.7 32.9 6 25.1 8 55.4 30.9 64.1 37.7.2.2.4.3.4.3l5.6 3.9-3.5-5.8c-.2-.3-19.1-31.4-53.2-46.5 2-2.9 7.4-8.1 21.6-15.1 21.4-10.5 46.5-15.8 74.3-15.8 27.9 0 52.9 5.3 74.3 15.8 14.2 6.9 19.6 12.2 21.6 15.1-34 15.1-52.9 46.2-53.1 46.5l-3.5 5.8 5.6-3.9s.2-.1.4-.3c8.7-6.8 39-29.8 64.1-37.7 7-2.2 20.6-6 32.9-6 6.3 0 11.3 1 15.1 2.9 3.5 1.8 5.7 4.4 6.7 7.8 2.5 9.1-6.1 22.6-9.4 26.6-.5.6-.9 1.3-1.3 2.2-.3-4.6-.5-9.5-.3-14.4-4 8.8-6.5 31.5-5.1 43 3.6 29.3 15.7 44.3 15.7 44.3-.8-1.6-1.8-7.7-2.7-14.9.7.6 1.5 1.2 2.2 1.8l.5.4c4.6 3.7 8.9 7.1 8.9 18.2 0 14.2-15.4 22.5-30.2 30.5-2.9 1.5-5.7 3.1-8.4 4.6-8.7 5-18 16.7-19.1 34.2-.9 14.6.9 49.9 3.4 75.9-12.4 4.8-26.7 6.4-39.7 6.8-2-4.1-3.9-8.5-5.5-13.1-.7-2-19.6-51.1-26.4-62.2 5.5 39 17.5 73.7 23.5 89.6-3.5-.5-7.3-.7-11.7-.7h-117c-4.4 0-8.3.3-11.7.7 6-15.9 18.1-50.6 23.5-89.6-6.8 11.2-25.7 60.3-26.4 62.2-1.6 4.6-3.5 9-5.5 13.1-13-.4-27.2-2-39.7-6.8 2.5-26 4.3-61.2 3.4-75.9-.9-17.4-10.3-29.2-19-34.2zM34.8 404.6c-12.1-20-8.7-54.1-3.7-59.1 10.9 34.4 47.2 44.3 74.4 45.4-2.7 4.2-5.2 7.6-7 10l-1.4 1.4c-7.2 7.8-8.6 18.5-4.1 31.8-22.7-.1-46.3-9.8-58.2-29.5zm45.7 43.5c6 1.1 12.2 1.9 18.6 2.4 3.5 8 7.4 15.9 12.3 23.1-14.4-5.9-24.4-16-30.9-25.5zM192 498.2c-60.6-.1-78.3-45.8-84.9-64.7-3.7-10.5-3.4-18.2.9-23.1 2.9-3.3 9.5-7.2 24.6-7.2h118.8c15.1 0 21.8 3.9 24.6 7.2 4.2 4.8 4.5 12.6.9 23.1-6.6 18.8-24.3 64.6-84.9 64.7zm80.6-24.6c4.9-7.2 8.8-15.1 12.3-23.1 6.4-.5 12.6-1.3 18.6-2.4-6.5 9.5-16.5 19.6-30.9 25.5zm76.6-69c-12 19.7-35.6 29.3-58.1 29.7 4.5-13.3 3.1-24.1-4.1-31.8-.4-.5-.9-1-1.4-1.5-1.8-2.4-4.3-5.8-7-10 27.2-1.2 63.5-11 74.4-45.4 5 5 8.4 39.1-3.8 59zM191.9 187.7h.2c12.7-.1 27.2-17.8 27.2-17.8-9.9 6-18.8 8.1-27.3 8.3-8.5-.2-17.4-2.3-27.3-8.3 0 0 14.5 17.6 27.2 17.8zm61.7 230.7h-29.4c-4.2 0-7.2.9-8.9 2.7-2.2 2.3-1.5 5.2-.9 6.7 1 2.6 5.5 11.3 13 19.3 2.7 2.9 6.6 4.5 11 4.5s8.7-1.6 11.8-4.2c2.3-2 10.2-9.2 13.7-18.1 1.3-3.3 1-6-.9-7.9-1.3-1.3-4-2.9-9.4-3z"]
};
var faGulp = {
  prefix: 'fab',
  iconName: 'gulp',
  icon: [256, 512, [], "f3ae", "M209.8 391.1l-14.1 24.6-4.6 80.2c0 8.9-28.3 16.1-63.1 16.1s-63.1-7.2-63.1-16.1l-5.8-79.4-14.9-25.4c41.2 17.3 126 16.7 165.6 0zm-196-253.3l13.6 125.5c5.9-20 20.8-47 40-55.2 6.3-2.7 12.7-2.7 18.7.9 5.2 3 9.6 9.3 10.1 11.8 1.2 6.5-2 9.1-4.5 9.1-3 0-5.3-4.6-6.8-7.3-4.1-7.3-10.3-7.6-16.9-2.8-6.9 5-12.9 13.4-17.1 20.7-5.1 8.8-9.4 18.5-12 28.2-1.5 5.6-2.9 14.6-.6 19.9 1 2.2 2.5 3.6 4.9 3.6 5 0 12.3-6.6 15.8-10.1 4.5-4.5 10.3-11.5 12.5-16l5.2-15.5c2.6-6.8 9.9-5.6 9.9 0 0 10.2-3.7 13.6-10 34.7-5.8 19.5-7.6 25.8-7.6 25.8-.7 2.8-3.4 7.5-6.3 7.5-1.2 0-2.1-.4-2.6-1.2-1-1.4-.9-5.3-.8-6.3.2-3.2 6.3-22.2 7.3-25.2-2 2.2-4.1 4.4-6.4 6.6-5.4 5.1-14.1 11.8-21.5 11.8-3.4 0-5.6-.9-7.7-2.4l7.6 79.6c2 5 39.2 17.1 88.2 17.1 49.1 0 86.3-12.2 88.2-17.1l10.9-94.6c-5.7 5.2-12.3 11.6-19.6 14.8-5.4 2.3-17.4 3.8-17.4-5.7 0-5.2 9.1-14.8 14.4-21.5 1.4-1.7 4.7-5.9 4.7-8.1 0-2.9-6-2.2-11.7 2.5-3.2 2.7-6.2 6.3-8.7 9.7-4.3 6-6.6 11.2-8.5 15.5-6.2 14.2-4.1 8.6-9.1 22-5 13.3-4.2 11.8-5.2 14-.9 1.9-2.2 3.5-4 4.5-1.9 1-4.5.9-6.1-.3-.9-.6-1.3-1.9-1.3-3.7 0-.9.1-1.8.3-2.7 1.5-6.1 7.8-18.1 15-34.3 1.6-3.7 1-2.6.8-2.3-6.2 6-10.9 8.9-14.4 10.5-5.8 2.6-13 2.6-14.5-4.1-.1-.4-.1-.8-.2-1.2-11.8 9.2-24.3 11.7-20-8.1-4.6 8.2-12.6 14.9-22.4 14.9-4.1 0-7.1-1.4-8.6-5.1-2.3-5.5 1.3-14.9 4.6-23.8 1.7-4.5 4-9.9 7.1-16.2 1.6-3.4 4.2-5.4 7.6-4.5.6.2 1.1.4 1.6.7 2.6 1.8 1.6 4.5.3 7.2-3.8 7.5-7.1 13-9.3 20.8-.9 3.3-2 9 1.5 9 2.4 0 4.7-.8 6.9-2.4 4.6-3.4 8.3-8.5 11.1-13.5 2-3.6 4.4-8.3 5.6-12.3.5-1.7 1.1-3.3 1.8-4.8 1.1-2.5 2.6-5.1 5.2-5.1 1.3 0 2.4.5 3.2 1.5 1.7 2.2 1.3 4.5.4 6.9-2 5.6-4.7 10.6-6.9 16.7-1.3 3.5-2.7 8-2.7 11.7 0 3.4 3.7 2.6 6.8 1.2 2.4-1.1 4.8-2.8 6.8-4.5 1.2-4.9.9-3.8 26.4-68.2 1.3-3.3 3.7-4.7 6.1-4.7 1.2 0 2.2.4 3.2 1.1 1.7 1.3 1.7 4.1 1 6.2-.7 1.9-.6 1.3-4.5 10.5-5.2 12.1-8.6 20.8-13.2 31.9-1.9 4.6-7.7 18.9-8.7 22.3-.6 2.2-1.3 5.8 1 5.8 5.4 0 19.3-13.1 23.1-17 .2-.3.5-.4.9-.6.6-1.9 1.2-3.7 1.7-5.5 1.4-3.8 2.7-8.2 5.3-11.3.8-1 1.7-1.6 2.7-1.6 2.8 0 4.2 1.2 4.2 4 0 1.1-.7 5.1-1.1 6.2 1.4-1.5 2.9-3 4.5-4.5 15-13.9 25.7-6.8 25.7.2 0 7.4-8.9 17.7-13.8 23.4-1.6 1.9-4.9 5.4-5 6.4 0 1.3.9 1.8 2.2 1.8 2 0 6.4-3.5 8-4.7 5-3.9 11.8-9.9 16.6-14.1l14.8-136.8c-30.5 17.1-197.6 17.2-228.3.2zm229.7-8.5c0 21-231.2 21-231.2 0 0-8.8 51.8-15.9 115.6-15.9 9 0 17.8.1 26.3.4l12.6-48.7L228.1.6c1.4-1.4 5.8-.2 9.9 3.5s6.6 7.9 5.3 9.3l-.1.1L185.9 74l-10 40.7c39.9 2.6 67.6 8.1 67.6 14.6zm-69.4 4.6c0-.8-.9-1.5-2.5-2.1l-.2.8c0 1.3-5 2.4-11.1 2.4s-11.1-1.1-11.1-2.4c0-.1 0-.2.1-.3l.2-.7c-1.8.6-3 1.4-3 2.3 0 2.1 6.2 3.7 13.7 3.7 7.7.1 13.9-1.6 13.9-3.7z"]
};
var faHackerNews = {
  prefix: 'fab',
  iconName: 'hacker-news',
  icon: [448, 512, [], "f1d4", "M0 32v448h448V32H0zm21.2 197.2H21c.1-.1.2-.3.3-.4 0 .1 0 .3-.1.4zm218 53.9V384h-31.4V281.3L128 128h37.3c52.5 98.3 49.2 101.2 59.3 125.6 12.3-27 5.8-24.4 60.6-125.6H320l-80.8 155.1z"]
};
var faHackerNewsSquare = {
  prefix: 'fab',
  iconName: 'hacker-news-square',
  icon: [448, 512, [], "f3af", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM21.2 229.2H21c.1-.1.2-.3.3-.4 0 .1 0 .3-.1.4zm218 53.9V384h-31.4V281.3L128 128h37.3c52.5 98.3 49.2 101.2 59.3 125.6 12.3-27 5.8-24.4 60.6-125.6H320l-80.8 155.1z"]
};
var faHackerrank = {
  prefix: 'fab',
  iconName: 'hackerrank',
  icon: [512, 512, [], "f5f7", "M477.5 128C463 103.05 285.13 0 256.16 0S49.25 102.79 34.84 128s-14.49 230.8 0 256 192.38 128 221.32 128S463 409.08 477.49 384s14.51-231 .01-256zM316.13 414.22c-4 0-40.91-35.77-38-38.69.87-.87 6.26-1.48 17.55-1.83 0-26.23.59-68.59.94-86.32 0-2-.44-3.43-.44-5.85h-79.93c0 7.1-.46 36.2 1.37 72.88.23 4.54-1.58 6-5.74 5.94-10.13 0-20.27-.11-30.41-.08-4.1 0-5.87-1.53-5.74-6.11.92-33.44 3-84-.15-212.67v-3.17c-9.67-.35-16.38-1-17.26-1.84-2.92-2.92 34.54-38.69 38.49-38.69s41.17 35.78 38.27 38.69c-.87.87-7.9 1.49-16.77 1.84v3.16c-2.42 25.75-2 79.59-2.63 105.39h80.26c0-4.55.39-34.74-1.2-83.64-.1-3.39.95-5.17 4.21-5.2 11.07-.08 22.15-.13 33.23-.06 3.46 0 4.57 1.72 4.5 5.38C333 354.64 336 341.29 336 373.69c8.87.35 16.82 1 17.69 1.84 2.88 2.91-33.62 38.69-37.58 38.69z"]
};
var faHips = {
  prefix: 'fab',
  iconName: 'hips',
  icon: [640, 512, [], "f452", "M251.6 157.6c0-1.9-.9-2.8-2.8-2.8h-40.9c-1.6 0-2.7 1.4-2.7 2.8v201.8c0 1.4 1.1 2.8 2.7 2.8h40.9c1.9 0 2.8-.9 2.8-2.8zM156.5 168c-16.1-11.8-36.3-17.9-60.3-18-18.1-.1-34.6 3.7-49.8 11.4V80.2c0-1.8-.9-2.7-2.8-2.7H2.7c-1.8 0-2.7.9-2.7 2.7v279.2c0 1.9.9 2.8 2.7 2.8h41c1.9 0 2.8-.9 2.8-2.8V223.3c0-.8-2.8-27 45.8-27 48.5 0 45.8 26.1 45.8 27v122.6c0 9 7.3 16.3 16.4 16.3h27.3c1.8 0 2.7-.9 2.7-2.8V223.3c0-23.4-9.3-41.8-28-55.3zm478.4 110.1c-6.8-15.7-18.4-27-34.9-34.1l-57.6-25.3c-8.6-3.6-9.2-11.2-2.6-16.1 7.4-5.5 44.3-13.9 84 6.8 1.7 1 4-.3 4-2.4v-44.7c0-1.3-.6-2.1-1.9-2.6-17.7-6.6-36.1-9.9-55.1-9.9-26.5 0-45.3 5.8-58.5 15.4-.5.4-28.4 20-22.7 53.7 3.4 19.6 15.8 34.2 37.2 43.6l53.6 23.5c11.6 5.1 15.2 13.3 12.2 21.2-3.7 9.1-13.2 13.6-36.5 13.6-24.3 0-44.7-8.9-58.4-19.1-2.1-1.4-4.4.2-4.4 2.3v34.4c0 10.4 4.9 17.3 14.6 20.7 15.6 5.5 31.6 8.2 48.2 8.2 12.7 0 25.8-1.2 36.3-4.3.7-.3 36-8.9 45.6-45.8 3.5-13.5 2.4-26.5-3.1-39.1zM376.2 149.8c-31.7 0-104.2 20.1-104.2 103.5v183.5c0 .8.6 2.7 2.7 2.7h40.9c1.9 0 2.8-.9 2.8-2.7V348c16.5 12.7 35.8 19.1 57.7 19.1 60.5 0 108.7-48.5 108.7-108.7.1-60.3-48.2-108.6-108.6-108.6zm0 170.9c-17.2 0-31.9-6.1-44-18.2-12.2-12.2-18.2-26.8-18.2-44 0-34.5 27.6-62.2 62.2-62.2 34.5 0 62.2 27.6 62.2 62.2.1 34.3-27.3 62.2-62.2 62.2zM228.3 72.5c-15.9 0-28.8 12.9-28.9 28.9 0 15.6 12.7 28.9 28.9 28.9s28.9-13.1 28.9-28.9c0-16.2-13-28.9-28.9-28.9z"]
};
var faHireAHelper = {
  prefix: 'fab',
  iconName: 'hire-a-helper',
  icon: [512, 512, [], "f3b0", "M443.1 0H71.9C67.9 37.3 37.4 67.8 0 71.7v371.5c37.4 4.9 66 32.4 71.9 68.8h372.2c3-36.4 32.5-65.8 67.9-69.8V71.7c-36.4-5.9-65-35.3-68.9-71.7zm-37 404.9c-36.3 0-18.8-2-55.1-2-35.8 0-21 2-56.1 2-5.9 0-4.9-8.2 0-9.8 22.8-7.6 22.9-10.2 24.6-12.8 10.4-15.6 5.9-83 5.9-113 0-5.3-6.4-12.8-13.8-12.8H200.4c-7.4 0-13.8 7.5-13.8 12.8 0 30-4.5 97.4 5.9 113 1.7 2.5 1.8 5.2 24.6 12.8 4.9 1.6 6 9.8 0 9.8-35.1 0-20.3-2-56.1-2-36.3 0-18.8 2-55.1 2-7.9 0-5.8-10.8 0-10.8 10.2-3.4 13.5-3.5 21.7-13.8 7.7-12.9 7.9-44.4 7.9-127.8V151.3c0-22.2-12.2-28.3-28.6-32.4-8.8-2.2-4-11.8 1-11.8 36.5 0 20.6 2 57.1 2 32.7 0 16.5-2 49.2-2 3.3 0 8.5 8.3 1 10.8-4.9 1.6-27.6 3.7-27.6 39.3 0 45.6-.2 55.8 1 68.8 0 1.3 2.3 12.8 12.8 12.8h109.2c10.5 0 12.8-11.5 12.8-12.8 1.2-13 1-23.2 1-68.8 0-35.6-22.7-37.7-27.6-39.3-7.5-2.5-2.3-10.8 1-10.8 32.7 0 16.5 2 49.2 2 36.5 0 20.6-2 57.1-2 4.9 0 9.9 9.6 1 11.8-16.4 4.1-28.6 10.3-28.6 32.4v101.2c0 83.4.1 114.9 7.9 127.8 8.2 10.2 11.4 10.4 21.7 13.8 5.8 0 7.8 10.8 0 10.8z"]
};
var faHooli = {
  prefix: 'fab',
  iconName: 'hooli',
  icon: [640, 512, [], "f427", "M144.5 352l38.3.8c-13.2-4.6-26-10.2-38.3-16.8zm57.7-5.3v5.3l-19.4.8c36.5 12.5 69.9 14.2 94.7 7.2-19.9.2-45.8-2.6-75.3-13.3zm408.9-115.2c15.9 0 28.9-12.9 28.9-28.9s-12.9-24.5-28.9-24.5c-15.9 0-28.9 8.6-28.9 24.5s12.9 28.9 28.9 28.9zm-29 120.5H640V241.5h-57.9zm-73.7 0h57.9V156.7L508.4 184zm-31-119.4c-18.2-18.2-50.4-17.1-50.4-17.1s-32.3-1.1-50.4 17.1c-18.2 18.2-16.8 33.9-16.8 52.6s-1.4 34.3 16.8 52.5 50.4 17.1 50.4 17.1 32.3 1.1 50.4-17.1c18.2-18.2 16.8-33.8 16.8-52.5-.1-18.8 1.3-34.5-16.8-52.6zm-39.8 71.9c0 3.6-1.8 12.5-10.7 12.5s-10.7-8.9-10.7-12.5v-40.4c0-8.7 7.3-10.9 10.7-10.9s10.7 2.1 10.7 10.9zm-106.2-71.9c-18.2-18.2-50.4-17.1-50.4-17.1s-32.2-1.1-50.4 17.1c-1.9 1.9-3.7 3.9-5.3 6-38.2-29.6-72.5-46.5-102.1-61.1v-20.7l-22.5 10.6c-54.4-22.1-89-18.2-97.3.1 0 0-24.9 32.8 61.8 110.8V352h57.9v-28.6c-6.5-4.2-13-8.7-19.4-13.6-14.8-11.2-27.4-21.6-38.4-31.4v-31c13.1 14.7 30.5 31.4 53.4 50.3l4.5 3.6v-29.8c0-6.9 1.7-18.2 10.8-18.2s10.6 6.9 10.6 15V317c18 12.2 37.3 22.1 57.7 29.6v-93.9c0-18.7-13.4-37.4-40.6-37.4-15.8-.1-30.5 8.2-38.5 21.9v-54.3c41.9 20.9 83.9 46.5 99.9 58.3-10.2 14.6-9.3 28.1-9.3 43.7 0 18.7-1.4 34.3 16.8 52.5s50.4 17.1 50.4 17.1 32.3 1.1 50.4-17.1c18.2-18.2 16.7-33.8 16.7-52.5 0-18.5 1.5-34.2-16.7-52.3zM65.2 184v63.3c-48.7-54.5-38.9-76-35.2-79.1 13.5-11.4 37.5-8 64.4 2.1zm226.5 120.5c0 3.6-1.8 12.5-10.7 12.5s-10.7-8.9-10.7-12.5v-40.4c0-8.7 7.3-10.9 10.7-10.9s10.7 2.1 10.7 10.9z"]
};
var faHornbill = {
  prefix: 'fab',
  iconName: 'hornbill',
  icon: [512, 512, [], "f592", "M76.38 370.3a37.8 37.8 0 1 1-32.07-32.42c-78.28-111.35 52-190.53 52-190.53-5.86 43-8.24 91.16-8.24 91.16-67.31 41.49.93 64.06 39.81 72.87a140.38 140.38 0 0 0 131.66 91.94c1.92 0 3.77-.21 5.67-.28l.11 18.86c-99.22 1.39-158.7-29.14-188.94-51.6zm108-327.7A37.57 37.57 0 0 0 181 21.45a37.95 37.95 0 1 0-31.17 54.22c-22.55 29.91-53.83 89.57-52.42 190l21.84-.15c0-.9-.14-1.77-.14-2.68A140.42 140.42 0 0 1 207 132.71c8-37.71 30.7-114.3 73.8-44.29 0 0 48.14 2.38 91.18 8.24 0 0-77.84-128-187.59-54.06zm304.19 134.17a37.94 37.94 0 1 0-53.84-28.7C403 126.13 344.89 99 251.28 100.33l.14 22.5c2.7-.15 5.39-.41 8.14-.41a140.37 140.37 0 0 1 130.49 88.76c39.1 9 105.06 31.58 38.46 72.54 0 0-2.34 48.13-8.21 91.16 0 0 133.45-81.16 49-194.61a37.45 37.45 0 0 0 19.31-3.5zM374.06 436.24c21.43-32.46 46.42-89.69 45.14-179.66l-19.52.14c.08 2.06.3 4.07.3 6.15a140.34 140.34 0 0 1-91.39 131.45c-8.85 38.95-31.44 106.66-72.77 39.49 0 0-48.12-2.34-91.19-8.22 0 0 79.92 131.34 191.9 51a37.5 37.5 0 0 0 3.64 14 37.93 37.93 0 1 0 33.89-54.29z"]
};
var faHotjar = {
  prefix: 'fab',
  iconName: 'hotjar',
  icon: [448, 512, [], "f3b1", "M414.9 161.5C340.2 29 121.1 0 121.1 0S222.2 110.4 93 197.7C11.3 252.8-21 324.4 14 402.6c26.8 59.9 83.5 84.3 144.6 93.4-29.2-55.1-6.6-122.4-4.1-129.6 57.1 86.4 165 0 110.8-93.9 71 15.4 81.6 138.6 27.1 215.5 80.5-25.3 134.1-88.9 148.8-145.6 15.5-59.3 3.7-127.9-26.3-180.9z"]
};
var faHouzz = {
  prefix: 'fab',
  iconName: 'houzz',
  icon: [448, 512, [], "f27c", "M275.9 330.7H171.3V480H17V32h109.5v104.5l305.1 85.6V480H275.9z"]
};
var faHtml5 = {
  prefix: 'fab',
  iconName: 'html5',
  icon: [384, 512, [], "f13b", "M0 32l34.9 395.8L191.5 480l157.6-52.2L384 32H0zm308.2 127.9H124.4l4.1 49.4h175.6l-13.6 148.4-97.9 27v.3h-1.1l-98.7-27.3-6-75.8h47.7L138 320l53.5 14.5 53.7-14.5 6-62.2H84.3L71.5 112.2h241.1l-4.4 47.7z"]
};
var faHubspot = {
  prefix: 'fab',
  iconName: 'hubspot',
  icon: [512, 512, [], "f3b2", "M267.4 211.6c-25.1 23.7-40.8 57.3-40.8 94.6 0 29.3 9.7 56.3 26 78L203.1 434c-4.4-1.6-9.1-2.5-14-2.5-10.8 0-20.9 4.2-28.5 11.8-7.6 7.6-11.8 17.8-11.8 28.6s4.2 20.9 11.8 28.5c7.6 7.6 17.8 11.6 28.5 11.6 10.8 0 20.9-3.9 28.6-11.6 7.6-7.6 11.8-17.8 11.8-28.5 0-4.2-.6-8.2-1.9-12.1l50-50.2c22 16.9 49.4 26.9 79.3 26.9 71.9 0 130-58.3 130-130.2 0-65.2-47.7-119.2-110.2-128.7V116c17.5-7.4 28.2-23.8 28.2-42.9 0-26.1-20.9-47.9-47-47.9S311.2 47 311.2 73.1c0 19.1 10.7 35.5 28.2 42.9v61.2c-15.2 2.1-29.6 6.7-42.7 13.6-27.6-20.9-117.5-85.7-168.9-124.8 1.2-4.4 2-9 2-13.8C129.8 23.4 106.3 0 77.4 0 48.6 0 25.2 23.4 25.2 52.2c0 28.9 23.4 52.3 52.2 52.3 9.8 0 18.9-2.9 26.8-7.6l163.2 114.7zm89.5 163.6c-38.1 0-69-30.9-69-69s30.9-69 69-69 69 30.9 69 69-30.9 69-69 69z"]
};
var faIdeal = {
  prefix: 'fab',
  iconName: 'ideal',
  icon: [576, 512, [], "f913", "M125.61,165.48a49.07,49.07,0,1,0,49.06,49.06A49.08,49.08,0,0,0,125.61,165.48ZM86.15,425.84h78.94V285.32H86.15Zm151.46-211.6c0-20-10-22.53-18.74-22.53H204.82V237.5h14.05C228.62,237.5,237.61,234.69,237.61,214.24Zm201.69,46V168.93h22.75V237.5h33.69C486.5,113.08,388.61,86.19,299.67,86.19H204.84V169h14c25.6,0,41.5,17.35,41.5,45.26,0,28.81-15.52,46-41.5,46h-14V425.88h94.83c144.61,0,194.94-67.16,196.72-165.64Zm-109.75,0H273.3V169h54.43v22.73H296v10.58h30V225H296V237.5h33.51Zm74.66,0-5.16-17.67H369.31l-5.18,17.67H340.47L368,168.92h32.35l27.53,91.34ZM299.65,32H32V480H299.65c161.85,0,251-79.73,251-224.52C550.62,172,518,32,299.65,32Zm0,426.92H53.07V53.07H299.65c142.1,0,229.9,64.61,229.9,202.41C529.55,389.57,448.55,458.92,299.65,458.92Zm83.86-264.85L376,219.88H392.4l-7.52-25.81Z"]
};
var faImdb = {
  prefix: 'fab',
  iconName: 'imdb',
  icon: [448, 512, [], "f2d8", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM21.3 229.2H21c.1-.1.2-.3.3-.4zM97 319.8H64V192h33zm113.2 0h-28.7v-86.4l-11.6 86.4h-20.6l-12.2-84.5v84.5h-29V192h42.8c3.3 19.8 6 39.9 8.7 59.9l7.6-59.9h43zm11.4 0V192h24.6c17.6 0 44.7-1.6 49 20.9 1.7 7.6 1.4 16.3 1.4 24.4 0 88.5 11.1 82.6-75 82.5zm160.9-29.2c0 15.7-2.4 30.9-22.2 30.9-9 0-15.2-3-20.9-9.8l-1.9 8.1h-29.8V192h31.7v41.7c6-6.5 12-9.2 20.9-9.2 21.4 0 22.2 12.8 22.2 30.1zM265 229.9c0-9.7 1.6-16-10.3-16v83.7c12.2.3 10.3-8.7 10.3-18.4zm85.5 26.1c0-5.4 1.1-12.7-6.2-12.7-6 0-4.9 8.9-4.9 12.7 0 .6-1.1 39.6 1.1 44.7.8 1.6 2.2 2.4 3.8 2.4 7.8 0 6.2-9 6.2-14.4z"]
};
var faInstagram = {
  prefix: 'fab',
  iconName: 'instagram',
  icon: [448, 512, [], "f16d", "M224.1 141c-63.6 0-114.9 51.3-114.9 114.9s51.3 114.9 114.9 114.9S339 319.5 339 255.9 287.7 141 224.1 141zm0 189.6c-41.1 0-74.7-33.5-74.7-74.7s33.5-74.7 74.7-74.7 74.7 33.5 74.7 74.7-33.6 74.7-74.7 74.7zm146.4-194.3c0 14.9-12 26.8-26.8 26.8-14.9 0-26.8-12-26.8-26.8s12-26.8 26.8-26.8 26.8 12 26.8 26.8zm76.1 27.2c-1.7-35.9-9.9-67.7-36.2-93.9-26.2-26.2-58-34.4-93.9-36.2-37-2.1-147.9-2.1-184.9 0-35.8 1.7-67.6 9.9-93.9 36.1s-34.4 58-36.2 93.9c-2.1 37-2.1 147.9 0 184.9 1.7 35.9 9.9 67.7 36.2 93.9s58 34.4 93.9 36.2c37 2.1 147.9 2.1 184.9 0 35.9-1.7 67.7-9.9 93.9-36.2 26.2-26.2 34.4-58 36.2-93.9 2.1-37 2.1-147.8 0-184.8zM398.8 388c-7.8 19.6-22.9 34.7-42.6 42.6-29.5 11.7-99.5 9-132.1 9s-102.7 2.6-132.1-9c-19.6-7.8-34.7-22.9-42.6-42.6-11.7-29.5-9-99.5-9-132.1s-2.6-102.7 9-132.1c7.8-19.6 22.9-34.7 42.6-42.6 29.5-11.7 99.5-9 132.1-9s102.7-2.6 132.1 9c19.6 7.8 34.7 22.9 42.6 42.6 11.7 29.5 9 99.5 9 132.1s2.7 102.7-9 132.1z"]
};
var faInstagramSquare = {
  prefix: 'fab',
  iconName: 'instagram-square',
  icon: [448, 512, [], "f955", "M224,202.66A53.34,53.34,0,1,0,277.36,256,53.38,53.38,0,0,0,224,202.66Zm124.71-41a54,54,0,0,0-30.41-30.41c-21-8.29-71-6.43-94.3-6.43s-73.25-1.93-94.31,6.43a54,54,0,0,0-30.41,30.41c-8.28,21-6.43,71.05-6.43,94.33S91,329.26,99.32,350.33a54,54,0,0,0,30.41,30.41c21,8.29,71,6.43,94.31,6.43s73.24,1.93,94.3-6.43a54,54,0,0,0,30.41-30.41c8.35-21,6.43-71.05,6.43-94.33S357.1,182.74,348.75,161.67ZM224,338a82,82,0,1,1,82-82A81.9,81.9,0,0,1,224,338Zm85.38-148.3a19.14,19.14,0,1,1,19.13-19.14A19.1,19.1,0,0,1,309.42,189.74ZM400,32H48A48,48,0,0,0,0,80V432a48,48,0,0,0,48,48H400a48,48,0,0,0,48-48V80A48,48,0,0,0,400,32ZM382.88,322c-1.29,25.63-7.14,48.34-25.85,67s-41.4,24.63-67,25.85c-26.41,1.49-105.59,1.49-132,0-25.63-1.29-48.26-7.15-67-25.85s-24.63-41.42-25.85-67c-1.49-26.42-1.49-105.61,0-132,1.29-25.63,7.07-48.34,25.85-67s41.47-24.56,67-25.78c26.41-1.49,105.59-1.49,132,0,25.63,1.29,48.33,7.15,67,25.85s24.63,41.42,25.85,67.05C384.37,216.44,384.37,295.56,382.88,322Z"]
};
var faIntercom = {
  prefix: 'fab',
  iconName: 'intercom',
  icon: [448, 512, [], "f7af", "M392 32H56C25.1 32 0 57.1 0 88v336c0 30.9 25.1 56 56 56h336c30.9 0 56-25.1 56-56V88c0-30.9-25.1-56-56-56zm-108.3 82.1c0-19.8 29.9-19.8 29.9 0v199.5c0 19.8-29.9 19.8-29.9 0V114.1zm-74.6-7.5c0-19.8 29.9-19.8 29.9 0v216.5c0 19.8-29.9 19.8-29.9 0V106.6zm-74.7 7.5c0-19.8 29.9-19.8 29.9 0v199.5c0 19.8-29.9 19.8-29.9 0V114.1zM59.7 144c0-19.8 29.9-19.8 29.9 0v134.3c0 19.8-29.9 19.8-29.9 0V144zm323.4 227.8c-72.8 63-241.7 65.4-318.1 0-15-12.8 4.4-35.5 19.4-22.7 65.9 55.3 216.1 53.9 279.3 0 14.9-12.9 34.3 9.8 19.4 22.7zm5.2-93.5c0 19.8-29.9 19.8-29.9 0V144c0-19.8 29.9-19.8 29.9 0v134.3z"]
};
var faInternetExplorer = {
  prefix: 'fab',
  iconName: 'internet-explorer',
  icon: [512, 512, [], "f26b", "M483.049 159.706c10.855-24.575 21.424-60.438 21.424-87.871 0-72.722-79.641-98.371-209.673-38.577-107.632-7.181-211.221 73.67-237.098 186.457 30.852-34.862 78.271-82.298 121.977-101.158C125.404 166.85 79.128 228.002 43.992 291.725 23.246 329.651 0 390.94 0 436.747c0 98.575 92.854 86.5 180.251 42.006 31.423 15.43 66.559 15.573 101.695 15.573 97.124 0 184.249-54.294 216.814-146.022H377.927c-52.509 88.593-196.819 52.996-196.819-47.436H509.9c6.407-43.581-1.655-95.715-26.851-141.162zM64.559 346.877c17.711 51.15 53.703 95.871 100.266 123.304-88.741 48.94-173.267 29.096-100.266-123.304zm115.977-108.873c2-55.151 50.276-94.871 103.98-94.871 53.418 0 101.981 39.72 103.981 94.871H180.536zm184.536-187.6c21.425-10.287 48.563-22.003 72.558-22.003 31.422 0 54.274 21.717 54.274 53.722 0 20.003-7.427 49.007-14.569 67.867-26.28-42.292-65.986-81.584-112.263-99.586z"]
};
var faInvision = {
  prefix: 'fab',
  iconName: 'invision',
  icon: [448, 512, [], "f7b0", "M407.4 32H40.6C18.2 32 0 50.2 0 72.6v366.8C0 461.8 18.2 480 40.6 480h366.8c22.4 0 40.6-18.2 40.6-40.6V72.6c0-22.4-18.2-40.6-40.6-40.6zM176.1 145.6c.4 23.4-22.4 27.3-26.6 27.4-14.9 0-27.1-12-27.1-27 .1-35.2 53.1-35.5 53.7-.4zM332.8 377c-65.6 0-34.1-74-25-106.6 14.1-46.4-45.2-59-59.9.7l-25.8 103.3H177l8.1-32.5c-31.5 51.8-94.6 44.4-94.6-4.3.1-14.3.9-14 23-104.1H81.7l9.7-35.6h76.4c-33.6 133.7-32.6 126.9-32.9 138.2 0 20.9 40.9 13.5 57.4-23.2l19.8-79.4h-32.3l9.7-35.6h68.8l-8.9 40.5c40.5-75.5 127.9-47.8 101.8 38-14.2 51.1-14.6 50.7-14.9 58.8 0 15.5 17.5 22.6 31.8-16.9L386 325c-10.5 36.7-29.4 52-53.2 52z"]
};
var faIoxhost = {
  prefix: 'fab',
  iconName: 'ioxhost',
  icon: [640, 512, [], "f208", "M616 160h-67.3C511.2 70.7 422.9 8 320 8 183 8 72 119 72 256c0 16.4 1.6 32.5 4.7 48H24c-13.3 0-24 10.8-24 24 0 13.3 10.7 24 24 24h67.3c37.5 89.3 125.8 152 228.7 152 137 0 248-111 248-248 0-16.4-1.6-32.5-4.7-48H616c13.3 0 24-10.8 24-24 0-13.3-10.7-24-24-24zm-96 96c0 110.5-89.5 200-200 200-75.7 0-141.6-42-175.5-104H424c13.3 0 24-10.8 24-24 0-13.3-10.7-24-24-24H125.8c-3.8-15.4-5.8-31.4-5.8-48 0-110.5 89.5-200 200-200 75.7 0 141.6 42 175.5 104H216c-13.3 0-24 10.8-24 24 0 13.3 10.7 24 24 24h298.2c3.8 15.4 5.8 31.4 5.8 48zm-304-24h208c13.3 0 24 10.7 24 24 0 13.2-10.7 24-24 24H216c-13.3 0-24-10.7-24-24 0-13.2 10.7-24 24-24z"]
};
var faItchIo = {
  prefix: 'fab',
  iconName: 'itch-io',
  icon: [512, 512, [], "f83a", "M71.92 34.77C50.2 47.67 7.4 96.84 7 109.73v21.34c0 27.06 25.29 50.84 48.25 50.84 27.57 0 50.54-22.85 50.54-50 0 27.12 22.18 50 49.76 50s49-22.85 49-50c0 27.12 23.59 50 51.16 50h.5c27.57 0 51.16-22.85 51.16-50 0 27.12 21.47 50 49 50s49.76-22.85 49.76-50c0 27.12 23 50 50.54 50 23 0 48.25-23.78 48.25-50.84v-21.34c-.4-12.9-43.2-62.07-64.92-75C372.56 32.4 325.76 32 256 32S91.14 33.1 71.92 34.77zm132.32 134.39c-22 38.4-77.9 38.71-99.85.25-13.17 23.14-43.17 32.07-56 27.66-3.87 40.15-13.67 237.13 17.73 269.15 80 18.67 302.08 18.12 379.76 0 31.65-32.27 21.32-232 17.75-269.15-12.92 4.44-42.88-4.6-56-27.66-22 38.52-77.85 38.1-99.85-.24-7.1 12.49-23.05 28.94-51.76 28.94a57.54 57.54 0 0 1-51.75-28.94zm-41.58 53.77c16.47 0 31.09 0 49.22 19.78a436.91 436.91 0 0 1 88.18 0C318.22 223 332.85 223 349.31 223c52.33 0 65.22 77.53 83.87 144.45 17.26 62.15-5.52 63.67-33.95 63.73-42.15-1.57-65.49-32.18-65.49-62.79-39.25 6.43-101.93 8.79-155.55 0 0 30.61-23.34 61.22-65.49 62.79-28.42-.06-51.2-1.58-33.94-63.73 18.67-67 31.56-144.45 83.88-144.45zM256 270.79s-44.38 40.77-52.35 55.21l29-1.17v25.32c0 1.55 21.34.16 23.33.16 11.65.54 23.31 1 23.31-.16v-25.28l29 1.17c-8-14.48-52.35-55.24-52.35-55.24z"]
};
var faItunes = {
  prefix: 'fab',
  iconName: 'itunes',
  icon: [448, 512, [], "f3b4", "M223.6 80.3C129 80.3 52.5 157 52.5 251.5S129 422.8 223.6 422.8s171.2-76.7 171.2-171.2c0-94.6-76.7-171.3-171.2-171.3zm79.4 240c-3.2 13.6-13.5 21.2-27.3 23.8-12.1 2.2-22.2 2.8-31.9-5-11.8-10-12-26.4-1.4-36.8 8.4-8 20.3-9.6 38-12.8 3-.5 5.6-1.2 7.7-3.7 3.2-3.6 2.2-2 2.2-80.8 0-5.6-2.7-7.1-8.4-6.1-4 .7-91.9 17.1-91.9 17.1-5 1.1-6.7 2.6-6.7 8.3 0 116.1.5 110.8-1.2 118.5-2.1 9-7.6 15.8-14.9 19.6-8.3 4.6-23.4 6.6-31.4 5.2-21.4-4-28.9-28.7-14.4-42.9 8.4-8 20.3-9.6 38-12.8 3-.5 5.6-1.2 7.7-3.7 5-5.7.9-127 2.6-133.7.4-2.6 1.5-4.8 3.5-6.4 2.1-1.7 5.8-2.7 6.7-2.7 101-19 113.3-21.4 115.1-21.4 5.7-.4 9 3 9 8.7-.1 170.6.4 161.4-1 167.6zM345.2 32H102.8C45.9 32 0 77.9 0 134.8v242.4C0 434.1 45.9 480 102.8 480h242.4c57 0 102.8-45.9 102.8-102.8V134.8C448 77.9 402.1 32 345.2 32zM223.6 444c-106.3 0-192.5-86.2-192.5-192.5S117.3 59 223.6 59s192.5 86.2 192.5 192.5S329.9 444 223.6 444z"]
};
var faItunesNote = {
  prefix: 'fab',
  iconName: 'itunes-note',
  icon: [384, 512, [], "f3b5", "M381.9 388.2c-6.4 27.4-27.2 42.8-55.1 48-24.5 4.5-44.9 5.6-64.5-10.2-23.9-20.1-24.2-53.4-2.7-74.4 17-16.2 40.9-19.5 76.8-25.8 6-1.1 11.2-2.5 15.6-7.4 6.4-7.2 4.4-4.1 4.4-163.2 0-11.2-5.5-14.3-17-12.3-8.2 1.4-185.7 34.6-185.7 34.6-10.2 2.2-13.4 5.2-13.4 16.7 0 234.7 1.1 223.9-2.5 239.5-4.2 18.2-15.4 31.9-30.2 39.5-16.8 9.3-47.2 13.4-63.4 10.4-43.2-8.1-58.4-58-29.1-86.6 17-16.2 40.9-19.5 76.8-25.8 6-1.1 11.2-2.5 15.6-7.4 10.1-11.5 1.8-256.6 5.2-270.2.8-5.2 3-9.6 7.1-12.9 4.2-3.5 11.8-5.5 13.4-5.5 204-38.2 228.9-43.1 232.4-43.1 11.5-.8 18.1 6 18.1 17.6.2 344.5 1.1 326-1.8 338.5z"]
};
var faJava = {
  prefix: 'fab',
  iconName: 'java',
  icon: [384, 512, [], "f4e4", "M277.74 312.9c9.8-6.7 23.4-12.5 23.4-12.5s-38.7 7-77.2 10.2c-47.1 3.9-97.7 4.7-123.1 1.3-60.1-8 33-30.1 33-30.1s-36.1-2.4-80.6 19c-52.5 25.4 130 37 224.5 12.1zm-85.4-32.1c-19-42.7-83.1-80.2 0-145.8C296 53.2 242.84 0 242.84 0c21.5 84.5-75.6 110.1-110.7 162.6-23.9 35.9 11.7 74.4 60.2 118.2zm114.6-176.2c.1 0-175.2 43.8-91.5 140.2 24.7 28.4-6.5 54-6.5 54s62.7-32.4 33.9-72.9c-26.9-37.8-47.5-56.6 64.1-121.3zm-6.1 270.5a12.19 12.19 0 0 1-2 2.6c128.3-33.7 81.1-118.9 19.8-97.3a17.33 17.33 0 0 0-8.2 6.3 70.45 70.45 0 0 1 11-3c31-6.5 75.5 41.5-20.6 91.4zM348 437.4s14.5 11.9-15.9 21.2c-57.9 17.5-240.8 22.8-291.6.7-18.3-7.9 16-19 26.8-21.3 11.2-2.4 17.7-2 17.7-2-20.3-14.3-131.3 28.1-56.4 40.2C232.84 509.4 401 461.3 348 437.4zM124.44 396c-78.7 22 47.9 67.4 148.1 24.5a185.89 185.89 0 0 1-28.2-13.8c-44.7 8.5-65.4 9.1-106 4.5-33.5-3.8-13.9-15.2-13.9-15.2zm179.8 97.2c-78.7 14.8-175.8 13.1-233.3 3.6 0-.1 11.8 9.7 72.4 13.6 92.2 5.9 233.8-3.3 237.1-46.9 0 0-6.4 16.5-76.2 29.7zM260.64 353c-59.2 11.4-93.5 11.1-136.8 6.6-33.5-3.5-11.6-19.7-11.6-19.7-86.8 28.8 48.2 61.4 169.5 25.9a60.37 60.37 0 0 1-21.1-12.8z"]
};
var faJediOrder = {
  prefix: 'fab',
  iconName: 'jedi-order',
  icon: [448, 512, [], "f50e", "M398.5 373.6c95.9-122.1 17.2-233.1 17.2-233.1 45.4 85.8-41.4 170.5-41.4 170.5 105-171.5-60.5-271.5-60.5-271.5 96.9 72.7-10.1 190.7-10.1 190.7 85.8 158.4-68.6 230.1-68.6 230.1s-.4-16.9-2.2-85.7c4.3 4.5 34.5 36.2 34.5 36.2l-24.2-47.4 62.6-9.1-62.6-9.1 20.2-55.5-31.4 45.9c-2.2-87.7-7.8-305.1-7.9-306.9v-2.4 1-1 2.4c0 1-5.6 219-7.9 306.9l-31.4-45.9 20.2 55.5-62.6 9.1 62.6 9.1-24.2 47.4 34.5-36.2c-1.8 68.8-2.2 85.7-2.2 85.7s-154.4-71.7-68.6-230.1c0 0-107-118.1-10.1-190.7 0 0-165.5 99.9-60.5 271.5 0 0-86.8-84.8-41.4-170.5 0 0-78.7 111 17.2 233.1 0 0-26.2-16.1-49.4-77.7 0 0 16.9 183.3 222 185.7h4.1c205-2.4 222-185.7 222-185.7-23.6 61.5-49.9 77.7-49.9 77.7z"]
};
var faJenkins = {
  prefix: 'fab',
  iconName: 'jenkins',
  icon: [512, 512, [], "f3b6", "M487.1 425c-1.4-11.2-19-23.1-28.2-31.9-5.1-5-29-23.1-30.4-29.9-1.4-6.6 9.7-21.5 13.3-28.9 5.1-10.7 8.8-23.7 11.3-32.6 18.8-66.1 20.7-156.9-6.2-211.2-10.2-20.6-38.6-49-56.4-62.5-42-31.7-119.6-35.3-170.1-16.6-14.1 5.2-27.8 9.8-40.1 17.1-33.1 19.4-68.3 32.5-78.1 71.6-24.2 10.8-31.5 41.8-30.3 77.8.2 7 4.1 15.8 2.7 22.4-.7 3.3-5.2 7.6-6.1 9.8-11.6 27.7-2.3 64 11.1 83.7 8.1 11.9 21.5 22.4 39.2 25.2.7 10.6 3.3 19.7 8.2 30.4 3.1 6.8 14.7 19 10.4 27.7-2.2 4.4-21 13.8-27.3 17.6C89 407.2 73.7 415 54.2 429c-12.6 9-32.3 10.2-29.2 31.1 2.1 14.1 10.1 31.6 14.7 45.8.7 2 1.4 4.1 2.1 6h422c4.9-15.3 9.7-30.9 14.6-47.2 3.4-11.4 10.2-27.8 8.7-39.7zM205.9 33.7c1.8-.5 3.4.7 4.9 2.4-.2 5.2-5.4 5.1-8.9 6.8-5.4 6.7-13.4 9.8-20 17.2-6.8 7.5-14.4 27.7-23.4 30-4.5 1.1-9.7-.8-13.6-.5-10.4.7-17.7 6-28.3 7.5 13.6-29.9 56.1-54 89.3-63.4zm-104.8 93.6c13.5-14.9 32.1-24.1 54.8-25.9 11.7 29.7-8.4 65-.9 97.6 2.3 9.9 10.2 25.4-2.4 25.7.3-28.3-34.8-46.3-61.3-29.6-1.8-21.5-4.9-51.7 9.8-67.8zm36.7 200.2c-1-4.1-2.7-12.9-2.3-15.1 1.6-8.7 17.1-12.5 11-24.7-11.3-.1-13.8 10.2-24.1 11.3-26.7 2.6-45.6-35.4-44.4-58.4 1-19.5 17.6-38.2 40.1-35.8 16 1.8 21.4 19.2 24.5 34.7 9.2.5 22.5-.4 26.9-7.6-.6-17.5-8.8-31.6-8.2-47.7 1-30.3 17.5-57.6 4.8-87.4 13.6-30.9 53.5-55.3 83.1-70 36.6-18.3 94.9-3.7 129.3 15.8 19.7 11.1 34.4 32.7 48.3 50.7-19.5-5.8-36.1 4.2-33.1 20.3 16.3-14.9 44.2-.2 52.5 16.4 7.9 15.8 7.8 39.3 9 62.8 2.9 57-10.4 115.9-39.1 157.1-7.7 11-14.1 23-24.9 30.6-26 18.2-65.4 34.7-99.2 23.4-44.7-15-65-44.8-89.5-78.8.7 18.7 13.8 34.1 26.8 48.4 11.3 12.5 25 26.6 39.7 32.4-12.3-2.9-31.1-3.8-36.2 7.2-28.6-1.9-55.1-4.8-68.7-24.2-10.6-15.4-21.4-41.4-26.3-61.4zm222 124.1c4.1-3 11.1-2.9 17.4-3.6-5.4-2.7-13-3.7-19.3-2.2-.1-4.2-2-6.8-3.2-10.2 10.6-3.8 35.5-28.5 49.6-20.3 6.7 3.9 9.5 26.2 10.1 37 .4 9-.8 18-4.5 22.8-18.8-.6-35.8-2.8-50.7-7 .9-6.1-1-12.1.6-16.5zm-17.2-20c-16.8.8-26-1.2-38.3-10.8.2-.8 1.4-.5 1.5-1.4 18 8 40.8-3.3 59-4.9-7.9 5.1-14.6 11.6-22.2 17.1zm-12.1 33.2c-1.6-9.4-3.5-12-2.8-20.2 25-16.6 29.7 28.6 2.8 20.2zM226 438.6c-11.6-.7-48.1-14-38.5-23.7 9.4 6.5 27.5 4.9 41.3 7.3.8 4.4-2.8 10.2-2.8 16.4zM57.7 497.1c-4.3-12.7-9.2-25.1-14.8-36.9 30.8-23.8 65.3-48.9 102.2-63.5 2.8-1.1 23.2 25.4 26.2 27.6 16.5 11.7 37 21 56.2 30.2 1.2 8.8 3.9 20.2 8.7 35.5.7 2.3 1.4 4.7 2.2 7.2H57.7zm240.6 5.7h-.8c.3-.2.5-.4.8-.5v.5zm7.5-5.7c2.1-1.4 4.3-2.8 6.4-4.3 1.1 1.4 2.2 2.8 3.2 4.3h-9.6zm15.1-24.7c-10.8 7.3-20.6 18.3-33.3 25.2-6 3.3-27 11.7-33.4 10.2-3.6-.8-3.9-5.3-5.4-9.5-3.1-9-10.1-23.4-10.8-37-.8-17.2-2.5-46 16-42.4 14.9 2.9 32.3 9.7 43.9 16.1 7.1 3.9 11.1 8.6 21.9 9.5-.1 1.4-.1 2.8-.2 4.3-5.9 3.9-15.3 3.8-21.8 7.1 9.5.4 17 2.7 23.5 5.9-.1 3.4-.3 7-.4 10.6zm53.4 24.7h-14c-.1-3.2-2.8-5.8-6.1-5.8s-5.9 2.6-6.1 5.8h-17.4c-2.8-4.4-5.7-8.6-8.9-12.5 2.1-2.2 4-4.7 6-6.9 9 3.7 14.8-4.9 21.7-4.2 7.9.8 14.2 11.7 25.4 11l-.6 12.6zm8.7 0c.2-4 .4-7.8.6-11.5 15.6-7.3 29 1.3 35.7 11.5H383zm83.4-37c-2.3 11.2-5.8 24-9.9 37.1-.2-.1-.4-.1-.6-.1H428c.6-1.1 1.2-2.2 1.9-3.3-2.6-6.1-9-8.7-10.9-15.5 12.1-22.7 6.5-93.4-24.2-78.5 4.3-6.3 15.6-11.5 20.8-19.3 13 10.4 20.8 20.3 33.2 31.4 6.8 6 20 13.3 21.4 23.1.8 5.5-2.6 18.9-3.8 25.1zM222.2 130.5c5.4-14.9 27.2-34.7 45-32 7.7 1.2 18 8.2 12.2 17.7-30.2-7-45.2 12.6-54.4 33.1-8.1-2-4.9-13.1-2.8-18.8zm184.1 63.1c8.2-3.6 22.4-.7 29.6-5.3-4.2-11.5-10.3-21.4-9.3-37.7.5 0 1 0 1.4.1 6.8 14.2 12.7 29.2 21.4 41.7-5.7 13.5-43.6 25.4-43.1 1.2zm20.4-43zm-117.2 45.7c-6.8-10.9-19-32.5-14.5-45.3 6.5 11.9 8.6 24.4 17.8 33.3 4.1 4 12.2 9 8.2 20.2-.9 2.7-7.8 8.6-11.7 9.7-14.4 4.3-47.9.9-36.6-17.1 11.9.7 27.9 7.8 36.8-.8zm27.3 70c3.8 6.6 1.4 18.7 12.1 20.6 20.2 3.4 43.6-12.3 58.1-17.8 9-15.2-.8-20.7-8.9-30.5-16.6-20-38.8-44.8-38-74.7 6.7-4.9 7.3 7.4 8.2 9.7 8.7 20.3 30.4 46.2 46.3 63.5 3.9 4.3 10.3 8.4 11 11.2 2.1 8.2-5.4 18-4.5 23.5-21.7 13.9-45.8 29.1-81.4 25.6-7.4-6.7-10.3-21.4-2.9-31.1zm-201.3-9.2c-6.8-3.9-8.4-21-16.4-21.4-11.4-.7-9.3 22.2-9.3 35.5-7.8-7.1-9.2-29.1-3.5-40.3-6.6-3.2-9.5 3.6-13.1 5.9 4.7-34.1 49.8-15.8 42.3 20.3zm299.6 28.8c-10.1 19.2-24.4 40.4-54 41-.6-6.2-1.1-15.6 0-19.4 22.7-2.2 36.6-13.7 54-21.6zm-141.9 12.4c18.9 9.9 53.6 11 79.3 10.2 1.4 5.6 1.3 12.6 1.4 19.4-33 1.8-72-6.4-80.7-29.6zm92.2 46.7c-1.7 4.3-5.3 9.3-9.8 11.1-12.1 4.9-45.6 8.7-62.4-.3-10.7-5.7-17.5-18.5-23.4-26-2.8-3.6-16.9-12.9-.2-12.9 13.1 32.7 58 29 95.8 28.1z"]
};
var faJira = {
  prefix: 'fab',
  iconName: 'jira',
  icon: [496, 512, [], "f7b1", "M490 241.7C417.1 169 320.6 71.8 248.5 0 83 164.9 6 241.7 6 241.7c-7.9 7.9-7.9 20.7 0 28.7C138.8 402.7 67.8 331.9 248.5 512c379.4-378 15.7-16.7 241.5-241.7 8-7.9 8-20.7 0-28.6zm-241.5 90l-76-75.7 76-75.7 76 75.7-76 75.7z"]
};
var faJoget = {
  prefix: 'fab',
  iconName: 'joget',
  icon: [496, 512, [], "f3b7", "M378.1 45C337.6 19.9 292.6 8 248.2 8 165 8 83.8 49.9 36.9 125.9c-71.9 116.6-35.6 269.3 81 341.2s269.3 35.6 341.2-80.9c71.9-116.6 35.6-269.4-81-341.2zm51.8 323.2c-40.4 65.5-110.4 101.5-182 101.5-6.8 0-13.6-.4-20.4-1-9-13.6-19.9-33.3-23.7-42.4-5.7-13.7-27.2-45.6 31.2-67.1 51.7-19.1 176.7-16.5 208.8-17.6-4 9-8.6 17.9-13.9 26.6zm-200.8-86.3c-55.5-1.4-81.7-20.8-58.5-48.2s51.1-40.7 68.9-51.2c17.9-10.5 27.3-33.7-23.6-29.7C87.3 161.5 48.6 252.1 37.6 293c-8.8-49.7-.1-102.7 28.5-149.1C128 43.4 259.6 12.2 360.1 74.1c74.8 46.1 111.2 130.9 99.3 212.7-24.9-.5-179.3-3.6-230.3-4.9zm183.8-54.8c-22.7-6-57 11.3-86.7 27.2-29.7 15.8-31.1 8.2-31.1 8.2s40.2-28.1 50.7-34.5 31.9-14 13.4-24.6c-3.2-1.8-6.7-2.7-10.4-2.7-17.8 0-41.5 18.7-67.5 35.6-31.5 20.5-65.3 31.3-65.3 31.3l169.5-1.6 46.5-23.4s3.6-9.5-19.1-15.5z"]
};
var faJoomla = {
  prefix: 'fab',
  iconName: 'joomla',
  icon: [448, 512, [], "f1aa", "M.6 92.1C.6 58.8 27.4 32 60.4 32c30 0 54.5 21.9 59.2 50.2 32.6-7.6 67.1.6 96.5 30l-44.3 44.3c-20.5-20.5-42.6-16.3-55.4-3.5-14.3 14.3-14.3 37.9 0 52.2l99.5 99.5-44 44.3c-87.7-87.2-49.7-49.7-99.8-99.7-26.8-26.5-35-64.8-24.8-98.9C20.4 144.6.6 120.7.6 92.1zm129.5 116.4l44.3 44.3c10-10 89.7-89.7 99.7-99.8 14.3-14.3 37.6-14.3 51.9 0 12.8 12.8 17 35-3.5 55.4l44 44.3c31.2-31.2 38.5-67.6 28.9-101.2 29.2-4.1 51.9-29.2 51.9-59.5 0-33.2-26.8-60.1-59.8-60.1-30.3 0-55.4 22.5-59.5 51.6-33.8-9.9-71.7-1.5-98.3 25.1-18.3 19.1-71.1 71.5-99.6 99.9zm266.3 152.2c8.2-32.7-.9-68.5-26.3-93.9-11.8-12.2 5 4.7-99.5-99.7l-44.3 44.3 99.7 99.7c14.3 14.3 14.3 37.6 0 51.9-12.8 12.8-35 17-55.4-3.5l-44 44.3c27.6 30.2 68 38.8 102.7 28 5.5 27.4 29.7 48.1 58.9 48.1 33 0 59.8-26.8 59.8-60.1 0-30.2-22.5-55-51.6-59.1zm-84.3-53.1l-44-44.3c-87 86.4-50.4 50.4-99.7 99.8-14.3 14.3-37.6 14.3-51.9 0-13.1-13.4-16.9-35.3 3.2-55.4l-44-44.3c-30.2 30.2-38 65.2-29.5 98.3-26.7 6-46.2 29.9-46.2 58.2C0 453.2 26.8 480 59.8 480c28.6 0 52.5-19.8 58.6-46.7 32.7 8.2 68.5-.6 94.2-26 32.1-32 12.2-12.4 99.5-99.7z"]
};
var faJs = {
  prefix: 'fab',
  iconName: 'js',
  icon: [448, 512, [], "f3b8", "M0 32v448h448V32H0zm243.8 349.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"]
};
var faJsSquare = {
  prefix: 'fab',
  iconName: 'js-square',
  icon: [448, 512, [], "f3b9", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zM243.8 381.4c0 43.6-25.6 63.5-62.9 63.5-33.7 0-53.2-17.4-63.2-38.5l34.3-20.7c6.6 11.7 12.6 21.6 27.1 21.6 13.8 0 22.6-5.4 22.6-26.5V237.7h42.1v143.7zm99.6 63.5c-39.1 0-64.4-18.6-76.7-43l34.3-19.8c9 14.7 20.8 25.6 41.5 25.6 17.4 0 28.6-8.7 28.6-20.8 0-14.4-11.4-19.5-30.7-28l-10.5-4.5c-30.4-12.9-50.5-29.2-50.5-63.5 0-31.6 24.1-55.6 61.6-55.6 26.8 0 46 9.3 59.8 33.7L368 290c-7.2-12.9-15-18-27.1-18-12.3 0-20.1 7.8-20.1 18 0 12.6 7.8 17.7 25.9 25.6l10.5 4.5c35.8 15.3 55.9 31 55.9 66.2 0 37.8-29.8 58.6-69.7 58.6z"]
};
var faJsfiddle = {
  prefix: 'fab',
  iconName: 'jsfiddle',
  icon: [576, 512, [], "f1cc", "M510.634 237.462c-4.727-2.621-5.664-5.748-6.381-10.776-2.352-16.488-3.539-33.619-9.097-49.095-35.895-99.957-153.99-143.386-246.849-91.646-27.37 15.25-48.971 36.369-65.493 63.903-3.184-1.508-5.458-2.71-7.824-3.686-30.102-12.421-59.049-10.121-85.331 9.167-25.531 18.737-36.422 44.548-32.676 76.408.355 3.025-1.967 7.621-4.514 9.545-39.712 29.992-56.031 78.065-41.902 124.615 13.831 45.569 57.514 79.796 105.608 81.433 30.291 1.031 60.637.546 90.959.539 84.041-.021 168.09.531 252.12-.48 52.664-.634 96.108-36.873 108.212-87.293 11.54-48.074-11.144-97.3-56.832-122.634zm21.107 156.88c-18.23 22.432-42.343 35.253-71.28 35.65-56.874.781-113.767.23-170.652.23 0 .7-163.028.159-163.728.154-43.861-.332-76.739-19.766-95.175-59.995-18.902-41.245-4.004-90.848 34.186-116.106 9.182-6.073 12.505-11.566 10.096-23.136-5.49-26.361 4.453-47.956 26.42-62.981 22.987-15.723 47.422-16.146 72.034-3.083 10.269 5.45 14.607 11.564 22.198-2.527 14.222-26.399 34.557-46.727 60.671-61.294 97.46-54.366 228.37 7.568 230.24 132.697.122 8.15 2.412 12.428 9.848 15.894 57.56 26.829 74.456 96.122 35.142 144.497zm-87.789-80.499c-5.848 31.157-34.622 55.096-66.666 55.095-16.953-.001-32.058-6.545-44.079-17.705-27.697-25.713-71.141-74.98-95.937-93.387-20.056-14.888-41.99-12.333-60.272 3.782-49.996 44.071 15.859 121.775 67.063 77.188 4.548-3.96 7.84-9.543 12.744-12.844 8.184-5.509 20.766-.884 13.168 10.622-17.358 26.284-49.33 38.197-78.863 29.301-28.897-8.704-48.84-35.968-48.626-70.179 1.225-22.485 12.364-43.06 35.414-55.965 22.575-12.638 46.369-13.146 66.991 2.474C295.68 280.7 320.467 323.97 352.185 343.47c24.558 15.099 54.254 7.363 68.823-17.506 28.83-49.209-34.592-105.016-78.868-63.46-3.989 3.744-6.917 8.932-11.41 11.72-10.975 6.811-17.333-4.113-12.809-10.353 20.703-28.554 50.464-40.44 83.271-28.214 31.429 11.714 49.108 44.366 42.76 78.186z"]
};
var faKaggle = {
  prefix: 'fab',
  iconName: 'kaggle',
  icon: [320, 512, [], "f5fa", "M304.2 501.5L158.4 320.3 298.2 185c2.6-2.7 1.7-10.5-5.3-10.5h-69.2c-3.5 0-7 1.8-10.5 5.3L80.9 313.5V7.5q0-7.5-7.5-7.5H21.5Q14 0 14 7.5v497q0 7.5 7.5 7.5h51.9q7.5 0 7.5-7.5v-109l30.8-29.3 110.5 140.6c3 3.5 6.5 5.3 10.5 5.3h66.9q5.25 0 6-3z"]
};
var faKeybase = {
  prefix: 'fab',
  iconName: 'keybase',
  icon: [448, 512, [], "f4f5", "M286.17 419a18 18 0 1 0 18 18 18 18 0 0 0-18-18zm111.92-147.6c-9.5-14.62-39.37-52.45-87.26-73.71q-9.1-4.06-18.38-7.27a78.43 78.43 0 0 0-47.88-104.13c-12.41-4.1-23.33-6-32.41-5.77-.6-2-1.89-11 9.4-35L198.66 32l-5.48 7.56c-8.69 12.06-16.92 23.55-24.34 34.89a51 51 0 0 0-8.29-1.25c-41.53-2.45-39-2.33-41.06-2.33-50.61 0-50.75 52.12-50.75 45.88l-2.36 36.68c-1.61 27 19.75 50.21 47.63 51.85l8.93.54a214 214 0 0 0-46.29 35.54C14 304.66 14 374 14 429.77v33.64l23.32-29.8a148.6 148.6 0 0 0 14.56 37.56c5.78 10.13 14.87 9.45 19.64 7.33 4.21-1.87 10-6.92 3.75-20.11a178.29 178.29 0 0 1-15.76-53.13l46.82-59.83-24.66 74.11c58.23-42.4 157.38-61.76 236.25-38.59 34.2 10.05 67.45.69 84.74-23.84.72-1 1.2-2.16 1.85-3.22a156.09 156.09 0 0 1 2.8 28.43c0 23.3-3.69 52.93-14.88 81.64-2.52 6.46 1.76 14.5 8.6 15.74 7.42 1.57 15.33-3.1 18.37-11.15C429 443 434 414 434 382.32c0-38.58-13-77.46-35.91-110.92zM142.37 128.58l-15.7-.93-1.39 21.79 13.13.78a93 93 0 0 0 .32 19.57l-22.38-1.34a12.28 12.28 0 0 1-11.76-12.79L107 119c1-12.17 13.87-11.27 13.26-11.32l29.11 1.73a144.35 144.35 0 0 0-7 19.17zm148.42 172.18a10.51 10.51 0 0 1-14.35-1.39l-9.68-11.49-34.42 27a8.09 8.09 0 0 1-11.13-1.08l-15.78-18.64a7.38 7.38 0 0 1 1.34-10.34l34.57-27.18-14.14-16.74-17.09 13.45a7.75 7.75 0 0 1-10.59-1s-3.72-4.42-3.8-4.53a7.38 7.38 0 0 1 1.37-10.34L214 225.19s-18.51-22-18.6-22.14a9.56 9.56 0 0 1 1.74-13.42 10.38 10.38 0 0 1 14.3 1.37l81.09 96.32a9.58 9.58 0 0 1-1.74 13.44zM187.44 419a18 18 0 1 0 18 18 18 18 0 0 0-18-18z"]
};
var faKeycdn = {
  prefix: 'fab',
  iconName: 'keycdn',
  icon: [512, 512, [], "f3ba", "M63.8 409.3l60.5-59c32.1 42.8 71.1 66 126.6 67.4 30.5.7 60.3-7 86.4-22.4 5.1 5.3 18.5 19.5 20.9 22-32.2 20.7-69.6 31.1-108.1 30.2-43.3-1.1-84.6-16.7-117.7-44.4.3-.6-38.2 37.5-38.6 37.9 9.5 29.8-13.1 62.4-46.3 62.4C20.7 503.3 0 481.7 0 454.9c0-34.3 33.1-56.6 63.8-45.6zm354.9-252.4c19.1 31.3 29.6 67.4 28.7 104-1.1 44.8-19 87.5-48.6 121 .3.3 23.8 25.2 24.1 25.5 9.6-1.3 19.2 2 25.9 9.1 11.3 12 10.9 30.9-1.1 42.4-12 11.3-30.9 10.9-42.4-1.1-6.7-7-9.4-16.8-7.6-26.3-24.9-26.6-44.4-47.2-44.4-47.2 42.7-34.1 63.3-79.6 64.4-124.2.7-28.9-7.2-57.2-21.1-82.2l22.1-21zM104 53.1c6.7 7 9.4 16.8 7.6 26.3l45.9 48.1c-4.7 3.8-13.3 10.4-22.8 21.3-25.4 28.5-39.6 64.8-40.7 102.9-.7 28.9 6.1 57.2 20 82.4l-22 21.5C72.7 324 63.1 287.9 64.2 250.9c1-44.6 18.3-87.6 47.5-121.1l-25.3-26.4c-9.6 1.3-19.2-2-25.9-9.1-11.3-12-10.9-30.9 1.1-42.4C73.5 40.7 92.2 41 104 53.1zM464.9 8c26 0 47.1 22.4 47.1 48.3S490.9 104 464.9 104c-6.3.1-14-1.1-15.9-1.8l-62.9 59.7c-32.7-43.6-76.7-65.9-126.9-67.2-30.5-.7-60.3 6.8-86.2 22.4l-21.1-22C184.1 74.3 221.5 64 260 64.9c43.3 1.1 84.6 16.7 117.7 44.6l41.1-38.6c-1.5-4.7-2.2-9.6-2.2-14.5C416.5 29.7 438.9 8 464.9 8zM256.7 113.4c5.5 0 10.9.4 16.4 1.1 78.1 9.8 133.4 81.1 123.8 159.1-9.8 78.1-81.1 133.4-159.1 123.8-78.1-9.8-133.4-81.1-123.8-159.2 9.3-72.4 70.1-124.6 142.7-124.8zm-59 119.4c.6 22.7 12.2 41.8 32.4 52.2l-11 51.7h73.7l-11-51.7c20.1-10.9 32.1-29 32.4-52.2-.4-32.8-25.8-57.5-58.3-58.3-32.1.8-57.3 24.8-58.2 58.3zM256 160"]
};
var faKickstarter = {
  prefix: 'fab',
  iconName: 'kickstarter',
  icon: [448, 512, [], "f3bb", "M400 480H48c-26.4 0-48-21.6-48-48V80c0-26.4 21.6-48 48-48h352c26.4 0 48 21.6 48 48v352c0 26.4-21.6 48-48 48zM199.6 178.5c0-30.7-17.6-45.1-39.7-45.1-25.8 0-40 19.8-40 44.5v154.8c0 25.8 13.7 45.6 40.5 45.6 21.5 0 39.2-14 39.2-45.6v-41.8l60.6 75.7c12.3 14.9 39 16.8 55.8 0 14.6-15.1 14.8-36.8 4-50.4l-49.1-62.8 40.5-58.7c9.4-13.5 9.5-34.5-5.6-49.1-16.4-15.9-44.6-17.3-61.4 7l-44.8 64.7v-38.8z"]
};
var faKickstarterK = {
  prefix: 'fab',
  iconName: 'kickstarter-k',
  icon: [384, 512, [], "f3bc", "M147.3 114.4c0-56.2-32.5-82.4-73.4-82.4C26.2 32 0 68.2 0 113.4v283c0 47.3 25.3 83.4 74.9 83.4 39.8 0 72.4-25.6 72.4-83.4v-76.5l112.1 138.3c22.7 27.2 72.1 30.7 103.2 0 27-27.6 27.3-67.4 7.4-92.2l-90.8-114.8 74.9-107.4c17.4-24.7 17.5-63.1-10.4-89.8-30.3-29-82.4-31.6-113.6 12.8L147.3 185v-70.6z"]
};
var faKorvue = {
  prefix: 'fab',
  iconName: 'korvue',
  icon: [446, 512, [], "f42f", "M386.5 34h-327C26.8 34 0 60.8 0 93.5v327.1C0 453.2 26.8 480 59.5 480h327.1c33 0 59.5-26.8 59.5-59.5v-327C446 60.8 419.2 34 386.5 34zM87.1 120.8h96v116l61.8-116h110.9l-81.2 132H87.1v-132zm161.8 272.1l-65.7-113.6v113.6h-96V262.1h191.5l88.6 130.8H248.9z"]
};
var faLaravel = {
  prefix: 'fab',
  iconName: 'laravel',
  icon: [512, 512, [], "f3bd", "M504.4,115.83a5.72,5.72,0,0,0-.28-.68,8.52,8.52,0,0,0-.53-1.25,6,6,0,0,0-.54-.71,9.36,9.36,0,0,0-.72-.94c-.23-.22-.52-.4-.77-.6a8.84,8.84,0,0,0-.9-.68L404.4,55.55a8,8,0,0,0-8,0L300.12,111h0a8.07,8.07,0,0,0-.88.69,7.68,7.68,0,0,0-.78.6,8.23,8.23,0,0,0-.72.93c-.17.24-.39.45-.54.71a9.7,9.7,0,0,0-.52,1.25c-.08.23-.21.44-.28.68a8.08,8.08,0,0,0-.28,2.08V223.18l-80.22,46.19V63.44a7.8,7.8,0,0,0-.28-2.09c-.06-.24-.2-.45-.28-.68a8.35,8.35,0,0,0-.52-1.24c-.14-.26-.37-.47-.54-.72a9.36,9.36,0,0,0-.72-.94,9.46,9.46,0,0,0-.78-.6,9.8,9.8,0,0,0-.88-.68h0L115.61,1.07a8,8,0,0,0-8,0L11.34,56.49h0a6.52,6.52,0,0,0-.88.69,7.81,7.81,0,0,0-.79.6,8.15,8.15,0,0,0-.71.93c-.18.25-.4.46-.55.72a7.88,7.88,0,0,0-.51,1.24,6.46,6.46,0,0,0-.29.67,8.18,8.18,0,0,0-.28,2.1v329.7a8,8,0,0,0,4,6.95l192.5,110.84a8.83,8.83,0,0,0,1.33.54c.21.08.41.2.63.26a7.92,7.92,0,0,0,4.1,0c.2-.05.37-.16.55-.22a8.6,8.6,0,0,0,1.4-.58L404.4,400.09a8,8,0,0,0,4-6.95V287.88l92.24-53.11a8,8,0,0,0,4-7V117.92A8.63,8.63,0,0,0,504.4,115.83ZM111.6,17.28h0l80.19,46.15-80.2,46.18L31.41,63.44Zm88.25,60V278.6l-46.53,26.79-33.69,19.4V123.5l46.53-26.79Zm0,412.78L23.37,388.5V77.32L57.06,96.7l46.52,26.8V338.68a6.94,6.94,0,0,0,.12.9,8,8,0,0,0,.16,1.18h0a5.92,5.92,0,0,0,.38.9,6.38,6.38,0,0,0,.42,1v0a8.54,8.54,0,0,0,.6.78,7.62,7.62,0,0,0,.66.84l0,0c.23.22.52.38.77.58a8.93,8.93,0,0,0,.86.66l0,0,0,0,92.19,52.18Zm8-106.17-80.06-45.32,84.09-48.41,92.26-53.11,80.13,46.13-58.8,33.56Zm184.52,4.57L215.88,490.11V397.8L346.6,323.2l45.77-26.15Zm0-119.13L358.68,250l-46.53-26.79V131.79l33.69,19.4L392.37,178Zm8-105.28-80.2-46.17,80.2-46.16,80.18,46.15Zm8,105.28V178L455,151.19l33.68-19.4v91.39h0Z"]
};
var faLastfm = {
  prefix: 'fab',
  iconName: 'lastfm',
  icon: [512, 512, [], "f202", "M225.8 367.1l-18.8-51s-30.5 34-76.2 34c-40.5 0-69.2-35.2-69.2-91.5 0-72.1 36.4-97.9 72.1-97.9 66.5 0 74.8 53.3 100.9 134.9 18.8 56.9 54 102.6 155.4 102.6 72.7 0 122-22.3 122-80.9 0-72.9-62.7-80.6-115-92.1-25.8-5.9-33.4-16.4-33.4-34 0-19.9 15.8-31.7 41.6-31.7 28.2 0 43.4 10.6 45.7 35.8l58.6-7c-4.7-52.8-41.1-74.5-100.9-74.5-52.8 0-104.4 19.9-104.4 83.9 0 39.9 19.4 65.1 68 76.8 44.9 10.6 79.8 13.8 79.8 45.7 0 21.7-21.1 30.5-61 30.5-59.2 0-83.9-31.1-97.9-73.9-32-96.8-43.6-163-161.3-163C45.7 113.8 0 168.3 0 261c0 89.1 45.7 137.2 127.9 137.2 66.2 0 97.9-31.1 97.9-31.1z"]
};
var faLastfmSquare = {
  prefix: 'fab',
  iconName: 'lastfm-square',
  icon: [448, 512, [], "f203", "M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h352c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48zm-92.2 312.9c-63.4 0-85.4-28.6-97.1-64.1-16.3-51-21.5-84.3-63-84.3-22.4 0-45.1 16.1-45.1 61.2 0 35.2 18 57.2 43.3 57.2 28.6 0 47.6-21.3 47.6-21.3l11.7 31.9s-19.8 19.4-61.2 19.4c-51.3 0-79.9-30.1-79.9-85.8 0-57.9 28.6-92 82.5-92 73.5 0 80.8 41.4 100.8 101.9 8.8 26.8 24.2 46.2 61.2 46.2 24.9 0 38.1-5.5 38.1-19.1 0-19.9-21.8-22-49.9-28.6-30.4-7.3-42.5-23.1-42.5-48 0-40 32.3-52.4 65.2-52.4 37.4 0 60.1 13.6 63 46.6l-36.7 4.4c-1.5-15.8-11-22.4-28.6-22.4-16.1 0-26 7.3-26 19.8 0 11 4.8 17.6 20.9 21.3 32.7 7.1 71.8 12 71.8 57.5.1 36.7-30.7 50.6-76.1 50.6z"]
};
var faLeanpub = {
  prefix: 'fab',
  iconName: 'leanpub',
  icon: [576, 512, [], "f212", "M386.539 111.485l15.096 248.955-10.979-.275c-36.232-.824-71.64 8.783-102.657 27.997-31.016-19.214-66.424-27.997-102.657-27.997-45.564 0-82.07 10.705-123.516 27.723L93.117 129.6c28.546-11.803 61.484-18.115 92.226-18.115 41.173 0 73.836 13.175 102.657 42.544 27.723-28.271 59.013-41.721 98.539-42.544zM569.07 448c-25.526 0-47.485-5.215-70.542-15.645-34.31-15.645-69.993-24.978-107.871-24.978-38.977 0-74.934 12.901-102.657 40.623-27.723-27.723-63.68-40.623-102.657-40.623-37.878 0-73.561 9.333-107.871 24.978C55.239 442.236 32.731 448 8.303 448H6.93L49.475 98.859C88.726 76.626 136.486 64 181.775 64 218.83 64 256.984 71.685 288 93.095 319.016 71.685 357.17 64 394.225 64c45.289 0 93.049 12.626 132.3 34.859L569.07 448zm-43.368-44.741l-34.036-280.246c-30.742-13.999-67.248-21.41-101.009-21.41-38.428 0-74.385 12.077-102.657 38.702-28.272-26.625-64.228-38.702-102.657-38.702-33.761 0-70.267 7.411-101.009 21.41L50.298 403.259c47.211-19.487 82.894-33.486 135.045-33.486 37.604 0 70.817 9.606 102.657 29.644 31.84-20.038 65.052-29.644 102.657-29.644 52.151 0 87.834 13.999 135.045 33.486z"]
};
var faLess = {
  prefix: 'fab',
  iconName: 'less',
  icon: [640, 512, [], "f41d", "M612.7 219c0-20.5 3.2-32.6 3.2-54.6 0-34.2-12.6-45.2-40.5-45.2h-20.5v24.2h6.3c14.2 0 17.3 4.7 17.3 22.1 0 16.3-1.6 32.6-1.6 51.5 0 24.2 7.9 33.6 23.6 37.3v1.6c-15.8 3.7-23.6 13.1-23.6 37.3 0 18.9 1.6 34.2 1.6 51.5 0 17.9-3.7 22.6-17.3 22.6v.5h-6.3V393h20.5c27.8 0 40.5-11 40.5-45.2 0-22.6-3.2-34.2-3.2-54.6 0-11 6.8-22.6 27.3-23.6v-27.3c-20.5-.7-27.3-12.3-27.3-23.3zm-105.6 32c-15.8-6.3-30.5-10-30.5-20.5 0-7.9 6.3-12.6 17.9-12.6s22.1 4.7 33.6 13.1l21-27.8c-13.1-10-31-20.5-55.2-20.5-35.7 0-59.9 20.5-59.9 49.4 0 25.7 22.6 38.9 41.5 46.2 16.3 6.3 32.1 11.6 32.1 22.1 0 7.9-6.3 13.1-20.5 13.1-13.1 0-26.3-5.3-40.5-16.3l-21 30.5c15.8 13.1 39.9 22.1 59.9 22.1 42 0 64.6-22.1 64.6-51s-22.5-41-43-47.8zm-358.9 59.4c-3.7 0-8.4-3.2-8.4-13.1V119.1H65.2c-28.4 0-41 11-41 45.2 0 22.6 3.2 35.2 3.2 54.6 0 11-6.8 22.6-27.3 23.6v27.3c20.5.5 27.3 12.1 27.3 23.1 0 19.4-3.2 31-3.2 53.6 0 34.2 12.6 45.2 40.5 45.2h20.5v-24.2h-6.3c-13.1 0-17.3-5.3-17.3-22.6s1.6-32.1 1.6-51.5c0-24.2-7.9-33.6-23.6-37.3v-1.6c15.8-3.7 23.6-13.1 23.6-37.3 0-18.9-1.6-34.2-1.6-51.5s3.7-22.1 17.3-22.1H93v150.8c0 32.1 11 53.1 43.1 53.1 10 0 17.9-1.6 23.6-3.7l-5.3-34.2c-3.1.8-4.6.8-6.2.8zM379.9 251c-16.3-6.3-31-10-31-20.5 0-7.9 6.3-12.6 17.9-12.6 11.6 0 22.1 4.7 33.6 13.1l21-27.8c-13.1-10-31-20.5-55.2-20.5-35.7 0-59.9 20.5-59.9 49.4 0 25.7 22.6 38.9 41.5 46.2 16.3 6.3 32.1 11.6 32.1 22.1 0 7.9-6.3 13.1-20.5 13.1-13.1 0-26.3-5.3-40.5-16.3l-20.5 30.5c15.8 13.1 39.9 22.1 59.9 22.1 42 0 64.6-22.1 64.6-51 .1-28.9-22.5-41-43-47.8zm-155-68.8c-38.4 0-75.1 32.1-74.1 82.5 0 52 34.2 82.5 79.3 82.5 18.9 0 39.9-6.8 56.2-17.9l-15.8-27.8c-11.6 6.8-22.6 10-34.2 10-21 0-37.3-10-41.5-34.2H290c.5-3.7 1.6-11 1.6-19.4.6-42.6-22.6-75.7-66.7-75.7zm-30 66.2c3.2-21 15.8-31 30.5-31 18.9 0 26.3 13.1 26.3 31h-56.8z"]
};
var faLine = {
  prefix: 'fab',
  iconName: 'line',
  icon: [448, 512, [], "f3c0", "M272.1 204.2v71.1c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.1 0-2.1-.6-2.6-1.3l-32.6-44v42.2c0 1.8-1.4 3.2-3.2 3.2h-11.4c-1.8 0-3.2-1.4-3.2-3.2v-71.1c0-1.8 1.4-3.2 3.2-3.2H219c1 0 2.1.5 2.6 1.4l32.6 44v-42.2c0-1.8 1.4-3.2 3.2-3.2h11.4c1.8-.1 3.3 1.4 3.3 3.1zm-82-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 1.8 1.4 3.2 3.2 3.2h11.4c1.8 0 3.2-1.4 3.2-3.2v-71.1c0-1.7-1.4-3.2-3.2-3.2zm-27.5 59.6h-31.1v-56.4c0-1.8-1.4-3.2-3.2-3.2h-11.4c-1.8 0-3.2 1.4-3.2 3.2v71.1c0 .9.3 1.6.9 2.2.6.5 1.3.9 2.2.9h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.7-1.4-3.2-3.1-3.2zM332.1 201h-45.7c-1.7 0-3.2 1.4-3.2 3.2v71.1c0 1.7 1.4 3.2 3.2 3.2h45.7c1.8 0 3.2-1.4 3.2-3.2v-11.4c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2V234c0-1.8-1.4-3.2-3.2-3.2H301v-12h31.1c1.8 0 3.2-1.4 3.2-3.2v-11.4c-.1-1.7-1.5-3.2-3.2-3.2zM448 113.7V399c-.1 44.8-36.8 81.1-81.7 81H81c-44.8-.1-81.1-36.9-81-81.7V113c.1-44.8 36.9-81.1 81.7-81H367c44.8.1 81.1 36.8 81 81.7zm-61.6 122.6c0-73-73.2-132.4-163.1-132.4-89.9 0-163.1 59.4-163.1 132.4 0 65.4 58 120.2 136.4 130.6 19.1 4.1 16.9 11.1 12.6 36.8-.7 4.1-3.3 16.1 14.1 8.8 17.4-7.3 93.9-55.3 128.2-94.7 23.6-26 34.9-52.3 34.9-81.5z"]
};
var faLinkedin = {
  prefix: 'fab',
  iconName: 'linkedin',
  icon: [448, 512, [], "f08c", "M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3c0-17.8-14.4-32.3-32-32.3zM135.4 416H69V202.2h66.5V416zm-33.2-243c-21.3 0-38.5-17.3-38.5-38.5S80.9 96 102.2 96c21.2 0 38.5 17.3 38.5 38.5 0 21.3-17.2 38.5-38.5 38.5zm282.1 243h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"]
};
var faLinkedinIn = {
  prefix: 'fab',
  iconName: 'linkedin-in',
  icon: [448, 512, [], "f0e1", "M100.28 448H7.4V148.9h92.88zM53.79 108.1C24.09 108.1 0 83.5 0 53.8a53.79 53.79 0 0 1 107.58 0c0 29.7-24.1 54.3-53.79 54.3zM447.9 448h-92.68V302.4c0-34.7-.7-79.2-48.29-79.2-48.29 0-55.69 37.7-55.69 76.7V448h-92.78V148.9h89.08v40.8h1.3c12.4-23.5 42.69-48.3 87.88-48.3 94 0 111.28 61.9 111.28 142.3V448z"]
};
var faLinode = {
  prefix: 'fab',
  iconName: 'linode',
  icon: [448, 512, [], "f2b8", "M437.4 226.3c-.3-.9-.9-1.4-1.4-2l-70-38.6c-.9-.6-2-.6-3.1 0l-58.9 36c-.9.6-1.4 1.7-1.4 2.6l-.9 31.4-24-16c-.9-.6-2.3-.6-3.1 0L240 260.9l-1.4-35.1c0-.9-.6-2-1.4-2.3l-36-24.3 33.7-17.4c1.1-.6 1.7-1.7 1.7-2.9l-5.7-132.3c0-.9-.9-2-1.7-2.6L138.6.3c-.9-.3-1.7-.3-2.3-.3L12.6 38.6c-1.4.6-2.3 2-2 3.7L38 175.4c.9 3.4 34 27.4 38.6 30.9l-26.9 12.9c-1.4.9-2 2.3-1.7 3.4l20.6 100.3c.6 2.9 23.7 23.1 27.1 26.3l-17.4 10.6c-.9.6-1.7 2-1.4 3.1 1.4 7.1 15.4 77.7 16.9 79.1l65.1 69.1c.6.6 1.4.6 2.3.9.6 0 1.1-.3 1.7-.6l83.7-66.9c.9-.6 1.1-1.4 1.1-2.3l-2-46 28 23.7c1.1.9 2.9.9 4 0l66.9-53.4c.9-.6 1.1-1.4 1.1-2.3l2.3-33.4 20.3 14c1.1.9 2.6.9 3.7 0l54.6-43.7c.6-.3 1.1-1.1 1.1-2 .9-6.5 10.3-70.8 9.7-72.8zm-204.8 4.8l4 92.6-90.6 61.2-14-96.6 100.6-57.2zm-7.7-180l5.4 126-106.6 55.4L104 97.7l120.9-46.6zM44 173.1L18 48l79.7 49.4 19.4 132.9L44 173.1zm30.6 147.8L55.7 230l70 58.3 13.7 93.4-64.8-60.8zm24.3 117.7l-13.7-67.1 61.7 60.9 9.7 67.4-57.7-61.2zm64.5 64.5l-10.6-70.9 85.7-61.4 3.1 70-78.2 62.3zm82-115.1c0-3.4.9-22.9-2-25.1l-24.3-20 22.3-14.9c2.3-1.7 1.1-5.7 1.1-8l29.4 22.6.6 68.3-27.1-22.9zm94.3-25.4l-60.9 48.6-.6-68.6 65.7-46.9-4.2 66.9zm27.7-25.7l-19.1-13.4 2-34c.3-.9-.3-2-1.1-2.6L308 259.7l.6-30 64.6 40.6-5.8 66.6zm54.6-39.8l-48.3 38.3 5.7-65.1 51.1-36.6-8.5 63.4z"]
};
var faLinux = {
  prefix: 'fab',
  iconName: 'linux',
  icon: [448, 512, [], "f17c", "M220.8 123.3c1 .5 1.8 1.7 3 1.7 1.1 0 2.8-.4 2.9-1.5.2-1.4-1.9-2.3-3.2-2.9-1.7-.7-3.9-1-5.5-.1-.4.2-.8.7-.6 1.1.3 1.3 2.3 1.1 3.4 1.7zm-21.9 1.7c1.2 0 2-1.2 3-1.7 1.1-.6 3.1-.4 3.5-1.6.2-.4-.2-.9-.6-1.1-1.6-.9-3.8-.6-5.5.1-1.3.6-3.4 1.5-3.2 2.9.1 1 1.8 1.5 2.8 1.4zM420 403.8c-3.6-4-5.3-11.6-7.2-19.7-1.8-8.1-3.9-16.8-10.5-22.4-1.3-1.1-2.6-2.1-4-2.9-1.3-.8-2.7-1.5-4.1-2 9.2-27.3 5.6-54.5-3.7-79.1-11.4-30.1-31.3-56.4-46.5-74.4-17.1-21.5-33.7-41.9-33.4-72C311.1 85.4 315.7.1 234.8 0 132.4-.2 158 103.4 156.9 135.2c-1.7 23.4-6.4 41.8-22.5 64.7-18.9 22.5-45.5 58.8-58.1 96.7-6 17.9-8.8 36.1-6.2 53.3-6.5 5.8-11.4 14.7-16.6 20.2-4.2 4.3-10.3 5.9-17 8.3s-14 6-18.5 14.5c-2.1 3.9-2.8 8.1-2.8 12.4 0 3.9.6 7.9 1.2 11.8 1.2 8.1 2.5 15.7.8 20.8-5.2 14.4-5.9 24.4-2.2 31.7 3.8 7.3 11.4 10.5 20.1 12.3 17.3 3.6 40.8 2.7 59.3 12.5 19.8 10.4 39.9 14.1 55.9 10.4 11.6-2.6 21.1-9.6 25.9-20.2 12.5-.1 26.3-5.4 48.3-6.6 14.9-1.2 33.6 5.3 55.1 4.1.6 2.3 1.4 4.6 2.5 6.7v.1c8.3 16.7 23.8 24.3 40.3 23 16.6-1.3 34.1-11 48.3-27.9 13.6-16.4 36-23.2 50.9-32.2 7.4-4.5 13.4-10.1 13.9-18.3.4-8.2-4.4-17.3-15.5-29.7zM223.7 87.3c9.8-22.2 34.2-21.8 44-.4 6.5 14.2 3.6 30.9-4.3 40.4-1.6-.8-5.9-2.6-12.6-4.9 1.1-1.2 3.1-2.7 3.9-4.6 4.8-11.8-.2-27-9.1-27.3-7.3-.5-13.9 10.8-11.8 23-4.1-2-9.4-3.5-13-4.4-1-6.9-.3-14.6 2.9-21.8zM183 75.8c10.1 0 20.8 14.2 19.1 33.5-3.5 1-7.1 2.5-10.2 4.6 1.2-8.9-3.3-20.1-9.6-19.6-8.4.7-9.8 21.2-1.8 28.1 1 .8 1.9-.2-5.9 5.5-15.6-14.6-10.5-52.1 8.4-52.1zm-13.6 60.7c6.2-4.6 13.6-10 14.1-10.5 4.7-4.4 13.5-14.2 27.9-14.2 7.1 0 15.6 2.3 25.9 8.9 6.3 4.1 11.3 4.4 22.6 9.3 8.4 3.5 13.7 9.7 10.5 18.2-2.6 7.1-11 14.4-22.7 18.1-11.1 3.6-19.8 16-38.2 14.9-3.9-.2-7-1-9.6-2.1-8-3.5-12.2-10.4-20-15-8.6-4.8-13.2-10.4-14.7-15.3-1.4-4.9 0-9 4.2-12.3zm3.3 334c-2.7 35.1-43.9 34.4-75.3 18-29.9-15.8-68.6-6.5-76.5-21.9-2.4-4.7-2.4-12.7 2.6-26.4v-.2c2.4-7.6.6-16-.6-23.9-1.2-7.8-1.8-15 .9-20 3.5-6.7 8.5-9.1 14.8-11.3 10.3-3.7 11.8-3.4 19.6-9.9 5.5-5.7 9.5-12.9 14.3-18 5.1-5.5 10-8.1 17.7-6.9 8.1 1.2 15.1 6.8 21.9 16l19.6 35.6c9.5 19.9 43.1 48.4 41 68.9zm-1.4-25.9c-4.1-6.6-9.6-13.6-14.4-19.6 7.1 0 14.2-2.2 16.7-8.9 2.3-6.2 0-14.9-7.4-24.9-13.5-18.2-38.3-32.5-38.3-32.5-13.5-8.4-21.1-18.7-24.6-29.9s-3-23.3-.3-35.2c5.2-22.9 18.6-45.2 27.2-59.2 2.3-1.7.8 3.2-8.7 20.8-8.5 16.1-24.4 53.3-2.6 82.4.6-20.7 5.5-41.8 13.8-61.5 12-27.4 37.3-74.9 39.3-112.7 1.1.8 4.6 3.2 6.2 4.1 4.6 2.7 8.1 6.7 12.6 10.3 12.4 10 28.5 9.2 42.4 1.2 6.2-3.5 11.2-7.5 15.9-9 9.9-3.1 17.8-8.6 22.3-15 7.7 30.4 25.7 74.3 37.2 95.7 6.1 11.4 18.3 35.5 23.6 64.6 3.3-.1 7 .4 10.9 1.4 13.8-35.7-11.7-74.2-23.3-84.9-4.7-4.6-4.9-6.6-2.6-6.5 12.6 11.2 29.2 33.7 35.2 59 2.8 11.6 3.3 23.7.4 35.7 16.4 6.8 35.9 17.9 30.7 34.8-2.2-.1-3.2 0-4.2 0 3.2-10.1-3.9-17.6-22.8-26.1-19.6-8.6-36-8.6-38.3 12.5-12.1 4.2-18.3 14.7-21.4 27.3-2.8 11.2-3.6 24.7-4.4 39.9-.5 7.7-3.6 18-6.8 29-32.1 22.9-76.7 32.9-114.3 7.2zm257.4-11.5c-.9 16.8-41.2 19.9-63.2 46.5-13.2 15.7-29.4 24.4-43.6 25.5s-26.5-4.8-33.7-19.3c-4.7-11.1-2.4-23.1 1.1-36.3 3.7-14.2 9.2-28.8 9.9-40.6.8-15.2 1.7-28.5 4.2-38.7 2.6-10.3 6.6-17.2 13.7-21.1.3-.2.7-.3 1-.5.8 13.2 7.3 26.6 18.8 29.5 12.6 3.3 30.7-7.5 38.4-16.3 9-.3 15.7-.9 22.6 5.1 9.9 8.5 7.1 30.3 17.1 41.6 10.6 11.6 14 19.5 13.7 24.6zM173.3 148.7c2 1.9 4.7 4.5 8 7.1 6.6 5.2 15.8 10.6 27.3 10.6 11.6 0 22.5-5.9 31.8-10.8 4.9-2.6 10.9-7 14.8-10.4s5.9-6.3 3.1-6.6-2.6 2.6-6 5.1c-4.4 3.2-9.7 7.4-13.9 9.8-7.4 4.2-19.5 10.2-29.9 10.2s-18.7-4.8-24.9-9.7c-3.1-2.5-5.7-5-7.7-6.9-1.5-1.4-1.9-4.6-4.3-4.9-1.4-.1-1.8 3.7 1.7 6.5z"]
};
var faLyft = {
  prefix: 'fab',
  iconName: 'lyft',
  icon: [512, 512, [], "f3c3", "M0 81.1h77.8v208.7c0 33.1 15 52.8 27.2 61-12.7 11.1-51.2 20.9-80.2-2.8C7.8 334 0 310.7 0 289V81.1zm485.9 173.5v-22h23.8v-76.8h-26.1c-10.1-46.3-51.2-80.7-100.3-80.7-56.6 0-102.7 46-102.7 102.7V357c16 2.3 35.4-.3 51.7-14 17.1-14 24.8-37.2 24.8-59v-6.7h38.8v-76.8h-38.8v-23.3c0-34.6 52.2-34.6 52.2 0v77.1c0 56.6 46 102.7 102.7 102.7v-76.5c-14.5 0-26.1-11.7-26.1-25.9zm-294.3-99v113c0 15.4-23.8 15.4-23.8 0v-113H91v132.7c0 23.8 8 54 45 63.9 37 9.8 58.2-10.6 58.2-10.6-2.1 13.4-14.5 23.3-34.9 25.3-15.5 1.6-35.2-3.6-45-7.8v70.3c25.1 7.5 51.5 9.8 77.6 4.7 47.1-9.1 76.8-48.4 76.8-100.8V155.1h-77.1v.5z"]
};
var faMagento = {
  prefix: 'fab',
  iconName: 'magento',
  icon: [448, 512, [], "f3c4", "M445.7 127.9V384l-63.4 36.5V164.7L223.8 73.1 65.2 164.7l.4 255.9L2.3 384V128.1L224.2 0l221.5 127.9zM255.6 420.5L224 438.9l-31.8-18.2v-256l-63.3 36.6.1 255.9 94.9 54.9 95.1-54.9v-256l-63.4-36.6v255.9z"]
};
var faMailchimp = {
  prefix: 'fab',
  iconName: 'mailchimp',
  icon: [448, 512, [], "f59e", "M330.61 243.52a36.15 36.15 0 0 1 9.3 0c1.66-3.83 1.95-10.43.45-17.61-2.23-10.67-5.25-17.14-11.48-16.13s-6.47 8.74-4.24 19.42c1.26 6 3.49 11.14 6 14.32zM277.05 252c4.47 2 7.2 3.26 8.28 2.13 1.89-1.94-3.48-9.39-12.12-13.09a31.44 31.44 0 0 0-30.61 3.68c-3 2.18-5.81 5.22-5.41 7.06.85 3.74 10-2.71 22.6-3.48 7-.44 12.8 1.75 17.26 3.71zm-9 5.13c-9.07 1.42-15 6.53-13.47 10.1.9.34 1.17.81 5.21-.81a37 37 0 0 1 18.72-1.95c2.92.34 4.31.52 4.94-.49 1.46-2.22-5.71-8-15.39-6.85zm54.17 17.1c3.38-6.87-10.9-13.93-14.3-7s10.92 13.88 14.32 6.97zm15.66-20.47c-7.66-.13-7.95 15.8-.26 15.93s7.98-15.81.28-15.96zm-218.79 78.9c-1.32.31-6 1.45-8.47-2.35-5.2-8 11.11-20.38 3-35.77-9.1-17.47-27.82-13.54-35.05-5.54-8.71 9.6-8.72 23.54-5 24.08 4.27.57 4.08-6.47 7.38-11.63a12.83 12.83 0 0 1 17.85-3.72c11.59 7.59 1.37 17.76 2.28 28.62 1.39 16.68 18.42 16.37 21.58 9a2.08 2.08 0 0 0-.2-2.33c.03.89.68-1.3-3.35-.39zm299.72-17.07c-3.35-11.73-2.57-9.22-6.78-20.52 2.45-3.67 15.29-24-3.07-43.25-10.4-10.92-33.9-16.54-41.1-18.54-1.5-11.39 4.65-58.7-21.52-83 20.79-21.55 33.76-45.29 33.73-65.65-.06-39.16-48.15-51-107.42-26.47l-12.55 5.33c-.06-.05-22.71-22.27-23.05-22.57C169.5-18-41.77 216.81 25.78 273.85l14.76 12.51a72.49 72.49 0 0 0-4.1 33.5c3.36 33.4 36 60.42 67.53 60.38 57.73 133.06 267.9 133.28 322.29 3 1.74-4.47 9.11-24.61 9.11-42.38s-10.09-25.27-16.53-25.27zm-316 48.16c-22.82-.61-47.46-21.15-49.91-45.51-6.17-61.31 74.26-75.27 84-12.33 4.54 29.64-4.67 58.49-34.12 57.81zM84.3 249.55C69.14 252.5 55.78 261.09 47.6 273c-4.88-4.07-14-12-15.59-15-13.01-24.85 14.24-73 33.3-100.21C112.42 90.56 186.19 39.68 220.36 48.91c5.55 1.57 23.94 22.89 23.94 22.89s-34.15 18.94-65.8 45.35c-42.66 32.85-74.89 80.59-94.2 132.4zM323.18 350.7s-35.74 5.3-69.51-7.07c6.21-20.16 27 6.1 96.4-13.81 15.29-4.38 35.37-13 51-25.35a102.85 102.85 0 0 1 7.12 24.28c3.66-.66 14.25-.52 11.44 18.1-3.29 19.87-11.73 36-25.93 50.84A106.86 106.86 0 0 1 362.55 421a132.45 132.45 0 0 1-20.34 8.58c-53.51 17.48-108.3-1.74-126-43a66.33 66.33 0 0 1-3.55-9.74c-7.53-27.2-1.14-59.83 18.84-80.37 1.23-1.31 2.48-2.85 2.48-4.79a8.45 8.45 0 0 0-1.92-4.54c-7-10.13-31.19-27.4-26.33-60.83 3.5-24 24.49-40.91 44.07-39.91l5 .29c8.48.5 15.89 1.59 22.88 1.88 11.69.5 22.2-1.19 34.64-11.56 4.2-3.5 7.57-6.54 13.26-7.51a17.45 17.45 0 0 1 13.6 2.24c10 6.64 11.4 22.73 11.92 34.49.29 6.72 1.1 23 1.38 27.63.63 10.67 3.43 12.17 9.11 14 3.19 1.05 6.15 1.83 10.51 3.06 13.21 3.71 21 7.48 26 12.31a16.38 16.38 0 0 1 4.74 9.29c1.56 11.37-8.82 25.4-36.31 38.16-46.71 21.68-93.68 14.45-100.48 13.68-20.15-2.71-31.63 23.32-19.55 41.15 22.64 33.41 122.4 20 151.37-21.35.69-1 .12-1.59-.73-1-41.77 28.58-97.06 38.21-128.46 26-4.77-1.85-14.73-6.44-15.94-16.67 43.6 13.49 71 .74 71 .74s2.03-2.79-.56-2.53zm-68.47-5.7zm-83.4-187.5c16.74-19.35 37.36-36.18 55.83-45.63a.73.73 0 0 1 1 1c-1.46 2.66-4.29 8.34-5.19 12.65a.75.75 0 0 0 1.16.79c11.49-7.83 31.48-16.22 49-17.3a.77.77 0 0 1 .52 1.38 41.86 41.86 0 0 0-7.71 7.74.75.75 0 0 0 .59 1.19c12.31.09 29.66 4.4 41 10.74.76.43.22 1.91-.64 1.72-69.55-15.94-123.08 18.53-134.5 26.83a.76.76 0 0 1-1-1.12z"]
};
var faMandalorian = {
  prefix: 'fab',
  iconName: 'mandalorian',
  icon: [448, 512, [], "f50f", "M232.27 511.89c-1-3.26-1.69-15.83-1.39-24.58.55-15.89 1-24.72 1.4-28.76.64-6.2 2.87-20.72 3.28-21.38.6-1 .4-27.87-.24-33.13-.31-2.58-.63-11.9-.69-20.73-.13-16.47-.53-20.12-2.73-24.76-1.1-2.32-1.23-3.84-1-11.43a92.38 92.38 0 0 0-.34-12.71c-2-13-3.46-27.7-3.25-33.9s.43-7.15 2.06-9.67c3.05-4.71 6.51-14 8.62-23.27 2.26-9.86 3.88-17.18 4.59-20.74a109.54 109.54 0 0 1 4.42-15.05c2.27-6.25 2.49-15.39.37-15.39-.3 0-1.38 1.22-2.41 2.71s-4.76 4.8-8.29 7.36c-8.37 6.08-11.7 9.39-12.66 12.58s-1 7.23-.16 7.76c.34.21 1.29 2.4 2.11 4.88a28.83 28.83 0 0 1 .72 15.36c-.39 1.77-1 5.47-1.46 8.23s-1 6.46-1.25 8.22a9.85 9.85 0 0 1-1.55 4.26c-1 1-1.14.91-2.05-.53a14.87 14.87 0 0 1-1.44-4.75c-.25-1.74-1.63-7.11-3.08-11.93-3.28-10.9-3.52-16.15-1-21a14.24 14.24 0 0 0 1.67-4.61c0-2.39-2.2-5.32-7.41-9.89-7-6.18-8.63-7.92-10.23-11.3-1.71-3.6-3.06-4.06-4.54-1.54-1.78 3-2.6 9.11-3 22l-.34 12.19 2 2.25c3.21 3.7 12.07 16.45 13.78 19.83 3.41 6.74 4.34 11.69 4.41 23.56s.95 22.75 2 24.71c.36.66.51 1.35.34 1.52s.41 2.09 1.29 4.27a38.14 38.14 0 0 1 2.06 9 91 91 0 0 0 1.71 10.37c2.23 9.56 2.77 14.08 2.39 20.14-.2 3.27-.53 11.07-.73 17.32-1.31 41.76-1.85 58-2 61.21-.12 2-.39 11.51-.6 21.07-.36 16.3-1.3 27.37-2.42 28.65-.64.73-8.07-4.91-12.52-9.49-3.75-3.87-4-4.79-2.83-9.95.7-3 2.26-18.29 3.33-32.62.36-4.78.81-10.5 1-12.71.83-9.37 1.66-20.35 2.61-34.78.56-8.46 1.33-16.44 1.72-17.73s.89-9.89 1.13-19.11l.43-16.77-2.26-4.3c-1.72-3.28-4.87-6.94-13.22-15.34-6-6.07-11.84-12.3-12.91-13.85l-1.95-2.81.75-10.9c1.09-15.71 1.1-48.57 0-59.06l-.89-8.7-3.28-4.52c-5.86-8.08-5.8-7.75-6.22-33.27-.1-6.07-.38-11.5-.63-12.06-.83-1.87-3.05-2.66-8.54-3.05-8.86-.62-11-1.9-23.85-14.55-6.15-6-12.34-12-13.75-13.19-2.81-2.42-2.79-2-.56-9.63l1.35-4.65-1.69-3a32.22 32.22 0 0 0-2.59-4.07c-1.33-1.51-5.5-10.89-6-13.49a4.24 4.24 0 0 1 .87-3.9c2.23-2.86 3.4-5.68 4.45-10.73 2.33-11.19 7.74-26.09 10.6-29.22 3.18-3.47 7.7-1 9.41 5 1.34 4.79 1.37 9.79.1 18.55a101.2 101.2 0 0 0-1 11.11c0 4 .19 4.69 2.25 7.39 3.33 4.37 7.73 7.41 15.2 10.52a18.67 18.67 0 0 1 4.72 2.85c11.17 10.72 18.62 16.18 22.95 16.85 5.18.8 8 4.54 10 13.39 1.31 5.65 4 11.14 5.46 11.14a9.38 9.38 0 0 0 3.33-1.39c2-1.22 2.25-1.73 2.25-4.18a132.88 132.88 0 0 0-2-17.84c-.37-1.66-.78-4.06-.93-5.35s-.61-3.85-1-5.69c-2.55-11.16-3.65-15.46-4.1-16-1.55-2-4.08-10.2-4.93-15.92-1.64-11.11-4-14.23-12.91-17.39A43.15 43.15 0 0 1 165.24 78c-1.15-1-4-3.22-6.35-5.06s-4.41-3.53-4.6-3.76a22.7 22.7 0 0 0-2.69-2c-6.24-4.22-8.84-7-11.26-12l-2.44-5-.22-13-.22-13 6.91-6.55c3.95-3.75 8.48-7.35 10.59-8.43 3.31-1.69 4.45-1.89 11.37-2 8.53-.19 10.12 0 11.66 1.56s1.36 6.4-.29 8.5a6.66 6.66 0 0 0-1.34 2.32c0 .58-2.61 4.91-5.42 9a30.39 30.39 0 0 0-2.37 6.82c20.44 13.39 21.55 3.77 14.07 29L194 66.92c3.11-8.66 6.47-17.26 8.61-26.22.29-7.63-12-4.19-15.4-8.68-2.33-5.93 3.13-14.18 6.06-19.2 1.6-2.34 6.62-4.7 8.82-4.15.88.22 4.16-.35 7.37-1.28a45.3 45.3 0 0 1 7.55-1.68 29.57 29.57 0 0 0 6-1.29c3.65-1.11 4.5-1.17 6.35-.4a29.54 29.54 0 0 0 5.82 1.36 18.18 18.18 0 0 1 6 1.91 22.67 22.67 0 0 0 5 2.17c2.51.68 3 .57 7.05-1.67l4.35-2.4L268.32 5c10.44-.4 10.81-.47 15.26-2.68L288.16 0l2.46 1.43c1.76 1 3.14 2.73 4.85 6 2.36 4.51 2.38 4.58 1.37 7.37-.88 2.44-.89 3.3-.1 6.39a35.76 35.76 0 0 0 2.1 5.91 13.55 13.55 0 0 1 1.31 4c.31 4.33 0 5.3-2.41 6.92-2.17 1.47-7 7.91-7 9.34a14.77 14.77 0 0 1-1.07 3c-5 11.51-6.76 13.56-14.26 17-9.2 4.2-12.3 5.19-16.21 5.19-3.1 0-4 .25-4.54 1.26a18.33 18.33 0 0 1-4.09 3.71 13.62 13.62 0 0 0-4.38 4.78 5.89 5.89 0 0 1-2.49 2.91 6.88 6.88 0 0 0-2.45 1.71 67.62 67.62 0 0 1-7 5.38c-3.33 2.34-6.87 5-7.87 6A7.27 7.27 0 0 1 224 100a5.76 5.76 0 0 0-2.13 1.65c-1.31 1.39-1.49 2.11-1.14 4.6a36.45 36.45 0 0 0 1.42 5.88c1.32 3.8 1.31 7.86 0 10.57s-.89 6.65 1.35 9.59c2 2.63 2.16 4.56.71 8.84a33.45 33.45 0 0 0-1.06 8.91c0 4.88.22 6.28 1.46 8.38s1.82 2.48 3.24 2.32c2-.23 2.3-1.05 4.71-12.12 2.18-10 3.71-11.92 13.76-17.08 2.94-1.51 7.46-4 10-5.44s6.79-3.69 9.37-4.91a40.09 40.09 0 0 0 15.22-11.67c7.11-8.79 10-16.22 12.85-33.3a18.37 18.37 0 0 1 2.86-7.73 20.39 20.39 0 0 0 2.89-7.31c1-5.3 2.85-9.08 5.58-11.51 4.7-4.18 6-1.09 4.59 10.87-.46 3.86-1.1 10.33-1.44 14.38l-.61 7.36 4.45 4.09 4.45 4.09.11 8.42c.06 4.63.47 9.53.92 10.89l.82 2.47-6.43 6.28c-8.54 8.33-12.88 13.93-16.76 21.61-1.77 3.49-3.74 7.11-4.38 8-2.18 3.11-6.46 13-8.76 20.26l-2.29 7.22-7 6.49c-3.83 3.57-8 7.25-9.17 8.17-3.05 2.32-4.26 5.15-4.26 10a14.62 14.62 0 0 0 1.59 7.26 42 42 0 0 1 2.09 4.83 9.28 9.28 0 0 0 1.57 2.89c1.4 1.59 1.92 16.12.83 23.22-.68 4.48-3.63 12-4.7 12-1.79 0-4.06 9.27-5.07 20.74-.18 2-.62 5.94-1 8.7s-1 10-1.35 16.05c-.77 12.22-.19 18.77 2 23.15 3.41 6.69.52 12.69-11 22.84l-4 3.49.07 5.19a40.81 40.81 0 0 0 1.14 8.87c4.61 16 4.73 16.92 4.38 37.13-.46 26.4-.26 40.27.63 44.15a61.31 61.31 0 0 1 1.08 7c.17 2 .66 5.33 1.08 7.36.47 2.26.78 11 .79 22.74v19.06l-1.81 2.63c-2.71 3.91-15.11 13.54-15.49 12.29zm29.53-45.11c-.18-.3-.33-6.87-.33-14.59 0-14.06-.89-27.54-2.26-34.45-.4-2-.81-9.7-.9-17.06-.15-11.93-1.4-24.37-2.64-26.38-.66-1.07-3-17.66-3-21.3 0-4.23 1-6 5.28-9.13s4.86-3.14 5.48-.72c.28 1.1 1.45 5.62 2.6 10 3.93 15.12 4.14 16.27 4.05 21.74-.1 5.78-.13 6.13-1.74 17.73-1 7.07-1.17 12.39-1 28.43.17 19.4-.64 35.73-2 41.27-.71 2.78-2.8 5.48-3.43 4.43zm-71-37.58a101 101 0 0 1-1.73-10.79 100.5 100.5 0 0 0-1.73-10.79 37.53 37.53 0 0 1-1-6.49c-.31-3.19-.91-7.46-1.33-9.48-1-4.79-3.35-19.35-3.42-21.07 0-.74-.34-4.05-.7-7.36-.67-6.21-.84-27.67-.22-28.29 1-1 6.63 2.76 11.33 7.43l5.28 5.25-.45 6.47c-.25 3.56-.6 10.23-.78 14.83s-.49 9.87-.67 11.71-.61 9.36-.94 16.72c-.79 17.41-1.94 31.29-2.65 32a.62.62 0 0 1-1-.14zm-87.18-266.59c21.07 12.79 17.84 14.15 28.49 17.66 13 4.29 18.87 7.13 23.15 16.87C111.6 233.28 86.25 255 78.55 268c-31 52-6 101.59 62.75 87.21-14.18 29.23-78 28.63-98.68-4.9-24.68-39.95-22.09-118.3 61-187.66zm210.79 179c56.66 6.88 82.32-37.74 46.54-89.23 0 0-26.87-29.34-64.28-68 3-15.45 9.49-32.12 30.57-53.82 89.2 63.51 92 141.61 92.46 149.36 4.3 70.64-78.7 91.18-105.29 61.71z"]
};
var faMarkdown = {
  prefix: 'fab',
  iconName: 'markdown',
  icon: [640, 512, [], "f60f", "M593.8 59.1H46.2C20.7 59.1 0 79.8 0 105.2v301.5c0 25.5 20.7 46.2 46.2 46.2h547.7c25.5 0 46.2-20.7 46.1-46.1V105.2c0-25.4-20.7-46.1-46.2-46.1zM338.5 360.6H277v-120l-61.5 76.9-61.5-76.9v120H92.3V151.4h61.5l61.5 76.9 61.5-76.9h61.5v209.2zm135.3 3.1L381.5 256H443V151.4h61.5V256H566z"]
};
var faMastodon = {
  prefix: 'fab',
  iconName: 'mastodon',
  icon: [448, 512, [], "f4f6", "M433 179.11c0-97.2-63.71-125.7-63.71-125.7-62.52-28.7-228.56-28.4-290.48 0 0 0-63.72 28.5-63.72 125.7 0 115.7-6.6 259.4 105.63 289.1 40.51 10.7 75.32 13 103.33 11.4 50.81-2.8 79.32-18.1 79.32-18.1l-1.7-36.9s-36.31 11.4-77.12 10.1c-40.41-1.4-83-4.4-89.63-54a102.54 102.54 0 0 1-.9-13.9c85.63 20.9 158.65 9.1 178.75 6.7 56.12-6.7 105-41.3 111.23-72.9 9.8-49.8 9-121.5 9-121.5zm-75.12 125.2h-46.63v-114.2c0-49.7-64-51.6-64 6.9v62.5h-46.33V197c0-58.5-64-56.6-64-6.9v114.2H90.19c0-122.1-5.2-147.9 18.41-175 25.9-28.9 79.82-30.8 103.83 6.1l11.6 19.5 11.6-19.5c24.11-37.1 78.12-34.8 103.83-6.1 23.71 27.3 18.4 53 18.4 175z"]
};
var faMaxcdn = {
  prefix: 'fab',
  iconName: 'maxcdn',
  icon: [512, 512, [], "f136", "M461.1 442.7h-97.4L415.6 200c2.3-10.2.9-19.5-4.4-25.7-5-6.1-13.7-9.6-24.2-9.6h-49.3l-59.5 278h-97.4l59.5-278h-83.4l-59.5 278H0l59.5-278-44.6-95.4H387c39.4 0 75.3 16.3 98.3 44.9 23.3 28.6 31.8 67.4 23.6 105.9l-47.8 222.6z"]
};
var faMdb = {
  prefix: 'fab',
  iconName: 'mdb',
  icon: [576, 512, [], "f8ca", "M17.37 160.41L7 352h43.91l5.59-79.83L84.43 352h44.71l25.54-77.43 4.79 77.43H205l-12.79-191.59H146.7L106 277.74 63.67 160.41zm281 0h-47.9V352h47.9s95 .8 94.2-95.79c-.78-94.21-94.18-95.78-94.18-95.78zm-1.2 146.46V204.78s46 4.27 46.8 50.57-46.78 51.54-46.78 51.54zm238.29-74.24a56.16 56.16 0 0 0 8-38.31c-5.34-35.76-55.08-34.32-55.08-34.32h-51.9v191.58H482s87 4.79 87-63.85c0-43.14-33.52-55.08-33.52-55.08zm-51.9-31.94s13.57-1.59 16 9.59c1.43 6.66-4 12-4 12h-12v-21.57zm-.1 109.46l.1-24.92V267h.08s41.58-4.73 41.19 22.43c-.33 25.65-41.35 20.74-41.35 20.74z"]
};
var faMedapps = {
  prefix: 'fab',
  iconName: 'medapps',
  icon: [320, 512, [], "f3c6", "M118.3 238.4c3.5-12.5 6.9-33.6 13.2-33.6 8.3 1.8 9.6 23.4 18.6 36.6 4.6-23.5 5.3-85.1 14.1-86.7 9-.7 19.7 66.5 22 77.5 9.9 4.1 48.9 6.6 48.9 6.6 1.9 7.3-24 7.6-40 7.8-4.6 14.8-5.4 27.7-11.4 28-4.7.2-8.2-28.8-17.5-49.6l-9.4 65.5c-4.4 13-15.5-22.5-21.9-39.3-3.3-.1-62.4-1.6-47.6-7.8l31-5zM228 448c21.2 0 21.2-32 0-32H92c-21.2 0-21.2 32 0 32h136zm-24 64c21.2 0 21.2-32 0-32h-88c-21.2 0-21.2 32 0 32h88zm34.2-141.5c3.2-18.9 5.2-36.4 11.9-48.8 7.9-14.7 16.1-28.1 24-41 24.6-40.4 45.9-75.2 45.9-125.5C320 69.6 248.2 0 160 0S0 69.6 0 155.2c0 50.2 21.3 85.1 45.9 125.5 7.9 12.9 16 26.3 24 41 6.7 12.5 8.7 29.8 11.9 48.9 3.5 21 36.1 15.7 32.6-5.1-3.6-21.7-5.6-40.7-15.3-58.6C66.5 246.5 33 211.3 33 155.2 33 87.3 90 32 160 32s127 55.3 127 123.2c0 56.1-33.5 91.3-66.1 151.6-9.7 18-11.7 37.4-15.3 58.6-3.4 20.6 29 26.4 32.6 5.1z"]
};
var faMedium = {
  prefix: 'fab',
  iconName: 'medium',
  icon: [448, 512, [], "f23a", "M0 32v448h448V32H0zm372.2 106.1l-24 23c-2.1 1.6-3.1 4.2-2.7 6.7v169.3c-.4 2.6.6 5.2 2.7 6.7l23.5 23v5.1h-118V367l24.3-23.6c2.4-2.4 2.4-3.1 2.4-6.7V199.8l-67.6 171.6h-9.1L125 199.8v115c-.7 4.8 1 9.7 4.4 13.2l31.6 38.3v5.1H71.2v-5.1l31.6-38.3c3.4-3.5 4.9-8.4 4.1-13.2v-133c.4-3.7-1-7.3-3.8-9.8L75 138.1V133h87.3l67.4 148L289 133.1h83.2v5z"]
};
var faMediumM = {
  prefix: 'fab',
  iconName: 'medium-m',
  icon: [512, 512, [], "f3c7", "M71.5 142.3c.6-5.9-1.7-11.8-6.1-15.8L20.3 72.1V64h140.2l108.4 237.7L364.2 64h133.7v8.1l-38.6 37c-3.3 2.5-5 6.7-4.3 10.8v272c-.7 4.1 1 8.3 4.3 10.8l37.7 37v8.1H307.3v-8.1l39.1-37.9c3.8-3.8 3.8-5 3.8-10.8V171.2L241.5 447.1h-14.7L100.4 171.2v184.9c-1.1 7.8 1.5 15.6 7 21.2l50.8 61.6v8.1h-144v-8L65 377.3c5.4-5.6 7.9-13.5 6.5-21.2V142.3z"]
};
var faMedrt = {
  prefix: 'fab',
  iconName: 'medrt',
  icon: [544, 512, [], "f3c8", "M113.7 256c0 121.8 83.9 222.8 193.5 241.1-18.7 4.5-38.2 6.9-58.2 6.9C111.4 504 0 393 0 256S111.4 8 248.9 8c20.1 0 39.6 2.4 58.2 6.9C197.5 33.2 113.7 134.2 113.7 256m297.4 100.3c-77.7 55.4-179.6 47.5-240.4-14.6 5.5 14.1 12.7 27.7 21.7 40.5 61.6 88.2 182.4 109.3 269.7 47 87.3-62.3 108.1-184.3 46.5-272.6-9-12.9-19.3-24.3-30.5-34.2 37.4 78.8 10.7 178.5-67 233.9m-218.8-244c-1.4 1-2.7 2.1-4 3.1 64.3-17.8 135.9 4 178.9 60.5 35.7 47 42.9 106.6 24.4 158 56.7-56.2 67.6-142.1 22.3-201.8-50-65.5-149.1-74.4-221.6-19.8M296 224c-4.4 0-8-3.6-8-8v-40c0-4.4-3.6-8-8-8h-48c-4.4 0-8 3.6-8 8v40c0 4.4-3.6 8-8 8h-40c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h40c4.4 0 8 3.6 8 8v40c0 4.4 3.6 8 8 8h48c4.4 0 8-3.6 8-8v-40c0-4.4 3.6-8 8-8h40c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8h-40z"]
};
var faMeetup = {
  prefix: 'fab',
  iconName: 'meetup',
  icon: [512, 512, [], "f2e0", "M99 414.3c1.1 5.7-2.3 11.1-8 12.3-5.4 1.1-10.9-2.3-12-8-1.1-5.4 2.3-11.1 7.7-12.3 5.4-1.2 11.1 2.3 12.3 8zm143.1 71.4c-6.3 4.6-8 13.4-3.7 20 4.6 6.6 13.4 8.3 20 3.7 6.3-4.6 8-13.4 3.4-20-4.2-6.5-13.1-8.3-19.7-3.7zm-86-462.3c6.3-1.4 10.3-7.7 8.9-14-1.1-6.6-7.4-10.6-13.7-9.1-6.3 1.4-10.3 7.7-9.1 14 1.4 6.6 7.6 10.6 13.9 9.1zM34.4 226.3c-10-6.9-23.7-4.3-30.6 6-6.9 10-4.3 24 5.7 30.9 10 7.1 23.7 4.6 30.6-5.7 6.9-10.4 4.3-24.1-5.7-31.2zm272-170.9c10.6-6.3 13.7-20 7.7-30.3-6.3-10.6-19.7-14-30-7.7s-13.7 20-7.4 30.6c6 10.3 19.4 13.7 29.7 7.4zm-191.1 58c7.7-5.4 9.4-16 4.3-23.7s-15.7-9.4-23.1-4.3c-7.7 5.4-9.4 16-4.3 23.7 5.1 7.8 15.6 9.5 23.1 4.3zm372.3 156c-7.4 1.7-12.3 9.1-10.6 16.9 1.4 7.4 8.9 12.3 16.3 10.6 7.4-1.4 12.3-8.9 10.6-16.6-1.5-7.4-8.9-12.3-16.3-10.9zm39.7-56.8c-1.1-5.7-6.6-9.1-12-8-5.7 1.1-9.1 6.9-8 12.6 1.1 5.4 6.6 9.1 12.3 8 5.4-1.5 9.1-6.9 7.7-12.6zM447 138.9c-8.6 6-10.6 17.7-4.9 26.3 5.7 8.6 17.4 10.6 26 4.9 8.3-6 10.3-17.7 4.6-26.3-5.7-8.7-17.4-10.9-25.7-4.9zm-6.3 139.4c26.3 43.1 15.1 100-26.3 129.1-17.4 12.3-37.1 17.7-56.9 17.1-12 47.1-69.4 64.6-105.1 32.6-1.1.9-2.6 1.7-3.7 2.9-39.1 27.1-92.3 17.4-119.4-22.3-9.7-14.3-14.6-30.6-15.1-46.9-65.4-10.9-90-94-41.1-139.7-28.3-46.9.6-107.4 53.4-114.9C151.6 70 234.1 38.6 290.1 82c67.4-22.3 136.3 29.4 130.9 101.1 41.1 12.6 52.8 66.9 19.7 95.2zm-70 74.3c-3.1-20.6-40.9-4.6-43.1-27.1-3.1-32 43.7-101.1 40-128-3.4-24-19.4-29.1-33.4-29.4-13.4-.3-16.9 2-21.4 4.6-2.9 1.7-6.6 4.9-11.7-.3-6.3-6-11.1-11.7-19.4-12.9-12.3-2-17.7 2-26.6 9.7-3.4 2.9-12 12.9-20 9.1-3.4-1.7-15.4-7.7-24-11.4-16.3-7.1-40 4.6-48.6 20-12.9 22.9-38 113.1-41.7 125.1-8.6 26.6 10.9 48.6 36.9 47.1 11.1-.6 18.3-4.6 25.4-17.4 4-7.4 41.7-107.7 44.6-112.6 2-3.4 8.9-8 14.6-5.1 5.7 3.1 6.9 9.4 6 15.1-1.1 9.7-28 70.9-28.9 77.7-3.4 22.9 26.9 26.6 38.6 4 3.7-7.1 45.7-92.6 49.4-98.3 4.3-6.3 7.4-8.3 11.7-8 3.1 0 8.3.9 7.1 10.9-1.4 9.4-35.1 72.3-38.9 87.7-4.6 20.6 6.6 41.4 24.9 50.6 11.4 5.7 62.5 15.7 58.5-11.1zm5.7 92.3c-10.3 7.4-12.9 22-5.7 32.6 7.1 10.6 21.4 13.1 32 6 10.6-7.4 13.1-22 6-32.6-7.4-10.6-21.7-13.5-32.3-6z"]
};
var faMegaport = {
  prefix: 'fab',
  iconName: 'megaport',
  icon: [496, 512, [], "f5a3", "M214.5 209.6v66.2l33.5 33.5 33.3-33.3v-66.4l-33.4-33.4zM248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm145.1 414.4L367 441.6l-26-19.2v-65.5l-33.4-33.4-33.4 33.4v65.5L248 441.6l-26.1-19.2v-65.5l-33.4-33.4-33.5 33.4v65.5l-26.1 19.2-26.1-19.2v-87l59.5-59.5V188l59.5-59.5V52.9l26.1-19.2L274 52.9v75.6l59.5 59.5v87.6l59.7 59.7v87.1z"]
};
var faMendeley = {
  prefix: 'fab',
  iconName: 'mendeley',
  icon: [640, 512, [], "f7b3", "M624.6 325.2c-12.3-12.4-29.7-19.2-48.4-17.2-43.3-1-49.7-34.9-37.5-98.8 22.8-57.5-14.9-131.5-87.4-130.8-77.4.7-81.7 82-130.9 82-48.1 0-54-81.3-130.9-82-72.9-.8-110.1 73.3-87.4 130.8 12.2 63.9 5.8 97.8-37.5 98.8-21.2-2.3-37 6.5-53 22.5-19.9 19.7-19.3 94.8 42.6 102.6 47.1 5.9 81.6-42.9 61.2-87.8-47.3-103.7 185.9-106.1 146.5-8.2-.1.1-.2.2-.3.4-26.8 42.8 6.8 97.4 58.8 95.2 52.1 2.1 85.4-52.6 58.8-95.2-.1-.2-.2-.3-.3-.4-39.4-97.9 193.8-95.5 146.5 8.2-4.6 10-6.7 21.3-5.7 33 4.9 53.4 68.7 74.1 104.9 35.2 17.8-14.8 23.1-65.6 0-88.3zm-303.9-19.1h-.6c-43.4 0-62.8-37.5-62.8-62.8 0-34.7 28.2-62.8 62.8-62.8h.6c34.7 0 62.8 28.1 62.8 62.8 0 25-19.2 62.8-62.8 62.8z"]
};
var faMicroblog = {
  prefix: 'fab',
  iconName: 'microblog',
  icon: [448, 512, [], "f91a", "M399.36,362.23c29.49-34.69,47.1-78.34,47.1-125.79C446.46,123.49,346.86,32,224,32S1.54,123.49,1.54,236.44,101.14,440.87,224,440.87a239.28,239.28,0,0,0,79.44-13.44,7.18,7.18,0,0,1,8.12,2.56c18.58,25.09,47.61,42.74,79.89,49.92a4.42,4.42,0,0,0,5.22-3.43,4.37,4.37,0,0,0-.85-3.62,87,87,0,0,1,3.69-110.69ZM329.52,212.4l-57.3,43.49L293,324.75a6.5,6.5,0,0,1-9.94,7.22L224,290.92,164.94,332a6.51,6.51,0,0,1-9.95-7.22l20.79-68.86-57.3-43.49a6.5,6.5,0,0,1,3.8-11.68l71.88-1.51,23.66-67.92a6.5,6.5,0,0,1,12.28,0l23.66,67.92,71.88,1.51a6.5,6.5,0,0,1,3.88,11.68Z"]
};
var faMicrosoft = {
  prefix: 'fab',
  iconName: 'microsoft',
  icon: [448, 512, [], "f3ca", "M0 32h214.6v214.6H0V32zm233.4 0H448v214.6H233.4V32zM0 265.4h214.6V480H0V265.4zm233.4 0H448V480H233.4V265.4z"]
};
var faMix = {
  prefix: 'fab',
  iconName: 'mix',
  icon: [448, 512, [], "f3cb", "M0 64v348.9c0 56.2 88 58.1 88 0V174.3c7.9-52.9 88-50.4 88 6.5v175.3c0 57.9 96 58 96 0V240c5.3-54.7 88-52.5 88 4.3v23.8c0 59.9 88 56.6 88 0V64H0z"]
};
var faMixcloud = {
  prefix: 'fab',
  iconName: 'mixcloud',
  icon: [640, 512, [], "f289", "M424.43 219.729C416.124 134.727 344.135 68 256.919 68c-72.266 0-136.224 46.516-159.205 114.074-54.545 8.029-96.63 54.822-96.63 111.582 0 62.298 50.668 112.966 113.243 112.966h289.614c52.329 0 94.969-42.362 94.969-94.693 0-45.131-32.118-83.063-74.48-92.2zm-20.489 144.53H114.327c-39.04 0-70.881-31.564-70.881-70.604s31.841-70.604 70.881-70.604c18.827 0 36.548 7.475 49.838 20.766 19.963 19.963 50.133-10.227 30.18-30.18-14.675-14.398-32.672-24.365-52.053-29.349 19.935-44.3 64.79-73.926 114.628-73.926 69.496 0 125.979 56.483 125.979 125.702 0 13.568-2.215 26.857-6.369 39.594-8.943 27.517 32.133 38.939 40.147 13.29 2.769-8.306 4.984-16.889 6.369-25.472 19.381 7.476 33.502 26.303 33.502 48.453 0 28.795-23.535 52.33-52.607 52.33zm235.069-52.33c0 44.024-12.737 86.386-37.102 122.657-4.153 6.092-10.798 9.414-17.72 9.414-16.317 0-27.127-18.826-17.443-32.949 19.381-29.349 29.903-63.682 29.903-99.122s-10.521-69.773-29.903-98.845c-15.655-22.831 19.361-47.24 35.163-23.534 24.366 35.993 37.102 78.356 37.102 122.379zm-70.88 0c0 31.565-9.137 62.021-26.857 88.325-4.153 6.091-10.798 9.136-17.72 9.136-17.201 0-27.022-18.979-17.443-32.948 13.013-19.104 19.658-41.255 19.658-64.513 0-22.981-6.645-45.408-19.658-64.512-15.761-22.986 19.008-47.095 35.163-23.535 17.719 26.026 26.857 56.483 26.857 88.047z"]
};
var faMixer = {
  prefix: 'fab',
  iconName: 'mixer',
  icon: [512, 512, [], "f956", "M114.57,76.07a45.71,45.71,0,0,0-67.51-6.41c-17.58,16.18-19,43.52-4.75,62.77l91.78,123L41.76,379.58c-14.23,19.25-13.11,46.59,4.74,62.77A45.71,45.71,0,0,0,114,435.94L242.89,262.7a12.14,12.14,0,0,0,0-14.23ZM470.24,379.58,377.91,255.45l91.78-123c14.22-19.25,12.83-46.59-4.75-62.77a45.71,45.71,0,0,0-67.51,6.41l-128,172.12a12.14,12.14,0,0,0,0,14.23L398,435.94a45.71,45.71,0,0,0,67.51,6.41C483.35,426.17,484.47,398.83,470.24,379.58Z"]
};
var faMizuni = {
  prefix: 'fab',
  iconName: 'mizuni',
  icon: [496, 512, [], "f3cc", "M248 8C111 8 0 119.1 0 256c0 137 111 248 248 248s248-111 248-248C496 119.1 385 8 248 8zm-80 351.9c-31.4 10.6-58.8 27.3-80 48.2V136c0-22.1 17.9-40 40-40s40 17.9 40 40v223.9zm120-9.9c-12.9-2-26.2-3.1-39.8-3.1-13.8 0-27.2 1.1-40.2 3.1V136c0-22.1 17.9-40 40-40s40 17.9 40 40v214zm120 57.7c-21.2-20.8-48.6-37.4-80-48V136c0-22.1 17.9-40 40-40s40 17.9 40 40v271.7z"]
};
var faModx = {
  prefix: 'fab',
  iconName: 'modx',
  icon: [448, 512, [], "f285", "M356 241.8l36.7 23.7V480l-133-83.8L356 241.8zM440 75H226.3l-23 37.8 153.5 96.5L440 75zm-89 142.8L55.2 32v214.5l46 29L351 217.8zM97 294.2L8 437h213.7l125-200.5L97 294.2z"]
};
var faMonero = {
  prefix: 'fab',
  iconName: 'monero',
  icon: [496, 512, [], "f3d0", "M352 384h108.4C417 455.9 338.1 504 248 504S79 455.9 35.6 384H144V256.2L248 361l104-105v128zM88 336V128l159.4 159.4L408 128v208h74.8c8.5-25.1 13.2-52 13.2-80C496 119 385 8 248 8S0 119 0 256c0 28 4.6 54.9 13.2 80H88z"]
};
var faNapster = {
  prefix: 'fab',
  iconName: 'napster',
  icon: [496, 512, [], "f3d2", "M298.3 373.6c-14.2 13.6-31.3 24.1-50.4 30.5-19-6.4-36.2-16.9-50.3-30.5h100.7zm44-199.6c20-16.9 43.6-29.2 69.6-36.2V299c0 219.4-328 217.6-328 .3V137.7c25.9 6.9 49.6 19.6 69.5 36.4 56.8-40 132.5-39.9 188.9-.1zm-208.8-58.5c64.4-60 164.3-60.1 228.9-.2-7.1 3.5-13.9 7.3-20.6 11.5-58.7-30.5-129.2-30.4-187.9.1-6.3-4-13.9-8.2-20.4-11.4zM43.8 93.2v69.3c-58.4 36.5-58.4 121.1.1 158.3 26.4 245.1 381.7 240.3 407.6 1.5l.3-1.7c58.7-36.3 58.9-121.7.2-158.2V93.2c-17.3.5-34 3-50.1 7.4-82-91.5-225.5-91.5-307.5.1-16.3-4.4-33.1-7-50.6-7.5zM259.2 352s36-.3 61.3-1.5c10.2-.5 21.1-4 25.5-6.5 26.3-15.1 25.4-39.2 26.2-47.4-79.5-.6-99.9-3.9-113 55.4zm-135.5-55.3c.8 8.2-.1 32.3 26.2 47.4 4.4 2.5 15.2 6 25.5 6.5 25.3 1.1 61.3 1.5 61.3 1.5-13.2-59.4-33.7-56.1-113-55.4zm169.1 123.4c-3.2-5.3-6.9-7.3-6.9-7.3-24.8 7.3-52.2 6.9-75.9 0 0 0-2.9 1.5-6.4 6.6-2.8 4.1-3.7 9.6-3.7 9.6 29.1 17.6 67.1 17.6 96.2 0-.1-.1-.3-4-3.3-8.9z"]
};
var faNeos = {
  prefix: 'fab',
  iconName: 'neos',
  icon: [512, 512, [], "f612", "M415.44 512h-95.11L212.12 357.46v91.1L125.69 512H28V29.82L68.47 0h108.05l123.74 176.13V63.45L386.69 0h97.69v461.5zM38.77 35.27V496l72-52.88V194l215.5 307.64h84.79l52.35-38.17h-78.27L69 13zm82.54 466.61l80-58.78v-101l-79.76-114.4v220.94L49 501.89h72.34zM80.63 10.77l310.6 442.57h82.37V10.77h-79.75v317.56L170.91 10.77zM311 191.65l72 102.81V15.93l-72 53v122.72z"]
};
var faNimblr = {
  prefix: 'fab',
  iconName: 'nimblr',
  icon: [384, 512, [], "f5a8", "M246.6 299.29c15.57 0 27.15 11.46 27.15 27s-11.62 27-27.15 27c-15.7 0-27.15-11.57-27.15-27s11.55-27 27.15-27zM113 326.25c0-15.61 11.68-27 27.15-27s27.15 11.46 27.15 27-11.47 27-27.15 27c-15.44 0-27.15-11.31-27.15-27M191.76 159C157 159 89.45 178.77 59.25 227L14 0v335.48C14 433.13 93.61 512 191.76 512s177.76-78.95 177.76-176.52S290.13 159 191.76 159zm0 308.12c-73.27 0-132.51-58.9-132.51-131.59s59.24-131.59 132.51-131.59 132.51 58.86 132.51 131.54S265 467.07 191.76 467.07z"]
};
var faNode = {
  prefix: 'fab',
  iconName: 'node',
  icon: [640, 512, [], "f419", "M316.3 452c-2.1 0-4.2-.6-6.1-1.6L291 439c-2.9-1.6-1.5-2.2-.5-2.5 3.8-1.3 4.6-1.6 8.7-4 .4-.2 1-.1 1.4.1l14.8 8.8c.5.3 1.3.3 1.8 0L375 408c.5-.3.9-.9.9-1.6v-66.7c0-.7-.3-1.3-.9-1.6l-57.8-33.3c-.5-.3-1.2-.3-1.8 0l-57.8 33.3c-.6.3-.9 1-.9 1.6v66.7c0 .6.4 1.2.9 1.5l15.8 9.1c8.6 4.3 13.9-.8 13.9-5.8v-65.9c0-.9.7-1.7 1.7-1.7h7.3c.9 0 1.7.7 1.7 1.7v65.9c0 11.5-6.2 18-17.1 18-3.3 0-6 0-13.3-3.6l-15.2-8.7c-3.7-2.2-6.1-6.2-6.1-10.5v-66.7c0-4.3 2.3-8.4 6.1-10.5l57.8-33.4c3.7-2.1 8.5-2.1 12.1 0l57.8 33.4c3.7 2.2 6.1 6.2 6.1 10.5v66.7c0 4.3-2.3 8.4-6.1 10.5l-57.8 33.4c-1.7 1.1-3.8 1.7-6 1.7zm46.7-65.8c0-12.5-8.4-15.8-26.2-18.2-18-2.4-19.8-3.6-19.8-7.8 0-3.5 1.5-8.1 14.8-8.1 11.9 0 16.3 2.6 18.1 10.6.2.8.8 1.3 1.6 1.3h7.5c.5 0 .9-.2 1.2-.5.3-.4.5-.8.4-1.3-1.2-13.8-10.3-20.2-28.8-20.2-16.5 0-26.3 7-26.3 18.6 0 12.7 9.8 16.1 25.6 17.7 18.9 1.9 20.4 4.6 20.4 8.3 0 6.5-5.2 9.2-17.4 9.2-15.3 0-18.7-3.8-19.8-11.4-.1-.8-.8-1.4-1.7-1.4h-7.5c-.9 0-1.7.7-1.7 1.7 0 9.7 5.3 21.3 30.6 21.3 18.5 0 29-7.2 29-19.8zm54.5-50.1c0 6.1-5 11.1-11.1 11.1s-11.1-5-11.1-11.1c0-6.3 5.2-11.1 11.1-11.1 6-.1 11.1 4.8 11.1 11.1zm-1.8 0c0-5.2-4.2-9.3-9.4-9.3-5.1 0-9.3 4.1-9.3 9.3 0 5.2 4.2 9.4 9.3 9.4 5.2-.1 9.4-4.3 9.4-9.4zm-4.5 6.2h-2.6c-.1-.6-.5-3.8-.5-3.9-.2-.7-.4-1.1-1.3-1.1h-2.2v5h-2.4v-12.5h4.3c1.5 0 4.4 0 4.4 3.3 0 2.3-1.5 2.8-2.4 3.1 1.7.1 1.8 1.2 2.1 2.8.1 1 .3 2.7.6 3.3zm-2.8-8.8c0-1.7-1.2-1.7-1.8-1.7h-2v3.5h1.9c1.6 0 1.9-1.1 1.9-1.8zM137.3 191c0-2.7-1.4-5.1-3.7-6.4l-61.3-35.3c-1-.6-2.2-.9-3.4-1h-.6c-1.2 0-2.3.4-3.4 1L3.7 184.6C1.4 185.9 0 188.4 0 191l.1 95c0 1.3.7 2.5 1.8 3.2 1.1.7 2.5.7 3.7 0L42 268.3c2.3-1.4 3.7-3.8 3.7-6.4v-44.4c0-2.6 1.4-5.1 3.7-6.4l15.5-8.9c1.2-.7 2.4-1 3.7-1 1.3 0 2.6.3 3.7 1l15.5 8.9c2.3 1.3 3.7 3.8 3.7 6.4v44.4c0 2.6 1.4 5.1 3.7 6.4l36.4 20.9c1.1.7 2.6.7 3.7 0 1.1-.6 1.8-1.9 1.8-3.2l.2-95zM472.5 87.3v176.4c0 2.6-1.4 5.1-3.7 6.4l-61.3 35.4c-2.3 1.3-5.1 1.3-7.4 0l-61.3-35.4c-2.3-1.3-3.7-3.8-3.7-6.4v-70.8c0-2.6 1.4-5.1 3.7-6.4l61.3-35.4c2.3-1.3 5.1-1.3 7.4 0l15.3 8.8c1.7 1 3.9-.3 3.9-2.2v-94c0-2.8 3-4.6 5.5-3.2l36.5 20.4c2.3 1.2 3.8 3.7 3.8 6.4zm-46 128.9c0-.7-.4-1.3-.9-1.6l-21-12.2c-.6-.3-1.3-.3-1.9 0l-21 12.2c-.6.3-.9.9-.9 1.6v24.3c0 .7.4 1.3.9 1.6l21 12.1c.6.3 1.3.3 1.8 0l21-12.1c.6-.3.9-.9.9-1.6v-24.3zm209.8-.7c2.3-1.3 3.7-3.8 3.7-6.4V192c0-2.6-1.4-5.1-3.7-6.4l-60.9-35.4c-2.3-1.3-5.1-1.3-7.4 0l-61.3 35.4c-2.3 1.3-3.7 3.8-3.7 6.4v70.8c0 2.7 1.4 5.1 3.7 6.4l60.9 34.7c2.2 1.3 5 1.3 7.3 0l36.8-20.5c2.5-1.4 2.5-5 0-6.4L550 241.6c-1.2-.7-1.9-1.9-1.9-3.2v-22.2c0-1.3.7-2.5 1.9-3.2l19.2-11.1c1.1-.7 2.6-.7 3.7 0l19.2 11.1c1.1.7 1.9 1.9 1.9 3.2v17.4c0 2.8 3.1 4.6 5.6 3.2l36.7-21.3zM559 219c-.4.3-.7.7-.7 1.2v13.6c0 .5.3 1 .7 1.2l11.8 6.8c.4.3 1 .3 1.4 0L584 235c.4-.3.7-.7.7-1.2v-13.6c0-.5-.3-1-.7-1.2l-11.8-6.8c-.4-.3-1-.3-1.4 0L559 219zm-254.2 43.5v-70.4c0-2.6-1.6-5.1-3.9-6.4l-61.1-35.2c-2.1-1.2-5-1.4-7.4 0l-61.1 35.2c-2.3 1.3-3.9 3.7-3.9 6.4v70.4c0 2.8 1.9 5.2 4 6.4l61.2 35.2c2.4 1.4 5.2 1.3 7.4 0l61-35.2c1.8-1 3.1-2.7 3.6-4.7.1-.5.2-1.1.2-1.7zm-74.3-124.9l-.8.5h1.1l-.3-.5zm76.2 130.2l-.4-.7v.9l.4-.2z"]
};
var faNodeJs = {
  prefix: 'fab',
  iconName: 'node-js',
  icon: [448, 512, [], "f3d3", "M224 508c-6.7 0-13.5-1.8-19.4-5.2l-61.7-36.5c-9.2-5.2-4.7-7-1.7-8 12.3-4.3 14.8-5.2 27.9-12.7 1.4-.8 3.2-.5 4.6.4l47.4 28.1c1.7 1 4.1 1 5.7 0l184.7-106.6c1.7-1 2.8-3 2.8-5V149.3c0-2.1-1.1-4-2.9-5.1L226.8 37.7c-1.7-1-4-1-5.7 0L36.6 144.3c-1.8 1-2.9 3-2.9 5.1v213.1c0 2 1.1 4 2.9 4.9l50.6 29.2c27.5 13.7 44.3-2.4 44.3-18.7V167.5c0-3 2.4-5.3 5.4-5.3h23.4c2.9 0 5.4 2.3 5.4 5.3V378c0 36.6-20 57.6-54.7 57.6-10.7 0-19.1 0-42.5-11.6l-48.4-27.9C8.1 389.2.7 376.3.7 362.4V149.3c0-13.8 7.4-26.8 19.4-33.7L204.6 9c11.7-6.6 27.2-6.6 38.8 0l184.7 106.7c12 6.9 19.4 19.8 19.4 33.7v213.1c0 13.8-7.4 26.7-19.4 33.7L243.4 502.8c-5.9 3.4-12.6 5.2-19.4 5.2zm149.1-210.1c0-39.9-27-50.5-83.7-58-57.4-7.6-63.2-11.5-63.2-24.9 0-11.1 4.9-25.9 47.4-25.9 37.9 0 51.9 8.2 57.7 33.8.5 2.4 2.7 4.2 5.2 4.2h24c1.5 0 2.9-.6 3.9-1.7s1.5-2.6 1.4-4.1c-3.7-44.1-33-64.6-92.2-64.6-52.7 0-84.1 22.2-84.1 59.5 0 40.4 31.3 51.6 81.8 56.6 60.5 5.9 65.2 14.8 65.2 26.7 0 20.6-16.6 29.4-55.5 29.4-48.9 0-59.6-12.3-63.2-36.6-.4-2.6-2.6-4.5-5.3-4.5h-23.9c-3 0-5.3 2.4-5.3 5.3 0 31.1 16.9 68.2 97.8 68.2 58.4-.1 92-23.2 92-63.4z"]
};
var faNpm = {
  prefix: 'fab',
  iconName: 'npm',
  icon: [576, 512, [], "f3d4", "M288 288h-32v-64h32v64zm288-128v192H288v32H160v-32H0V160h576zm-416 32H32v128h64v-96h32v96h32V192zm160 0H192v160h64v-32h64V192zm224 0H352v128h64v-96h32v96h32v-96h32v96h32V192z"]
};
var faNs8 = {
  prefix: 'fab',
  iconName: 'ns8',
  icon: [640, 512, [], "f3d5", "M187.1 159.9l-34.2 113.7-54.5-113.7H49L0 320h44.9L76 213.5 126.6 320h56.9L232 159.9h-44.9zm452.5-.9c-2.9-18-23.9-28.1-42.1-31.3-44.6-7.8-101.9 16.3-88.5 58.8v.1c-43.8 8.7-74.3 26.8-94.2 48.2-3-9.8-13.6-16.6-34-16.6h-87.6c-9.3 0-12.9-2.3-11.5-7.4 1.6-5.5 1.9-6.8 3.7-12.2 2.1-6.4 7.8-7.1 13.3-7.1h133.5l9.7-31.5c-139.7 0-144.5-.5-160.1 1.2-12.3 1.3-23.5 4.8-30.6 15-6.8 9.9-14.4 35.6-17.6 47.1-5.4 19.4-.6 28.6 32.8 28.6h87.3c7.8 0 8.8 2.7 7.7 6.6-1.1 4.4-2.8 10-4.5 14.6-1.6 4.2-4.7 7.4-13.8 7.4H216.3L204.7 320c139.9 0 145.3-.6 160.9-2.3 6.6-.7 13-2.1 18.5-4.9.2 3.7.5 7.3 1.2 10.8 5.4 30.5 27.4 52.3 56.8 59.5 48.6 11.9 108.7-16.8 135.1-68 18.7-36.2 14.1-76.2-3.4-105.5h.1c29.6-5.9 70.3-22 65.7-50.6zM530.7 263.7c-5.9 29.5-36.6 47.8-61.6 43.9-30.9-4.8-38.5-39.5-14.1-64.8 16.2-16.8 45.2-24 68.5-26.9 6.7 14.1 10.3 32 7.2 47.8zm21.8-83.1c-4.2-6-9.8-18.5-2.5-26.3 6.7-7.2 20.9-10.1 31.8-7.7 15.3 3.4 19.7 15.9 4.9 24.4-10.7 6.1-23.6 8.1-34.2 9.6z"]
};
var faNutritionix = {
  prefix: 'fab',
  iconName: 'nutritionix',
  icon: [400, 512, [], "f3d6", "M88 8.1S221.4-.1 209 112.5c0 0 19.1-74.9 103-40.6 0 0-17.7 74-88 56 0 0 14.6-54.6 66.1-56.6 0 0-39.9-10.3-82.1 48.8 0 0-19.8-94.5-93.6-99.7 0 0 75.2 19.4 77.6 107.5 0 .1-106.4 7-104-119.8zm312 315.6c0 48.5-9.7 95.3-32 132.3-42.2 30.9-105 48-168 48-62.9 0-125.8-17.1-168-48C9.7 419 0 372.2 0 323.7 0 275.3 17.7 229 40 192c42.2-30.9 97.1-48.6 160-48.6 63 0 117.8 17.6 160 48.6 22.3 37 40 83.3 40 131.7zM120 428c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zM192 428c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zM264 428c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zM336 428c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm0-66.2c0-15.5-12.5-28-28-28s-28 12.5-28 28 12.5 28 28 28 28-12.5 28-28zm24-39.6c-4.8-22.3-7.4-36.9-16-56-38.8-19.9-90.5-32-144-32S94.8 180.1 56 200c-8.8 19.5-11.2 33.9-16 56 42.2-7.9 98.7-14.8 160-14.8s117.8 6.9 160 14.8z"]
};
var faOdnoklassniki = {
  prefix: 'fab',
  iconName: 'odnoklassniki',
  icon: [320, 512, [], "f263", "M275.1 334c-27.4 17.4-65.1 24.3-90 26.9l20.9 20.6 76.3 76.3c27.9 28.6-17.5 73.3-45.7 45.7-19.1-19.4-47.1-47.4-76.3-76.6L84 503.4c-28.2 27.5-73.6-17.6-45.4-45.7 19.4-19.4 47.1-47.4 76.3-76.3l20.6-20.6c-24.6-2.6-62.9-9.1-90.6-26.9-32.6-21-46.9-33.3-34.3-59 7.4-14.6 27.7-26.9 54.6-5.7 0 0 36.3 28.9 94.9 28.9s94.9-28.9 94.9-28.9c26.9-21.1 47.1-8.9 54.6 5.7 12.4 25.7-1.9 38-34.5 59.1zM30.3 129.7C30.3 58 88.6 0 160 0s129.7 58 129.7 129.7c0 71.4-58.3 129.4-129.7 129.4s-129.7-58-129.7-129.4zm66 0c0 35.1 28.6 63.7 63.7 63.7s63.7-28.6 63.7-63.7c0-35.4-28.6-64-63.7-64s-63.7 28.6-63.7 64z"]
};
var faOdnoklassnikiSquare = {
  prefix: 'fab',
  iconName: 'odnoklassniki-square',
  icon: [448, 512, [], "f264", "M184.2 177.1c0-22.1 17.9-40 39.8-40s39.8 17.9 39.8 40c0 22-17.9 39.8-39.8 39.8s-39.8-17.9-39.8-39.8zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-305.1 97.1c0 44.6 36.4 80.9 81.1 80.9s81.1-36.2 81.1-80.9c0-44.8-36.4-81.1-81.1-81.1s-81.1 36.2-81.1 81.1zm174.5 90.7c-4.6-9.1-17.3-16.8-34.1-3.6 0 0-22.7 18-59.3 18s-59.3-18-59.3-18c-16.8-13.2-29.5-5.5-34.1 3.6-7.9 16.1 1.1 23.7 21.4 37 17.3 11.1 41.2 15.2 56.6 16.8l-12.9 12.9c-18.2 18-35.5 35.5-47.7 47.7-17.6 17.6 10.7 45.8 28.4 28.6l47.7-47.9c18.2 18.2 35.7 35.7 47.7 47.9 17.6 17.2 46-10.7 28.6-28.6l-47.7-47.7-13-12.9c15.5-1.6 39.1-5.9 56.2-16.8 20.4-13.3 29.3-21 21.5-37z"]
};
var faOldRepublic = {
  prefix: 'fab',
  iconName: 'old-republic',
  icon: [496, 512, [], "f510", "M235.76 10.23c7.5-.31 15-.28 22.5-.09 3.61.14 7.2.4 10.79.73 4.92.27 9.79 1.03 14.67 1.62 2.93.43 5.83.98 8.75 1.46 7.9 1.33 15.67 3.28 23.39 5.4 12.24 3.47 24.19 7.92 35.76 13.21 26.56 12.24 50.94 29.21 71.63 49.88 20.03 20.09 36.72 43.55 48.89 69.19 1.13 2.59 2.44 5.1 3.47 7.74 2.81 6.43 5.39 12.97 7.58 19.63 4.14 12.33 7.34 24.99 9.42 37.83.57 3.14 1.04 6.3 1.4 9.47.55 3.83.94 7.69 1.18 11.56.83 8.34.84 16.73.77 25.1-.07 4.97-.26 9.94-.75 14.89-.24 3.38-.51 6.76-.98 10.12-.39 2.72-.63 5.46-1.11 8.17-.9 5.15-1.7 10.31-2.87 15.41-4.1 18.5-10.3 36.55-18.51 53.63-15.77 32.83-38.83 62.17-67.12 85.12a246.503 246.503 0 0 1-56.91 34.86c-6.21 2.68-12.46 5.25-18.87 7.41-3.51 1.16-7.01 2.38-10.57 3.39-6.62 1.88-13.29 3.64-20.04 5-4.66.91-9.34 1.73-14.03 2.48-5.25.66-10.5 1.44-15.79 1.74-6.69.66-13.41.84-20.12.81-6.82.03-13.65-.12-20.45-.79-3.29-.23-6.57-.5-9.83-.95-2.72-.39-5.46-.63-8.17-1.11-4.12-.72-8.25-1.37-12.35-2.22-4.25-.94-8.49-1.89-12.69-3.02-8.63-2.17-17.08-5.01-25.41-8.13-10.49-4.12-20.79-8.75-30.64-14.25-2.14-1.15-4.28-2.29-6.35-3.57-11.22-6.58-21.86-14.1-31.92-22.34-34.68-28.41-61.41-66.43-76.35-108.7-3.09-8.74-5.71-17.65-7.8-26.68-1.48-6.16-2.52-12.42-3.58-18.66-.4-2.35-.61-4.73-.95-7.09-.6-3.96-.75-7.96-1.17-11.94-.8-9.47-.71-18.99-.51-28.49.14-3.51.34-7.01.7-10.51.31-3.17.46-6.37.92-9.52.41-2.81.65-5.65 1.16-8.44.7-3.94 1.3-7.9 2.12-11.82 3.43-16.52 8.47-32.73 15.26-48.18 1.15-2.92 2.59-5.72 3.86-8.59 8.05-16.71 17.9-32.56 29.49-47.06 20-25.38 45.1-46.68 73.27-62.47 7.5-4.15 15.16-8.05 23.07-11.37 15.82-6.88 32.41-11.95 49.31-15.38 3.51-.67 7.04-1.24 10.56-1.85 2.62-.47 5.28-.7 7.91-1.08 3.53-.53 7.1-.68 10.65-1.04 2.46-.24 4.91-.36 7.36-.51m8.64 24.41c-9.23.1-18.43.99-27.57 2.23-7.3 1.08-14.53 2.6-21.71 4.3-13.91 3.5-27.48 8.34-40.46 14.42-10.46 4.99-20.59 10.7-30.18 17.22-4.18 2.92-8.4 5.8-12.34 9.03-5.08 3.97-9.98 8.17-14.68 12.59-2.51 2.24-4.81 4.7-7.22 7.06-28.22 28.79-48.44 65.39-57.5 104.69-2.04 8.44-3.54 17.02-4.44 25.65-1.1 8.89-1.44 17.85-1.41 26.8.11 7.14.38 14.28 1.22 21.37.62 7.12 1.87 14.16 3.2 21.18 1.07 4.65 2.03 9.32 3.33 13.91 6.29 23.38 16.5 45.7 30.07 65.75 8.64 12.98 18.78 24.93 29.98 35.77 16.28 15.82 35.05 29.04 55.34 39.22 7.28 3.52 14.66 6.87 22.27 9.63 5.04 1.76 10.06 3.57 15.22 4.98 11.26 3.23 22.77 5.6 34.39 7.06 2.91.29 5.81.61 8.72.9 13.82 1.08 27.74 1 41.54-.43 4.45-.6 8.92-.99 13.35-1.78 3.63-.67 7.28-1.25 10.87-2.1 4.13-.98 8.28-1.91 12.36-3.07 26.5-7.34 51.58-19.71 73.58-36.2 15.78-11.82 29.96-25.76 42.12-41.28 3.26-4.02 6.17-8.31 9.13-12.55 3.39-5.06 6.58-10.25 9.6-15.54 2.4-4.44 4.74-8.91 6.95-13.45 5.69-12.05 10.28-24.62 13.75-37.49 2.59-10.01 4.75-20.16 5.9-30.45 1.77-13.47 1.94-27.1 1.29-40.65-.29-3.89-.67-7.77-1-11.66-2.23-19.08-6.79-37.91-13.82-55.8-5.95-15.13-13.53-29.63-22.61-43.13-12.69-18.8-28.24-35.68-45.97-49.83-25.05-20-54.47-34.55-85.65-42.08-7.78-1.93-15.69-3.34-23.63-4.45-3.91-.59-7.85-.82-11.77-1.24-7.39-.57-14.81-.72-22.22-.58zM139.26 83.53c13.3-8.89 28.08-15.38 43.3-20.18-3.17 1.77-6.44 3.38-9.53 5.29-11.21 6.68-21.52 14.9-30.38 24.49-6.8 7.43-12.76 15.73-17.01 24.89-3.29 6.86-5.64 14.19-6.86 21.71-.93 4.85-1.3 9.81-1.17 14.75.13 13.66 4.44 27.08 11.29 38.82 5.92 10.22 13.63 19.33 22.36 27.26 4.85 4.36 10.24 8.09 14.95 12.6 2.26 2.19 4.49 4.42 6.43 6.91 2.62 3.31 4.89 6.99 5.99 11.1.9 3.02.66 6.2.69 9.31.02 4.1-.04 8.2.03 12.3.14 3.54-.02 7.09.11 10.63.08 2.38.02 4.76.05 7.14.16 5.77.06 11.53.15 17.3.11 2.91.02 5.82.13 8.74.03 1.63.13 3.28-.03 4.91-.91.12-1.82.18-2.73.16-10.99 0-21.88-2.63-31.95-6.93-6-2.7-11.81-5.89-17.09-9.83-5.75-4.19-11.09-8.96-15.79-14.31-6.53-7.24-11.98-15.39-16.62-23.95-1.07-2.03-2.24-4.02-3.18-6.12-1.16-2.64-2.62-5.14-3.67-7.82-4.05-9.68-6.57-19.94-8.08-30.31-.49-4.44-1.09-8.88-1.2-13.35-.7-15.73.84-31.55 4.67-46.82 2.12-8.15 4.77-16.18 8.31-23.83 6.32-14.2 15.34-27.18 26.3-38.19 6.28-6.2 13.13-11.84 20.53-16.67zm175.37-20.12c2.74.74 5.41 1.74 8.09 2.68 6.36 2.33 12.68 4.84 18.71 7.96 13.11 6.44 25.31 14.81 35.82 24.97 10.2 9.95 18.74 21.6 25.14 34.34 1.28 2.75 2.64 5.46 3.81 8.26 6.31 15.1 10 31.26 11.23 47.57.41 4.54.44 9.09.45 13.64.07 11.64-1.49 23.25-4.3 34.53-1.97 7.27-4.35 14.49-7.86 21.18-3.18 6.64-6.68 13.16-10.84 19.24-6.94 10.47-15.6 19.87-25.82 27.22-10.48 7.64-22.64 13.02-35.4 15.38-3.51.69-7.08 1.08-10.66 1.21-1.85.06-3.72.16-5.56-.1-.28-2.15 0-4.31-.01-6.46-.03-3.73.14-7.45.1-11.17.19-7.02.02-14.05.21-21.07.03-2.38-.03-4.76.03-7.14.17-5.07-.04-10.14.14-15.21.1-2.99-.24-6.04.51-8.96.66-2.5 1.78-4.86 3.09-7.08 4.46-7.31 11.06-12.96 17.68-18.26 5.38-4.18 10.47-8.77 15.02-13.84 7.68-8.37 14.17-17.88 18.78-28.27 2.5-5.93 4.52-12.1 5.55-18.46.86-4.37 1.06-8.83 1.01-13.27-.02-7.85-1.4-15.65-3.64-23.17-1.75-5.73-4.27-11.18-7.09-16.45-3.87-6.93-8.65-13.31-13.96-19.2-9.94-10.85-21.75-19.94-34.6-27.1-1.85-1.02-3.84-1.82-5.63-2.97zm-100.8 58.45c.98-1.18 1.99-2.33 3.12-3.38-.61.93-1.27 1.81-1.95 2.68-3.1 3.88-5.54 8.31-7.03 13.06-.87 3.27-1.68 6.6-1.73 10-.07 2.52-.08 5.07.32 7.57 1.13 7.63 4.33 14.85 8.77 21.12 2 2.7 4.25 5.27 6.92 7.33 1.62 1.27 3.53 2.09 5.34 3.05 3.11 1.68 6.32 3.23 9.07 5.48 2.67 2.09 4.55 5.33 4.4 8.79-.01 73.67 0 147.34-.01 221.02 0 1.35-.08 2.7.04 4.04.13 1.48.82 2.83 1.47 4.15.86 1.66 1.78 3.34 3.18 4.62.85.77 1.97 1.4 3.15 1.24 1.5-.2 2.66-1.35 3.45-2.57.96-1.51 1.68-3.16 2.28-4.85.76-2.13.44-4.42.54-6.63.14-4.03-.02-8.06.14-12.09.03-5.89.03-11.77.06-17.66.14-3.62.03-7.24.11-10.86.15-4.03-.02-8.06.14-12.09.03-5.99.03-11.98.07-17.97.14-3.62.02-7.24.11-10.86.14-3.93-.02-7.86.14-11.78.03-5.99.03-11.98.06-17.97.16-3.94-.01-7.88.19-11.82.29 1.44.13 2.92.22 4.38.19 3.61.42 7.23.76 10.84.32 3.44.44 6.89.86 10.32.37 3.1.51 6.22.95 9.31.57 4.09.87 8.21 1.54 12.29 1.46 9.04 2.83 18.11 5.09 26.99 1.13 4.82 2.4 9.61 4 14.3 2.54 7.9 5.72 15.67 10.31 22.62 1.73 2.64 3.87 4.98 6.1 7.21.27.25.55.51.88.71.6.25 1.31-.07 1.7-.57.71-.88 1.17-1.94 1.7-2.93 4.05-7.8 8.18-15.56 12.34-23.31.7-1.31 1.44-2.62 2.56-3.61 1.75-1.57 3.84-2.69 5.98-3.63 2.88-1.22 5.9-2.19 9.03-2.42 6.58-.62 13.11.75 19.56 1.85 3.69.58 7.4 1.17 11.13 1.41 3.74.1 7.48.05 11.21-.28 8.55-.92 16.99-2.96 24.94-6.25 5.3-2.24 10.46-4.83 15.31-7.93 11.46-7.21 21.46-16.57 30.04-27.01 1.17-1.42 2.25-2.9 3.46-4.28-1.2 3.24-2.67 6.37-4.16 9.48-1.25 2.9-2.84 5.61-4.27 8.42-5.16 9.63-11.02 18.91-17.75 27.52-4.03 5.21-8.53 10.05-13.33 14.57-6.64 6.05-14.07 11.37-22.43 14.76-8.21 3.37-17.31 4.63-26.09 3.29-3.56-.58-7.01-1.69-10.41-2.88-2.79-.97-5.39-2.38-8.03-3.69-3.43-1.71-6.64-3.81-9.71-6.08 2.71 3.06 5.69 5.86 8.7 8.61 4.27 3.76 8.74 7.31 13.63 10.23 3.98 2.45 8.29 4.4 12.84 5.51 1.46.37 2.96.46 4.45.6-1.25 1.1-2.63 2.04-3.99 2.98-9.61 6.54-20.01 11.86-30.69 16.43-20.86 8.7-43.17 13.97-65.74 15.34-4.66.24-9.32.36-13.98.36-4.98-.11-9.97-.13-14.92-.65-11.2-.76-22.29-2.73-33.17-5.43-10.35-2.71-20.55-6.12-30.3-10.55-8.71-3.86-17.12-8.42-24.99-13.79-1.83-1.31-3.74-2.53-5.37-4.08 6.6-1.19 13.03-3.39 18.99-6.48 5.74-2.86 10.99-6.66 15.63-11.07 2.24-2.19 4.29-4.59 6.19-7.09-3.43 2.13-6.93 4.15-10.62 5.78-4.41 2.16-9.07 3.77-13.81 5.02-5.73 1.52-11.74 1.73-17.61 1.14-8.13-.95-15.86-4.27-22.51-8.98-4.32-2.94-8.22-6.43-11.96-10.06-9.93-10.16-18.2-21.81-25.66-33.86-3.94-6.27-7.53-12.75-11.12-19.22-1.05-2.04-2.15-4.05-3.18-6.1 2.85 2.92 5.57 5.97 8.43 8.88 8.99 8.97 18.56 17.44 29.16 24.48 7.55 4.9 15.67 9.23 24.56 11.03 3.11.73 6.32.47 9.47.81 2.77.28 5.56.2 8.34.3 5.05.06 10.11.04 15.16-.16 3.65-.16 7.27-.66 10.89-1.09 2.07-.25 4.11-.71 6.14-1.2 3.88-.95 8.11-.96 11.83.61 4.76 1.85 8.44 5.64 11.38 9.71 2.16 3.02 4.06 6.22 5.66 9.58 1.16 2.43 2.46 4.79 3.55 7.26 1 2.24 2.15 4.42 3.42 6.52.67 1.02 1.4 2.15 2.62 2.55 1.06-.75 1.71-1.91 2.28-3.03 2.1-4.16 3.42-8.65 4.89-13.05 2.02-6.59 3.78-13.27 5.19-20.02 2.21-9.25 3.25-18.72 4.54-28.13.56-3.98.83-7.99 1.31-11.97.87-10.64 1.9-21.27 2.24-31.94.08-1.86.24-3.71.25-5.57.01-4.35.25-8.69.22-13.03-.01-2.38-.01-4.76 0-7.13.05-5.07-.2-10.14-.22-15.21-.2-6.61-.71-13.2-1.29-19.78-.73-5.88-1.55-11.78-3.12-17.51-2.05-7.75-5.59-15.03-9.8-21.82-3.16-5.07-6.79-9.88-11.09-14.03-3.88-3.86-8.58-7.08-13.94-8.45-1.5-.41-3.06-.45-4.59-.64.07-2.99.7-5.93 1.26-8.85 1.59-7.71 3.8-15.3 6.76-22.6 1.52-4.03 3.41-7.9 5.39-11.72 3.45-6.56 7.62-12.79 12.46-18.46zm31.27 1.7c.35-.06.71-.12 1.07-.19.19 1.79.09 3.58.1 5.37v38.13c-.01 1.74.13 3.49-.15 5.22-.36-.03-.71-.05-1.06-.05-.95-3.75-1.72-7.55-2.62-11.31-.38-1.53-.58-3.09-1.07-4.59-1.7-.24-3.43-.17-5.15-.2-5.06-.01-10.13 0-15.19-.01-1.66-.01-3.32.09-4.98-.03-.03-.39-.26-.91.16-1.18 1.28-.65 2.72-.88 4.06-1.35 3.43-1.14 6.88-2.16 10.31-3.31 1.39-.48 2.9-.72 4.16-1.54.04-.56.02-1.13-.05-1.68-1.23-.55-2.53-.87-3.81-1.28-3.13-1.03-6.29-1.96-9.41-3.02-1.79-.62-3.67-1-5.41-1.79-.03-.37-.07-.73-.11-1.09 5.09-.19 10.2.06 15.3-.12 3.36-.13 6.73.08 10.09-.07.12-.39.26-.77.37-1.16 1.08-4.94 2.33-9.83 3.39-14.75zm5.97-.2c.36.05.72.12 1.08.2.98 3.85 1.73 7.76 2.71 11.61.36 1.42.56 2.88 1.03 4.27 2.53.18 5.07-.01 7.61.05 5.16.12 10.33.12 15.49.07.76-.01 1.52.03 2.28.08-.04.36-.07.72-.1 1.08-1.82.83-3.78 1.25-5.67 1.89-3.73 1.23-7.48 2.39-11.22 3.57-.57.17-1.12.42-1.67.64-.15.55-.18 1.12-.12 1.69.87.48 1.82.81 2.77 1.09 4.88 1.52 9.73 3.14 14.63 4.6.38.13.78.27 1.13.49.4.27.23.79.15 1.18-1.66.13-3.31.03-4.97.04-5.17.01-10.33-.01-15.5.01-1.61.03-3.22-.02-4.82.21-.52 1.67-.72 3.42-1.17 5.11-.94 3.57-1.52 7.24-2.54 10.78-.36.01-.71.02-1.06.06-.29-1.73-.15-3.48-.15-5.22v-38.13c.02-1.78-.08-3.58.11-5.37zM65.05 168.33c1.12-2.15 2.08-4.4 3.37-6.46-1.82 7.56-2.91 15.27-3.62 23-.8 7.71-.85 15.49-.54 23.23 1.05 19.94 5.54 39.83 14.23 57.88 2.99 5.99 6.35 11.83 10.5 17.11 6.12 7.47 12.53 14.76 19.84 21.09 4.8 4.1 9.99 7.78 15.54 10.8 3.27 1.65 6.51 3.39 9.94 4.68 5.01 2.03 10.19 3.61 15.42 4.94 3.83.96 7.78 1.41 11.52 2.71 5 1.57 9.47 4.61 13.03 8.43 4.93 5.23 8.09 11.87 10.2 18.67.99 2.9 1.59 5.91 2.17 8.92.15.75.22 1.52.16 2.29-6.5 2.78-13.26 5.06-20.26 6.18-4.11.78-8.29.99-12.46 1.08-10.25.24-20.47-1.76-30.12-5.12-3.74-1.42-7.49-2.85-11.03-4.72-8.06-3.84-15.64-8.7-22.46-14.46-2.92-2.55-5.83-5.13-8.4-8.03-9.16-9.83-16.3-21.41-21.79-33.65-2.39-5.55-4.61-11.18-6.37-16.96-1.17-3.94-2.36-7.89-3.26-11.91-.75-2.94-1.22-5.95-1.87-8.92-.46-2.14-.69-4.32-1.03-6.48-.85-5.43-1.28-10.93-1.33-16.43.11-6.18.25-12.37 1.07-18.5.4-2.86.67-5.74 1.15-8.6.98-5.7 2.14-11.37 3.71-16.93 3.09-11.65 7.48-22.95 12.69-33.84zm363.73-6.44c1.1 1.66 1.91 3.48 2.78 5.26 2.1 4.45 4.24 8.9 6.02 13.49 7.61 18.76 12.3 38.79 13.04 59.05.02 1.76.07 3.52.11 5.29.13 9.57-1.27 19.09-3.18 28.45-.73 3.59-1.54 7.17-2.58 10.69-4.04 14.72-10 29-18.41 41.78-8.21 12.57-19.01 23.55-31.84 31.41-5.73 3.59-11.79 6.64-18.05 9.19-5.78 2.19-11.71 4.03-17.8 5.11-6.4 1.05-12.91 1.52-19.4 1.23-7.92-.48-15.78-2.07-23.21-4.85-1.94-.8-3.94-1.46-5.84-2.33-.21-1.51.25-2.99.53-4.46 1.16-5.74 3.03-11.36 5.7-16.58 2.37-4.51 5.52-8.65 9.46-11.9 2.43-2.05 5.24-3.61 8.16-4.83 3.58-1.5 7.47-1.97 11.24-2.83 7.23-1.71 14.37-3.93 21.15-7 10.35-4.65 19.71-11.38 27.65-19.46 1.59-1.61 3.23-3.18 4.74-4.87 3.37-3.76 6.71-7.57 9.85-11.53 7.48-10.07 12.82-21.59 16.71-33.48 1.58-5.3 3.21-10.6 4.21-16.05.63-2.87 1.04-5.78 1.52-8.68.87-6.09 1.59-12.22 1.68-18.38.12-6.65.14-13.32-.53-19.94-.73-7.99-1.87-15.96-3.71-23.78z"]
};
var faOpencart = {
  prefix: 'fab',
  iconName: 'opencart',
  icon: [640, 512, [], "f23d", "M423.3 440.7c0 25.3-20.3 45.6-45.6 45.6s-45.8-20.3-45.8-45.6 20.6-45.8 45.8-45.8c25.4 0 45.6 20.5 45.6 45.8zm-253.9-45.8c-25.3 0-45.6 20.6-45.6 45.8s20.3 45.6 45.6 45.6 45.8-20.3 45.8-45.6-20.5-45.8-45.8-45.8zm291.7-270C158.9 124.9 81.9 112.1 0 25.7c34.4 51.7 53.3 148.9 373.1 144.2 333.3-5 130 86.1 70.8 188.9 186.7-166.7 319.4-233.9 17.2-233.9z"]
};
var faOpenid = {
  prefix: 'fab',
  iconName: 'openid',
  icon: [448, 512, [], "f19b", "M271.5 432l-68 32C88.5 453.7 0 392.5 0 318.2c0-71.5 82.5-131 191.7-144.3v43c-71.5 12.5-124 53-124 101.3 0 51 58.5 93.3 135.7 103v-340l68-33.2v384zM448 291l-131.3-28.5 36.8-20.7c-19.5-11.5-43.5-20-70-24.8v-43c46.2 5.5 87.7 19.5 120.3 39.3l35-19.8L448 291z"]
};
var faOpera = {
  prefix: 'fab',
  iconName: 'opera',
  icon: [496, 512, [], "f26a", "M313.9 32.7c-170.2 0-252.6 223.8-147.5 355.1 36.5 45.4 88.6 75.6 147.5 75.6 36.3 0 70.3-11.1 99.4-30.4-43.8 39.2-101.9 63-165.3 63-3.9 0-8 0-11.9-.3C104.6 489.6 0 381.1 0 248 0 111 111 0 248 0h.8c63.1.3 120.7 24.1 164.4 63.1-29-19.4-63.1-30.4-99.3-30.4zm101.8 397.7c-40.9 24.7-90.7 23.6-132-5.8 56.2-20.5 97.7-91.6 97.7-176.6 0-84.7-41.2-155.8-97.4-176.6 41.8-29.2 91.2-30.3 132.9-5 105.9 98.7 105.5 265.7-1.2 364z"]
};
var faOptinMonster = {
  prefix: 'fab',
  iconName: 'optin-monster',
  icon: [576, 512, [], "f23c", "M572.6 421.4c5.6-9.5 4.7-15.2-5.4-11.6-3-4.9-7-9.5-11.1-13.8 2.9-9.7-.7-14.2-10.8-9.2-4.6-3.2-10.3-6.5-15.9-9.2 0-15.1-11.6-11.6-17.6-5.7-10.4-1.5-18.7-.3-26.8 5.7.3-6.5.3-13 .3-19.7 12.6 0 40.2-11 45.9-36.2 1.4-6.8 1.6-13.8-.3-21.9-3-13.5-14.3-21.3-25.1-25.7-.8-5.9-7.6-14.3-14.9-15.9s-12.4 4.9-14.1 10.3c-8.5 0-19.2 2.8-21.1 8.4-5.4-.5-11.1-1.4-16.8-1.9 2.7-1.9 5.4-3.5 8.4-4.6 5.4-9.2 14.6-11.4 25.7-11.6V256c19.5-.5 43-5.9 53.8-18.1 12.7-13.8 14.6-37.3 12.4-55.1-2.4-17.3-9.7-37.6-24.6-48.1-8.4-5.9-21.6-.8-22.7 9.5-2.2 19.6 1.2 30-38.6 25.1-10.3-23.8-24.6-44.6-42.7-60C341 49.6 242.9 55.5 166.4 71.7c19.7 4.6 41.1 8.6 59.7 16.5-26.2 2.4-52.7 11.3-76.2 23.2-32.8 17-44 29.9-56.7 42.4 14.9-2.2 28.9-5.1 43.8-3.8-9.7 5.4-18.4 12.2-26.5 20-25.8.9-23.8-5.3-26.2-25.9-1.1-10.5-14.3-15.4-22.7-9.7-28.1 19.9-33.5 79.9-12.2 103.5 10.8 12.2 35.1 17.3 54.9 17.8-.3 1.1-.3 1.9-.3 2.7 10.8.5 19.5 2.7 24.6 11.6 3 1.1 5.7 2.7 8.1 4.6-5.4.5-11.1 1.4-16.5 1.9-3.3-6.6-13.7-8.1-21.1-8.1-1.6-5.7-6.5-12.2-14.1-10.3-6.8 1.9-14.1 10-14.9 15.9-22.5 9.5-30.1 26.8-25.1 47.6 5.3 24.8 33 36.2 45.9 36.2v19.7c-6.6-5-14.3-7.5-26.8-5.7-5.5-5.5-17.3-10.1-17.3 5.7-5.9 2.7-11.4 5.9-15.9 9.2-9.8-4.9-13.6-1.7-11.1 9.2-4.1 4.3-7.8 8.6-11.1 13.8-10.2-3.7-11 2.2-5.4 11.6-1.1 3.5-1.6 7-1.9 10.8-.5 31.6 44.6 64 73.5 65.1 17.3.5 34.6-8.4 43-23.5 113.2 4.9 226.7 4.1 340.2 0 8.1 15.1 25.4 24.3 42.7 23.5 29.2-1.1 74.3-33.5 73.5-65.1.2-3.7-.7-7.2-1.7-10.7zm-73.8-254c1.1-3 2.4-8.4 2.4-14.6 0-5.9 6.8-8.1 14.1-.8 11.1 11.6 14.9 40.5 13.8 51.1-4.1-13.6-13-29-30.3-35.7zm-4.6 6.7c19.5 6.2 28.6 27.6 29.7 48.9-1.1 2.7-3 5.4-4.9 7.6-5.7 5.9-15.4 10-26.2 12.2 4.3-21.3.3-47.3-12.7-63 4.9-.8 10.9-2.4 14.1-5.7zm-24.1 6.8c13.8 11.9 20 39.2 14.1 63.5-4.1.5-8.1.8-11.6.8-1.9-21.9-6.8-44-14.3-64.6 3.7.3 8.1.3 11.8.3zM47.5 203c-1.1-10.5 2.4-39.5 13.8-51.1 7-7.3 14.1-5.1 14.1.8 0 6.2 1.4 11.6 2.4 14.6-17.3 6.8-26.2 22.2-30.3 35.7zm9.7 27.6c-1.9-2.2-3.5-4.9-4.9-7.6 1.4-21.3 10.3-42.7 29.7-48.9 3.2 3.2 9.2 4.9 14.1 5.7-13 15.7-17 41.6-12.7 63-10.8-2.2-20.5-6-26.2-12.2zm47.9 14.6c-4.1 0-8.1-.3-12.7-.8-4.6-18.6-1.9-38.9 5.4-53v.3l12.2-5.1c4.9-1.9 9.7-3.8 14.9-4.9-10.7 19.7-17.4 41.3-19.8 63.5zm184-162.7c41.9 0 76.2 34 76.2 75.9 0 42.2-34.3 76.2-76.2 76.2s-76.2-34-76.2-76.2c0-41.8 34.3-75.9 76.2-75.9zm115.6 174.3c-.3 17.8-7 48.9-23 57-13.2 6.6-6.5-7.5-16.5-58.1 13.3.3 26.6.3 39.5 1.1zm-54-1.6c.8 4.9 3.8 40.3-1.6 41.9-11.6 3.5-40 4.3-51.1-1.1-4.1-3-4.6-35.9-4.3-41.1v.3c18.9-.3 38.1-.3 57 0zM278.3 309c-13 3.5-41.6 4.1-54.6-1.6-6.5-2.7-3.8-42.4-1.9-51.6 19.2-.5 38.4-.5 57.8-.8v.3c1.1 8.3 3.3 51.2-1.3 53.7zm-106.5-51.1c12.2-.8 24.6-1.4 36.8-1.6-2.4 15.4-3 43.5-4.9 52.2-1.1 6.8-4.3 6.8-9.7 4.3-21.9-9.8-27.6-35.2-22.2-54.9zm-35.4 31.3c7.8-1.1 15.7-1.9 23.5-2.7 1.6 6.2 3.8 11.9 7 17.6 10 17 44 35.7 45.1 7 6.2 14.9 40.8 12.2 54.9 10.8 15.7-1.4 23.8-1.4 26.8-14.3 12.4 4.3 30.8 4.1 44 3 11.3-.8 20.8-.5 24.6-8.9 1.1 5.1 1.9 11.6 4.6 16.8 10.8 21.3 37.3 1.4 46.8-31.6 8.6.8 17.6 1.9 26.5 2.7-.4 1.3-3.8 7.3 7.3 11.6-47.6 47-95.7 87.8-163.2 107-63.2-20.8-112.1-59.5-155.9-106.5 9.6-3.4 10.4-8.8 8-12.5zm-21.6 172.5c-3.8 17.8-21.9 29.7-39.7 28.9-19.2-.8-46.5-17-59.2-36.5-2.7-31.1 43.8-61.3 66.2-54.6 14.9 4.3 27.8 30.8 33.5 54 0 3-.3 5.7-.8 8.2zm-8.7-66c-.5-13.5-.5-27-.3-40.5h.3c2.7-1.6 5.7-3.8 7.8-6.5 6.5-1.6 13-5.1 15.1-9.2 3.3-7.1-7-7.5-5.4-12.4 2.7-1.1 5.7-2.2 7.8-3.5 29.2 29.2 58.6 56.5 97.3 77-36.8 11.3-72.4 27.6-105.9 47-1.2-18.6-7.7-35.9-16.7-51.9zm337.6 64.6c-103 3.5-206.2 4.1-309.4 0 0 .3 0 .3-.3.3v-.3h.3c35.1-21.6 72.2-39.2 112.4-50.8 11.6 5.1 23 9.5 34.9 13.2 2.2.8 2.2.8 4.3 0 14.3-4.1 28.4-9.2 42.2-15.4 41.5 11.7 78.8 31.7 115.6 53zm10.5-12.4c-35.9-19.5-73-35.9-111.9-47.6 38.1-20 71.9-47.3 103.5-76.7 2.2 1.4 4.6 2.4 7.6 3.2 0 .8.3 1.9.5 2.4-4.6 2.7-7.8 6.2-5.9 10.3 2.2 3.8 8.6 7.6 15.1 8.9 2.4 2.7 5.1 5.1 8.1 6.8 0 13.8-.3 27.6-.8 41.3l.3-.3c-9.3 15.9-15.5 37-16.5 51.7zm105.9 6.2c-12.7 19.5-40 35.7-59.2 36.5-19.3.9-40.5-13.2-40.5-37 5.7-23.2 18.9-49.7 33.5-54 22.7-6.9 69.2 23.4 66.2 54.5zM372.9 75.2c-3.8-72.1-100.8-79.7-126-23.5 44.6-24.3 90.3-15.7 126 23.5zM74.8 407.1c-15.7 1.6-49.5 25.4-49.5 43.2 0 11.6 15.7 19.5 32.2 14.9 12.2-3.2 31.1-17.6 35.9-27.3 6-11.6-3.7-32.7-18.6-30.8zm215.9-176.2c28.6 0 51.9-21.6 51.9-48.4 0-36.1-40.5-58.1-72.2-44.3 9.5 3 16.5 11.6 16.5 21.6 0 23.3-33.3 32-46.5 11.3-7.3 34.1 19.4 59.8 50.3 59.8zM68 474.1c.5 6.5 12.2 12.7 21.6 9.5 6.8-2.7 14.6-10.5 17.3-16.2 3-7-1.1-20-9.7-18.4-8.9 1.6-29.7 16.7-29.2 25.1zm433.2-67c-14.9-1.9-24.6 19.2-18.9 30.8 4.9 9.7 24.1 24.1 36.2 27.3 16.5 4.6 32.2-3.2 32.2-14.9 0-17.8-33.8-41.6-49.5-43.2zM478.8 449c-8.4-1.6-12.4 11.3-9.5 18.4 2.4 5.7 10.3 13.5 17.3 16.2 9.2 3.2 21.1-3 21.3-9.5.9-8.4-20.2-23.5-29.1-25.1z"]
};
var faOrcid = {
  prefix: 'fab',
  iconName: 'orcid',
  icon: [512, 512, [], "f8d2", "M294.75 188.19h-45.92V342h47.47c67.62 0 83.12-51.34 83.12-76.91 0-41.64-26.54-76.9-84.67-76.9zM256 8C119 8 8 119 8 256s111 248 248 248 248-111 248-248S393 8 256 8zm-80.79 360.76h-29.84v-207.5h29.84zm-14.92-231.14a19.57 19.57 0 1 1 19.57-19.57 19.64 19.64 0 0 1-19.57 19.57zM300 369h-81V161.26h80.6c76.73 0 110.44 54.83 110.44 103.85C410 318.39 368.38 369 300 369z"]
};
var faOsi = {
  prefix: 'fab',
  iconName: 'osi',
  icon: [512, 512, [], "f41a", "M8 266.44C10.3 130.64 105.4 34 221.8 18.34c138.8-18.6 255.6 75.8 278 201.1 21.3 118.8-44 230-151.6 274-9.3 3.8-14.4 1.7-18-7.7q-26.7-69.45-53.4-139c-3.1-8.1-1-13.2 7-16.8 24.2-11 39.3-29.4 43.3-55.8a71.47 71.47 0 0 0-64.5-82.2c-39-3.4-71.8 23.7-77.5 59.7-5.2 33 11.1 63.7 41.9 77.7 9.6 4.4 11.5 8.6 7.8 18.4q-26.85 69.9-53.7 139.9c-2.6 6.9-8.3 9.3-15.5 6.5-52.6-20.3-101.4-61-130.8-119-24.9-49.2-25.2-87.7-26.8-108.7zm20.9-1.9c.4 6.6.6 14.3 1.3 22.1 6.3 71.9 49.6 143.5 131 183.1 3.2 1.5 4.4.8 5.6-2.3q22.35-58.65 45-117.3c1.3-3.3.6-4.8-2.4-6.7-31.6-19.9-47.3-48.5-45.6-86 1-21.6 9.3-40.5 23.8-56.3 30-32.7 77-39.8 115.5-17.6a91.64 91.64 0 0 1 45.2 90.4c-3.6 30.6-19.3 53.9-45.7 69.8-2.7 1.6-3.5 2.9-2.3 6q22.8 58.8 45.2 117.7c1.2 3.1 2.4 3.8 5.6 2.3 35.5-16.6 65.2-40.3 88.1-72 34.8-48.2 49.1-101.9 42.3-161-13.7-117.5-119.4-214.8-255.5-198-106.1 13-195.3 102.5-197.1 225.8z"]
};
var faPage4 = {
  prefix: 'fab',
  iconName: 'page4',
  icon: [496, 512, [], "f3d7", "M248 504C111 504 0 393 0 256S111 8 248 8c20.9 0 41.3 2.6 60.7 7.5L42.3 392H248v112zm0-143.6V146.8L98.6 360.4H248zm96 31.6v92.7c45.7-19.2 84.5-51.7 111.4-92.7H344zm57.4-138.2l-21.2 8.4 21.2 8.3v-16.7zm-20.3 54.5c-6.7 0-8 6.3-8 12.9v7.7h16.2v-10c0-5.9-2.3-10.6-8.2-10.6zM496 256c0 37.3-8.2 72.7-23 104.4H344V27.3C433.3 64.8 496 153.1 496 256zM360.4 143.6h68.2V96h-13.9v32.6h-13.9V99h-13.9v29.6h-12.7V96h-13.9v47.6zm68.1 185.3H402v-11c0-15.4-5.6-25.2-20.9-25.2-15.4 0-20.7 10.6-20.7 25.9v25.3h68.2v-15zm0-103l-68.2 29.7V268l68.2 29.5v-16.6l-14.4-5.7v-26.5l14.4-5.9v-16.9zm-4.8-68.5h-35.6V184H402v-12.2h11c8.6 15.8 1.3 35.3-18.6 35.3-22.5 0-28.3-25.3-15.5-37.7l-11.6-10.6c-16.2 17.5-12.2 63.9 27.1 63.9 34 0 44.7-35.9 29.3-65.3z"]
};
var faPagelines = {
  prefix: 'fab',
  iconName: 'pagelines',
  icon: [384, 512, [], "f18c", "M384 312.7c-55.1 136.7-187.1 54-187.1 54-40.5 81.8-107.4 134.4-184.6 134.7-16.1 0-16.6-24.4 0-24.4 64.4-.3 120.5-42.7 157.2-110.1-41.1 15.9-118.6 27.9-161.6-82.2 109-44.9 159.1 11.2 178.3 45.5 9.9-24.4 17-50.9 21.6-79.7 0 0-139.7 21.9-149.5-98.1 119.1-47.9 152.6 76.7 152.6 76.7 1.6-16.7 3.3-52.6 3.3-53.4 0 0-106.3-73.7-38.1-165.2 124.6 43 61.4 162.4 61.4 162.4.5 1.6.5 23.8 0 33.4 0 0 45.2-89 136.4-57.5-4.2 134-141.9 106.4-141.9 106.4-4.4 27.4-11.2 53.4-20 77.5 0 0 83-91.8 172-20z"]
};
var faPalfed = {
  prefix: 'fab',
  iconName: 'palfed',
  icon: [576, 512, [], "f3d8", "M384.9 193.9c0-47.4-55.2-44.2-95.4-29.8-1.3 39.4-2.5 80.7-3 119.8.7 2.8 2.6 6.2 15.1 6.2 36.8 0 83.4-42.8 83.3-96.2zm-194.5 72.2c.2 0 6.5-2.7 11.2-2.7 26.6 0 20.7 44.1-14.4 44.1-21.5 0-37.1-18.1-37.1-43 0-42 42.9-95.6 100.7-126.5 1-12.4 3-22 10.5-28.2 11.2-9 26.6-3.5 29.5 11.1 72.2-22.2 135.2 1 135.2 72 0 77.9-79.3 152.6-140.1 138.2-.1 39.4.9 74.4 2.7 100v.2c.2 3.4.6 12.5-5.3 19.1-9.6 10.6-33.4 10-36.4-22.3-4.1-44.4.2-206.1 1.4-242.5-21.5 15-58.5 50.3-58.5 75.9.2 2.5.4 4 .6 4.6zM8 181.1s-.1 37.4 38.4 37.4h30l22.4 217.2s0 44.3 44.7 44.3h288.9s44.7-.4 44.7-44.3l22.4-217.2h30s38.4 1.2 38.4-37.4c0 0 .1-37.4-38.4-37.4h-30.1c-7.3-25.6-30.2-74.3-119.4-74.3h-28V50.3s-2.7-18.4-21.1-18.4h-85.8s-21.1 0-21.1 18.4v19.1h-28.1s-105 4.2-120.5 74.3h-29S8 142.5 8 181.1z"]
};
var faPatreon = {
  prefix: 'fab',
  iconName: 'patreon',
  icon: [512, 512, [], "f3d9", "M512 194.8c0 101.3-82.4 183.8-183.8 183.8-101.7 0-184.4-82.4-184.4-183.8 0-101.6 82.7-184.3 184.4-184.3C429.6 10.5 512 93.2 512 194.8zM0 501.5h90v-491H0v491z"]
};
var faPaypal = {
  prefix: 'fab',
  iconName: 'paypal',
  icon: [384, 512, [], "f1ed", "M111.4 295.9c-3.5 19.2-17.4 108.7-21.5 134-.3 1.8-1 2.5-3 2.5H12.3c-7.6 0-13.1-6.6-12.1-13.9L58.8 46.6c1.5-9.6 10.1-16.9 20-16.9 152.3 0 165.1-3.7 204 11.4 60.1 23.3 65.6 79.5 44 140.3-21.5 62.6-72.5 89.5-140.1 90.3-43.4.7-69.5-7-75.3 24.2zM357.1 152c-1.8-1.3-2.5-1.8-3 1.3-2 11.4-5.1 22.5-8.8 33.6-39.9 113.8-150.5 103.9-204.5 103.9-6.1 0-10.1 3.3-10.9 9.4-22.6 140.4-27.1 169.7-27.1 169.7-1 7.1 3.5 12.9 10.6 12.9h63.5c8.6 0 15.7-6.3 17.4-14.9.7-5.4-1.1 6.1 14.4-91.3 4.6-22 14.3-19.7 29.3-19.7 71 0 126.4-28.8 142.9-112.3 6.5-34.8 4.6-71.4-23.8-92.6z"]
};
var faPennyArcade = {
  prefix: 'fab',
  iconName: 'penny-arcade',
  icon: [640, 512, [], "f704", "M421.91 164.27c-4.49 19.45-1.4 6.06-15.1 65.29l39.73-10.61c-22.34-49.61-17.29-38.41-24.63-54.68zm-206.09 51.11c-20.19 5.4-11.31 3.03-39.63 10.58l4.46 46.19c28.17-7.59 20.62-5.57 34.82-9.34 42.3-9.79 32.85-56.42.35-47.43zm326.16-26.19l-45.47-99.2c-5.69-12.37-19.46-18.84-32.62-15.33-70.27 18.75-38.72 10.32-135.59 36.23a27.618 27.618 0 0 0-18.89 17.41C144.26 113.27 0 153.75 0 226.67c0 33.5 30.67 67.11 80.9 95.37l1.74 17.88a27.891 27.891 0 0 0-17.77 28.67l4.3 44.48c1.39 14.31 13.43 25.21 27.8 25.2 5.18-.01-3.01 1.78 122.53-31.76 12.57-3.37 21.12-15.02 20.58-28.02 216.59 45.5 401.99-5.98 399.89-84.83.01-28.15-22.19-66.56-97.99-104.47zM255.14 298.3l-21.91 5.88-48.44 12.91 2.46 23.55 20.53-5.51 4.51 44.51-115.31 30.78-4.3-44.52 20.02-5.35-11.11-114.64-20.12 5.39-4.35-44.5c178.15-47.54 170.18-46.42 186.22-46.65 56.66-1.13 64.15 71.84 42.55 104.43a86.7 86.7 0 0 1-50.75 33.72zm199.18 16.62l-3.89-39.49 14.9-3.98-6.61-14.68-57.76 15.42-4.1 17.54 19.2-5.12 4.05 39.54-112.85 30.07-4.46-44.43 20.99-5.59 33.08-126.47-17.15 4.56-4.2-44.48c93.36-24.99 65.01-17.41 135.59-36.24l66.67 145.47 20.79-5.56 4.3 44.48-108.55 28.96z"]
};
var faPeriscope = {
  prefix: 'fab',
  iconName: 'periscope',
  icon: [448, 512, [], "f3da", "M370 63.6C331.4 22.6 280.5 0 226.6 0 111.9 0 18.5 96.2 18.5 214.4c0 75.1 57.8 159.8 82.7 192.7C137.8 455.5 192.6 512 226.6 512c41.6 0 112.9-94.2 120.9-105 24.6-33.1 82-118.3 82-192.6 0-56.5-21.1-110.1-59.5-150.8zM226.6 493.9c-42.5 0-190-167.3-190-279.4 0-107.4 83.9-196.3 190-196.3 100.8 0 184.7 89 184.7 196.3.1 112.1-147.4 279.4-184.7 279.4zM338 206.8c0 59.1-51.1 109.7-110.8 109.7-100.6 0-150.7-108.2-92.9-181.8v.4c0 24.5 20.1 44.4 44.8 44.4 24.7 0 44.8-19.9 44.8-44.4 0-18.2-11.1-33.8-26.9-40.7 76.6-19.2 141 39.3 141 112.4z"]
};
var faPhabricator = {
  prefix: 'fab',
  iconName: 'phabricator',
  icon: [496, 512, [], "f3db", "M323 262.1l-.1-13s21.7-19.8 21.1-21.2l-9.5-20c-.6-1.4-29.5-.5-29.5-.5l-9.4-9.3s.2-28.5-1.2-29.1l-20.1-9.2c-1.4-.6-20.7 21-20.7 21l-13.1-.2s-20.5-21.4-21.9-20.8l-20 8.3c-1.4.5.2 28.9.2 28.9l-9.1 9.1s-29.2-.9-29.7.4l-8.1 19.8c-.6 1.4 21 21 21 21l.1 12.9s-21.7 19.8-21.1 21.2l9.5 20c.6 1.4 29.5.5 29.5.5l9.4 9.3s-.2 31.8 1.2 32.3l20.1 8.3c1.4.6 20.7-23.5 20.7-23.5l13.1.2s20.5 23.8 21.8 23.3l20-7.5c1.4-.6-.2-32.1-.2-32.1l9.1-9.1s29.2.9 29.7-.5l8.1-19.8c.7-1.1-20.9-20.7-20.9-20.7zm-44.9-8.7c.7 17.1-12.8 31.6-30.1 32.4-17.3.8-32.1-12.5-32.8-29.6-.7-17.1 12.8-31.6 30.1-32.3 17.3-.8 32.1 12.5 32.8 29.5zm201.2-37.9l-97-97-.1.1c-75.1-73.3-195.4-72.8-269.8 1.6-50.9 51-27.8 27.9-95.7 95.3-22.3 22.3-22.3 58.7 0 81 69.9 69.4 46.4 46 97.4 97l.1-.1c75.1 73.3 195.4 72.9 269.8-1.6 51-50.9 27.9-27.9 95.3-95.3 22.3-22.3 22.3-58.7 0-81zM140.4 363.8c-59.6-59.5-59.6-156 0-215.5 59.5-59.6 156-59.5 215.6 0 59.5 59.5 59.6 156 0 215.6-59.6 59.5-156 59.4-215.6-.1z"]
};
var faPhoenixFramework = {
  prefix: 'fab',
  iconName: 'phoenix-framework',
  icon: [640, 512, [], "f3dc", "M212.9 344.3c3.8-.1 22.8-1.4 25.6-2.2-2.4-2.6-43.6-1-68-49.6-4.3-8.6-7.5-17.6-6.4-27.6 2.9-25.5 32.9-30 52-18.5 36 21.6 63.3 91.3 113.7 97.5 37 4.5 84.6-17 108.2-45.4-.6-.1-.8-.2-1-.1-.4.1-.8.2-1.1.3-33.3 12.1-94.3 9.7-134.7-14.8-37.6-22.8-53.1-58.7-51.8-74.6 1.8-21.3 22.9-23.2 35.9-19.6 14.4 3.9 24.4 17.6 38.9 27.4 15.6 10.4 32.9 13.7 51.3 10.3 14.9-2.7 34.4-12.3 36.5-14.5-1.1-.1-1.8-.1-2.5-.2-6.2-.6-12.4-.8-18.5-1.7C279.8 194.5 262.1 47.4 138.5 37.9 94.2 34.5 39.1 46 2.2 72.9c-.8.6-1.5 1.2-2.2 1.8.1.2.1.3.2.5.8 0 1.6-.1 2.4-.2 6.3-1 12.5-.8 18.7.3 23.8 4.3 47.7 23.1 55.9 76.5 5.3 34.3-.7 50.8 8 86.1 19 77.1 91 107.6 127.7 106.4zM75.3 64.9c-.9-1-.9-1.2-1.3-2 12.1-2.6 24.2-4.1 36.6-4.8-1.1 14.7-22.2 21.3-35.3 6.8zm196.9 350.5c-42.8 1.2-92-26.7-123.5-61.4-4.6-5-16.8-20.2-18.6-23.4l.4-.4c6.6 4.1 25.7 18.6 54.8 27 24.2 7 48.1 6.3 71.6-3.3 22.7-9.3 41-.5 43.1 2.9-18.5 3.8-20.1 4.4-24 7.9-5.1 4.4-4.6 11.7 7 17.2 26.2 12.4 63-2.8 97.2 25.4 2.4 2 8.1 7.8 10.1 10.7-.1.2-.3.3-.4.5-4.8-1.5-16.4-7.5-40.2-9.3-24.7-2-46.3 5.3-77.5 6.2zm174.8-252c16.4-5.2 41.3-13.4 66.5-3.3 16.1 6.5 26.2 18.7 32.1 34.6 3.5 9.4 5.1 19.7 5.1 28.7-.2 0-.4 0-.6.1-.2-.4-.4-.9-.5-1.3-5-22-29.9-43.8-67.6-29.9-50.2 18.6-130.4 9.7-176.9-48-.7-.9-2.4-1.7-1.3-3.2.1-.2 2.1.6 3 1.3 18.1 13.4 38.3 21.9 60.3 26.2 30.5 6.1 54.6 2.9 79.9-5.2zm102.7 117.5c-32.4.2-33.8 50.1-103.6 64.4-18.2 3.7-38.7 4.6-44.9 4.2v-.4c2.8-1.5 14.7-2.6 29.7-16.6 7.9-7.3 15.3-15.1 22.8-22.9 19.5-20.2 41.4-42.2 81.9-39 23.1 1.8 29.3 8.2 36.1 12.7.3.2.4.5.7.9-.5 0-.7.1-.9 0-7-2.7-14.3-3.3-21.8-3.3zm-12.3-24.1c-.1.2-.1.4-.2.6-28.9-4.4-48-7.9-68.5 4-17 9.9-31.4 20.5-62 24.4-27.1 3.4-45.1 2.4-66.1-8-.3-.2-.6-.4-1-.6 0-.2.1-.3.1-.5 24.9 3.8 36.4 5.1 55.5-5.8 22.3-12.9 40.1-26.6 71.3-31 29.6-4.1 51.3 2.5 70.9 16.9zM268.6 97.3c-.6-.6-1.1-1.2-2.1-2.3 7.6 0 29.7-1.2 53.4 8.4 19.7 8 32.2 21 50.2 32.9 11.1 7.3 23.4 9.3 36.4 8.1 4.3-.4 8.5-1.2 12.8-1.7.4-.1.9 0 1.5.3-.6.4-1.2.9-1.8 1.2-8.1 4-16.7 6.3-25.6 7.1-26.1 2.6-50.3-3.7-73.4-15.4-19.3-9.9-36.4-22.9-51.4-38.6zM640 335.7c-3.5 3.1-22.7 11.6-42.7 5.3-12.3-3.9-19.5-14.9-31.6-24.1-10-7.6-20.9-7.9-28.1-8.4.6-.8.9-1.2 1.2-1.4 14.8-9.2 30.5-12.2 47.3-6.5 12.5 4.2 19.2 13.5 30.4 24.2 10.8 10.4 21 9.9 23.1 10.5.1-.1.2 0 .4.4zm-212.5 137c2.2 1.2 1.6 1.5 1.5 2-18.5-1.4-33.9-7.6-46.8-22.2-21.8-24.7-41.7-27.9-48.6-29.7.5-.2.8-.4 1.1-.4 13.1.1 26.1.7 38.9 3.9 25.3 6.4 35 25.4 41.6 35.3 3.2 4.8 7.3 8.3 12.3 11.1z"]
};
var faPhoenixSquadron = {
  prefix: 'fab',
  iconName: 'phoenix-squadron',
  icon: [512, 512, [], "f511", "M96 63.38C142.49 27.25 201.55 7.31 260.51 8.81c29.58-.38 59.11 5.37 86.91 15.33-24.13-4.63-49-6.34-73.38-2.45C231.17 27 191 48.84 162.21 80.87c5.67-1 10.78-3.67 16-5.86 18.14-7.87 37.49-13.26 57.23-14.83 19.74-2.13 39.64-.43 59.28 1.92-14.42 2.79-29.12 4.57-43 9.59-34.43 11.07-65.27 33.16-86.3 62.63-13.8 19.71-23.63 42.86-24.67 67.13-.35 16.49 5.22 34.81 19.83 44a53.27 53.27 0 0 0 37.52 6.74c15.45-2.46 30.07-8.64 43.6-16.33 11.52-6.82 22.67-14.55 32-24.25 3.79-3.22 2.53-8.45 2.62-12.79-2.12-.34-4.38-1.11-6.3.3a203 203 0 0 1-35.82 15.37c-20 6.17-42.16 8.46-62.1.78 12.79 1.73 26.06.31 37.74-5.44 20.23-9.72 36.81-25.2 54.44-38.77a526.57 526.57 0 0 1 88.9-55.31c25.71-12 52.94-22.78 81.57-24.12-15.63 13.72-32.15 26.52-46.78 41.38-14.51 14-27.46 29.5-40.11 45.18-3.52 4.6-8.95 6.94-13.58 10.16a150.7 150.7 0 0 0-51.89 60.1c-9.33 19.68-14.5 41.85-11.77 63.65 1.94 13.69 8.71 27.59 20.9 34.91 12.9 8 29.05 8.07 43.48 5.1 32.8-7.45 61.43-28.89 81-55.84 20.44-27.52 30.52-62.2 29.16-96.35-.52-7.5-1.57-15-1.66-22.49 8 19.48 14.82 39.71 16.65 60.83 2 14.28.75 28.76-1.62 42.9-1.91 11-5.67 21.51-7.78 32.43a165 165 0 0 0 39.34-81.07 183.64 183.64 0 0 0-14.21-104.64c20.78 32 32.34 69.58 35.71 107.48.49 12.73.49 25.51 0 38.23A243.21 243.21 0 0 1 482 371.34c-26.12 47.34-68 85.63-117.19 108-78.29 36.23-174.68 31.32-248-14.68A248.34 248.34 0 0 1 25.36 366 238.34 238.34 0 0 1 0 273.08v-31.34C3.93 172 40.87 105.82 96 63.38m222 80.33a79.13 79.13 0 0 0 16-4.48c5-1.77 9.24-5.94 10.32-11.22-8.96 4.99-17.98 9.92-26.32 15.7z"]
};
var faPhp = {
  prefix: 'fab',
  iconName: 'php',
  icon: [640, 512, [], "f457", "M320 104.5c171.4 0 303.2 72.2 303.2 151.5S491.3 407.5 320 407.5c-171.4 0-303.2-72.2-303.2-151.5S148.7 104.5 320 104.5m0-16.8C143.3 87.7 0 163 0 256s143.3 168.3 320 168.3S640 349 640 256 496.7 87.7 320 87.7zM218.2 242.5c-7.9 40.5-35.8 36.3-70.1 36.3l13.7-70.6c38 0 63.8-4.1 56.4 34.3zM97.4 350.3h36.7l8.7-44.8c41.1 0 66.6 3 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7h-70.7L97.4 350.3zm185.7-213.6h36.5l-8.7 44.8c31.5 0 60.7-2.3 74.8 10.7 14.8 13.6 7.7 31-8.3 113.1h-37c15.4-79.4 18.3-86 12.7-92-5.4-5.8-17.7-4.6-47.4-4.6l-18.8 96.6h-36.5l32.7-168.6zM505 242.5c-8 41.1-36.7 36.3-70.1 36.3l13.7-70.6c38.2 0 63.8-4.1 56.4 34.3zM384.2 350.3H421l8.7-44.8c43.2 0 67.1 2.5 90.2-19.1 26.1-24 32.9-66.7 14.3-88.1-9.7-11.2-25.3-16.7-46.5-16.7H417l-32.8 168.7z"]
};
var faPiedPiper = {
  prefix: 'fab',
  iconName: 'pied-piper',
  icon: [480, 512, [], "f2ae", "M455.93,23.2C429.23,30,387.79,51.69,341.35,90.66A206,206,0,0,0,240,64C125.13,64,32,157.12,32,272s93.13,208,208,208,208-93.13,208-208a207.25,207.25,0,0,0-58.75-144.81,155.35,155.35,0,0,0-17,27.4A176.16,176.16,0,0,1,417.1,272c0,97.66-79.44,177.11-177.09,177.11a175.81,175.81,0,0,1-87.63-23.4c82.94-107.33,150.79-37.77,184.31-226.65,5.79-32.62,28-94.26,126.23-160.18C471,33.45,465.35,20.8,455.93,23.2ZM125,406.4A176.66,176.66,0,0,1,62.9,272C62.9,174.34,142.35,94.9,240,94.9a174,174,0,0,1,76.63,17.75C250.64,174.76,189.77,265.52,125,406.4Z"]
};
var faPiedPiperAlt = {
  prefix: 'fab',
  iconName: 'pied-piper-alt',
  icon: [576, 512, [], "f1a8", "M244 246c-3.2-2-6.3-2.9-10.1-2.9-6.6 0-12.6 3.2-19.3 3.7l1.7 4.9zm135.9 197.9c-19 0-64.1 9.5-79.9 19.8l6.9 45.1c35.7 6.1 70.1 3.6 106-9.8-4.8-10-23.5-55.1-33-55.1zM340.8 177c6.6 2.8 11.5 9.2 22.7 22.1 2-1.4 7.5-5.2 7.5-8.6 0-4.9-11.8-13.2-13.2-23 11.2-5.7 25.2-6 37.6-8.9 68.1-16.4 116.3-52.9 146.8-116.7C548.3 29.3 554 16.1 554.6 2l-2 2.6c-28.4 50-33 63.2-81.3 100-31.9 24.4-69.2 40.2-106.6 54.6l-6.3-.3v-21.8c-19.6 1.6-19.7-14.6-31.6-23-18.7 20.6-31.6 40.8-58.9 51.1-12.7 4.8-19.6 10-25.9 21.8 34.9-16.4 91.2-13.5 98.8-10zM555.5 0l-.6 1.1-.3.9.6-.6zm-59.2 382.1c-33.9-56.9-75.3-118.4-150-115.5l-.3-6c-1.1-13.5 32.8 3.2 35.1-31l-14.4 7.2c-19.8-45.7-8.6-54.3-65.5-54.3-14.7 0-26.7 1.7-41.4 4.6 2.9 18.6 2.2 36.7-10.9 50.3l19.5 5.5c-1.7 3.2-2.9 6.3-2.9 9.8 0 21 42.8 2.9 42.8 33.6 0 18.4-36.8 60.1-54.9 60.1-8 0-53.7-50-53.4-60.1l.3-4.6 52.3-11.5c13-2.6 12.3-22.7-2.9-22.7-3.7 0-43.1 9.2-49.4 10.6-2-5.2-7.5-14.1-13.8-14.1-3.2 0-6.3 3.2-9.5 4-9.2 2.6-31 2.9-21.5 20.1L15.9 298.5c-5.5 1.1-8.9 6.3-8.9 11.8 0 6 5.5 10.9 11.5 10.9 8 0 131.3-28.4 147.4-32.2 2.6 3.2 4.6 6.3 7.8 8.6 20.1 14.4 59.8 85.9 76.4 85.9 24.1 0 58-22.4 71.3-41.9 3.2-4.3 6.9-7.5 12.4-6.9.6 13.8-31.6 34.2-33 43.7-1.4 10.2-1 35.2-.3 41.1 26.7 8.1 52-3.6 77.9-2.9 4.3-21 10.6-41.9 9.8-63.5l-.3-9.5c-1.4-34.2-10.9-38.5-34.8-58.6-1.1-1.1-2.6-2.6-3.7-4 2.2-1.4 1.1-1 4.6-1.7 88.5 0 56.3 183.6 111.5 229.9 33.1-15 72.5-27.9 103.5-47.2-29-25.6-52.6-45.7-72.7-79.9zm-196.2 46.1v27.2l11.8-3.4-2.9-23.8zm-68.7-150.4l24.1 61.2 21-13.8-31.3-50.9zm84.4 154.9l2 12.4c9-1.5 58.4-6.6 58.4-14.1 0-1.4-.6-3.2-.9-4.6-26.8 0-36.9 3.8-59.5 6.3z"]
};
var faPiedPiperHat = {
  prefix: 'fab',
  iconName: 'pied-piper-hat',
  icon: [640, 512, [], "f4e5", "M640 24.9c-80.8 53.6-89.4 92.5-96.4 104.4-6.7 12.2-11.7 60.3-23.3 83.6-11.7 23.6-54.2 42.2-66.1 50-11.7 7.8-28.3 38.1-41.9 64.2-108.1-4.4-167.4 38.8-259.2 93.6 29.4-9.7 43.3-16.7 43.3-16.7 94.2-36 139.3-68.3 281.1-49.2 1.1 0 1.9.6 2.8.8 3.9 2.2 5.3 6.9 3.1 10.8l-53.9 95.8c-2.5 4.7-7.8 7.2-13.1 6.1-126.8-23.8-226.9 17.3-318.9 18.6C24.1 488 0 453.4 0 451.8c0-1.1.6-1.7 1.7-1.7 0 0 38.3 0 103.1-15.3C178.4 294.5 244 245.4 315.4 245.4c0 0 71.7 0 90.6 61.9 22.8-39.7 28.3-49.2 28.3-49.2 5.3-9.4 35-77.2 86.4-141.4 51.5-64 90.4-79.9 119.3-91.8z"]
};
var faPiedPiperPp = {
  prefix: 'fab',
  iconName: 'pied-piper-pp',
  icon: [448, 512, [], "f1a7", "M205.3 174.6c0 21.1-14.2 38.1-31.7 38.1-7.1 0-12.8-1.2-17.2-3.7v-68c4.4-2.7 10.1-4.2 17.2-4.2 17.5 0 31.7 16.9 31.7 37.8zm52.6 67c-7.1 0-12.8 1.5-17.2 4.2v68c4.4 2.5 10.1 3.7 17.2 3.7 17.4 0 31.7-16.9 31.7-37.8 0-21.1-14.3-38.1-31.7-38.1zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zM185 255.1c41 0 74.2-35.6 74.2-79.6 0-44-33.2-79.6-74.2-79.6-12 0-24.1 3.2-34.6 8.8h-45.7V311l51.8-10.1v-50.6c8.6 3.1 18.1 4.8 28.5 4.8zm158.4 25.3c0-44-33.2-79.6-73.9-79.6-3.2 0-6.4.2-9.6.7-3.7 12.5-10.1 23.8-19.2 33.4-13.8 15-32.2 23.8-51.8 24.8V416l51.8-10.1v-50.6c8.6 3.2 18.2 4.7 28.7 4.7 40.8 0 74-35.6 74-79.6z"]
};
var faPiedPiperSquare = {
  prefix: 'fab',
  iconName: 'pied-piper-square',
  icon: [448, 512, [], "f91e", "M32 419L0 479.2l.8-328C.8 85.3 54 32 120 32h327.2c-93 28.9-189.9 94.2-253.9 168.6C122.7 282 82.6 338 32 419M448 32S305.2 98.8 261.6 199.1c-23.2 53.6-28.9 118.1-71 158.6-28.9 27.8-69.8 38.2-105.3 56.3-23.2 12-66.4 40.5-84.9 66h328.4c66 0 119.3-53.3 119.3-119.2-.1 0-.1-328.8-.1-328.8z"]
};
var faPinterest = {
  prefix: 'fab',
  iconName: 'pinterest',
  icon: [496, 512, [], "f0d2", "M496 256c0 137-111 248-248 248-25.6 0-50.2-3.9-73.4-11.1 10.1-16.5 25.2-43.5 30.8-65 3-11.6 15.4-59 15.4-59 8.1 15.4 31.7 28.5 56.8 28.5 74.8 0 128.7-68.8 128.7-154.3 0-81.9-66.9-143.2-152.9-143.2-107 0-163.9 71.8-163.9 150.1 0 36.4 19.4 81.7 50.3 96.1 4.7 2.2 7.2 1.2 8.3-3.3.8-3.4 5-20.3 6.9-28.1.6-2.5.3-4.7-1.7-7.1-10.1-12.5-18.3-35.3-18.3-56.6 0-54.7 41.4-107.6 112-107.6 60.9 0 103.6 41.5 103.6 100.9 0 67.1-33.9 113.6-78 113.6-24.3 0-42.6-20.1-36.7-44.8 7-29.5 20.5-61.3 20.5-82.6 0-19-10.2-34.9-31.4-34.9-24.9 0-44.9 25.7-44.9 60.2 0 22 7.4 36.8 7.4 36.8s-24.5 103.8-29 123.2c-5 21.4-3 51.6-.9 71.2C65.4 450.9 0 361.1 0 256 0 119 111 8 248 8s248 111 248 248z"]
};
var faPinterestP = {
  prefix: 'fab',
  iconName: 'pinterest-p',
  icon: [384, 512, [], "f231", "M204 6.5C101.4 6.5 0 74.9 0 185.6 0 256 39.6 296 63.6 296c9.9 0 15.6-27.6 15.6-35.4 0-9.3-23.7-29.1-23.7-67.8 0-80.4 61.2-137.4 140.4-137.4 68.1 0 118.5 38.7 118.5 109.8 0 53.1-21.3 152.7-90.3 152.7-24.9 0-46.2-18-46.2-43.8 0-37.8 26.4-74.4 26.4-113.4 0-66.2-93.9-54.2-93.9 25.8 0 16.8 2.1 35.4 9.6 50.7-13.8 59.4-42 147.9-42 209.1 0 18.9 2.7 37.5 4.5 56.4 3.4 3.8 1.7 3.4 6.9 1.5 50.4-69 48.6-82.5 71.4-172.8 12.3 23.4 44.1 36 69.3 36 106.2 0 153.9-103.5 153.9-196.8C384 71.3 298.2 6.5 204 6.5z"]
};
var faPinterestSquare = {
  prefix: 'fab',
  iconName: 'pinterest-square',
  icon: [448, 512, [], "f0d3", "M448 80v352c0 26.5-21.5 48-48 48H154.4c9.8-16.4 22.4-40 27.4-59.3 3-11.5 15.3-58.4 15.3-58.4 8 15.3 31.4 28.2 56.3 28.2 74.1 0 127.4-68.1 127.4-152.7 0-81.1-66.2-141.8-151.4-141.8-106 0-162.2 71.1-162.2 148.6 0 36 19.2 80.8 49.8 95.1 4.7 2.2 7.1 1.2 8.2-3.3.8-3.4 5-20.1 6.8-27.8.6-2.5.3-4.6-1.7-7-10.1-12.3-18.3-34.9-18.3-56 0-54.2 41-106.6 110.9-106.6 60.3 0 102.6 41.1 102.6 99.9 0 66.4-33.5 112.4-77.2 112.4-24.1 0-42.1-19.9-36.4-44.4 6.9-29.2 20.3-60.7 20.3-81.8 0-53-75.5-45.7-75.5 25 0 21.7 7.3 36.5 7.3 36.5-31.4 132.8-36.1 134.5-29.6 192.6l2.2.8H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48z"]
};
var faPlaystation = {
  prefix: 'fab',
  iconName: 'playstation',
  icon: [576, 512, [], "f3df", "M570.9 372.3c-11.3 14.2-38.8 24.3-38.8 24.3L327 470.2v-54.3l150.9-53.8c17.1-6.1 19.8-14.8 5.8-19.4-13.9-4.6-39.1-3.3-56.2 2.9L327 381.1v-56.4c23.2-7.8 47.1-13.6 75.7-16.8 40.9-4.5 90.9.6 130.2 15.5 44.2 14 49.2 34.7 38 48.9zm-224.4-92.5v-139c0-16.3-3-31.3-18.3-35.6-11.7-3.8-19 7.1-19 23.4v347.9l-93.8-29.8V32c39.9 7.4 98 24.9 129.2 35.4C424.1 94.7 451 128.7 451 205.2c0 74.5-46 102.8-104.5 74.6zM43.2 410.2c-45.4-12.8-53-39.5-32.3-54.8 19.1-14.2 51.7-24.9 51.7-24.9l134.5-47.8v54.5l-96.8 34.6c-17.1 6.1-19.7 14.8-5.8 19.4 13.9 4.6 39.1 3.3 56.2-2.9l46.4-16.9v48.8c-51.6 9.3-101.4 7.3-153.9-10z"]
};
var faProductHunt = {
  prefix: 'fab',
  iconName: 'product-hunt',
  icon: [512, 512, [], "f288", "M326.3 218.8c0 20.5-16.7 37.2-37.2 37.2h-70.3v-74.4h70.3c20.5 0 37.2 16.7 37.2 37.2zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-128.1-37.2c0-47.9-38.9-86.8-86.8-86.8H169.2v248h49.6v-74.4h70.3c47.9 0 86.8-38.9 86.8-86.8z"]
};
var faPushed = {
  prefix: 'fab',
  iconName: 'pushed',
  icon: [432, 512, [], "f3e1", "M407 111.9l-98.5-9 14-33.4c10.4-23.5-10.8-40.4-28.7-37L22.5 76.9c-15.1 2.7-26 18.3-21.4 36.6l105.1 348.3c6.5 21.3 36.7 24.2 47.7 7l35.3-80.8 235.2-231.3c16.4-16.8 4.3-42.9-17.4-44.8zM297.6 53.6c5.1-.7 7.5 2.5 5.2 7.4L286 100.9 108.6 84.6l189-31zM22.7 107.9c-3.1-5.1 1-10 6.1-9.1l248.7 22.7-96.9 230.7L22.7 107.9zM136 456.4c-2.6 4-7.9 3.1-9.4-1.2L43.5 179.7l127.7 197.6c-7 15-35.2 79.1-35.2 79.1zm272.8-314.5L210.1 337.3l89.7-213.7 106.4 9.7c4 1.1 5.7 5.3 2.6 8.6z"]
};
var faPython = {
  prefix: 'fab',
  iconName: 'python',
  icon: [448, 512, [], "f3e2", "M439.8 200.5c-7.7-30.9-22.3-54.2-53.4-54.2h-40.1v47.4c0 36.8-31.2 67.8-66.8 67.8H172.7c-29.2 0-53.4 25-53.4 54.3v101.8c0 29 25.2 46 53.4 54.3 33.8 9.9 66.3 11.7 106.8 0 26.9-7.8 53.4-23.5 53.4-54.3v-40.7H226.2v-13.6h160.2c31.1 0 42.6-21.7 53.4-54.2 11.2-33.5 10.7-65.7 0-108.6zM286.2 404c11.1 0 20.1 9.1 20.1 20.3 0 11.3-9 20.4-20.1 20.4-11 0-20.1-9.2-20.1-20.4.1-11.3 9.1-20.3 20.1-20.3zM167.8 248.1h106.8c29.7 0 53.4-24.5 53.4-54.3V91.9c0-29-24.4-50.7-53.4-55.6-35.8-5.9-74.7-5.6-106.8.1-45.2 8-53.4 24.7-53.4 55.6v40.7h106.9v13.6h-147c-31.1 0-58.3 18.7-66.8 54.2-9.8 40.7-10.2 66.1 0 108.6 7.6 31.6 25.7 54.2 56.8 54.2H101v-48.8c0-35.3 30.5-66.4 66.8-66.4zm-6.7-142.6c-11.1 0-20.1-9.1-20.1-20.3.1-11.3 9-20.4 20.1-20.4 11 0 20.1 9.2 20.1 20.4s-9 20.3-20.1 20.3z"]
};
var faQq = {
  prefix: 'fab',
  iconName: 'qq',
  icon: [448, 512, [], "f1d6", "M433.754 420.445c-11.526 1.393-44.86-52.741-44.86-52.741 0 31.345-16.136 72.247-51.051 101.786 16.842 5.192 54.843 19.167 45.803 34.421-7.316 12.343-125.51 7.881-159.632 4.037-34.122 3.844-152.316 8.306-159.632-4.037-9.045-15.25 28.918-29.214 45.783-34.415-34.92-29.539-51.059-70.445-51.059-101.792 0 0-33.334 54.134-44.859 52.741-5.37-.65-12.424-29.644 9.347-99.704 10.261-33.024 21.995-60.478 40.144-105.779C60.683 98.063 108.982.006 224 0c113.737.006 163.156 96.133 160.264 214.963 18.118 45.223 29.912 72.85 40.144 105.778 21.768 70.06 14.716 99.053 9.346 99.704z"]
};
var faQuinscape = {
  prefix: 'fab',
  iconName: 'quinscape',
  icon: [512, 512, [], "f459", "M313.6 474.6h-1a158.1 158.1 0 0 1 0-316.2c94.9 0 168.2 83.1 157 176.6 4 5.1 8.2 9.6 11.2 15.3 13.4-30.3 20.3-62.4 20.3-97.7C501.1 117.5 391.6 8 256.5 8S12 117.5 12 252.6s109.5 244.6 244.5 244.6a237.36 237.36 0 0 0 70.4-10.1c-5.2-3.5-8.9-8.1-13.3-12.5zm-.1-.1l.4.1zm78.4-168.9a99.2 99.2 0 1 0 99.2 99.2 99.18 99.18 0 0 0-99.2-99.2z"]
};
var faQuora = {
  prefix: 'fab',
  iconName: 'quora',
  icon: [448, 512, [], "f2c4", "M440.5 386.7h-29.3c-1.5 13.5-10.5 30.8-33 30.8-20.5 0-35.3-14.2-49.5-35.8 44.2-34.2 74.7-87.5 74.7-153C403.5 111.2 306.8 32 205 32 105.3 32 7.3 111.7 7.3 228.7c0 134.1 131.3 221.6 249 189C276 451.3 302 480 351.5 480c81.8 0 90.8-75.3 89-93.3zM297 329.2C277.5 300 253.3 277 205.5 277c-30.5 0-54.3 10-69 22.8l12.2 24.3c6.2-3 13-4 19.8-4 35.5 0 53.7 30.8 69.2 61.3-10 3-20.7 4.2-32.7 4.2-75 0-107.5-53-107.5-156.7C97.5 124.5 130 71 205 71c76.2 0 108.7 53.5 108.7 157.7.1 41.8-5.4 75.6-16.7 100.5z"]
};
var faRProject = {
  prefix: 'fab',
  iconName: 'r-project',
  icon: [581, 512, [], "f4f7", "M581 226.6C581 119.1 450.9 32 290.5 32S0 119.1 0 226.6C0 322.4 103.3 402 239.4 418.1V480h99.1v-61.5c24.3-2.7 47.6-7.4 69.4-13.9L448 480h112l-67.4-113.7c54.5-35.4 88.4-84.9 88.4-139.7zm-466.8 14.5c0-73.5 98.9-133 220.8-133s211.9 40.7 211.9 133c0 50.1-26.5 85-70.3 106.4-2.4-1.6-4.7-2.9-6.4-3.7-10.2-5.2-27.8-10.5-27.8-10.5s86.6-6.4 86.6-92.7-90.6-87.9-90.6-87.9h-199V361c-74.1-21.5-125.2-67.1-125.2-119.9zm225.1 38.3v-55.6c57.8 0 87.8-6.8 87.8 27.3 0 36.5-38.2 28.3-87.8 28.3zm-.9 72.5H365c10.8 0 18.9 11.7 24 19.2-16.1 1.9-33 2.8-50.6 2.9v-22.1z"]
};
var faRaspberryPi = {
  prefix: 'fab',
  iconName: 'raspberry-pi',
  icon: [407, 512, [], "f7bb", "M372 232.5l-3.7-6.5c.1-46.4-21.4-65.3-46.5-79.7 7.6-2 15.4-3.6 17.6-13.2 13.1-3.3 15.8-9.4 17.1-15.8 3.4-2.3 14.8-8.7 13.6-19.7 6.4-4.4 10-10.1 8.1-18.1 6.9-7.5 8.7-13.7 5.8-19.4 8.3-10.3 4.6-15.6 1.1-20.9 6.2-11.2.7-23.2-16.6-21.2-6.9-10.1-21.9-7.8-24.2-7.8-2.6-3.2-6-6-16.5-4.7-6.8-6.1-14.4-5-22.3-2.1-9.3-7.3-15.5-1.4-22.6.8C271.6.6 269 5.5 263.5 7.6c-12.3-2.6-16.1 3-22 8.9l-6.9-.1c-18.6 10.8-27.8 32.8-31.1 44.1-3.3-11.3-12.5-33.3-31.1-44.1l-6.9.1c-5.9-5.9-9.7-11.5-22-8.9-5.6-2-8.1-7-19.4-3.4-4.6-1.4-8.9-4.4-13.9-4.3-2.6.1-5.5 1-8.7 3.5-7.9-3-15.5-4-22.3 2.1-10.5-1.3-14 1.4-16.5 4.7-2.3 0-17.3-2.3-24.2 7.8C21.2 16 15.8 28 22 39.2c-3.5 5.4-7.2 10.7 1.1 20.9-2.9 5.7-1.1 11.9 5.8 19.4-1.8 8 1.8 13.7 8.1 18.1-1.2 11 10.2 17.4 13.6 19.7 1.3 6.4 4 12.4 17.1 15.8 2.2 9.5 10 11.2 17.6 13.2-25.1 14.4-46.6 33.3-46.5 79.7l-3.7 6.5c-28.8 17.2-54.7 72.7-14.2 117.7 2.6 14.1 7.1 24.2 11 35.4 5.9 45.2 44.5 66.3 54.6 68.8 14.9 11.2 30.8 21.8 52.2 29.2C159 504.2 181 512 203 512h1c22.1 0 44-7.8 64.2-28.4 21.5-7.4 37.3-18 52.2-29.2 10.2-2.5 48.7-23.6 54.6-68.8 3.9-11.2 8.4-21.3 11-35.4 40.6-45.1 14.7-100.5-14-117.7zm-22.2-8c-1.5 18.7-98.9-65.1-82.1-67.9 45.7-7.5 83.6 19.2 82.1 67.9zm-43 93.1c-24.5 15.8-59.8 5.6-78.8-22.8s-14.6-64.2 9.9-80c24.5-15.8 59.8-5.6 78.8 22.8s14.6 64.2-9.9 80zM238.9 29.3c.8 4.2 1.8 6.8 2.9 7.6 5.4-5.8 9.8-11.7 16.8-17.3 0 3.3-1.7 6.8 2.5 9.4 3.7-5 8.8-9.5 15.5-13.3-3.2 5.6-.6 7.3 1.2 9.6 5.1-4.4 10-8.8 19.4-12.3-2.6 3.1-6.2 6.2-2.4 9.8 5.3-3.3 10.6-6.6 23.1-8.9-2.8 3.1-8.7 6.3-5.1 9.4 6.6-2.5 14-4.4 22.1-5.4-3.9 3.2-7.1 6.3-3.9 8.8 7.1-2.2 16.9-5.1 26.4-2.6l-6 6.1c-.7.8 14.1.6 23.9.8-3.6 5-7.2 9.7-9.3 18.2 1 1 5.8.4 10.4 0-4.7 9.9-12.8 12.3-14.7 16.6 2.9 2.2 6.8 1.6 11.2.1-3.4 6.9-10.4 11.7-16 17.3 1.4 1 3.9 1.6 9.7.9-5.2 5.5-11.4 10.5-18.8 15 1.3 1.5 5.8 1.5 10 1.6-6.7 6.5-15.3 9.9-23.4 14.2 4 2.7 6.9 2.1 10 2.1-5.7 4.7-15.4 7.1-24.4 10 1.7 2.7 3.4 3.4 7.1 4.1-9.5 5.3-23.2 2.9-27 5.6.9 2.7 3.6 4.4 6.7 5.8-15.4.9-57.3-.6-65.4-32.3 15.7-17.3 44.4-37.5 93.7-62.6-38.4 12.8-73 30-102 53.5-34.3-15.9-10.8-55.9 5.8-71.8zm-34.4 114.6c24.2-.3 54.1 17.8 54 34.7-.1 15-21 27.1-53.8 26.9-32.1-.4-53.7-15.2-53.6-29.8 0-11.9 26.2-32.5 53.4-31.8zm-123-12.8c3.7-.7 5.4-1.5 7.1-4.1-9-2.8-18.7-5.3-24.4-10 3.1 0 6 .7 10-2.1-8.1-4.3-16.7-7.7-23.4-14.2 4.2-.1 8.7 0 10-1.6-7.4-4.5-13.6-9.5-18.8-15 5.8.7 8.3.1 9.7-.9-5.6-5.6-12.7-10.4-16-17.3 4.3 1.5 8.3 2 11.2-.1-1.9-4.2-10-6.7-14.7-16.6 4.6.4 9.4 1 10.4 0-2.1-8.5-5.8-13.3-9.3-18.2 9.8-.1 24.6 0 23.9-.8l-6-6.1c9.5-2.5 19.3.4 26.4 2.6 3.2-2.5-.1-5.6-3.9-8.8 8.1 1.1 15.4 2.9 22.1 5.4 3.5-3.1-2.3-6.3-5.1-9.4 12.5 2.3 17.8 5.6 23.1 8.9 3.8-3.6.2-6.7-2.4-9.8 9.4 3.4 14.3 7.9 19.4 12.3 1.7-2.3 4.4-4 1.2-9.6 6.7 3.8 11.8 8.3 15.5 13.3 4.1-2.6 2.5-6.2 2.5-9.4 7 5.6 11.4 11.5 16.8 17.3 1.1-.8 2-3.4 2.9-7.6 16.6 15.9 40.1 55.9 6 71.8-29-23.5-63.6-40.7-102-53.5 49.3 25 78 45.3 93.7 62.6-8 31.8-50 33.2-65.4 32.3 3.1-1.4 5.8-3.2 6.7-5.8-4-2.8-17.6-.4-27.2-5.6zm60.1 24.1c16.8 2.8-80.6 86.5-82.1 67.9-1.5-48.7 36.5-75.5 82.1-67.9zM38.2 342c-23.7-18.8-31.3-73.7 12.6-98.3 26.5-7 9 107.8-12.6 98.3zm91 98.2c-13.3 7.9-45.8 4.7-68.8-27.9-15.5-27.4-13.5-55.2-2.6-63.4 16.3-9.8 41.5 3.4 60.9 25.6 16.9 20 24.6 55.3 10.5 65.7zm-26.4-119.7c-24.5-15.8-28.9-51.6-9.9-80s54.3-38.6 78.8-22.8 28.9 51.6 9.9 80c-19.1 28.4-54.4 38.6-78.8 22.8zM205 496c-29.4 1.2-58.2-23.7-57.8-32.3-.4-12.7 35.8-22.6 59.3-22 23.7-1 55.6 7.5 55.7 18.9.5 11-28.8 35.9-57.2 35.4zm58.9-124.9c.2 29.7-26.2 53.8-58.8 54-32.6.2-59.2-23.8-59.4-53.4v-.6c-.2-29.7 26.2-53.8 58.8-54 32.6-.2 59.2 23.8 59.4 53.4v.6zm82.2 42.7c-25.3 34.6-59.6 35.9-72.3 26.3-13.3-12.4-3.2-50.9 15.1-72 20.9-23.3 43.3-38.5 58.9-26.6 10.5 10.3 16.7 49.1-1.7 72.3zm22.9-73.2c-21.5 9.4-39-105.3-12.6-98.3 43.9 24.7 36.3 79.6 12.6 98.3z"]
};
var faRavelry = {
  prefix: 'fab',
  iconName: 'ravelry',
  icon: [512, 512, [], "f2d9", "M407.4 61.5C331.6 22.1 257.8 31 182.9 66c-11.3 5.2-15.5 10.6-19.9 19-10.3 19.2-16.2 37.4-19.9 52.7-21.2 25.6-36.4 56.1-43.3 89.9-10.6 18-20.9 41.4-23.1 71.4 0 0-.7 7.6-.5 7.9-35.3-4.6-76.2-27-76.2-27 9.1 14.5 61.3 32.3 76.3 37.9 0 0 1.7 98 64.5 131.2-11.3-17.2-13.3-20.2-13.3-20.2S94.8 369 100.4 324.7c.7 0 1.5.2 2.2.2 23.9 87.4 103.2 151.4 196.9 151.4 6.2 0 12.1-.2 18-.7 14 1.5 27.6.5 40.1-3.9 6.9-2.2 13.8-6.4 20.2-10.8 70.2-39.1 100.9-82 123.1-147.7 5.4-16 8.1-35.5 9.8-52.2 8.7-82.3-30.6-161.6-103.3-199.5zM138.8 163.2s-1.2 12.3-.7 19.7c-3.4 2.5-10.1 8.1-18.2 16.7 5.2-12.8 11.3-25.1 18.9-36.4zm-31.2 121.9c4.4-17.2 13.3-39.1 29.8-55.1 0 0 1.7 48 15.8 90.1l-41.4-6.9c-2.2-9.2-3.5-18.5-4.2-28.1zm7.9 42.8c14.8 3.2 34 7.6 43.1 9.1 27.3 76.8 108.3 124.3 108.3 124.3 1 .5 1.7.7 2.7 1-73.1-11.6-132.7-64.7-154.1-134.4zM386 444.1c-14.5 4.7-36.2 8.4-64.7 3.7 0 0-91.1-23.1-127.5-107.8 38.2.7 52.4-.2 78-3.9 39.4-5.7 79-16.2 115-33 11.8-5.4 11.1-19.4 9.6-29.8-2-12.8-11.1-12.1-21.4-4.7 0 0-82 58.6-189.8 53.7-18.7-32-26.8-110.8-26.8-110.8 41.4-35.2 83.2-59.6 168.4-52.4.2-6.4 3-27.1-20.4-28.1 0 0-93.5-11.1-146 33.5 2.5-16.5 5.9-29.3 11.1-39.4 34.2-30.8 79-49.5 128.3-49.5 106.4 0 193 87.1 193 194.5-.2 76-43.8 142-106.8 174z"]
};
var faReact = {
  prefix: 'fab',
  iconName: 'react',
  icon: [512, 512, [], "f41b", "M418.2 177.2c-5.4-1.8-10.8-3.5-16.2-5.1.9-3.7 1.7-7.4 2.5-11.1 12.3-59.6 4.2-107.5-23.1-123.3-26.3-15.1-69.2.6-112.6 38.4-4.3 3.7-8.5 7.6-12.5 11.5-2.7-2.6-5.5-5.2-8.3-7.7-45.5-40.4-91.1-57.4-118.4-41.5-26.2 15.2-34 60.3-23 116.7 1.1 5.6 2.3 11.1 3.7 16.7-6.4 1.8-12.7 3.8-18.6 5.9C38.3 196.2 0 225.4 0 255.6c0 31.2 40.8 62.5 96.3 81.5 4.5 1.5 9 3 13.6 4.3-1.5 6-2.8 11.9-4 18-10.5 55.5-2.3 99.5 23.9 114.6 27 15.6 72.4-.4 116.6-39.1 3.5-3.1 7-6.3 10.5-9.7 4.4 4.3 9 8.4 13.6 12.4 42.8 36.8 85.1 51.7 111.2 36.6 27-15.6 35.8-62.9 24.4-120.5-.9-4.4-1.9-8.9-3-13.5 3.2-.9 6.3-1.9 9.4-2.9 57.7-19.1 99.5-50 99.5-81.7 0-30.3-39.4-59.7-93.8-78.4zM282.9 92.3c37.2-32.4 71.9-45.1 87.7-36 16.9 9.7 23.4 48.9 12.8 100.4-.7 3.4-1.4 6.7-2.3 10-22.2-5-44.7-8.6-67.3-10.6-13-18.6-27.2-36.4-42.6-53.1 3.9-3.7 7.7-7.2 11.7-10.7zM167.2 307.5c5.1 8.7 10.3 17.4 15.8 25.9-15.6-1.7-31.1-4.2-46.4-7.5 4.4-14.4 9.9-29.3 16.3-44.5 4.6 8.8 9.3 17.5 14.3 26.1zm-30.3-120.3c14.4-3.2 29.7-5.8 45.6-7.8-5.3 8.3-10.5 16.8-15.4 25.4-4.9 8.5-9.7 17.2-14.2 26-6.3-14.9-11.6-29.5-16-43.6zm27.4 68.9c6.6-13.8 13.8-27.3 21.4-40.6s15.8-26.2 24.4-38.9c15-1.1 30.3-1.7 45.9-1.7s31 .6 45.9 1.7c8.5 12.6 16.6 25.5 24.3 38.7s14.9 26.7 21.7 40.4c-6.7 13.8-13.9 27.4-21.6 40.8-7.6 13.3-15.7 26.2-24.2 39-14.9 1.1-30.4 1.6-46.1 1.6s-30.9-.5-45.6-1.4c-8.7-12.7-16.9-25.7-24.6-39s-14.8-26.8-21.5-40.6zm180.6 51.2c5.1-8.8 9.9-17.7 14.6-26.7 6.4 14.5 12 29.2 16.9 44.3-15.5 3.5-31.2 6.2-47 8 5.4-8.4 10.5-17 15.5-25.6zm14.4-76.5c-4.7-8.8-9.5-17.6-14.5-26.2-4.9-8.5-10-16.9-15.3-25.2 16.1 2 31.5 4.7 45.9 8-4.6 14.8-10 29.2-16.1 43.4zM256.2 118.3c10.5 11.4 20.4 23.4 29.6 35.8-19.8-.9-39.7-.9-59.5 0 9.8-12.9 19.9-24.9 29.9-35.8zM140.2 57c16.8-9.8 54.1 4.2 93.4 39 2.5 2.2 5 4.6 7.6 7-15.5 16.7-29.8 34.5-42.9 53.1-22.6 2-45 5.5-67.2 10.4-1.3-5.1-2.4-10.3-3.5-15.5-9.4-48.4-3.2-84.9 12.6-94zm-24.5 263.6c-4.2-1.2-8.3-2.5-12.4-3.9-21.3-6.7-45.5-17.3-63-31.2-10.1-7-16.9-17.8-18.8-29.9 0-18.3 31.6-41.7 77.2-57.6 5.7-2 11.5-3.8 17.3-5.5 6.8 21.7 15 43 24.5 63.6-9.6 20.9-17.9 42.5-24.8 64.5zm116.6 98c-16.5 15.1-35.6 27.1-56.4 35.3-11.1 5.3-23.9 5.8-35.3 1.3-15.9-9.2-22.5-44.5-13.5-92 1.1-5.6 2.3-11.2 3.7-16.7 22.4 4.8 45 8.1 67.9 9.8 13.2 18.7 27.7 36.6 43.2 53.4-3.2 3.1-6.4 6.1-9.6 8.9zm24.5-24.3c-10.2-11-20.4-23.2-30.3-36.3 9.6.4 19.5.6 29.5.6 10.3 0 20.4-.2 30.4-.7-9.2 12.7-19.1 24.8-29.6 36.4zm130.7 30c-.9 12.2-6.9 23.6-16.5 31.3-15.9 9.2-49.8-2.8-86.4-34.2-4.2-3.6-8.4-7.5-12.7-11.5 15.3-16.9 29.4-34.8 42.2-53.6 22.9-1.9 45.7-5.4 68.2-10.5 1 4.1 1.9 8.2 2.7 12.2 4.9 21.6 5.7 44.1 2.5 66.3zm18.2-107.5c-2.8.9-5.6 1.8-8.5 2.6-7-21.8-15.6-43.1-25.5-63.8 9.6-20.4 17.7-41.4 24.5-62.9 5.2 1.5 10.2 3.1 15 4.7 46.6 16 79.3 39.8 79.3 58 0 19.6-34.9 44.9-84.8 61.4zm-149.7-15c25.3 0 45.8-20.5 45.8-45.8s-20.5-45.8-45.8-45.8c-25.3 0-45.8 20.5-45.8 45.8s20.5 45.8 45.8 45.8z"]
};
var faReacteurope = {
  prefix: 'fab',
  iconName: 'reacteurope',
  icon: [576, 512, [], "f75d", "M250.6 211.74l5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3-7.1-.1-2.3-6.8-2.3 6.8-7.2.1 5.7 4.3zm63.7 0l5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3-7.2-.1-2.3-6.8-2.3 6.8-7.2.1 5.7 4.3zm-91.3 50.5h-3.4c-4.8 0-3.8 4-3.8 12.1 0 4.7-2.3 6.1-5.8 6.1s-5.8-1.4-5.8-6.1v-36.6c0-4.7 2.3-6.1 5.8-6.1s5.8 1.4 5.8 6.1c0 7.2-.7 10.5 3.8 10.5h3.4c4.7-.1 3.8-3.9 3.8-12.3 0-9.9-6.7-14.1-16.8-14.1h-.2c-10.1 0-16.8 4.2-16.8 14.1V276c0 10.4 6.7 14.1 16.8 14.1h.2c10.1 0 16.8-3.8 16.8-14.1 0-9.86 1.1-13.76-3.8-13.76zm-80.7 17.4h-14.7v-19.3H139c2.5 0 3.8-1.3 3.8-3.8v-2.1c0-2.5-1.3-3.8-3.8-3.8h-11.4v-18.3H142c2.5 0 3.8-1.3 3.8-3.8v-2.1c0-2.5-1.3-3.8-3.8-3.8h-21.7c-2.4-.1-3.7 1.3-3.7 3.8v59.1c0 2.5 1.3 3.8 3.8 3.8h21.9c2.5 0 3.8-1.3 3.8-3.8v-2.1c0-2.5-1.3-3.8-3.8-3.8zm-42-18.5c4.6-2 7.3-6 7.3-12.4v-11.9c0-10.1-6.7-14.1-16.8-14.1H77.4c-2.5 0-3.8 1.3-3.8 3.8v59.1c0 2.5 1.3 3.8 3.8 3.8h3.4c2.5 0 3.8-1.3 3.8-3.8v-22.9h5.6l7.4 23.5a4.1 4.1 0 0 0 4.3 3.2h3.3c2.8 0 4-1.8 3.2-4.4zm-3.8-14c0 4.8-2.5 6.1-6.1 6.1h-5.8v-20.9h5.8c3.6 0 6.1 1.3 6.1 6.1zM176 226a3.82 3.82 0 0 0-4.2-3.4h-6.9a3.68 3.68 0 0 0-4 3.4l-11 59.2c-.5 2.7.9 4.1 3.4 4.1h3a3.74 3.74 0 0 0 4.1-3.5l1.8-11.3h12.2l1.8 11.3a3.74 3.74 0 0 0 4.1 3.5h3.5c2.6 0 3.9-1.4 3.4-4.1zm-12.3 39.3l4.7-29.7 4.7 29.7zm89.3 20.2v-53.2h7.5c2.5 0 3.8-1.3 3.8-3.8v-2.1c0-2.5-1.3-3.8-3.8-3.8h-25.8c-2.5 0-3.8 1.3-3.8 3.8v2.1c0 2.5 1.3 3.8 3.8 3.8h7.3v53.2c0 2.5 1.3 3.8 3.8 3.8h3.4c2.5.04 3.8-1.3 3.8-3.76zm248-.8h-19.4V258h16.1a1.89 1.89 0 0 0 2-2v-.8a1.89 1.89 0 0 0-2-2h-16.1v-25.8h19.1a1.89 1.89 0 0 0 2-2v-.8a1.77 1.77 0 0 0-2-1.9h-22.2a1.62 1.62 0 0 0-2 1.8v63a1.81 1.81 0 0 0 2 1.9H501a1.81 1.81 0 0 0 2-1.9v-.8a1.84 1.84 0 0 0-2-1.96zm-93.1-62.9h-.8c-10.1 0-15.3 4.7-15.3 14.1V276c0 9.3 5.2 14.1 15.3 14.1h.8c10.1 0 15.3-4.8 15.3-14.1v-40.1c0-9.36-5.2-14.06-15.3-14.06zm10.2 52.4c-.1 8-3 11.1-10.5 11.1s-10.5-3.1-10.5-11.1v-36.6c0-7.9 3-11.1 10.5-11.1s10.5 3.2 10.5 11.1zm-46.5-14.5c6.1-1.6 9.2-6.1 9.2-13.3v-9.7c0-9.4-5.2-14.1-15.3-14.1h-13.7a1.81 1.81 0 0 0-2 1.9v63a1.81 1.81 0 0 0 2 1.9h1.2a1.74 1.74 0 0 0 1.9-1.9v-26.9h11.6l10.4 27.2a2.32 2.32 0 0 0 2.3 1.5h1.5c1.4 0 2-1 1.5-2.3zm-6.4-3.9H355v-28.5h10.2c7.5 0 10.5 3.1 10.5 11.1v6.4c0 7.84-3 11.04-10.5 11.04zm85.9-33.1h-13.7a1.62 1.62 0 0 0-2 1.8v63a1.81 1.81 0 0 0 2 1.9h1.2a1.74 1.74 0 0 0 1.9-1.9v-26.1h10.6c10.1 0 15.3-4.8 15.3-14.1v-10.5c0-9.4-5.2-14.1-15.3-14.1zm10.2 22.8c0 7.9-3 11.1-10.5 11.1h-10.2v-29.2h10.2c7.5-.1 10.5 3.1 10.5 11zM259.5 308l-2.3-6.8-2.3 6.8-7.1.1 5.7 4.3-2.1 6.8 5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3zm227.6-136.1a364.42 364.42 0 0 0-35.6-11.3c19.6-78 11.6-134.7-22.3-153.9C394.7-12.66 343.3 11 291 61.94q5.1 4.95 10.2 10.2c82.5-80 119.6-53.5 120.9-52.8 22.4 12.7 36 55.8 15.5 137.8a587.83 587.83 0 0 0-84.6-13C281.1 43.64 212.4 2 170.8 2 140 2 127 23 123.2 29.74c-18.1 32-13.3 84.2.1 133.8-70.5 20.3-120.7 54.1-120.3 95 .5 59.6 103.2 87.8 122.1 92.8-20.5 81.9-10.1 135.6 22.3 153.9 28 15.8 75.1 6 138.2-55.2q-5.1-4.95-10.2-10.2c-82.5 80-119.7 53.5-120.9 52.8-22.3-12.6-36-55.6-15.5-137.9 12.4 2.9 41.8 9.5 84.6 13 71.9 100.4 140.6 142 182.1 142 30.8 0 43.8-21 47.6-27.7 18-31.9 13.3-84.1-.1-133.8 152.3-43.8 156.2-130.2 33.9-176.3zM135.9 36.84c2.9-5.1 11.9-20.3 34.9-20.3 36.8 0 98.8 39.6 163.3 126.2a714 714 0 0 0-93.9.9 547.76 547.76 0 0 1 42.2-52.4Q277.3 86 272.2 81a598.25 598.25 0 0 0-50.7 64.2 569.69 569.69 0 0 0-84.4 14.6c-.2-1.4-24.3-82.2-1.2-123zm304.8 438.3c-2.9 5.1-11.8 20.3-34.9 20.3-36.7 0-98.7-39.4-163.3-126.2a695.38 695.38 0 0 0 93.9-.9 547.76 547.76 0 0 1-42.2 52.4q5.1 5.25 10.2 10.2a588.47 588.47 0 0 0 50.7-64.2c47.3-4.7 80.3-13.5 84.4-14.6 22.7 84.4 4.5 117 1.2 123zm9.1-138.6c-3.6-11.9-7.7-24.1-12.4-36.4a12.67 12.67 0 0 1-10.7-5.7l-.1.1a19.61 19.61 0 0 1-5.4 3.6c5.7 14.3 10.6 28.4 14.7 42.2a535.3 535.3 0 0 1-72 13c3.5-5.3 17.2-26.2 32.2-54.2a24.6 24.6 0 0 1-6-3.2c-1.1 1.2-3.6 4.2-10.9 4.2-6.2 11.2-17.4 30.9-33.9 55.2a711.91 711.91 0 0 1-112.4 1c-7.9-11.2-21.5-31.1-36.8-57.8a21 21 0 0 1-3-1.5c-1.9 1.6-3.9 3.2-12.6 3.2 6.3 11.2 17.5 30.7 33.8 54.6a548.81 548.81 0 0 1-72.2-11.7q5.85-21 14.1-42.9c-3.2 0-5.4.2-8.4-1a17.58 17.58 0 0 1-6.9 1c-4.9 13.4-9.1 26.5-12.7 39.4C-31.7 297-12.1 216 126.7 175.64c3.6 11.9 7.7 24.1 12.4 36.4 10.4 0 12.9 3.4 14.4 5.3a12 12 0 0 1 2.3-2.2c-5.8-14.7-10.9-29.2-15.2-43.3 7-1.8 32.4-8.4 72-13-15.9 24.3-26.7 43.9-32.8 55.3a14.22 14.22 0 0 1 6.4 8 23.42 23.42 0 0 1 10.2-8.4c6.5-11.7 17.9-31.9 34.8-56.9a711.72 711.72 0 0 1 112.4-1c31.5 44.6 28.9 48.1 42.5 64.5a21.42 21.42 0 0 1 10.4-7.4c-6.4-11.4-17.6-31-34.3-55.5 40.4 4.1 65 10 72.2 11.7-4 14.4-8.9 29.2-14.6 44.2a20.74 20.74 0 0 1 6.8 4.3l.1.1a12.72 12.72 0 0 1 8.9-5.6c4.9-13.4 9.2-26.6 12.8-39.5a359.71 359.71 0 0 1 34.5 11c106.1 39.9 74 87.9 72.6 90.4-19.8 35.1-80.1 55.2-105.7 62.5zm-114.4-114h-1.2a1.74 1.74 0 0 0-1.9 1.9v49.8c0 7.9-2.6 11.1-10.1 11.1s-10.1-3.1-10.1-11.1v-49.8a1.69 1.69 0 0 0-1.9-1.9H309a1.81 1.81 0 0 0-2 1.9v51.5c0 9.6 5 14.1 15.1 14.1h.4c10.1 0 15.1-4.6 15.1-14.1v-51.5a2 2 0 0 0-2.2-1.9zM321.7 308l-2.3-6.8-2.3 6.8-7.1.1 5.7 4.3-2.1 6.8 5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3zm-31.1 7.4l-2.3-6.8-2.3 6.8-7.1.1 5.7 4.3-2.1 6.8 5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3zm5.1-30.8h-19.4v-26.7h16.1a1.89 1.89 0 0 0 2-2v-.8a1.89 1.89 0 0 0-2-2h-16.1v-25.8h19.1a1.89 1.89 0 0 0 2-2v-.8a1.77 1.77 0 0 0-2-1.9h-22.2a1.81 1.81 0 0 0-2 1.9v63a1.81 1.81 0 0 0 2 1.9h22.5a1.77 1.77 0 0 0 2-1.9v-.8a1.83 1.83 0 0 0-2-2.06zm-7.4-99.4L286 192l-7.1.1 5.7 4.3-2.1 6.8 5.8-4.1 5.8 4.1-2.1-6.8 5.7-4.3-7.1-.1z"]
};
var faReadme = {
  prefix: 'fab',
  iconName: 'readme',
  icon: [576, 512, [], "f4d5", "M528.3 46.5H388.5c-48.1 0-89.9 33.3-100.4 80.3-10.6-47-52.3-80.3-100.4-80.3H48c-26.5 0-48 21.5-48 48v245.8c0 26.5 21.5 48 48 48h89.7c102.2 0 132.7 24.4 147.3 75 .7 2.8 5.2 2.8 6 0 14.7-50.6 45.2-75 147.3-75H528c26.5 0 48-21.5 48-48V94.6c0-26.4-21.3-47.9-47.7-48.1zM242 311.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5V289c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V251zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H78.2c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm259.3 121.7c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.9c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5V228c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5v22.9zm0-60.9c0 1.9-1.5 3.5-3.5 3.5H337.5c-1.9 0-3.5-1.5-3.5-3.5v-22.8c0-1.9 1.5-3.5 3.5-3.5h160.4c1.9 0 3.5 1.5 3.5 3.5V190z"]
};
var faRebel = {
  prefix: 'fab',
  iconName: 'rebel',
  icon: [512, 512, [], "f1d0", "M256.5 504C117.2 504 9 387.8 13.2 249.9 16 170.7 56.4 97.7 129.7 49.5c.3 0 1.9-.6 1.1.8-5.8 5.5-111.3 129.8-14.1 226.4 49.8 49.5 90 2.5 90 2.5 38.5-50.1-.6-125.9-.6-125.9-10-24.9-45.7-40.1-45.7-40.1l28.8-31.8c24.4 10.5 43.2 38.7 43.2 38.7.8-29.6-21.9-61.4-21.9-61.4L255.1 8l44.3 50.1c-20.5 28.8-21.9 62.6-21.9 62.6 13.8-23 43.5-39.3 43.5-39.3l28.5 31.8c-27.4 8.9-45.4 39.9-45.4 39.9-15.8 28.5-27.1 89.4.6 127.3 32.4 44.6 87.7-2.8 87.7-2.8 102.7-91.9-10.5-225-10.5-225-6.1-5.5.8-2.8.8-2.8 50.1 36.5 114.6 84.4 116.2 204.8C500.9 400.2 399 504 256.5 504z"]
};
var faRedRiver = {
  prefix: 'fab',
  iconName: 'red-river',
  icon: [448, 512, [], "f3e3", "M353.2 32H94.8C42.4 32 0 74.4 0 126.8v258.4C0 437.6 42.4 480 94.8 480h258.4c52.4 0 94.8-42.4 94.8-94.8V126.8c0-52.4-42.4-94.8-94.8-94.8zM144.9 200.9v56.3c0 27-21.9 48.9-48.9 48.9V151.9c0-13.2 10.7-23.9 23.9-23.9h154.2c0 27-21.9 48.9-48.9 48.9h-56.3c-12.3-.6-24.6 11.6-24 24zm176.3 72h-56.3c-12.3-.6-24.6 11.6-24 24v56.3c0 27-21.9 48.9-48.9 48.9V247.9c0-13.2 10.7-23.9 23.9-23.9h154.2c0 27-21.9 48.9-48.9 48.9z"]
};
var faReddit = {
  prefix: 'fab',
  iconName: 'reddit',
  icon: [512, 512, [], "f1a1", "M201.5 305.5c-13.8 0-24.9-11.1-24.9-24.6 0-13.8 11.1-24.9 24.9-24.9 13.6 0 24.6 11.1 24.6 24.9 0 13.6-11.1 24.6-24.6 24.6zM504 256c0 137-111 248-248 248S8 393 8 256 119 8 256 8s248 111 248 248zm-132.3-41.2c-9.4 0-17.7 3.9-23.8 10-22.4-15.5-52.6-25.5-86.1-26.6l17.4-78.3 55.4 12.5c0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.3 24.9-24.9s-11.1-24.9-24.9-24.9c-9.7 0-18 5.8-22.1 13.8l-61.2-13.6c-3-.8-6.1 1.4-6.9 4.4l-19.1 86.4c-33.2 1.4-63.1 11.3-85.5 26.8-6.1-6.4-14.7-10.2-24.1-10.2-34.9 0-46.3 46.9-14.4 62.8-1.1 5-1.7 10.2-1.7 15.5 0 52.6 59.2 95.2 132 95.2 73.1 0 132.3-42.6 132.3-95.2 0-5.3-.6-10.8-1.9-15.8 31.3-16 19.8-62.5-14.9-62.5zM302.8 331c-18.2 18.2-76.1 17.9-93.6 0-2.2-2.2-6.1-2.2-8.3 0-2.5 2.5-2.5 6.4 0 8.6 22.8 22.8 87.3 22.8 110.2 0 2.5-2.2 2.5-6.1 0-8.6-2.2-2.2-6.1-2.2-8.3 0zm7.7-75c-13.6 0-24.6 11.1-24.6 24.9 0 13.6 11.1 24.6 24.6 24.6 13.8 0 24.9-11.1 24.9-24.6 0-13.8-11-24.9-24.9-24.9z"]
};
var faRedditAlien = {
  prefix: 'fab',
  iconName: 'reddit-alien',
  icon: [512, 512, [], "f281", "M440.3 203.5c-15 0-28.2 6.2-37.9 15.9-35.7-24.7-83.8-40.6-137.1-42.3L293 52.3l88.2 19.8c0 21.6 17.6 39.2 39.2 39.2 22 0 39.7-18.1 39.7-39.7s-17.6-39.7-39.7-39.7c-15.4 0-28.7 9.3-35.3 22l-97.4-21.6c-4.9-1.3-9.7 2.2-11 7.1L246.3 177c-52.9 2.2-100.5 18.1-136.3 42.8-9.7-10.1-23.4-16.3-38.4-16.3-55.6 0-73.8 74.6-22.9 100.1-1.8 7.9-2.6 16.3-2.6 24.7 0 83.8 94.4 151.7 210.3 151.7 116.4 0 210.8-67.9 210.8-151.7 0-8.4-.9-17.2-3.1-25.1 49.9-25.6 31.5-99.7-23.8-99.7zM129.4 308.9c0-22 17.6-39.7 39.7-39.7 21.6 0 39.2 17.6 39.2 39.7 0 21.6-17.6 39.2-39.2 39.2-22 .1-39.7-17.6-39.7-39.2zm214.3 93.5c-36.4 36.4-139.1 36.4-175.5 0-4-3.5-4-9.7 0-13.7 3.5-3.5 9.7-3.5 13.2 0 27.8 28.5 120 29 149 0 3.5-3.5 9.7-3.5 13.2 0 4.1 4 4.1 10.2.1 13.7zm-.8-54.2c-21.6 0-39.2-17.6-39.2-39.2 0-22 17.6-39.7 39.2-39.7 22 0 39.7 17.6 39.7 39.7-.1 21.5-17.7 39.2-39.7 39.2z"]
};
var faRedditSquare = {
  prefix: 'fab',
  iconName: 'reddit-square',
  icon: [448, 512, [], "f1a2", "M283.2 345.5c2.7 2.7 2.7 6.8 0 9.2-24.5 24.5-93.8 24.6-118.4 0-2.7-2.4-2.7-6.5 0-9.2 2.4-2.4 6.5-2.4 8.9 0 18.7 19.2 81 19.6 100.5 0 2.4-2.3 6.6-2.3 9 0zm-91.3-53.8c0-14.9-11.9-26.8-26.5-26.8-14.9 0-26.8 11.9-26.8 26.8 0 14.6 11.9 26.5 26.8 26.5 14.6 0 26.5-11.9 26.5-26.5zm90.7-26.8c-14.6 0-26.5 11.9-26.5 26.8 0 14.6 11.9 26.5 26.5 26.5 14.9 0 26.8-11.9 26.8-26.5 0-14.9-11.9-26.8-26.8-26.8zM448 80v352c0 26.5-21.5 48-48 48H48c-26.5 0-48-21.5-48-48V80c0-26.5 21.5-48 48-48h352c26.5 0 48 21.5 48 48zm-99.7 140.6c-10.1 0-19 4.2-25.6 10.7-24.1-16.7-56.5-27.4-92.5-28.6l18.7-84.2 59.5 13.4c0 14.6 11.9 26.5 26.5 26.5 14.9 0 26.8-12.2 26.8-26.8 0-14.6-11.9-26.8-26.8-26.8-10.4 0-19.3 6.2-23.8 14.9l-65.7-14.6c-3.3-.9-6.5 1.5-7.4 4.8l-20.5 92.8c-35.7 1.5-67.8 12.2-91.9 28.9-6.5-6.8-15.8-11-25.9-11-37.5 0-49.8 50.4-15.5 67.5-1.2 5.4-1.8 11-1.8 16.7 0 56.5 63.7 102.3 141.9 102.3 78.5 0 142.2-45.8 142.2-102.3 0-5.7-.6-11.6-2.1-17 33.6-17.2 21.2-67.2-16.1-67.2z"]
};
var faRedhat = {
  prefix: 'fab',
  iconName: 'redhat',
  icon: [512, 512, [], "f7bc", "M341.52 285.56c33.65 0 82.34-6.94 82.34-47 .22-6.74.86-1.82-20.88-96.24-4.62-19.15-8.68-27.84-42.31-44.65-26.09-13.34-82.92-35.37-99.73-35.37-15.66 0-20.2 20.17-38.87 20.17-18 0-31.31-15.06-48.12-15.06-16.14 0-26.66 11-34.78 33.62-27.5 77.55-26.28 74.27-26.12 78.27 0 24.8 97.64 106.11 228.47 106.11M429 254.84c4.65 22 4.65 24.35 4.65 27.25 0 37.66-42.33 58.56-98 58.56-125.74.08-235.91-73.65-235.91-122.33a49.55 49.55 0 0 1 4.06-19.72C58.56 200.86 0 208.93 0 260.63c0 84.67 200.63 189 359.49 189 121.79 0 152.51-55.08 152.51-98.58 0-34.21-29.59-73.05-82.93-96.24"]
};
var faRenren = {
  prefix: 'fab',
  iconName: 'renren',
  icon: [512, 512, [], "f18b", "M214 169.1c0 110.4-61 205.4-147.6 247.4C30 373.2 8 317.7 8 256.6 8 133.9 97.1 32.2 214 12.5v156.6zM255 504c-42.9 0-83.3-11-118.5-30.4C193.7 437.5 239.9 382.9 255 319c15.5 63.9 61.7 118.5 118.8 154.7C338.7 493 298.3 504 255 504zm190.6-87.5C359 374.5 298 279.6 298 169.1V12.5c116.9 19.7 206 121.4 206 244.1 0 61.1-22 116.6-58.4 159.9z"]
};
var faReplyd = {
  prefix: 'fab',
  iconName: 'replyd',
  icon: [448, 512, [], "f3e6", "M320 480H128C57.6 480 0 422.4 0 352V160C0 89.6 57.6 32 128 32h192c70.4 0 128 57.6 128 128v192c0 70.4-57.6 128-128 128zM193.4 273.2c-6.1-2-11.6-3.1-16.4-3.1-7.2 0-13.5 1.9-18.9 5.6-5.4 3.7-9.6 9-12.8 15.8h-1.1l-4.2-18.3h-28v138.9h36.1v-89.7c1.5-5.4 4.4-9.8 8.7-13.2 4.3-3.4 9.8-5.1 16.2-5.1 4.6 0 9.8 1 15.6 3.1l4.8-34zm115.2 103.4c-3.2 2.4-7.7 4.8-13.7 7.1-6 2.3-12.8 3.5-20.4 3.5-12.2 0-21.1-3-26.5-8.9-5.5-5.9-8.5-14.7-9-26.4h83.3c.9-4.8 1.6-9.4 2.1-13.9.5-4.4.7-8.6.7-12.5 0-10.7-1.6-19.7-4.7-26.9-3.2-7.2-7.3-13-12.5-17.2-5.2-4.3-11.1-7.3-17.8-9.2-6.7-1.8-13.5-2.8-20.6-2.8-21.1 0-37.5 6.1-49.2 18.3s-17.5 30.5-17.5 55c0 22.8 5.2 40.7 15.6 53.7 10.4 13.1 26.8 19.6 49.2 19.6 10.7 0 20.9-1.5 30.4-4.6 9.5-3.1 17.1-6.8 22.6-11.2l-12-23.6zm-21.8-70.3c3.8 5.4 5.3 13.1 4.6 23.1h-51.7c.9-9.4 3.7-17 8.2-22.6 4.5-5.6 11.5-8.5 21-8.5 8.2-.1 14.1 2.6 17.9 8zm79.9 2.5c4.1 3.9 9.4 5.8 16.1 5.8 7 0 12.6-1.9 16.7-5.8s6.1-9.1 6.1-15.6-2-11.6-6.1-15.4c-4.1-3.8-9.6-5.7-16.7-5.7-6.7 0-12 1.9-16.1 5.7-4.1 3.8-6.1 8.9-6.1 15.4s2 11.7 6.1 15.6zm0 100.5c4.1 3.9 9.4 5.8 16.1 5.8 7 0 12.6-1.9 16.7-5.8s6.1-9.1 6.1-15.6-2-11.6-6.1-15.4c-4.1-3.8-9.6-5.7-16.7-5.7-6.7 0-12 1.9-16.1 5.7-4.1 3.8-6.1 8.9-6.1 15.4 0 6.6 2 11.7 6.1 15.6z"]
};
var faResearchgate = {
  prefix: 'fab',
  iconName: 'researchgate',
  icon: [448, 512, [], "f4f8", "M0 32v448h448V32H0zm262.2 334.4c-6.6 3-33.2 6-50-14.2-9.2-10.6-25.3-33.3-42.2-63.6-8.9 0-14.7 0-21.4-.6v46.4c0 23.5 6 21.2 25.8 23.9v8.1c-6.9-.3-23.1-.8-35.6-.8-13.1 0-26.1.6-33.6.8v-8.1c15.5-2.9 22-1.3 22-23.9V225c0-22.6-6.4-21-22-23.9V193c25.8 1 53.1-.6 70.9-.6 31.7 0 55.9 14.4 55.9 45.6 0 21.1-16.7 42.2-39.2 47.5 13.6 24.2 30 45.6 42.2 58.9 7.2 7.8 17.2 14.7 27.2 14.7v7.3zm22.9-135c-23.3 0-32.2-15.7-32.2-32.2V167c0-12.2 8.8-30.4 34-30.4s30.4 17.9 30.4 17.9l-10.7 7.2s-5.5-12.5-19.7-12.5c-7.9 0-19.7 7.3-19.7 19.7v26.8c0 13.4 6.6 23.3 17.9 23.3 14.1 0 21.5-10.9 21.5-26.8h-17.9v-10.7h30.4c0 20.5 4.7 49.9-34 49.9zm-116.5 44.7c-9.4 0-13.6-.3-20-.8v-69.7c6.4-.6 15-.6 22.5-.6 23.3 0 37.2 12.2 37.2 34.5 0 21.9-15 36.6-39.7 36.6z"]
};
var faResolving = {
  prefix: 'fab',
  iconName: 'resolving',
  icon: [496, 512, [], "f3e7", "M281.2 278.2c46-13.3 49.6-23.5 44-43.4L314 195.5c-6.1-20.9-18.4-28.1-71.1-12.8L54.7 236.8l28.6 98.6 197.9-57.2zM248.5 8C131.4 8 33.2 88.7 7.2 197.5l221.9-63.9c34.8-10.2 54.2-11.7 79.3-8.2 36.3 6.1 52.7 25 61.4 55.2l10.7 37.8c8.2 28.1 1 50.6-23.5 73.6-19.4 17.4-31.2 24.5-61.4 33.2L203 351.8l220.4 27.1 9.7 34.2-48.1 13.3-286.8-37.3 23 80.2c36.8 22 80.3 34.7 126.3 34.7 137 0 248.5-111.4 248.5-248.3C497 119.4 385.5 8 248.5 8zM38.3 388.6L0 256.8c0 48.5 14.3 93.4 38.3 131.8z"]
};
var faRev = {
  prefix: 'fab',
  iconName: 'rev',
  icon: [448, 512, [], "f5b2", "M289.67 274.89a65.57 65.57 0 1 1-65.56-65.56 65.64 65.64 0 0 1 65.56 65.56zm139.55-5.05h-.13a204.69 204.69 0 0 0-74.32-153l-45.38 26.2a157.07 157.07 0 0 1 71.81 131.84C381.2 361.5 310.73 432 224.11 432S67 361.5 67 274.88c0-81.88 63-149.27 143-156.43v39.12l108.77-62.79L210 32v38.32c-106.7 7.25-191 96-191 204.57 0 111.59 89.12 202.29 200.06 205v.11h210.16V269.84z"]
};
var faRocketchat = {
  prefix: 'fab',
  iconName: 'rocketchat',
  icon: [576, 512, [], "f3e8", "M486.41 107.57c-76.93-50.83-179.18-62.4-264.12-47.07C127.26-31.16 20.77 11 0 23.12c0 0 73.08 62.1 61.21 116.49-86.52 88.2-45.39 186.4 0 232.77C73.08 426.77 0 488.87 0 488.87c20.57 12.16 126.77 54.19 222.29-37 84.75 15.23 187 3.76 264.12-47.16 119.26-76.14 119.65-220.61 0-297.15zM294.18 404.22a339.53 339.53 0 0 1-88.11-11.37l-19.77 19.09a179.74 179.74 0 0 1-36.59 27.39A143.14 143.14 0 0 1 98 454.06c1-1.78 1.88-3.56 2.77-5.24q29.67-55 16-98.69c-32.53-25.61-52-58.34-52-94.13 0-82 102.74-148.43 229.41-148.43S523.59 174 523.59 256 420.85 404.22 294.18 404.22zM184.12 291.3a34.32 34.32 0 0 1-34.8-33.72c-.7-45.39 67.83-46.38 68.52-1.09v.51a34 34 0 0 1-33.72 34.32zm73.77-33.72c-.79-45.39 67.74-46.48 68.53-1.19v.61c.39 45.08-67.74 45.57-68.53.58zm143.38 33.72a34.33 34.33 0 0 1-34.81-33.72c-.69-45.39 67.84-46.38 68.53-1.09v.51a33.89 33.89 0 0 1-33.72 34.32z"]
};
var faRockrms = {
  prefix: 'fab',
  iconName: 'rockrms',
  icon: [496, 512, [], "f3e9", "M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm157.4 419.5h-90l-112-131.3c-17.9-20.4-3.9-56.1 26.6-56.1h75.3l-84.6-99.3-84.3 98.9h-90L193.5 67.2c14.4-18.4 41.3-17.3 54.5 0l157.7 185.1c19 22.8 2 57.2-27.6 56.1-.6 0-74.2.2-74.2.2l101.5 118.9z"]
};
var faSafari = {
  prefix: 'fab',
  iconName: 'safari',
  icon: [512, 512, [], "f267", "M274.69,274.69l-37.38-37.38L166,346ZM256,8C119,8,8,119,8,256S119,504,256,504,504,393,504,256,393,8,256,8ZM411.85,182.79l14.78-6.13A8,8,0,0,1,437.08,181h0a8,8,0,0,1-4.33,10.46L418,197.57a8,8,0,0,1-10.45-4.33h0A8,8,0,0,1,411.85,182.79ZM314.43,94l6.12-14.78A8,8,0,0,1,331,74.92h0a8,8,0,0,1,4.33,10.45l-6.13,14.78a8,8,0,0,1-10.45,4.33h0A8,8,0,0,1,314.43,94ZM256,60h0a8,8,0,0,1,8,8V84a8,8,0,0,1-8,8h0a8,8,0,0,1-8-8V68A8,8,0,0,1,256,60ZM181,74.92a8,8,0,0,1,10.46,4.33L197.57,94a8,8,0,1,1-14.78,6.12l-6.13-14.78A8,8,0,0,1,181,74.92Zm-63.58,42.49h0a8,8,0,0,1,11.31,0L140,128.72A8,8,0,0,1,140,140h0a8,8,0,0,1-11.31,0l-11.31-11.31A8,8,0,0,1,117.41,117.41ZM60,256h0a8,8,0,0,1,8-8H84a8,8,0,0,1,8,8h0a8,8,0,0,1-8,8H68A8,8,0,0,1,60,256Zm40.15,73.21-14.78,6.13A8,8,0,0,1,74.92,331h0a8,8,0,0,1,4.33-10.46L94,314.43a8,8,0,0,1,10.45,4.33h0A8,8,0,0,1,100.15,329.21Zm4.33-136h0A8,8,0,0,1,94,197.57l-14.78-6.12A8,8,0,0,1,74.92,181h0a8,8,0,0,1,10.45-4.33l14.78,6.13A8,8,0,0,1,104.48,193.24ZM197.57,418l-6.12,14.78a8,8,0,0,1-14.79-6.12l6.13-14.78A8,8,0,1,1,197.57,418ZM264,444a8,8,0,0,1-8,8h0a8,8,0,0,1-8-8V428a8,8,0,0,1,8-8h0a8,8,0,0,1,8,8Zm67-6.92h0a8,8,0,0,1-10.46-4.33L314.43,418a8,8,0,0,1,4.33-10.45h0a8,8,0,0,1,10.45,4.33l6.13,14.78A8,8,0,0,1,331,437.08Zm63.58-42.49h0a8,8,0,0,1-11.31,0L372,383.28A8,8,0,0,1,372,372h0a8,8,0,0,1,11.31,0l11.31,11.31A8,8,0,0,1,394.59,394.59ZM286.25,286.25,110.34,401.66,225.75,225.75,401.66,110.34ZM437.08,331h0a8,8,0,0,1-10.45,4.33l-14.78-6.13a8,8,0,0,1-4.33-10.45h0A8,8,0,0,1,418,314.43l14.78,6.12A8,8,0,0,1,437.08,331ZM444,264H428a8,8,0,0,1-8-8h0a8,8,0,0,1,8-8h16a8,8,0,0,1,8,8h0A8,8,0,0,1,444,264Z"]
};
var faSalesforce = {
  prefix: 'fab',
  iconName: 'salesforce',
  icon: [640, 512, [], "f83b", "M248.89 245.64h-26.35c.69-5.16 3.32-14.12 13.64-14.12 6.75 0 11.97 3.82 12.71 14.12zm136.66-13.88c-.47 0-14.11-1.77-14.11 20s13.63 20 14.11 20c13 0 14.11-13.54 14.11-20 0-21.76-13.66-20-14.11-20zm-243.22 23.76a8.63 8.63 0 0 0-3.29 7.29c0 4.78 2.08 6.05 3.29 7.05 4.7 3.7 15.07 2.12 20.93.95v-16.94c-5.32-1.07-16.73-1.96-20.93 1.65zM640 232c0 87.58-80 154.39-165.36 136.43-18.37 33-70.73 70.75-132.2 41.63-41.16 96.05-177.89 92.18-213.81-5.17C8.91 428.78-50.19 266.52 53.36 205.61 18.61 126.18 76 32 167.67 32a124.24 124.24 0 0 1 98.56 48.7c20.7-21.4 49.4-34.81 81.15-34.81 42.34 0 79 23.52 98.8 58.57C539 63.78 640 132.69 640 232zm-519.55 31.8c0-11.76-11.69-15.17-17.87-17.17-5.27-2.11-13.41-3.51-13.41-8.94 0-9.46 17-6.66 25.17-2.12 0 0 1.17.71 1.64-.47.24-.7 2.36-6.58 2.59-7.29a1.13 1.13 0 0 0-.7-1.41c-12.33-7.63-40.7-8.51-40.7 12.7 0 12.46 11.49 15.44 17.88 17.17 4.72 1.58 13.17 3 13.17 8.7 0 4-3.53 7.06-9.17 7.06a31.76 31.76 0 0 1-19-6.35c-.47-.23-1.42-.71-1.65.71l-2.4 7.47c-.47.94.23 1.18.23 1.41 1.75 1.4 10.3 6.59 22.82 6.59 13.17 0 21.4-7.06 21.4-18.11zm32-42.58c-10.13 0-18.66 3.17-21.4 5.18a1 1 0 0 0-.24 1.41l2.59 7.06a1 1 0 0 0 1.18.7c.65 0 6.8-4 16.93-4 4 0 7.06.71 9.18 2.36 3.6 2.8 3.06 8.29 3.06 10.58-4.79-.3-19.11-3.44-29.41 3.76a16.92 16.92 0 0 0-7.34 14.54c0 5.9 1.51 10.4 6.59 14.35 12.24 8.16 36.28 2 38.1 1.41 1.58-.32 3.53-.66 3.53-1.88v-33.88c.04-4.61.32-21.64-22.78-21.64zM199 200.24a1.11 1.11 0 0 0-1.18-1.18H188a1.11 1.11 0 0 0-1.17 1.18v79a1.11 1.11 0 0 0 1.17 1.18h9.88a1.11 1.11 0 0 0 1.18-1.18zm55.75 28.93c-2.1-2.31-6.79-7.53-17.65-7.53-3.51 0-14.16.23-20.7 8.94-6.35 7.63-6.58 18.11-6.58 21.41 0 3.12.15 14.26 7.06 21.17 2.64 2.91 9.06 8.23 22.81 8.23 10.82 0 16.47-2.35 18.58-3.76.47-.24.71-.71.24-1.88l-2.35-6.83a1.26 1.26 0 0 0-1.41-.7c-2.59.94-6.35 2.82-15.29 2.82-17.42 0-16.85-14.74-16.94-16.7h37.17a1.23 1.23 0 0 0 1.17-.94c-.29 0 2.07-14.7-6.09-24.23zm36.69 52.69c13.17 0 21.41-7.06 21.41-18.11 0-11.76-11.7-15.17-17.88-17.17-4.14-1.66-13.41-3.38-13.41-8.94 0-3.76 3.29-6.35 8.47-6.35a38.11 38.11 0 0 1 16.7 4.23s1.18.71 1.65-.47c.23-.7 2.35-6.58 2.58-7.29a1.13 1.13 0 0 0-.7-1.41c-7.91-4.9-16.74-4.94-20.23-4.94-12 0-20.46 7.29-20.46 17.64 0 12.46 11.48 15.44 17.87 17.17 6.11 2 13.17 3.26 13.17 8.7 0 4-3.52 7.06-9.17 7.06a31.8 31.8 0 0 1-19-6.35 1 1 0 0 0-1.65.71l-2.35 7.52c-.47.94.23 1.18.23 1.41 1.72 1.4 10.33 6.59 22.79 6.59zM357.09 224c0-.71-.24-1.18-1.18-1.18h-11.76c0-.14.94-8.94 4.47-12.47 4.16-4.15 11.76-1.64 12-1.64 1.17.47 1.41 0 1.64-.47l2.83-7.77c.7-.94 0-1.17-.24-1.41-5.09-2-17.35-2.87-24.46 4.24-5.48 5.48-7 13.92-8 19.52h-8.47a1.28 1.28 0 0 0-1.17 1.18l-1.42 7.76c0 .7.24 1.17 1.18 1.17h8.23c-8.51 47.9-8.75 50.21-10.35 55.52-1.08 3.62-3.29 6.9-5.88 7.76-.09 0-3.88 1.68-9.64-.24 0 0-.94-.47-1.41.71-.24.71-2.59 6.82-2.83 7.53s0 1.41.47 1.41c5.11 2 13 1.77 17.88 0 6.28-2.28 9.72-7.89 11.53-12.94 2.75-7.71 2.81-9.79 11.76-59.74h12.23a1.29 1.29 0 0 0 1.18-1.18zm53.39 16c-.56-1.68-5.1-18.11-25.17-18.11-15.25 0-23 10-25.16 18.11-1 3-3.18 14 0 23.52.09.3 4.41 18.12 25.16 18.12 14.95 0 22.9-9.61 25.17-18.12 3.21-9.61 1.01-20.52 0-23.52zm45.4-16.7c-5-1.65-16.62-1.9-22.11 5.41v-4.47a1.11 1.11 0 0 0-1.18-1.17h-9.4a1.11 1.11 0 0 0-1.18 1.17v55.28a1.12 1.12 0 0 0 1.18 1.18h9.64a1.12 1.12 0 0 0 1.18-1.18v-27.77c0-2.91.05-11.37 4.46-15.05 4.9-4.9 12-3.36 13.41-3.06a1.57 1.57 0 0 0 1.41-.94 74 74 0 0 0 3.06-8 1.16 1.16 0 0 0-.47-1.41zm46.81 54.1l-2.12-7.29c-.47-1.18-1.41-.71-1.41-.71-4.23 1.82-10.15 1.89-11.29 1.89-4.64 0-17.17-1.13-17.17-19.76 0-6.23 1.85-19.76 16.47-19.76a34.85 34.85 0 0 1 11.52 1.65s.94.47 1.18-.71c.94-2.59 1.64-4.47 2.59-7.53.23-.94-.47-1.17-.71-1.17-11.59-3.87-22.34-2.53-27.76 0-1.59.74-16.23 6.49-16.23 27.52 0 2.9-.58 30.11 28.94 30.11a44.45 44.45 0 0 0 15.52-2.83 1.3 1.3 0 0 0 .47-1.42zm53.87-39.52c-.8-3-5.37-16.23-22.35-16.23-16 0-23.52 10.11-25.64 18.59a38.58 38.58 0 0 0-1.65 11.76c0 25.87 18.84 29.4 29.88 29.4 10.82 0 16.46-2.35 18.58-3.76.47-.24.71-.71.24-1.88l-2.36-6.83a1.26 1.26 0 0 0-1.41-.7c-2.59.94-6.35 2.82-15.29 2.82-17.42 0-16.85-14.74-16.93-16.7h37.16a1.25 1.25 0 0 0 1.18-.94c-.24-.01.94-7.07-1.41-15.54zm-23.29-6.35c-10.33 0-13 9-13.64 14.12H546c-.88-11.92-7.62-14.13-12.73-14.13z"]
};
var faSass = {
  prefix: 'fab',
  iconName: 'sass',
  icon: [640, 512, [], "f41e", "M301.84 378.92c-.3.6-.6 1.08 0 0zm249.13-87a131.16 131.16 0 0 0-58 13.5c-5.9-11.9-12-22.3-13-30.1-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.3-6.7-24 2.5-25.29 5.9a122.83 122.83 0 0 0-5.3 19.1c-2.3 11.7-25.79 53.5-39.09 75.3-4.4-8.5-8.1-16-8.9-22-1.2-9.1-2.5-14.5-1.1-25.3s7.7-26.1 7.6-27.2-1.4-6.6-14.29-6.7-24 2.5-25.3 5.9-2.7 11.4-5.3 19.1-33.89 77.3-42.08 95.4c-4.2 9.2-7.8 16.6-10.4 21.6-.4.8-.7 1.3-.9 1.7.3-.5.5-1 .5-.8-2.2 4.3-3.5 6.7-3.5 6.7v.1c-1.7 3.2-3.6 6.1-4.5 6.1-.6 0-1.9-8.4.3-19.9 4.7-24.2 15.8-61.8 15.7-63.1-.1-.7 2.1-7.2-7.3-10.7-9.1-3.3-12.4 2.2-13.2 2.2s-1.4 2-1.4 2 10.1-42.4-19.39-42.4c-18.4 0-44 20.2-56.58 38.5-7.9 4.3-25 13.6-43 23.5-6.9 3.8-14 7.7-20.7 11.4-.5-.5-.9-1-1.4-1.5-35.79-38.2-101.87-65.2-99.07-116.5 1-18.7 7.5-67.8 127.07-127.4 98-48.8 176.35-35.4 189.84-5.6 19.4 42.5-41.89 121.6-143.66 133-38.79 4.3-59.18-10.7-64.28-16.3-5.3-5.9-6.1-6.2-8.1-5.1-3.3 1.8-1.2 7 0 10.1 3 7.9 15.5 21.9 36.79 28.9 18.7 6.1 64.18 9.5 119.17-11.8 61.78-23.8 109.87-90.1 95.77-145.6C386.52 18.32 293-.18 204.57 31.22c-52.69 18.7-109.67 48.1-150.66 86.4-48.69 45.6-56.48 85.3-53.28 101.9 11.39 58.9 92.57 97.3 125.06 125.7-1.6.9-3.1 1.7-4.5 2.5-16.29 8.1-78.18 40.5-93.67 74.7-17.5 38.8 2.9 66.6 16.29 70.4 41.79 11.6 84.58-9.3 107.57-43.6s20.2-79.1 9.6-99.5c-.1-.3-.3-.5-.4-.8 4.2-2.5 8.5-5 12.8-7.5 8.29-4.9 16.39-9.4 23.49-13.3-4 10.8-6.9 23.8-8.4 42.6-1.8 22 7.3 50.5 19.1 61.7 5.2 4.9 11.49 5 15.39 5 13.8 0 20-11.4 26.89-25 8.5-16.6 16-35.9 16-35.9s-9.4 52.2 16.3 52.2c9.39 0 18.79-12.1 23-18.3v.1s.2-.4.7-1.2c1-1.5 1.5-2.4 1.5-2.4v-.3c3.8-6.5 12.1-21.4 24.59-46 16.2-31.8 31.69-71.5 31.69-71.5a201.24 201.24 0 0 0 6.2 25.8c2.8 9.5 8.7 19.9 13.4 30-3.8 5.2-6.1 8.2-6.1 8.2a.31.31 0 0 0 .1.2c-3 4-6.4 8.3-9.9 12.5-12.79 15.2-28 32.6-30 37.6-2.4 5.9-1.8 10.3 2.8 13.7 3.4 2.6 9.4 3 15.69 2.5 11.5-.8 19.6-3.6 23.5-5.4a82.2 82.2 0 0 0 20.19-10.6c12.5-9.2 20.1-22.4 19.4-39.8-.4-9.6-3.5-19.2-7.3-28.2 1.1-1.6 2.3-3.3 3.4-5C434.8 301.72 450.1 270 450.1 270a201.24 201.24 0 0 0 6.2 25.8c2.4 8.1 7.09 17 11.39 25.7-18.59 15.1-30.09 32.6-34.09 44.1-7.4 21.3-1.6 30.9 9.3 33.1 4.9 1 11.9-1.3 17.1-3.5a79.46 79.46 0 0 0 21.59-11.1c12.5-9.2 24.59-22.1 23.79-39.6-.3-7.9-2.5-15.8-5.4-23.4 15.7-6.6 36.09-10.2 62.09-7.2 55.68 6.5 66.58 41.3 64.48 55.8s-13.8 22.6-17.7 25-5.1 3.3-4.8 5.1c.5 2.6 2.3 2.5 5.6 1.9 4.6-.8 29.19-11.8 30.29-38.7 1.6-34-31.09-71.4-89-71.1zm-429.18 144.7c-18.39 20.1-44.19 27.7-55.28 21.3C54.61 451 59.31 421.42 82 400c13.8-13 31.59-25 43.39-32.4 2.7-1.6 6.6-4 11.4-6.9.8-.5 1.2-.7 1.2-.7.9-.6 1.9-1.1 2.9-1.7 8.29 30.4.3 57.2-19.1 78.3zm134.36-91.4c-6.4 15.7-19.89 55.7-28.09 53.6-7-1.8-11.3-32.3-1.4-62.3 5-15.1 15.6-33.1 21.9-40.1 10.09-11.3 21.19-14.9 23.79-10.4 3.5 5.9-12.2 49.4-16.2 59.2zm111 53c-2.7 1.4-5.2 2.3-6.4 1.6-.9-.5 1.1-2.4 1.1-2.4s13.9-14.9 19.4-21.7c3.2-4 6.9-8.7 10.89-13.9 0 .5.1 1 .1 1.6-.13 17.9-17.32 30-25.12 34.8zm85.58-19.5c-2-1.4-1.7-6.1 5-20.7 2.6-5.7 8.59-15.3 19-24.5a36.18 36.18 0 0 1 1.9 10.8c-.1 22.5-16.2 30.9-25.89 34.4z"]
};
var faSchlix = {
  prefix: 'fab',
  iconName: 'schlix',
  icon: [448, 512, [], "f3ea", "M350.5 157.7l-54.2-46.1 73.4-39 78.3 44.2-97.5 40.9zM192 122.1l45.7-28.2 34.7 34.6-55.4 29-25-35.4zm-65.1 6.6l31.9-22.1L176 135l-36.7 22.5-12.4-28.8zm-23.3 88.2l-8.8-34.8 29.6-18.3 13.1 35.3-33.9 17.8zm-21.2-83.7l23.9-18.1 8.9 24-26.7 18.3-6.1-24.2zM59 206.5l-3.6-28.4 22.3-15.5 6.1 28.7L59 206.5zm-30.6 16.6l20.8-12.8 3.3 33.4-22.9 12-1.2-32.6zM1.4 268l19.2-10.2.4 38.2-21 8.8L1.4 268zm59.1 59.3l-28.3 8.3-1.6-46.8 25.1-10.7 4.8 49.2zM99 263.2l-31.1 13-5.2-40.8L90.1 221l8.9 42.2zM123.2 377l-41.6 5.9-8.1-63.5 35.2-10.8 14.5 68.4zm28.5-139.9l21.2 57.1-46.2 13.6-13.7-54.1 38.7-16.6zm85.7 230.5l-70.9-3.3-24.3-95.8 55.2-8.6 40 107.7zm-84.9-279.7l42.2-22.4 28 45.9-50.8 21.3-19.4-44.8zm41 94.9l61.3-18.7 52.8 86.6-79.8 11.3-34.3-79.2zm51.4-85.6l67.3-28.8 65.5 65.4-88.6 26.2-44.2-62.8z"]
};
var faScribd = {
  prefix: 'fab',
  iconName: 'scribd',
  icon: [384, 512, [], "f28a", "M42.3 252.7c-16.1-19-24.7-45.9-24.8-79.9 0-100.4 75.2-153.1 167.2-153.1 98.6-1.6 156.8 49 184.3 70.6l-50.5 72.1-37.3-24.6 26.9-38.6c-36.5-24-79.4-36.5-123-35.8-50.7-.8-111.7 27.2-111.7 76.2 0 18.7 11.2 20.7 28.6 15.6 23.3-5.3 41.9.6 55.8 14 26.4 24.3 23.2 67.6-.7 91.9-29.2 29.5-85.2 27.3-114.8-8.4zm317.7 5.9c-15.5-18.8-38.9-29.4-63.2-28.6-38.1-2-71.1 28-70.5 67.2-.7 16.8 6 33 18.4 44.3 14.1 13.9 33 19.7 56.3 14.4 17.4-5.1 28.6-3.1 28.6 15.6 0 4.3-.5 8.5-1.4 12.7-16.7 40.9-59.5 64.4-121.4 64.4-51.9.2-102.4-16.4-144.1-47.3l33.7-39.4-35.6-27.4L0 406.3l15.4 13.8c52.5 46.8 120.4 72.5 190.7 72.2 51.4 0 94.4-10.5 133.6-44.1 57.1-51.4 54.2-149.2 20.3-189.6z"]
};
var faSearchengin = {
  prefix: 'fab',
  iconName: 'searchengin',
  icon: [460, 512, [], "f3eb", "M220.6 130.3l-67.2 28.2V43.2L98.7 233.5l54.7-24.2v130.3l67.2-209.3zm-83.2-96.7l-1.3 4.7-15.2 52.9C80.6 106.7 52 145.8 52 191.5c0 52.3 34.3 95.9 83.4 105.5v53.6C57.5 340.1 0 272.4 0 191.6c0-80.5 59.8-147.2 137.4-158zm311.4 447.2c-11.2 11.2-23.1 12.3-28.6 10.5-5.4-1.8-27.1-19.9-60.4-44.4-33.3-24.6-33.6-35.7-43-56.7-9.4-20.9-30.4-42.6-57.5-52.4l-9.7-14.7c-24.7 16.9-53 26.9-81.3 28.7l2.1-6.6 15.9-49.5c46.5-11.9 80.9-54 80.9-104.2 0-54.5-38.4-102.1-96-107.1V32.3C254.4 37.4 320 106.8 320 191.6c0 33.6-11.2 64.7-29 90.4l14.6 9.6c9.8 27.1 31.5 48 52.4 57.4s32.2 9.7 56.8 43c24.6 33.2 42.7 54.9 44.5 60.3s.7 17.3-10.5 28.5zm-9.9-17.9c0-4.4-3.6-8-8-8s-8 3.6-8 8 3.6 8 8 8 8-3.6 8-8z"]
};
var faSellcast = {
  prefix: 'fab',
  iconName: 'sellcast',
};
var faSellsy = {
"use strict";



define('tic-tac-toe/app', ['exports', 'ember', 'tic-tac-toe/resolver', 'ember-load-initializers', 'tic-tac-toe/config/environment'], function (exports, _ember, _resolver, _emberLoadInitializers, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var App = void 0;

  _ember.default.MODEL_FACTORY_INJECTIONS = true;

  App = _ember.default.Application.extend({
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix,
    Resolver: _resolver.default,

    model: function model() {
      return ['Marie Curie', 'Mae Jemison', 'Albert Hofmann'];
    }
  });

  (0, _emberLoadInitializers.default)(App, _environment.default.modulePrefix);

  exports.default = App;
});
define('tic-tac-toe/components/cell-content', ['exports', 'ember'], function (exports, _ember) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _ember.default.Component.extend({
		check: _ember.default.computed('text', function () {
			var text = this.get('text');
			return text;
		})
	});
});
define('tic-tac-toe/components/tic-tac-toe', ['exports', 'ember'], function (exports, _ember) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _ember.default.Component.extend({

		ROW_COL_DIMENSION: 3,
		connection: null,
		connectivity: false,
		name: '',
		wait: false,
		latest: null,

		init: function init() {
			this._super.apply(this, arguments);

			var connection = new WebSocket('ws://127.0.0.1:1337');

			connection.onopen = this._onConnectionOpen.bind(this);
			connection.onerror = this._onConnectionError.bind(this);
			connection.onmessage = this._onMessage.bind(this);

			setInterval(function () {
				if (connection.readyState !== 1) {
					console.info('Unable to comminucate ' + 'with the WebSocket server.');
				}
			}, 3000);

			this.set('connection', connection);
		},


		map: _ember.default.computed(function () {
			return this._createMap(this.get('ROW_COL_DIMENSION'));
		}),

		_createMap: function _createMap(dimension) {
			var arr = _ember.default.A(new Array(dimension));

			for (var i = 0; i < arr.length; i++) {
				arr[i] = _ember.default.A(new Array(dimension));

				for (var j = 0; j < arr[i].length; j++) {
					arr[i][j] = { coords: i + ',' + j };
				}
			}

			return arr;
		},


		mapObs: function () {
			var map = this.get('map');
			var dimension = this.get('ROW_COL_DIMENSION');
			var latest = this.get('latest');

			if (latest) {
				var latestCoords = latest.coords.split(',');

				var matched = void 0;
				var draw = void 0;

				if (!matched) {
					matched = true;
					for (var i = 0; i < dimension; i++) {
						matched = map[+latestCoords[0]][i].symbol == latest.symbol;
						if (!matched) break;
					}
				}

				if (!matched) {
					matched = true;
					for (var _i = 0; _i < dimension; _i++) {
						matched = map[_i][+latestCoords[1]].symbol === latest.symbol;
						if (!matched) break;
					}
				}

				if (!matched) {
					matched = true;
					for (var _i2 = 0; _i2 < dimension; _i2++) {
						matched = map[_i2][_i2].symbol === latest.symbol;
						if (!matched) break;
					}
				}

				if (!matched) {
					matched = true;
					for (var _i3 = 0; _i3 < dimension; _i3++) {
						matched = map[_i3][dimension - _i3 - 1].symbol === latest.symbol;
						if (!matched) break;
					}
				}

				if (matched) {
					if (latest.symbol === this.get('symbol')) {
						this.set('message', 'Winner');
					} else {
						this.set('message', 'Try Again');
					}
				} else {
					draw = true;
					for (var _i4 = 0; _i4 < dimension; _i4++) {
						for (var j = 0; j < dimension; j++) {
							draw = map[_i4][j].symbol ? true : false;
							if (!draw) break;
						}
					}

					if (draw) {
						this.set('message', 'Draw');
					}
				}
			}
		}.observes('map').on('init'),

		reset: function reset() {
			this.set('map', this._createMap(this.get('ROW_COL_DIMENSION')));
			this.set('wait', false);
			this.set('latest', null);
			this.set('message', null);
		},
		_onMessage: function _onMessage(message) {
			// try to parse JSON message. Because we know that the server always returns
			// JSON this should work without any problem but we should make sure that
			// the massage is not chunked.
			try {
				var json = JSON.parse(message.data);
			} catch (e) {
				console.error('Invalid JSON: ', message.data);
				return;
			}

			if (json.type === 'symbol') {
				// entire message history

				this.set('symbol', json.data);
			} else if (json.type === 'message') {
				// it's a single message

				if (json.data.text === 'reset') {

					this.reset();
				} else {

					var coords = json.data.text.split(',');
					var map = this.get('map');
					var obj = map[coords.shift()][coords.shift()];

					obj.symbol = json.data.symbol;

					this.set('latest', obj);

					this.set('wait', json.data.author === this.get('name'));

					this.set('map', JSON.parse(JSON.stringify(map)));
				}
			} else {
				console.log('Invalid content type: ', json);
			}
		},
		_onConnectionOpen: function _onConnectionOpen() {
			console.debug("conection opened");
			this.set('connectivity', true);
		},
		_onConnectionError: function _onConnectionError(error) {
			// just in there were some problems with conenction...
			console.error("conection error");
		},


		actions: {
			mark: function mark(coords) {
				var connectivity = this.get('connectivity');
				var wait = this.get('wait');

				if (connectivity && !wait) {
					this.get('connection').send(coords);
				}
			},
			play: function play() {
				if (this.get('connectivity')) {
					this.get('connection').send(this.get('name'));
				}
			},
			reset: function reset() {
				if (this.get('connectivity')) {
					this.get('connection').send('reset');
				}
			}
		}
	});
});
define('tic-tac-toe/components/welcome-page', ['exports', 'ember-welcome-page/components/welcome-page'], function (exports, _welcomePage) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _welcomePage.default;
    }
  });
});
define('tic-tac-toe/helpers/app-version', ['exports', 'ember', 'tic-tac-toe/config/environment', 'ember-cli-app-version/utils/regexp'], function (exports, _ember, _environment, _regexp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.appVersion = appVersion;
  var version = _environment.default.APP.version;
  function appVersion(_) {
    var hash = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    if (hash.hideSha) {
      return version.match(_regexp.versionRegExp)[0];
    }

    if (hash.hideVersion) {
      return version.match(_regexp.shaRegExp)[0];
    }

    return version;
  }

  exports.default = _ember.default.Helper.helper(appVersion);
});
define('tic-tac-toe/helpers/pluralize', ['exports', 'ember-inflector/lib/helpers/pluralize'], function (exports, _pluralize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _pluralize.default;
});
define('tic-tac-toe/helpers/singularize', ['exports', 'ember-inflector/lib/helpers/singularize'], function (exports, _singularize) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _singularize.default;
});
define('tic-tac-toe/initializers/app-version', ['exports', 'ember-cli-app-version/initializer-factory', 'tic-tac-toe/config/environment'], function (exports, _initializerFactory, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  var _config$APP = _environment.default.APP,
      name = _config$APP.name,
      version = _config$APP.version;
  exports.default = {
    name: 'App Version',
    initialize: (0, _initializerFactory.default)(name, version)
  };
});
define('tic-tac-toe/initializers/container-debug-adapter', ['exports', 'ember-resolver/resolvers/classic/container-debug-adapter'], function (exports, _containerDebugAdapter) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'container-debug-adapter',

    initialize: function initialize() {
      var app = arguments[1] || arguments[0];

      app.register('container-debug-adapter:main', _containerDebugAdapter.default);
      app.inject('container-debug-adapter:main', 'namespace', 'application:main');
    }
  };
});
define('tic-tac-toe/initializers/data-adapter', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'data-adapter',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('tic-tac-toe/initializers/ember-data', ['exports', 'ember-data/setup-container', 'ember-data/index'], function (exports, _setupContainer) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'ember-data',
    initialize: _setupContainer.default
  };
});
define('tic-tac-toe/initializers/export-application-global', ['exports', 'ember', 'tic-tac-toe/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.initialize = initialize;
  function initialize() {
    var application = arguments[1] || arguments[0];
    if (_environment.default.exportApplicationGlobal !== false) {
      var theGlobal;
      if (typeof window !== 'undefined') {
        theGlobal = window;
      } else if (typeof global !== 'undefined') {
        theGlobal = global;
      } else if (typeof self !== 'undefined') {
        theGlobal = self;
      } else {
        // no reasonable global, just bail
        return;
      }

      var value = _environment.default.exportApplicationGlobal;
      var globalName;

      if (typeof value === 'string') {
        globalName = value;
      } else {
        globalName = _ember.default.String.classify(_environment.default.modulePrefix);
      }

      if (!theGlobal[globalName]) {
        theGlobal[globalName] = application;

        application.reopen({
          willDestroy: function willDestroy() {
            this._super.apply(this, arguments);
            delete theGlobal[globalName];
          }
        });
      }
    }
  }

  exports.default = {
    name: 'export-application-global',

    initialize: initialize
  };
});
define('tic-tac-toe/initializers/injectStore', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'injectStore',
    before: 'store',
    initialize: function initialize() {}
  };
});
define('tic-tac-toe/initializers/store', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'store',
    after: 'ember-data',
    initialize: function initialize() {}
  };
});
define('tic-tac-toe/initializers/transforms', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: 'transforms',
    before: 'store',
    initialize: function initialize() {}
  };
});
define("tic-tac-toe/instance-initializers/ember-data", ["exports", "ember-data/-private/instance-initializers/initialize-store-service"], function (exports, _initializeStoreService) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = {
    name: "ember-data",
    initialize: _initializeStoreService.default
  };
});
define('tic-tac-toe/resolver', ['exports', 'ember-resolver'], function (exports, _emberResolver) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = _emberResolver.default;
});
define('tic-tac-toe/router', ['exports', 'ember', 'tic-tac-toe/config/environment'], function (exports, _ember, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var Router = _ember.default.Router.extend({
    location: _environment.default.locationType,
    rootURL: _environment.default.rootURL
  });

  Router.map(function () {
    this.route('play');
  });

  exports.default = Router;
});
define('tic-tac-toe/routes/play', ['exports', 'ember'], function (exports, _ember) {
	'use strict';

	Object.defineProperty(exports, "__esModule", {
		value: true
	});
	exports.default = _ember.default.Route.extend({});
});
define('tic-tac-toe/services/ajax', ['exports', 'ember-ajax/services/ajax'], function (exports, _ajax) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  Object.defineProperty(exports, 'default', {
    enumerable: true,
    get: function () {
      return _ajax.default;
    }
  });
});
define("tic-tac-toe/templates/application", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "eu6J9kcl", "block": "{\"statements\":[[1,[26,[\"tic-tac-toe\"]],false],[0,\"\\n\"],[0,\"\\n\"],[1,[26,[\"outlet\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "tic-tac-toe/templates/application.hbs" } });
});
define("tic-tac-toe/templates/components/cell-content", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "3ZYjy259", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"content\"],[13],[0,\"\\n\\t\"],[1,[26,[\"check\"]],false],[0,\"\\n\"],[14],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "tic-tac-toe/templates/components/cell-content.hbs" } });
});
define("tic-tac-toe/templates/components/tic-tac-toe", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "hx49z4xo", "block": "{\"statements\":[[18,\"default\"],[0,\"\\n\\n\"],[11,\"h1\",[]],[13],[0,\"TT\"],[14],[0,\"\\n\\n\"],[4,\" TODO: move name to first page of application. \"],[0,\"\\n\"],[1,[33,[\"input\"],null,[[\"type\",\"value\"],[\"text\",[28,[\"name\"]]]]],false],[0,\"\\n\"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"play\"]],[13],[0,\"Play\"],[14],[0,\"\\n\\n\"],[11,\"button\",[]],[5,[\"action\"],[[28,[null]],\"reset\"]],[13],[0,\"Reset\"],[14],[0,\"\\n\\n\"],[11,\"div\",[]],[15,\"class\",\"player\"],[13],[0,\"\\n\\t\"],[11,\"label\",[]],[15,\"class\",\"name\"],[13],[1,[26,[\"name\"]],false],[14],[0,\"\\n\"],[14],[0,\"\\n\\n\"],[11,\"table\",[]],[13],[0,\"\\n\\t\"],[11,\"tbody\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"map\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\"],[11,\"tr\",[]],[13],[0,\"\\n\"],[6,[\"each\"],[[28,[\"row\"]]],null,{\"statements\":[[0,\"\\t\\t\\t\\t\\t\"],[11,\"td\",[]],[15,\"cellspacing\",\"0\"],[16,\"fill\",[28,[\"cell\",\"fill\"]],null],[5,[\"action\"],[[28,[null]],\"mark\",[28,[\"cell\",\"coords\"]]]],[13],[0,\"\\n\\t\\t\\t\\t\\t\\t\"],[1,[33,[\"cell-content\"],null,[[\"text\"],[[28,[\"cell\",\"symbol\"]]]]],false],[0,\"\\n\\t\\t\\t\\t\\t\"],[14],[0,\"\\n\"]],\"locals\":[\"cell\"]},null],[0,\"\\t\\t\\t\"],[14],[0,\"\\n\"]],\"locals\":[\"row\"]},null],[0,\"\\t\"],[14],[0,\"\\n\\n\"],[6,[\"if\"],[[28,[\"message\"]]],null,{\"statements\":[[0,\"\\t\\t\"],[11,\"div\",[]],[15,\"class\",\"msg\"],[13],[1,[26,[\"message\"]],false],[14],[0,\"\\n\"]],\"locals\":[]},null],[0,\"\\n\"],[14]],\"locals\":[],\"named\":[],\"yields\":[\"default\"],\"hasPartials\":false}", "meta": { "moduleName": "tic-tac-toe/templates/components/tic-tac-toe.hbs" } });
});
define("tic-tac-toe/templates/play", ["exports"], function (exports) {
  "use strict";

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = Ember.HTMLBars.template({ "id": "33IgBoVI", "block": "{\"statements\":[[11,\"h1\",[]],[13],[0,\"About\"],[14],[0,\"\\n\\n\"],[1,[26,[\"outlet\"]],false],[0,\"\\n\"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}", "meta": { "moduleName": "tic-tac-toe/templates/play.hbs" } });
});


define('tic-tac-toe/config/environment', ['ember'], function(Ember) {
  var prefix = 'tic-tac-toe';
try {
  var metaName = prefix + '/config/environment';
  var rawConfig = document.querySelector('meta[name="' + metaName + '"]').getAttribute('content');
  var config = JSON.parse(unescape(rawConfig));

  var exports = { 'default': config };

  Object.defineProperty(exports, '__esModule', { value: true });

  return exports;
}
catch(err) {
  throw new Error('Could not read config from meta tag with name "' + metaName + '".');
}

});

if (!runningTests) {
  require("tic-tac-toe/app")["default"].create({"name":"tic-tac-toe","version":"0.0.0+"});
}
//# sourceMappingURL=tic-tac-toe.map

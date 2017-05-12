'use strict';

define('tic-tac-toe/tests/app.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | app');

  QUnit.test('app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'app.js should pass ESLint\n\n');
  });

  QUnit.test('components/cell-content.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'components/cell-content.js should pass ESLint\n\n');
  });

  QUnit.test('components/tic-tac-toe.js', function (assert) {
    assert.expect(1);
    assert.ok(false, 'components/tic-tac-toe.js should pass ESLint\n\n18:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n19:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n21:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n22:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n23:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n23:14 - Unexpected console statement. (no-console)\n24:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n25:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n27:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n125:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n128:13 - Unexpected console statement. (no-console)\n134:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n137:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n138:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n140:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n142:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n144:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n145:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n146:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n147:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n148:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n150:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n152:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n154:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n155:2 - Mixed spaces and tabs. (no-mixed-spaces-and-tabs)\n158:13 - Unexpected console statement. (no-console)\n163:9 - Unexpected console statement. (no-console)\n167:22 - \'error\' is defined but never used. (no-unused-vars)\n169:9 - Unexpected console statement. (no-console)');
  });

  QUnit.test('resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'resolver.js should pass ESLint\n\n');
  });

  QUnit.test('router.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'router.js should pass ESLint\n\n');
  });

  QUnit.test('routes/play.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'routes/play.js should pass ESLint\n\n');
  });
});
define('tic-tac-toe/tests/helpers/destroy-app', ['exports', 'ember'], function (exports, _ember) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = destroyApp;
  function destroyApp(application) {
    _ember.default.run(application, 'destroy');
  }
});
define('tic-tac-toe/tests/helpers/module-for-acceptance', ['exports', 'qunit', 'ember', 'tic-tac-toe/tests/helpers/start-app', 'tic-tac-toe/tests/helpers/destroy-app'], function (exports, _qunit, _ember, _startApp, _destroyApp) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });

  exports.default = function (name) {
    var options = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};

    (0, _qunit.module)(name, {
      beforeEach: function beforeEach() {
        this.application = (0, _startApp.default)();

        if (options.beforeEach) {
          return options.beforeEach.apply(this, arguments);
        }
      },
      afterEach: function afterEach() {
        var _this = this;

        var afterEach = options.afterEach && options.afterEach.apply(this, arguments);
        return Promise.resolve(afterEach).then(function () {
          return (0, _destroyApp.default)(_this.application);
        });
      }
    });
  };

  var Promise = _ember.default.RSVP.Promise;
});
define('tic-tac-toe/tests/helpers/resolver', ['exports', 'tic-tac-toe/resolver', 'tic-tac-toe/config/environment'], function (exports, _resolver, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });


  var resolver = _resolver.default.create();

  resolver.namespace = {
    modulePrefix: _environment.default.modulePrefix,
    podModulePrefix: _environment.default.podModulePrefix
  };

  exports.default = resolver;
});
define('tic-tac-toe/tests/helpers/start-app', ['exports', 'ember', 'tic-tac-toe/app', 'tic-tac-toe/config/environment'], function (exports, _ember, _app, _environment) {
  'use strict';

  Object.defineProperty(exports, "__esModule", {
    value: true
  });
  exports.default = startApp;
  function startApp(attrs) {
    var attributes = _ember.default.merge({}, _environment.default.APP);
    attributes = _ember.default.merge(attributes, attrs); // use defaults, but you can override;

    return _ember.default.run(function () {
      var application = _app.default.create(attributes);
      application.setupForTesting();
      application.injectTestHelpers();
      return application;
    });
  }
});
define('tic-tac-toe/tests/integration/components/base-grid-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('base-grid', 'Integration | Component | base grid', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "Cc/wI3lN",
      "block": "{\"statements\":[[1,[26,[\"base-grid\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "2fCZ+DU3",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"base-grid\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('tic-tac-toe/tests/integration/components/cell-content-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleForComponent)('cell-content', 'Integration | Component | cell content', {
    integration: true
  });

  (0, _emberQunit.test)('it renders', function (assert) {

    // Set any properties with this.set('myProperty', 'value');
    // Handle any actions with this.on('myAction', function(val) { ... });

    this.render(Ember.HTMLBars.template({
      "id": "9CxI2o8/",
      "block": "{\"statements\":[[1,[26,[\"cell-content\"]],false]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), '');

    // Template block usage:
    this.render(Ember.HTMLBars.template({
      "id": "ARuFZl0A",
      "block": "{\"statements\":[[0,\"\\n\"],[6,[\"cell-content\"],null,null,{\"statements\":[[0,\"      template block text\\n\"]],\"locals\":[]},null],[0,\"  \"]],\"locals\":[],\"named\":[],\"yields\":[],\"hasPartials\":false}",
      "meta": {}
    }));

    assert.equal(this.$().text().trim(), 'template block text');
  });
});
define('tic-tac-toe/tests/test-helper', ['tic-tac-toe/tests/helpers/resolver', 'ember-qunit', 'ember-cli-qunit'], function (_resolver, _emberQunit, _emberCliQunit) {
  'use strict';

  (0, _emberQunit.setResolver)(_resolver.default);
  (0, _emberCliQunit.start)();
});
define('tic-tac-toe/tests/tests.lint-test', [], function () {
  'use strict';

  QUnit.module('ESLint | tests');

  QUnit.test('helpers/destroy-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/destroy-app.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/module-for-acceptance.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/module-for-acceptance.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/resolver.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/resolver.js should pass ESLint\n\n');
  });

  QUnit.test('helpers/start-app.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'helpers/start-app.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/base-grid-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/base-grid-test.js should pass ESLint\n\n');
  });

  QUnit.test('integration/components/cell-content-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'integration/components/cell-content-test.js should pass ESLint\n\n');
  });

  QUnit.test('test-helper.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'test-helper.js should pass ESLint\n\n');
  });

  QUnit.test('unit/routes/scores-test.js', function (assert) {
    assert.expect(1);
    assert.ok(true, 'unit/routes/scores-test.js should pass ESLint\n\n');
  });
});
define('tic-tac-toe/tests/unit/routes/scores-test', ['ember-qunit'], function (_emberQunit) {
  'use strict';

  (0, _emberQunit.moduleFor)('route:scores', 'Unit | Route | scores', {
    // Specify the other units that are required for this test.
    // needs: ['controller:foo']
  });

  (0, _emberQunit.test)('it exists', function (assert) {
    var route = this.subject();
    assert.ok(route);
  });
});
require('tic-tac-toe/tests/test-helper');
EmberENV.TESTS_FILE_LOADED = true;
//# sourceMappingURL=tests.map

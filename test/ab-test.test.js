import ABTest from '../index';
import test from 'tape-rollup';
import Domodule from 'domodule';
import { Metrics } from 'micro-metrics-browser';

const calls = [];
let instance;
let el;

test('API', assert => {
  assert.ok(ABTest.prototype instanceof Domodule, 'Is a domodule module');
  assert.equal(typeof ABTest.prototype.success, 'function', 'Success is defined');
  assert.end();
});

const setup = () => {
  calls.length = 0;

  el = document.createElement('div');
  el.dataset.moduleName = 'name';
  el.dataset.moduleValue = 'value';
  el.dataset.moduleUrl = 'url';
  el.dataset.moduleSessionId = 'session';

  Metrics.prototype.conversion = (...args) => {
    calls.push(args);
  };
  instance = new ABTest(el);
};

test('Required data', assert => {
  const wrongEl = document.createElement('div');
  const rightEl = document.createElement('div');

  rightEl.dataset.moduleName = 'name';
  rightEl.dataset.moduleValue = 'value';

  assert.throws(() => {
    new ABTest(wrongEl);
  }, /name is required as options for undefined, but is missing!/, 'Throws when name isn\'t given');

  wrongEl.dataset.moduleName = 'name';

  assert.throws(() => {
    new ABTest(wrongEl);
  }, /value is required as options for undefined, but is missing!/, 'Throws when value isn\'t given');

  assert.throws(() => {
    new ABTest(rightEl);
  }, /Metrics URL not present as option nor within metricsEndpoint/, 'Throws when url isn\'t given');

  rightEl.dataset.moduleUrl = 'url';

  assert.throws(() => {
    new ABTest(rightEl);
  }, /Metrics Session not present as option nor within metricsSession/, 'Throws when session isn\'t given');

  rightEl.dataset.moduleSessionId = 'id';

  assert.doesNotThrow(() => {
    new ABTest(rightEl);
  }, 'Does not throw when all data is given');

  rightEl.dataset.moduleUrl = undefined;
  rightEl.dataset.moduleSessionId = undefined;
  window.metricsEndpoint = 'metricsEndpoint';
  window.metricsSession = 'metricsSession';

  assert.doesNotThrow(() => {
    new ABTest(rightEl);
  }, 'Does not throw when data is not given but is global');

  assert.end();
});

test('Metrics receives correct info', assert => {
  setup();
  assert.equal(instance.mm.host, 'url', 'Correct url is given');
  assert.end();
});

test('Conversion is called right away', assert => {
  setup();

  assert.equal(calls.length, 1, 'Called once');
  const call = calls[0];
  assert.equal(call[0], 'name', 'Name should be the given one');
  assert.equal(call[1], 'impression', 'Should track an impression');
  assert.equal(call[2], 'value', 'Value should be the given one');
  assert.equal(call[3], 'session', 'Session Id should be the given one');
  assert.end();
});

test('Success should track a success conversion', assert => {
  setup();

  instance.success();
  const call = calls[1];

  assert.equal(call[0], 'name', 'Name should be the given one');
  assert.equal(call[1], 'success', 'Should track a success');
  assert.equal(call[2], 'value', 'Value should be the given one');
  assert.equal(call[3], 'session', 'Session Id should be the given one');
  assert.end();
});

test('Clicking on the element should track a success', assert => {
  setup();

  instance.el.click();
  const call = calls[1];

  assert.equal(call[1], 'success', 'Should track a success');
  assert.end();
});

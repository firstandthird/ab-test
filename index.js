/* eslint-env browser */
import { on } from 'domassist';
import Domodule from 'domodule';
import { Metrics } from 'micro-metrics-browser';

export default class ABTest extends Domodule {
  get required() {
    return {
      options: ['name', 'value']
    };
  }

  postInit() {
    if (this.options.onlyOn && !window.matchMedia(this.options.onlyOn).matches) {
      return;
    }

    const url = this.options.url || window.metricsEndpoint;
    this.sessionId = this.options.sessionId || window.metricsSession;

    if (!url) {
      throw new Error('Metrics URL not present as option nor within metricsEndpoint');
    }

    if (!this.sessionId) {
      throw new Error('Metrics Session not present as option nor within metricsSession');
    }

    // If no action is setup, assume click on el
    if (!this.setUps.actions.length) {
      on(this.el, 'click', this.success.bind(this));
    }

    this.mm = new Metrics(url);
    this.track('impression');
  }

  track(type, data) {
    this.mm.conversion(this.options.name, type, this.options.value, this.sessionId, data);
  }

  success(el, event, options) {
    let data;

    if (options && Object.keys(options).length) {
      data = options;
    }

    this.track('success', data);
  }
}

Domodule.register('ABTest', ABTest);

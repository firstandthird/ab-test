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

    if (!url) {
      throw new Error('Metrics URL not present as option nor within metricsEndpoint');
    }

    // If no action is setup, assume click on el
    if (!this.setUps.actions.length) {
      on(this.el, 'click', this.success.bind(this));
    }

    this.mm = new Metrics(url);
    this.track('impression');
  }

  track(type) {
    this.mm.conversion(this.options.name, type, this.options.value);
  }

  success() {
    this.track('success');
  }
}

Domodule.register('ABTest', ABTest);

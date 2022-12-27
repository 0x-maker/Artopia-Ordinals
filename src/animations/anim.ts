import { gsap } from 'gsap';

export class Anim {
  DOM: Record<string, HTMLElement>;

  constructor(el: HTMLElement, onEnter: () => void) {
    // eslint-disable-next-line @typescript-eslint/no-var-requires
    const ScrollTrigger = require('gsap/ScrollTrigger').default;
    gsap.registerPlugin(ScrollTrigger);

    this.DOM = { el };
    ScrollTrigger.create({
      trigger: el,
      onEnter: function (target: ScrollTrigger) {
        onEnter();
        target.kill();
      },
    });
  }
}

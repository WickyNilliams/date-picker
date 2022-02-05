import { ReactiveController, ReactiveControllerHost } from 'lit';

type SwipeControllerOptions = {
  target: () => HTMLElement;
  onSwipeEnd: (details: { distanceX: number; distanceY: number }) => void;
};

export class SwipeController implements ReactiveController {
  private initialized = false;
  private initialTouchX = 0;
  private initialTouchY = 0;

  constructor(private host: HTMLElement & ReactiveControllerHost, private options: SwipeControllerOptions) {
    this.host = host;
    host.addController(this);
    this.options = options;
  }

  hostUpdated() {
    if (!this.initialized) {
      this.initialized = true;

      const target = this.options.target();
      target.addEventListener('touchstart', this.handleTouchStart);
      target.addEventListener('touchmove', this.handleTouchMove);
      target.addEventListener('touchend', this.handleTouchEnd);
    }
  }

  hostDisconnected() {
    this.initialized = false;

    const target = this.options.target();
    target.removeEventListener('touchstart', this.handleTouchStart);
    target.removeEventListener('touchmove', this.handleTouchMove);
    target.removeEventListener('touchend', this.handleTouchEnd);
  }

  handleTouchStart = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    this.initialTouchX = touch.pageX;
    this.initialTouchY = touch.pageY;
  };

  handleTouchMove = (event: TouchEvent) => {
    event.preventDefault();
  };

  handleTouchEnd = (event: TouchEvent) => {
    const touch = event.changedTouches[0];
    const distX = touch.pageX - this.initialTouchX; // get horizontal dist traveled
    const distY = touch.pageY - this.initialTouchY; // get vertical dist traveled

    this.options.onSwipeEnd({
      distanceX: distX,
      distanceY: distY,
    });
  };
}

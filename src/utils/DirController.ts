import { ReactiveController, ReactiveControllerHost } from 'lit';

type Dir = 'ltr' | 'rtl';

function documentDirection(): Dir {
  return (document.documentElement.dir as Dir) || 'ltr';
}

export class DirController implements ReactiveController {
  private observer: MutationObserver;
  private _dir: Dir = documentDirection();

  get dir(): Dir {
    return this._dir;
  }

  get isLTR(): boolean {
    return this._dir === 'ltr';
  }

  constructor(private host: ReactiveControllerHost) {
    this.host = host;
    host.addController(this);

    this.observer = new MutationObserver(() => {
      this._dir = documentDirection();
      this.host.requestUpdate();
    });
  }

  hostConnected() {
    this.observer.observe(document.documentElement, {
      attributeFilter: ['dir'],
    });
  }

  hostDisconnected() {
    this.observer.disconnect();
  }
}

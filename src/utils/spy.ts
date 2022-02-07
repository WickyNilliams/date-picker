type SpySubject = (...args: any[]) => any;

const defineGet = <TObj, TReturn>(obj: TObj, name: string, getter: () => TReturn) => {
  Object.defineProperty(obj, name, {
    enumerable: true,
    get: getter,
  });
};

/**
 * Creates a spy for use in tests.
 */
export function createSpy<T extends SpySubject>(fn?: T) {
  const _calls: Parameters<T>[] = [];

  function spy(...args: Parameters<T>): ReturnType<T> {
    _calls.push(args);
    return fn?.(...args);
  }

  defineGet(spy, 'calls', () => _calls);
  defineGet(spy, 'count', () => _calls.length);
  defineGet(spy, 'called', () => _calls.length > 0);
  defineGet(spy, 'first', () => _calls[0]);
  defineGet(spy, 'last', () => _calls[_calls.length - 1]);

  return spy as {
    (...args: Parameters<T>): ReturnType<T>;
    readonly calls: typeof _calls;
    readonly called: boolean;
    readonly count: number;
    readonly first: Parameters<T>;
    readonly last: Parameters<T>;
  };
}

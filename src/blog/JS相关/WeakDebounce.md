```ts
import { uniqId } from './common';

type RetCache = {
  data?: any[];
  time?: Date;
  valid?: boolean;
  error?: Error;
} | null;

class WeakDebounce {
  private cache: Map<string, RetCache> = new Map();

  createWeakDebounceFn<T extends (...args: any[]) => any>(
    fn: T,
    timeOut: number = 3 * 1000,
  ): T {
    const _this = this;
    const _id = uniqId('WeakDebounce');

    return ((...args: any[]) => {
      const now = new Date();

      const fetchData = async () => {
        try {
          _this.cache.set(_id, {
            valid: false,
          });
          const data = await fn(...args);
          _this.cache.set(_id, {
            data,
            time: now,
            valid: true,
          });
          return Promise.resolve(data);
        } catch (error) {
          _this.cache.set(_id, {
            error: error as Error,
          });
          return Promise.reject(error);
        }
      };

      if (_this.cache.get(_id)) {
        const { data, time, valid } = _this.cache.get(_id)!;
        if (valid) {
          if (Number(now) - Number(time) > timeOut) {
            return fetchData();
          }
          return Promise.resolve(data!);
        } else {
          return new Promise((resolve, reject) => {
            const interval = setInterval(() => {
              const cache = _this.cache?.get(_id);
              if (cache?.valid) {
                resolve(cache.data!);
                clearInterval(interval);
              }
              if (cache?.error) {
                reject(cache.error);
                clearInterval(interval);
              }
            }, 300);
          });
        }
      } else {
        return fetchData();
      }
    }) as T;
  }
}

export const weakDebounce = new WeakDebounce();
```

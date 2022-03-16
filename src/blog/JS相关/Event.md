```ts
type Subscription<T> = (val?: T) => void;
type EventType = string;

class EventEmitter<T> {
  map: Record<EventType, Set<Subscription<T>>> = {};

  on(type: EventType, handler: Subscription<T>) {
    this.map[type] = (this.map[type] || new Set()).add(handler);
  }

  emit(type: EventType, data?: T) {
    this.map[type] && this.map[type].forEach(handler => handler(data));
  }

  off(type: EventType, handler?: Subscription<T>) {
    const handlers = this.map[type];
    if (handlers) {
      if (!handler) {
        delete this.map[type];
      } else {
        handlers.delete(handler);
      }
    }
  }
}

export const eventEmitter = new EventEmitter();
```

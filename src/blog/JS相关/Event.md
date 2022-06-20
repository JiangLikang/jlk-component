```ts
type Subscription<T> = (val?: T) => void;
type EventType = string;

class EventEmitter<T> {
  map: Map<EventType, Set<Subscription<T>>> = new Map();
  on(type: EventType, handler: Subscription<T>) {
    this.map.set(type, (this.map.get(type) || new Set()).add(handler));
  }
  emit(type: EventType, data?: T) {
    this.map.get(type)?.forEach(handler => handler(data));
  }
  off(type: EventType, handler?: Subscription<T>) {
    const handlers = this.map.get(type);
    if (handlers) {
      if (handler) {
        handlers.delete(handler);
      } else {
        this.map.delete(type);
      }
    }
  }
}

export const eventEmitter = new EventEmitter();
```

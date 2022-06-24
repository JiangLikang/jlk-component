```ts
type Mission = Function;
type ErrorHandler = (e: Error) => void;

class Scheduler {
  waitTasks: Mission[]; // 待执行的任务队列
  excutingTasks: Mission[]; // 正在执行的任务队列
  maxExcutingNum: number; // 允许同时运行的任务数量
  errorHandler: ErrorHandler; // 错误边界
  constructor(maxExcutingNum: number, errorHandler?: ErrorHandler) {
    this.waitTasks = [];
    this.excutingTasks = [];
    this.maxExcutingNum = maxExcutingNum;
    this.errorHandler = errorHandler || (e => {});
  }

  add(promiseMaker: Mission) {
    if (this.excutingTasks.length < this.maxExcutingNum) {
      this.run(promiseMaker);
    } else {
      this.waitTasks.push(promiseMaker);
    }
  }

  async run(promiseMaker: Mission) {
    const len = this.excutingTasks.push(promiseMaker);
    const index = len - 1;
    try {
      await promiseMaker();
    } catch (e) {
      this.errorHandler(e as Error);
    }
    this.excutingTasks.splice(index, 1);
    if (this.waitTasks.length > 0) {
      this.run(this.waitTasks.shift() as Mission);
    }
  }
}
```

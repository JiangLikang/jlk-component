## 动态加减项组件

```jsx
import React from 'react';
import { Input } from 'antd';
import { DynamicItem } from 'jlk-component';

export default class Demo extends React.Component {
  state = {
    data: [],
  };

  handleChange = dataList => {
    console.log('data:', dataList);
  };

  render() {
    const item = <Input />;
    return <DynamicItem itemRender={item} onChange={this.handleChange} />;
  }
}
```

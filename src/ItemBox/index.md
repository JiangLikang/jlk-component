## 缓存区组件

```jsx
import React from 'react';
import { ItemBox } from 'jlk-component';

const data = [
  { key: '1', label: '数据一' },
  { key: '2', label: '数据二数据二数据二数据二数据二数据二数据二数据二' },
  { key: '3', label: '数据三' },
  { key: '4', label: '数据四' },
  { key: '5', label: '数据五' },
  { key: '6', label: '数据六', disabled: true },
];

export default class Demo extends React.Component {
  state = {
    data: data,
  };

  onDeleteBoxItem = (item, others) => {
    this.setState({ data: others });
    console.log('delete', item);
  };

  render() {
    return <ItemBox data={this.state.data} onClose={this.onDeleteBoxItem} />;
  }
}
```

### API

| 参数    |          说明          |                          类型 | 默认值 |
| ------- | :--------------------: | ----------------------------: | -----: |
| data    |       缓存区数据       |                         Array |   必填 |
| onClose | 缓存区删除某一项的回调 | Function: (item,others) => {} |      - |

### data.Item

缓存区数据对象，是 data 中的一项。

| 参数     |          说明          |    类型 | 默认值 |
| -------- | :--------------------: | ------: | -----: |
| label    |   每项数据展示的标签   |  String |      - |
| key      | 每项数据对应的唯一 key |  String |      - |
| disabled |       是否不可用       | Boolean |  false |

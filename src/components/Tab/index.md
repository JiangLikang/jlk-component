## Tab

```jsx
import React from 'react';
import { Tab } from 'jlk-component';

const options = [
  { key: '1', label: '数据一' },
  { key: '2', label: '数据二' },
  { key: '3', label: '数据三' },
  { key: '4', label: '数据四' },
  { key: '6', label: '数据五', disabled: true },
  {
    key: '5',
    label: '数据六',
    render: () => <span style={{ color: 'green' }}>我是自定义内容</span>,
  },
];

export default class Demo extends React.Component {
  state = {
    options: options,
    activeKey: '2',
  };

  handleChange = checkedValue => {
    this.setState({ activeKey: checkedValue });
    console.log('checkedValue', checkedValue);
  };

  render() {
    return (
      <Tab
        data={this.state.options}
        activeKey={this.state.activeKey}
        onChange={this.handleChange}
      />
    );
  }
}
```

### API

| 参数      |       说明       |                         类型 | 默认值 |
| --------- | :--------------: | ---------------------------: | -----: |
| data      |      选项组      |                        Array |   必填 |
| activeKey |     选中的值     |                       String |      - |
| onChange  | 选项变化时的回调 | Function: checkedValue => {} |      - |

### tabList.Item

选项组数据对象，是 data 中的一项。

| 参数     |          说明          |                      类型 |       默认值 |
| -------- | :--------------------: | ------------------------: | -----------: |
| label    |   每项数据展示的标签   |                    String | 非自定义必填 |
| key      | 每项数据对应的唯一 key |                    String |         必填 |
| disabled |       是否不可用       |                   Boolean |        false |
| render   |       自定义 Dom       | Function: () => ReactNode |            - |

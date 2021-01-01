## 标签型多选组件

```jsx
import React from 'react';
import { CheckButton } from 'jlk-component';

const options = [
  { key: '1', label: '数据一' },
  { key: '2', label: '数据二' },
  { key: '3', label: '数据三' },
  { key: '4', label: '数据四' },
  { key: '5', label: '数据五' },
  { key: '6', label: '数据六', disabled: true },
];

export default class Demo extends React.Component {
  state = {
    options: options,
  };

  handleChange = checkedValue => {
    console.log('checkedValue', checkedValue);
  };

  render() {
    return (
      <CheckButton
        label="选项组"
        options={this.state.options}
        onChange={this.handleChange}
      />
    );
  }
}
```

### API

| 参数     |       说明       |                         类型 | 默认值 |
| -------- | :--------------: | ---------------------------: | -----: |
| options  |      选项组      |                        Array |   必填 |
| onChange | 选项变化时的回调 | Function: checkedValue => {} |      - |

### options.Item

选项组数据对象，是 data 中的一项。

| 参数     |          说明          |    类型 | 默认值 |
| -------- | :--------------------: | ------: | -----: |
| label    |   每项数据展示的标签   |  String |      - |
| key      | 每项数据对应的唯一 key |  String |      - |
| disabled |       是否不可用       | Boolean |  false |

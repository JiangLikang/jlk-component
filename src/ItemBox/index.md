
## 缓存区组件

```jsx
import React from 'react';
import { ItemBox } from 'J-component';

const data = [
  {key: 1, label: '数据一'},
  {key: 2, label: '数据二数据二数据二数据二数据二数据二数据二数据二'},
  {key: 3, label: '数据三'},
  {key: 4, label: '数据四'},
  {key: 5, label: '数据五'},
  {key: 6, label: '数据六'}
]

export default class Demo extends React.Component {
  state = {
    data: data
  }

  onDeleteBoxItem = (item,others) => {
    this.setState({ data: others })
    console.log('delete',item)
  }

  render() {
    return <ItemBox 
              data={this.state.data} 
              onClose={this.onDeleteBoxItem}
            />
  }
}
```


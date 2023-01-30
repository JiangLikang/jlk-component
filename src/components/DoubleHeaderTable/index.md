## 双表头 table

```jsx
import { DoubleHeaderTable } from 'jlk-component';
import React, { memo } from 'react';
import { Input } from 'antd';

const dataSource = [
  {
    fruit: '苹果',
    color: '红',
    size: '大',
  },
  {
    fruit: '香蕉',
    color: '黄',
    size: '小',
  },
];

const renderCell = (value, columnRecord, rowRecord, columnIndex, rowIndex) => {
  const rowHead = rows[rowIndex].dataIndex;
  const columnHead = columnRecord.fruit;
  if (rowHead === 'color') {
    return <Input style={{ width: 200 }} value={value} />;
  } else {
    return <div>{value}</div>;
  }
};

const columns = dataSource.map(d => ({
  title: <div>{d.fruit}</div>,
  dataIndex: d.fruit,
}));

const rows = [
  {
    title: <div>颜色</div>,
    dataIndex: 'color',
  },
  {
    title: <div>大小</div>,
    dataIndex: 'size',
  },
];

export default memo(() => {
  return (
    <DoubleHeaderTable
      rowKey={(_, idx) => idx}
      columnTitle={<div>商品</div>}
      columns={columns}
      rowTitle={<div>属性</div>}
      rows={rows}
      renderCell={renderCell}
      dataSource={dataSource}
    />
  );
});
```

### API

| 参数        |       说明       |                                                             类型 | 默认值 |
| ----------- | :--------------: | ---------------------------------------------------------------: | -----: |
| rowKey      |   渲染 key 值    |                                                 (\_, idx) => any |   必填 |
| columnTitle |      列标题      |                                                           String |   必填 |
| columns     |      列表头      |                        { title: ReactNode, dataIndex: String }[] |   必填 |
| rowTitle    |      行标题      |                                                           String |   必填 |
| rows        |      行表头      |                        { title: ReactNode, dataIndex: String }[] |   必填 |
| renderCell  | 自定义渲染单元格 | (value,columnRecord,rowRecord,columnIndex,rowIndex) => ReactNode |   必填 |
| dataSource  |      数据源      |                                                            any[] |   必填 |

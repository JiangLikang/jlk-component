import React, { useState, useEffect } from 'react';
import { Icon, message } from 'antd';
import styles from './index.less';

export default ({ itemRender, errMsg, onChange }) => {
  const [dataList, setDataList] = useState([
    { id: Math.random(), key: undefined, value: undefined },
  ]);
  useEffect(() => {
    onChange(dataList);
  }, [dataList]);

  const addItem = id => {
    let List = [...dataList];
    List.forEach((item, index) => {
      if (item.id == id) {
        List.splice(index + 1, 0, {
          id: Math.random(),
          key: undefined,
          value: undefined,
        });
      }
    });
    setDataList(List);
  };

  const deleteItem = id => {
    let List = [...dataList].filter(v => v.id != id);
    if (!!!List.length) {
      message.info(errMsg || '必须有一个数据项');
      return;
    }
    setDataList(List);
  };

  return (
    <div className={styles.container}>
      {dataList.map(v => (
        <div className={styles.item} key={v.id}>
          <div className={styles.itemContent}>{itemRender}</div>
          <div key={v.id} className={styles.btn}>
            <Icon
              type="plus"
              style={{ marginRight: 16, cursor: 'pointer' }}
              onClick={addItem.bind(this, v.id)}
            />
            <Icon
              type="minus"
              style={{ marginRight: 16, cursor: 'pointer' }}
              onClick={deleteItem.bind(this, v.id)}
            />
          </div>
        </div>
      ))}
    </div>
  );
};

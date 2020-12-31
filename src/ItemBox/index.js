import React, { Component } from 'react';
import styles from './index.less';
import { Icon, Tooltip } from 'antd'
import 'antd/dist/antd.css';

class Index extends Component {
  constructor(props) {
    super(props)
  }

  handleItemClick = item => {
    const { data, onClose } = this.props
    let others = data.filter(i => i.key!==item.key)
    onClose && onClose(item, others)
  }

  render() {
    const { data } = this.props
    return (
      <div className={styles.container}>
        {
          data.map(item => {
            return (
              <div className={styles.item} key={item.key}>
                {
                  item.label.length>20?
                  <Tooltip placement="top" title={item.label}>
                    <span className={styles.label}>{item.label.substring(0,20)+'...'}</span>
                  </Tooltip>:
                  <span className={styles.label}>{item.label}</span>
                }
                <Icon type="close" onClick={this.handleItemClick.bind(this,item)} className={styles.close}/>
              </div>
            )
          })
        }
      </div>
    )
  }
}

export default Index;
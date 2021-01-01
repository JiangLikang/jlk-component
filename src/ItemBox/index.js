import React, { Component } from 'react';
import styles from './index.less';
import { Icon, Tooltip } from 'antd';
import classnames from 'classnames';
import 'antd/dist/antd.css';
import PropTypes from 'prop-types';

class Index extends Component {
  constructor(props) {
    super(props);
  }

  handleItemClick = item => {
    if (item.disabled) {
      return;
    }
    const { data, onClose } = this.props;
    let others = data.filter(i => i.key !== item.key);
    onClose && onClose(item, others);
  };

  render() {
    const { data } = this.props;
    return (
      <div className={styles.container}>
        {data.map(item => {
          return (
            <div
              className={classnames(
                styles.item,
                item.disabled ? styles.disableItem : '',
              )}
              key={item.key}
            >
              {item.label.length > 20 ? (
                <Tooltip placement="top" title={item.label}>
                  <span className={styles.label}>
                    {item.label.substring(0, 20) + '...'}
                  </span>
                </Tooltip>
              ) : (
                <span className={styles.label}>{item.label}</span>
              )}
              <Icon
                type="close"
                onClick={this.handleItemClick.bind(this, item)}
                className={classnames(
                  styles.close,
                  item.disabled ? styles.disableItem : '',
                )}
              />
            </div>
          );
        })}
      </div>
    );
  }
}

Index.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  onClose: PropTypes.func,
};

export default Index;

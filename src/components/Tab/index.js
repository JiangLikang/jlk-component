import React from 'react';
import classnames from 'classnames';
import styles from './index.less';
import PropTypes from 'prop-types';

const Index = ({ data, activeKey, onChange, ...rest }) => {
  const handleChange = item => {
    if (item.disabled) {
      return;
    }
    onChange(item.key);
  };

  return (
    <div className={styles.container} {...rest}>
      {data.map(item => (
        <div
          key={item.key}
          className={styles.tabItem}
          onClick={handleChange.bind(this, item)}
        >
          <div
            className={classnames(
              styles.itemContent,
              item.key == activeKey ? styles.activeItem : '',
              item.disabled ? styles.disabled : '',
            )}
          >
            <span
              className={classnames(
                styles.label,
                item.key == activeKey ? styles.activeTabKey : '',
              )}
            >
              {item.render ? item.render() : item.label}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
};

Index.propTypes = {
  data: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
      render: PropTypes.func,
    }),
  ).isRequired,
  activeKey: PropTypes.string,
  onChange: PropTypes.func,
};

export default Index;

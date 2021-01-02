import React, { Component } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import PropTypes, { element } from 'prop-types';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  handleOptionClick = option => {
    if (option.disabled) {
      return;
    }
    const { onChange, multiple, selectedKeys } = this.props;

    if (multiple) {
      let resKeys = [];
      if (selectedKeys.some(v => v === option.key)) {
        resKeys = selectedKeys.filter(i => i !== option.key);
      } else {
        resKeys = selectedKeys.concat([option.key]);
      }
      onChange && onChange(resKeys);
    } else {
      onChange && onChange(option.key);
    }
  };

  render() {
    const { label, options, multiple, selectedKey, selectedKeys } = this.props;

    const Options =
      Array.isArray(options) &&
      options.map(item => {
        let isSelect = multiple
          ? selectedKeys.some(v => v === item.key)
          : selectedKey === item.key;
        return (
          <div
            className={classnames(
              isSelect ? styles.optionItemActive : '',
              styles.optionItem,
              item.disabled ? styles.optionItemDisable : '',
            )}
            onClick={this.handleOptionClick.bind(this, item)}
            key={item.key}
          >
            {item?.label}
          </div>
        );
      });
    return (
      <div className={styles.container}>
        {label ? <div className={styles.label}>{label}:</div> : null}
        <div className={styles.group}>{Options}</div>
      </div>
    );
  }
}

Index.propTypes = {
  options: PropTypes.arrayOf(
    PropTypes.shape({
      label: PropTypes.string.isRequired,
      key: PropTypes.string.isRequired,
      disabled: PropTypes.bool,
    }),
  ).isRequired,
  label: PropTypes.string,
  selectedKey: PropTypes.oneOfType([PropTypes.string.isRequired]),
  selectedKeys: PropTypes.arrayOf(PropTypes.string.isRequired),
  multiple: PropTypes.bool,
  onChange: PropTypes.func,
};

export default Index;

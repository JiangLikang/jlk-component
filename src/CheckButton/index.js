import React, { Component } from 'react';
import styles from './index.less';
import classnames from 'classnames';
import PropTypes from 'prop-types';

class Index extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedKeys: [],
    };
  }

  handleOptionClick = option => {
    if (option.disabled) {
      return;
    }
    const { onChange } = this.props;
    const { selectedKeys } = this.state;
    let resKeys = [];
    if (selectedKeys.some(v => v === option.key)) {
      resKeys = selectedKeys.filter(i => i !== option.key);
    } else {
      resKeys = selectedKeys.concat([option.key]);
    }
    this.setState({ selectedKeys: resKeys });
    onChange && onChange(resKeys);
  };

  render() {
    const { label, options } = this.props;
    const { selectedKeys } = this.state;
    const Options = options.map(item => {
      let isSelect = selectedKeys.some(v => v === item.key);
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
        <div className={styles.label}>{label}:</div>
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
  onChange: PropTypes.func,
};

export default Index;

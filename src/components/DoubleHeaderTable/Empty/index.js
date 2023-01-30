import React, { memo } from 'react';
import classNames from 'classnames';
import css from './style.less';

export const Empty = memo(
  ({ className, text = '暂无数据', visible = true, height: H }) => {
    const style = {
      ...(visible ? {} : { display: 'none' }),
      ...(H ? { height: H } : {}),
    };
    return (
      <div className={classNames(css.empty, className)} style={style}>
        <img
          alt={text}
          className={css.img}
          // src={require("@/images/empty.png").default}
        />
        <span className={css.text}>{text}</span>
      </div>
    );
  },
);

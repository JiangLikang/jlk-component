import React, { memo, useMemo } from 'react';
import css from './index.less';
import classNames from 'classnames';
import { Empty } from './Empty';
import { Table } from 'antd';

const LeftTopHeader = memo(({ columnTitle, rowTitle }) => (
  <div className={css.leftTopHeaderWp}>
    <div className={css.leftTopHeader}>
      <div className={classNames(css.textRight, css.lineHeightAuto)}>
        {columnTitle}
      </div>
      <div className={css.lineHeightAuto}>{rowTitle}</div>
    </div>
    <div className={css.leftTopHeaderBg} />
  </div>
));

const CellWp = memo(({ children }) => (
  <div className={css.cellWp}>{children}</div>
));

export default memo(props => {
  const {
    rows,
    columnTitle,
    rowTitle,
    dataSource: propsDataSource = [],
    columns: propsColumns = [],
    className,
    cornerWidth = 180,
    renderCell,
    ...rest
  } = props;

  const noData =
    !rows.length || !propsColumns.length || !propsDataSource.length;

  const columns = useMemo(
    () => [
      {
        title: <LeftTopHeader columnTitle={columnTitle} rowTitle={rowTitle} />,
        dataIndex: 'rows',
        fixed: true,
        width: cornerWidth,
        render: (_, record, index) => <CellWp>{rows[index].title}</CellWp>,
      },
      ...propsColumns.map((column, cIndex) => ({
        ...column,
        title: <CellWp>{column.title}</CellWp>,
        render: (_, record, index) => (
          <CellWp>
            {renderCell?.(_, propsDataSource[cIndex], record, cIndex, index) ||
              _}
          </CellWp>
        ),
      })),
    ],
    [rows, columnTitle, rowTitle, propsColumns],
  );

  const dataSource = useMemo(
    () =>
      rows.map(({ dataIndex }) =>
        propsDataSource.reduce(
          (pre, cur, index) => ({
            ...pre,
            [propsColumns[index].dataIndex]: cur[dataIndex],
          }),
          {},
        ),
      ),
    [rows, propsColumns, propsDataSource],
  );

  return (
    <div className={classNames(css.wrapper, className)}>
      {noData ? (
        <div className={css.emptyWp}>
          <Empty />
        </div>
      ) : (
        <Table
          {...rest}
          columns={columns}
          dataSource={dataSource}
          bordered
          size="large"
          pagination={false}
        />
      )}
    </div>
  );
});

import React, { memo, ReactNode, useCallback } from 'react';
import { Button as SourceButton } from 'antd';
import { ButtonProps } from 'antd/lib/button';

export const Button = memo((props: ButtonProps) => <SourceButton {...props} />);

export const Submit = memo((props: ButtonProps) => {
  const { type, ...rest } = props;
  return <SourceButton type="primary" {...rest} />;
});

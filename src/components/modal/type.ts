import React, { FunctionComponent, NamedExoticComponent } from 'react';

export type ShortcutConfig = {
  width?: number;
  title: string;
  content: string | JSX.Element;
  okText?: string;
  cancelText?: string;
  closable?: boolean;
  onOk?: () => void;
};

export type Shortcuts = {
  info(config: ShortcutConfig): Promise<boolean>;
  success(config: ShortcutConfig): Promise<boolean>;
  error(config: ShortcutConfig): Promise<boolean>;
  warn(config: ShortcutConfig): Promise<boolean>;
  confirm(config: ShortcutConfig): Promise<boolean>;
};

export type ModalType = NamedExoticComponent & Shortcuts;

export type ButtonClickEventHandler = (
  e: React.MouseEvent<HTMLInputElement>,
) => any;

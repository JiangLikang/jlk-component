## Dialog

### 基本用法
```jsx
import React from 'react';
import { Dialog, withGlobalDialogs, useDialogMethods } from 'jlk-component';
import { Button } from 'antd';

const TipModal = props => {
  const { closeDialog, params } = props;
  return (
    <Dialog
      title="标题"
      onOk={() => closeDialog(params)}
      onCancel={() => closeDialog(null)}
      width={580}
    >
      <div style={{ height: 80, textAlign: 'center', lineHeight: '80px' }}>
        我是个弹框
      </div>
    </Dialog>
  );
};

export default withGlobalDialogs(() => {
  const [openDialog] = useDialogMethods();
  const handleOpenDialog = async () => {
    const res = await openDialog(TipModal, { data: 1 });
    console.log(res);
  };
  return <Button onClick={handleOpenDialog}>点击我试试</Button>;
});
```

### 添加拦截器
```jsx
import React from 'react';
import { Dialog, withGlobalDialogs, useDialogMethods } from 'jlk-component';
import { Button, message } from 'antd';

const TipModal = props => {
  const { closeDialog, params } = props;
  return (
    <Dialog
      title="标题"
      onOk={() => closeDialog({ data: params.data + 1 })}
      onCancel={() => closeDialog(null)}
      width={580}
    >
      <div style={{ height: 80, textAlign: 'center', lineHeight: '80px' }}>
        我是个弹框
      </div>
    </Dialog>
  );
};

export default withGlobalDialogs(() => {
  const [openDialog] = useDialogMethods();
  const handleOpenDialog = async () => {
    const res = await openDialog(TipModal, { data: 1 }, (ret) => {
      if (ret?.data < 5) {
        message.warning('结果不能小于5')
        return false;
      }
      return true
    });
  };
  return <Button onClick={handleOpenDialog}>点击我试试</Button>;
});
```

### API

```ts
type DialogProps = {
  readonly title?: string | JSX.Element;
  readonly bodyStyle?: Record<string, any>;
  readonly visible?: boolean;
  readonly footer?: ReactNode | boolean;
  readonly onOk?: (e: React.MouseEvent<any>) => void;
  readonly okText?: string;
  readonly cancelText?: string;
  readonly onCancel?: () => void;
  readonly onFootCancel?: () => void;
  readonly children: ReactNode;
  readonly width?: number | string;
  readonly wrapClassName?: string;
  readonly okButtonProps?: ButtonProps;
  readonly cancelButtonProps?: ButtonProps;
  readonly closable?: boolean;
  readonly params?: any;
  readonly okType?: ButtonType;
  readonly comfirmLoading?: boolean;
  readonly getContainer?: string | HTMLElement | getContainerFunc | false;
};
```

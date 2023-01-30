import React, {
  Context,
  useContext,
  useEffect,
  useRef,
  ComponentType,
  FunctionComponent,
  ReactNode,
  useState,
  useMemo,
  memo,
  useCallback,
} from 'react';
import { ConfigProvider, Modal as AntModal } from 'antd';
import zh_CN from 'antd/es/locale/zh_CN';

import { ButtonProps, ButtonType } from 'antd/lib/button';
import { Button, Submit } from '@/components/button';
import css from './style.less';

enum DialogStatus {
  open,
  close,
}

type FnCallback = (...args: any[]) => any;

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

declare type getContainerFunc = () => HTMLElement;

interface DialogBinder {
  runResolvers: (...args: any[]) => any;
}

declare type FCLike<T = void> = (props: DialogDeployProps<T>) => JSX.Element;

class StatusResolver<T, R, P> {
  type: FCLike<T> | ComponentType<DialogDeployProps<T, R>>;

  status: DialogStatus;

  resolve?: FnCallback;

  params?: T | P;

  constructor(
    type: FCLike<T> | ComponentType<DialogDeployProps<T, R>>,
    status: DialogStatus,
    resolve: FnCallback,
    params?: T | P,
  ) {
    this.type = type;
    this.status = status;
    this.resolve = resolve;
    this.params = params;
  }

  changeStatus(status: DialogStatus, params?: T | P, resolve?: FnCallback) {
    this.status = status;
    if (resolve) {
      this.params = params !== undefined ? (params as T) : undefined;
      this.resolve = resolve;
      return;
    }
    if (this.resolve) {
      this.resolve(params);
      this.resolve = undefined;
    }
  }

  destroy() {
    if (this.resolve) {
      this.resolve();
      this.params = undefined;
      this.resolve = undefined;
    }
  }
}

class DialogResolver {
  private statusResolvers: Array<StatusResolver<any, any, any>> = [];

  put<T = unknown, R = unknown, P = unknown>(
    newType: FCLike<T> | ComponentType<DialogDeployProps<T, R>>,
    status: DialogStatus,
    params?: P,
    resolve?: FnCallback,
  ): void {
    const sameTypeResolver = this.statusResolvers.find(
      ({ type }) => type === newType,
    );
    if (sameTypeResolver) {
      sameTypeResolver.changeStatus(status, params, resolve);
      return;
    }
    if (resolve) {
      this.statusResolvers.push(
        new StatusResolver(newType, status, resolve, params),
      );
    }
  }

  destroy(): void {
    this.statusResolvers.forEach(resolver => {
      resolver.destroy();
    });
    this.statusResolvers = [];
  }

  getStatusResolvers(): Array<StatusResolver<any, any, any>> {
    return this.statusResolvers;
  }
}

/**
 * dialog操作器，拥有openDialog打开弹窗，closeDialog关闭弹窗方法
 */
export class DialogDeploy {
  private dialogResolver: DialogResolver = new DialogResolver();

  private binder?: DialogBinder;

  register(binder: DialogBinder): void {
    this.binder = binder;
    this.resolve();
  }

  private resolve(): void {
    const { binder } = this;
    if (!binder) {
      return;
    }
    binder.runResolvers();
  }

  /**
   * 打开弹窗,返回Promise
   *
   * @param type  需要打开组件的class或function
   * @param params  窗口入参，将映射到窗口组件的props.params字段上
   */
  openDialog = <T, R>(
    type: FCLike<T> | ComponentType<DialogDeployProps<T, R>>,
    params?: T,
  ): Promise<R> =>
    new Promise<R>(resolve => {
      this.dialogResolver.put(type, DialogStatus.open, params, resolve);
      this.resolve();
    });

  /**
   * 关闭窗口，必须先调用openDialog，该方法是对openDialog返回Promise的resolve
   *
   * @param type  需要关闭组件的class或function
   * @param params  窗口关闭出参，通过resolve同type的Promise（通过openDialog产生的）传出数据
   */
  closeDialog = <P, T>(
    type: FCLike<T> | ComponentType<DialogDeployProps<T>>,
    params?: P,
  ): void => {
    this.dialogResolver.put(type, DialogStatus.close, params);
    this.resolve();
  };

  destroy(): void {
    this.dialogResolver.destroy();
    this.resolve();
  }

  getStatusResolvers(): Array<StatusResolver<any, any, any>> {
    return this.dialogResolver.getStatusResolvers();
  }
}

class ContextDriver {
  visibleChange?: FnCallback;

  closeAfterChange?: FnCallback;

  visible: boolean;

  constructor(visible: boolean) {
    this.visible = visible;
  }

  subscribeVisibleChange = visibleChange => {
    this.visibleChange = visibleChange;
  };

  subscribeCloseAfterChange = closeAfterChange => {
    this.closeAfterChange = closeAfterChange;
  };
}

const DialogsContext: Context<ContextDriver> = React.createContext(
  new ContextDriver(false),
);

interface DialogHookProps {
  readonly params: unknown;
  readonly controller: DialogDeploy;
  readonly visible: boolean;
  readonly type: ComponentType<DialogDeployProps<unknown>>;
}

export type OpenDialogCallback = <T = unknown, R = unknown, P extends T = T>(
  type: ComponentType<DialogDeployProps<T, R>>,
  params?: P,
) => Promise<R>;

export type CloseDialogCallback = <T = unknown, R = unknown>(
  type: ComponentType<DialogDeployProps<T>>,
  params?: R,
) => void;

/**
 * 为了让使用者可以将Dialog手写到自定义组件中，又不希望通过props透传visible这样的被托管信息数据（增加灵活性和易用度），
 * 还要在弹窗完全关闭后模拟组件销毁功能（注意弹窗Dialog关闭只能销毁Dialog的children，而使用Dialog的class实例不能被销毁），
 * 需要有DialogHook这样采用Context技术的中间垫片层组件，通过Context直接和调用者使用的Dialog进行对话管理visible状态，
 * 并通过监听Dialog的afterClose去检测Dialog是否完全关闭，如果完全关闭则代替用户销毁整个class实例
 */
const DialogHook = memo((props: DialogHookProps) => {
  const { visible, type, params, controller } = props;
  const [isDialogClosed, setDialogClosed] = useState(!visible);
  const driverRef = useRef(new ContextDriver(visible));
  const driver = driverRef.current;

  useEffect(() => {
    const closeAfterChange = () => {
      setDialogClosed(true);
    };
    driverRef.current.subscribeCloseAfterChange(closeAfterChange);
    return () => {
      driverRef.current.subscribeCloseAfterChange(undefined);
    };
  }, []);

  useEffect(() => {
    const { visibleChange } = driverRef.current;
    if (visibleChange) {
      visibleChange(visible);
    }
  }, [visible]);

  useEffect(() => {
    if (visible) {
      setDialogClosed(false);
    }
  }, [visible]);

  const handleCancel = useCallback(
    (p?: unknown) => {
      controller.closeDialog(type, p);
    },
    [controller, type],
  );

  function renderChild() {
    const TargetComponent = type as FunctionComponent<
      DialogDeployProps<unknown>
    >;
    return visible || !isDialogClosed ? (
      <TargetComponent
        params={params}
        controller={controller}
        type={type}
        closeDialog={handleCancel}
      />
    ) : null;
  }

  return (
    <DialogsContext.Provider value={driver}>
      {renderChild()}
    </DialogsContext.Provider>
  );
});

export interface DialogsProps {
  readonly dialogDeploy: DialogDeploy;
}

const GlobalContent: Context<DialogDeploy> = React.createContext(
  new DialogDeploy(),
);

/**
 * dialog管理器高阶组件，加上该高阶组件后，通过高阶组件入参control.openDialog打开的弹窗都会跟随该高阶组件一起销毁，
 * 对整个app的顶层组件加上该高阶组件，并不传入control（相当于使用默认全局control）,这时候便开启了全局模式，
 * 全局模式的弹窗随location的变化自动销毁
 *
 * @param TargetComponent （可选）不传则开启全局模式；传入new DialogController
 */
function withDialogs<P extends Record<string, unknown>>(
  TargetComponent: ComponentType<P & DialogsProps>,
): FunctionComponent<P> {
  return (props: P) => {
    const ref = useRef(new DialogDeploy());

    const [version, setVersion] = useState(0);

    useEffect(() => {
      ref.current.register({
        runResolvers: () => setVersion(v => v + 1),
      });
    }, []);

    const dialogs = useMemo(() => {
      const controller = ref.current;
      const statusResolvers: Array<StatusResolver<
        any,
        any,
        any
      >> = controller.getStatusResolvers();
      return statusResolvers.map(({ status, type, params }, index) => (
        <DialogHook
          visible={status === DialogStatus.open}
          type={type}
          params={params}
          key={`${index.toString()}`}
          controller={controller}
        />
      ));
    }, [version]);

    const Target = TargetComponent as FunctionComponent<P & DialogsProps>;

    return (
      <GlobalContent.Provider value={ref.current}>
        <Target {...(props as P)} dialogDeploy={ref.current} />
        {dialogs}
      </GlobalContent.Provider>
    );
  };
}

export function withGlobalDialogs<P extends Record<string, unknown>>(
  TargetComponent: FunctionComponent<P & DialogsProps>,
): ComponentType<P> {
  return withDialogs(TargetComponent);
}

export const useDialogMethods = (): [
  OpenDialogCallback,
  CloseDialogCallback,
] => {
  const openings = useRef(
    new Set<FCLike<any> | ComponentType<DialogDeployProps<any, any>>>(),
  );
  const deploy = useContext(GlobalContent);

  useEffect(
    () => () => {
      openings.current.forEach(type => {
        deploy.closeDialog(type);
      });
    },
    [],
  );

  async function openDialog<T = unknown, R = unknown, P extends T = T>(
    type: FCLike<T> | ComponentType<DialogDeployProps<T, R>>,
    params?: P,
  ): Promise<R> {
    openings.current.add(type);
    const result: R = await deploy.openDialog(type, params);
    if (openings.current.has(type)) {
      openings.current.delete(type);
    }
    return result;
  }

  function closeDialog<T = unknown, P = unknown>(
    type: FCLike<T> | ComponentType<DialogDeployProps<T>>,
    params?: P,
  ) {
    return deploy.closeDialog(type, params);
  }

  return [openDialog, closeDialog];
};

const renderDefaultFooter = (
  onOk?: (e: React.MouseEvent<any>) => void,
  onCancel?: () => any,
  okText = '确定',
  cancelText = '取消',
  okButtonProps?: ButtonProps,
  cancelButtonProps?: ButtonProps,
  comfirmLoading?: boolean,
) => {
  const handleCancel = () => {
    if (!onCancel) {
      return;
    }
    onCancel();
  };

  const okDisabled = okButtonProps && okButtonProps.disabled;
  const cancelDisabled = cancelButtonProps && cancelButtonProps.disabled;

  return (
    <div className={css.footer}>
      {cancelText && (
        <Button
          className={css.button}
          onClick={handleCancel}
          disabled={cancelDisabled}
        >
          {cancelText}
        </Button>
      )}
      {okText && (
        <Submit
          className={css.button}
          onClick={onOk}
          disabled={okDisabled}
          loading={comfirmLoading}
        >
          {okText}
        </Submit>
      )}
    </div>
  );
};

/**
 * ant design modal的替代品
 *
 * 1、用于判断dialog是否完全关闭，方便 DialogHook 销毁完全关闭的弹窗组件
 * 2、onCancel绕过了modal的onCancel，因此即便把closeDialog方法赋值给props.onCancel也不会在关闭的时候接到一个htmlEvent对象
 * 3、统一托管visible状态，使用者不需要为其赋props值
 */
const DialogUsage = memo((props: DialogProps & DialogsProps) => {
  const [visible, setVisible] = useState(false);

  const context = useContext(DialogsContext);

  const {
    children,
    onOk,
    onCancel,
    onFootCancel,
    okText,
    cancelText,
    okButtonProps,
    cancelButtonProps,
    footer,
    comfirmLoading,
    ...other
  } = props;

  useEffect(() => {
    const visibleChange = (vs: boolean): void => {
      setVisible(vs);
    };
    const { visible: vs, subscribeVisibleChange } = context;
    subscribeVisibleChange(visibleChange);
    visibleChange(vs);
    return () => {
      subscribeVisibleChange(undefined);
    };
  }, []);

  const handleCancel = useCallback(() => {
    if (onCancel) {
      onCancel();
    }
  }, [onCancel]);

  const foo =
    footer !== undefined
      ? footer
      : renderDefaultFooter(
          onOk,
          onFootCancel || onCancel,
          okText,
          cancelText,
          okButtonProps,
          cancelButtonProps,
          comfirmLoading,
        );
  return (
    <AntModal
      visible={visible}
      {...other}
      footer={foo}
      onCancel={handleCancel}
      destroyOnClose
      afterClose={context.closeAfterChange}
      maskClosable={false}
      keyboard
      centered
    >
      <ConfigProvider locale={zh_CN}>
        <GlobalContent.Provider value={props.dialogDeploy}>
          {children}
        </GlobalContent.Provider>
      </ConfigProvider>
    </AntModal>
  );
});

export const Dialog = withDialogs<DialogProps>(
  DialogUsage,
) as FunctionComponent<DialogProps>;

/**
 * 弹窗组件class的props类型
 */
export interface DialogDeployProps<T = void, R = unknown> {
  // 入参
  readonly params: T;
  // 组件class类型，==当前使用的class，用来避免model引class,class又引model的情况
  readonly type: ComponentType<DialogDeployProps<T>>;
  // 当前的DialogController实例，有openDialog/closeDialog方法，
  // 如果使用的全局模式，那这项就没什么意义了
  readonly controller: DialogDeploy;
  // 关闭弹窗方法
  readonly closeDialog: (e?: R) => void;
}

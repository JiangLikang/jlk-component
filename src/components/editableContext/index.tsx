import React, { PropsWithChildren, memo, useRef } from "react";
import useMergeState from "@/hooks/useMergeState";
import style from "./style.less";
import { BoardProps, Context, EditorProps, Props } from "./type";
import useSafeState from "@/hooks/useSafeState";
import { usePersistFn } from "@/hooks/usePersistFn";
import useDebounceFn from "@/hooks/useDebounceFn";
import useMount from "@/hooks/useMount";
import { Input } from "antd";
import StatusWrapper from "antd/lib/form/FormItem";

const { TextArea } = Input;

const Editor = memo(
  ({
    value,
    textareaOptions,
    errMsg,
    onOk,
    onCancel,
    okText,
    cancelText,
  }) => {
    const [form, setForm] = useMergeState(value || {});
    const { text } = form;
    const textAreaRef = useRef();

    useMount(() => textAreaRef.current?.focus({ cursor: 'end' }));

    const handleChangeForm = usePersistFn((partForm) =>
      setForm({ ...form, ...partForm })
    );

    const handleSave = usePersistFn(() => onOk(form));

    return (
      <>
        <TextArea
          ref={textAreaRef}
          value={text}
          onChange={({ target: { value: text } }) => handleChangeForm({ text })}
          autoSize
          autoFocus
          status={errMsg ? 'error' : undefined}
          {...textareaOptions}
        />
        {errMsg ? <span className={style.errMsg}>{errMsg}</span> : null}
        <div className={style.editorFooter}>
          <a onClick={handleSave}>{okText}</a>
          <a onClick={onCancel}>{cancelText}</a>
        </div>
      </>
    );
  }
);

const Board = memo(({ value, empty = "暂无内容" }) => {
  const { text } = value;
  const noData = Object.values(value).every((v) => !v);
  return (
    <>
      {text ? <span>{text}</span> : null}
      {noData ? <span>{empty}</span> : null}
    </>
  );
});

export default memo(
  ({
    value,
    textareaOptions,
    empty,
    children,
    onChange,
    validator,
    okText = '保存',
    cancelText = '取消',
    ...rest
  }) => {
    const [editing, setEditing] = useSafeState(false);
    const [errMsg, setErrMsg] = useSafeState();

    const handleTrigger = usePersistFn(() => !editing && setEditing(true));

    const handleOk = useDebounceFn(async (form) => {
      try {
        const msg = await validator?.(form);
        if (msg) {
          setErrMsg(msg);
          return;
        }
        await onChange?.(form);
        handleExit();
      } catch (error) {
        uiPrompt.current.error(error);
      }
    });

    const handleExit = usePersistFn(() => {
      setEditing(false);
      setErrMsg(undefined);
    });

    return (
      <div className={style.wrapper} onClick={handleTrigger} {...rest}>
        {editing ? (
          <Editor
            value={value || {}}
            onOk={handleOk}
            onCancel={handleExit}
            textareaOptions={textareaOptions}
            errMsg={errMsg}
            okText={okText}
            cancelText={cancelText}
          />
        ) : (
          children || (
            <Board
              value={
                value ||
                {}
              }
              empty={empty}
            />
          )
        )}
      </div>
    );
  }
);

import { TextAreaProps } from "@/components/widgets/input/type";
import { FormComProps } from "@/types/form";
import { ReactNode } from "react";

export type Context = {
  text?: string;
};

type EditorInjectProps = {
  textareaOptions?: TextAreaProps;
  okText?: string;
  cancelText?: string;
};

type BoardInjectProps = {
  empty?: ReactNode;
};

export type Props = FormComProps<Context> &
  EditorInjectProps &
  BoardInjectProps & {
    validator?: (form: Context) => string | Promise<string> | undefined;
  };

export type EditorProps = EditorInjectProps & {
  value: Context;
  errMsg?: string;
  onOk: (v: Context) => void;
  onCancel: () => void;
};

export type BoardProps = Pick<EditorProps, "value"> & BoardInjectProps;

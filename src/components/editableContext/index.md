## EditableContext

### 基础用法
```jsx
import React, { memo, useState } from "react";
import { EditableContext } from 'jlk-component';

export default memo(() => {
  const [value, setValue] = useState({
    text: "我是一段内容",
  });

  return <EditableContext value={value} onChange={setValue} />
});

```

### 自定义校验
```jsx
import React, { memo, useState } from "react";
import { EditableContext } from 'jlk-component';

export default memo(() => {
  const [value, setValue] = useState({
    text: "我是一段内容",
  });

  const validator = (value) => {
    if ((value.text || "").length > 10) return "字数不可大于10";
  };

  return (
    <EditableContext
      value={value}
      onChange={(v) => setValue(v)}
      validator={validator}
    />
  )
});

```

### 自定义textarea属性
```jsx
import React, { memo, useState } from "react";
import { EditableContext } from 'jlk-component';

export default memo(() => {
  const [value, setValue] = useState({
    text: "我是一段内容",
  });

  return (
    <EditableContext
      value={value}
      onChange={setValue}
      textareaOptions={{
        maxLength: 10,
        showCount: true,
        autoSize: { minRows: 4 },
      }}
    />
  )
});

```

### 自定义展示模板
```jsx
import React, { memo, useState } from "react";
import { EditableContext } from 'jlk-component';

export default memo(() => {
  const [value, setValue] = useState({
    text: "我是一段内容",
  });

  return (
    <EditableContext value={value} onChange={setValue}>
      <a>{value?.text}</a>
    </EditableContext>
  )
});

```

### 自定义空状态
```jsx
import React, { memo, useState } from "react";
import { EditableContext } from 'jlk-component';

export default memo(() => {
  const [value, setValue] = useState({});

  return (
   <EditableContext
      value={value}
      onChange={setValue}
      empty={<h3>没有数据了。。。</h3>}
    />
  )
});

```

### API
```ts
type Context = { text?: string; };

type Props = {
  value: Context;
  onChange: (v?: Context) => void | Promise<void> | undefined;
  empty?: ReactNode;
  textareaOptions?: TextAreaProps;
  okText?: string;
  cancelText?: string;
  errMsg?: string;
  validator?: (form: Context) => string | Promise<string> | undefined;
}
```
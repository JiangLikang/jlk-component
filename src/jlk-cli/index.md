# jlk-cli 脚手架

项目初始化脚手架，用于根据模板初始化项目。

## 安装

```bash
npm install jlk-cli -g
```

## 使用

安装完成后终端执行`jlk`查看命令

## API

| 命令                                   |       功能       |
| -------------------------------------- | :--------------: |
| jlk add                                |     新增模板     |
| jlk delete                             |     删除模板     |
| jlk list                               |   查看模板列表   |
| jlk init [template-name][project-name] | 从模板初始化工程 |

> 注意模板必须是上传在 github 上，且模板地址填写格式为 github 仓库子路由，如：原仓库地址`https://github.com/atlassian/react-beautiful-dnd/`对应填写地址为:`atlassian/react-beautiful-dnd`

## 更新日志

| 版本   |  作者  |   改动   |
| ------ | :----: | :------: |
| v1.0.0 | 江丽康 | 首次发布 |

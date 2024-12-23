# 智能链接识别助手 (Smart Link Detector)

一个轻量级的油猴脚本，让你能够即时识别并打开文本中的链接。只需选中文本，脚本就会自动识别其中的URL并提供便捷的跳转选项。

![version](https://img.shields.io/badge/version-0.1-blue)
![license](https://img.shields.io/badge/license-MIT-green)

## ✨ 主要特性

- 🔍 智能识别文本中的各种URL格式
- 🎯 支持同时识别多个链接
- 🌐 一键在新标签页打开链接
- 🎨 优雅的半透明黑色弹窗UI
- 🚀 零配置，开箱即用
- 🔒 无需额外权限

## 📦 安装

1. 首先安装 [Tampermonkey](https://www.tampermonkey.net/)
2. [点击这里安装脚本](https://greasyfork.org/zh-CN/scripts/521524-%E6%99%BA%E8%83%BD%E9%93%BE%E6%8E%A5%E8%AF%86%E5%88%AB%E5%8A%A9%E6%89%8B)

## 🎮 使用方法

1. 在网页上选中包含链接的文本
2. 弹窗会自动出现在鼠标位置附近
3. 点击想要访问的链接即可在新标签页打开

## 🔧 支持的链接格式

- 完整的HTTP/HTTPS链接
- www开头的网址
- 普通域名（自动添加https://）
- 带参数的URL
- 带路径的URL

## 🐛 已知问题

- 某些特殊格式的URL可能无法识别
- 在某些网站可能出现样式冲突
- 暂不支持快捷键操作

## 🚀 开发计划

- [ ] 添加配置面板
- [ ] 支持更多URL格式
- [ ] 添加快捷键支持
- [ ] 优化弹窗样式和定位算法

## 🤝 参与贡献

欢迎提交 Pull Request 或创建 Issue！

1. Fork 本仓库
2. 创建你的特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交你的更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 创建一个 Pull Request

## 📝 开源协议

本项目采用 MIT 协议 - 查看 [LICENSE](LICENSE) 文件了解详情

## 👨‍💻 作者

D0ublecl1ck

---

如果这个项目对你有帮助，欢迎 star ⭐️
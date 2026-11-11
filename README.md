# 万象寺 · Cyber Temple

一个无需构建工具的静态网页原型。场景使用浏览器原生 WebGL 绘制，不依赖 Three.js CDN；Safari、Chrome 等支持 WebGL 的现代浏览器可以直接运行。

## 本地预览

直接打开 `index.html` 即可。进入寺院后使用 `W A S D` 行走，按住 `Shift` 奔跑，拖动鼠标环顾。

## 发布到 GitHub Pages

1. 在 GitHub 新建一个公开仓库，例如 `cyber-temple`。
2. 在此文件夹初始化 Git 并提交文件：

   ```sh
   git init
   git add index.html main.js style.css README.md
   git commit -m "Build cyber temple prototype"
   git branch -M main
   git remote add origin https://github.com/<你的用户名>/cyber-temple.git
   git push -u origin main
   ```

3. 打开 GitHub 仓库的 **Settings → Pages**。
4. 在 **Build and deployment** 中选择 **Deploy from a branch**，分支选 `main`，目录选 `/(root)`，然后保存。
5. 等待 Actions 中的 Pages 部署完成。访问 `https://<你的用户名>.github.io/cyber-temple/`。

如果仓库名是 `<你的用户名>.github.io`，访问地址会是 `https://<你的用户名>.github.io/`。

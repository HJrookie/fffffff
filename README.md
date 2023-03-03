## 开发

```bash
# 克隆项目
http://10.103.237.65/edu/tianjin-signup-system/tianjin-signup-web.git

# 进入项目目录
cd tianjin-signup-web

# 安装依赖
npm install --registry=https://registry.npm.taobao.org

# 启动服务
npm run dev
```

浏览器访问  http://localhost:9090/ 

## 发布

```bash
# 构建测试环境
npm run build:stage

# 构建生产环境
npm run build:prod
```

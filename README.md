# iconfont web字体 文件编辑器  

## 工具用途  
导出现有字库的svg图片  
对字库文件进行修改  

## 使用说明  
```
# nodejs版本 > v12

# 安装
npm install
npm run build

# 解包字体文件
# 按照demo例子把字体有关文件放入iconfont文件夹
# 必须存在iconfont.json和iconfont.ttf文件
# 解出的svg文件存放到iconfont/icons文件夹
node unpack.js

# 打包字体文件
# 必须存在iconfont.json和iconfont/icons文件夹
node pack.js

# 添加，修改，删除
# svg文件必须保持同一个大小，比如阿里iconfont默认1024x1024的
# 手工编辑iconfont.json文件

# 格式
"glyphs": [{
  "icon_id": "1",
  "name": "金融",
  "font_class": "jinrong",
  "unicode": "e64f",
  "unicode_decimal": 58959
}]

# 修改图标 直接替换iconfont/icons文件夹内的svg
# 删除图标 glyphs 数组直接删除配置
# 添加图标 glyphs 按照上面格式添加
# 编辑完成后需要 node pack.js 打包字体

{
  "icon_id": "1",
  "name": "svg文件名，需要和iconfont/icons文件夹内一致",
  "font_class": "css的名称，自定义名称",
  "unicode": "unicode的16进制写法",
  "unicode_decimal": unicode的10进制写法   比如 parseInt("e64f", 16) = 58959
}

```
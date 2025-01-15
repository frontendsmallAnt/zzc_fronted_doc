# commonJs 规范

## 概述

commonJs 无法直接在浏览器端运行，也不适合在浏览器端运行，因为导入的过程是阻塞的，他的出现主要是为了Node环境

## module对象
Node内部提供一个Module构建函数。所有模块都是Module的实例。
怎么理解这句话呢
```js
 //example.js
 var jquery = require('jquery')
 export.$ = jquery;
 console.log(module);
```

执行这个文件 `node example.js`,命令行会输出如下信息

```js
{ id: '.',  //模块的识别符，通常是带有绝对路径的模块文件名
  exports: { '$': [Function] },
  parent: null, //返回一个对象，表示调用该模块的模块
  filename: '/path/example.js', //模块的文件名，带有绝对路径。
  loaded: false, //返回一个布尔值，表示模块是否已经完成加载
  children: //返回一个数组，表示该模块要用到的其他模块
   [ { id: '/path/to/node_modules/jquery/dist/jquery.js',
       exports: [Function],
       parent: [Circular],
       filename: '/path/to/node_modules/jquery/dist/jquery.js',
       loaded: true,
       children: [],
       paths: [Object] } ],
  paths:
   [ '/home/user/deleted/node_modules',
     '/home/user/node_modules',
     '/home/node_modules',
     '/node_modules' ]
}
```

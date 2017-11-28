# Earthquake Map

用3D地球展示地震发生点

## 想要实现的功能

* 爬取中国地震台网的数据
* 数据展示到3D地球上
* 部署服务器，实时抓起数据，更新3D地球
* 分析数据，对数据进行可视化

## 爬取数据    

用node爬去数据，主要用到HTTP、cheerio、fs三个node模块。


#1. 请求数据

这里哟啊用到HTTP模块，去请求中国地震台网官网，返回一段HTML代码

```
// 请求url，返回html
http.get(pageUrl, function(res) {
    let html = '';
    res.on('data', function(data) {
        html += data;
    });
    res.on('end', function() {
        //数据获取完，执行回调函数，处理html
        dealHTML(html);
    });
});
```

#2. 处理返回的html，得到想要的数据

这里需要用到node的cheerio模块，处理返回的html，操作和JQuery一样

```
// 处理HTML
function dealHTML(html) {
    //使用load方法，参数是刚才获取的html源代码数据
    let $ = cheerio.load(html);
    let dataArr = [];
    
    //写法和jQuery一模一样
    $('#news').find('tr').each(function(index, element) {
        if (element.children.length == 13 && element.children instanceof Array) {
            let temp = []
            for (let i = 0; i < element.children.length; ++i) {
                let cur = element.children[i]
                if (cur.name == 'td') {

                    if (!cur.children[0].data){
                        temp.push("'" + cur.children[0].children[0].data + "'")
                    } else {
                        temp.push("'" + cur.children[0].data + "'")
                    }
                    
                }
            }
            dataArr.push(temp)
        }
    });
    // 将处理后的数据写入文件
    writeFile(__dirname + '/output.js', dataArr)
}
```

#3. 将处理后的数据写入文件

这里需要用到node的fs模块，调用系统API操作文件

```
// 写文件
function writeFile(file, data){  

    let str = '',
        headStr = 'let data = [ //震级(M) 发震时刻(UTC+8) 纬度(°) 经度(°) 深度(千米) 地区 \n',
        footStr = '] \n'

    for (let i = 0; i < data.length; ++i) {
        str += '[' + data[i] + ']' + ',' + '\n'
    }  

    str = headStr + str + footStr

    fs.writeFile(file, str,function(err, data){
        if(err) {
            console.log(file+'写文件操作失败:',err);
        } else {
            console.log("写文件操作成功"+file);
        }    
    });
}
```

想要的数据已经得到了，接下来就可以画地球了。

## 画地球

### 学习three.js

边学边翻译了一些英文资料

* https://juejin.im/post/5a1be6abf265da43062a7e23

**draw earth ing**

## 资料
https://www.cnblogs.com/Aralic/p/4591036.html
https://www.cnblogs.com/shawn-xie/archive/2012/08/16/2642553.html
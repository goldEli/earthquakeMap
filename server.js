// 加载http模块
const http = require('http');
// 服务器端处理html
const cheerio = require('cheerio');
// io模块
const fs = require('fs');

// 目标url
const pageUrl = "http://news.ceic.ac.cn/index.html"

// 请求url，返回html
http.get(pageUrl, function(res) {
    let html = '';
    res.on('data', function(data) {
        html += data;
    });
    res.on('end', function() {
        //数据获取完，执行回调函数
        dealHTML(html);
    });
});

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
    writeFile(__dirname + '/output.js', dataArr)
}

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

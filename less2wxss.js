let fs = require('fs');
let path = require('path');
let filePath = [];
let projectPages = 'miniprogram/pages';

// 遍历文件夹
let cssFiles = (dir) => {
    let results = []
    let list = fs.readdirSync(dir)
    list.forEach((file) => {
        file = dir + '/' + file
        let stat = fs.statSync(file)
        if (stat && stat.isDirectory()) 
        	results = results.concat(cssFiles(file))
        else if(path.extname(file) === '.css'){
        	results.push(file)
        } 
    })
    return results
}

let copyFile = (origin, target) => {
  fs.writeFileSync(target, fs.readFileSync(origin));
}

cssFiles(projectPages).forEach(file => {
	fs.watchFile(file, curr => {
		copyFile(file, file.replace(/\.css$/i, '.wxss'));
		console.log(`转换：${file}`);
	})
})
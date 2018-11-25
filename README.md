# exec-on-dom
指定したhtmlファイルを開いた状態のdom環境下で任意のscriptを実行するコマンドです.
reqlに対応しています.

## Installation

```
$ npm install -g hikaruna/exec-on-dom#master
```


## Usage

```
$ exec-on-dom -f xxx.html
> document
Document { location: [Getter/Setter] }
> window
Window { ... }
> Ctrl + D
```

### Repl mode

```$ exec-on-dom -f xxx.html```

### file mode

```$ exec-on-dom -f xxx.html yyy.js```

or

```$ cat yyy.js | exec-on-dom -f xxx.html```

or

```$ exec-on-dom -f xxx.html < yyy.js```

### Eval mode

```$ exec-on-dom -f xxx.html -e "console.log(document);"```

## 備考

渡される変数は以下の2つ

- document
- window

jqueryをrequireして使うこともできる

```
$ npm i jquery
$ exec-on-dom -f xxx.html
> const $ = require('jquery')(window)
> $('h1').text()
'html h1 string'
```

## License
MIT

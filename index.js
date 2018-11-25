#! /usr/bin/env node

const package = require('./package.json')
const repl = require('repl');
const { JSDOM } = require('jsdom');
const argv = require('argv');
const fs = require('fs');

argv.info(`
${package.description}
第一引数には実行したいscriptファイルを指定します。
第一引数がない場合は標準入力から実行するscriptを読み込みます
`);
argv.version(package.version);

argv.option({
  name: 'file',
  short: 'f',
  type: 'string',
  description: 'required. 読み込むHTMLファイルを指定します',
  example: 'exec-on-dom -f xxx.html'
})

argv.option({
  name: 'eval',
  short: 'e',
  type: 'string',
  description: "optional. dom環境下で実行するjavascriptを指定します.これは第一引数や標準入力より優先されます.",
  example: 'exec-on-dom -f xxx.html -e "console.log(document);"'
})
const arg = argv.run();
if (arg.options.file === undefined) {
  argv.help();
  process.exit(1);
}


const file = arg.options.file;
const src = fs.readFileSync(file, 'utf8');
const jsdom = new JSDOM(src);
const window = jsdom.window;
const document = jsdom.window.document;

if (arg.options.eval !== undefined) {
  eval(arg.options.eval);
  process.exit(0);
}

if (arg.targets[0] !== undefined) {
  const jsPath = arg.targets[0];
  const jsSource = fs.readFileSync(jsPath, 'utf8');
  eval(jsSource);
  process.exit(0);
}

if (!process.stdin.isTTY) {
  (async () => {
    function read() {
      return new Promise((resolve) => {
        var input = '';
        process.stdin.resume();
        process.stdin.setEncoding('utf8');
        process.stdin.on('data', function (chunk) {
          input += chunk;
        });
        process.stdin.on('end', function () {
          resolve(input);
        });
      });
    }
    const stdin = await read();
    eval(stdin)
    process.exit(0);
  })();
}

const r = repl.start();
Object.defineProperty(r.context, 'window', {
  configurable: false,
  enumerable: true,
  value: jsdom.window
});
Object.defineProperty(r.context, 'document', {
  configurable: false,
  enumerable: true,
  value: jsdom.window.document
});

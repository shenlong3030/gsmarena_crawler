var Nightmare = require('nightmare'),
  nightmare = Nightmare({show: false});

async function run(){
  	var title = await nightmare
    .goto('https://www.lazada.vn/')
    .wait('.lzd-header-content')
    .evaluate(function() {
      return document.title;
    });

    console.log(title);
}

run();

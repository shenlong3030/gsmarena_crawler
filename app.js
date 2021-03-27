/*
INPUT pages to get list 

https://www.gsmarena.com/samsung-phones-9.php
https://www.gsmarena.com/samsung-phones-f-9-0-p2.php

https://www.gsmarena.com/xiaomi-phones-80.php
https://www.gsmarena.com/xiaomi-phones-f-80-0-p2.php

https://www.gsmarena.com/oppo-phones-82.php
https://www.gsmarena.com/oppo-phones-f-82-0-p2.php

https://www.gsmarena.com/realme-phones-118.php
https://www.gsmarena.com/nokia-phones-1.php

https://www.gsmarena.com/vivo-phones-98.php
https://www.gsmarena.com/vivo-phones-f-98-0-p2.php

https://www.gsmarena.com/huawei-phones-58.php

https://www.gsmarena.com/honor-phones-121.php
https://www.gsmarena.com/honor-phones-f-121-0-p2.php

https://www.gsmarena.com/asus-phones-46.php
https://www.gsmarena.com/google-phones-107.php
https://www.gsmarena.com/lg-phones-20.php
https://www.gsmarena.com/oneplus-phones-95.php
https://www.gsmarena.com/meizu-phones-74.php
https://www.gsmarena.com/lenovo-phones-73.php
https://www.gsmarena.com/blackberry-phones-36.php
https://www.gsmarena.com/htc-phones-45.php
https://www.gsmarena.com/motorola-phones-4.php



https://www.gsmarena.com/samsung-phones-9.php
https://www.gsmarena.com/xiaomi-phones-80.php
https://www.gsmarena.com/oppo-phones-82.php
https://www.gsmarena.com/realme-phones-118.php
https://www.gsmarena.com/vivo-phones-98.php
https://www.gsmarena.com/huawei-phones-58.php
https://www.gsmarena.com/honor-phones-121.php
https://www.gsmarena.com/asus-phones-46.php
https://www.gsmarena.com/google-phones-107.php
https://www.gsmarena.com/lg-phones-20.php
https://www.gsmarena.com/oneplus-phones-95.php
*/

// Returns a Promise that resolves after "ms" Milliseconds
function mySleep(ms) {
 	return new Promise(res => setTimeout(res, ms));
}


//############ Sequence request using async await
var Nightmare = require('nightmare'),
  nightmare = Nightmare({show: false});

async function getModelUrls(branchUrls) {
	branchUrls = branchUrls.filter(Boolean);
	var list = [];
	for (var i = 0; i < branchUrls.length; i++) {
		console.log("Start getting models : " + branchUrls[i]);
		modelUrls = await nightmare.goto(branchUrls[i])
	    .wait('.section-body')
	    .evaluate(function() {
			const urls = Array.from(document.querySelectorAll('.makers ul li a')).map((el) => el.href);
			return urls;
	    })
	    .catch(function(error) {
	      	console.error('Fail to connect : ' + branchUrls[i]);
	    });
	    list = list.concat(modelUrls);
	    console.log("Done : " + branchUrls[i]);
	    console.log(modelUrls);
	    await mySleep(500);
	}
	return list;
}

async function getDetailData(urls) {
  	for (var i = 0; i < urls.length; i++) {
		r = await nightmare.goto(urls[i])
		  .wait(500)
		  .evaluate(()=>{
		  		var el = document.querySelector('h1[data-spec="modelname"]');
		  		var name = el ? el.innerText : "";
		  		el = document.querySelector('td[data-spec="dimensions"]');
				var dimensions = el ? el.innerText : "";
				dimensions = dimensions.split("mm")[0];
				el = document.querySelector('td[data-spec="displaysize"]');
				var displaysize = el ? el.innerText : "";
				displaysize = displaysize.split(",")[0];
				el = document.querySelector('td[data-spec="usb"]');
				var usbport = el ? el.innerText : "";
				return name + ";" + dimensions + ";" + displaysize + ";" + usbport;
		  })
		  .catch(function(error) {
		  		console.error('can not get detail from ' + urls[i]);
		  })
		console.log(r);
	}
	console.log("DONE");
	await nightmare.end();
}

async function getData(input) {
	var list = await getModelUrls(input);
	getDetailData(list);
}

//############ Nodejs read input from stdin
var readline = require('readline');
var input = [];

// init
var rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

// readline
rl.prompt('input URLs (separate by line) , press Ctrl+D to complete');
rl.on('line', function (cmd) {
    input.push(cmd);
});

// end input when press Ctrl+D
rl.on('close', function (cmd) {
	console.log('KET QUA');
    getData(input);
});


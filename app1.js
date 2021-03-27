/*
INPUT pages to get detail

https://www.gsmarena.com/asus_zenfone_4_max_pro_zc554kl-8814.php
https://www.gsmarena.com/asus_zenfone_4_selfie_pro_zd552kl-8808.php
https://www.gsmarena.com/asus_zenfone_max_shot_zb634kl-9633.php
https://www.gsmarena.com/honor_view30_pro-10099.php
https://www.gsmarena.com/huawei_mate_x-9605.php
https://www.gsmarena.com/huawei_nova_5i_pro-9765.php
https://www.gsmarena.com/lg_g_pad_iv_8_0_fhd-8780.php
https://www.gsmarena.com/lg_k50-9586.php
https://www.gsmarena.com/lg_k51s-10087.php
https://www.gsmarena.com/lg_q51-10102.php
https://www.gsmarena.com/oppo_a9x-9706.php
https://www.gsmarena.com/oppo_reno-9631.php
https://www.gsmarena.com/realme_3-9558.php
https://www.gsmarena.com/samsung_galaxy_a2_core-9636.php
https://www.gsmarena.com/xiaomi_black_shark_3-10110.php
https://www.gsmarena.com/xiaomi_mi_10_5g-10082.php
https://www.gsmarena.com/xiaomi_mi_10_lite_5g-10159.php
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
	//var list = await getModelUrls(input);
	getDetailData(input);
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


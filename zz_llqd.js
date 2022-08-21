/*
网址https://j05.space/user
机场流量签到
已支持IOS双京东账号,Node.js支持N个京东账号
脚本兼容: QuantumultX, Surge, Loon, JSBox, Node.js
============Quantumultx===============
[task_local]
#机场流量签到
10 8 * * * https://raw.githubusercontent.com/pray1412/fruit/main/zz_llqd.js, tag=机场流量签到, img-url=https://raw.githubusercontent.com/58xinian/icon/master/jdte.png, enabled=true
================Loon==============
[Script]
cron "10 8 * * *" script-path=https://raw.githubusercontent.com/pray1412/fruit/main/zz_llqd.js,tag=机场流量签到
===============Surge=================
机场流量签到 = type=cron,cronexp="10 8 * * *",wake-system=1,timeout=3600,script-path=https://raw.githubusercontent.com/pray1412/fruit/main/zz_llqd.js
============小火箭=========
机场流量签到 = type=cron,script-path=https://raw.githubusercontent.com/pray1412/fruit/main/zz_llqd.js, cronexpr="10 8 * * *", timeout=3600, enable=true
*/
const $ = new Env('流量签到');
const notify = $.isNode() ? require('./sendNotify') : '';
const times=new Date().getTime();

!(async() => {
	await goSigm();
})()
.catch((e) => $.logErr(e))
    .finally(() => $.done())

async function goSigm(){
   //第一个签到
   try {
       console.log("开始发送请求..............网址https://j05.space/user");	
        const ck = await login();
        console.log("ck===>",ck);
        if(ck){
            await sleep(5000)
            await LLQD(ck);
        }
   } catch (e) {
       $.error = `签到出错\n`;
   } finally{
       console.log("结束发送请求..............网址https://j05.space/user");
   }
  //第二个签到
 try {
       console.log("开始发送请求..............网址https://ovo.ecyjc.com/user");	
        const ck = await ecyjc_dl();
        console.log("ck===>",ck);
        if(ck){
          await sleep(5000)
          await ecyjc_qd(ck);
        }
   } catch (e) {
       $.error = `签到出错\n`;
   } finally{
       console.log("结束发送请求..............网址https://ovo.ecyjc.com/user");
   }


}

 function sleep(timeout) {                                                                                                                                          
   return new Promise((resolve) => setTimeout(resolve, timeout));
 }

//登陆
async function login() {
 return new Promise(async resolve => {
	  //填自己的用户名密码Mary，Mary88888888
      const body="{\"email\": \"1412\",\"passwd\": \"252986987\"}";
      //console.log(body);
      const options = {
		  "url": "http://j.luxury/signin?c="+times,
                  "body":body,
		  "headers": {
			"Accept": "application/json,text/plain, */*",
			"Content-Type": "application/json;charset=UTF-8",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
                        "origin": "https://j.luxury",
			"Referer": "https://j.luxury/signin",
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
		  },
		  "timeout": 10000
		}
          $.post(options, (err, resp, data) => {
            console.log("login account ...")
            try {
                 
                 if (err) {
                    console.log("err===",err)
                    console.log("resp---",resp)
                    console.log("data>>>",data)
                    $.logErr(err)
                    $.error = `${$.name} :` + `${JSON.stringify(err)}\n`;
                } else {
                  data=JSON.parse(data);
                  if(data['code']==200){
                    // console.log(JSON.stringify(resp.headers['set-cookie']))
                     getcookie = resp.headers['set-cookie'];
                     let cookies=[]; 
                     getcookie.forEach(async (val,index,arr)=>{
                        let ck = val.substring(0,val.indexOf(";"));
                        cookies.push(ck);
                       //console.log(val,index,arr);
                     });
                     resolve(cookies.join(";"));
                     //console.log(cookies);
                     //console.log("OK:",data['msg'])
                  }else{
                   console.log("error:",data['code'],data['msg'])
                  }

                 //console.log(err);
                 //console.log(resp);
                 //console.log(data);
              }
            } catch (e) {
                $.logErr(e)
                $.error = `检测出错，不做变动\n`;
            } finally {
				
                resolve();
            }
        })
    })
}

//签到
async function LLQD(cookie) {
    return new Promise(async resolve => {	   	   
       const options = {
		  "url": "https://j.luxury/user/checkin?c="+times,
		  "headers": {
			"Accept": "application/json,text/plain, */*",
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
			"Cookie": cookie,
			"origin": "https://j.luxury",
			"Referer": "https://j.luxury/user?ran="+times,
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
		  },
		  "timeout": 10000
		}
    $.post(options, (err, resp, data) => {
            try {
                if (err) {
                    console.log("err===",err)
                    console.log("resp---",resp)
                    console.log("data>>>",data)
                    $.logErr(err)
                    $.error = `${$.name} :` + `${JSON.stringify(err)}\n`;
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['ret'] == 1) {
                            console.log("成功 Code:" + data['msg']);
                            $.log("成功 Code:" + data['msg']);
							notify.sendNotify("流量签到通知","成功 Code:" + data['msg']);
                        } else {
                            console.log("失败 Code:" + data['msg']);
                            notify.sendNotify("流量签到通知","失败 Code:" + data['msg']);
                            $.log("失败 "+data['msg']);
                        }
                    } else {						
                        $.log('服务器返回空数据');
                        $.error = `服务器返回空数据，不做变动\n`;
                    }
                }
            } catch (e) {
                $.logErr(e)
                $.error = `检测出错，不做变动\n`;
            } finally {
				
                resolve();
            }
        })
    })
}

//登陆
async function ecyjc_dl() {
 return new Promise(async resolve => {
	  //填自己的用户名密码Mary，Mary88888888
      const body="{\"email\": \"252986987@qq.com\",\"passwd\": \"252986987\",\"code\":\"\"}";
      const options = {
		  "url": "https://owo.ecycloud.com/auth/login",
          "body":body,
		  "headers": {
			"Accept": "application/json,text/plain, */*",
			"Content-Type": "application/json;charset=UTF-8",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
            "origin": "https://owo.ecycloud.com",
			"Referer": "https://owo.ecycloud.com/auth/login",
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
		  },
		  "timeout": 10000
		}
          $.post(options, (err, resp, data) => {
            console.log("login account ...")
            try {
                 
                 if (err) {
                    console.log("err===",err)
                    console.log("resp---",resp)
                    console.log("data>>>",data)
                    $.logErr(err)
                    $.error = `${$.name} :` + `${JSON.stringify(err)}\n`;
                } else {
                  data=JSON.parse(data);
                  console.log(data)
                  if(data['ret']==1){
                     getcookie = resp.headers['set-cookie'];
                     let cookies=[]; 
                     getcookie.forEach(async (val,index,arr)=>{
                        let ck = val.substring(0,val.indexOf(";"));
                        cookies.push(ck);
                     });
                     resolve(cookies.join(";"));
                  }else{
                   console.log("error:",data['code'],data['msg'])
                  }
              }
            } catch (e) {
                $.logErr(e)
                $.error = `检测出错，不做变动\n`;
            } finally {
				
                resolve();
            }
        })
    })
}

//签到
async function ecyjc_qd(cookie) {
    return new Promise(async resolve => {	   	   
       const options = {
		  "url": "https://ovo.ecyjc.com/user/checkin",
		  "headers": {
			"Accept": "application/json,text/plain, */*",
			"Content-Type": "application/x-www-form-urlencoded",
			"Accept-Encoding": "gzip, deflate, br",
			"Accept-Language": "zh-cn",
			"Connection": "keep-alive",
			"Cookie": cookie,
			"origin": "https://ovo.ecyjc.com",
			"Referer": "https://ovo.ecyjc.com/user",
            "x-requested-with": "XMLHttpRequest",
			"user-agent": "Mozilla/5.0 (Windows NT 6.1; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/93.0.4577.63 Safari/537.36"
		  },
		  "timeout": 10000
		}
    $.post(options, (err, resp, data) => {
            try {
                if (err) {
                     console.log("err===",err)
                    console.log("resp---",resp)
                    console.log("data>>>",data)
                    $.logErr(err)
                    $.error = `${$.name} :` + `${JSON.stringify(err)}\n`;
                } else {
                    if (data) {
                        data = JSON.parse(data);
                        if (data['ret'] == 1) {
                            console.log("成功 Code:" + data['msg']);
                            $.log("成功 Code:" + data['msg']);
							notify.sendNotify("ecyjc流量签到通知","成功 Code:" + data['msg']);
                        } else {
                            console.log("失败 Code:" + data['msg']);
                            notify.sendNotify("ecyjc流量签到通知","失败 Code:" + data['msg']);
                            $.log("失败 "+data['msg']);
                        }
                    } else {						
                        $.log('服务器返回空数据');
                        $.error = `服务器返回空数据，不做变动\n`;
                    }
                }
            } catch (e) {
                $.logErr(e)
                $.error = `检测出错，不做变动\n`;
            } finally {
				
                resolve();
            }
        })
    })
}

function Env(t,e){"undefined"!=typeof process&&JSON.stringify(process.env).indexOf("GITHUB")>-1&&process.exit(0);class s{constructor(t){this.env=t}send(t,e="GET"){t="string"==typeof t?{url:t}:t;let s=this.get;return"POST"===e&&(s=this.post),new Promise((e,i)=>{s.call(this,t,(t,s,r)=>{t?i(t):e(s)})})}get(t){return this.send.call(this.env,t)}post(t){return this.send.call(this.env,t,"POST")}}return new class{constructor(t,e){this.name=t,this.http=new s(this),this.data=null,this.dataFile="box.dat",this.logs=[],this.isMute=!1,this.isNeedRewrite=!1,this.logSeparator="\n",this.startTime=(new Date).getTime(),Object.assign(this,e),this.log("",`🔔${this.name}, 开始!`)}isNode(){return"undefined"!=typeof module&&!!module.exports}isQuanX(){return"undefined"!=typeof $task}isSurge(){return"undefined"!=typeof $httpClient&&"undefined"==typeof $loon}isLoon(){return"undefined"!=typeof $loon}toObj(t,e=null){try{return JSON.parse(t)}catch{return e}}toStr(t,e=null){try{return JSON.stringify(t)}catch{return e}}getjson(t,e){let s=e;const i=this.getdata(t);if(i)try{s=JSON.parse(this.getdata(t))}catch{}return s}setjson(t,e){try{return this.setdata(JSON.stringify(t),e)}catch{return!1}}getScript(t){return new Promise(e=>{this.get({url:t},(t,s,i)=>e(i))})}runScript(t,e){return new Promise(s=>{let i=this.getdata("@chavy_boxjs_userCfgs.httpapi");i=i?i.replace(/\n/g,"").trim():i;let r=this.getdata("@chavy_boxjs_userCfgs.httpapi_timeout");r=r?1*r:20,r=e&&e.timeout?e.timeout:r;const[o,h]=i.split("@"),n={url:`http://${h}/v1/scripting/evaluate`,body:{script_text:t,mock_type:"cron",timeout:r},headers:{"X-Key":o,Accept:"*/*"}};this.post(n,(t,e,i)=>s(i))}).catch(t=>this.logErr(t))}loaddata(){if(!this.isNode())return{};{this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e);if(!s&&!i)return{};{const i=s?t:e;try{return JSON.parse(this.fs.readFileSync(i))}catch(t){return{}}}}}writedata(){if(this.isNode()){this.fs=this.fs?this.fs:require("fs"),this.path=this.path?this.path:require("path");const t=this.path.resolve(this.dataFile),e=this.path.resolve(process.cwd(),this.dataFile),s=this.fs.existsSync(t),i=!s&&this.fs.existsSync(e),r=JSON.stringify(this.data);s?this.fs.writeFileSync(t,r):i?this.fs.writeFileSync(e,r):this.fs.writeFileSync(t,r)}}lodash_get(t,e,s){const i=e.replace(/\[(\d+)\]/g,".$1").split(".");let r=t;for(const t of i)if(r=Object(r)[t],void 0===r)return s;return r}lodash_set(t,e,s){return Object(t)!==t?t:(Array.isArray(e)||(e=e.toString().match(/[^.[\]]+/g)||[]),e.slice(0,-1).reduce((t,s,i)=>Object(t[s])===t[s]?t[s]:t[s]=Math.abs(e[i+1])>>0==+e[i+1]?[]:{},t)[e[e.length-1]]=s,t)}getdata(t){let e=this.getval(t);if(/^@/.test(t)){const[,s,i]=/^@(.*?)\.(.*?)$/.exec(t),r=s?this.getval(s):"";if(r)try{const t=JSON.parse(r);e=t?this.lodash_get(t,i,""):e}catch(t){e=""}}return e}setdata(t,e){let s=!1;if(/^@/.test(e)){const[,i,r]=/^@(.*?)\.(.*?)$/.exec(e),o=this.getval(i),h=i?"null"===o?null:o||"{}":"{}";try{const e=JSON.parse(h);this.lodash_set(e,r,t),s=this.setval(JSON.stringify(e),i)}catch(e){const o={};this.lodash_set(o,r,t),s=this.setval(JSON.stringify(o),i)}}else s=this.setval(t,e);return s}getval(t){return this.isSurge()||this.isLoon()?$persistentStore.read(t):this.isQuanX()?$prefs.valueForKey(t):this.isNode()?(this.data=this.loaddata(),this.data[t]):this.data&&this.data[t]||null}setval(t,e){return this.isSurge()||this.isLoon()?$persistentStore.write(t,e):this.isQuanX()?$prefs.setValueForKey(t,e):this.isNode()?(this.data=this.loaddata(),this.data[e]=t,this.writedata(),!0):this.data&&this.data[e]||null}initGotEnv(t){this.got=this.got?this.got:require("got"),this.cktough=this.cktough?this.cktough:require("tough-cookie"),this.ckjar=this.ckjar?this.ckjar:new this.cktough.CookieJar,t&&(t.headers=t.headers?t.headers:{},void 0===t.headers.Cookie&&void 0===t.cookieJar&&(t.cookieJar=this.ckjar))}get(t,e=(()=>{})){t.headers&&(delete t.headers["Content-Type"],delete t.headers["Content-Length"]),this.isSurge()||this.isLoon()?(this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.get(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)})):this.isQuanX()?(this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t))):this.isNode()&&(this.initGotEnv(t),this.got(t).on("redirect",(t,e)=>{try{if(t.headers["set-cookie"]){const s=t.headers["set-cookie"].map(this.cktough.Cookie.parse).toString();s&&this.ckjar.setCookieSync(s,null),e.cookieJar=this.ckjar}}catch(t){this.logErr(t)}}).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)}))}post(t,e=(()=>{})){if(t.body&&t.headers&&!t.headers["Content-Type"]&&(t.headers["Content-Type"]="application/x-www-form-urlencoded"),t.headers&&delete t.headers["Content-Length"],this.isSurge()||this.isLoon())this.isSurge()&&this.isNeedRewrite&&(t.headers=t.headers||{},Object.assign(t.headers,{"X-Surge-Skip-Scripting":!1})),$httpClient.post(t,(t,s,i)=>{!t&&s&&(s.body=i,s.statusCode=s.status),e(t,s,i)});else if(this.isQuanX())t.method="POST",this.isNeedRewrite&&(t.opts=t.opts||{},Object.assign(t.opts,{hints:!1})),$task.fetch(t).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>e(t));else if(this.isNode()){this.initGotEnv(t);const{url:s,...i}=t;this.got.post(s,i).then(t=>{const{statusCode:s,statusCode:i,headers:r,body:o}=t;e(null,{status:s,statusCode:i,headers:r,body:o},o)},t=>{const{message:s,response:i}=t;e(s,i,i&&i.body)})}}time(t,e=null){const s=e?new Date(e):new Date;let i={"M+":s.getMonth()+1,"d+":s.getDate(),"H+":s.getHours(),"m+":s.getMinutes(),"s+":s.getSeconds(),"q+":Math.floor((s.getMonth()+3)/3),S:s.getMilliseconds()};/(y+)/.test(t)&&(t=t.replace(RegExp.$1,(s.getFullYear()+"").substr(4-RegExp.$1.length)));for(let e in i)new RegExp("("+e+")").test(t)&&(t=t.replace(RegExp.$1,1==RegExp.$1.length?i[e]:("00"+i[e]).substr((""+i[e]).length)));return t}msg(e=t,s="",i="",r){const o=t=>{if(!t)return t;if("string"==typeof t)return this.isLoon()?t:this.isQuanX()?{"open-url":t}:this.isSurge()?{url:t}:void 0;if("object"==typeof t){if(this.isLoon()){let e=t.openUrl||t.url||t["open-url"],s=t.mediaUrl||t["media-url"];return{openUrl:e,mediaUrl:s}}if(this.isQuanX()){let e=t["open-url"]||t.url||t.openUrl,s=t["media-url"]||t.mediaUrl;return{"open-url":e,"media-url":s}}if(this.isSurge()){let e=t.url||t.openUrl||t["open-url"];return{url:e}}}};if(this.isMute||(this.isSurge()||this.isLoon()?$notification.post(e,s,i,o(r)):this.isQuanX()&&$notify(e,s,i,o(r))),!this.isMuteLog){let t=["","==============📣系统通知📣=============="];t.push(e),s&&t.push(s),i&&t.push(i),console.log(t.join("\n")),this.logs=this.logs.concat(t)}}log(...t){t.length>0&&(this.logs=[...this.logs,...t]),console.log(t.join(this.logSeparator))}logErr(t,e){const s=!this.isSurge()&&!this.isQuanX()&&!this.isLoon();s?this.log("",`❗️${this.name}, 错误!`,t.stack):this.log("",`❗️${this.name}, 错误!`,t)}wait(t){return new Promise(e=>setTimeout(e,t))}done(t={}){const e=(new Date).getTime(),s=(e-this.startTime)/1e3;this.log("",`🔔${this.name}, 结束! 🕛 ${s} 秒`),this.log(),(this.isSurge()||this.isQuanX()||this.isLoon())&&$done(t)}}(t,e)}


"use strict";function ajax(s){var o=1<arguments.length&&void 0!==arguments[1]?arguments[1]:"get",r=!(2<arguments.length&&void 0!==arguments[2])||arguments[2],u=3<arguments.length&&void 0!==arguments[3]?arguments[3]:null;return new Promise(function(t,n){var e=new XMLHttpRequest;e.onload=function(){200<=e.status&&e.status<=300||304===e.status?t(e.responseText):n(new Error("找不到当前url地址"+s))},e.open(o,s,r),e.send(u)})}
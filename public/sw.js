if(!self.define){let e,s={};const i=(i,n)=>(i=new URL(i+".js",n).href,s[i]||new Promise((s=>{if("document"in self){const e=document.createElement("script");e.src=i,e.onload=s,document.head.appendChild(e)}else e=i,importScripts(i),s()})).then((()=>{let e=s[i];if(!e)throw new Error(`Module ${i} didn’t register its module`);return e})));self.define=(n,a)=>{const c=e||("document"in self?document.currentScript.src:"")||location.href;if(s[c])return;let t={};const r=e=>i(e,c),d={module:{uri:c},exports:t,require:r};s[c]=Promise.all(n.map((e=>d[e]||r(e)))).then((e=>(a(...e),t)))}}define(["./workbox-8232f3e4"],(function(e){"use strict";importScripts(),self.skipWaiting(),e.clientsClaim(),e.precacheAndRoute([{url:"/_next/static/chunks/117.cebabd2a637ecd69.js",revision:"cebabd2a637ecd69"},{url:"/_next/static/chunks/136.e18f0a04a85677c2.js",revision:"e18f0a04a85677c2"},{url:"/_next/static/chunks/192-3d254a0b4dfefb4c.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/233.baada65da6043157.js",revision:"baada65da6043157"},{url:"/_next/static/chunks/250.a619009be8ff8006.js",revision:"a619009be8ff8006"},{url:"/_next/static/chunks/251-a73c998358a1fea5.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/405.bcd3a1fc42b7ba38.js",revision:"bcd3a1fc42b7ba38"},{url:"/_next/static/chunks/4bd1b696-c2e75ff2f3507519.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/52.8e3e78669c2dbbe1.js",revision:"8e3e78669c2dbbe1"},{url:"/_next/static/chunks/60.de76ff59518fd43f.js",revision:"de76ff59518fd43f"},{url:"/_next/static/chunks/63.a901051b718e9583.js",revision:"a901051b718e9583"},{url:"/_next/static/chunks/642.d1d6ed5a6e37cd64.js",revision:"d1d6ed5a6e37cd64"},{url:"/_next/static/chunks/647.8539b796cdec6c6d.js",revision:"8539b796cdec6c6d"},{url:"/_next/static/chunks/684-867a6f2275f1a7de.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/766.e91bd66160e86e78.js",revision:"e91bd66160e86e78"},{url:"/_next/static/chunks/77.a4423d3e82853ab1.js",revision:"a4423d3e82853ab1"},{url:"/_next/static/chunks/896.bca0f1668957e6ba.js",revision:"bca0f1668957e6ba"},{url:"/_next/static/chunks/94.7c7bf1ceddf78888.js",revision:"7c7bf1ceddf78888"},{url:"/_next/static/chunks/app/_not-found/page-1c58fa233fd77826.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/app/api/upload/route-755e5da0727a7d84.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/app/layout-dc8b2ed0ee4bb0a2.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/app/not-found-d3682304254fa2b2.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/app/page-913d6cd180b6e30e.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/framework-859199dea06580b0.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/main-app-9a8285ab7613d71a.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/main-c2e74dbc8bfb6d49.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/pages/_app-da15c11dea942c36.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/pages/_error-cc3f077a18ea1793.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/chunks/polyfills-42372ed130431b0a.js",revision:"846118c33b2c0e922d7b3a7676f81f6f"},{url:"/_next/static/chunks/webpack-528fa9e597c02326.js",revision:"ens-K2X8Ob95ef2dRXuIq"},{url:"/_next/static/css/1887dda282c5f43b.css",revision:"1887dda282c5f43b"},{url:"/_next/static/css/d47522f7a801793e.css",revision:"d47522f7a801793e"},{url:"/_next/static/media/66f30814ff6d7cdf.p.woff2",revision:"addf0d443087aa4b985f763c80182017"},{url:"/_next/static/media/e11418ac562b8ac1-s.p.woff2",revision:"0e46e732cced180e3a2c7285100f27d4"},{url:"/favicon.ico",revision:"bb40bd5a584246488b8e9b22dcb4bbe7"},{url:"/file.svg",revision:"d09f95206c3fa0bb9bd9fefabfd0ea71"},{url:"/globe.svg",revision:"2aaafa6a49b6563925fe440891e32717"},{url:"/icons/icon-192x192.png",revision:"2949a52894875f42e1823dd9ac398094"},{url:"/icons/icon-512x512.png",revision:"b1c845f773e194dea1f39cb385acdd3f"},{url:"/images/pour-center-motion-1.svg",revision:"5093803e9a435871175818502b77c254"},{url:"/images/pour-center-motion-2.svg",revision:"c6d0b567769b62218239d61409d2317c"},{url:"/images/pour-center-motion-3.svg",revision:"71e69d20b75efc06eb2faaf20dd04852"},{url:"/images/pour-circle-motion-1.svg",revision:"14fee0844bf377e3fbd9936df2a949f7"},{url:"/images/pour-circle-motion-2.svg",revision:"0572dccf7444968357bc92062b66ba88"},{url:"/images/pour-circle-motion-3.svg",revision:"e7210b060a5593eddf0577144719eb50"},{url:"/images/pour-circle-motion-4.svg",revision:"19281137c3af1ec6ddd6abc75a3ce1b2"},{url:"/images/pour-ice-motion-1.svg",revision:"10cbfbb0107909fe78c3f877b01a1ddf"},{url:"/images/pour-ice-motion-2.svg",revision:"c5f06a7b95cdaf7c846604b13bf18d71"},{url:"/images/pour-ice-motion-3.svg",revision:"327bf264ede220776d6d873c67ce5e3f"},{url:"/images/pour-ice-motion-4.svg",revision:"d331ff7a3978d9d5a6a8333dfd5b9f0e"},{url:"/images/v60-base.svg",revision:"ae876c8ecd7c87f7c2f6207750443319"},{url:"/images/valve-closed.svg",revision:"76ab4195e15187fdb00a5c5006880fcc"},{url:"/images/valve-open.svg",revision:"827b5a71f717382370a35a6fb409d1d8"},{url:"/img-noise-361x370.png",revision:"3b2e77633d3487e70f3333c6db1341d3"},{url:"/manifest.json",revision:"64961237e591def07baf21dbb705805b"},{url:"/next.svg",revision:"8e061864f388b47f33a1c3780831193e"},{url:"/sounds/correct.mp3",revision:"8ddaa0402388696e15043167e4a6ae18"},{url:"/sounds/ding.mp3",revision:"bc9adfdc3fee2521ae60d2df94b211a6"},{url:"/sounds/start.mp3",revision:"387e7a9e5dfaf22381e02607a2e0ef8f"},{url:"/sounds/stop.mp3",revision:"1ed29636231464bcd45d97c3f3678e59"},{url:"/sw-dev-unregister.js",revision:"32552e629d7002d221ba03a70188b4b7"},{url:"/vercel.svg",revision:"c0af2f507b369b085b35ef4bbe3bcf1e"},{url:"/window.svg",revision:"a2760511c65806022ad20adf74370ff3"}],{ignoreURLParametersMatching:[]}),e.cleanupOutdatedCaches(),e.registerRoute("/",new e.NetworkFirst({cacheName:"start-url",plugins:[{cacheWillUpdate:async({request:e,response:s,event:i,state:n})=>s&&"opaqueredirect"===s.type?new Response(s.body,{status:200,statusText:"OK",headers:s.headers}):s}]}),"GET"),e.registerRoute(/^https?.*/,new e.NetworkFirst({cacheName:"offline-cache",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:200,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\/$/,new e.NetworkFirst({cacheName:"html-cache",networkTimeoutSeconds:10,plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\/_next\/static\/.*/i,new e.CacheFirst({cacheName:"static-resources",plugins:[new e.ExpirationPlugin({maxEntries:200,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\/_next\/image\?url=.+/i,new e.CacheFirst({cacheName:"next-image",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:86400}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:mp3)$/i,new e.CacheFirst({cacheName:"audio",plugins:[new e.ExpirationPlugin({maxEntries:10,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET"),e.registerRoute(/\.(?:png|jpg|jpeg|svg|gif|webp)$/i,new e.CacheFirst({cacheName:"images",plugins:[new e.ExpirationPlugin({maxEntries:100,maxAgeSeconds:2592e3}),new e.CacheableResponsePlugin({statuses:[0,200]})]}),"GET")}));

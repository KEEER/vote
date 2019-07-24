!function(e){var t={};function r(n){if(t[n])return t[n].exports;var i=t[n]={i:n,l:!1,exports:{}};return e[n].call(i.exports,i,i.exports,r),i.l=!0,i.exports}r.m=e,r.c=t,r.d=function(e,t,n){r.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},r.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r.t=function(e,t){if(1&t&&(e=r(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(r.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)r.d(n,i,function(t){return e[t]}.bind(null,i));return n},r.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return r.d(t,"a",t),t},r.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},r.p="/",r(r.s=39)}({0:function(e,t,r){"use strict";function n(e,t,r,n,i,s,o,a){var u,l="function"==typeof e?e.options:e;if(t&&(l.render=t,l.staticRenderFns=r,l._compiled=!0),n&&(l.functional=!0),s&&(l._scopeId="data-v-"+s),o?(u=function(e){(e=e||this.$vnode&&this.$vnode.ssrContext||this.parent&&this.parent.$vnode&&this.parent.$vnode.ssrContext)||"undefined"==typeof __VUE_SSR_CONTEXT__||(e=__VUE_SSR_CONTEXT__),i&&i.call(this,e),e&&e._registeredComponents&&e._registeredComponents.add(o)},l._ssrRegister=u):i&&(u=a?function(){i.call(this,this.$root.$options.shadowRoot)}:i),u)if(l.functional){l._injectStyles=u;var c=l.render;l.render=function(e,t){return u.call(t),c(e,t)}}else{var p=l.beforeCreate;l.beforeCreate=p?[].concat(p,u):[u]}return{exports:e,options:l}}r.d(t,"a",function(){return n})},2:function(e,t,r){"use strict";var n,i="object"==typeof Reflect?Reflect:null,s=i&&"function"==typeof i.apply?i.apply:function(e,t,r){return Function.prototype.apply.call(e,t,r)};n=i&&"function"==typeof i.ownKeys?i.ownKeys:Object.getOwnPropertySymbols?function(e){return Object.getOwnPropertyNames(e).concat(Object.getOwnPropertySymbols(e))}:function(e){return Object.getOwnPropertyNames(e)};var o=Number.isNaN||function(e){return e!=e};function a(){a.init.call(this)}e.exports=a,a.EventEmitter=a,a.prototype._events=void 0,a.prototype._eventsCount=0,a.prototype._maxListeners=void 0;var u=10;function l(e){return void 0===e._maxListeners?a.defaultMaxListeners:e._maxListeners}function c(e,t,r,n){var i,s,o,a;if("function"!=typeof r)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof r);if(void 0===(s=e._events)?(s=e._events=Object.create(null),e._eventsCount=0):(void 0!==s.newListener&&(e.emit("newListener",t,r.listener?r.listener:r),s=e._events),o=s[t]),void 0===o)o=s[t]=r,++e._eventsCount;else if("function"==typeof o?o=s[t]=n?[r,o]:[o,r]:n?o.unshift(r):o.push(r),(i=l(e))>0&&o.length>i&&!o.warned){o.warned=!0;var u=new Error("Possible EventEmitter memory leak detected. "+o.length+" "+String(t)+" listeners added. Use emitter.setMaxListeners() to increase limit");u.name="MaxListenersExceededWarning",u.emitter=e,u.type=t,u.count=o.length,a=u,console&&console.warn&&console.warn(a)}return e}function p(e,t,r){var n={fired:!1,wrapFn:void 0,target:e,type:t,listener:r},i=function(){for(var e=[],t=0;t<arguments.length;t++)e.push(arguments[t]);this.fired||(this.target.removeListener(this.type,this.wrapFn),this.fired=!0,s(this.listener,this.target,e))}.bind(n);return i.listener=r,n.wrapFn=i,i}function v(e,t,r){var n=e._events;if(void 0===n)return[];var i=n[t];return void 0===i?[]:"function"==typeof i?r?[i.listener||i]:[i]:r?function(e){for(var t=new Array(e.length),r=0;r<t.length;++r)t[r]=e[r].listener||e[r];return t}(i):h(i,i.length)}function d(e){var t=this._events;if(void 0!==t){var r=t[e];if("function"==typeof r)return 1;if(void 0!==r)return r.length}return 0}function h(e,t){for(var r=new Array(t),n=0;n<t;++n)r[n]=e[n];return r}Object.defineProperty(a,"defaultMaxListeners",{enumerable:!0,get:function(){return u},set:function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "defaultMaxListeners" is out of range. It must be a non-negative number. Received '+e+".");u=e}}),a.init=function(){void 0!==this._events&&this._events!==Object.getPrototypeOf(this)._events||(this._events=Object.create(null),this._eventsCount=0),this._maxListeners=this._maxListeners||void 0},a.prototype.setMaxListeners=function(e){if("number"!=typeof e||e<0||o(e))throw new RangeError('The value of "n" is out of range. It must be a non-negative number. Received '+e+".");return this._maxListeners=e,this},a.prototype.getMaxListeners=function(){return l(this)},a.prototype.emit=function(e){for(var t=[],r=1;r<arguments.length;r++)t.push(arguments[r]);var n="error"===e,i=this._events;if(void 0!==i)n=n&&void 0===i.error;else if(!n)return!1;if(n){var o;if(t.length>0&&(o=t[0]),o instanceof Error)throw o;var a=new Error("Unhandled error."+(o?" ("+o.message+")":""));throw a.context=o,a}var u=i[e];if(void 0===u)return!1;if("function"==typeof u)s(u,this,t);else{var l=u.length,c=h(u,l);for(r=0;r<l;++r)s(c[r],this,t)}return!0},a.prototype.addListener=function(e,t){return c(this,e,t,!1)},a.prototype.on=a.prototype.addListener,a.prototype.prependListener=function(e,t){return c(this,e,t,!0)},a.prototype.once=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.on(e,p(this,e,t)),this},a.prototype.prependOnceListener=function(e,t){if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);return this.prependListener(e,p(this,e,t)),this},a.prototype.removeListener=function(e,t){var r,n,i,s,o;if("function"!=typeof t)throw new TypeError('The "listener" argument must be of type Function. Received type '+typeof t);if(void 0===(n=this._events))return this;if(void 0===(r=n[e]))return this;if(r===t||r.listener===t)0==--this._eventsCount?this._events=Object.create(null):(delete n[e],n.removeListener&&this.emit("removeListener",e,r.listener||t));else if("function"!=typeof r){for(i=-1,s=r.length-1;s>=0;s--)if(r[s]===t||r[s].listener===t){o=r[s].listener,i=s;break}if(i<0)return this;0===i?r.shift():function(e,t){for(;t+1<e.length;t++)e[t]=e[t+1];e.pop()}(r,i),1===r.length&&(n[e]=r[0]),void 0!==n.removeListener&&this.emit("removeListener",e,o||t)}return this},a.prototype.off=a.prototype.removeListener,a.prototype.removeAllListeners=function(e){var t,r,n;if(void 0===(r=this._events))return this;if(void 0===r.removeListener)return 0===arguments.length?(this._events=Object.create(null),this._eventsCount=0):void 0!==r[e]&&(0==--this._eventsCount?this._events=Object.create(null):delete r[e]),this;if(0===arguments.length){var i,s=Object.keys(r);for(n=0;n<s.length;++n)"removeListener"!==(i=s[n])&&this.removeAllListeners(i);return this.removeAllListeners("removeListener"),this._events=Object.create(null),this._eventsCount=0,this}if("function"==typeof(t=r[e]))this.removeListener(e,t);else if(void 0!==t)for(n=t.length-1;n>=0;n--)this.removeListener(e,t[n]);return this},a.prototype.listeners=function(e){return v(this,e,!0)},a.prototype.rawListeners=function(e){return v(this,e,!1)},a.listenerCount=function(e,t){return"function"==typeof e.listenerCount?e.listenerCount(t):d.call(e,t)},a.prototype.listenerCount=d,a.prototype.eventNames=function(){return this._eventsCount>0?n(this._events):[]}},21:function(e,t,r){"use strict";var n=r(4);r.n(n).a},22:function(e,t,r){"use strict";var n=r(5);r.n(n).a},23:function(e,t){Array.prototype.flat||Object.defineProperty(Array.prototype,"flat",{configurable:!0,value:function e(){var t=isNaN(arguments[0])?1:Number(arguments[0]);return t?Array.prototype.reduce.call(this,function(r,n){return Array.isArray(n)?r.push.apply(r,e.call(n,t-1)):r.push(n),r},[]):Array.prototype.slice.call(this)},writable:!0}),Array.prototype.flatMap||Object.defineProperty(Array.prototype,"flatMap",{configurable:!0,value:function(e){return Array.prototype.map.apply(this,arguments).flat()},writable:!0})},24:function(e,t,r){"use strict";var n=r(6);r.n(n).a},3:function(e,t,r){"use strict";
/**
 * vue-unique-id v1.1.1
 * (c) 2019 Bertrand Guay-Paquet
 * @license ISC
 */var n={$id:function(e){return void 0===e&&(e=""),this.uid+"-"+e},$idRef:function(e){return"#"+this.$id(e)}};t.a=function(e){var t=0;e.mixin({beforeCreate:function(){var e="uid-"+(t+=1);Object.defineProperties(this,{uid:{get:function(){return e}}})}}),Object.assign(e.prototype,n)}},39:function(e,t,r){"use strict";r.r(t);var n={};r.r(n),r.d(n,"VRadio",function(){return b}),r.d(n,"VCheckbox",function(){return C}),r.d(n,"VText",function(){return T}),r.d(n,"VTextarea",function(){return k});var i=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",{staticClass:"vote-main"},[e.nodata?r("h1",[e._v(e._s(e.nodataTip))]):r("Form",{attrs:{title:e.data.title,action:e.data.action,method:e.data.method}},e._l(e.data.data,function(t,n){return r("Page",{key:n},e._l(t,function(e){return r("Question",{key:e.id,attrs:{id:e.id,type:e.type,value:e.value,data:e}})}),1)}),1),e._v(" "),e._m(0)],1)};i._withStripped=!0;var s=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("main",[r("h1",[e._v(e._s(this.title))]),e._v(" "),e.submitting||e.submitted||e.submiterror?e._e():e._t("default"),e._v(" "),e.submitting||e.submitted||e.submiterror?e._e():r("span",{staticClass:"form-controls"},[e._v("\n    "+e._s(e.texts.pageno)+"\n    "),r("button",{staticClass:"form-prev",attrs:{hidden:!e.prevVisible},on:{click:e.prev}},[e._v(e._s(e.texts.prevPage))]),e._v(" "),r("button",{staticClass:"form-next",attrs:{hidden:!e.nextVisible},on:{click:e.next}},[e._v(e._s(e.texts.nextPage))]),e._v(" "),r("button",{staticClass:"form-submit",attrs:{hidden:e.nextVisible},on:{click:e.submit}},[e._v(e._s(e.texts.submit))])]),e._v(" "),e.submitting&&!e.submitted?r("h1",[e._v(e._s(e.texts.submitting))]):e._e(),e._v(" "),e.submitted?r("h1",[e._v(e._s(e.texts.submitted))]):e._e(),e._v(" "),e.submiterror?r("h1",[e._v(e._s(e.texts.submiterror))]):e._e()],2)};s._withStripped=!0;var o=function(){var e=this,t=e.$createElement;return(e._self._c||t)(e.type,{ref:"realQuestion",tag:"component",attrs:{data:e.data,value:e.value},on:{"update:value":function(t){e.value=t}}},[e._t("default")],2)};o._withStripped=!0;var a=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("QTitle",{attrs:{title:e.data.title,required:e.data.required}}),e._v(" "),e._l(e.data.options,function(t){return r("span",{key:t.value},[r("input",{directives:[{name:"model",rawName:"v-model",value:e.value_,expression:"value_"}],attrs:{type:"radio",id:e.$id(t.value)},domProps:{value:t.value,checked:e._q(e.value_,t.value)},on:{change:function(r){e.value_=t.value}}}),e._v(" "),r("label",{attrs:{for:e.$id(t.value)}},[e._v(e._s(t.label))])])})],2)};a._withStripped=!0;var u=r(2),l=new(r.n(u).a),c=function(){var e=this.$createElement,t=this._self._c||e;return t("h3",[this._v(this._s(this.title)),this.required?t("sup",{staticClass:"title-required"},[this._v("*")]):this._e()])};c._withStripped=!0;var p={name:"QTitle",props:{title:String,required:Boolean}},v=(r(21),r(0)),d=Object(v.a)(p,c,[],!1,null,null,null);d.options.__file="src/themes/basic/Title.vue";var h=d.exports,f={data(){return{value_:this.value,old:null}},methods:{syncOld(){this.old=this.value_}},watch:{value_(e){this.$emit("update:value",e),l.emit("question:update",[this,e,this.old]),this.syncOld()},value(e){this.value_=e}},mounted(){this.syncOld()},computed:{overridesParent(){return!!this.question_},question(){return this.question_||this.$parent},realQuestion(){return this.question.$children[0]}},components:{QTitle:h}},m={name:"VRadio",mixins:[f],props:{data:{type:Object,validator:e=>e.title&&e.options&&e.options.every(e=>e.label&&e.value)},value:String}},_=Object(v.a)(m,a,[],!1,null,null,null);_.options.__file="src/themes/basic/types/VRadio.vue";var b=_.exports,y=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("QTitle",{attrs:{title:e.data.title,required:e.data.required}}),e._v(" "),e._l(e.data.options,function(t){return r("VCheckboxInput",{key:t.value,attrs:{option:t,value:e.value_[t.value]},on:{"update:value":function(r){return e.$set(e.value_,t.value,r)}}})})],2)};y._withStripped=!0;var g=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("span",[r("input",{directives:[{name:"model",rawName:"v-model",value:e.value_,expression:"value_"}],attrs:{type:"checkbox",id:e.uid},domProps:{value:e.option.value,checked:Array.isArray(e.value_)?e._i(e.value_,e.option.value)>-1:e.value_},on:{change:function(t){var r=e.value_,n=t.target,i=!!n.checked;if(Array.isArray(r)){var s=e.option.value,o=e._i(r,s);n.checked?o<0&&(e.value_=r.concat([s])):o>-1&&(e.value_=r.slice(0,o).concat(r.slice(o+1)))}else e.value_=i}}}),e._v(" "),r("label",{attrs:{for:e.uid}},[e._v(e._s(e.option.label))])])};g._withStripped=!0;var x={name:"VCheckboxInput",mixins:[f],data(){return{question_:this.$parent.$parent}},props:{option:Object,value:Boolean}},w=Object(v.a)(x,g,[],!1,null,null,null);w.options.__file="src/themes/basic/types/VCheckboxInput.vue";var O={name:"VCheckbox",data(){return{value_:this.value}},components:{VCheckboxInput:w.exports,QTitle:h},props:{data:{type:Object,validator:e=>e.title&&e.options&&e.options.every(e=>e.label&&e.value)},value:Object}},j=Object(v.a)(O,y,[],!1,null,null,null);j.options.__file="src/themes/basic/types/VCheckbox.vue";var C=j.exports,L=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("QTitle",{attrs:{title:e.data.title,required:e.data.required}}),e._v(" "),r("input",{directives:[{name:"model",rawName:"v-model",value:e.value_,expression:"value_"}],domProps:{value:e.value_},on:{input:function(t){t.target.composing||(e.value_=t.target.value)}}})],1)};L._withStripped=!0;var $={name:"VText",mixins:[f],props:{data:{type:Object,validator:e=>e.title},value:String}},E=Object(v.a)($,L,[],!1,null,null,null);E.options.__file="src/themes/basic/types/VText.vue";var T=E.exports,V=function(){var e=this,t=e.$createElement,r=e._self._c||t;return r("div",[r("QTitle",{attrs:{title:e.data.title,required:e.data.required}}),e._v(" "),r("textarea",{directives:[{name:"model",rawName:"v-model",value:e.value_,expression:"value_"}],domProps:{value:e.value_},on:{input:function(t){t.target.composing||(e.value_=t.target.value)}}})],1)};V._withStripped=!0;var S={name:"VTextarea",mixins:[f],props:{data:{type:Object,validator:e=>e.title},value:String}},P=Object(v.a)(S,V,[],!1,null,null,null);P.options.__file="src/themes/basic/types/VTextarea.vue";var k=P.exports;const q={};for(let e in n)q[e]=n[e];var R={name:"Question",data(){return{value:this.$attrs.value}},components:q,props:{type:{type:String,validator:e=>e in n},data:Object,id:Number},computed:{valid(){let e=!this.data.required||!!this.value;return l.emit("question:validate",[this,t=>e=t]),e}},provide(){return{Question:this}}},A=Object(v.a)(R,o,[],!1,null,null,null);A.options.__file="src/themes/basic/Question.vue";var N=A.exports,F=function(){var e=this.$createElement;return(this._self._c||e)("div",{class:this.current?"page current":"page"},[this._t("default")],2)};F._withStripped=!0;var M={name:"Page",data:()=>({current:!1}),computed:{questions(){return this.$children},valid(){let e=this.questions.every(e=>e.valid);return l.emit("page:validate",[this,t=>e=t]),e}}},Q=(r(22),Object(v.a)(M,F,[],!1,null,null,null));Q.options.__file="src/themes/basic/Page.vue";var I=Q.exports,K=(r(23),Vue.extend({data:function(){return{current:0,prevVisible:!1,nextVisible:!1,status:"filling",texts:{prevPage:"←Prev page",nextPage:"Next page→",submit:"Submit",pageno:null,submitting:"Submitting...",submitted:"The form has been submitted. Thank you.",submiterror:"There is an error submitting the form."}}},props:{title:String,action:String,method:String},methods:{prev(){0!==this.current&&(this.$children[this.current].current=!1,this.current--,this.$children[this.current].current=!0,this.update())},next(){this.current!==this.pages.length-1&&(this.$children[this.current].current=!1,this.current++,this.$children[this.current].current=!0,this.update())},update(){this.updateVisibility(),l.emit("form:update",[this])},updateVisibility(){0===this.current?this.prevVisible=!1:this.prevVisible=!0,this.current===this.pages.length-1?this.nextVisible=!1:this.nextVisible=!0,l.emit("form:updatevisibility",[this])},submit(){let e=!1;l.emit("form:beforesubmit",[this,()=>e=!0]),e||l.emit("form:submit",[this])}},components:{},mounted(){document.title=this.title,this.$children[this.current].current=!0,this.updateVisibility(),this.texts.pageno=`Page ${this.current+1}`,l.emit("form:mounted",[this]),l.emit("form:updatevisibility",[this])},computed:{pages(){return this.$children},currentPage(){let e=this.current+1;return l.emit("form:pageno",[this,t=>e=t]),e},submitted(){return"submitted"===this.status},submitting(){return"submitting"===this.status},submiterror(){return"submiterror"===this.status},formdata(){const e=[];return this.pages.flatMap(e=>e.questions).forEach(t=>{e[t.id]=t.value}),e},valid(){let e=this.pages.every(e=>e.valid);return l.emit("form:validate",[this,t=>e=t]),e}}})),U=Object(v.a)(K,s,[],!1,null,null,null);U.options.__file="src/themes/basic/Form.vue";var B={components:{Form:U.exports,Question:N,Page:I},data:()=>({nodata:!("KVoteFormData"in window),data:window.KVoteFormData}),computed:{nodataTip(){let e="No form data supplied. This is usually an error in the URL.";return l.emit("app:nodata",[this,t=>e=t]),e}}},D=(r(24),Object(v.a)(B,i,[function(){var e=this.$createElement,t=this._self._c||e;return t("footer",{staticClass:"vote-footer"},[t("a",{attrs:{href:"/?utm_source=form&utm_medium=footer"}},[this._v("Powered by KEEER Vote")])])}],!1,null,null,null));D.options.__file="src/themes/basic/App.vue";var X=D.exports,H=r(3);const W=document.createElement("div");W.id="app",document.body.appendChild(W),Vue.use(H.a),window.onload=()=>{window.voteHooks=l,window.dispatchEvent(new Event("vote:ready")),window.vm=new Vue({el:"#app",render:e=>e(X)})}},4:function(e,t,r){},5:function(e,t,r){},6:function(e,t,r){}});
//# sourceMappingURL=theme-basic-d050b1.js.map
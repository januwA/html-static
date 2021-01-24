!function(t,e){if("object"==typeof exports&&"object"==typeof module)module.exports=e();else if("function"==typeof define&&define.amd)define([],e);else{var s=e();for(var n in s)("object"==typeof exports?exports:t)[n]=s[n]}}(this,(function(){return(()=>{"use strict";var t={703:(t,e)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.doctype=e.htmlCommentExp=e.htmlCommentStartExp=e.endTagExp=e.attributeExp=e.startTagExp=e.startTagOpenExp=e.qnameCapture=e.ncname=void 0,e.ncname="[a-zA-Z_][\\w\\-\\.]*",e.qnameCapture=`((?:${e.ncname}\\:)?${e.ncname})`,e.startTagOpenExp=new RegExp(`^<${e.qnameCapture}`),e.startTagExp=/<(?<tagName>[a-zA-Z_][\w\-\.]*)(?<attributes>(?:\s*(?:[^\s"'<>\/=]+)\s*(?:=\s*(?:"(?:[^"]*)"+|'(?:[^']*)'+|(?:[^\s"'=<>`]+)))?)*)\s*(?<unary>\/?)>/,e.attributeExp=/\s*(?<name>[^\s"'<>\/=]+)\s*(?:=\s*(?:"(?<v1>[^"]*)"+|'(?<v2>[^']*)'+|(?<v3>[^\s"'=<>`]+)))?/,e.endTagExp=new RegExp(`^<\\/${e.qnameCapture}[^>]*>\\s*`),e.htmlCommentStartExp=/^\s*<!--/,e.htmlCommentExp=/<!--([^]*?)-->/,e.doctype=/<!\w+\s*([^>]*)>/i},777:(t,e,s)=>{Object.defineProperty(e,"__esModule",{value:!0}),e.traverse=e.htmlAst=e.AstText=e.AstAttrbute=e.AstElement=e.ClassList=e.AstComment=e.AstDoctype=e.AstHtmlBase=void 0;const n=s(703);class i{constructor(){this.isRemove=!1}remove(){this.isRemove=!0}replaceWith(t){if(this.parent){const e=this.parent.children.findIndex((t=>t===this));return t.parent=this.parent,this.parent.children.splice(e,1,t),!0}return!1}}e.AstHtmlBase=i;class r extends i{constructor(t,e){super(),this.value=t,this.parent=e,this.type="doctype"}toString(){return this.isRemove?"":`<!DOCTYPE ${this.value}>`}}e.AstDoctype=r;class a extends i{constructor(t,e){super(),this.value=t,this.parent=e,this.type="comment"}toString(){return this.isRemove?"":`\x3c!--${this.value}--\x3e`}}e.AstComment=a;const o=["br","hr","area","base","img","input","link","meta","basefont","param","col","frame","embed","keygen","source","command","track","wbr"];class h{constructor(t){if(this.element=t,this._cs=[],this.length=0,this._classAttr=t.attrbutes.find((t=>"class"===t.name)),this._classAttr){this._cs=this._classAttr.value.split(/\s+/);for(let t=0;t<this._cs.length;t++)this[t]=this._cs[t];this.length=this._cs.length}}get value(){return this._classAttr?.value??""}add(t){this[this.length]=t,this.length=this._cs.push(t),this._classAttr?this._classAttr.value=this._cs.join(" "):(this._classAttr=new l("class",t,this.element),this.element.attrbutes.push(this._classAttr))}remove(t){this._cs.includes(t)&&(delete this[this.length],this._cs=this._cs.filter((e=>e!==t)),this._classAttr.value=this._cs.join(" "),this.length=this._cs.length)}toggle(t){this._cs.includes(t)?this.remove(t):this.add(t)}contains(t){return this._cs.includes(t)}[Symbol.iterator](){let t=0;return{next:()=>t<this.length?{done:!1,value:this[t++]}:{done:!0}}}}e.ClassList=h;class c extends i{constructor(t,e=[],s=[]){super(),this.name=t,this.attrbutes=e,this.children=s,this.type="element",this.classList=new h(this)}get isSelfClosing(){return-1!==o.indexOf(this.name)}setAttr(t,e){this.attrbutes.push(new l(t,e,this)),"class"===t&&(this.classList=new h(this))}toString(){let t="";if(this.isRemove)return t;if("document"===this.name)return this.children.map((t=>t.toString())).join("");let e=this.attrbutes.reduce(((t,e)=>t+` ${e.toString()}`),"");return t=this.isSelfClosing?`<${this.name}${e}>`:`<${this.name}${e}>${this.children.map((t=>t.toString())).join("")}</${this.name}>`,t}}e.AstElement=c;class l extends i{constructor(t,e,s){super(),this.name=t,this.value=e,this.parent=s,this.type="attr"}replaceWith(t){return t instanceof l&&super.replaceWith(t)}toString(){return this.isRemove?"":`${this.name}="${this.value}"`}}e.AstAttrbute=l;class u extends i{constructor(t){super(),this.value=t,this.type="text"}toString(){return this.isRemove?"":`${this.value}`}}async function m(t,e){t&&await t(e)}e.AstText=u,e.htmlAst=function(t){const e=new c("document"),s=[];let i,o,h;for(;t&&h!=t;)if(h=t,i=!0,o=t.match(n.doctype),o&&(i=!1,m(new r(o[1])),l()),o=t.match(n.htmlCommentExp),t.match(n.htmlCommentStartExp)&&o&&(i=!1,l(),m(new a(o[1]))),t.startsWith("</")?(o=t.match(n.endTagExp),o&&(i=!1,l(),f(o[1]))):/^\s*<[^!]/.test(t)&&(o=t.match(n.startTagExp),o&&(i=!1,l(),p({tagName:o.groups.tagName.toLowerCase(),attrs:o.groups.attributes||"",unary:!!o.groups.unary}))),i){let e,s=t.indexOf("<");s<0?(e=t,t=""):(e=t.substring(0,s),t=t.substring(s));m(new u(e))}function l(){o&&(t=t.substring(o[0].length+o.index||0))}function m(n){if(0===s.length)n.parent=e,e.children.push(n);else{const e=s[s.length-1];if(!t.trim())throw`pushChild error: 标签(${e.name})未正确闭合`;n.parent=e,e.children.push(n)}}function p({tagName:t,attrs:e,unary:i}){const r=new c(t);for(;e.trim();){const t=e.match(n.attributeExp);if(t){const s=t.groups.name,n=t.groups.v1??t.groups.v2??t.groups.v3??"";r.setAttr(s,n),e=e.substring(t[0].length)}}i||r.isSelfClosing?m(r):s.push(r)}function f(t){const e=s.pop();if(!e)throw new Error(`parseEndTag error: endtagName: ${t}`);if(e.name.toLowerCase()!==t.toLowerCase())throw`parseEndTag error: 开始标签(${e.name.toLowerCase()})与闭合标签(${t.toLowerCase()})不匹配`;m(e)}return e},e.traverse=async function t(e,s){s||(s={});for(const n of e.children)if(n instanceof a)await m(s.comment,n);else if(n instanceof r)await m(s.doctype,n);else if(n instanceof c){for(const t of n.classList)await m(s[`class_${t}`],n);const e=n.attrbutes.find((t=>"id"===t.name));e&&await m(s[`id_${e.value}`],n);for(const t of n.attrbutes)await m(s[`attr_${t.name}`],t),await m(s.attr,t);await m(s[`element_${n.name}`],n),await m(s.element,n),await t(n,s)}else n instanceof u&&await m(s.text,n);return e}}},e={};return function s(n){if(e[n])return e[n].exports;var i=e[n]={exports:{}};return t[n](i,i.exports,s),i.exports}(777)})()}));
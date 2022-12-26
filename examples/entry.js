/* 整个官网项目的入口 */
import Vue from 'vue';
import entry from './app';
import VueRouter from 'vue-router';
// 该main路径是一个别名，alias配置在build/config/js
import Element from 'main/index.js';
import hljs from 'highlight.js';
// 路由配置生成文件
import routes from './route.config';
// 官网项目组件
import demoBlock from './components/demo-block';
import MainFooter from './components/footer';
import MainHeader from './components/header';
import SideNav from './components/side-nav';
import FooterNav from './components/footer-nav';

// 对应语言的在不同路径下渲染的document title
import title from './i18n/title';

// 组件库样式
import 'packages/theme-chalk/src/index.scss';
import './demo-styles/index.scss';
import './assets/styles/common.scss';
import './assets/styles/fonts/style.css';
// 引入icon,之后会挂载到Vue的原型上
import icon from './icon.json';

Vue.use(Element);
Vue.use(VueRouter);
Vue.component('demo-block', demoBlock);
Vue.component('main-footer', MainFooter);
Vue.component('main-header', MainHeader);
Vue.component('side-nav', SideNav);
Vue.component('footer-nav', FooterNav);

const globalEle = new Vue({
  data: { $isEle: false } // 是否 ele 用户
});

Vue.mixin({
  computed: {
    $isEle: {
      get: () => (globalEle.$data.$isEle),
      set: (data) => {globalEle.$data.$isEle = data;}
    }
  }
});

Vue.prototype.$icon = icon; // Icon 列表页用

const router = new VueRouter({
  mode: 'hash',
  base: __dirname,
  routes
});

router.afterEach(route => {
  // https://github.com/highlightjs/highlight.js/issues/909#issuecomment-131686186
  Vue.nextTick(() => {
    const blocks = document.querySelectorAll('pre code:not(.hljs)');
    Array.prototype.forEach.call(blocks, hljs.highlightBlock);
  });
  const data = title[route.meta.lang]; // 取出title.json中对应语言的对象
  // 遍历该对象，如果去到对应路径的话修改document.title
  for (let val in data) {
    if (new RegExp('^' + val, 'g').test(route.name)) {
      document.title = data[val];
      return;
    }
  }
  document.title = 'Polarment';
  ga && ga('send', 'event', 'PageView', route.name);
});

new Vue({ // eslint-disable-line
  ...entry,
  router
}).$mount('#app');

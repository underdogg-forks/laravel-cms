var Vue = require('vue');
var VueRouter = require('vue-router');
Vue.use(require('vue-resource'));
Vue.use(VueRouter);

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('[name="token"]').getAttribute("content");

window.Vue = Vue || require('vue');

require('./directives/trix');

require('./login');
require('./register');

require('./admin/dashboard');
require('./admin/pages');
require('./admin/themes');
require('./admin/users');

new Vue({
    el: 'body'
});
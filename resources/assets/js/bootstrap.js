var Vue = require('vue');
Vue.use(require('vue-resource'));

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('[name="token"]').getAttribute("content");

window.Vue = Vue || require('vue');

require('./directives/trix');

require('./login');
require('./register');

require('./admin/pages');
require('./admin/themes');

new Vue({
    el: 'body'
});
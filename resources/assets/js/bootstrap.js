var Vue = require('vue');
Vue.use(require('vue-resource'));

Vue.http.headers.common['X-CSRF-TOKEN'] = document.querySelector('[name="token"]').getAttribute("content");

window.Vue = Vue || require('vue');

require('./login');
require('./register');

new Vue({
    el: 'body'
});
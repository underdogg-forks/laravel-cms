Vue.component('pages', {
    ready() {
      this.getPages();
    },

   data() {
       return {
        pages: []
       }
   },

    methods: {
        getPages() {
            this.$http.get('/pages')
                .then(function(response) {
                    this.pages = response.data.pages;
                }.bind(this));
        }
    }
});
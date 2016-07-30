Vue.component('pages', {

    ready() {
        this.getPages();
    },

   data() {
       return {
           pages: [],
           templates: [],
           errors: [],
           model: {
               name: '',
               template: ''
           },

           showNewPage: false
       }
   },

    computed: {
      parentPages() {
          return this.pages.filter(function(item) {
             return !item.child;
          });
      }
    },

    methods: {
        isArray(item) {
            return Array.isArray(item);
        },

        getPages() {
            this.$http.get('/pages')
                .then(function(response) {
                    this.pages = response.data.pages;
                    this.getTemplates();
                }.bind(this));
        },

        getTemplates() {
            this.$http.get('/templates')
                .then(function(response) {
                    this.templates = response.data.templates;
                }.bind(this));
        },

        newPage() {
            this.$http.post('/pages/new', this.model)
                .then(function(response) {
                    if (response.data.status == 'error') {
                        this.errors = response.data.errors;
                    } else {
                        window.location.href = '/admin/pages/' + response.data.id;
                    }
                }.bind(this));
        },
    }
});
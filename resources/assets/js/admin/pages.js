Vue.component('pages', {

    ready() {
        this.getPages();
        this.getTemplates();
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

           active: {
           }
       }
   },

    methods: {
        getPages() {
            this.$http.get('/pages')
                .then(function(response) {
                    this.pages = response.data.pages;
                    if (typeof this.active.name === 'undefined') {
                        this.active = this.pages[0];
                    }
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
                        this.getPages();
                        $('#newPage').modal('toggle');
                    }
                }.bind(this));
        },

        setActive(id) {
            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].id == id) {
                    this.active = this.pages[i]
                    break;
                }
            }
        }
    }
});
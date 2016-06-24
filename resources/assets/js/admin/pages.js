Vue.component('pages', {

    ready() {
        this.prepareHash();
        this.getPages();

        window.onhashchange = this.handleHash;
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
           },

           templateVariables: {},

           tvs: {},

           pageErrors: []
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
        prepareHash() {
            if (window.location.hash) {
                this.active.id = window.location.hash.substr(2);
            } else {
                window.location.href += "#/";
            }
        },

        isArray(item) {
            return Array.isArray(item);
        },

        getPages() {
            this.$http.get('/pages')
                .then(function(response) {
                    this.pages = response.data.pages;
                    if (typeof this.active.id != 'undefined') {
                        this.setActive(this.active.id);
                    }
                    this.getTemplateVariableFields();
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
                        this.getPages();
                        $('#newPage').modal('toggle');
                    }
                }.bind(this));
        },

        deletePage() {
            if (confirm('Really delete this page and ALL of its children?')) {
                this.$http.post('/pages/' + this.active.id + '/delete')
                    .then(function(response) {
                        this.active = {};
                        this.getPages();
                    }.bind(this));
            }
        },

        setActive(id) {

            //TODO: Check for changes

            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].id == id) {
                    this.active = this.pages[i];
                    window.location.href = '#/' + this.pages[i].id;
                    this.getTemplateVariableFields();
                    break;
                }
            }

        },

        handleHash() {

            //TODO: Check for changes

            for (var i = 0; i < this.pages.length; i++) {
                if (this.pages[i].id == window.location.hash.substr(2)) {
                    this.active = this.pages[i];
                    this.getTemplateVariableFields();
                    break;
                }
            }

            if (window.location.hash == '#/') {
                this.active = {};
            }

        },

        getTemplateVariableFields() {
            this.$http.post('/template-variables', {'template': this.active.template})
                .then(function(response) {
                    this.templateVariables = response.data.categories;

                    this.$http.get('/pages/' + this.active.id + '/tvs')
                        .then(function(response) {

                            var tv = response.data.tvs;

                            if (Array.isArray(tv) && tv.length == 0) {
                                tv = {};
                            }

                            for (var category in this.templateVariables) {
                                if (this.templateVariables.hasOwnProperty(category)) {
                                    if (typeof tv[category] === 'undefined') {
                                        tv[category] = {};

                                        for (var field in this.templateVariables[category]) {
                                            if (this.templateVariables[category].hasOwnProperty(field)) {
                                                if (typeof tv[category][field] === 'undefined') {
                                                    tv[category][field] = '';
                                                }
                                            }
                                        }
                                    }
                                }
                            }

                            this.$set('tvs', tv);

                        }.bind(this));

                }.bind(this));
        },

        savePage() {
            this.$http.post('/pages/' + this.active.id + '/update', this.active)
                .then(function(response) {
                    if (response.data.status == 'error') {
                        this.pageErrors = response.data.errors;
                    }
                }.bind(this));
            this.$http.post('/template-variables/save', {tvs: this.tvs, pageId: this.active.id});
        }
    }
});
Vue.component('page', {

    ready() {
        this.active = window.NPAGE;
        this.getTemplateVariableFields();
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

            active: {},

            templateVariables: {},

            tvs: {},

            pageErrors: [],

            activeOriginal: {},

            activeTab: '',

            showNewPage: false
        }
    },

    methods: {
        isArray(item) {
            return Array.isArray(item);
        },

        getTemplates() {
            this.$http.get('/templates')
                .then(function(response) {
                    this.templates = response.data.templates;
                }.bind(this));
        },

        deletePage() {
            if (confirm('Really delete this page and ALL of its children?')) {
                this.$http.post('/pages/' + this.active.id + '/delete')
                    .then(function(response) {
                        window.location.href = '/admin/pages';
                    }.bind(this));
            }
        },

        storeOriginal(obj) {
            this.activeOriginal = Vue.util.extend({}, obj);
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

                            var first = true;

                            for (var category in this.templateVariables) {
                                if (this.templateVariables.hasOwnProperty(category)) {
                                    if (first) {
                                        this.activeTab = category;
                                        first = false;
                                    }
                                    if (typeof tv[category] === 'undefined') {
                                        tv[category] = {};

                                        for (var field in this.templateVariables[category]) {
                                            if (this.templateVariables[category].hasOwnProperty(field)) {
                                                if (typeof tv[category][field] === 'undefined') {
                                                    tv[category][field] = null;
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

            var proceed = true;
            var changed = false;

            if (this.activeOriginal.template != this.active.template) {
                changed = true;
                if (!confirm('Changing the template will erase all previous TV values, continue?')) {
                    proceed = false;
                }
            }

            if (proceed) {
                this.$http.post('/pages/' + this.active.id + '/update', this.active)
                    .then(function(response) {
                        if (response.data.status == 'error') {
                            this.pageErrors = response.data.errors;
                        } else {
                            this.pageErrors = {};
                            if (changed) {
                                this.getTemplateVariableFields();
                            } else {
                                this.$http.post('/template-variables/save', {tvs: this.tvs, pageId: this.active.id});
                            }

                            this.storeOriginal(this.active);
                        }
                    }.bind(this));

            }
        },

        makeIndex() {
            this.$http.post('/option/update', {'option': 'indexPage', 'value': this.active.id})
                .then(function(response) {
                    this.active.isIndex = true;
                }.bind(this));
        },

        swapEditor(editor) {
            if (editor == 'markdown') {
                this.active.markdown = true;
            } else {
                this.active.markdown = false;
            }
        }
    }
});
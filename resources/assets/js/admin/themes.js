Vue.component('themes', {
    ready() {
        this.getThemeFolders();
        this.getActiveTheme();
    },

   data() {
       return {
           folders: [],
           activeTheme: ''
       }
   },

    methods: {
        getThemeFolders() {
            this.$http.get('/themes')
                .then(function(response) {
                    this.folders = response.data.folders;
                }.bind(this));
        },

        getActiveTheme() {
            this.$http.post('/option', {'option': 'active_theme'})
                .then(function(response) {
                    this.activeTheme = response.data.option;
                }.bind(this));
        },

        setActiveTheme() {
            this.$http.post('/option/update', {'option': 'active_theme', 'value': this.activeTheme})
                .then(function(response) {
                    this.getActiveTheme();
                }.bind(this));
        }
    }
});
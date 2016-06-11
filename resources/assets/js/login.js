Vue.component('login', {
    data() {
       return {
           model: {
               username: '',
               password: ''
           },
           errors: []
       }
    },

    methods: {
        submit: function() {
            this.$http.post('/login', this.model)
            .then(function(response) {
               if (response.data.status == 'error') {
                   this.errors = response.data.errors;
               } else {
                   window.location.href = '/dashboard';
               }
            }.bind(this));
        }
    }
});
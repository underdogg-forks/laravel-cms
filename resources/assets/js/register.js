Vue.component('register', {
    data() {
        return {
            model: {
                username: '',
                password: '',
                password_confirmation: ''
            },
            errors: []
        }
    },

    methods: {
        submit: function() {
            this.$http.post('/register', this.model)
                .then(function(response) {
                    if (response.data.status == 'error') {
                        this.errors = response.data.errors;
                    } else {
                        window.location.href = '/admin';
                    }
                }.bind(this)).catch(function(error) {
                    console.log(error);
                });
        }
    }
});
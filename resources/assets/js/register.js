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
                        console.log(response.data);
                        this.errors = response.data;
                        //window.location.href = '/dashboard';
                    }
                }.bind(this)).catch(function(error) {
                    console.log(error);
                });
        }
    }
});
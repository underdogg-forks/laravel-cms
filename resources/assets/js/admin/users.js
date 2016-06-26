Vue.component('users', {
    ready() {
        this.getLoggedInUser();
        this.getUsers();

        this.prepareHash();

        window.onhashchange = this.handleHash;
    },

    data() {
        return {
            users: [],
            loggedInUser: {},
            active: {},
            userErrors: {},
            newUser: {},
            modalErrors: {}
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

        handleHash() {

            this.setActive(window.location.hash.substr(2));

            if (window.location.hash == '#/') {
                this.active = {};
            }

        },

        getUsers() {
            this.$http.get('/users')
                .then(function(response) {
                    this.users = response.data.users;
                    if (typeof this.active.id != 'undefined') {
                        this.setActive(this.active.id);
                    }
                }.bind(this));
        },

        saveNewUser() {
            this.$http.post('/users/new', Vue.util.extend({donotlogin: true}, this.newUser))
                .then(function(response) {
                    if (response.data.status == 'error') {
                        this.modalErrors = response.data.errors;
                    } else {
                        this.getUsers();
                        $('#newUser').modal('toggle');
                    }
                }.bind(this));
        },

        save() {
          this.$http.post('/users/update', this.active)
              .then(function(response) {
                  if (response.data.status == 'error') {
                      this.userErrors = response.data.errors;
                  } else {
                      this.getUsers();
                      this.userErrors = {};
                  }
              }.bind(this));
        },

        deleteUser() {
            if (confirm('Really delete this user?')) {
                this.$http.post('/users/delete', this.active)
                    .then(function(response) {
                        this.active = {};
                        this.getUsers();
                    }.bind(this));
            }
        },

        getLoggedInUser(user) {
            this.$http.get('/user')
                .then(function(response) {
                    this.loggedInUser = response.data.user;
                }.bind(this));
        },

        setActive(id) {
            for (var i = 0; i < this.users.length; i++) {
                if (this.users[i].id == id) {
                    this.active = Vue.util.extend({}, this.users[i]);
                    window.location.href = '#/' + this.users[i].id;
                    break;
                }
            }
        }
    }
});
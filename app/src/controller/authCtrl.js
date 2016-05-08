angular.module('authCtrl', ['userService'])
    .controller('AuthCtrl', function ($rootScope, $location, $window, Auth, User) {
        var self = this;

        this.currentUser = null;
        this.allUsers = null;
        this.loginData = {};
        this.userData = {};
        this.isPending = false;
        this.isLoggedIn = Auth.isLoggedIn();
        this.info = {
            error: {
                login: '',
                signup: ''
            },
            message: {
                signup: ''
            }
        };

        this.doLogin = function () {
            self.isPending = true;
            self.info.error.login = '';

            Auth.login(self.loginData.username, self.loginData.password).success(function (data) {
                self.isPending = false;
                Auth.getUser().then(function (data) {
                    self.curentUser = data.data;
                });

                if (data.success) {
                    $location.path('/home');
                } else {
                    self.info.error.login = data.message;
                }
            })
        };

        this.doLogout = function () {
            Auth.logout();
            $location.path('/');
        };

        this.getAllUsers = function () {
            User.getAll().success(function (data) {
                self.allUsers = data;
            });
        };

        this.createUser = function () {
            User.createNew(self.userData).then(function (response) {
                self.userData = {};
                self.info.message.signup = response.data.message;

                $window.localStorage.setItem('token', response.data.token);
                $location.path('/welcome');
            }, function (error) {
                if (error) {
                    self.info.error.signup = error.message;
                }
            });
        };


        $rootScope.$on('$routeChangeStart', function () {
            self.isLoggedIn = Auth.isLoggedIn();

            Auth.getUser().then(function (data) {
                self.currentUser = data.data;
            });
        });

    });
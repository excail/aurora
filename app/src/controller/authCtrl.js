angular.module('authCtrl', ['userService']).controller('AuthCtrl', function ($rootScope, $location, $window, Auth, User) {

    var self = this;

    this.currentUser = null;
    this.loginUserData = {};
    this.newUserData = {};
    this.errors = {login: '', signup: ''};
    this.isLoggedIn = Auth.isLoggedIn();

    var invalidateForm = function () {
        self.errors.login = '';
        self.loginUserData = {};
    };

    this.doLogin = function () {
        Auth.login(self.loginUserData.username, self.loginUserData.password).success(function (data) {
            invalidateForm();
            Auth.getUser().then(function (data) {
                self.curentUser = data.data;
            });
            if (data.success) {
                $location.path('/home');
            } else {
                self.errors.login = data.message;
            }
        })
    };

    this.doLogout = function () {
        Auth.logout();
        $location.path('/');
    };

    this.createUser = function () {
        User.createNew(self.newUserData).then(function (response) {
            self.newUserData = {};
            $window.localStorage.setItem('token', response.data.token);
            $location.path('/welcome');
        }, function (error) {
            if (error) {
                self.errors.signup = error.message;
            }
        });
    };

    $rootScope.$on('$routeChangeStart', function () {
        self.isLoggedIn = Auth.isLoggedIn();
        invalidateForm();

        Auth.getUser().then(function (data) {
            self.currentUser = data.data;
        });
    });

});
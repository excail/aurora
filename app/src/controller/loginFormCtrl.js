angular.module('loginFormCtrl', []).controller('LoginFormCtrl', function () {

    this.isInvalid = function (loginUserData) {
        return !(loginUserData.username && loginUserData.password);
    };

});
angular.module('userListCtrl', ['userService']).controller('UserListCtrl', function (User) {

    var allUsers = null;

    this.getAllUsers = function () {
        if (!allUsers) {
            allUsers = [];
            User.getAll().success(function (data) {
                allUsers = data;
            });
        }
        return allUsers;
    };

});
angular.module('userService', []).factory('User', function ($http, $q) {
    var userFactory = {};

    userFactory.createNew = function (newUserData) {
        var deferred = $q.defer();

        userFactory.getAll().success(function (data) {
            var usernameExists = data.find(function (user) {
                return user.username == newUserData.username;
            });

            if (usernameExists) {
                deferred.reject({message: "User with this name already exists."});
            } else {
                deferred.resolve($http.post('/api/signup', newUserData));
            }
        });

        return deferred.promise;
    };

    userFactory.getAll = function () {
        return $http.get('/api/users');
    };

    return userFactory;
});
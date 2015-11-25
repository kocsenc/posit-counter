'use strict';

/**
 * @ngdoc function
 * @name positterApp.controller:MainCtrl
 * @description
 * # MainCtrl
 * Controller of the positterApp
 */
angular.module('positterApp')
  .controller('MainCtrl', function ($resource, $http, $timeout) {
    var vm = this;
    var BASE_URL = 'http://couch.kocsen.com/lol';
    var Words = $resource(BASE_URL + '/_all_docs');
    var Word = $resource(BASE_URL);
    fetchWords();

    function fetchWords() {
      Words.get(
        {include_docs: true},
        function (data) {
          vm.words = data.rows;
          //$timeout(fetchWords, 1000)
        });
    }

    vm.increment = function increment(wordDoc) {
      wordDoc.count++;
      vm.loading = true;

      $http({
        method: 'PUT',
        url: BASE_URL + '/' + wordDoc._id,
        data: wordDoc
      }).then(function successCallback(response) {
        vm.loading = false;
      }, function errorCallback(response) {
        vm.loading = false;
      });
    };

    vm.addNew = function (phrase) {
      var quote = new Word({
        _id: phrase,
        count: 1
      });

      quote.$save().then(
        function (data) {
          fetchWords();
          vm.newPhrase = '';
        },
        function (err) {
          onSaveError(err.data.reason)
        }
      );
    };


    vm.error = {
      show: false,
      message: ''
    };

    function onSaveError(reason) {
      vm.error.show = true;
      vm.error.message = reason;
    }

  });

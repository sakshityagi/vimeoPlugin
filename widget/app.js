'use strict';

(function (angular, buildfire) {
  angular.module('vimeoPluginWidget', ['ngRoute'])
    .config(['$routeProvider', function ($routeProvider) {
      /**
       * Disable the pull down refresh
       */
      buildfire.datastore.disableRefresh();
      $routeProvider
        .when('/feed', {
          templateUrl: 'templates/home.html',
          controllerAs: 'WidgetFeed',
          controller: 'WidgetFeedCtrl'
        })
        .when('/video', {
          templateUrl: 'templates/Item_Details.html',
          controller: 'WidgetSingleCtrl',
          controllerAs: 'WidgetSingle'

        })
        .otherwise('/feed');
    }]);
})(window.angular, window.buildfire);

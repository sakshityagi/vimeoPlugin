'use strict';

(function (angular, buildfire) {
  angular.module('vimeoPluginWidget', ['ngRoute','infinite-scroll'])
    .config(['$routeProvider', function ($routeProvider) {
      $routeProvider
        .when('/', {
          resolve: {
            videoData: ['DataStore', '$q', 'TAG_NAMES', 'CONTENT_TYPE', 'Location', function (DataStore, $q, TAG_NAMES, CONTENT_TYPE, Location) {
              var deferred = $q.defer();
              var success = function (result) {
                  if (result.data && result.data.content) {
                    if (result.data.content.type && result.data.content.type === CONTENT_TYPE.SINGLE_VIDEO && result.data.content.videoID) {
                      Location.goTo("#/video/" + result.data.content.videoID);
                      deferred.resolve();
                    }
                    else if (result.data.content.type && result.data.content.type === CONTENT_TYPE.CHANNEL_FEED && result.data.content.channelID) {
                      Location.goTo("#/feed/" + result.data.content.channelID);
                      deferred.resolve();
                    }
                    else {
                      Location.goTo("#/feed/1");
                      deferred.resolve();
                    }
                  } else {
                    Location.goTo("#/feed/1");
                    deferred.resolve();
                  }
                }
                , error = function (err) {
                  Location.goTo("#/feed/1");
                  deferred.reject();
                };
              DataStore.get(TAG_NAMES.VIMEO_INFO).then(success, error);
            }]
          }
        })
        .when('/feed/:channelId', {
          templateUrl: 'templates/home.html',
          controllerAs: 'WidgetFeed',
          controller: 'WidgetFeedCtrl'
        })
        .when('/video/:videoId', {
          templateUrl: 'templates/Item_Details.html',
          controller: 'WidgetSingleCtrl',
          controllerAs: 'WidgetSingle'

        })
        .otherwise('/');
    }])
    .filter('getImageUrl', ['Buildfire', function (Buildfire) {
      return function (url, width, height, type) {
        if (type == 'resize')
          return Buildfire.imageLib.resizeImage(url, {
            width: width,
            height: height
          });
        else
          return Buildfire.imageLib.cropImage(url, {
            width: width,
            height: height
          });
      }
    }])
    .directive("backgroundImage", ['$filter', function ($filter) {
      return {
        restrict: 'A',
        link: function (scope, element, attrs) {
          var getImageUrlFilter = $filter("getImageUrl");
          var setBackgroundImage = function (backgroundImage) {
            if (backgroundImage) {
              element.css(
                'background', '#010101 url('
                + getImageUrlFilter(backgroundImage, 342, 770, 'resize')
                + ') repeat fixed top center');
            } else {
              element.css('background', 'none');
            }
          };
          attrs.$observe('backgroundImage', function (newValue) {
            setBackgroundImage(newValue);
          });
        }
      };
    }])
    .directive("buildFireCarousel", ["$rootScope", function ($rootScope) {
      return {
        restrict: 'A',
        link: function (scope, elem, attrs) {
          $rootScope.$broadcast("Carousel:LOADED");
        }
      };
    }])
    .filter('returnVimeoUrl', ['$sce', function ($sce) {
      return function (uri) {
        var id = uri.split("/").pop();
        return $sce.trustAsResourceUrl("//player.vimeo.com/video/" + id);
      }
    }])
  .filter('returnVideoUrl', [function () {
    return function (uri) {
      var videoId = uri.split("/").pop();
      return "#/video/"+videoId;
    }
  }]);
})(window.angular, window.buildfire);

'use strict';

(function (angular, buildfire) {
  angular.module('vimeoPluginWidget')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
      var onUpdateListeners = [];
      return {
        get: function (_tagName) {
          var deferred = $q.defer();
          Buildfire.datastore.get(_tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        },
        onUpdate: function () {
          var deferred = $q.defer();
          var onUpdateFn = Buildfire.datastore.onUpdate(function (event) {
            if (!event) {
              return deferred.notify(new Error({
                code: STATUS_CODE.UNDEFINED_EVENT,
                message: STATUS_MESSAGES.UNDEFINED_EVENT
              }), true);
            } else {
              return deferred.notify(event);
            }
          });
          onUpdateListeners.push(onUpdateFn);
          return deferred.promise;
        },
        clearListener: function () {
          onUpdateListeners.forEach(function (listner) {
            listner.clear();
          });
          onUpdateListeners = [];
        }
      }
    }])
    .factory('VimeoApi', ['VIMEO_KEYS', '$q', '$http', 'STATUS_CODE', 'STATUS_MESSAGES', 'VIDEO_COUNT', function (VIMEO_KEYS, $q, $http, STATUS_CODE, STATUS_MESSAGES, VIDEO_COUNT) {
      var getSingleVideoDetails = function (videoId) {
        var deferred = $q.defer();
        if (!videoId) {
          deferred.reject(new Error({
            code: STATUS_CODE.UNDEFINED_VIDEO_ID,
            message: STATUS_MESSAGES.UNDEFINED_VIDEO_ID
          }));
        } else {
          var req = {
            method: 'GET',
            url: "https://api.vimeo.com/videos/" + videoId,
            headers: {
              'Authorization': 'bearer ' + VIMEO_KEYS.ACCESS_TOKEN
            }
          };
          $http(req).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            deferred.resolve(response);
          }, function (error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject(error);
          });
        }
        return deferred.promise;
      };

      var getFeedVideos = function (type, feedId, countLimit, page) {
        var deferred = $q.defer();
        var req = {};
        var url = "";
        if (!countLimit)
          countLimit = VIDEO_COUNT.LIMIT || 8;
        if (!feedId) {
          deferred.reject({
            code: STATUS_CODE.UNDEFINED_FEED_ID,
            message: STATUS_MESSAGES.UNDEFINED_FEED_ID
          });
        } else {
          if (type == "User") {
            if (page) {
              url = "https://api.vimeo.com/users/" + feedId + "/videos?page=" + page + "&per_page=" + countLimit;
            }
            else {
              url = "https://api.vimeo.com/users/" + feedId + "/videos?per_page=" + countLimit;
            }
          } else {
            if (page) {
              url = "https://api.vimeo.com/channels/" + feedId + "/videos?page=" + page + "&per_page=" + countLimit;
            }
            else {
              url = "https://api.vimeo.com/channels/" + feedId + "/videos?per_page=" + countLimit;
            }
          }

          req = {
            method: 'GET',
            url: url,
            headers: {
              'Authorization': 'bearer ' + VIMEO_KEYS.ACCESS_TOKEN
            }
          };
          $http(req).then(function (response) {
            // this callback will be called asynchronously
            // when the response is available
            deferred.resolve(response);
          }, function (error) {
            // called asynchronously if an error occurs
            // or server returns response with an error status.
            deferred.reject(error);
          });
        }

        return deferred.promise;
      };
      return {
        getSingleVideoDetails: getSingleVideoDetails,
        getFeedVideos: getFeedVideos
      };
    }])
    .factory('Location', [function () {
      var _location = window.location;
      return {
        goTo: function (path) {
          _location.href = path;
        }
      };
    }])
    .factory('VideoCache', [function () {
      var video = null;
      return {
        setVideo: function (data) {
          video = data;
        },
        getVideo: function () {
          return video;
        }
      };
    }]);
})(window.angular, window.buildfire);
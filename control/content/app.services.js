'use strict';

(function (angular, buildfire) {
  angular.module('vimeoPluginContent')
    .provider('Buildfire', [function () {
      var Buildfire = this;
      Buildfire.$get = function () {
        return buildfire
      };
      return Buildfire;
    }])
    .factory("DataStore", ['Buildfire', '$q', 'STATUS_CODE', 'STATUS_MESSAGES', function (Buildfire, $q, STATUS_CODE, STATUS_MESSAGES) {
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
        save: function (_item, _tagName) {
          var deferred = $q.defer();
          if (typeof _item == 'undefined') {
            return deferred.reject(new Error({
              code: STATUS_CODE.UNDEFINED_DATA,
              message: STATUS_MESSAGES.UNDEFINED_DATA
            }));
          }
          Buildfire.datastore.save(_item, _tagName, function (err, result) {
            if (err) {
              return deferred.reject(err);
            } else if (result) {
              return deferred.resolve(result);
            }
          });
          return deferred.promise;
        }
      }
    }])
    .factory("Utils", [function () {
      return {
        extractSingleVideoIdOrUserID: function (url) {
          var match = url.match(/(\.com)\/(.+)/);
          var rgx = /\/.+\/?/g;

          if (match && !rgx.test(match[2])) {
            return match[2].split("/")[0];
          } else {
            return null;
          }

        },
        extractFeedID: function (url) {
          var match = url.match(/(channels)\/(.+)/);
          if (match)
            return match[2];
          else
            return null;
        }
      }
    }]);

})(window.angular, window.buildfire);
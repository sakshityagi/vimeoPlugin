'use strict';

(function (angular) {
  angular.module('vimeoPluginWidget')
    .controller('WidgetSingleCtrl', ['$routeParams', '$scope', 'VimeoApi', 'DataStore', 'TAG_NAMES', 'Location', 'LAYOUTS', function ($routeParams, $scope, VimeoApi, DataStore, TAG_NAMES, Location, LAYOUTS) {
      var currentChannelID = null,
        currentItemListLayout = null;

      var WidgetSingle = this;
      WidgetSingle.data = null;
      WidgetSingle.video = null;

      /*
       * Fetch user's data from datastore
       */

      var init = function () {
        var success = function (result) {
            WidgetSingle.data = result.data;
            if (WidgetSingle.data && WidgetSingle.data.design && !WidgetSingle.data.design.itemListLayout) {
              WidgetSingle.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
            }
            currentItemListLayout = WidgetSingle.data.design.itemListLayout;
            currentChannelID = WidgetSingle.data.content.channelID;
          }
          , error = function (err) {
            console.error('Error while getting data', err);
          };
        DataStore.get(TAG_NAMES.VIMEO_INFO).then(success, error);
      };
      init();

      var getSingleVideoDetails = function (_videoId) {
        var success = function (result) {
            WidgetSingle.video = result.data;
          }
          , error = function (err) {
            console.error('Error In Fetching Single Video Details', err);
          };
        VimeoApi.getSingleVideoDetails(_videoId).then(success, error);
      };

      if ($routeParams.videoId) {
        getSingleVideoDetails($routeParams.videoId);
      } else {
        console.error('Undefined Video Id Provided');
      }

      var onUpdateCallback = function (event) {
        if (event && event.tag === TAG_NAMES.VIMEO_INFO) {
          WidgetSingle.data = event.data;
          if (!WidgetSingle.data.content.rssUrl) {
            $routeParams.videoId = '';
            WidgetSingle.video = null;
          } else if (!WidgetSingle.video && WidgetSingle.data.content.videoID && !$routeParams.videoId) {
            $routeParams.videoId = WidgetSingle.data.content.videoID;
            getSingleVideoDetails(WidgetSingle.data.content.videoID);
          } else if (!WidgetSingle.video && WidgetSingle.data.content.channelID && !$routeParams.videoId) {
            currentChannelID = WidgetSingle.data.content.channelID;
            Location.goTo("#/feed/" + WidgetSingle.data.content.channelID);
          }

          if (WidgetSingle.data.content.videoID && (WidgetSingle.data.content.videoID !== $routeParams.videoId)) {
            getSingleVideoDetails(WidgetSingle.data.content.videoID);
          } else if (WidgetSingle.data.content.channelID && (!$routeParams.videoId || (WidgetSingle.data.design.itemListLayout !== currentItemListLayout) || (WidgetSingle.data.content.channelID !== currentChannelID))) {
            currentChannelID = WidgetSingle.data.content.channelID;
            currentItemListLayout = WidgetSingle.data.design.itemListLayout;
            Location.goTo("#/feed/" + WidgetSingle.data.content.channelID);
          }
        }
      };
      DataStore.onUpdate().then(null, null, onUpdateCallback);

      $scope.$on("$destroy", function () {
        DataStore.clearListener();
      });
    }])
})(window.angular);


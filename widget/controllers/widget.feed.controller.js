'use strict';

(function (angular) {
  angular.module('vimeoPluginWidget')
    .controller('WidgetFeedCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'VimeoApi', '$routeParams', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope', 'LAYOUTS',
      function ($scope, DataStore, TAG_NAMES, STATUS_CODE, VimeoApi, $routeParams, VIDEO_COUNT, $sce, Location, $rootScope, LAYOUTS) {
        var WidgetFeed = this;

        WidgetFeed.data = null;
        //create new instance of buildfire carousel viewer
        var view = null;
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = null;
        var currentListLayout = null;
        var currentChannelId = $routeParams.channelID;

        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetFeed.data = result.data;
              if (WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout)) {
                WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
              }
              currentListLayout = WidgetFeed.data.design.itemListLayout;
              if (!currentChannelId) {
                currentChannelId = WidgetFeed.data.content.channelID;
              }
            }
            , error = function (err) {
              if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                console.error('Error while getting data', err);
              }
            };
          DataStore.get(TAG_NAMES.VIMEO_INFO).then(success, error);
        };

        init();
        $rootScope.$on("Carousel:LOADED", function () {
          if (!view) {
            view = new buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          } else {
            view.loadItems([]);
          }
        });

        var getFeedVideos = function (_channelId) {
          var success = function (result) {
              console.log("**************************", result);
              console.log(WidgetFeed.videos);
              WidgetFeed.videos = WidgetFeed.videos.length ? WidgetFeed.videos.concat(result.data.data) : result.data.data;
              WidgetFeed.nextPageToken = result.data.page + 1;
              if (WidgetFeed.videos.length < result.data.total) {
                WidgetFeed.busy = false;
              }
            }
            , error = function (err) {
              console.error('Error In Fetching Single Video Details', err);
            };
          VimeoApi.getFeedVideos(_channelId, VIDEO_COUNT.LIMIT, WidgetFeed.nextPageToken).then(success, error);
        };

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.VIMEO_INFO) {
            WidgetFeed.data = event.data;
            if (WidgetFeed.data && WidgetFeed.data.design && (!WidgetFeed.data.design.itemListLayout)) {
              WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
            }

            if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
              view._destroySlider();
              view = null;
            }
            else {
              if (view) {
                view.loadItems(WidgetFeed.data.content.carouselImages);
              }
            }
            currentListLayout = WidgetFeed.data.design.itemListLayout;

            if (!WidgetFeed.data.content.rssUrl) {
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = null;
            } else if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.channelID) {
              currentChannelId = WidgetFeed.data.content.channelID;
              getFeedVideos(WidgetFeed.data.content.channelID);
            }

            if (WidgetFeed.data.content && WidgetFeed.data.content.channelID && (WidgetFeed.data.content.channelID !== currentChannelId)) {
              currentChannelId = WidgetFeed.data.content.channelID;
              Location.goTo("#/feed/" + WidgetFeed.data.content.channelID);
            } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetFeed.loadMore = function () {
          if (WidgetFeed.busy) return;
          WidgetFeed.busy = true;
          getFeedVideos(currentChannelId);
        };

        WidgetFeed.safeHtml = function (html) {
          if (html)
            return $sce.trustAsHtml(html);
        };

        WidgetFeed.showDescription = function (description) {
          return !(description == '<p>&nbsp;<br></p>');
        };
        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });
      }])
})(window.angular);

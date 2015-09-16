'use strict';

(function (angular) {
  angular.module('vimeoPluginWidget')
    .controller('WidgetFeedCtrl', ['$scope', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'VimeoApi', '$routeParams', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope', 'LAYOUTS', 'CONTENT_TYPE',
      function ($scope, DataStore, TAG_NAMES, STATUS_CODE, VimeoApi, $routeParams, VIDEO_COUNT, $sce, Location, $rootScope, LAYOUTS, CONTENT_TYPE) {
        var WidgetFeed = this;

        WidgetFeed.data = null;
        //create new instance of buildfire carousel viewer
        var view = null;
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = 1;
        WidgetFeed.showSpinner = false;
        var currentListLayout = null;
        var currentFeedId = $routeParams.feedId;
        var feedType = "Channel";

        /*
         * Fetch user's data from datastore
         */
        var init = function () {
          var success = function (result) {
              WidgetFeed.data = result.data;
              if (!WidgetFeed.data.content)
                WidgetFeed.data.content = {};
              if (!WidgetFeed.data.design)
                WidgetFeed.data.design = {};
              if (!WidgetFeed.data.design.itemListLayout) {
                WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
              }
              currentListLayout = WidgetFeed.data.design.itemListLayout;
              if (WidgetFeed.data.content && !currentFeedId) {
                currentFeedId = WidgetFeed.data.content.feedID;
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

        var getFeedVideos = function (_feedId) {
          WidgetFeed.showSpinner = true;
          var success = function (result) {
              WidgetFeed.showSpinner = false;
              WidgetFeed.videos = WidgetFeed.videos.length ? WidgetFeed.videos.concat(result.data.data) : result.data.data;
              WidgetFeed.nextPageToken = result.data.page + 1;
              if (WidgetFeed.videos.length < result.data.total) {
                WidgetFeed.busy = false;
              }
            }
            , error = function (err) {
              WidgetFeed.showSpinner = false;
              console.log('Error In Fetching Single Video Details', err);
            };
          if (WidgetFeed.data.content && WidgetFeed.data.content.type === CONTENT_TYPE.USER_FEED)
            feedType = "User";
          else
            feedType = "Channel";
          VimeoApi.getFeedVideos(feedType, _feedId, VIDEO_COUNT.LIMIT, WidgetFeed.nextPageToken).then(success, error);
        };

        var onUpdateCallback = function (event) {
          if (event && event.tag === TAG_NAMES.VIMEO_INFO) {
            WidgetFeed.data = event.data;
            if (!WidgetFeed.data.content)
              WidgetFeed.data.content = {};
            if (!WidgetFeed.data.design)
              WidgetFeed.data.design = {};
            if (!WidgetFeed.data.design.itemListLayout) {
              WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
            }
            if (WidgetFeed.data.design && WidgetFeed.data.content) {
              if ((currentListLayout != WidgetFeed.data.design.itemListLayout) && view && WidgetFeed.data.content.carouselImages) {
                view._destroySlider();
                view = null;
              }
              else {
                if (view) {
                  view.loadItems(WidgetFeed.data.content.carouselImages);
                }
              }
              currentListLayout = WidgetFeed.data.design.itemListLayout;
            }

            if (!WidgetFeed.data.content.rssUrl) {
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = 1;
            } else if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.feedID) {
              currentFeedId = WidgetFeed.data.content.feedID;
              getFeedVideos(WidgetFeed.data.content.feedID);
            }

            if (WidgetFeed.data.content && WidgetFeed.data.content.feedID && (WidgetFeed.data.content.feedID !== currentFeedId)) {
              currentFeedId = WidgetFeed.data.content.feedID;
              Location.goTo("#/feed/" + WidgetFeed.data.content.feedID);
            } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetFeed.loadMore = function () {
          if (WidgetFeed.busy) return;
          WidgetFeed.busy = true;
          getFeedVideos(currentFeedId);
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

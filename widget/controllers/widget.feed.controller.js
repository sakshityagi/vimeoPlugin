'use strict';

(function (angular,buildfire) {
  angular.module('vimeoPluginWidget')
    .controller('WidgetFeedCtrl', ['$scope', 'Buildfire', 'DataStore', 'TAG_NAMES', 'STATUS_CODE', 'VimeoApi', 'VIDEO_COUNT', '$sce', 'Location', '$rootScope', 'LAYOUTS', 'CONTENT_TYPE', 'VideoCache',
      function ($scope, Buildfire, DataStore, TAG_NAMES, STATUS_CODE, VimeoApi, VIDEO_COUNT, $sce, Location, $rootScope, LAYOUTS, CONTENT_TYPE, VideoCache) {
        var WidgetFeed = this;

        WidgetFeed.data = null;
        //create new instance of buildfire carousel viewer
        var view = null;
        WidgetFeed.videos = [];
        WidgetFeed.busy = false;
        WidgetFeed.nextPageToken = 1;
        var currentListLayout = null;
        WidgetFeed.currentFeedId = null;
        var feedType = "Channel";
        $rootScope.showFeed = true;

        /*declare the device width heights*/
        $rootScope.deviceHeight = window.innerHeight;
        $rootScope.deviceWidth = window.innerWidth || 320;

        /*
         * Fetch user's data from datastore
         */
        var initData = function(isRefresh) {
            var success = function (result) {
                WidgetFeed.data = result.data;
                if (!WidgetFeed.data.content)
                  WidgetFeed.data.content = {};
                if (!WidgetFeed.data.design)
                  WidgetFeed.data.design = {};
                if (!WidgetFeed.data.content)
                  WidgetFeed.data.content = {};
                if (!WidgetFeed.data.design.itemListLayout) {
                  WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
                }
                if (WidgetFeed.data.design.itemListBgImage) {
                  $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
                }
                if (!result.id) {
                  WidgetFeed.data.content.feedID = TAG_NAMES.DEFAULT_FEED_ID;
                }
                if (WidgetFeed.data.content.type)
                  $rootScope.contentType = WidgetFeed.data.content.type;
                currentListLayout = WidgetFeed.data.design.itemListLayout;
                if (WidgetFeed.data.content) {
                  WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
                }
                if (isRefresh) {
                  if (currentListLayout != WidgetFeed.data.design.itemListLayout && view && WidgetFeed.data.content.carouselImages) {
                    if (WidgetFeed.data.content.carouselImages.length)
                      view._destroySlider();
                    view = null;
                  }
                  else {
                    if (view) {
                      view.loadItems(WidgetFeed.data.content.carouselImages);
                    }
                  }

                  WidgetFeed.loadMore();
                }
                if (!$scope.$$phase)
                  $scope.$digest();
              }
              , error = function (err) {
                if (err && err.code !== STATUS_CODE.NOT_FOUND) {
                  console.error('Error while getting data', err);
                }
              };
            DataStore.get(TAG_NAMES.VIMEO_INFO).then(success, error);
          };
        var init = function () {
          initData(false);
        };
        init();
        $rootScope.$on("Carousel:LOADED", function () {
          if (!view) {
            view = new Buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetFeed.data.content && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          } else {
            view.loadItems([]);
          }
        });

        var getFeedVideos = function (_feedId) {
         Buildfire.spinner.show();
          var success = function (result) {
              Buildfire.spinner.hide();
              WidgetFeed.videos = WidgetFeed.videos.length ? WidgetFeed.videos.concat(result.data.data) : result.data.data;
              WidgetFeed.nextPageToken = result.data.page + 1;
              if (WidgetFeed.videos.length < result.data.total) {
                WidgetFeed.busy = false;
              }
            }
            , error = function (err) {
              Buildfire.spinner.hide();
              console.log('Error In Fetching Single Video Details', err);
            };
          if (WidgetFeed.data && WidgetFeed.data.content && WidgetFeed.data.content.type === CONTENT_TYPE.USER_FEED)
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
            if (WidgetFeed.data.content.type)
              $rootScope.contentType = WidgetFeed.data.content.type;
            if (!WidgetFeed.data.design.itemListLayout) {
              WidgetFeed.data.design.itemListLayout = LAYOUTS.listLayouts[0].name;
            }
            if (WidgetFeed.data.design.itemListBgImage) {
              $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
            }  else{
              $rootScope.backgroundListImage="";
            }
            if (WidgetFeed.data.design && WidgetFeed.data.content) {
              if ((currentListLayout != WidgetFeed.data.design.itemListLayout) && view && WidgetFeed.data.content.carouselImages) {
                if (WidgetFeed.data.content.carouselImages.length)
                  view._destroySlider();
                view = null;
              }
              else {
                if (view) {
                  view.loadItems(WidgetFeed.data.content.carouselImages);
                }
              }
              currentListLayout = WidgetFeed.data.design.itemListLayout;
              WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
            }

            if (!WidgetFeed.data.content.rssUrl) {
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = 1;
            } else if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.feedID) {
              WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
              getFeedVideos(WidgetFeed.data.content.feedID);
            }

            if (WidgetFeed.data.content && WidgetFeed.data.content.feedID) {
              WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
              WidgetFeed.videos = [];
              WidgetFeed.busy = false;
              WidgetFeed.nextPageToken = null;
              WidgetFeed.loadMore();
            } else if (WidgetFeed.data.content && WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);

            WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
          }
        };
        DataStore.onUpdate().then(null, null, onUpdateCallback);

        WidgetFeed.loadMore = function () {
          if (WidgetFeed.busy) return;
          WidgetFeed.busy = true;
          if (WidgetFeed.currentFeedId && WidgetFeed.currentFeedId !== '1') {
            getFeedVideos(WidgetFeed.currentFeedId);
          }
          else {
            if (WidgetFeed.data.content.videoID)
              Location.goTo("#/video/" + WidgetFeed.data.content.videoID);
          }
        };

        WidgetFeed.safeHtml = function (html) {
            if (html) {
                var $html = $('<div />', {html: html});
                $html.find('iframe').each(function (index, element) {
                    var src = element.src;
                    console.log('element is: ', src, src.indexOf('http'));
                    src = src && src.indexOf('file://') != -1 ? src.replace('file://', 'http://') : src;
                    element.src = src && src.indexOf('http') != -1 ? src : 'http:' + src;
                });
                return $sce.trustAsHtml($html.html());
            }
        };

        WidgetFeed.showDescription = function (description) {
          var _retVal = false;
          if (description) {
            description = description.trim();
            if ((description !== '<p>&nbsp;<br></p>') && (description !== '<p><br data-mce-bogus="1"></p>')) {
              _retVal = true;
            }
          }
          return _retVal;
        };

        WidgetFeed.openDetailsPage = function (video) {
          VideoCache.setVideo(video);
          var videoId = video.uri.split("/").pop();
          Location.goTo('#/video/' + videoId);
        };

        $rootScope.$on("ROUTE_CHANGED", function (e, data) {
          WidgetFeed.data = data;
          if (!WidgetFeed.data.design)
            WidgetFeed.data.design = {};
          if (!WidgetFeed.data.content)
            WidgetFeed.data.content = {};
          if (!(WidgetFeed.videos.length > 0) && WidgetFeed.data.content.feedID) {
            WidgetFeed.currentFeedId = WidgetFeed.data.content.feedID;
            getFeedVideos(WidgetFeed.data.content.feedID);
          }
          if (!view) {
            view = new Buildfire.components.carousel.view("#carousel", []);
          }
          if (WidgetFeed.data.design.itemListBgImage) {
            $rootScope.backgroundListImage = WidgetFeed.data.design.itemListBgImage;
          }
          else{
            $rootScope.backgroundListImage="";
          }
          if (view && WidgetFeed.data.content.carouselImages) {
            view.loadItems(WidgetFeed.data.content.carouselImages);
          }
          DataStore.onUpdate().then(null, null, onUpdateCallback);

          buildfire.datastore.onRefresh(function () {
            WidgetFeed.videos = [];
            WidgetFeed.busy = false;
            WidgetFeed.nextPageToken = null;
            initData(true);
          });
        });

        $scope.$on("$destroy", function () {
          DataStore.clearListener();
        });

        buildfire.datastore.onRefresh(function () {
          WidgetFeed.videos = [];
          WidgetFeed.busy = false;
          WidgetFeed.nextPageToken = null;
          initData(true);
        });
      }])
})(window.angular, window.buildfire);

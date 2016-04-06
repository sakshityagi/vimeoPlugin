'use strict';

(function (angular) {
  angular.module('vimeoPluginWidget')
    .constant('TAG_NAMES', {
      VIMEO_INFO: 'VimeoInfo',
      DEFAULT_FEED_ID: 'pmg'
    })
    .constant('STATUS_CODE', {
      INSERTED: 'inserted',
      UPDATED: 'updated',
      NOT_FOUND: 'NOTFOUND',
      UNDEFINED_DATA: 'UNDEFINED_DATA',
      UNDEFINED_OPTIONS: 'UNDEFINED_OPTIONS',
      UNDEFINED_ID: 'UNDEFINED_ID',
      ITEM_ARRAY_FOUND: 'ITEM_ARRAY_FOUND',
      NOT_ITEM_ARRAY: 'NOT_ITEM_ARRAY',
      UNDEFINED_EVENT: 'UNDEFINED_EVENT',
      UNDEFINED_VIDEO_ID: 'UNDEFINED_VIDEO_ID',
      UNDEFINED_FEED_ID: 'UNDEFINED_FEED_ID'
    })
    .constant('STATUS_MESSAGES', {
      UNDEFINED_DATA: 'Undefined data provided',
      UNDEFINED_OPTIONS: 'Undefined options provided',
      UNDEFINED_ID: 'Undefined id provided',
      NOT_ITEM_ARRAY: 'Array of Items not provided',
      ITEM_ARRAY_FOUND: 'Array of Items provided',
      UNDEFINED_EVENT: 'Undefined event received',
      UNDEFINED_VIDEO_ID: 'Undefined video id provided',
      UNDEFINED_FEED_ID: 'Undefined feed id provided'
    })
    .constant('CONTENT_TYPE', {
      CHANNEL_FEED: 'Channel Feed',
      USER_FEED: 'User Feed',
      SINGLE_VIDEO: 'Single Video'
    })
    .constant('VIMEO_KEYS', {
      ACCESS_TOKEN: 'fa3b572099781e58e1506be643c3934c'
    })
    .constant('VIDEO_COUNT', {
      LIMIT: 8
    })
    .constant('LAYOUTS', {
      listLayouts: [
        {name: "List_Layout_1"},
        {name: "List_Layout_2"},
        {name: "List_Layout_3"},
        {name: "List_Layout_4"}
      ]
    });
})(window.angular);
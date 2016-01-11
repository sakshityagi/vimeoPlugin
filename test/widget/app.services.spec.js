describe('Unit : vimeoPlugin widget services', function () {
  describe('Unit: Buildfire Provider', function () {
    var Buildfire;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_Buildfire_) {
      Buildfire = _Buildfire_;
    }));

    it('Buildfire should exist and be an object', function () {
      expect(typeof Buildfire).toEqual('object');
    });
  });
  describe('Unit : DataStore Factory', function () {
    var DataStore, Buildfire, STATUS_MESSAGES, STATUS_CODE;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_DataStore_, _STATUS_CODE_, _STATUS_MESSAGES_) {
      DataStore = _DataStore_;
      Buildfire = {
        datastore: {}
      };
      Buildfire.datastore = jasmine.createSpyObj('Buildfire.datastore', ['get', 'getById', 'insert', 'update', 'save', 'onUpdate', 'clearListener']);
    }));

    it('DataStore should exist and be an object', function () {
      expect(typeof DataStore).toEqual('object');
    });
    it('DataStore.get should exist and be a function', function () {
      expect(typeof DataStore.get).toEqual('function');
    });
    it('DataStore.onUpdate should exist and be a function', function () {
      expect(typeof DataStore.onUpdate).toEqual('function');
    });
    it('DataStore.clearListener should exist and be a function', function () {
      expect(typeof DataStore.clearListener).toEqual('function');
    });
  });
  describe('Unit : VimeoApi Factory', function () {
    var VimeoApi;
    beforeEach(module('vimeoPluginWidget'));

    beforeEach(inject(function (_VimeoApi_) {
      VimeoApi = _VimeoApi_;
    }));
    describe('Units should be defined', function () {
      it('VimeoApi should exist and be an object', function () {
        expect(typeof VimeoApi).toEqual('object');
      });
      it('VimeoApi.getSingleVideoDetails should exist and be a function', function () {
        expect(typeof VimeoApi.getSingleVideoDetails).toEqual('function');
      });
      it('VimeoApi.getFeedVideos should exist and be a function', function () {
        expect(typeof VimeoApi.getFeedVideos).toEqual('function');
      });
    });
  });
  describe('Unit : Location Factory', function () {
    var Location;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_Location_) {
      Location = _Location_;
    }));
    describe('Units should be defined', function () {
      it('Location should exist and be an object', function () {
        expect(typeof Location).toEqual('object');
      });
      it('Location.goTo should exist and be a function', function () {
        expect(typeof Location.goTo).toEqual('function');
      });
    });
  });
  describe('Unit : VideoCache Factory', function () {
    var VideoCache;
    beforeEach(module('vimeoPluginWidget'));
    beforeEach(inject(function (_VideoCache_) {
      VideoCache = _VideoCache_;
    }));
    describe('Units should be defined', function () {
      it('VideoCache should exist and be an object', function () {
        expect(typeof VideoCache).toEqual('object');
      });
      it('VideoCache.goTo should exist and be a function', function () {
        expect(typeof VideoCache.setVideo).toEqual('function');
      });
      it('VideoCache.goTo should exist and be a function', function () {
        expect(typeof VideoCache.getVideo).toEqual('function');
      });
    });
  });

});
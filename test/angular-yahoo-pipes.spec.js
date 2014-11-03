describe('dyYahooPipes', function() {
  beforeEach(module('dyYahooPipes'));

  describe('dyYahooPipesParser', function() {
    var dyYahooPipesParser;

    beforeEach(inject(function (_dyYahooPipesParser_) {
      dyYahooPipesParser = _dyYahooPipesParser_;
    }));

    describe('parseItem(item)', function() {
      var DY_YAHOO_PIPES_PARSE_FUNCTIONS, itemMock, parsedItem;

      // Mock  fucntions from DY_YAHOO_PIPES_PARSE_FUNCTIONS
      beforeEach(inject(function (_DY_YAHOO_PIPES_PARSE_FUNCTIONS_) {
        DY_YAHOO_PIPES_PARSE_FUNCTIONS = _DY_YAHOO_PIPES_PARSE_FUNCTIONS_;

        angular.forEach(Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS), function(fnName) {
          spyOn(DY_YAHOO_PIPES_PARSE_FUNCTIONS, fnName).and.returnValue('parsed ' + fnName);
        });
      }));

      beforeEach(function() {
        itemMock = {};
        parsedItem = dyYahooPipesParser.parseItem(itemMock);
      });

      it('should call each parse function with item', function() {
        angular.forEach(Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS), function(fnName) {
          expect(DY_YAHOO_PIPES_PARSE_FUNCTIONS[fnName]).toHaveBeenCalledWith(itemMock);
        });
      });

      it('should return item with properties from DY_YAHOO_PIPES_PARSE_FUNCTIONS', function () {
        expect(Object.keys(parsedItem)).toEqual(Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS));
      });

      it('should set properties to result of perse function', function() {
        angular.forEach(Object.keys(DY_YAHOO_PIPES_PARSE_FUNCTIONS), function(fnName) {
          expect(parsedItem[fnName]).toBe('parsed ' + fnName);
        });
      });
    });

    describe('parseResponseData(responseData, count)', function() {
      var parsedItemMock, parsedResponseData;

      beforeEach(function() {
        parsedItemMock = {};
        spyOn(dyYahooPipesParser, 'parseItem').and.callFake(function(item) {
          return 'parsed ' + item;
        });
      });

      describe('when there is not value.items in response data', function() {
        beforeEach(function() {
          parsedResponseData = dyYahooPipesParser.parseResponseData({}, 4);
        });

        it('should return empty array ', function() {
          expect(parsedResponseData).toEqual([]);
        });
      });

      describe('when there is value.items in response data', function() {
        var itemMock1, itemMock2, itemMock3, itemMock4, itemMock5, responseDataMock;

        beforeEach(function() {
          itemMock1 = 'itemMock1';
          itemMock2 = 'itemMock2';
          itemMock3 = 'itemMock3';
          itemMock4 = 'itemMock4';
          itemMock5 = 'itemMock5';

          responseDataMock = {value: {items: [itemMock1, itemMock2, itemMock3, itemMock4, itemMock5 ] }};

          parsedResponseData = dyYahooPipesParser.parseResponseData(responseDataMock, 4);
        });

        it('should call parseItem for 4 first items', function() {
          expect(dyYahooPipesParser.parseItem).toHaveBeenCalledWith(itemMock1, jasmine.any(Number), jasmine.any(Array));
          expect(dyYahooPipesParser.parseItem).toHaveBeenCalledWith(itemMock2, jasmine.any(Number), jasmine.any(Array));
          expect(dyYahooPipesParser.parseItem).toHaveBeenCalledWith(itemMock3, jasmine.any(Number), jasmine.any(Array));
          expect(dyYahooPipesParser.parseItem).toHaveBeenCalledWith(itemMock4, jasmine.any(Number), jasmine.any(Array));
        });

        it('should not call parseItem for 5th items', function() {
          expect(dyYahooPipesParser.parseItem).not.toHaveBeenCalledWith(itemMock5, jasmine.any(Number), jasmine.any(Array));
        });

        it('should return array with parsed items', function() {
          expect(parsedResponseData).toEqual(['parsed itemMock1', 'parsed itemMock2', 'parsed itemMock3', 'parsed itemMock4'])
        });
      });
    });
  });

  describe('dyYahooPipesFetcher', function() {
    var $httpBackend, dyYahooPipesFetcher, dyYahooPipesParser;

    beforeEach(inject(function (_$httpBackend_, _dyYahooPipesFetcher_, _dyYahooPipesParser_) {
      $httpBackend = _$httpBackend_;
      dyYahooPipesFetcher = _dyYahooPipesFetcher_;
      dyYahooPipesParser = _dyYahooPipesParser_;
    }));

    describe('fetch(pipeId, count)', function() {
      var fetchResult, pipeIdMock, expectedRequestUrl, responseDataMock, parsedResponseDataMock, resolveValue;

      beforeEach(function() {
        responseDataMock = {};
        parsedResponseDataMock = {};
        spyOn(dyYahooPipesParser, 'parseResponseData').and.returnValue(parsedResponseDataMock);
        pipeIdMock = 'pipeIdMock';
        expectedRequestUrl = 'http://pipes.yahoo.com/pipes/pipe.run?_render=json&_id=' + pipeIdMock + '&_callback=JSON_CALLBACK';
        $httpBackend.whenJSONP(expectedRequestUrl).respond(responseDataMock);;

        dyYahooPipesFetcher.fetch(pipeIdMock, 4).then(function(result) {
          resolveValue = result;
        });
      });

      afterEach(function() {
        $httpBackend.verifyNoOutstandingExpectation();
        $httpBackend.verifyNoOutstandingRequest();
      });

      it('should return unresolved promise', function() {
        expect(resolveValue).toBeUndefined();
        $httpBackend.flush();
      });

      it('should make jsonp request to right url', function() {
        $httpBackend.expectJSONP(expectedRequestUrl);
        $httpBackend.flush();
      });

      describe('when reponse is recived', function() {
        beforeEach(function() {
          $httpBackend.flush();
        });

        it('should call dyYahooPipesParser.parseResponseData with responseData and count', function() {
          expect(dyYahooPipesParser.parseResponseData).toHaveBeenCalledWith(responseDataMock, 4);
        });

        it('should resolve promise by parsed response data', function() {
          expect(resolveValue).toBe(parsedResponseDataMock);
        });
      });
    });
  });

  describe('DY_YAHOO_PIPES_PARSE_FUNCTIONS', function() {
    var DY_YAHOO_PIPES_PARSE_FUNCTIONS;

    beforeEach(inject(function (_DY_YAHOO_PIPES_PARSE_FUNCTIONS_) {
      DY_YAHOO_PIPES_PARSE_FUNCTIONS = _DY_YAHOO_PIPES_PARSE_FUNCTIONS_;
    }));

    describe('title(item)', function() {
      it('should return title propertie of passed object', function() {
        var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.title({
          title: 'titleMock'
        });

        expect(result).toBe('titleMock');
      });
    });

    describe('link(item)', function() {
      it('should return link propertie of passed object', function() {
        var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.link({
          link: 'linkMock'
        });

        expect(result).toBe('linkMock');
      });
    });

    describe('description(item)', function() {
      it('should return description propertie of passed object', function() {
        var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.description({
          description: 'descriptionMock'
        });

        expect(result).toBe('descriptionMock');
      });

      describe('when there are HTML tags in description', function() {
        it('should return description without it', function() {
          var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.description({
            description: '<h1>descriptionMock</h1><img src="bar.jpg"/>'
          });

          expect(result).toBe('descriptionMock');
        });
      });

      describe('when there are encoded characters', function() {
        it('should return description without it', function() {
          var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.description({
            description: '&amp;descriptionMock&amp;'
          });

          expect(result).toBe('descriptionMock');
        });
      });

      describe('when there is Read More link', function() {
        it('should return description without it', function() {
          var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.description({
            description: 'descriptionMock<a href="example.com">Read More</a>'
          });

          expect(result).toBe('descriptionMock');
        });
      });
    });

    describe('imageUrl(item)', function() {
      describe('where media:thumbnail in paseed object is not array', function() {
        it('should return url of media:thumbnail of passed object', function() {
          var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.imageUrl({
            'media:thumbnail': {
              url: 'imageUrlMock'
            }
          });

          expect(result).toBe('imageUrlMock');
        });
      });

      describe('where media:thumbnail in paseed object is array', function() {
        it('should return url of first media:thumbnail of passed object', function() {
          var result = DY_YAHOO_PIPES_PARSE_FUNCTIONS.imageUrl({
            'media:thumbnail': [
              {
                url: 'imageUrlMock'
              },
              {
                url: 'secondImageUrlMock'
              }
            ]
          });

          expect(result).toBe('imageUrlMock');
        });
      });
    });
  });
});

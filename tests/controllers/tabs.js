describe('Tabs SubControllers', function () {
  var PVECtrl, $scope;
  var alertSpy;
  var expect = chai.expect;

  beforeEach(module('app.templates'));
  beforeEach(module('app.controllers'));
  beforeEach(module('app.services'));

  beforeEach(inject(function ($rootScope, $controller) {
   PVECtrl = $controller('PVECtrl', {$scope: $rootScope.$new()});
   $scope = $rootScope;
  }));

  it('Should have a PVECtrl', function () {
    expect(PVECtrl).to.exist;
  });
});
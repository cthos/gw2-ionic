describe('GW2API', function () {
  var ItemPopup, $scope;
  var alertSpy;
  var expect = chai.expect;

  beforeEach(module('app.services'));
  
  beforeEach(module(function($provide) {
    $provide.service('$ionicPopup', function() {
      alertSpy = sinon.spy();
      this.alert = alertSpy;
    });
  }));

  beforeEach(inject(function (_ItemPopup_, $rootScope) {
   ItemPopup = _ItemPopup_;
   $scope = $rootScope;
  }));

  it('Should have a ItemPopup Service', function () {
    expect(ItemPopup).to.exist;
  });

  it('Should show popup on pop method', function () {
    ItemPopup.pop({}, $scope);

    expect(alertSpy.called).to.be.true;
  });
});
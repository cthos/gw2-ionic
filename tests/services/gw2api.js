describe('GW2API', function () {
  var GW2API, $scope;
  var expect = chai.expect;


  beforeEach(angular.module('app.services'));
  beforeEach(angular.mock.inject(function () {
   
  }));

  it('Should have a GW2API Service', function () {
    expect(GW2API).to.exist;
  });
});
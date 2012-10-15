var Browser = require('zombie')
var should = require('should')
var Driver = require('./driver')

describe("Listing the hotel rooms", function() {
  var driver = new Driver('../Hotelier/Hotelier')
    , client = null


  before(function(done) {
    driver.start(done)
  })

  describe("With a single hotel room", function() {
    before(function(done) {
      driver.invoke('addHotelRoom', {
        id: '1',
        number: '101'
      }, done)
    })

    describe("Viewing the home page", function() {
      before(function(done) {
        client = new Browser()
        client.visit(driver.baseHref, done)
      })

      it("should have the hotel with the correct number", function() {
        client.querySelector('.hotel .number').text()
          .should.equal('101')
      })

      it("should have a link to manage the hotel room", function() {
        client.querySelector('.hotel a').getAttribute('href')
          .should.contain('101')
      })
    })
  })
})

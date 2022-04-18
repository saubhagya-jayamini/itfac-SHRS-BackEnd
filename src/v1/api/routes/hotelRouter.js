const hotelController = require('../controllers/hotelController.js')
const savedhotelController = require('../controllers/savedhotelController.js')

const router = require('express').Router()

router.post('/registerHotel', hotelController.registerHotel)
router.get('/getAllHotels', hotelController.getAllHotels)
router.post('/getHotelById', hotelController.getHotelById)
router.put('/updateHotelById/:id', hotelController.updateHotelById)
router.delete('/deleteHotelById/:id', hotelController.deleteHotelById)
router.post('/getAllHotelsByProvince', hotelController.getAllHotelsByProvince)
router.post('/getAllHotelsByDistrict', hotelController.getAllHotelsByDistrict)
router.post('/search', hotelController.search)
//pagination fetch
router.post('/getHotelsByStatus', hotelController.getHotelsByStatus)

router.post('/saveHotel', savedhotelController.saveHotel)
router.post('/reserveSavedBooking', savedhotelController.reserveSavedBooking)
router.post(
  '/getSavedhotelByCustomerId',
  savedhotelController.getSavedhotelByCustomerId
)
router.delete(
  '/deleteSavedHotel/:hotelId/:customerId',
  savedhotelController.deleteSavedBooking
)

module.exports = router

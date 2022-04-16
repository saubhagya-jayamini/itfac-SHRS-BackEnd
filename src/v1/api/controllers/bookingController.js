const db = require('../models')
const Booking = db.bookings
const VAS = db.vas
const Hotel = db.hotels
const Room = db.rooms
const Roominfo = db.roominfo

var Sequelize = require('sequelize')
var sequelize = require('sequelize')
const Op = Sequelize.Op

//new booking
const booking = async (req, res) => {
  let startDate = new Date(req.body.checkInDate)
  let endDate = new Date(req.body.checkOutDate)
  let reqRooms = req.body.noRooms

  await Booking.findOne({
    attributes: [
      ['roomRoomId', 'roomId'],
      [sequelize.fn('sum', sequelize.col('noRooms')), 'total'],
    ],
    group: ['roomRoomId'],
    where: {
      [Op.or]: [
        {
          [Op.and]: [
            {
              checkInDate: {
                [Op.lte]: startDate,
              },
            },
            {
              checkOutDate: {
                [Op.gte]: startDate,
              },
            },
          ],
        },
        {
          [Op.and]: [
            {
              checkInDate: {
                [Op.lte]: endDate,
              },
            },
            {
              checkOutDate: {
                [Op.gte]: endDate,
              },
            },
          ],
        },
      ],
      roomRoomId: req.body.roomId,
    },
  })
    .then((BookingCount) => {
      let totalRooms = parseInt(reqRooms)
      if (BookingCount != null) {
        totalRooms += parseInt(BookingCount.dataValues.total)
      }

      Room.findOne({
        attributes: ['qty'],
        where: { roomId: req.body.roomId },
      })
        .then((roomQty) => {
          // console.log(roomQty.qty)
          // console.log(reqRooms)
          if (roomQty.qty >= totalRooms) {
            Room.findOne({
              attributes: ['hotelHotelId'],
              where: { roomId: req.body.roomId },
            })
              .then(async (hotelId) => {
                let info = {
                  checkInDate: req.body.checkInDate,
                  checkOutDate: req.body.checkOutDate,
                  specialRequest: req.body.specialRequest,
                  arrivalTime: req.body.arrivalTime,
                  guestName: req.body.guestName,
                  rentCar: req.body.rentCar,
                  customerId: req.body.customerId,
                  roomRoomId: req.body.roomId,
                  hotelHotelId: hotelId.hotelHotelId,
                  noRooms: req.body.noRooms,
                }
                let vasId = req.body.vasId
                let vasinfo = await VAS.findOne({ where: { vasId: vasId } })
                await Booking.create(info)
                  .then((booking) => {
                    booking
                      .addVas(vasinfo)
                      .then(async (data) => {
                        res.status(200).send(booking)
                      })
                      .catch((err) => {
                        console.log(err)
                        res.status(500).send(err)
                      })
                  })
                  .catch((err) => {
                    console.log(err)
                    res.status(500).send(err)
                  })
              })
              .catch((err) => {
                res.status(500).send(err)
              })
          } else {
            console.log('unavailable')
            res.status(200).send('unavailable')
          }
        })
        .catch((err) => {
          console.log(err)
          res.status(500).send(err)
        })
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

// Get all bookings
const getAllBookings = async (req, res) => {
  await Booking.findAll({
    include: [
      {
        model: VAS,
      },
    ],
  })
    .then((bookings) => res.status(200).send(bookings))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

//Get booking by ID
const getBookingById = async (req, res) => {
  let id = req.body.id
  await Booking.findOne({
    where: { bookingId: id },
    include: [
      {
        model: VAS,
      },
    ],
  })
    .then((booking) => res.status(200).send(booking))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
//Get booking by user ID
const getBookingByUserId = async (req, res) => {
  let id = req.body.id
  let page = req.body.page
  let offset = page * 10
  await Booking.findAndCountAll({
    offset: offset,
    limit: 10,
    where: { customerId: id },
  })
    .then((booking) => res.status(200).send(booking))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

//Get booking current by user ID
const getCurrentBookingByUserId = async (req, res) => {
  let id = req.body.id
  let page = req.body.page
  let offset = page * 10
  let today = new Date()
  await Booking.findAndCountAll({
    offset: offset,
    limit: 10,
    where: {
      customerId: id,
      checkInDate: {
        [Op.gte]: today,
      },
    },
  })
    .then((booking) => res.status(200).send(booking))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
//Get booking past by user ID
const getPastBookingByUserId = async (req, res) => {
  let id = req.body.id
  let page = req.body.page
  let offset = page * 10
  let today = new Date()
  await Booking.findAndCountAll({
    offset: offset,
    limit: 10,
    where: {
      customerId: id,
      checkInDate: {
        [Op.lte]: today,
      },
    },
  })
    .then((booking) => res.status(200).send(booking))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}
//  update booking by ID
const updateBookingById = async (req, res) => {
  let id = req.params.id
  await Booking.update(req.body, { where: { bookingId: id } })
    .then((booking) => res.status(200).send(booking))
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

//  Delete booking by ID
const deleteBookingByID = async (req, res) => {
  let id = req.params.id
  await Booking.destroy({ where: { bookingId: id } })
    .then((booking) => {
      if (booking != 0) {
        res.status(200).send('Success')
      } else {
        res.status(200).send('Error')
      }
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

//add vas to bookings

const addVASToBooking = async (req, res) => {
  let info = {
    checkInDate: req.body.checkInDate,
    checkOutDate: req.body.checkOutDate,
    specialRequest: req.body.specialRequest,
    arrivalTime: req.body.arrivalTime,
    guestName: req.body.guestName,
    rentCar: req.body.rentCar,
    customerId: req.body.customerId,
  }
  let vasId = req.body.vasId
  let vasinfo = await VAS.findOne({ where: { vasId: vasId } })

  let bookingId = req.body.bookingId
  let bookinginfo = await Booking.findOne({ where: { bookingId: bookingId } })

  // console.log(vasinfo)
  // console.log(bookinginfo)
  await bookinginfo
    .addVas(vasinfo)
    .then((data) => {
      res.status(200).send('success')
    })
    .catch((err) => {
      console.log(err)
      res.status(500).send(err)
    })
}

module.exports = {
  booking,
  getAllBookings,
  getBookingById,
  updateBookingById,
  deleteBookingByID,
  addVASToBooking,
  getBookingByUserId,
  getCurrentBookingByUserId,
  getPastBookingByUserId,
}

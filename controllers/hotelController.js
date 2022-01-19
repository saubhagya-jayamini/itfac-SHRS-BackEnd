const db= require('../models')
var Sequelize = require('sequelize');
const { bookings } = require('../models');
const Hotel= db.hotels
const Op = Sequelize.Op;
const Roominfo= db.roominfo
const Booking= db.bookings
const Room= db.rooms



//register new hotel
const registerHotel = async(req,res) =>{

    let info={
        name:req.body.name,
        phoneNumber:req.body.phoneNumber,
        description:req.body.description,
        province:req.body.province,
        district:req.body.district,
        town:req.body.town,
        Street1:req.body.Street1,
        Street2:req.body.Street2,
    }

    await Hotel.create(info)
    .then(hotel=>res.status(200).send(hotel))
    .catch(err=>console.log(err))

}

//get all hotels
const getAllHotels = async (req, res) => {

    let hotels = await Hotel.findAll({})
    res.status(200).send(hotels)

}

//get a hotel by id
const getHotelById = async (req, res) => {

    let id = req.body.id
    let hotel = await Hotel.findAll({ where: { hotelId: id }})
    res.status(200).send(hotel)

}

//update a hotel by id
const updateHotelById = async (req, res) => {

    let id = req.params.id
    const hotel = await Hotel.update(req.body, { where: { hotelId: id }})
    res.status(200).send(hotel)
   
}
//delete a hotel by id
const deleteHotelById = async (req, res) => {

    let id = req.params.id
    await Hotel.destroy({ where: { hotelId: id }} )
    .then((status)=>{
        if(status!=0){
            res.status(200).send('Success')
        }else{
            res.status(200).send('Error')
        }
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
    
}
//get hotels by province
const getAllHotelsByProvince = async (req, res) => {

    let province = req.body.province
    let hotel = await Hotel.findAll({ where: { province: province }})
    res.status(200).send(hotel)

}
//get hotels by district
const getAllHotelsByDistrict = async (req, res) => {

    let district = req.body.district
    let hotel = await Hotel.findAll({ where: { district: district }})
    res.status(200).send(hotel)

}
//get hotels by district
const search = async (req, res) => {

    let location = req.body.location
    let keyword="%"+location+"%"
    let hotel = await Hotel.findAll({ where: 
        { [Op.or]:
             [
                 {name:{[Op.like]: keyword}      },
                 {district:{[Op.like]: keyword}  },
                 {district:{[Op.like]: keyword}  },
                 {province: {[Op.like]: keyword} },
                 {town: {[Op.like]: keyword}     }, 
                 {Street1: {[Op.like]: keyword}  },
                 {Street2: {[Op.like]: keyword   }}
            ] 
       },
       
    })
    .then((rooms)=>{
        res.status(200).send(hotel)
    })
    .catch((err)=>{
        res.status(500).send(err)
    })
    

}

//  get all booking info (hotel room booking)
const hotelInfo = async (req, res) => {
    let location = req.body.location
    var date = new Date()
    let startDate = new Date(req.body.checkInDate)
    let endDate = new Date(req.body.checkOutDate)
    let keyword="%"+location+"%"
   
    await Roominfo.findAll({
      
        attributes: ["hotel.name", "hotel.district","hotel.province","hotel.Street1"], 
        include:[
            {
      
                model:Booking,
                required: true, 
                as:'booking',
                where :
                 {[Op.or]:[
                     {
                        "checkInDate": {
                            [Op.and]: {
                              [Op.gte]: startDate,
                              [Op.lte]: endDate
                            }
                          },
                     },
                     {
                        "checkOutDate": {
                            [Op.and]: {
                              [Op.gte]: startDate,
                              [Op.lte]: endDate
                            }
                          },
                     },
                     
                ]
                    
                  }
                
            },
            {
                model:Hotel,
                required: true, 
                as:'hotel',
                where: 
                { [Op.or]:
                     [
                         {name:{[Op.like]: keyword}      },
                         {district:{[Op.like]: keyword}  },
                         {district:{[Op.like]: keyword}  },
                         {province: {[Op.like]: keyword} },
                         {town: {[Op.like]: keyword}     }, 
                         {Street1: {[Op.like]: keyword}  },
                         {Street2: {[Op.like]: keyword   }}
                    ] 
               },
            },
            {
                model:Room,
                required: true, 
                as:'room'
            },
        ]
    })
    .then((info)=>{
        // console.log(JSON.parse(info));
        res.status(200).send(info)
    })
    .catch((err)=>{
        console.log(err)
        res.status(500).send(err)
    })
   
}

module.exports={
    registerHotel,
    getAllHotels,
    getHotelById,
    updateHotelById,
    deleteHotelById,
    getAllHotelsByProvince,
    getAllHotelsByDistrict,
    search,
    hotelInfo    
   
}
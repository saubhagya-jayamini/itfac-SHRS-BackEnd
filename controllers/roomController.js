const db= require('../models')
const Room= db.rooms

const createRoom = async(req,res) =>{

    let info={
        roomNo:req.body.roomNo,
        description:req.body.description,      
        hotelId:req.body.hotelId
    }

console.log(info)

const room=  await Room.create(info)
    .then(room=>res.status(200).send(room))
    .catch((err)=>{
        res.status(500).send(err)
        console.log(err)
    })

}

// Get all rooms
const getAllRooms = async (req, res) => {

    await Room.findAll({})
    .then((data)=>{
        console.log(data)
        res.status(200).send(data)
    })
    .catch((err)=>{
        console.log(err)
        res.status(200).send(err)
    })

}

//Get room by room ID
const getRoomById = async (req, res) => {

    let id = req.body.id
    console.log(id)
    await Room.findAll({ where: { roomId: id }})
    .then((data)=>{
        console.log(data)
        res.status(200).send(data)
    })
    .catch((err)=>{
        console.log(err)
        res.status(200).send(err)
    })

}
//  update room by ID
const updateRoomById = async (req, res) => {

    let id = req.params.id
    await Room.update(req.body, { where: { roomId: id }})
    .then((data)=>{
        console.log(data)
        res.status(200).send(data)
    })
    .catch((err)=>{
        console.log(err)
        res.status(200).send(err)
    })
   
}
//  Delete room by ID
const deleteRoomById = async (req, res) => {

    let id = req.params.id
    await Room.destroy({ where: { roomId: id }} )
    .then((data)=>{
        console.log(data)
        if(data!=0){
            res.status(200).send('Success')
        }else{
            res.status(200).send('Error')
        }
    })
    .catch((err)=>{
        console.log(err)
        res.status(200).send(err)
    })
   
    

}

module.exports={
    createRoom,
    getAllRooms,
    getRoomById,
    updateRoomById,
    deleteRoomById

}
const mongoose = require('mongoose')
const basketSchema = new mongoose.Schema({
    percentFull:Number,
    name:{
        type:String,
        unique:true,
        required:true
    },
    ttl:Date,
    pantryId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:'Pantry'
    },
    otherItems:new mongoose.Schema.Types.Mixed
}, { timestamps: true })

module.exports = mongoose.model('Basket', basketSchema)

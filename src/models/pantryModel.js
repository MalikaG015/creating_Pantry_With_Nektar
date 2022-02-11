const mongoose = require('mongoose')

const pantrySchema = new mongoose.Schema({
    email:{
        type:String,
        required:true,
        unique:true
    },
    name: {
        type: String,
        required: true,
        trim: true,
    },
    description: {
        type: String,
        trim: true,
        default:'defaultDescription'
    },
    errors:[String],
    notifications:{
        type:Boolean,
        default:true
    },
    percentFull:{
        type:Number,
        default:0
    },
    Baskets:[]
    }, { timestamps: true })

module.exports = mongoose.model('Pantry', pantrySchema)
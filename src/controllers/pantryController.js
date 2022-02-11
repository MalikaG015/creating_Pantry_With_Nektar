const pantryModel = require('../models/pantryModel')
const basketModel = require('../models/basketModel')
const validator = require('../utils/validator')

const createPantry = async function (req, res) {
    try {
        const requestBody = req.body
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'Invalid request parameters. Please provide author details' })
        }
        const { name, email } = requestBody
        if (!validator.isValid(name)) {
            return res.status(400).send({ status: false, message: 'pantry name is required' })
        }
        if (!validator.isValid(email)) {
            return res.status(400).send({ status: false, message: 'email is required' })
        }
        if (!(/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(email))) {
            return res.status(400).send({ status: false, message: `Email should be a valid email address` })

        }
        const isEmailAlreadyUsed = await pantryModel.findOne({ email });

        if (isEmailAlreadyUsed) {
            return res.status(400).send({ status: false, message: `${email} email address is already registered` })

        }
        const pantryData = { name: name, email: email }
        const newPantry = await pantryModel.create(pantryData)
        var pantryId = newPantry._id
        return res.status(201).send({ status: true, message: `Pantry created successfully`, data: pantryId })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getPantry = async function (req, res) {
    try {
        const pantryId = req.params.pantryId
        if (!validator.isValidObjectId(pantryId)) {
            return res.status(400).send({ status: false, message: `${pantryId} is not a valid pantry id` })
        }
        const pantryData = await pantryModel.findOne({ _id: pantryId })
        if (!pantryData) {
            return res.status(400).send({ status: false, message: `${pantryId} does not exist` })
        }
        let { name, description, errors, notifications } = pantryData
        const bucketData = await (await basketModel.find({ pantryId: pantryId }))
        let data = { name, description, errors, notifications, bucketData, percentFull: bucketData.length }
        console.log(data)
        res.status(200).send({ status: true, message: `Pantry details are`, data: data })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

module.exports = {
    createPantry,
    getPantry
}

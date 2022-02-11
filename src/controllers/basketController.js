const pantryModel = require('../models/pantryModel')
const basketModel = require('../models/basketModel')
const validator = require('../utils/validator')

//-------------------------------------------------------------------------

const createBasket = async function (req, res) {
    try {
        const{ pantryId,basketName}=req.params
        const requestBody = req.body
        if (!validator.isValidObjectId(pantryId)) {
            return res.status(400).send({ status: false, message: `${pantryId} is not a valid pantry id` })
        }
        const checkPantryId = await pantryModel.findOne({ _id: pantryId })
        if (!checkPantryId) {
            return res.status(400).send({ status: false, message: `${pantryId} does not exist` })
        }
        let { otherItems } = requestBody

        if (!validator.isValid(basketName)) {
            return res.status(400).send({ status: false, message: 'bucket name is required' })
        }
        const basketNameAlreadyExists = await basketModel.findOne({ name: basketName })
        if (basketNameAlreadyExists) {

            const basketResponse = await basketModel.findOneAndUpdate({ name: basketName }, {
                $set:
                {
                    name: basketName,
                    ttl: new Date(),
                    pantryId: pantryId,
                    otherItems: otherItems
                }
            }, { new: true })
            return res.status(200).send({ status: true, message: `Basket created successfully1`, data: basketResponse })

        }
        else {
            const basketData = { name: basketName, ttl: new Date(), pantryId: pantryId, otherItems: otherItems }
            const newBasket = await basketModel.create(basketData)
            await pantryModel.findOneAndUpdate({ _id: pantryId }, { $inc: { percentFull: +1 } })
            return res.status(201).send({ status: true, message: `Basket created successfully2`, data: newBasket })

        }
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}

const updateBasket = async function (req, res) {
    try {
        const requestBody = req.body
        const { pantryId,basketName}=req.params
        if (!validator.isValidObjectId(pantryId)) {
            return res.status(400).send({ status: false, message: `${pantryId} is not a valid pantry id` })
        }
        const checkPantryId = await basketModel.findOne({ pantryId: pantryId })
        if (!checkPantryId) {
            return res.status(400).send({ status: false, message: `${pantryId} does not exist` })
        }
        const BasketName = await basketModel.findOne({ name: basketName })
        if (!BasketName) {
            return res.status(400).send({ status: false, message: `${basketName} does not exist` })
        }
        if (!validator.isValidRequestBody(requestBody)) {
            return res.status(400).send({ status: false, message: 'No parameters to modify.Data is unmodified' })
        }

        const { otherItems, ttl } = requestBody

        let updatedData = {}
        if (validator.isValid(otherItems)) {
            if (!Object.prototype.hasOwnProperty.call(updatedData, '$set')) {
                updatedData['$set'] = {}
            }
            updatedData['$set']['otherItems'] = otherItems
        }
        if (validator.isValid(ttl)) {
            if (!Object.prototype.hasOwnProperty.call(updatedData, '$set')) {
                updatedData['$set'] = {}
            }
            updatedData['$set']['ttl'] = ttl
        }
        const updatedBasket = await basketModel.findOneAndUpdate({ name: basketName }, updatedData, { new: true })
        return res.status(200).send({ status: true, message: 'Success', data: updatedBasket });
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}


const getBasket = async function (req, res) {
    try {
        const{ pantryId,basketName}=req.params
        if (!validator.isValidObjectId(pantryId)) {
            return res.status(400).send({ status: false, message: `${pantryId} is not a valid pantry id` })
        }
        const checkPantryId = await basketModel.findOne({ pantryId: pantryId })
        if (!checkPantryId) {
            return res.status(400).send({ status: false, message: `${pantryId} does not exist` })
        }
        const BasketName = await basketModel.findOne({ name: basketName })
        if (!BasketName) {
            return res.status(400).send({ status: false, message: `${basketName} does not exist` })
        }

        const basketContent = await basketModel.findOne({ name: basketName })
        return res.status(200).send({ status: true, message: `Basket details are`, data: basketContent })
    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}



const deleteBasket = async function (req, res) {
    try {
        const{ pantryId,basketName}=req.params
        if (!validator.isValidObjectId(pantryId)) {
            return res.status(400).send({ status: false, message: `${pantryId} is not a valid pantry id` })
        }
        const checkPantryId = await basketModel.findOne({ pantryId: pantryId })
        if (!checkPantryId) {
            return res.status(400).send({ status: false, message: `${pantryId} does not exist` })
        }
        const BasketName = await basketModel.findOne({ name: basketName })
        if (!BasketName) {
            return res.status(400).send({ status: false, message: `${basketName} does not exist` })
        }
        await basketModel.remove({ name: basketName })
        await pantryModel.findOneAndUpdate({ _id: pantryId }, { $inc: { percentFull: -1 } })
        return res.status(200).send({ status: true, message: `Basket deleted successfully` })

    }
    catch (error) {
        return res.status(500).send({ status: false, message: error.message })
    }
}
module.exports = {
    createBasket,
    updateBasket,
    getBasket,
    deleteBasket

}
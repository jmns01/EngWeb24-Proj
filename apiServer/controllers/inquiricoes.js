// No arquivo do controlador (inquiricao.js)
const Inquiricao = require('../models/inquiricao');

module.exports.list = () => {
    return Inquiricao
        .find()
        .sort({_id: 1})
        .exec();
}

module.exports.listPage = (limit, skip) => {
    return Inquiricao
        .find()
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByName = (name, limit, skip) => {
    return Inquiricao
        .find({UnitTitle: { $regex: `^${name}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByLocal = (local, limit, skip) => {
    return Inquiricao
        .find({CountryCode: { $regex: `^${local}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.listByDate = (date, limit, skip) => {
    return Inquiricao
        .find({UnitDateInitial: { $regex: `^${date}`, $options: 'i' }})
        .sort({UnitTitle: 1})
        .skip(skip)
        .limit(limit)
        .exec();
}

module.exports.findMaxId = () => {
    return Inquiricao
        .find({}, { _id: 1 })
        .sort({ _id: -1 })
        .limit(1)
        .exec();
}

module.exports.insert = inq =>{
    var newInquiricao = new Inquiricao(inq)
    return newInquiricao.save()
}

// Atualiza uma Inquiricao existente
module.exports.update = (id, i) => {
    return Inquiricao.findOneAndUpdate({_id : id}, i, {new: true}).exec();
}

// Exclui uma Inquiricao
module.exports.delete = id => {
    return Inquiricao.findOneAndDelete({_id : id}).exec();
}
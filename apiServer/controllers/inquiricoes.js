var Inquiricao = require('../models/inquiricao');

module.exports.list = () => {
    return Inquiricao
        .find()
        .sort({_id: 1})
        .exec()
        .then(doc => doc ? doc : []);
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

module.exports.getInquiricaoById = id => {
    return Inquiricao
        .findOne({_id: id})
        .exec();
}

module.exports.updateInquiricao = (id, data) => {
    return Inquiricao
        .findOneAndUpdate({_id: id}, data, {new: true})
}

module.exports.deleteInquiricao = id => {
    return Inquiricao
        .deleteOne({_id: id})
        .exec();
}

module.exports.insertInquiricao = (inquiricao) => {
    return Inquiricao
    .create(inquiricao)
}

module.exports.getRelation = (id) => {
    return Inquiricao
        .findOne({_id: id}, {Relations: 1, _id: 0})
        .exec()
}

module.exports.updateRelation = (id, data) => {
    return Inquiricao
        .findOneAndUpdate({_id: id}, data, {new: true})
}

module.exports.getIdByName = (name) => {
    return Inquiricao
        .findOne({UnitTitle: {$regex: 'Inquirição de genere de ' + name, $options: 'i'}})
        .exec()
}

module.exports.getNameById = (id) => {
    return Inquiricao
        .findOne({_id: id}, {UnitTitle: 1, _id: 0})
        .exec()
}

module.exports.insertNewRelation = (name, inqid, relid) => {
    return Inquiricao
        .findOneAndUpdate({_id: inqid}, {$push: {Relations: {key: name, value: relid}}})
        .exec()
}

module.exports.removeRelation = (id, name) => {
    return Inquiricao
        .findOneAndUpdate({_id: id}, {$pull: {Relations: {key: name}}})
        .exec()
}

module.exports.getMaxId = () => {
    return Inquiricao
        .find({}, {_id: 1})
        .sort({_id: -1})
        .limit(1)
        .exec()
        .then(doc => doc && doc.length > 0 ? doc[0]._id : 0);
}
import model from '../models/inquiries.js'

function read_all(inquiry_id){
    return model.find({_id: inquiry_id}).sort({_id: 1}).exec();
}

function update(inquiry_id, data){
    return model.findOneAndUpdate({_id: inquiry_id}, data).exec();
}

export default {read_all, update}
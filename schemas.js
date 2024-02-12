
const BASEJoi = require('joi');
const sanitizeHtml = require('sanitize-html');


const extension = (joi)=>({
    type:'string',
    base:joi.string(),
   /* massages:{
        
        'string.escapeHTML':'{{#label}} must not include HTML'
    },*/
    rules:{
        escapeHTML:{
            validate(value, helpers){
                const clean = sanitizeHtml(value, {
                    allowedTags:[],
                    allowedAttributes:{},
                });
                if(clean !== value) {return helpers.error('string.escspeHTML',{value})}
                return clean;
            }
        }
    }
});

const Joi = BASEJoi.extend(extension)

module.exports.campgroundschema = Joi.object({
    title: Joi.string().required().escapeHTML(),
    price: Joi.number().required().min(0),
    //image: Joi.string().required(),
    description: Joi.string().required().escapeHTML(),
    location: Joi.string().required().escapeHTML(),
    deleteImages:Joi.array()
}).required();


module.exports.reviewschema = Joi.object({
    review:Joi.object({
        rating:Joi.number().required().min(1).max(5),
        body:Joi.string().required().escapeHTML()

    }).required(),
})
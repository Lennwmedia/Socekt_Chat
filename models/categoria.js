const { Schema, model } = require("mongoose");

const CategoriaSchema = Schema({
    name: {
        type: String,
        required: [true, "El nombre es requerido"],
        unique: true,
    },
    state: {
        type: Boolean,
        default: true,
        required: true,
    },
    usuario: {
        type: Schema.Types.ObjectId,
        ref: 'Usuario',
        required: true,
    }

});

CategoriaSchema.methods.toJSON = function() {
    const { __v, _id, ...categorias } = this.toObject();
    categorias.id = _id;
    return categorias;

}

module.exports = model('Categoria', CategoriaSchema);
const { Schema, model } = require("mongoose");

const RoleSchema = Schema({
    rol: {
        type: String,
        required: [true, "Debe de insertar un rol"]
    }
});

module.exports = model('Role', RoleSchema);
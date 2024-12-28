const path = require('path')
const { v4: uuidv4 } = require('uuid');

const subirArchivos = (files, extensionesValidas = ['jpg', 'png', 'gif', 'jpeg'], carpeta = '') => {

    return new Promise((resolve, reject) => {
        const { archivo } = files;

        const nombreDelArchivo = archivo.name.split('.');
        const extension = nombreDelArchivo[ nombreDelArchivo.length - 1 ];
      
        if (!extensionesValidas.includes(extension)) {
          return reject(`No es valida la extension ${extension}, revise que sea una de las siguientes: ${extensionesValidas}`)

        }
      
        const nombreTemp = uuidv4() + '.' + extension;
        const uploadPath =  path.join( __dirname, '../uploads/', carpeta, nombreTemp);
      
        archivo.mv(uploadPath, (err) => {
          if (err) {
            reject(err);
          }
      
         resolve(nombreTemp)
        });

    })
   
}

module.exports = {
  subirArchivos
}
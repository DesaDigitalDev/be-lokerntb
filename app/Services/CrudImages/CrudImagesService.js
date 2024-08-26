const fs = require('fs');
const path = require('path');
class CrudImagesService {
    static saveImages(file,req,pathToSave='public/images/profilperusahaan', deleteImages=false, toDeleteImages) {
        const pathfile = file.path
        const extensigambar = '.jpg'
        const filenya = `${file.filename}${extensigambar}`
        const target = path.resolve(`${pathToSave}/${filenya}`)
        const srcnya = fs.createReadStream(pathfile)
        const descnya = fs.createWriteStream(target)
        if (deleteImages) {
            fs.unlink(`${pathToSave}/${toDeleteImages}`, (err) => {
                if (err) {
                    return res.status(500).json({ error: true })
                }
            })
        }
        req.profilperusahaan = filenya
        srcnya.pipe(descnya)
    }

    static deleteImages(filename,folder='public/images/profilperusahaan'){
        const filepath = path.join(folder,filename)
        if(fs.existsSync(filepath)){
            fs.unlinkSync(filepath)
        }
    }
}
module.exports = CrudImagesService;

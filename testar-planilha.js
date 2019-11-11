const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')
const { promisify } = require('util')

const addRowtoSheet = async() => {
  const doc = new GoogleSpreadsheet('1iNrwpPc_KD2E9erU44PO_Syl9Nf-eN1znHI2pP84tcY')
  await promisify(doc.useServiceAccountAuth)(credentials)
  console.log('Planilha aberta')
  const info = await promisify(doc.getInfo)()
  const worksheet = info.worksheets[0]
  await promisify(worksheet.addRow)({name: 'fghfLucas', email: 'teste'})
}
addRowtoSheet()
















/*
const doc = new GoogleSpreadsheet('1iNrwpPc_KD2E9erU44PO_Syl9Nf-eN1znHI2pP84tcY')
doc.useServiceAccountAuth(credentials, (err) => {
  if(err) {
    console.log('Não foi possível abrir a planilha')
  } else {
    console.log('Planilha aberta')
    doc.getInfo((err, info) => {
      const worksheet = info.worksheets[0]
      worksheet.addRow({name: 'Lucas', email: 'teste'}, (err) => {
        console.log('linha inserida')
       })
    })
  }
})
*/

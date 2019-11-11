const express = require('express')
const app = express()
const path = require('path')
const bodyparser = require('body-parser')
const { promisify } = require('util')
const sgMail = require('@sendgrid/mail');

const GoogleSpreadsheet = require('google-spreadsheet')
const credentials = require('./bugtracker.json')

//configurações
const docId = '<1iNrwpPc_KD2E9erU44PO_Syl9Nf>'
const worksheetIndex = 0
const sendGridKey = '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'


app.set('view engine', 'ejs')
app.set('views',path.resolve(__dirname, 'views'))

//middleware
app.use(bodyparser.urlencoded({ extended: true }))

app.get('/', (request, response) => {
  response.render('home')
})

app.post('/', async(request, response) => {
  try{
      const doc = new GoogleSpreadsheet(docId)
      await promisify(doc.useServiceAccountAuth)(credentials)
      const info = await promisify(doc.getInfo)()
      const worksheet = info.worksheets[worksheetIndex]
      await promisify(worksheet.addRow)({ 
        name: request.body.name,
        email: request.body.email,
        userAgent: request.body.userAgent,
        userDate: request.body.userDate, 
        issueType: request.body.issueType,
        source: request.query.source || 'direct' 
      })


      //se for critico
      // using Twilio SendGrid's v3 Node.js Library
      // https://github.com/sendgrid/sendgrid-nodejs
      if(request.body.issueType === 'CRITICAL') {
        sgMail.setApiKey(sendGridKey)
        const msg = {
          to: 'mainlucas@gmail.com',
          from: 'l-gc@hotmail.com',
          subject: 'Bug Crítico reportado',
          text: `
            O usuário ${request.body.name} relatou um problema.
          `,
          html: `O usuário ${request.body.name} relatou um problema`,
        }
        await sgMail.send(msg);
      }
      response.render('sucesso')
    }catch(err) {
      response.send('Erro ao enviar formulário.')
      console.log(err)
    }
})
  

app.listen(3000, (err) => {
  if(err) {
    console.log('aconteceu um erro', err)
  } else {
    console.log('Bugtracer rodando na porta 3001')
  }
})
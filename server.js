const express = require('express');
const app = express();
const cors = require('cors');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const {schema} = require('./Schema');
const port = process.env.PORT || 3000;
const db = require('./Schema/db');
var data = '';
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;

app.use(cors());
app.use(express.json());

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/', async (req, res) => {
	let email_id = 'samantasubham9804@gmail.com';
	let email_en = Buffer.from(email_id).toString('base64');
    var transporter = nodemailer.createTransport({
		host: 'webmail.synergicportal.in',
		port: 25,
		secure:false,
		auth: {
			user: 'support@synergicportal.in',
			pass: 'Support!sSs#2021'
		},
        tls:{ rejectUnauthorized: false}
    });
	var mailOptions = {
        from: 'support@synergicportal.in',
        to: 'amit.datta@synergicsoftek.com',
        subject: 'SynergicPortal',
        html: '<!doctype html>'
            + '<html>'
            + '<head>'
            + '<meta charset="utf-8">'
            + '<title>HomeworkHelp</title>'
            + '<style type="text/css">body{font - size: 14px; color: #494949; font-size: 15px; margin: 0; padding: 0;}</style>'
            + '</head>'
            + '<body>'
            + '<div style="max-width: 830px; margin: 0 auto; padding: 0 15px;">'
            + '<table width="100%" border="0" cellspacing="0" cellpadding="0">'
            + '<tbody>'
            + '<tr>'
            + '<td align="left" valign="top" style="text-align: center; padding: 14px 0; border-bottom: #ef3e36 solid 3px;"><img src="https://support.synergicportal.in/assets/Login_assets/images/logo.png" width="171" height="43" alt="" /></td>'
            + '</tr>'
            // + '<tr>'
            // + '<td align="left" style="font-weight: bold; font-family: Arial; font-size: 15px;">Hi ' + name + ',</td>'
            // + '</tr>'
            + '<tr>'
            + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
            + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please <a href="https://support.synergicportal.in/#/template?id=' + email_en + '">click here</a> to activate your account.</p>'
            + '</td>'
            + '</tr>'
            + '</tbody>'
            + '</table>'
            + '</div>'
            + '</body>'
            + '</html>'
    };
   await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {console.log(error); res.send(JSON.stringify(error)); }
        else{console.log('Email sent: ' + info.response); res.send(info.response);}
    })
	//res.send('Welcome To GraphQL API Server');
})

app.listen(port, () => {
    console.log(`App is runnig at port: ${port}`);
})
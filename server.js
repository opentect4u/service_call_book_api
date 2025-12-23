const express = require('express');
const app = express();
require('dotenv').config();
const cors = require('cors');
const graphql = require('graphql');
const { graphqlHTTP } = require('express-graphql');
const { GraphQLUpload, graphqlUploadExpress } = require('graphql-upload');
const path = require('path');
const {schema} = require('./Schema');
const port = process.env.PORT || 3000;
const db = require('./Schema/db');
var data = '';
const nodemailer = require('nodemailer');
const Buffer = require('buffer').Buffer;

app.use(cors());
app.use(express.json());
app.use(graphqlUploadExpress({ maxFileSize: 10485760, maxFiles: 10 }));
app.use(express.static(path.join(__dirname, "assets")));

app.use('/graphql', graphqlHTTP({
    schema,
    graphiql: true
}))

app.get('/', async (req, res) => {
	// res.send('Welcome To GraphQL API Server');
    res.redirect('/graphql');
})

// RUN LOG OUT SCRIPT IN EVERY 8 HOURS
function intervalFunc() {
    var sql = `SELECT * FROM md_users WHERE login_status = '1'`;
    return new Promise((resolve, reject) => {
        db.query(sql, (err, result) => {
            if (err) console.log({ err });
            if (result.length > 0) {
                result.forEach((dt) => {
                    // console.log({ id: dt.id });
                    var up_sql = `UPDATE md_users SET login_status = '0'`;
                    db.query(up_sql, (err, lastId) => {
                        if (err) console.log({ updation_err: err });
                        // console.log(lastId);
                    })
                })
            }
            // console.log({ result: result.length });
            resolve(result);
        })
    })

}

app.get('/test_mail', async (req, res) => {
    //const transporter = nodemailer.createTransport({
     //  	host: "smtp.gmail.com",
	//	secureConnection: false,
	//	port: 587,
	//	requiresAuth: true,
	//	domains: ["gmail.com", "googlemail.com"],
	//	auth: {
	//		user: 'opentech4u@gmail.com',
	//		pass: 'zqyhqdahmxbnbili'
	//	},
	//	tls: {
	//		// do not fail on invalid certs
	//		rejectUnauthorized: false
	//	}
   // });
	
	var transporter = nodemailer.createTransport({
		host: 'webmail.synergicportal.in',
		port: 25,
		secure: false,
		auth: {
			user: 'admin@synergicportal.in',
			pass: 'Support!sSs#2021'
		},
		tls: { rejectUnauthorized: false }
	});
    var mailOptions = {
        from: 'admin@synergicportal.in',
        to: 'samantasubham9804@gmail.com',
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
            + '<tr>'
            + '<td align="left" valign="top" style="padding: 25px 15px 5px 15px; font-family: Arial; font-size: 15px; line-height: 25px;">'
            + '<center><p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><span style="color: #2fd025;">Your Password Reseted Successsfully..</span></p></center>'
            + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;">Please try to login with new password <b><i>"password"</i></b>.</p>'
            + '<p style=" padding: 0 0 25px 0; margin: 0; font-family: Arial; font-size: 15px; color: #494949;"><b><small><i><span style="color: #d02525; font-size: 11px;">PLEASE RESET YOUR PASSWORD AFTER LOGIN, FOR SECURITY PURPOSE.</span></i></small></b></p>'
            + '</td>'
            + '</tr>'
            + '</tbody>'
            + '</table>'
            + '</div>'
            + '</body>'
            + '</html>'
    };
    
    await transporter.sendMail(mailOptions, (error, info) => {
        if (error) {
            console.log(error);
            data = { success: 0, message: error };
        } else {
            data = { success: 1, message: 'Please Check Your Email For New Password', info };
        }
        res.send(data)
    })
})

setInterval(intervalFunc, 3600000);

app.listen(port, () => {
    console.log(`App is runnig at port: ${port}`);
})
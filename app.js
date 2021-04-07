const express = require('express')
const bodyParser = require('body-parser')
const engines = require('consolidate')
const paypal = require('paypal-rest-sdk')
const mailjet = require ('node-mailjet')
    .connect('ac0ed617bc32cc65a0f86ca27b4721ef', '6d4590e1ed90ed726a986f32f5c4567f')
const data = require('./data.json')
    
const app = express()

app.engine('ejs', engines.ejs)
app.set('views',  './views')
app.set('view engine', 'ejs')

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: true }))
app.use(express.static("images"));

paypal.configure({
    'mode': 'live',
    'client_id': 'ATCxa42Dp179vWtaAGyDJWcMcc-9Ekn_WWxnoDAcEVNtpHzC62N-Apj580vDB6e6Cr0pHC6gYaYDaict',
    'client_secret': 'EB880mSSHEy5MvohqRYCnhhZsdrzIwxyNqpUDMYTVAvmBvlKr4rGbwNv0ib97iFlN6Q_EsWxVvqGkYNf'
})

app.get('/', (req, res) => {
    res.render('index')
})

app.get('/app-config', (req, res) => {
    res.send(data)
})

app.get('/paypal', (req, res) => {
    var create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://donas-exoticas.com/success",
            "cancel_url": "http://donas-exoticas.com/cancel"
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Consulta medica",
                    "sku": "Consulta medica",
                    "price": "1.00",
                    "currency": "USD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "USD",
                "total": "1.00"
            },
            "description": "Consulta medica"
        }]
    };
    
    
    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            console.log("Create Payment Response");
            console.log(payment);
            res.redirect(payment.links[1].href)
        }
    });
})

app.get('/success', (req, res) => {
    var PayerID = req.query.PayerID;
    var paymentId = req.query.paymentId;
    var execute_payment_json = {
        payer_id: PayerID,
        transactions: [
            {
                amount: {
                    currency: "USD",
                    total: "4.00"
                }
            }
        ]
    };

    paypal.payment.execute(paymentId, execute_payment_json, function(
        error,
        payment
    ) {
        if (error) {
            console.log(error.response);
            throw error;
        } else {
            console.log(JSON.stringify(payment));

            const request = mailjet
                .post("send", {'version': 'v3.1'})
                .request({
                    "Messages":[
                        {
                            "From": {
                                "Email": "medico@medicomovil.com.mx",
                                "Name": "Medico - Movil"
                            },
                            "To": [
                                {
                                    "Email": "jpespinosa9283@gmail.com",
                                    "Name": "Hola Bienvenido tienes una petición de CHAT que atender !!!"
                                },
                                {
                                    "Email": "omarlaszloo@gmail.com",
                                    "Name": "Hola Bienvenido tienes una petición de CHAT que atender !!!"
                                }
                            ],
                            "Subject": "Felicidades tienes una peticion de CHAT 🎉 !!",
                            "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                            "HTMLPart": "<h3>Hola Bienvenido!</h3><br />Tienes una petición de CHAT que atender, abre tu aplicación STAFF MÉDICO MOVIL 👨‍💻 !!!"
                        }
                    ]
                })
                request
                    .then((result) => {
                        console.log('result.body', result.body)
                    })
                    .catch((err) => {
                        console.log('err.statusCode', err.statusCode)
                    })
                        
                    res.render("success");
                    }
                });    
    })

app.get('cancel', (req, res) => {
    res.send('Cancel')
})


app.get('/send-email', (req, res) => {

    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "medico@medicomovil.com.mx",
                        "Name": "Medico - Movil"
                    },
                    "To": [
                        {
                            "Email": "jpespinosa9283@gmail.com",
                            "Name": "Hola Bienvenido tienes una petición de CHAT que atender !!!"
                        },
                        {
                            "Email": "omarlaszloo@gmail.com",
                            "Name": "Hola Bienvenido tienes una petición de CHAT que atender !!!"
                        }
                    ],
                    "Subject": "Felicidades tienes una peticion de CHAT 🎉 !!",
                    "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                    "HTMLPart": "<h3>Hola Bienvenido!</h3><br />Tienes una petición de CHAT que atender, abre tu aplicación STAFF MÉDICO MOVIL <br /> ó puedes iniciar sesion desde la pagina web https://www.medicomovil.com.mx/setting 👨‍💻 !!!"
                }
            ]
        })

        request
            .then((result) => {
                console.log('result.body', result.body)
            })
            .catch((err) => {
                console.log('err.statusCode', err.statusCode)
            })
                
            res.render("success");
})


// envio de email para comentarios

app.get('/send-contacts', (req, res) => {
    const { name, message, email } = req.query
    const request = mailjet
        .post("send", {'version': 'v3.1'})
        .request({
            "Messages":[
                {
                    "From": {
                        "Email": "medico@medicomovil.com.mx",
                        "Name": "Medico - Movil"
                    },
                    "To": [
                        {
                            "Email": "jpespinosa9283@gmail.com ",
                            "Name": "SOPORTE TÉCNICO"
                        },
                        {
                            "Email": "omarlaszloo@gmail.com",
                            "Name": "SOPORTE TÉCNICO"
                        }
                    ],
                    "Subject": "SOPORTE TÉCNICO",
                    "TextPart": "Dear passenger 1, welcome to Mailjet! May the delivery force be with you!",
                    "HTMLPart": "NOMBRE DEL USUARIO:" + name +"<br/>CORREO DEL USUARIO:" + email + "<br/>"  + "MENSAJE" + message
                }
            ]
        })

        request
            .then((result) => {
                console.log('result.body', result.body)
            })
            .catch((err) => {
                console.log('err.statusCode', err.statusCode)
            })
                
            res.render("success");
})

app.listen(3000, () => {
    console.log('Server is running')
})
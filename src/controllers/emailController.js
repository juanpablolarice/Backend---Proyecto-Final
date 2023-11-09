const nodemailer = require('nodemailer')
const config = require('../config/config')

const transporter = nodemailer.createTransport({
    service: 'gmail',
    port: 587,
    auth: {
        user: config.GMAIL_ACCOUNT,
        pass: config.GMAIL_APP_PASSWD
    }
})

transporter.verify(function(error, success) {
    if(error){
        console.log(error)
    }else{
        console.log('Server is ready to take our messages')
    }
})

const sendEmailCheckout = async (products, ticket) => { 
    let quantity = 0
    let template = (`
        <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">
            <html xmlns="http://www.w3.org/1999/xhtml">
                <head>
                    <meta http-equiv="Content-Type" content="text/html; charset=utf-8" />
                    <title>Confirmación de compra</title>
                    
                    <!-- Start Common CSS -->
                    <style type="text/css">
                    #outlook a {padding:0;}
                        body{width:100% !important; -webkit-text-size-adjust:100%; -ms-text-size-adjust:100%; margin:0; padding:0; font-family: Helvetica, arial, sans-serif;}
                        .ExternalClass {width:100%;}
                        .ExternalClass, .ExternalClass p, .ExternalClass span, .ExternalClass font, .ExternalClass td, .ExternalClass div {line-height: 100%;}
                        .backgroundTable {margin:20px; padding:0; width:100% !important; line-height: 100% !important;}
                        .main-temp table { border-collapse:collapse; mso-table-lspace:0pt; mso-table-rspace:0pt; font-family: Helvetica, arial, sans-serif;}
                        .main-temp table td {border-collapse: collapse;}
                    </style>
                    <!-- End Common CSS -->
                </head>
                <body>
                    <table width="100%" cellpadding="0" cellspacing="0" border="0" class="backgroundTable main-temp" style="background-color: #d5d5d5;">
                        <tbody>
                            <tr>
                                <td>
                                    <table width="600" align="center" cellpadding="15" cellspacing="0" border="0" class="devicewidth" style="background-color: #ffffff;">
                                        <tbody>
                                            <!-- Start header Section -->
                                            <tr>
                                                <td style="padding-top: 30px;">
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee; text-align: center;">
                                                        <tbody>
                                                            <tr>
                                                            <td style="font-size: 18px; line-height: 18px; color: #666666;">
                                                                    Comprobante de compra
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-size: 14px; line-height: 18px; color: #666666; padding-bottom: 25px;">
                                                                    <strong>Número de orden:</strong> ${ticket.code} | <strong>Fecha:</strong> ${ticket.purchaser_datetime.toLocaleDateString()}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- End header Section -->
                                        
                                            <!-- Start product Section -->
                                            <tr>
                                                <td style="padding-top: 0;">
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #eeeeee;">
                                                        <tbody>`)
    products.map((prod) => {
        template += (`
                                                            <tr>
                                                                <td rowspan="4" style="padding-right: 10px; padding-bottom: 10px;">
                                                                    <img style="height: 80px;" src="${prod.product.thumbnails[0]}" alt="Product Image" />
                                                                </td>
                                                                <td colspan="2" style="font-size: 14px; font-weight: bold; color: #666666; padding-bottom: 5px;">
                                                                    ${prod.product.title}
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-size: 14px; line-height: 18px; color: #757575; width: 440px;">
                                                                    
                                                                </td>
                                                                <td style="width: 130px;"></td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-size: 14px; line-height: 18px; color: #757575;">
                                                                    ${prod.product.description}
                                                                </td>
                                                                <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right;">
                                                                    $${prod.product.price} Por unidad
                                                                </td>
                                                            </tr>
                                                            <tr>
                                                                <td style="font-size: 14px; line-height: 18px; color: #757575; padding-bottom: 10px;">
                                                                    Cantidad: ${prod.quantity}
                                                                </td>
                                                                <td style="font-size: 14px; line-height: 18px; color: #757575; text-align: right; padding-bottom: 10px;">
                                                                    <b style="color: #666666;">$${prod.quantity * prod.product.price}</b> Subtotal
                                                                </td>
                                                            </tr>
        `)
    })
    template += (`
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- End product Section -->

                                            <!-- Start calculation Section -->
                                            <tr>
                                                <td style="padding-top: 0;">
                                                    <table width="560" align="center" cellpadding="0" cellspacing="0" border="0" class="devicewidthinner" style="border-bottom: 1px solid #bbbbbb; margin-top: -5px;">
                                                        <tbody>
                                                            <tr>
                                                                <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px;">
                                                                    Total
                                                                </td>
                                                                <td style="font-size: 14px; font-weight: bold; line-height: 18px; color: #666666; padding-top: 10px; text-align: right;">
                                                                    $${ticket.amount}
                                                                </td>
                                                            </tr>
                                                        </tbody>
                                                    </table>
                                                </td>
                                            </tr>
                                            <!-- End calculation Section -->
                                        </tbody>
                                  </table>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </body>
            </html>
    `)

        const mailOptions = {
            from: 'coderhouse@ecommerce.com',
            to: ticket.purchaser,
            subject: 'Confirmación de compra',
            html: template
        }
            
        try {
            let result = transporter.sendMail(mailOptions, (error, info) => {
                if(error){
                    return false
                }                
            })
            return true
        } catch (error) {
            return false
        }
}


module.exports = { sendEmailCheckout }
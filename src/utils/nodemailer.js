const nodemailer = require("nodemailer")
const configServer = require("../config/configServer")

const transport = nodemailer.createTransport({
    service: "gmail",
    port:587,
    auth:{
        user: configServer.gmail_user_app,
        pass: configServer.gmail_pass_app
    }
})

exports.sendMail = async (body)=>{
    return await transport.sendMail({
        from: "COMPRA REALIZADA<guile.shedden@gmail.com>",
        to: "guille.shedden@gmail.com", //${body.purchaser}
        subject:'Gracias por realizar la compra',
        html:`<div>
        <h1>Tu compra ha sido completada con exito</h1>
        <p>Codigo: ${body.code} </p>
        <p>Total: ${body.amount}$ </p>
        </div>`
    })
}

exports.sendResetPassMail = async (user,resetLink)=>{
    return await transport.sendMail({
        from: "RESET PASSWORD<guille.shedden@gmail.com>",
        to: user.email,
        subject: "reset password",
        html:`<div>
        <h1>Hola ${user.first_name},</h1>
        <p>Hemos recibido una solicitud para restablecer la contraseña de tu cuenta.</p>
        <p>Para continuar con el proceso, haz clic en el siguiente enlace:</p>
        <a href="${resetLink}">${resetLink}</a>
        <p>El enlace expirará después de 1 hora.</p>
        </div>`
    })
}
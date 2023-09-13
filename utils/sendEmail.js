const nodemailer = require("nodemailer");

module.exports=async(email,subject,text)=>{
    try{
        const transporter=nodemailer.createTransport({
            host:smtp.gmail.com,
            service:gmail,
            port:Number(587),
            secure:Boolean(true),
            auth:{
                user:"ad1@gmail.com",
                pass:"5GQb:}Ee7&$9"
            }
        });
        await transporter.sendMail({
            from:process.env.USER,
            to:email,
            subject:subject,
            text:text
        })
        console.log("email sent success")
    }catch(error){
        console.log("error"+error)
    }
}



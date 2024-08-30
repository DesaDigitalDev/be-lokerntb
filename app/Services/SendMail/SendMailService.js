var nodemailer = require('nodemailer');
const config = require('../../config');

module.exports = class SendMailService {
    static transporter = nodemailer.createTransport({
        host: config.SMTP_EMAIL,
        port: 587,
        secure: false, // Use `true` for port 465, `false` for all other ports
        auth: {
            user: config.EMAIL,
            pass: config.PASSWORD_EMAIL,
        },
    });
    /* 
    {
        from :'',
        to : ''
        subject :'',
        text:'',
        template : 'Template'
    }
    */
    static async SendMail(dataemail) {
        const info = await SendMailService.transporter.sendMail({
            from: `"${dataemail.from} " <${config.EMAIL}>`, // sender address
            to: dataemail.to, // list of receivers
            subject: dataemail.subject, // Subject line
            text: dataemail.text, // plain text body
            html: dataemail.template, // html body
        });
        // console.log("Message sent: %s", info.messageId);
    }

    static TemplateRegisterCompany(dataperusahaan) {
        return `
        <!DOCTYPE html>
<html lang="id">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 0;
            padding: 0;
            background-color: #f4f4f4;
        }
        .email-container {
            width: 100%;
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            padding: 20px;
            border: 1px solid #ddd;
        }
        .header {
            text-align: center;
            padding: 20px 0;
            border-bottom: 1px solid #ddd;
        }
        .header img {
            max-width: 200px;
        }
        .content {
            padding: 20px;
        }
        .content h1 {
            font-size: 24px;
            margin-bottom: 10px;
        }
        .content p {
            font-size: 16px;
            line-height: 1.5;
            margin-bottom: 20px;
        }
        .button {
            display: inline-block;
            padding: 10px 20px;
            font-size: 16px;
            color: #ffffff;
            background-color: #007bff;
            text-decoration: none;
            border-radius: 5px;
        }
        .footer {
            text-align: center;
            padding: 20px;
            font-size: 14px;
            color: #777;
            border-top: 1px solid #ddd;
        }
    </style>
</head>
<body>
    <div class="email-container">
        <div class="header">
            <img src="${config.URL_SERVER}/images/lokerntb.png" alt="Logo Perusahaan Anda">
        </div>
        <div class="content">
            <h1>Persetujuan Diperlukan: Pendaftaran Perusahaan Baru</h1>
            <p>Halo Admin,</p>
            <p>Kami telah menerima permintaan pendaftaran perusahaan baru yang memerlukan persetujuan Anda. Mohon untuk meninjau detail dan menyetujui atau menolak pendaftaran tersebut secepat mungkin.</p>
            <p>Nama Perusahaan : ${dataperusahaan.namaperusahaan}</p>
            <p>Kontak Person : ${dataperusahaan.teleponperusahaan}</p>
            <p>Email Kontak : ${dataperusahaan.emailperusahaan}</p>
            <p>Bidang Usaha : ${dataperusahaan.bidangusaha}</p>
            <p>Alamat Perusahaan : ${dataperusahaan.alamatperusahaan}</p>
            <a href="${config.URL_CLIENT}/admin/acc-company-profile" class="button">Tinjau dan Setujui</a>
        </div>
        <div class="footer">
            <p>&copy; 2024 Loker NTB. Semua hak dilindungi.</p>
            <p></p>
        </div>
    </div>
</body>
</html>
        `
    }
}
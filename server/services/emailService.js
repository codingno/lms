var nodemailer = require("nodemailer");
var transporter = nodemailer.createTransport({
  host: "smtp-relay.brevo.com",
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASSEMAIL,
  },
});
var BaseUrlClient = process.env.EMAIL_TOKEN_URL || "localhost:3003";

module.exports = {
  sendEmailForgotPass: function (email, resetPasswordToken, callback) {
    const html = `
				<!doctype html>
				<html lang="en-US">

				<head>
					<meta content="text/html; charset=utf-8" http-equiv="Content-Type" />
					<title>Reset Password Email Template</title>
					<meta name="description" content="Reset Password Email Template.">
					<style type="text/css">
						a:hover {text-decoration: underline !important;}
					</style>
				</head>

				<body marginheight="0" topmargin="0" marginwidth="0" style="margin: 0px; background-color: #f2f3f8;" leftmargin="0">
					<!--100% body table-->
					<table cellspacing="0" border="0" cellpadding="0" width="100%" bgcolor="#f2f3f8"
						style="@import url(https://fonts.googleapis.com/css?family=Rubik:300,400,500,700|Open+Sans:300,400,600,700); font-family: 'Open Sans', sans-serif;">
						<tr>
							<td>
								<table style="background-color: #f2f3f8; max-width:670px;  margin:0 auto;" width="100%" border="0"
									align="center" cellpadding="0" cellspacing="0">
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
										<a href="lms.university.ac.id" title="logo" target="_blank">
											<img width="60" src="https://disk.mediaindonesia.com/thumbs/600x400/news/2019/07/80f3537bb03b39c08a80fe8229e9bf77.jpg" title="logo" alt="logo">
										</a>
										</td>
									</tr>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td>
											<table width="95%" border="0" align="center" cellpadding="0" cellspacing="0"
												style="max-width:670px;background:#fff; border-radius:3px; text-align:center;-webkit-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);-moz-box-shadow:0 6px 18px 0 rgba(0,0,0,.06);box-shadow:0 6px 18px 0 rgba(0,0,0,.06);">
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
												<tr>
													<td style="padding:0 35px;">
														<h1 style="color:#1e1e2d; font-weight:500; margin:0;font-size:32px;font-family:'Rubik',sans-serif;">You have
															requested to reset your password</h1>
														<span
															style="display:inline-block; vertical-align:middle; margin:29px 0 26px; border-bottom:1px solid #cecece; width:100px;"></span>
														<p style="color:#455056; font-size:15px;line-height:24px; margin:0;">
															We cannot simply send you your old password. A unique link to reset your
															password has been generated for you. To reset your password, click the
															following link and follow the instructions.
														</p>
														<a href="${BaseUrlClient}/resetPassword/${resetPasswordToken}"
															style="background:#20e277;text-decoration:none !important; font-weight:500; margin-top:35px; color:#fff;text-transform:uppercase; font-size:14px;padding:10px 24px;display:inline-block;border-radius:50px;">Reset
															Password</a>
													</td>
												</tr>
												<tr>
													<td style="height:40px;">&nbsp;</td>
												</tr>
											</table>
										</td>
									<tr>
										<td style="height:20px;">&nbsp;</td>
									</tr>
									<tr>
										<td style="text-align:center;">
											<p style="font-size:14px; color:rgba(69, 80, 86, 0.7411764705882353); line-height:18px; margin:0 0 0;">&copy; <strong>lms.university.ac.id</strong></p>
										</td>
									</tr>
									<tr>
										<td style="height:80px;">&nbsp;</td>
									</tr>
								</table>
							</td>
						</tr>
					</table>
					<!--/100% body table-->
				</body>

				</html>
				`;
    var mailOptions = {
      from: `LMS-University <${process.env.EMAIL_FROM}>`,
      to: email,
      subject: "reset password lms-university",
      html,
    };
    transporter.sendMail(mailOptions, function (error, info) {
      callback(error, info);
    });
  },
  sendEmailNotif: function (data, callback) {
    var mailOptions = {
      from: `LMS-University <${process.env.EMAIL_FROM}>`,
      to: data.emails,
      subject: "",
    };
    transporter.sendMail(mailOptions, function (error, info) {
      callback(error, info);
    });
  },
};

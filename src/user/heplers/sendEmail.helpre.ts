import { ServerClient } from 'postmark';

var client = new ServerClient(process.env.MAIL_TOKEN);

class SendEmail {
  sendRegistration(token: string, email: string): unknown {
    return client.sendEmail({
      From: process.env.MAIL_FROM,
      To: email,
      Subject: `Welcome on board, ${email}.Confirm your account`,
      HtmlBody: `
			<p>To confirm your registration, please click on the link below:</p>
			<a href="${process.env.HOST_VERIFY}/api/user/verify/${token}">Click me</a>
			`,
      TextBody: `
			To confirm your registration, please click on the link below:\n
				${process.env.HOST_VERIFY}/api/user/verify/${token}
			`,
      MessageStream: 'todos-1',
    });
  }

  sendPassword(token: string, email: string): unknown {
    return client.sendEmail({
      From: process.env.MAIL_FROM,
      To: email,
      Subject: `Hi, ${email}. Do you want to change the password`,
      HtmlBody: `
			<p>Confirm that you want change password, please click on the link below:</p>
			<a href="${process.env.HOST_PASSWORD}/auth/reset-password?token=${token}">Click me</a>
			`,
      TextBody: `
			Confirm that you want change password, please click on the link below:\n
			${process.env.HOST_PASSWORD}/auth/reset-password?token=${token}
			`,
      MessageStream: 'todos-1',
    });
  }
}

export const sendEmail = new SendEmail();

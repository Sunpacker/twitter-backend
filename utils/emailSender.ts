import mailer from '../core/mailer'
import { SentMessageInfo } from 'nodemailer/lib/sendmail-transport'

interface ISendEmail {
	emailFrom: string;
	emailTo: string;
	subject: string;
	html: string;
}

const emailSender = ({ emailFrom, emailTo, subject, html }: ISendEmail, callback?: (e: Error | null, info: SentMessageInfo) => void) => (
	mailer.sendMail(
		{
			from: emailFrom,
			to: emailTo,
			subject,
			html
		}, callback || function(e: Error | null, info: SentMessageInfo) {
			e ? console.error(e) : console.info(info)
		}
	)
)

export default emailSender

const sendgrid = require('sendgrid');
const helper = sendgrid.mail;
const keys = require('../config/keys');

class Mailer extends helper.Mail {
	constructor({ subject, recipients, from_email, attachment }, content) {
		super();

		this.sgApi = sendgrid(keys.sendGridKey);
		this.from_email = new helper.Email(from_email);
		this.subject = subject;
		this.body = new helper.Content('text/html', content);
		this.recipients = this.formatAddresses(recipients);
		attachment && (this.attachment = this.prepareAttachment(attachment));

		this.addContent(this.body);
		this.addRecipients();
		attachment && this.addAttachment(this.attachment);
	}

	prepareAttachment({ base64File, fileName, type }) {
		const attachment = new helper.Attachment();
		attachment.setContent(base64File);
		attachment.setType(type);
		attachment.setFilename(fileName);
		attachment.setDisposition('attachment');
		return attachment;
	}

	formatAddresses(recipients) {
		return recipients.map(email => new helper.Email(email));
	}

	addRecipients() {
		const personalize = new helper.Personalization();

		this.recipients.forEach(recipient => {
			personalize.addTo(recipient);
		});
		this.addPersonalization(personalize);
	}

	async send() {
		const request = this.sgApi.emptyRequest({
			method: 'POST',
			path: '/v3/mail/send',
			body: this.toJSON(),
		});

		const response = await this.sgApi.API(request);
		return response;
	}
}

module.exports = Mailer;

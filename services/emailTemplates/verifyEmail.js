const keys = require('../../config/keys');

module.exports = ({ username, token, id }) => {
	return `
    <html>
      <body>
        <div>
          <h3>Email Verification</h3>
          <p>
            Hello ${username}! To complete the email verification process, click the following link and then log in to your DevService account:
            <a href="${keys.redirectDomain}/register/verify_email/${id}/${token}">Verify Email</a>
          </p>
        </div>
      </body>
    </html>
  `;
};

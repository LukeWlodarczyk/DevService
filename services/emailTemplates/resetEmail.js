const keys = require('../../config/keys');

module.exports = ({ token, id }) => {
	return `
    <html>
      <body>
        <div style="text-align: center;">
          <h3>Password reset</h3>
          <p>
             You are receiving this because you (or someone else) have requested the reset of the password for your account.
             Please click on the following link, or paste this into your browser to complete the process:
             <a href="${keys.redirectDomain}/login/reset_password/${id}/${token}">Reset password</a>

             If you did not request this, please ignore this email and your password will remain unchanged.
          </p>
        </div>
      </body>
    </html>
  `;
};

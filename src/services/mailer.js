const nodemailer = require("nodemailer");
const sgTransport = require("nodemailer-sendgrid-transport");

const options = {
  auth: {
    api_user: process.env.SENDGRID_USERNAME,
    api_key: process.env.SENDGRID_PASSWORD
  }
};

const client = nodemailer.createTransport(sgTransport(options));

module.exports = {
  sendDesignMessage(email, { id, name }) {
    return new Promise((resolve, reject) => {
      const template = {
        from: "approver@approvli.com",
        to: email,
        subject: "You have a new Design Approval Request!",
        html: `<h2>Hello!</h2><p>You have a new review request on ${name}'s PR.</p><p>Please access it at</p> <a href="https://approvli.netlify.com/reviews/${id}">https://approvli.netlify.com</a>`
      };

      client.sendMail(template, function(err, info) {
        if (err) return reject(err);
        resolve(info.response);
      });
    });
  }
};

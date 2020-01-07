const sgMail = require("@sendgrid/mail");

sgMail.setApiKey(process.env.SENDGRID_KEY);

module.exports = {
  async sendDesignMessage(email, { id, name }) {
    console.log("Sending email to:", email);
    const template = {
      from: "approver@approvli.com",
      to: email,
      subject: "You have a new Design Approval Request!",
      html: `<h2>Hello!</h2><p>You have a new review request on ${name}'s PR.</p><p>Please access it at</p> <a href="https://approvli.netlify.com/reviews/${id}">https://approvli.netlify.com</a>`
    };

    return sgMail.send(template);
  }
};

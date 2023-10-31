const emailTemplates = {
    welcome: {
      subject: 'Testing Gmail API Integration',
      body: ({ email }) => `
        Dear ${email} 😃,

        Welcome to Qred Bank AB! I am testing if the Gmail API integrations works.
  
        Regards,
        💥👈
      `,
    },
  };

  module.exports = {
    emailTemplates
}
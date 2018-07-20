module.exports = {
  interfaces: {
    sizeStandardsHostName: "mint.ussba.io"
  },
  ErrorIntent: {
    message: 'Sorry, I can\'t understand the command. Please say again.'
  },
  CancelAndStopIntent: {
    message: 'Hope we helped!'
  },
  LaunchRequestIntent: {
    welcomeText: 'Welcome to the S. B. A. Voice Assistant, how can I help?'
  },
  AmIASmallBusinessIntent: {
    errorMessage: "I'm sorry there was an error determining your business's status",
    positive: "Congratulations you qualify as a small business",
    negative: "I'm sorry this business does not qualify as a small business",
    badEmployeeCount: "I'm sorry I didn't understand that.  Can you repeat how many employees you have?",
    badReceipts: "I'm sorry, I didn't understand that.  Can you repeat your annual receipts?",
    badNaicsCode: "I'm sorry, that is not a valid code.  Can you repeat your industry code?",
    badNaicsCodeNotAumber: "I'm sorry, that is not a valid code. A NAICS code should be a six digit number.  Can you repeat your industry code?",
    unableToHelp: "I'm sorry, but I can't help with that right now.  Try again later."
  },
  HelpIntent: {
    message: 'You can say : am I a small business!'
  }
};

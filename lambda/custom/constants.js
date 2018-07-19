module.exports = {
    interfaces:{
        sizeStandardsHostName: "mint.ussba.io"
    },
    LaunchRequestIntent:{
        welcomeText: 'Welcome to the S. B. A. Voice Assistant, how can I help?'
    },
    SmallBusinessIntent: {
        errorMessage: "I'm sorry there was an error determining your business's status",
        positive: "Congratulations you qualify as a small business",
        negative: "I'm sorry this business does not qualify as a small business",
        badEmployeeCount: "I'm sorry I didn't understand that.  Can you repeat how many employees you have?",
        badReceipts: "I'm sorry, I didn't understand that.  Can you repeat your annual receipts?",
        badNaicsCode: "I'm sorry, that is not a valid code.  Can you repeat your industry code?",
        unableToHelp: "I'm sorry, but I can't help with that right now.  Try again later."
    }
};

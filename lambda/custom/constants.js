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
        badEmployeeCount: "I didn't get that"
    }
};

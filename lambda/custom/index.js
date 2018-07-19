/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const sizeStandardsClient = require("./size-standards-client")
const constants = require("./constants")
const utils = require("./utils")



const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {
    const speechText = constants.LaunchRequestIntent.welcomeText;

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const AmIASmallBusinessIntentCompleteHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'AmIASmallBusinessIntent' &&
      request.dialogState && request.dialogState === 'COMPLETED';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request
    const { slots: { employee_count: { value: employeeCount }, naics_code: { value: naics }, annual_receipts: { value: receipts } } } = intent;

    return sizeStandardsClient.isSmallBusiness(naics, receipts, employeeCount)
      .then(result => {
        return handlerInput.responseBuilder
          .speak(result ? constants.SmallBusinessIntent.positive : constants.SmallBusinessIntent.negative)
          .getResponse();
      })
      .catch(error => {
        return handlerInput.responseBuilder
          .speak(constants.SmallBusinessIntent.errorMessage)
          .getResponse();
      })
  }
};

const AmIASmallBusinessIntentValidationHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AmIASmallBusinessIntent' &&
      request.dialogState && request.dialogState === 'IN_PROGRESS';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request
    const { slots: { employee_count: { value: employeeCount }, naics_code: { value: naics }, annual_receipts: { value: receipts } } } = intent;

    if (employeeCount) {
      console.log("EmployeeCount", employeeCount)
      if (!utils.isNumeric(employeeCount)) {
        return handlerInput.responseBuilder
          .speak(constants.SmallBusinessIntent.badEmployeeCount)
          .addElicitSlotDirective("employee_count")
          .getResponse();
      }
    }

    if (receipts) {
      console.log("receipts", receipts)
      if (!utils.isNumeric(receipts)) {
        return handlerInput.responseBuilder
          .speak(constants.SmallBusinessIntent.badReceipts)
          .addElicitSlotDirective("annual_receipts")
          .getResponse();
      }
    }

    if (naics) {
      console.log("naics", naics)
      if (!utils.isNumeric(naics)) {
        return handlerInput.responseBuilder
          .speak(constants.SmallBusinessIntent.badNaicsCodeNotAumber)
          .addElicitSlotDirective("naics_code")
          .getResponse();
      }
      else {
        return sizeStandardsClient.fetchNaics(naics)
          .then(naicsData => {
            console.log("Found naics data", naicsData)
            if (naicsData) {
              return handlerInput.responseBuilder
                .addDelegateDirective(intent)
                .getResponse();
            }
            else {
              return handlerInput.responseBuilder
                .speak(constants.SmallBusinessIntent.badNaicsCode)
                .addElicitSlotDirective("naics_code")
                .getResponse();
            }
          })
          .catch(error => {
            return handlerInput.responseBuilder
              .speak(constants.SmallBusinessIntent.unableToHelp)
              .withShouldEndSession(true)
              .getResponse();
          })
      }
    }

    return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse();
  },
};


const AmIASmallBusinessIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AmIASmallBusinessIntent';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request

    return handlerInput.responseBuilder
      .addDelegateDirective(intent)
      .getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    const speechText = 'You can say hello to me!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest' &&
      (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent' ||
        handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    const speechText = 'Goodbye!';

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard('Hello World', speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Error handled: ${error.message}`);

    return handlerInput.responseBuilder
      .speak('Sorry, I can\'t understand the command. Please say again.')
      .reprompt('Sorry, I can\'t understand the command. Please say again.')
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    LaunchRequestHandler,
    AmIASmallBusinessIntentValidationHandler,
    AmIASmallBusinessIntentCompleteHandler,
    AmIASmallBusinessIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

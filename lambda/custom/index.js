/* eslint-disable  func-names */
/* eslint-disable  no-console */

const Alexa = require('ask-sdk-core');
const axios = require('axios')
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
    return request.type === 'IntentRequest'
      && request.intent.name === 'AmIASmallBusinessIntent'
      && request.dialogState && request.dialogState === 'COMPLETED';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request
    const {slots : { employee_count, naics_code, annual_receipts}} = intent;
    
    let employeeCount = employee_count.value;
    console.log("EmployeeCount", employeeCount)
    if(!utils.isNumeric(employeeCount)){
      return handlerInput.responseBuilder
        .speak(constants.SmallBusinessIntent.badEmployeeCount)
        .getResponse();
    }
    
    let naics = naics_code.value;
    let receipts = annual_receipts.value;
    
    let uri = `https://${constants.interfaces.sizeStandardsHostName}/isSmallBusiness?id=${naics}&revenue=${receipts}&employeeCount=${employeeCount}`;
    console.log("uri", uri)
    return axios
      .get(uri)
      .then(result => {
        console.log("Result", result)
        console.log("Result.data", result.data)
        let text = ""
        if(result && result.status === 200 && (result.data === "true" || result.data === "false")){
          let isSmallBusiness = result.data === "true" 
          text = isSmallBusiness ?  constants.SmallBusinessIntent.positive :constants.SmallBusinessIntent.negative 
        }else{
          text = constants.SmallBusinessIntent.errorMessage;
        }
        
        return handlerInput.responseBuilder
          .speak(text)
          .getResponse();
    })
  }
};

const AmIASmallBusinessIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AmIASmallBusinessIntent';
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
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
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
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
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
    AmIASmallBusinessIntentCompleteHandler,
    AmIASmallBusinessIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();

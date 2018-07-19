/* eslint-disable  func-names */
/* eslint-disable  no-console */

const sizeStandardsClient = require("./size-standards-client")

const utils = require("./utils")
const text = utils.getConstantText;


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
          .speak(result ? text("AmIASmallBusinessIntent.positive") : text("AmIASmallBusinessIntent.negative"))
          .getResponse();
      })
      .catch(error => {
        return handlerInput.responseBuilder
          .speak(text("AmIASmallBusinessIntent.errorMessage"))
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
          .speak(text("AmIASmallBusinessIntent.badEmployeeCount"))
          .addElicitSlotDirective("employee_count")
          .getResponse();
      }
    }

    if (receipts) {
      console.log("receipts", receipts)
      if (!utils.isNumeric(receipts)) {
        return handlerInput.responseBuilder
          .speak(text("AmIASmallBusinessIntent.badReceipts"))
          .addElicitSlotDirective("annual_receipts")
          .getResponse();
      }
    }

    if (naics) {
      console.log("naics", naics)
      if (!utils.isNumeric(naics)) {
        return handlerInput.responseBuilder
          .speak(text("AmIASmallBusinessIntent.badNaicsCodeNotAumber"))
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
                .speak(text("AmIASmallBusinessIntent.badNaicsCode"))
                .addElicitSlotDirective("naics_code")
                .getResponse();
            }
          })
          .catch(error => {
            return handlerInput.responseBuilder
              .speak(text("AmIASmallBusinessIntent.unableToHelp"))
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

module.exports.AmIASmallBusinessIntentCompleteHandler = AmIASmallBusinessIntentCompleteHandler;
module.exports.AmIASmallBusinessIntentValidationHandler = AmIASmallBusinessIntentValidationHandler;
module.exports.AmIASmallBusinessIntentHandler = AmIASmallBusinessIntentHandler;
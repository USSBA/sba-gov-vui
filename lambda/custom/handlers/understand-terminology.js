/* eslint-disable  func-names */
/* eslint-disable  no-console */

const utils = require("../utils")
const text = (value) => utils.getConstantText("UnderstandTerminologyIntent." + value);


const UnderstandTerminologyIntentHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'UnderstandTerminologyIntent';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request
    const { slots: { term: { value: requestedTerm } } } = intent;

    return handlerInput.responseBuilder
      .speak(text(requestedTerm))
      .getResponse();
  }
};

module.exports.UnderstandTerminologyIntentHandler = UnderstandTerminologyIntentHandler;

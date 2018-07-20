/* eslint-disable  func-names */
/* eslint-disable  no-console */

const dictionary = require("./dictionary")

function findDefinition(requestedTerm){
  let found = dictionary.find(item => item.terms.indexOf(requestedTerm) !== -1)
  return found.definition;
}

const UnderstandTerminologyIntentHandler = {
  canHandle(handlerInput) {
    let request = handlerInput.requestEnvelope.request;
    return request.type === 'IntentRequest' &&
      request.intent.name === 'UnderstandTerminologyIntent';
  },
  handle(handlerInput) {
    const { intent } = handlerInput.requestEnvelope.request
    const { slots: { term: { value: requestedTerm } } } = intent;

    console.log("Providing definition for " + requestedTerm);
    let definition = findDefinition(requestedTerm);
    console.log("Defintion was found to be " + definition);

    return handlerInput.responseBuilder
      .speak(definition)
      .getResponse();
  }
};

module.exports.findDefinition = findDefinition
module.exports.UnderstandTerminologyIntentHandler = UnderstandTerminologyIntentHandler;

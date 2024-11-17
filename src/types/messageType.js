export const messageType = {
  relatedToSuicide: "relatedToSuicide",
  askingGovernmentHelp: "askingGovernmentHelp",
  normal: "normal",
};

export const checkMessageType = ({ relatedToSuicide, askingGovernmentHelp }) => {
  if (relatedToSuicide) return messageType.relatedToSuicide;
  if (askingGovernmentHelp) return messageType.askingGovernmentHelp;
  return messageType.normal;
};

export interface ApiWordResponseI {
  api_owner: any;
  body: ApiWordBodyI;
}

export interface ApiWordBodyI {
  author: string;
  definition: string;
  definitionMD: string;
  encodingWebName: string;
  errorMessage: any;
  related: { word: string; urls: any }[];
  urlDefinitionSource: string;
  Word: string;
  wordOrigin: string;
  urls: any;
}

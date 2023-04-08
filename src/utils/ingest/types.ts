import { Document } from "langchain/document";
export interface Metadata {
  url: string;
  preciseUrl?: string;
  page?: string;
}

export interface DocumentWithMetadata extends Document {
  metadata: Metadata;
}

export class DocumentWithMetadata
  extends Document
  implements DocumentWithMetadata
{
  pageContent: string;
  metadata: Metadata;
  constructor(fields: DocumentWithMetadata) {
    super();
    this.pageContent = fields?.pageContent;
    this.metadata = fields?.metadata;
  }
}

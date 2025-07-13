import { MongoClient } from "mongodb";

declare global {
    var _mongoClientPromise: Promise<MongoClient>
}

declare module "@editorjs/link" {
    const LinkTool: any;
    export default LinkTool;
  }
  
  declare module "@editorjs/embed" {
    const EmbedTool: any;
    export default EmbedTool;
  }
  
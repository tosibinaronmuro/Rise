import { Storage } from "@google-cloud/storage";
import path from "path";

const gc = new Storage({
  keyFilename: path.join(
    __dirname,
    "../../scenic-precinct-396813-96efa28fc0a6.json"
  ),
  projectId: "scenic-precinct-396813",
});

const risecloudBucket = gc.bucket("risecloud");
const listFilesInBucket = async () => {
    try {
      const [files] = await risecloudBucket.getFiles();
  
      console.log("Files in the bucket:");
      files.forEach((file) => {
        console.log(file.name);
      });
    } catch (error) {
      console.error("Error listing files:", error);
    }
  };
  
  listFilesInBucket();
  
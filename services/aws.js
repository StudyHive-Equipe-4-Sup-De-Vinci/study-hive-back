// Load the AWS SDK for Node.js
const AWS = require("aws-sdk");

// Set up config
AWS.config.update({
  accessKeyId: "E3PUT7KCCTD7HT7FC8UW",
  secretAccessKey: "Dtsxac6yjVVA4MuZ6FMHnLAqq8TYEHfV8YpnwZIC",
});

// Create S3 service object
const s3 = new AWS.S3({
  endpoint: "cellar-c2.services.clever-cloud.com",
  s3ForcePathStyle: true, // Obligatoire pour Cellar
});

async function uploadFileToS3(fileBuffer, fileName, mimeType) {
  console.log("??");
  const params = {
    Bucket: "study-hive",
    Key: `uploads/${fileName}`, // Stocker le fichier sous ce nom
    Body: fileBuffer,
    ACL: "public-read",
    ContentType: mimeType || "application/octet-stream",
  };

  const data = await s3.upload(params).promise();
  return data.Location; // Retourne l'URL du fichier
}

module.exports = {
  uploadFileToS3,
};

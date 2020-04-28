const aws = require("aws-sdk");

const accessKeyId = process.env.AWS_ACCESS_KEY;
const accessSecret = process.env.AWS_ACCESS_SECRET;
const bucketId = process.env.AWS_S3_BUCKET;

const s3 = new aws.S3({
  accessKeyId,
  secretAccessKey: accessSecret
});

function writeToBucket(song) {
  const data = song.split(" - ");
  console.log("Writing song", data, s3);

  if (!data[0] || data[0] === "" || !data[1] || data[1] === "" || !s3) {
    console.log("Not calling");
    return;
  }

  const params = {
    Bucket: bucketId,
    Body: JSON.stringify({
      artist: data[0],
      song: data[1]
    }),
    ACL: "public-read",
    Key: "metadata.json"
  };

  s3.upload(params, (err, data) => {
    if (err) {
      return console.error("Could not write data to bucket", err);
    }
    console.log("Wrote new data");
  });
}

module.exports = {
  writeToBucket
};

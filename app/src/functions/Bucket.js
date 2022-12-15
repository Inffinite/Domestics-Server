const {Credentials} = require('aws-sdk'); 
const S3 = require('aws-sdk/clients/s3');

const s3Client = new S3({
    // region: process.env.LINODE_REGION,
    region: 'Frankfurt',
    endpoint: process.env.LINODE_STORAGE_ENDPOINT,
    sslEnabled: true,
    s3ForcePathStyle: false,
    credentials: new Credentials({
        accessKeyId: process.env.LINODE_ACCESS_KEY,
        secretAccessKey: process.env.LINODE_SECRET_ACCESS_KEY,
    }),
});

const uploadFile = async (base64Data, filename, mimetype) => {
    const params = {
        Bucket: process.env.LINODE_OBJECT_BUCKET,
        Key: filename,
        Body: base64Data,
        ACL: 'public-read',
        ContentEncoding: 'base64',
        ContentType: mimetype
    };

    const { Location } = await s3Client.upload(params).promise();
    return Location
}

const deleteFile = async (url) => {
    const Key = url.split(`${process.env.LINODE_STORAGE_ENDPOINT}/`)[1];
    const params = {
        Bucket: process.env.LINODE_OBJECT_BUCKET,
        Key,
    };

    return s3Client.deleteObject(params).promise();
}

module.exports = {
    uploadFile,
    deleteFile,
}


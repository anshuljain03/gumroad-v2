const multer = require('multer');
const { BlobServiceClient, generateBlobSASQueryParameters, BlobSASPermissions, SASProtocol } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');
const File = require('../models/File');

// Configure multer
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('file');

// Initialize Azure Blob service
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;'
const containerName = "uploads";

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

async function createContainerIfNotExists() {
    const exists = await containerClient.exists();
    if (!exists) {
        await containerClient.create();
        console.info(`Container '${containerName}' created`);
    }
}

const uploadFile = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded.");

        await createContainerIfNotExists();
        
        const blobName = uuidv1() + '-' + req.file.originalname;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);
        
        // Create file metadata
        const newFile = new File({
            uniquePermalink: blobName,
            blobKey: blockBlobClient.url,
            fileName: req.file.originalname,
            fileType: req.file.mimetype
        });

        // Save file metadata in MongoDB
        await newFile.save();

        console.info(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
        res.status(200).send({
            message: "File uploaded to Azure Blob Storage and metadata saved to MongoDB.",
            blobName: blobName,
            path: blockBlobClient.url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

const getSasUrl = async (blobName) => {
    const blobClient = containerClient.getBlobClient(blobName);
    const sasOptions = {
        containerName,
        blobName,
        permissions: BlobSASPermissions.parse("r"), // "r" for read
        startsOn: new Date(),
        expiresOn: new Date(new Date().valueOf() + 3600 * 1000), // 1 hour validity
        protocol: SASProtocol.Http,
    };

    const sasToken = generateBlobSASQueryParameters(sasOptions, blobServiceClient.credential).toString();
    return `${blobClient.url}?${sasToken}`;
};

const getFileUrl = async (req, res) => {
    const blobName = req.params.blobName;
    try {
        const url = await getSasUrl(blobName);
        res.status(200).send({ url });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Failed to generate SAS URL', error: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadStrategy,
    getFileUrl
};

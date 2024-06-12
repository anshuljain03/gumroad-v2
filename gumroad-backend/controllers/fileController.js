const multer = require('multer');
const { BlobServiceClient } = require('@azure/storage-blob');
const { v1: uuidv1 } = require('uuid');

// Configure multer
const inMemoryStorage = multer.memoryStorage();
const uploadStrategy = multer({ storage: inMemoryStorage }).single('file');

// Initialize Azure Blob service
const AZURE_STORAGE_CONNECTION_STRING = 'DefaultEndpointsProtocol=http;AccountName=devstoreaccount1;AccountKey=Eby8vdM02xNOcqFlqUwJPLlmEtlCDXJ1OUzFT50uSRZ6IFsuFq2UVErCz4I6tq/K1SZFPTOtr/KBHBeksoGMGw==;BlobEndpoint=http://127.0.0.1:10000/devstoreaccount1;'
const containerName = "uploads";

const blobServiceClient = BlobServiceClient.fromConnectionString(AZURE_STORAGE_CONNECTION_STRING);
const containerClient = blobServiceClient.getContainerClient(containerName);

const uploadFile = async (req, res) => {
    try {
        if (!req.file) throw new Error("No file uploaded.");

        const blobName = uuidv1() + '-' + req.file.originalname;
        const blockBlobClient = containerClient.getBlockBlobClient(blobName);
        const uploadBlobResponse = await blockBlobClient.upload(req.file.buffer, req.file.buffer.length);
        
        console.log(`Upload block blob ${blobName} successfully`, uploadBlobResponse.requestId);
        res.status(200).send({
            message: "File uploaded to Azure Blob Storage.",
            blobName: blobName,
            path: blockBlobClient.url
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: error.message });
    }
};

module.exports = {
    uploadFile,
    uploadStrategy
};

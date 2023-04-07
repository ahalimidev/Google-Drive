const fs = require("fs");
const { google } = require("googleapis");

const SCOPES = [
  "https://www.googleapis.com/auth/drive",
  "https://www.googleapis.com/auth/drive.file",
  "https://www.googleapis.com/auth/drive.appdata",
  "https://www.googleapis.com/auth/drive.apps.readonly",
  "https://www.googleapis.com/auth/drive.readonly",
  "https://www.googleapis.com/auth/drive.metadata.readonly",
  "https://www.googleapis.com/auth/drive.metadata",
  "https://www.googleapis.com/auth/drive.photos.readonly",
];

class GoogleDriveService {
  constructor(clientId, clientSecret, redirectUri, refreshToken) {
    this.driveClient = this.createDriveClient(
      clientId,
      clientSecret,
      redirectUri,
      refreshToken
    );
  }

  createDriveClient(clientId, clientSecret, redirectUri, refreshToken) {
    const client = new google.auth.OAuth2(clientId, clientSecret, redirectUri);

    client.setCredentials({ refresh_token: refreshToken, scope: SCOPES });

    return google.drive({
      version: "v3",
      auth: client,
    });
  }

  createFolder(folderName) {
    return this.driveClient.files.create({
      resource: {
        name: folderName,
        mimeType: "application/vnd.google-apps.folder",
      },
      fields: "id, name, description, createdTime, modifiedTime",
    });
  }

  allFolder() {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          fields: "files(id, name)",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res ? res : null);
        }
      );
    });
  }

  getFolder(folderName) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          q: `mimeType='application/vnd.google-apps.folder' and name='${folderName}'`,
          fields: "files(id, name)",
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res ? res : null);
        }
      );
    });
  }

  getFile(folderId) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.list(
        {
          fields: "nextPageToken, files(mimeType, id, name, description, createdTime, modifiedTime, parents)",
          q: `'${folderId}' in parents`,
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res ? res : null);
        }
      );
    });
  }

  firstFile(fileId) {
    return new Promise((resolve, reject) => {
      this.driveClient.files.get(
        {
          fileId: fileId,
          alt: "media",
          fields: "modifiedTime",
        },
        {responseType: 'stream'}
        ,
        (err, res) => {
          if (err) {
            return reject(err);
          }

          return resolve(res ? res : null);
        }
      );
    });
  }

  CrateFile(fileName, filePath, fileMimeType, folderId) {
    return this.driveClient.files.create({
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
        parents: folderId ? [folderId] : [],
      },
      media: {
        mimeType: fileMimeType,
        body: filePath,
      },
    });
  }

  UpdateFile(fileName, filePath, fileMimeType,fileId) {
    return this.driveClient.files.update({
      fileId: fileId,
      requestBody: {
        name: fileName,
        mimeType: fileMimeType,
      },
      media: {
        mimeType: fileMimeType,
        body: filePath,
      },  
    });
  }

  deleteFile(fileId) {
    return this.driveClient.files.delete({
      fileId: fileId,  
    });
  }

  createPermission(fileId, emailAddress = "") {
    if (emailAddress === "") {
      return this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          type: "anyone",
          role: "reader",
        },
      });
    } else {
      return this.driveClient.permissions.create({
        fileId: fileId,
        requestBody: {
          type: "user",
          role: "reader",
          emailAddress : emailAddress,
        },
      });
    }
  }

  createGeneaterUrl(fileId){
    return new Promise((resolve, reject) => {
      this.driveClient.files.get(
        {
          fileId: fileId,
          fields: 'webViewLink, webContentLink',
        },
        (err, res) => {
          if (err) {
            return reject(err);
          }
          return resolve(res ? res : null);
        }
      );
    });
  }
}
module.exports = GoogleDriveService;
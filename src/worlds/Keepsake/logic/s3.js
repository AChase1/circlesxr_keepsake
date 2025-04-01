class S3Logic {
    static uploadOrbToS3 = async (body) => {
        try {        
                await fetch('/s3_uploadMetadata', {
                    method: 'POST',
                    body: JSON.stringify(body),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                console.log("Orb uploaded successfully!");
                // TODO => add UI feedback for successful upload          
        } catch (error) {
            console.error("Error uploading orb: " + error);
        }
    }

    static uploadFileToS3 = async (fileData, metadata) => {
        try {
                const formData = new FormData();
                formData.append("file", fileData);
                formData.append("metadata", JSON.stringify(metadata));
                const response = await fetch('/s3_uploadFile', {
                    method: 'POST',
                    body: formData,
                });           

                console.log("File uploaded successfully!");
                // TODO => add UI feedback for successful upload
          
                const uploadUI = document.querySelector('#upload-ui');
                uploadUI.style.display = 'none';

                const artifact = Artifact.fromJson(response.data);
                await this.retrieveObject(artifact.key);
        
        } catch (error) {
            console.error("Error uploading orb: " + error);
        }

    }

    static retrieveAllObjects = async () => {
        try {
            const response = await fetch(`/s3_retrieveAllObjects`);
            if (response.status == 200) {
                console.log("Objects retrieved successfully!");
                const jsonResponse = await response.json();
                const data = jsonResponse.data.Contents;
                return data;
            } else {
                console.log("Error retrieving object");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    static retrieveObject = async (key) => {
        try {
            const response = await fetch(`/s3_retrieveObject/${encodeURIComponent(key)}`);
            if (response.status == 200) {
                const jsonResponse = await response.json();
                if (jsonResponse.data.isOrb) {
                    const orb = Orb.fromJson(jsonResponse.data);
                    return orb;
                } else {
                    const artifact = Artifact.fromJson(jsonResponse.data);
                    return artifact;
                }


            } else {
                console.log("Error retrieving object");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }
}
class S3Repository {
    uploadToS3 = async (artifact) => {
        try {
            const formData = new FormData();
            formData.append("file", artifact.file);
            formData.append("artifact", JSON.stringify(artifact.toJson()));
            const response = await fetch('/s3_upload', {
                method: 'POST',
                body: formData,
            });

            if (response.status == 200) {
                console.log("Object uploaded successfully");
                await this.retrieveAllObjects(artifact.objectKey);
            } else {
                console.error("Error uploading object");
            }
        } catch (error) {
            console.error(error);
        }

    }

    retrieveAllObjects = async () => {
        try {
            const response = await fetch(`/s3_retrieveAllObjects`);
            if (response.status == 200) {
                console.log("Objects retrieved successfully!");
                const jsonResponse = await response.json();
                const data = jsonResponse.data.Contents;
                const sortedArtifacts = data.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
                const lastArtifact = sortedArtifacts[0];
                await this.retrieveObject(lastArtifact.Key);
            } else {
                console.log("Error retrieving object");
                return null;
            }
        } catch (error) {
            console.error(error);
            return null;
        }
    }

    retrieveObject = async (key) => {
        try {
            const fileLogic = new FileLogic();
            const response = await fetch(`/s3_retrieveObject/${encodeURIComponent(key)}`);
            if (response.status == 200) {
                const jsonResponse = await response.json();
                const binaryString = atob(jsonResponse.data);
                const len = binaryString.length;
                const bytes = new Uint8Array(len);
                for (let i = 0; i < len; i++) {
                    bytes[i] = binaryString.charCodeAt(i);
                }
                const file = new Blob([bytes], { type: 'application/octet-stream' });
                fileLogic.loadObjectInScene(file);
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
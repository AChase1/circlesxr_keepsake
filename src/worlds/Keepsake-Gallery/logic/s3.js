class S3Logic {
    uploadToS3 = async (bodyData, metadata) => {
        try {
            if(!bodyData || !metadata) return;
            const formData = new FormData();
            formData.append("body", bodyData);
            formData.append("metadata", metadata);
            const response = await fetch('/s3_upload', {
                method: 'POST',
                body: formData,
            });

            if (response.status == 200) {
                console.log("Object uploaded successfully!");
                const uploadUI = document.querySelector('#upload-ui');
                uploadUI.style.display = 'none';
                await this.retrieveObject(artifact.objectKey);
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
                const sortedObjects = data.sort((a, b) => new Date(b.LastModified) - new Date(a.LastModified));
                return sortedObjects;
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
                const newArtifact = Artifact.fromJson(jsonResponse.data);
                fileLogic.fileDataToAframe(newArtifact.file, newArtifact.pedestalId);

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
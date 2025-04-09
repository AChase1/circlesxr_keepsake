class S3Logic {

    static uploadMetadataToS3 = async (body) => {
        try {
            await fetch('/s3_uploadMetadata', {
                method: 'POST',
                body: body,
                headers: {
                    'Content-Type': 'application/json'
                }
            });
            console.log("Metadata uploaded successfully!");
            // TODO => add UI feedback for successful upload          
        } catch (error) {
            console.error("Error uploading metadata: " + error);
        }
    }

    static uploadFileToS3 = async (fileData, metadata) => {
        try {
            const formData = new FormData();
            formData.append("file", fileData);
            formData.append("metadata", JSON.stringify(metadata));
            await fetch('/s3_uploadFile', {
                method: 'POST',
                body: formData,
            });

            console.log("File uploaded successfully!");
            // TODO => add UI feedback for successful upload

            // Model Upload Sound Effect
            var modelSound = document.querySelectorAll('.modelUpload');
            modelSound.forEach(function (soundEntity) {
                soundEntity.components.sound.stopSound();
                soundEntity.components.sound.playSound();
            });

            const uploadUI = document.querySelector('#upload-ui');
            uploadUI.style.display = 'none';

            const artifactJson = await S3Logic.retrieveObject(metadata.key);
            const artifact = Artifact.fromJson(artifactJson);
            new ArtifactLogic().fileDataToAframe(artifact);

        } catch (error) {
            console.error("Error uploading file: " + error);
        }

    }

    static retrieveAllObjects = async () => {
        try {
            const animEl = document.getElementById("loading-animation");
            animEl.style.display = "block";
            const response = await fetch(`/s3_retrieveAllObjects`);
            console.log("Objects retrieved successfully!");
            const jsonResponse = await response.json();
            animEl.style.display = "none";
            return jsonResponse.data.Contents;
        } catch (error) {
            console.error("Error retrieving all objects: " + error);
            return null;
        }
    }

    static retrieveObject = async (key) => {
        try {
            const animEl = document.getElementById("loading-animation");
            animEl.style.display = "block";
            const response = await fetch(`/s3_retrieveObject/${encodeURIComponent(key)}`);
            const jsonResponse = await response.json();
            animEl.style.display = "none";
            return JSON.stringify(jsonResponse.data);
        } catch (error) {
            console.error("Error retrieving object: " + key + " : " + error);
            return null;
        }
    }

    static deleteObject = async (key) => {
        try {
            await fetch(`/s3_deleteObject/${encodeURIComponent(key)}`);
        } catch (error) {
            console.error("Error delete object: " + key + " : " + error);
            return null;
        }
    }
}
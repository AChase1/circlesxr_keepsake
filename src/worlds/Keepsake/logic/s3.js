class S3Logic {
    static uploadToS3 = async (bodyData, metadata) => {
        try {
            
            let payload, endpoint, headers = null;
            if(!bodyData || !metadata) return;

            if(metadata["isOrb"]) {
                payload = JSON.stringify(metadata);
                endpoint = '/s3_uploadMetadata';
                headers = {
                    'Content-Type': 'application/json'};
                console.log('uploading orb');
            } else {
                const formData = new FormData();
                formData.append("file", bodyData);
                formData.append("metadata", JSON.stringify(metadata));
                payload = formData;
                endpoint = '/s3_uploadFile';
                console.log('uploading file');
            }
            
            const response = await fetch(endpoint, {
                method: 'POST',
                body: payload,
                headers: headers
            });

            console.log(response);

            if (response.status == 200) {
                console.log("Object uploaded successfully!");
                // TODO => add UI feedback for successful upload
                if(metadata["isOrb"]) return;
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
                if(jsonResponse.data.isOrb){
                    const orb = Orb.fromJson(jsonResponse.data);
                    return orb;
                } else  {
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
class ArtifactLogic {
    getFileFromSystem = function () {
        const fileInput = this.createFileInput();
        fileInput.addEventListener('change', (event) => this.readAndUploadFile(event));
        fileInput.click();
    }

    readAndUploadFile = async (event) => {
        try {
            const file = event.target.files[0];
            const pedestalId = document.querySelector("a-scene").components["interaction-manager"].pickedUpObject;
            const timestamp = BasicLogic.getCurrentTimestamp();
            const currUserEmail = UserLogic.getCurrentUserEmail();
            const artifact = new Artifact("file_" + file.name + "_" + timestamp, currUserEmail, "", "", [], [], pedestalId, file);
            
            await S3Logic.uploadFileToS3(artifact.file, artifact.toJson());
            const uploadedArtifact = await S3Logic.retrieveObject(artifact.key);
            this.fileDataToAframe(uploadedArtifact.file, uploadedArtifact.pedestalId);
        } catch (error) {
            console.error(error);
        }
    }

    createFileInput = () => {
        const fileInput = document.createElement('input');
        fileInput.type = 'file';
        fileInput.style.display = 'none';
        document.body.appendChild(fileInput);
        return fileInput;
    }

    fileDataToAframe = (file, pedestalId) => {
        const binaryString = atob(file);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blobFile = new Blob([bytes], { type: 'application/octet-stream' });
        this.loadObjectInScene(blobFile, pedestalId);
    }

    loadObjectInScene(file, pedestalId) {
        const pedestal = document.getElementById(pedestalId);
        if (!pedestal) {
            console.error("Pedestal not found");
            return;
        }

        const children = Array.from(pedestal.children).filter(child => child.id === "artifact");
        if (children) {
            console.log("Pedestal already has an artifact");
            children.forEach(child => pedestal.removeChild(child));
        }

        const pedestalInteraction = pedestal.components["pedestal-interaction"];
        const model = document.createElement("a-entity");
        model.setAttribute("id", "artifact");
        model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
        pedestal.appendChild(model);
        model.setAttribute("scale", "70 70 70");
        model.setAttribute("position", {x: pedestalInteraction.pedestalTop.x + 73, y: pedestalInteraction.pedestalTop.y + 15, z: pedestalInteraction.pedestalTop.z + 13});
    }
}




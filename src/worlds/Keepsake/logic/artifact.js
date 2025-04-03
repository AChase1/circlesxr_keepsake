class ArtifactLogic {
    getFileFromSystem = function () {
        const currUserEmail = UserLogic.getCurrentUserEmail();
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get("userEmail");
        if (userEmail != currUserEmail) return;
        const fileInput = this.createFileInput();
        fileInput.addEventListener('change', (event) => this.uploadFile(event));
        fileInput.click();
    }

    removeExistingArtifacts = async (pedestalId) => {
        const pedestal = document.getElementById(pedestalId);
        if (!pedestal.children) return;
        const artifacts = Array.from(pedestal.children).filter(child => child.id === "artifact");
        if (artifacts.length > 0) {
            console.log("Pedestal already has an artifact");
            const allS3Object = await S3Logic.retrieveAllObjects();
            for (const object of allS3Object) {
                if (object.Key.startsWith("file")) {
                    const artifact = await S3Logic.retrieveObject(object.Key);
                    if (artifact.pedestalId == pedestalId) {
                        console.log("removing " + artifact.userEmail + " artifact");
                        console.log(artifact);
                        S3Logic.deleteObject(artifact.key);
                    }
                }
            }
            artifacts.forEach(child => pedestal.removeChild(child));
        }

    }

    uploadFile = async (event) => {
        try {
            const file = event.target.files[0];
            const pedestalId = document.querySelector("a-scene").components["interaction-manager"].pickedUpObject;
            const timestamp = BasicLogic.getCurrentTimestamp();
            const currUserEmail = UserLogic.getCurrentUserEmail();
            const artifact = new Artifact("file_" + file.name + "_" + timestamp, currUserEmail, "", "", pedestalId, file);
            this.removeExistingArtifacts(artifact.pedestalId);
            await S3Logic.uploadFileToS3(artifact.file, artifact.toJson());
            const uploadedArtifact = await S3Logic.retrieveObject(artifact.key);
            this.fileDataToAframe(uploadedArtifact);

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

    fileDataToAframe = (artifact) => {
        const binaryString = atob(artifact.file);
        const len = binaryString.length;
        const bytes = new Uint8Array(len);
        for (let i = 0; i < len; i++) {
            bytes[i] = binaryString.charCodeAt(i);
        }
        const blobFile = new Blob([bytes], { type: 'application/octet-stream' });
        this.loadObjectInScene(blobFile, artifact);
    }

    loadObjectInScene(file, artifact) {
        const pedestal = document.getElementById(artifact.pedestalId);
        if (!pedestal) {
            console.error("Pedestal not found");
            return;
        }
        const pedestalInteraction = pedestal.components["pedestal-interaction"];

        const model = document.createElement("a-entity");
        model.setAttribute("id", "artifact");
        model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
        pedestal.appendChild(model);
        model.setAttribute("scale", "70 70 70");
        model.setAttribute("position", { x: pedestalInteraction.pedestalTop.x + 73, y: pedestalInteraction.pedestalTop.y + 15, z: pedestalInteraction.pedestalTop.z + 13 });
    }
}




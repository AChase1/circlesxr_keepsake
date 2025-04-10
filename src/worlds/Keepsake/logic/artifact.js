class ArtifactLogic {
    getFileFromSystem = function () {
        console.log("getFileFromSystem called");

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
            const artifact = new Artifact("file_" + file.name + "_" + timestamp, currUserEmail, file.name, "", pedestalId, file);
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
        const scene = document.querySelector("a-scene");
        const pedestal = document.getElementById(artifact.pedestalId);
        if (!pedestal) {
            console.error("Pedestal not found");
            return;
        }
        const pedestalInteraction = pedestal.components["pedestal-interaction"];

        const model = document.createElement("a-entity");
        model.setAttribute("id", "artifact");

        if (artifact.pedestalId.includes("frame")) {
            const frame = document.getElementById(artifact.pedestalId);
            const frameWorldPos = frame.object3D.getWorldPosition(new THREE.Vector3());
            model.setAttribute("circles-pdf-loader", `src:${URL.createObjectURL(file)};`);
            model.setAttribute("scale", "1.8 1.8 1.8");
            model.setAttribute("position", { x: frameWorldPos.x, y: frameWorldPos.y + 1.3, z: frameWorldPos.z + 0.2 });
            if (artifact.pedestalId.includes("frame-1")) {
                model.setAttribute("rotation", "0 90 0");
                model.setAttribute("position", { x: frameWorldPos.x + 0.2, y: frameWorldPos.y + 1.3, z: frameWorldPos.z });
            } else if (artifact.pedestalId.includes("frame-3")) {
                model.setAttribute("rotation", "0 -90 0");
                model.setAttribute("position", { x: frameWorldPos.x - 0.2, y: frameWorldPos.y + 1.3, z: frameWorldPos.z });
            }
        } else {
            model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
            model.setAttribute("scale", "1 1 1");
            model.setAttribute("position", { x: pedestalInteraction.pedestalTop.x, y: pedestalInteraction.pedestalTop.y, z: pedestalInteraction.pedestalTop.z });
            model.setAttribute("circles-artefact", `label_text:${artifact.name}; label_offset:0 1.5 0; inspectPosition:0 0 -1.5`);
        }

        scene.appendChild(model);
    }
}




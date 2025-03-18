class FileLogic {
    getFileFromSystem = function () {
        try {
            const s3Repository = new S3Repository();
            const basicLogic = new BasicLogic();

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.style.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const pedestalId = document.querySelector("a-scene").components["interaction-manager"].pickedUpObject;
                    console.log(pedestalId);
                    const timestamp = basicLogic.getCurrentTimestamp();
                    const artifact = new Artifact(file.name + timestamp, 1, "", "", [], [], pedestalId, file);
                    s3Repository.uploadToS3(artifact);
                }
            });
            fileInput.click();
        } catch (error) {
            console.error(error);
        }

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
        const pedestalInteraction = pedestal.components["pedestal-interaction"];
        const model = document.createElement("a-entity");
        model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
        pedestal.appendChild(model);
        model.setAttribute("scale", "70 70 70");
        model.setAttribute("position", {x: pedestalInteraction.pedestalTop.x + 73, y: pedestalInteraction.pedestalTop.y + 15, z: pedestalInteraction.pedestalTop.z + 13});
    }
}




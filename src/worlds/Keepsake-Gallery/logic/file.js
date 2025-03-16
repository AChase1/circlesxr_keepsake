class FileLogic {
    getFileFromSystem = function () {
        try {
            const s3Repository = new S3Repository();
            const basicLogic = new BasicLogic();

            const fileInput = document.createElement('input');
            fileInput.type = 'file';
            fileInput.display = 'none';
            document.body.appendChild(fileInput);

            fileInput.addEventListener('change', (event) => {
                const file = event.target.files[0];
                if (file) {
                    const timestamp = basicLogic.getCurrentTimestamp();
                    const artifact = new Artifact(file.name + timestamp, 1, "", "", [], [], file);
                    s3Repository.uploadToS3(artifact);
                }
            });
            fileInput.click();
        } catch (error) {
            console.error(error);
        }

    }

    loadObjectInScene(file) {
        const pedestal = document.getElementById("pedestal-3");
        const model = document.createElement("a-entity");
        model.setAttribute("gltf-model", `url(${URL.createObjectURL(file)})`);
        pedestal.appendChild(model);
        model.setAttribute("scale", "70 70 70");
        model.setAttribute("position", "74 18 13");
    }
}




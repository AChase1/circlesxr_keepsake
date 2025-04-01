AFRAME.registerComponent("load-artifacts", {

    init: async function () {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get("userEmail");

        const allS3Objects = await S3Logic.retrieveAllObjects();
        if (allS3Objects) {
            for (const object of allS3Objects) {
                if (object.Key.startsWith("file")) {
                    const artifact = await S3Logic.retrieveObject(object.Key);
                    if (artifact.userEmail == userEmail) {
                        console.log("current user already has artifact");
                        ArtifactLogic.fileDataToAFrame(artifact.file, artifact.pedestalId);
                    }
                }
            }
        }
    },

});
AFRAME.registerComponent("load-artifacts", {

    init: async function () {
        try {
            const userEmail = UserLogic.getCurrentGalleryEmail();

            const allS3Objects = await S3Logic.retrieveAllObjects();
            for (const object of allS3Objects) {
                if (object.Key.startsWith("file")) {
                    const objectJson = await S3Logic.retrieveObject(object.Key);
                    const artifact = Artifact.fromJson(objectJson);
                    if (artifact.userEmail === userEmail) {
                        console.log("loading " + artifact.userEmail + " artifact");
                        new ArtifactLogic().fileDataToAframe(artifact);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading artifacts: " + error);
        }

    },

});
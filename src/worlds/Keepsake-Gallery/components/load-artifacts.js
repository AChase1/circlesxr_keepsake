AFRAME.registerComponent("load-artifacts", {

    init: async function () {
        try{
            const urlParams = new URLSearchParams(window.location.search);
            const userEmail = urlParams.get("userEmail");

            const allS3Objects = await S3Logic.retrieveAllObjects();
            for (const object of allS3Objects) {
                if (object.Key.startsWith("file")) {
                    const artifact = await S3Logic.retrieveObject(object.Key);
                    console.log("url email: " + userEmail);
                    console.log("object email: " + artifact.userEmail);
                    if (artifact.userEmail == userEmail) {
                        console.log("loading " + artifact.userEmail + " artifact");
                        new ArtifactLogic().fileDataToAframe(artifact.file, artifact.pedestalId);
                    }
                }
            }
        } catch(error) {
            console.error("Error loading artifacts: " + error);
        }
        
    },

});
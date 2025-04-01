AFRAME.registerComponent("load-artifacts", {

    init: async function () {
        try{
            AllArtifacts.clearArtifacts();
            const urlParams = new URLSearchParams(window.location.search);
            const userEmail = urlParams.get("userEmail");

            const allS3Objects = await S3Logic.retrieveAllObjects();
            for (const object of allS3Objects) {
                if (object.Key.startsWith("file")) {
                    const artifact = await S3Logic.retrieveObject(object.Key);
                    if (artifact.userEmail == userEmail) {
                        console.log("loading " + artifact.userEmail + " artifact");
                        new ArtifactLogic().fileDataToAframe(artifact);
                    }
                }
            }
        } catch(error) {
            console.error("Error loading artifacts: " + error);
        }
        
    },

});
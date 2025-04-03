class UserLogic {
    static getCurrentUserEmail = () =>
        document.getElementById("Player1").getAttribute("circles-email");

    static getCurrentGalleryEmail = () => {
        const urlParams = new URLSearchParams(window.location.search);
        const userEmail = urlParams.get("userEmail");
        return userEmail;
    }


    static loadUserOrbs(objects) {
        const currUserEmail = this.getCurrentUserEmail();
        objects.forEach(object => {
            const objectMap = JSON.stringify(object);
            console.log("object.userEmail: " + objectMap);
            if (objectMap["userEmail"] == currUserEmail) return true;
        });
        return false;
    }

    static getArtifactsByUser(s3Objects, userEmail) {
        const artifactLogic = new ArtifactLogic();
        const objects = s3Objects.filter(object => object.userEmail == userEmail && object.file != "");
        if (objects.length >= 0 && objects.length <= 3) {
            objects.forEach(object => {
                const artifact = Artifact.fromJson(object);
                artifactLogic.fileDataToAframe(artifact.file, artifact.pedestalId);
            });
        }
    }
}
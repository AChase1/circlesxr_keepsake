class UserLogic {
    static getCurrentUserEmail() {
        const userData = document.getElementById("Player1").components["circles-email"];
        console.log(userData);
        return userData.email;
    }

    static doesCurrentUserHaveOrb(objects) {
        const currUserEmail = this.getCurrentUserEmail();
        objects.forEach(object => {
            if (object.userEmail == currUserEmail) return true;
        });
        return false;
    }

    static getArtifactsByUser(s3Objects, userEmail) {
        const artifactLogic = new ArtifactLogic();
        const objects = s3Objects.filter(object => object.userEmail == userEmail && object.file != "");
        if(objects.length >=0 && objects.length <= 3){
            objects.forEach(object => {
                const artifact = Artifact.fromJson(object);
                artifactLogic.fileDataToAframe(artifact.file, artifact.pedestalId);
            });
        }
    }
}
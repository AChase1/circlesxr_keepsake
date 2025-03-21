class UserLogic {
    static getCurrentUserEmail() {
        const userData = document.getElementById("Player1").components["circles-email"];
        console.log(userData);
        return userData.email;
    }

    static doesCurrentUserHaveOrb = async () => {
        try{
            const s3Logic = new S3Logic();
            const s3Objects = await s3Logic.retrieveAllObjects();
            const currUserEmail = this.getCurrentUserEmail();
            s3Objects.forEach(object => {
                if(object.userEmail == currUserEmail) return true;
            });
            return false;
        } catch (error) {
            console.error(error);
            return false;
        }
        
    }
}
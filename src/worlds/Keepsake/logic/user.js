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
}
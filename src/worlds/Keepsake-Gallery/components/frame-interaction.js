AFRAME.registerComponent('frame-interaction', {
    init: function () {
        const self = this;
        this.hasDisplayedObject = false;
        this.displayedObjectId = null;

        if (!self.el.classList.contains('interactive')) {
            self.el.classList.add('interactive');
        }

        this.el.addEventListener('click', () => {

            const currUserEmail = UserLogic.getCurrentUserEmail();
            const userEmail = UserLogic.getCurrentGalleryEmail();
            if (userEmail != currUserEmail) return;

            const uploadUI = document.querySelector('#upload-2D-ui');
            const manager = this.el.sceneEl;
            manager.emit('object-picked-up', { id: this.el.id }, true);
            uploadUI.style.display = 'block';
        });
    }
});
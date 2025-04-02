AFRAME.registerComponent('frame-interaction', {
    init: function () {
        const self = this;
        this.hasDisplayedObject = false;
        this.displayedObjectId = null;

        if (!self.el.classList.contains('interactive')) {
            self.el.classList.add('interactive');
        }

        this.el.addEventListener('click', () => {
            console.log('Frame clicked');
            const uploadUI = document.querySelector('#upload-2D-ui');
            const manager = this.el.sceneEl;
            uploadUI.style.display = 'block';
        });
    }
});
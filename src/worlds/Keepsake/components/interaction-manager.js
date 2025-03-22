// interaction manager - listens for entities being picked up/released globally
AFRAME.registerComponent('interaction-manager', {
    init: function () {
        const self = this;
        self.pickedUpObject = null;

        self.el.sceneEl.addEventListener('object-picked-up', (e) => {
            self.pickedUpObject = e.detail.id;
            console.log('interaction-manager: picked up:', self.pickedUpObject);
        });

        self.el.sceneEl.addEventListener('object-released', (e) => {
            self.pickedUpObject = null;
            console.log('interaction-manager: nothing in hand');
        });
    }
});
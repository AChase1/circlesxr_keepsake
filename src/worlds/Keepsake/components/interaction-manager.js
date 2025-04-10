// interaction manager - listens for entities being picked up/released globally
AFRAME.registerComponent('interaction-manager', {
    init: function () {
        const self = this;
        self.pickedUpObject = null;
        self.socket = null;

        self.createNetworkingSystem = function () {
            self.socket = CIRCLES.getCirclesWebsocket();

            self.socket.on(CIRCLES.EVENTS.SEND_DATA_SYNC, function (data) {
                console.log("Received data sync:");
                const scene = document.querySelector("a-scene");

                const orbs = scene.components["orbs"];
                if (orbs) {
                    orbs.loadUserOrbs();
                }
                const galleryManager = scene.components["load-gallery"];
                if (galleryManager && data.galleryEmail === UserLogic.getCurrentGalleryEmail()) {
                    galleryManager.loadGallery();
                }

            });

            self.socket.onAny((event, data) => {
                console.log(`Event received: ${event}`, data);
            });
        }

        if (CIRCLES.isCirclesWebsocketReady()) {
            self.createNetworkingSystem();
        }
        else {
            const wsReadyFunc = function () {
                self.createNetworkingSystem();
                self.el.sceneEl.removeEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
            };
            self.el.sceneEl.addEventListener(CIRCLES.EVENTS.WS_CONNECTED, wsReadyFunc);
        }



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
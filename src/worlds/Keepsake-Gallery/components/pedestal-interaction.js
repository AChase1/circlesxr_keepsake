AFRAME.registerComponent('pedestal-interaction', {
    init: function () {
        const self = this;
        this.hasDisplayedObject = false;
        this.displayedObjectId = null;
        this.pedestalTop = new THREE.Vector3();

        if (!self.el.classList.contains('interactive')) {
            self.el.classList.add('interactive');
        }

        // calc top center of pedestal
        this.updatePedestalPosition = () => {
            this.el.object3D.getWorldPosition(this.pedestalTop);
            this.pedestalTop.y += 1.5; // adjustable based on height
        };

        this.el.addEventListener('click', () => {
            console.log('Pedestal clicked');
            const manager = this.el.sceneEl.components['interaction-manager'];
            manager.emit('object-picked-up', { id: this.el.id }, true);
            uploadUI.style.display = 'block';

            //     const manager = this.el.sceneEl.components['interaction-manager'];
            //     console.log(manager);
            //     const heldId = manager.pickedUpObject;
            //     console.log('Currently held object ID:', heldId);

            //     const breadEntity = document.querySelector('#bread');
            //     const uploadUI = document.querySelector('#upload-ui');

            //     // log bread in console
            //     console.log('Bread entity found:', !!breadEntity);
            //     if (breadEntity) {
            //         console.log('Bread pickup component:', !!breadEntity.components['circles-pickup-object']);
            //         if (breadEntity.components['circles-pickup-object']) {
            //             console.log('Bread pickedUp state:', breadEntity.components['circles-pickup-object'].pickedUp);
            //         }
            //     }

            //     this.updatePedestalPosition();

            //     // when clicked show upload UI if nothing is displayed or held
            //     if (uploadUI && !this.hasDisplayedObject && !heldId) {
            //         console.log('Showing Upload UI');
            //         uploadUI.style.display = 'block';
            //     }

            //     // place bread
            //     if (heldId === 'bread' && !this.hasDisplayedObject) {
            //         console.log('placing bread on pedestal...');
            //         this.hasDisplayedObject = true;
            //         this.displayedObjectId = 'bread';

            //         // detach bread from camera to place in scene
            //         breadEntity.sceneEl.object3D.attach(breadEntity.object3D);

            //         // setting bread world position to top of pedestal
            //         breadEntity.setAttribute('position', {
            //             x: this.pedestalTop.x,
            //             y: this.pedestalTop.y,
            //             z: this.pedestalTop.z
            //         });
            //         breadEntity.setAttribute('rotation', '0 0 0');
            //         breadEntity.setAttribute('scale', '1.5 1.5 1.5');
            //         breadEntity.setAttribute('visible', true);

            //         // update pickup state - using circles-pickup-object instead of pickupable
            //         breadEntity.components['circles-pickup-object'].pickedUp = false;
            //         manager.pickedUpObject = null;

            //         console.log('Bread placed at position:', breadEntity.getAttribute('position'));
            //     }
            //     // handle picking up bread from pedestal
            //     else if (this.hasDisplayedObject && !manager.pickedUpObject && this.displayedObjectId === 'bread') {
            //         console.log('retrieving bread from pedestal');
            //         this.hasDisplayedObject = false;
            //         this.displayedObjectId = null;

            //         const camera = document.querySelector('#camera');

            //         // attach bread to camera for pickup
            //         camera.object3D.attach(breadEntity.object3D);

            //         // update pos relative to camera
            //         breadEntity.setAttribute('position', {
            //             x: 0,
            //             y: -0.5, // slightly below
            //             z: -1    // infront
            //         });

            //         // update pickup state - using circles-pickup-object instead of pickupable
            //         breadEntity.components['circles-pickup-object'].pickedUp = true;
            //         manager.pickedUpObject = 'bread';
            //     }
        });

        // // initial position update
        this.updatePedestalPosition();
    }
});
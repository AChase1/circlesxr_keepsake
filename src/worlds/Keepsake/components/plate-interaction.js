// orb placement and gallery naming
AFRAME.registerComponent("plate-interaction", {
    init: function () {
        const self = this;
        self.hasObject = false;
        self.placedObjectId = null;
        self.objectsLabeled = {}; // track labelled objs

        if (!self.el.classList.contains("interactive")) {
            self.el.classList.add("interactive");
        }

        self.plateTopPosition = new THREE.Vector3();
        self.updatePlatePosition = () => {
            self.el.object3D.getWorldPosition(self.plateTopPosition);
            self.plateTopPosition.y +=
                (self.el.getAttribute("height") || 0.1) / 2 + 0.05;
        };

        self.el.addEventListener("click", () => {
            console.log("Plate clicked");
            this.deselectAllOtherPlates();
            const manager = self.el.sceneEl.components["interaction-manager"];
            const heldObjectId = manager.pickedUpObject;

            console.log("Manager reports held object:", heldObjectId);

            // If nothing held, do nothing
            if (!heldObjectId) {
                console.log("Nothing in hand to place");
                return;
            }

            const heldObject = document.getElementById(heldObjectId);
            if (!heldObject) {
                console.log("Could not find object with ID:", heldObjectId);
                return;
            }

            self.updatePlatePosition();

            console.log("Placing object on plate:", heldObjectId);
            self.placedObjectId = heldObjectId;
            self.hasObject = true;

            // detach from player and place on plate
            heldObject.sceneEl.object3D.attach(heldObject.object3D);

            // set pos on plate
            heldObject.setAttribute("position", {
                x: self.plateTopPosition.x,
                y: self.plateTopPosition.y + 0.5,
                z: self.plateTopPosition.z,
            });

            heldObject.setAttribute("rotation", "0 0 0");

            if (heldObject.components["pickupable"]) {
                heldObject.components["pickupable"].pickedUp = false;
            }

            manager.pickedUpObject = null;

            // only show labelling if there isn't a label
            if (!self.objectsLabeled[heldObjectId]) {
                const labelUI = document.querySelector("#label-ui");
                if (labelUI) {
                    labelUI.style.display = "block";

                    labelUI.dataset.objectId = heldObjectId;

                    const labelInput = document.querySelector("#label-input");
                    if (labelInput) {
                        labelInput.value = "";
                        setTimeout(() => labelInput.focus(), 100);
                    }
                } else {
                    window.location.href = "gallery.html";
                }
            }
        });

        self.updatePlatePosition();
    },

    deselectAllOtherPlates: function () {
        const plates = document.querySelectorAll("[plate-interaction]");
        plates.forEach((plate) => {
            if (plate !== this.el) {
                const plateInteraction = plate.components["plate-interaction"];
                if (plateInteraction.hasObject) {
                    const manager = this.el.sceneEl.components["interaction-manager"];
                    manager.pickedUpObject = plateInteraction.placedObjectId;

                    plateInteraction.hasObject = false;
                    plateInteraction.placedObjectId = null;
                }
            }
        });
    }
});
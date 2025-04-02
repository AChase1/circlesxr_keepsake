// custom pick up
AFRAME.registerComponent("pickupable", {
    init: function () {
        var self = this;
        self.player = document.querySelector("#camera");
        self.pickedUp = false;
        self.clickDebounce = false; // click debounce

        self.playerHolder = CIRCLES.getAvatarHolderElementBody();
        self.origParent = self.el.parentNode;

        if (!self.el.classList.contains("interactive")) {
            self.el.classList.add("interactive");
        }

        // event handler to stop default Circles control
        self.suppressControlsFunc = function (e) {
            // stop circles object-pickup UI from showing
            e.stopPropagation();
            // preventing default behaviours
            e.preventDefault();
            return false;
        };

        // debounce
        self.handleClick = function (e) {
            if (self.clickDebounce) return;

            self.clickDebounce = true;
            setTimeout(function () {
                self.clickDebounce = false;
            }, 300); // 300ms debounce

            console.log(
                "clicked on object, current state:",
                self.pickedUp ? "picked up" : "not picked up"
            );

            if (self.pickedUp === true) {
                // release obj
                self.origParent.object3D.attach(self.el.object3D);
                console.log("released");
                self.pickedUp = false;

                self.el.emit("object-released", { id: self.el.id }, true);
                self.el.sceneEl.emit(
                    "object-released",
                    { id: self.el.id },
                    false
                );
            } else {
                // pick up obj
                self.playerHolder.object3D.attach(self.el.object3D);

                // position in front of camera
                self.el.setAttribute("position", {
                    x: 0.7,
                    y: -0.4, // slightly below center of view
                    z: 0.7, // closer to camera so it appears in hand
                });

                self.el.setAttribute("rotation", {
                    x: 0,
                    y: 0,
                    z: 0,
                });

                console.log("picked up");
                self.pickedUp = true;
                self.el.emit("object-picked-up", { id: self.el.id }, true);
                self.el.sceneEl.emit(
                    "object-picked-up",
                    { id: self.el.id },
                    false
                );
            }
        };

        self.el.addEventListener("click", self.handleClick);

        // is obj picked up
        self.isPickedUp = function () {
            return self.pickedUp;
        };
    },

    remove: function () {
        this.el.removeEventListener("click", this.handleClick);
    },
});
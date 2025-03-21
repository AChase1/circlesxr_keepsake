AFRAME.registerComponent("user-orbs", {

    init: async function () {
        const s3Logic = new S3Logic();
        const allObjects = await s3Logic.retrieveAllObjects();
        this.checkOrbForUser(allObjects);

    },

    loadAllOrbs: function (objects) {
        const orbs = [];
        objects.forEach((object) => {
            const isOrb = object.file == "";
            if (isOrb) {
                const orb = Orb.fromJson(object);
                orbs.push(orb);
            }
        });
        orbs.forEach((orb) => {

        });
    },

    checkOrbForUser: function (objects) {
        const hasOrb = userLogic.doesCurrentUserHaveOrb(allObjects);
        if (hasOrb) {
            console.log("User has orb");
            // TODO => UI / Interaction for user with orb
        } else {
            console.log("User does not have orb");
            this.createStartOrb();
        }
    },

    createCirclesPortal: function (labelText) {
        const portal = document.createElement("a-entity");
        portal.setAttribute("object-label", { text: labelText });
        portal.setAttribute("circles-portal", {
            title_text: labelText,
            link_url:
                "/w/Keepsake-Gallery?galleryName=" +
                encodeURIComponent(labelText),
        });

        if (object.components.pickupable) {
            object.removeAttribute("pickupable");
            console.log(`Disabled pickupable on ${objectId}`);
        }

        const plate = document.querySelector("[plate-interaction]");
        if (plate && plate.components["plate-interaction"]) {
            plate.components["plate-interaction"].objectsLabeled[
                objectId
            ] = true;
        }
    },

    createStartOrb: function () {
        const orb = document.createElement("a-sphere");
        orb.setAttribute("id", "pickupSphere");
        orb.setAttribute("position", "-3 1.5 -3");
        orb.setAttribute("radius", 0.2);
        orb.setAttribute("material", "color: #3498db; metalness: 0.7; roughness: 0.3");
        orb.setAttribute("circles-interactive-object", "");
        orb.setAttribute("pickupable", "");
        orb.setAttribute("object-label", "text: ; yOffset: 0.6");
        this.el.appendChild(orb);
    }

});
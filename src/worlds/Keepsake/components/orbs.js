AFRAME.registerComponent("orbs", {

    init: async function () {
        const s3Logic = new S3Logic();
        const allObjects = await s3Logic.retrieveAllObjects();
        this.checkCurrUserOrb(allObjects);
        this.loadAllOrbs(allObjects);
    },

    loadAllOrbs: function (objects) {
        objects.forEach((object) => {
            const isOrb = object.file == "";
            if (isOrb) {
                const orb = Orb.fromJson(object);
                this.createCirclesPortal(orb);
            }
        });
        
    },

    createCirclesPortal: function (orb, portal) {
        portal.setAttribute("object-label", { text: orb.name });
        portal.setAttribute("circles-portal", {
            title_text: orb.name,
            link_url:
                "/w/Keepsake-Gallery?userEmail=" +
                encodeURIComponent(orb.userEmail) + "&galleryName=" + encodeURIComponent(orb.name),
        });
        portal.setAttribute("position", orb.position);
        
        this.el.appendChild(portal);

        if (portal.components.pickupable) {
            object.removeAttribute("pickupable");
            console.log(`Disabled pickupable on ${objectId}`);
        }

        this.assignToPlate(portal);
    },

    assignToPlate: function (object) {
        const plate = document.querySelector("[plate-interaction]");
        if (plate && plate.components["plate-interaction"]) {
            plate.components["plate-interaction"].objectsLabeled[
                object.id
            ] = true;
        }
    },

    checkCurrUserOrb: function (objects) {
        const userLogic = new UserLogic();
        const hasOrb = userLogic.doesCurrentUserHaveOrb(objects);
        if (hasOrb) {
            console.log("User has orb");
            // TODO => UI / Interactions for user with orb
        } else {
            console.log("User does not have orb");
            this.createStartOrb();
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
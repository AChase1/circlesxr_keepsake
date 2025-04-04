AFRAME.registerComponent("orbs", {

    init: async function () {
        this.loadUserOrbs();
    },

    loadUserOrbs: async function () {
        let doesCurrUserHaveOrb = false;
        const allS3Objects = await S3Logic.retrieveAllObjects();
        if (allS3Objects) {
            for (const object of allS3Objects) {
                if (object.Key.startsWith("orb")) {
                    const s3Object = await S3Logic.retrieveObject(object.Key);
                    const orb = Orb.fromJson(s3Object);
                    if (orb.userEmail == UserLogic.getCurrentUserEmail()) {
                        console.log("current user already has orb");
                        doesCurrUserHaveOrb = true;
                    }
                    this.createCirclesPortal(orb);
                }
            }
        }

        if (!doesCurrUserHaveOrb) {
            console.log("current user does not have orb");
            this.createStartOrb();
        }
    },

    getOrbTheme: function (orb) {
        console.log("orb: " + JSON.stringify(orb));
        const pedestal = document.getElementById(orb.plateId);
        const theme = pedestal.getAttribute("class");
        switch (theme) {
            case "minimal interactive":
                return "minimal";
            case "playground interactive":
                return "playground";
            case "liminal interactive":
                return "liminal";
            case "nature interactive":
                return "nature";
            default:
                return "minimal";
        }

    },

    createCirclesPortal: function (orb) {
        const orbTheme = this.getOrbTheme(orb);
        const portalEl = document.createElement("a-entity");
        portalEl.setAttribute("object-label", { text: orb.name });
        portalEl.setAttribute("circles-portal", {
            title_text: orb.name,
            link_url:
                `/w/Keepsake-Gallery?galleryName=${encodeURIComponent(orb.name)}&userEmail=${encodeURIComponent(orb.userEmail)}&galleryTheme=${encodeURIComponent(orbTheme)}`,
        });

        this.el.appendChild(portalEl);

        if (portalEl.components.pickupable) {
            portalEl.removeAttribute("pickupable");
            console.log(`Disabled pickupable on ${portalEl.getAttribute("id")}`);
        }

        this.assignToPlate(portalEl, orb.plateId);

        var orbPortalSound = document.querySelectorAll('.orbPortal');
        orbPortalSound.forEach(function(soundEntity){
            soundEntity.components.sound.stopSound();
            soundEntity.components.sound.playSound();
        });
    },

    assignToPlate: function (portal, plateId) {
        const plate = document.getElementById(plateId);
        if (!plate) {
            console.error(`Plate with ID ${plateId} not found`);
            return;
        }
        plate.components["plate-interaction"].objectsLabeled[portal.getAttribute("id")] = true;
        const globalPlatePos = plate.object3D.getWorldPosition(new THREE.Vector3());
        portal.setAttribute("position", {
            x: globalPlatePos.x,
            y: globalPlatePos.y + 0.5,
            z: globalPlatePos.z,
        });
    },

    checkCurrUserOrb: function (objects) {
        const hasOrb = UserLogic.doesCurrentUserHaveOrb(objects);
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
        orb.setAttribute("orb-sounds", "");
        this.el.appendChild(orb);
    }

});

orbPickedUp = false;
clickCount = 0;

AFRAME.registerComponent("orb-sounds", {
    init: function() {
        const CONTEXT_AF = this;
        CONTEXT_AF.orbPickupSound = document.querySelectorAll('.orbPickup');
        CONTEXT_AF.orbSetDownSound = document.querySelectorAll('.orbSetDown');
        CONTEXT_AF.orbHoverSound = document.querySelectorAll('.orbHover');

        CONTEXT_AF.el.addEventListener('mouseenter', function(e){
            CONTEXT_AF.orbHoverSound.forEach(function(soundEntity){
                soundEntity.components.sound.playSound();
            });
        });
        CONTEXT_AF.el.addEventListener('mouseleave', function(e){
            CONTEXT_AF.orbHoverSound.forEach(function(soundEntity){
                soundEntity.components.sound.stopSound();
            });
        });

        CONTEXT_AF.el.addEventListener('click', function(e){

            if (!orbPickedUp){
                CONTEXT_AF.orbPickupSound.forEach(function(soundEntity){
                    soundEntity.components.sound.stopSound();
                    soundEntity.components.sound.playSound();
                });
                clickCount ++;
                if(clickCount == 2){
                    orbPickedUp = true;
                    clickCount = 0;
                }
            }else{
                CONTEXT_AF.orbSetDownSound.forEach(function(soundEntity){
                    soundEntity.components.sound.stopSound();
                    soundEntity.components.sound.playSound();
                });
                clickCount ++;
                if(clickCount == 2){
                    orbPickedUp = false;
                    clickCount = 0;
                }
            }

        });
    }
});
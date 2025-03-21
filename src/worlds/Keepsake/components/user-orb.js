AFRAME.registerComponent("user-orb", {  

    init: async function () {
        const userLogic = new UserLogic();
        const hasOrb = await userLogic.doesCurrentUserHaveOrb();
        if(hasOrb){
            console.log("User has orb");
            // TODO => UI / Interaction for user with orb
        } else {
            console.log("User does not have orb");
            this.createOrbGeomety();
        }
    },

    createOrbGeomety: function () {
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
// gallery name handler
AFRAME.registerComponent("gallery-name-display", {
    init: function () {
        // parse URL parameters when the scene loads
        const urlParams = new URLSearchParams(window.location.search);
        const galleryName = urlParams.get("galleryName");

        if (galleryName) {
            console.log("Gallery name from URL:", galleryName);
            this.createGalleryTitle(galleryName);
        } else {
            console.log("No gallery name provided in URL");
            this.createGalleryTitle("Untitled Gallery");
        }
    },

    createGalleryTitle: function (galleryName) {
        // create a title entity for the gallery
        const titleEntity = document.createElement("a-entity");
        titleEntity.setAttribute("text", {
            value: galleryName,
            color: "#000000",
            align: "center",
            width: 10,
            wrapCount: 30,
            anchor: "center",
        });

        // position the title above the entrance
        titleEntity.setAttribute("position", "0 3 5.5");
        titleEntity.setAttribute("rotation", "0 180 0");

        // add to the scene
        this.el.sceneEl.appendChild(titleEntity);
    },
});
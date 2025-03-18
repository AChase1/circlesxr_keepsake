// Gallery Naming
AFRAME.registerComponent("object-label", {
    schema: {
        text: { type: "string", default: "" },
        color: { type: "color", default: "#FFF" },
        size: { type: "number", default: 1.0 },
        yOffset: { type: "number", default: 0.3 }, // distance above object
    },

    init: function () {
        this.createLabel();
    },

    update: function () {
        this.createLabel();
    },

    createLabel: function () {
        // remove existing label if any
        if (this.labelEntity) {
            this.el.removeChild(this.labelEntity);
        }

        if (!this.data.text) return;

        // create label entity
        this.labelEntity = document.createElement("a-entity");
        this.labelEntity.setAttribute("text", {
            value: this.data.text,
            color: this.data.color,
            width: 2,
            align: "center",
            anchor: "center",
        });

        // position above obj
        this.labelEntity.setAttribute("position", `0 ${this.data.yOffset} 0`);

        // make label always face camera
        this.labelEntity.setAttribute("look-at", "#camera");

        // add to parent entity
        this.el.appendChild(this.labelEntity);
    },
});

// label creation
document.addEventListener("DOMContentLoaded", function () {
    // setup label submission
    const submitLabel = function () {
        const labelUI = document.querySelector("#label-ui");
        const labelInput = document.querySelector("#label-input");

        if (!labelUI || !labelInput) return;

        const objectId = labelUI.dataset.objectId;
        const labelText = labelInput.value.trim();

        if (objectId && labelText) {
            // get obj and add label
            const object = document.getElementById(objectId);
            if (object) {
                // add the label text to the object
                object.setAttribute("object-label", { text: labelText });
                console.log(`Set label "${labelText}" on object ${objectId}`);

                // add circles-portal attribute with the label text
                // include the gallery name as a URL parameter
                object.setAttribute("circles-portal", {
                    title_text: labelText,
                    link_url:
                        "/w/Keepsake-Gallery?galleryName=" +
                        encodeURIComponent(labelText),
                });

                // disable the pickupable component so it can't be picked up again
                if (object.components.pickupable) {
                    object.removeAttribute("pickupable");
                    console.log(`Disabled pickupable on ${objectId}`);
                }

                // mark this object as labeled
                const plate = document.querySelector("[plate-interaction]");
                if (plate && plate.components["plate-interaction"]) {
                    plate.components["plate-interaction"].objectsLabeled[
                        objectId
                    ] = true;
                }
            }
        }

        // hide ui
        labelUI.style.display = "none";
    };

    // submit label
    const submitButton = document.querySelector("#submit-label");
    if (submitButton) {
        submitButton.addEventListener("click", submitLabel);
    }

    // cancel label
    const cancelButton = document.querySelector("#cancel-label");
    if (cancelButton) {
        cancelButton.addEventListener("click", function () {
            // hide gallery naming
            document.querySelector("#label-ui").style.display = "none";
        });
    }

    // enter label
    const labelInput = document.querySelector("#label-input");
    if (labelInput) {
        labelInput.addEventListener("keyup", function (event) {
            if (event.key === "Enter") {
                submitLabel();
            }
        });
    }

    // upload btn
    const uploadBtn = document.getElementById("upload-btn");
    if (uploadBtn) {
        uploadBtn.addEventListener("click", function () {
            // opens files on click
            document.getElementById("file-input").click();
        });
    }

    const closeBtn = document.getElementById("close-btn");
    if (closeBtn) {
        closeBtn.addEventListener("click", function () {
            document.getElementById("upload-ui").style.display = "none";
        });
    }
});
// Gallery Theme Selector

AFRAME.registerComponent("gallery-theme", {
    init: function () {
        const CONTEXT_AF = this;

        // parse URL parameters when the scene loads
        const urlParams = new URLSearchParams(window.location.search);
        const galleryTheme = urlParams.get("galleryTheme");

        if (galleryTheme) {
            console.log("Gallery Theme from URL:", galleryTheme);

            if (galleryTheme === "minimal"){
                minimalModels = document.querySelectorAll('.minimal-room');
                document.querySelector('#minimal-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#minimal-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#minimal-pedestal-3').setAttribute("visible", "true");

                // SOURCE: https://www.w3schools.com/jsref/met_document_queryselectorall.asp
                for (let i = 0; i < minimalModels.length; i++) {
                    minimalModels[i].setAttribute("visible", "true");
                  }

            }else if(galleryTheme === "playground"){
                playgroundModels = document.querySelectorAll('.playground-room');
                document.querySelector('#playground-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#playground-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#playground-pedestal-3').setAttribute("visible", "true");

                for (let i = 0; i < playgroundModels.length; i++) {
                    playgroundModels[i].setAttribute("visible", "true");
                  }

            }else if(galleryTheme === "liminal"){
                liminalModels = document.querySelectorAll('.limimal-room');
                document.querySelector('#liminal-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#liminal-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#liminal-pedestal-3').setAttribute("visible", "true");

                for (let i = 0; i < liminalModels.length; i++) {
                    liminalModels[i].setAttribute("visible", "true");
                  }
                
            }else if(galleryTheme === "nature"){
                natureModels = document.querySelectorAll('.nature-room');
                document.querySelector('#nature-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#nature-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#nature-pedestal-3').setAttribute("visible", "true");

                for (let i = 0; i < natureModels.length; i++) {
                    natureModels[i].setAttribute("visible", "true");
                  }
            }

        } else {
            console.log("No Theme Error");
        }
    },
});
// Gallery Theme Selector

AFRAME.registerComponent("gallery-theme", {
    init: function () {
        const CONTEXT_AF = this;

        // parse URL parameters when the scene loads
        const urlParams = new URLSearchParams(window.location.search);
        const galleryTheme = urlParams.get("galleryTheme");

        CONTEXT_AF.minimalAmbience = document.querySelectorAll('.minimalAmbience');
        CONTEXT_AF.playgroundMusic = document.querySelectorAll('.playgroundMusic');
        CONTEXT_AF.liminalAmbience = document.querySelectorAll('.liminalAmbience');
        CONTEXT_AF.natureAmbience = document.querySelectorAll('.natureAmbience');

        if (galleryTheme) {
            console.log("Gallery Theme from URL:", galleryTheme);

            if (galleryTheme === "minimal"){
                minimalModels = document.querySelectorAll('.minimal-room');
                document.querySelector('#minimal-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#minimal-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#minimal-pedestal-3').setAttribute("visible", "true");
                document.querySelector('#minimal-frame-1').setAttribute("visible", "true");
                document.querySelector('#minimal-frame-2').setAttribute("visible", "true");
                document.querySelector('#minimal-frame-3').setAttribute("visible", "true");

                // SOURCE: https://www.w3schools.com/jsref/met_document_queryselectorall.asp
                for (let i = 0; i < minimalModels.length; i++) {
                    minimalModels[i].setAttribute("visible", "true");
                  }

                CONTEXT_AF.minimalAmbience.forEach(function(soundEntity){
                    soundEntity.components.sound.playSound();
                });

            }else if(galleryTheme === "playground"){
                  playgroundModels = document.querySelectorAll('.playground-room');
                  document.querySelector('#playground-pedestal-1').setAttribute("visible", "true");
                  document.querySelector('#playground-pedestal-2').setAttribute("visible", "true");
                  document.querySelector('#playground-pedestal-3').setAttribute("visible", "true");
                  document.querySelector('#playground-frame-1').setAttribute("visible", "true");
                  document.querySelector('#playground-frame-2').setAttribute("visible", "true");
                  document.querySelector('#playground-frame-3').setAttribute("visible", "true");

                  for (let i = 0; i < playgroundModels.length; i++) {
                      playgroundModels[i].setAttribute("visible", "true");
                    }
                document.querySelector('#gallery-navmesh').setAttribute("position", {x: -15, y:0, z:0});

                CONTEXT_AF.playgroundMusic.forEach(function(soundEntity){
                    soundEntity.components.sound.playSound();
                });

            }else if(galleryTheme === "liminal"){
                liminalModels = document.querySelectorAll('.limimal-room');
                document.querySelector('#liminal-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#liminal-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#liminal-pedestal-3').setAttribute("visible", "true");
                document.querySelector('#liminal-frame-1').setAttribute("visible", "true");
                document.querySelector('#liminal-frame-2').setAttribute("visible", "true");
                document.querySelector('#liminal-frame-3').setAttribute("visible", "true");

                for (let i = 0; i < liminalModels.length; i++) {
                    liminalModels[i].setAttribute("visible", "true");
                  }
                document.querySelector('#gallery-navmesh').setAttribute("position", {x: 0, y:0, z:-15});

                CONTEXT_AF.liminalAmbience.forEach(function(soundEntity){
                    soundEntity.components.sound.playSound();
                });
                
            }else if(galleryTheme === "nature"){
                natureModels = document.querySelectorAll('.nature-room');
                document.querySelector('#nature-pedestal-1').setAttribute("visible", "true");
                document.querySelector('#nature-pedestal-2').setAttribute("visible", "true");
                document.querySelector('#nature-pedestal-3').setAttribute("visible", "true");
                document.querySelector('#nature-frame-1').setAttribute("visible", "true");
                document.querySelector('#nature-frame-2').setAttribute("visible", "true");
                document.querySelector('#nature-frame-3').setAttribute("visible", "true");

                for (let i = 0; i < natureModels.length; i++) {
                    natureModels[i].setAttribute("visible", "true");
                  }
                document.querySelector('#gallery-navmesh').setAttribute("position", {x: -15, y:0, z:-15});
                
                CONTEXT_AF.natureAmbience.forEach(function(soundEntity){
                    soundEntity.components.sound.playSound();
                });
            }

        } else {
            console.log("No Theme Error");
        }
    },
});
// Lobby Tutorial Instructions

tutorialCount = 0;

AFRAME.registerComponent('tutorial', {
    init: function() {
        const CONTEXT_AF = this;
        CONTEXT_AF.instructionsText = document.querySelector('#instructions');

        CONTEXT_AF.el.addEventListener('click', function(e){
            console.log(tutorialCount);

            // Conditional Statement to swtich text
            // Aframe sometimes counts clicks twice, so switch the text every ""two"" clicks
            if(tutorialCount < 2){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "1. First, click on the Orb Portal on the desk to pick it up.\n\nThis will be your personal portal to your personal gallery."}); 
                tutorialCount++;
            }else if(tutorialCount >= 2 && tutorialCount < 4){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "2. Carry your Orb to one of the four themed rooms.\n\nClick on one of the red plates to select a theme and place your Orb on the shelf."}); 
                tutorialCount++;
            }else if(tutorialCount >= 4 && tutorialCount < 6){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "3. Name your Orb and click \"Submit.\"\n\nTo enter your gallery, simply click on your Orb!"}); 
                tutorialCount++;
            }else if(tutorialCount >= 6 && tutorialCount < 8){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "4. In your gallery, you can click on the pedestals and frames to upload 3D models and 2D artwork.\n\nRead the pop-ups for more information."}); 
                tutorialCount++;
            }else if(tutorialCount >= 8 && tutorialCount < 10){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "5. You can return to the Lobby by clicking the \"Exit\" orb in the corner of your gallery."}); 
                tutorialCount++;
            }else if(tutorialCount >= 10 && tutorialCount < 12){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "6. Finally, visit other people’s galleries by clicking on their Orbs!\n\nClick on their pedestals and frames to leave comments or Emojis on their work."}); 
                tutorialCount++;
            }else if(tutorialCount >= 12 && tutorialCount < 14){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "Enjoy your visit! Click here again to restart the Tutorial."}); 
                tutorialCount++;
            }else if(tutorialCount >= 14 && tutorialCount < 16){
                CONTEXT_AF.instructionsText.setAttribute("text", {value: "Welcome to Keepsake! The future of memory preservation in virtual reality.\n\nIf this is your first visit, click here for a tutorial."}); 
                tutorialCount = 0;
            }
        });
    }
});

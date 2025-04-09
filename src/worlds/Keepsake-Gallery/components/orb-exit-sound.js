AFRAME.registerComponent("orb-exit-sound", {
    init: function() {
        const CONTEXT_AF = this;
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
    }
});
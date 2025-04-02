// Select a Theme for the User's Gallery

selectedTheme = "null";

AFRAME.registerComponent('theme-select', {
    init: function() {
        const CONTEXT_AF = this;
        //CONTEXT_AF.minimal = document.querySelectorAll('.minimal interactive');

        CONTEXT_AF.el.addEventListener('click', function(e){
            if (CONTEXT_AF.el.getAttribute('class') == "minimal interactive"){
                if(selectedTheme === "null"){
                    selectedTheme = "minimal";
                }
            }else if(CONTEXT_AF.el.getAttribute('class') == "playground interactive"){
                if(selectedTheme === "null"){
                    selectedTheme = "playground";
                }
            }else if(CONTEXT_AF.el.getAttribute('class') == "liminal interactive"){
                if(selectedTheme === "null"){
                    selectedTheme = "liminal";
                }
            }else if(CONTEXT_AF.el.getAttribute('class') == "nature interactive"){
                if(selectedTheme === "null"){
                    selectedTheme = "nature";
                }
            }
        });
    }
});
const VRLoadingManager = {
    inVR: false,
    vrModeAvailable: !!navigator.xr,
    
    init: function() {
      var self = this;
      const scene = document.querySelector('a-scene');
      
      if (!scene) {
        console.error('A-Frame scene not found');
        return;
      }
      
      // detecting vr mode
      window.addEventListener('enter-vr', function() {
        self.inVR = true;
        console.log('VRLoadingManager: Entered VR mode');
      });
      
      window.addEventListener('exit-vr', function() {
        self.inVR = false;
        console.log('VRLoadingManager: Exited VR mode');
      });
      
      // creating loading container
      if (!document.getElementById('vr-loading-indicator')) {
        const vrLoadingIndicator = document.createElement('a-entity');
        vrLoadingIndicator.id = 'vr-loading-indicator';
        vrLoadingIndicator.setAttribute('position', '0 1.6 -2');
        vrLoadingIndicator.setAttribute('scale', '0 0 0');
 
        const backgroundPlane = document.createElement('a-plane');
        backgroundPlane.setAttribute('color', '#000');
        backgroundPlane.setAttribute('opacity', '0.7');
        backgroundPlane.setAttribute('height', '1.2');
        backgroundPlane.setAttribute('width', '1.5');
        
        const gifPlane = document.createElement('a-plane');
        gifPlane.setAttribute('src', 'Keepsake/assets/images/loading_anim.gif');
        gifPlane.setAttribute('height', '0.6');
        gifPlane.setAttribute('width', '0.6');
        gifPlane.setAttribute('position', '0 0.1 0.01');
        gifPlane.setAttribute('transparent', 'true');

        const loadingText = document.createElement('a-text');
        loadingText.setAttribute('value', 'Loading Artefacts...');
        loadingText.setAttribute('color', 'white');
        loadingText.setAttribute('align', 'center');
        loadingText.setAttribute('position', '0 -0.4 0.01');
        loadingText.setAttribute('width', '1.2');

        vrLoadingIndicator.appendChild(backgroundPlane);
        vrLoadingIndicator.appendChild(gifPlane);
        vrLoadingIndicator.appendChild(loadingText);
        scene.appendChild(vrLoadingIndicator);
      }
      
      console.log('VRLoadingManager initialized. VR available:', this.vrModeAvailable);
    },
    
    showLoading: function() {
      if (this.inVR) {
        const vrLoadingIndicator = document.getElementById('vr-loading-indicator');
        if (vrLoadingIndicator) {
          vrLoadingIndicator.setAttribute('scale', '1 1 1');
        }
      }
    },
    
    hideLoading: function() {
      if (this.inVR) {
        const vrLoadingIndicator = document.getElementById('vr-loading-indicator');
        if (vrLoadingIndicator) {
          vrLoadingIndicator.setAttribute('scale', '0 0 0');
        }
      }
    }
  };
  
  window.VRLoadingManager = VRLoadingManager;
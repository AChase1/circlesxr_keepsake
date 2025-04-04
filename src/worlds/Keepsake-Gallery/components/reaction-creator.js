AFRAME.registerComponent('reaction-creator', {
    schema: {
       // reaction type: 'heart', 'laugh', etc
      type: {type: 'string', default: 'heart'}
    },
    
    init: function () {
      var self = this;
      
      if (!localStorage.getItem('galleryReactions')) {
        localStorage.setItem('galleryReactions', JSON.stringify([]));
      }
      
      // tracking last time clicked for TC
      this.lastClickTime = 0;
      
      this.clickHandler = function(event) {
        // debounce
        var now = Date.now();
        if (now - self.lastClickTime < 500) {
          console.log('Ignoring click - too soon after last click');
          return;
        }
        
        self.lastClickTime = now;
        event.stopPropagation();
        event.preventDefault();
        
        console.log('Creating reaction:', self.data.type);
        self.createReaction();
      };
      
      self.el.addEventListener('click', this.clickHandler);

      self.loadSavedReactions();
      
      console.log('Reaction creator init for:', self.data.type);
    },
    
    createReaction: function() {
      var self = this;
      var reactionType = self.data.type;
      
      // creating a reaction & assigning an ID
      var reactionId = reactionType + '-' + Date.now();
      var reactionEntity = document.createElement('a-entity');
      reactionEntity.setAttribute('id', reactionId);
      
      reactionEntity.setAttribute('data-reaction-type', reactionType);
      
      var boxPosition = self.el.getAttribute('position');
      
      // pos the generated reaction above box
      var reactionPosition = {
        x: boxPosition.x,
        y: boxPosition.y + 0.5,
        z: boxPosition.z
      };
      
      reactionEntity.setAttribute('position', reactionPosition);
      
      // set model based on reaction type
      if (reactionType === 'heart') {
        reactionEntity.setAttribute('gltf-model', '#heart-model');
        reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        reactionEntity.setAttribute('rotation', '0 90 0');
      } else if (reactionType === 'laugh') {
        reactionEntity.setAttribute('gltf-model', '#laugh-model');
        reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        reactionEntity.setAttribute('rotation', '0 180 0');
      } else {
        // default to heart if type isn't recognized
        reactionEntity.setAttribute('gltf-model', '#heart-model');
        reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        reactionEntity.setAttribute('rotation', '0 90 0');
      }
      
      reactionEntity.classList.add('interactive');
      document.querySelector('a-scene').appendChild(reactionEntity);
      
      setTimeout(function() {
        reactionEntity.setAttribute('pickupable', '');
        
        console.log('Added pickupable to reaction:', reactionId);
        
        self.setupTripleClickDelete(reactionEntity);
        
        // save position when released
        reactionEntity.addEventListener('object-released', function() {
          console.log('Reaction released');
          self.saveReactionPosition(reactionEntity);
        });
        
        self.showMessage(reactionType.charAt(0).toUpperCase() + reactionType.slice(1) + ' created! Click to pick it up.');
      }, 100);
      
      return reactionEntity;
    },
    
    saveReactionPosition: function(reactionEntity) {
      // get current positional data
      var position = reactionEntity.getAttribute('position');
      var rotation = reactionEntity.getAttribute('rotation');
      var reactionType = reactionEntity.getAttribute('data-reaction-type');
      
      var reactionData = {
        id: reactionEntity.id,
        type: reactionType,
        position: position,
        rotation: rotation,
        timestamp: Date.now()
      };
      
      var reactions = JSON.parse(localStorage.getItem('galleryReactions') || '[]');
      
      var existingIndex = reactions.findIndex(function(reaction) {
        return reaction.id === reactionData.id;
      });
      
      if (existingIndex >= 0) {
        reactions[existingIndex] = reactionData;
      } else {
        // add new reaction
        reactions.push(reactionData);
      }
      
      // saving to local storage
      localStorage.setItem('galleryReactions', JSON.stringify(reactions));
      console.log('Reaction position saved:', reactionData);
      
      this.showMessage('Your ' + reactionType + ' has been placed :)');
    },
    
    loadSavedReactions: function() {
      var self = this;
      var reactions = JSON.parse(localStorage.getItem('galleryReactions') || '[]');
      
      console.log('Loading saved reactions:', reactions.length);
      
      reactions.forEach(function(reaction) {
        console.log('Loading reaction:', reaction.id, 'at position:', reaction.position);
        
        var reactionEntity = document.createElement('a-entity');
        reactionEntity.setAttribute('id', reaction.id || reaction.type + '-' + Date.now());
        reactionEntity.setAttribute('data-reaction-type', reaction.type || 'heart');
        
        reactionEntity.setAttribute('position', reaction.position);
        reactionEntity.setAttribute('rotation', reaction.rotation || {x: 0, y: 0, z: 0});
        
        if (reaction.type === 'heart' || !reaction.type) {
          reactionEntity.setAttribute('gltf-model', '#heart-model');
          reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        } else if (reaction.type === 'laugh') {
          reactionEntity.setAttribute('gltf-model', '#laugh-model');
          reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        } else {
          reactionEntity.setAttribute('gltf-model', '#heart-model');
          reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
        }
        
        reactionEntity.classList.add('interactive');
        
        document.querySelector('a-scene').appendChild(reactionEntity);
        
        setTimeout(function() {
          reactionEntity.setAttribute('pickupable', '');
          
          self.setupTripleClickDelete(reactionEntity);
          
          reactionEntity.addEventListener('object-released', function() {
            self.saveReactionPosition(reactionEntity);
          });
          
          console.log('Loaded saved reaction:', reactionEntity.id);
        }, 100);
      });
    },
    
    showMessage: function(text) {
      var messageEl = document.getElementById('reaction-message');
      
      if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'reaction-message';
        messageEl.style.position = 'fixed';
        messageEl.style.bottom = '20px';
        messageEl.style.left = '50%';
        messageEl.style.transform = 'translateX(-50%)';
        messageEl.style.backgroundColor = 'rgba(0,0,0,0.7)';
        messageEl.style.color = 'white';
        messageEl.style.padding = '10px 20px';
        messageEl.style.borderRadius = '5px';
        messageEl.style.zIndex = '1000';
        messageEl.style.fontFamily = "'Open Sans', sans-serif";
        document.body.appendChild(messageEl);
      }
      
      messageEl.textContent = text;
      messageEl.style.display = 'block';
      
      setTimeout(function() {
        messageEl.style.display = 'none';
      }, 3000);
    },
    
    // triple click to delete
    setupTripleClickDelete: function(reactionEntity) {
      var self = this;
      
      reactionEntity.clickCount = 0;
      reactionEntity.lastClickTime = 0;
      
      reactionEntity.clickHandler = function(event) {
        var now = Date.now();
        
        // reset click count if past the time
        if (now - reactionEntity.lastClickTime > 500) {
          reactionEntity.clickCount = 0;
        }
        
        reactionEntity.clickCount++;
        reactionEntity.lastClickTime = now;
        
        // check for 3 clicks
        if (reactionEntity.clickCount === 3) {
          self.deleteReaction(reactionEntity);
          
          event.stopPropagation();
          event.preventDefault();
        }
      };
      
      reactionEntity.addEventListener('click', reactionEntity.clickHandler);
    },
    
    // deleting the reaction
    deleteReaction: function(reactionEntity) {
      var reactionId = reactionEntity.id;
      var reactionType = reactionEntity.getAttribute('data-reaction-type');
      
      // remove from scene
      reactionEntity.parentNode.removeChild(reactionEntity);
      
      // remove from localStorage
      var reactions = JSON.parse(localStorage.getItem('galleryReactions') || '[]');
      
      var filteredReactions = reactions.filter(function(reaction) {
        return reaction.id !== reactionId;
      });
      
      localStorage.setItem('galleryReactions', JSON.stringify(filteredReactions));
      
      this.showMessage(reactionType.charAt(0).toUpperCase() + reactionType.slice(1) + ' deleted!');
      console.log('Reaction deleted:', reactionId);
    },
    
    remove: function() {
      this.el.removeEventListener('click', this.clickHandler);
    }
  });
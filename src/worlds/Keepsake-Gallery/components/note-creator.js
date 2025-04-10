AFRAME.registerComponent('note-creator', {
  schema: {
    width: { type: 'number', default: 0.6 },
    height: { type: 'number', default: 0.4 },
    boxPosition: { type: 'vec3', default: { x: 1.956, y: 1, z: 5.312 } }
  },

  init: function () {
    var self = this;

    // vr or desktop?
    this.inVR = false;
    this.vrModeAvailable = !!navigator.xr;

    this.noteBoxPosition = this.data.boxPosition;

    // desktop UI stuff
    this.desktopUI = document.getElementById('notes-ui');
    this.desktopNoteInput = document.getElementById('fname');
    this.desktopConfirmBtn = document.getElementById('confirm-btn-notes');

    if (this.desktopUI) {
      this.desktopCloseBtn = this.desktopUI.querySelector('#close-btn-notes');

      // desktop event listeners
      this.desktopCloseBtn.addEventListener('click', function () {
        self.hideNoteUI();
      });

      this.desktopConfirmBtn.addEventListener('click', function () {
        self.createNote();
      });
    }

    // VR UI stuff
    this.createVRUI();

    self.el.addEventListener('click', function () {
      self.showNoteUI();
    });

    window.addEventListener('enter-vr', function () {
      self.inVR = true;
      console.log('Entered VR mode');
    });

    window.addEventListener('exit-vr', function () {
      self.inVR = false;
      console.log('Exited VR mode');
    });

    console.log('Note creator initialized. VR available:', this.vrModeAvailable);
  },

  createVRUI: function () {
    var self = this;
    var scene = document.querySelector('a-scene');

    // create a container for the UI
    this.vrNotePanel = document.createElement('a-entity');
    this.vrNotePanel.setAttribute('id', 'vr-notes-ui');
    this.vrNotePanel.setAttribute('visible', false);

    this.vrNotePanel.setAttribute('position', {
      x: this.noteBoxPosition.x,
      y: this.noteBoxPosition.y + 0.3,
      z: this.noteBoxPosition.z - 0.5
    });

    var panel = document.createElement('a-plane');
    panel.setAttribute('color', '#f5f5dc');
    panel.setAttribute('width', this.data.width);
    panel.setAttribute('height', this.data.height);

    var title = document.createElement('a-text');
    title.setAttribute('value', 'Create Note');
    title.setAttribute('align', 'center');
    title.setAttribute('position', '0 0.15 0.01');
    title.setAttribute('color', '#000');

    var inputBox = document.createElement('a-plane');
    inputBox.setAttribute('color', '#ffffff');
    inputBox.setAttribute('width', this.data.width - 0.1);
    inputBox.setAttribute('height', 0.1);
    inputBox.setAttribute('position', '0 0 0.005');
    inputBox.setAttribute('class', 'interactive');

    this.vrInputText = document.createElement('a-text');
    this.vrInputText.setAttribute('value', 'Click to type...');
    this.vrInputText.setAttribute('color', '#000000');
    this.vrInputText.setAttribute('align', 'center');
    this.vrInputText.setAttribute('position', '0 0 0.01');
    this.vrInputText.setAttribute('width', this.data.width - 0.15);
    this.vrInputText.setAttribute('wrap-count', 30);

    var confirmBtn = document.createElement('a-plane');
    confirmBtn.setAttribute('color', '#4CAF50');
    confirmBtn.setAttribute('width', 0.2);
    confirmBtn.setAttribute('height', 0.08);
    confirmBtn.setAttribute('position', '0.12 -0.15 0.01');
    confirmBtn.setAttribute('class', 'interactive');

    var confirmText = document.createElement('a-text');
    confirmText.setAttribute('value', 'Create');
    confirmText.setAttribute('color', '#ffffff');
    confirmText.setAttribute('align', 'center');
    confirmText.setAttribute('position', '0 0 0.01');
    confirmText.setAttribute('width', 0.4);

    var closeBtn = document.createElement('a-plane');
    closeBtn.setAttribute('color', '#f44336');
    closeBtn.setAttribute('width', 0.2);
    closeBtn.setAttribute('height', 0.08);
    closeBtn.setAttribute('position', '-0.12 -0.15 0.01');
    closeBtn.setAttribute('class', 'interactive');

    var closeText = document.createElement('a-text');
    closeText.setAttribute('value', 'Cancel');
    closeText.setAttribute('color', '#ffffff');
    closeText.setAttribute('align', 'center');
    closeText.setAttribute('position', '0 0 0.01');
    closeText.setAttribute('width', 0.4);

    // event listeners for UI
    inputBox.addEventListener('click', function () {
      self.openKeyboard();
    });

    confirmBtn.addEventListener('click', function () {
      self.createNote();
    });

    closeBtn.addEventListener('click', function () {
      self.hideNoteUI();
    });

    confirmBtn.appendChild(confirmText);
    closeBtn.appendChild(closeText);
    inputBox.appendChild(this.vrInputText);

    this.vrNotePanel.appendChild(panel);
    this.vrNotePanel.appendChild(title);
    this.vrNotePanel.appendChild(inputBox);
    this.vrNotePanel.appendChild(confirmBtn);
    this.vrNotePanel.appendChild(closeBtn);

    scene.appendChild(this.vrNotePanel);

    // store ref
    this.inputBox = inputBox;
    this.confirmBtn = confirmBtn;
    this.closeBtn = closeBtn;
  },

  openKeyboard: function () {
    var self = this;

    if (navigator.xr) {
      if ('dom-overlay' in navigator.xr) {
        if (!this.overlayInput) {
          var overlay = document.querySelector('#dom-overlay') || document.body;

          this.overlayContainer = document.createElement('div');
          this.overlayContainer.style.position = 'fixed';
          this.overlayContainer.style.bottom = '20%';
          this.overlayContainer.style.left = '10%';
          this.overlayContainer.style.width = '80%';
          this.overlayContainer.style.padding = '10px';
          this.overlayContainer.style.backgroundColor = 'rgba(0,0,0,0.7)';
          this.overlayContainer.style.borderRadius = '8px';
          this.overlayContainer.style.display = 'none';

          this.overlayInput = document.createElement('input');
          this.overlayInput.type = 'text';
          this.overlayInput.style.width = '100%';
          this.overlayInput.style.padding = '8px';
          this.overlayInput.style.border = 'none';
          this.overlayInput.style.borderRadius = '4px';
          this.overlayInput.style.fontSize = '16px';

          var buttonContainer = document.createElement('div');
          buttonContainer.style.display = 'flex';
          buttonContainer.style.justifyContent = 'space-between';
          buttonContainer.style.marginTop = '10px';

          var confirmButton = document.createElement('button');
          confirmButton.textContent = 'OK';
          confirmButton.style.padding = '8px 16px';
          confirmButton.style.backgroundColor = '#4CAF50';
          confirmButton.style.color = 'white';
          confirmButton.style.border = 'none';
          confirmButton.style.borderRadius = '4px';
          confirmButton.style.fontSize = '14px';

          var cancelButton = document.createElement('button');
          cancelButton.textContent = 'Cancel';
          cancelButton.style.padding = '8px 16px';
          cancelButton.style.backgroundColor = '#f44336';
          cancelButton.style.color = 'white';
          cancelButton.style.border = 'none';
          cancelButton.style.borderRadius = '4px';
          cancelButton.style.fontSize = '14px';

          buttonContainer.appendChild(cancelButton);
          buttonContainer.appendChild(confirmButton);

          this.overlayContainer.appendChild(this.overlayInput);
          this.overlayContainer.appendChild(buttonContainer);
          overlay.appendChild(this.overlayContainer);

          // handle confirm
          confirmButton.addEventListener('click', function () {
            var inputText = self.overlayInput.value.trim();
            if (inputText !== '') {
              self.vrInputText.setAttribute('value', inputText);
            }
            self.overlayContainer.style.display = 'none';
          });

          // handle cancel
          cancelButton.addEventListener('click', function () {
            self.overlayContainer.style.display = 'none';
          });

          this.overlayInput.addEventListener('input', function (e) {
            if (e.target.value && e.target.value.trim() !== '') {
              self.vrInputText.setAttribute('value', e.target.value);
            } else {
              self.vrInputText.setAttribute('value', 'Click to type...');
            }
          });
        }

        // show UI
        this.overlayContainer.style.display = 'block';

        setTimeout(function () {
          self.overlayInput.focus({ preventScroll: true });
        }, 100);
      }
      else {
        this.showFallbackKeyboard();
      }
    } else {
      this.showFallbackKeyboard();
    }
  },

  showNoteUI: function () {
    if (this.inVR) {
      // show VR UI
      this.vrNotePanel.setAttribute('position', {
        x: this.noteBoxPosition.x,
        y: this.noteBoxPosition.y + 0.3,
        z: this.noteBoxPosition.z - 0.5
      });

      this.vrNotePanel.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0
      });

      this.vrNotePanel.setAttribute('visible', true);

      if (this.desktopUI) {
        this.desktopUI.style.display = 'none';
      }
    } else {
      // show desktop UI
      if (this.desktopUI) {
        this.desktopUI.style.display = 'block';
        if (this.desktopNoteInput) {
          this.desktopNoteInput.focus();
        }
      }

      // hide VR UI
      this.vrNotePanel.setAttribute('visible', false);
    }
  },

  hideNoteUI: function () {
    // hide both UIs
    this.vrNotePanel.setAttribute('visible', false);

    if (this.overlayInput) {
      this.overlayInput.value = '';
    }

    this.vrInputText.setAttribute('value', 'Click to type...');

    if (this.desktopUI) {
      this.desktopUI.style.display = 'none';
      if (this.desktopNoteInput) {
        this.desktopNoteInput.value = '';
      }
    }
  },

  createNote: function () {
    var self = this;
    var noteText;

    // get note text
    if (this.inVR) {
      noteText = this.vrInputText.getAttribute('value');
      if (!noteText || noteText === 'Click to type...') {
        this.showMessage('Please write something in your note!', this.inVR);
        return;
      }
    } else {
      if (this.desktopNoteInput) {
        noteText = this.desktopNoteInput.value.trim();
        if (!noteText) {
          this.showMessage('Please write something in your note!', this.inVR);
          return;
        }
      } else {
        noteText = this.vrInputText.getAttribute('value');
        if (!noteText || noteText === 'Click to type...') {
          this.showMessage('Please write something in your note!', this.inVR);
          return;
        }
      }
    }

    // note id
    var noteId = 'comment_note-' + Date.now();
    var noteEntity = document.createElement('a-entity');
    noteEntity.setAttribute('id', noteId);

    var notePosition = {
      x: this.noteBoxPosition.x,
      y: this.noteBoxPosition.y + 0.5,
      z: this.noteBoxPosition.z
    };

    noteEntity.setAttribute('rotation', {
      x: 0,
      y: 180,
      z: 0
    });

    noteEntity.setAttribute('position', notePosition);

    var notePlane = document.createElement('a-plane');
    notePlane.setAttribute('color', '#f5f5dc');
    notePlane.setAttribute('width', '0.3');
    notePlane.setAttribute('height', '0.3');
    notePlane.setAttribute('class', 'interactive');

    var noteTextEl = document.createElement('a-text');
    noteTextEl.setAttribute('value', noteText);
    noteTextEl.setAttribute('color', '#000000');
    noteTextEl.setAttribute('width', '0.5');
    noteTextEl.setAttribute('align', 'center');
    noteTextEl.setAttribute('position', '0 0 0.01');
    noteTextEl.setAttribute('wrap-count', '15');

    notePlane.appendChild(noteTextEl);
    noteEntity.appendChild(notePlane);

    document.querySelector('a-scene').appendChild(noteEntity);

    setTimeout(function () {
      noteEntity.setAttribute('pickupable', '');

      console.log('Added pickupable to note:', noteId);
      console.log('Note components:', noteEntity.components);

      noteEntity.addEventListener('click', function (e) {
        console.log('Note clicked:', noteId);
      });

      noteEntity.addEventListener('object-released', function () {
        console.log('Note released');
        self.saveNotePosition(noteEntity, noteText);

        var noteSound = document.querySelectorAll('.noteSound');
        noteSound.forEach(function (soundEntity) {
          soundEntity.components.sound.playSound();
        });
      });

      noteEntity.classList.add('interactive');

      self.showMessage('Note created above the box! Click to pick it up.', self.inVR);
    }, 100);

    self.hideNoteUI();

    return noteEntity;
  },

  checkForExistingNote: async function (noteId) {
    const s3Objects = await S3Logic.retrieveAllObjects();
    s3Objects.forEach(object => {
      if (object.Key === noteId) {
        console.log('Note already exists:', noteId);
        S3Logic.deleteObject(noteId);
        console.log('Note deleted:', noteId);
      }
    });
  },

  saveNotePosition: function (noteEntity, noteText) {
    var position = noteEntity.getAttribute('position');
    var rotation = noteEntity.getAttribute('rotation');

    const note = new Comment(noteEntity.getAttribute('id'), UserLogic.getCurrentGalleryEmail(), noteText, position, rotation);
    this.checkForExistingNote(note.key);
    S3Logic.uploadMetadataToS3(note.toJson());

    const scene = document.querySelector('a-scene');
    const interactionManager = scene.components['interaction-manager'];
    console.log('Interaction manager:', interactionManager);
    if (interactionManager.socket) {
      interactionManager.socket.emit(CIRCLES.EVENTS.SEND_DATA_SYNC, { galleryEmail: UserLogic.getCurrentGalleryEmail(), room: CIRCLES.getCirclesGroupName(), world: CIRCLES.getCirclesWorldName() });
      console.log('Emitting update-gallery event for notes');
    }

    this.showMessage('Your note has been posted :)', this.inVR);
  },

  showMessage: function (text, isVR) {
    if (isVR) {
      // show VR message
      var scene = document.querySelector('a-scene');

      var existingMsg = document.querySelector('#vr-message');
      if (existingMsg) {
        existingMsg.parentNode.removeChild(existingMsg);
      }

      var messageEntity = document.createElement('a-entity');
      messageEntity.setAttribute('id', 'vr-message');

      var messageBg = document.createElement('a-plane');
      messageBg.setAttribute('color', 'rgba(0,0,0,0.7)');
      messageBg.setAttribute('width', 0.8);
      messageBg.setAttribute('height', 0.2);
      messageBg.setAttribute('material', 'transparent: true; opacity: 0.7');

      var messageText = document.createElement('a-text');
      messageText.setAttribute('value', text);
      messageText.setAttribute('color', '#ffffff');
      messageText.setAttribute('align', 'center');
      messageText.setAttribute('width', 0.7);
      messageText.setAttribute('wrap-count', 30);
      messageText.setAttribute('position', '0 0 0.01');

      messageEntity.appendChild(messageBg);
      messageEntity.appendChild(messageText);

      messageEntity.setAttribute('position', {
        x: this.noteBoxPosition.x,
        y: this.noteBoxPosition.y + 0.7,
        z: this.noteBoxPosition.z - 0.3
      });

      messageEntity.setAttribute('rotation', {
        x: 0,
        y: 180,
        z: 0
      });

      scene.appendChild(messageEntity);

      setTimeout(function () {
        if (messageEntity.parentNode) {
          messageEntity.parentNode.removeChild(messageEntity);
        }
      }, 3000);
    } else {
      // show desktop message
      var messageEl = document.getElementById('note-message');

      if (!messageEl) {
        messageEl = document.createElement('div');
        messageEl.id = 'note-message';
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

      setTimeout(function () {
        messageEl.style.display = 'none';
      }, 3000);
    }
  },

  showFallbackKeyboard: function () {
    var self = this;

    this.superKeyboard = document.querySelector('#keyboard');

    if (!this.superKeyboard) {
      this.superKeyboard = document.createElement('a-entity');
      this.superKeyboard.setAttribute('id', 'keyboard');
      this.superKeyboard.setAttribute('super-keyboard', {
        hand: '#hand',
        imagePath: './assets/images',
        value: '',
        font: 'roboto'
      });
      document.querySelector('a-scene').appendChild(this.superKeyboard);
    }

    this.superKeyboard.setAttribute('position', {
      x: this.noteBoxPosition.x,
      y: this.noteBoxPosition.y - 0.3,
      z: this.noteBoxPosition.z - 0.5
    });

    this.superKeyboard.setAttribute('rotation', {
      x: -30,
      y: 180,
      z: 0
    });

    // event listeners for the keyboard
    this.superKeyboard.addEventListener('superkeyboardchange', function (event) {
      self.vrInputText.setAttribute('value', event.detail.value || 'Click to type...');
    });

    this.superKeyboard.addEventListener('superkeyboarddismiss', function () {
      self.superKeyboard.setAttribute('visible', false);
    });

    this.superKeyboard.addEventListener('superkeyboardinput', function (event) {
      console.log('Keyboard input:', event.detail.value);
    });

    this.superKeyboard.addEventListener('superkeyboardenter', function (event) {
      self.superKeyboard.setAttribute('visible', false);
    });

    this.superKeyboard.setAttribute('visible', true);

    var currentText = this.vrInputText.getAttribute('value');
    if (currentText && currentText !== 'Click to type...') {
      this.superKeyboard.setAttribute('super-keyboard', 'value', currentText);
    } else {
      this.superKeyboard.setAttribute('super-keyboard', 'value', '');
    }
  },

  remove: function () {
    if (this.vrNotePanel && this.vrNotePanel.parentNode) {
      this.vrNotePanel.parentNode.removeChild(this.vrNotePanel);
    }

    if (this.superKeyboard) {
      this.superKeyboard.removeEventListener('superkeyboardchange');
      this.superKeyboard.removeEventListener('superkeyboarddismiss');
      this.superKeyboard.removeEventListener('superkeyboardinput');
      this.superKeyboard.removeEventListener('superkeyboardenter');
    }

    if (this.overlayInput && this.overlayInput.parentNode) {
      this.overlayInput.parentNode.removeChild(this.overlayInput);
    }

    // remove desktop event listeners
    if (this.desktopUI) {
      this.desktopCloseBtn.removeEventListener('click', this.hideNoteUI);
      this.desktopConfirmBtn.removeEventListener('click', this.createNote);
    }

    this.el.removeEventListener('click', this.showNoteUI);

    // remove VR mode change listeners
    window.removeEventListener('enter-vr');
    window.removeEventListener('exit-vr');
  }
});
AFRAME.registerComponent('note-creator', {
  init: function () {
    var self = this;
    
    self.notesUI = document.getElementById('notes-ui');
    self.noteInput = document.getElementById('fname');
    self.confirmBtn = document.getElementById('confirm-btn-notes');
    self.closeBtn = self.notesUI.querySelector('#close-btn-notes');
    
    // event listeners
    self.el.addEventListener('click', function() {
      self.showNoteUI();
    });
    
    self.closeBtn.addEventListener('click', function() {
      self.hideNoteUI();
    });
    
    self.confirmBtn.addEventListener('click', function() {
      self.createNote();
    });
    
    // init local note storage
    if (!localStorage.getItem('galleryNotes')) {
      localStorage.setItem('galleryNotes', JSON.stringify([]));
    }
    
    // load notes
    self.loadSavedNotes();
    
    console.log('Note creator init');
  },
  
  showNoteUI: function() {
    this.notesUI.style.display = 'block';
    this.noteInput.focus();
  },
  
  hideNoteUI: function() {
    this.notesUI.style.display = 'none';
    this.noteInput.value = '';
  },
  
  createNote: function() {
    var self = this;
    var noteText = self.noteInput.value.trim();
    
    if (!noteText) {
      alert('Please write something in your note!');
      return;
    }
    
    // creating a note & assigning a unique ID
    var noteId = 'note-' + Date.now();
    var noteEntity = document.createElement('a-entity');
    noteEntity.setAttribute('id', noteId);
    
    var noteBoxPosition = self.el.getAttribute('position');
    
    // pos generated note above note box
    var notePosition = {
      x: noteBoxPosition.x,
      y: noteBoxPosition.y + 0.5,
      z: noteBoxPosition.z
    };

    noteEntity.setAttribute('rotation', {
      x: 0,
      y: 180,
      z: 0
    });
    
    noteEntity.setAttribute('position', notePosition);
    
    // creating a plane for note
    var notePlane = document.createElement('a-plane');
    notePlane.setAttribute('color', '#f5f5dc');
    notePlane.setAttribute('width', '0.3');
    notePlane.setAttribute('height', '0.3');
    notePlane.setAttribute('class', 'interactive');
    
    // adding user input text
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
    
    // slight delay to make sure it is loaded into scene
    setTimeout(function() {
      // make pickupable
      noteEntity.setAttribute('pickupable', '');
      
      console.log('Added pickupable to note:', noteId);
      console.log('Note components:', noteEntity.components);
      
      // click debugger
      noteEntity.addEventListener('click', function(e) {
        console.log('Note clicked:', noteId);
      });
      
      // when note released, save position
      noteEntity.addEventListener('object-released', function() {
        console.log('Note released');
        self.saveNotePosition(noteEntity, noteText);
      });
      
      noteEntity.classList.add('interactive');
      
      // instruction pop up
      self.showMessage('Note created above the box! Click to pick it up.');
    }, 100);
    
    self.hideNoteUI();
    
    return noteEntity;
  },
  
  saveNotePosition: function(noteEntity, noteText) {
    // get current position and rotation
    var position = noteEntity.getAttribute('position');
    var rotation = noteEntity.getAttribute('rotation');
    
    // creating note data
    var noteData = {
      id: noteEntity.id,
      text: noteText || noteEntity.querySelector('a-text').getAttribute('value'),
      position: position,
      rotation: rotation,
      timestamp: Date.now()
    };
    
    // get existing notes
    var notes = JSON.parse(localStorage.getItem('galleryNotes') || '[]');
    
    var existingIndex = notes.findIndex(function(note) {
      return note.id === noteData.id;
    });
    
    if (existingIndex >= 0) {
      notes[existingIndex] = noteData;
    } else {
      // add new note
      notes.push(noteData);
    }
    
    // save to localStorage
    localStorage.setItem('galleryNotes', JSON.stringify(notes));
    console.log('Note position saved:', noteData);
    
    this.showMessage('Your note has been posted :)');
  },
  
  loadSavedNotes: function() {
    var self = this;
    var notes = JSON.parse(localStorage.getItem('galleryNotes') || '[]');
    
    console.log('Loading saved notes:', notes.length);
    
    notes.forEach(function(note) {
      if (!note.text) return;
      
      console.log('Loading note:', note.id, 'at position:', note.position);
      
      // creating note entity
      var noteEntity = document.createElement('a-entity');
      noteEntity.setAttribute('id', note.id || 'note-' + Date.now());
      
      noteEntity.setAttribute('position', note.position);
      noteEntity.setAttribute('rotation', note.rotation || {x: 0, y: 0, z: 0});
      
      var notePlane = document.createElement('a-plane');
      notePlane.setAttribute('color', '#f5f5dc');
      notePlane.setAttribute('width', '0.3');
      notePlane.setAttribute('height', '0.3');
      notePlane.setAttribute('class', 'interactive');
      
      var noteTextEl = document.createElement('a-text');
      noteTextEl.setAttribute('value', note.text);
      noteTextEl.setAttribute('color', '#000000');
      noteTextEl.setAttribute('width', '0.5');
      noteTextEl.setAttribute('align', 'center');
      noteTextEl.setAttribute('position', '0 0 0.01');
      noteTextEl.setAttribute('wrap-count', '15');
      
      notePlane.appendChild(noteTextEl);
      noteEntity.appendChild(notePlane);
      
      document.querySelector('a-scene').appendChild(noteEntity);
      
      setTimeout(function() {
        noteEntity.setAttribute('pickupable', '');
        noteEntity.classList.add('interactive');
        
        noteEntity.addEventListener('object-released', function() {
          self.saveNotePosition(noteEntity, note.text);
        });
        
        console.log('Loaded saved note:', noteEntity.id);
      }, 100);
    });
  },
  
  // instruction pop ups
  showMessage: function(text) {
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
    
    setTimeout(function() {
      messageEl.style.display = 'none';
    }, 3000);
  },
  
  remove: function() {
    this.el.removeEventListener('click', this.showNoteUI);
    this.closeBtn.removeEventListener('click', this.hideNoteUI);
    this.confirmBtn.removeEventListener('click', this.createNote);
  }
});
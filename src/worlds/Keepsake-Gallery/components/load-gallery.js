AFRAME.registerComponent("load-gallery", {

    init: async function () {
        this.loadGallery();
    },

    removeExistingElement: function (elementId) {
        const el = document.getElementById(elementId);
        if (el) {
            el.parentNode.removeChild(el);
            console.log("Deleted existing element: " + elementId);
        } else {
            console.log("Element not found: " + elementId);
        }
    },

    loadGallery: async function () {
        const allS3Objects = await S3Logic.retrieveAllObjects();
        this.loadArtifacts(allS3Objects);
        this.loadNotes(allS3Objects);
        this.loadReactions(allS3Objects);
    },

    loadReactions: async function (allS3Objects) {
        try {
            for (const object of allS3Objects) {
                if (object.Key.startsWith("reaction")) {
                    console.log("Loading reaction:", object.Key);
                    const objectJson = await S3Logic.retrieveObject(object.Key);
                    const reaction = Reaction.fromJson(objectJson);

                    if (reaction && reaction.orbEmail === UserLogic.getCurrentGalleryEmail()) {
                        console.log('Loading reaction:', reaction.key, 'at position:', reaction.position);
                        this.removeExistingElement(reaction.key);

                        var reactionEntity = document.createElement('a-entity');
                        reactionEntity.setAttribute('id', reaction.key || reaction.type + '-' + Date.now());
                        reactionEntity.setAttribute('data-reaction-type', reaction.type || 'heart');

                        reactionEntity.setAttribute('position', reaction.position);
                        reactionEntity.setAttribute('rotation', reaction.rotation || { x: 0, y: 0, z: 0 });

                        if (reaction.type === 'heart' || !reaction.type) {
                            reactionEntity.setAttribute('gltf-model', '#heart-model');
                            reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
                        } else if (reaction.type === 'laugh') {
                            reactionEntity.setAttribute('gltf-model', '#laugh-model');
                            reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
                        } else if (reaction.type === 'smile') {
                            reactionEntity.setAttribute('gltf-model', '#smile-model');
                            reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
                        } else if (reaction.type === 'thumbsup') {
                            reactionEntity.setAttribute('gltf-model', '#thumbsup-model');
                            reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
                        } else {
                            reactionEntity.setAttribute('gltf-model', '#heart-model');
                            reactionEntity.setAttribute('scale', '0.1 0.1 0.1');
                        }

                        reactionEntity.classList.add('interactive');

                        document.querySelector('a-scene').appendChild(reactionEntity);

                        setTimeout(function () {
                            reactionEntity.setAttribute('pickupable', '');

                            reactionEntity.addEventListener('object-released', function () {
                                const reactionCreatorElement = document.querySelector("[reaction-creator]");
                                reactionCreatorElement.saveReactionPosition(reactionEntity);
                            });

                            console.log('Loaded saved reaction:', reactionEntity.id);
                        }, 100);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading reactions: " + error);
        }
    },

    loadNotes: async function (allS3Objects) {
        for (const object of allS3Objects) {
            if (object.Key.startsWith("comment")) {

                console.log("Loading note:", object.Key);
                const objectJson = await S3Logic.retrieveObject(object.Key);
                const note = Comment.fromJson(objectJson);

                if (note && note.orbEmail === UserLogic.getCurrentGalleryEmail()) {
                    console.log("Loading note:", note.key, "at position:", note.position);
                    this.removeExistingElement(note.key);

                    var noteEntity = document.createElement('a-entity');
                    noteEntity.setAttribute('id', note.key || 'note-' + Date.now());

                    noteEntity.setAttribute('position', note.position);
                    noteEntity.setAttribute('rotation', note.rotation || { x: 0, y: 0, z: 0 });

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

                    setTimeout(function () {
                        noteEntity.setAttribute('pickupable', '');
                        noteEntity.classList.add('interactive');

                        noteEntity.addEventListener('object-released', function () {
                            const noteCreator = document.getElementById('note-creator-box');
                            const noteCreatorComponent = noteCreator.components['note-creator'];
                            console.log('Saving note position for:', noteEntity.id);
                            noteCreatorComponent.saveNotePosition(noteEntity, note.text);
                        });

                        console.log('Loaded saved note:', noteEntity.id);
                    }, 100);
                }
            }
        }
    },

    loadArtifacts: async function (allS3Objects) {
        try {
            const userEmail = UserLogic.getCurrentGalleryEmail();
            for (const object of allS3Objects) {
                if (object.Key.startsWith("file")) {
                    const objectJson = await S3Logic.retrieveObject(object.Key);
                    const artifact = Artifact.fromJson(objectJson);
                    if (artifact.userEmail === userEmail) {
                        console.log("loading " + artifact.userEmail + " artifact");
                        this.removeExistingElement(artifact.key);
                        new ArtifactLogic().fileDataToAframe(artifact);
                    }
                }
            }
        } catch (error) {
            console.error("Error loading artifacts: " + error);
        }
    }



});
class AllArtifacts {
   static artifacts =[];
    
    static addArtifact(artifact) {
        this.artifacts.push(artifact);
    }
    
    static removeArtifact(artifact) {
        const index = this.artifacts.indexOf(artifact);
        if (index > -1) {
            this.artifacts.splice(index, 1);
        }
    }

    static getPedestalArtifact = (pedestalId) => this.artifacts.find(artifact => artifact.pedestalId === pedestalId);


    static removePedestalArtifact(pedestalId) { 
        const index = this.artifacts.findIndex(artifact => artifact.pedestalId === pedestalId);
        if (index > -1) {
            this.artifacts.splice(index, 1);
        }
    }

    static clearArtifacts() {
        this.artifacts = [];
    }
}
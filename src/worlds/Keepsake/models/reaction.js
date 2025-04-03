class Reaction {
    constructor(id, pedestalId, reactionNum, position, rotation) {
        this.id = id
        this.pedestalId = pedestalId
        this.reactionNum = reactionNum;
        this.position = position;
        this.rotation = rotation;
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            pedestalId: this.pedestalId,
            reactionNum: this.reactionNum,
            position: this.position,
            rotation: this.rotation
        });
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        return new Comment(data.id, data.pedestalId, data.reactionNum, data.position, data.rotation);
    }
}
class Comment {
    constructor(id, pedestalId, text, position, rotation) {
        this.id = id
        this.pedestalId = pedestalId
        this.text = text;
        this.position = position;
        this.rotation = rotation;
    }

    toJson() {
        return JSON.stringify({
            id: this.id,
            pedestalId: this.pedestalId,
            text: this.text,
            position: this.position,
            rotation: this.rotation
        });
    }

    static fromJson(json) {
        const data = JSON.parse(json);
        return new Comment(data.id, data.pedestalId, data.text, data.position, data.rotation);
    }
}
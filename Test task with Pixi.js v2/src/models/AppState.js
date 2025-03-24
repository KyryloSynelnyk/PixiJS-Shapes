/**
 * Class to hold the application state.
 */
class AppState {
    constructor() {
        this.gravity = 1;
        this.shapeFrequency = 1;
        this.shapeCount = 0;
        this.totalSurfaceArea = 0;
        this.shapes = [];
        this.isRemovingShapes = false;
        this.initialFrequency = 1;
        this.initialGravity = 1;
    }
}

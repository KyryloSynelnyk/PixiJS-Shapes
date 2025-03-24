/**
 * Main application class that initializes and starts the application.
 */
class App {
    constructor() {
        this.appState = new AppState();
        this.imageModel = new ImageModel();
        this.canvasView = new CanvasView(this.appState, this.imageModel);  
        this.shapeController = new ShapeController(this.appState, this.canvasView);
        this.uiController = new UIController(this.appState, this.shapeController, this.canvasView);
    }

    /**
     * Starts the application.
     */
    start() {
        this.uiController.init();
        this.shapeController.startShapeGeneration();
    }
}

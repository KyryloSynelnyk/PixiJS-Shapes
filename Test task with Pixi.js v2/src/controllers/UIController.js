/**
 * UI Controller class to handle UI interactions and updates.
 */
 class UIController {
     constructor(appState, shapeController, canvasView) {
         this.appState = appState;
         this.shapeController = shapeController;
         this.canvasView = canvasView;
     }

    /**
     * Initializes the UI controller.
     */
    init() {
        this.setupEventListeners();
    }

    /**
     * Sets up event listeners for the UI controls.
     */
    setupEventListeners() {
        const self = this;

        document.addEventListener('visibilitychange', function() {
            if (document.hidden) {
                self.shapeController.stopShapeGeneration();
            } else {
                self.shapeController.startShapeGeneration();
            }
        });
    }

    /**
     * Increases the frequency of shape generation.
     */
    increaseFrequency() {
        this.appState.shapeFrequency = Math.min(this.appState.shapeFrequency + 1, 10);
        document.getElementById('frequencyValue').innerText = this.appState.shapeFrequency;
        this.shapeController.stopShapeGeneration();
        this.shapeController.startShapeGeneration();
    }

    /**
     * Decreases the frequency of shape generation.
     */
    decreaseFrequency() {
        this.appState.shapeFrequency = Math.max(this.appState.shapeFrequency - 1, 1);
        document.getElementById('frequencyValue').innerText = this.appState.shapeFrequency;
        this.shapeController.stopShapeGeneration();
        this.shapeController.startShapeGeneration();
    }

    /**
     * Increases the gravity of shapes.
     */
    increaseGravity() {
        this.appState.gravity += 1;
        document.getElementById('gravityValue').innerText = this.appState.gravity;
        this.canvasView.updateShapesGravity(this.appState.gravity);
    }

    /**
     * Decreases the gravity of shapes.
     */
    decreaseGravity() {
        this.appState.gravity = Math.max(this.appState.gravity - 1, 1);
        document.getElementById('gravityValue').innerText = this.appState.gravity;
        this.canvasView.updateShapesGravity(this.appState.gravity);
    }

    /**
     * Resets the values to their initial settings.
     */
    resetValues() {
        this.appState.shapeFrequency = this.appState.initialFrequency;
        document.getElementById('frequencyValue').innerText = this.appState.shapeFrequency;
        this.appState.gravity = this.appState.initialGravity;
        document.getElementById('gravityValue').innerText = this.appState.gravity;
        this.shapeController.startShapeGeneration();
        this.appState.shapes.forEach(shape => shape.vy = this.appState.gravity);
    }
}

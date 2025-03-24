/**
 * Shape controller class to manage shape generation and updates.
 */
class ShapeController {
    constructor(appState, canvasView) {
        this.appState = appState;
        this.canvasView = canvasView;
        this.shapeInterval = null;
    }

    /**
     * Starts the shape generation process.
     */
     startShapeGeneration() {
         this.stopShapeGeneration(); // Clear any existing intervals

         // Set up the shape generation interval
         this.shapeInterval = setInterval(() => {
             // Check if the tab is active and if shapes are not being removed
             if (!this.appState.isRemovingShapes && !document.hidden) {
                 // Рассчитайте координаты прямоугольника
                 const rectWidth = this.isMobile ? window.innerWidth * 0.8 : 700;
                 const rectHeight = 500; // Установите фиксированную высоту для прямоугольника
                 const rectX = (window.innerWidth - rectWidth) / 2;
                 const rectY = 0; // Зафиксируйте y-позицию прямоугольника

                 // Generate a random x position within the rectangle
                 const x = Math.random() * rectWidth + rectX;
                 // Create the shape
                 const shape = this.canvasView.createRandomShape(x, rectY);
                 if (shape) { // Check if shape was created successfully
                     // Add the shape to the app state
                     this.appState.shapes.push(shape);
                 }
             }
         }, 1000 / this.appState.shapeFrequency);
     }

    /**
     * Stops the shape generation process.
     */
    stopShapeGeneration() {
        clearInterval(this.shapeInterval);
    }
}

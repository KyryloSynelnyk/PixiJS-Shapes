/**
 * Canvas view class to handle rendering and shape interactions.
 */
class CanvasView {
    constructor(appState,imageModel) {
        this.appState = appState;
        this.imageModel = imageModel;
        // Set isMobile based on screen width
        this.isMobile = window.innerWidth <= 768;

        // PixiJS application
        this.app = new PIXI.Application({
            width: this.isMobile ? window.innerWidth * 0.8 : window.innerWidth, // 80% width for mobile
            height: 600,
            resizeTo: window,
            backgroundColor: 0x0D7A96,
        });
        document.getElementById('canvas').appendChild(this.app.view);

        // Draw graphics
        this.graphics = new PIXI.Graphics();
        this.graphics.beginFill(0xFFFFFF, 0.6);
        this.graphics.drawRect(0, 0, this.app.screen.width, this.app.screen.height);
        this.graphics.endFill();
        this.app.stage.addChild(this.graphics);

        // Make the rectangle responsive
        const rectWidth = this.isMobile ? window.innerWidth * 0.8 : 700;
        const rectHeight = this.isMobile ? window.innerHeight * 0.6 : 500;

        const rectX = (this.app.screen.width - rectWidth) / 2;
        const rectY = 50;

        // Get the base64 image from the model
        const base64Image = this.imageModel.getBase64();

        // Check if the base64 image string is not empty or undefined
        if (base64Image && base64Image.startsWith("data:image/")) {
            const texture = PIXI.Texture.from(base64Image);
            const sprite = new PIXI.Sprite(texture);

            // Set the sprite's size to match the active rectangle's size
            sprite.width = rectWidth;
            sprite.height = rectHeight;

            // Position the sprite at the same coordinates as the active rectangle
            sprite.x = rectX;
            sprite.y = rectY;

            // Add the sprite to the stage
            this.app.stage.addChild(sprite);
        }
        // Draw graphics
        const rectangle = new PIXI.Graphics();
        rectangle.lineStyle(2, 0xffffff);
        rectangle.drawRect(rectX, rectY, rectWidth, rectHeight);
        rectangle.interactive = true;
        this.app.stage.interactive = true;
        this.app.stage.on('pointerdown', this.onClick.bind(this));
        this.app.stage.addChild(rectangle);

        // Masking rectangle (same size as the interactive rectangle)
        const mask = new PIXI.Graphics();
        mask.beginFill(0x000000);
        mask.drawRect(rectX, rectY, rectWidth, rectHeight);
        mask.endFill();
        this.app.stage.addChild(mask);
        this.app.stage.mask = mask;

        this.onClick = this.onClick.bind(this);

        this.removeShape = this.removeShape.bind(this);

        this.shapes = [];

        // Update the position of the shapes every frame
        this.app.ticker.add(() => {
            for (let i = 0; i < this.shapes.length; i++) {
                const shape = this.shapes[i];
                shape.y += shape.vy;

                if (shape.y > 600) {
                    this.app.stage.removeChild(shape);
                    this.shapes.splice(i, 1);
                    this.updateStats(-1);
                    this.updateSurfaceArea();
                    i--;
                }
            }
        });

        // Initialize app state values
        this.appState.initialFrequency = 1;
        this.appState.initialGravity = 1;
        this.appState.isRemovingShapes = false;
    }

    /**
     * Updates the gravity for all shapes.
     * @param {number} gravity - The new gravity value.
     */
    updateShapesGravity(gravity) {
        this.shapes.forEach(shape => {
            if (shape) {
                shape.vy = gravity;
            }
        });
    }

    /**
     * Handles mouse clicks on the stage.
     */
    onClick(event) {
        const x = event.data.global.x;
        const y = event.data.global.y;

        if (this.appState.isRemovingShapes) return;

        const rectWidth = this.isMobile ? window.innerWidth * 0.8 : 700;
        const rectHeight = 500;
        const rectX = (this.app.screen.width - rectWidth) / 2;
        const rectY = 50;

        if (x >= rectX && x <= rectX + rectWidth && y >= rectY && y <= rectY + rectHeight) {
            const clickedShape = this.shapes.find(shape => shape.containsPoint(event.data.global));

            if (!clickedShape) {
                this.createRandomShape(x, y);
            }
        }
    }

    /**
     * Removes a shape when clicked
     */
     removeShape(event) {
         this.appState.isRemovingShapes = true; // Set flag to prevent new shapes during removal

         const shape = event.target;
         this.app.stage.removeChild(shape);
         const shapeIndex = this.shapes.indexOf(shape);
         if (shapeIndex > -1) {
             this.shapes.splice(shapeIndex, 1);
         }
         this.updateStats(-1);
         this.appState.totalSurfaceArea -= this.calculateShapeArea(shape);
         this.updateSurfaceArea();

         setTimeout(() => {
             this.appState.isRemovingShapes = false; // Reset flag after a delay
         }, 300);
     }

     /**
      * Function to create a random shape
      */
     createRandomShape(x, y) {
         const shapeTypes = ['triangle', 'rectangle', 'pentagon', 'hexagon', 'circle', 'ellipse', 'star', 'irregular'];
         const randomType = shapeTypes[Math.floor(Math.random() * shapeTypes.length)];
         const color = Math.random() * 0xffffff;

         const shape = new PIXI.Graphics();
         shape.beginFill(color);

         switch (randomType) {
             case 'triangle':
                 shape.drawPolygon([0, -20, -20, 20, 20, 20]);
                 break;
             case 'rectangle':
                 shape.drawRect(-20, -20, 40, 40);
                 break;
             case 'pentagon':
                 shape.drawPolygon([0, -30, -28, -10, -18, 25, 18, 25, 28, -10]);
                 break;
             case 'hexagon':
                 shape.drawPolygon([0, -30, -26, -15, -26, 15, 0, 30, 26, 15, 26, -15]);
                 break;
             case 'circle':
                 shape.drawCircle(0, 0, 20);
                 break;
             case 'ellipse':
                 shape.drawEllipse(0, 0, 30, 20);
                 break;
             case 'star':
                 shape.drawPolygon([
                     0, -30, 11, -11, 30, -11,
                     16, 4, 20, 25, 0, 14,
                     -20, 25, -16, 4, -30, -11,
                     -11, -11
                 ]);
                 break;
             case 'irregular':
                 const numPoints = Math.floor(Math.random() * 6) + 5;
                 const points = [];
                 for (let i = 0; i < numPoints; i++) {
                     const angle = Math.random() * Math.PI * 2;
                     const radius = Math.random() * 30 + 10;
                     points.push(radius * Math.cos(angle), radius * Math.sin(angle));
                 }
                 shape.drawPolygon(points);
                 break;
         }

         shape.endFill();
         shape.x = x;
         shape.y = y;
         shape.vy = this.appState.gravity; // Ensure gravity is set correctly
         shape.interactive = true;
         shape.buttonMode = true;
         shape.on('pointerdown', this.removeShape); // Use the bound method

         this.shapes.push(shape);
         this.app.stage.addChild(shape);
         this.updateStats(1);
         this.updateSurfaceArea();
     }

    /**
     * Updates the stats displayed on the page.
     * @param {number} change - The amount to change the shape count by.
     */
    updateStats(change) {
        this.appState.shapeCount += change;
        document.getElementById('shapeCount').innerText = this.appState.shapeCount;
    }

    /**
     * Updates the surface area value.
     */
    updateSurfaceArea() {
        document.getElementById('surfaceArea').innerText = this.calculateTotalSurfaceArea().toFixed(2);
    }

    /**
     * Function to calculate the total surface area
     */
    calculateTotalSurfaceArea() {
        let totalArea = 0;
        for (let shape of this.shapes) {
            totalArea += this.calculateShapeArea(shape);
        }
        return totalArea;
    }

    /**
     * Function to calculate the area of a shape
     */
    calculateShapeArea(shape) {
        let area = 0;

        if (shape.geometry && shape.geometry.graphicsData.length > 0) {
            const data = shape.geometry.graphicsData[0];

            if (data.shape instanceof PIXI.Circle) {
                const radius = data.shape.radius;
                area = Math.PI * radius * radius;
            } else if (data.shape instanceof PIXI.Rectangle) {
                area = data.shape.width * data.shape.height;
            } else if (data.shape instanceof PIXI.Ellipse) {
                area = Math.PI * (data.shape.width / 2) * (data.shape.height / 2);
            } else if (data.shape instanceof PIXI.Polygon) {
                area = this.calculatePolygonArea(data.shape);
            }
        }

        return area;
    }

    /**
     * Function to calculate area for a polygon shape (e.g., irregular shapes, stars)
     */
    calculatePolygonArea(polygon) {
        const points = polygon.points;
        let area = 0;
        const n = points.length / 2;

        // Checking for valid number of points (must be at least 3)
        if (n < 3) {
            console.error("Polygon must have at least 3 points.");
            return 0;
        }

        // Calculate polygon area using the Shoelace Theorem
        for (let i = 0; i < n; i++) {
            const x1 = points[2 * i];
            const y1 = points[2 * i + 1];
            const x2 = points[2 * ((i + 1) % n)];
            const y2 = points[2 * ((i + 1) % n) + 1];
            area += x1 * y2 - x2 * y1;
        }

        area = Math.abs(area) / 2;
        return area;
    }
}

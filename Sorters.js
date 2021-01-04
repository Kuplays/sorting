/*
Helper method for random values in a range.
@param min: lower bound value.
@param max: upper bound value.
*/
let randValueRange = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
/*
Basic storage utility class.
Stores prints of an array`s state
on any change in the element order.
*/
class PrintStorage {
    prints = [];

    /*
    Pushes copy of an array condition
    using JSON stringify to make copies of 
    item objects as well.
    @param print: an array representing current 
                  animation state.
    */
    pushTimedPrint = (print) => {
        this.prints.push(JSON.parse(JSON.stringify(print)));
    }

    /*
    clears current prints state.
    */
    clearPrints = () => {
        this.prints = [];
    }
}

/*
Basic Item class for visualization
purposes.
Holds a value and a flag whether it is
being selected or not.
*/
class Item {
    /*
    Basic constructor for an item
    @param value: numeric value of an
                  array element.
    @param selected: boolean state of
                     current selected element.
    */
    constructor(value, selected) {
        this.value = value;
        this.selected = selected;
    }

    /*
    static method to compare two items
    in sorting algorithms
    @param itemA: object of class Item.
    @param itemB: object of class Item.

    @return difference between values field
            of two objects.
    */
    static compare(itemA, itemB) {
        return itemA.value - itemB.value;
    }
}

/*
Abstract class for sorting algorithms.
Stores in itself a copy of given array
and provides sort method to override by
children.
*/
class AbstractSorter {
    /*
    Basic constructor which sets up incoming
    array and associates a storage for it.
    @param values: numeric array to sort.
    @param printStorage: new storage object to
                         hold different states.
    */
    constructor(values, printStorage) {
        /*
        Forbids instantiation of an object as
        AbstractSorter making it as an abstract class.
        */
        if (this.constructor === AbstractSorter) {
            throw new TypeError("Abstract class instantiation");
        }

        this.values = values.map((x) => x);
        this.printStorage = printStorage;
        this.printStorage.pushTimedPrint(this.values);
    }

    /*
    Sort method which is required by
    subclasses to implement. 
    */
    sort = () => {
        throw new TypeError("Method implementation required");
    }

    /*
    Helper setter method. Sets values in
    sorter object to new data.
    @param newVals: new given data of class Item.
    */
    setValues(newVals) {
        this.printStorage.clearPrints();
        this.values = JSON.parse(JSON.stringify(newVals));
        this.printStorage.pushTimedPrint(this.values);
    }
}

/*
Insertion Sort algorithm.
Inherits from AbstractSorter.
*/
class InsertSort extends AbstractSorter {
    /*
    Basic constructor which calls superclass constructor
    of AbstractSorterClass to set its fields.
    */
    constructor(values, printStorage) {
        super(values, printStorage);
    }

    /*
    Sorting method inherited from base class.
    Performs insertion sort on a collection of
    numbers. O(N^2).
    */
    sort = () => {
        let arrayLength = this.values.length;
        for (let i = 0; i < arrayLength - 1; i++) {
            let placeIndex = i;
            this.values[i].selected = true;
            this.printStorage.pushTimedPrint(this.values);
            this.values[i].selected = false;
            for (let j = i + 1; j < arrayLength; j++) {
                if (Item.compare(this.values[j], this.values[placeIndex]) < 0) {
                    placeIndex = j;
                }
            }

            let temp = this.values[i];
            this.values[i] = this.values[placeIndex];
            this.values[placeIndex] = temp;
        }

        this.printStorage.pushTimedPrint(this.values);
        return this.values;
    }
}

/*
Quick Sort algorithm.
Inherits from AbstractSorter.
*/
class QuickSort extends AbstractSorter {
    /*
    Basic constructor which calls superclass constructor
    of AbstractSorterClass to set its fields.
    */
    constructor(values, printStorage) {
        super(values, printStorage);
    }

    /*
    Sorting method inherited from base class.
    Performs quick sort on a collection of
    numbers. O(NLOG(N)).
    */
    sort = () => {
        this.recursive(0, this.values.length - 1);
    }

    /*
    Sub method for sorting to preserve class
    signature with sort() method. Is called from sort()
    superclass method.
    @param left: left boundary of an array.
    @param right: right boundary of an array.
    */
    recursive = (left, right) => {
        let x = this.values[left];
        let i = left;
        let j = right;

        while(i <= j) {
            while(Item.compare(this.values[i], x) < 0) {
                i++;
                this.values[i].selected = true;
                this.printStorage.pushTimedPrint(this.values);
                this.values[i].selected = false;
            }

            while(Item.compare(this.values[j], x) > 0) {
                j--;
            }

            if (i <= j) {
                let temp = this.values[i];
                this.values[i] = this.values[j];
                this.values[j] = temp;
                i++;
                j--;
                this.printStorage.pushTimedPrint(this.values);
            }
        }

        if (left < j) this.recursive(left, j);
        if (i < right) this.recursive(i, right);
    }
}

/*
Heap Sort algorithm.
Inherits from AbstractSorter.
*/
class HeapSort extends AbstractSorter {
    /*
    Basic constructor which calls superclass constructor
    of AbstractSorterClass to set its fields.
    */
    constructor(values, printStorage) {
        super(values, printStorage);
    }

    /*
    Helper function to build pyramid.
    @param left: left boundary of the array.
    @param right: right boundary of the array.
    */
    buildHeap(left, right) {
        var x = this.values[left];
        var i = left;

        while(true) {
            let j = 2 * i;
            if (j > right) break;
            if ((j < right) && (Item.compare(this.values[j + 1], this.values[j]) >= 0)) {
                j++;
            }

            if (Item.compare(x, this.values[j]) >= 0) break;
            let temp = this.values[i];
            this.values[i] = this.values[j];
            this.values[j] = temp;

            this.values[i].selected = true;
            this.printStorage.pushTimedPrint(this.values);
            this.values[i].selected = false;
            i = j;
        }

        this.values[i] = x;

        this.values[i].selected = true;
        this.printStorage.pushTimedPrint(this.values);
        this.values[i].selected = false;
    }
    /*
    Sorting method inherited from base class.
    Performs heap sort on a collection of
    numbers. O(NLOG(N)).
    */
    sort = () => {
        var left = Math.round(this.values.length / 2);

        while(left >= 0) {
            this.buildHeap(left, this.values.length - 1);
            left--;
        }

        var right = this.values.length - 1;
        while(right >= 0) {
            let temp = this.values[0];
            this.values[0] = this.values[right];
            this.values[right] = temp;
            right--;
            this.buildHeap(0, right);
        }
    }
}

/*
Class for drawing and updating the
canvas which main goal is to separate
drawing logic from sorting logic.
*/
class CanvasUpdate {
    static TIME_DELAY = 10; //animation delay in ms.
    spacing = 1; //space between two columns.

    /*
    Basic constructor.
    @param canvas: Canvas reference from HTML.
    @param abstractSorter: sorter object reference.
    @param ctx: 2D context reference.
    */
    constructor(canvas, abstractSorter, ctx) {
        this.canvas = canvas;
        this.sorter = abstractSorter;
        this.ctx = ctx;
        this.elementWidth = 0; //basic element width will scale with size.
    }

    /*
    Helper method to draw text in
    given coordinates.
    @param x: X coordinate.
    @param y: Y coordinate.
    @param text: string of text to display.
    */
    drawText = (x, y, text) => {
        this.ctx.save();
        this.ctx.font = "10px Times New Roman";
        this.ctx.translate(x + 10, y + 10);
        this.ctx.rotate(-Math.PI/2);
        this.ctx.fillStyle = "white";
        this.ctx.fillText(text, 0, 0);
        this.ctx.restore();
    }

    /*
    Main draw method. Takes all prints
    accumulated while sorting and draw them
    on canvas with timed out animation.
    */
    update = () => {
        var self = this;
        self.elementWidth = Math.round( (this.canvas.width - this.spacing * this.sorter.values.length - 10) / this.sorter.values.length );

        let timedPrints = this.sorter.printStorage.prints;
        var gradient = ctx.createLinearGradient(0, 0, this.canvas.width, this.canvas.height);
        gradient.addColorStop(0, "rgb(255, 0, 0)");
        gradient.addColorStop(1, "rgb(0, 0, 255)");

        for (let i = 0; i < timedPrints.length; i++) {
            setTimeout(function timer() {
                ctx.fillStyle = "black";
                ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
                let print = timedPrints[i];
                let xCoord = 10;
                for (let j = 0; j < print.length; j++) {
                    let height = print[j].value;
                    if (print[j].selected === true) {
                        ctx.save();
                        ctx.fillStyle = "green";
                        ctx.fillRect(xCoord, 10, self.elementWidth, height);
                        ctx.restore();
                    } else {
                        ctx.save();
                        ctx.fillStyle = gradient;
                        ctx.fillRect(xCoord, 10, self.elementWidth, height);
                        ctx.restore();
                    }

                    //Drawing numbers in cases > 100 is nearly unreadable.
                    if (print.length < 100)
                        self.drawText(xCoord, height + 30, height);

                    xCoord += (self.elementWidth + self.spacing);
                }
            }, i * CanvasUpdate.TIME_DELAY);
        }
    }

    /*
    Setter method to set a new sorter reference.
    @param newSorter: new Sorter object reference.
    */
    setSorter = (newSorter) => this.sorter = newSorter;
}

/*
Static factory helper class.
Used for instantiation of sorter
objects and provide separation between
creation of objects and use of them. 
*/
class SortersFactory {
    /*
    Static method which constructs and returns
    new instance of sorter object.
    @param type: String type of a sorter object needed.
    @param vals: an array of values (class Item) to copy
                 into new instance.
    */
    static getInstance(type, vals) {
        let abstractSorter;
        switch(type) {
            case "insert_sort":
                abstractSorter = new InsertSort([...vals], new PrintStorage());
                break;
            case "quick_sort":
                abstractSorter = new QuickSort([...vals], new PrintStorage());
                break;
            case "heap_sort":
                abstractSorter = new HeapSort([...vals], new PrintStorage());
                break;
        }

        return abstractSorter;
    }
}
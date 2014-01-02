##Overview

TextMetrics is a small library that provides text measurement using canvas. It is pretty much equivalent to https://github.com/Pomax/fontmetrics.js but has slightly different API and supports caching by default (including localStorage cache).

There is a demo in /demo folder, unfortunately I haven't had time to properly integrate it as GH page.

##Downloads
Current version is 0.8.2.  
You can get it in [full](dist/textmetrics-0.8.2.js) or [minified](dist/textmetrics-0.8.2.min.js) form.

##Dependencies
The only dependencies are DOM APIs.  
Mandatory: `<canvas>`.  
Optional: `localStorage`.  

##Usage
There are two main functions exported, both of which can be accessed through `TextMetrics` object.

### TextMetrics.measureHeight
    TextMetrics.measureHeight(text, fontFamily, fontSize, options)
    
    Measures height for the given text according to arguments provided.
    Parameters:
        text        String   Text to measure.
        fontFamily  String   Font to use.
        fontSize    Number   Font size (in pixels).
        options     Object   (Optional) { 
            cache   Boolean  Whether to use cache. Default: true.
                             Using cache should be faster, but might be less precise.
        }

    Returns Object {
        top         Number   Y-coordinate of the highest point of the text.
        bottom      Number   Y-coordinate of the lowest point of the text.
        box         Number   Total height of the box that would be normally used by the text (e.g. default span height).
    }

### TextMetrics.fitHeight
    TextMetrics.fitHeight(text, boxHeight, fontFamily, options)
    
    Finds the maximum font size and margin that can fit in a given box.
    Parameters:
        text        String   Text to fit.
        boxHeight   Number   Height of the box to fit text into.
        fontFamily  String   Font to use.
        options     Object   (Optional) { 
            cache   Boolean  Whether to use cache. Default: true.
                             Using cache should be faster, but might be less precise.
        }

    Returns Object {
        fontSize    Number   Maximum font size that would fit provided boxHeight.
        marginTop   Number   Margin required to balance the difference between text top and box top (normally negative).
    }

### Other functions
TextMetrics also exports `measureWidth` function, but it is at the moment equivalent to the result of `canvas.measureText` and not really recommended to be used at the moment.

##Roadmap
I can't guarantee I will have much time to implement these, but here is a list of potential improvements:

* Support font style and font weight
* Add proper width measurement (potentially with the same algorithm, or using `measureText` if it is good enough)
* Better fitting precision
* Support different line heights
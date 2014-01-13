##Note

This library currently does not work in Firefox.
http://stackoverflow.com/questions/20880683/how-to-work-around-firefox-canvas-text-rendering-bug

##Overview

TextMetrics is a small library that provides text measurement using canvas. It is pretty much equivalent to https://github.com/Pomax/fontmetrics.js but has slightly different API and supports caching by default (including localStorage cache).

There is a demo in `/demo` folder, unfortunately I haven't had time to properly integrate it as GH page.

##Downloads
Current version is 0.8.3.  
You can get it in [full](dist/textmetrics-0.8.3.js) or [minified](dist/textmetrics-0.8.3.min.js) form.

##Dependencies
The only dependencies are DOM APIs.  
Mandatory: `<canvas>`.  
Optional: `localStorage`, `JSON`.  

##Usage
There are three main functions exported, all of which can be accessed through `TextMetrics` object.  
Note that `TextMetrics` conflicts with https://developer.mozilla.org/en/docs/Web/API/TextMetrics, so I'll probably rename it at some point.

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

### TextMetrics.resetCache
    TextMetrics.resetCache()

    Resets the internal size cache -- might be useful for prototyping when you are trying multiple fonts.

### Other functions
TextMetrics also exports `measureWidth` function, but it is at the moment equivalent to the result of `canvas.measureText` and not really recommended to be used at the moment.

##Gotchas
* Make sure the font is loaded (e.g. use https://github.com/typekit/webfontloader instead of a CSS `@include` for Google fonts). If you measure font that has not loaded, you may get very weird results (and if those are cached in `localStorage`, things would be even weirder).
* Note that `font-style` and `font-weight` are not currently supported.
* Note that `line-height` different from `normal` is not currently supported.
* Note that measuring of multiline text is not currently supported.

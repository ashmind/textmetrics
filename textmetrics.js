/*
 * TextMetrics 0.8.0
 *
 * Copyright (c) 2013 Andrey Shchekin
 * Dual-licensed under MIT/BSD.
  */

this.TextMetrics = (function() {
    "use strict";

    var cacheKey = '__TextMetrics_cache__';
    var cache = loadOrCreateCache();
    var cacheChanged = false;
    var cacheFontSize = 100;

    var canvasSize = { width: 500, height: 500 };
    var context = createCanvasContext();
  
    var span = createSpan();

    var exports = {};
    /** Measures height metrics for a given text. */
    exports.measureHeight = function(text, fontFamily, fontSize, options) {
        options = options || {};
        options.cache = options.cache !== undefined ? options.cache : true;

        var result = { bottom: 0, top: 10000 };

        var cacheForFont;
        if (options.cache) {
            cacheForFont = getCacheForFont(fontFamily);
            var baseBoxHeight = cacheForFont.boxHeight;
            if (!baseBoxHeight) {
                baseBoxHeight = getBoxHeightUncached(text, fontFamily, cacheFontSize);
                cacheForFont.boxHeight = baseBoxHeight;
            }
            result.box = Math.floor(baseBoxHeight * (fontSize / cacheFontSize));
        }
        else {
            result.box = getBoxHeightUncached(text, fontFamily, fontSize);
        }

        var allWhiteSpace = true;
        for (var i = 0; i < text.length; i++) {
            var letter = text.charAt(i);
            if (isWhiteSpace(letter))
                continue;

            allWhiteSpace = false;
            var letterHeight = getLetterHeight(letter, fontFamily, fontSize, cacheForFont);
            result.top = Math.min(result.top, letterHeight.top);
            result.bottom = Math.max(result.bottom, letterHeight.bottom);
        }
        if (options.cache)
            saveCacheIfChanged();

        if (allWhiteSpace) {
            result.top = 0;
            result.bottom = result.box;
        }    
        
        return result;
    };

    /** Fits given text height into a given box height. */
    exports.fitHeight = function(text, boxHeight, fontFamily, options) {
        var measuredFontSize = cacheFontSize;
        var metrics = exports.measureHeight(text, fontFamily, measuredFontSize, options);
        var measuredTextHeight = metrics.bottom - metrics.top;
        
        return {
            fontSize:  Math.floor(measuredFontSize * (boxHeight / measuredTextHeight)),
            marginTop: Math.floor(-(metrics.top) * (boxHeight / measuredTextHeight))
        };
    };

    /** Measures width metrics for a given text. */
    exports.measureWidth = function(text, fontFamily, fontSize) {
        context.font = fontSize + 'px ' + fontFamily;
        return {
            box: context.measureText(text).width
        };
    };
  
    function loadOrCreateCache() {    
        var cacheString = localStorage.getItem(cacheKey);
        if (!cacheString)
            return {};
    
        return JSON.parse(cacheString);
    }
  
    function saveCacheIfChanged() {
        if (!cacheChanged)
            return;
    
        localStorage.setItem(cacheKey, JSON.stringify(cache));
        cacheChanged = false;
    }
  
    function createCanvasContext() {
        var canvas = document.createElement('canvas');
        canvas.width = canvasSize.width;
        canvas.height = canvasSize.height;
        var context = canvas.getContext('2d');
        context.textBaseline = 'top';
        return context;
    }
  
    function createSpan() {
        var wrapper = document.createElement('div');
        wrapper.style.position = 'absolute';
        wrapper.style.visibility = 'hidden';    
        var span = document.createElement('span');        
        wrapper.appendChild(span);
        document.body.appendChild(wrapper);
        return span;
    }

    function getCacheForFont(fontFamily) {
        var cacheForFont = cache[fontFamily];
        if (!cacheForFont) {
            cacheForFont = {};
            cache[fontFamily] = cacheForFont;
        }

        return cacheForFont;
    }
  
    function getLetterHeight(letter, fontFamily, fontSize, cacheForThisFont) {
        if (!cacheForThisFont) // caching disabled
            return getLetterHeightUncached(letter, fontFamily, fontSize);

        var baseMetrics = cacheForThisFont[letter];
        if (!baseMetrics) {            
            baseMetrics = getLetterHeightUncached(letter, fontFamily, cacheFontSize);            
            cacheForThisFont[letter] = baseMetrics;
            cacheChanged = true;
        }
    
        return {
            top:    Math.floor(baseMetrics.top   * (fontSize / cacheFontSize)),
            bottom: Math.floor(baseMetrics.bottom * (fontSize / cacheFontSize))
        };
    }

    function isWhiteSpace(letter) {
        return letter === '\u0020' 
            || letter === '\u0009'
            || letter === '\u000A'
            || letter === '\u000C'
            || letter === '\u000D';
    }
  
    function getLetterHeightUncached(letter, fontFamily, fontSize) {
        context.clearRect(0, 0, canvasSize.width, canvasSize.height);
        context.font = fontSize + 'px ' + fontFamily;
        context.fillText(letter, 0, 0);
    
        var letterWidth = context.measureText(letter).width;
        var imageData = context.getImageData(0, 0, letterWidth, canvasSize.height);   
    
        var data = imageData.data;
    
        var firstPixelY = 0;
        for (var i = 0; i < data.length; i += 4) {      
            if (data[i+3] !== 0) {
                firstPixelY = Math.floor((i / 4) / imageData.width);
                break;
            }
        }

        var lastPixelY = 0;
        for (var i = data.length-4; i >= 0; i -= 4) {
            if (data[i+3] !== 0) {
                lastPixelY = Math.floor((i / 4) / imageData.width);
                break;
            }
        }
    
        return { top: firstPixelY, bottom: lastPixelY };
    }
  
    function getBoxHeightUncached(letter, fontFamily, fontSize) {
        span.textContent = letter;
        span.style.fontFamily = fontFamily;
        span.style.fontSize = fontSize + 'px';
        return span.offsetHeight;
    }
    
    return exports;
})();
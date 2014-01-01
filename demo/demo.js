(function measureDemo($) {
    var $canvas = $('#demo-measure');
    var context = $canvas[0].getContext('2d');
    redraw();
    $('#measure input').on('change keyup', function() {
        redraw();
    });

    function redraw() {
        context.clearRect(0, 0, $canvas[0].width, $canvas[0].height);
    
        var text = $('#measure [name=text]').val();
        var fontSize = $('#measure [name=size]').val();
        var fontFamily = $('#measure [name=font]').val();
        var cache = $('#measure [name=cache]').prop('checked');
  
        context.font = fontSize + 'px ' + fontFamily;

        var heightMetrics = TextMetrics.measureHeight(text, fontFamily, fontSize, { cache: cache });
        console.log('Measure:', heightMetrics);
        var width = context.measureText(text).width;

        context.textBaseline = 'top'
        context.fillText(text, 0, 0);
        metricLine(0, heightMetrics.top, 'green');
        metricLine(0, heightMetrics.bottom, 'red');
        metricLine(0, heightMetrics.box, 'black');
  
        function metricLine(x, y, style) {
            context.strokeStyle = style; 
            context.beginPath();
            context.moveTo(x, y);
            context.lineTo(x + width, y);
            context.closePath();
            context.stroke();
        };
    }
})(jQuery);

(function fitDemo($) {
    var $div = $('#demo-fit');
    refit();
    $('#fit input').on('change keyup', function() {
        refit();
    });

    function refit() {
        var text = $('#fit [name=text]').val();
        var height = $('#fit [name=height]').val();
        var fontFamily = $('#fit [name=font]').val();
        var cache = $('#fit [name=cache]').prop('checked');
  
        var fit = TextMetrics.fitHeight(text, height, fontFamily, { cache: cache });
        console.log('Fit:', fit);

        $div.height(height)
            .css({
                fontFamily: fontFamily,
                fontSize: fit.fontSize + 'px'
            })
            .find('span')
            .css('marginTop', fit.marginTop)
            .text(text);
    }
})(jQuery);
(function($) {
    setupMeasureDemo();
    setupFitDemo();

    function setupMeasureDemo() {
        var $canvas = $('#demo-measure');
        
        redraw();
        $('#common input, #measure input').on('change keyup', function() {
            redraw();
        });

        function redraw() {            
            var s = getCommonSettingsAnd({
                fontSize: $('#measure [name=font-size]').val()
            });

            var heightMetrics = TextMetrics.measureHeight(s.text, s.fontFamily, s.fontSize, { cache: s.cache });
            console.log('Measure:', heightMetrics);

            $canvas[0].height = heightMetrics.box;

            var context = $canvas[0].getContext('2d');
            context.font = s.fontSize + 'px ' + s.fontFamily;
            var width = context.measureText(s.text).width;

            context.textBaseline = 'top'
            context.fillText(s.text, 0, 0);
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
    };

    function setupFitDemo() {
        var $div = $('#demo-fit');
        refit();
        $('#common input, #fit input').on('change keyup', function() {
            refit();
        });

        function refit() {
            var s = getCommonSettingsAnd({
                boxHeight: $('#fit [name=box-height]').val()
            });
              
            var fit = TextMetrics.fitHeight(s.text, s.boxHeight, s.fontFamily, { cache: s.cache });
            console.log('Fit:', fit);

            $div.height(s.boxHeight)
                .css({
                    fontFamily: s.fontFamily,
                    fontSize: fit.fontSize + 'px'
                })
                .find('span')
                .css('marginTop', fit.marginTop)
                .text(s.text);
        }
    };

    function getCommonSettingsAnd(uncommon) {
        return $.extend({
            text: $('#common [name=text]').val(),
            fontFamily: $('#common [name=font-family]').val(),
            //lineHeight: $('#common [name=line-height]').val(),
            cache: $('#common [name=cache]').prop('checked')
        }, uncommon);
    }
})(jQuery);
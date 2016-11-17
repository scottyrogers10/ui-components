BASE.require([
    "jQuery",
    "BASE.web.animation.PercentageTimeline",
    "BASE.web.animation.ElementAnimation"
], function () {

    BASE.namespace("app.components.material");

    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var ElementAnimation = BASE.web.animation.ElementAnimation;

    var createRotatingAnimation = function (spinnerElement) {
        var rotatingAnimation = new ElementAnimation({
            target: spinnerElement,
            easing: "linear",
            properties: {
                rotateZ: {
                    from: "0deg",
                    to: "360deg"
                }
            }
        });

        var timeline = new PercentageTimeline(1000);

        timeline.add({
            animation: rotatingAnimation,
            startAt: 0,
            endAt: 1
        });

        return timeline;
    };

    app.components.material.Spinner = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var rotatingAnimation = createRotatingAnimation($elem[0]);

        var init = function () {
            var config = {
                size: $elem.attr("size"),
                color: $elem.attr("color")
            };

            self.setConfig(config);
            rotatingAnimation.repeat = Infinity;
            self.play();
        };

        self.setConfig = function (config) {
            var size = config.size || 40;
            var color = config.color || "#2196f3";
            var thickness = Math.floor(size / 12);

            $elem.css({
                "width": size + "px",
                "height": size + "px",
                "border": thickness + "px " + "solid " + "transparent",
                "border-top": thickness + "px " + "solid " + color
            });
        };

        self.play = function () {
            rotatingAnimation.playToEndAsync().try();
        };

        self.pause = function () {
            rotatingAnimation.pause();
        };

        init();
    };
});
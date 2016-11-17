BASE.require([
    "jQuery",
    "BASE.web.animation.ElementAnimation",
    "BASE.web.animation.PercentageTimeline"
], function () {

    BASE.namespace("app.components.material");

    var ElementAnimation = BASE.web.animation.ElementAnimation;
    var PercentageTimeline = BASE.web.animation.PercentageTimeline;

    var createRippleAnimation = function (ripple) {
        var rippleAnimation = new ElementAnimation({
            target: ripple,
            easing: "linear",
            properties: {
                "scaleX": {
                    from: 0,
                    to: 1.5
                },
                "scaleY": {
                    from: 0,
                    to: 1.5
                }
            }
        });

        var fadeOutAnimation = new ElementAnimation({
            target: ripple,
            easing: "linear",
            properties: {
                "opacity": {
                    from: .25,
                    to: 0
                }
            }
        });

        var timeline = new PercentageTimeline(450);

        timeline.add({
            animation: rippleAnimation,
            startAt: 0,
            endAt: .40
        })

        timeline.add({
            animation: fadeOutAnimation,
            startAt: .40,
            endAt: 1
        });

        return timeline;
    };

    app.components.material.IconButton = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $iconContainer = $(tags["icon-container"]);
        var $icon = $(tags["icon"]);
        var $ripple = null;

        var iconSize = null;
        var rippleColor = null;
        var rippleAnimation = null;

        var createRippleElement = function () {
            $ripple = $("<div></div>");
            $ripple.css({
                "position": "absolute",
                "top": 0,
                "left": 0,
                "transform": "scale(0, 0)",
                "opacity": .20,
                "border-radius": "50%",
                "width": iconSize + "px",
                "height": iconSize + "px",
                "background-color": rippleColor,
                "z-index": 0
            });

            $iconContainer.append($ripple);
            rippleAnimation = createRippleAnimation($ripple[0]);
        };
        
        var init = function () {
            var config = {
                icon: $elem.attr("icon"),
                color: $elem.attr("color"),
                rippleColor: $elem.attr("ripple-color"),
                size: $elem.attr("size")
            };

            self.setConfig(config);
        };

        self.setConfig = function (config) {
            var icon = config.icon || "";
            var color = config.color || "#424242";
            var size = config.size || "14";
            rippleColor = config.rippleColor || "#000";

            $icon.html(icon);
            $icon.css({
                "color": color,
                "font-size": size + "px"
            });

            var iconWidth = $icon.width();
            var iconHeight = $icon.height();
            iconSize = Math.max.apply(Math, [iconWidth, iconHeight]);

            $iconContainer.css({
                "width": iconSize + "px",
                "height": iconSize + "px",
                "line-height": iconSize + "px",
                "text-align": "center"
            });

        };

        $elem.on("touchstart mousedown", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if (!$ripple) {
                createRippleElement();
            }

            rippleAnimation.seek(0).playToPercentageAsync(45).try();
        });

        $elem.on("touchend mouseup mouseleave", function (evt) {
            evt.stopPropagation();
            evt.preventDefault();

            if ($ripple) {
                rippleAnimation.playToEndAsync().chain(function () {
                    $ripple.css({
                        "opacity": .25,
                        "transform": "scale(0, 0)"
                    });
                }).try();
            }
        });

        init();
    };
});
BASE.require([
    "jQuery",
    "BASE.web.animation.PercentageTimeline",
    "BASE.web.animation.ElementAnimation"
], function () {

    BASE.namespace("app.components.material");

    var PercentageTimeline = BASE.web.animation.PercentageTimeline;
    var ElementAnimation = BASE.web.animation.ElementAnimation;

    var createScaleAnimation = function (element) {
        var scaleAnimation = new ElementAnimation({
            target: element,
            properties: {
                scaleX: {
                    from: "0",
                    to: "1"
                },
                scaleY: {
                    from: "0",
                    to: "1"
                }
            },
            easing: "easeOutQuad"
        });

        var timeline = new PercentageTimeline(100);

        timeline.add({
            animation: scaleAnimation,
            startAt: 0,
            endAt: 1
        });

        return timeline;
    };

    app.components.material.Radio = function (elem, tags, services) {
        var self = this;
        var $elem = $(elem);
        var $label = $(tags["label"]);
        var $checkedIcon = $(tags["checked-icon"]);
        var $uncheckedIcon = $(tags["unchecked-icon"]);

        var changeState = null;
        var scaleAnimation = createScaleAnimation($checkedIcon[0]);

        var radioStateMachine = {
            checked: function () {
                scaleAnimation.seek(0).playToEndAsync().try();
                changeState = "unchecked";
            },
            unchecked: function () {
                scaleAnimation.seek(1).reverseToStartAsync().try();
                changeState = "checked";
            }
        };

        var init = function () {
            var config = {
                label: $elem.attr("label"),
                labelColor: $elem.attr("label-color"),
                color: $elem.attr("color")
            };

            self.setConfig(config);
            changeState = "unchecked";
        };

        self.setConfig = function (config) {
            var label = config.label || "";
            var labelColor = config.labelColor || "#5b5b5b"
            var color = config.color || "#424242";

            $label.text(label);
            $label.css("color", labelColor);
            $checkedIcon.css("background-color", color);
            $uncheckedIcon.css("color", color);

            $checkedIcon.removeClass("hide");
            $uncheckedIcon.removeClass("hide");
        };

        self.isChecked = function () {
            return changeState === "unchecked" ? true : false;
        };

        $elem.on("click", function () {
            radioStateMachine[changeState]();
        });

        init();
    };
});
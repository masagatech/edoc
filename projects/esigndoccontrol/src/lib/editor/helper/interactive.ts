declare var $: any;

export class Interactive {
    props
    selected: any = {};
    constructor(props) {
        this.props = props;

    }

    draggable(start, drag, stop, scale) {
        let that = this;
        let container = $('#cpage' + that.props.dataset.page);
        $("#" + that.props.id).draggable({
            refreshPositions: true,
            cursor: "move",
            start: function (event, ui) {
                ui.position.left = 0;
                ui.position.top = 0;
                that.selected(this, that.props);
                if (start) {
                    start(event, ui, this);
                }
            },
            drag: function (event, ui) {
                that.dragFix(event, ui, container, scale);
                if (drag) {
                    drag(event, ui, this);
                }
            },
            stop: function (event, ui) {
                that.props.style.left = Math.ceil(parseFloat(this.style.left));
                that.props.style.top = Math.ceil(parseFloat(this.style.top));
                this.style.left = that.props.style.left + 'px';
                this.style.top = that.props.style.top + 'px';
                if (stop) {
                    stop(event, ui, this);
                }
            }
        })

    }

    dragFix(event, ui, containmentArea, scale) {
        var contWidth = containmentArea.width() - 12,
            contHeight = containmentArea.height() - 2;

        console.log(contWidth, contHeight, ui.position.left, scale, Math.min(ui.position.left / scale, contWidth - ui.helper.width()));
        ui.position.left = Math.max(0, Math.min(ui.position.left / scale, contWidth - ui.helper.width()));
        ui.position.top = Math.max(0, Math.min(ui.position.top / scale, contHeight - ui.helper.height()));


    }


    _resizable(control, start, stop) {
        if (!control.resize) return;
        let container = $('#cpage' + this.props.dataset.page);
        let that = this;
        $("#" + this.props.id).resizable({
            ...control.resize,
            containment: container,
            start: function (el) {

                that.selected(this, that.props);
                if (start) {
                    start(el);
                }
            },
            stop: function (el) {
                let height = Math.ceil(parseFloat(this.style.height));
                let width = Math.ceil(parseFloat(this.style.width));
                this.style.height = height + 'px';
                this.style.width = width + 'px';
                that.props.style.width = width;
                that.props.style.height = height;

                if (stop) {
                    stop(el, width, height);
                }
            }
        })
    }



}
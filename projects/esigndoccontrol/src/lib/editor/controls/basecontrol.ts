import { Interactive } from "../helper/interactive";
declare var $: any;
export class BaseControl extends Interactive {

    constructor(props) {
        super(props)
    }

    protected _appendToPage(pageno, control) {
        $('#cpage' + pageno).append(control.design)
        let that = this;
        let ctrl = $('#' + this.props.id);
        ctrl.bind('click', function (e) {
            e.preventDefault();
            that.selected(this, that.props);
            return false;
        });
        ctrl.bind('mouseover', function (e) {
            e.preventDefault();
            this.dataset.tip = ((this.dataset.type === 'radio' || this.dataset.type === 'checkbox') ? this.dataset.name + ' - ' + this.dataset.value :
                (this.dataset.type === 'text' ? this.dataset.name + '-' + this.dataset.fieldtype : this.dataset.name))
                + '' + (this.dataset.require ? ' - Require' : '');

            // this.title = (this.dataset.type === 'radio' || this.dataset.type === 'checkbox') ? this.dataset.name + ' - ' + this.dataset.value :
            //     (this.dataset.type === 'text' ? this.dataset.name + '-' + this.dataset.fieldtype : this.dataset.name);
            return false;
        })

        ctrl.bind("contextmenu", function (e) {
            that.selected(this, that.props);
        });
    }


}
import { BaseControl } from './basecontrol'

export class Textbox extends BaseControl {
    controlTemplate: any;
    constructor(props, style) {
      
        super(props)
       
        style = style || {
            'fontFamily': 'Arial',
            'fontSize': 12,
            'fontStyle': 'normal',
            'fontWeight': 'normal',
            'width': 100,
        }
        props.dataset.fieldtype = props.dataset.fieldtype || 'none';
        props.style = { ...style, ...props.style };
        props.text = props.text || 'TextBox';
        props.dataset.maxlength = props.dataset.maxlength || 1000;
        props.dataset.require = props.dataset.require || true;

    }

    add(pageno?: number) {
        pageno = pageno || this.props.dataset.page;
        this.controlTemplate = this.generateTemplate(this.props);
        this._appendToPage(pageno, this.controlTemplate);
    }

    private generateTemplate(prop) {
        const design = '<div  data-readonly="' + prop.dataset.readonly + '" data-require="' + prop.dataset.require + '" data-fieldtype="' + prop.dataset.fieldtype + '"  data-name="' + prop.dataset.name + '"  data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp qtip tip-top" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px"><span>' + prop.text + '</span></div>';
        const resize = {
            minWidth: 50,
            maxWidth: 400,
            resize: function (event, ui) {
                ui.size.height = ui.originalSize.height;
            }
        }

        return {
            design: design,
            resize: resize
        }
    }

    resizable(start, stop) {
        this._resizable(this.controlTemplate, start, stop);
    }



}
import { BaseControl } from './basecontrol'

export class Note extends BaseControl {
    controlTemplate: any;
    constructor(props, style) {
        super(props)

        style = style || {
          'width': 130,
          'height': 15,
          'fontFamily': 'Arial',
          'fontSize': 12,
          'fontStyle': 'normal',
          'fontWeight': 'normal'
        }
  
        props.style = { ...props.style, ...style };
        props.text = props.text || 'Note';
        props.dataset.require = props.dataset.require || true;
        props.dataset.maxlength = props.dataset.maxlength || 4000;
    }

    add(pageno?: number) {
        pageno = pageno || this.props.dataset.page;
        this.controlTemplate = this.generateTemplate(this.props);
        this._appendToPage(pageno, this.controlTemplate);
    }

    private generateTemplate(prop) {
      const design = '<div data-readonly="' + prop.dataset.readonly + '" data-require="' + prop.dataset.require + '" data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp qtip tip-top" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><span>' + prop.text + '</span></div>';
      const resize = {
        minWidth: 80,
        minHeight: 15,
        maxHeight: 300,
        maxWidth: 'auto'
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
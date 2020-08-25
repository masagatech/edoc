import { BaseControl } from './basecontrol'

export class QRCode extends BaseControl {
  controlTemplate: any;
  constructor(props, style) {
    super(props)

    style = style || {
      'width': 80,
      'height': 80
    };
    props.text = props.text || 'Q Text';
    props.style = { ...props.style, ...style };
  }

  add(pageno?: number) {
    pageno = pageno || this.props.dataset.page;
    this.controlTemplate = this.generateTemplate(this.props);
    this._appendToPage(pageno, this.controlTemplate);
  }

  private generateTemplate(prop) {
    const design = '<div data-require="' + prop.dataset.require + '"  data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp qtip tip-top justifycenter" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><i class="fa fa-qrcode"></i></div>';
    const resize = {
      minWidth: 80,
      maxWidth: 140,
      maxHeight: 140,
      minHeight: 80
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
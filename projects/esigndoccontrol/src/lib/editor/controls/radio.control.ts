import { BaseControl } from './basecontrol'

export class Radio extends BaseControl {
  controlTemplate: any;
  constructor(props, style) {
    super(props)

    style = style || {
      'width': 80,
      'height': 80
    };
    props.style = { ...props.style, ...style };
    props.dataset.require = props.dataset.require || true;

  }

  add(pageno?: number) {
    pageno = pageno || this.props.dataset.page;
    this.controlTemplate = this.generateTemplate(this.props);
    this._appendToPage(pageno, this.controlTemplate);
  }

  private generateTemplate(prop) {
    const design = '<div data-value="' + prop.dataset.value + '" data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" data-group="' + prop.dataset.group + '" id="' + prop.id + '" class="defaultcomp qtip tip-top radio" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;"><input type="radio" tabindex="-1" ' + (prop.dataset.checked ? 'checked' : '') + ' readonly name="r' + prop.dataset.group + '" style="pointer-events: none;margin:0;padding:0" /></div>';
    const resize = null

    return {
      design: design,
      resize: resize
    }
  }

  resizable(start, stop) {
    this._resizable(this.controlTemplate, start, stop);
  }



}
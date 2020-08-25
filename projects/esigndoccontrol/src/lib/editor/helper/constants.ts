export class Constants {

    static propFields = {

        'fontFamily': {
            'display': 'Font Family',
            'values': ['Arial', 'Helvetica'],
            'type': 'ddl',
            'dtype': 'style',
            'cast': 'string',
            'append': '',
            'default': 'Arial',
            'group': 'Formatting'
        },
        'fieldtype': {
            'display': 'Field Validate',
            'values': ['none', 'telephone', 'email', 'number', 'letters', 'date'],
            'type': 'ddl',
            'dtype': 'dataset',
            'cast': 'string',
            'append': '',
            'default': 'none',
            'group': 'Type'
        },
        'fontSize': {
            'display': 'Font Size(px)',
            'type': 'number',
            'dtype': 'style',
            'cast': 'string',
            'append': 'px',
            'default': '12',
            'group': 'Formatting'
        }, 'fontStyle': {
            'display': 'Font Style',
            'values': ['normal', 'italic'],
            'type': 'ddl',
            'dtype': 'style',
            'cast': 'string',
            'append': '',
            'default': 'normal',
            'group': 'Formatting'
        }, 'fontWeight': {
            'display': 'Font Weight',
            'values': ['normal', 'bold'],
            'type': 'ddl',
            'dtype': 'style',
            'cast': 'string',
            'append': '',
            'default': 'normal',
            'group': 'Formatting'
        }, 'left': {
            'display': 'Left(px)',
            'type': 'number',
            'dtype': 'style',
            'cast': 'number',
            'append': 'px',
            'default': '0',
            'group': 'Position'

        }, 'top': {
            'display': 'Top(px)',
            'type': 'number',
            'dtype': 'style',
            'cast': 'number',
            'append': 'px',
            'default': '0',
            'group': 'Position'
        }
        , 'require': {
            'display': 'Required',
            'type': 'checkbox',
            'dtype': 'dataset',
            'cast': 'boolean',
            'append': '',
            'default': 'false',
            'group': ''
        }, 'readonly': {
            'display': 'Read Only',
            'type': 'checkbox',
            'dtype': 'dataset',
            'cast': 'boolean',
            'append': '',
            'default': 'false',
            'group': ''
        }, 'width': {
            'display': 'Width(px)',
            'type': 'number',
            'dtype': 'style',
            'cast': 'number',
            'append': 'px',
            'default': '100',
            'group': 'Size'
        }, 'height': {
            'display': 'Height(px)',
            'type': 'number',
            'dtype': 'style',
            'cast': 'number',
            'append': 'px',
            'default': '100',
            'group': 'Size'
        }, 'text': {
            'display': 'Text',
            'dtype': 'prop',
            'type': 'text',
            'cast': 'string',
            'append': '',
            'default': '',
            'group': 'Data'
        }, 'name': {
            'display': 'Property Bind',
            'dtype': 'dataset',
            'type': 'text',
            'cast': 'string',
            'append': '',
            'default': '',
            'Values': '',
            'group': ''
        }, 'value': {
            'display': 'Value',
            'dtype': 'dataset',
            'type': 'text',
            'cast': 'string',
            'append': '',
            'default': '',
            'group': 'Data'
        }, 'checked': {
            'display': 'Default Checked',
            'type': 'checkbox',
            'dtype': 'dataset',
            'cast': 'boolean',
            'append': '',
            'default': 'false',
            'group': 'Data'
        }, 'ddlprop': {
            'display': 'Items',
            'type': 'ddlprop',
            'dtype': 'external',
            'extkey': 'ddlprop',
            'cast': 'list',
            'append': '',
            'default': '',
            'group': 'Data'
        }, 'recipient': {
            'display': 'Assign To',
            'type': 'recipient',
            'dtype': 'external',
            'extkey': 'recipient',
            'cast': 'list',
            'append': '',
            'default': '',
            'group': 'Extra'
        },
        'tooltip': {
            'display': 'Tooltip',
            'dtype': 'dataset',
            'type': 'text',
            'cast': 'string',
            'append': '',
            'default': '',
            'group': 'Tooltip'
        },
        'broptions': {
            'display': 'Type',
            'values': ['CODE128', 'CODE39', 'EAN / UPC', 'ITF', 'MSI', 'Codabar'],
            'type': 'ddl',
            'dtype': 'dataset',
            'cast': 'string',
            'append': '',
            'default': 'CODE128',
            'group': 'Data'
        },
        'label': {
            'display': 'Label',
            'type': 'text',
            'dtype': 'dataset',
            'cast': 'string',
            'append': '',
            'default': '',
            'group': 'Extra'
        },
        'maxlength': {
            'display': 'Maxlength',
            'type': 'number',
            'dtype': 'dataset',
            'cast': 'number',
            'append': '',
            'default': '1000',
            'group': 'Data'
        }
    }

}
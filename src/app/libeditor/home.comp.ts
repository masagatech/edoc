
import { Component, OnInit, ViewChild } from '@angular/core';
import { iDocsigneditorComponent } from 'esigndoccontrol/public-api';

@Component({
    selector: 'app-home',
    templateUrl: './home.comp.html',
    styleUrls: ['./home.comp.scss']
})
export class LibEditorComponent implements OnInit {
    @ViewChild('editor', { static: false }) editor: iDocsigneditorComponent
    options = {
        fonts: []
    }
    recipients = ["All", "Doctor", "Patients"]
    constructor() { }
    pdfSrc = "assets/Medical%20Marijuana%20and%20Telemedicine%20Consent%20(Form).pdf";
    ngOnInit(): void {

        setTimeout(() => {
            this.editor.setData(this.pdfSrc, {});
        }, 5000);
    }

    onObjectSelected(e) {
        //console.log(e);
    }

    onObjectDeselected(e) {
        //console.log('delected',e);
    }
}

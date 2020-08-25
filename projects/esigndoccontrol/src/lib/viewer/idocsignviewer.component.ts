import { Component, Input, OnInit, ChangeDetectorRef, NgModule, Output, EventEmitter } from '@angular/core';

import SignaturePad from 'signature_pad';
import { PDFDocumentProxy, PdfViewerModule } from 'ng2-pdf-viewer';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TabsComponent } from './helper/tabs/tabs.comp';
import { TabComponent } from './helper/tabs/tab.comp';


declare var $: any;
declare var QRCode: any;
declare var JsBarcode: any;
declare var Webcam: any;




@Component({
    selector: 'i-docsignviewer',
    templateUrl: './idocsignviewer.component.html',
    styleUrls: ['./idocsignviewer.component.scss'],
    providers: []
})
export class iDocsignviewerComponent implements OnInit {

    @Input('url') urls;
    @Input() toolbarBg = '#e9e9e9';
    @Input() toolbarColor = '#333333';
    @Input() showSidebar = true
    @Input() zoom = 0.80;
    @Input() showZoomControl = true;
    @Output() onFinished: EventEmitter<any> = new EventEmitter();
    @Output() onCancel: EventEmitter<any> = new EventEmitter();
    //reduce height from 100vh
    @Input() reduceHeight = 0;
    private localStorageKey = 'docdata';
    fontlist = [
        { fontfamily: 'mayqueen' },
        { fontfamily: 'ArtySignature' },
        { fontfamily: 'KatrineHolland-XjRG' },
        { fontfamily: 'BrothersideSignature' },
        { fontfamily: 'PWSignaturetwo' },
        { fontfamily: 'Rhesmanisa' }
    ]
    pagesshow = 1;
    externalProp = {}
    originalSize = true;
    ismobiledetected = false;

    constructor(private zone: ChangeDetectorRef) { }

    ngOnInit(): void {

        let d = localStorage.getItem(this.localStorageKey);
        if (d) {
            this.externalProp = JSON.parse(d);

        }

    }
    scale = 1;
    signaturePad;
    nxtcomp = 0;
    ngAfterViewInit(): void {

        //this.addScript('');
        if ($(document).width() < 700) {
            this.ismobiledetected = true;
            this.showSidebar = false
        }



        //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
        //Add 'implements AfterViewInit' to the class.

        var canvas = $("#signaturepad").find('canvas')[0];
        canvas.getContext("2d").scale(2, 2);
        this.signaturePad = new SignaturePad(canvas);

        $('#progressbar').progressbar({
            value: false
        })

    }


    forwardbackward(isnext) {

        let that = this;

        setTimeout(() => {
            if (!isnext) {
                this.nxtcomp -= 1;
            }
            if (this.nxtcomp == -1) {
                this.nxtcomp = this.elementPostions.length - 1
            }

            if (this.lastActiveClass) {
                $(this.lastActiveClass).removeClass('borderActive');
                //$(this.lastActiveClass).tooltip("close");
            }
            this.lastActiveClass = $('#' + this.elementPostions[this.nxtcomp].id);


            //$(this.lastActiveClass).tooltip("open");
            var x = $('div[data-page-number="' + this.elementPostions[this.nxtcomp].page + '"]')[0];
            $(that.lastActiveClass).addClass('borderActive', function () {
                // $('#arrow').css({ 'top': (this.offsetTop + x.offsetTop - 15) + 'px', 'left': (this.offsetLeft + x.offsetLeft - 7) + 'px', 'display': 'inline-block' });
            });

            $('.ng2-pdf-viewer-container').animate({
                scrollTop: (this.elementPostions[this.nxtcomp].top + x.offsetTop - 109) + 'px'
            }, 800, function () {
            

                // Animation complete.
                //   that.page = that.elementPostions[that.nxtcomp].page;

            });
            if (isnext) {
                this.nxtcomp += 1;
            }
            if (this.nxtcomp == this.elementPostions.length) {
                this.nxtcomp = 0
            }
        }, 400);
        this.zone.detectChanges();
    }

    prev() {
        this.forwardbackward(false)
    }


    next() {
        this.forwardbackward(true)
    }

    onfinished(e) {
        this.onFinished.emit(this.externalProp);
    }

    oncancel(e) {
        this.onCancel.emit();
    }

    lastActiveClass;
    selectedField = {};
    pagesAdded = {};
    canvaspages = {};
    selectedObject: any = null;
    isloaded = false;
    page = 1;
    thumbnail = [];
    locationStack = {
        require: false,
        elementstack: []
    };

    onPageClick(page) {
        this.page = page;
    }
    pageRendered(e) {
        let that = this;

        this.pagesAdded[e.pageNumber] = true;
        //$(".page[data-page-number='" + e.pageNumber + "']").append('<div class="pdfcontrols" style="width:' + e.source.div.offsetWidth + 'px; height:' + e.source.div.offsetHeight + 'px"><canvas id="cpage' + e.pageNumber + '" width=' + (e.source.div.offsetWidth + 1) + ' height="' + (e.source.div.offsetHeight + 1) + '" style="width:' + (e.source.div.offsetWidth + 1) + 'px; height:' + (e.source.div.offsetHeight + 1) + 'px""></div>') 

        // if (!this.isloaded) {
        //     this.thumbnail.push({
        //         page: e.pageNumber,
        //         url: e.source.canvas.toDataURL()
        //     })
        //     // $('#preview').append('<div class="thumbnailpage" id="page' + e.pageNumber + '"><img src="' + e.source.canvas.toDataURL() + '" style="height: 100; width: 100px"><span class="pagenumber">' + e.pageNumber + '</span></div>');
        // }
        // $('#page' + e.pageNumber).click(function () {

        //     that.page = e.pageNumber;
        //     that.zone.detectChanges();
        // })

        this.scale = e.source.scale;
        $(".page[data-page-number='" + e.pageNumber + "']").append('<div class="pdfcontrols" id="cpage' + e.pageNumber + '" style="width:' + (e.source.div.offsetWidth / this.scale) + 'px; height:' + (e.source.div.offsetHeight / this.scale) + 'px"></div>')



        if (e.pageNumber == 1) {

            var arrow = $('#arrow').clone()[0]
            $('#arrow').remove();
            $('.pdfViewer').append(arrow);


        }
        let components = this.externalProp[e.pageNumber];
        if (!components) {
            return
        }
        let ids = Object.keys(components)
        for (let index = 0; index < ids.length; index++) {
            const element = components[ids[index]];


            this.addControlsHtml(element, e.pageNumber, {}, element.type, element.dataset.group, element.style, element);
        }


        if (this.totalpages == e.pageNumber) {


            this.isloaded = true;


        }
        this.scalereloadComponent(e.pageNumber, this.scale);

    }






    addControlsHtml(el, page, position, type, group = null, style = null, props = null) {

        let prop: any = props;
        let control;
        if (type == 'text') {
            control = this.createTextBox(prop);
        } else if (type == 'ddl') {
            control = this.createDropdown(prop);
        }
        else if (type == 'sign') {
            control = this.createSignature(prop);
        } else if (type == 'initial') {
            control = this.createInitial(prop);
        } else if (type == 'signdate') {
            const d = new Date('2010-08-05')
            const ye = new Intl.DateTimeFormat('en', { year: 'numeric' }).format(d)
            const mo = new Intl.DateTimeFormat('en', { month: 'numeric' }).format(d)
            const da = new Intl.DateTimeFormat('en', { day: '2-digit' }).format(d)
            prop.text = `${mo}/${da}/${ye}`
            control = this.createSignatureDate(prop);
        } else if (type == 'note') {
            control = this.createNoteComp(prop);
        } else if (type == 'checkbox') {
            control = this.createCheckBox(prop);
        }
        else if (type == 'radio') {
            control = this.createRadioButton(prop);
        } else if (type == 'attach') {
            control = this.createAttachment(prop);
        } else if (type == 'pic') {
            control = this.createPicure(prop);
        } else if (type == 'loc') {
            control = this.createLocation(prop);
        } else if (type == 'qr') {
            control = this.createQRCode(prop);
        } else if (type == 'br') {
            control = this.createBarCode(prop);
        }




        let that = this;

        $('#cpage' + page).append(control.design)


        let d = this.fieldTypes[prop.dataset.fieldtype]
        // if (d) {
        //     $("#" + prop.id).rules("add", { regex: d })
        // }

        if (prop.dataset.type == "text") {

            if (prop.dataset.fieldtype == 'date') {
                $("#" + prop.id).datepicker();
            } else {

            }

            if (d) {

                // $("#" + prop.id).keypress(function (event) {
                //     var key = String.fromCharCode(!event.charCode ? event.which : event.charCode);

                //     if (!d.test(key)) {
                //         event.preventDefault();
                //         return false;
                //     }
                // })
            }
        } else if (prop.dataset.type == 'sign' || prop.dataset.type == 'initial') {

            $("#" + prop.id).bind('click', function (e) {
                if ($("#" + prop.id).has('img')) {
                    that.signaturePad.fromDataURL($("#" + prop.id).find('img').attr('src'));
                }
                $("#signaturepad").dialog({
                    resizable: false,
                    height: 400,
                    width: 'auto',
                    title: 'Signature Pad',
                    modal: true,
                    buttons: [{
                        text: "Create",
                        "class": 'bg-success',
                        click: function () {
                            $("#" + prop.id).attr('data-val', true);
                            $("#" + prop.id).empty().append('<img style="height: 100%;" src="' + that.signaturePad.toDataURL() + '"/>');

                            that.handleInput($("#" + prop.id), prop.type, prop.id, prop, null)
                            $(this).dialog("close");
                        }
                    },
                    {
                        text: "Clear",
                        "class": 'cancelButtonClass',
                        click: function () {
                            that.signaturePad.clear();
                        }
                    },
                    {
                        text: "Cancel",
                        "class": 'cancelButtonClass',
                        click: function () {
                            $(this).dialog("close");
                        }
                    }],
                    close: function () {
                        that.signaturePad.clear();

                    }
                });
            });







        } else if (prop.dataset.type == 'initial') {


        } else if (prop.dataset.type == 'qr') {
            this.whenAvailable('QRCode').then(() => {
                console.log('dddd')
                new QRCode(prop.id, {
                    text: prop.text,
                    width: prop.style.width,
                    height: prop.style.height,
                    colorDark: "#000000",
                    colorLight: "#ffffff",
                    correctLevel: QRCode.CorrectLevel.H
                });

            });
        } else if (prop.dataset.type == 'br') {
            this.whenAvailable('JsBarcode').then(() => {
                JsBarcode("#b" + prop.id).blank(20)
                $("#b" + prop.id).JsBarcode(prop.text);
            })

            // Create space between the barcodes

        } else if (prop.dataset.type == 'pic') {

            $("#" + prop.id).bind('click', function (e) {
                Webcam.set({
                    width: 300,
                    height: 270,
                    image_format: 'jpeg',
                    jpeg_quality: 100
                });
                Webcam.attach('#camera');
                $("#camerapad").dialog({
                    resizable: false,
                    height: 450,
                    width: 'auto',
                    title: 'Picture',
                    modal: true,
                    buttons: [{
                        text: "Done",
                        "class": 'bg-success',
                        click: function () {
                            Webcam.snap(function (data_uri) {
                                $("#" + prop.id).attr('data-val', true);
                                $("#" + prop.id).css('background-image', "url('" + data_uri + "'").css('background-size', 'cover').css('background-position', 'center center')
                                that.handleInput($("#" + prop.id), prop.type, prop.id, prop, null)
                            });
                        }
                    },
                    {
                        text: "Snap",
                        "class": 'cancelButtonClass',
                        click: function () {
                            Webcam.freeze()
                        }
                    },
                    {
                        text: "Reset",
                        "class": 'cancelButtonClass',
                        click: function () {
                            Webcam.unfreeze()

                        }
                    },
                    {
                        text: "Close",
                        "class": 'cancelButtonClass',
                        click: function () {
                            $(this).dialog('close');

                        }
                    }],
                    close: function () {
                        setTimeout(() => {
                            if (Webcam.stream)
                                Webcam.stream.getTracks().forEach(track => track.stop())
                            Webcam.reset()
                        }, 1000);


                    }
                });
            });

            // Create space between the barcodes

        }



        // $("#" + id).bind('click', function (e) {
        //     e.preventDefault();
        //     that.controlClickHandler(this, that);
        //     return false;
        // });

        // $(d).on("contextmenu", function () {
        //     return false;
        // });



        $("#" + prop.id).bind('mouseover', function (e) {
            e.preventDefault();
            // this.dataset.tip = (prop.dataset.tooltip || '') + '' + (prop.dataset.require ? ' - Require' : '');

            this.title = (prop.dataset.tooltip || '') + '' + (prop.dataset.require ? ' Require' : '');
            // ((this.dataset.type === 'radio' || this.dataset.type === 'checkbox') ? this.dataset.name + ' - ' + this.dataset.value :
            //     (this.dataset.type === 'text' ? this.dataset.name + '-' + this.dataset.fieldtype : this.dataset.name))
            //     + '' + (this.dataset.require ? ' - Require' : '');

            // this.title = (this.dataset.type === 'radio' || this.dataset.type === 'checkbox') ? this.dataset.name + ' - ' + this.dataset.value :
            //     (this.dataset.type === 'text' ? this.dataset.name + '-' + this.dataset.fieldtype : this.dataset.name);
            return false;
        })

        $("#" + prop.id).change(function (e) {
            that.handleInput(e, prop.dataset.type, prop.id, prop)

        })




        $("#" + prop.id).tooltip({
            track: true
        });



        return prop.id;
    }

    onProgress(e) {
        console.log('or prog', e);
    }
    totalpages = 0;
    totalpagesarr = [];
    loadComplete(pdf: PDFDocumentProxy): void {

        this.totalpages = pdf.numPages;
        for (let i = 0; i < this.totalpages; i++) {
            this.totalpagesarr.push(i + 1);

        }
        this.isloaded = false;
        this.originalSize = false;

        this.validateFields('all');
        // if (this.locationStack.elementstack.length > 0) {
        //     if (this.locationStack.require) {

        //         if (navigator.geolocation) {
        //             navigator.geolocation.getCurrentPosition((position) => {
        //                 setTimeout(() => {

        //                 }, 1000);
        //             });
        //         } else {
        //             alert('location not supported')
        //         }

        //     }
        // }
        $('#loader').hide();




    }
    actionReq = [];
    elementPostions = [];
    validateFields(type, page = null, object = null, updatecount = null) {


        let pages = Object.keys(this.externalProp);
        let postion = [];
        let totalfill = 0
        let donecountbypage = {};
        for (let i = 0; i < pages.length; i++) {
            totalfill = 0
            if (page && page != pages[i]) {
                continue;
            }
            let ele = Object.keys(this.externalProp[pages[i]])
            let lastprop = this.externalProp[pages[i]];

            for (let j = 0; j < ele.length; j++) {

                const propele = lastprop[ele[j]];
                if (propele.dataset.require) {
                    if (!this.thumbnail[pages[i]]) { this.thumbnail[pages[i]] = {} }
                    if (propele.type == 'radio' || propele.type == "checkbox") {
                        if (propele.dataset.groupids) {
                            this.thumbnail[pages[i]][propele.dataset.group] = (!propele.val ? false : true)
                            if (propele.val) {
                                totalfill += 1;
                            }
                        }
                    } else {
                        this.thumbnail[pages[i]][propele.id] = (!propele.val ? false : true)
                        if (propele.val) {
                            totalfill += 1;
                        }
                    }
                }
                if (!updatecount) {
                    if (propele.type == 'loc') {
                        if (propele.dataset.require) {
                            this.locationStack.require = true;
                        }
                        this.locationStack.elementstack.push(propele);
                    } else if (propele.type == 'pic') {

                        this.addPlugin('webcam');
                    } else if (propele.type == 'qr') {
                        setTimeout(() => {
                            this.addPlugin('qr');
                        }, 10000);
                    } else if (propele.type == 'br') {
                        this.addPlugin('br');
                    }
                }
                postion.push({ id: propele.id, top: parseFloat(propele.style.top), page: parseInt(propele.dataset.page) })
            }

            donecountbypage[pages[i]] = totalfill;
        }


        if (updatecount) {

            this.updateDoneCount(donecountbypage[page], page);
            return
        }



        // $('.defaultcomp qtip tip-top').each(function (index) {
        //     console.log(parseFloat($(this).offset().top))

        //});


        postion.sort((a, b) => {
            return a.page - b.page || a.top - b.top
        })
        this.elementPostions = postion;



        for (let index = 0; index < this.totalpages; index++) {

            const element = this.thumbnail[index + 1];
            let count = 0;
            if (element) {
                count = Object.keys(element).length;
            }

            this.actionReq.push({
                page: index + 1,
                count: count,
                doneCount: donecountbypage[index + 1]
            });
        }



        // console.info('data test', this.thumbnail);
    }

    updateDoneCount(totalfill, page) {
        const element = this.thumbnail[page];
        var ele = null;
        if (element) {
            ele = Object.keys(element);
        }
        var pagect = this.actionReq.find(a => { return a.page == page })
        if (pagect) {
            pagect.doneCount = totalfill;
        }
    }

    controlClickHandler = function (d, that) {

        // let removeAddplus = null;

        // if (that.selectedControl && that.selectedControl.dataset.group) {
        //     if (that.selectedControl.dataset.group == d.dataset.group) {
        //         removeAddplus = false
        //     } else if (that.selectedControl.id == d.id) {
        //         return false
        //     }


        // }

        // that.removeSelection();
        // that.selectedControl = d;
        // that.selectedProps = this.getExternalProp(that.selectedControl.dataset.page, that.selectedControl.id);
        // that.addSelection(removeAddplus);
        // that.showPropertiesF(d);

    }

    funonkeypress = function (e, pattern) {

    }


    fieldTypes = {
        'none': '',
        'telephone': undefined,
        'email': /^([a-zA-Z0-9_\-\.]+)@([a-zA-Z0-9_\-\.]+)\.([a-zA-Z]{2,5})$/,
        'number': /^(0|[1-9][0-9]*)$/,
        'letters': '',
        'date': ''
    }
    fieldType(fieldtyp) {
        return this.fieldTypes[fieldtyp]
    }


    scalereloadComponent(page, SCALE) {


        $('#cpage' + page).css({ 'transform-origin': '0% 0%', 'transform': 'scale(' + this.scale + ', ' + this.scale + ')' });
        // let zoomfactor =  this.zoom;
        // let controls = Object.keys(this.externalProp[page]);
        // for (let j = 0; j < controls.length; j++) {
        //     const control: any = this.externalProp[page][controls[j]];
        //     if (control && typeof (control) == 'object') {
        //         console.log($('#' + control.id));
        //         $('#' + control.id).css({ 'left': (control.style.left * zoomfactor) + 'px', "top": (control.style.top * zoomfactor) + 'px', 'transform': 'scale(' + this.zoom + ')' });
        //     }
        // }
    }

    createTextBox(prop) {
        const design = '<input  data-fieldtype="' + prop.dataset.fieldtype + '"  data-name="' + prop.dataset.name + '"  data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp viewercomp ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px" ' + (prop.dataset.readonly ? 'readonly' : '') + '   value="' + (prop.val || prop.text) + '">';
        return {
            design: design,
            resize: null
        }
    }

    createDropdown(prop) {
        let design = '<select  data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp viewercomp dropdown ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px">';
        if (prop.extras.ddlprop) {
            if (prop.extras.ddlprop.extra) {
                if (prop.extras.ddlprop.defval == "") {
                    prop.extras.ddlprop.defval = prop.extras.ddlprop.extra[0];
                }
                for (let i = 0; i < prop.extras.ddlprop.extra.length; i++) {
                    const el = prop.extras.ddlprop.extra[i];
                    design += '<option ' + ((prop.val || prop.extras.ddlprop.defval) === el ? 'selected' : '') + '>' + el + '</option>'
                }
            }
        }

        '</select>';

        return {
            design: design,
            resize: null
        }
    }

    createSignature(prop) {
        const design = '<div data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><i class="fa fa-pencil"></i></div>';

        return {
            design: design,
            resize: null
        }
    }

    createInitial(prop) {
        const design = '<div data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><i class="fa fa-pencil"></i></div>';

        return {
            design: design,
            resize: null
        }
    }

    createSignatureDate(prop) {


        const design = '<div data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp viewercomp " style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px"><span>' + prop.text + '</span></div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }


    }

    createNoteComp(prop) {
        const design = '<textarea  data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" id="' + prop.id + '" class="defaultcomp viewercomp ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;font-family:' + prop.style['fontFamily'] + ';font-size:' + prop.style['fontSize'] + 'px;font-style:' + prop.style['fontStyle'] + ';font-weight:' + prop.style['fontWeight'] + ';width:' + prop.style.width + 'px;height:' + prop.style.height + 'px;resize: none;" ' + (prop.dataset.readonly ? 'readonly' : '') + '>' + (prop.val || prop.text) + '</textarea>';
        const resize = null;
        return {
            design: design,
            resize: resize
        }
    }

    createCheckBox(prop) {


        const design = '<div data-value="' + prop.dataset.value + '" data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"  data-group="' + prop.dataset.group + '" id="' + prop.id + '" class="defaultcomp viewercomp checkbox ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;"><input type="checkbox" value="' + prop.dataset.value + '" tabindex="-1" ' + (prop.dataset.checked ? 'checked' : '') + ' ' + (prop.dataset.readonly ? 'readonly' : '') + ' style=" margin:0;padding:0" /></div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }


    }

    createRadioButton(prop) {


        const design = '<div data-value="' + prop.dataset.value + '" data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '" data-group="' + prop.dataset.group + '" id="' + prop.id + '" class="defaultcomp viewercomp radio ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;"><input type="radio" tabindex="-1" ' + (prop.dataset.checked ? 'checked' : '') + ' ' + (prop.dataset.readonly ? 'readonly' : '') + '  value="' + prop.dataset.value + '" name="r' + prop.dataset.group + '" style="margin:0;padding:0" /></div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }


    }


    createAttachment(prop) {
        const design = '<div   data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><i class="fa fa-paperclip"></i></div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }
    }

    createPicure(prop) {
        const design = '<div    data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><i class="fa fa-camera"></i></div>';
        const resize = null
        return {
            design: design,
            resize: resize
        }
    }

    createLocation(prop) {
        const design = '<div    data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter ' + (prop.dataset.require ? 'require' : '') + '" style="left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px; background-image: url(https://static-maps.yandex.ru/1.x/?lang=en-US&ll=' + prop.dataset.lon + ',' + prop.dataset.lat + '&z=8&l=skl,map&size=' + prop.style.width + ',' + (prop.style.height) + '&pt=-73.7638,42.6564,vkbkm)"></div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }
    }

    createQRCode(prop) {
        const design = '<div data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter" style="padding:2px;left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"> </div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }
    }


    createBarCode(prop) {
        const design = '<div data-name="' + prop.dataset.name + '" data-page="' + prop.dataset.page + '" data-type="' + prop.dataset.type + '"   id="' + prop.id + '" class="defaultcomp viewercomp justifycenter" style="padding:2px;left:' + prop.style.left + 'px;top:' + prop.style.top + 'px;width:' + prop.style.width + 'px;height:' + prop.style.height + 'px"><img style="height:100%;width:auto;" id="b' + prop.id + '"/> </div>';
        const resize = null

        return {
            design: design,
            resize: resize
        }
    }

    /*End Controls*/



    public zoomIn(): void {
        if (this.zoom >= 2.0) return;
        this.scale = 1;
        this.zoom += .10;

    }

    public zoomOut(): void {
        if (this.zoom <= 0.60) return;
        this.scale = -1;
        this.zoom -= .10;


    }


    selectFont(item) {
        this.signaturePad.clear()
        // var canvas: any = document.getElementById("rough_signaturepad");
        var ctx = this.signaturePad.canvas.getContext("2d");
        ctx.font = "80px " + item.fontfamily;
        ctx.fillText("Hello World", 10, 90);

    }


    handleInput(e, type, id, prop, dt = null) {
        var value = '';
        value = e.target ? e.target.value : '';
        if (type === 'radio') {
            let items = this.externalProp[prop.dataset.page][prop.dataset.group].dataset['groupids']
            for (let i = 0; i < items.length; i++) {
                const ids = items[i];
                this.externalProp[prop.dataset.page][ids].dataset['checked'] = false;
                this.externalProp[prop.dataset.page][ids].val = value || id;
            }

            prop.dataset.checked = e.target.checked;
        } else if (type === 'checkbox') {
            //let items = this.externalProp[prop.dataset.page][prop.dataset.group].dataset['groupids']
            prop.dataset.checked = e.target.checked;
            // for (let i = 0; i < items.length; i++) {
            //     const ids = items[i];
            //     this.externalProp[prop.dataset.page][ids].val = true;
            // }
        } else if (type === 'text' || type === 'note') {
            this.externalProp[prop.dataset.page][id].val = value;
        } else if (type === 'ddl') {
            this.externalProp[prop.dataset.page][id].val = value;
        } else if (type === 'sign') {
            this.externalProp[prop.dataset.page][id].data = dt;
            this.externalProp[prop.dataset.page][id].val = 'done';
        } else if (type === 'initial') {
            this.externalProp[prop.dataset.page][id].data = dt;
            this.externalProp[prop.dataset.page][id].val = 'done';
        }
        // else {
        //     value = e.target.value
        // }

        this.validateFields(null, prop.dataset.page, null, true);
        this.export();
    }

    export() {


        localStorage.setItem(this.localStorageKey, JSON.stringify(this.externalProp));
    }


    addPlugin(plname: any) {

        switch (plname) {
            case 'webcam':
                let webcamurl = "https://cdnjs.cloudflare.com/ajax/libs/webcamjs/1.0.25/webcam.js";
                if (!this.isScriptLoaded(webcamurl)) {
                    this.addScript(webcamurl);
                }
                break;
            case 'br':
                let br = "https://cdn.jsdelivr.net/npm/jsbarcode@3.11.0/dist/JsBarcode.all.min.js";
                if (!this.isScriptLoaded(br)) {
                    this.addScript(br);
                }
                break;
            case 'qr':
                let qr = "https://cdn.jsdelivr.net/gh/davidshimjs/qrcodejs/qrcode.min.js";
                if (!this.isScriptLoaded(qr)) {
                    this.addScript(qr);
                }
                break;
            default:
                break;
        }
    }
    isScriptLoaded(src) {
        return document.querySelector('script[src="' + src + '"]') ? true : false;
    }
    addScript(url) {
        const script = document.createElement('script');
        script.async = true;
        script.src = url;
        document.head.append(script);

    }

    whenAvailable(name) {
        return new Promise((res, rej) => {
            let s = setInterval(() => {
                if (window[name]) {
                    clearInterval(s);
                    res(true);

                    console.log('done')
                }
            }, 10)
        })
    }

}
@NgModule({
    imports: [CommonModule, FormsModule, PdfViewerModule],
    exports: [iDocsignviewerComponent],
    declarations: [iDocsignviewerComponent, TabsComponent, TabComponent]
})
export class iViewerModule { }
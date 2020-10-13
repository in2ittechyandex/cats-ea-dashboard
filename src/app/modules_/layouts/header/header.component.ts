import { LoggedUser } from 'src/app/models_/loggeduser';
import { environment } from './../../../../environments/environment';
import { Router } from '@angular/router';
import { Component, OnInit, OnDestroy, Renderer2, Input, Output, EventEmitter } from '@angular/core';
import pageSettings from '../../../config/page-settings';
import { NgbModal, ModalDismissReasons } from '@ng-bootstrap/ng-bootstrap';
import { FormGroup, FormControl, FormBuilder, Validators } from '@angular/forms';
import { UserService } from '../../../services_/user.services';
import swal from 'sweetalert2';
import * as $ from 'jquery';
import { AppConfig } from 'src/app/config/app.config';


@Component({
  selector: 'cats-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css']
})
export class HeaderComponent implements OnInit, OnDestroy {
  loadingFeedBackButton: boolean = false;

  constructor(private modalService: NgbModal, private fb: FormBuilder,
    private u_service: UserService,
    private appConfig: AppConfig
  ) {
    console.log('headers :' +this.appConfig.environemnt['_WEBGATEWAY_BASIC_URL_']);
  }

  @Input() pageSidebarTwo;
  @Output() toggleSidebarRightCollapsed = new EventEmitter<boolean>();
  @Output() toggleMobileSidebar = new EventEmitter<boolean>();
  @Output() toggleMobileRightSidebar = new EventEmitter<boolean>();
  pageSettings = pageSettings;

  public _AUTH_GATEWAY_URL: any;
  public userIcon: any = 'assets/img_alpha/i.png';
  closeResult: string;
  Organization: [''];
  feedBackForm: FormGroup;
  loggedUser: LoggedUser;

  modalReferenceAddReport: any;

  mobileSidebarToggle() {
    this.toggleMobileSidebar.emit(true);
  }
  mobileRightSidebarToggle() {
    this.toggleMobileRightSidebar.emit(true);
  }
  toggleSidebarRight() {
    this.toggleSidebarRightCollapsed.emit(true);
  }

  mobileTopMenuToggle() {
    this.pageSettings.pageMobileTopMenuToggled = !this.pageSettings.pageMobileTopMenuToggled;
  }

  mobileMegaMenuToggle() {
    this.pageSettings.pageMobileMegaMenuToggled = !this.pageSettings.pageMobileMegaMenuToggled;
  }

  ngOnDestroy() {
    this.pageSettings.pageMobileTopMenuToggled = false;
    this.pageSettings.pageMobileMegaMenuToggled = false;
  }


  logout() {

    swal({
      title: 'Are you sure you want to logout?',
      text: '',
      type: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, Log Out!'
    }).then((result) => {
      if (result.value) {
        localStorage.clear();
        // this.router.navigate([environment._AUTH_GATEWAY_URL]);
        swal({
          position: 'center',
          type: 'success',
          title: 'You Have Been Successfully Logged Out ',
          showConfirmButton: false,
          timer: 1500
        });
        window.location.href = environment._AUTH_GATEWAY_URL;
      }
      if (result.dismiss) {
        // user Refused Changes .......
      }
    }, err => {
      // // console.log("Got Result Error ...........: " + err.value);
    });
  }


  ngOnInit() {
    if (localStorage.getItem('loggedUser') != null) {
      this.loggedUser = JSON.parse(localStorage.getItem('loggedUser'));
    }
    const localData = localStorage.getItem('loggedUser');
    if (localData && JSON.parse(localData).profileImg != '') {
      this.userIcon = JSON.parse(localData).profileImg;
    } else if (localData && JSON.parse(localData).userName != '' && JSON.parse(localData).userName != null) {
      const str: string = JSON.parse(localData).userName;
      const arr = Array.from(str);
      const imgName = arr[0].toLowerCase();
      this.userIcon = 'assets/img_alpha/' + imgName + '.png';
    } else if (localData && JSON.parse(localData).name != '' && JSON.parse(localData).name != null) {
      const str: string = JSON.parse(localData).name;
      const arr = Array.from(str);
      const imgName = arr[0].toLowerCase();
      this.userIcon = 'assets/img_alpha/' + imgName + '.png';
    } else {
      this.userIcon = 'assets/img_alpha/i.png';
    }

    this._AUTH_GATEWAY_URL = environment._AUTH_GATEWAY_URL;
    // Feedback form
    this.feedBackForm = this.fb.group({
      description: ['', Validators.required],
      title: [''],
      requestType: ['', Validators.required],
      attachment: [null],
      module: ['', Validators.required]

    });
  }

  // Attachment Base64Decode (6-Sep-2019)
  onFileChange(event) {
    // File name over choose file (start)
    $(document).on('change', '.custom-file-input', function () {
      // const fileName = $(this).val().split('\\').pop();
      $(this).siblings('.custom-file-label').addClass('selected').html();
    }); // End

    // Encode in base64 attachment (Start)
    const reader: any = new FileReader();
    if (event.target.files && event.target.files.length > 0) {
      const file = event.target.files[0];
      if (file.size <= 1068158) {
        this.fileSizeError = "";
        reader.readAsDataURL(file);
        reader.onload = () => {
          this.feedBackForm.get('attachment').setValue({
            data: reader.result.split(',')[1],
            filename: file.name,
            mimetype: file.type
          });
        };
      } else {
        this.feedBackForm.get('attachment').setValue(null);
        $(document).on('change', '.custom-file-input', function () {
          // const fileName = $(this).val().split('\\').pop();
          $(this).siblings('.custom-file-label').addClass('selected').html("");
        });
        this.fileSizeError = "Please upload maximum 1 mb file.";
        return;
      }

    } // End
  }
  fileSizeError: string = ""
  //Feedback form on submit (5-Sep-2019)
  submitFeedback() {
    if (this.feedBackForm.valid) {
      // $("#submitFeedBackBtn").attr("disabled", true)
      this.loadingFeedBackButton = true
      let requestType = this.feedBackForm.get("requestType").value;
      let moduleText = this.feedBackForm.get("module").value;
      this.feedBackForm.patchValue({
        title: requestType + "##" + moduleText
      })
      this.createNewTicket().subscribe(res => {
        if (res["code"] == 0) {
          var key_ = Object.keys(res['objects'])[0];
          let mainObj = res['objects'][key_];
          let itemId = mainObj.key;

          if (this.feedBackForm.get("attachment").value != null) { // If attachment exist
            //Call function for attachment
            this.sendAttachment(itemId).subscribe(res1 => {
              $("#closeFeedbackForm").click();
              if (res1["code"] == 0) {
                var key_ = Object.keys(res1['objects'])[0];
                let mainObj = res1['objects'][key_];
                swal({
                  position: 'center',
                  type: 'success',
                  title: 'Your Feedback Saved Successfully.',
                  showConfirmButton: false,
                  timer: 1500
                });
              } else {
                swal({
                  position: 'center',
                  type: 'error',
                  title: 'Something went wrong!! Please try later.',
                  showConfirmButton: false,
                  timer: 1500
                });
              }
            }, err => { });
          } else {
            $("#closeFeedbackForm").click();
            swal({
              position: 'center',
              type: 'success',
              title: 'Your Feedback Saved Successfully ',
              showConfirmButton: false,
              timer: 1500
            });
          }
        } else {
          $("#closeFeedbackForm").click();
          swal({
            position: 'center',
            type: 'error',
            title: 'Something went wrong!! Please try later. ',
            showConfirmButton: false,
            timer: 1500
          });
        }
      }, err => { });
    } else {
      swal({
        position: 'center',
        type: 'error',
        title: 'Please fill all mendatory fields.',
        showConfirmButton: false,
        timer: 1500
      });
      return;
    }
  }

  // Create new ticket function (19-Sep-2019)
  createNewTicket() {
    let data = {
      version: 1.3,
      auth_user: "admin",
      auth_pwd: "admin",
      json_data: {
        "operation": "core/create",
        "comment": "Synchronization from blah...",
        "class": "UserRequest",
        "output_fields": "id, friendlyname",
        "fields":
        {
          "org_id": "SELECT Organization WHERE name = \"In2IT Technologies\"",
          "caller_id":
          {
            "name": "yadav",
            "first_name": "saroj"
          },
          "title": this.feedBackForm.get("title").value,
          "description": this.feedBackForm.get("description").value
        }
      }
    }
    return this.u_service.sendFeedBack(data);
  }

  //Attachment function with created ticket (19-Sep-2019)
  sendAttachment(itemId) {
    let data = {
      version: 1.3,
      auth_user: "admin",
      auth_pwd: "admin",
      json_data: {
        "operation": "core/create",
        "comment": "Add attachment",
        "class": "Attachment",
        "fields":
        {
          "item_id": itemId,
          "item_class": "UserRequest",
          "contents": this.feedBackForm.get("attachment").value
        }
      }
    }
    return this.u_service.sendFeedBack(data);
  }
  //Feedback form Section End


  private getDismissReason(reason: any): string {
    if (reason === ModalDismissReasons.ESC) {
      return 'by pressing ESC';
    } else if (reason === ModalDismissReasons.BACKDROP_CLICK) {
      return 'by clicking on a backdrop';
    } else {
      return `with: ${reason}`;
    }
  }
  open(content, size) {
    this.fileSizeError = "";
    this.feedBackForm.reset();
    this.loadingFeedBackButton = false;
    // $("#submitFeedBackBtn").attr("disabled", false)
    // this.modalReferenceAddReport = this.modalService.open(content, { size: size ? size : 'lg', backdrop: 'static' });
    this.modalReferenceAddReport = this.modalService.open(content, { backdrop: 'static' });
    this.modalReferenceAddReport.result.then((result) => { 
      this.closeResult = `Closed with: ${result}`;
    }, (reason) => {
      this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
    });
  }


  navigateToMyProduct() {
    window.location.replace(environment._AUTH_PRODUCT_SERVICES_URL);
  }


}

import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import {FormArray, FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {ResponseApi} from "../../../../../models/response-api";
import {PtaService} from "../../../../../services/pta.service";
import {ActionPTA, PlanTravailAnnuel, ResultAction} from "../../../model/pta";
import {ParametreService} from "../../../../../services/parametre.service";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";
import {Division} from "../../../../../models/utilisateur";
import {NgxSpinner, NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-create-pta',
  templateUrl: './create-pta.component.html',
  styleUrls: ['./create-pta.component.css']
})
export class CreatePtaComponent implements OnInit {

  actionGroup = this._formBuilder.group({});
  ResultatGroup = this._formBuilder.group({});
  resultatForm!: FormGroup;

  ptaFormGroup!: FormGroup;
  actionPTAForm!: FormGroup;
  resultActionForm!: FormGroup;
  subActionForm!: FormGroup;
  idPTA: any;
  pta!: PlanTravailAnnuel;
  actionPTA!: ActionPTA;
  actionPTAs: ActionPTA[] = [];
  resultPTA!: ResultAction;
  resultForActionId: ResultAction[] = [];
   indicateurs: ParametreResponse[] = [];
   indicateurChecked!: ParametreResponse;
   responssableAct!: string;
   division: any;
  listDivisions: any;
   resultFromSub!: ResultAction;

  constructor(
      private _formBuilder: FormBuilder,
      private location: Location,
      private router: Router,
      private route:ActivatedRoute,
      public modalService: NgbModal = inject(NgbModal),
      private formBuilder: FormBuilder,
      private activatedRoute: ActivatedRoute,
      private ptaService: PtaService,
      private parametreService: ParametreService,
      private spinner: NgxSpinnerService,
  ) {
    this.idPTA = this.activatedRoute.snapshot.paramMap.get('dataId')
  }

  ngOnInit(): void {
    this.initForm();
    this.getPTAId();
  }

  getPTAId(){
    this.spinner.show();
    this.ptaService.getPTA(this.idPTA)

        .subscribe({
          next : (response : ResponseApi) => {

            if(response.success){

              this.pta = response.data;
              this.spinner.hide();
              //  console.log(this.pta)

            }
          }
        })
  }




  initForm(): void {



    this.parametreService.getIndicateurs().subscribe(response => {

        this.indicateurs =  response?.data;

    })

    this.actionPTAForm = this.formBuilder.group({
      libelleAction: ['', Validators.required],
      idPTA: [this.idPTA, Validators.required]
    });


    this.getListAction(this.idPTA);



    this.resultActionForm = this.formBuilder.group({
      libelleResultat: ['', Validators.required],
      tauxAtteint: [0, Validators.required],
      cible: [100],
      actionId: [this.actionPTA?.id],

    });

    this.subActionForm = this.formBuilder.group({
      libelleSubAction: ['', Validators.required],
      indicateur: [null, Validators.required],
      resultPTA: [],
      budget: [0, Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      moyenRH: ['', Validators.required],
      sourceFinancement: ['', Validators.required],
    })

  }


  openModal(content: TemplateRef<any>, id: number) {
    this.spinner.show();
   this.ptaService.getResult(id).subscribe({
       next: (response: ResponseApi) => {
         console.log(response)

         this.resultFromSub = response?.data;
         this.spinner.hide();
       }
    })
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', centered: true }).result.then(
        (result) => {
          `Closed with: ${result}`;
          console.log(result)
        },
        (reason) => {
          `Dismissed ${this.getDismissReason(reason)}`;
        },
    );
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return 'by pressing ESC';
      case ModalDismissReasons.BACKDROP_CLICK:
        return 'by clicking on a backdrop';
      default:
        return `with: ${reason}`;
    }
  }

  onSaveDemande() {

    this.location.back();
    /*  Swal.fire({
        icon: "success",
        html: "<b>Plan de travail Annuel de la DRH 2024</b> enregistré avec succès.",
        showConfirmButton: false,
        timer: 2000,
      }).then(() => {
         this.location.back();
      });

     */
  }

  onCreateSousAction() {
    this.spinner.show();

    this.subActionForm.patchValue({
      resultPTA: this.resultFromSub
    });

    this.subActionForm.patchValue({
      indicateur:  this.indicateurChecked
    });

   // console.log( this.subActionForm.value);
   // this.spinner?.hide()
    if(this.subActionForm.valid) {

   this.ptaService.addSubResult(this.subActionForm.value).subscribe({
     next: (response: ResponseApi)  =>  {
        console.log(response);
        if(response?.success) {
          this.spinner.hide();
          Swal.fire({
            icon: "success",
            html: "Sous action enregistré avec succès.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {

          })
        }
      }
   })

    }



  }


  getListAction(id: number){
    this.ptaService.getListAction(id).subscribe({
      next: (response) => {
        if(response?.success) {

          this.actionPTAs = response.data;

          console.log( this.actionPTAs)
        }
      },
      complete: () => {},
      error: () => {

      }
    })
  }




  onCreateAction(){
    this.ptaService.addAction(this.actionPTAForm.value).subscribe({
      next: (response) =>{
        if(response?.success) {

          this.actionPTA= response.data;

          Swal.fire({
            icon: "success",
            html: `${this.actionPTA?.libelleAction} est enregistré avec succès.`,
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.getListAction(this.idPTA);
          })

        }
      },complete: () => {},
      error: (err) =>{

      }
    })

  }


  onViewSousAction(dataId: number) {
    console.log("ici")
    this.router.navigate(['sous-action',dataId], { relativeTo: this.route.parent });
    sessionStorage.setItem("actionPtaClick", 'create');
  }

  onReset() {
    Swal.fire({
      title: "Confirmation",
      text: "Voulez-vous annuler l'enregistrement ?",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#1D4A7B",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Oui",
      cancelButtonText: "Non",
    }).then((result) => {
      if (result.isConfirmed) {
        Swal.fire({
          html: "L’enregistrement  a été annulé avec succès.",
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        }).then(() => {
          this.location.back();
        });
      }
    });
  }

  getIndicateur(value: any) : void{

    this.parametreService.getParametre(value).subscribe((res)=>{
      this.indicateurChecked = res.data;
      console.log(res)
      this.responssableAct= this.indicateurChecked?.responsableActivite;
      console.log(this.indicateurChecked?.listDivisions)
      this.listDivisions= this.indicateurChecked?.listDivisions;

    })

  }

  //news
  newAction: string = ''; 
  actions: string[] = [];
  actionForm!: FormGroup;

  addAction() {
    if (this.newAction.trim()) { 
      this.actions.push(this.newAction.trim());
      this.newAction = ''; 
    }
  }

  deleteAction(action: string) {
    this.actions = this.actions.filter(a => a !== action);
  }

  onSave() {
    Swal.fire({
      icon: 'success',
      html: 'sous-actions enregistrée avec succès.',
      showConfirmButton: false,
      timer: 2000
    }).then(() => {
      this.location.back();
    })
  }
}





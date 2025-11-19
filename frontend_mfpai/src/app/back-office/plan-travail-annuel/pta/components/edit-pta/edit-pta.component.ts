import { Location } from "@angular/common";
import { Component, OnInit, TemplateRef, inject } from "@angular/core";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {PtaService} from "../../../../../services/pta.service";
import {ParametreService} from "../../../../../services/parametre.service";
import {ActionPTA, ResultAction} from "../../../model/pta";
import {ReferencesService} from "../../../../../services/references.service";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";
import {ResponseApi} from "../../../../../models/response-api";
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: 'app-edit-pta',
  templateUrl: './edit-pta.component.html',
  styleUrls: ['./edit-pta.component.css']
})
export class EditPtaComponent implements OnInit {
  headers: string[] = ['Résutats','Taux', 'Cible',   'Action'];
  page = 0;
  pageSize = 10;
  resultliteList: ResultAction[] = [];
  collectionSize = this.resultliteList.length;
  text = '';
  closeResult = '';
  actionGroup = this._formBuilder.group({});
  ResultatGroup = this._formBuilder.group({});

  actionPTAForm!: FormGroup;
  resultActionForm!: FormGroup;

  subActionForm!: FormGroup;

  totalPages = 0;
  size = 10;
  actionPTAs: ActionPTA[] = [];
  idPTA: any;

  actionPTA!: ActionPTA;

  resultPTA!: ResultAction;
   indicateur: any[]=[];
   resultatData!: ResultAction;
   actionData!: ActionPTA;


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
    private ptaService: PtaService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private parametreService: ParametreService,
    private activatedRoute: ActivatedRoute,
  ) {
    this.idPTA = this.activatedRoute.snapshot.paramMap.get('dataId')

  }

  ngOnInit(): void {
    this.initForm();
    this.refreshData();
  }



  initForm() {
    this.resultActionForm = this.formBuilder.group({
      libelleResultat: ['', Validators.required],
      tauxAtteint: [0, Validators.required],
      cible: [100],
      actionId: [this.actionPTA?.id],
    });



    this.parametreService.getIndicateurs().subscribe(response => {
        this.indicateurs = response.data;
    });


    this.subActionForm = this.formBuilder.group({

      libelleSubAction: ['', Validators.required],
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      budget: ['', Validators.required],
      sourceFinancement: ['', Validators.required],
      moyenRH: ['', Validators.required],
      resultPTA: ['', Validators.required],
      indicateur: ['', Validators.required],


    })

    this.getListAction(this.idPTA);


    this.actionPTAForm = this.formBuilder.group({
      libelleAction: ['', Validators.required]
    });

  }

  openModal(content: TemplateRef<any>, size:string, data: any) {

    this.actionData = data;
    this.actionPTAForm.patchValue({
      libelleAction: data.libelleAction,
    });



    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true }).result.then(
      (result) => {
        `Closed with: ${result}`;
      },
      (reason) => {
        `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }

  openModalSubAction(content: TemplateRef<any>, size:string, data: any) {

    this.resultFromSub = data;

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true }).result.then(
        (result) => {
          `Closed with: ${result}`;
        },
        (reason) => {
          `Dismissed ${this.getDismissReason(reason)}`;
        },
    );
  }

  openModalResult(content: TemplateRef<any>, size:string, data: any) {

     this.resultatData = data;
     this.resultActionForm.patchValue({
       libelleResultat: data?.libelleResultat,
       tauxAtteint: data?.tauxAtteint,
       cible: data?.cible,
       actionId: data?.actionId,
     })

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: size, centered: true }).result.then(
        (result) => {
          `Closed with: ${result}`;
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
    Swal.fire({
      icon: "success",
      html: "<b>Plan de travail Annuel de la DRH 2024</b> enregistré avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
       this.location.back();
    });
  }


  onCreateSousAction() {
    this.spinner.show();

    this.subActionForm.patchValue({
      resultPTA: this.resultFromSub
    });

    this.subActionForm.patchValue({
      indicateur:  this.indicateurChecked
    });



  if(this.subActionForm.valid) {

      this.ptaService.addSubResult(this.subActionForm.value).subscribe({
        next: (response: ResponseApi)  =>  {

          if(response?.success) {
           // this.spinner.hide();
            Swal.fire({
              icon: "success",
              html: "Sous action enregistré avec succès.",
              showConfirmButton: false,
              timer: 2000,
            }).then(() => {
              this.spinner?.hide();
              this.subActionForm.reset()

            })
          }
        }
      })

    }



  }
/*
  onCreateSousAction() {
    Swal.fire({
      icon: "success",
      html: "Sous action enregistré avec succès.",
      showConfirmButton: false,
      timer: 2000,
    })
  }
  */

  onCreateResulat() {
    this.resultActionForm.patchValue({
      actionId: this.actionPTA?.id,
      cible: 100
    });

    this.ptaService.addResult(this.resultActionForm.value).subscribe({
      next: (response) =>{
        if(response?.success) {

          this.resultPTA= response.data;

          Swal.fire({
            icon: "success",
            html:  `${this.resultPTA?.libelleResultat} enregistré avec succès.` ,
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.resultActionForm.reset();
            this.getListResult(0, 10, this.actionPTA?.id);
            this.getListAction(this.idPTA);
          })

        }
      },complete: () => {},
      error: (err) =>{

      }
    })

  }



   onUpdateResulat() {
     this.resultActionForm.patchValue({
       actionId: this.actionPTA?.id,
       cible: 100
     });

     this.ptaService.updateResultat(this.resultatData?.id,this.resultActionForm.value).subscribe({
       next: (response) =>{
         if(response?.success) {
           Swal.fire({
             icon: "success",
             html: "Résultat modifié avec succès.",
             showConfirmButton: false,
             timer: 2000,
           }).then(() => {
             this.modalService.dismissAll();
             this.getListResult(0, 10, this.actionPTA?.id);
             this.getListAction(this.idPTA);
           });
         }
       }
     })


  }

  onViewSousAction(dataId: any) {
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

 

  refreshData() {

  }


  getIndicateur(value: any) : void{

    this.parametreService.getParametre(value).subscribe((res)=>{
      this.indicateurChecked = res.data;
      this.responssableAct= this.indicateurChecked?.responsableActivite;
      this.listDivisions= this.indicateurChecked?.listDivisions;

    })

  }

  selectedAction: any = null;


  selectAction(action: any) {
    this.actionPTA = action

    this.getListResult(0, 10, this.actionPTA?.id);
    this.selectedAction = action;
  }


  getListResult(page: number, size:number ,id: number){
    this.ptaService.getListResultForAction(page, size, id).subscribe({
      next: (response) => {

        if(response?.status === 'OK') {

          this.resultliteList = response.payload;

          this.collectionSize = response.metadata?.totalElements ?? 0;
          this.size = response.metadata?.size ?? 0;


        }
      },
      complete: () => {},
      error: () => {

      }
    })
  }



  getListAction(id: number){
    this.spinner.show();
    this.ptaService.getListAction(id).subscribe({
      next: (response) => {
        if(response?.success) {

          this.actionPTAs = response.data;
          this.spinner.hide();
        }
      },
      complete: () => {},
      error: () => {
        this.spinner.hide();
      }
    })
  }


  onUpdateAction() {
    this.ptaService.updateAction(this.actionData?.id,this.actionPTAForm.value).subscribe({
      next: (response) =>{
        if(response?.success) {
          Swal.fire({
            icon: "success",
            html: "Action modifié avec succès.",
            showConfirmButton: false,
            timer: 2000,
          }).then(() => {
            this.modalService.dismissAll();
            this.getListResult(0, 10, this.actionPTA?.id);
            this.getListAction(this.idPTA);
          });
        }
      }
    })
  }





}

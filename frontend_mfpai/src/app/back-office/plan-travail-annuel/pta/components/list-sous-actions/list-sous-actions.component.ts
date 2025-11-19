import { Location } from '@angular/common';
import {
    AfterContentChecked,
    ChangeDetectorRef,
    Component,
    OnInit,
    TemplateRef,
    inject,
    AfterViewInit
} from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import Swal from 'sweetalert2';
import {PtaService} from "../../../../../services/pta.service";
import {ParametreService} from "../../../../../services/parametre.service";
import {NgxSpinnerService} from "ngx-spinner";
import {ReportRealisation, ResultAction, SubActionPTA} from "../../../model/pta";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ResponseApi} from "../../../../../models/response-api";
import {ParametreResponse} from "../../../../../models/parametre-response.interface";
import {Division} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";

declare var $: any;

@Component({
  selector: 'app-list-sous-actions',
  templateUrl: './list-sous-actions.component.html',
  styleUrls: ['./list-sous-actions.component.css']
})
export class ListSousActionsComponent implements OnInit, AfterViewInit {

  headers: string[] = ['Libellé sous action', 'Libellé Indicateur', 'Responsable  Activité', 'Divisions/Bureaux/Services', 'Écheance','Action'];
  page = 1;
  pageSize = 10;
  sousactionsList: SubActionPTA[] = [];
  collectionSize = this.sousactionsList.length;
  piecesJointesFiles: File[] = [];
  responsableProduction: any[] = [];
  isAction:any;
  isEditOrCreate:any = 'edit';
  idResultat: any;
  totalPages = 0;
  size = 10;
  subActionForm!: FormGroup;
  realisationReportForm!: FormGroup;
  modeCalculForm!: FormGroup;
  indicateurs: ParametreResponse[] = [];
  indicateurChecked!: ParametreResponse;
  responssableAct!: string;
  division: any;
  listDivisions: any;
  resultAction: any;
  resultFromSub!: ResultAction;
  subActionData!: SubActionPTA;
  divisionImpliques: Division[] = [];
  subAction!: SubActionPTA;
  detailSubAction!: SubActionPTA;
  detailReport!: ReportRealisation;
  files: any;
  filesResult!:any;

  constructor(
    private router: Router,
    private location: Location,
    private route: ActivatedRoute,
    private cdr: ChangeDetectorRef,
    public modalService: NgbModal = inject(NgbModal),
    private ptaService: PtaService,
    private referenceService: ReferencesService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
    private parametreService: ParametreService,

    private activatedRoute: ActivatedRoute,
  ) {
      this.idResultat = this.activatedRoute.snapshot.paramMap.get('dataId')

      this.ptaService.getResult( this.idResultat).subscribe({
          next: result => {
              if(result?.success) {
                  this.resultAction = result?.data;
              }
          }
      })

  }

    ngAfterViewInit(): void {
       this.getListDivisions()
    }



   /*ngAfterContentChecked(): void {
    this.initializeSelectpicker();
   }*/
  
  ngOnInit(): void {
    // Get action Edit or View
    this.isAction = sessionStorage.getItem("actionPtaClick");
    this.isEditOrCreate = sessionStorage.getItem("actionPtaFormClick");
     this.initForm()
    //this.refreshData();
    this.initialData(0, 10, "");
    // this.getListDivisions()
  }




  initForm() {
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
        modeCalcul: [''],
        resultPTA: [''],
        indicateur: ['', Validators.required],

    });


    this.realisationReportForm = this.formBuilder.group({
        dateDebut: ['', Validators.required],
        dateFin: ['', Validators.required],
        resume: ['', Validators.required],
        cible: [''],
        tauxAtteint: ['', Validators.required],
        observation: ['', Validators.required],
    })


    this.modeCalculForm = this.formBuilder.group({
        modeCalcul: ['', Validators.required],
        frequenceProd: ['', Validators.required],
        methodCollecte: ['', Validators.required],
        sourceDonnees: ['', Validators.required],
        divisions: [[], Validators.required],
        resultAction: [''],
    })


    }



    initialData(page: number, size: number, filter: string) {
     this.spinner.show();
      this.ptaService.getListSubAction(this.idResultat, page, size, filter).subscribe({
          next: (response ) => {
              if(response?.status === 'OK') {
                  this.sousactionsList = response?.payload;

                 // console.log( this.sousactionsList)
                  this.collectionSize = response.metadata?.totalElements ?? 0;
                  this.size = response.metadata?.size ?? 0;
                  this.spinner.hide();
              }
          }
      })
  }

   private initializeSelectpicker(): void {
     $('#selectResponsableProduction').selectpicker()
      this.cdr.detectChanges();
  }

    getListDivisions(){

        this.divisionImpliques = []
        this.referenceService.listDivisions().subscribe((res)=>{
            let listDivision = res.data

            $('#selectResponsableProduction').selectpicker('refresh');
            listDivision.forEach((value: Division) => {
                if(!this.divisionImpliques.includes(value)){

                    this.divisionImpliques.push(value)
                }

            })
        })


    }

  onSelectFiles(event: { addedFiles: any; }, filesArray: File[]) {
    filesArray.push(...event.addedFiles);
  }

  onRemoveFile(event: File, filesArray: File[]) {
    filesArray.splice(filesArray.indexOf(event), 1);
  }
  openModalSubResult(content: TemplateRef<any>, data: SubActionPTA) {

      this.subActionData = data;

      this.subActionForm.patchValue({
          libelleSubAction: data?.libelleSubAction,
          dateDebut: data?.dateDebut,
          dateFin: data?.dateFin,
          budget: data?.budget,
          sourceFinancement: data?.sourceFinancement,
          moyenRH: data?.moyenRH,
          indicateur: data?.indicateur?.id,
      })

      this.getIndicateur(data?.indicateur?.id)
    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', centered: true, scrollable:true }).result.then(
      (result) => {
        `Closed with: ${result}`;
      },
      (reason) => {
        `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


    openModal(content: TemplateRef<any>, data: any) {

      this.subAction = data;


     //   console.log(  data)

        this.spinner.show();


          this.ptaService.getSubAction(data?.id).subscribe({
              next: (response ) => {
                  if(response?.success ) {


                      this.detailSubAction = response?.data;

                      this.filesResult =  this.detailSubAction?.reportRealisation?.files;

                   //   console.log( this.filesResult)

                      this.spinner.hide();
                  }
              }
          })


       this.modeCalculForm.reset()

        this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'xl', centered: true, scrollable:true }).result.then(
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
  refreshData(event: any) {
      this.initialData(0, 10, "");
  }

    refreshData1(event: any) {
        this.totalPages = +event.target['text']-1;
        if (event.target['text'] != undefined && event.target['text'] != "««" && event.target['text'] != "«" && event.target['text'] != "»" && event.target['text'] != "»»"){
            this.initialData(this.totalPages, this.size, "");

        }

    }

  onSaveModeCalcul() {

      let divisions : any[] = []

      this.modeCalculForm.controls['divisions'].value.forEach((value: any) => {
          divisions.push({code: value});
      });


      let formData = {
          modeCalcul:  this.modeCalculForm.controls['modeCalcul'].value,
          sourceDonnees:  this.modeCalculForm.controls['sourceDonnees'].value,
          frequenceProd: this.modeCalculForm.controls['frequenceProd'].value,
          methodCollecte: this.modeCalculForm.controls['methodCollecte'].value,
          divisions: divisions,
          resultAction:  this.subAction?.resultPTA,
          subAction:  this.subAction
      }

      this.ptaService.addModeCalcul(formData).subscribe({
          next: (response: ResponseApi) => {

              if(response.success) {
                  Swal.fire({
                      html: 'Mode de calcul enregistré avec succès.',
                      icon: 'success',
                      timer: 1500,
                      showCancelButton: false,
                      showConfirmButton: false
                  }).then(() => {
                      this.closeModal();
                      this.modeCalculForm.reset()
                      this.initialData(0, 10, "");
                  })
              }


          }
      })


  }

   onSaveReportRealisations() {
      let formData = new FormData();

       for (let i = 0; i < this.piecesJointesFiles.length; i++) {
           formData.append('files', this.piecesJointesFiles[i]);
       }

       this.realisationReportForm.patchValue({
           cible: 100,
       })

       let reportData = {
           dateDebut: this.realisationReportForm.controls['dateDebut'].value,
           dateFin: this.realisationReportForm.controls['dateFin'].value,
           resume: this.realisationReportForm.controls['resume'].value,
           cible: this.realisationReportForm.controls['cible'].value,
           tauxAtteint: this.realisationReportForm.controls['tauxAtteint'].value,
           observation: this.realisationReportForm.controls['observation'].value,
           subAction:  this.subAction
       }


       formData.append('reportRealisationDTO', JSON.stringify(reportData));


     this.ptaService.addReport(formData).subscribe({
         next: (response: ResponseApi) => {
             if(response.success) {

                 Swal.fire({
                     html: 'Reporter réalisation enregistré avec succès.',
                     icon: 'success',
                     timer: 1500,
                     showCancelButton: false,
                     showConfirmButton: false
                 }).then(() => {
                     this.closeModal();
                     this.realisationReportForm.reset()
                     this.initialData(0, 10, "");
                 })
             }
         },
         complete: () => {},
         error: (error) => {
             this.ptaService.showSwal('error', error?.error?.message);
         }
     })

  }

  onViewDetailSousAction(data: any) {
    // this.router.navigate([data.id, 'detail-pta'], { relativeTo: this.route.parent })
  }
/*
 onUpdateSousAction() {
    Swal.fire({
      icon: "success",
      html: "Sous action modifié avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.closeModal();
    })
 }
  */
  closeModal() {
    this.modalService.dismissAll();
  }

  goBack() {
    this.location.back();
  }


    getIndicateur(value: any) : void{

        this.parametreService.getParametre(value).subscribe((res)=>{
            this.indicateurChecked = res.data;
            this.responssableAct= this.indicateurChecked?.responsableActivite;
            this.listDivisions= this.indicateurChecked?.listDivisions;

        })

    }






    onUpdateSousAction() {
        this.spinner.show();

        this.subActionForm.patchValue({
            resultPTA: this.subActionData?.resultPTA
        });

        this.subActionForm.patchValue({
            indicateur:  this.indicateurChecked
        });



        if(this.subActionForm.valid) {

            this.ptaService.updateSubResult( this.subActionData?.id,this.subActionForm.value).subscribe({
                next: (response: ResponseApi)  =>  {

                    if(response?.success) {
                        // this.spinner.hide();
                        Swal.fire({
                            icon: "success",
                            html: "Sous action modifié avec succès.",
                            showConfirmButton: false,
                            timer: 2000,
                        }).then(() => {
                            this.initialData(0, 10, "");
                            this.spinner?.hide();

                          //  this.subActionForm.reset()
                           // this.initialData(0, 10, "");

                        })
                    }
                }
            })

        }

    }


    downloadFile(fileName: string ) {
        console.log(fileName);
        this.ptaService.getDownloadFile(fileName).subscribe({
            next: (blob) => {
                const url = window.URL.createObjectURL(blob);  // Créer une URL Blob temporaire
                const a = document.createElement('a');         // Créer un lien
                a.href = url;
                a.download = fileName;            // Nom du fichier à télécharger
                document.body.appendChild(a);
                a.click();                                     // Simuler le clic pour télécharger
                document.body.removeChild(a);
                window.URL.revokeObjectURL(url);
            },
            error: (error) => {
                console.error('Error downloading the file', error);
            },
        });
    }




}



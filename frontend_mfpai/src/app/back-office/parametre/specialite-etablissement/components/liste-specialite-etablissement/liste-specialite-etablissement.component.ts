import {
  AfterContentChecked,
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  inject,
  OnInit,
  TemplateRef,
} from "@angular/core";
import { ActivatedRoute, Router } from "@angular/router";
import { ModalDismissReasons, NgbModal } from "@ng-bootstrap/ng-bootstrap";
import Swal from "sweetalert2";
import {FormBuilder, FormGroup, Validators} from "@angular/forms";
import {ParametreService} from "../../../services/parametre.service";
import {Division, Etablissement, Region, Speciality, SpecialityEtablissement} from "../../../../../models/utilisateur";
import {ReferencesService} from "../../../../../services/references.service";
import { TagModel } from "ngx-chips/core/tag-model";

@Component({
  selector: "app-liste-specialite-etablissement",
  templateUrl: "./liste-specialite-etablissement.component.html",
  styleUrls: ["./liste-specialite-etablissement.component.css"],
})
export class ListeSpecialiteEtablissementComponent
  implements OnInit
{
  headers: string[] = [
    "Établissement",
    "Spécialités",
    "Statut",
    "Action",
  ];
  page = 1;
  pageSize = 10;
  size = 0;
  dataList: SpecialityEtablissement[] = [];

  specialities: Speciality[] = [];
  etablissement: Etablissement[] = [];

  collectionSize = this.dataList.length;

  text = "";
  selectedEtablissement: string = "";

  selectedSpecialite: any;

  autocompleteSpecialites: string[] = [];
  etablissementForm!: FormGroup;

  constructor(
    private router: Router,
    private cdr: ChangeDetectorRef,
    private route: ActivatedRoute,
    private formBuilder: FormBuilder,
    private parametreService: ParametreService,
    private referenceService: ReferencesService,
    public modalService: NgbModal = inject(NgbModal)
  ) {}

  ngOnInit(): void {
    this.listEtapSpeAdvanced(0, 10, "", "");
    this.refreshData();
    this.initForm();
  }

  refreshData() {
    this.listEtapSpeAdvanced(0, 10, "", "");
  }

  changeStatus(data: any): void {
    Swal.fire({
      title: "Êtes-vous sûr ?",
      text: "Vous ne pourrez pas revenir en arrière !",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "rgba(29, 74, 123, 1)",
      cancelButtonColor: "#FF4D4F",
      confirmButtonText: "Confirmer",
      cancelButtonText: "Annuler",
    }).then((result) => {
      if (result.isConfirmed) {
        this.text = data.status ? "Désactivé" : "Activé";
        data.status = !data.status;

        Swal.fire({
          title: this.text,
          html: `L'actualité <b>${
            data.title
          }</b> a été ${this.text.toLowerCase()}.`,
          icon: "success",
          timer: 1500,
          showCancelButton: false,
          showConfirmButton: false,
        });
      }
    });
  }

  closeModal() {
    this.modalService.dismissAll();
  }

  private getDismissReason(reason: any): string {
    switch (reason) {
      case ModalDismissReasons.ESC:
        return "by pressing ESC";
      case ModalDismissReasons.BACKDROP_CLICK:
        return "by clicking on a backdrop";
      default:
        return `with: ${reason}`;
    }
  }
  openModalAddAgent(content: TemplateRef<any>) {

    this.listEtapSpeAdvanced(0, 10, "", "");
    this.modalService
      .open(content, {
        ariaLabelledBy: "modal-basic-title",
        size: "lg",
        centered: true,
        windowClass: "custom-modal-class",
      })
      .result.then(
        (result) => {
          `Closed with: ${result}`;
        },
        (reason) => {
          `Dismissed ${this.getDismissReason(reason)}`;
        }
      );
  }

  onSaveCreate() {
    let specialities: any[] =[];


    this.etablissementForm.controls['specialities'].value.forEach((value: any) => {
      specialities.push({label: value.value});
    });

     let formData = {
       etablissement:  {code: this.etablissementForm.controls['etablissement'].value},
       specialities: specialities
     }



   this.parametreService.addEtablissementSpec(formData).subscribe({
     next: (result) => {

       if(result?.success) {
         Swal.fire({
           icon: "success",
           html: "Spécialité enregistré avec succès.",
           showConfirmButton: false,
           timer: 2000,
         }).then(() => {
           this.closeModal();
           this.listEtapSpeAdvanced(0, 10, "", "");
         });
       }

     }
   })

  }

  onSaveEdit() {
    Swal.fire({
      icon: "success",
      html: "Spécialité modifiée avec succès.",
      showConfirmButton: false,
      timer: 2000,
    }).then(() => {
      this.closeModal();
    });
  }

  initForm() {
    this.referenceService.listSpeciality().subscribe((response) => {
      if (response.success) {
        this.specialities = response.data;
        this.autocompleteSpecialites = this.specialities.map(
          (role) => `${role.label}`
        );
      }
    });

    this.referenceService
      .listEtablissementByTypeETA("EFF")
      .subscribe((response) => {
        if (response.success) {
          this.etablissement = response.data;
        }
      });

    this.etablissementForm = this.formBuilder.group({
      etablissement: ['', Validators.required],
      specialities: [[], Validators.required],
    })

  }

  listEtapSpeAdvanced(
    page: number,
    size: number,
    filter: string,
    statut: string
  ) {
    this.parametreService
      .listEtapSpeAdvanced(page, size, filter, statut)
      .subscribe((data) => {
        if (data?.status === "OK") {
          this.dataList = data?.payload;
          this.collectionSize = data.metadata?.totalElements ?? 0;
          this.size = data.metadata?.size ?? 0;
        }
      });
  }

  onAdding(tag: TagModel): boolean {



    const tagValue = typeof tag === "string" ? tag : tag["display"];
    // Check if the tag exists in the predefined list
    if (this.autocompleteSpecialites.includes(tagValue)) {
      return true; // Allow the tag to be added
    } else {
      // Display message with a button to redirect to another page
      return false; // Prevent adding the tag
    }
  }
}

const DATA: any[] = [
  {
    id: 1,
    ref: "23032",
    etablissement: "Etabllissement 1",
    specialite: [
      { id: 1, libelle: "Specialite A" },
      { id: 2, libelle: "Specialite B" },
    ],
    status: true,
  },
  {
    id: 2,
    ref: "23032",
    etablissement: "Etabllissement 2",
    specialite: [
      { id: 1, libelle: "Specialite A" },
      { id: 2, libelle: "Specialite B" },
      { id: 3, libelle: "Specialite C" },
    ],
    status: false,
  },
  {
    id: 3,
    ref: "23032",
    etablissement: "Etabllissement 3",
    specialite: [
      { id: 1, libelle: "Specialite Z" },
      { id: 2, libelle: "Specialite Y" },
    ],
    status: true,
  },
];

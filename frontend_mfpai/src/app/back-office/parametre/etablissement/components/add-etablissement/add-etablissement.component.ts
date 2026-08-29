import { Location } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormGroup, Validators } from "@angular/forms";
import { NgxSpinnerService } from "ngx-spinner";
import Swal from "sweetalert2";
import {
  Ia,
  Ief,
  Region,
  TypeSystemeEnseignement,
} from "../../../../../models/utilisateur";
import { ReferencesService } from "../../../../../services/references.service";
import { ParametreService } from "../../../services/parametre.service";

@Component({
  selector: "app-add-etablissement",
  templateUrl: "./add-etablissement.component.html",
  styleUrls: ["./add-etablissement.component.css"],
})
export class AddEtablissementComponent implements OnInit {
  selectedMinistere: string = "";
  selectedIa: string = "";
  region: Region[] = [];
  iA: Ia[] = [];
  iEF: Ief[] = [];

  etablissementForm!: FormGroup;
  structure: any;
  etablissement: any;
  codeIA: any;
  ief: any;
  typeEtablissement: any;
  typeSystemeEnseignement: TypeSystemeEnseignement[] = [];

  constructor(
    private location: Location,
    private referenceService: ReferencesService,
    private parametreService: ParametreService,
    private formBuilder: FormBuilder,
    private spinner: NgxSpinnerService,
  ) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm() {
    this.referenceService.listRegion().subscribe((response) => {
      if (response.success) {
        this.region = response.data;
      }
    });

    this.referenceService.lisStructure().subscribe((response) => {
      if (response.success) this.structure = response.data;
    });

    this.referenceService.lisTypeEtablissement().subscribe((response) => {
      if (response.success) this.typeEtablissement = response.data;
    });

    this.etablissementForm = this.formBuilder.group({
      structure: ["", Validators.required],
      region: [""],
      ia: [""],
      typeEtablissement: [""],
      ief: [""],
      typeSystemeEnseignement: [""],
      code: ["", Validators.required],
      label: ["", Validators.required],
    });
  }

  getStruct(code: any) {
    if (code) {
      this.spinner.show();
      this.referenceService
        .listEtablissementByEFFCode(code)
        .subscribe((response) => {
          if (response.success) {
            this.etablissement = response.data;

            this.spinner.hide();
          }
        });

      this.spinner.hide();
    }
  }

  getListIA(code: any): void {
    if (code) {
      this.spinner.show();
      this.referenceService.listIAByCode(code).subscribe((response) => {
        if (response.success) {
          this.iA = response.data;
          this.spinner.hide();
        }
      });
      this.spinner.hide();
    }
  }

  getListEF(code: any): void {
    console.log(code);
    if (code) {
      //this.spinner.show()
      this.codeIA = code;

      this.referenceService.listIEFByCode(code).subscribe((response) => {
        if (response.success) {
          this.iEF = response.data;

          // this.spinner.show()
        }
      });
    }
  }

  getListEtabByIA(code: any): void {
    if (code) {
      this.spinner.show();
      this.referenceService
        .listEtablissementByIACode(code)
        .subscribe((response) => {
          if (response.success) {
            this.etablissement = response.data;
            this.spinner.hide();
          }
        });
      this.spinner.hide();
    }
  }

  getTypeSystemeEnseignement(code: any): void {
    if (code) {
      this.spinner.show();
      this.referenceService
        .getTypeSystemeEnseignement(code)
        .subscribe((response) => {
          if (response.success) {
            this.typeSystemeEnseignement = response.data;
            this.spinner.hide();
          }
        });
      this.spinner.hide();
    }
  }

  onSave() {
    let formData = {
      structure: { code: this.etablissementForm.controls["structure"].value },
      region:
        this.etablissementForm.controls["region"].value !== ""
          ? { code: this.etablissementForm.controls["region"].value }
          : null,
      ia:
        this.etablissementForm.controls["ia"].value !== ""
          ? { code: this.etablissementForm.controls["ia"].value }
          : null,
      typeEtablissement:
        this.etablissementForm.controls["typeEtablissement"].value !== ""
          ? { code: this.etablissementForm.controls["typeEtablissement"].value }
          : null,
      typeSystemeEnseignement:
        this.etablissementForm.controls["typeSystemeEnseignement"].value !== ""
          ? {
              code: this.etablissementForm.controls["typeSystemeEnseignement"]
                .value,
            }
          : null,
      ief:
        this.etablissementForm.controls["ief"].value !== ""
          ? { code: this.etablissementForm.controls["ief"].value }
          : null,
      label: this.etablissementForm.controls["label"].value,
      code: this.etablissementForm.controls["code"].value,
    };

    console.log(formData);

    this.parametreService.addEtablissement(formData).subscribe({
      next: (response) => {
        Swal.fire({
          icon: "success",
          html: "Établissement enregistré avec succès.",
          showConfirmButton: false,
          timer: 2000,
        }).then(() => {
          this.location.back();
        });
      },
      complete: () => {},
      error: (error) => {
        this.parametreService.showSwal("error", error?.error?.message);
      },
    });
  }
}

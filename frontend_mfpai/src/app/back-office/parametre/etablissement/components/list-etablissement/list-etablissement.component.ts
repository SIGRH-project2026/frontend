import { Component, inject, OnInit, TemplateRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import Swal from 'sweetalert2';
import { ParametreService } from "../../../services/parametre.service";
import { FormBuilder } from "@angular/forms";
import { Etablissement, Ia } from "../../../../../models/utilisateur";
import { ResponseApi } from "../../../../../models/response-api";
import { CredentialsService } from "../../../../../services/credentials.service";
import { ReferencesService } from 'src/app/services/references.service';
import { ModalDismissReasons, NgbModal } from '@ng-bootstrap/ng-bootstrap';
import {NgxSpinnerService} from "ngx-spinner";

@Component({
  selector: "app-list-etablissement",
  templateUrl: "./list-etablissement.component.html",
  styleUrls: ["./list-etablissement.component.css"],
})
export class ListEtablissementComponent implements OnInit {
  headers: string[] = [
      // "N° reference",
    "Région",
    "IA",
    "IEF",
    "Établissement",
    "Type d’établissement",
    "Statut",
    "Action",
  ];
  page = 1;
  pageSize = 10;

  statut = '';

  etablissementList: Etablissement[] = [];

  collectionSize = 0;


  text = '';
  closeResult = '';
  userInfos: any;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private parametreService: ParametreService,
    private credentialsService: CredentialsService,
    public modalService: NgbModal = inject(NgbModal),
    private spinner: NgxSpinnerService,

  ) {
    this.userInfos = this.credentialsService.getUserInfos();
  }



  ngOnInit(): void {
    this.refreshData();
  }

  refreshData() {
    this.page = 1;
    this.listEtablissementAdvanced(this.page - 1, this.pageSize, "", this.statut);
  }

  onCreateDivisionBureaux() {
    this.router.navigate(["add-etablissement"], {
      relativeTo: this.route.parent,
    });
  }

  onEdit(etablissement: Etablissement) {
    console.log("ici")
    this.router.navigate([etablissement.id, "edit-etablissement"], {
      relativeTo: this.route.parent,
    });
  }

  listEtablissementAdvanced(
    page: number,
    size: number,
    filter: string,
    statut: string
  ) {

    this.spinner.show();
    this.parametreService
      .listEtablissementAdvanced(page, size, filter, statut)
      .subscribe({
        next: (data) => {
          if (data?.status === "OK") {
            this.etablissementList = data?.payload;
            this.collectionSize = data.metadata?.totalElements ?? 0;
          }
          this.spinner.hide();
        },
        error: () => {
          this.spinner.hide();
        },
      });
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
      this.parametreService.changeStatusEtablissement(data?.id).subscribe({
        next: (response: ResponseApi) => {
          if (result.isConfirmed) {
            if (!data.statut) {
              this.text = "Activé";
              data.statut = true;
            } else {
              this.text = "Désactivé";
              data.statut = false;
            }

            Swal.fire({
              title: this.text,
              html: `L'ief <b>${data?.label
                }</b> a été ${this.text.toLowerCase()}.`,
              icon: "success",
              timer: 1500,
              showCancelButton: false,
              showConfirmButton: false,
            });
          }
        },
      });
    });
  }

  onPageChange(page: number) {
    this.page = page;
    this.listEtablissementAdvanced(page - 1, this.pageSize, "", this.statut);
  }

  onStatusChange(event: any) {
    this.statut = event.target.value;
    this.page = 1;
    this.listEtablissementAdvanced(0, this.pageSize, "", this.statut);
  }

  closeModal() {
    this.modalService.dismissAll();
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


  openModal(content: TemplateRef<any>, ief: any) {

    this.modalService.open(content, { ariaLabelledBy: 'modal-basic-title', size: 'l', centered: true }).result.then(
      (result) => {
        this.closeResult = `Closed with: ${result}`;

      },
      (reason) => {
        this.closeResult = `Dismissed ${this.getDismissReason(reason)}`;
      },
    );
  }


}





import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { MutationDTO } from '../../../demandes-mutation-permutation-recues/models/mutationDTO';
import { MutationService } from '../../../demandes-mutation-permutation-recues/services/mutation.service';
import { FileService } from 'src/app/shared/services/files/file.service';

@Component({
    selector: 'app-view-mutation',
    templateUrl: './view-mutation.component.html',
    styleUrls: ['./view-mutation.component.css']
})
export class ViewMutationComponent {

    idMutation : any
    mutation: MutationDTO = new MutationDTO;
    isLoading = true;
    constructor(
        private location: Location,
        private readonly mutationService : MutationService,
        private readonly fileService: FileService,
        private readonly _activatedRoute : ActivatedRoute
    ) {
        this.idMutation = this._activatedRoute.snapshot.paramMap.get('dataId')


    }
    ngOnInit(): void {
        this.getOneMutation()
    }
    goBack() {
        this.location.back()
    }
    getOneMutation(){
        this.mutationService.get(this.idMutation)
            .subscribe({
                next : (data : ResponseApi2) =>{
                    if(data.status?.includes("OK"))
                        this.mutation = data.payload
                    this.isLoading = false
                },
                error: () => this.isLoading = false
            })
    }

    visualiser(doc: any) {
        if (doc?.generatedName)
            this.fileService.openPdfInNewTab(doc.generatedName);
    }

    telecharger(doc: any) {
        if (doc?.generatedName)
            this.fileService.telecharger(doc.generatedName);
    }

    get statusClass(): string {
        const code = this.mutation?.traitementMutation?.statut?.code?.toLowerCase() || 'default';
        return `status-${code}`;
    }

    changerGenre(data : string) : string{
        if(data.toLowerCase() === "soumise")
            return "Soumis"
        if(data.toLocaleLowerCase().includes("transmise"))
           data =  data.replace("Transmise", "Transmis")
         if(data.toLowerCase() === "validée")
            return "Validé"
         if(data.toLowerCase() === "rejétée")
            return "Rejeté"
        
        return data
    }
}

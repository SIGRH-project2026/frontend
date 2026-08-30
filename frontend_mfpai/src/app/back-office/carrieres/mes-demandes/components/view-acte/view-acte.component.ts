import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ActeDTO } from '../models/ActeDTO';
import { ActeService } from 'src/app/services/acteService.service';
import { ResponseApi2 } from 'src/app/shared/models/ResponseApi';
import { UserDTOs } from 'src/app/models/UserDTOs';
import { FileService } from 'src/app/shared/services/files/file.service';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-view-acte',
  templateUrl: './view-acte.component.html',
  styleUrls: ['./view-acte.component.css'],
  standalone: false
})
export class ViewActeComponent implements OnInit{

  actId: any;
  idNumber!:number;
  acte!: ActeDTO;
  agent!:UserDTOs;
  isLoading = true;
  previewUrl: string | null = null;
  previewSafeUrl: SafeResourceUrl | null = null;
  previewName = '';
  previewType = '';
  constructor(
    private location: Location,
    private router: Router,
    private readonly activatedRoute: ActivatedRoute,
    private readonly acteService: ActeService,
    private readonly fileService:FileService,
    private readonly sanitizer: DomSanitizer,

    ) { 
      this.actId = this.activatedRoute.snapshot.paramMap.get('dataId')

    }

  ngOnInit(): void {
    this.getOneDemande();
  }

  getOneDemande(){
    this.acteService.getActe(this.actId)
        .subscribe({
          next : (data : ResponseApi2) => {
            if(data.status?.includes("OK")){
              this.acte = data.payload;
            }
            this.isLoading = false;
          },
          error: () => this.isLoading = false
        });
}

get statusClass(): string {
  const code = this.acte?.statutActe?.code?.toLowerCase().replace(/[^a-z0-9]/g, '') || 'default';
  return `status-${code}`;
}

telecharger(fileName:string){
  this.fileService.telecharger(fileName)
}

visualiser(file: any): void {
  const fileName = typeof file === 'string' ? file : file?.generatedName;
  if (!fileName) return;

  this.closePreview();
  this.fileService.getFile(fileName).subscribe({
    next: (blob: Blob) => {
      this.previewUrl = URL.createObjectURL(blob);
      this.previewSafeUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.previewUrl);
      this.previewName = file?.originalName || fileName;
      this.previewType = blob.type || file?.fileType || '';
    },
    error: () => this.fileService.showSwal('error', 'Impossible d’ouvrir ce document.')
  });
}

closePreview(): void {
  if (this.previewUrl) URL.revokeObjectURL(this.previewUrl);
  this.previewUrl = null;
  this.previewSafeUrl = null;
  this.previewName = '';
  this.previewType = '';
}

isImagePreview(): boolean { return this.previewType.startsWith('image/'); }

isPreviewSupported(): boolean {
  return this.isImagePreview() || this.previewType === 'application/pdf' || this.previewType.startsWith('text/');
}

getFileExtension(file: any): string {
  const name = file?.originalName || file?.generatedName || file || '';
  return (name.includes('.') ? name.split('.').pop() : 'DOC').toUpperCase();
}

formatFileSize(size?: number | null): string {
  return size ? `${size} Ko` : '';
}


  goBack() {
    this.location.back()
  }

}

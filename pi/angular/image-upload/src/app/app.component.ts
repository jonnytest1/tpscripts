import { Component, ChangeDetectorRef } from '@angular/core';
import { ImageService } from './app.service';
import { getSecKey, getSharedKeys, addSharedKey } from './util';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-upload';
  secKey: string;

  importedKeys: Array<string>;

  files: Array<File & { id: number, b64: string }> = [];

  filestr = [];

  constructor(private service: ImageService, private cdr: ChangeDetectorRef) {
    this.secKey = getSecKey();
    this.importedKeys = getSharedKeys();
    this.fetchFiles();
  }
  private fetchFiles() {
    this.service.getFiles()
      .toPromise()
      .then(files => {
        this.filestr = files;
        Promise.all(files.map(async (filestr) => {
          return this.urltoFile(filestr, 'image.jpg', 'image/png');
        }))
          .then(fileList => {
            this.files = fileList;
            this.cdr.detectChanges();
          });
      });
  }

  addKey() {
    const newkey = prompt('sharekey');
    addSharedKey(newkey);
    this.fetchFiles();
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  urltoFile(url: { b64: string, id: number }, filename, mimeType): Promise<File & { id: number, b64: string }> {
    mimeType = mimeType || (url.b64.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url.b64)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) {
        const f: any = new File([buf], filename, { type: mimeType });
        Object.assign(f, url);
        return f;

      })
    );
  }



  onSelect(event) {
    console.log(event);
    for (const file of event.addedFiles) {
      this.toBase64(file)
        .then(async (b64: string) => {
          this.filestr.push(b64);
          const id = await this.service.psotImage(b64).toPromise();
          this.urltoFile({ b64, id: +id }, 'image.jpg', 'image/png')
            .then(nFile => {
              this.files.push(nFile);
            });
        });
    }



  }

  onRemove(event) {
    this.files.splice(this.files.indexOf(event), 1);
    this.filestr.splice(this.filestr.indexOf(event['b64']), 1);

    if (event.id) {
      this.service.remove(event.id).toPromise();
    }

  }
}

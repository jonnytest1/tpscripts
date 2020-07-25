import { Component } from '@angular/core';
import { ImageService } from './app.service';
import { v4 as uuidv4 } from 'uuid';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'image-upload';
  secKey: string;

  files: File[] = [];

  filestr = [];

  constructor(private service: ImageService) {
    this.secKey = localStorage.getItem('secKey');
    if (!this.secKey) {
      this.secKey = uuidv4();
      localStorage.setItem('secKey', this.secKey);
    }
    this.service.getFiles()
      .toPromise()
      .then(files => {
        this.filestr = files;
        Promise.all(files.map(async (filestr) => {
          return this.urltoFile(filestr, 'image.jpg', 'image/png');
        }))
          .then(fileList => {
            this.files = fileList;
          });
      });
  }

  toBase64 = file => new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result);
    reader.onerror = error => reject(error);
  })

  urltoFile(url: { b64: string, id: number }, filename, mimeType) {
    mimeType = mimeType || (url.b64.match(/^data:([^;]+);/) || '')[1];
    return (fetch(url.b64)
      .then(function (res) { return res.arrayBuffer(); })
      .then(function (buf) {
        const f = new File([buf], filename, { type: mimeType });
        Object.assign(f, url);
        return f;

      })
    );
  }



  onSelect(event) {
    console.log(event);
    for (const file of event.addedFiles) {
      this.toBase64(file)
        .then((b64: string) => {
          this.filestr.push(b64);
          this.service.psotImage(b64).toPromise();
          this.urltoFile({ b64, id: -1 }, 'image.jpg', 'image/png')
            .then(nFile => {
              nFile['b64'] = b64;
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

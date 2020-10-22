import { Component, ElementRef, forwardRef, Input, OnInit, ViewChild } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import * as CodeMirror from 'codemirror';

const css = require('codemirror/lib/codemirror.css');
export const CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => CodeEditorComponent),
  multi: true
};
@Component({
  selector: 'code-editor',
  templateUrl: './code-editor.component.html',
  styleUrls: ['./code-editor.component.css'],
  providers: [CUSTOM_INPUT_CONTROL_VALUE_ACCESSOR],
})
export class CodeEditorComponent implements OnInit, ControlValueAccessor {

  @ViewChild('codeEditor')
  elementRef: ElementRef<HTMLElement>;

  @Input()
  codetitle

  onChange: any;

  onTouched: any;

  codeMirror;


  cachedValue;
  constructor() { }
  writeValue(obj: any): void {
    if (!this.codeMirror) {
      this.cachedValue = obj;
    } else {
      this.codeMirror.setValue(this.toDisplayCode(obj));
    }
  }
  registerOnChange(fn: any): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }
  setDisabledState?(isDisabled: boolean): void {
    this.codeMirror.setOption('readonly', isDisabled);
  }

  ngOnInit() {
    const st = document.createElement('style');
    st.innerHTML = css.default.replace('height: 300px;', 'height: 100%;');
    document.head.appendChild(st);
  }

  ngAfterViewInit() {
    require('codemirror/mode/javascript/javascript.js');
    setTimeout(() => {
      this.codeMirror = CodeMirror(this.elementRef.nativeElement, {
        value: this.toDisplayCode(this.cachedValue),
        mode: 'javascript',
        lineNumbers: true
      });

      this.codeMirror.on('change', (e, change) => {
        this.onChange(this.toStorageCode(this.codeMirror.getValue()));
      });
    }, 100);

  }


  toDisplayCode(code: string) {
    return `${code || 'function(data,transformation,receiver){\n\n// code here \n\n}'}`;
  }

  toStorageCode(code: string) {
    return code;
  }
}

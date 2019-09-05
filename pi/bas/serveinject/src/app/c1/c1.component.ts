import { Component, OnInit, Injector, ApplicationRef, ComponentFactoryResolver } from '@angular/core';
import { C2Component } from '../c2/c2.component';

@Component({
  selector: 'app-c1',
  templateUrl: './c1.component.html',
  styleUrls: ['./c1.component.css']
})
export class C1Component implements OnInit {

  constructor(private injector: Injector,
    private applicationRef: ApplicationRef,
    private componentFactoryResolver: ComponentFactoryResolver) {



      
    }

  ngOnInit() {

    const element = document.createElement('app-c2');
    const factory = this.componentFactoryResolver.resolveComponentFactory(C2Component);
    const popupComponentRef = factory.create(this.injector, [], element);
    // Attach to the view so that the change detector knows to run
    this.applicationRef.attachView(popupComponentRef.hostView);
    const comp = popupComponentRef.instance;

  }

}

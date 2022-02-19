import { Component, Input, ViewChild, ElementRef, Renderer2 } from '@angular/core';

@Component({
  selector: "app-expandable",
  templateUrl: "./components-expandable.html",
  //styleUrls: ["./components-expandable.scss"]
})
export class ExpandableComponent {

  @ViewChild("expandWrapper", { read: ElementRef }) expandWrapper: ElementRef;
  @Input("expanded") expanded: boolean = false;
  @Input("expandHeight") expandHeight: string = "50px";

  constructor(public renderer: Renderer2) { }

  ngAfterViewInit() {
    this.renderer.setStyle(this.expandWrapper.nativeElement, "max-height", this.expandHeight);
  }

}


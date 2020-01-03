import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-accordion-panel',
  templateUrl: './accordion-panel.component.html',
  styleUrls: ['./accordion-panel.component.scss'],
})
export class AccordionPanelComponent implements OnInit {

  @Input() title: string;
  @Input() expandable: boolean;
  
  constructor() { }

  ngOnInit() {}

}

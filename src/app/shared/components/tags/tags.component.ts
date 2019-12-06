import { Component, OnInit, Input } from '@angular/core';
import { Filter } from 'src/app/pages/home/models/filter';

@Component({
  selector: 'app-tags',
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.scss'],
})
export class TagsComponent implements OnInit {

  @Input() filter: Filter;
  Filtertype: string;

  constructor() { }

  ngOnInit() {
    if (this.filter.type === 'floor') {
      this.filter.color = 'danger';
      this.filter.icon = 'pin';
    } else {
      this.filter.color = 'primary';
      this.filter.icon = 'pricetag';
    }
  }

}

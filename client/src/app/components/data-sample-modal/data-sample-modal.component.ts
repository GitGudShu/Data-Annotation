import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-data-sample-modal',
  templateUrl: './data-sample-modal.component.html',
  styleUrls: ['./data-sample-modal.component.css']
})
export class DataSampleModalComponent {
  @Input() allClasses: string[] = [];
  @Output() close = new EventEmitter<void>();
  @Output() submit = new EventEmitter<{ name: string; classes: string[] }>();

  selected: string[] = [];
  sampleName: string = '';

  onToggle(label: string) {
    if (this.selected.includes(label)) {
      this.selected = this.selected.filter(l => l !== label);
    } else {
      this.selected.push(label);
    }
  }

  submitSample() {
    this.submit.emit({ name: this.sampleName.trim(), classes: this.selected });
  }
}

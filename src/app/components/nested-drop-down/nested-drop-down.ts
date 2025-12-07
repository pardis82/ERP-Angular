import { Component, input, output } from '@angular/core';
import { Option, SelectValue } from '../select-field/select-field';
import { CommonModule } from '@angular/common';
@Component({
  selector: 'app-nested-drop-down',
  imports: [CommonModule, NestedDropDown],
  templateUrl: './nested-drop-down.html',
  styles: [
    `
      :host {
        display: block;
      }
      .sub-options {
        display: none;
      }
      li:hover > .sub-options {
        display: block;
      }
    `,
  ],
})
export class NestedDropDown {
  option = input.required<Option>();
  value = input<SelectValue>();
  multiple = input<boolean>(false);
  finalSelectedOption = output<Option>();

  isSelected(): boolean {
    if (this.multiple()) {
      const selected = (this.value() as Option[]) || [];
      return selected.some((s) => s.value === this.option().value);
    }
    const selected = (this.value() as Option) || null;
    return selected?.value === this.option().value;
  }
  handleToggle(): void {
    if (!this.option().children || this.option().children?.length === 0)
      this.finalSelectedOption.emit(this.option());
  }
}

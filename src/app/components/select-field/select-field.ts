import {
  Component,
  input,
  output,
  model,
  HostListener,
  ElementRef,
  computed,
  signal,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

export interface Option {
  value: string | number;
  label: string;
}

export type SelectValue = Option | Option[] | null;

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-field.html',
})
export class SelectField {
  // ----- SIGNAL INPUTS -----
  options = input<Option[]>([]);
  label = input<string>('');
  placeholder = input<string>('انتخاب کنید');
  errorMessage = input<string>('');
  className = input<string>('');
  containerClassName = input<string>('');
  showSelectAll = input<boolean>(false);
  selectAllText = input<string>('انتخاب همه');
  deselectAllText = input<string>('لغو همه');
  searchable = input<boolean>(false);
  maxDisplayNum = input<number>(3);
  multiple = input<boolean>(false);
  colSpan = input<string>('');
  // ----- VALUE SIGNAL (TWO-WAY) -----
  value = model<SelectValue>(null);
  valueChange = output<SelectValue>();

  // ----- INTERNAL STATE -----
  query = signal('');
  open = signal(false);
  focused = signal(false);

  constructor(private host: ElementRef<HTMLElement>) {}

  // ----- COMPUTEDS -----
  filteredOptions = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!this.searchable() || !q) return this.options();
    return this.options().filter((o) => o.label.toLowerCase().includes(q));
  });

  buttonText = computed(() => {
    if (this.multiple()) {
      const selected = (this.value() as Option[]) ?? [];
      if (selected.length === 0) return this.placeholder();
      if (selected.length === 1) return selected[0].label;
      if (selected.length <= this.maxDisplayNum()) {
        return selected.map((s) => s.label).join('، ');
      }
      return `${selected.length} آیتم انتخاب شد`;
    }
    const selected = this.value() as Option | null;
    return selected?.label ?? this.placeholder();
  });

  // ----- METHODS -----
  areAllSelected(): boolean {
    if (!this.multiple()) return false;
    const selected = (this.value() as Option[]) ?? [];
    return selected.length === this.options().length && this.options().length > 0;
  }

  toggleOpen() {
    this.open.update((v) => !v);
    if (!this.open()) this.query.set('');
  }

  close() {
    this.open.set(false);
    this.query.set('');
    this.focused.set(false);
  }

  toggleOption(option: Option) {
    if (this.multiple()) {
      const selected = ((this.value() as Option[]) ?? []).slice();
      const idx = selected.findIndex((s) => s.value === option.value);
      if (idx >= 0) selected.splice(idx, 1);
      else selected.push(option);

      this.value.set([...selected]);
      this.valueChange.emit([...selected]);
    } else {
      this.value.set({ ...option });
      this.valueChange.emit({ ...option });
      this.close();
    }
  }

  handleSelectAll() {
    if (!this.multiple()) return;
    if (this.areAllSelected()) {
      this.value.set([]);
      this.valueChange.emit([]);
    } else {
      const copy = this.options().slice();
      this.value.set(copy);
      this.valueChange.emit(copy);
    }
  }

  isSelected(option: Option): boolean {
    if (this.multiple()) {
      const selected = (this.value() as Option[]) ?? [];
      return selected.some((s) => s.value === option.value);
    }
    const selected = this.value() as Option | null;
    return selected?.value === option.value;
  }

  // ----- HOST LISTENERS -----
  @HostListener('document:click', ['$event'])
  onDocClick(evt: MouseEvent) {
    const target = evt.target as Node;
    if (!this.host.nativeElement.contains(target)) this.close();
  }

  @HostListener('document:keydown.escape', ['$event'])
  onEscape(_evt: Event) {
    this.close();
  }

  onQueryKeydown(evt: KeyboardEvent) {
    if (evt.key === 'Escape') this.close();
  }
}

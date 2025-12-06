import {
  Component,
  input,
  output,
  model,
  HostListener,
  ElementRef,
  computed,
  signal,
  forwardRef,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

export interface Option {
  value: string | number;
  label: string;
}

export type SelectValue = Option | Option[] | null;
const SELECT_FIELD_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => SelectField),
  multi: true,
};

@Component({
  selector: 'app-select',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './select-field.html',
  providers: [SELECT_FIELD_VALUE_ACCESSOR],
})
export class SelectField implements ControlValueAccessor {
  // ----- SIGNAL INPUTS -----
  options = input<Option[]>([]);
  backgroundColor = input<string>('');
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

  onChange = (_: any) => {};
  onTouched = () => {};

  writeValue(obj: SelectValue): void {
    this.value.set(obj);
  }

  registerOnChange(fn: any): void {
    this.onChange(fn);
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

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
    this.onTouched();
  }

  close() {
    this.open.set(false);
    this.query.set('');
    this.focused.set(false);
    this.onTouched();
  }

  toggleOption(option: Option) {
    if (this.multiple()) {
      const selected = ((this.value() as Option[]) ?? []).slice();
      const idx = selected.findIndex((s) => s.value === option.value);
      if (idx >= 0) selected.splice(idx, 1);
      else selected.push(option);
      const newValue = [...selected];
      this.value.set(newValue);
      this.valueChange.emit(newValue);
    } else {
      const newValue = { ...option };
      this.value.set(newValue);
      this.valueChange.emit(newValue);
      this.close();
      this.onChange(newValue);
      this.onTouched();
    }
  }

  handleSelectAll() {
    if (!this.multiple()) return;
    let newValue: SelectValue
    if (this.areAllSelected()) {
     newValue = []
    } else {
      newValue = this.options().slice();
    }
    this.value.set(newValue);
    this.valueChange.emit(newValue)
    this.onChange(newValue)
    this.onTouched()
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

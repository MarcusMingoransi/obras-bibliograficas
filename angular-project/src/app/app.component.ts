import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, FormArray } from '@angular/forms';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  form: FormGroup;
  names: FormArray;
  convertedNames = [];

  constructor(private fb: FormBuilder) {
    this.form = this.fb.group({
      numberNames: [0, Validators.required],
      names: this.fb.array([], [Validators.required])
    });
  }

  ngOnInit() {

  }

  get controlNames() {
    return this.form.get('names')['controls'];
  }

  createItem(): FormGroup {
    return this.fb.group({
      name: ['', Validators.required]
    });
  }

  addName(): void {
    this.names = this.form.get('names') as FormArray;
    this.names.push(this.createItem());
  }

  addNames(): void {
    const numberNames = this.form.get('numberNames').value;
    for (let index = 0; index < numberNames; index++) {
      this.addName();
    }
  }

  handleForm(): void {
    if (this.form.valid) {
      this.convertedNames = this.form.get('names').value.map(el => {
        let nameSPlited = el.name.toLowerCase().split(' ');
        return this.handleName(nameSPlited);
      });
    }
  }

  handleName(arrayName: string[]): string {
    const name = arrayName.reduce((acc, element, index) => {
      if (arrayName.length === 1) { // Caso tenha apenas um nome informado
        return element.toUpperCase();
      } else if (index === arrayName.length - 1 && !this.validatePrepositions(element)) { // Caso último nome
        return `${element.toUpperCase()}, ${acc}`;
      } else if (index === arrayName.length - 2) { // Caso penultimo nome
        const lastName = arrayName[arrayName.length - 1];
        if (this.validateLastName(lastName) && arrayName.length !== 2) {
          arrayName[arrayName.length - 1] = `${element} ${lastName}`;
          return acc;
        }
      }
      return acc += `${this.validatePrepositions(element) ? element : this.capitalize(element)} `;
    }, '');

    return name;
  }

  numberNamesIsValid(numberRef): boolean {
    return this.form.get('numberNames').value > numberRef;
  }

  validateLastName(lastName: string): boolean {
    return lastName === 'filho' || lastName === 'filha' || lastName === 'neto' ||
           lastName === 'neta' || lastName === 'sobrinho' ||
           lastName === 'sobrinha' || lastName === 'junior';
  }

  validatePrepositions(word: string): boolean {
    return word === 'da' || word === 'de' || word === 'do' || word === 'das' || word === 'dos';
  }

  capitalize(word: string): string {
    return word.replace(/\b\w/g, l => l.toUpperCase());
  }
}

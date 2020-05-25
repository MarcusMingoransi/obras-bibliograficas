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
      console.log(this.form.value);
      this.convertedNames = this.form.get('names').value.map(el => {
        let nameSPlited = el.name.toLowerCase().split(' ');
        return this.handleName(nameSPlited);
      });
    }
  }

  handleName(arrayName: string[]): string {
    const name = arrayName.reduce((acc, element, index) => {
      console.log(acc, element, index);
      if (arrayName.length === 1) { // Caso tenha apenas um nome informado
        return element.toUpperCase();
      } else if (index === arrayName.length - 1) { // Caso último nome
        return `${element.toUpperCase()}, ${acc}`;
      } else if (index === arrayName.length - 2) { // Caso penultimo nome
        const lastName = arrayName[arrayName.length - 1];
        if (this.validateLastName(lastName)) {
          arrayName[arrayName.length - 1] = `${element} ${lastName}`;
          return acc;
        }
      }
      console.log(this.capitalize(element));
      return acc += `${this.capitalize(element)} `;
    }, '');

    console.log(name);
    return name;
  }

  validateLastName(lastName: string): boolean {
    return lastName.includes('filho') || lastName.includes('filha') || lastName.includes('neto') ||
           lastName.includes('neta') || lastName.includes('sobrinho') ||
           lastName.includes('sobrinha') || lastName.includes('junior');
  }

  validatePrepositions(word: string): boolean {
    return word.includes('da') || word.includes('de') || word.includes('do') || word.includes('das') || word.includes('dos');
  }

  capitalize(word: string): string {
    return word.replace(/\b\w/g, l => l.toUpperCase());
  }
}

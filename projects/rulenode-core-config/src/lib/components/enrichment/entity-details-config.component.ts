import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { EntityDetailsField, entityDetailsTranslations, FetchTo } from '../../rulenode-core-config.models';
import { Observable, of } from 'rxjs';
import { map, mergeMap, share, startWith } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { MatAutocompleteSelectedEvent } from '@angular/material/autocomplete';

@Component({
  selector: 'tb-enrichment-node-entity-details-config',
  templateUrl: './entity-details-config.component.html',
  styleUrls: []
})
export class EntityDetailsConfigComponent extends RuleNodeConfigurationComponent implements OnInit {

  @ViewChild('detailsInput', {static: false}) detailsInput: ElementRef<HTMLInputElement>;

  entityDetailsConfigForm: FormGroup;
  detailsFormControl: FormControl;

  entityDetailsTranslationsMap = entityDetailsTranslations;

  filteredEntityDetails: Observable<Array<EntityDetailsField>>;
  detailsList: Array<EntityDetailsField>;

  private entityDetailsList: EntityDetailsField[] = [];

  searchText = '';

  displayDetailsFn = this.displayDetails.bind(this);

  constructor(protected store: Store<AppState>,
              public translate: TranslateService,
              private fb: FormBuilder) {
    super(store);
    for (const field of Object.keys(EntityDetailsField)) {
      this.entityDetailsList.push(EntityDetailsField[field]);
    }
    this.detailsFormControl = new FormControl('');
    this.filteredEntityDetails = this.detailsFormControl.valueChanges
      .pipe(
        startWith(''),
        map((value) => value ? value : ''),
        mergeMap(name => this.fetchEntityDetails(name)),
        share()
      );
  }

  ngOnInit() {
    super.ngOnInit();
  }

  protected configForm(): FormGroup {
    return this.entityDetailsConfigForm;
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    this.searchText = '';
    this.detailsFormControl.patchValue('', {emitEvent: true});
    this.detailsList = configuration ? configuration.detailsList : [];
    return {
      detailsList: isDefinedAndNotNull(configuration?.detailsList) ? configuration.detailsList : null,
      fetchTo:  isDefinedAndNotNull(configuration?.addToMetadata) ? configuration.addToMetadata ? FetchTo.METADATA : FetchTo.DATA :
        isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.DATA
    };
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.detailsList = this.detailsList;
    return configuration;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.entityDetailsConfigForm = this.fb.group({
      detailsList: [configuration.detailsList, [Validators.required]],
      fetchTo:  [configuration.fetchTo, []]
    });
    this.detailsList = configuration ? configuration.detailsList : [];
  }

  displayDetails(details?: EntityDetailsField): string | undefined {
    return details ? this.translate.instant(entityDetailsTranslations.get(details)) : undefined;
  }

  private fetchEntityDetails(searchText?: string): Observable<Array<EntityDetailsField>> {
    this.searchText = searchText;
    if (this.searchText && this.searchText.length) {
      const search = this.searchText.toUpperCase();
      return of(this.entityDetailsList.filter(field =>
        this.translate.instant(entityDetailsTranslations.get(EntityDetailsField[field])).toUpperCase().includes(search) ));
    } else {
      return of(this.entityDetailsList);
    }
  }

  detailsFieldSelected(event: MatAutocompleteSelectedEvent): void {
    this.addDetailsField(event.option.value);
    this.clear('');
  }

  removeDetailsField(details: EntityDetailsField) {
    const index = this.detailsList.indexOf(details);
    if (index >= 0) {
      this.detailsList.splice(index, 1);
      this.entityDetailsConfigForm.get('detailsList').setValue(this.detailsList);
    }
  }

  addDetailsField(details: EntityDetailsField): void {
    if (!this.detailsList) {
      this.detailsList = [];
    }
    const index = this.detailsList.indexOf(details);
    if (index === -1) {
      this.detailsList.push(details);
      this.entityDetailsConfigForm.get('detailsList').setValue(this.detailsList);
    }
  }

  onEntityDetailsInputFocus() {
    this.detailsFormControl.updateValueAndValidity({onlySelf: true, emitEvent: true});
  }

  clearChipGrid() {
    this.detailsList = [];
    this.entityDetailsConfigForm.get('detailsList').patchValue([], {emitEvent: true});
    setTimeout(() => {
      this.detailsInput.nativeElement.blur();
      this.detailsInput.nativeElement.focus();
    }, 0);
  }

  clear(value: string = '') {
    this.detailsInput.nativeElement.value = value;
    this.detailsFormControl.patchValue(null, {emitEvent: true});
    setTimeout(() => {
      this.detailsInput.nativeElement.blur();
      this.detailsInput.nativeElement.focus();
    }, 0);
  }
}

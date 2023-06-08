import { Component } from '@angular/core';
import { AppState, isDefinedAndNotNull } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { DataToFetch, FetchTo } from '../../rulenode-core-config.models';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'tb-enrichment-node-tenant-attributes-config',
  templateUrl: './tenant-attributes-config.component.html',
  styleUrls: ['./tenant-attributes-config.component.scss']
})
export class TenantAttributesConfigComponent extends RuleNodeConfigurationComponent {

  tenantAttributesConfigForm: FormGroup;
  public fetchToData = [
    {
      name: this.translate.instant('tb.rulenode.attributes'),
      value: DataToFetch.ATTRIBUTES
    },
    {
      name: this.translate.instant('tb.rulenode.latest-telemetry'),
      value: DataToFetch.LATEST_TELEMETRY
    }
  ];

  constructor(protected store: Store<AppState>,
              private fb: FormBuilder,
              private translate: TranslateService) {
    super(store);
  }

  protected configForm(): FormGroup {
    return this.tenantAttributesConfigForm;
  }

  public toggleChange(value) {
    this.tenantAttributesConfigForm.get('dataToFetch').patchValue(value, {emitEvent: true});
  }

  protected prepareInputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    let dataToFetch;
    if (isDefinedAndNotNull(configuration?.telemetry)) {
      dataToFetch = configuration.telemetry ? DataToFetch.LATEST_TELEMETRY : DataToFetch.ATTRIBUTES;
    } else {
      dataToFetch = isDefinedAndNotNull(configuration?.dataToFetch) ? configuration.dataToFetch : DataToFetch.ATTRIBUTES;
    }

    let dataMapping;
    if (isDefinedAndNotNull(configuration?.attrMapping)) {
      dataMapping = configuration.attrMapping;
    } else {
      dataMapping = isDefinedAndNotNull(configuration?.dataMapping) ? configuration.dataMapping : null;
    }

    return {
      dataToFetch,
      dataMapping,
      fetchTo: isDefinedAndNotNull(configuration?.fetchTo) ? configuration.fetchTo : FetchTo.METADATA
    };
  }

  public selectTranslation(latestTelemetryTranslation, attributesTranslation) {
    if (this.tenantAttributesConfigForm.get('dataToFetch').value === DataToFetch.LATEST_TELEMETRY) {
      return latestTelemetryTranslation;
    } else {
      return attributesTranslation;
    }
  }


  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.tenantAttributesConfigForm = this.fb.group({
      dataToFetch: [configuration.dataToFetch, []],
      dataMapping: [configuration.dataMapping, [Validators.required]],
      fetchTo: [configuration.fetchTo, []]
    });
  }

  protected readonly DataToFetch = DataToFetch;
}

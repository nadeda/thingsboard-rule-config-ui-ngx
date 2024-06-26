import { Component } from '@angular/core';
import { AppState } from '@core/public-api';
import { RuleNodeConfiguration, RuleNodeConfigurationComponent } from '@shared/public-api';
import { Store } from '@ngrx/store';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'tb-action-node-assign-to-customer-config',
  templateUrl: './assign-customer-config.component.html',
  styleUrls: []
})
export class AssignCustomerConfigComponent extends RuleNodeConfigurationComponent {

  assignCustomerConfigForm: UntypedFormGroup;

  constructor(protected store: Store<AppState>,
              private fb: UntypedFormBuilder) {
    super(store);
  }

  protected configForm(): UntypedFormGroup {
    return this.assignCustomerConfigForm;
  }

  protected onConfigurationSet(configuration: RuleNodeConfiguration) {
    this.assignCustomerConfigForm = this.fb.group({
      customerNamePattern: [configuration ? configuration.customerNamePattern : null, [Validators.required, Validators.pattern(/.*\S.*/)]],
      createCustomerIfNotExists: [configuration ? configuration.createCustomerIfNotExists : false, []]
    });
  }

  protected prepareOutputConfig(configuration: RuleNodeConfiguration): RuleNodeConfiguration {
    configuration.customerNamePattern = configuration.customerNamePattern.trim();
    return configuration;
  }
}

# Info to Developer

## Contract status

- contract status `presale` & `saleOpening` < `current time`:

  - architect: Proceed To Sale -> cycles through contract states -> `postpresale_distribution`, `postpresale_cashout` to reach `sale`
  - buyer: No Button - Wait for the architect, Show status: `Post-presale Phase`

- contract status `sale` & `saleOpening` < `current time` < `saleClose`:

  - architect: No Button - Wait until Sale closed
  - buyer: Buy PART Token

- contract status `sale` & `saleClose` < `current time`:

  - architect: Initialize Properties -> proceed to contract state: `property_selection`
  - buyer: No Button - Wait for the architect, Show status: `Property Initialization Phase`

- contract status `property_selection` & `saleClose` < `current time` < `distributionStart`:

  - architect: No Button - Wait until Distribution starts
  - buyer: Select Preferences

- contract status `property_selection` & `distributionStart` < `current time`:

  - architect: Distribute Properties -> cycle to contract state: `property_distribution`, `ended`
  - buyer: No Button - Wait for the architect, Show status: `Distribution Phase`

- contract status `ended`:
  - properties distributed, Show status: `Property Distribution finished`

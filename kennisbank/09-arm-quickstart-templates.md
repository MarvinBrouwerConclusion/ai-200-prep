# ARM en Azure Quickstart Templates

Gecontroleerd op 5 oktober 2026.

## ARM-template

Een Azure Resource Manager-template beschrijft Azure-infrastructuur declaratief. Je legt de gewenste resources, configuratie, parameters, outputs en afhankelijkheden vast. Azure Resource Manager voert de deployment uit.

- JSON is het oorspronkelijke ARM-templateformaat.
- Bicep is een compactere taal die naar ARM JSON wordt omgezet.
- Dezelfde template kan herhaalbaar via portal, Azure CLI, PowerShell of een pipeline worden uitgerold.

## Azure Quickstart Templates

Microsoft onderhoudt met de community een grote GitHub-verzameling voorbeeldtemplates:

https://github.com/Azure/azure-quickstart-templates

De actuele repository bevat **1.275** template-ingangen onder `quickstarts`. Het zijn voorbeelden in Bicep en/of ARM JSON voor veel Azure-resources en scenario's.

Gebruik:

1. Zoek een passend voorbeeld.
2. Lees de README, parameters en resources.
3. Controleer API-versies, beveiliging, regio en kosten.
4. Pas het voorbeeld aan de eigen standaarden aan.
5. Test eerst buiten productie.

Een quickstart is een startpunt en niet automatisch productiegeschikt.

## Azure Blueprints

Azure Blueprints bundelde meerdere governanceonderdelen:

- ARM-templates
- Resourcegroepen
- Azure Policy-initiatieven en assignments
- RBAC-role assignments
- Versies, assignments, auditing en resource locks

Zo kon een organisatie wettelijke of interne eisen vertalen naar een herhaalbare, gecontroleerde Azure-omgeving. Een blueprint bevatte niet automatisch de wetgeving zelf; de organisatie moest de juiste technische controls kiezen en onderhouden.

Azure Blueprints wordt uitgefaseerd:

- Sinds 31 juli 2026 kunnen geen nieuwe definities en versies worden gemaakt.
- De dienst is nog niet volledig verwijderd; bestaande blueprints kunnen tijdens de gefaseerde uitfasering nog zichtbaar of beperkt bruikbaar zijn.
- Volledige beëindiging: 31 januari 2027.
- Microsoft adviseert Template Specs voor opslag en versiebeheer en Deployment Stacks voor deployment, lifecycle en bescherming. Azure Policy en RBAC leveren de governancecontrols.

## Bronnen

- https://github.com/Azure/azure-quickstart-templates
- https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/template-tutorial-quickstart-template
- https://learn.microsoft.com/en-us/azure/azure-resource-manager/templates/quickstart-create-templates-use-the-portal
- https://learn.microsoft.com/en-us/azure/governance/blueprints/blueprint-retirement
- https://learn.microsoft.com/en-us/azure/governance/blueprints/migrate-to-template-specs

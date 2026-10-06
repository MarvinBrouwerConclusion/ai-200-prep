# Azure Local

Gecontroleerd op 5 oktober 2026.

## Kern

Azure Local is Microsoft-infrastructuursoftware voor gevalideerde hardware in een eigen locatie. Het brengt een Azure-achtige beheerervaring naar lokale of gedistribueerde omgevingen.

Belangrijke onderdelen:

- Gevalideerde hardware
- Azure Local OS
- Hyper-V voor compute
- Storage Spaces Direct voor storage
- Azure Arc als beheer- en governancelaag
- Windows- en Linux-VM's
- AKS enabled by Azure Arc
- Geselecteerde Azure- en Arc-enabled services

## Connected Azure Local

- Azure blijft de control plane.
- Beheer via Azure Portal, ARM/Bicep, Azure CLI en Azure Policy.
- Ondersteunt onder meer VM's, AKS en Azure Virtual Desktop-session hosts.
- Lokale workloads kunnen blijven draaien bij een tijdelijke verbindingsstoring, maar regulier beheer verwacht cloudconnectiviteit.

## Disconnected operations

- De control plane draait lokaal.
- Geen voortdurende verbinding met Azure of internet nodig.
- Gericht op soevereine, gereguleerde, geclassificeerde en afgelegen omgevingen.
- Vereist een geschikt contract, supportplan, aantoonbare noodzaak en Premier Solutions-hardware.
- Beschikbaar vanaf Azure Local 2602.
- De lokale dienstenset is kleiner; AKS in disconnected mode is momenteel preview.
- AVD wordt volgens de huidige deploymentmatrix niet ondersteund in disconnected mode.

## Microsoft 365 Local

- Inmiddels algemeen beschikbaar; de oudere lokale ODT noemt nog private preview.
- Draait Exchange Server, SharePoint Server en Skype for Business Server op klantbeheerde Azure Local-infrastructuur.
- Ondersteunt connected en volledig disconnected gebruik.
- Vereist een Microsoft 365 Local-solution partner en ondersteunde Premier Solutions-hardware.
- Microsoft 365 Copilot maakt geen deel uit van Microsoft 365 Local.

## Hardwarecategorieën

- Premier Solutions: turnkey en het sterkst geïntegreerd.
- Integrated Systems: gevalideerd systeem met vooraf geïnstalleerde software.
- Validated Nodes: meer hardwarekeuze, met meer integratiewerk.

## Let op bij het lesmateriaal

- `Azure Local 200 pitch.pdf` is bijgewerkt in oktober 2024; previewstatussen kunnen verouderd zijn.
- De prijsdia met `$10 per fysieke core per maand` is tijdgebonden. Controleer altijd de actuele prijspagina en overeenkomst.
- De uitspraak dat *alle* Arc-enabled services werken is te breed. Ondersteuning verschilt per deploymenttype en versie.

## Bronnen

- `7 Azure local/Azure Local 200 pitch.pdf`
- `7 Azure local/Hybrid enabled by Azure Arc.pdf`
- `7 Azure local/Azure local.odt`
- https://learn.microsoft.com/en-us/azure/azure-local/faq
- https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/private/azure-local/disconnected-operations-overview
- https://learn.microsoft.com/en-us/azure/azure-local/concepts/microsoft-365-local-overview
- https://learn.microsoft.com/en-us/azure/azure-local/plan/find-your-deployment-type
- https://azure.microsoft.com/en-us/pricing/details/azure-local/

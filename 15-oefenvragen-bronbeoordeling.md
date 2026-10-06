# Externe oefenvragen - bronbeoordeling

## Bron

https://myportal.utt.edu.tt/ICS/icsfs/b00d50f1-7ec7-40d2-9a2c-9eeff5ad1077.pdf?target=913fb9b0-5453-49f2-a243-d000ca48873f

Lokale kopie: `bron-oefenvragen.pdf`

## Betrouwbaarheid

- Dit is geen officiële Microsoft-bron. De metadata verwijst naar een commerciële braindumpwebsite.
- De pdf bevat slechts enkele voorbeeldvragen en daarna vooral reclame.
- Antwoorden worden alleen gebruikt nadat ze tegen de actuele Microsoft-documentatie en AI-200-studiegids zijn gecontroleerd.
- We nemen de onderliggende leerdoelen en vraagvormen mee, maar kopiëren geen volledige examenvragen.

## Bruikbare vraagpatronen

### Key Vault, managed identity en RBAC

- Geen credentials in code of configuratie: gebruik een managed identity.
- Alleen secrets lezen: **Key Vault Secrets User**.
- Geef de rol op een zo klein mogelijke passende scope, meestal de specifieke vault.
- **Key Vault Reader** kan metadata lezen, maar niet de geheime waarde.
- **Key Vault Administrator** is veel te ruim wanneer de app alleen secrets hoeft te lezen.

### Redis-cache en verouderde data

- Als brondata verandert en stale data zo snel mogelijk moet verdwijnen: invalideer/verwijder de betreffende cache-entry bij de bronwijziging.
- TTL beperkt hoe lang data maximaal verouderd kan blijven, maar reageert niet direct op een wijziging.
- Een eviction policy zoals LRU gaat over geheugenruimte, niet over juistheid of actualiteit van data.

### Event Grid

- Filteren op velden in `data`: **advanced filter**.
- Niet-afgeleverde events bewaren: configureer een **dead-letter destination** in Azure Blob Storage.
- Pogingen begrenzen: **maximum delivery attempts**; TTL kan de levering eerder beëindigen.
- Correctie op de pdf: reken niet op een algemene standaardretentie van 14 dagen voor blobs in de dead-lettercontainer. Beheer bewaring via de opslag- en lifecycleconfiguratie.

### App Service en runtime-secrets

- Een GitHub secret staat buiten de Git-geschiedenis, maar wordt niet vanzelf een veilig runtime-secret in App Service.
- Voorkeursantwoord wanneer de container het secret tijdens runtime nodig heeft: Key Vault + managed identity + Key Vault reference in een App Service-setting.
- Zonder een versienummer in de reference gebruikt App Service de nieuwste secretversie. App Service ververst references periodiek; een configuratiewijziging of expliciete refresh kan dit versnellen.

### Vraag buiten de kernscope

- De vraag over Azure AI Foundry-deploymenttypen en PTU staat niet in de huidige officiële AI-200-doelen. Alleen als extra context bewaren, niet prioriteren voor dit examen.

## Gebruik in ons proefexamen

Maak eigen scenario's met dezelfde beslissingen:

1. Kies identity, RBAC-rol en scope voor een app die alleen secrets leest.
2. Kies tussen TTL, invalidation en eviction bij verschillende cache-eisen.
3. Configureer Event Grid-filtering, retries, TTL en dead-lettering.
4. Kies een veilige runtime-secretoplossing voor App Service of Container Apps.
5. Laat bij iedere vraag ook uitleggen waarom de afleiders niet passen.

## Gecontroleerde officiële bronnen

- AI-200-studiegids: https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- Key Vault RBAC: https://learn.microsoft.com/en-us/azure/key-vault/general/rbac-guide
- App Service Key Vault references: https://learn.microsoft.com/en-us/azure/app-service/app-service-key-vault-references
- Event Grid-filters: https://learn.microsoft.com/en-us/azure/event-grid/how-to-filter-events
- Event Grid delivery en retries: https://learn.microsoft.com/en-us/azure/event-grid/delivery-and-retry

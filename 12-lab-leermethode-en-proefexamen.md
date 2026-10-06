# Lab-leermethode en proefexamen

De labs geven vooral procedurele ervaring. Voor AI-200 voegen we per lab begrip, ontwerpkeuzes, diagnose en actieve kenniscontrole toe.

## Vaste behandeling per lab

1. **Architectuur:** welke onderdelen bouwen we en hoe communiceren ze?
2. **Doel:** welk probleem lost iedere Azure-dienst op?
3. **Uitvoering:** wat doen de belangrijkste CLI-, SDK- of configuratiestappen?
4. **Keuzes:** wanneer kies je deze dienst of aanpak boven een alternatief?
5. **Beveiliging en kosten:** welke identity, rollen, secrets, SKU's en schaalinstellingen zijn relevant?
6. **Diagnose:** welke controles en logs gebruik je bij een storing?
7. **Kenniscontrole:** enkele scenario- of keuzevragen zonder de antwoorden vooraf te tonen.

## Hoe we CLI-labs gebruiken

CLI is handig omdat configuraties expliciet en herhaalbaar zichtbaar zijn. Voor het examen leren we echter **niet ieder commando uit het hoofd**. Per belangrijk commando halen we vijf dingen eruit:

1. **Resource:** welke Azure-dienst of welk object wordt gemaakt of gewijzigd?
2. **Intentie:** welk probleem lost de stap op?
3. **Cruciale opties:** bijvoorbeeld identity, scope, image, secret, partition key, trigger of scale threshold.
4. **Controle:** met welk commando, log of endpoint bewijzen we dat het werkt?
5. **Foutbeeld:** welke verkeerde instelling veroorzaakt 401/403, 429, image-pull-, startup- of connectiviteitsproblemen?

De officiële AI-200-studiegids noemt daarnaast expliciet **Python, Azure-SDK's en SDK's van derden**. Daarom vullen we CLI-labs aan met:

- een klein Python-SDK-voorbeeld wanneer de exameneis expliciet verbinden, queryen, publiceren of ophalen noemt;
- het relevante JSON/YAML-object voor Container Apps of AKS;
- de equivalente portalconcepten, zodat een vraag niet afhankelijk is van één interface;
- scenariovragen over servicekeuze, security, kosten en troubleshooting.

**Niet memoriseren:** volledige resource-ID's, willekeurige namen en alle CLI-switches.

**Wel herkennen:** service, actie, identity/RBAC, scope, configuratie-effect en verificatiemethode.

### Welke ontvangen labs bevatten Python/SDK-code?

- **Labs 01–08:** vooral deployment en beheer met Azure CLI, YAML, Docker en `kubectl`. De voorbeeldapplicaties zijn wel vaak Python, maar de leerhandeling draait vooral om containerinfrastructuur.
- **Labs 09–11, Cosmos DB:** zelf Python-functies aanvullen met `azure-cosmos` en `azure-identity`; CRUD/point reads, queries, vector search, metadatafilters en indexvergelijking.
- **Labs 12–14, PostgreSQL:** Python met `psycopg` plus SQL en `pgvector`; agent state, vector search en HNSW/IVFFlat-optimalisatie. `psycopg` is een PostgreSQL-driver van derden, geen Azure SDK.
- **Labs 15–17, Managed Redis:** Python met `redis-py`, Entra-authenticatie, hashes/TTL/delete, pub/sub en RediSearch-vectorzoekopdrachten.
- **Lab 18, Service Bus:** Python met `azure-servicebus` en `DefaultAzureCredential`; queues, peek-lock, DLQ, topics en subscriptions.
- **Lab 19, Event Grid:** Python met de Event Grid SDK; CloudEvents publiceren, filtered subscriptions en pull delivery met receive/acknowledge/reject.
- **Lab 20, Azure Functions/MCP:** een Python Function App maken en MCP tool triggers implementeren.
- **Lab 21, Key Vault:** Python Azure SDK; secrets ophalen, properties tonen, nieuwe versies/rotatie en caching.
- **Lab 22, App Configuration:** Python SDK; instellingen, labels en Key Vault references ophalen.
- **Lab 23, OpenTelemetry:** Python OpenTelemetry SDK plus Azure Monitor-exporter; custom spans en attributen.
- **Lab 24:** voornamelijk KQL-query's schrijven en analyseren.

Conclusie: het CLI-zware begin is bewust gericht op containers. Het grootste deel van de data-, messaging-, security- en observabilitylabs bevat juist Python- of SDK-werk.

## Wanneer is een lab echt afgerond?

- De praktijkstappen werken.
- De architectuur kan zonder instructie worden uitgelegd.
- De belangrijkste keuze kan in een examencasus worden herkend.
- Een typische fout kan systematisch worden onderzocht.
- De controlevragen zijn grotendeels goed beantwoord; fouten komen terug in de notities en herhaling.

## Lab 02 - kennis die naast de stappen nodig is

- Verschil tussen **App Service Plan**, **Web App** en **containerimage**.
- Het plan bepaalt regio, besturingssysteem, compute, schaal en kosten; de Web App draait de workload; de image bevat de applicatie.
- Een private ACR vereist authenticatie voordat App Service de image kan pullen.
- **Managed identity = wie de Web App is.** De identiteit wordt door Microsoft Entra beheerd en vereist geen opgeslagen wachtwoord.
- **AcrPull = wat de Web App in ACR mag.** Alleen lezen/pullen; geen push of registrybeheer.
- Ken `AcrPull` toe aan de principal van de Web App met de ACR als scope: least privilege.
- Bij een ABAC-enabled registry hoort voor repositoryleestoegang de rol **Container Registry Repository Reader**.
- `WEBSITES_PORT` geeft de luisterpoort van de container door aan App Service.
- `WEBSITES_ENABLE_APP_SERVICE_STORAGE=true` maakt persistente App Service-opslag beschikbaar, onder meer via `/home` op Linux.
- Always On beperkt cold starts, maar is afhankelijk van de App Service-tier en gebruikt continu capaciteit.
- Containerlogging legt stdout/stderr vast; Kudu/SCM geeft extra configuratie- en logweergaven maar is niet hetzelfde als de applicatiecontainer.
- Diagnosevolgorde bij een mislukte image pull: volledige image/tag → bestaat de image? → managed identity actief? → juiste rol en scope? → role propagation? → ACR-netwerktoegang en authenticatie-instellingen? → containerlogs.
- Diagnosevolgorde bij 502/503: container pull/starttijd → juiste poort → startupfout → logs → health en applicatierespons.

## Afsluitend proefexamen

Na de labs maken we samen een proefexamen dat de vier officiële domeinen afdekt:

- Containerized solutions op Azure
- Data management voor AI-oplossingen
- Azure-services verbinden en gebruiken
- Beveiliging, monitoring en troubleshooting

Opzet:

1. Eerst examenvragen zonder hints of directe antwoorden.
2. Mix van meerkeuze, meerdere juiste antwoorden, volgorde- en scenarioselectie.
3. Score en fouten per examendomein bijhouden.
4. Iedere fout uitleggen: waarom het juiste antwoord klopt en waarom de afleiders niet passen.
5. Zwakke onderwerpen gericht herhalen met nieuwe vragen.
6. Afsluiten met een korte herkansing op alleen de zwakke onderwerpen.

De vragen toetsen keuzes en probleemoplossing. We gebruiken zo veel mogelijk bestaande openbare oefenvragen als bron, controleren ieder antwoord en herformuleren alleen waar nodig. Betaalde of gelekte examendumps worden niet gebruikt. Zelfgeschreven vragen vullen uitsluitend ontbrekende examendoelen aan.

Externe oefenvragen gebruiken we alleen als inspiratie voor onderwerpen en vraagvormen. Antwoorden worden eerst gecontroleerd tegen de actuele officiële documentatie. De bronbeoordeling en geselecteerde patronen staan in `15-oefenvragen-bronbeoordeling.md`.

De vaste bronnenlijst en prioriteitsvolgorde staan in `17-online-oefenvraagbronnen.md`.

## Lab 03 - Containerized backend API op Azure Container Apps

### Architectuur en doel

- **ACR** bevat de private containerimage; **Azure Container Apps** voert de API uit.
- Een **Container Apps environment** is de beveiligings-, netwerk- en observabilitygrens waarin één of meer container apps draaien. De environment kan aan een Log Analytics workspace zijn gekoppeld.
- De Container App krijgt een **system-assigned managed identity**. Met `--registry-identity system` gebruikt de app die identiteit om de private image uit ACR te pullen; hiervoor is `AcrPull` op de registry nodig.
- `--ingress external` geeft de app een publiek bereikbare FQDN. `--target-port` moet overeenkomen met de poort waarop het proces in de container luistert.

### Configuratie en secrets

- Een gewone environment variable, zoals `MODEL_NAME`, bevat niet-geheime configuratie en behoort tot de revision-template.
- Een Container Apps-secret is application-scope. De applicatie leest het via een verwijzing zoals `EMBEDDINGS_API_KEY=secretref:embeddings-api-key`; de geheime waarde staat dan niet letterlijk in de environment-variableconfiguratie.
- Productievoorkeur: gebruik waar mogelijk een **Key Vault reference** met managed identity in plaats van een geheime waarde rechtstreeks in Container Apps op te slaan.
- Belangrijke nuance: `az containerapp secret set` verandert op zichzelf geen revision. Bestaande revisions moeten worden herstart of vervangen om een gewijzigde secretwaarde te lezen.
- In deze lab ontstaat de nieuwe revision door `az containerapp update --set-env-vars ...`, omdat environment variables revision-scope zijn.

### Revisions, replicas en logs

- Een **revision** is een onveranderlijke versie van de app-template, inclusief image, environment variables, resources en scale rules.
- Een **replica** is een werkelijk draaiende instance van een revision. Eén revision kan nul, één of meerdere replicas hebben.
- Controlevolgorde: app → revision → replica → container → console- of system logs.
- `az containerapp logs show` toont recente console-uitvoer van stdout/stderr. Historische analyse gebeurt in de gekoppelde Log Analytics workspace, meestal met KQL.
- Gunicorn-startregels bewijzen dat het proces is gestart en op de verwachte poort luistert; HTTP-regels bewijzen dat requests de applicatie bereiken.
- In deze voorbeeldapp geeft `POST /process` het volledige analyseresultaat direct als JSON terug. `GET /documents` geeft de opgeslagen document-ID's en `GET /documents/<document_id>` haalt één resultaat opnieuw op.
- De code schrijft naar `/tmp/processed` in het lokale bestandssysteem van de replica. Dit is tijdelijke, replica-gebonden opslag: een nieuwe replica of revision hoeft deze bestanden niet te hebben. Gebruik voor echte duurzame/gedeelde resultaten bijvoorbeeld Blob Storage, ADLS of een database.
- De analyse in deze lab is **mockdata**: entities, key phrases en sentiment zijn vast geprogrammeerd. Tekst in `document.txt` wordt geteld en opgeslagen, maar niet als prompt door een echt AI-model uitgevoerd.

### Examenkeuzes en diagnose

- Kies **Container Apps** voor containerworkloads met revisions, traffic splitting en HTTP- of eventgedreven autoscaling zonder zelf een Kubernetes-cluster te beheren.
- Kies **AKS** wanneer Kubernetes-API's, clusterbeheer en uitgebreide orchestratiecontrole nodig zijn. Kies **App Service** voor klassieke webapps/API's met App Service-functies zoals deployment slots.
- Bij `ImagePullBackOff`, `unauthorized` of `403`: controleer image/tag, registry-server, managed identity, `AcrPull`-scope, role propagation en ACR-netwerk/authenticatie.
- Bij `502` of `503`: controleer revisionstatus, replica/containerstart, target port, startup/readiness-probes en console/system logs.
- Bij ontbrekende configuratie: controleer of de secret bestaat, of de env-var exact `secretref:<naam>` gebruikt en of een nieuwe of herstartte revision de waarde heeft geladen.

### Mogelijke controlevragen

1. Welke wijziging maakt hier de tweede revision: de secret aanmaken of de environment-variableverwijzing toevoegen?
2. Waarom zijn zowel een managed identity als de rol `AcrPull` nodig?
3. Waar zoek je historische logs als `az containerapp logs show` niet ver genoeg teruggaat?
4. Wat is het verschil tussen een Container Apps environment, revision en replica?

# AI-200 — service tiers en keuzevragen

Gecontroleerd op 5 oktober 2026.

## Eerst dit onderscheid

- Een tier/SKU bepaalt prijs, capaciteit, isolatie en beschikbare functies.
- **Premium 2 is geen algemene Azure-term.** De betekenis hangt af van de dienst.
- `P2v3` bij App Service betekent: Premium, grootte 2, hardwaregeneratie v3.
- `P2` bij Microsoft Entra ID betekent: licentieplan 2 met extra identiteitsbeveiliging.
- Lees in een examenvraag eerst de vereiste functie en kies daarna de laagste passende tier.

## Hoge relevantie voor AI-200

### Azure Container Registry (ACR)

| Tier | Wanneer kiezen? |
|---|---|
| Basic | Leren, testen en laag gebruik. |
| Standard | De meeste normale productieomgevingen; meer opslag en throughput. |
| Premium | Private Endpoint, geo-replicatie, hoge throughput en hoge limieten. Het retentiebeleid voor untagged manifests is momenteel Premium/preview. |

**Examenprikkel:** private netwerktoegang of geo-replicatie vereist → **Premium**.

### Azure App Service Plan

| Tier | Wanneer kiezen? |
|---|---|
| Free/Shared | Alleen eenvoudige ontwikkeling of test; gedeelde compute en geen financiële SLA. |
| Basic | Goedkope dedicated VM-capaciteit, maar beperkte productiefuncties. |
| Standard | Normale productie; deployment slots en autoscaling zijn beschikbaar vanaf Standard. |
| Premium v2/v3/v4 | Meer CPU, geheugen, schaal en prestaties voor zwaardere productie. |
| Isolated v2/v4 | App Service Environment met maximale netwerk- en compute-isolatie. |

**Examenprikkel:** staging-slot + swap of autoscaling → minimaal **Standard**. `P2v3` is een App Service-SKU en staat los van Entra ID P2.

### Azure Container Apps

| Plan | Wanneer kiezen? |
|---|---|
| Consumption | Serverless, vraaggestuurd, scale-to-zero en betalen voor daadwerkelijk gebruik. |
| Dedicated workload profile | Dedicated hardware, resource-isolatie, speciale compute/GPU of voorspelbare continue belasting. |

**Examenprikkel:** onregelmatig eventverkeer en scale-to-zero → **Consumption**; vaste zware belasting of speciale hardware → **Dedicated**.

### Azure Kubernetes Service (AKS)

| Tier | Wanneer kiezen? |
|---|---|
| Free | Ontwikkeling/test; geen financieel gedekte uptime-SLA. |
| Standard | Productie; uptime-SLA en hogere betrouwbaarheid. |
| Premium | Standard plus Long-Term Support voor Kubernetes. |

**Examenprikkel:** productie-SLA → **Standard**; langere Kubernetes-versieondersteuning → **Premium**.

### Azure Cosmos DB

Cosmos DB gebruikt vooral **capacity modes**, geen simpele Basic/Standard/Premium-indeling.

| Mode | Wanneer kiezen? |
|---|---|
| Serverless | Lage gemiddelde belasting, onregelmatig gebruik; betalen per verbruikte RU. Eén regio. |
| Provisioned throughput, manual | Stabiele belasting en voorspelbare RU/s. |
| Provisioned throughput, autoscale | Productie met variabele pieken en behoefte aan voorspelbare prestaties/SLA. |

**Examenprikkel:** sporadisch gebruik → **serverless**; continu of multiregion → **provisioned**; wisselende productiepieken → **autoscale**.

### Azure Database for PostgreSQL Flexible Server

| Tier | Wanneer kiezen? |
|---|---|
| Burstable | Ontwikkeling/test en lage, niet-continue CPU-belasting; niet aanbevolen voor zware productie. |
| General Purpose | Balans tussen CPU en geheugen; standaardkeuze voor productie. |
| Memory Optimized | Veel geheugen, hoge concurrency en zware vector-/databaseworkloads. |

**Examenprikkel:** aanhoudende vectorsearch of veel geheugen nodig → **Memory Optimized**; gewone productie → **General Purpose**.

### Azure Managed Redis

| Tier | Wanneer kiezen? |
|---|---|
| Memory Optimized | Veel data per vCPU; capaciteit belangrijker dan maximale throughput. |
| Balanced | Normale workloads met evenwicht tussen geheugen en rekenkracht. |
| Compute Optimized | Maximale throughput en rekenkracht. |
| Flash Optimized | Zeer grote datasets goedkoper opslaan met RAM + NVMe; meer latency en functiebeperkingen. |

**Examenprikkel:** hoge vectorzoek-throughput → **Compute Optimized**; grote dataset en kosten belangrijker → **Memory/Flash Optimized**, afhankelijk van vereiste functies.

### Azure Service Bus

| Tier | Wanneer kiezen? |
|---|---|
| Basic | Alleen queues en eenvoudige messaging. |
| Standard | Topics/subscriptions, sessions, transactions en duplicate detection op gedeelde capaciteit. |
| Premium | Dedicated messaging units, voorspelbare latency, Private Link/VNet, geo-replicatie en grote AMQP-berichten tot 100 MB. |

**Examenprikkel:** publish/subscribe → minimaal **Standard**; private endpoint of voorspelbare mission-critical prestaties → **Premium**.

### Azure Functions hosting

| Plan | Wanneer kiezen? |
|---|---|
| Flex Consumption | Aanbevolen serverless plan; snelle event-driven scaling, VNet en optionele always-ready instances. Linux. |
| Consumption | Eenvoudig pay-per-execution en scale-to-zero; meer cold-start- en netwerkbeperkingen. |
| Premium | Always-ready instances, event-driven scaling, private networking en minder cold starts. |
| Dedicated | Draaien op bestaand App Service Plan; vaste capaciteit en kosten. |
| Container Apps | Eigen container, KEDA, revisions, traffic splitting en eventueel GPU. |

**Examenprikkel:** serverless + private netwerk → **Flex Consumption**; cold starts vermijden met always-warm capaciteit → **Premium** of Flex met always-ready; eigen container/revisions → **Container Apps**.

### Azure Key Vault

| Tier | Wanneer kiezen? |
|---|---|
| Standard | Secrets, certificaten en software-protected keys. |
| Premium | HSM-protected keys voor strengere cryptografische/compliance-eisen. |

**Examenprikkel:** alleen secret/API-key opslaan → **Standard is voldoende**; sleutel moet door een HSM worden beschermd → **Premium**.

### Azure App Configuration

| Tier | Wanneer kiezen? |
|---|---|
| Free | Evaluatie en kleine niet-productieomgeving. |
| Developer | Lage volumes voor ontwikkeling/test; bevat Private Link. |
| Standard | Middelgrote productie; CMK, soft delete en geo-replicatie. |
| Premium | Hoge volumes, hogere throughput/opslag en hoogste geo-replicatie-SLA. |

**Examenprikkel:** feature flags en gewone configuratie horen in App Configuration; geheimen blijven in Key Vault.

## Aanvullend

### Azure Event Grid

- **Basic:** push van Azure-systeem- en custom events naar handlers; normale event-driven Azure-integratie.
- **Standard:** Event Grid namespaces, MQTT, pull delivery, hogere throughput en langere retentie.

### Azure Event Hubs

- **Basic:** eenvoudige eventstreaming.
- **Standard:** onder andere Kafka, Capture en geo-DR.
- **Premium:** resource-isolatie, hogere prestaties, CMK en geo-replicatie.
- **Dedicated:** exclusieve capaciteit voor zeer grote workloads.

### Microsoft Entra ID

- **Free:** basisidentiteit, gebruikers en groepen.
- **P1:** onder andere Conditional Access en geavanceerder beheer.
- **P2:** Identity Protection/risk-based Conditional Access en Privileged Identity Management (PIM).
- Entra ID P2 is nuttige Azure-basiskennis, maar staat niet als zelfstandig hoofdonderwerp in de officiële AI-200 skills outline.

## Bronnen

- https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- https://learn.microsoft.com/en-us/azure/container-registry/container-registry-skus
- https://learn.microsoft.com/en-us/azure/app-service/overview-hosting-plans
- https://learn.microsoft.com/en-us/azure/aks/core-aks-concepts
- https://learn.microsoft.com/en-us/azure/container-apps/plans
- https://learn.microsoft.com/en-us/azure/cosmos-db/throughput-serverless
- https://learn.microsoft.com/en-us/azure/postgresql/compute-storage/concepts-compute
- https://learn.microsoft.com/en-us/azure/redis/managed-redis/managed-redis-overview
- https://learn.microsoft.com/en-us/azure/service-bus-messaging/service-bus-premium-messaging
- https://learn.microsoft.com/en-us/azure/azure-functions/functions-scale
- https://learn.microsoft.com/en-us/azure/key-vault/general/overview
- https://learn.microsoft.com/en-us/azure/azure-app-configuration/faq
- https://learn.microsoft.com/en-us/azure/event-grid/choose-right-tier
- https://learn.microsoft.com/en-us/azure/event-hubs/compare-tiers
- https://learn.microsoft.com/en-us/entra/fundamentals/licensing

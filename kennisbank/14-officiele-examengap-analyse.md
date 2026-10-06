# AI-200 — gap-analyse tegen de officiële studiegids

Gecontroleerd op 6 oktober 2026.

Officiële bron: https://learn.microsoft.com/nl-nl/credentials/certifications/resources/study-guides/ai-200

Legenda:
- ✅ Goed afgedekt in de huidige eigen notities.
- 🟡 Deels afgedekt; theorie, code of praktische beheersing ontbreekt nog.
- ❌ Nog onvoldoende afgedekt.

## Samenvatting

De huidige kennis is het sterkst bij **ACR, Container Apps, containerdiagnose en Cosmos DB-vector search**. De grootste gaten zitten bij:

1. **Azure Database for PostgreSQL en pgvector** — vrijwel het hele officiële onderdeel.
2. **Azure Managed Redis** — cachingoperaties, expiration/invalidation en vectorindexering.
3. **Python-SDK-vaardigheid** — daadwerkelijk verbinden, query's uitvoeren en fouten afhandelen.
4. **Cosmos DB consistency levels en change feed processor**.
5. **Event Grid en Service Bus in code**, inclusief retries en dead-lettering.
6. **Key Vault-rotatie, App Configuration, OpenTelemetry en KQL**.
7. **AKS-manifesten schrijven en end-to-end connectiviteit onderzoeken**.

De resterende labs 04–24 volgen vrijwel exact deze gaten. Alleen labs uitvoeren is niet voldoende: noteer per lab de SDK-objecten, configuratiekeuzes, foutbeelden en examenvuistregels.

## 1. Containeroplossingen ontwikkelen — 20–25%

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Images bouwen, opslaan, versioneren en beheren met ACR | ✅ | Alleen later herhalen met scenariovragen. |
| Images bouwen en uitvoeren met ACR Tasks | ✅ | Quick task tegenover blijvende task en triggers blijven oefenen. |
| Containers op App Service; omgevingsvariabelen en secrets | 🟡 | App settings, secret references en diagnose zelfstandig uitvoeren. |
| Container Apps implementeren; environment en revisions | ✅ | Praktisch herhalen: ingress, secrets, traffic weights en rollback. |
| KEDA-scaling in Container Apps | 🟡 | Scale-rule YAML/CLI, authenticatie en drempelberekening oefenen in lab 05. |
| AKS-apps implementeren en beheren met manifesten | ❌ | `Deployment`, `Service`, `ConfigMap`, `Secret`, probes, requests/limits en image pull configureren. Labs 06–07. |
| AKS/Container Apps diagnosticeren via logs, events en connectiviteit | 🟡 | Kubectl-diagnose is beschreven; end-to-end DNS, service, ingress en netwerkpad praktisch oefenen. Labs 04 en 08. |

## 2. AI-oplossingen met datadiensten — 25–30%

### Cosmos DB for NoSQL

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Verbinden en query's uitvoeren met SDK | ❌ | Python `CosmosClient`, credentials, database/container, CRUD, parameters, pagination en foutafhandeling. |
| Queryperformance en RUs optimaliseren met indexing en consistency | 🟡 | Indexen, partitions, de vijf consistency levels, session tokens en RU-gevolgen zijn beschreven; nog praktisch vergelijken in lab 11. |
| Embeddings opslaan/ophalen en vector similarity search | ✅ | Praktisch uitvoeren en query metrics beoordelen in labs 09–11. |
| Change feed processor implementeren | ❌ | Lease container, processor/worker, checkpoints, at-least-once verwerking en idempotentie. |

### Azure Database for PostgreSQL

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Verbinden en query's uitvoeren met SDK's | ❌ | Python-driver, parameterized SQL, transacties, fouten en authenticatie. |
| Schema's, tabellen en datatypes ontwerpen | ❌ | Primary/foreign keys, JSONB, vector-type en normalisatiekeuzes. |
| Indexstrategieën en pgvector-overhead optimaliseren | ❌ | Exact search tegenover HNSW/IVFFlat, indexparameters, `EXPLAIN ANALYZE`, recall/latency en buildkosten. |
| Compute, geheugen en opslag voor vectorworkloads | ❌ | SKU/compute, memory, IOPS/storage en effecten op indexbouw en queries. |
| Vector search, embeddings, RAG en metadatafilters | ❌ | SQL-operators/queries en een volledig PostgreSQL-RAG-pad. |
| Connecties optimaliseren | ❌ | Connection pooling, poolgrootte, timeouts, retries en teveel databaseconnecties voorkomen. |

Labs 12–14 zijn hiervoor essentieel.

### Azure Managed Redis

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Dataoperaties, caching, expiration en invalidation | ❌ | GET/SET, TTL/expiry, cache-aside, invalidatie, eviction en cache stampede. |
| Vectorindexering en similarity search | ❌ | Index/schema maken, vectoren schrijven, KNN-query, metadatafilters en keuze tegenover Cosmos/PostgreSQL. |

Labs 15–17 dekken dit. Pub/sub uit lab 16 is daarnaast nuttige praktijkkennis. Redis Streams, consumer groups, pending messages, acknowledgments en crash recovery zijn als aanvullende kennis beschreven.

## 3. Azure-services verbinden en gebruiken — 20–25%

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Service Bus queues verwerken; DLQ, messages, topics en subscriptions | 🟡 | Theorie is aanwezig; Python-SDK, peek-lock, complete/abandon/dead-letter, retries en subscription filters praktisch oefenen. Lab 18. |
| Event Grid-workflows; filters, custom events en retries | ❌ | Event schema, topic/subscription, advanced filters, delivery/retry en dead-letter destination. Lab 19. |
| Serverless API's met Functions; triggers en bindings | 🟡 | Concepten zijn aanwezig; HTTP-API en andere trigger/binding daadwerkelijk bouwen en testen. Lab 20. |
| Function Apps configureren en implementeren | ❌ | Projectstructuur, `host.json`, app settings, deployment, identity, logging en hostingkeuze. Lab 20. |

## 4. Beveiligen, bewaken en oplossen — 20–25%

| Officiële vaardigheid | Status | Wat ontbreekt nog? |
|---|---:|---|
| Secrets met Key Vault beveiligen, roteren en ophalen | 🟡 | Managed identity en basisconcept zijn aanwezig; SDK-retrieval, RBAC, secret versions, rotation en caching ontbreken. Lab 21. |
| Configuratie en secrets met App Configuration opslaan/ophalen | ❌ | Keys, labels, feature flags, Key Vault references, provider/SDK en refresh. Lab 22. |
| Distributed tracing met OpenTelemetry SDK's | ❌ | Traces, spans, context propagation, resource attributes, exporter en Application Insights-koppeling. Lab 23. |
| KQL voor logs en metrics | ❌ | `where`, `project`, `extend`, `summarize`, `bin`, `join`, tijdfilters en diagnosequeries. Lab 24. |

## Dwarsdoorsnijdende gaten

- **Python:** de studiegids noemt expliciet Python. We hebben veel conceptkennis, maar nog weinig concrete SDK-code.
- **Authenticatie:** per dienst oefenen met `DefaultAzureCredential`/managed identity en least privilege.
- **Foutafhandeling:** throttling, timeouts, retries, poison messages en idempotentie per dienst herkennen.
- **Kosten en performance:** meet per service de relevante eenheid: RU/s, SU, replica/partition, compute/memory, queue backlog en logvolume.
- **Servicekeuze:** Cosmos DB versus PostgreSQL/pgvector versus Managed Redis kunnen uitleggen aan de hand van duurzaamheid, latency, querymodel, filtering en operationele rol.

## Aanbevolen volgorde vanaf nu

1. Labs 04–08: containerdiagnose, KEDA en AKS-manifesten.
2. Labs 09–11: Cosmos SDK, consistency, vectorindex en change feed apart aanvullen.
3. Labs 12–14: PostgreSQL/pgvector vanaf de basis uitwerken.
4. Labs 15–17: Redis caching én vector search.
5. Labs 18–20: Service Bus, Event Grid en Functions met Python-code.
6. Labs 21–24: Key Vault, App Configuration, OpenTelemetry en KQL.
7. Daarna een proefexamen per domein, gevolgd door één volledig examen onder tijdsdruk.

## Controle na ieder lab

- Kan ik het architectuurdoel in één zin uitleggen?
- Kan ik de belangrijkste Python-SDK-objecten herkennen?
- Kan ik authenticatie en minimale RBAC-rechten kiezen?
- Kan ik de meest waarschijnlijke fout diagnosticeren?
- Kan ik uitleggen welke instelling performance en kosten beïnvloedt?
- Kan ik twee vergelijkbare Azure-diensten van elkaar onderscheiden?

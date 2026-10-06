# Azure Container Apps — AI tuning, probes en replicas

Bron in het cursusmateriaal: `PP2 adj.pptx`, slides 18, 19 en 28.

## Health probes

| Probe | Functie | Gevolg bij mislukken |
|---|---|---|
| Startup | Controleert of de applicatie en het model volledig zijn gestart. | Houdt liveness/readiness tegen tijdens de opstartfase. |
| Readiness | Controleert of de replica verkeer kan verwerken. | Replica ontvangt geen verkeer. |
| Liveness | Controleert of het proces nog leeft en reageert. | Container/replica wordt opnieuw gestart. |

### Belangrijke properties

- `initialDelaySeconds`: wachttijd na het starten voordat de probe begint. Geef een AI-model voldoende tijd om te laden.
- `periodSeconds`: tijd tussen probecontroles.
- `timeoutSeconds`: maximale wachttijd op één probeantwoord.
- `failureThreshold`: aantal opeenvolgende fouten voordat de probe definitief faalt.
- Voor langzaam ladende modellen gebruik je een ruime startup-configuratie. Laat liveness niet tijdens het laden al een restart veroorzaken.

### Zuivere probe-endpoints

- Gebruik een klein, snel en apart endpoint, bijvoorbeeld `/health/live` of `/health/ready`.
- Laat **liveness** alleen de eigen applicatie controleren. Een storing bij SQL, Redis of een externe API mag geen restart-loop van gezonde replicas veroorzaken.
- Voor het examen volgt de cursus de regel: maak probes niet afhankelijk van externe diensten.
- Praktijknuance: readiness kan soms een strikt noodzakelijke dependency controleren, maar dit moet bewust gebeuren om een kettingreactie bij een externe storing te voorkomen.
- Controleer bij fouten eerst pad, poort, protocol, timeout en werkelijke model-loadtijd.

## Voorbeeld

```yaml
probes:
  - type: Startup
    httpGet:
      path: /health/startup
      port: 8080
    initialDelaySeconds: 10
    periodSeconds: 5
    failureThreshold: 10

  - type: Readiness
    httpGet:
      path: /health/ready
      port: 8080
    periodSeconds: 5
    failureThreshold: 3

  - type: Liveness
    httpGet:
      path: /health/live
      port: 8080
    periodSeconds: 10
    failureThreshold: 3
```

De waarden zijn voorbeelden. Meet de echte opstart- en responstijd voordat je ze vastlegt.

## CPU, geheugen en replicas

- CPU en geheugen configureer je per **container**. Iedere replica van de revision krijgt dezelfde containerconfiguratie.
- **CPU throttling:** de container bereikt zijn CPU-limiet en wordt afgeremd. Verhoog eerst CPU per replica of verbeter de code/modeluitvoering.
- **OOM restart:** de container overschrijdt zijn geheugenlimiet en wordt beëindigd/herstart. Verhoog geheugen of onderzoek een geheugenlek.
- Los een per-replica bottleneck eerst op voordat je alleen meer replicas toevoegt.
- Daarna stel je `minReplicas`, `maxReplicas` en een passende schaalregel in.

## Kosten en schaalstrategie

- Eenvoudig denkmodel: `totale capaciteit/kosten ≈ resources per replica × aantal actieve replicas × draaitijd`.
- In het Consumption-plan rekent Azure met vCPU-seconden en GiB-seconden. Externe HTTP-requests kunnen ook meetellen.
- Scale-to-zero voorkomt compute-kosten wanneer geen replica draait, maar de eerste aanvraag kan een cold start krijgen.
- Synchrone AI-API: gebruik vaak minimaal één replica om cold starts en model-loadtijd te vermijden.
- Achtergrondworker: scale-to-zero past goed bij event-driven werk; schaal bijvoorbeeld op queue-lengte met KEDA.
- Kleinere replicas schalen fijner, maar kunnen eerder throttlen of OOM gaan en vaker op- en afschalen.

## Examensignalen

- Model heeft lange laadtijd en wordt steeds herstart → **startup probe ruimer instellen; liveness niet te vroeg laten ingrijpen**.
- Replica is gezond maar mag nog geen verkeer ontvangen → **readiness probe**.
- Proces hangt en moet automatisch herstellen → **liveness probe**.
- Externe database valt uit en alle containers starten steeds opnieuw → **dependency uit liveness verwijderen**.
- Hoge latency plus CPU throttling → **meer CPU per replica**, daarna schaalregels opnieuw beoordelen.
- `OOMKilled`/OOM-restarts → **meer geheugen per replica** of geheugenlek oplossen.
- Kosten te hoog tijdens inactiviteit → **minReplicas verlagen of scale-to-zero**, als cold starts acceptabel zijn.

## Bronnen

- https://learn.microsoft.com/en-us/azure/container-apps/health-probes
- https://learn.microsoft.com/en-us/azure/container-apps/troubleshoot-container-start-failures
- https://learn.microsoft.com/en-us/azure/container-apps/billing
- https://learn.microsoft.com/en-us/azure/container-apps/scale-app


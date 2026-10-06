# Examenplan AI-200

Gecontroleerd op 5 oktober 2026.

## Examenfeiten

- Vereiste score: minimaal 700 op een schaal van 1–1000. Dit is geen vast percentage van 70%.
- Examentijd: 120 minuten.
- Microsoft Learn is tijdens dit associate-examen beschikbaar, maar de timer loopt door.
- De officiële Practice Assessment is momenteel nog niet beschikbaar.

## Examendomeinen

1. Azure-containers ontwikkelen — 20–25%
2. AI-oplossingen met Azure-datadiensten ontwikkelen — 25–30%
3. Azure-services verbinden en gebruiken — 20–25%
4. Azure-oplossingen beveiligen, monitoren en oplossen — 20–25%

## Nodig om te slagen

- Rond de 24 GitHub-labs af.
- Doe indien beschikbaar ook de twee aanvullende labs uit het officiële lokale overzicht.
- Begrijp per lab waarom een service en configuratie worden gekozen.
- Kun belangrijke stappen opnieuw uitvoeren zonder de labtekst letterlijk te volgen.
- Kun fouten vinden via logs, events, connectiviteit en KQL.
- Beheers Python en relevante Azure-SDK's voldoende om code te lezen en aan te passen.
- Ken de verschillen tussen Cosmos DB, PostgreSQL met pgvector en Azure Managed Redis.
- Ken ACR, App Service, Container Apps, KEDA en AKS.
- Ken Service Bus, Event Grid, Azure Functions, Key Vault, App Configuration en OpenTelemetry.
- Maak na de labs de lokale MeasureUp-oefentoets en herstel aantoonbare zwakke onderwerpen.

Alle labs afronden is belangrijk, maar geeft op zichzelf geen garantie. Het examen toetst ook toepassing, servicekeuze en troubleshooting.

## Oefenvragen

- Microsoft heeft op 5 oktober 2026 nog geen officiële AI-200 Practice Assessment. De Exam Sandbox oefent alleen de interface en vraagtypen: https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/
- Twee gratis sets van 30 vragen, onafhankelijk van Microsoft:
  - https://thedatacommunity.org/2026/08/15/ai-200-practice-exam-1-30-questions/
  - https://thedatacommunity.org/2026/08/15/ai-200-practice-exam-2-30-questions/
- Grote gratis oefenbank met sets en timed mocks, onafhankelijk van Microsoft: https://ai200prep.com/
- Controleer twijfelachtige antwoorden altijd tegen de officiële skills outline en Microsoft Learn. Vermijd exam dumps; die kunnen fout, verouderd of ongeoorloofd zijn.
- Eigen aanpak: na ieder onderwerp 10 korte vragen maken; na alle labs een volledige oefentoets van 45–60 vragen onder tijdsdruk.

## Cosmos DB: inzetten voor het examen

- Herken de opbouw: account → database → container → item.
- Kies bij een exacte lookup voor een **point read met `id` en partition key**: snel en weinig RU.
- Bij hoge RU-kosten of trage queries: controleer partition key, indexing policy, queryvorm en consistency level.
- Kies een partition key met veel verschillende waarden, gelijkmatige belasting en aansluiting op veelgebruikte queries; vermijd een hot partition.
- Voor nieuwe of gewijzigde items verwerken: **change feed processor**.
- Voor embeddings en semantisch zoeken: **vector index + vector similarity search**.
- Oefen met de SDK: client maken, database/container selecteren, items lezen/schrijven en queries uitvoeren.
- Verwacht vooral scenariovragen: welke instelling of Cosmos DB-functie lost het genoemde probleem op?

## Verschil tussen de labbronnen

- GitHub-index: 24 labs, samen circa 11 uur en 30 minuten zuivere labtijd.
- Lokaal officieel overzicht: 26 labs, samen circa 12 uur en 35 minuten.
- Alleen in het lokale overzicht: local model-serving sidecar en Azure Durable Functions.

## Bronnen

- https://learn.microsoft.com/en-us/credentials/certifications/resources/study-guides/ai-200
- https://learn.microsoft.com/en-us/credentials/certifications/azure-ai-cloud-developer-associate/
- https://learn.microsoft.com/en-us/credentials/certifications/exam-scoring-reports
- https://learn.microsoft.com/en-us/credentials/support/exam-duration-exam-experience
- https://github.com/MakarandBhoir/AI-200-Labs

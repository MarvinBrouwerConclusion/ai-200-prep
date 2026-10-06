# Europese Microsoft-cloud en soevereiniteit

Gecontroleerd op 5 oktober 2026.

## Wat bestaat er al?

- Microsoft Ireland Operations Limited is een Ierse Microsoft-rechtspersoon en bezit volgens Microsoft alle Europese datacenterentiteiten.
- Sinds 26 juni 2025 vallen de Europese datacenteractiviteiten onder een bestuur dat uitsluitend uit Europese staatsburgers bestaat en onder Europees recht werkt.
- Dit is Europese governance binnen de Microsoft-groep. Het is geen onafhankelijk Europees bedrijf buiten de Amerikaanse Microsoft-groep.

## Microsofts soevereine varianten

### Sovereign Public Cloud

- Draait op de gewone, door Microsoft beheerde Europese Azure-infrastructuur.
- De EU Data Boundary houdt relevante klantdata binnen de EU/EFTA, afhankelijk van dienst en configuratie.
- Data Guardian laat alleen bevoegde Europese medewerkers externe beheertoegang goedkeuren en volgen. Sessies worden controleerbaar vastgelegd.
- Customer-managed keys, Managed HSM, confidential computing en External Key Management kunnen Microsofts toegang verder beperken.

### Sovereign Private Cloud

- Gebaseerd op Azure Local en eigen hardware.
- Kan lokaal, hybride of disconnected worden gebruikt.
- Geeft de klant meer controle over infrastructuur, identiteit, beheer en sleutels.

### National Partner Clouds

- Frankrijk: Bleu, een joint venture van Orange en Capgemini.
- Duitsland: Delos Cloud, een SAP-dochter.
- Deze omgevingen worden door Europese partners beheerd en zijn juridisch en operationeel sterker afgescheiden dan standaard Azure.

## Wat betekent dit voor de CLOUD Act?

- De CLOUD Act kijkt naar gegevens in de `possession, custody or control` van een aanbieder onder Amerikaanse rechtsmacht, ook wanneer die gegevens buiten de VS staan.
- Alleen een Nederlandse of Europese opslaglocatie verwijdert dit risico daarom niet automatisch.
- Een Europese Microsoft-dochter en Europees bestuur verminderen operationele en bestuurlijke risico's, maar verwijderen de Amerikaanse eigendoms- en zeggenschapsrelatie niet vanzelf.
- Microsoft zegt geen overheid directe of onbeperkte toegang te geven. Het controleert verzoeken, probeert ze naar de klant te verwijzen, vecht ze waar mogelijk aan en informeert de klant tenzij dit juridisch verboden is.
- De CLOUD Act maakt gerichte gegevensverstrekking na een geldige juridische vordering mogelijk; het is geen algemene permanente meekijktoegang.

## Praktische conclusie

Van minder naar meer soevereine controle:

1. Standaard Azure in een Europese regio
2. Sovereign Public Cloud met sterke data-, sleutel- en beheercontroles
3. Azure Local / Sovereign Private Cloud op eigen infrastructuur
4. Onafhankelijk beheerde National Partner Cloud of Europese cloudprovider

De juiste keuze hangt af van dataclassificatie, toegestane rechtsmacht, sleutelbeheer, operationele onafhankelijkheid en afhankelijkheid van Microsoft-technologie.

## Bronnen

- https://blogs.microsoft.com/on-the-issues/2025/04/30/european-digital-commitments/
- https://blogs.microsoft.com/blog/2025/06/16/announcing-comprehensive-sovereign-solutions-empowering-european-organizations/
- https://learn.microsoft.com/en-us/azure/azure-sovereign-clouds/public/data-guardian
- https://learn.microsoft.com/en-us/azure/cloud-adoption-framework/sovereignty/planning-readiness
- https://www.microsoft.com/en-us/corporate-responsibility/law-enforcement-requests-report
- https://www.edpb.europa.eu/sites/default/files/files/file2/edpb_edps_joint_response_us_cloudact_annex.pdf
- https://www.europarl.europa.eu/doceo/document/A-10-2025-0107_EN.html

# kubectl en AKS-diagnose

## Hoe Kubernetes YAML interpreteert

`apiVersion` bepaalt welk API-schema Kubernetes gebruikt. `kind` bepaalt welk type object moet worden gemaakt. `metadata` bevat de naam en labels. `spec` beschrijft de gewenste toestand.

```yaml
apiVersion: apps/v1
kind: Deployment
metadata:
  name: aks-api
spec:
  replicas: 3
```

De Kubernetes API-server valideert dit document en bewaart de gewenste toestand. Daarna probeert de controller die toestand voortdurend waar te maken. In dit voorbeeld zorgt de Deployment-controller dat drie pods blijven draaien. De kubelet op iedere node start en controleert de containers.

### Belangrijkste `kind`-waarden

| `kind` | Functie |
|---|---|
| `Pod` | Kleinste uitvoereenheid; bevat een of meer containers. |
| `Deployment` | Beheert stateless pods, replicas, rolling updates en rollbacks. |
| `ReplicaSet` | Houdt het gewenste aantal identieke pods actief; wordt meestal door een Deployment beheerd. |
| `StatefulSet` | Beheert pods met een vaste identiteit en vaak eigen permanente opslag. |
| `DaemonSet` | Draait normaal één pod op iedere geschikte node, bijvoorbeeld voor logging of monitoring. |
| `Job` | Voert eindig werk uit totdat dit succesvol is afgerond. |
| `CronJob` | Start Jobs volgens een tijdschema. |
| `Service` | Geeft geselecteerde pods een stabiel netwerkadres en verdeelt verkeer. |
| `Ingress` | Routeert HTTP/HTTPS-verkeer naar Services; vereist een ingresscontroller. |
| `NetworkPolicy` | Beperkt toegestaan netwerkverkeer tussen pods en netwerken. |
| `ConfigMap` | Bewaart niet-geheime configuratie. |
| `Secret` | Bewaart gevoelige waarden; aanvullende beveiliging en toegangscontrole blijven nodig. |
| `PersistentVolume` | Vertegenwoordigt beschikbare permanente opslag. |
| `PersistentVolumeClaim` | Vraagt permanente opslag aan voor een workload. |
| `StorageClass` | Beschrijft hoe dynamisch opslag moet worden aangemaakt. |
| `Namespace` | Deelt resources logisch op binnen een cluster. |
| `ServiceAccount` | Kubernetes-identiteit voor een workload. |
| `HorizontalPodAutoscaler` | Past het aantal replicas automatisch aan op basis van metrics. |
| `Role` / `ClusterRole` | Definieert Kubernetes-rechten binnen een namespace of clusterbreed. |
| `RoleBinding` / `ClusterRoleBinding` | Kent die rechten toe aan gebruikers, groepen of serviceaccounts. |
| `CustomResourceDefinition` | Voegt een eigen objecttype (`kind`) toe aan Kubernetes. |

Een normale web-API gebruikt vaak deze keten:

```text
Deployment -> ReplicaSet -> Pods
                         ^
Internet -> Load Balancer -> Service --selecteert pods via labels
```

`LoadBalancer`, `ClusterIP` en `NodePort` zijn geen kinds. Dit zijn waarden van `spec.type` binnen een object met `kind: Service`. Bekijk alle resources die een specifiek cluster ondersteunt met `kubectl api-resources`.

## Service, selectors en poorten

```yaml
apiVersion: v1
kind: Service
metadata:
  name: aks-api-service
spec:
  type: LoadBalancer
  selector:
    app: aks-api
    version: v1
  ports:
    - name: http
      port: 80
      targetPort: http
      protocol: TCP
  sessionAffinity: None
```

- `type: LoadBalancer` laat AKS een Azure Load Balancer en standaard een publiek IP maken.
- `selector` kiest uitsluitend pods die **alle** opgegeven labels hebben.
- `port: 80` is de poort van de Service.
- `targetPort: http` verwijst naar een benoemde containerpoort, bijvoorbeeld `name: http` met `containerPort: 8000`.
- De route wordt dan `publiek IP:80 -> Service:80 -> Pod:8000`.
- `sessionAffinity: None` bindt een client niet aan één pod. `ClientIP` kan dat wel doen.
- `metadata.labels` op de Service identificeren de Service zelf; ze selecteren geen pods.
- Voor een interne Azure Load Balancer gebruik je de annotatie `service.beta.kubernetes.io/azure-load-balancer-internal: "true"`. Een publieke load balancer is standaard.

## Image pull policy

`imagePullPolicy` bepaalt wanneer de kubelet een containerimage uit een registry zoals ACR probeert op te halen.

| Waarde | Gedrag | Typisch gebruik |
|---|---|---|
| `Always` | Controleert de registry bij iedere containerstart; bestaande lagen kunnen uit de lokale cache komen. | Ontwikkeling of een hergebruikte tag. |
| `IfNotPresent` | Pullt alleen als de image nog niet op de node staat. | Productie met een unieke versietag of digest. |
| `Never` | Pullt nooit; de image moet vooraf op iedere mogelijke node staan. | Gesloten of speciaal beheerde omgevingen. |

Standaard wordt `:latest` (of geen tag) gekoppeld aan `Always`. Een andere tag en een digest krijgen `IfNotPresent`. Deze default wordt bij het aanmaken van het object vastgelegd en verandert later niet automatisch.

Gebruik in productie bij voorkeur een unieke tag zoals `v1.2.0`, of een digest zoals `image@sha256:...`. `Always` maakt zelf geen nieuwe pods; de policy wordt toegepast wanneer een container start. Een rollout kan worden gestart met `kubectl rollout restart deployment <naam>`.

`imagePullPolicy` bepaalt **wanneer** Kubernetes pullt. ACR-authenticatie, bijvoorbeeld de rol `AcrPull` of een `imagePullSecret`, bepaalt **of** de pull is toegestaan. `ImagePullBackOff` wijst vaak op een fout imagepad/tag, ontbrekende image, registryverbinding of ontbrekende rechten.

## Liveness-, readiness- en startup-probes

- **Liveness probe:** leeft het proces nog? Na het ingestelde aantal opeenvolgende fouten herstart de kubelet de container.
- **Readiness probe:** kan de pod nu verkeer verwerken? Een mislukte probe haalt de pod uit de Service-endpoints, maar herstart hem niet.
- **Startup probe:** is een langzaam startende applicatie klaar met opstarten? Zolang deze probe nog niet is geslaagd, beginnen liveness en readiness niet.

```yaml
livenessProbe:
  httpGet:
    path: /healthz
    port: http
  initialDelaySeconds: 10
  periodSeconds: 30
  timeoutSeconds: 5
  failureThreshold: 3
```

De kubelet wacht eerst 10 seconden en voert daarna iedere 30 seconden een HTTP-check uit. De check mag maximaal 5 seconden duren. HTTP-status 200 tot en met 399 geldt als succes. Na drie opeenvolgende fouten herstart de kubelet de container; een succes zet de foutenteller terug. De responsebody is voor deze HTTP-probe niet bepalend.

Een liveness-endpoint moet vooral aantonen dat het eigen proces niet is vastgelopen. Maak het niet afhankelijk van een externe database, Redis of AI-service, want een storing daar zou anders gezonde containers laten herstarten.

## Basiscommando's

- `kubectl get pods -n <namespace>`: toont `READY`, `STATUS`, `RESTARTS` en `AGE`.
- `kubectl get pods -A`: toont pods in alle namespaces.
- `kubectl get pods -o wide -n <namespace>`: voegt onder meer node en pod-IP toe.
- `kubectl describe pod <pod> -n <namespace>`: toont containers, requests/limits, probes, huidige en vorige status, exitcode en events.
- `kubectl logs <pod> -n <namespace>`: actuele stdout/stderr.
- `kubectl logs <pod> -c <container> -n <namespace>`: logs van één container in een multi-containerpod.
- `kubectl logs <pod> --previous -n <namespace>`: logs van de vorige containerinstantie na een restart.
- `kubectl logs <pod> --follow -n <namespace>`: live logstream.
- `kubectl top pods -n <namespace>` en `kubectl top nodes`: huidig CPU- en geheugengebruik; Metrics Server moet beschikbaar zijn.
- `kubectl get events -n <namespace> --sort-by=.lastTimestamp`: recente events op tijd.

## Vaste diagnosevolgorde

1. `kubectl get pods`: welke pod is niet Ready, Pending of opnieuw gestart?
2. `kubectl describe pod`: bekijk State, Last State, Reason, Exit Code, probes en Events.
3. `kubectl logs` en bij restarts `--previous`: zoek applicatie- en startupfouten.
4. `kubectl top pods` en `top nodes`: controleer CPU- en geheugenverbruik.
5. Controleer daarna deployment, Service/endpoints, ingress, netwerk/DNS en dependencies als de pod zelf gezond lijkt.

## Key signals

- `READY 0/1`: readiness is niet geslaagd; de Service stuurt er normaal geen verkeer heen.
- `RESTARTS` loopt op: container crasht, overschrijdt geheugen of faalt een liveness/startup-probe.
- `CrashLoopBackOff`: container start, stopt en wordt met oplopende wachttijd opnieuw geprobeerd. Bekijk `describe` en `logs --previous`.
- `ImagePullBackOff` / `ErrImagePull`: fout image-/tagpad, registry-authenticatie, `AcrPull`, netwerk of ontbrekende image.
- `Pending`: vaak onvoldoende CPU/geheugen, schedulingregels, quota, node selector/taint of een niet-gebonden PVC. Bekijk `FailedScheduling` in Events.
- `OOMKilled`: container overschreed zijn memory limit; vaak exitcode 137. Exitcode 137 alleen bewijst geen OOM, dus controleer `Reason` en events.
- Hoge CPU dicht bij de limit plus trage probes/latency kan op CPU-throttling wijzen. Vergelijk `kubectl top` met requests/limits.
- `Evicted`: de hele pod is door kubelet verwijderd door node-pressure; dit verschilt van container-level `OOMKilled`.
- Veel 5xx/latency terwijl pods Ready zijn: onderzoek Service/endpoints, ingress, DNS, downstreamdependencies en applicatielogs.

## Requests, limits en kosten

- **Request:** hoeveelheid CPU/geheugen waarop de scheduler rekent bij plaatsing.
- **Limit:** bovengrens. CPU boven de limit wordt gethrottled; geheugen boven de limit kan `OOMKilled` veroorzaken.
- Let niet alleen op een momentopname: trend, pieken, p95/p99-latency, restarts en replica-aantal geven samen het echte beeld.

## Examenfocus

- Begin bij status en events; wijzig geen resources voordat de oorzaak is aangetoond.
- Voor een herstartende container zijn `kubectl describe pod` en `kubectl logs --previous` vaak de belangrijkste eerste stappen.
- Voor actuele resourcebelasting gebruik je `kubectl top`; voor historie, dashboards en alerts gebruik je Azure Monitor/Container Insights/Managed Prometheus.
- Kubernetes-events zijn tijdelijk; gebruik Container Insights/Log Analytics voor langere retentie.

## Bronnen

- https://kubernetes.io/docs/concepts/overview/working-with-objects/
- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_api-resources/
- https://kubernetes.io/docs/concepts/workloads/pods/pod-lifecycle/#container-probes
- https://kubernetes.io/docs/concepts/containers/images/
- https://kubernetes.io/docs/concepts/services-networking/service/
- https://learn.microsoft.com/en-us/azure/aks/internal-lb
- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/
- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/
- https://learn.microsoft.com/en-us/azure/aks/monitor-aks
- https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/availability-performance/troubleshoot-oomkilled-aks-clusters

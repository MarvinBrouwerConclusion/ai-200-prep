# kubectl en AKS-diagnose

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

- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_get/
- https://kubernetes.io/docs/reference/kubectl/generated/kubectl_describe/
- https://learn.microsoft.com/en-us/azure/aks/monitor-aks
- https://learn.microsoft.com/en-us/troubleshoot/azure/azure-kubernetes/availability-performance/troubleshoot-oomkilled-aks-clusters

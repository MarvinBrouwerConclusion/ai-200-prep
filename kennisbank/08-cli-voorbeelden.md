# Azure CLI-voorbeelden

ACR-resources zijn te automatiseren met Azure CLI, PowerShell, Bicep/ARM en Terraform.

## ACR Task maken

PowerShell:

```powershell
az acr task create `
  --registry myregistry `
  --name build-hello-world `
  --image hello-world:{{.Run.ID}} `
  --context https://github.com/Azure-Samples/acr-build-helloworld-node.git#main `
  --file Dockerfile `
  --commit-trigger-enabled false `
  --base-image-trigger-enabled false
```

Vervang `myregistry` door de naam van je ACR. De taak bouwt een image uit de Dockerfile in de GitHub-repository en gebruikt het run-ID als unieke tag.

Handmatig uitvoeren:

```powershell
az acr task run --registry myregistry --name build-hello-world
```

Runs en logs bekijken:

```powershell
az acr task list-runs --registry myregistry --output table
az acr task logs --registry myregistry --name build-hello-world
```

Bron: https://learn.microsoft.com/en-us/cli/azure/acr/task?view=azure-cli-latest

function Wait-HttpReady {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][string]$Url,
        [int]$Attempts = 40,
        [int]$DelaySec = 2,
        [int]$TimeoutSec = 10,
        [int]$ExpectedStatus = 200
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            $response = Invoke-WebRequest -Uri $Url -UseBasicParsing -TimeoutSec $TimeoutSec -ErrorAction Stop
            $status = [int]$response.StatusCode
            Write-Host ("{0}_attempt={1} status={2}" -f $Name, $attempt, $status)
            if ($status -eq $ExpectedStatus) {
                return [pscustomobject]@{ Ready = $true; Attempt = $attempt; StatusCode = $status }
            }
        }
        catch {
            Write-Host ("{0}_attempt={1} error={2}" -f $Name, $attempt, $_.Exception.Message)
        }

        if ($attempt -lt $Attempts) {
            Start-Sleep -Seconds $DelaySec
        }
    }

    return [pscustomobject]@{ Ready = $false; Attempt = $Attempts; StatusCode = 0 }
}

function Invoke-RestMethodWithRetry {
    param(
        [Parameter(Mandatory = $true)][string]$Name,
        [Parameter(Mandatory = $true)][ValidateSet('Get', 'Post', 'Put', 'Patch', 'Delete')][string]$Method,
        [Parameter(Mandatory = $true)][string]$Uri,
        [string]$ContentType,
        [string]$Body,
        [int]$Attempts = 20,
        [int]$DelaySec = 2,
        [int]$TimeoutSec = 20
    )

    for ($attempt = 1; $attempt -le $Attempts; $attempt++) {
        try {
            $params = @{
                Method      = $Method
                Uri         = $Uri
                TimeoutSec  = $TimeoutSec
                ErrorAction = 'Stop'
            }
            if ($ContentType) { $params.ContentType = $ContentType }
            if ($null -ne $Body) { $params.Body = $Body }

            $result = Invoke-RestMethod @params
            Write-Host ("{0}_attempt={1} status=ok" -f $Name, $attempt)
            return $result
        }
        catch {
            Write-Host ("{0}_attempt={1} error={2}" -f $Name, $attempt, $_.Exception.Message)
            if ($attempt -ge $Attempts) {
                throw
            }
            Start-Sleep -Seconds $DelaySec
        }
    }
}

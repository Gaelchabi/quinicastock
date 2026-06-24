[Net.ServicePointManager]::SecurityProtocol = [Net.SecurityProtocolType]::Tls12

# Test Register
Write-Host "=== Testing Register ===" -ForegroundColor Cyan
$req = [Net.HttpWebRequest]::Create('http://localhost:8080/auth/register')
$req.Method = 'POST'
$req.ContentType = 'application/json'
$req.ServicePoint.Expect100Continue = $false

$body = '{"email":"test@test.com","password":"test123"}'
$sw = New-Object System.IO.StreamWriter($req.GetRequestStream())
$sw.Write($body)
$sw.Close()

try {
    $resp = $req.GetResponse()
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $result = $sr.ReadToEnd()
    Write-Host "Status: OK" -ForegroundColor Green
    Write-Host "Response: $result" -ForegroundColor Green
} catch {
    Write-Host "Status: " + $_.Exception.Response.StatusCode -ForegroundColor Red
    Write-Host "Message: " + $_.Exception.Message -ForegroundColor Red
}

# Test Login
Write-Host ""
Write-Host "=== Testing Login ===" -ForegroundColor Cyan
$req = [Net.HttpWebRequest]::Create('http://localhost:8080/auth/login')
$req.Method = 'POST'
$req.ContentType = 'application/json'
$req.ServicePoint.Expect100Continue = $false

$body = '{"email":"test@test.com","password":"test123"}'
$sw = New-Object System.IO.StreamWriter($req.GetRequestStream())
$sw.Write($body)
$sw.Close()

try {
    $resp = $req.GetResponse()
    $sr = New-Object System.IO.StreamReader($resp.GetResponseStream())
    $result = $sr.ReadToEnd()
    Write-Host "Status: OK" -ForegroundColor Green
    Write-Host "Response: $result" -ForegroundColor Green
} catch {
    Write-Host "Status: " + $_.Exception.Response.StatusCode -ForegroundColor Red
    Write-Host "Message: " + $_.Exception.Message -ForegroundColor Red
}
